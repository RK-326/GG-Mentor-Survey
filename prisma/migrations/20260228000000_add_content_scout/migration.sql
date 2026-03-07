-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'TEST_ASSIGNED';

-- AlterEnum
ALTER TYPE "ResponseStatus" ADD VALUE 'TEST_ASSIGNED';

-- AlterTable
ALTER TABLE "submissions" ALTER COLUMN "platformUsage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "submissions" ALTER COLUMN "featuresUsed" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "content_scout_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "references" JSONB NOT NULL,
    "reelsIdeas" JSONB NOT NULL,
    "moodboardUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_scout_submissions_pkey" PRIMARY KEY ("id")
);
