import { TEXT, TEXT_MUTED, SURFACE_MUTED } from "../../../constants.js";

export default function Select({
  value,
  onChange,
  options = [],
  disabled = false,
  className = "",
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none transition-shadow font-sans ${className}`}
      style={{
        background: disabled ? SURFACE_MUTED : "#fff",
        color: disabled ? TEXT_MUTED : TEXT,
      }}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>{o}</option>
        ) : (
          <option key={o.value} value={o.value}>{o.label}</option>
        )
      )}
    </select>
  );
}
