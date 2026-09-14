"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-fetches the current page's server data when you come back to the tab.
 *
 * Every page here is `force-dynamic`, so a fresh load is always current — but
 * nothing re-read the server after that. Phone browsers in particular keep
 * tabs alive for days, so "open the app on my phone" usually means returning
 * to a tab rendered hours ago, showing whatever was true then. Anything logged
 * on another device in the meantime was simply invisible.
 *
 * `router.refresh()` re-fetches the server components while preserving client
 * state, which is why the set rows also had to start re-syncing from their
 * props — see the note in WorkoutClient's SetRow. Without that half, this
 * fetches fresh data that the rows then ignore.
 *
 * Mounted once in the app layout, so it covers every page inside it.
 */
export function RefreshOnFocus() {
  const router = useRouter();
  const lastRef = useRef(0);

  useEffect(() => {
    function maybeRefresh() {
      if (document.visibilityState !== "visible") return;
      // A tab switch can fire both `visibilitychange` and `focus`; this also
      // keeps a flurry of alt-tabs from firing a request each time.
      const now = Date.now();
      if (now - lastRef.current < 2000) return;
      lastRef.current = now;
      router.refresh();
    }

    document.addEventListener("visibilitychange", maybeRefresh);
    window.addEventListener("focus", maybeRefresh);
    // `pageshow` with `persisted` is the bfcache restore — a back-navigation
    // that visibilitychange/focus do not reliably announce on iOS Safari.
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) maybeRefresh();
    }
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", maybeRefresh);
      window.removeEventListener("focus", maybeRefresh);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [router]);

  return null;
}
