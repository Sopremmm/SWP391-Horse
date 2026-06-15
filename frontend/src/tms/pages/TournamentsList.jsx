import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { RACES_SEED } from "../races.js";

const COVERS = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=900&q=80&auto=format&fit=crop",
];

function stateText(race) {
  const d = new Date(race.date);
  const today = new Date();
  const diff = Math.round((d - today) / 86400000);
  if (race.status === "Running") return { text: "In Progress", tone: "green" };
  if (race.status === "Finished") return { text: "Completed", tone: "stone" };
  if (diff <= 7) return { text: "Registration Open", tone: "amber" };
  return { text: "Upcoming", tone: "stone" };
}

function ArrowDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 9 1 4h10L6 9Z" fill="currentColor" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function TournamentsList() {
  const [tab, setTab] = useState("all");
  const [sortBy, setSortBy] = useState("date-asc");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...RACES_SEED];
    if (tab === "registration-open") {
      list = list.filter((r) => {
        const d = new Date(r.date);
        const diff = Math.round((d - new Date()) / 86400000);
        return r.status === "Upcoming" && diff <= 7;
      });
    } else if (tab === "upcoming") {
      list = list.filter((r) => r.status === "Upcoming");
    } else if (tab === "completed") {
      list = list.filter((r) => r.status === "Finished");
    }
    if (filterRegion !== "all") list = list.filter((r) => r.venue.includes(filterRegion));
    if (filterGrade !== "all") list = list.filter((r) => r.grade === filterGrade);

    list.sort((a, b) => {
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "prize-desc") return b.prizePool - a.prizePool;
      if (sortBy === "prize-asc") return a.prizePool - b.prizePool;
      return 0;
    });
    return list;
  }, [tab, sortBy, filterRegion, filterGrade]);

  const featured = filtered.slice(0, 3);
  const tableRows = filtered.slice(3);

  const tabCounts = {
    "all": RACES_SEED.length,
    "registration-open": RACES_SEED.filter((r) => {
      const diff = Math.round((new Date(r.date) - new Date()) / 86400000);
      return r.status === "Upcoming" && diff <= 7;
    }).length,
    "upcoming": RACES_SEED.filter((r) => r.status === "Upcoming").length,
    "completed": RACES_SEED.filter((r) => r.status === "Finished").length,
  };

  return (
    <SpectatorLayout>
      {/* HEADER STRIP */}
      <section
        style={{ background: "#002a15", paddingBlock: "64px 56px" }}
      >
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <p
            className="m-0 inline-flex items-center"
            style={{
              color: "#ffdea5",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              gap: 12,
            }}
          >
            <span style={{ width: 36, height: 1, background: "#ffdea5" }} />
            Tournaments
          </p>
          <h1
            className="m-0"
            style={{
              color: "#fff",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              marginTop: 12,
              fontFamily: '"EB Garamond", Georgia, serif',
            }}
          >
            Tournaments &amp; Stakes Calendar
          </h1>
          <p
            className="m-0"
            style={{
              marginTop: 14,
              color: "rgba(210,245,219,0.82)",
              fontSize: "1rem",
              lineHeight: 1.6,
              width: "min(100%, 580px)",
            }}
          >
            Browse every qualifier, group stakes, and invitational. Click any card to see the field and place a bet.
          </p>
        </div>
      </section>

      {/* TOOLBAR */}
      <section
        style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between flex-wrap"
          style={{ paddingBlock: 0, minHeight: 72, gap: 16 }}
        >
          <div className="flex overflow-x-auto" style={{ gap: 4 }}>
            {[
              { id: "all", label: "All" },
              { id: "registration-open", label: "Registration Open" },
              { id: "upcoming", label: "Upcoming" },
              { id: "completed", label: "Completed" },
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
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  borderBottom: tab === t.id ? "2px solid #002a15" : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
                <span
                  style={{
                    marginLeft: 8,
                    padding: "1px 8px",
                    borderRadius: 999,
                    background: tab === t.id ? "#002a15" : "#f0ede4",
                    color: tab === t.id ? "#ffdea5" : "#555e58",
                    fontSize: "0.66rem",
                    fontWeight: 800,
                  }}
                >
                  {tabCounts[t.id]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex items-center cursor-pointer"
              style={{
                padding: "10px 18px",
                background: filtersOpen ? "#002a15" : "#fff",
                color: filtersOpen ? "#ffdea5" : "#002a15",
                border: "1px solid #d7d3c7",
                borderRadius: 2,
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                gap: 8,
              }}
            >
              <FilterIcon />
              Filters
            </button>
            <div
              className="flex items-center"
              style={{
                padding: "0 12px 0 14px",
                background: "#fff",
                border: "1px solid #d7d3c7",
                borderRadius: 2,
                color: "#002a15",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#555e58",
                }}
              >
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 outline-none cursor-pointer"
                style={{
                  padding: "10px 8px",
                  color: "#002a15",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                <option value="date-asc">Date — Earliest</option>
                <option value="date-desc">Date — Latest</option>
                <option value="prize-desc">Prize — Highest</option>
                <option value="prize-asc">Prize — Lowest</option>
              </select>
              <ArrowDown />
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div
            className="w-full mx-auto px-7 md:px-10 lg:px-16 grid"
            style={{
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              paddingBlock: 24,
              gap: 16,
              borderTop: "1px solid #f0ede4",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#747b75",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Region / Venue
              </label>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border bg-white cursor-pointer"
                style={{ borderColor: "#d7d3c7", borderRadius: 2, color: "#002a15" }}
              >
                <option value="all">All Regions</option>
                <option value="Churchill">North America</option>
                <option value="Royal Ascot">Europe</option>
                <option value="Flemington">Asia-Pacific</option>
                <option value="Santa Anita">Americas</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#747b75",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Grade
              </label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border bg-white cursor-pointer"
                style={{ borderColor: "#d7d3c7", borderRadius: 2, color: "#002a15" }}
              >
                <option value="all">All Grades</option>
                <option value="G1">Group 1</option>
                <option value="G2">Group 2</option>
                <option value="G3">Group 3</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* FEATURED CARDS */}
      {featured.length > 0 && (
        <section style={{ paddingBlock: "clamp(48px, 6vw, 72px)" }}>
          <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
            <h2
              className="m-0"
              style={{
                color: "#002a15",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                marginBottom: 32,
                fontFamily: '"EB Garamond", Georgia, serif',
              }}
            >
              Featured Events
            </h2>
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
            >
              {featured.map((race, idx) => {
                const status = stateText(race);
                const statusBg =
                  status.tone === "amber" ? "rgba(255,222,165,0.95)" : status.tone === "green" ? "rgba(0,42,21,0.95)" : "#e7e5dd";
                const statusColor = status.tone === "amber" ? "#263b12" : status.tone === "green" ? "#fff" : "#555e58";
                return (
                  <Link
                    key={race.id}
                    to={`/spectator/tournaments/${race.id}`}
                    className="no-underline"
                  >
                    <article
                      className="bg-white overflow-hidden"
                      style={{
                        border: "1px solid rgba(215,211,199,0.5)",
                        borderRadius: 8,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ height: 220, background: "#e4e1d7" }}
                      >
                        <img
                          src={COVERS[idx % COVERS.length]}
                          alt={race.name}
                          className="block w-full h-full object-cover"
                        />
                        <span
                          className="absolute"
                          style={{
                            top: 14, right: 14,
                            padding: "6px 12px",
                            borderRadius: 4,
                            background: statusBg,
                            color: statusColor,
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {status.text}
                        </span>
                        <span
                          className="absolute"
                          style={{
                            top: 14, left: 14,
                            padding: "6px 12px",
                            borderRadius: 4,
                            background: "rgba(0,42,21,0.92)",
                            color: "#ffdea5",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                          }}
                        >
                          {race.grade}
                        </span>
                      </div>
                      <div className="grid gap-4" style={{ padding: 28 }}>
                        <div>
                          <h3
                            className="m-0"
                            style={{
                              color: "#002a15",
                              fontSize: "1.55rem",
                              fontWeight: 500,
                              lineHeight: 1.2,
                              fontFamily: '"EB Garamond", Georgia, serif',
                            }}
                          >
                            {race.name}
                          </h3>
                          <p
                            className="m-0"
                            style={{ marginTop: 6, color: "#5e655f", fontSize: "0.88rem", lineHeight: 1.5 }}
                          >
                            {race.venue} · {race.distance}m
                          </p>
                        </div>
                        <dl className="m-0 grid gap-2.5">
                          <div className="flex justify-between">
                            <dt style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                              Date
                            </dt>
                            <dd className="m-0" style={{ color: "#002a15", fontSize: "0.78rem", fontWeight: 700 }}>
                              {new Date(race.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                              Prize Pool
                            </dt>
                            <dd className="m-0" style={{ color: "#002a15", fontSize: "0.78rem", fontWeight: 800 }}>
                              ${race.prizePool.toLocaleString()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                              Field
                            </dt>
                            <dd className="m-0" style={{ color: "#002a15", fontSize: "0.78rem", fontWeight: 700 }}>
                              {(race.registrations || []).filter((r) => r.status === "Approved").length} horses
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TABLE — REGIONAL QUALIFIERS */}
      {tableRows.length > 0 && (
        <section
          aria-labelledby="regional-heading"
          style={{ paddingBlock: "clamp(40px, 5vw, 56px) clamp(64px, 8vw, 96px)" }}
        >
          <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
            <h2
              id="regional-heading"
              className="m-0"
              style={{
                color: "#002a15",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                marginBottom: 8,
                fontFamily: '"EB Garamond", Georgia, serif',
              }}
            >
              Regional Qualifiers
            </h2>
            <p className="m-0" style={{ color: "#555e58", fontSize: "0.92rem", marginBottom: 28 }}>
              Upcoming qualifiers feeding into the season championships.
            </p>

            <div
              className="bg-white overflow-hidden"
              style={{ border: "1px solid #d7d3c7", borderRadius: 8 }}
            >
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f7f6f1", borderBottom: "1px solid #d7d3c7" }}>
                    {["Tournament", "Venue", "Date", "Grade", "Prize", "Field", ""].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "16px 20px",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#555e58",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((race, i) => (
                    <tr
                      key={race.id}
                      style={{
                        borderBottom: i === tableRows.length - 1 ? "none" : "1px solid #f0ede4",
                      }}
                    >
                      <td style={{ padding: "18px 20px" }}>
                        <div className="flex items-center" style={{ gap: 14 }}>
                          <div
                            className="overflow-hidden"
                            style={{ width: 48, height: 48, borderRadius: 6, background: "#e4e1d7", flexShrink: 0 }}
                          >
                            <img
                              src={COVERS[(i + 3) % COVERS.length]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="m-0" style={{ color: "#002a15", fontSize: "0.92rem", fontWeight: 700, fontFamily: '"EB Garamond", Georgia, serif' }}>
                              {race.name}
                            </p>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.74rem", marginTop: 2 }}>
                              ID: {race.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "18px 20px", color: "#1f231f", fontSize: "0.85rem" }}>
                        {race.venue}
                      </td>
                      <td style={{ padding: "18px 20px", color: "#1f231f", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {new Date(race.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                      </td>
                      <td style={{ padding: "18px 20px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            background: "#f0ede4",
                            color: "#002a15",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            borderRadius: 4,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {race.grade}
                        </span>
                      </td>
                      <td style={{ padding: "18px 20px", color: "#002a15", fontSize: "0.92rem", fontWeight: 800 }}>
                        ${race.prizePool.toLocaleString()}
                      </td>
                      <td style={{ padding: "18px 20px", color: "#1f231f", fontSize: "0.85rem" }}>
                        {(race.registrations || []).filter((r) => r.status === "Approved").length} horses
                      </td>
                      <td style={{ padding: "18px 20px", textAlign: "right" }}>
                        <Link
                          to={`/spectator/tournaments/${race.id}`}
                          className="inline-flex items-center no-underline"
                          style={{
                            padding: "8px 16px",
                            color: "#002a15",
                            background: "transparent",
                            boxShadow: "inset 0 0 0 1px #002a15",
                            borderRadius: 2,
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                          }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section style={{ paddingBlock: 96 }}>
          <div
            className="mx-auto text-center"
            style={{ maxWidth: 480, padding: 48, background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8 }}
          >
            <h3 style={{ color: "#002a15", fontSize: "1.4rem", fontFamily: '"EB Garamond", Georgia, serif', margin: 0 }}>
              No tournaments match your filters
            </h3>
            <p style={{ color: "#555e58", fontSize: "0.92rem", marginTop: 12 }}>
              Try adjusting the tabs or filters to see more events.
            </p>
            <button
              type="button"
              onClick={() => { setTab("all"); setFilterRegion("all"); setFilterGrade("all"); }}
              className="cursor-pointer border-0"
              style={{
                marginTop: 20,
                padding: "12px 24px",
                background: "#002a15",
                color: "#fff",
                borderRadius: 2,
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Reset Filters
            </button>
          </div>
        </section>
      )}
    </SpectatorLayout>
  );
}
