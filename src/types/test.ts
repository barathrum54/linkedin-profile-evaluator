export interface TestResult {
  _id?: string;
  userId: string;
  userEmail: string;
  score: number;
  answers: (number | null)[];
  completedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TestAnswer {
  questionIndex: number;
  value: number;
  timestamp: Date;
}

export interface ProfileData {
  score: number;
  completionRate: number;
  strengths: ProfileStrength[];
  improvements: ProfileImprovement[];
}

export interface ProfileStrength {
  title: string;
  score: number;
  description: string;
}

export interface ProfileImprovement {
  title: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}
