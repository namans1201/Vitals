"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Starts every tab at the top of the page.
 *
 * Next's App Router does scroll to the top itself, and on desktop that is the
 * end of it. Two things undercut it on phones and tablets:
 *
 * 1. Next never sets `history.scrollRestoration`, so it stays at the browser
 *    default of "auto" and the browser restores a scroll offset of its own for
 *    each history entry. Mobile Safari and Chrome on Android do this far more
 *    eagerly than desktop Chrome, and their restore lands *after* Next has
 *    scrolled - so the page ends up back where the previous tab was.
 * 2. Next's own scroll is conditional. From layout-router: "If the element's
 *    top edge is already in the viewport, exit early." When a short
 *    `loading.tsx` skeleton momentarily collapses the document, the browser
 *    clamps the scroll offset, and the incoming page's top edge can land
 *    inside the viewport - so Next correctly decides it has nothing to do,
 *    and whatever the clamp left behind stays.
 *
 * Hence an explicit scroll, twice: once when the route commits, and again on
 * the next frame to land after any restore the browser schedules. Both are
 * instant (nothing here sets `scroll-behavior: smooth`), so this reads as the
 * page simply starting at the top rather than as a visible jump.
 *
 * Back and forward are deliberately left alone - returning to a tab you had
 * scrolled should put you back where you were, which is what the browser's
 * own restoration is for.
 */
export function ScrollTopOnNavigate() {
  const pathname = usePathname();
  const cameFromPopRef = useRef(false);

  useEffect(() => {
    function onPop() {
      cameFromPopRef.current = true;
      // Safety net: if this pop does not actually change the pathname (a query
      // string edit, say) the effect below never runs to clear the flag, and a
      // stale one would swallow the next real tab change.
      setTimeout(() => {
        cameFromPopRef.current = false;
      }, 400);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (cameFromPopRef.current) {
      cameFromPopRef.current = false;
      return;
    }
    // An in-page anchor is the one case where the destination is deliberately
    // not the top.
    if (window.location.hash) return;

    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
