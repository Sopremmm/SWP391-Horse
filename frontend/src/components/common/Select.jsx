const baseStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 11px",
  border: "1px solid #D1D5DB",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

export default function Select({ value, onChange, options = [], disabled = false }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...baseStyle,
        background: disabled ? "#F9FAFB" : "#fff",
        color: disabled ? "#6B7280" : "#111827",
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
