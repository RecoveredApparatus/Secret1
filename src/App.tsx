import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Brain } from 'lucide-react';
import { QuestionCard } from './components/QuestionCard';
import { NotesInput } from './components/NotesInput';
import { generateQuestions } from './services/kobold';
import type { Question, UserNotes } from './types';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const handleNotesSubmit = async (notes: UserNotes) => {
    const newQuestions = await generateQuestions(notes);
    setQuestions(prev => [...prev, ...newQuestions]);
  };

  const handleAnswer = (questionId: string, isCorrect: boolean) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          attempts: q.attempts + 1,
          correctAttempts: q.correctAttempts + (isCorrect ? 1 : 0)
        };
      }
      return q;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">STEM Quest</h1>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {questions.length === 0 ? (
          <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to STEM Quest!</h2>
              <p className="text-gray-600 mb-8">Upload your notes to generate practice questions.</p>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              ref={index === questions.length - 1 ? ref : undefined}
            >
              <QuestionCard
                question={question}
                isVisible={true}
                onAnswer={(isCorrect) => handleAnswer(question.id, isCorrect)}
              />
            </div>
          ))
        )}
      </main>

      <NotesInput onSubmit={handleNotesSubmit} />
    </div>
  );
}

export default App;