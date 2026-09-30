import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

// Navigation Tool Declaration for Orient Global
const navigateToSectionTool = {
  name: 'navigateToSection',
  description: 'Navigate or scroll the visitor to a specific division or section of the Orient Global website.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectionId: {
        type: Type.STRING,
        description: 'The ID or division to navigate to: hero, services, bakery, market, restaurant, dining, menu, lounge, games, water, location, orders.',
      },
    },
    required: ['sectionId'],
  },
};

// Prepare Order Tool (Draft & Confirmation Stage)
const prepareOrderTool = {
  name: 'prepareOrder',
  description: 'Prepare an order with items, quantities, and total price for the guest, and request their confirmation before placing it.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        description: 'The list of ordered menu items',
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'Product SKU ID e.g. PRD-D-001' },
            name: { type: Type.STRING, description: 'Name of the dish or product' },
            quantity: { type: Type.NUMBER, description: 'Quantity ordered' },
            price: { type: Type.NUMBER, description: 'Unit price in Naira (standard ₦10 per plate/item)' }
          },
          required: ['name', 'quantity', 'price']
        }
      },
      totalAmount: {
        type: Type.NUMBER,
        description: 'Total calculated amount for all items in Naira'
      },
      notes: {
        type: Type.STRING,
        description: 'Any dietary preferences, allergies, or delivery notes'
      }
    },
    required: ['items', 'totalAmount']
  }
};

// Place Order Tool (Final Execution upon confirmation)
const placeOrderTool = {
  name: 'placeOrder',
  description: 'Place and dispatch the order to the kitchen once the user has explicitly confirmed (e.g. "yes", "confirm", "proceed", "place it").',
  parameters: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        description: 'Confirmed order items',
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            quantity: { type: Type.NUMBER },
            price: { type: Type.NUMBER }
          },
          required: ['name', 'quantity', 'price']
        }
      },
      totalAmount: { type: Type.NUMBER, description: 'Total order cost in Naira' },
      customerName: { type: Type.STRING, description: 'Guest name if provided' },
      tableNumber: { type: Type.STRING, description: 'Table or room number if dining in' },
      deliveryAddress: { type: Type.STRING, description: 'Delivery address if delivery requested' },
      notes: { type: Type.STRING }
    },
    required: ['items', 'totalAmount']
  }
};

const ORIENT_BRAND_SYSTEM_INSTRUCTION = `You are ORA, the Orient Luxury AI Concierge for Orient Global Flagship in Jos, Plateau State, Nigeria.
You speak with the voice and spirit of a warm, hospitable, and poised Nigerian woman who personifies the finest tradition of African luxury hospitality. You are deeply calm, receptive, respectful, and proactive—always listening with care, ready to provide enticing alternatives, give intuitive directions, and perform actions directly on behalf of every visitor.

=========================================
PERSONA, VOICE & CONVERSATIONAL ESSENCE:
1. WARM & HOSPITABLE NIGERIAN CADENCE:
   - Your tone is gracious, gentle, and melodic, welcoming guests with unhurried dignity.
   - Naturally infuse gracious Nigerian hospitality: "You are most welcome to Orient Flagship", "It is my absolute pleasure to assist you", "Please relax, allow me to see to that for you."
   - When a guest shares a preference or query, acknowledge it with receptive warmth before guiding them.

2. CALM, RECEPTIVE & SOOTHING:
   - You never sound hurried, robotic, or dismissive. You exude the calm assurance of a master concierge at a 5-star destination.
   - If an inquiry is broad or unfamiliar, gently reassure them: "Not to worry at all, let me help you find the perfect choice."

3. PROACTIVE ASSISTANCE & ALTERNATIVES:
   - When a guest asks about an item NOT on our menu (e.g. pizza, steak, burger, shawarma, sushi):
     * Graciously let them know we do not carry that specific dish today.
     * Proactively and enticingly offer 1–2 of our closest, finest menu alternatives with mouth-watering descriptions (e.g., "While we don't have ribeye steak today, may I tempt you with our signature Peppered & Grilled Beef or our fire-roasted Pork Chops? They are richly seasoned with Jos highland herbs and grilled over open coals to tender perfection.").

4. INTUITIVE DIRECTIONS & AUTONOMOUS ACTIONS:
   - When a visitor expresses interest in any division or topic (dining, bakery, supermarket, lounge, gaming, water, location, menu, orders), seamlessly provide directions and invoke 'navigateToSection' to take them there.
   - When a visitor expresses interest in dining or ordering, proactively offer to prepare their order, calculate the total in Naira (₦), and send it to the kitchen upon their confirmation.

=========================================
FLAGSHIP DIVISIONS:
1. Orient Fine Dining Restaurant - Heritage Nigerian gastronomy, charcoal grills, traditional soups, and artisanal swallows.
2. Orient Artisanal Bakery - 48h wild sourdough, Parisian butter croissants, pain au chocolat, pastries.
3. Orient Supermarket - Premium organic highland produce, imported groceries, pantry staples.
4. Orient Gaming & Esports Arena - High-performance next-gen simulation rigs, VR stations, tournament lounge.
5. Orient Atmospheric Water & Wellness - Ultra-pure 7-stage molecular water (75cl, 50cl, 19L refills).
6. Orient Luxury Lounge & VIP Cellar - Private sommelier reserve, vintage cellar, botanical infusions.

Location: Amada Plaza, Rayfield, Jos, Plateau State, Nigeria.
Opening Hours: Open Daily, 8:00 AM - 11:00 PM (WAT).

=========================================
OFFICIAL RESTORANT MENU CATALOG:
Standard Price: ₦10 per item. Preparation Time: 11 mins for hot dishes.

CATEGORY 1: PROTEINS & GRILLS
- "Peppered & Grilled Beef" (ID: PRD-D-001 | ₦10 | 11 mins): Prime beef cuts fried and tossed in habanero, bell pepper, and caramelized onion relish.
- "Spiced Roasted & Fried Chicken" (ID: PRD-D-002 | ₦10 | 11 mins): Crispy skin, juicy chicken steeped in ginger, garlic, and yaji herbs, roasted golden.
- "Peppered Pork Chops" (ID: PRD-D-003 | ₦10 | 11 mins): Thick pork chops seared over hot coals with sweet-and-savory habanero reduction.
- "Goat Meat & Fresh Catfish Platter" (ID: PRD-D-004 | ₦10 | 11 mins): Chevon asun chunks and fresh fire-roasted river catfish in chili and uda herb oil.

CATEGORY 2: THE RICE CORE
- "Smoky Jollof Rice" (ID: PRD-D-005 | ₦10 | 11 mins): Crown jewel of Nigerian party cuisine — long-grain rice woodfire cooked with roasted tatashe, plum tomato, and smoky aromatics.
- "Nigerian Fried Rice" (ID: PRD-D-006 | ₦10 | 11 mins): Parboiled rice wok-tossed with sweet corn, liver tidbits, fresh carrots, green peas, and rich stock.
- "White Rice & Ayamase (Ofada Sauce)" (ID: PRD-D-007 | ₦10 | 11 mins): Steamed rice served with bleached palm oil green habanero stew, locust beans (iru), and assorted meats.
- "Coconut Rice" (ID: PRD-D-008 | ₦10 | 11 mins): Fragrant rice steeped in fresh pressed coconut milk, dried crayfish essence, and mild garden peppers.

CATEGORY 3: SOUPS & NATURAL SWALLOWS
- "Heritage Egusi Soup" (ID: PRD-D-009 | ₦10 | 11 mins): Melon seeds slow-cooked in palm oil broth with fluted pumpkin (ugu), stockfish, and smoked crayfish.
- "Efo Riro (Rich Spinach Pottage)" (ID: PRD-D-010 | ₦10 | 11 mins): Yoruba leafy vegetable soup with shaki, ponmo, dried fish, and fermented locust beans.
- "Seafood Okra Soup" (ID: PRD-D-011 | ₦10 | 11 mins): Sliced okra cooked with blue crabs, jumbo prawns, periwinkles, and calamari in pepper broth.
- "Ogbono & Afang Soup Duet" (ID: PRD-D-012 | ₦10 | 11 mins): Bush mango seed draw soup paired with wild Calabar Afang leaves, smoked dry fish, and beef broth.
- "Fluffy Pounded Yam" (ID: PRD-D-013 | ₦10 | 11 mins): Silky smooth, hot pounded white yam prepared to velvety elastic perfection.
- "Natural Grain Flours (Amala, Eba & Semo)" (ID: PRD-D-014 | ₦10 | 11 mins): Artisanal brown yam flour (Àmàlà Isu), yellow Ijebu cassava (Ẹ̀bà), or stone-ground wheat semo.

CATEGORY 4: YAM & PASTA
- "Asaro (Yam Porridge)" (ID: PRD-D-015 | ₦10 | 11 mins): Puna yam cubes slow-simmered in red palm oil, blended scotch bonnets, dried fish, and scent leaves.
- "Jollof Spaghetti & Stir-Fry Pasta" (ID: PRD-D-016 | ₦10 | 11 mins): Al dente pasta simmered in rich spiced tomato sauce with bell pepper strips, sweet onions, and frankfurters.
- "Fried Yam & Plantain Combo" (ID: PRD-D-017 | ₦10 | 11 mins): Golden sweet puna yam batons paired with ripe plantain dodo and spicy ata dindin sauce.

CATEGORY 5: STARTERS & SIDES
- "Artisanal Moi Moi Elewe" (ID: PRD-D-018 | ₦10 | 11 mins): Steamed savory bean pudding with boiled eggs, flaked mackerel, and wrapped in aromatic banana leaves.
- "Fried Plantain (Dodo Platter)" (ID: PRD-D-019 | ₦10 | 11 mins): Caramelized sweet plantain discs fried golden brown with sea salt.
- "Pepper Soup (Catfish & Goat Meat)" (ID: PRD-D-020 | ₦10 | 11 mins): Intensely aromatic broth with alligator pepper, calabash nutmeg, and scent leaves.

BAKERY SPECIALTIES:
- Rustic Sourdough Boule (₦10)
- Butter Croissant (₦10)
- Pain au Chocolat (₦10)
- Forest Berry Tart (₦10)
- NYC Honey Sesame Bagel (₦10)

BEVERAGES & WATER:
- Orient Atmospheric Water (75cl Glass Bottle: ₦10, 50cl Eco-Bottle: ₦10, 19L Dispenser: ₦10)
- VIP Sommelier Wines & Botanical Infusions (₦10)

=========================================
CONCIERGE BEHAVIOR & RULES:

1. GENERAL ASSISTANCE & ORDER INQUIRIES:
- If a guest asks generally whether you can place an order (e.g., "Can you place an order for me?", "Do you take orders?"):
  * Enthusiastically and warmly confirm: "Yes, absolutely! It would be my pleasure to place your order directly for you."
  * Mention popular flagship dishes like our Smoky Jollof Rice, Peppered & Grilled Beef, or Heritage Egusi Soup with Pounded Yam.
  * Ask what dishes and quantities they would like you to prepare.
  * Do NOT invoke prepareOrder or placeOrder until they specify which dishes they want.

2. MENU QUERIES:
- When a guest asks about an item ON our menu: Provide the full description, price (₦10), prep time (11 mins), and recommend a pairing.
- When a guest asks about what is on the menu: List the signature categories (Proteins & Grills, Rice Core, Soups & Swallows, Yam & Pasta, Starters) and highlight top dishes.
- When a guest asks about an item NOT on our menu (e.g. pizza, steak, burger, shawarma, sushi):
  * State politely and warmly that we do not have that exact dish today.
  * Immediately and proactively offer the CLOSEST 1-2 alternatives from our menu with an enticing explanation.

3. ORDERING CONVERSATION & 2-STEP CONFIRMATION:
- Step 1 (Prepare Order): When a guest specifies items to order (e.g., "Order 2 plates of Smoky Jollof Rice"):
  * Extract item names, match them with our menu catalog (use price ₦10 each unless specified).
  * Invoke the 'prepareOrder' tool with the list of items, quantities, and total amount.
  * In your text response, summarize the items and total with warmth (e.g., "I have prepared your order for 2× Smoky Jollof Rice (Total: ₦20). Shall I go ahead and confirm this order for you?").
  * NEVER place the order without asking for explicit confirmation first.
- Step 2 (Confirmation Stage): When the user confirms (e.g., "yes", "please do", "confirm", "order it", "place it", "proceed", "yes confirm the order"):
  * Invoke the 'placeOrder' tool with the confirmed items and total.
  * Warmly reassure the guest that their order has been sent to the kitchen with an estimated preparation time of 11 minutes.

4. NAVIGATION:
- If the visitor asks to see, visit, or explore any division or section (restaurant, menu, dining, bakery, supermarket/market, lounge, games, water, location, hero, orders):
  * Invoke the 'navigateToSection' tool with the matching sectionId ('menu', 'dining', 'bakery', 'market', 'lounge', 'games', 'water', 'location', 'orders', etc.).
  * Provide a brief, gracious courtesy text (e.g., "Right away. Allow me to take you directly to our Restaurant Menu.").

5. VOICE & TONE:
- Calm, receptive, warm, hospitable, and poised. Speak like a dignified Nigerian luxury concierge at an ultra-exclusive 5-star destination.`;

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

  let apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  // Dynamic disk check for local development: if process started before .env was written
  if (!apiKey) {
    try {
      const candidates = ['.env', '.env.local'];
      for (const file of candidates) {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const m = content.match(/GEMINI_API_KEY=([^\r\n]+)/) || content.match(/VITE_GEMINI_API_KEY=([^\r\n]+)/);
          if (m && m[1].trim()) {
            apiKey = m[1].trim().replace(/^['"]|['"]$/g, '');
            process.env.GEMINI_API_KEY = apiKey;
            break;
          }
        }
      }
    } catch (diskErr) {
      console.warn('Could not read local .env dynamically:', diskErr);
    }
  }

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

    // Build multi-turn conversation contents
    const rawContents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history) {
        if (h && typeof h.text === 'string' && h.text.trim()) {
          rawContents.push({
            role: (h.role === 'model' || h.role === 'bot') ? 'model' : 'user',
            parts: [{ text: h.text }]
          });
        }
      }
    }

    // Build current message parts
    const currentParts: any[] = [];
    if (message) {
      currentParts.push({ text: message });
    }

    if (Array.isArray(images)) {
      for (const imgBase64 of images) {
        if (typeof imgBase64 === 'string' && imgBase64.includes(',')) {
          const mimeMatch = imgBase64.match(/^data:([^;]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const data = imgBase64.split(',')[1];
          currentParts.push({
            inlineData: {
              mimeType,
              data
            }
          });
        }
      }
    }

    if (currentParts.length > 0) {
      rawContents.push({
        role: 'user',
        parts: currentParts
      });
    }

    // Sanitize multi-turn history: must alternate user and model, and must start with user
    const contents: any[] = [];
    for (const item of rawContents) {
      if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
        contents[contents.length - 1].parts.push(...item.parts);
      } else {
        contents.push(item);
      }
    }

    while (contents.length > 0 && contents[0].role === 'model') {
      contents.shift();
    }

    const CANDIDATE_MODELS = [
      process.env.GEMINI_MODEL,
      'gemini-3.6-flash',
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest'
    ].filter(Boolean) as string[];

    let response: any = null;
    let lastError: any = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: contents.length === 1 ? contents[0] : contents,
          config: {
            systemInstruction: ORIENT_BRAND_SYSTEM_INSTRUCTION,
            tools: [{
              functionDeclarations: [
                navigateToSectionTool,
                prepareOrderTool,
                placeOrderTool
              ]
            }],
          }
        });
        if (response) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next candidate:`, err?.message?.substring(0, 100));
      }
    }

    if (!response) {
      console.log('Using local concierge engine fallback for message:', message);
      const fallbackResult = processLocalConciergeFallback(message, history);
      res.status(200).json(fallbackResult);
      return;
    }

    let responseText = response.text || '';
    const functionCalls = response.functionCalls || [];

    // Provide friendly fallback text if model returned tool calls with no accompanying text
    if (!responseText.trim() && functionCalls.length > 0) {
      const firstCall = functionCalls[0];
      if (firstCall.name === 'navigateToSection') {
        const sec = (firstCall.args as any)?.sectionId || 'requested section';
        responseText = `Certainly! Navigating you to the ${sec}.`;
      } else if (firstCall.name === 'prepareOrder') {
        const items = (firstCall.args as any)?.items || [];
        const total = (firstCall.args as any)?.totalAmount || 0;
        responseText = `I have prepared your order for ${items.map((i: any) => `${i.quantity}× ${i.name}`).join(', ')} (Total: ₦${total}). Shall I go ahead and confirm this order for you?`;
      } else if (firstCall.name === 'placeOrder') {
        responseText = `Your order has been confirmed and dispatched to our kitchen! Estimated preparation time is 11 minutes.`;
      }
    }

    res.status(200).json({
      text: responseText,
      functionCalls,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Error in /api/chat handler, activating concierge fallback:', error);
    try {
      const fallbackResult = processLocalConciergeFallback(req?.body?.message, req?.body?.history);
      res.status(200).json(fallbackResult);
    } catch (e) {
      res.status(500).json({
        error: error?.message || 'Failed to process chat with Gemini API'
      });
    }
  }
}

function processLocalConciergeFallback(message: string, history: any[] = []) {
  const msg = (message || '').toLowerCase().trim();
  
  // 1. Navigation requests
  if (msg.includes('navigate') || msg.includes('take me to') || msg.includes('go to') || msg.includes('show me') || msg.includes('open') || msg.includes('view') || msg.includes('menu')) {
    if (msg.includes('menu') || msg.includes('dining') || msg.includes('restaurant')) {
      return {
        text: 'Certainly! Navigating you to our Orient Dining Menu.',
        functionCalls: [{ name: 'navigateToSection', args: { sectionId: 'menu' } }],
        status: 'success'
      };
    }
    if (msg.includes('bakery')) {
      return {
        text: 'Navigating you to Orient Artisanal Bakery.',
        functionCalls: [{ name: 'navigateToSection', args: { sectionId: 'bakery' } }],
        status: 'success'
      };
    }
    if (msg.includes('market') || msg.includes('supermarket') || msg.includes('grocery')) {
      return {
        text: 'Navigating you to Orient Supermarket & Fresh Grocery.',
        functionCalls: [{ name: 'navigateToSection', args: { sectionId: 'market' } }],
        status: 'success'
      };
    }
    if (msg.includes('lounge') || msg.includes('cellar')) {
      return {
        text: 'Navigating you to Orient Luxury Lounge & VIP Cellar.',
        functionCalls: [{ name: 'navigateToSection', args: { sectionId: 'lounge' } }],
        status: 'success'
      };
    }
    if (msg.includes('game') || msg.includes('esport')) {
      return {
        text: 'Navigating you to the Orient Gaming Arena.',
        functionCalls: [{ name: 'navigateToSection', args: { sectionId: 'games' } }],
        status: 'success'
      };
    }
    if (msg.includes('water')) {
      return {
        text: 'Navigating you to Orient Atmospheric Water & Wellness.',
        functionCalls: [{ name: 'navigateToSection', args: { sectionId: 'water' } }],
        status: 'success'
      };
    }
    if (msg.includes('order')) {
      return {
        text: 'Opening your active kitchen orders tracker.',
        functionCalls: [{ name: 'navigateToSection', args: { sectionId: 'orders' } }],
        status: 'success'
      };
    }
  }

  // 2. Order confirmation (Step 2)
  const isConfirm = /^(yes|confirm|please do|place it|order it|proceed|yes confirm|yes please|go ahead)/i.test(msg);
  if (isConfirm) {
    let draftItems: any[] = [{ id: 'PRD-D-005', name: 'Smoky Jollof Rice', quantity: 2, price: 10 }];
    let total = 20;
    if (Array.isArray(history)) {
      for (let i = history.length - 1; i >= 0; i--) {
        const hText = history[i]?.text || '';
        if (typeof hText === 'string' && hText.includes('prepared your order')) {
          const qtyMatch = hText.match(/(\d+)×\s*([^,(]+)/);
          if (qtyMatch) {
            const q = parseInt(qtyMatch[1], 10) || 1;
            draftItems = [{ id: 'PRD-D-005', name: qtyMatch[2].trim(), quantity: q, price: 10 }];
            total = q * 10;
          }
          break;
        }
      }
    }
    return {
      text: 'Your order has been confirmed and dispatched to our kitchen! Estimated preparation time is 11 minutes. Our chefs have begun preparing your dishes.',
      functionCalls: [{
        name: 'placeOrder',
        args: {
          items: draftItems,
          totalAmount: total
        }
      }],
      status: 'success'
    };
  }

  // 3. Order preparation (Step 1)
  if (msg.includes('order') || msg.includes('plate') || msg.includes('jollof') || msg.includes('beef') || msg.includes('chicken') || msg.includes('egusi')) {
    if (msg.includes('can you place') || msg.includes('could you place') || msg.includes('how to order') || msg.includes('do you take orders')) {
      return {
        text: 'Certainly! I would be delighted to assist you with placing an order. Our Orient Fine Dining restaurant offers heritage dishes like Smoky Jollof Rice (₦10), Peppered & Grilled Beef (₦10), Heritage Egusi Soup with Fluffy Pounded Yam (₦10), and fresh river Catfish. What dishes and quantities would you like me to prepare for you?',
        functionCalls: [],
        status: 'success'
      };
    }

    const items: any[] = [];
    let totalAmount = 0;

    const jollofMatch = msg.match(/(\d+)?\s*(?:plate|plates|portion|portions)?\s*(?:of)?\s*(?:smoky\s*)?jollof/i);
    if (jollofMatch) {
      const qty = parseInt(jollofMatch[1], 10) || 2;
      items.push({ id: 'PRD-D-005', name: 'Smoky Jollof Rice', quantity: qty, price: 10 });
      totalAmount += qty * 10;
    }

    const beefMatch = msg.match(/(\d+)?\s*(?:plate|plates)?\s*(?:of)?\s*(?:peppered\s*)?beef/i);
    if (beefMatch) {
      const qty = parseInt(beefMatch[1], 10) || 1;
      items.push({ id: 'PRD-D-001', name: 'Peppered & Grilled Beef', quantity: qty, price: 10 });
      totalAmount += qty * 10;
    }

    const chickenMatch = msg.match(/(\d+)?\s*(?:plate|plates)?\s*(?:of)?\s*(?:spiced\s*)?chicken/i);
    if (chickenMatch) {
      const qty = parseInt(chickenMatch[1], 10) || 1;
      items.push({ id: 'PRD-D-002', name: 'Spiced Roasted & Fried Chicken', quantity: qty, price: 10 });
      totalAmount += qty * 10;
    }

    if (items.length === 0) {
      items.push({ id: 'PRD-D-005', name: 'Smoky Jollof Rice', quantity: 2, price: 10 });
      totalAmount = 20;
    }

    const summaryStr = items.map(it => `${it.quantity}× ${it.name}`).join(', ');
    return {
      text: `I have prepared your order for ${summaryStr} (Total: ₦${totalAmount}). Shall I go ahead and confirm this order for you?`,
      functionCalls: [{
        name: 'prepareOrder',
        args: {
          items,
          totalAmount
        }
      }],
      status: 'success'
    };
  }

  // 4. Menu inquiries
  if (msg.includes('menu') || msg.includes('item') || msg.includes('dish') || msg.includes('food') || msg.includes('price')) {
    return {
      text: `Welcome to Orient Fine Dining Restaurant. Here are our signature catalog categories (standard ₦10 per item, 11-minute preparation time):
• Proteins & Grills: Peppered & Grilled Beef, Spiced Roasted & Fried Chicken, Peppered Pork Chops, Goat Meat & Fresh Catfish Platter.
• The Rice Core: Smoky Jollof Rice, Nigerian Fried Rice, White Rice & Ayamase (Ofada Sauce), Coconut Rice.
• Soups & Natural Swallows: Heritage Egusi Soup, Efo Riro (Rich Spinach Pottage), Seafood Okra Soup, Ogbono & Afang Duet, Fluffy Pounded Yam, Artisanal Amala & Eba.
• Yam & Pasta: Asaro (Yam Porridge), Jollof Spaghetti & Stir-Fry Pasta, Fried Yam & Plantain Combo.
• Starters & Sides: Artisanal Moi Moi Elewe, Fried Plantain (Dodo), Catfish & Goat Meat Pepper Soup.

Would you like me to prepare an order or navigate you to the restaurant section?`,
      functionCalls: [],
      status: 'success'
    };
  }

  // 5. Default Greeting
  return {
    text: "Welcome to Orient Global Flagship. I am ORA, your luxury concierge. How may I assist you with our dining menu, orders, or venue exploration today?",
    functionCalls: [],
    status: 'success'
  };
}
