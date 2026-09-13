# Exercise media

Everything here is named by the exercise's slug (see `slugify()` in
`src/lib/slug.ts`): lowercase, non-alphanumeric characters collapsed to
single hyphens. The slug must match the `Exercise.name` column exactly once
slugified, or the app won't find the file.

## What the app actually loads

- `<slug>.webp` — the still, 768px wide
- `<slug>-anim.webp` — the animated version, 768px wide, frame delays and
  infinite loop preserved from the source GIF

The Media tab shows the animation by default with a toggle to the still. If
one is missing it silently falls back to the other; if both are missing it
shows a plain "no media yet" message instead.

768px is deliberate: the modal renders these at ~352 CSS px, so this covers
2x retina with room to spare. Going bigger costs bytes nobody can see.

## Source art (not committed)

`<slug>.png` and `<slug>.gif` are the original 1536x1024 generations. They
stay on disk but are **gitignored** — at ~169MB they'd bloat the repo
permanently and slow every deploy, and nothing in the app reads them
directly. Back them up yourself if you want them preserved; they are not
recoverable from git.

## Adding or regenerating

1. Generate the art using the prompts in `EXERCISE_IMAGE_PROMPTS.md` (stills)
   and `EXERCISE_GIF_PROMPTS.md` (animations) at the repo root.
2. Drop the `.png` and `.gif` in here, named by slug.
3. Run `npm run media:optimize`.

That regenerates every `.webp` pair from whatever PNG/GIF are present. It's
safe to re-run — it only writes `.webp` files and never touches the sources.
