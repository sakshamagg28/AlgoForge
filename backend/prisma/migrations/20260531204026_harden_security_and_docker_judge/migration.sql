-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'INTERNAL_ERROR';

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "compileError" TEXT,
ADD COLUMN     "judgeOutput" JSONB,
ADD COLUMN     "runtimeError" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
