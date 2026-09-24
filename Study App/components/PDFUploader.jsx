'use client';
import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// We need to set the worker source for pdf.js to work in browser
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PDFUploader({ onTextExtracted }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const extractTextFromPDF = async (file) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      onTextExtracted(fullText);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      alert("Failed to parse the PDF file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      extractTextFromPDF(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      extractTextFromPDF(file);
    }
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1rem' }}>1. Upload PDF</h2>
      <div 
        className={`upload-area ${isDragging ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isProcessing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="loader"></div>
            <p>Extracting text from PDF...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📄</div>
            <h3>Drag & Drop your PDF here</h3>
            <p>or click to browse files</p>
          </>
        )}
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
}
