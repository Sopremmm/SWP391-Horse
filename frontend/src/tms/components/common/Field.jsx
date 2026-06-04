import { TEXT_MUTED } from "../../../constants.js";

export default function Field({ label, required = false, children, half = false }) {
  return (
    <div className={`mb-3.5 ${half ? "w-[calc(50%-6px)]" : "w-full"}`}>
      <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT_MUTED }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
