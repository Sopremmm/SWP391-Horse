import { BTN_VARIANTS } from "../../../constants.js";

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  small = false,
  icon,
  type = "button",
  className = "",
}) {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-opacity cursor-pointer font-sans ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} ${className}`}
      style={{
        background: v.bg,
        color: v.color,
        borderColor: v.border,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon && <i className={`ti ti-${icon} text-sm`} />}
      {children}
    </button>
  );
}
