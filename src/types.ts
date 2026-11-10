export interface Question {
  id: string;
  order: number;
  text: string;
  shortLabel: string;
  category: string;
}

export interface SurveyResponse {
  id: string;
  answers: Record<string, number>; // question id -> score 1-5
  feedback?: string;
  timestamp: number;
  submittedAtFormatted: string;
  deviceId?: string;
}

export interface QuestionStat {
  id: string;
  order: number;
  text: string;
  shortLabel: string;
  category: string;
  mean: number;
  sd: number;
  distribution: Record<number, number>; // score 1-5 -> count
  percentages: Record<number, number>; // score 1-5 -> %
  interpretation: Interpretation;
}

export interface Interpretation {
  level: number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export interface SurveySummary {
  totalResponses: number;
  overallMean: number;
  overallSD: number;
  overallInterpretation: Interpretation;
  questions: QuestionStat[];
  scoreBreakdown: Record<number, number>; // total counts for 1, 2, 3, 4, 5
  scorePercentages: Record<number, number>;
  latestFeedback: Array<{
    id: string;
    text: string;
    timestamp: number;
    averageScore: number;
    answers: Record<string, number>;
  }>;
}

export interface FirebaseSettings {
  apiKey: string;
  authDomain?: string;
  databaseURL: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  enabled: boolean;
}
