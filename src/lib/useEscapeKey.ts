"use client";

import { useEffect } from "react";

/** Closes a modal/overlay on Escape - shared by every fixed-overlay modal in
 * the app instead of each one re-registering its own listener. */
export function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onEscape();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEscape]);
}
