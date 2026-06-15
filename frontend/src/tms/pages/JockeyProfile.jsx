import { Link, useParams } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";

const JOCKEYS = {
  U003: { name: "Miguel Torres", country: "USA", licenseNo: "JLN-4821", age: 28, weight: 52, careerWins: 142, winRate: 22, prizeEarnings: 1240000, yearsExp: 8, image: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=800&h=1000&fit=crop&q=80", bio: "Miguel Torres is a precision jockey with a career built on consistency and tactical intelligence. Known for waiting patiently in mid-pack before unleashing a powerful late run, Miguel has become the go-to rider for Group 1 classics on firm ground.", signatureWins: ["Group 1 Royal Ascot Stakes (2022)", "Group 1 Belmont Cup (2023)", "Group 2 Saratoga Open (2024)"] },
  U004: { name: "Carlos Ruiz", country: "Spain", licenseNo: "JLN-7156", age: 32, weight: 51, careerWins: 198, winRate: 26, prizeEarnings: 2150000, yearsExp: 12, image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&h=1000&fit=crop&q=80", bio: "Carlos Ruiz is a Spanish veteran with twelve seasons at the top of the sport. Renowned for his daring front-running tactics in long-distance classics, Carlos holds the record for the most Group 1 wins by a Spanish-trained jockey.", signatureWins: ["Group 1 Dubai World Cup (2021)", "Group 1 Prix de l'Arc (2020, 2022)", "Group 1 Melbourne Cup (2023)"] },
  U005: { name: "Emma Sinclair", country: "UK", licenseNo: "JLN-3390", age: 24, weight: 50, careerWins: 86, winRate: 19, prizeEarnings: 720000, yearsExp: 4, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop&q=80", bio: "Emma Sinclair is one of the brightest young talents in international flat racing. Champion apprentice in 2023, she combines a calm temperament with a fearless finishing kick. Her partnership with trainer Margaret Whitaker has yielded three Group victories in her rookie season.", signatureWins: ["Group 3 Epsom Oaks Trial (2024)", "Group 2 Newmarket Stakes (2024)"] },
  J004: { name: "Yuki Tanaka", country: "Japan", licenseNo: "JLN-3891", age: 29, weight: 51, careerWins: 167, winRate: 24, prizeEarnings: 1820000, yearsExp: 9, image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1000&fit=crop&q=80", bio: "Yuki Tanaka is the leading Japanese jockey of his generation, with an exceptional record on firm and good tracks. Triple Crown contender. Known for elegant, almost effortless riding.", signatureWins: ["Group 1 Japan Cup (2022, 2023)", "Group 1 Takarazuka Kinen (2024)"] },
  J005: { name: "Lucas Martini", country: "Italy", licenseNo: "JLN-5512", age: 31, weight: 53, careerWins: 124, winRate: 21, prizeEarnings: 980000, yearsExp: 10, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80", bio: "Lucas Martini is an Italian veteran known for tactical excellence in sprint races. Multiple Group 3 champion with an unrivaled finishing burst in the final furlong.", signatureWins: ["Group 3 Rome Sprint Stakes (2022, 2024)"] },
  J006: { name: "Nina Rodriguez", country: "Argentina", licenseNo: "JLN-3512", age: 27, weight: 50, careerWins: 154, winRate: 25, prizeEarnings: 1420000, yearsExp: 7, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&q=80", bio: "Nina Rodriguez is the 2024 South American Champion Jockey. With a fierce front-running style and natural speed, she has dominated sprint divisions across Buenos Aires, São Paulo, and Santiago.", signatureWins: ["Group 1 Gran Premio Latinoamericano (2024)", "Group 2 Carlos Pellegrini (2023)"] },
  J007: { name: "Oliver James", country: "Ireland", licenseNo: "JLN-4829", age: 30, weight: 52, careerWins: 132, winRate: 22, prizeEarnings: 1180000, yearsExp: 8, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop&q=80", bio: "Oliver James is an Irish champion with a reputation for bravery on rain-affected ground. Two-time Irish Derby winner who excels in heavy conditions where his powerful frame is a real asset.", signatureWins: ["Group 1 Irish Derby (2022, 2023)"] },
  J008: { name: "Sofia Costa", country: "Brazil", licenseNo: "JLN-6134", age: 26, weight: 50, careerWins: 119, winRate: 23, prizeEarnings: 950000, yearsExp: 6, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop&q=80", bio: "Sofia Costa is a Brazilian sensation with explosive natural speed. Won the 2023 South American Sprint Championship and continues to be a dominant force in short-distance races.", signatureWins: ["South American Sprint Championship (2023)", "Group 2 Brazilian 1000 Guineas (2024)"] },
};

const PERFORMANCE = [
  { season: "2024", starts: 78, wins: 22, places: 18, winRate: 28, earnings: 410000 },
  { season: "2023", starts: 92, wins: 24, places: 20, winRate: 26, earnings: 380000 },
  { season: "2022", starts: 86, wins: 21, places: 17, winRate: 24, earnings: 350000 },
  { season: "2021", starts: 74, wins: 17, places: 14, winRate: 23, earnings: 290000 },
  { season: "2020", starts: 68, wins: 14, places: 12, winRate: 20, earnings: 220000 },
];

const RECENT_RIDES = [
  { date: "2025-04-15", race: "Spring Classic", venue: "Churchill Downs", horse: "Thunder Bolt", position: 1, grade: "G1" },
  { date: "2025-03-22", race: "Desert Crown Stakes", venue: "Santa Anita", horse: "Golden Flash", position: 2, grade: "G1" },
  { date: "2025-02-08", race: "Royal Mile", venue: "Royal Ascot", horse: "Silver Arrow", position: 1, grade: "G2" },
  { date: "2025-01-12", race: "Winter Championship", venue: "Flemington", horse: "Iron Charger", position: 4, grade: "G2" },
  { date: "2024-12-19", race: "Crown Cup", venue: "Royal Ascot", horse: "Dark Knight", position: 3, grade: "G1" },
];

function Bar({ value, max, color = "#002a15" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height: 4, background: "#f0ede4", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999 }} />
    </div>
  );
}

function PositionBadge({ pos }) {
  const colors = {
    1: { bg: "#ffdea5", color: "#002a15" },
    2: { bg: "#cbd5e1", color: "#002a15" },
    3: { bg: "#d6a373", color: "#fff" },
  };
  const c = colors[pos] || { bg: "#f0ede4", color: "#555e58" };
  return (
    <span
      className="inline-grid place-items-center"
      style={{ width: 28, height: 28, borderRadius: 999, background: c.bg, color: c.color, fontSize: "0.78rem", fontWeight: 800 }}
    >
      {pos}
    </span>
  );
}

export default function JockeyProfile() {
  const { jockeyId } = useParams();
  const jockey = JOCKEYS[jockeyId] || JOCKEYS.U003;

  return (
    <SpectatorLayout>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: 560 }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #002a15 0%, #1f5a3d 100%)" }}
        />
        <div
          className="relative z-10 w-full mx-auto px-7 md:px-10 lg:px-16 grid items-center"
          style={{
            gridTemplateColumns: "1fr 1fr", minHeight: 560, gap: 48,
            paddingBlock: "120px 56px",
          }}
        >
          <div>
            <Link
              to="/spectator/jockeys"
              className="no-underline inline-flex items-center"
              style={{ color: "#ffdea5", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}
            >
              ← All Jockeys
            </Link>
            <p
              className="m-0 inline-flex items-center"
              style={{ color: "#ffdea5", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", gap: 10 }}
            >
              <span style={{ width: 32, height: 1, background: "#ffdea5" }} />
              {jockey.country} · License {jockey.licenseNo}
            </p>
            <h1
              className="m-0"
              style={{ color: "#fff", fontSize: "clamp(2.6rem, 6vw, 4.8rem)", fontWeight: 500, lineHeight: 1.05, marginTop: 14, fontFamily: '"EB Garamond", Georgia, serif' }}
            >
              {jockey.name}
            </h1>
            <p
              className="m-0"
              style={{ marginTop: 18, color: "rgba(210,245,219,0.85)", fontSize: "1rem", lineHeight: 1.65, width: "min(100%, 480px)" }}
            >
              {jockey.bio}
            </p>

            <div className="flex flex-wrap" style={{ marginTop: 32, gap: 24 }}>
              {[
                { value: jockey.careerWins, label: "Career Wins" },
                { value: `${jockey.winRate}%`, label: "Win Rate" },
                { value: `$${(jockey.prizeEarnings / 1000000).toFixed(1)}M`, label: "Career Earnings" },
                { value: jockey.yearsExp, label: "Years Pro" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="m-0" style={{ color: "#ffdea5", fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", fontWeight: 500, lineHeight: 1, fontFamily: '"EB Garamond", Georgia, serif' }}>
                    {s.value}
                  </p>
                  <p className="m-0" style={{ marginTop: 6, color: "rgba(210,245,219,0.7)", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            className="overflow-hidden"
            style={{
              aspectRatio: "4/5", borderRadius: 8, background: "#e4e1d7",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              maxHeight: 480,
            }}
          >
            <img src={jockey.image} alt={jockey.name} className="block w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* PROFESSIONAL PROFILE + PERFORMANCE */}
      <section style={{ paddingBlock: "clamp(48px, 6vw, 80px)" }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid gap-8"
          style={{ gridTemplateColumns: "1.4fr 1fr" }}
        >
          {/* PROFILE */}
          <div className="grid gap-8">
            <div style={{ background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8, padding: 40 }}>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.8rem", fontWeight: 500, fontFamily: '"EB Garamond", Georgia, serif' }}>
                Professional Profile
              </h2>
              <div
                className="grid"
                style={{ marginTop: 24, gridTemplateColumns: "1fr 1fr", gap: 24 }}
              >
                {[
                  { label: "Full Name", value: jockey.name },
                  { label: "Country", value: jockey.country },
                  { label: "License", value: jockey.licenseNo },
                  { label: "Age", value: `${jockey.age} years` },
                  { label: "Weight", value: `${jockey.weight} kg` },
                  { label: "Experience", value: `${jockey.yearsExp} years professional` },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      {f.label}
                    </p>
                    <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700, marginTop: 4 }}>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div style={{ background: "#002a15", borderRadius: 8, padding: 40 }}>
              <h2 className="m-0" style={{ color: "#ffdea5", fontSize: "1.6rem", fontWeight: 500, fontFamily: '"EB Garamond", Georgia, serif' }}>
                Career Highlights
              </h2>
              <ul className="m-0 grid" style={{ marginTop: 20, padding: 0, listStyle: "none", gap: 14 }}>
                {jockey.signatureWins.map((w) => (
                  <li
                    key={w}
                    className="flex items-start"
                    style={{ gap: 14, padding: 16, background: "rgba(255,255,255,0.05)", borderRadius: 6, border: "1px solid rgba(255,222,165,0.15)" }}
                  >
                    <span className="inline-grid place-items-center" style={{ width: 32, height: 32, borderRadius: 999, background: "#ffdea5", color: "#002a15", fontSize: "0.78rem", fontWeight: 800, flexShrink: 0 }}>
                      ★
                    </span>
                    <div>
                      <p className="m-0" style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.5 }}>
                        {w}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PERFORMANCE HISTORY */}
          <div>
            <div style={{ background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8, padding: 32 }}>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.4rem", fontWeight: 500, fontFamily: '"EB Garamond", Georgia, serif' }}>
                Season Performance
              </h2>
              <div className="grid gap-4" style={{ marginTop: 20 }}>
                {PERFORMANCE.map((p) => (
                  <div key={p.season} style={{ padding: 16, background: "#f7f6f1", borderRadius: 6 }}>
                    <div className="flex justify-between" style={{ marginBottom: 8 }}>
                      <span style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 800, fontFamily: '"EB Garamond", Georgia, serif' }}>
                        {p.season}
                      </span>
                      <span style={{ color: "#002a15", fontSize: "0.85rem", fontWeight: 700 }}>
                        {p.wins} / {p.starts} ({p.winRate}%)
                      </span>
                    </div>
                    <Bar value={p.winRate} max={30} />
                    <div className="grid grid-cols-3" style={{ marginTop: 12, gap: 8 }}>
                      <div>
                        <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Starts
                        </p>
                        <p className="m-0" style={{ color: "#002a15", fontSize: "0.9rem", fontWeight: 700, marginTop: 2 }}>
                          {p.starts}
                        </p>
                      </div>
                      <div>
                        <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Places
                        </p>
                        <p className="m-0" style={{ color: "#002a15", fontSize: "0.9rem", fontWeight: 700, marginTop: 2 }}>
                          {p.places}
                        </p>
                      </div>
                      <div>
                        <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Earned
                        </p>
                        <p className="m-0" style={{ color: "#002a15", fontSize: "0.9rem", fontWeight: 700, marginTop: 2 }}>
                          ${(p.earnings / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT RIDES */}
      <section style={{ background: "#f0ede4", paddingBlock: "clamp(48px, 6vw, 80px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <h2 className="m-0" style={{ color: "#002a15", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 500, fontFamily: '"EB Garamond", Georgia, serif', marginBottom: 8 }}>
            Recent Rides
          </h2>
          <p className="m-0" style={{ color: "#555e58", fontSize: "0.92rem", marginBottom: 28 }}>
            Last five starts with finishing position and grade.
          </p>

          <div style={{ background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8, overflow: "hidden" }}>
            <div
              className="hidden md:grid"
              style={{
                gridTemplateColumns: "120px 1.4fr 1fr 1fr 80px 80px",
                background: "#f7f6f1", borderBottom: "1px solid #d7d3c7",
                padding: "16px 24px", gap: 20,
              }}
            >
              {["Date", "Race", "Venue", "Horse", "Grade", "Position"].map((h) => (
                <span key={h} style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555e58" }}>
                  {h}
                </span>
              ))}
            </div>
            {RECENT_RIDES.map((r, i) => (
              <div
                key={i}
                className="md:grid flex flex-col"
                style={{
                  gridTemplateColumns: "120px 1.4fr 1fr 1fr 80px 80px",
                  padding: "18px 24px", gap: 20,
                  borderBottom: i === RECENT_RIDES.length - 1 ? "none" : "1px solid #f0ede4",
                }}
              >
                <span style={{ color: "#1f231f", fontSize: "0.85rem" }}>{r.date}</span>
                <span style={{ color: "#002a15", fontSize: "0.9rem", fontWeight: 700, fontFamily: '"EB Garamond", Georgia, serif' }}>{r.race}</span>
                <span style={{ color: "#5e655f", fontSize: "0.85rem" }}>{r.venue}</span>
                <span style={{ color: "#1f231f", fontSize: "0.88rem", fontWeight: 600 }}>{r.horse}</span>
                <span>
                  <span style={{ padding: "3px 10px", background: "#f0ede4", color: "#002a15", fontSize: "0.7rem", fontWeight: 800, borderRadius: 4, letterSpacing: "0.06em" }}>
                    {r.grade}
                  </span>
                </span>
                <span><PositionBadge pos={r.position} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SpectatorLayout>
  );
}
