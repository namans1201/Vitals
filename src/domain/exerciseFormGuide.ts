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
  "Ab wheel rollout": {
    steps: [
      "Kneel with the wheel under your shoulders, knees hip-width, hands stacked over the handles",
      "Brace hard and tuck your ribs down so your lower back is flat, not arched",
      "Roll the wheel forward slowly, holding that flat back the whole way",
      "Stop at the furthest point you can still reverse, then pull back by squeezing the abs",
    ],
    mistakes: [
      "Letting the lower back arch and the hips sag as you extend",
      "Rolling out further than you can pull back from",
      "Piking the hips up to return instead of dragging back with the abs",
    ],
  },
  "Barbell bench press": {
    steps: [
      "Feet flat, slight arch, shoulder blades pinned back and down into the bench",
      "Unrack to straight arms over your shoulders, wrists stacked over elbows",
      "Lower under control to mid-chest with elbows at about 45° to your body",
      "Touch the chest, then drive up and slightly back toward your face",
    ],
    mistakes: [
      "Bouncing the bar off the chest to start the press",
      "Flaring the elbows out to 90°, which loads the shoulder joint",
      "Letting the hips come off the bench to heave the bar up",
    ],
  },
  "Barbell curl": {
    steps: [
      "Stand tall, underhand grip at shoulder width, elbows pinned to your sides",
      "Curl the bar up keeping the elbows fixed in place",
      "Squeeze the biceps hard at the top without swinging the hips forward",
      "Lower under control until the arms are fully straight",
    ],
    mistakes: [
      "Swinging the hips and leaning back to start each rep",
      "Letting the elbows drift forward so the front delts take over",
      "Dropping the bar back down instead of lowering it under control",
    ],
  },
  "Barbell hip thrust": {
    steps: [
      "Sit with your upper back on a bench edge, bar padded across the hip crease",
      "Feet flat and set so your shins end up vertical at the top",
      "Tuck the chin, drive through your heels until your body is a straight line",
      "Squeeze the glutes hard for a beat, then lower under control",
    ],
    mistakes: [
      "Overextending the lower back at the top instead of finishing with the glutes",
      "Feet too far forward, turning it into a hamstring pull",
      "Letting the chin and ribs flare up so the hips never fully lock out",
    ],
  },
  "Barbell RDL": {
    steps: [
      "Stand tall holding the bar at your hips, feet hip-width, knees soft",
      "Push your hips straight back, letting the bar drag down your thighs",
      "Lower until you feel a real hamstring stretch, back flat and chest proud",
      "Drive the hips forward to stand tall and squeeze the glutes at the top",
    ],
    mistakes: [
      "Bending the knees more as you descend, turning it into a squat",
      "Letting the bar drift away from your legs and pulling you forward",
      "Rounding the lower back to chase extra depth past your hamstring range",
    ],
  },
  "Barbell row": {
    steps: [
      "Hinge to about 45°, flat back, bar hanging at arms length under your shoulders",
      "Brace your core and set the shoulder blades before pulling",
      "Pull the bar to your lower ribs, driving the elbows back past your torso",
      "Squeeze the shoulder blades at the top, then lower to a full stretch",
    ],
    mistakes: [
      "Standing up out of the hinge as the bar comes up",
      "Rounding the lower back once the weight gets heavy",
      "Jerking with the hips to heave the bar instead of pulling with the back",
    ],
  },
  "Barbell shrug": {
    steps: [
      "Hold the bar at arms length, arms straight, shoulders relaxed down",
      "Shrug straight up toward your ears without bending the elbows",
      "Hold a beat at the top with the traps squeezed",
      "Lower slowly until you feel the traps stretch again",
    ],
    mistakes: [
      "Rolling the shoulders in circles instead of shrugging straight up",
      "Bending the elbows and turning it into a half upright row",
      "Bouncing reps with no pause at the top and no control on the way down",
    ],
  },
  "Barbell squat": {
    steps: [
      "Bar on your upper back, hands tight, feet shoulder-width with toes slightly out",
      "Brace your core hard, unrack, and take two steps back",
      "Break at the hips and knees together and squat to at least parallel",
      "Drive up through your whole foot with the knees tracking over your toes",
    ],
    mistakes: [
      "Heels lifting so the weight shifts onto the toes",
      "Knees caving inward on the drive out of the bottom",
      "Letting the chest drop so the hips shoot up first and it becomes a good morning",
    ],
  },
  "Battle ropes": {
    steps: [
      "Face the anchor in an athletic stance, knees bent, hips back, feet shoulder-width",
      "Grip a rope end in each hand with a slight forward lean and relaxed shoulders",
      "Whip alternating waves by driving from the shoulders and elbows, not the wrists",
      "Keep the wave height and speed consistent for the full time interval",
    ],
    mistakes: [
      "Standing upright with locked knees instead of holding an athletic stance",
      "Flicking only the wrists so the wave dies before it reaches the anchor",
      "Slowing to a crawl to survive the clock instead of working hard and resting",
    ],
  },
  "Box jump": {
    steps: [
      "Stand about a foot back from the box with feet hip-width",
      "Dip into a quarter squat and swing your arms back",
      "Explode up, driving the arms forward, and land soft on the box with bent knees",
      "Stand tall on the box, then step back down one foot at a time",
    ],
    mistakes: [
      "Jumping back down off the box instead of stepping down",
      "Landing stiff-legged with a loud thud instead of absorbing into bent knees",
      "Tucking the knees to clear a box that is too tall instead of jumping higher",
    ],
  },
  "Burpee": {
    steps: [
      "From standing, drop your hands to the floor and kick your feet back to a plank",
      "Lower your chest to the floor keeping the body rigid from head to heels",
      "Press up and jump your feet back in to land beside your hands",
      "Stand and explode straight into a jump, then land soft and repeat",
    ],
    mistakes: [
      "Letting the hips sag or pike when the chest goes to the floor",
      "Skipping the jump at the top and just standing up",
      "Landing on straight, locked legs out of the jump",
    ],
  },
  "Cable crossover": {
    steps: [
      "Set both pulleys at chest height (or high for high-to-low), grab the handles",
      "Step forward into a split stance with a slight forward lean and tension on the cables",
      "Start with arms wide and a fixed slight elbow bend, chest stretched",
      "Sweep your hands together in front of your chest, squeeze, then open back slowly",
    ],
    mistakes: [
      "Bending and straightening the elbows so it turns into a press",
      "Stopping short with the hands wide instead of meeting in front of the chest",
      "Going so heavy the torso rocks forward and back to move the weight",
    ],
  },
  "Cable face pull": {
    steps: [
      "Set the rope at eye level, grip with thumbs back, step away for constant tension",
      "Stand tall with arms extended, core braced, shoulders down",
      "Pull the rope toward your face, splitting your hands apart as it travels",
      "Finish with hands by your ears and elbows high, then return under control",
    ],
    mistakes: [
      "Setting the pulley too low so it becomes a high row",
      "Letting the elbows drop below shoulder height during the pull",
      "Leaning back and using body weight instead of the rear delts",
    ],
  },
  "Cable kickback": {
    steps: [
      "Strap the cuff to one ankle, face the machine, hold the frame for balance",
      "Hinge slightly forward with a soft knee on the standing leg, core braced",
      "Kick the working leg straight back and squeeze the glute at the top",
      "Return under control without letting the stack touch down between reps",
    ],
    mistakes: [
      "Arching the lower back to fake extra range at the top",
      "Swinging the leg with momentum instead of driving it back with the glute",
      "Rotating the torso away from the working side to get the leg higher",
    ],
  },
  "Chest dip": {
    steps: [
      "Press up to a locked-out support on the bars, then lean your torso forward",
      "Bend the elbows with a slight flare and lower while holding that forward lean",
      "Descend until you feel a stretch across the chest, shoulders no lower than elbows",
      "Press back up through the chest, staying leaned forward the whole way",
    ],
    mistakes: [
      "Staying upright, which shifts most of the work to the triceps",
      "Sinking too deep and letting the shoulders roll forward at the bottom",
      "Bouncing out of the bottom instead of pressing out of a controlled stretch",
    ],
  },
  "Clean & press": {
    steps: [
      "Set up with the bar over mid-foot, hinge and grip just outside your legs, flat back",
      "Pull the bar up your thighs, then explosively extend the hips and shrug",
      "Drop your elbows under and catch the bar on your front shoulders, stand tall",
      "Brace, squeeze the glutes, and drive the bar overhead to a locked-out finish",
      "Lower to the shoulders, then back to the floor and fully reset before the next rep",
    ],
    mistakes: [
      "Pulling early with the arms instead of driving the bar with the hips",
      "Letting the bar swing out away from the body on the way up",
      "Leaning back and pressing off the lower back instead of a braced torso",
    ],
  },
  "Close grip bench press": {
    steps: [
      "Grip the bar just inside shoulder width with wrists stacked over the elbows",
      "Unrack to straight arms over your shoulders, shoulder blades pinned back",
      "Lower to your lower chest keeping the elbows tucked close to your ribs",
      "Press back up, driving through the triceps to full lockout",
    ],
    mistakes: [
      "Gripping so narrow that the wrists bend back and the shoulders cave in",
      "Letting the elbows flare wide, which turns it into a normal bench press",
      "Bouncing the bar off the sternum to start the press",
    ],
  },
  "Concentration curl": {
    steps: [
      "Sit on a bench, lean forward, and brace the back of your upper arm on your inner thigh",
      "Let the dumbbell hang with the arm fully straight",
      "Curl slowly toward your shoulder with the elbow locked against the thigh",
      "Squeeze hard at the top, then lower slowly to a full stretch",
    ],
    mistakes: [
      "Lifting the elbow off the thigh to help the weight up",
      "Rocking the torso back to start the curl",
      "Cutting the bottom short instead of straightening the arm on every rep",
    ],
  },
  "Crunch": {
    steps: [
      "Lie on your back with knees bent, feet flat, hands resting lightly behind your head",
      "Exhale and curl your shoulder blades off the floor, ribs toward your hips",
      "Pause briefly at the top with the abs squeezed",
      "Lower slowly until your shoulder blades touch back down",
    ],
    mistakes: [
      "Pulling the head forward with the hands and straining the neck",
      "Jerking up with momentum instead of curling the spine segment by segment",
      "Lifting the whole back off the floor, turning it into a hip-flexor sit-up",
    ],
  },
  "Cycling": {
    steps: [
      "Set the saddle so your knee stays slightly bent at the bottom of the stroke",
      "Sit tall with a light grip on the bars and relaxed shoulders",
      "Pedal in smooth circles, pushing over the top and driving through the bottom",
      "Hold one steady cadence and set resistance so the last few minutes are hard",
    ],
    mistakes: [
      "Saddle too low, so the knees over-bend and the quads take everything",
      "Spinning at near-zero resistance so the legs never actually work",
      "Rocking the hips side to side or bouncing in the saddle",
    ],
  },
  "Deadlift": {
    steps: [
      "Set the bar over mid-foot, feet hip-width, shins close to the bar",
      "Hinge down and grip just outside your legs, chest up, flat back",
      "Pull the slack out of the bar, then drive the floor away with your legs",
      "Finish standing tall with hips and knees locked and glutes squeezed",
      "Push the hips back and lower the bar down the same path",
    ],
    mistakes: [
      "Rounding the lower back instead of holding a flat, braced spine",
      "Letting the hips shoot up first so the back finishes the pull alone",
      "Letting the bar drift forward away from the shins",
    ],
  },
  "Decline bench press": {
    steps: [
      "Lock your legs into the decline bench and pin the shoulder blades back",
      "Unrack and hold the bar over your lower chest with straight arms",
      "Lower under control to the lower chest, elbows about 45° from the torso",
      "Press back up without letting the shoulders roll forward",
    ],
    mistakes: [
      "Letting the shoulder blades unpin and roll forward at lockout",
      "Bouncing the bar off the lower chest",
      "Losing the leg lock and sliding, which moves the bar off the lower chest",
    ],
  },
  "Dumbbell curl": {
    steps: [
      "Stand tall with dumbbells at your sides, palms facing forward",
      "Curl up keeping the elbows pinned against your ribs",
      "Squeeze at the top without letting the elbows travel forward",
      "Lower under control all the way back to straight arms",
    ],
    mistakes: [
      "Swinging the torso back to start the curl",
      "Letting the elbows drift forward so the front delts take over",
      "Rotating to a neutral grip, which turns it into a hammer curl",
    ],
  },
  "Dumbbell fly": {
    steps: [
      "Lie back with the dumbbells pressed over your chest, palms facing each other",
      "Set a slight bend in the elbows and hold that exact angle the whole rep",
      "Open the arms wide and lower until you feel a stretch across the chest",
      "Squeeze the chest to bring the dumbbells back together over mid-chest",
    ],
    mistakes: [
      "Bending and straightening the elbows, turning it into a sloppy press",
      "Dropping the arms far below chest level and straining the shoulder",
      "Going so heavy the stretch and the control both disappear",
    ],
  },
  "Farmer's walk": {
    steps: [
      "Hinge down, grip a heavy dumbbell in each hand, then stand up tall",
      "Set the shoulders back and down, ribs stacked over hips, core braced",
      "Walk with short controlled steps, arms hanging without swinging",
      "Keep the torso upright and level for the full time, then hinge to set them down",
    ],
    mistakes: [
      "Leaning or swaying side to side with each step",
      "Shrugging the shoulders up or letting them round forward",
      "Dumping the dumbbells from standing instead of hinging to set them down",
    ],
  },
  "Front raise": {
    steps: [
      "Stand tall with the dumbbells in front of your thighs, slight elbow bend",
      "Raise the dumbbells straight out in front to shoulder height",
      "Pause briefly at the top without shrugging the traps",
      "Lower slowly back to your thighs under control",
    ],
    mistakes: [
      "Swinging the hips to throw the weight up",
      "Going above shoulder height so the traps take over",
      "Dropping the dumbbells down instead of lowering slow",
    ],
  },
  "Glute bridge": {
    steps: [
      "Lie on your back, feet flat and hip-width, heels close to your glutes",
      "Brace the core and tuck the ribs down so the lower back stays flat",
      "Drive through the heels and squeeze the glutes to lift the hips",
      "Pause with a straight line from knees to shoulders, then lower under control",
    ],
    mistakes: [
      "Arching the lower back at the top instead of finishing with the glutes",
      "Pushing through the toes so the hamstrings and quads take over",
      "Letting the knees cave inward as the hips rise",
    ],
  },
  "Hanging straight-leg raise": {
    steps: [
      "Hang from the bar with a full grip, arms straight, shoulders lightly engaged",
      "Brace the core and tilt the pelvis back so the lower back cannot arch",
      "Raise both straight legs together to hip height or higher",
      "Lower slowly to a dead hang without letting the body swing",
    ],
    mistakes: [
      "Swinging and using the rebound to start the next rep",
      "Bending the knees once the legs get heavy",
      "Stopping around 45° instead of reaching hip height or above",
    ],
  },
  "Incline bench press": {
    steps: [
      "Set the bench to 30-45°, feet planted, shoulder blades pinned back",
      "Unrack and hold the bar over the top of your chest with straight arms",
      "Lower to the top of the chest with the elbows tucked slightly in",
      "Press back up the same path, keeping the blades pinned down",
    ],
    mistakes: [
      "Setting the bench too upright so it becomes a shoulder press",
      "Flaring the elbows out to 90° instead of tucking them slightly",
      "Bouncing the bar off the chest or lifting the hips off the bench",
    ],
  },
  "Jumping jacks": {
    steps: [
      "Stand tall with feet together and arms at your sides",
      "Jump the feet out wider than shoulders while swinging the arms fully overhead",
      "Jump back to feet together and arms to your sides in one rhythm",
      "Land softly on the balls of the feet and hold the pace for the full 60 seconds",
    ],
    mistakes: [
      "Half-raising the arms instead of bringing them all the way overhead",
      "Landing flat-footed and heavy with stiff, locked knees",
      "Sprinting the first 20 seconds and stalling before the time is up",
    ],
  },
  "Kettlebell swing": {
    steps: [
      "Stand with the bell a foot in front of you, hinge and hike it back between your legs",
      "Keep a flat back and let the arms hang like ropes off the shoulders",
      "Snap the hips forward hard so the bell floats up to chest height",
      "Ride it back down, hinging again to absorb it straight into the next rep",
    ],
    mistakes: [
      "Squatting the bell up instead of hinging at the hips",
      "Lifting the bell with the arms and shoulders instead of hip drive",
      "Leaning back and arching the lower back at the top of the swing",
    ],
  },
  "Lat pulldown": {
    steps: [
      "Set the thigh pad snug and grip the bar slightly wider than shoulders",
      "Sit tall with chest up and only a slight lean back",
      "Pull the bar to your upper chest, leading with the elbows down and back",
      "Control the bar back up until the arms are straight and the lats stretch",
    ],
    mistakes: [
      "Leaning far back and turning it into a row",
      "Pulling with the hands and biceps instead of driving the elbows down",
      "Letting the stack yank the shoulders up on the way back",
    ],
  },
  "Leg extension": {
    steps: [
      "Set the seat so your knees line up with the machine's pivot point",
      "Sit back into the pad and set the shin pad just above the ankles",
      "Extend the legs fully and pause a beat at the top",
      "Lower under control without letting the stack touch down between reps",
    ],
    mistakes: [
      "Swinging the hips and using momentum to throw the pad up",
      "Cutting the top short instead of locking out and pausing",
      "Letting the weight drop fast on the way down",
    ],
  },
  "Leg press": {
    steps: [
      "Set the feet shoulder-width in the middle of the platform, toes slightly out",
      "Release the safeties and lower until the knees reach about 90°",
      "Keep the lower back and glutes flat against the pad the whole way",
      "Press through the whole foot and stop just short of a hard lockout",
    ],
    mistakes: [
      "Letting the hips curl off the pad at the bottom and rounding the lower back",
      "Slamming the knees into a locked-out position at the top",
      "Letting the knees cave inward as you press",
    ],
  },
  "Machine calf raise": {
    steps: [
      "Set the pad snug and place the balls of your feet on the edge of the platform",
      "Drop the heels below the platform for a full stretch",
      "Rise as high onto the toes as you can and pause at the top",
      "Lower slowly back into the bottom stretch",
    ],
    mistakes: [
      "Bouncing out of the bottom off the Achilles instead of pausing in the stretch",
      "Using a short range that misses both the full stretch and the full squeeze",
      "Bending and straightening the knees to help the weight up",
    ],
  },
  "Machine leg curl": {
    steps: [
      "Line the knees up with the machine pivot and set the pad just above your heels",
      "Grip the handles and press the hips down into the pad",
      "Curl the pad toward your glutes through the full range",
      "Pause at the top, then lower slow to straight legs",
    ],
    mistakes: [
      "Lifting the hips off the pad to squeeze out more range",
      "Snapping the weight up and letting it drop back down",
      "Stopping halfway instead of curling all the way toward the glutes",
    ],
  },
  "Mountain climber": {
    steps: [
      "Set up in a high plank with hands under shoulders and body in a straight line",
      "Brace the core and squeeze the glutes so the hips stay level",
      "Drive one knee toward your chest, then switch legs quickly",
      "Keep alternating at a steady fast pace for the full time",
    ],
    mistakes: [
      "Letting the hips pike up toward the ceiling as you tire",
      "Bouncing the hips up and down with every knee drive",
      "Letting the hands creep forward so the shoulders sit behind the wrists",
    ],
  },
  "Overhead press": {
    steps: [
      "Set the bar on your front delts, grip just outside the shoulders, elbows slightly ahead",
      "Squeeze the glutes and brace hard so the ribs stay pulled down",
      "Press the bar straight up, pulling your head back out of its path",
      "Tuck your head through once the bar clears your forehead and lock out overhead",
      "Lower under control back to the front delts",
    ],
    mistakes: [
      "Leaning back and arching the lower back to get the bar up",
      "Pressing around the face instead of in a straight vertical line",
      "Locking out with the bar in front of the head instead of over mid-foot",
    ],
  },
  "Parallel bar dip": {
    steps: [
      "Grip the bars and press to a straight-arm support, shoulders down away from your ears",
      "Keep the torso upright and the elbows tucked close to your ribs",
      "Bend the elbows and lower until your upper arms are parallel to the floor",
      "Press back up through the palms to a full lock-out without shrugging",
    ],
    mistakes: [
      "Leaning the torso forward, which turns it into a chest dip instead of a triceps dip",
      "Flaring the elbows wide and dropping the shoulders below the elbows into the joint",
      "Bouncing out of the bottom instead of controlling the lowering",
    ],
  },
  "Preacher curl": {
    steps: [
      "Set the seat so your armpits sit on top of the pad, chest against it",
      "Lay the backs of both arms flat on the pad and hold the EZ bar with a shoulder-width grip",
      "Curl the bar up without letting your elbows lift off the pad",
      "Lower under control until the elbows are almost straight, keeping tension on the biceps",
    ],
    mistakes: [
      "Letting the elbows slide up the pad so the shoulders take over",
      "Dropping the bar fast at the bottom, where the biceps are most stretched and vulnerable",
      "Standing up or rocking the torso back to heave the bar through the sticking point",
    ],
  },
  "Push-up": {
    steps: [
      "Set hands directly under your shoulders, fingers forward, feet together or hip-width",
      "Squeeze the glutes and brace so your body is a straight line from head to heels",
      "Lower until your chest is an inch off the floor, elbows at roughly 45° to your ribs",
      "Press the floor away to full lock-out without letting the hips drop or pike",
    ],
    mistakes: [
      "Sagging hips or a raised bum instead of one straight line",
      "Flaring elbows out to 90°, which grinds the shoulders",
      "Only going halfway down instead of bringing the chest to the floor",
    ],
  },
  "Reverse fly": {
    steps: [
      "Hold a dumbbell in each hand and hinge forward until the torso is near parallel",
      "Let the dumbbells hang under your shoulders with a soft, fixed bend in the elbows",
      "Raise the dumbbells out to the sides until they are level with your shoulders",
      "Squeeze the shoulder blades at the top, then lower under control",
    ],
    mistakes: [
      "Standing too upright, which turns it into a row for the lats instead of the rear delts",
      "Bending and straightening the elbows so it becomes a triceps kickback",
      "Going too heavy and jerking the torso up to swing the weights",
    ],
  },
  "Rowing machine": {
    steps: [
      "Strap the feet in, sit tall, and slide forward with shins vertical and arms straight",
      "Drive with the legs first, then swing the torso back, then pull the handle to the ribs",
      "Reverse the order on the return: arms away, torso forward, then bend the knees",
      "Hold a steady pace and rhythm for the full duration rather than sprinting early",
    ],
    mistakes: [
      "Pulling with the arms before the legs have finished driving",
      "Rounding the lower back and hunching the shoulders over the handle",
      "Bending the knees before the handle has passed them on the recovery",
    ],
  },
  "Running": {
    steps: [
      "Start with a few minutes of easy jogging to warm up before settling into pace",
      "Run tall with a slight forward lean from the ankles, shoulders and hands relaxed",
      "Land with the foot under your hips, not reaching out in front of you",
      "Hold a pace you can sustain for the full duration, or alternate hard and easy blocks",
    ],
    mistakes: [
      "Starting far too fast and having to walk the back half",
      "Overstriding and heel-striking well ahead of the body, which brakes every step",
      "Tensing the shoulders and clenching the fists instead of staying loose",
    ],
  },
  "Russian twist": {
    steps: [
      "Sit on the floor, knees bent, and lean back to about 45° with a flat back",
      "Lift your feet off the floor if you can hold the position without rounding",
      "Hold the weight at your chest and rotate your ribcage to touch it beside one hip",
      "Rotate through to the other side under control, moving from the torso not the arms",
    ],
    mistakes: [
      "Swinging the arms side to side while the torso stays still",
      "Rounding the lower back and collapsing the chest as you lean away",
      "Racing through reps so the rotation becomes a shoulder flap with no core tension",
    ],
  },
  "Seated cable row": {
    steps: [
      "Sit tall with a slight knee bend, feet planted, and grip the handle at arm's length",
      "Set the chest up and pull the shoulder blades down and back before the arms move",
      "Drive the elbows back past your ribs until the handle reaches your lower abs",
      "Pause and squeeze, then let the handle return under control to a full stretch",
    ],
    mistakes: [
      "Rocking the torso back and forth to heave the weight with the lower back",
      "Shrugging the shoulders up toward the ears instead of pulling them back",
      "Letting the weight snap the arms forward instead of controlling the return",
    ],
  },
  "Skull crusher": {
    steps: [
      "Lie on a bench holding the EZ bar over your chest with a close, angled grip",
      "Set the upper arms roughly vertical and keep them locked in that position",
      "Bend only at the elbows to lower the bar toward your forehead or just behind it",
      "Press back up to just short of lock-out, keeping tension on the triceps",
    ],
    mistakes: [
      "Letting the upper arms drift back so it turns into a pullover",
      "Flaring the elbows out wide as the bar comes down",
      "Dropping the bar fast and stopping it hard near the head instead of lowering it slowly",
    ],
  },
  "Standard plank": {
    steps: [
      "Set forearms on the floor with elbows directly under the shoulders, hands forward",
      "Extend the legs back onto the toes, feet about hip-width apart",
      "Squeeze the glutes and brace the abs like you are about to be punched",
      "Hold one straight line from head to heels, breathing steadily, for the full time",
    ],
    mistakes: [
      "Letting the hips sag so the lower back takes the load",
      "Piking the hips up into a tent to make the hold easier",
      "Holding your breath or letting the head drop and the upper back round",
    ],
  },
  "Sumo squat": {
    steps: [
      "Set the bar on your upper back and take a stance well wider than your shoulders",
      "Turn the toes out about 30-45° and line the knees up over the toes",
      "Sit straight down between your knees, chest tall, until the thighs are at least parallel",
      "Drive up through the whole foot, pushing the knees out and squeezing the glutes at the top",
    ],
    mistakes: [
      "Letting the knees cave inward on the way up instead of pushing them out",
      "Leaning the chest forward so it turns into a hinge rather than a squat",
      "Toes turned out but knees still tracking straight ahead, twisting the joint",
    ],
  },
  "T-bar row": {
    steps: [
      "Set the chest on the pad or hinge forward to about 45° with a flat back",
      "Grip the handles and let the arms hang, shoulder blades relaxed forward",
      "Pull the handles to your sternum, driving the elbows back and squeezing the mid-back",
      "Lower under control to a full stretch without letting the shoulders round forward",
    ],
    mistakes: [
      "Heaving the torso upright on every rep to use the hips",
      "Cutting the range short and never letting the weight reach a full stretch",
      "Pulling to the belly with the elbows glued in, losing the mid-back squeeze",
    ],
  },
  "Thruster": {
    steps: [
      "Hold the bar in a front rack on the shoulders, elbows high, feet shoulder-width",
      "Squat down to at least parallel, keeping the torso upright and elbows up",
      "Drive hard out of the bottom and use that momentum to press the bar overhead",
      "Lock out with the bar over the middle of your feet, then lower it back to the rack",
    ],
    mistakes: [
      "Pausing at the top of the squat so the press loses the leg drive",
      "Letting the elbows drop in the bottom, which pitches the chest forward",
      "Pressing the bar around the face instead of finishing with it stacked over the shoulders",
    ],
  },
  "Tricep pushdown": {
    steps: [
      "Set the cable high, grip the bar, and step back so the cable is just in front of you",
      "Pin the elbows to your sides and lean forward very slightly with a braced torso",
      "Push the bar down until the elbows are fully locked out, squeezing the triceps",
      "Let the bar rise back to about 90° at the elbow under control, elbows still pinned",
    ],
    mistakes: [
      "Letting the elbows drift forward and away from the ribs at the top",
      "Leaning body weight over the bar to press it down with the chest and shoulders",
      "Stopping short of lock-out, missing the strongest part of the triceps contraction",
    ],
  },
  "Turkish get-up": {
    steps: [
      "Lie on your back, press the bell over one shoulder, same-side knee bent and foot planted",
      "Punch the bell to the ceiling and roll onto your free elbow, then up onto that hand",
      "Bridge the hips up and sweep the straight leg back underneath to half-kneeling",
      "Stand up, then reverse every step exactly in order to return to lying",
    ],
    mistakes: [
      "Letting the loaded arm bend or drift out of the vertical stack over the shoulder",
      "Rushing through positions instead of owning each one before moving on",
      "Losing sight of the bell and letting the head and eyes drop during the early steps",
    ],
  },
  "Walking lunge": {
    steps: [
      "Stand tall, brace the core, and take a long step forward with one leg",
      "Lower straight down until the back knee is just short of the floor",
      "Push through the heel of the front foot to stand and bring the back leg through",
      "Step straight into the next lunge on the other leg without pausing to reset",
    ],
    mistakes: [
      "Taking a short step so the front knee shoots far past the toes",
      "Letting the front knee cave inward as you push up",
      "Leaning the torso forward over the front thigh instead of staying upright",
    ],
  },
};
