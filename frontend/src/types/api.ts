export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type User = {
  id: string;
  username: string;
  email: string;
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
  | "COMPILATION_ERROR";

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
