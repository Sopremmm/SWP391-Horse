import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { TEST_FEATURED_RACES } from "../data/spectatorTestData.js";

function ArrowRight({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "g1", label: "Grade 1" },
  { value: "group1", label: "Group 1" },
  { value: "group3", label: "Group 3" },
  { value: "upcoming", label: "Upcoming" },
];

export default function TournamentsList() {
  const [activeTab, setActiveTab] = useState("all");
  const races = TEST_FEATURED_RACES;

  const filtered = useMemo(() => {
    if (activeTab === "all") return races;
    if (activeTab === "g1") return races.filter((r) => r.classLine.includes("Grade 1"));
    if (activeTab === "group1") return races.filter((r) => r.classLine === "Group 1");
    if (activeTab === "group3") return races.filter((r) => r.classLine === "Group 3");
    if (activeTab === "upcoming") return races.filter((r) => r.status === "upcoming");
    return races;
  }, [activeTab, races]);

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* SEARCH HEADER */}
        <section style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}>
          <div
            className="shell"
            style={{ paddingBlock: 18, display: "flex", flexWrap: "wrap", gap: 16 }}
          >
            <div className="spectator__search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: "#747b75" }}>
                <path d="M11 11l3 3M7 13A6 6 0 1 1 7 1a6 6 0 0 1 0 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Search for races, horses, or jockeys..." />
              <button type="button" aria-label="Filter">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* PAGE HEAD */}
        <div className="shell">
          <header className="spectator__page-head">
            <div className="spectator__breadcrumb">
              <Link to="/spectator/home">Home</Link>
              <span className="spectator__breadcrumb__sep">/</span>
              <span className="spectator__breadcrumb__current">Tournaments</span>
            </div>
            <span className="spectator__page-eyebrow">Destined for Greatness</span>
            <h1>Available Races &amp; Tournaments</h1>
            <p>
              The world&apos;s most prestigious thoroughbred events — discover qualifiers,
              group stakes, and invitationals with a single click.
            </p>
          </header>
        </div>

        {/* FILTER ROW */}
        <div className="shell">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 16,
              marginBlock: "8px 32px",
            }}
          >
            <div className="spectator__tabs">
              {FILTER_TABS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setActiveTab(t.value)}
                  className={
                    activeTab === t.value
                      ? "spectator__tab spectator__tab--active"
                      : "spectator__tab"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  color: "#747b75",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Sort By
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "#fff",
                  border: "1px solid rgba(215,211,199,0.5)",
                }}
              >
                <span style={{ color: "#002a15", fontSize: "0.82rem", fontWeight: 700 }}>By Race Date</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* CARDS GRID */}
        <section className="spectator__section" style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="spectator__cards">
              {filtered.map((race) => (
                <article key={race.id} className="spectator__card">
                  <div className="spectator__card-media">
                    <img src={race.image} alt={race.name} />
                    <span className="spectator__card-status">{race.badge}</span>
                  </div>
                  <div className="spectator__card-body">
                    <div>
                      <h3>{race.name}</h3>
                      <p>{race.location}</p>
                    </div>
                    <dl className="spectator__card-details">
                      <div>
                        <dt>Prize Pool</dt>
                        <dd>{race.prizePool}</dd>
                      </div>
                      <div>
                        <dt>Distance</dt>
                        <dd>{race.distance}</dd>
                      </div>
                      <div>
                        <dt>Runners</dt>
                        <dd>{race.runners} horses</dd>
                      </div>
                    </dl>
                    <Link
                      to={`/spectator/tournaments/${race.id}`}
                      className="spectator__card-button"
                    >
                      View Details
                      <ArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SpectatorLayout>
  );
}
