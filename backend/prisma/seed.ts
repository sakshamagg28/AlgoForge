import { PrismaClient, type Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

const roadmapTopics = [
  "Arrays",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
  "Linked List",
  "Stack",
  "Queue",
  "Binary Search",
  "Trees",
  "BST",
  "Heap",
  "Greedy",
  "Backtracking",
  "Graphs",
  "Dynamic Programming",
  "Tries",
  "Segment Trees"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function starterCode(operation: "double" | "sum" | "reverse" | "max") {
  const cpp = {
    double:
      '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n    cout << n * 2 << "\\n";\n    return 0;\n}\n',
    sum:
      '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long sum = 0;\n    for (int i = 0; i < n; i++) {\n        long long x;\n        cin >> x;\n        sum += x;\n    }\n    cout << sum << "\\n";\n    return 0;\n}\n',
    reverse:
      '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    reverse(s.begin(), s.end());\n    cout << s << "\\n";\n    return 0;\n}\n',
    max:
      '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long ans = LLONG_MIN;\n    for (int i = 0; i < n; i++) {\n        long long x;\n        cin >> x;\n        ans = max(ans, x);\n    }\n    cout << ans << "\\n";\n    return 0;\n}\n'
  };

  const python = {
    double: 'n = int(input())\nprint(n * 2)\n',
    sum: 'n = int(input())\narr = list(map(int, input().split()))\nprint(sum(arr))\n',
    reverse: 's = input().strip()\nprint(s[::-1])\n',
    max: 'n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))\n'
  };

  const java = {
    double:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(n * 2);\n    }\n}\n',
    sum:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long sum = 0;\n        for (int i = 0; i < n; i++) sum += sc.nextLong();\n        System.out.println(sum);\n    }\n}\n',
    reverse:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}\n',
    max:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long ans = Long.MIN_VALUE;\n        for (int i = 0; i < n; i++) ans = Math.max(ans, sc.nextLong());\n        System.out.println(ans);\n    }\n}\n'
  };

  const javascript = {
    double:
      'const fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim();\nconst n = BigInt(input);\nconsole.log((n * 2n).toString());\n',
    sum:
      'const fs = require("fs");\nconst values = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nconst n = values[0];\nlet sum = 0;\nfor (let i = 0; i < n; i++) sum += values[i + 1];\nconsole.log(sum);\n',
    reverse:
      'const fs = require("fs");\nconst s = fs.readFileSync(0, "utf8").trim();\nconsole.log([...s].reverse().join(""));\n',
    max:
      'const fs = require("fs");\nconst values = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nconst n = values[0];\nconsole.log(Math.max(...values.slice(1, n + 1)));\n'
  };

  return {
    cpp: cpp[operation],
    python: python[operation],
    java: java[operation],
    javascript: javascript[operation]
  };
}

const demoProblems = [
  {
    topic: "Arrays",
    title: "Double the Number",
    difficulty: "EASY" as Difficulty,
    statement:
      "You are given one integer n. Print two times its value. This problem is intentionally simple so you can verify the full stdin/stdout judge flow.",
    constraints: "1 <= n <= 10^9",
    examples: [{ input: "5", output: "10", explanation: "Two times 5 is 10." }],
    hints: ["Read one integer from standard input.", "Print the answer followed by a newline."],
    operation: "double" as const,
    companyTags: ["Amazon", "Adobe"],
    testCases: [
      { input: "5\n", expectedOutput: "10\n", isHidden: false },
      { input: "123\n", expectedOutput: "246\n", isHidden: true }
    ]
  },
  {
    topic: "Arrays",
    title: "Array Sum",
    difficulty: "EASY" as Difficulty,
    statement:
      "Given an array of n integers, print the sum of all elements. Input is provided through standard input and output must be printed to standard output.",
    constraints: "1 <= n <= 2 * 10^5, -10^9 <= ai <= 10^9",
    examples: [{ input: "5\n1 2 3 4 5", output: "15" }],
    hints: ["Use a 64-bit integer for the sum."],
    operation: "sum" as const,
    companyTags: ["Amazon", "Microsoft", "Uber"],
    testCases: [
      { input: "5\n1 2 3 4 5\n", expectedOutput: "15\n", isHidden: false },
      { input: "4\n-5 10 -2 7\n", expectedOutput: "10\n", isHidden: true }
    ]
  },
  {
    topic: "Strings",
    title: "Reverse a String",
    difficulty: "EASY" as Difficulty,
    statement: "Given a single lowercase string s, print the reversed string.",
    constraints: "1 <= |s| <= 10^5",
    examples: [{ input: "algoforge", output: "egrofogla" }],
    hints: ["Use two pointers or built-in reverse utilities."],
    operation: "reverse" as const,
    companyTags: ["Google", "Adobe"],
    testCases: [
      { input: "algoforge\n", expectedOutput: "egrofogla\n", isHidden: false },
      { input: "placement\n", expectedOutput: "tnemecalp\n", isHidden: true }
    ]
  },
  {
    topic: "Arrays",
    title: "Maximum Element",
    difficulty: "EASY" as Difficulty,
    statement: "Given an array of n integers, print the maximum value in the array.",
    constraints: "1 <= n <= 2 * 10^5, -10^9 <= ai <= 10^9",
    examples: [{ input: "4\n-2 7 1 5", output: "7" }],
    hints: ["Initialize the answer using the first element or a very small value."],
    operation: "max" as const,
    companyTags: ["Microsoft", "Atlassian"],
    testCases: [
      { input: "4\n-2 7 1 5\n", expectedOutput: "7\n", isHidden: false },
      { input: "3\n-10 -4 -8\n", expectedOutput: "-4\n", isHidden: true }
    ]
  }
];

async function main() {
  for (const [index, name] of roadmapTopics.entries()) {
    await prisma.topic.upsert({
      where: { name },
      update: {
        slug: slugify(name),
        description: `${name} patterns, pitfalls, and interview practice problems.`,
        difficulty: index < 6 ? "EASY" : index < 14 ? "MEDIUM" : "HARD",
        orderIndex: index + 1
      },
      create: {
        name,
        slug: slugify(name),
        description: `${name} patterns, pitfalls, and interview practice problems.`,
        difficulty: index < 6 ? "EASY" : index < 14 ? "MEDIUM" : "HARD",
        orderIndex: index + 1
      }
    });
  }

  for (const demo of demoProblems) {
    const topic = await prisma.topic.findUniqueOrThrow({ where: { name: demo.topic } });
    const problem = await prisma.problem.upsert({
      where: { title: demo.title },
      update: {
        slug: slugify(demo.title),
        statement: demo.statement,
        difficulty: demo.difficulty,
        constraints: demo.constraints,
        examples: demo.examples,
        hints: demo.hints,
        starterCode: starterCode(demo.operation),
        companyTags: demo.companyTags,
        topicId: topic.id
      },
      create: {
        title: demo.title,
        slug: slugify(demo.title),
        statement: demo.statement,
        difficulty: demo.difficulty,
        constraints: demo.constraints,
        examples: demo.examples,
        hints: demo.hints,
        starterCode: starterCode(demo.operation),
        companyTags: demo.companyTags,
        topicId: topic.id
      }
    });

    await prisma.testCase.deleteMany({ where: { problemId: problem.id } });
    await prisma.testCase.createMany({
      data: demo.testCases.map((testCase) => ({
        ...testCase,
        problemId: problem.id
      }))
    });
  }

  console.log("Seeded AlgoForge roadmap topics and stdin/stdout demo problems.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
