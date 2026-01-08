export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface QuizAnswer {
  questionId: number;
  answer: string;
}

export interface CareerRecommendation {
  careerPath: string;
  confidence: number;
  reasons: string[];
  learningPath: string[];
  skills: string[];
  resources: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const careerPaths = [
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'Data Scientist',
  'Data Analyst',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'Game Developer',
  'Mobile Developer',
  'Full Stack Developer',
] as const;

export type CareerPath = typeof careerPaths[number];