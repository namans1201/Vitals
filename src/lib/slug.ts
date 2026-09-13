/** "DB Arnold press" -> "db-arnold-press" - the exact convention used in
 * EXERCISE_IMAGE_PROMPTS.md / EXERCISE_GIF_PROMPTS.md, so a generated asset
 * saved as public/exercises/<slug>.png|gif is found by name alone. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
