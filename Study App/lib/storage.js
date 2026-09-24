import localforage from 'localforage';

localforage.config({
  name: 'PDFQuizGenerator',
  storeName: 'quizzes'
});

export const saveQuiz = async (quizData) => {
  try {
    const id = Date.now().toString();
    const quiz = { id, ...quizData, createdAt: new Date().toISOString() };
    const existing = await localforage.getItem('all_quizzes') || [];
    await localforage.setItem('all_quizzes', [quiz, ...existing]);
    return id;
  } catch (error) {
    console.error('Error saving quiz:', error);
    return null;
  }
};

export const getQuizzes = async () => {
  try {
    return await localforage.getItem('all_quizzes') || [];
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return [];
  }
};
