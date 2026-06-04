export const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

export const EMERALD = "#10B981";
export const EMERALD_LIGHT = "#D1FAE5";
export const EMERALD_BORDER = "#6EE7B7";
export const GOLD = "#B8860B";
export const GOLD_LIGHT = "#FFF8E7";
export const GOLD_BORDER = "#D4A820";

export const GRADES = ["G1", "G2", "G3", "Listed", "Open"];
export const CONDITIONS = ["Firm", "Good", "Soft", "Heavy", "Fast", "Yielding"];
export const TOURNAMENT_STATUSES = ["Active", "Draft", "Closed"];
export const RACE_STATUSES = ["Upcoming", "Running", "Finished", "Cancelled"];
export const REG_STATUSES = ["Pending", "Approved", "Rejected"];

export const STATUS_STYLES = {
  Active:    { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
  Draft:     { bg: "#F3F4F6", color: "#374151", border: "#D1D5DB" },
  Closed:    { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
  Upcoming:  { bg: "#DBEAFE", color: "#1E40AF", border: "#93C5FD" },
  Running:   { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
  Finished:  { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
  Cancelled: { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
  Pending:   { bg: "#FEF9C3", color: "#713F12", border: "#FDE047" },
  Approved:  { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
  Rejected:  { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
};

export const ALERT_STYLES = {
  info:    { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE", icon: "info-circle"    },
  warning: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", icon: "alert-triangle" },
  success: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0", icon: "circle-check"   },
  danger:  { bg: "#FFF1F2", color: "#9F1239", border: "#FECDD3", icon: "circle-x"       },
};

export const BTN_VARIANTS = {
  primary: { bg: EMERALD,      color: "#fff",    border: EMERALD_BORDER },
  ghost:   { bg: "transparent", color: "#374151", border: "#D1D5DB"   },
  danger:  { bg: "#FEF2F2",     color: "#991B1B", border: "#FCA5A5"   },
  success: { bg: "#F0FDF4",     color: "#166534", border: "#86EFAC"   },
  info:    { bg: "#EFF6FF",     color: "#1E40AF", border: "#93C5FD"   },
};
