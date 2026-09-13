/**
 * Generates a static, printable reference PDF of the training program,
 * nutrition plan, and daily rules - for whenever Naman doesn't want the
 * site open. This is deliberately NOT a live export: it's built once from
 * the same data the app reads (session templates, exercise cues, meal
 * presets, targets), and only needs regenerating if that content changes.
 *
 * Content lives in three places, all read here directly rather than
 * duplicated: domain/sessionTemplates.ts (the 4-day split + the current
 * Week 6 reset), domain/exerciseFormGuide.ts (steps/mistakes), and the
 * live DB (Exercise cues, MealPreset, Supplement, ChecklistItem, Profile
 * targets) via Prisma.
 *
 * Exercise images: pdfkit only embeds JPEG/PNG, not WebP, so this reads
 * the original PNGs (public/exercises/<slug>.png - gitignored, local-only)
 * and re-encodes them through sharp to a print-appropriate size in memory;
 * nothing is written to disk for this step.
 *
 * Run with: npx tsx --env-file=.env scripts/generate-program-pdf.mts [outPath]
 * (tsx doesn't load .env on its own - see project memory on this gotcha.)
 */
import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import {
  SESSION_TEMPLATES,
  SESSION_LABELS,
  ACTIVE_PROGRAM,
  type SessionType,
  type SessionTemplateExercise,
} from "@/domain/sessionTemplates";
import { EXERCISE_FORM_GUIDE } from "@/domain/exerciseFormGuide";

const OUT_PATH = process.argv[2] ?? "exports/Naman-Program-Reference.pdf";
const IMAGE_WIDTH = 620; // print-appropriate; source is 1536px wide

// ---- palette (mirrors globals.css's near-mono tokens) ----
const INK = "#111111";
const DIM = "#4b5563";
const FAINT = "#9ca3af";
const LINE = "#d1d5db";
const PANEL_2 = "#f4f4f5";
const GOOD = "#0e9f6e";
const BAD = "#dc2626";

const PAGE = { size: "A4" as const, margins: { top: 56, bottom: 56, left: 52, right: 52 } };
const CONTENT_WIDTH = 595.28 - PAGE.margins.left - PAGE.margins.right; // A4 width in pt

const SESSION_ORDER: SessionType[] = ["upper_a", "lower_a", "upper_b", "lower_b", "full_body"];

/** pdfkit's standard-14 fonts (Helvetica here) only support WinAnsiEncoding -
 * a superset of Latin-1, not full Unicode. Arrows in particular fall
 * outside it and render as garbage (confirmed live: "pike -> feet on a
 * chair" rendered as "pike !' feet on a chair" before this). Em/en dashes,
 * curly quotes, degree signs, and bullets ARE in WinAnsi and don't need
 * touching - only replace what's actually outside it. */
function sanitizeForPdf(text: string): string {
  return text
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/✓/g, "[x]")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=");
}

function unitLabel(ex: SessionTemplateExercise): string {
  const range = ex.repsMin === ex.repsMax ? `${ex.repsMin}` : `${ex.repsMin}-${ex.repsMax}`;
  const suffix = ex.unit === "seconds" ? "s" : ex.unit === "metres" ? "m" : "";
  const perSide = ex.perSide ? " / side" : "";
  return `${ex.targetSets} x ${range}${suffix}${perSide}`;
}

async function loadExerciseImage(name: string): Promise<Buffer | null> {
  const slug = slugify(name);
  const pngPath = path.join("public/exercises", `${slug}.png`);
  try {
    const src = await fs.readFile(pngPath);
    return await sharp(src).resize({ width: IMAGE_WIDTH }).jpeg({ quality: 82 }).toBuffer();
  } catch {
    return null;
  }
}

async function main() {
  const programNames = Array.from(
    new Set(SESSION_ORDER.flatMap((s) => SESSION_TEMPLATES[s].map((e) => e.exerciseName))),
  );

  const [profile, exercises, mealPresets, supplements, checklistItems] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.exercise.findMany({ where: { name: { in: programNames } } }),
    prisma.mealPreset.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.supplement.findMany({ where: { status: { not: "stopped" } }, orderBy: { id: "asc" } }),
    prisma.checklistItem.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!profile) throw new Error("No Profile row - seed the database first.");

  const exerciseByName = new Map(exercises.map((e) => [e.name, e]));
  const visibleMeals = mealPresets.filter((p) => p.phase === "all" || p.phase === profile.mealPhase);

  console.log(`Loading ${programNames.length} exercise images...`);
  const imageByName = new Map<string, Buffer | null>();
  for (const name of programNames) {
    imageByName.set(name, await loadExerciseImage(name));
  }
  const missingImages = programNames.filter((n) => !imageByName.get(n));
  if (missingImages.length > 0) {
    console.log(`  no source PNG found for: ${missingImages.join(", ")} (will render without an image)`);
  }

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  const doc = new PDFDocument(PAGE);
  const stream = doc.pipe(createWriteStream(OUT_PATH));

  // ---- layout helpers ----
  let y = PAGE.margins.top;
  const destinations: { name: string; label: string }[] = [
    { name: "dest-schedule", label: "Schedule" },
    { name: "dest-upper_a", label: "Upper A" },
    { name: "dest-lower_a", label: "Lower A" },
    { name: "dest-upper_b", label: "Upper B" },
    { name: "dest-lower_b", label: "Lower B" },
    { name: "dest-full_body", label: "Full Body" },
    { name: "dest-progression", label: "Progression" },
    { name: "dest-meals", label: "Meals" },
    { name: "dest-checklist", label: "Checklist" },
  ];

  function newPage() {
    doc.addPage();
    y = PAGE.margins.top;
    drawTabNav();
  }

  function ensureSpace(height: number) {
    const bottom = 841.89 - PAGE.margins.bottom;
    if (y + height > bottom) newPage();
  }

  /** The "tab-styled" internal nav strip repeated at the top of every page
   * after the cover - each label is a real internal link (doc.goTo) to that
   * section's named destination, drawn as a small filled/outlined pill so
   * it reads as a row of tabs rather than plain text. */
  function drawTabNav() {
    const startY = PAGE.margins.top - 34;
    let x = PAGE.margins.left;
    doc.fontSize(7.5).font("Helvetica");
    for (const dest of destinations) {
      const w = doc.widthOfString(dest.label) + 14;
      doc.roundedRect(x, startY, w, 16, 8).fillAndStroke(PANEL_2, LINE);
      doc.fillColor(DIM).text(dest.label, x, startY + 4.5, { width: w, align: "center", lineBreak: false });
      doc.goTo(x, startY, w, 16, dest.name);
      x += w + 6;
    }
    doc.fillColor(INK);
  }

  function sectionHeader(title: string, destName?: string) {
    ensureSpace(50);
    if (destName) doc.addNamedDestination(destName);
    doc.fontSize(18).font("Helvetica-Bold").fillColor(INK).text(title, PAGE.margins.left, y);
    y = doc.y + 4;
    doc.moveTo(PAGE.margins.left, y).lineTo(PAGE.margins.left + CONTENT_WIDTH, y).strokeColor(LINE).stroke();
    y += 14;
  }

  function subheader(title: string) {
    ensureSpace(24);
    doc.fontSize(12).font("Helvetica-Bold").fillColor(INK).text(title, PAGE.margins.left, y);
    y = doc.y + 6;
  }

  function paragraph(text: string, opts: { size?: number; color?: string; gap?: number } = {}) {
    const size = opts.size ?? 10;
    ensureSpace(size * 2);
    doc
      .fontSize(size)
      .font("Helvetica")
      .fillColor(opts.color ?? DIM)
      .text(text, PAGE.margins.left, y, { width: CONTENT_WIDTH });
    y = doc.y + (opts.gap ?? 8);
  }

  function bullets(items: string[], opts: { size?: number; color?: string } = {}) {
    const size = opts.size ?? 10;
    for (const item of items) {
      ensureSpace(size * 2);
      doc
        .fontSize(size)
        .font("Helvetica")
        .fillColor(opts.color ?? DIM)
        .text(`-  ${item}`, PAGE.margins.left + 4, y, { width: CONTENT_WIDTH - 4 });
      y = doc.y + 4;
    }
    y += 6;
  }

  // ============================================================ COVER
  doc.rect(0, 0, 595.28, 841.89).fill("#fafafa");
  doc.fillColor(INK).fontSize(30).font("Helvetica-Bold").text("Naman", PAGE.margins.left, 130);
  doc
    .fontSize(15)
    .font("Helvetica")
    .fillColor(DIM)
    .text("Training & Nutrition Reference", PAGE.margins.left, 168);
  doc
    .fontSize(9)
    .fillColor(FAINT)
    .text(
      `Generated ${new Date().toISOString().slice(0, 10)} - a static snapshot, not a live export. Regenerate this file if the program or targets change.`,
      PAGE.margins.left,
      196,
      { width: CONTENT_WIDTH },
    );

  y = 250;
  doc.fontSize(12).font("Helvetica-Bold").fillColor(INK).text("Daily targets", PAGE.margins.left, y);
  y = doc.y + 10;
  const targetRows: [string, string][] = [
    ["Protein", `${profile.proteinTargetG} g  (${profile.proteinPerKg} g/kg)`],
    ["Calories", `${profile.calorieTargetKcal} kcal`],
    ["Fat", `${profile.fatTargetG} g`],
    ["Carbs", `${profile.carbTargetG} g`],
    ["Water", `${profile.waterTargetMl} ml`],
    ["In bed by", profile.bedtimeTarget],
  ];
  const colW = CONTENT_WIDTH / 2;
  targetRows.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = PAGE.margins.left + col * colW;
    const by = y + row * 26;
    doc.fontSize(9).font("Helvetica").fillColor(FAINT).text(label.toUpperCase(), bx, by);
    doc.fontSize(12).font("Helvetica-Bold").fillColor(INK).text(value, bx, by + 11);
  });
  y = y + Math.ceil(targetRows.length / 2) * 26 + 24;

  const statusText =
    ACTIVE_PROGRAM === "full_body_reset"
      ? "Week 6 reset is currently active: one full-body session on Saturdays, nothing else scheduled. The full four-day split below is the target program - it resumes once full-body has run three Saturdays in a row."
      : "The four-day split below is the active program.";
  doc.fontSize(10).font("Helvetica").fillColor(DIM).text(statusText, PAGE.margins.left, y, { width: CONTENT_WIDTH });
  y = doc.y + 20;

  doc.fontSize(9).font("Helvetica-Bold").fillColor(FAINT).text("CONTENTS", PAGE.margins.left, y);
  y = doc.y + 6;
  for (const dest of destinations) {
    ensureSpace(16);
    doc.fontSize(10.5).font("Helvetica").fillColor(INK).text(dest.label, PAGE.margins.left + 4, y);
    doc.goTo(PAGE.margins.left, y - 2, CONTENT_WIDTH, 14, dest.name);
    y += 17;
  }

  const rootOutline = doc.outline.addItem("Naman - Program Reference");

  // ============================================================ SCHEDULE
  newPage();
  const scheduleOutline = rootOutline.addItem("Weekly Schedule");
  sectionHeader("Weekly Schedule", "dest-schedule");
  paragraph(
    "The week runs Monday to Sunday: four lifting sessions (Upper A, Lower A, Upper B, Lower B), two strictly-off days, and one flexible day you choose weekly (an easy run/walk, or mobility/core).",
  );
  subheader("The rules");
  bullets([
    "3 runs a week, in the morning, paired onto upper-body lift days (so the legs stay fresh for evening lifting).",
    "Never a run on a leg day.",
    "Never a run the day after a leg day - checked across the week boundary too, since the same shape repeats.",
    "Leg days are spaced apart from each other; so are upper days.",
  ]);
  paragraph(
    "A consequence worth knowing: with 3 runs, 2 off days, and no running on or after legs, the two leg days end up fully determined by whatever's left once run days and off days are chosen. The only real choice is which of the three run days is the flexible one.",
    { size: 9, color: FAINT },
  );
  subheader("Reference week (Upper/Lower split)");
  paragraph("Mon: Upper A + run   -   Tue: Lower A   -   Wed: off   -   Thu: run (flex)   -   Fri: Upper B + run   -   Sat: Lower B   -   Sun: off");

  // ============================================================ SESSIONS
  const sessionIntro: Record<SessionType, string> = {
    upper_a: "Push emphasis - horizontal/vertical pressing and pulling, shoulders, arms, core.",
    lower_a: "Squat emphasis - knee-dominant work, single-leg strength, calves, core.",
    upper_b: "Pull emphasis - rows and pull-ups lead, chest/shoulder accessory work, arms, core.",
    lower_b: "Hinge / unilateral emphasis - RDL pattern, single-leg work, calves, core, carries.",
    full_body: "Week 6 reset - one 30-minute session built around pull-ups, covering push/pull/legs/core in one pass.",
  };

  for (const sessionType of SESSION_ORDER) {
    newPage();
    const label = SESSION_LABELS[sessionType];
    scheduleOutline.addItem(label);
    sectionHeader(label, `dest-${sessionType}`);
    paragraph(sessionIntro[sessionType]);

    for (const templateEx of SESSION_TEMPLATES[sessionType]) {
      const exercise = exerciseByName.get(templateEx.exerciseName);
      const image = imageByName.get(templateEx.exerciseName);
      const mistakes = EXERCISE_FORM_GUIDE[templateEx.exerciseName]?.mistakes;

      const imgWidth = 130;
      const imgHeight = image ? Math.round(imgWidth * (1024 / 1536)) : 0;
      const textX = PAGE.margins.left;
      const textW = image ? CONTENT_WIDTH - imgWidth - 10 : CONTENT_WIDTH;

      // Measure before drawing anything, so ensureSpace (and the page break
      // it may trigger) happens BEFORE this block starts - and so the next
      // block's start position reflects how tall this one's text actually
      // wrapped to, not a guess. A guessed fixed height risks the next
      // exercise's title overlapping this one's last line of text whenever
      // a cue or mistake list wraps to more lines than expected.
      const titleH = doc.fontSize(11.5).font("Helvetica-Bold").heightOfString(
        `${templateEx.order}. ${templateEx.exerciseName}${templateEx.optional ? "  (optional)" : ""}`,
        { width: textW },
      );
      const unitH = doc.fontSize(9.5).font("Helvetica-Bold").heightOfString(unitLabel(templateEx), { width: textW });
      const cuesText = exercise?.cues ? sanitizeForPdf(exercise.cues) : null;
      const mistakesText = mistakes && mistakes.length > 0 ? sanitizeForPdf(mistakes.join("; ")) : null;
      const cuesH = cuesText ? doc.fontSize(9.5).font("Helvetica").heightOfString(cuesText, { width: textW }) : 0;
      const mistakesH = mistakesText
        ? doc.fontSize(8.5).font("Helvetica").heightOfString(`Avoid: ${mistakesText}`, { width: textW })
        : 0;
      const textBlockH = titleH + 1 + unitH + (cuesH ? 3 + cuesH : 0) + (mistakesH ? 4 + mistakesH : 0);
      const blockHeight = Math.max(textBlockH, imgHeight) + 14;

      ensureSpace(blockHeight);
      const blockStartY = y;

      doc
        .fontSize(11.5)
        .font("Helvetica-Bold")
        .fillColor(INK)
        .text(
          `${templateEx.order}. ${templateEx.exerciseName}${templateEx.optional ? "  (optional)" : ""}`,
          textX,
          y,
          { width: textW },
        );
      doc
        .fontSize(9.5)
        .font("Helvetica-Bold")
        .fillColor(GOOD)
        .text(unitLabel(templateEx), textX, doc.y + 1, { width: textW });

      if (cuesText) {
        doc.fontSize(9.5).font("Helvetica").fillColor(DIM).text(cuesText, textX, doc.y + 3, { width: textW });
      }
      if (mistakesText) {
        doc
          .fontSize(8.5)
          .font("Helvetica-Bold")
          .fillColor(BAD)
          .text("Avoid: ", textX, doc.y + 4, { continued: true, width: textW })
          .font("Helvetica")
          .fillColor(FAINT)
          .text(mistakesText);
      }

      if (image) {
        doc.image(image, PAGE.margins.left + textW + 10, blockStartY, { width: imgWidth, height: imgHeight, fit: [imgWidth, imgHeight] });
      }

      y = blockStartY + blockHeight;
      doc.moveTo(PAGE.margins.left, y - 6).lineTo(PAGE.margins.left + CONTENT_WIDTH, y - 6).strokeColor(LINE).stroke();
    }
  }

  // ============================================================ PROGRESSION
  newPage();
  rootOutline.addItem("How Progression Works");
  sectionHeader("How Progression Works", "dest-progression");
  paragraph(
    "Each exercise has a rep range (e.g. 8-15). The goal each session is simple: try to add a rep or two over last time, at the same weight, before adding load.",
  );
  subheader("The double-progression rule");
  bullets([
    "If a set falls below the range's minimum: reduce load or use an easier variation next time.",
    "If every set hits the top of the range AND you still have 2+ reps in reserve on all of them: progress - add a rep, slow the eccentric, add a pause, add a set, move to a harder variation, add a band, or add load (in that order, one lever at a time).",
    "Otherwise: hold - repeat the same weight and reps next time.",
  ]);
  subheader("What is RIR?");
  paragraph(
    'RIR = "Reps In Reserve" - how many more reps you could have done before failing on that set. 0 means you went to complete failure; 2 means you stopped with two good reps left in the tank. It is not the same thing as the numbered set (1, 2, 3) - it is what tells the app whether a set that hit the top of its rep range was genuinely easy (time to progress) or maximal effort (not yet). RIR must actually be logged for a set to count toward progressing - an unlogged RIR can\'t confirm reserve capacity.',
  );

  // ============================================================ MEALS
  newPage();
  rootOutline.addItem("Meals");
  sectionHeader("Meals", "dest-meals");
  paragraph(`Current phase: ${profile.mealPhase}. Meals below are what's actually offered on the Diet tab right now.`);
  for (const meal of visibleMeals) {
    ensureSpace(46);
    doc.fontSize(11).font("Helvetica-Bold").fillColor(INK).text(`${meal.time}   ${sanitizeForPdf(meal.name)}`, PAGE.margins.left, y);
    if (meal.description) {
      doc.fontSize(9.5).font("Helvetica").fillColor(DIM).text(sanitizeForPdf(meal.description), PAGE.margins.left, doc.y + 2, { width: CONTENT_WIDTH });
    }
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(FAINT)
      .text(`${meal.proteinG} g protein  -  ${meal.caloriesKcal} kcal  -  ${meal.fatG} g fat  -  ${meal.carbG} g carb`, PAGE.margins.left, doc.y + 2);
    y = doc.y + 12;
  }

  // ============================================================ CHECKLIST / SUPPLEMENTS
  newPage();
  rootOutline.addItem("Daily Checklist & Supplements");
  sectionHeader("Daily Checklist & Supplements", "dest-checklist");
  subheader("Checklist");
  bullets(
    checklistItems.map((c) => sanitizeForPdf(c.priority ? `${c.label} *` : c.label)),
  );
  subheader("Supplements");
  for (const s of supplements) {
    ensureSpace(30);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor(INK).text(sanitizeForPdf(s.name), PAGE.margins.left, y);
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(DIM)
      .text(sanitizeForPdf(`${s.dose}  -  ${s.timing}`), PAGE.margins.left, doc.y + 1);
    y = doc.y + 10;
  }

  doc.end();
  await new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });

  const stat = await fs.stat(OUT_PATH);
  console.log(`\nWrote ${OUT_PATH} (${(stat.size / 1024).toFixed(0)} KB)`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
