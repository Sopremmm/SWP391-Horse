import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { TEST_JOCKEYS } from "../data/spectatorTestData.js";

function Bar({ value, max, color = "#002a15" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height: 4, background: "#f0ede4", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999 }} />
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function JockeysList() {
  const [sortBy, setSortBy] = useState("wins-desc");
  const [country, setCountry] = useState("all");

  const filtered = useMemo(() => {
    let list = [...TEST_JOCKEYS];
    if (country !== "all") list = list.filter((j) => j.country === country);
    list.sort((a, b) => {
      if (sortBy === "wins-desc") return b.careerWins - a.careerWins;
      if (sortBy === "wins-asc") return a.careerWins - b.careerWins;
      if (sortBy === "rate-desc") return b.winRate - a.winRate;
      if (sortBy === "earnings-desc") return b.prizeEarnings - a.prizeEarnings;
      return 0;
    });
    return list;
  }, [sortBy, country]);

  return (
    <SpectatorLayout>
      <section style={{ background: "#002a15", paddingBlock: "64px 56px" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <p className="m-0 inline-flex items-center" style={{ color: "#ffdea5", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", gap: 12 }}>
            <span style={{ width: 36, height: 1, background: "#ffdea5" }} />
            Jockeys
          </p>
          <h1 className="m-0" style={{ color: "#fff", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 500, lineHeight: 1.1, marginTop: 12, fontFamily: '"EB Garamond", Georgia, serif' }}>
            World-Class Jockeys
          </h1>
          <p className="m-0" style={{ marginTop: 14, color: "rgba(210,245,219,0.82)", fontSize: "1rem", lineHeight: 1.6, width: "min(100%, 580px)" }}>
            From rookie champions to seasoned veterans — the riders shaping the world&apos;s most prestigious races.
          </p>
        </div>
      </section>

      <section
        style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between flex-wrap"
          style={{ minHeight: 72, gap: 16 }}
        >
          <div className="flex items-center" style={{ gap: 8 }}>
            <span style={{ color: "#555e58", fontSize: "0.78rem", fontWeight: 700 }}>
              {filtered.length} active jockeys
            </span>
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              type="button"
              className="inline-flex items-center cursor-pointer"
              style={{ padding: "10px 18px", background: "#fff", color: "#002a15", border: "1px solid #d7d3c7", borderRadius: 2, fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", gap: 8 }}
            >
              <FilterIcon />
              Filters
            </button>
            <div className="flex items-center" style={{ padding: "0 14px", background: "#fff", border: "1px solid #d7d3c7", borderRadius: 2, color: "#002a15", gap: 6 }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555e58" }}>
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 outline-none cursor-pointer"
                style={{ padding: "10px 8px", color: "#002a15", fontSize: "0.78rem", fontWeight: 700 }}
              >
                <option value="wins-desc">Career Wins</option>
                <option value="rate-desc">Win Rate</option>
                <option value="earnings-desc">Prize Earnings</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBlock: "clamp(48px, 6vw, 72px) clamp(64px, 8vw, 96px)" }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {filtered.map((j) => (
            <Link
              key={j.id}
              to={`/spectator/jockeys/${j.id}`}
              className="no-underline"
            >
              <article
                className="bg-white overflow-hidden h-full"
                style={{ border: "1px solid rgba(215,211,199,0.5)", borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <div className="relative overflow-hidden" style={{ height: 240, background: "#e4e1d7" }}>
                  <img src={j.image} alt={j.name} className="block w-full h-full object-cover" />
                  <span className="absolute" style={{ top: 12, right: 12, padding: "4px 10px", borderRadius: 4, background: "rgba(0,42,21,0.92)", color: "#ffdea5", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.08em" }}>
                    {j.country}
                  </span>
                </div>
                <div className="grid gap-3" style={{ padding: 22 }}>
                  <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.3rem", fontWeight: 500, fontFamily: '"EB Garamond", Georgia, serif' }}>
                    {j.name}
                  </h3>
                  <p className="m-0" style={{ color: "#5e655f", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    License {j.licenseNo} · {j.yearsExp} years experience
                  </p>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "12px 0", borderTop: "1px solid #f0ede4", borderBottom: "1px solid #f0ede4" }}
                  >
                    {[
                      { v: j.careerWins, l: "Wins" },
                      { v: `${j.winRate}%`, l: "Win Rate" },
                      { v: `$${(j.prizeEarnings / 1000).toFixed(0)}K`, l: "Earnings" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <p className="m-0" style={{ color: "#002a15", fontSize: "1rem", fontWeight: 800, fontFamily: '"EB Garamond", Georgia, serif' }}>
                          {s.v}
                        </p>
                        <p className="m-0" style={{ marginTop: 2, color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {s.l}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between" style={{ marginBottom: 4 }}>
                      <span style={{ color: "#555e58", fontSize: "0.7rem", fontWeight: 700 }}>Win Rate</span>
                      <span style={{ color: "#002a15", fontSize: "0.78rem", fontWeight: 800 }}>{j.winRate}%</span>
                    </div>
                    <Bar value={j.winRate} max={30} />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </SpectatorLayout>
  );
}
