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

  // Gym-equipment library expansion - not part of the 4-day home programme
  // above, just made available to add to any custom session via the
  // "Add an exercise" picker, for whenever gym equipment (barbell, cable,
  // machine, kettlebell) is actually accessible. Ported from a separate
  // personal project's exercise library at Naman's request.
  // CHEST
  { name: "Barbell bench press", muscleGroup: "chest", equipment: "barbell", defaultSets: 4, defaultRepsMin: 6, defaultRepsMax: 8, cues: "Feet flat, slight arch, bar to mid-chest, drive up and slightly back toward your face.", rationale: "The core horizontal press for raw chest and triceps strength - everything else here is an accessory to this." },
  { name: "Incline bench press", muscleGroup: "chest", equipment: "barbell", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Bench at 30-45 degrees, bar to the top of your chest, elbows tucked slightly.", rationale: "Shifts the load to the upper chest, the region flat pressing tends to undertrain." },
  { name: "Dumbbell fly", muscleGroup: "chest", equipment: "dumbbell", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Slight elbow bend held constant, lower until you feel a stretch across the chest, squeeze back together.", rationale: "Isolates the chest through a stretch the pressing movements can't reach." },
  { name: "Push-up", muscleGroup: "chest", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, cues: "Hands under shoulders, body in a straight line, chest to floor, no sagging hips.", rationale: "The baseline chest movement - a bodyweight entry point before progressing to Deficit or Diamond push-ups." },
  { name: "Cable crossover", muscleGroup: "chest", equipment: "cable", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Cables at chest height (or high-to-low), slight forward lean, bring hands together in front of your chest.", rationale: "Constant cable tension gives the chest a squeeze at full contraction that dumbbells and barbells can't." },
  { name: "Chest dip", muscleGroup: "chest", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Lean torso forward, elbows flared slightly, descend until a stretch in the chest, press back up.", rationale: "Loads the chest and front delts through a deeper range than any press machine allows." },
  { name: "Decline bench press", muscleGroup: "chest", equipment: "barbell", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Decline bench, bar to the lower chest, keep shoulder blades pinned back throughout.", rationale: "Targets the lower chest fibers a flat or incline press leaves undertrained." },

  // BACK - HORIZONTAL ROW
  { name: "Barbell row", muscleGroup: "back_horizontal", equipment: "barbell", defaultSets: 4, defaultRepsMin: 6, defaultRepsMax: 8, cues: "Hinge to about 45 degrees, pull the bar to your lower ribs, squeeze your shoulder blades together at the top.", rationale: "Heavier loading than any dumbbell row here, builds raw back thickness." },
  { name: "Seated cable row", muscleGroup: "back_horizontal", equipment: "cable", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Sit tall, drive elbows back past your ribs, pause and squeeze before returning under control.", rationale: "A constant-tension row that's easier on the lower back than a barbell row." },
  { name: "T-bar row", muscleGroup: "back_horizontal", equipment: "machine", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Chest supported or hinged forward, pull the handles to your sternum, control the negative.", rationale: "A heavier, more back-friendly row angle for building mid-back density." },
  { name: "Barbell shrug", muscleGroup: "back_horizontal", equipment: "barbell", defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, cues: "Straight arms, shrug straight up toward your ears, hold a beat at the top, lower slow.", rationale: "Direct trap loading that rows and pull-ups only hit indirectly." },

  // BACK - VERTICAL PULL
  { name: "Lat pulldown", muscleGroup: "back_vertical", equipment: "cable", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Grip slightly wider than shoulders, pull the bar to your upper chest, lead with your elbows down and back.", rationale: "A scalable vertical pull for building toward a strict pull-up, or for volume once pull-ups are easy." },

  // REAR DELTS
  { name: "Cable face pull", muscleGroup: "rear_delt", equipment: "cable", defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, cues: "Rope to eye level, pull apart and back so your hands finish by your ears, elbows high.", rationale: "Constant cable tension on the same movement as Band face pull - useful once band tension maxes out." },
  { name: "Reverse fly", muscleGroup: "rear_delt", equipment: "dumbbell", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Hinge forward, soft elbows, raise the dumbbells out to the sides, squeeze the shoulder blades.", rationale: "Direct rear-delt isolation to balance out all the front-loaded pressing." },

  // FRONT DELTS
  { name: "Overhead press", muscleGroup: "front_delt", equipment: "barbell", defaultSets: 4, defaultRepsMin: 6, defaultRepsMax: 8, cues: "Brace hard, press the bar straight up, tuck your head through once it clears your forehead.", rationale: "The main vertical press for building raw shoulder and triceps strength." },
  { name: "Front raise", muscleGroup: "front_delt", equipment: "dumbbell", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Slight bend in the elbows, raise the dumbbells to shoulder height, lower slow, don't swing.", rationale: "Isolates the front delts the overhead press only trains as a byproduct." },

  // BICEPS
  { name: "Barbell curl", muscleGroup: "biceps", equipment: "barbell", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Elbows pinned to your sides, curl the bar up without swinging your hips, squeeze at the top.", rationale: "Allows heavier loading than any single dumbbell curl variant here." },
  { name: "Dumbbell curl", muscleGroup: "biceps", equipment: "dumbbell", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Palms forward the whole way up, curl one or both arms, keep elbows still.", rationale: "The standard supinated curl - a different stimulus from the neutral-grip Hammer curl already in the program." },
  { name: "Preacher curl", muscleGroup: "biceps", equipment: "ez_bar", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Arms flat on the pad, curl up without letting your elbows lift off, control the lowering.", rationale: "Locks the elbows in place, removing all momentum for a stricter bicep contraction." },
  { name: "Concentration curl", muscleGroup: "biceps", equipment: "dumbbell", isUnilateral: true, defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Per side. Elbow braced against your inner thigh, curl slow, squeeze hard at the top.", rationale: "The strictest bicep isolation there is - no other muscle can help." },

  // TRICEPS
  { name: "Tricep pushdown", muscleGroup: "triceps", equipment: "cable", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Elbows pinned to your sides, push the bar down to full lock-out, control it back up.", rationale: "Constant cable tension for triceps volume without taxing the shoulders or chest." },
  { name: "Skull crusher", muscleGroup: "triceps", equipment: "ez_bar", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Lying down, lower the bar to your forehead by bending only your elbows, keep your upper arms still.", rationale: "A heavier, lying triceps builder to complement the standing Overhead triceps extension." },
  { name: "Close grip bench press", muscleGroup: "triceps", equipment: "barbell", defaultSets: 3, defaultRepsMin: 6, defaultRepsMax: 8, cues: "Hands just inside shoulder width, elbows tucked, lower to your lower chest and press.", rationale: "Lets you load the triceps with real bench-press weight instead of isolation-only loads." },
  { name: "Parallel bar dip", muscleGroup: "triceps", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Torso upright, elbows tucked close, dip until your upper arms are parallel to the floor, press back up.", rationale: "A harder, full-range progression from Bench dip once bodyweight bench dips get easy." },

  // QUADS
  { name: "Barbell squat", muscleGroup: "quads", equipment: "barbell", defaultSets: 4, defaultRepsMin: 6, defaultRepsMax: 8, cues: "Bar on your upper back, brace, squat to at least parallel, drive up through your whole foot.", rationale: "The foundational barbell lift for leg strength - loads far beyond what a goblet squat allows." },
  { name: "Leg press", muscleGroup: "quads", equipment: "machine", defaultSets: 4, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Feet shoulder-width on the platform, lower until your knees hit 90 degrees, press without locking out hard.", rationale: "Lets you push quad volume safely once your lower back is fatigued from squatting." },
  { name: "Leg extension", muscleGroup: "quads", equipment: "machine", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Sit back, extend your legs fully, pause a beat at the top, lower under control.", rationale: "Pure quad isolation to finish a leg day when compound lifts are done." },
  { name: "Walking lunge", muscleGroup: "quads", equipment: "bodyweight", isUnilateral: true, defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Per leg. Step forward into a lunge, back knee just short of the floor, push through the front heel to the next step.", rationale: "A moving, unilateral quad and glute builder - a different demand than the static DB reverse lunge already in the program." },

  // HAMSTRINGS - KNEE FLEXION
  { name: "Machine leg curl", muscleGroup: "hams_knee", equipment: "machine", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Lie face down (or seated), curl the pad to your glutes, pause, lower slow.", rationale: "Heavier, more consistent hamstring loading than a band leg curl once the band gets too easy." },

  // HAMSTRINGS - HIP HINGE
  { name: "Deadlift", muscleGroup: "hams_hinge", equipment: "barbell", defaultSets: 4, defaultRepsMin: 5, defaultRepsMax: 5, cues: "Bar over mid-foot, flat back, drive the floor away with your legs before your back finishes the pull.", rationale: "The single best full-posterior-chain strength builder - nothing else here loads the hips and back this heavy." },
  { name: "Barbell RDL", muscleGroup: "hams_hinge", equipment: "barbell", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Soft knees, push your hips back, bar stays close to your legs, feel the hamstring stretch before standing tall.", rationale: "Lets you load the hip hinge heavier than a dumbbell RDL once dumbbells run out of weight." },
  { name: "Kettlebell swing", muscleGroup: "hams_hinge", equipment: "kettlebell", defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, cues: "Hinge, snap your hips forward hard, let the bell float to chest height from hip drive, not your arms.", rationale: "A ballistic hip-hinge that builds explosive posterior-chain power the slow RDLs don't train." },

  // GLUTES
  { name: "Sumo squat", muscleGroup: "glutes", equipment: "barbell", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 12, cues: "Wide stance, toes turned out, sit straight down between your knees, keep your chest tall.", rationale: "The wide stance shifts load onto the glutes and adductors more than a goblet squat does." },
  { name: "Barbell hip thrust", muscleGroup: "glutes", equipment: "barbell", defaultSets: 4, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Upper back on a bench, drive your hips up until your body is a straight line, squeeze your glutes hard at the top.", rationale: "Lets you load the glutes far heavier than the bodyweight Single-leg hip thrust allows." },
  { name: "Glute bridge", muscleGroup: "glutes", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, cues: "Feet flat, knees bent, drive your hips up by squeezing your glutes, don't arch your lower back.", rationale: "A simple bilateral glute activator and a natural stepping stone toward Barbell hip thrust." },
  { name: "Cable kickback", muscleGroup: "glutes", equipment: "cable", isUnilateral: true, defaultSets: 3, defaultRepsMin: 12, defaultRepsMax: 15, cues: "Per side. Cuff on your ankle, hinge slightly forward, kick your leg straight back squeezing the glute.", rationale: "Constant cable tension isolates the glute through a range no squat or bridge variation matches." },

  // CALVES
  { name: "Machine calf raise", muscleGroup: "calves", equipment: "machine", defaultSets: 4, defaultRepsMin: 12, defaultRepsMax: 15, cues: "Balls of your feet on the platform, drop your heels for a full stretch, rise as high as you can, pause.", rationale: "Lets you keep progressing calf load once dumbbells stop being heavy enough for Standing calf raise." },

  // CORE - ANTI-EXTENSION
  { name: "Standard plank", muscleGroup: "core_antiext", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 45, defaultRepsMax: 45, cues: "Forearms and toes down, straight line from head to heels, brace like you're about to be punched. (Seconds, not reps.)", rationale: "The baseline anti-extension hold - a stepping stone to the harder Long-lever plank already in the program." },
  { name: "Crunch", muscleGroup: "core_antiext", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 15, defaultRepsMax: 20, cues: "Hands lightly behind your head, curl your shoulder blades off the floor, don't yank your neck.", rationale: "A simple, familiar anti-extension movement for days you want core volume without a hold." },
  { name: "Hanging straight-leg raise", muscleGroup: "core_antiext", equipment: "pullup_bar", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 12, cues: "Hang from the bar, keep your legs straight, raise them to hip height or higher without swinging.", rationale: "A harder progression from Hanging knee raise once bent-knee raises stop being a challenge." },
  { name: "Mountain climber", muscleGroup: "core_antiext", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 30, defaultRepsMax: 30, cues: "Plank position, drive your knees to your chest alternating fast, keep your hips down. (Seconds, not reps.)", rationale: "Turns a static core hold into a conditioning movement without changing the anti-extension demand." },
  { name: "Ab wheel rollout", muscleGroup: "core_antiext", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Kneeling, roll the wheel forward keeping your core braced and back flat, roll out only as far as you can control back.", rationale: "One of the hardest anti-extension challenges there is - a long-term ceiling once planks max out." },

  // CORE - ANTI-LATERAL FLEXION
  { name: "Farmer's walk", muscleGroup: "core_antilat", equipment: "dumbbell", defaultSets: 3, defaultRepsMin: 45, defaultRepsMax: 45, cues: "A heavy dumbbell in each hand, walk tall with shoulders back, don't let your torso lean or sway. (Seconds, not reps.)", rationale: "A bilateral loaded carry that trains anti-lateral-flexion and grip together, a step up in load from the single-side Suitcase carry." },

  // CORE - ANTI-ROTATION
  { name: "Russian twist", muscleGroup: "core_antirot", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 20, defaultRepsMax: 20, cues: "Feet off the floor if you can, rotate the weight side to side, move from your torso, not just your arms.", rationale: "A rotational core movement that complements the anti-rotation work Pallof press already covers." },

  // CARDIO
  { name: "Running", muscleGroup: "cardio", equipment: "bodyweight", defaultSets: 1, defaultRepsMin: 1200, defaultRepsMax: 1200, cues: "Steady pace you can hold for the full 20 minutes, or alternate hard/easy in intervals. (Seconds, not reps - defaultReps encodes duration.)", rationale: "Baseline aerobic conditioning that nothing else in the library covers at this duration." },
  { name: "Rowing machine", muscleGroup: "cardio", equipment: "rowing_machine", defaultSets: 1, defaultRepsMin: 600, defaultRepsMax: 600, cues: "Legs-back-arms on the drive, arms-back-legs on the return, steady pace for the full 10 minutes. (Seconds, not reps - defaultReps encodes duration.)", rationale: "Low-impact, full-body cardio that's easier on the joints than running." },
  { name: "Cycling", muscleGroup: "cardio", equipment: "bike", defaultSets: 1, defaultRepsMin: 900, defaultRepsMax: 900, cues: "Steady cadence you can hold for the full 15 minutes, resistance high enough that the last few minutes are hard. (Seconds, not reps - defaultReps encodes duration.)", rationale: "Another low-impact aerobic option for days the joints need a break from running." },
  { name: "Jumping jacks", muscleGroup: "cardio", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 60, defaultRepsMax: 60, cues: "Full arm and leg extension each rep, steady rhythm for the full 60 seconds. (Seconds, not reps.)", rationale: "A no-equipment warm-up or conditioning filler for days without a jump rope." },

  // FULL BODY / CONDITIONING
  { name: "Burpee", muscleGroup: "full_body", equipment: "bodyweight", defaultSets: 3, defaultRepsMin: 10, defaultRepsMax: 10, cues: "Drop to a plank, chest to floor, jump feet back to your hands, explode up into a jump.", rationale: "The single densest full-body conditioning movement in the library - no equipment, maximum heart rate." },
  { name: "Box jump", muscleGroup: "full_body", equipment: "box", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Swing your arms, jump onto the box landing soft with bent knees, step back down - don't jump down.", rationale: "Builds explosive lower-body power that slow strength lifts don't train." },
  { name: "Battle ropes", muscleGroup: "full_body", equipment: "battle_rope", defaultSets: 3, defaultRepsMin: 30, defaultRepsMax: 30, cues: "Athletic stance, whip the ropes in alternating waves as hard as you can. (Seconds, not reps.)", rationale: "A brutal upper-body conditioning finisher with zero impact on the joints." },
  { name: "Clean & press", muscleGroup: "full_body", equipment: "barbell", defaultSets: 4, defaultRepsMin: 5, defaultRepsMax: 6, cues: "Pull the bar from the floor to your shoulders in one motion, then drive it overhead - reset between reps.", rationale: "A full-body power movement that builds explosiveness the slow lifts in this library can't." },
  { name: "Thruster", muscleGroup: "full_body", equipment: "barbell", defaultSets: 3, defaultRepsMin: 8, defaultRepsMax: 10, cues: "Front squat down, then use the drive out of the bottom to press the bar straight overhead.", rationale: "Combines a squat and a press into one movement for maximum conditioning stimulus per rep." },
  { name: "Turkish get-up", muscleGroup: "full_body", equipment: "kettlebell", isUnilateral: true, defaultSets: 3, defaultRepsMin: 5, defaultRepsMax: 5, cues: "Per side. From lying to standing keeping the weight locked overhead the entire time, then reverse it back down.", rationale: "A slow, complex full-body movement that builds shoulder stability and total-body control other lifts don't touch." },
];

const CHECKLIST_ITEMS: { key: string; label: string; priority: boolean }[] = [
  { key: "light", label: "15 min outdoor light within an hour of waking", priority: true },
  { key: "bed", label: "In bed by 1 AM", priority: true },
  { key: "caffeine", label: "No caffeine after 3 PM", priority: true },
  { key: "protein", label: "Hit protein target", priority: false },
  { key: "water", label: "Water target", priority: false },
  { key: "creatine", label: "Creatine", priority: false },
  { key: "b12", label: "B12", priority: false },
  { key: "omega3", label: "Omega-3", priority: false },
  { key: "finax_am", label: "Finax - 11 AM", priority: false },
  { key: "adgain", label: "Adgain Plus - 2:15 PM", priority: false },
  { key: "finax_pm", label: "Finax - 10 PM", priority: false },
  { key: "nosugar", label: "No added sugar", priority: false },
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
  fatG: number;
  carbG: number;
  phase: "all" | "aug_dairy" | "sep_eggs";
  sortOrder: number;
}[] = [
  { time: "06:35", name: "Pre-run", description: "1 banana + black coffee", proteinG: 1, caloriesKcal: 105, fatG: 0.3, carbG: 25, phase: "all", sortOrder: 0 },
  {
    time: "07:45",
    name: "Breakfast",
    description: "50 g oats in 250 ml toned milk + 1 scoop whey + 1 tsp chia",
    proteinG: 40,
    caloriesKcal: 485,
    fatG: 11.5,
    carbG: 54,
    phase: "all",
    sortOrder: 1,
  },
  {
    time: "07:45",
    name: "Breakfast (besan chilla)",
    description: "2 besan chilla (60 g besan) + 150 g curd + 1 scoop whey",
    proteinG: 40,
    caloriesKcal: 485,
    fatG: 12,
    carbG: 54,
    phase: "all",
    sortOrder: 2,
  },
  {
    time: "07:45",
    name: "Breakfast (paneer bhurji)",
    description: "Paneer bhurji (100 g paneer) + 2 multigrain roti + 200 ml milk",
    proteinG: 40,
    caloriesKcal: 485,
    fatG: 20,
    carbG: 36,
    phase: "all",
    sortOrder: 3,
  },
  {
    time: "11:00",
    name: "Morning snack",
    description: "25 g roasted chana, or 1 apple + 8 almonds",
    proteinG: 5,
    caloriesKcal: 100,
    fatG: 3,
    carbG: 13,
    phase: "aug_dairy",
    sortOrder: 4,
  },
  {
    time: "13:30",
    name: "Lunch",
    description: "2 roti + 1 katori dal + 100 g cooked soya chunks (or 100 g paneer) + 1 katori sabzi + 150 g curd + salad",
    proteinG: 39,
    caloriesKcal: 685,
    fatG: 18,
    carbG: 92,
    phase: "aug_dairy",
    sortOrder: 5,
  },
  {
    time: "17:00",
    name: "Pre-workout snack",
    description: "1 apple + 20 g roasted chana, or 100 g sprouts chaat (no sev, no chutney)",
    proteinG: 5,
    caloriesKcal: 175,
    fatG: 3,
    carbG: 32,
    phase: "aug_dairy",
    sortOrder: 6,
  },
  {
    time: "20:15",
    name: "Post-workout shake",
    description: "1 scoop whey in 150 ml toned milk",
    proteinG: 29,
    caloriesKcal: 207,
    fatG: 5.7,
    carbG: 10,
    phase: "aug_dairy",
    sortOrder: 7,
  },
  {
    time: "21:30",
    name: "Dinner",
    description: "1 katori brown rice or 2 roti + rajma/chole (1.5 katori) + 80 g paneer tikka + sabzi + salad",
    proteinG: 35,
    caloriesKcal: 690,
    fatG: 18,
    carbG: 97,
    phase: "aug_dairy",
    sortOrder: 8,
  },
  {
    time: "18:15",
    name: "Pre-workout (eggs)",
    description: "2 boiled eggs + 1 apple — replaces the roasted chana",
    proteinG: 13,
    caloriesKcal: 190,
    fatG: 7,
    carbG: 19,
    phase: "sep_eggs",
    sortOrder: 6,
  },
  {
    time: "20:00",
    name: "Post-workout (eggs)",
    description: "3 whole eggs + 2 whites, bhurji or omelette, ≤1 tsp oil — replaces the whey shake",
    proteinG: 26,
    caloriesKcal: 260,
    fatG: 16,
    carbG: 2,
    phase: "sep_eggs",
    sortOrder: 7,
  },
  {
    time: "21:30",
    name: "Dinner (lighter)",
    description: "Rajma/chole + rice + sabzi + salad + 100 g curd — drop the paneer tikka",
    proteinG: 25,
    caloriesKcal: 550,
    fatG: 12,
    carbG: 85,
    phase: "sep_eggs",
    sortOrder: 8,
  },
];

// The fridge table from 01-plan/02-full-programme.md §5 — tap to add, set a
// quantity, protein/calories/fat/carbs scale from `baseAmount` automatically.
// unitType "gram" scales continuously (any amount typed); "piece" scales in
// discrete units (scoops, katoris, medium fruit, eggs) - unitLabel is just
// the display suffix either way. Fat/carb figures are standard per-item
// nutrition estimates, not lab-measured - close enough for tracking against
// a target, not a substitute for a food label.
const FOOD_ITEMS: {
  name: string;
  servingLabel: string;
  unitType: "gram" | "piece";
  unitLabel: string;
  baseAmount: number;
  proteinG: number;
  caloriesKcal: number;
  fatG: number;
  carbG: number;
  note?: string;
}[] = [
  { name: "Soya chunks (dry)", servingLabel: "30 g", unitType: "gram", unitLabel: "g", baseAmount: 30, proteinG: 16, caloriesKcal: 105, fatG: 1, carbG: 9, note: "Best protein-per-rupee in India" },
  { name: "Whey", servingLabel: "1 scoop", unitType: "piece", unitLabel: "scoop", baseAmount: 1, proteinG: 24, caloriesKcal: 120, fatG: 1.5, carbG: 3 },
  { name: "Paneer", servingLabel: "100 g", unitType: "gram", unitLabel: "g", baseAmount: 100, proteinG: 18, caloriesKcal: 265, fatG: 20, carbG: 1.5 },
  { name: "Tofu (firm)", servingLabel: "100 g", unitType: "gram", unitLabel: "g", baseAmount: 100, proteinG: 12, caloriesKcal: 145, fatG: 9, carbG: 3 },
  { name: "Greek yogurt / hung curd", servingLabel: "150 g", unitType: "gram", unitLabel: "g", baseAmount: 150, proteinG: 15, caloriesKcal: 100, fatG: 2, carbG: 6 },
  { name: "Curd (dahi), toned", servingLabel: "150 g", unitType: "gram", unitLabel: "g", baseAmount: 150, proteinG: 5, caloriesKcal: 90, fatG: 4.5, carbG: 7 },
  { name: "Milk, toned", servingLabel: "250 ml", unitType: "gram", unitLabel: "ml", baseAmount: 250, proteinG: 8, caloriesKcal: 145, fatG: 7, carbG: 12 },
  { name: "Rajma / chole (cooked)", servingLabel: "1 katori (150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 8.5, caloriesKcal: 130, fatG: 0.5, carbG: 22 },
  { name: "Dal — toor / moong / chana (cooked)", servingLabel: "1 katori (150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 7, caloriesKcal: 110, fatG: 0.4, carbG: 19 },
  { name: "Roasted chana", servingLabel: "30 g", unitType: "gram", unitLabel: "g", baseAmount: 30, proteinG: 6, caloriesKcal: 120, fatG: 2, carbG: 19 },
  { name: "Besan (gram flour)", servingLabel: "60 g", unitType: "gram", unitLabel: "g", baseAmount: 60, proteinG: 13, caloriesKcal: 215, fatG: 3.6, carbG: 34 },
  { name: "Peanuts", servingLabel: "30 g", unitType: "gram", unitLabel: "g", baseAmount: 30, proteinG: 8, caloriesKcal: 170, fatG: 13, carbG: 5 },
  { name: "Peanut butter", servingLabel: "15 g", unitType: "gram", unitLabel: "g", baseAmount: 15, proteinG: 4, caloriesKcal: 90, fatG: 6.8, carbG: 3 },
  { name: "Almonds", servingLabel: "15 g (~12)", unitType: "gram", unitLabel: "g", baseAmount: 15, proteinG: 3, caloriesKcal: 90, fatG: 7.5, carbG: 3 },
  { name: "Sprouted moong", servingLabel: "100 g", unitType: "gram", unitLabel: "g", baseAmount: 100, proteinG: 7, caloriesKcal: 100, fatG: 0.4, carbG: 17 },
  { name: "Oats", servingLabel: "60 g", unitType: "gram", unitLabel: "g", baseAmount: 60, proteinG: 8, caloriesKcal: 230, fatG: 4.2, carbG: 41 },
  { name: "Quinoa (cooked)", servingLabel: "1 katori", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 5, caloriesKcal: 130, fatG: 1.5, carbG: 24 },
  { name: "Roti (wheat)", servingLabel: "1 medium", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 3, caloriesKcal: 110, fatG: 2.5, carbG: 18 },
  { name: "Rice (cooked)", servingLabel: "1 katori", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 3, caloriesKcal: 135, fatG: 0.3, carbG: 30 },
  { name: "Egg, whole", servingLabel: "1 egg", unitType: "piece", unitLabel: "egg", baseAmount: 1, proteinG: 6, caloriesKcal: 78, fatG: 5.5, carbG: 0.6 },
  { name: "Egg white", servingLabel: "1 white", unitType: "piece", unitLabel: "white", baseAmount: 1, proteinG: 3.6, caloriesKcal: 17, fatG: 0.1, carbG: 0.2 },
  { name: "Banana", servingLabel: "1 medium", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 1, caloriesKcal: 105, fatG: 0.4, carbG: 24 },
  { name: "Apple", servingLabel: "1 medium", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 0.5, caloriesKcal: 95, fatG: 0.3, carbG: 22 },

  // Expansion round 2 - more sabzis, dals, grains, dairy, fruit, nuts and
  // common protein snacks, still within the same Indian-vegetarian + eggs
  // + whey framework as the original 23 items above.
  { name: "Bhindi (okra) sabzi", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 3, caloriesKcal: 100, fatG: 5, carbG: 10 },
  { name: "Palak sabzi", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 4, caloriesKcal: 80, fatG: 5, carbG: 4 },
  { name: "Gobi (cauliflower) sabzi", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 3, caloriesKcal: 90, fatG: 5.5, carbG: 8 },
  { name: "Mixed veg sabzi", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 4, caloriesKcal: 130, fatG: 5, carbG: 18 },
  { name: "Aloo (potato) sabzi", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 3, caloriesKcal: 180, fatG: 7, carbG: 26 },
  { name: "Masoor dal (cooked)", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 14, caloriesKcal: 220, fatG: 5.5, carbG: 30 },
  { name: "Urad dal (cooked)", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 13, caloriesKcal: 210, fatG: 5.5, carbG: 27 },
  { name: "Kala chana (black chickpeas, cooked)", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 13, caloriesKcal: 290, fatG: 9, carbG: 41 },
  { name: "Moth beans (matki, cooked)", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 14, caloriesKcal: 220, fatG: 6, carbG: 30 },
  { name: "Jowar roti", servingLabel: "1 medium roti", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 5, caloriesKcal: 175, fatG: 1, carbG: 36 },
  { name: "Bajra roti", servingLabel: "1 medium roti", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 6, caloriesKcal: 180, fatG: 2.5, carbG: 34 },
  { name: "Poha (cooked)", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 4, caloriesKcal: 210, fatG: 8, carbG: 32 },
  { name: "Upma (cooked)", servingLabel: "1 katori (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 4, caloriesKcal: 185, fatG: 7, carbG: 26 },
  { name: "Brown rice (cooked)", servingLabel: "100 g", unitType: "gram", unitLabel: "g", baseAmount: 100, proteinG: 2.6, caloriesKcal: 112, fatG: 0.9, carbG: 23 },
  { name: "Multigrain bread", servingLabel: "1 slice (~30 g)", unitType: "piece", unitLabel: "slice", baseAmount: 1, proteinG: 3, caloriesKcal: 76, fatG: 1, carbG: 13 },
  { name: "Paneer (low-fat)", servingLabel: "100 g", unitType: "gram", unitLabel: "g", baseAmount: 100, proteinG: 18, caloriesKcal: 154, fatG: 8, carbG: 3 },
  { name: "Buttermilk / chaas", servingLabel: "1 glass (~200 ml)", unitType: "piece", unitLabel: "glass", baseAmount: 1, proteinG: 3, caloriesKcal: 55, fatG: 3, carbG: 4 },
  { name: "Cheese slice", servingLabel: "1 slice (~20 g)", unitType: "piece", unitLabel: "slice", baseAmount: 1, proteinG: 3.3, caloriesKcal: 65, fatG: 5, carbG: 1 },
  { name: "Mango", servingLabel: "1 medium (~150 g edible)", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 1, caloriesKcal: 95, fatG: 0.5, carbG: 22 },
  { name: "Papaya", servingLabel: "1 katori diced (~150 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 1, caloriesKcal: 70, fatG: 0.3, carbG: 16 },
  { name: "Orange", servingLabel: "1 medium (~130 g edible)", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 1, caloriesKcal: 62, fatG: 0.2, carbG: 15 },
  { name: "Guava", servingLabel: "1 medium (~100 g)", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 2.6, caloriesKcal: 72, fatG: 1, carbG: 14 },
  { name: "Walnuts", servingLabel: "6 halves (~15 g)", unitType: "piece", unitLabel: "half", baseAmount: 6, proteinG: 2.3, caloriesKcal: 98, fatG: 9.8, carbG: 2 },
  { name: "Cashews", servingLabel: "10 pieces (~15 g)", unitType: "piece", unitLabel: "piece", baseAmount: 10, proteinG: 2.7, caloriesKcal: 83, fatG: 6.6, carbG: 4.5 },
  { name: "Chia seeds", servingLabel: "1 tbsp (~12 g)", unitType: "piece", unitLabel: "tbsp", baseAmount: 1, proteinG: 2, caloriesKcal: 58, fatG: 3.7, carbG: 5 },
  { name: "Idli", servingLabel: "2 pieces (~80 g)", unitType: "piece", unitLabel: "piece", baseAmount: 2, proteinG: 4, caloriesKcal: 78, fatG: 0.5, carbG: 16 },
  { name: "Dosa (plain)", servingLabel: "1 medium", unitType: "piece", unitLabel: "medium", baseAmount: 1, proteinG: 3, caloriesKcal: 140, fatG: 5, carbG: 22 },
  { name: "Sattu (roasted chana flour)", servingLabel: "2 tbsp (~20 g)", unitType: "piece", unitLabel: "tbsp", baseAmount: 2, proteinG: 4, caloriesKcal: 76, fatG: 1, carbG: 13 },
  { name: "Soy milk (unsweetened)", servingLabel: "1 glass (~200 ml)", unitType: "piece", unitLabel: "glass", baseAmount: 1, proteinG: 6.6, caloriesKcal: 82, fatG: 3.6, carbG: 5 },
  { name: "Edamame (boiled, shelled)", servingLabel: "1 katori (~100 g)", unitType: "piece", unitLabel: "katori", baseAmount: 1, proteinG: 11, caloriesKcal: 121, fatG: 5.2, carbG: 9 },
];

async function main() {
  // Profile — DOB is a placeholder (turns 24 on 1 Feb 2026); correct the
  // exact date in Settings once that screen exists.
  // These targets come from the plan, so re-seeding resets them to the plan's
  // values rather than preserving ad-hoc edits.
  const planTargets = {
    proteinTargetG: 125,
    calorieTargetKcal: 2450,
    waterTargetMl: 4000,
    mealPhase: "sep_eggs",
    bedtimeTarget: "01:00",
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
  // Retire anything no longer in the list. Deactivated rather than deleted:
  // ChecklistLog rows reference the key, so a delete would either fail on the
  // foreign key or throw away the history of a habit that was tracked for
  // months. `active: false` is what the app already filters on.
  const retired = await prisma.checklistItem.updateMany({
    where: { key: { notIn: CHECKLIST_ITEMS.map((i) => i.key) }, active: true },
    data: { active: false },
  });
  console.log(
    `Seeded ${CHECKLIST_ITEMS.length} checklist items` +
      (retired.count > 0 ? `, retired ${retired.count}` : ""),
  );

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
