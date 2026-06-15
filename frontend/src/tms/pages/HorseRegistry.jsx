import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { INITIAL_HORSES } from "../data.js";

// Augment INITIAL_HORSES with extra horses for a fuller registry
const EXTRA_HORSES = [
  { id: "h6", name: "Midnight Phantom", breed: "Thoroughbred", age: 3, weight: 498, rating: 87, form: [1, 2, 1], imgUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=600&h=600", status: "Active", color: "Black", gender: "Colt", owner: "Phantom Stables", earnings: 142000, attributes: { speed: 90, stamina: 84, agility: 88, temperament: 82, gateSpeed: 89 } },
  { id: "h7", name: "Crimson Charger", breed: "Arabian", age: 4, weight: 502, rating: 89, form: [2, 1, 2, 1], imgUrl: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&q=80&w=600&h=600", status: "Active", color: "Bay", gender: "Stallion", owner: "Desert Rose Stables", earnings: 198000, attributes: { speed: 87, stamina: 92, agility: 86, temperament: 88, gateSpeed: 84 } },
  { id: "h8", name: "Velvet Tempest", breed: "Thoroughbred", age: 5, weight: 515, rating: 93, form: [1, 1, 1, 2], imgUrl: "https://images.unsplash.com/photo-1598974357801-cbca100e6543?auto=format&fit=crop&q=80&w=600&h=600", status: "Active", color: "Dark Bay", gender: "Mare", owner: "Highland Thoroughbreds", earnings: 380000, attributes: { speed: 92, stamina: 90, agility: 91, temperament: 87, gateSpeed: 88 } },
  { id: "h9", name: "Azure Lightning", breed: "Quarter Horse", age: 4, weight: 510, rating: 86, form: [2, 3, 1, 2], imgUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600&h=600", status: "Active", color: "Steel Gray", gender: "Gelding", owner: "Blue River Farm", earnings: 220000, attributes: { speed: 91, stamina: 80, agility: 87, temperament: 86, gateSpeed: 90 } },
  { id: "h10", name: "Royal Sovereign", breed: "Thoroughbred", age: 6, weight: 520, rating: 94, form: [1, 1, 2, 1], imgUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600&h=600", status: "Active", color: "Chestnut", gender: "Stallion", owner: "Vanderbilt Racing Syndicates", earnings: 425000, attributes: { speed: 95, stamina: 89, agility: 90, temperament: 88, gateSpeed: 92 } },
  { id: "h11", name: "Silver Whisper", breed: "Arabian", age: 4, weight: 485, rating: 83, form: [3, 2, 1, 3], imgUrl: "https://images.unsplash.com/photo-1518467166-367ae630fc92?auto=format&fit=crop&q=80&w=600&h=600", status: "Active", color: "Dapple Gray", gender: "Mare", owner: "Al Maktoum Estates", earnings: 142000, attributes: { speed: 84, stamina: 88, agility: 82, temperament: 90, gateSpeed: 81 } },
];

const HORSES = [...INITIAL_HORSES, ...EXTRA_HORSES];

function FormBadge({ p }) {
  const bg = p === 1 ? "#ffdea5" : p <= 3 ? "#f0ede4" : "#f4f1e8";
  const color = p === 1 ? "#002a15" : "#555e58";
  return (
    <span
      className="inline-grid place-items-center"
      style={{
        width: 24, height: 24, borderRadius: 999,
        background: bg, color,
        fontSize: "0.72rem", fontWeight: 800,
      }}
    >
      {p}
    </span>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function HorseRegistry() {
  const [tab, setTab] = useState("all");
  const [breed, setBreed] = useState("all");
  const [sortBy, setSortBy] = useState("rating-desc");

  const filtered = useMemo(() => {
    let list = HORSES.filter((h) => h.status === "Active");
    if (tab === "thoroughbred") list = list.filter((h) => h.breed === "Thoroughbred");
    if (tab === "arabian") list = list.filter((h) => h.breed === "Arabian");
    if (tab === "quarter") list = list.filter((h) => h.breed === "Quarter Horse");
    if (breed !== "all") list = list.filter((h) => h.breed === breed);
    list.sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      if (sortBy === "earnings-desc") return b.earnings - a.earnings;
      if (sortBy === "age-asc") return a.age - b.age;
      return 0;
    });
    return list;
  }, [tab, breed, sortBy]);

  const counts = {
    all: HORSES.filter((h) => h.status === "Active").length,
    thoroughbred: HORSES.filter((h) => h.breed === "Thoroughbred" && h.status === "Active").length,
    arabian: HORSES.filter((h) => h.breed === "Arabian" && h.status === "Active").length,
    quarter: HORSES.filter((h) => h.breed === "Quarter Horse" && h.status === "Active").length,
  };

  return (
    <SpectatorLayout>
      {/* HEADER STRIP */}
      <section style={{ background: "#002a15", paddingBlock: "64px 56px" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <p
            className="m-0 inline-flex items-center"
            style={{
              color: "#ffdea5", fontSize: "0.72rem", fontWeight: 800,
              letterSpacing: "0.22em", textTransform: "uppercase", gap: 12,
            }}
          >
            <span style={{ width: 36, height: 1, background: "#ffdea5" }} />
            Horse Registry
          </p>
          <h1
            className="m-0"
            style={{
              color: "#fff", fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 500, lineHeight: 1.1, marginTop: 12,
              fontFamily: '"EB Garamond", Georgia, serif',
            }}
          >
            The Thoroughbred Lineage
          </h1>
          <p
            className="m-0"
            style={{
              marginTop: 14, color: "rgba(210,245,219,0.82)",
              fontSize: "1rem", lineHeight: 1.6, width: "min(100%, 580px)",
            }}
          >
            Every horse registered for the season. Tap a profile to view lineage, form, and place a bet on its next race.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section
        aria-label="Registry statistics"
        style={{ background: "#fff", borderBottom: "1px solid #d7d3c7", paddingBlock: 48 }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid gap-8"
          style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
        >
          {[
            { value: HORSES.filter((h) => h.status === "Active").length, label: "Active Horses" },
            { value: HORSES.filter((h) => h.breed === "Thoroughbred").length, label: "Thoroughbreds" },
            { value: HORSES.filter((h) => h.breed === "Arabian").length, label: "Arabians" },
            { value: `$${(HORSES.reduce((s, h) => s + h.earnings, 0) / 1000).toFixed(0)}K`, label: "Total Career Earnings" },
          ].map((s) => (
            <div key={s.label} className="grid gap-1">
              <strong
                style={{
                  color: "#002a15", fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                  fontWeight: 500, lineHeight: 1,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                {s.value}
              </strong>
              <span
                style={{
                  color: "#747b75", fontSize: "0.72rem", fontWeight: 800,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FILTER TABS */}
      <section
        style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between flex-wrap"
          style={{ minHeight: 72, gap: 16 }}
        >
          <div className="flex overflow-x-auto" style={{ gap: 4 }}>
            {[
              { id: "all", label: "All Breeds" },
              { id: "thoroughbred", label: "Thoroughbred" },
              { id: "arabian", label: "Arabian" },
              { id: "quarter", label: "Quarter Horse" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="cursor-pointer border-0"
                style={{
                  padding: "24px 20px",
                  background: "transparent",
                  color: tab === t.id ? "#002a15" : "#555e58",
                  fontSize: "0.78rem", fontWeight: 700,
                  borderBottom: tab === t.id ? "2px solid #002a15" : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
                <span
                  style={{
                    marginLeft: 8, padding: "1px 8px", borderRadius: 999,
                    background: tab === t.id ? "#002a15" : "#f0ede4",
                    color: tab === t.id ? "#ffdea5" : "#555e58",
                    fontSize: "0.66rem", fontWeight: 800,
                  }}
                >
                  {counts[t.id] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              type="button"
              className="inline-flex items-center cursor-pointer"
              style={{
                padding: "10px 18px",
                background: "#fff",
                color: "#002a15",
                border: "1px solid #d7d3c7",
                borderRadius: 2,
                fontSize: "0.72rem", fontWeight: 800,
                letterSpacing: "0.12em", textTransform: "uppercase",
                gap: 8,
              }}
            >
              <FilterIcon />
              Filters
            </button>
            <div
              className="flex items-center"
              style={{
                padding: "0 14px",
                background: "#fff",
                border: "1px solid #d7d3c7",
                borderRadius: 2,
                color: "#002a15", gap: 6,
              }}
            >
              <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555e58" }}>
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 outline-none cursor-pointer"
                style={{ padding: "10px 8px", color: "#002a15", fontSize: "0.78rem", fontWeight: 700 }}
              >
                <option value="rating-desc">Rating — Highest</option>
                <option value="rating-asc">Rating — Lowest</option>
                <option value="earnings-desc">Earnings — Highest</option>
                <option value="age-asc">Age — Youngest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{ paddingBlock: "clamp(48px, 6vw, 72px) clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {filtered.length === 0 ? (
            <div
              className="mx-auto text-center"
              style={{ maxWidth: 480, padding: 48, background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8 }}
            >
              <h3 style={{ color: "#002a15", fontSize: "1.4rem", fontFamily: '"EB Garamond", Georgia, serif', margin: 0 }}>
                No horses match these filters
              </h3>
              <button
                type="button"
                onClick={() => { setTab("all"); setBreed("all"); }}
                className="cursor-pointer border-0"
                style={{
                  marginTop: 20, padding: "12px 24px", background: "#002a15", color: "#fff", borderRadius: 2,
                  fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                }}
              >
                Reset
              </button>
            </div>
          ) : (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
            >
              {filtered.map((h) => (
                <Link
                  key={h.id}
                  to={`/spectator/horses/${h.id}`}
                  className="no-underline"
                >
                  <article
                    className="bg-white overflow-hidden h-full"
                    style={{
                      border: "1px solid rgba(215,211,199,0.5)",
                      borderRadius: 8,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                      transition: "transform 0.18s, box-shadow 0.18s",
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ height: 220, background: "#e4e1d7" }}
                    >
                      <img
                        src={h.imgUrl}
                        alt={h.name}
                        className="block w-full h-full object-cover"
                      />
                      <span
                        className="absolute"
                        style={{
                          top: 12, right: 12,
                          padding: "4px 10px", borderRadius: 4,
                          background: "#002a15", color: "#ffdea5",
                          fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.08em",
                        }}
                      >
                        {h.rating} PTS
                      </span>
                      <span
                        className="absolute"
                        style={{
                          top: 12, left: 12,
                          padding: "4px 10px", borderRadius: 4,
                          background: "rgba(255,255,255,0.95)", color: "#002a15",
                          fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.08em",
                        }}
                      >
                        {h.breed}
                      </span>
                    </div>
                    <div className="grid gap-3" style={{ padding: 22 }}>
                      <div>
                        <h3
                          className="m-0"
                          style={{
                            color: "#002a15", fontSize: "1.3rem", fontWeight: 500,
                            lineHeight: 1.2, fontFamily: '"EB Garamond", Georgia, serif',
                          }}
                        >
                          {h.name}
                        </h3>
                        <p
                          className="m-0"
                          style={{ marginTop: 4, color: "#5e655f", fontSize: "0.82rem", lineHeight: 1.5 }}
                        >
                          {h.color} · {h.age}yo · {h.gender}
                        </p>
                      </div>

                      <div
                        className="flex items-center justify-between"
                        style={{ padding: "10px 0", borderTop: "1px solid #f0ede4", borderBottom: "1px solid #f0ede4" }}
                      >
                        <div>
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            Owner
                          </p>
                          <p className="m-0" style={{ color: "#002a15", fontSize: "0.82rem", fontWeight: 700, marginTop: 2 }}>
                            {h.owner}
                          </p>
                        </div>
                        <div className="flex" style={{ gap: 4 }}>
                          {h.form.slice(0, 4).map((p, i) => (
                            <FormBadge key={i} p={p} />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3" style={{ gap: 12 }}>
                        {[
                          { label: "Speed", value: h.attributes?.speed ?? 85 },
                          { label: "Stamina", value: h.attributes?.stamina ?? 85 },
                          { label: "Gate", value: h.attributes?.gateSpeed ?? 85 },
                        ].map((s) => (
                          <div key={s.label}>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                              {s.label}
                            </p>
                            <p
                              className="m-0"
                              style={{
                                color: "#002a15", fontSize: "1rem", fontWeight: 700,
                                marginTop: 2, fontFamily: '"EB Garamond", Georgia, serif',
                              }}
                            >
                              {s.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SpectatorLayout>
  );
}
