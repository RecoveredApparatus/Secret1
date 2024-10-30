export type QuestionType = 'mcq' | 'fillInBlank';

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  subject: 'math' | 'physics' | 'chemistry' | 'biology' | 'computer_science';
  topic: string;
  choices?: Choice[];
  correctAnswer?: string; // For fill in the blank
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  likes: number;
  attempts: number;
  correctAttempts: number;
}

export interface UserNotes {
  subject: string;
  content: string;
}