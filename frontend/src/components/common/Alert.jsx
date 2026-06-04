import { ALERT_STYLES } from "../../utils/constants";

export default function Alert({ type = "info", children }) {
  const s = ALERT_STYLES[type];
  return (
    <div
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <i className={`ti ti-${s.icon}`} style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} aria-hidden />
      <span>{children}</span>
    </div>
  );
}
