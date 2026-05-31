# AlgoForge

AlgoForge is a full-stack interview preparation platform for DSA placement preparation. It combines a structured roadmap, curated stdin/stdout problems, a Docker-powered online judge, notes, revision scheduling, company prep, and analytics in one workspace.

## Product Flow

Learn -> Practice -> Code -> Track -> Revise -> Analyze

AlgoForge is intentionally standardized on a Codeforces/CodeChef-style model: every problem reads from standard input and writes to standard output. There are no LeetCode-style `class Solution` assumptions.

## Features

- Cookie-based JWT authentication with protected routes
- Role-based access control with `USER` and `ADMIN`
- Admin-only content and hidden testcase management
- DSA roadmap with topic progress
- Searchable topic/problem library
- Company-wise preparation for Amazon, Google, Microsoft, Uber, Atlassian, and Adobe
- Docker online judge for C++, Python, Java, and JavaScript
- Monaco-based coding workspace with Run and Submit
- Verdicts: Accepted, Wrong Answer, Compilation Error, Runtime Error, Time Limit Exceeded, Internal Error
- Per-user notes with bookmarks and important markers
- Revision scheduler with pending/completed history
- Submission history with judge metadata
- Dashboard analytics for solves, attempts, topics, roadmap, revisions, companies, and recent activity

## Tech Stack

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Monaco Editor
- React Context API

Backend:

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt
- Zod
- Docker

Database:

- PostgreSQL, tested with Neon

## Architecture

```text
frontend/
  React + Vite + Tailwind
  Axios client with credentials
  Auth context
  Feature folders

backend/
  Express app
  Route -> Controller -> Service
  Zod validation
  Prisma database layer
  Central error middleware
  Docker judge runners

Docker judge/
  Compile or syntax-check
  Run per testcase
  Capture stdout/stderr
  Compare normalized output
  Store verdict and metadata
```

## Authentication Flow

1. User signs up or logs in.
2. Backend validates input using Zod.
3. Passwords are hashed with bcrypt.
4. JWT is signed and stored in an httpOnly cookie.
5. Frontend calls `/api/auth/me` on app boot.
6. Protected API routes use `requireAuth`.
7. Admin APIs also use `requireAdmin`.

## Judge Architecture

The judge uses one shared pipeline and separate language runners:

- `cpp.runner.ts`
- `python.runner.ts`
- `java.runner.ts`
- `javascript.runner.ts`

Each runner uses Docker with:

- no network access
- memory limits
- CPU limits
- PID limits
- timeout enforcement
- stdout/stderr capture
- automatic container cleanup
- temporary workspace cleanup

Default images:

- C++: `gcc:13`
- Python: `python:3.12-slim`
- Java: `eclipse-temurin:21-jdk`
- JavaScript: `node:22-slim`

## Database Overview

Core models:

- `User`
- `Topic`
- `Problem`
- `TestCase`
- `Submission`
- `ProblemProgress`
- `Note`
- `Revision`

Important relationships:

- Topic has many Problems
- Problem has many TestCases
- User has many Submissions, Notes, Revisions, and Progress rows
- ProblemProgress is unique per user/problem
- Hidden testcases are admin-only

## Folder Structure

```text
backend/src/
  config/
  middleware/
  modules/
    auth/
    topics/
    problems/
    testcases/
    submissions/
    judge/
    roadmap/
    notes/
    revisions/
    companies/
    dashboard/
  utils/

frontend/src/
  app/
  components/
  features/
    auth/
    dashboard/
    roadmap/
    topics/
    problems/
    submissions/
    notes/
    revisions/
    companies/
  lib/
  routes/
  types/
  utils/
```

## Environment Variables

Backend:

```env
NODE_ENV="development"
PORT=4000
DATABASE_URL="postgresql://..."
JWT_SECRET="at-least-32-characters"
CLIENT_ORIGIN="http://localhost:5173"
JSON_BODY_LIMIT="1mb"
DOCKER_CPP_IMAGE="gcc:13"
DOCKER_PYTHON_IMAGE="python:3.12-slim"
DOCKER_JAVA_IMAGE="eclipse-temurin:21-jdk"
DOCKER_JAVASCRIPT_IMAGE="node:22-slim"
DOCKER_PLATFORM="linux/arm64"
JUDGE_COMPILE_TIMEOUT_MS=10000
JUDGE_RUN_TIMEOUT_MS=3000
JUDGE_MEMORY_LIMIT="256m"
JUDGE_CPUS="1"
JUDGE_MAX_OUTPUT_BYTES=65536
```

Frontend:

```env
VITE_API_BASE_URL="http://localhost:4000/api"
```

## Setup

Install backend dependencies:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Install frontend dependencies:

```bash
cd frontend
npm install
npm run dev
```

Pull judge images:

```bash
docker pull --platform linux/arm64 gcc:13
docker pull --platform linux/arm64 python:3.12-slim
docker pull --platform linux/arm64 eclipse-temurin:21-jdk
docker pull --platform linux/arm64 node:22-slim
```

## Screenshots

Add screenshots here before publishing the portfolio repository:

- Dashboard
- Roadmap
- Problem workspace
- Submission history
- Company prep

## Verification

Verified locally:

- Prisma generate
- Prisma migrations
- Backend build
- Frontend build
- Signup/login/logout/me
- RBAC admin/user restrictions
- Topic/problem/testcase flow
- Notes CRUD
- Revision CRUD
- Roadmap progress
- Company filtering
- Dashboard stats
- Custom run endpoint
- Judge verdicts for C++, Python, Java, JavaScript

## Future Roadmap

- Admin UI for creating topics/problems/testcases
- Rich markdown renderer for notes/editorials
- Better per-testcase public sample runner
- Queue-based judge workers for higher load
- Deployment hardening for Docker judge infrastructure
- Charts with Recharts for deeper analytics
