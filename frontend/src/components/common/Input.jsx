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

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...baseStyle,
        background: disabled ? "#F9FAFB" : "#fff",
        color: disabled ? "#6B7280" : "#111827",
      }}
    />
  );
}
