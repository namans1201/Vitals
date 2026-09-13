-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "waterTargetMl" SET DEFAULT 4000;

-- CreateIndex
CREATE INDEX "WorkoutSet_exerciseId_idx" ON "WorkoutSet"("exerciseId");
