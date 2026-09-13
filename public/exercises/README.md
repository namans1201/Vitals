# Exercise media

Everything here is named by the exercise's slug (see `slugify()` in
`src/lib/slug.ts`): lowercase, non-alphanumeric characters collapsed to
single hyphens. The slug must match the `Exercise.name` column exactly once
slugified, or the app won't find the file.

## What the app actually loads

- `<slug>.webp` — the still, 768px wide. Every exercise has one.
- `<slug>-anim.webp` — the animated version, 768px wide, ONLY when the
  source GIF actually has more than one distinct frame.

As generated, every one of the 91 source GIFs turned out to be a single
still frame duplicated three times - confirmed by comparing raw decoded
pixels, not just file hashes or frame/duration metadata (both of those
looked fine and are exactly what made the problem hard to spot). There is
currently no real motion to show anywhere, so `-anim.webp` doesn't exist for
any exercise right now. `scripts/optimize-exercise-media.mjs` checks this
per exercise and will start producing `-anim.webp` again the moment a source
GIF with genuine frame-to-frame motion is dropped in.

The Media tab shows the still by default. It HEAD-checks for `-anim.webp`
in the background and only reveals an Animated/Still toggle once one is
confirmed to exist - it never speculatively requests an animation that
almost certainly isn't there. If the still itself is missing, it shows a
plain "no media yet" message instead.

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

That regenerates every still, and an animation for any GIF with real motion,
from whatever PNG/GIF are present. It's safe to re-run — it only writes
`.webp` files (and removes a stale `-anim.webp` if a GIF that used to
animate no longer does) and never touches the sources.

If you do get a GIF with genuine motion in it eventually: don't add ffmpeg's
own libwebp muxer as the encoder for it without re-testing. It was tried
here first and silently collapsed real, distinct frames into a webp that
LOOKED animated (right frame count, right per-frame delay, right loop count)
but decoded to identical pixels on every frame - passed every metadata check
and still didn't work. `gif2webp` (from the libwebp CLI tools) encoded the
same source correctly every time it was tested. The script resizes with
ffmpeg (a plain gif->gif scale, which is reliable) and encodes with
`gif2webp` as a separate step for exactly that reason.
