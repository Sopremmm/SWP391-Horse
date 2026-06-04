import { ALERT_STYLES } from "../../../constants.js";

export default function Alert({ type = "info", children, className = "" }) {
  const s = ALERT_STYLES[type];
  return (
    <div
      className={`flex items-start gap-2 rounded-lg p-3 text-sm mb-3.5 ${className}`}
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      <i className={`ti ti-${s.icon} text-base flex-shrink-0 mt-0.5`} />
      <span>{children}</span>
    </div>
  );
}
