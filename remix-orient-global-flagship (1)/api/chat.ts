import { GoogleGenAI, Type } from '@google/genai';

// Navigation Tool Declaration for Orient Global
const navigateToSectionTool = {
  name: 'navigateToSection',
  description: 'Scroll the visitor to a specific section of the Orient Global website based on their request.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectionId: {
        type: Type.STRING,
        description: 'The ID of the section to navigate to. Valid options: hero, services, bakery, market, restaurant, dining, lounge, games, water, location.',
      },
    },
    required: ['sectionId'],
  },
};

const ORIENT_BRAND_SYSTEM_INSTRUCTION = `You are AURA, the Orient Luxury Concierge for Orient Global Flagship in Jos, Plateau State, Nigeria.
Orient Global is a premier multi-division lifestyle and fine dining destination located at Amada Plaza, Rayfield, Jos.

Our Flagship Divisions include:
1. Orient Artisanal Bakery - Heritage wild sourdough, Parisian croissants, brioche, and bespoke pastry crafts.
2. Orient Supermarket - Premium grocery, organic highland produce, imported goods, and gourmet pantry essentials.
3. Orient Fine Dining Restaurant - Fine artisanal Nigerian gastronomy, woodfire charcoal grills, heritage swallows, and sommelier cellar pairings.
4. Orient Gaming & Esports Arena - High-performance next-gen simulation rigs, VR stations, and competitive tournaments.
5. Orient Atmospheric Water & Wellness - Ultra-pure spring water purification and premium hydration lifestyle.
6. Orient Luxury Lounge & VIP Cellar - Private sommelier cellar, botanical infusions, vintage reserve, and executive networking.

Location: Amada Plaza, Rayfield, Jos, Plateau State, Nigeria.
Opening Hours: Open Daily, 8:00 AM - 11:00 PM.

Guidelines:
- Your primary goal is to assist visitors with sophistication, warmth, and accuracy.
- If a guest asks to visit, view, or explore any division or section (such as bakery, market, restaurant, dining, games, water, lounge, location, services, hero), you MUST invoke the navigateToSection tool with the matching sectionId.
- If they ask general questions, answer them as a helpful luxury concierge.
- Keep responses concise, elite, and polite.
- You can analyze images if the user provides them.`;

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please set it in Vercel environment variables or .env file.'
    });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        // Fallback to raw body
      }
    }

    const { message, images = [], history = [] } = body || {};

    if (!message && (!images || images.length === 0)) {
      res.status(400).json({ error: 'Message or images are required' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build contents array
    const parts: any[] = [];
    if (message) {
      parts.push({ text: message });
    }

    if (Array.isArray(images)) {
      for (const imgBase64 of images) {
        if (typeof imgBase64 === 'string' && imgBase64.includes(',')) {
          const mimeMatch = imgBase64.match(/^data:([^;]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const data = imgBase64.split(',')[1];
          parts.push({
            inlineData: {
              mimeType,
              data
            }
          });
        }
      }
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: ORIENT_BRAND_SYSTEM_INSTRUCTION,
        tools: [{
          functionDeclarations: [navigateToSectionTool]
        }],
      }
    });

    const responseText = response.text || '';
    const functionCalls = response.functionCalls || [];

    res.status(200).json({
      text: responseText,
      functionCalls,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process chat with Gemini API'
    });
  }
}
