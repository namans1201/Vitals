-- Replace every en dash (U+2013) and em dash (U+2014) in user-visible text
-- with a plain hyphen.
--
-- Same reasoning as the checklist migration: this copy lives in the database,
-- so editing prisma/seed.ts alone would only reach a database created from
-- scratch. The dashes are written as U& escapes rather than as literal
-- characters so this file stays pure ASCII and cannot be mangled by whatever
-- encoding a client connects with.

CREATE OR REPLACE FUNCTION pg_temp.plain_dashes(t text) RETURNS text AS $$
  SELECT replace(replace(t, U&'\2014', '-'), U&'\2013', '-');
$$ LANGUAGE sql IMMUTABLE;

UPDATE "FoodItem" SET
  "name"         = pg_temp.plain_dashes("name"),
  "servingLabel" = pg_temp.plain_dashes("servingLabel"),
  "unitLabel"    = pg_temp.plain_dashes("unitLabel"),
  "note"         = pg_temp.plain_dashes("note");

UPDATE "MealPreset" SET
  "name"        = pg_temp.plain_dashes("name"),
  "description" = pg_temp.plain_dashes("description");

UPDATE "Supplement" SET
  "name"   = pg_temp.plain_dashes("name"),
  "dose"   = pg_temp.plain_dashes("dose"),
  "timing" = pg_temp.plain_dashes("timing"),
  "note"   = pg_temp.plain_dashes("note");

UPDATE "Exercise" SET
  "name"      = pg_temp.plain_dashes("name"),
  "cues"      = pg_temp.plain_dashes("cues"),
  "rationale" = pg_temp.plain_dashes("rationale");

-- Meals already logged. Their text is copied from the presets above, so
-- leaving these alone would keep old dashes on the Diet tab indefinitely.
UPDATE "Meal" SET
  "name"        = pg_temp.plain_dashes("name"),
  "description" = pg_temp.plain_dashes("description");
