export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type User = {
  id: string;
  username: string;
  email: string;
  role?: "USER" | "ADMIN";
  createdAt: string;
};

export type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProblemTopic = Pick<Topic, "id" | "name" | "slug" | "difficulty" | "orderIndex">;

export type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type StarterCode = Record<string, string>;

export type Problem = {
  id: string;
  title: string;
  slug: string;
  statement: string;
  difficulty: Difficulty;
  constraints: string;
  examples: ProblemExample[];
  hints: string[];
  editorial?: string | null;
  starterCode: StarterCode;
  companyTags: string[];
  topicId: string;
  topic: ProblemTopic;
  createdAt: string;
  updatedAt: string;
};

export type SubmissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"
  | "INTERNAL_ERROR";

export type SubmissionLanguage = "cpp" | "java" | "python" | "javascript";

export type Submission = {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  executionTimeMs: number | null;
  memoryKb: number | null;
  testCasesPassed: number | null;
  totalTestCases: number | null;
  compileError?: string | null;
  runtimeError?: string | null;
  judgeOutput?: {
    status: SubmissionStatus;
    testCaseResults: Array<{
      index: number;
      isHidden: boolean;
      passed: boolean;
      executionTimeMs: number;
      memoryKb: number;
      expectedOutput?: string;
      actualOutput?: string;
    }>;
  } | null;
  createdAt: string;
  updatedAt: string;
  problem: {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    topic: Pick<Topic, "id" | "name" | "slug">;
  };
};

export type RoadmapItem = {
  name: string;
  orderIndex: number;
  topic: (Pick<Topic, "id" | "name" | "slug" | "difficulty" | "description">) | null;
  totalProblems: number;
  solvedCount: number;
  attemptedCount: number;
  completionPercent: number;
};

export type RoadmapResponse = {
  items: RoadmapItem[];
  summary: {
    totalTopics: number;
    totalProblems: number;
    solvedProblems: number;
    completionPercent: number;
  };
};

export type Note = {
  id: string;
  title: string;
  content: string;
  bookmarked: boolean;
  important: boolean;
  topicId?: string | null;
  problemId?: string | null;
  createdAt: string;
  updatedAt: string;
  topic?: Pick<Topic, "id" | "name" | "slug"> | null;
  problem?: Pick<Problem, "id" | "title" | "slug" | "difficulty"> | null;
};

export type Revision = {
  id: string;
  problemId: string;
  dueDate: string;
  status: "PENDING" | "COMPLETED";
  revisedAt?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  problem: Pick<Problem, "id" | "title" | "slug" | "difficulty"> & {
    topic: Pick<Topic, "id" | "name" | "slug">;
  };
};

export type CompanyProgress = {
  name: string;
  slug: string;
  totalProblems: number;
  solvedCount: number;
  completionPercent: number;
};

export type DashboardData = {
  stats: {
    totalSolved: number;
    totalAttempts: number;
    dueRevisions: number;
    completedRevisions: number;
    roadmapCompletionPercent: number;
  };
  solvedByDifficulty: Record<Difficulty, number>;
  solvedByTopic: Array<{ topic: string; solved: number }>;
  roadmap: RoadmapResponse;
  companyProgress: CompanyProgress[];
  recentActivity: Array<{
    id: string;
    type: string;
    label: string;
    at: string;
    href: string;
  }>;
};
