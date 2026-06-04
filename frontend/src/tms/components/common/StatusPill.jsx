import { STATUS_STYLES } from "../../constants.js";

export default function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Draft"];
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap"
      style={{
        background: s.bg,
        color: s.color,
        borderColor: s.border,
        letterSpacing: "0.03em",
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}
