export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface CorrectAnswer {
  [key: string]: boolean;
}

export interface Question {
  id?: string; // UI-only stable ID
  queType: "SINGLE_CORRECT" | "MULTIPLE_CORRECT";
  questions: string;
  options: QuestionOptions;
  correctAnswer: CorrectAnswer;
  tags: string[];
}

export type QuestionArray = Question[];

export interface TranscriptMeta {
  name: string;
  size: number;
}

export interface GenerateParams {
  transcript: string;
  tagName: string;
  questionCount: number;
  apiKey: string;
}
