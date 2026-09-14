-- Checklist wording, and a later bedtime target.
--
-- These rows already exist in every deployed database, so editing prisma/seed.ts
-- alone would only have affected a database created from scratch.

-- Retired, not deleted: ChecklistLog.itemKey is a foreign key onto this row, so
-- a DELETE would either fail outright or throw away the logged history of a
-- habit that was tracked for months. `active = false` is what the app already
-- filters on, so it simply stops appearing.
UPDATE "ChecklistItem" SET "active" = false WHERE "key" = 'nosmoke';

-- Em dashes replaced with plain hyphens.
UPDATE "ChecklistItem" SET "label" = 'Finax - 11 AM'        WHERE "key" = 'finax_am';
UPDATE "ChecklistItem" SET "label" = 'Adgain Plus - 2:15 PM' WHERE "key" = 'adgain';
UPDATE "ChecklistItem" SET "label" = 'Finax - 10 PM'        WHERE "key" = 'finax_pm';

UPDATE "ChecklistItem" SET "label" = 'No caffeine after 3 PM' WHERE "key" = 'caffeine';

-- The "bed" row's own label is never rendered - TodayClient builds that string
-- from Profile.bedtimeTarget - but it is kept in step so the two cannot drift.
UPDATE "ChecklistItem" SET "label" = 'In bed by 1 AM' WHERE "key" = 'bed';
UPDATE "Profile" SET "bedtimeTarget" = '01:00' WHERE "bedtimeTarget" = '00:30';
ALTER TABLE "Profile" ALTER COLUMN "bedtimeTarget" SET DEFAULT '01:00';
