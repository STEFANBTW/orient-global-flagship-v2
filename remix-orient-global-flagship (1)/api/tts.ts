import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Supported premium Neural voices
export const AVAILABLE_VOICES = {
  'christopher': 'en-US-ChristopherNeural', // Warm, calm, distinguished luxury tone
  'aria': 'en-US-AriaNeural',               // Elegant, natural female
  'jenny': 'en-US-JennyNeural',             // Soft, warm, conversational female
  'sonia': 'en-GB-SoniaNeural',             // Refined British female concierge
  'ryan': 'en-GB-RyanNeural'                // Polite British male concierge
};

export const DEFAULT_VOICE = 'en-US-ChristopherNeural';

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

  const tts = new MsEdgeTTS();
  const selectedVoice = (AVAILABLE_VOICES as any)[voice.toLowerCase()] || voice || DEFAULT_VOICE;

  await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  
  const { audioStream } = await tts.toStream(cleanText, {
    rate: options.rate ? (typeof options.rate === 'number' ? `${options.rate > 0 ? '+' : ''}${Math.round(options.rate * 100)}%` : options.rate) : undefined,
    pitch: options.pitch
  });

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    audioStream.on('close', () => resolve(Buffer.concat(chunks)));
    audioStream.on('end', () => resolve(Buffer.concat(chunks)));
    audioStream.on('error', (err) => reject(err));
  });
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
    const voice = body?.voice || req.query?.voice || DEFAULT_VOICE;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text parameter is required for TTS synthesis' });
      return;
    }

    const audioBuffer = await synthesizeSpeech(text, voice);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 24h
    res.status(200).send(audioBuffer);
  } catch (error: any) {
    console.error('Edge-TTS synthesis error:', error);
    res.status(500).json({
      error: error?.message || 'Speech synthesis failed'
    });
  }
}

/**
 * Web Standard Request/Response for Vercel Edge Runtime (POST /api/tts)
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const text = data?.text;
    const voice = data?.voice || DEFAULT_VOICE;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const audioBuffer = await synthesizeSpeech(text, voice);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
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
