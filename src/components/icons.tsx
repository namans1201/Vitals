/**
 * SVG icon set. No emoji anywhere in the UI - these are stroked outline
 * icons sized to the current font-size and inheriting currentColor, so they
 * sit correctly next to text in any palette.
 */
type IconProps = { className?: string; size?: number };

function base(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
}

export function IconToday({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      <circle cx="12" cy="14.5" r="2.25" />
    </svg>
  );
}

export function IconWorkout({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 9v6M20 9v6M7 7.5v9M17 7.5v9M7 12h10M2 11v2M22 11v2" />
    </svg>
  );
}

export function IconRun({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="15.5" cy="4.5" r="2" />
      <path d="M6 20.5l3-5 3.5-2.5-1.5-5 4 3.5 3 1" />
      <path d="M9.5 15.5L6.5 13l-3 1.5" />
    </svg>
  );
}

export function IconFood({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 3v8a2.5 2.5 0 005 0V3M8.5 11v10" />
      <path d="M17.5 3c-1.5 1-2.5 3-2.5 5.5S16 13 17.5 13 20 11 20 8.5 19 4 17.5 3zM17.5 13v8" />
    </svg>
  );
}

export function IconWeek({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M3 9.5h18M8.5 13h2M13.5 13h2M8.5 17h2M13.5 17h2" />
    </svg>
  );
}

export function IconCheck({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={2.5}>
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function IconChevronLeft({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M14.5 5l-7 7 7 7" />
    </svg>
  );
}

export function IconChevronRight({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M9.5 5l7 7-7 7" />
    </svg>
  );
}

export function IconPlus({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconClose({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconMoon({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
    </svg>
  );
}

export function IconDrop({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 3.5s6 6.2 6 10.2a6 6 0 01-12 0c0-4 6-10.2 6-10.2z" />
    </svg>
  );
}

export function IconRest({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12h7" />
    </svg>
  );
}

export function IconLogout({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M15 4.5h3a2 2 0 012 2v11a2 2 0 01-2 2h-3M10 16l-4-4 4-4M6 12h9" />
    </svg>
  );
}

export function IconCalendar({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      <rect x="7" y="12.5" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconChevronDown({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M5 8.5l7 7 7-7" />
    </svg>
  );
}

export function IconStar({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size, className)} fill="currentColor" stroke="none">
      <path d="M12 2.5l2.7 6.2 6.7.6-5.1 4.5 1.6 6.6L12 16.9l-5.9 3.5 1.6-6.6-5.1-4.5 6.7-.6z" />
    </svg>
  );
}
