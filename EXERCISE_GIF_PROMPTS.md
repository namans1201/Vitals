# Exercise GIF Prompts

**Reference style (applies to every prompt below):** Each animation is a stylized anatomical fitness-illustration — a grayscale/desaturated human figure rendered with semi-transparent skin so the underlying muscle structure is visible underneath, with exactly ONE muscle highlighted in solid red/orange so it visually pops against the rest of the body. Each animation is a short (2-4 second) seamlessly looping clip: it starts at the exercise's starting position, moves smoothly through the peak/contracted position of the movement, and returns to the exact starting position so the loop can repeat with no visible jump-cut — every prompt below explicitly states "seamless loop, ends exactly where it begins" since that is the one constraint added on top of the static two-panel images this file is paired with. Real gym equipment relevant to the exercise is rendered realistically in the scene. The background is plain white/neutral, and the camera holds a clean three-quarter or side angle that clearly shows the joint action — professional and anatomically informative, matching the visual language of commercial exercise-database sites (e.g. Muscle & Motion, Fitness Volt), not cartoonish. Individual prompts below restate these constants briefly so each one works standalone if copy-pasted alone into a GIF/video-generation tool.

**File naming / slug convention:** Every exercise name below maps to a slug — lowercase the name, replace any run of characters that isn't `a-z`/`0-9` with a single hyphen, then trim leading/trailing hyphens (e.g. "Single-arm DB row" → `single-arm-db-row`, "DB Arnold press" → `db-arnold-press`). The animated GIF for an exercise is expected at `public/exercises/<slug>.gif` (the matching static image lives at `public/exercises/<slug>.png`) — slugs must stay identical everywhere (this file, the image-prompts file, and the app).

This file covers the full combined exercise set: the original 37 home-equipment exercises from `EXERCISE_IMAGE_PROMPTS.md` plus the 52 gym-equipment exercises added there. The "How to do it" line for any exercise that also appears in `EXERCISE_IMAGE_PROMPTS.md` is copied verbatim from that file rather than reworded.

---

# Chest

## Band chest fly
**Muscle group:** Chest (equipment: resistance band)
**How to do it:** Anchor a resistance band behind your back at chest height and hold one end in each hand, arms out wide with a slight bend in the elbows. Bring your hands together in front of your chest in a wide arcing motion, squeeze, then return under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, a resistance band anchored behind the back at chest height. The animation starts with arms spread wide, band stretched taut; the figure smoothly brings both hands together in front of the chest in a wide arcing motion, pauses briefly at the squeeze, then reverses the arc back to the wide starting position — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the band anchor point and the arcing arm path.

## DB floor press
**Muscle group:** Chest (equipment: dumbbell)
**How to do it:** Lie on your back on the floor with knees bent, holding a dumbbell in each hand above your chest. Lower the dumbbells slowly over 3 seconds until your triceps touch the floor, pause, then press back up.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on the floor with visible muscle structure, plain white background, a dumbbell in each hand. The animation starts with arms pressed straight up, dumbbells above the chest; the figure smoothly lowers until the triceps touch the floor, pauses briefly, then presses back up to the starting extended position — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the floor contact point and the pressing arc.

## Deficit push-up
**Muscle group:** Chest (equipment: bodyweight — elevated blocks)
**How to do it:** Place your hands on two thick blocks or books slightly wider than shoulder width so your chest can dip below hand level. Lower your chest between the blocks with control, then press back up to full arm extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in a push-up position with visible muscle structure, plain white background, hands planted on two raised blocks. The animation starts at the top plank, arms fully extended; the figure smoothly lowers the chest below hand level between the blocks, pauses briefly at the bottom, then presses back up to the starting extended plank — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the elevated blocks and the deeper dip.

## Diamond push-up
**Muscle group:** Chest (equipment: bodyweight)
**How to do it:** Get into a push-up position with your hands together under your chest, thumbs and index fingers touching to form a diamond shape. Lower your chest to your hands, then press back up; the narrow hand placement shifts more emphasis onto the chest and triceps than a standard push-up.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in a push-up position with visible muscle structure, plain white background, hands together under the chest in a diamond shape. The animation starts at the top plank, arms fully extended; the figure smoothly lowers the chest to the hands, elbows tracking close to the body, pauses briefly, then presses back up to the starting plank — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the diamond hand position and elbow path.

## Barbell bench press
**Muscle group:** Chest (equipment: barbell, flat bench)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Chest day), Full Body
**How to do it:** Lie on a flat bench with feet planted on the floor, gripping the barbell slightly wider than shoulder width. Unrack the bar over your chest, lower it under control until it touches your mid-chest, then press it back up to full arm extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on a flat bench with visible muscle structure, plain white background, a loaded barbell held above. The animation starts with arms fully extended above the chest; the figure smoothly lowers the bar to touch the mid-chest, elbows bending out to the sides, pauses briefly, then presses back up to the starting lockout — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the bench, the barbell path, and the elbow bend.

## Incline bench press
**Muscle group:** Chest (equipment: barbell, incline bench)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Chest day)
**How to do it:** Lie back on a bench set to roughly a 30-45 degree incline, gripping the barbell slightly wider than shoulder width. Unrack it over your upper chest, lower it under control to touch just below your collarbone, then press back up to full extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure reclined on an incline bench with visible muscle structure, plain white background, a loaded barbell held above. The animation starts with arms fully extended above the upper chest; the figure smoothly lowers the bar to the collarbone line, pauses briefly, then presses back up to the starting lockout — seamless loop, ends exactly where it begins. The upper chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the incline angle of the bench and the bar path.

## Decline bench press
**Muscle group:** Chest (equipment: barbell, decline bench)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Chest day)
**How to do it:** Lie back on a bench set to a decline angle with your feet secured at the high end, gripping the barbell slightly wider than shoulder width. Lower the bar to your lower chest, then press back up to full extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on a decline bench with visible muscle structure, feet braced at the raised end, plain white background, a loaded barbell held above. The animation starts with arms fully extended above the lower chest; the figure smoothly lowers the bar to the lower chest, pauses briefly, then presses back up to the starting lockout — seamless loop, ends exactly where it begins. The lower chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the decline angle and the bar path.

## Push-up
**Muscle group:** Chest (equipment: bodyweight)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Full Body, HIIT & Core
**How to do it:** Start in a plank position with hands slightly wider than shoulder width, body straight from head to heels. Lower your chest to just above the floor by bending your elbows, then press back up to full arm extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in a push-up position with visible muscle structure, plain white background. The animation starts at the top plank, arms fully extended, body straight; the figure smoothly lowers the chest to just above the floor, elbows bending to roughly 45 degrees, pauses briefly, then presses back up to the starting plank — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the elbow angle and full-body plank line.

## Dumbbell fly
**Muscle group:** Chest (equipment: dumbbell, flat bench)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Chest day)
**How to do it:** Lie on a flat bench holding a dumbbell in each hand above your chest, palms facing each other with a slight bend in the elbows. Lower the dumbbells out to the sides in a wide arc until you feel a stretch across your chest, then bring them back together above your chest.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on a flat bench with visible muscle structure, plain white background, a dumbbell in each hand. The animation starts with both dumbbells together above the chest; the figure smoothly lowers them out wide to the sides in an arc, pauses briefly at the stretch, then brings them back together above the chest — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the wide arcing arm path.

## Cable crossover
**Muscle group:** Chest (equipment: cable machine, dual pulley)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Chest day)
**How to do it:** Stand centered between two high cable pulleys, gripping one handle in each hand with arms out wide and a slight bend in the elbows. Pull both handles down and together in front of your hips in a crossing arc, squeeze your chest, then return under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, positioned between two tall cable towers with pulleys set high. The animation starts with arms spread wide, cables taut overhead; the figure smoothly pulls both handles down and crosses them together in front of the hips, pauses briefly at the squeeze, then returns to the wide starting position — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing both cable towers and the crossing arm path.

## Chest dip
**Muscle group:** Chest (equipment: parallel bars/dip station)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Chest day)
**How to do it:** Support yourself on parallel bars or a dip station with arms straight, leaning your torso forward slightly. Lower your body by bending your elbows until you feel a stretch across your chest, then press back up to full arm extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure supported on parallel dip bars with visible muscle structure, plain white background. The animation starts at the top, arms straight, torso leaned slightly forward; the figure smoothly lowers with elbows bending, chest stretching below the bars, pauses briefly at the bottom, then presses back up to the starting top position — seamless loop, ends exactly where it begins. The chest is highlighted in solid red/orange throughout. Camera: clean side angle showing the parallel bars and the forward torso lean.

# Mid-back (rows)

## Inverted row
**Muscle group:** Mid-back (rows) (equipment: bodyweight — sturdy low bar or table edge)
**How to do it:** Lie on your back under a sturdy table or low bar, gripping it slightly wider than shoulder width, body held straight from head to heels. Pull your chest up to the bar by driving your elbows down and back, then lower under control. Bend your knees to make it easier, or elevate your feet on a chair to make it harder.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, hanging under a sturdy waist-high bar. The animation starts with arms fully extended, chest below the bar, body straight as a plank; the figure smoothly pulls the chest up to touch the bar, elbows driving back, pauses briefly at the top, then lowers back to the starting hang — seamless loop, ends exactly where it begins. The mid-back (rhomboids/mid-trapezius) is highlighted in solid red/orange throughout. Camera: clean three-quarter side angle showing the elbow-pulling action and the bar.

## Single-arm DB row
**Muscle group:** Mid-back (rows) (equipment: dumbbell) — unilateral
**How to do it:** Kneel with one hand and one knee planted on a bench or chair, torso flat and parallel to the ground, holding a dumbbell in the opposite hand hanging straight down. Pull the dumbbell up to your hip by driving your elbow back, squeeze for a second, then lower with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, kneeling with one hand and knee braced on a bench, holding a dumbbell in the working hand. The animation starts with the working arm hanging straight down; the figure smoothly pulls the dumbbell up to the hip, elbow driving back, pauses briefly at the top, then lowers back to the starting hang — seamless loop, ends exactly where it begins. The mid-back on the working side is highlighted in solid red/orange throughout. Camera: three-quarter angle showing the bench, the dumbbell, and the elbow path.

## Barbell row
**Muscle group:** Mid-back (rows) (equipment: barbell)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Back day)
**How to do it:** Hinge forward at the hips holding a barbell with an overhand grip, back flat and knees slightly bent. Pull the bar up to your lower ribs by driving your elbows back, squeeze, then lower with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure hinged forward with visible muscle structure, plain white background, holding a loaded barbell. The animation starts with arms fully extended below the knees, back flat; the figure smoothly pulls the bar up to the lower ribs, elbows driving back, pauses briefly at the top, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The mid-back is highlighted in solid red/orange throughout. Camera: clean side angle showing the hip-hinge angle and the barbell path.

## Seated cable row
**Muscle group:** Mid-back (rows) (equipment: cable row machine)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Back day)
**How to do it:** Sit at a cable row station with feet braced on the platform and knees slightly bent, gripping the handle with arms extended. Pull the handle to your torso by driving your elbows back and squeezing your shoulder blades together, then extend back out with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated at a cable row machine with visible muscle structure, plain white background, feet braced on the platform. The animation starts with arms fully extended toward the pulley, cable taut; the figure smoothly pulls the handle to the torso, elbows driving back and shoulder blades squeezing together, pauses briefly, then extends back to the starting reach — seamless loop, ends exactly where it begins. The mid-back is highlighted in solid red/orange throughout. Camera: clean side angle showing the cable path and the seated brace.

## T-bar row
**Muscle group:** Mid-back (rows) (equipment: barbell/T-bar row machine)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Back day)
**How to do it:** Straddle a T-bar row machine (or a landmine-anchored barbell), hinge forward at the hips with a flat back, and grip the handles. Pull the weight up to your torso by driving your elbows back, then lower under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure straddling a T-bar row machine with visible muscle structure, plain white background, hinged forward at the hips. The animation starts with arms fully extended down toward the loaded handles; the figure smoothly pulls the handles up to the torso, elbows driving back and high, pauses briefly, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The mid-back is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the straddled stance and the T-bar path.

# Lats (pull-ups)

## Chin-up
**Muscle group:** Lats (pull-ups) (equipment: pull-up bar)
**How to do it:** Hang from a pull-up bar with palms facing you, shoulder-width grip, arms fully extended. Pull your body up until your chin clears the bar, then lower back to a full hang. Use a resistance band for assistance or slow negatives if a full rep isn't possible yet.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, hanging from a pull-up bar with palms facing the body. The animation starts at a full hang, arms extended, feet off the floor; the figure smoothly pulls up until the chin clears the bar, elbows driving down toward the hips, pauses briefly at the top, then lowers back to the starting hang — seamless loop, ends exactly where it begins. The lats are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the bar and the full arm/shoulder joint action.

## Dead hang
**Muscle group:** Lats (pull-ups) (equipment: pull-up bar)
**How to do it:** Grip a pull-up bar with hands shoulder-width apart and hang with arms fully straight, feet off the floor, letting your shoulders and lats stretch under your own bodyweight. Hold this position for time rather than performing reps.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, gripping a pull-up bar. The animation starts with the figure reaching up to the bar, feet near the floor; it smoothly rises into a full dead hang, arms straight, shoulders stretched, feet lifted off the floor, holds briefly, then eases back down to the starting reach — seamless loop, ends exactly where it begins. The lats are highlighted in solid red/orange throughout, showing the passive stretch. Camera: clean side angle showing full body extension under the bar.

## Pull-up
**Muscle group:** Lats (pull-ups) (equipment: pull-up bar)
**How to do it:** Hang from the bar with an overhand, shoulder-width grip, arms fully straight. Pull your body up until your chin passes the bar, driving your elbows down toward your hips, then lower under control. Use band assistance or slow 5-second negatives if needed.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, hanging from a pull-up bar with an overhand grip. The animation starts at a full hang, arms straight, feet off the ground; the figure smoothly pulls up until the chin clears the bar, elbows driven down and back, pauses briefly at the top, then lowers back to the starting hang — seamless loop, ends exactly where it begins. The lats are highlighted in solid red/orange throughout. Camera: three-quarter angle clearly showing the bar and the pulling motion.

## Lat pulldown
**Muscle group:** Lats (pull-ups) (equipment: cable lat pulldown machine)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Back day)
**How to do it:** Sit at a lat pulldown station with thighs braced under the pad, gripping the bar wider than shoulder width. Pull the bar down to your upper chest by driving your elbows down and back, then let it rise back to full arm extension under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated at a lat pulldown machine with visible muscle structure, plain white background, thighs braced under the pad. The animation starts with arms fully extended overhead gripping the wide bar, cable taut; the figure smoothly pulls the bar down to the upper chest, elbows driving down and back, pauses briefly, then lets it rise back to the starting extended position — seamless loop, ends exactly where it begins. The lats are highlighted in solid red/orange throughout. Camera: clean side angle showing the cable tower and the bar's downward path.

# Biceps

## Hammer curl
**Muscle group:** Biceps (equipment: dumbbell)
**How to do it:** Stand holding a dumbbell in each hand at your sides with palms facing your body (neutral grip). Curl both dumbbells up toward your shoulders, keeping your elbows pinned to your sides, then lower slowly.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, a dumbbell in each hand held with a neutral grip. The animation starts with arms fully extended at the sides; the figure smoothly curls both dumbbells up toward the shoulders, elbows pinned to the sides, pauses briefly at the top, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The biceps are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing both elbows and the neutral grip.

## Incline curl
**Muscle group:** Biceps (equipment: dumbbell)
**How to do it:** Sit back on an incline bench (or lean your torso back) letting your arms hang straight down behind your torso, a dumbbell in each hand. Curl the weights up toward your shoulders without swinging, taking the final set to true failure.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure reclined on an incline bench with visible muscle structure, plain white background, a dumbbell in each hand. The animation starts with both arms hanging straight down behind the torso; the figure smoothly curls the dumbbells up toward the shoulders without swinging, pauses briefly at the top, then lowers back to the starting hang — seamless loop, ends exactly where it begins. The biceps are highlighted in solid red/orange throughout. Camera: three-quarter angle showing the incline bench and the stretched-arm starting position.

## Barbell curl
**Muscle group:** Biceps (equipment: barbell)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Stand holding a barbell with an underhand, shoulder-width grip, arms fully extended, elbows pinned to your sides. Curl the bar up toward your shoulders, then lower slowly back to full extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, holding a loaded barbell. The animation starts with arms fully extended, elbows pinned to the sides; the figure smoothly curls the barbell up to shoulder height, pauses briefly at the top, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The biceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the fixed elbow position and the curl path.

## Dumbbell curl
**Muscle group:** Biceps (equipment: dumbbell)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Stand holding a dumbbell in each hand at your sides, palms facing forward. Curl both dumbbells up toward your shoulders, keeping your elbows pinned to your sides, then lower slowly.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, a dumbbell in each hand. The animation starts with arms fully extended at the sides, palms facing forward; the figure smoothly curls both dumbbells up to shoulder height, elbows pinned to the sides, pauses briefly, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The biceps are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing both elbows and the supinated grip.

## Preacher curl
**Muscle group:** Biceps (equipment: barbell/EZ-bar, preacher bench)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Sit at a preacher bench with your upper arms braced against the angled pad, gripping a barbell or EZ-bar with arms extended. Curl the weight up toward your shoulders, then lower slowly until your arms are fully straight.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated at a preacher bench with visible muscle structure, plain white background, upper arms braced on the angled pad, holding a barbell. The animation starts with arms fully extended down the pad; the figure smoothly curls the barbell up toward the shoulders, upper arms staying pinned to the pad, pauses briefly, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The biceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the preacher pad bracing the upper arms.

## Concentration curl
**Muscle group:** Biceps (equipment: dumbbell) — unilateral
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Sit on a bench with your elbow braced against the inside of your thigh, holding a dumbbell with your arm extended toward the floor. Curl the dumbbell up toward your shoulder, then lower slowly with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin seated figure with visible muscle structure, plain white background, elbow braced against the inner thigh, holding one dumbbell. The animation starts with the arm extended straight down toward the floor; the figure smoothly curls the dumbbell up toward the shoulder, elbow staying braced against the thigh, pauses briefly, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The biceps of the working arm are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the braced elbow and the curl path.

# Calves

## Seated calf raise
**Muscle group:** Calves (equipment: dumbbell)
**How to do it:** Sit on a bench with a dumbbell resting on top of each knee, the balls of your feet on a small platform and heels hanging off the edge. Rise up onto your toes as high as possible, pausing 2 seconds at the bottom stretch on the way down.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin seated figure with visible muscle structure, plain white background, dumbbells resting on the knees, feet on a raised platform. The animation starts with heels dropped below the platform edge in a deep stretch; the figure smoothly rises up onto the balls of the feet, heels lifting high, pauses briefly at the top, then lowers back to the starting stretch — seamless loop, ends exactly where it begins. The calves are highlighted in solid red/orange throughout. Camera: clean side angle showing the platform, the dumbbells, and the ankle joint action.

## Skipping
**Muscle group:** Calves (equipment: jump rope)
**How to do it:** Jump rope at a steady rhythm, staying light on the balls of your feet, in 60-second work intervals followed by 45 seconds of rest.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, a jump rope trailing at the heels. The animation starts with feet on the ground, knees soft, rope behind the heels; the figure smoothly jumps, toes pointing down as the rope passes beneath the feet, then lands back on the ground in the starting position — seamless loop, ends exactly where it begins. The calves are highlighted in solid red/orange throughout. Camera: clean side angle showing the jump rope and the ankle/toe extension.

## Standing calf raise
**Muscle group:** Calves (equipment: dumbbell) — unilateral
**How to do it:** Stand on one foot on the edge of a step, holding a single dumbbell in the same-side hand, letting your heel drop below the step for a deep stretch. Rise onto your toes as high as you can without bouncing, pausing 2 seconds at the bottom each rep.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure balanced on a raised step with visible muscle structure, plain white background, one dumbbell held at the same side, the other leg lifted and bent behind. The animation starts with the working heel dropped below step level in a deep stretch; the figure smoothly rises onto the toes of the working foot, heel lifting high, pauses briefly, then lowers back to the starting stretch — seamless loop, ends exactly where it begins. The calf of the working leg is highlighted in solid red/orange throughout. Camera: clean side angle showing the step, the single dumbbell, and the ankle action.

## Machine calf raise
**Muscle group:** Calves (equipment: standing calf raise machine)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Stand under the shoulder pads of a standing calf raise machine, balls of your feet on the platform edge and heels hanging off. Rise up onto your toes as high as possible, pause, then lower your heels below the platform for a deep stretch.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure standing in a shoulder-loaded calf raise machine with visible muscle structure, plain white background, balls of the feet on a raised platform. The animation starts with heels dropped below the platform edge in a deep stretch; the figure smoothly rises up onto the toes, heels lifting high, pauses briefly, then lowers back to the starting stretch — seamless loop, ends exactly where it begins. The calves are highlighted in solid red/orange throughout. Camera: clean side angle showing the machine pads and the ankle-extension path.

# Core (anti-extension)

## Dead bug
**Muscle group:** Core (anti-extension) (equipment: bodyweight)
**How to do it:** Lie on your back with arms reaching toward the ceiling and knees bent 90 degrees above your hips. Keeping your lower back pressed flat into the floor, slowly extend one arm overhead and the opposite leg out straight, then return and repeat on the other side.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on its back with visible muscle structure, plain white background. The animation starts with both arms reaching straight up and both knees bent 90 degrees above the hips, lower back flat on the floor; the figure smoothly extends one arm overhead and the opposite leg straight out low to the floor, lower back staying flat throughout, then returns both limbs to the starting bent position — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean overhead-angled three-quarter view showing the flat lower back and the opposing limb extension.

## Hanging knee raise
**Muscle group:** Core (anti-extension) (equipment: pull-up bar)
**How to do it:** Hang from a pull-up bar with arms straight. Tuck your pelvis under and raise your knees up toward your chest, then lower with control; progress over time to straight-leg raises and eventually toes-to-bar.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure hanging from a pull-up bar with visible muscle structure, plain white background. The animation starts with arms straight and legs hanging straight down; the figure smoothly raises the knees up toward the chest, pelvis tucking under, pauses briefly at the top, then lowers back to the starting hang — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean side angle showing the bar and the full hip-flexion range.

## Hollow hold
**Muscle group:** Core (anti-extension) (equipment: bodyweight)
**How to do it:** Lie on your back, press your lower back flat into the floor, then lift your shoulders and legs slightly off the ground with arms extended overhead, forming a shallow "hollow" body shape. Hold this position for time.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on the floor with visible muscle structure, plain white background, arms overhead. The animation starts flat on the floor, arms overhead, legs down; the figure smoothly lifts into a shallow hollow position, shoulders and legs raised slightly off the floor, lower back pressed flat, holds briefly, then eases back down to the starting flat position — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean side angle showing the shallow body curve above the floor.

## Long-lever plank
**Muscle group:** Core (anti-extension) (equipment: bodyweight)
**How to do it:** Get into a forearm plank but walk your elbows out in front of your shoulders rather than directly beneath them, keeping your body in a straight line. Hold this harder, longer-lever version of the plank for time.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in a forearm plank with visible muscle structure, plain white background. The animation starts with elbows directly under the shoulders, body straight; the figure smoothly walks the elbows forward well past the shoulders, body staying perfectly straight, holds briefly at the longer lever, then walks the elbows back to the starting position under the shoulders — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean side angle showing the elbow position relative to the shoulders.

## Standard plank
**Muscle group:** Core (anti-extension) (equipment: bodyweight)
**Common in:** HIIT & Core, Full Body
**How to do it:** Get into a forearm plank with elbows directly under your shoulders and body in a straight line from head to heels. Brace your core to keep your hips from sagging or piking, and hold the position for time.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in a forearm plank with visible muscle structure, plain white background. The animation starts with the figure settling into position, hips slightly raised while finding the elbows-under-shoulders alignment; it smoothly settles into a perfect plank, body in a straight line from head to heels, holds briefly, then subtly resets to the starting settling position — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean side angle showing the straight body line and elbow position.

## Mountain climber
**Muscle group:** Core (anti-extension) (equipment: bodyweight)
**Common in:** HIIT & Core, Full Body
**How to do it:** Start in a high plank with hands under your shoulders. Drive one knee toward your chest, then quickly switch legs in a running-like motion while keeping your hips low and core braced.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in a high plank position with visible muscle structure, plain white background. The animation starts with both legs extended straight back, hands under the shoulders; the figure smoothly drives one knee up toward the chest while hips stay low and level, then drives that leg back and brings the other knee forward, cycling back to the starting extended-legs plank — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean side angle showing the level hips and the driving knee.

## Ab wheel rollout
**Muscle group:** Core (anti-extension) (equipment: ab wheel)
**Common in:** HIIT & Core
**How to do it:** Kneel on the floor gripping an ab wheel with both hands. Roll the wheel forward, extending your body out as far as you can control while keeping your core braced and back flat, then roll back to the starting kneeling position.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin kneeling figure with visible muscle structure, plain white background, gripping an ab wheel. The animation starts kneeling upright with the wheel close in front of the knees; the figure smoothly rolls the wheel far out in front, body extending long and low near the floor, back flat, pauses briefly at full extension, then rolls back to the starting kneeling position — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean side angle showing the extended rollout length and the flat back.

## Hanging straight-leg raise
**Muscle group:** Core (anti-extension) (equipment: pull-up bar)
**Common in:** HIIT & Core
**How to do it:** Hang from a pull-up bar with arms straight. Keeping your legs straight, raise them up in front of you until they're roughly parallel to the floor (or higher), then lower with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure hanging from a pull-up bar with visible muscle structure, plain white background. The animation starts with both legs hanging straight down, arms straight; the figure smoothly raises both straight legs up in front to roughly parallel with the floor, pauses briefly at the top, then lowers back to the starting hang — seamless loop, ends exactly where it begins. The front abdominal core (anti-extension muscles) is highlighted in solid red/orange throughout. Camera: clean side angle showing the bar and the straight-leg raise height.

# Core (anti-lateral flexion)

## Side plank
**Muscle group:** Core (anti-lateral flexion) (equipment: bodyweight) — unilateral
**How to do it:** Lie on your side, prop yourself up on one forearm directly under your shoulder, and stack your feet, lifting your hips off the floor into a straight line from head to feet. Hold for time, then repeat on the other side.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in a side plank with visible muscle structure, plain white background. The animation starts lying on the side, hips on the floor, forearm planted under the shoulder; the figure smoothly lifts the hips off the floor into a straight line from head to feet, weight supported on the one forearm and stacked feet, holds briefly, then lowers back to the starting position — seamless loop, ends exactly where it begins. The core on the down/working side (anti-lateral flexion, obliques) is highlighted in solid red/orange throughout. Camera: clean side-on angle showing the straight body line and single-arm support.

## Suitcase carry
**Muscle group:** Core (anti-lateral flexion) (equipment: dumbbell) — unilateral
**How to do it:** Hold a single dumbbell in one hand down at your side, like carrying a suitcase, and walk forward 30-40 meters while keeping your torso upright and resisting the urge to lean toward the loaded side.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin walking figure with visible muscle structure, plain white background, one dumbbell held down at the side. The animation starts with one foot leading, torso upright, dumbbell held straight down; the figure smoothly takes a stride forward with the opposite foot leading, torso staying upright and resisting any lean, then cycles back to the starting stride — seamless loop, ends exactly where it begins. The core on the unloaded side (anti-lateral flexion, obliques) is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the upright torso and the single loaded hand.

# Core (anti-rotation)

## Pallof press
**Muscle group:** Core (anti-rotation) (equipment: resistance band) — performed facing one side of the anchor at a time
**How to do it:** Anchor a resistance band at chest height to your side and stand perpendicular to it, holding the handle at your sternum with both hands. Press the band straight out in front of your chest and hold, resisting its pull toward the anchor, then return; switch to face the other direction to work the other side.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, a resistance band anchored at chest height to one side. The animation starts with the handle held at the sternum with both hands; the figure smoothly presses the band straight out in front of the chest, torso braced against the rotational pull, holds briefly, then draws the handle back to the starting sternum position — seamless loop, ends exactly where it begins. The core (anti-rotation, obliques/deep trunk muscles) is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the band anchor to the side and the straight-arm press.

# Core (flexion & rotation)

## Crunch
**Muscle group:** Core (flexion) (equipment: bodyweight)
**Common in:** HIIT & Core
**How to do it:** Lie on your back with knees bent and feet flat on the floor, hands lightly supporting your head. Curl your shoulders up off the floor toward your knees, squeeze your abs, then lower back down under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on its back with visible muscle structure, plain white background, knees bent, hands lightly behind the head. The animation starts flat with shoulders resting on the floor; the figure smoothly curls the shoulders up off the floor toward the knees, abs visibly shortening, pauses briefly at the top, then lowers back to the starting flat position — seamless loop, ends exactly where it begins. The front abdominal core is highlighted in solid red/orange throughout. Camera: clean side angle showing the shoulder-curl height off the floor.

## Russian twist
**Muscle group:** Core (rotation) (equipment: weight plate/dumbbell)
**Common in:** HIIT & Core
**How to do it:** Sit on the floor with knees bent and feet lifted slightly, leaning your torso back at an angle, holding a weight with both hands. Rotate your torso to tap the weight on the floor beside one hip, then rotate to the other side.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated on the floor with visible muscle structure, plain white background, torso leaned back, feet lifted, holding a weight with both hands. The animation starts with the weight rotated to one side near the hip; the figure smoothly rotates the torso to the opposite side, tapping the weight near the other hip, then rotates back to the starting side — seamless loop, ends exactly where it begins. The obliques are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the balanced seated position and the torso-rotation arc.

# Front shoulders

## DB Arnold press
**Muscle group:** Front shoulders (equipment: dumbbell)
**How to do it:** Sit or stand holding a dumbbell in each hand at shoulder height, palms facing your body near your chin. Press the dumbbells overhead while rotating your palms to face forward at the top, then reverse the rotation as you lower.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, a dumbbell in each hand. The animation starts with the dumbbells at chin height, palms facing the body, elbows bent and low; the figure smoothly presses the dumbbells overhead while rotating the palms to face forward, pauses briefly at the top, then reverses the rotation while lowering back to the starting chin-height position — seamless loop, ends exactly where it begins. The front shoulders are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the palm rotation and overhead press path.

## Pike push-up
**Muscle group:** Front shoulders (equipment: bodyweight)
**How to do it:** Start in a downward-dog-like position with hips high and hands and feet on the floor, forming an inverted V. Bend your elbows to lower the crown of your head toward the floor between your hands, then press back up.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, in an inverted-V pike position. The animation starts with hips high and arms fully extended; the figure smoothly bends the elbows, lowering the crown of the head toward the floor between the hands, hips staying high, pauses briefly, then presses back up to the starting extended pike — seamless loop, ends exactly where it begins. The front shoulders are highlighted in solid red/orange throughout. Camera: clean side angle showing the inverted-V shape and the head-lowering path.

## Overhead press
**Muscle group:** Front shoulders (equipment: barbell)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Shoulders day), Full Body
**How to do it:** Stand holding a barbell at shoulder height with an overhand grip, core braced. Press the bar straight overhead until your arms are fully extended, then lower back to shoulder height under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, holding a loaded barbell. The animation starts with the barbell racked at shoulder height, elbows forward; the figure smoothly presses the bar straight overhead to full arm extension, pauses briefly at lockout, then lowers back to the starting shoulder-height rack — seamless loop, ends exactly where it begins. The front shoulders are highlighted in solid red/orange throughout. Camera: clean side angle showing the vertical press path.

## Front raise
**Muscle group:** Front shoulders (equipment: dumbbell)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Shoulders day)
**How to do it:** Stand holding a dumbbell in each hand in front of your thighs, palms facing your body. Raise both arms straight out in front of you to shoulder height, then lower slowly back down.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, a dumbbell in each hand. The animation starts with both dumbbells held in front of the thighs; the figure smoothly raises both arms straight out to shoulder height, pauses briefly, then lowers back to the starting position in front of the thighs — seamless loop, ends exactly where it begins. The front shoulders are highlighted in solid red/orange throughout. Camera: clean side angle showing the front-raise arc.

# Traps

## Barbell shrug
**Muscle group:** Traps (equipment: barbell/dumbbell)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Back day)
**How to do it:** Stand holding a barbell or a dumbbell in each hand at your sides, arms straight. Elevate your shoulders straight up toward your ears as high as possible, pause briefly, then lower with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, holding a loaded barbell in front of the thighs. The animation starts with shoulders relaxed and down; the figure smoothly elevates the shoulders straight up toward the ears, arms staying straight, pauses briefly at the top, then lowers back to the starting relaxed position — seamless loop, ends exactly where it begins. The traps are highlighted in solid red/orange throughout. Camera: clean front three-quarter angle showing the vertical shoulder-elevation path.

# Glutes

## Single-leg hip thrust
**Muscle group:** Glutes (equipment: bodyweight — sofa/bench edge) — unilateral
**How to do it:** Sit with your upper back against the edge of a sofa or bench, one foot planted on the floor and the other leg extended or lifted. Drive through the planted heel to lift your hips into a straight line from shoulders to knee, squeeze, then lower.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, upper back braced against a sofa/bench edge, one foot planted, the other leg extended. The animation starts with hips lowered near the floor; the figure smoothly drives through the planted heel, lifting the hips into a straight line from shoulders to knee, the other leg staying extended and passive, pauses briefly at the top, then lowers back to the starting position — seamless loop, ends exactly where it begins. The glute of the working leg is highlighted in solid red/orange throughout. Camera: clean side angle showing the hip extension and the single-leg drive.

## Barbell hip thrust
**Muscle group:** Glutes (equipment: barbell, bench)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Sit on the floor with your upper back braced against a bench, a loaded barbell across your hips. Drive through your heels to lift your hips until your body forms a straight line from shoulders to knees, squeeze your glutes, then lower back down.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, upper back braced against a bench, a loaded barbell across the hips. The animation starts with hips lowered near the floor; the figure smoothly drives through the heels, lifting the hips into a straight line from shoulders to knees, pauses briefly at the top, then lowers back to the starting position — seamless loop, ends exactly where it begins. The glutes are highlighted in solid red/orange throughout. Camera: clean side angle showing the bench brace and the hip-extension lockout.

## Glute bridge
**Muscle group:** Glutes (equipment: bodyweight/barbell)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Lie on your back with knees bent and feet flat on the floor, arms at your sides (or a barbell across your hips). Drive through your heels to lift your hips until your body forms a straight line from shoulders to knees, squeeze, then lower down.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on its back with visible muscle structure, plain white background, knees bent, feet flat on the floor. The animation starts with hips down on the floor; the figure smoothly lifts the hips into a straight line from shoulders to knees, glutes squeezing at the top, pauses briefly, then lowers back to the starting position — seamless loop, ends exactly where it begins. The glutes are highlighted in solid red/orange throughout. Camera: clean side angle showing the hip-lift height and knee angle.

## Cable kickback
**Muscle group:** Glutes (equipment: cable machine, ankle cuff) — unilateral
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Attach an ankle cuff to a low cable pulley and secure it around one ankle. Facing the machine with a slight forward lean, kick your leg straight back and up, squeezing your glute, then return with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, an ankle cuff attached to a low cable pulley. The animation starts with the cuffed leg forward near the machine, cable taut; the figure smoothly kicks the leg straight back and up behind the body, glute squeezing, pauses briefly, then returns to the starting forward position — seamless loop, ends exactly where it begins. The glute of the working leg is highlighted in solid red/orange throughout. Camera: clean side angle showing the cable anchor and the leg's backward kick path.

# Hamstrings (hip hinge)

## DB RDL
**Muscle group:** Hamstrings (hip hinge) (equipment: dumbbell)
**How to do it:** Stand holding dumbbells in front of your thighs with soft knees. Push your hips straight back while lowering the weights toward your shins over 3 seconds, keeping your back flat, until you feel a deep hamstring stretch, then drive your hips forward to stand.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, dumbbells held in front of the thighs. The animation starts standing upright, knees soft; the figure smoothly hinges forward at the hips, back flat, lowering the dumbbells near the shins, pauses briefly at the deep stretch, then drives the hips forward back to the starting upright position — seamless loop, ends exactly where it begins. The hamstrings are highlighted in solid red/orange throughout. Camera: clean side angle showing the flat back and hip-hinge angle.

## Barbell RDL
**Muscle group:** Hamstrings (hip hinge) (equipment: barbell)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Stand holding a barbell at hip height with an overhand grip, soft knees. Push your hips straight back while lowering the bar close to your legs over 3 seconds, keeping your back flat, until you feel a deep hamstring stretch, then drive your hips forward to stand tall.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, holding a loaded barbell at hip height. The animation starts standing upright, knees soft, the bar held close to the thighs; the figure smoothly hinges forward at the hips, back flat, lowering the bar close along the legs, pauses briefly at the deep hamstring stretch, then drives the hips forward back to the starting upright position — seamless loop, ends exactly where it begins. The hamstrings are highlighted in solid red/orange throughout. Camera: clean side angle showing the flat back, the barbell staying close to the legs, and the hip-hinge angle.

## Single-leg RDL
**Muscle group:** Hamstrings (hip hinge) (equipment: dumbbell) — unilateral
**How to do it:** Stand on one leg holding a dumbbell in the opposite hand. Hinge forward at the hip, extending the free leg straight back behind you for balance while lowering the weight toward the floor, then reverse slowly back to standing.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, balanced on one leg, a dumbbell in the opposite hand. The animation starts standing upright, the free leg lightly touching down behind; the figure smoothly hinges forward, torso near-parallel to the floor, free leg extending straight back for balance, dumbbell lowering toward the floor, pauses briefly, then reverses back to the starting upright position — seamless loop, ends exactly where it begins. The hamstring of the standing/working leg is highlighted in solid red/orange throughout. Camera: clean side angle showing the balance position and hip hinge.

## Deadlift
**Muscle group:** Hamstrings (hip hinge) (equipment: barbell)
**Common in:** Push/Pull/Legs (Pull day), Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Back day), Full Body
**How to do it:** Stand with feet hip-width apart, a barbell over your midfoot. Hinge down and grip the bar just outside your knees, back flat, chest up. Drive through your heels to stand tall, keeping the bar close to your body, then reverse the motion to lower it back down.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, gripping a loaded barbell. The animation starts hinged down low, back flat, chest up, gripping the bar just outside the knees; the figure smoothly drives through the heels to stand fully tall, hips extending, the barbell held close against the thighs, pauses briefly at lockout, then reverses back to the starting hinged position — seamless loop, ends exactly where it begins. The hamstrings (and posterior chain) are highlighted in solid red/orange throughout. Camera: clean side angle showing the flat back and the full hip-extension lockout.

# Hamstrings (knee flexion)

## Band leg curl
**Muscle group:** Hamstrings (knee flexion) (equipment: resistance band) — one leg works at a time
**How to do it:** Lie face down with a resistance band looped around one ankle and anchored behind you. Curl your heel up toward your glutes by bending the knee against the band's resistance, then lower with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying face down with visible muscle structure, plain white background, a resistance band looped around one ankle and anchored behind. The animation starts with the working leg extended straight, band taut; the figure smoothly curls the heel up toward the glutes, knee bending against the band's resistance, pauses briefly, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The hamstring of the working leg is highlighted in solid red/orange throughout. Camera: clean side angle showing the band anchor and the knee-flexion path.

## Nordic negative
**Muscle group:** Hamstrings (knee flexion) (equipment: bodyweight — anchored heels)
**How to do it:** Kneel with your heels anchored securely under something heavy. Slowly lower your torso forward as far as you can control, resisting with your hamstrings, then catch yourself with your hands on the floor.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin kneeling figure with visible muscle structure, plain white background, heels anchored under a heavy support. The animation starts kneeling upright, torso vertical; the figure smoothly lowers the torso forward at a steep angle toward the floor, hamstrings straining to control the descent, hands approaching the floor, then draws back up to the starting upright kneeling position — seamless loop, ends exactly where it begins. The hamstrings are highlighted in solid red/orange throughout. Camera: clean side angle showing the anchored heels and the forward-lowering torso angle.

## Machine leg curl
**Muscle group:** Hamstrings (knee flexion) (equipment: leg curl machine)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Lie face down on a leg curl machine with the pad resting against the back of your ankles, legs fully extended. Curl your heels up toward your glutes by bending your knees against the machine's resistance, then lower back down under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying face down on a leg curl machine with visible muscle structure, plain white background, ankle pad resting behind the lower legs. The animation starts with legs fully extended, the pad low near the ankles; the figure smoothly curls the pad up toward the glutes, knees bending fully, pauses briefly, then lowers back to the starting extended position — seamless loop, ends exactly where it begins. The hamstrings are highlighted in solid red/orange throughout. Camera: clean side angle showing the prone machine position and the knee-flexion path.

# Quadriceps

## Bulgarian split squat
**Muscle group:** Quadriceps (equipment: dumbbell) — unilateral
**How to do it:** Stand a couple of feet in front of a chair or bench with one foot resting on it behind you, holding a dumbbell in each hand. Lower your body by bending the front knee until your rear knee nearly touches the floor, then push through the front heel to stand.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, rear foot elevated on a bench behind, dumbbells at the sides. The animation starts standing tall, front leg slightly bent; the figure smoothly lowers deep, front knee bending to near 90 degrees, rear knee nearly touching the floor, pauses briefly at the bottom, then pushes back up through the front heel to the starting tall position — seamless loop, ends exactly where it begins. The quadricep of the front working leg is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the bench, the rear-foot elevation, and the front knee bend.

## DB reverse lunge
**Muscle group:** Quadriceps (equipment: dumbbell) — unilateral
**How to do it:** Stand holding dumbbells at your sides. Step one foot backward and lower your rear knee toward the floor, keeping most of your weight on the front leg, then push through the front foot to return to standing.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, dumbbells at the sides. The animation starts standing upright, feet together; the figure smoothly steps one foot backward, lowering the rear knee near the floor, front leg bending and bearing the load, pauses briefly at the bottom, then pushes through the front foot back to the starting upright position — seamless loop, ends exactly where it begins. The quadricep of the front working leg is highlighted in solid red/orange throughout. Camera: clean side angle showing the split stance and front-knee bend.

## DB step-up
**Muscle group:** Quadriceps (equipment: dumbbell) — unilateral
**How to do it:** Stand facing a chair or sturdy step, holding a dumbbell in each hand. Place one foot fully on the step and drive through that heel to stand up onto it, then step back down with control and repeat.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, facing a raised step, dumbbells at the sides. The animation starts with one foot planted on the step, that leg bent to begin the drive; the figure smoothly drives up to stand fully on top of the step, hips extended, the trailing leg lifting and passive behind, pauses briefly, then steps back down to the starting position — seamless loop, ends exactly where it begins. The quadricep of the driving leg is highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the step and the driving-leg extension.

## Goblet squat
**Muscle group:** Quadriceps (equipment: dumbbell)
**How to do it:** Hold one dumbbell vertically at chest height with both hands. Squat down slowly over 3 seconds, pause a beat at the bottom, then drive back up to standing.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, one dumbbell held vertically at chest height with both hands. The animation starts standing upright; the figure smoothly squats down deep, thighs nearing parallel to the floor, knees tracking over the toes, dumbbell staying at the chest, pauses briefly at the bottom, then drives back up to the starting standing position — seamless loop, ends exactly where it begins. The quadriceps are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the squat depth and knee joint action.

## Barbell squat
**Muscle group:** Quadriceps (equipment: barbell) — barbell back squat
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day), Full Body
**How to do it:** Stand with a barbell racked across your upper back, feet shoulder-width apart. Bend your knees and hips to squat down until your thighs are at least parallel to the floor, then drive through your feet to stand back up.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, a loaded barbell racked across the upper back. The animation starts standing tall, knees soft; the figure smoothly squats down deep, thighs reaching parallel to the floor, knees tracking over the toes, pauses briefly at the bottom, then drives back up through the feet to the starting tall position — seamless loop, ends exactly where it begins. The quadriceps are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the squat depth and the racked bar.

## Leg press
**Muscle group:** Quadriceps (equipment: leg press machine)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Sit in a leg press machine with your feet shoulder-width apart on the platform. Lower the platform by bending your knees toward your chest, then press back out through your feet to full leg extension without locking your knees.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated in a leg press machine with visible muscle structure, plain white background, feet planted on the angled platform. The animation starts with knees bent deep toward the chest, the platform lowered close; the figure smoothly presses the platform out through the legs to near-full extension, pauses briefly, then lowers back to the starting bent position — seamless loop, ends exactly where it begins. The quadriceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the sled angle and the leg-extension path.

## Leg extension
**Muscle group:** Quadriceps (equipment: leg extension machine)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Sit in a leg extension machine with the pad resting against the front of your shins and knees bent at 90 degrees. Extend your legs straight out until your knees are fully locked out, then lower back down under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated in a leg extension machine with visible muscle structure, plain white background, shin pad resting against the lower legs. The animation starts with knees bent at 90 degrees, the pad low near the shins; the figure smoothly extends both legs straight out, knees locking, the pad lifting high, pauses briefly, then lowers back to the starting bent position — seamless loop, ends exactly where it begins. The quadriceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the seated machine and the knee-extension arc.

## Walking lunge
**Muscle group:** Quadriceps (equipment: dumbbell/bodyweight) — unilateral
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Stand holding dumbbells at your sides (or bodyweight only). Step one foot forward and lower your body until both knees are bent near 90 degrees, then push back through the front foot to return to standing.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, dumbbells held at the sides. The animation starts standing upright, feet together; the figure smoothly steps one foot forward into a deep lunge, both knees bending near 90 degrees, torso staying upright, pauses briefly at the bottom, then pushes back through the front foot to the starting upright position — seamless loop, ends exactly where it begins. The quadriceps of the front working leg are highlighted in solid red/orange throughout. Camera: clean side angle showing the forward step and the front-knee bend.

## Sumo squat
**Muscle group:** Quadriceps (equipment: barbell/dumbbell)
**Common in:** Push/Pull/Legs (Legs day), Upper/Lower (Lower day), Bro Split (Leg day)
**How to do it:** Stand with feet set wide, toes turned out, holding a barbell across your back or a dumbbell at your chest. Squat straight down between your legs until your thighs are parallel to the floor, then drive through your heels to stand back up.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, feet set wide with toes turned out, a dumbbell held at the chest. The animation starts standing tall in the wide stance; the figure smoothly squats down deep between the legs, thighs reaching parallel to the floor, knees tracking over the turned-out toes, pauses briefly, then drives back up to the starting tall position — seamless loop, ends exactly where it begins. The quadriceps (and inner thighs) are highlighted in solid red/orange throughout. Camera: clean front three-quarter angle showing the wide stance and squat depth.

# Rear shoulders

## Band face pull
**Muscle group:** Rear shoulders (equipment: resistance band)
**How to do it:** Anchor a resistance band at around head height and grip it with both hands, arms extended in front of you. Pull the band toward your forehead, driving your elbows high and out to the sides, and rotate your hands outward at the end range.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, gripping a band anchored at head height. The animation starts with arms extended straight out in front; the figure smoothly pulls the band to the forehead, elbows driving high and out to the sides, hands rotating outward, pauses briefly, then extends back to the starting reach — seamless loop, ends exactly where it begins. The rear shoulders are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the band anchor and the high-elbow pull path.

## Band pull-apart
**Muscle group:** Rear shoulders (equipment: resistance band)
**How to do it:** Hold a resistance band with both hands at chest height, arms straight out in front of you. Pull the band apart by moving your hands out to the sides until it touches your sternum, then return with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, holding a band with both hands at chest height. The animation starts with the hands together, arms extended straight out in front; the figure smoothly pulls the band apart, arms spreading wide to the sides until it touches the sternum, pauses briefly, then returns to the starting hands-together position — seamless loop, ends exactly where it begins. The rear shoulders are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the band stretch and the arm's outward path.

## Cable face pull
**Muscle group:** Rear shoulders (equipment: cable machine, rope attachment)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Shoulders day)
**How to do it:** Set a cable pulley to head height with a rope attachment and step back so the cable is taut, arms extended in front of you. Pull the rope toward your face, splitting your hands apart and driving your elbows high and out to the sides, then return under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, gripping a rope attachment on a cable machine set at head height. The animation starts with arms extended straight out toward the pulley, hands together; the figure smoothly pulls the rope to face level, hands splitting apart, elbows driving high and out to the sides, pauses briefly, then extends back to the starting reach — seamless loop, ends exactly where it begins. The rear shoulders are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the cable tower and the high-elbow pull path.

## Reverse fly
**Muscle group:** Rear shoulders (equipment: dumbbell)
**Common in:** Push/Pull/Legs (Pull day), Upper/Lower (Upper day), Bro Split (Shoulders day)
**How to do it:** Hinge forward at the hips holding a light dumbbell in each hand, arms hanging straight down with a slight elbow bend. Raise both arms out to the sides until they reach shoulder height, squeezing your shoulder blades together, then lower with control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure hinged forward at the hips with visible muscle structure, plain white background, a dumbbell in each hand. The animation starts with both dumbbells hanging straight down below the shoulders; the figure smoothly raises both arms out to the sides to shoulder height, shoulder blades squeezing together, pauses briefly, then lowers back to the starting hanging position — seamless loop, ends exactly where it begins. The rear shoulders are highlighted in solid red/orange throughout. Camera: clean side angle showing the hinge angle and the wide arm-raise arc.

# Side shoulders

## DB lateral raise
**Muscle group:** Side shoulders (equipment: dumbbell)
**How to do it:** Stand holding a light dumbbell in each hand at your sides. Raise both arms out to the sides, leading with your elbows, until they reach shoulder height, then lower slowly; on the final set, continue with small bottom-half partial reps to failure.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, dumbbells held down at the sides. The animation starts with arms straight down; the figure smoothly raises both arms out to the sides to shoulder height, elbows leading, forming a T shape, pauses briefly, then lowers back to the starting position — seamless loop, ends exactly where it begins. The side shoulders are highlighted in solid red/orange throughout. Camera: clean front three-quarter angle showing the full arm-raise arc.

# Triceps

## Bench dip
**Muscle group:** Triceps (equipment: bodyweight — chair/bench)
**How to do it:** Sit on the edge of a chair or bench with hands gripping the edge beside your hips, legs extended out (ideally with a second chair under your heels). Lower your body by bending your elbows until your shoulders reach a comfortable depth, then press back up.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, supported between two chairs/a bench. The animation starts with arms straight, hips near seat height; the figure smoothly lowers between the supports, elbows bending, hips dropping below the bench edge, pauses briefly, then presses back up to the starting raised position — seamless loop, ends exactly where it begins. The triceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the bench/chair supports and the elbow-bend depth.

## Parallel bar dip
**Muscle group:** Triceps (equipment: bodyweight — parallel bars/dip station)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Support yourself on parallel bars with arms straight, torso held upright rather than leaning forward, elbows tucked in close to your body. Lower yourself by bending your elbows until your upper arms are parallel to the floor, then press back up to full arm extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure supported on parallel dip bars with visible muscle structure, plain white background, torso held upright and vertical rather than leaning forward. The animation starts at the top, arms straight, elbows tucked close to the sides; the figure smoothly lowers with the elbows bending straight back, torso staying upright throughout, until the upper arms are parallel to the floor, pauses briefly at the bottom, then presses back up to the starting top position — seamless loop, ends exactly where it begins. The triceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the upright torso (distinct from a forward-leaning chest dip) and the tucked-elbow path.

## Overhead triceps extension
**Muscle group:** Triceps (equipment: dumbbell)
**How to do it:** Stand or sit holding one dumbbell with both hands overhead, arms fully extended. Lower the weight behind your head by bending only at the elbows, then extend back overhead, continuing to press upward rather than stopping short.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, holding one dumbbell with both hands overhead. The animation starts with arms fully extended straight up; the figure smoothly lowers the dumbbell behind the head by bending the elbows, upper arms staying vertical, pauses briefly, then extends back up to the starting overhead lockout — seamless loop, ends exactly where it begins. The triceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the fixed upper-arm position and the elbow-hinge motion.

## Tricep pushdown
**Muscle group:** Triceps (equipment: cable machine, bar/rope attachment)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Stand at a high cable pulley with a straight bar or rope attachment, elbows pinned to your sides, forearms parallel to the floor. Push the attachment straight down until your arms are fully extended, then let it rise back under control.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin standing figure with visible muscle structure, plain white background, gripping a bar attachment on a high cable pulley. The animation starts with elbows pinned to the sides, forearms parallel to the floor, the bar held high; the figure smoothly pushes the bar straight down to full arm extension, pauses briefly, then lets it rise back to the starting position — seamless loop, ends exactly where it begins. The triceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the cable tower and the downward push path.

## Skull crusher
**Muscle group:** Triceps (equipment: EZ-bar, flat bench)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Lie on a flat bench holding an EZ-bar above your chest with arms extended. Bend only at the elbows to lower the bar toward your forehead, then extend back up to full arm extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on a flat bench with visible muscle structure, plain white background, holding an EZ-curl bar. The animation starts with the bar held straight up above the chest; the figure smoothly lowers the bar toward the forehead, elbows bending, upper arms staying vertical, pauses briefly, then extends back up to the starting overhead position — seamless loop, ends exactly where it begins. The triceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the fixed upper-arm position and the elbow-hinge motion.

## Close grip bench press
**Muscle group:** Triceps (equipment: barbell, flat bench)
**Common in:** Push/Pull/Legs (Push day), Upper/Lower (Upper day), Bro Split (Arms day)
**How to do it:** Lie on a flat bench gripping the barbell with hands shoulder-width or slightly narrower. Lower the bar to your lower chest keeping your elbows tucked close to your body, then press back up to full extension.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure lying on a flat bench with visible muscle structure, plain white background, gripping a barbell with a narrow hand placement. The animation starts with arms fully extended above the chest; the figure smoothly lowers the bar to the lower chest, elbows tucked close to the torso, pauses briefly, then presses back up to the starting lockout — seamless loop, ends exactly where it begins. The triceps are highlighted in solid red/orange throughout. Camera: clean side angle showing the narrow grip and the tucked-elbow path.

# Cardio/conditioning

## Running
**Muscle group:** Cardio/conditioning (equipment: bodyweight/outdoor or treadmill)
**Common in:** HIIT & Core, Full Body
**How to do it:** Run at a steady pace outdoors or on a treadmill, landing softly under your hips with a relaxed upper body and driving your arms in rhythm with your stride.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure in mid-stride with visible muscle structure, plain white background. The animation starts with the rear leg extended straight back at push-off, front knee driven high; the figure smoothly cycles through the running stride, arms swinging in opposition, and returns to the same push-off position it started from — seamless loop, ends exactly where it begins. The legs are highlighted in solid red/orange throughout. Camera: clean side angle showing the full stride cycle.

## Burpee
**Muscle group:** Cardio/conditioning (equipment: bodyweight)
**Common in:** HIIT & Core, Full Body
**How to do it:** Start standing, drop into a squat and place your hands on the floor, kick your feet back into a plank, perform a push-up (optional), jump your feet back to your hands, then explode upward into a jump.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background. The animation starts standing tall; the figure smoothly drops into a squat, kicks back into a plank, jumps the feet back in, then explodes upward into a jump with arms overhead, landing back in the starting standing position — seamless loop, ends exactly where it begins. The full body (legs, chest, and core) is highlighted in solid red/orange throughout. Camera: clean side angle showing the full squat-plank-jump sequence.

## Rowing machine
**Muscle group:** Cardio/conditioning (equipment: rowing machine/ergometer)
**Common in:** HIIT & Core, Full Body
**How to do it:** Sit on the rowing machine with feet strapped in, gripping the handle. Drive through your legs first, then lean back slightly and pull the handle to your torso, then reverse the sequence to return to the catch position.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated on a rowing machine with visible muscle structure, plain white background, feet strapped to the footplates. The animation starts at the catch position, knees bent close to the chest, arms extended toward the flywheel; the figure smoothly drives through the legs, leans back, and pulls the handle to the torso at the finish, pauses briefly, then reverses back to the starting catch position — seamless loop, ends exactly where it begins. The legs, back, and arms are highlighted in solid red/orange throughout. Camera: clean side angle showing the rail, the seat travel, and the full drive sequence.

## Cycling
**Muscle group:** Cardio/conditioning (equipment: stationary bike)
**Common in:** HIIT & Core, Full Body
**How to do it:** Sit on a stationary bike with the seat adjusted so your knee has a slight bend at the bottom of the pedal stroke. Pedal at a steady cadence, driving down through the balls of your feet.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure seated on a stationary bike with visible muscle structure, plain white background, hands on the handlebars. The animation starts with the pedaling leg bent high at the top of the stroke; the figure smoothly drives that leg down through a full pedal rotation and back up to the starting top position — seamless loop, ends exactly where it begins. The quadriceps and calves are highlighted in solid red/orange throughout. Camera: clean side angle showing the bike frame and the full pedal-stroke range.

## Box jump
**Muscle group:** Cardio/conditioning (equipment: plyo box)
**Common in:** HIIT & Core, Full Body
**How to do it:** Stand facing a sturdy plyo box, feet shoulder-width apart. Swing your arms back, bend your knees, then explosively jump up onto the box, landing softly with bent knees, then step back down.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, facing a plyo box. The animation starts crouched low in front of the box, arms swung back; the figure smoothly explodes upward, jumping onto the box and landing softly with bent knees, pauses briefly, then steps back down to the starting crouched position — seamless loop, ends exactly where it begins. The quadriceps and glutes are highlighted in solid red/orange throughout. Camera: clean side angle showing the box height and the jump trajectory.

## Battle ropes
**Muscle group:** Cardio/conditioning (equipment: battle ropes)
**Common in:** HIIT & Core, Full Body
**How to do it:** Stand holding one end of a heavy rope in each hand, knees soft, core braced. Whip the ropes up and down alternately as hard as possible, creating continuous waves, for a timed interval.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, holding one end of a thick battle rope in each hand anchored to a fixed point in front. The animation starts with one arm raised high with the rope whipped upward and the other arm low; the figure smoothly reverses the arm positions, creating an alternating wave, then cycles back to the starting arm positions — seamless loop, ends exactly where it begins. The shoulders and arms are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the rope waves and the alternating arm action.

## Jumping jacks
**Muscle group:** Cardio/conditioning (equipment: bodyweight)
**Common in:** HIIT & Core, Full Body
**How to do it:** Stand with feet together and arms at your sides. Jump your feet out wide while raising your arms overhead, then jump back to the starting position, repeating at a steady rhythm.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background. The animation starts with feet together and arms down at the sides; the figure smoothly jumps to feet spread wide with arms raised overhead, then jumps back to the starting feet-together position — seamless loop, ends exactly where it begins. The full body (shoulders and legs) is highlighted in solid red/orange throughout. Camera: clean front three-quarter angle showing the full range of the jump.

# Full body/functional

## Clean & press
**Muscle group:** Full body/functional (equipment: barbell)
**Common in:** Full Body, HIIT & Core
**How to do it:** Start with a barbell on the floor, feet hip-width apart. Explosively pull the bar up from the floor, drop under it to catch it at your shoulders (the clean), then press it overhead to full arm extension (the press).
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, a loaded barbell. The animation starts with the barbell racked at the shoulders in a partial squat, having just been pulled from the floor; the figure smoothly stands tall and presses the bar straight overhead to full arm extension, pauses briefly, then lowers and resets back to the starting shoulder-rack position — seamless loop, ends exactly where it begins. The shoulders, legs, and back are highlighted in solid red/orange throughout. Camera: clean side angle showing both the shoulder-rack catch and the overhead lockout.

## Kettlebell swing
**Muscle group:** Full body/functional (equipment: kettlebell)
**Common in:** Full Body, HIIT & Core
**How to do it:** Stand with feet shoulder-width apart, a kettlebell on the floor in front of you. Hinge at the hips to grip it, then swing it back between your legs before driving your hips forward explosively to swing it up to chest height, letting it float before it falls back down.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, gripping a kettlebell with both hands. The animation starts hinged forward, the kettlebell swung back between the legs; the figure smoothly drives the hips forward, swinging the kettlebell up to chest height, arms straight, then lets it fall back down into the starting hinged position — seamless loop, ends exactly where it begins. The glutes and hamstrings are highlighted in solid red/orange throughout. Camera: clean side angle showing the hip-hinge and the full swing arc.

## Thruster
**Muscle group:** Full body/functional (equipment: barbell)
**Common in:** Full Body, HIIT & Core
**How to do it:** Hold a barbell racked at your shoulders, feet shoulder-width apart. Squat down until your thighs are parallel to the floor, then drive up explosively, using the momentum to press the bar straight overhead.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, a barbell racked at the shoulders. The animation starts in a deep squat, thighs parallel to the floor; the figure smoothly drives up explosively, pressing the bar straight overhead as it stands, pauses briefly at the top, then lowers back into the starting squat with the bar re-racked at the shoulders — seamless loop, ends exactly where it begins. The legs and shoulders are highlighted in solid red/orange throughout. Camera: clean side angle showing the squat-to-press transition.

## Turkish get-up
**Muscle group:** Full body/functional (equipment: kettlebell/dumbbell)
**Common in:** Full Body, HIIT & Core
**How to do it:** Lie on your back holding a kettlebell or dumbbell pressed straight up in one hand. Using a sequence of a sit-up, a bridge, and a lunge, carefully stand all the way up while keeping the weight locked out overhead, then reverse the steps to return to the floor.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin figure with visible muscle structure, plain white background, one arm holding a kettlebell locked out straight overhead. The animation starts lying on its back, the kettlebell pressed straight up; the figure smoothly moves through the sit-up, bridge, and lunge sequence to stand fully upright with the kettlebell still locked out overhead, pauses briefly, then reverses the sequence back down to the starting floor position — seamless loop, ends exactly where it begins. The shoulders and core are highlighted in solid red/orange throughout. Camera: clean three-quarter angle showing the overhead lockout maintained throughout the transition from floor to standing.

## Farmer's walk
**Muscle group:** Full body/functional (equipment: dumbbell/kettlebell)
**Common in:** Full Body, HIIT & Core
**How to do it:** Stand holding a heavy dumbbell or kettlebell in each hand at your sides. Walk forward for a set distance with your torso upright and shoulders back, keeping your steps steady and controlled.
**GIF prompt:** A stylized anatomical fitness illustration animated as a short seamless loop (2-4 seconds): a grayscale, semi-transparent-skin walking figure with visible muscle structure, plain white background, a heavy dumbbell held in each hand at the sides. The animation starts with one foot leading, torso upright; the figure smoothly takes a stride with the opposite foot leading, torso staying upright and shoulders back, then cycles back to the starting stride position — seamless loop, ends exactly where it begins. The forearms/grip and trunk are highlighted in solid red/orange throughout. Camera: clean side angle showing the upright posture and the loaded stride.
