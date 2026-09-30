import { Client } from '@gradio/client';
import { synthesizeSpeech as synthesizeEdgeFallback, sanitizeSpeechText } from './tts';

// Friendly voice name mappings for Qwen3-TTS
export const QWEN_VOICES: Record<string, string> = {
  'ryan': 'Ryan / 甜茶',
  'jennifer': 'Jennifer / 詹妮弗',
  'cherry': 'Cherry / 芊悦',
  'serena': 'Serena / 苏瑶',
  'ethan': 'Ethan / 晨煦',
  'chelsie': 'Chelsie / 千雪',
  'momo': 'Momo / 茉兔',
  'vivian': 'Vivian / 十三',
  'moon': 'Moon / 月白',
  'maia': 'Maia / 四月',
  'kai': 'Kai / 凯',
  'bella': 'Bella / 萌宝',
  'katerina': 'Katerina / 卡捷琳娜',
  'aiden': 'Aiden / 艾登'
};

export const DEFAULT_QWEN_VOICE = 'Jennifer / 詹妮弗';
const HF_SPACE_ID = 'Qwen/Qwen3-TTS-Demo';

/**
 * Master Persona & Instruction Prompt for Qwen Models (Qwen-Audio, Qwen-Omni, Qwen LLM)
 * Persona: Warm, hospitable, calm, and receptive Nigerian woman with proactive agency.
 */
export const QWEN_NIGERIAN_CONCIERGE_PROMPT = `You are ORA, the Orient Luxury AI Concierge for Orient Global Flagship in Jos, Plateau State, Nigeria.
You speak with the voice and soul of a warm, hospitable, and poised Nigerian woman who embodies the gold standard of African luxury hospitality. You are deeply calm, receptive, respectful, and proactive—always attentive, ready to provide enticing alternatives, give intuitive directions, or perform actions on behalf of the visitor.

---
VOCAL TONE & PERSONA:
1. WARMTH & HOSPITALITY:
   - Your speech is gentle, melodic, and reassuring, carrying the genuine warmth of Nigerian hospitality.
   - Welcome visitors gracefully: "You are most welcome to Orient Flagship", "It is my absolute pleasure to assist you", "Please relax, allow me to take care of that for you."
2. CALM & RECEPTIVE LISTENING:
   - Your pacing is unhurried, measured, and soothing.
   - Listen attentively; acknowledge the visitor's desires before responding, making them feel valued and heard.
3. PROACTIVE AGENCY (ACTIONS & DIRECTIONS):
   - You never wait passively. You anticipate needs, offer clear directions, and proactively execute tasks (preparing orders, calculating totals in ₦, confirming with the guest, and sending orders to the kitchen).
   - When discussing flagship divisions (Restaurant, Bakery, Supermarket, Lounge, Esports Arena, Atmospheric Water), offer to guide or navigate them directly to that section.
4. THOUGHTFUL ALTERNATIVES:
   - If a requested item or dish is unavailable, never offer a blunt refusal. Graciously acknowledge their taste and immediately present 1–2 of our finest flagship alternatives with appetizing descriptions.

---
FLAGSHIP DESTINATIONS (Jos, Plateau State):
- Orient Fine Dining Restaurant (Heritage Nigerian gastronomy & charcoal grills)
- Orient Artisanal Bakery (48-hour sourdough & Parisian pastries)
- Orient Supermarket (Highland organic produce & pantry staples)
- Orient Gaming & Esports Arena (Simulation rigs & tournament lounges)
- Orient Atmospheric Water & Wellness (Ultra-pure 7-stage molecular water)
- Orient Luxury Lounge & VIP Cellar (Private sommelier reserves)

Speak with poise, dignity, warmth, and proactive elegance at all times.`;

// In-memory client promise cache to prevent reconnecting on every request
let qwenClientPromise: Promise<any> | null = null;

export async function getQwenClient() {
  if (!qwenClientPromise) {
    qwenClientPromise = Client.connect(HF_SPACE_ID).catch((err) => {
      qwenClientPromise = null;
      throw err;
    });
  }
  return qwenClientPromise;
}

/**
 * Synthesizes audio using Qwen3-TTS hosted on Hugging Face Spaces via @gradio/client
 */
export async function synthesizeQwenSpeech(
  text: string,
  voice: string = DEFAULT_QWEN_VOICE,
  language: string = 'English / 英文',
  timeoutMs: number = 15000
): Promise<{ buffer: Buffer; contentType: string; url: string }> {
  const cleanText = sanitizeSpeechText(text);
  if (!cleanText) {
    throw new Error('No readable text provided for speech synthesis');
  }

  // Resolve voice
  const vLower = voice.trim().toLowerCase();
  const selectedVoice = QWEN_VOICES[vLower] || (Object.values(QWEN_VOICES).includes(voice) ? voice : DEFAULT_QWEN_VOICE);

  const app = await getQwenClient();

  // Run predict with timeout
  const result: any = await Promise.race([
    app.predict('/tts_interface', [cleanText, selectedVoice, language]),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Qwen3-TTS timed out after ${timeoutMs}ms`)), timeoutMs))
  ]);

  const audioItem = result?.data?.[0];
  const audioUrl = audioItem?.url;

  if (!audioUrl) {
    throw new Error('No audio URL returned by Qwen3-TTS space');
  }

  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) {
    throw new Error(`Failed to download audio from Gradio URL: ${audioRes.statusText}`);
  }

  const arrayBuffer = await audioRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    buffer,
    contentType: 'audio/wav',
    url: audioUrl
  };
}

/**
 * Synthesize with resilient fallback to Edge-TTS if Hugging Face Space is offline/sleeping
 */
export async function synthesizeSpeechWithResilience(
  text: string,
  voice: string = DEFAULT_QWEN_VOICE,
  language: string = 'English / 英文'
): Promise<{ buffer: Buffer; contentType: string; engine: string }> {
  try {
    const qwen = await synthesizeQwenSpeech(text, voice, language);
    return {
      buffer: qwen.buffer,
      contentType: qwen.contentType,
      engine: 'qwen3-tts'
    };
  } catch (err: any) {
    console.warn(`[Qwen3-TTS] Gradio synthesis failed (${err.message}). Falling back to Edge-TTS...`);
    // Clear cached client in case connection broke
    qwenClientPromise = null;
    const fallbackBuffer = await synthesizeEdgeFallback(text, 'en-US-AriaNeural');
    return {
      buffer: fallbackBuffer,
      contentType: 'audio/mpeg',
      engine: 'edge-tts-fallback'
    };
  }
}

/**
 * Standard Express / Vercel Serverless handler
 */
export default async function handler(req: any, res: any) {
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
    const voice = body?.voice || req.query?.voice || DEFAULT_QWEN_VOICE;
    const language = body?.language || req.query?.language || 'English / 英文';

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text parameter is required for TTS synthesis' });
      return;
    }

    const { buffer, contentType, engine } = await synthesizeSpeechWithResilience(text, voice, language);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('X-TTS-Engine', engine);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(buffer);
  } catch (error: any) {
    console.error('Qwen3-TTS handler error:', error);
    res.status(500).json({ error: error?.message || 'Qwen TTS synthesis failed' });
  }
}

/**
 * Web Standard Request/Response for Edge Runtime (POST /api/tts-qwen)
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const text = data?.text;
    const voice = data?.voice || DEFAULT_QWEN_VOICE;
    const language = data?.language || 'English / 英文';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { buffer, contentType, engine } = await synthesizeSpeechWithResilience(text, voice, language);

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'X-TTS-Engine': engine,
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
