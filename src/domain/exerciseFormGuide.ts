/** Form-guide content for the exercise library - pure static data, no I/O.
 * Written from each exercise's own cues/rationale already in the seeded
 * Exercise rows (see prisma/seed.ts EXERCISES), expanded into numbered
 * steps and common mistakes. Keyed by the exact Exercise.name string. */

export type FormGuide = {
  steps: string[];
  mistakes: string[];
};

export const EXERCISE_FORM_GUIDE: Record<string, FormGuide> = {
  "Inverted row": {
    steps: [
      "Lie under a sturdy bar or table, grip slightly wider than shoulders",
      "Keep your body in a straight line from head to heels",
      "Pull your chest up to the bar, squeezing your shoulder blades together",
      "Lower back to a full hang under control",
    ],
    mistakes: [
      "Letting the hips sag or pike up",
      "Not pulling the chest all the way to the bar",
      "Flaring elbows out to 90° instead of driving them back",
    ],
  },
  "Single-arm DB row": {
    steps: [
      "Brace one hand and knee on a bench or chair, flat back, torso parallel to the floor",
      "Let the dumbbell hang straight down from a relaxed shoulder",
      "Pull the dumbbell to your hip, driving the elbow back and up",
      "Pause a second at the top, then lower under control",
    ],
    mistakes: [
      "Rotating the torso to help lift the weight",
      "Rounding the lower back",
      "Using momentum instead of the lat to start the pull",
    ],
  },
  "Chin-up": {
    steps: [
      "Hang from the bar with palms facing you, shoulder-width grip",
      "Pull your chin above the bar, driving your elbows down and back",
      "Lower back to a full, controlled hang",
      "Use a band or slow negatives if a full rep isn't there yet",
    ],
    mistakes: [
      "Kipping or swinging to generate momentum",
      "Stopping short of full arm extension at the bottom",
      "Shrugging the shoulders up instead of pulling with the lats",
    ],
  },
  "Dead hang": {
    steps: [
      "Grip the bar shoulder-width apart",
      "Let your whole body hang with arms fully straight, feet off the floor",
      "Relax your shoulders down away from your ears",
      "Hold for time, breathing normally",
    ],
    mistakes: [
      "Shrugging the shoulders up toward the ears",
      "Swinging or kicking the legs",
      "Gripping so hard your forearms fatigue before your shoulders even stretch",
    ],
  },
  "Pull-up": {
    steps: [
      "Hang from the bar with an overhand, shoulder-width grip",
      "Pull until your chin clears the bar, elbows driving down and back",
      "Lower under control to a full hang",
      "Use band assistance or a slow negative if a full rep isn't there yet",
    ],
    mistakes: [
      "Using momentum/kipping instead of a controlled pull",
      "Not lowering all the way to a dead hang between reps",
      "Craning the neck forward instead of pulling higher",
    ],
  },
  "Hammer curl": {
    steps: [
      "Stand holding a dumbbell in each hand, palms facing your body",
      "Curl both dumbbells up toward your shoulders, elbows pinned at your sides",
      "Squeeze at the top, then lower slowly",
    ],
    mistakes: [
      "Swinging the torso to help the weight up",
      "Letting the elbows drift forward",
      "Rushing the lowering phase",
    ],
  },
  "Incline curl": {
    steps: [
      "Sit back on an incline (or lean your torso back), letting your arms hang straight down behind you",
      "Curl the dumbbells up toward your shoulders without swinging",
      "Lower slowly, feeling the stretch at the bottom",
      "Take the final set to genuine failure",
    ],
    mistakes: [
      "Letting the elbows drift forward as the weight gets heavy",
      "Cutting the stretch short at the bottom",
      "Using the shoulders to help heave the weight up",
    ],
  },
  "Seated calf raise": {
    steps: [
      "Sit with a dumbbell resting on each knee, balls of your feet on a raised edge, heels hanging off",
      "Lower your heels below the platform for a full stretch, pause 2 seconds",
      "Rise up onto your toes as high as you can",
      "Lower slowly and repeat",
    ],
    mistakes: [
      "Bouncing out of the bottom stretch instead of pausing",
      "Only moving through a small range of motion",
      "Letting the knees do the work instead of the ankles",
    ],
  },
  Skipping: {
    steps: [
      "Hold the rope handles at hip height, elbows close to your body",
      "Jump just high enough to clear the rope, staying light on the balls of your feet",
      "Turn the rope with your wrists, not your whole arms",
      "Work for 60 seconds, rest 45, repeat",
    ],
    mistakes: [
      "Jumping much higher than the rope actually requires",
      "Landing flat-footed or on the heels",
      "Turning the rope from the shoulders instead of the wrists",
    ],
  },
  "Standing calf raise": {
    steps: [
      "Stand on the edge of a step holding one dumbbell, heel hanging off the edge",
      "Lower your heel below the step for a full stretch, pause 2 seconds",
      "Rise up onto your toes as high as possible",
      "Lower slowly - no bouncing at the bottom",
    ],
    mistakes: [
      "Bouncing out of the stretch instead of pausing",
      "Bending the knee to help push up",
      "Cutting the range of motion short",
    ],
  },
  "Band chest fly": {
    steps: [
      "Anchor the band behind you at chest height, one handle in each hand",
      "Start with arms wide and slightly bent at the elbow",
      "Bring your hands together in front of your chest in a hugging arc",
      "Control the band back out to the start",
    ],
    mistakes: [
      "Bending the elbows more as the set gets hard, turning it into a press",
      "Using momentum instead of a slow squeeze",
      "Not going wide enough to load the stretch",
    ],
  },
  "DB floor press": {
    steps: [
      "Lie on the floor with a dumbbell in each hand, knees bent, feet flat",
      "Lower the dumbbells slowly over 3 seconds until your triceps touch the floor",
      "Pause briefly",
      "Press back up to full arm extension",
    ],
    mistakes: [
      "Letting the elbows flare out to 90° instead of a moderate angle",
      "Rushing the lowering phase",
      "Bouncing the elbows off the floor instead of pausing",
    ],
  },
  "Deficit push-up": {
    steps: [
      "Place your hands on two sturdy blocks or books, slightly wider than shoulder width",
      "Lower your chest below the level of your hands",
      "Press back up to full arm extension",
      "Keep your body in a straight line throughout",
    ],
    mistakes: [
      "Letting the hips sag or pike up",
      "Not lowering below hand level - that's the whole point of the deficit",
      "Flaring the elbows straight out to the sides",
    ],
  },
  "Diamond push-up": {
    steps: [
      "Form a diamond shape with your thumbs and index fingers on the floor under your chest",
      "Lower your chest to your hands, elbows tracking back close to your body",
      "Press back up to full extension",
      "Keep your core braced throughout",
    ],
    mistakes: [
      "Letting the elbows flare wide instead of staying tucked",
      "Sagging at the hips",
      "Only lowering partway",
    ],
  },
  "Dead bug": {
    steps: [
      "Lie on your back, arms reaching up, knees bent at 90°",
      "Press your lower back flat into the floor and hold it there",
      "Extend one arm overhead and the opposite leg straight out, keeping the back flat",
      "Return to start and alternate sides",
    ],
    mistakes: [
      "Letting the lower back arch off the floor as the arm/leg extend",
      "Moving too fast to stay controlled",
      "Extending the leg without extending the opposite arm",
    ],
  },
  "Hanging knee raise": {
    steps: [
      "Hang from a pull-up bar with arms straight",
      "Tuck your pelvis under as you raise your knees toward your chest",
      "Pause briefly at the top",
      "Lower with control, avoiding any swing",
    ],
    mistakes: [
      "Swinging the body to throw the knees up",
      "Only bending the hips without the posterior pelvic tilt (turns it into hip flexor work)",
      "Lowering too fast and losing control",
    ],
  },
  "Hollow hold": {
    steps: [
      "Lie on your back, arms overhead and legs extended",
      "Press your lower back into the floor and lift your shoulders and legs slightly off the ground",
      "Hold the position, keeping the lower back pinned down",
      "Breathe steadily throughout",
    ],
    mistakes: [
      "Letting the lower back arch and lift off the floor",
      "Holding your breath",
      "Lifting the legs so high the lower back is forced to arch",
    ],
  },
  "Long-lever plank": {
    steps: [
      "Set up in a forearm plank, then walk your elbows forward past your shoulders",
      "Keep your body in a straight line from head to heels",
      "Brace your core hard to resist the extra leverage",
      "Hold for time",
    ],
    mistakes: [
      "Letting the hips sag under the increased leverage",
      "Walking the elbows out so far the lower back takes over",
      "Holding the breath instead of breathing steadily",
    ],
  },
  "Side plank": {
    steps: [
      "Lie on your side, forearm on the floor directly under your shoulder",
      "Stack your feet and lift your hips until your body forms a straight line",
      "Hold the position, keeping your hips high",
      "Repeat on the other side",
    ],
    mistakes: [
      "Letting the hips drop toward the floor",
      "Rolling the torso forward or backward",
      "Holding the breath instead of breathing steadily",
    ],
  },
  "Suitcase carry": {
    steps: [
      "Pick up one dumbbell in one hand, standing tall",
      "Walk forward with controlled steps, resisting the pull to lean toward the weight",
      "Keep your shoulders level and core braced the whole way",
      "Switch hands and repeat on the other side",
    ],
    mistakes: [
      "Letting the torso lean toward the loaded side",
      "Taking short, shuffling steps instead of a normal stride",
      "Letting the shoulder on the loaded side hike up",
    ],
  },
  "Pallof press": {
    steps: [
      "Anchor a band at chest height to your side and hold it at your sternum with both hands",
      "Press the band straight out in front of you, resisting the pull to rotate toward the anchor",
      "Hold briefly at full extension",
      "Return to your chest under control and repeat",
    ],
    mistakes: [
      "Letting the torso rotate toward the anchor point",
      "Pressing off-center instead of straight out",
      "Standing too close to the anchor, reducing the tension",
    ],
  },
  "DB Arnold press": {
    steps: [
      "Hold a dumbbell in each hand at chin height, palms facing you",
      "Press up while rotating your palms to face forward",
      "Reach full lockout overhead",
      "Reverse the rotation as you lower back to the start",
    ],
    mistakes: [
      "Rushing the rotation instead of timing it with the press",
      "Not reaching full overhead lockout",
      "Using momentum from the hips to help press",
    ],
  },
  "Pike push-up": {
    steps: [
      "Start in a downward-dog-like position, hips high, hands and feet on the floor",
      "Bend your elbows to lower the crown of your head toward the floor between your hands",
      "Press back up to the starting position",
      "Progress by elevating your feet as it gets easier",
    ],
    mistakes: [
      "Letting the hips drop, turning it into a regular push-up",
      "Not lowering the head far enough",
      "Flaring the elbows out wide instead of a moderate angle",
    ],
  },
  "Single-leg hip thrust": {
    steps: [
      "Sit with your upper back against the edge of a sofa or bench, one foot planted, the other leg extended",
      "Drive your hips up until your body forms a straight line from shoulder to knee",
      "Squeeze the glute hard at the top",
      "Lower with control and repeat, then switch legs",
    ],
    mistakes: [
      "Hyperextending the lower back instead of squeezing the glute",
      "Not driving all the way to full hip extension",
      "Letting the working knee cave inward",
    ],
  },
  "DB RDL": {
    steps: [
      "Hold dumbbells in front of your thighs, knees softly bent",
      "Push your hips straight back, letting the weights slide down your legs",
      "Lower over 3 seconds until you feel a real hamstring stretch, keeping your back flat",
      "Drive your hips forward to stand back up",
    ],
    mistakes: [
      "Rounding the lower back as the weights travel down",
      "Bending the knees too much, turning it into a squat",
      "Letting the dumbbells drift away from the legs",
    ],
  },
  "Single-leg RDL": {
    steps: [
      "Stand on one leg holding a dumbbell in the opposite hand",
      "Hinge forward at the hip, letting the free leg extend straight back for balance",
      "Lower until your torso is roughly parallel to the floor, keeping your back flat",
      "Drive back up to standing, slowly - balance is part of the work",
    ],
    mistakes: [
      "Rushing the movement instead of controlling the balance",
      "Letting the hips rotate open",
      "Rounding the lower back at the bottom",
    ],
  },
  "Band leg curl": {
    steps: [
      "Lie face down, band anchored behind you and looped around one ankle",
      "Curl your heel toward your glute against the band's resistance",
      "Squeeze briefly at the top",
      "Lower with control and repeat, then switch legs",
    ],
    mistakes: [
      "Lifting the hips off the floor to help the curl",
      "Using a jerky, fast motion instead of a controlled squeeze",
      "Not curling through a full range of motion",
    ],
  },
  "Nordic negative": {
    steps: [
      "Kneel with your heels anchored firmly under something heavy",
      "Keeping your hips extended, lower your torso forward as slowly as you can",
      "Catch yourself with your hands as you approach the floor",
      "Push back up or reset from the floor",
    ],
    mistakes: [
      "Bending at the hips instead of staying in a straight line from knee to shoulder",
      "Dropping fast instead of resisting all the way down",
      "Not anchoring the heels securely enough to stay in place",
    ],
  },
  "Bulgarian split squat": {
    steps: [
      "Stand a couple of feet in front of a chair or sofa, resting the top of your rear foot on it",
      "Lower straight down until your front thigh is roughly parallel to the floor",
      "Drive through your front heel to stand back up",
      "Complete all reps on one side before switching legs",
    ],
    mistakes: [
      "Letting the front knee cave inward",
      "Placing the rear foot too close, cramping the front leg's range",
      "Leaning the torso too far forward",
    ],
  },
  "DB reverse lunge": {
    steps: [
      "Stand tall holding a dumbbell in each hand",
      "Step one leg backward into a lunge, lowering the rear knee toward the floor",
      "Push through the front heel to return to standing",
      "Alternate legs or complete a full set per side",
    ],
    mistakes: [
      "Letting the front knee travel far past the toes",
      "Leaning the torso forward instead of staying upright",
      "Taking too short a step back, cramping the movement",
    ],
  },
  "DB step-up": {
    steps: [
      "Stand facing a stable chair or step, holding a dumbbell in each hand",
      "Place one foot fully on the step and drive through that heel to stand up",
      "Bring the trailing leg up to full standing, under control",
      "Step back down and repeat, alternating or per side",
    ],
    mistakes: [
      "Pushing off the bottom foot instead of driving through the top heel",
      "Using a step so high the movement turns into a jump",
      "Losing balance because the foot isn't planted fully on the step",
    ],
  },
  "Goblet squat": {
    steps: [
      "Hold one dumbbell vertically at your chest with both hands",
      "Lower over 3 seconds, keeping your chest up and knees tracking over your toes",
      "Pause for 1 second at the bottom",
      "Drive up through your heels back to standing",
    ],
    mistakes: [
      "Letting the knees cave inward",
      "Rounding the lower back at the bottom",
      "Rushing the descent instead of the full 3-second lower",
    ],
  },
  "Band face pull": {
    steps: [
      "Anchor a band at head height and grip it with both hands, arms extended",
      "Pull the band toward your forehead, driving your elbows out and up",
      "Rotate your hands outward at the end of the pull",
      "Return slowly to the start",
    ],
    mistakes: [
      "Pulling low toward the chest instead of the face",
      "Using the arms only, without driving the elbows high",
      "Letting the shoulders shrug up toward the ears",
    ],
  },
  "Band pull-apart": {
    steps: [
      "Hold a band with both hands, arms extended straight in front at chest height",
      "Pull the band apart by driving your arms out to the sides",
      "Touch the band to your chest at full stretch",
      "Return slowly to the start",
    ],
    mistakes: [
      "Bending the elbows instead of keeping the arms straight",
      "Using a band too light to feel real tension",
      "Rushing the return instead of controlling it",
    ],
  },
  "DB lateral raise": {
    steps: [
      "Stand holding a dumbbell in each hand at your sides, elbows slightly bent",
      "Raise both arms out to the sides, leading with the elbows, until roughly shoulder height",
      "Lower slowly with control",
      "On the final set, once full reps are done, keep going with small bottom-half partials to failure",
    ],
    mistakes: [
      "Swinging the weight up using momentum from the hips",
      "Raising above shoulder height, which shifts the load to the traps",
      "Leading with the hands instead of the elbows",
    ],
  },
  "Bench dip": {
    steps: [
      "Sit on the edge of a chair or bench, hands gripping the edge beside your hips",
      "Slide your hips forward off the edge, legs extended or bent",
      "Lower your body by bending your elbows until you feel a stretch, not pain",
      "Press back up to full arm extension",
    ],
    mistakes: [
      "Lowering so deep the shoulders are strained",
      "Letting the elbows flare out wide instead of tracking back",
      "Using the legs to bounce out of the bottom instead of the triceps",
    ],
  },
  "Overhead triceps extension": {
    steps: [
      "Hold a dumbbell overhead with both hands, arms fully extended",
      "Lower the weight behind your head by bending your elbows",
      "Keep your upper arms close to your ears throughout",
      "Extend back up to full overhead lockout",
    ],
    mistakes: [
      "Letting the elbows flare out wide",
      "Arching the lower back to compensate for the weight",
      "Only doing a partial range of motion",
    ],
  },
};
