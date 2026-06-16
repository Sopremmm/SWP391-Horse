import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { Link } from "react-router-dom";
import { HORSE_REGISTRY, SPECTATOR_STATS } from "../data/spectatorData.js";

function ArrowRight({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

const FILTERS = [
  { value: "all", label: "All Breeds" },
  { value: "thoroughbred", label: "Thoroughbred" },
  { value: "arabian", label: "Arabian Cross" },
  { value: "elite", label: "Elite Tier" },
];

export default function HorseRegistry() {
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
              <span className="spectator__breadcrumb__current">Horse Registry</span>
            </div>
            <span className="spectator__page-eyebrow">Explore Thoroughbreds</span>
            <h1>Horse Registry</h1>
            <p>
              A complete index of every horse competing this season. Tap a profile
              to view lineage, recent form, and place a bet on the next race.
            </p>
          </header>
        </div>

        {/* STATS BENTO */}
        <div className="shell">
          <div className="spectator__bento">
            <BentoCell
              tone="dark"
              label="Total Registered Horses"
              value={SPECTATOR_STATS.totalHorses}
              note="Across all disciplines and tiers — Thoroughbred, Arabian, Quarter Horse, and Standardbred."
            />
            <BentoCell
              tone="light"
              label="Active Disciplines"
              value={SPECTATOR_STATS.activeDisciplines}
              note="Flat · Steeplechase · Sprint"
            />
            <BentoCell
              tone="light"
              label="New This Season"
              value={SPECTATOR_STATS.newSeason}
              note="First-time registrations 2024"
            />
          </div>
        </div>

        {/* FILTER ROW */}
        <div className="shell" style={{ marginBlock: "24px 28px" }}>
          <div className="spectator__tabs">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={
                  f.value === "all"
                    ? "spectator__tab spectator__tab--active"
                    : "spectator__tab"
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* HORSE GRID */}
        <section className="spectator__section" style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="spectator__cards">
              {HORSE_REGISTRY.map((h) => (
                <article key={h.id} className="spectator__horse-card">
                  <div className="spectator__horse-card__media">
                    <img src={h.image} alt={h.name} />
                    <span className="spectator__pill spectator__pill--dark">
                      {h.performance}
                    </span>
                  </div>
                  <div className="spectator__horse-card__body">
                    <div>
                      <h3>{h.name}</h3>
                      <p>{h.meta}</p>
                    </div>
                    <Link
                      to={`/spectator/horses/${h.id}`}
                      className="spectator__card-button"
                    >
                      View Profile
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

function BentoCell({ tone, label, value, note }) {
  return (
    <div
      className={
        tone === "dark"
          ? "spectator__bento__cell spectator__bento__cell--dark"
          : "spectator__bento__cell spectator__bento__cell--light"
      }
    >
      <div>
        <p className="spectator__bento__eyebrow">{label}</p>
        <strong className="spectator__bento__value">{value}</strong>
      </div>
      <p className="spectator__bento__note">{note}</p>
    </div>
  );
}
