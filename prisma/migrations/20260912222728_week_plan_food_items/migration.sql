-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bedtimeTarget" TEXT NOT NULL DEFAULT '00:30',
ALTER COLUMN "proteinTargetG" SET DEFAULT 125;

-- CreateTable
CREATE TABLE "WeekPlan" (
    "weekStart" DATE NOT NULL,
    "runDays" INTEGER[],
    "offDays" INTEGER[],
    "flexChoice" TEXT NOT NULL DEFAULT 'run',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeekPlan_pkey" PRIMARY KEY ("weekStart")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "servingLabel" TEXT NOT NULL,
    "proteinG" DOUBLE PRECISION NOT NULL,
    "caloriesKcal" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodItem_name_key" ON "FoodItem"("name");
