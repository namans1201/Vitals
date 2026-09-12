-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'Naman',
    "dateOfBirth" DATE NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL DEFAULT 172.7,
    "sex" TEXT NOT NULL DEFAULT 'male',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "proteinTargetG" INTEGER NOT NULL DEFAULT 145,
    "calorieTargetKcal" INTEGER NOT NULL DEFAULT 2450,
    "waterTargetMl" INTEGER NOT NULL DEFAULT 3500,
    "proteinPerKg" DOUBLE PRECISION NOT NULL DEFAULT 2.1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "date" DATE NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "waistCm" DOUBLE PRECISION,
    "bodyFatPct" DOUBLE PRECISION,
    "skeletalMuscleKg" DOUBLE PRECISION,
    "armCm" DOUBLE PRECISION,
    "chestCm" DOUBLE PRECISION,
    "thighCm" DOUBLE PRECISION,
    "maxPullups" INTEGER,
    "maxPushups" INTEGER,
    "notes" TEXT,
    "waterMl" INTEGER NOT NULL DEFAULT 0,
    "restingHr" INTEGER,
    "sleepMinutes" INTEGER,
    "sleepStart" TIMESTAMP(3),
    "sleepEnd" TIMESTAMP(3),
    "deepMin" INTEGER,
    "remMin" INTEGER,
    "lightMin" INTEGER,
    "awakeMin" INTEGER,
    "steps" INTEGER,
    "activeKcal" INTEGER,
    "hrvMs" DOUBLE PRECISION,
    "spo2Pct" DOUBLE PRECISION,
    "skinTempC" DOUBLE PRECISION,
    "energyScore" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "importedAt" TIMESTAMP(3),

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "isUnilateral" BOOLEAN NOT NULL DEFAULT false,
    "defaultSets" INTEGER NOT NULL DEFAULT 3,
    "defaultRepsMin" INTEGER NOT NULL DEFAULT 8,
    "defaultRepsMax" INTEGER NOT NULL DEFAULT 15,
    "cues" TEXT,
    "rationale" TEXT,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "sessionType" TEXT NOT NULL,
    "durationMin" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSet" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "setIndex" INTEGER NOT NULL,
    "reps" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "rir" INTEGER,
    "tempo" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "type" TEXT NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "distanceM" INTEGER,
    "avgHr" INTEGER,
    "maxHr" INTEGER,
    "zoneSecJson" JSONB,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "proteinG" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "caloriesKcal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPreset" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "proteinG" DOUBLE PRECISION NOT NULL,
    "caloriesKcal" INTEGER NOT NULL,
    "phase" TEXT NOT NULL DEFAULT 'all',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MealPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistLog" (
    "date" DATE NOT NULL,
    "itemKey" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChecklistLog_pkey" PRIMARY KEY ("date","itemKey")
);

-- CreateTable
CREATE TABLE "Supplement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "note" TEXT,

    CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplementLog" (
    "date" DATE NOT NULL,
    "supplementId" INTEGER NOT NULL,
    "taken" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SupplementLog_pkey" PRIMARY KEY ("date","supplementId")
);

-- CreateTable
CREATE TABLE "BloodMarker" (
    "id" SERIAL NOT NULL,
    "testDate" DATE NOT NULL,
    "panel" TEXT NOT NULL,
    "marker" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "refLow" DOUBLE PRECISION,
    "refHigh" DOUBLE PRECISION,
    "flag" TEXT,
    "note" TEXT,

    CONSTRAINT "BloodMarker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthImport" (
    "id" SERIAL NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceFile" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rowsIngested" INTEGER NOT NULL DEFAULT 0,
    "daysTouched" INTEGER NOT NULL DEFAULT 0,
    "log" TEXT,

    CONSTRAINT "HealthImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyLog_date_idx" ON "DailyLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- CreateIndex
CREATE INDEX "Workout_date_idx" ON "Workout"("date");

-- CreateIndex
CREATE INDEX "WorkoutSet_workoutId_idx" ON "WorkoutSet"("workoutId");

-- CreateIndex
CREATE INDEX "Run_date_idx" ON "Run"("date");

-- CreateIndex
CREATE INDEX "Meal_date_idx" ON "Meal"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistItem_key_key" ON "ChecklistItem"("key");

-- CreateIndex
CREATE INDEX "BloodMarker_testDate_marker_idx" ON "BloodMarker"("testDate", "marker");

-- CreateIndex
CREATE UNIQUE INDEX "HealthImport_checksum_key" ON "HealthImport"("checksum");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_date_fkey" FOREIGN KEY ("date") REFERENCES "DailyLog"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_date_fkey" FOREIGN KEY ("date") REFERENCES "DailyLog"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_date_fkey" FOREIGN KEY ("date") REFERENCES "DailyLog"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistLog" ADD CONSTRAINT "ChecklistLog_date_fkey" FOREIGN KEY ("date") REFERENCES "DailyLog"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistLog" ADD CONSTRAINT "ChecklistLog_itemKey_fkey" FOREIGN KEY ("itemKey") REFERENCES "ChecklistItem"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementLog" ADD CONSTRAINT "SupplementLog_date_fkey" FOREIGN KEY ("date") REFERENCES "DailyLog"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementLog" ADD CONSTRAINT "SupplementLog_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
