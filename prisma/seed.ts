/**
 * Seed data — BUILD_SPEC.md §10.
 *
 * Sources: 01-plan/02-full-programme.md (exercise tables, nutrition plan),
 * 01-plan/03-exercise-rationale.md (the "why" behind each swap).
 *
 * Session templates (upper_a/lower_a/upper_b/lower_b/full_body) live in
 * src/domain/sessionTemplates.ts as a static constant, not as seeded rows —
 * the §4 schema has no model for a reusable, date-less template, and §5.8
 * Settings never asks for session templates to be editable in the UI.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type ExerciseSeed = {
  name: string;
  muscleGroup: string;
  equipment: string;
  isUnilateral?: boolean;
  defaultSets: number;
  defaultRepsMin: number;
  defaultRepsMax: number;
  cues: string;
  rationale: string;
};

const EXERCISES: ExerciseSeed[] = [
  {
    name: "Pull-up",
    muscleGroup: "back_vertical",
    equipment: "pullup_bar",
    defaultSets: 4,
    defaultRepsMin: 1,
    defaultRepsMax: 12,
    cues: "Band-assisted, or slow 5-second negatives if you can't yet do one.",
    rationale:
      "Best vertical-pull builder you own; negatives build toward a full rep.",
  },
  {
    name: "Chin-up",
    muscleGroup: "back_vertical",
    equipment: "pullup_bar",
    defaultSets: 4,
    defaultRepsMin: 1,
    defaultRepsMax: 12,
    cues: "Palms toward you. Band-assist or negatives if needed.",
    rationale:
      "Best biceps + back builder you own — the palms-in grip adds biceps loading a pull-up doesn't.",
  },
  {
    name: "Deficit push-up",
    muscleGroup: "chest",
    equipment: "bodyweight",
    defaultSets: 4,
    defaultRepsMin: 8,
    defaultRepsMax: 15,
    cues: "Hands on two thick books/blocks so your chest drops below hand level.",
    rationale:
      "A flat push-up (or floor press) stops the elbow at the floor, cutting the stretch out of the movement. The deficit restores it — long muscle length is where the stimulus lives.",
  },
  {
    name: "Diamond push-up",
    muscleGroup: "chest",
    equipment: "bodyweight",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 15,
    cues: "Different hand angle from deficit push-up on purpose — more triceps bias.",
    rationale:
      "Rotates the pressing angle so twelve weeks don't groove a single movement pattern.",
  },
  {
    name: "Pike push-up",
    muscleGroup: "front_delt",
    equipment: "bodyweight",
    defaultSets: 3,
    defaultRepsMin: 6,
    defaultRepsMax: 12,
    cues:
      "Hips high, head between hands, lower the crown of your head toward the floor. Ladder: pike → feet on a chair → deficit pike → handstand push-up negatives.",
    rationale:
      "Scales bodyweight onto the shoulders with a clear progression ladder — the way past a 10 kg overhead-press ceiling, for free.",
  },
  {
    name: "DB floor press",
    muscleGroup: "chest",
    equipment: "dumbbell",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 15,
    cues: "Lie on the floor, 3-second lowering, pause when triceps touch, press.",
    rationale: "The 3-second eccentric is what makes 10 kg feel like 20.",
  },
  {
    name: "Band chest fly",
    muscleGroup: "chest",
    equipment: "band",
    defaultSets: 3,
    defaultRepsMin: 12,
    defaultRepsMax: 15,
    cues:
      "Band behind your back at chest height, arms wide and slightly bent, bring your hands together in front.",
    rationale:
      "Every press trains the chest with a bent elbow; only a fly trains adduction — bringing the arm across the body — which is the pec's actual primary job.",
  },
  {
    name: "Inverted row",
    muscleGroup: "back_horizontal",
    equipment: "bodyweight",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 15,
    cues:
      "Lie under a sturdy table or low bar, pull your chest to it, body straight. Easier: bend your knees. Harder: elevate your feet.",
    rationale:
      "Vertical pulls and horizontal rows train different parts of the back — this was the under-trained half of that pair.",
  },
  {
    name: "Single-arm DB row",
    muscleGroup: "back_horizontal",
    equipment: "dumbbell",
    isUnilateral: true,
    defaultSets: 4,
    defaultRepsMin: 10,
    defaultRepsMax: 12,
    cues: "Hand and knee on a chair, flat back, pull the DB to your hip, 1-second squeeze.",
    rationale: "Unilateral loading turns a light dumbbell into a real stimulus.",
  },
  {
    name: "DB Arnold press",
    muscleGroup: "front_delt",
    equipment: "dumbbell",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 12,
    cues: "Start palms-in at chin, rotate out as you press.",
    rationale:
      "Front delts already get plenty of indirect work from pressing; this is the direct dose.",
  },
  {
    name: "DB lateral raise",
    muscleGroup: "side_delt",
    equipment: "dumbbell",
    defaultSets: 4,
    defaultRepsMin: 12,
    defaultRepsMax: 20,
    cues:
      "Light, strict, lead with elbows. On the last set, after full reps, keep going with bottom-half-only partials to failure.",
    rationale:
      "Side delts create shoulder width — the thing that actually makes arms look bigger — and were the most under-trained muscle in the original plan. The lengthened-partial finisher squeezes more growth out of a dumbbell you'll outgrow fast.",
  },
  {
    name: "Band pull-apart",
    muscleGroup: "rear_delt",
    equipment: "band",
    defaultSets: 3,
    defaultRepsMin: 15,
    defaultRepsMax: 20,
    cues: "Arms straight, band at chest height, pull it apart until it touches your sternum.",
    rationale:
      "Direct antidote to nine hours a day at a desk; rear delts were trained only once a week before this.",
  },
  {
    name: "Band face pull",
    muscleGroup: "rear_delt",
    equipment: "band",
    defaultSets: 3,
    defaultRepsMin: 15,
    defaultRepsMax: 20,
    cues: "Pull to your forehead, elbows high, rotate outward at the end.",
    rationale: "Fixes desk posture and gives the rear delts a second weekly dose.",
  },
  {
    name: "Overhead triceps extension",
    muscleGroup: "triceps",
    equipment: "dumbbell",
    defaultSets: 3,
    defaultRepsMin: 12,
    defaultRepsMax: 15,
    cues: "Keep going overhead, not down.",
    rationale:
      "The overhead position stretches the triceps long head — the biggest of the three heads, and the one pushdowns and kickbacks barely reach.",
  },
  {
    name: "Bench dip",
    muscleGroup: "triceps",
    equipment: "bodyweight",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 15,
    cues: "Two chairs if you can. Don't go so deep your shoulders scream.",
    rationale: "Simple triceps volume that needs no equipment.",
  },
  {
    name: "Incline curl",
    muscleGroup: "biceps",
    equipment: "dumbbell",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 15,
    cues: "Sit leaning back, or let your arm hang behind your torso. Last set to actual failure.",
    rationale:
      "A standing curl gives the biceps almost no stretch at the bottom; this puts the arm in a lengthened position instead — same dumbbell, more stimulus.",
  },
  {
    name: "Hammer curl",
    muscleGroup: "biceps",
    equipment: "dumbbell",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 15,
    cues: "Neutral grip.",
    rationale: "Builds forearm and arm thickness a supinated curl doesn't reach as directly.",
  },
  {
    name: "Goblet squat",
    muscleGroup: "quads",
    equipment: "dumbbell",
    defaultSets: 4,
    defaultRepsMin: 10,
    defaultRepsMax: 15,
    cues: "One DB at chest, 3-second down, 1-second pause at the bottom, drive up.",
    rationale:
      "Once 10 kg is easy, add a loaded backpack or move to front-foot-elevated split squats — the load ceiling, not the movement, is the limit.",
  },
  {
    name: "Bulgarian split squat",
    muscleGroup: "quads",
    equipment: "dumbbell",
    isUnilateral: true,
    defaultSets: 3,
    defaultRepsMin: 8,
    defaultRepsMax: 12,
    cues: "Rear foot on a chair/sofa.",
    rationale:
      "Your best leg exercise: 20 kg on one leg is a real stimulus even with a light dumbbell pair.",
  },
  {
    name: "DB reverse lunge",
    muscleGroup: "quads",
    equipment: "dumbbell",
    isUnilateral: true,
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 12,
    cues: "Step back, not forward — easier on the knees.",
    rationale: "A knee-friendlier unilateral quad exercise to pair with the Bulgarian split squat.",
  },
  {
    name: "DB RDL",
    muscleGroup: "hams_hinge",
    equipment: "dumbbell",
    defaultSets: 3,
    defaultRepsMin: 12,
    defaultRepsMax: 15,
    cues: "Soft knees, push hips back, 3-second lowering, feel the hamstring stretch. Flat back throughout.",
    rationale: "Trains the hamstring at the hip — a different job from the knee-flexion work below.",
  },
  {
    name: "Single-leg RDL",
    muscleGroup: "hams_hinge",
    equipment: "dumbbell",
    isUnilateral: true,
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 12,
    cues: "Slow — balance is part of the exercise.",
    rationale: "Unilateral hip-hinge pattern that carries over directly to single-leg running mechanics.",
  },
  {
    name: "Nordic negative",
    muscleGroup: "hams_knee",
    equipment: "bodyweight",
    defaultSets: 3,
    defaultRepsMin: 8,
    defaultRepsMax: 12,
    cues: "Kneel, anchor your heels under something heavy, lower your torso forward as slowly as you can, catch yourself with your hands.",
    rationale:
      "RDLs train the hamstring at the hip; this trains it at the knee — a separate muscle head, and running 3x/week makes hamstring strength a real injury-protection concern.",
  },
  {
    name: "Band leg curl",
    muscleGroup: "hams_knee",
    equipment: "band",
    defaultSets: 3,
    defaultRepsMin: 12,
    defaultRepsMax: 15,
    cues: "Lie face down, band looped around one ankle and anchored behind you, curl your heel to your bum.",
    rationale:
      "Bands work well here — the hard part of a leg curl is at the top, exactly where a band is strongest.",
  },
  {
    name: "DB step-up",
    muscleGroup: "quads",
    equipment: "dumbbell",
    isUnilateral: true,
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 10,
    cues: "Chair or stairs. Drive through the heel of the top foot.",
    rationale: "A third unilateral quad pattern for variety and knee-friendly loading.",
  },
  {
    name: "Single-leg hip thrust",
    muscleGroup: "glutes",
    equipment: "bodyweight",
    isUnilateral: true,
    defaultSets: 3,
    defaultRepsMin: 12,
    defaultRepsMax: 20,
    cues: "Shoulders on the sofa edge.",
    rationale: "Loads the glute directly and far harder per side than a two-leg bridge.",
  },
  {
    name: "Standing calf raise",
    muscleGroup: "calves",
    equipment: "dumbbell",
    isUnilateral: true,
    defaultSets: 4,
    defaultRepsMin: 15,
    defaultRepsMax: 20,
    cues: "Off a step, holding 1 DB, 2-second pause at the bottom stretch. No bouncing.",
    rationale:
      "Straight-knee (standing) hits the gastrocnemius; most home programmes only ever train one of the two calf muscles.",
  },
  {
    name: "Seated calf raise",
    muscleGroup: "calves",
    equipment: "dumbbell",
    defaultSets: 4,
    defaultRepsMin: 15,
    defaultRepsMax: 20,
    cues: "DB on knees, 2-second pause at the bottom stretch.",
    rationale: "Bent-knee (seated) hits the soleus — the other calf muscle standing raises miss.",
  },
  {
    name: "Hanging knee raise",
    muscleGroup: "core_antiext",
    equipment: "pullup_bar",
    defaultSets: 3,
    defaultRepsMin: 8,
    defaultRepsMax: 15,
    cues:
      "Progression: knee raise → straight-leg raise → toes-to-bar. Tuck your pelvis under (posterior tilt) as you lift — that's what makes it abs rather than hip flexors.",
    rationale: "A spine-neutral ab exercise with a clear multi-month progression ladder.",
  },
  {
    name: "Hollow hold",
    muscleGroup: "core_antiext",
    equipment: "bodyweight",
    defaultSets: 3,
    defaultRepsMin: 30,
    defaultRepsMax: 30,
    cues: "Lower back pressed flat into the floor. (Seconds, not reps.)",
    rationale:
      "Anti-extension core work — the muscle's real job is resisting movement, not repeatedly flexing the spine.",
  },
  {
    name: "Dead bug",
    muscleGroup: "core_antiext",
    equipment: "bodyweight",
    defaultSets: 3,
    defaultRepsMin: 10,
    defaultRepsMax: 10,
    cues: "Lower back stays pressed into the floor. (Reps per side.)",
    rationale:
      "A McGill-style spine-sparing alternative to sit-ups/crunches, with the same training return and far better risk/reward.",
  },
  {
    name: "Side plank",
    muscleGroup: "core_antilat",
    equipment: "bodyweight",
    isUnilateral: true,
    defaultSets: 3,
    defaultRepsMin: 30,
    defaultRepsMax: 30,
    cues: "Per side. (Seconds, not reps.)",
    rationale: "Anti-lateral-flexion — the third pillar of a complete core, alongside anti-extension and anti-rotation.",
  },
  {
    name: "Long-lever plank",
    muscleGroup: "core_antiext",
    equipment: "bodyweight",
    defaultSets: 2,
    defaultRepsMin: 30,
    defaultRepsMax: 45,
    cues:
      "Walk your elbows forward past your shoulders. Replaces the standard plank once a normal plank is easy — add leverage, not time.",
    rationale: "Once a 45-second plank is easy, more time has sharply diminishing returns; more leverage doesn't.",
  },
  {
    name: "Pallof press",
    muscleGroup: "core_antirot",
    equipment: "band",
    isUnilateral: true,
    defaultSets: 3,
    defaultRepsMin: 12,
    defaultRepsMax: 12,
    cues:
      "Anchor the band at chest height to your side, hold it at your sternum, press it straight out and resist the twist. Per side.",
    rationale:
      "The missing third pillar of core training — anti-rotation. Bands suit it perfectly: the hardest point is arms-extended, exactly where a band is strongest.",
  },
  {
    name: "Suitcase carry",
    muscleGroup: "core_antilat",
    equipment: "dumbbell",
    isUnilateral: true,
    defaultSets: 2,
    defaultRepsMin: 30,
    defaultRepsMax: 40,
    cues:
      "One dumbbell, one hand, walk 30-40 m. Your torso wants to lean — the job is to stay upright. (Metres, not reps.)",
    rationale: "Anti-lateral-flexion under real load, plus grip and traps for free — better ROI than shrugs.",
  },
  {
    name: "Dead hang",
    muscleGroup: "back_vertical",
    equipment: "pullup_bar",
    defaultSets: 2,
    defaultRepsMin: 1,
    defaultRepsMax: 1,
    cues: "Hang from the bar, arms straight, feet off the floor, as long as you can.",
    rationale:
      "Builds the grip that usually fails before your back does on pull-ups, and decompresses the spine and shoulders after a desk day.",
  },
  {
    name: "Skipping",
    muscleGroup: "calves",
    equipment: "rope",
    defaultSets: 5,
    defaultRepsMin: 60,
    defaultRepsMax: 60,
    cues: "60 seconds on / 45 seconds off. (Seconds, not reps.)",
    rationale: "Conditioning finisher that also loads the calves.",
  },
];

const CHECKLIST_ITEMS: { key: string; label: string; priority: boolean }[] = [
  { key: "light", label: "15 min outdoor light within an hour of waking", priority: true },
  { key: "bed", label: "In bed by 12:30 AM", priority: true },
  { key: "caffeine", label: "No caffeine after 2 PM", priority: true },
  { key: "protein", label: "Hit protein target", priority: false },
  { key: "water", label: "Water target", priority: false },
  { key: "creatine", label: "Creatine", priority: false },
  { key: "b12", label: "B12", priority: false },
  { key: "omega3", label: "Omega-3", priority: false },
  { key: "finax_am", label: "Finax — 11 AM", priority: false },
  { key: "adgain", label: "Adgain Plus — 2:15 PM", priority: false },
  { key: "finax_pm", label: "Finax — 10 PM", priority: false },
  { key: "nosugar", label: "No added sugar", priority: false },
  { key: "nosmoke", label: "No cigarettes", priority: false },
  { key: "sleep7", label: "7+ hours sleep", priority: false },
];

const SUPPLEMENTS = [
  {
    name: "Vitamin B12 (methylcobalamin)",
    dose: "500–1,500 mcg",
    timing: "Morning, with food",
    status: "active",
    note: null,
  },
  {
    name: "Creatine monohydrate",
    dose: "5 g",
    timing: "Any time, daily incl. rest days",
    status: "active",
    note: "Saturates over weeks — consistency matters more than timing.",
  },
  {
    name: "Omega-3",
    dose: "1 tbsp ground flaxseed + 5 walnuts, or algal EPA/DHA 250–500 mg",
    timing: "With a meal",
    status: "active",
    note: null,
  },
  {
    name: "Vitamin D3",
    dose: "On hold — dose depends on retest",
    timing: "With a fatty meal, once restarted",
    status: "on_hold",
    note: "Do not restart until 25-OH vitamin D and calcium are retested.",
  },
  {
    name: "Finax 1 mg",
    dose: "1 mg",
    timing: "11 AM & 10 PM",
    status: "active",
    note: null,
  },
  {
    name: "Adgain Plus",
    dose: "As prescribed",
    timing: "2:15 PM, post-lunch",
    status: "active",
    note: null,
  },
];

const BLOOD_MARKERS: {
  panel: string;
  marker: string;
  value: number | null;
  unit: string | null;
  refLow: number | null;
  refHigh: number | null;
  flag: string | null;
  note?: string;
}[] = [
  { panel: "CBC", marker: "Haemoglobin", value: 14.7, unit: "g/dL", refLow: 13.0, refHigh: 17.0, flag: "normal" },
  { panel: "CBC", marker: "MCV", value: 82.8, unit: "fL", refLow: 83, refHigh: 101, flag: "low" },
  { panel: "CBC", marker: "MCH", value: 26.6, unit: "pg", refLow: 27, refHigh: 32, flag: "low" },
  { panel: "CBC", marker: "MCHC", value: 32.1, unit: "g/dL", refLow: 31.5, refHigh: 34.5, flag: "normal" },
  { panel: "CBC", marker: "RDW-CV", value: 13.9, unit: "%", refLow: 11.5, refHigh: 14.0, flag: "borderline" },
  { panel: "Lipid", marker: "Total cholesterol", value: 154, unit: "mg/dL", refLow: null, refHigh: 200, flag: "normal" },
  { panel: "Lipid", marker: "Triglycerides", value: 42, unit: "mg/dL", refLow: null, refHigh: 150, flag: "normal" },
  { panel: "Lipid", marker: "HDL", value: 52, unit: "mg/dL", refLow: 40, refHigh: null, flag: "normal" },
  { panel: "Lipid", marker: "LDL", value: 94, unit: "mg/dL", refLow: null, refHigh: 100, flag: "normal" },
  { panel: "Diabetes", marker: "Fasting glucose", value: 88, unit: "mg/dL", refLow: 70, refHigh: 99, flag: "normal" },
  { panel: "Diabetes", marker: "HbA1c", value: 5.6, unit: "%", refLow: 4, refHigh: 5.6, flag: "borderline" },
  { panel: "Kidney", marker: "Creatinine", value: 1.0, unit: "mg/dL", refLow: 0.7, refHigh: 1.3, flag: "normal" },
  { panel: "Kidney", marker: "BUN", value: 10, unit: "mg/dL", refLow: 9, refHigh: 23, flag: "normal" },
  { panel: "Kidney", marker: "BUN:Creatinine", value: 10.0, unit: "ratio", refLow: 12, refHigh: 20, flag: "low" },
  { panel: "Liver", marker: "Total protein", value: 8.3, unit: "g/dL", refLow: 5.7, refHigh: 8.2, flag: "high" },
  { panel: "Liver", marker: "Albumin", value: 5.15, unit: "g/dL", refLow: 3.2, refHigh: 4.8, flag: "high" },
  { panel: "Vitamins", marker: "Vitamin D (25-OH)", value: 10.0, unit: "ng/mL", refLow: 30, refHigh: 100, flag: "low" },
  { panel: "Vitamins", marker: "Vitamin B12", value: 298, unit: "pg/mL", refLow: 211, refHigh: 911, flag: "borderline" },
  { panel: "Vitamins", marker: "Calcium", value: 10.1, unit: "mg/dL", refLow: 8.7, refHigh: 10.4, flag: "normal" },
  { panel: "Thyroid", marker: "TSH", value: 0.741, unit: "uIU/mL", refLow: 0.55, refHigh: 4.78, flag: "normal" },
  { panel: "CBC", marker: "CRP", value: 1.2, unit: "mg/L", refLow: 0, refHigh: 3.3, flag: "normal" },
  { panel: "Iron", marker: "Serum iron", value: 133, unit: "µg/dL", refLow: 65, refHigh: 175, flag: "normal" },
  { panel: "Iron", marker: "TIBC", value: 366, unit: "µg/dL", refLow: 250, refHigh: 460, flag: "normal" },
  { panel: "Iron", marker: "Transferrin saturation", value: 36.34, unit: "%", refLow: 20, refHigh: 50, flag: "normal" },
  {
    panel: "Iron",
    marker: "Ferritin",
    value: null,
    unit: "ng/mL",
    refLow: 30,
    refHigh: 400,
    flag: null,
    note:
      "Not measured on the Feb 2026 panel — the highest-value missing test. Low iron stores would directly cap running performance, and red cells were already small (MCV 82.8, MCH 26.6). Ask for this alongside 25-OH vitamin D, calcium, B12, and homocysteine on the next blood draw.",
  },
];

const BLOOD_TEST_DATE = new Date("2026-02-06T00:00:00.000Z");

// August (dairy, no eggs) and September (eggs, 6–8 PM window) plans —
// 01-plan/02-full-programme.md §5.
const MEAL_PRESETS: {
  time: string;
  name: string;
  description?: string;
  proteinG: number;
  caloriesKcal: number;
  phase: "all" | "aug_dairy" | "sep_eggs";
  sortOrder: number;
}[] = [
  { time: "06:35", name: "Pre-run", description: "1 banana + black coffee", proteinG: 1, caloriesKcal: 105, phase: "all", sortOrder: 0 },
  {
    time: "07:45",
    name: "Breakfast",
    description: "50 g oats in 250 ml toned milk + 1 scoop whey + 1 tsp chia",
    proteinG: 40,
    caloriesKcal: 485,
    phase: "all",
    sortOrder: 1,
  },
  {
    time: "07:45",
    name: "Breakfast (besan chilla)",
    description: "2 besan chilla (60 g besan) + 150 g curd + 1 scoop whey",
    proteinG: 40,
    caloriesKcal: 485,
    phase: "all",
    sortOrder: 2,
  },
  {
    time: "07:45",
    name: "Breakfast (paneer bhurji)",
    description: "Paneer bhurji (100 g paneer) + 2 multigrain roti + 200 ml milk",
    proteinG: 40,
    caloriesKcal: 485,
    phase: "all",
    sortOrder: 3,
  },
  {
    time: "11:00",
    name: "Morning snack",
    description: "25 g roasted chana, or 1 apple + 8 almonds",
    proteinG: 5,
    caloriesKcal: 100,
    phase: "aug_dairy",
    sortOrder: 4,
  },
  {
    time: "13:30",
    name: "Lunch",
    description: "2 roti + 1 katori dal + 100 g cooked soya chunks (or 100 g paneer) + 1 katori sabzi + 150 g curd + salad",
    proteinG: 39,
    caloriesKcal: 685,
    phase: "aug_dairy",
    sortOrder: 5,
  },
  {
    time: "17:00",
    name: "Pre-workout snack",
    description: "1 apple + 20 g roasted chana, or 100 g sprouts chaat (no sev, no chutney)",
    proteinG: 5,
    caloriesKcal: 175,
    phase: "aug_dairy",
    sortOrder: 6,
  },
  {
    time: "20:15",
    name: "Post-workout shake",
    description: "1 scoop whey in 150 ml toned milk",
    proteinG: 29,
    caloriesKcal: 207,
    phase: "aug_dairy",
    sortOrder: 7,
  },
  {
    time: "21:30",
    name: "Dinner",
    description: "1 katori brown rice or 2 roti + rajma/chole (1.5 katori) + 80 g paneer tikka + sabzi + salad",
    proteinG: 35,
    caloriesKcal: 690,
    phase: "aug_dairy",
    sortOrder: 8,
  },
  {
    time: "18:15",
    name: "Pre-workout (eggs)",
    description: "2 boiled eggs + 1 apple — replaces the roasted chana",
    proteinG: 13,
    caloriesKcal: 190,
    phase: "sep_eggs",
    sortOrder: 6,
  },
  {
    time: "20:00",
    name: "Post-workout (eggs)",
    description: "3 whole eggs + 2 whites, bhurji or omelette, ≤1 tsp oil — replaces the whey shake",
    proteinG: 26,
    caloriesKcal: 260,
    phase: "sep_eggs",
    sortOrder: 7,
  },
  {
    time: "21:30",
    name: "Dinner (lighter)",
    description: "Rajma/chole + rice + sabzi + salad + 100 g curd — drop the paneer tikka",
    proteinG: 25,
    caloriesKcal: 550,
    phase: "sep_eggs",
    sortOrder: 8,
  },
];

// The fridge table from 01-plan/02-full-programme.md §5 — tap to add, set a
// quantity, protein/calories fill themselves in. No typing, no API calls.
const FOOD_ITEMS: {
  name: string;
  servingLabel: string;
  proteinG: number;
  caloriesKcal: number;
  note?: string;
}[] = [
  { name: "Soya chunks (dry)", servingLabel: "30 g", proteinG: 16, caloriesKcal: 105, note: "Best protein-per-rupee in India" },
  { name: "Whey", servingLabel: "1 scoop", proteinG: 24, caloriesKcal: 120 },
  { name: "Paneer", servingLabel: "100 g", proteinG: 18, caloriesKcal: 265 },
  { name: "Tofu (firm)", servingLabel: "100 g", proteinG: 12, caloriesKcal: 145 },
  { name: "Greek yogurt / hung curd", servingLabel: "150 g", proteinG: 15, caloriesKcal: 100 },
  { name: "Curd (dahi), toned", servingLabel: "150 g", proteinG: 5, caloriesKcal: 90 },
  { name: "Milk, toned", servingLabel: "250 ml", proteinG: 8, caloriesKcal: 145 },
  { name: "Rajma / chole (cooked)", servingLabel: "1 katori (150 g)", proteinG: 8.5, caloriesKcal: 130 },
  { name: "Dal — toor / moong / chana (cooked)", servingLabel: "1 katori (150 g)", proteinG: 7, caloriesKcal: 110 },
  { name: "Roasted chana", servingLabel: "30 g", proteinG: 6, caloriesKcal: 120 },
  { name: "Besan (gram flour)", servingLabel: "60 g", proteinG: 13, caloriesKcal: 215 },
  { name: "Peanuts", servingLabel: "30 g", proteinG: 8, caloriesKcal: 170 },
  { name: "Peanut butter", servingLabel: "15 g", proteinG: 4, caloriesKcal: 90 },
  { name: "Almonds", servingLabel: "15 g (~12)", proteinG: 3, caloriesKcal: 90 },
  { name: "Sprouted moong", servingLabel: "100 g", proteinG: 7, caloriesKcal: 100 },
  { name: "Oats", servingLabel: "60 g", proteinG: 8, caloriesKcal: 230 },
  { name: "Quinoa (cooked)", servingLabel: "1 katori", proteinG: 5, caloriesKcal: 130 },
  { name: "Roti (wheat)", servingLabel: "1 medium", proteinG: 3, caloriesKcal: 110 },
  { name: "Rice (cooked)", servingLabel: "1 katori", proteinG: 3, caloriesKcal: 135 },
  { name: "Egg, whole", servingLabel: "1 egg", proteinG: 6, caloriesKcal: 78 },
  { name: "Egg white", servingLabel: "1 white", proteinG: 3.6, caloriesKcal: 17 },
  { name: "Banana", servingLabel: "1 medium", proteinG: 1, caloriesKcal: 105 },
  { name: "Apple", servingLabel: "1 medium", proteinG: 0.5, caloriesKcal: 95 },
];

async function main() {
  // Profile — DOB is a placeholder (turns 24 on 1 Feb 2026); correct the
  // exact date in Settings once that screen exists.
  // These targets come from the plan, so re-seeding resets them to the plan's
  // values rather than preserving ad-hoc edits.
  const planTargets = {
    proteinTargetG: 125,
    calorieTargetKcal: 2450,
    waterTargetMl: 3500,
    mealPhase: "sep_eggs",
    bedtimeTarget: "00:30",
  };
  await prisma.profile.upsert({
    where: { id: 1 },
    update: planTargets,
    create: {
      id: 1,
      name: "Naman",
      dateOfBirth: new Date("2002-02-01T00:00:00.000Z"),
      heightCm: 172.7,
      sex: "male",
      timezone: "Asia/Kolkata",
      proteinPerKg: 2.1,
      ...planTargets,
    },
  });
  console.log("Seeded profile");

  for (const exercise of EXERCISES) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: exercise,
      create: exercise,
    });
  }
  console.log(`Seeded ${EXERCISES.length} exercises`);

  for (const [index, item] of CHECKLIST_ITEMS.entries()) {
    await prisma.checklistItem.upsert({
      where: { key: item.key },
      update: { label: item.label, priority: item.priority, sortOrder: index },
      create: { ...item, sortOrder: index },
    });
  }
  console.log(`Seeded ${CHECKLIST_ITEMS.length} checklist items`);

  for (const supplement of SUPPLEMENTS) {
    const existing = await prisma.supplement.findFirst({ where: { name: supplement.name } });
    if (existing) {
      await prisma.supplement.update({ where: { id: existing.id }, data: supplement });
    } else {
      await prisma.supplement.create({ data: supplement });
    }
  }
  console.log(`Seeded ${SUPPLEMENTS.length} supplements`);

  const existingMarkers = await prisma.bloodMarker.findMany({
    where: { testDate: BLOOD_TEST_DATE },
    select: { marker: true },
  });
  const existingMarkerNames = new Set(existingMarkers.map((m) => m.marker));
  const missingMarkers = BLOOD_MARKERS.filter((m) => !existingMarkerNames.has(m.marker));
  if (missingMarkers.length > 0) {
    await prisma.bloodMarker.createMany({
      data: missingMarkers.map((m) => ({ ...m, testDate: BLOOD_TEST_DATE })),
    });
  }
  console.log(
    `Seeded ${missingMarkers.length} new blood markers for ${BLOOD_TEST_DATE.toDateString()} (${existingMarkerNames.size} already present)`,
  );

  for (const preset of MEAL_PRESETS) {
    const existing = await prisma.mealPreset.findFirst({
      where: { name: preset.name, phase: preset.phase },
    });
    if (existing) {
      await prisma.mealPreset.update({ where: { id: existing.id }, data: preset });
    } else {
      await prisma.mealPreset.create({ data: preset });
    }
  }
  console.log(`Seeded ${MEAL_PRESETS.length} meal presets`);

  for (const [index, food] of FOOD_ITEMS.entries()) {
    await prisma.foodItem.upsert({
      where: { name: food.name },
      update: { ...food, sortOrder: index },
      create: { ...food, sortOrder: index },
    });
  }
  console.log(`Seeded ${FOOD_ITEMS.length} food items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
