import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <main className="login-shell">
      {/* Decorative only — the figures carry no information, so they stay out
          of the accessibility tree entirely. They're painted as CSS
          backgrounds behind a `min-width: 1024px` media query rather than as
          <img>, because a hidden <img> is still fetched on phones while a
          background inside an unmatched media query is not. */}
      <div className="login-art login-art--left" aria-hidden="true" />
      <div className="login-art login-art--right" aria-hidden="true" />

      <form action={login} className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image's
            optimizer self-fetch fails in this preview environment. */}
        <img
          src="/login-art/logo.webp"
          alt="Naman"
          width={56}
          height={56}
          className="login-logo"
          fetchPriority="high"
        />
        <p className="login-sub">Enter the password to continue.</p>

        <input type="hidden" name="from" value={from ?? "/"} />

        <label className="login-field">
          <span className="micro text-faint">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            autoFocus
            required
            className="login-input"
          />
        </label>

        {error && (
          <p role="alert" className="login-error">
            Wrong password. Try again.
          </p>
        )}

        <button type="submit" className="login-submit">
          Log in
        </button>
      </form>

      <GlassRefraction />
    </main>
  );
}

/**
 * The refraction half of the card's liquid glass. `backdrop-filter` can blur
 * and saturate the backdrop but cannot displace a pixel, so blur on its own
 * is frosted glass with no lens. This filter supplies the lens: glass-rim.png
 * is a displacement map (red = X offset, green = Y offset, 128 = hold still)
 * that is flat everywhere except a band around the rim, where it pushes the
 * sampled backdrop inward — the same "thick at the edge, flat in the middle"
 * profile Apple's material uses. See scripts/generate-glass-displacement.mjs.
 *
 * Referenced from CSS only inside an @supports test, because SVG filters in
 * `backdrop-filter` are a Chromium extension and off-spec; everywhere else the
 * card keeps the plain blur. Renders nothing itself (0x0, aria-hidden).
 */
function GlassRefraction() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <filter
        id="login-glass-refraction"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feImage href="/login-art/glass-rim.png" preserveAspectRatio="none" result="rim" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="rim"
          scale="14"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
