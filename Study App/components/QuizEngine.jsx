'use client';
import { useState } from 'react';

export default function QuizEngine({ quizData, onSave }) {
  const [answers, setAnswers] = useState({});
  const [theoryAnswers, setTheoryAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!quizData || !quizData.mcqs) return null;

  const handleSelectMCQ = (questionId, optionIndex) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleTheoryChange = (questionId, text) => {
    setTheoryAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const calculateScore = () => {
    let score = 0;
    quizData.mcqs.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setShowResults(true);
    if (onSave) {
      onSave({
        ...quizData,
        userAnswers: answers,
        userTheory: theoryAnswers,
        score: calculateScore(),
        total: quizData.mcqs.length
      });
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <h2 className="title-gradient" style={{ fontSize: '2rem', textAlign: 'left' }}>Your Quiz</h2>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Multiple Choice Questions</h3>
        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0 2rem' }} />
        
        {quizData.mcqs.map((q, idx) => (
          <div key={q.id || idx} className="question-block">
            <h4 className="question-title">{idx + 1}. {q.question}</h4>
            <div className="mcq-options">
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[q.id] === optIdx;
                const isCorrect = showResults && q.correctAnswer === optIdx;
                const isWrong = showResults && isSelected && q.correctAnswer !== optIdx;
                
                let borderStyle = {};
                if (showResults) {
                  if (isCorrect) borderStyle = { borderColor: '#00b894', background: 'rgba(0, 184, 148, 0.1)' };
                  if (isWrong) borderStyle = { borderColor: '#d63031', background: 'rgba(214, 48, 49, 0.1)' };
                }

                return (
                  <div 
                    key={optIdx} 
                    className={`mcq-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectMCQ(q.id, optIdx)}
                    style={borderStyle}
                  >
                    <div style={{ fontWeight: 'bold', width: '24px' }}>
                      {String.fromCharCode(65 + optIdx)}.
                    </div>
                    <div>{opt}</div>
                    {showResults && isCorrect && <span style={{ marginLeft: 'auto' }}>✅</span>}
                    {showResults && isWrong && <span style={{ marginLeft: 'auto' }}>❌</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3>Theory Questions</h3>
        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0 2rem' }} />
        
        {quizData.theory.map((q, idx) => (
          <div key={q.id || idx} className="question-block">
            <h4 className="question-title">T{idx + 1}. {q.question}</h4>
            <textarea 
              className="theory-textarea"
              placeholder="Type your answer here..."
              value={theoryAnswers[q.id] || ''}
              onChange={(e) => handleTheoryChange(q.id, e.target.value)}
              disabled={showResults}
            />
          </div>
        ))}
      </div>

      {!showResults ? (
        <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={handleSubmit}>
          Submit Quiz & View Results
        </button>
      ) : (
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(108, 92, 231, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quiz Completed!</h3>
          <p style={{ fontSize: '1.2rem' }}>You scored <strong>{calculateScore()}</strong> out of <strong>{quizData.mcqs.length}</strong> on MCQs.</p>
          <p style={{ color: 'var(--text-muted)' }}>Theory questions are saved locally for self-review.</p>
        </div>
      )}
    </div>
  );
}
