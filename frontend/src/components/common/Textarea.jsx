export default function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "8px 11px",
        border: "1px solid #D1D5DB",
        borderRadius: 8,
        fontSize: 13,
        background: "#fff",
        color: "#111827",
        outline: "none",
        resize: "vertical",
        fontFamily: "inherit",
      }}
    />
  );
}
