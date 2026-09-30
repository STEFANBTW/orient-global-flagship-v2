import { synthesizeQwenSpeech, synthesizeSpeechWithResilience } from '../api/tts-qwen';
import { synthesizeUnifiedAudio } from '../api/tts';

async function runTests() {
  console.log('--- TEST 1: Direct Qwen3-TTS Synthesis (Jennifer) ---');
  const t0 = Date.now();
  const qwenResult = await synthesizeQwenSpeech('Welcome to Orient Flagship. How may I assist you this evening?', 'Jennifer', 'English / 英文');
  console.log('Qwen Result:', {
    durationMs: Date.now() - t0,
    contentType: qwenResult.contentType,
    bytes: qwenResult.buffer.length,
    url: qwenResult.url
  });

  console.log('\n--- TEST 2: Unified Audio (engine = qwen, voice = Ryan) ---');
  const t1 = Date.now();
  const unifiedQwen = await synthesizeUnifiedAudio('Your table has been reserved.', { engine: 'qwen', voice: 'Ryan' });
  console.log('Unified Qwen Result:', {
    durationMs: Date.now() - t1,
    contentType: unifiedQwen.contentType,
    bytes: unifiedQwen.buffer.length,
    engineUsed: unifiedQwen.engineUsed
  });

  console.log('\n--- TEST 3: Unified Audio (engine = edge, voice = aria) ---');
  const t2 = Date.now();
  const unifiedEdge = await synthesizeUnifiedAudio('Welcome back.', { engine: 'edge', voice: 'aria' });
  console.log('Unified Edge Result:', {
    durationMs: Date.now() - t2,
    contentType: unifiedEdge.contentType,
    bytes: unifiedEdge.buffer.length,
    engineUsed: unifiedEdge.engineUsed
  });

  console.log('\nALL TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
