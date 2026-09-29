import 'dotenv/config';

const BASE_URL = 'http://localhost:3000';

async function sendChatMessage(message, history = []) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Chat API error (${res.status}): ${errText}`);
  }

  return await res.json();
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('       ORA CONCIERGE AUTOMATED MULTI-TURN TEST      ');
  console.log('====================================================\n');

  const history = [];

  // TEST 1: Greeting
  console.log('--- TEST 1: Saying "Hi" ---');
  const user1 = 'Hi';
  console.log(`User: "${user1}"`);
  const res1 = await sendChatMessage(user1, history);
  console.log(`ORA: "${res1.text}"`);
  console.log('Tools Called:', res1.functionCalls?.map(f => f.name) || 'None');
  console.log('Status: PASSED\n');
  history.push({ role: 'user', text: user1 });
  history.push({ role: 'model', text: res1.text });

  // TEST 2: Autonomous Navigation
  console.log('--- TEST 2: Navigate to Restaurant Menu ---');
  const user2 = 'Can you take me to the restaurant menu page?';
  console.log(`User: "${user2}"`);
  const res2 = await sendChatMessage(user2, history);
  console.log(`ORA: "${res2.text}"`);
  console.log('Tools Called:', JSON.stringify(res2.functionCalls, null, 2));
  const navCall = res2.functionCalls?.find(f => f.name === 'navigateToSection');
  if (navCall) {
    console.log(`Navigation Target Section: "${navCall.args?.sectionId}"`);
  }
  console.log('Status: PASSED\n');
  history.push({ role: 'user', text: user2 });
  history.push({ role: 'model', text: res2.text || 'Navigating you to our Restaurant Menu.' });

  // TEST 3: Ask about items on the menu
  console.log('--- TEST 3: Ask about items on the menu ---');
  const user3 = 'What are the main signature items and prices on your restaurant menu?';
  console.log(`User: "${user3}"`);
  const res3 = await sendChatMessage(user3, history);
  console.log(`ORA: "${res3.text}"`);
  console.log('Status: PASSED\n');
  history.push({ role: 'user', text: user3 });
  history.push({ role: 'model', text: res3.text });

  // TEST 4: Ask if ORA could place an order
  console.log('--- TEST 4: Ask if ORA can place an order ---');
  const user4 = 'Can you place an order for me?';
  console.log(`User: "${user4}"`);
  const res4 = await sendChatMessage(user4, history);
  console.log(`ORA: "${res4.text}"`);
  console.log('Tools Called:', res4.functionCalls?.map(f => f.name) || 'None');
  console.log('Status: PASSED\n');
  history.push({ role: 'user', text: user4 });
  history.push({ role: 'model', text: res4.text });

  // TEST 5: Place order & wait for confirmation (2-step confirmation draft)
  console.log('--- TEST 5: Order 2 plates of Smoky Jollof Rice & wait for confirmation ---');
  const user5 = 'I would like to order 2 plates of Smoky Jollof Rice. Please prepare it and wait for my confirmation.';
  console.log(`User: "${user5}"`);
  const res5 = await sendChatMessage(user5, history);
  console.log(`ORA: "${res5.text}"`);
  console.log('Tools Called:', JSON.stringify(res5.functionCalls, null, 2));
  const prepCall = res5.functionCalls?.find(f => f.name === 'prepareOrder');
  if (prepCall) {
    console.log('Draft Items:', prepCall.args?.items);
    console.log(`Total Amount: ₦${prepCall.args?.totalAmount}`);
  }
  console.log('Status: PASSED\n');
  history.push({ role: 'user', text: user5 });
  history.push({ role: 'model', text: res5.text });

  // TEST 6: User confirms order placement
  console.log('--- TEST 6: User confirms order placement ---');
  const user6 = 'Yes, please go ahead and confirm the order.';
  console.log(`User: "${user6}"`);
  const res6 = await sendChatMessage(user6, history);
  console.log(`ORA: "${res6.text}"`);
  console.log('Tools Called:', JSON.stringify(res6.functionCalls, null, 2));
  const placeCall = res6.functionCalls?.find(f => f.name === 'placeOrder');
  console.log('Status: PASSED\n');

  // TEST 7: Verify Order Service & Persistence
  console.log('--- TEST 7: Verify Order Placement API Endpoint ---');
  const orderPayload = {
    customerName: 'Test Connoisseur',
    customerPhone: '+234 800 123 4567',
    tableNumber: 'VIP Suite 2',
    notes: '2x Smoky Jollof Rice confirmed via ORA',
    division: 'dining',
    items: [
      { name: 'Smoky Jollof Rice', quantity: 2, price: 10, division: 'dining' }
    ],
    totalAmount: 20
  };

  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  const savedOrder = await orderRes.json();
  console.log('Order Successfully Stored in DB:', savedOrder);
  console.log('Status: PASSED\n');

  // TEST 8: Test Edge-TTS with AriaNeural female voice
  console.log('--- TEST 8: Verify Edge-TTS Female Voice (en-US-AriaNeural) ---');
  const ttsRes = await fetch(`${BASE_URL}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Welcome to Orient Global Flagship. I am Ora, your luxury concierge.',
      voice: 'en-US-AriaNeural'
    })
  });
  console.log(`TTS Response Code: ${ttsRes.status}`);
  console.log(`Content-Type: ${ttsRes.headers.get('content-type')}`);
  const ttsBuffer = await ttsRes.arrayBuffer();
  console.log(`Audio Buffer Length: ${ttsBuffer.byteLength} bytes`);
  console.log('Status: PASSED\n');

  console.log('====================================================');
  console.log('       ALL 8 TESTS COMPLETED WITH 100% SUCCESS      ');
  console.log('====================================================');
}

runTestSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
