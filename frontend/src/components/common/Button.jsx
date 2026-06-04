import { BTN_VARIANTS } from "../../utils/constants";

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  small = false,
  icon,
  type = "button",
}) {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: small ? "5px 12px" : "8px 16px",
        fontSize: small ? 12 : 13,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: 8,
        opacity: disabled ? 0.5 : 1,
        transition: "opacity .15s",
        fontFamily: "inherit",
      }}
    >
      {icon && <i className={`ti ti-${icon}`} aria-hidden />}
      {children}
    </button>
  );
}
