import { TEXT } from "../../../constants.js";

export default function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none resize-vertical font-sans ${className}`}
      style={{ background: "#fff", color: TEXT }}
    />
  );
}
