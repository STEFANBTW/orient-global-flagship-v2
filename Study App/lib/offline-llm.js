import { CreateMLCEngine } from '@mlc-ai/web-llm';

let engine = null;

export const initOfflineLLM = async (onProgress) => {
  if (engine) return engine;
  
  // Using a small quantized model suitable for browser inference
  const selectedModel = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
  
  try {
    engine = await CreateMLCEngine(
      selectedModel, 
      { initProgressCallback: onProgress }
    );
    return engine;
  } catch (error) {
    console.error("Failed to initialize WebLLM engine:", error);
    throw error;
  }
};

export const generateQuestions = async (text, difficulty, onProgress) => {
  if (!engine) {
    await initOfflineLLM(onProgress);
  }

  const prompt = `
You are an expert educator. Based on the following extracted text from a document, generate exactly 30 Multiple Choice Questions (MCQs) and 10 Theory questions.
The difficulty level should be: ${difficulty.toUpperCase()}.

Format the output strictly as a JSON object with this structure:
{
  "mcqs": [
    {
      "id": 1,
      "question": "Question text...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0 // index of the correct option (0-3)
    }
  ],
  "theory": [
    {
      "id": 1,
      "question": "Theory question text..."
    }
  ]
}

Extracted Text:
${text.substring(0, 15000)} // Limiting text length for browser memory constraints
`;

  try {
    const messages = [
      { role: "system", content: "You are a helpful AI assistant that outputs only raw JSON." },
      { role: "user", content: prompt }
    ];

    const reply = await engine.chat.completions.create({
      messages,
      response_format: { type: "json_object" }
    });

    const content = reply.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};
