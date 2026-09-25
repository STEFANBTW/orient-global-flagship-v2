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

const ORIENT_BRAND_SYSTEM_INSTRUCTION = `You are AURA, the Orient Luxury AI Concierge for Orient Global Flagship in Jos, Plateau State, Nigeria.
Orient Global Flagship is a premier multi-division lifestyle, fine dining, and hospitality destination located at Amada Plaza, Rayfield, Jos.

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
OFFICIAL RESTAURANT MENU CATALOG:
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

1. MENU QUERIES:
- When a guest asks about an item ON our menu: Provide the full description, price (₦10), prep time (11 mins), and recommend a pairing.
- When a guest asks about an item NOT on our menu (e.g. pizza, steak, burger, shawarma, sushi):
  * State politely that we do not have that exact dish today.
  * Immediately offer the CLOSEST 1-2 alternatives from our menu with an enticing explanation.
  * Examples:
    - Pizza / Italian pasta -> Recommend "Jollof Spaghetti & Stir-Fry Pasta" or "Olive Focaccia / Artisanal Sourdough".
    - Steak / Ribeye / Lamb chops -> Recommend "Peppered & Grilled Beef" or "Peppered Pork Chops" or "Goat Meat Asun".
    - Salmon / Cod / Fish -> Recommend "Fresh River Catfish Platter", "Seafood Okra Soup", or "Catfish Pepper Soup".
    - Shawarma / Burger -> Recommend "Spiced Roasted & Fried Chicken" or "NYC Bagels with Grilled Beef".

2. ORDERING CONVERSATION & 2-STEP CONFIRMATION:
- Step 1 (Prepare Order): When a guest asks to order one or multiple items:
  * Extract item names, match them with our menu catalog (use price ₦10 each unless specified).
  * Invoke the 'prepareOrder' tool with the list of items, quantities, and total amount.
  * Summarize the items and total in your message and ask: "Shall I go ahead and confirm this order for you?"
  * NEVER place the order without asking for confirmation first.
- Step 2 (Confirmation Stage): When the user confirms (e.g., "yes", "please do", "confirm", "order it", "place it", "proceed"):
  * Invoke the 'placeOrder' tool with the confirmed items and total.
  * Congratulate the guest, share their estimated preparation time (11 minutes), and confirm their order has been sent to the kitchen.

3. NAVIGATION:
- If the visitor asks to see, visit, or explore any division or section (bakery, market, restaurant, dining, menu, lounge, games, water, location, hero, orders), invoke the 'navigateToSection' tool with the sectionId.

4. VOICE & TONE:
- Luxury, refined, warm, and concise. Speak like the premier concierge at a 5-star destination.`;

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
          functionDeclarations: [
            navigateToSectionTool,
            prepareOrderTool,
            placeOrderTool
          ]
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
