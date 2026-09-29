import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { synthesizeSpeechWithResilience, DEFAULT_QWEN_VOICE } from './tts-qwen';

// Supported premium Neural voices for Edge-TTS
export const AVAILABLE_VOICES = {
  'ezinne': 'en-NG-EzinneNeural',           // Warm, hospitable Nigerian female concierge (Ora)
  'abeo': 'en-NG-AbeoNeural',               // Distinguished Nigerian male concierge
  'aria': 'en-US-AriaNeural',               // Elegant, natural female
  'jenny': 'en-US-JennyNeural',             // Soft, warm, conversational female
  'christopher': 'en-US-ChristopherNeural', // Warm, calm, distinguished luxury tone
  'sonia': 'en-GB-SoniaNeural',             // Refined British female concierge
  'ryan': 'en-GB-RyanNeural'                // Polite British male concierge
};

export const DEFAULT_VOICE = 'en-NG-EzinneNeural';

/**
 * Clean text for natural speech synthesis
 */
export function sanitizeSpeechText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/[*_#`~>]/g, '')                // Remove markdown formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to plain text
    .replace(/https?:\/\/\S+/g, '')          // Strip raw URLs
    .replace(/₦/g, ' Naira ')                // Nigerian currency pronunciation
    .replace(/&/g, ' and ')                  // Spell out ampersand
    .replace(/[<>"']/g, '')                  // Remove raw XML chars
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Core synthesis function using Microsoft Edge Azure Neural voices
 */
export async function synthesizeSpeech(
  text: string,
  voice: string = DEFAULT_VOICE,
  options: { rate?: number | string; pitch?: string } = {}
): Promise<Buffer> {
  const cleanText = sanitizeSpeechText(text);
  if (!cleanText) {
    throw new Error('No readable text provided for speech synthesis');
  }

  const selectedVoice = (AVAILABLE_VOICES as any)[voice.toLowerCase()] || voice || DEFAULT_VOICE;

  let lastError: any = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      
      const prosodyOptions: any = {};
      if (options.rate) {
        prosodyOptions.rate = typeof options.rate === 'number' ? `${options.rate > 0 ? '+' : ''}${Math.round(options.rate * 100)}%` : options.rate;
      }
      if (options.pitch) {
        prosodyOptions.pitch = options.pitch;
      }

      const { audioStream } = await tts.toStream(
        cleanText,
        Object.keys(prosodyOptions).length > 0 ? prosodyOptions : undefined
      );

      return await new Promise<Buffer>((resolve, reject) => {
        let finished = false;
        const chunks: Buffer[] = [];
        audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));

        const complete = () => {
          if (finished) return;
          finished = true;
          if (chunks.length > 0) {
            resolve(Buffer.concat(chunks));
          } else {
            reject(new Error('Audio stream closed without data'));
          }
        };

        audioStream.on('end', complete);
        audioStream.on('close', complete);
        audioStream.on('error', (err) => {
          if (finished) return;
          if (chunks.length > 0) {
            finished = true;
            resolve(Buffer.concat(chunks));
          } else {
            finished = true;
            reject(err);
          }
        });
      });
    } catch (e: any) {
      lastError = e;
      await new Promise(r => setTimeout(r, 250));
    }
  }

  throw lastError || new Error('Speech synthesis failed after retries');
}

/**
 * Unified synthesis handler supporting both Qwen3-TTS (via HF Spaces) and Edge-TTS
 */
export async function synthesizeUnifiedAudio(
  text: string,
  options: {
    engine?: 'qwen' | 'edge' | 'auto';
    voice?: string;
    language?: string;
    rate?: number | string;
    pitch?: string;
  } = {}
): Promise<{ buffer: Buffer; contentType: string; engineUsed: string }> {
  const isNigerianVoice = options.voice && (
    options.voice.toLowerCase().includes('ezinne') ||
    options.voice.toLowerCase().includes('abeo') ||
    options.voice.toLowerCase().includes('en-ng')
  );

  const engine = (options.engine || (isNigerianVoice ? 'edge' : 'qwen')).toLowerCase();

  // If engine is 'edge' or a Nigerian voice is requested, use Edge-TTS with Microsoft Neural Ezinne/Abeo
  if (engine === 'edge' || isNigerianVoice) {
    const buffer = await synthesizeSpeech(text, options.voice || DEFAULT_VOICE, options);
    return {
      buffer,
      contentType: 'audio/mpeg',
      engineUsed: 'edge-tts-ezinne'
    };
  }

  // Default: Use Qwen3-TTS with automatic resilient fallback to Edge-TTS
  const voice = options.voice || DEFAULT_QWEN_VOICE;
  const res = await synthesizeSpeechWithResilience(text, voice, options.language);
  return {
    buffer: res.buffer,
    contentType: res.contentType,
    engineUsed: res.engine
  };
}

/**
 * Standard Vercel Serverless / Express handler
 */
export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const text = body?.text || req.query?.text;
    const voice = body?.voice || req.query?.voice;
    const engine = body?.engine || req.query?.engine || 'qwen';
    const language = body?.language || req.query?.language || 'English / 英文';

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text parameter is required for TTS synthesis' });
      return;
    }

    const result = await synthesizeUnifiedAudio(text, {
      engine,
      voice,
      language
    });

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Length', result.buffer.length);
    res.setHeader('X-TTS-Engine', result.engineUsed);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 24h
    res.status(200).send(result.buffer);
  } catch (error: any) {
    console.error('TTS synthesis error:', error);
    try {
      if (res.status && typeof res.status === 'function') {
        res.status(500);
        if (res.json && typeof res.json === 'function') {
          res.json({ error: error?.message || 'Speech synthesis failed' });
        } else if (res.send && typeof res.send === 'function') {
          res.send(JSON.stringify({ error: error?.message || 'Speech synthesis failed' }));
        } else {
          res.end(JSON.stringify({ error: error?.message || 'Speech synthesis failed' }));
        }
      } else {
        res.end?.();
      }
    } catch (e) {
      console.error('Failed to send error response:', e);
    }
  }
}

/**
 * Web Standard Request/Response for Vercel Edge Runtime (POST /api/tts)
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const text = data?.text;
    const voice = data?.voice;
    const engine = data?.engine || 'qwen';
    const language = data?.language || 'English / 英文';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await synthesizeUnifiedAudio(text, {
      engine,
      voice,
      language
    });

    return new Response(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Content-Length': result.buffer.length.toString(),
        'X-TTS-Engine': result.engineUsed,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Synthesis failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
