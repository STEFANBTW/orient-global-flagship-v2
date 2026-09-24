'use client';
import { useState, useEffect } from 'react';
import PDFUploader from '../components/PDFUploader';
import AIConfigurator from '../components/AIConfigurator';
import QuizEngine from '../components/QuizEngine';
import { generateQuestions } from '../lib/offline-llm';
import { saveQuiz } from '../lib/storage';

export default function Home() {
  const [pdfText, setPdfText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerate = async (difficulty) => {
    if (!pdfText) {
      alert("Please upload a PDF first!");
      return;
    }

    setIsGenerating(true);
    setQuizData(null);
    try {
      const data = await generateQuestions(pdfText, difficulty, (progress) => {
        setProgressText(progress.text);
      });
      setQuizData(data);
      setProgressText("Generation complete!");
    } catch (error) {
      setProgressText("Failed to generate questions. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = async (completedQuiz) => {
    await saveQuiz(completedQuiz);
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <main className="container">
      <h1 className="title-gradient">Antigravity Study App</h1>
      <p className="subtitle">100% Offline AI Quiz Generator</p>

      {!quizData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <PDFUploader onTextExtracted={(text) => {
              setPdfText(text);
              alert("PDF parsed successfully! Extracted " + text.length + " characters.");
            }} />
          </div>
          <div>
            <AIConfigurator 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
              progressText={progressText} 
            />
          </div>
        </div>
      )}

      {quizData && (
        <>
          <button className="btn-primary" onClick={() => setQuizData(null)} style={{ background: 'rgba(255,255,255,0.1)' }}>
            ← Create New Quiz
          </button>
          <QuizEngine quizData={quizData} onSave={handleSaveQuiz} />
        </>
      )}
    </main>
  );
}
