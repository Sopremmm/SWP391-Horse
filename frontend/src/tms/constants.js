export const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

export const BRAND = "#064e3b";
export const BRAND_HOVER = "#043d2e";
export const BRAND_LIGHT = "#ecfdf5";
export const BRAND_SUBTLE = "#f0fdf4";
export const BRAND_BORDER = "#a7f3d0";
export const BRAND_RING = "#d1fae5";
export const BRAND_TEXT = "#065f46";

export const PAGE_BG = "#f8fafc";
export const TEXT = "#111827";
export const TEXT_MUTED = "#6b7280";
export const TEXT_SUBTLE = "#9ca3af";
export const BORDER = "#e5e7eb";
export const BORDER_INPUT = "#d1d5db";
export const SURFACE = "#ffffff";
export const SURFACE_MUTED = "#f9fafb";
export const SURFACE_ALT = "#f3f4f6";
export const CARD_SHADOW = "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)";

export const GRADES = ["G1", "G2", "G3", "Listed", "Open"];
export const CONDITIONS = ["Firm", "Good", "Soft", "Heavy", "Fast", "Yielding"];
export const TOURNAMENT_STATUSES = ["Active", "Draft", "Closed"];
export const RACE_STATUSES = ["Upcoming", "Running", "Finished", "Cancelled"];
export const REG_STATUSES = ["Pending", "Approved", "Rejected"];

export const STATUS_STYLES = {
  Active:    { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER },
  Draft:     { bg: SURFACE_ALT, color: TEXT_MUTED, border: BORDER_INPUT },
  Closed:    { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  Upcoming:  { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
  Running:   { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER },
  Finished:  { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER },
  Cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  Pending:   { bg: "#fef9c3", color: "#713f12", border: "#fde047" },
  Approved:  { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER },
  Rejected:  { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
};

export const ALERT_STYLES = {
  info:    { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", icon: "info-circle" },
  warning: { bg: "#fffbeb", color: "#713f12", border: "#fde68a", icon: "alert-triangle" },
  success: { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER, icon: "circle-check" },
  danger:  { bg: "#fff1f2", color: "#9f1239", border: "#fecdd3", icon: "circle-x" },
};

export const BTN_VARIANTS = {
  primary: { bg: BRAND, color: "#fff", border: BRAND },
  ghost:   { bg: SURFACE, color: TEXT_MUTED, border: BORDER },
  danger:  { bg: "#fef2f2", color: "#991b1b", border: "#fca5a5" },
  success: { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER },
  info:    { bg: "#eff6ff", color: "#1e40af", border: "#93c5fd" },
};
