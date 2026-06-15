import { fmtDate } from "../../format.js";

function GradeBadge({ grade }) {
  const style =
    grade === "G1"
      ? { bg: "var(--color-accent-gold-light)", color: "var(--color-accent-gold)", border: "var(--color-accent-gold-border)" }
      : grade === "G2"
      ? { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" }
      : { bg: "var(--color-surface-alt)", color: "var(--color-text-muted)", border: "var(--color-border-input)" };
  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded-md border"
      style={{ background: style.bg, color: style.color, borderColor: style.border }}
    >
      {grade}
    </span>
  );
}

export default function FeatureCard({ race, onClick, variant = "compact" }) {
  if (variant === "hero") {
    return (
      <div
        className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer transition-shadow hover:shadow-card-hover shadow-card"
        onClick={onClick}
      >
        <div className="flex items-center gap-2 mb-3">
          <GradeBadge grade={race.grade} />
          <span className="text-xs text-slate-400">{fmtDate(race.date)} · {race.time}</span>
        </div>
        <h3 className="font-serif text-2xl font-semibold text-slate-800 mb-2 leading-tight">
          {race.name}
        </h3>
        <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
          <i className="ti ti-map-pin text-base" />
          {race.venue}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Prize Pool</p>
            <p
              className="text-2xl font-black"
              style={{ color: "var(--color-accent-gold)", fontFamily: "var(--font-serif)" }}
            >
              ${race.prizePool.toLocaleString()}
            </p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
            style={{
              background: "var(--color-brand-light)",
              color: "var(--color-brand-text)",
              borderColor: "var(--color-brand-border)",
            }}
          >
            View Details →
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <GradeBadge grade={race.grade} />
        <span className="text-[11px] text-slate-400">{fmtDate(race.date)}</span>
      </div>
      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1 font-serif">{race.name}</h4>
      <p className="text-[11px] text-slate-500 flex items-center gap-1">
        <i className="ti ti-map-pin text-[12px]" />
        {race.venue}
      </p>
    </div>
  );
}
