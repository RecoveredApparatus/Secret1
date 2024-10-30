import { useState, useEffect } from 'react';
import type { Question } from '../types';

const QUESTIONS: Question[] = [
  {
    id: '1',
    question: "If you could instantly master any skill in the world, what would it be and why?",
    category: "Life",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    },
    likes: 1234,
    comments: 89,
    shares: 45
  },
  {
    id: '2',
    question: "What's a scientific concept that completely blows your mind every time you think about it?",
    category: "Science",
    author: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    likes: 2341,
    comments: 156,
    shares: 78
  },
  {
    id: '3',
    question: "If you could have dinner with any historical figure, who would it be and what would you ask them?",
    category: "History",
    author: {
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    likes: 876,
    comments: 234,
    shares: 56
  }
];

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newQuestions = [...questions];
      const lastQuestion = questions[questions.length - 1];
      
      // Generate new questions based on the last one
      newQuestions.push({
        id: String(Number(lastQuestion.id) + 1),
        question: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)].question,
        category: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)].category,
        author: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)].author,
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200)
      });

      setQuestions(newQuestions);
      setLoading(false);
    }, 500);
  };

  return { questions, loading, loadMore };
}