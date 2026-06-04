import { BRAND_BORDER, BRAND_LIGHT, BRAND_TEXT, TEXT_MUTED } from "../../../constants.js";

export default function SectionTitle({ icon, children, sub }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border"
          style={{ background: BRAND_LIGHT, borderColor: BRAND_BORDER }}
        >
          <i className={`ti ti-${icon} text-[17px]`} style={{ color: BRAND_TEXT }} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 m-0">{children}</h2>
      </div>
      {sub && (
        <p className="mt-1.5 ml-10 text-sm" style={{ color: TEXT_MUTED }}>{sub}</p>
      )}
    </div>
  );
}
