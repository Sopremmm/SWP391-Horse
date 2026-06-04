import { TEXT, TEXT_MUTED, SURFACE_MUTED } from "../../../constants.js";

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none transition-shadow font-sans ${className}`}
      style={{
        background: disabled ? SURFACE_MUTED : "#fff",
        color: disabled ? TEXT_MUTED : TEXT,
      }}
    />
  );
}
