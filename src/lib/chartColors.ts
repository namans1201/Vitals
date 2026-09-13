/** Hex mirrors of the design tokens in globals.css — SVG presentation
 * attributes (Recharts' stroke/fill props) don't reliably resolve CSS custom
 * properties, so charts need real hex values. Keep in sync with the Near-mono
 * palette in globals.css §9. */
export const CHART_COLORS = {
  accent: "#111111",
  good: "#10b981",
  caution: "#d97706",
  bad: "#dc2626",
  sleep: "#6366f1",
  line: "#e5e7eb",
  panel: "#ffffff",
  dim: "#6b7280",
  faint: "#9ca3af",
} as const;
