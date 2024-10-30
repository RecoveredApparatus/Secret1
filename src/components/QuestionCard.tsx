import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Share2, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  isVisible: boolean;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuestionCard({ question, isVisible, onAnswer }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSubmit = () => {
    if (isAnswered) return;

    let isCorrect = false;
    if (question.type === 'mcq') {
      isCorrect = question.choices?.find(c => c.id === selectedAnswer)?.isCorrect || false;
    } else {
      isCorrect = selectedAnswer.toLowerCase() === question.correctAnswer?.toLowerCase();
    }

    setIsAnswered(true);
    onAnswer(isCorrect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[calc(100vh-4rem)] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="relative h-full p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
              {question.subject}
            </span>
            <span className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-full">
              {question.difficulty}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

            {question.type === 'mcq' ? (
              <div className="space-y-4">
                {question.choices?.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => !isAnswered && setSelectedAnswer(choice.id)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === choice.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    } ${
                      isAnswered && choice.isCorrect ? 'bg-green-50 border-green-500' : ''
                    }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Type your answer..."
                value={selectedAnswer}
                onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
                className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none"
                disabled={isAnswered}
              />
            )}
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isAnswered}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Answer
            </button>
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center space-x-2 text-blue-600"
              >
                <Lightbulb className="w-5 h-5" />
                <span>Show Explanation</span>
              </button>
              
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-blue-50 rounded-lg"
                >
                  {question.explanation}
                </motion.div>
              )}
            </motion.div>
          )}

          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <button className="flex flex-col items-center">
                  <Heart className="w-6 h-6 mb-1" />
                  <span className="text-sm">{question.likes}</span>
                </button>
                <div className="flex flex-col items-center">
                  <Award className="w-6 h-6 mb-1" />
                  <span className="text-sm">
                    {Math.round((question.correctAttempts / question.attempts) * 100 || 0)}%
                  </span>
                </div>
              </div>
              <button className="flex flex-col items-center">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}