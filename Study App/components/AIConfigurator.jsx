'use client';
import { useState } from 'react';

export default function AIConfigurator({ onGenerate, isGenerating, progressText }) {
  const [difficulty, setDifficulty] = useState('Medium');

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1rem' }}>2. AI Configuration</h2>
      
      <div className="config-section">
        <label className="config-label">Difficulty Level</label>
        <select 
          className="dropdown" 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={isGenerating}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <button 
        className="btn-primary" 
        onClick={() => onGenerate(difficulty)}
        disabled={isGenerating}
        style={{ marginTop: '1rem' }}
      >
        {isGenerating ? (
          <>
            <div className="loader"></div>
            Generating...
          </>
        ) : (
          'Generate Quiz Offline 🚀'
        )}
      </button>

      {progressText && (
        <div className="status-text">
          {progressText}
        </div>
      )}
    </div>
  );
}
