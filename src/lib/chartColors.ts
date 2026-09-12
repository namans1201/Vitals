/** Hex mirrors of the design tokens in globals.css — SVG presentation
 * attributes (Recharts' stroke/fill props) don't reliably resolve CSS custom
 * properties, so charts need real hex values. Keep in sync with §9. */
export const CHART_COLORS = {
  accent: "#5b8def",
  good: "#3fb37f",
  caution: "#e0a355",
  bad: "#e0685c",
  sleep: "#a78bda",
  line: "#2a2f3a",
  dim: "#9aa3b2",
  faint: "#6b7383",
} as const;
