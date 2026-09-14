"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconChevronDown, IconMinus, IconPlus, IconTimer } from "@/components/icons";

/*
 * The rest timer, as a floating window you can park anywhere.
 *
 * It used to be `sticky top-2 z-10` inside the page, which put it underneath
 * both of AppNav's bars (they are `fixed … z-20`) — it scrolled up and
 * disappeared behind the nav exactly when you needed to read it. So it now
 * renders through a portal as a `fixed` widget above the nav but below the
 * modals, which own z-30.
 *
 * Position is kept in viewport pixels and clamped to a "safe rect" measured
 * from the live nav elements rather than hardcoded: AppNav tags its bars
 * `data-appnav="top" | "bottom"`, and a bar hidden by a media query reports a
 * zero-sized rect, so the same code lands on the right answer for phone
 * (top header + bottom tab bar) and desktop (one top bar) with no breakpoint
 * logic here. That also means the phone's `env(safe-area-inset-bottom)` is
 * accounted for automatically — it is already baked into the bottom nav's
 * rendered height.
 */

const MARGIN = 12; // keep this far from the viewport edges
const NAV_GAP = 8; // …and this far from a nav bar
const DRAG_SLOP = 6; // px of movement before a tap counts as a drag
const AUTO_COLLAPSE_MS = 4000;
const POS_KEY = "vitals.rest-timer.pos";

/* The floating surface, spelled out rather than reusing `.card`: see the note
 * at its first use below on why that class cannot be used here. */
const SURFACE = "border border-line bg-panel";
/* `shadow-[var(--shadow-float)]` does NOT work: Tailwind v4 reads an arbitrary
 * shadow value as a colour slot, and the whole declaration computed to two
 * fully transparent shadows. Applying the token inline is the reliable form. */
const SURFACE_STYLE = { boxShadow: "var(--shadow-float)" } as const;

export type RestTimerProps = {
  remaining: number;
  total: number;
  running: boolean;
  stepSeconds: number;
  onToggleRunning: () => void;
  onAdjust: (delta: number) => void;
  onSkip: () => void;
};

type Point = { x: number; y: number };

type SafeRect = { left: number; top: number; right: number; bottom: number };

function safeRect(): SafeRect {
  const rect: SafeRect = {
    left: MARGIN,
    top: MARGIN,
    right: window.innerWidth - MARGIN,
    bottom: window.innerHeight - MARGIN,
  };
  for (const el of document.querySelectorAll<HTMLElement>("[data-appnav]")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue; // hidden at this breakpoint
    if (el.dataset.appnav === "top") rect.top = Math.max(rect.top, r.bottom + NAV_GAP);
    else rect.bottom = Math.min(rect.bottom, r.top - NAV_GAP);
  }
  return rect;
}

function clampInto(p: Point, w: number, h: number, rect: SafeRect): Point {
  // Math.max on the lower bound too, so a widget taller than the gap between
  // two nav bars pins to the top rather than jumping above it.
  return {
    x: Math.max(rect.left, Math.min(p.x, rect.right - w)),
    y: Math.max(rect.top, Math.min(p.y, rect.bottom - h)),
  };
}

function readStoredPos(): Point | null {
  try {
    const raw = window.localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as Point).x === "number" &&
      typeof (parsed as Point).y === "number"
    ) {
      return parsed as Point;
    }
  } catch {
    // private mode, blocked storage, corrupt value — fall back to the default
    // corner rather than failing to render the timer at all.
  }
  return null;
}

export function RestTimer({
  remaining,
  total,
  running,
  stepSeconds,
  onToggleRunning,
  onAdjust,
  onSkip,
}: RestTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [pos, setPos] = useState<Point | null>(null);
  const [dragging, setDragging] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<{ w: number; h: number } | null>(null);
  const dragRef = useRef<{ id: number; dx: number; dy: number; moved: boolean } | null>(null);
  const autoCollapseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // False until the position is one the user chose (dragged) or one restored
  // from storage. While false the widget keeps re-deriving its default corner.
  const userPlacedRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const cancelAutoCollapse = useCallback(() => {
    if (autoCollapseRef.current) {
      clearTimeout(autoCollapseRef.current);
      autoCollapseRef.current = null;
    }
  }, []);

  // Opens with the controls showing so rest length can be adjusted straight
  // away, then gets out of the way on its own. Any deliberate interaction
  // cancels that, so it never collapses under someone's hand.
  useEffect(() => {
    autoCollapseRef.current = setTimeout(() => setExpanded(false), AUTO_COLLAPSE_MS);
    return cancelAutoCollapse;
  }, [cancelAutoCollapse]);

  // Place on first paint (and re-clamp whenever the widget changes size, e.g.
  // expanding or collapsing) before the browser shows a frame, so it never
  // flashes in the wrong spot or half-under a nav bar.
  useLayoutEffect(() => {
    if (!mounted) return;
    const el = elRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const rect = safeRect();
    const prev = sizeRef.current;
    sizeRef.current = { w: width, h: height };
    setPos((current) => {
      if (!userPlacedRef.current) {
        // No user-chosen position yet. Re-derive the default corner from the
        // size measured right now rather than trusting an earlier reading —
        // the first measurement can land before the stylesheet carrying
        // `w-[212px]` exists, which reports a full-width panel and would
        // otherwise pin the widget to the top-left corner permanently.
        const stored = current === null ? readStoredPos() : null;
        if (stored) {
          userPlacedRef.current = true;
          return clampInto(stored, width, height, rect);
        }
        return clampInto({ x: rect.right - width, y: rect.bottom - height }, width, height, rect);
      }
      let start = current ?? { x: rect.right - width, y: rect.bottom - height };
      // Position is a top-left corner, so a naive resize makes the widget grow
      // and shrink toward the bottom-right — collapsing in the bottom-right
      // corner would visibly walk it inward, away from where it was parked.
      // Hold whichever edges it currently sits nearest instead.
      if (current && prev && (prev.w !== width || prev.h !== height)) {
        const nearRight = current.x + prev.w / 2 > window.innerWidth / 2;
        const nearBottom = current.y + prev.h / 2 > window.innerHeight / 2;
        start = {
          x: nearRight ? current.x + (prev.w - width) : current.x,
          y: nearBottom ? current.y + (prev.h - height) : current.y,
        };
      }
      const next = clampInto(start, width, height, rect);
      if (current && current.x === next.x && current.y === next.y) return current;
      return next;
    });
  }, [mounted, expanded]);

  // A rotation or window resize can leave the widget off-screen or under a bar.
  useEffect(() => {
    if (!mounted) return;
    function reclamp() {
      const el = elRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      const rect = safeRect();
      setPos((current) => {
        if (!userPlacedRef.current) {
          return clampInto({ x: rect.right - width, y: rect.bottom - height }, width, height, rect);
        }
        return current ? clampInto(current, width, height, rect) : current;
      });
    }
    window.addEventListener("resize", reclamp);
    window.addEventListener("orientationchange", reclamp);
    // Catches the widget's own size settling after mount — a stylesheet
    // arriving late, a font swapping in — which a window listener never sees.
    const ro = new ResizeObserver(reclamp);
    if (elRef.current) ro.observe(elRef.current);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", reclamp);
      window.removeEventListener("orientationchange", reclamp);
    };
  }, [mounted]);

  function persist(p: Point) {
    try {
      window.localStorage.setItem(POS_KEY, JSON.stringify(p));
    } catch {
      // Not being able to remember the position is not worth breaking over.
    }
  }

  /* Pointer Events rather than mouse + touch pairs: one code path covers
   * mouse, finger and stylus, and pointer capture keeps the drag alive even
   * when the pointer outruns the widget. The handle carries
   * `touch-action: none` so a finger drag moves the timer instead of
   * scrolling the page behind it. */
  function onPointerDown(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = elRef.current;
    if (!el) return;
    cancelAutoCollapse();
    const r = el.getBoundingClientRect();
    dragRef.current = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer already released — the drag still tracks via move events.
    }
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    const el = elRef.current;
    if (!drag || drag.id !== e.pointerId || !el) return;
    const next = { x: e.clientX - drag.dx, y: e.clientY - drag.dy };
    if (!drag.moved && Math.hypot(next.x - (pos?.x ?? 0), next.y - (pos?.y ?? 0)) > DRAG_SLOP) {
      drag.moved = true;
    }
    const { width, height } = el.getBoundingClientRect();
    setPos(clampInto(next, width, height, safeRect()));
  }

  function onPointerUp(e: React.PointerEvent<HTMLElement>, tapTogglesExpanded: boolean) {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Already released.
    }
    if (drag.moved && pos) {
      userPlacedRef.current = true;
      persist(pos);
    }
    // A press that never moved is a tap, not a drag.
    if (!drag.moved && tapTogglesExpanded) setExpanded((v) => !v);
  }

  if (!mounted) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const label = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const urgent = remaining <= 3;
  const progress = total > 0 ? (total - remaining) / total : 0;

  const dragHandlers = (tapToggles: boolean) => ({
    onPointerDown,
    onPointerMove,
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => onPointerUp(e, tapToggles),
    onPointerCancel: (e: React.PointerEvent<HTMLElement>) => onPointerUp(e, false),
    style: { touchAction: "none" as const },
  });

  return createPortal(
    <div
      ref={elRef}
      className={`fixed z-[25] ${dragging ? "" : "transition-[width,height] duration-200"}`}
      style={{
        left: pos?.x ?? 0,
        top: pos?.y ?? 0,
        // Hidden until measured, so it cannot flash at 0,0 on first paint.
        visibility: pos ? "visible" : "hidden",
      }}
      role="region"
      aria-label="Rest timer"
    >
      {expanded ? (
        /* Deliberately NOT `.card`. That rule is unlayered, so it outranks
         * Tailwind's layered utilities no matter the specificity — it was
         * silently overriding both `rounded-full` (the bubble rendered as a
         * rounded square) and `shadow-[var(--shadow-float)]` with its own
         * 16px radius and flatter card shadow. Spelling the surface out here
         * keeps the floating widget's own radius and lift. */
        <div className={`${SURFACE} w-[212px] overflow-hidden rounded-2xl`} style={SURFACE_STYLE}>
          {/* Header doubles as the drag handle. */}
          <div
            {...dragHandlers(false)}
            className={`flex items-center justify-between gap-2 border-b border-line px-3 py-2 ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <span className="flex items-center gap-1.5 text-faint">
              <IconTimer size={13} />
              <span className="micro">Rest</span>
            </span>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                cancelAutoCollapse();
                setExpanded(false);
              }}
              aria-label="Collapse rest timer"
              className="flex h-6 w-6 items-center justify-center rounded-full text-faint hover:bg-panel-2 hover:text-dim"
            >
              <IconChevronDown size={14} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 px-3 py-3">
            <Ring progress={progress} label={label} urgent={urgent} size={72} />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  cancelAutoCollapse();
                  onAdjust(-stepSeconds);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-dim hover:bg-panel-2"
                aria-label={`${stepSeconds} seconds less`}
              >
                <IconMinus size={12} />
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelAutoCollapse();
                  onToggleRunning();
                }}
                className="h-8 flex-1 rounded-full border border-line px-3 text-xs font-medium text-dim hover:bg-panel-2"
              >
                {running ? "Pause" : "Resume"}
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelAutoCollapse();
                  onAdjust(stepSeconds);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-dim hover:bg-panel-2"
                aria-label={`${stepSeconds} seconds more`}
              >
                <IconPlus size={12} />
              </button>
            </div>

            <button
              type="button"
              onClick={onSkip}
              className="h-8 w-full rounded-full bg-accent text-xs font-medium text-white"
            >
              Skip rest
            </button>
          </div>
        </div>
      ) : (
        /* Collapsed: the whole bubble is both the drag surface and the button.
         * A press that moves is a drag; a press that doesn't is a tap that
         * reopens the controls. */
        <div
          {...dragHandlers(true)}
          role="button"
          tabIndex={0}
          aria-label={`Rest timer, ${label} remaining. Open controls`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              cancelAutoCollapse();
              setExpanded(true);
            }
          }}
          className={`${SURFACE} flex h-16 w-16 items-center justify-center rounded-full ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          } ${running ? "" : "opacity-80"}`}
          style={{ ...SURFACE_STYLE, touchAction: "none" }}
        >
          <Ring progress={progress} label={label} urgent={urgent} size={56} compact />
        </div>
      )}
    </div>,
    document.body,
  );
}

function Ring({
  progress,
  label,
  urgent,
  size,
  compact = false,
}: {
  progress: number;
  label: string;
  urgent: boolean;
  size: number;
  compact?: boolean;
}) {
  const circumference = 2 * Math.PI * 26;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r="26" fill="none" stroke="var(--panel-2)" strokeWidth="5" />
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className={`transition-[stroke-dashoffset] duration-500 ${urgent ? "text-bad" : "text-accent"}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-heading font-bold tabular-nums ${compact ? "text-xs" : "text-sm"} ${
            urgent ? "text-bad" : "text-ink"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
