import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { INITIAL_HORSES } from "../data.js";
import { RACES_SEED } from "../races.js";
import { getOddsForHorse } from "../data.js";
import { useApp } from "../AppContext.jsx";

const EXTRA = [
  { id: "h6", name: "Midnight Phantom", breed: "Thoroughbred", age: 3, weight: 498, rating: 87, form: [1, 2, 1, 2], imgUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=1200&h=800", bio: "Midnight Phantom is a rising star in flat racing, known for an explosive late kick and a temperament that suits long-distance stakes.", careerEarnings: 142000, status: "Active", color: "Black", gender: "Colt", owner: "Phantom Stables", sire: "Stormfront", dam: "Nocturne", trainer: "Alistair Grey", attributes: { speed: 90, stamina: 84, agility: 88, temperament: 82, gateSpeed: 89 } },
  { id: "h7", name: "Crimson Charger", breed: "Arabian", age: 4, weight: 502, rating: 89, form: [2, 1, 2, 1, 1], imgUrl: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&q=80&w=1200&h=800", bio: "Crimson Charger blends Arabian endurance with surprising sprint speed. Three-time Group winner on firm tracks.", careerEarnings: 198000, status: "Active", color: "Bay", gender: "Stallion", owner: "Desert Rose Stables", sire: "Emir", dam: "Saffron", trainer: "Layla Al-Mansour", attributes: { speed: 87, stamina: 92, agility: 86, temperament: 88, gateSpeed: 84 } },
  { id: "h8", name: "Velvet Tempest", breed: "Thoroughbred", age: 5, weight: 515, rating: 93, form: [1, 1, 1, 2, 1], imgUrl: "https://images.unsplash.com/photo-1598974357801-cbca100e6543?auto=format&fit=crop&q=80&w=1200&h=800", bio: "Velvet Tempest is the most decorated filly of the season — four Group 1 wins, never out of the frame in her last ten starts.", careerEarnings: 380000, status: "Active", color: "Dark Bay", gender: "Mare", owner: "Highland Thoroughbreds", sire: "Gilded Crown", dam: "Midnight Bloom", trainer: "Margaret Whitaker", attributes: { speed: 92, stamina: 90, agility: 91, temperament: 87, gateSpeed: 88 } },
  { id: "h9", name: "Azure Lightning", breed: "Quarter Horse", age: 4, weight: 510, rating: 86, form: [2, 3, 1, 2, 1], imgUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1200&h=800", bio: "A sprint specialist with the fastest gate speed in the registry. Best over distances under 1400m.", careerEarnings: 220000, status: "Active", color: "Steel Gray", gender: "Gelding", owner: "Blue River Farm", sire: "Gale Force", dam: "Misty Dawn", trainer: "Daniel Park", attributes: { speed: 91, stamina: 80, agility: 87, temperament: 86, gateSpeed: 90 } },
  { id: "h10", name: "Royal Sovereign", breed: "Thoroughbred", age: 6, weight: 520, rating: 94, form: [1, 1, 2, 1, 1, 2], imgUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200&h=800", bio: "A proven champion at the top level, Royal Sovereign has accumulated seven Group 1 victories across three continents.", careerEarnings: 425000, status: "Active", color: "Chestnut", gender: "Stallion", owner: "Vanderbilt Racing Syndicates", sire: "Imperial Star", dam: "Vera Cruz", trainer: "Henry Vanderbilt", attributes: { speed: 95, stamina: 89, agility: 90, temperament: 88, gateSpeed: 92 } },
  { id: "h11", name: "Silver Whisper", breed: "Arabian", age: 4, weight: 485, rating: 83, form: [3, 2, 1, 3, 1], imgUrl: "https://images.unsplash.com/photo-1518467166-367ae630fc92?auto=format&fit=crop&q=80&w=1200&h=800", bio: "Silver Whisper is a graceful, late-blooming mare whose stamina makes her a perfect fit for middle-distance classics.", careerEarnings: 142000, status: "Active", color: "Dapple Gray", gender: "Mare", owner: "Al Maktoum Estates", sire: "Silver Lining", dam: "Luna", trainer: "Ibrahim Al-Sabah", attributes: { speed: 84, stamina: 88, agility: 82, temperament: 90, gateSpeed: 81 } },
];

const HORSES = [...INITIAL_HORSES.map((h) => ({
  ...h,
  bio: `${h.name} is a ${h.age}-year-old ${h.breed.toLowerCase()} owned by ${h.owner}. Known for an exceptional temperament and a strong closing kick in the final furlong.`,
  careerEarnings: h.earnings,
  sire: "Royal Mariner",
  dam: "Crescent Star",
  trainer: "Henry Vanderbilt",
  imgUrl: h.imgUrl.replace("w=600&h=600", "w=1200&h=800"),
})), ...EXTRA];

function FormDot({ p }) {
  const bg = p === 1 ? "#ffdea5" : p <= 3 ? "#f0ede4" : "#f4f1e8";
  const color = p === 1 ? "#002a15" : "#555e58";
  return (
    <span
      className="inline-grid place-items-center"
      style={{
        width: 28, height: 28, borderRadius: 999,
        background: bg, color, fontSize: "0.78rem", fontWeight: 800,
      }}
    >
      {p}
    </span>
  );
}

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="m7 1 1.85 3.75L13 5.27l-3 2.92.71 4.13L7 10.4l-3.71 1.92L4 8.2 1 5.27l4.15-.52L7 1Z" fill="currentColor" />
    </svg>
  );
}

function Bar({ value, max = 100, label, color = "#002a15" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between" style={{ marginBottom: 6 }}>
        <span style={{ color: "#555e58", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em" }}>
          {label}
        </span>
        <span style={{ color: "#002a15", fontSize: "0.85rem", fontWeight: 800 }}>
          {value}<span style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 600 }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 6, background: "#f0ede4", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export default function HorseDetail() {
  const { horseId } = useParams();
  const navigate = useNavigate();
  const { user, placeBet } = useApp();
  const horse = HORSES.find((h) => h.id === horseId) || HORSES[0];

  const upcomingRaces = RACES_SEED.filter((r) => r.status === "Upcoming");
  const [selectedRace, setSelectedRace] = useState(upcomingRaces[0]?.id || "");
  const [betAmount, setBetAmount] = useState(50);
  const [betSuccess, setBetSuccess] = useState(null);
  const [betError, setBetError] = useState("");

  const odds = getOddsForHorse(horse.name);
  const payout = Math.round(betAmount * odds * 100) / 100;

  const handlePlaceBet = () => {
    setBetError("");
    if (!user) {
      navigate("/");
      return;
    }
    if (betAmount < 10) {
      setBetError("Minimum stake is $10.");
      return;
    }
    if (!selectedRace) {
      setBetError("Select a race to bet on.");
      return;
    }
    const race = RACES_SEED.find((r) => r.id === selectedRace);
    const bet = placeBet({
      raceId: selectedRace,
      horseName: horse.name,
      jockeyName: race.registrations.find((r) => r.horseName === horse.name)?.jockeyName || "TBD",
      amount: betAmount,
    });
    setBetSuccess(bet);
    setTimeout(() => {
      setBetSuccess(null);
      setBetAmount(50);
    }, 2400);
  };

  return (
    <SpectatorLayout>
      {/* HERO */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: 480 }}
      >
        <img
          src={horse.imgUrl}
          alt={horse.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,42,21,0.2) 0%, rgba(0,42,21,0.85) 100%)",
          }}
        />
        <div
          className="relative z-10 w-full mx-auto px-7 md:px-10 lg:px-16"
          style={{ paddingBlock: "120px 40px" }}
        >
          <Link
            to="/spectator/horses"
            className="no-underline inline-flex items-center"
            style={{
              color: "#ffdea5", fontSize: "0.72rem", fontWeight: 800,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16,
            }}
          >
            ← Back to Registry
          </Link>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p
                className="m-0 inline-flex items-center"
                style={{
                  color: "#ffdea5", fontSize: "0.7rem", fontWeight: 800,
                  letterSpacing: "0.22em", textTransform: "uppercase", gap: 10,
                }}
              >
                <span style={{ width: 32, height: 1, background: "#ffdea5" }} />
                {horse.breed} · {horse.color} · {horse.gender}
              </p>
              <h1
                className="m-0"
                style={{
                  color: "#fff", fontSize: "clamp(2.4rem, 5.4vw, 4.2rem)",
                  fontWeight: 500, lineHeight: 1.05, marginTop: 14,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                {horse.name}
              </h1>
              <p
                className="m-0"
                style={{
                  marginTop: 12, color: "rgba(210,245,219,0.85)",
                  fontSize: "1rem", lineHeight: 1.5,
                }}
              >
                {horse.age} years · {horse.weight}kg · Rating {horse.rating} PTS
              </p>
            </div>
            <div
              className="flex items-center"
              style={{
                gap: 16, padding: 20,
                background: "rgba(0,0,0,0.3)", borderRadius: 8, backdropFilter: "blur(8px)",
              }}
            >
              <div>
                <p className="m-0" style={{ color: "#ffdea5", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Current Odds
                </p>
                <p className="m-0" style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 700, marginTop: 4, fontFamily: '"EB Garamond", Georgia, serif' }}>
                  {odds.toFixed(2)}x
                </p>
              </div>
              <div style={{ width: 1, height: 40, background: "rgba(255,222,165,0.3)" }} />
              <div>
                <p className="m-0" style={{ color: "#ffdea5", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Form
                </p>
                <div className="flex" style={{ gap: 4, marginTop: 4 }}>
                  {horse.form.map((p, i) => <FormDot key={i} p={p} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section style={{ paddingBlock: "clamp(48px, 6vw, 72px)" }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid gap-8"
          style={{ gridTemplateColumns: "1fr 380px" }}
        >
          <div className="grid gap-8">
            {/* BIOGRAPHY */}
            <div
              style={{
                background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8,
                padding: 40,
              }}
            >
              <h2
                className="m-0"
                style={{
                  color: "#002a15", fontSize: "1.8rem", fontWeight: 500,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                Biography
              </h2>
              <p
                className="m-0"
                style={{ marginTop: 16, color: "#1f231f", fontSize: "1rem", lineHeight: 1.7 }}
              >
                {horse.bio}
              </p>

              <div
                className="grid gap-4"
                style={{
                  marginTop: 32, paddingTop: 28,
                  borderTop: "1px solid #f0ede4",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                }}
              >
                {[
                  { label: "Owner", value: horse.owner },
                  { label: "Trainer", value: horse.trainer },
                  { label: "Sire", value: horse.sire },
                  { label: "Dam", value: horse.dam },
                  { label: "Color", value: horse.color },
                  { label: "Gender", value: horse.gender },
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

            {/* STATS */}
            <div
              style={{
                background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8,
                padding: 40,
              }}
            >
              <div className="flex items-center justify-between flex-wrap" style={{ marginBottom: 24, gap: 12 }}>
                <h2
                  className="m-0"
                  style={{
                    color: "#002a15", fontSize: "1.8rem", fontWeight: 500,
                    fontFamily: '"EB Garamond", Georgia, serif',
                  }}
                >
                  Performance Attributes
                </h2>
                <span
                  className="inline-flex items-center"
                  style={{ color: "#b8860b", gap: 4 }}
                >
                  <Star /><Star /><Star /><Star /><Star />
                </span>
              </div>

              <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <Bar value={horse.attributes?.speed ?? 90} label="Speed" />
                <Bar value={horse.attributes?.stamina ?? 88} label="Stamina" />
                <Bar value={horse.attributes?.agility ?? 86} label="Agility" />
                <Bar value={horse.attributes?.temperament ?? 85} label="Temperament" />
                <Bar value={horse.attributes?.gateSpeed ?? 88} label="Gate Speed" />
                <Bar value={horse.rating} max={120} label="Overall Rating" color="#b8860b" />
              </div>
            </div>

            {/* CAREER STATS */}
            <div
              style={{
                background: "#f7f6f1", borderRadius: 8,
                padding: 40,
              }}
            >
              <h2
                className="m-0"
                style={{
                  color: "#002a15", fontSize: "1.8rem", fontWeight: 500,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                Career Stats
              </h2>
              <div
                className="grid"
                style={{ marginTop: 24, gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 20 }}
              >
                {[
                  { value: "23", label: "Starts" },
                  { value: "8", label: "Wins" },
                  { value: "5", label: "Places" },
                  { value: `$${(horse.careerEarnings / 1000).toFixed(0)}K`, label: "Earnings" },
                ].map((s) => (
                  <div key={s.label} className="text-center" style={{ padding: 16, background: "#fff", borderRadius: 6 }}>
                    <p
                      className="m-0"
                      style={{
                        color: "#002a15", fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                        fontWeight: 500, lineHeight: 1,
                        fontFamily: '"EB Garamond", Georgia, serif',
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="m-0"
                      style={{
                        marginTop: 6, color: "#747b75", fontSize: "0.7rem",
                        fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BET SLIP SIDEBAR */}
          <aside
            style={{
              position: "sticky", top: 96, alignSelf: "flex-start",
              background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 28, background: "#002a15" }}>
              <p
                className="m-0"
                style={{
                  color: "#ffdea5", fontSize: "0.66rem", fontWeight: 800,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                }}
              >
                Place Bet
              </p>
              <h3
                className="m-0"
                style={{
                  color: "#fff", fontSize: "1.5rem", fontWeight: 500,
                  marginTop: 8, fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                Bet on {horse.name}
              </h3>
            </div>
            <div className="grid gap-4" style={{ padding: 28 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#747b75", marginBottom: 8 }}>
                  Race
                </label>
                <select
                  value={selectedRace}
                  onChange={(e) => setSelectedRace(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border bg-white cursor-pointer"
                  style={{ borderColor: "#d7d3c7", borderRadius: 2, color: "#002a15" }}
                >
                  {upcomingRaces.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#747b75", marginBottom: 8 }}>
                  Stake
                </label>
                <div className="flex items-center" style={{ border: "1px solid #d7d3c7", borderRadius: 2, padding: "0 14px", gap: 12 }}>
                  <span style={{ color: "#555e58", fontSize: "0.95rem", fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    min={10}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                    className="flex-1 bg-transparent border-0 outline-none"
                    style={{ padding: "12px 0", color: "#002a15", fontSize: "1.05rem", fontWeight: 700 }}
                  />
                </div>
                <div className="flex" style={{ gap: 6, marginTop: 8 }}>
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBetAmount(amt)}
                      className="cursor-pointer"
                      style={{
                        flex: 1, padding: "7px 0",
                        background: betAmount === amt ? "#002a15" : "#fff",
                        color: betAmount === amt ? "#ffdea5" : "#002a15",
                        border: "1px solid #d7d3c7", borderRadius: 2,
                        fontSize: "0.74rem", fontWeight: 700,
                      }}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="grid gap-2"
                style={{ padding: 18, background: "#f7f6f1", borderRadius: 6 }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "#555e58", fontSize: "0.82rem" }}>Stake</span>
                  <span style={{ color: "#002a15", fontSize: "0.88rem", fontWeight: 700 }}>${betAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#555e58", fontSize: "0.82rem" }}>Odds</span>
                  <span style={{ color: "#002a15", fontSize: "0.88rem", fontWeight: 700 }}>{odds.toFixed(2)}x</span>
                </div>
                <div style={{ height: 1, background: "#d7d3c7" }} />
                <div className="flex justify-between">
                  <span style={{ color: "#002a15", fontSize: "0.9rem", fontWeight: 800 }}>Payout</span>
                  <span style={{ color: "#002a15", fontSize: "1.1rem", fontWeight: 800, fontFamily: '"EB Garamond", Georgia, serif' }}>
                    ${payout.toFixed(2)}
                  </span>
                </div>
              </div>

              {betError && (
                <p className="m-0" style={{ color: "#9f1239", fontSize: "0.78rem", fontWeight: 600, padding: 8, background: "#fff1f2", borderRadius: 4 }}>
                  {betError}
                </p>
              )}
              {!user && (
                <p className="m-0" style={{ color: "#1e40af", fontSize: "0.78rem", fontWeight: 600, padding: 8, background: "#eff6ff", borderRadius: 4 }}>
                  Sign in as spectator to place a bet.
                </p>
              )}

              <button
                type="button"
                onClick={handlePlaceBet}
                className="w-full cursor-pointer border-0"
                style={{
                  padding: "14px 20px",
                  background: betSuccess ? "#166534" : "#002a15",
                  color: "#fff", borderRadius: 2,
                  fontSize: "0.78rem", fontWeight: 800,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}
              >
                {betSuccess ? "✓ Bet Placed" : "Confirm Bet"}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </SpectatorLayout>
  );
}
