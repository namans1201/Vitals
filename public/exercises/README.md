# Exercise media

Drop generated images/GIFs here, named by the exercise's slug (see
`slugify()` in `src/lib/slug.ts`): lowercase, non-alphanumeric characters
collapsed to single hyphens.

- `<slug>.gif` - shown first if present (an animated demo)
- `<slug>.png` - shown if no GIF exists
- Neither present - the Media tab shows a plain "add one here" message

Generation prompts for every exercise are in `EXERCISE_IMAGE_PROMPTS.md`
(static images) and `EXERCISE_GIF_PROMPTS.md` (looping GIFs) at the repo
root.

Examples: `pull-up.png`, `db-arnold-press.gif`, `bulgarian-split-squat.png`.
