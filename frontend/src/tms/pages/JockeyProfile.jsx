import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { TEST_JOCKEYS } from "../data/spectatorTestData.js";

const PROFILE_TABS = [
  { value: "overview", label: "Overview" },
  { value: "performance", label: "Performance" },
  { value: "gallery", label: "Gallery" },
];

const POSITION_TONE = {
  "1st": "1st",
  "2nd": "2nd",
  "3rd": "3rd",
  "4th": "4th",
};

const PERFORMANCE_SEASONS = [
  { year: "2024", wins: 22, starts: 78, rate: 28, earned: 410000 },
  { year: "2023", wins: 24, starts: 92, rate: 26, earned: 380000 },
  { year: "2022", wins: 21, starts: 86, rate: 24, earned: 350000 },
  { year: "2021", wins: 17, starts: 74, rate: 23, earned: 290000 },
];

export default function JockeyProfile() {
  const { jockeyId } = useParams();
  const jockey = TEST_JOCKEYS.find((j) => j.id === jockeyId) || TEST_JOCKEYS[0];
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* COVER + SOCIALS + BACK */}
        <section className="spectator__jockey-cover">
          <img src={jockey.coverImage} alt="cover" />
          <div className="spectator__jockey-cover__gradient" />
          <Link to="/spectator/jockeys" className="spectator__jockey-cover__back">
            ← Back
          </Link>
          <div className="spectator__jockey-cover__socials">
            {jockey.socials.map((s) => (
              <a key={s} href={`#${s}`} aria-label={s}>
                {s === "twitter" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 5.8c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.7 1A4.2 4.2 0 0 0 12 9c0 .3 0 .7.1 1A12 12 0 0 1 3 4.7a4.2 4.2 0 0 0 1.3 5.6c-.7 0-1.3-.2-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1c-.6.2-1.3.2-2 .1a4.2 4.2 0 0 0 4 2.9 8.4 8.4 0 0 1-5.2 1.8H2A11.8 11.8 0 0 0 8.3 20c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2-2.1Z" />
                  </svg>
                )}
                {s === "instagram" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                )}
                {s === "globe" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* PROFILE HEAD + TABS */}
        <div className="shell">
          <div className="spectator__jockey-head">
            <div className="spectator__jockey-avatar">
              <img src={jockey.avatar} alt={jockey.name} />
            </div>
            <div className="spectator__jockey-head__name">
              <span className="spectator__pill spectator__pill--gold">{jockey.classLabel}</span>
              <h1>{jockey.name}</h1>
              <p>{jockey.tierLabel}</p>
            </div>
          </div>

          <div className="spectator__jockey-tabs">
            <div className="spectator__tabs">
              {PROFILE_TABS.map((t) => (
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
          </div>
        </div>

        {/* TAB CONTENT */}
        <section className="spectator__section" style={{ paddingTop: "clamp(40px, 5vw, 56px)" }}>
          <div className="shell">
            {activeTab === "overview" ? <OverviewView jockey={jockey} /> : null}
            {activeTab === "performance" ? <PerformanceView /> : null}
            {activeTab === "gallery" ? <GalleryView jockey={jockey} /> : null}
          </div>
        </section>
      </div>
    </SpectatorLayout>
  );
}

function OverviewView({ jockey }) {
  return (
    <div className="spectator__jockey-overview">
      {/* LEFT: stats + recent performance */}
      <div style={{ display: "grid", gap: 28 }}>
        <div className="spectator__jockey-stats-grid">
          <Stat label="Total Wins" value={jockey.totalWins} />
          <Stat label="Win Rate" value={jockey.winRate} />
          <Stat label="Years Active" value={jockey.yearsActive} />
          <Stat label="Stamina" value={jockey.stamina} />
        </div>

        <div className="spectator__jockey-recent">
          <h2>Recent Performance</h2>
          <div className="spectator__jockey-recent__list">
            {jockey.performance.map((p) => (
              <div className="spectator__jockey-recent__row" key={p.race}>
                <span className={`spectator__position spectator__position--${POSITION_TONE[p.position]}`}>
                  {p.position}
                </span>
                <div className="spectator__jockey-recent__row__name">
                  <strong>{p.race}</strong>
                  <span>{p.horse} · {p.track} track</span>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    color: "#002a15",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                  }}
                >
                  {p.earnings}
                </div>
                <button
                  type="button"
                  aria-label="More"
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#747b75",
                    padding: 4,
                    cursor: "pointer",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="13" cy="8" r="1.5" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: career highlights */}
      <div className="spectator__jockey-highlights">
        <h2>Career Highlights</h2>
        <p>{jockey.bio}</p>
        <div style={{ display: "grid", gap: 16 }}>
          {jockey.gallery.map((g) => (
            <article key={g.title} className="spectator__highlight-card">
              <img src={g.image} alt={g.title} />
              <div className="spectator__highlight-card__gradient" />
              <div className="spectator__highlight-card__caption">
                <span className="label">{g.label}</span>
                <strong>{g.title}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerformanceView() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {PERFORMANCE_SEASONS.map((s) => (
        <div
          key={s.year}
          style={{
            background: "#fff",
            border: "1px solid rgba(215,211,199,0.5)",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <strong
              style={{
                color: "#002a15",
                fontSize: "1.4rem",
                fontFamily: '"EB Garamond", Georgia, serif',
                fontWeight: 500,
              }}
            >
              Season {s.year}
            </strong>
            <span style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
              {s.wins} / {s.starts} · {s.rate}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "#f0ede4",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(s.rate / 30) * 100}%`,
                height: "100%",
                background: "#002a15",
                borderRadius: 999,
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            <Cell label="Starts" value={s.starts} />
            <Cell label="Wins" value={s.wins} />
            <Cell label="Earnings" value={`$${(s.earned / 1000).toFixed(0)}K`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryView({ jockey }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 18,
      }}
    >
      {jockey.gallery.map((g) => (
        <article
          key={g.title}
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "4/3",
            background: "#e4e1d7",
            borderRadius: 12,
          }}
        >
          <img
            src={g.image}
            alt={g.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </article>
      ))}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="spectator__jockey-stat">
      <p className="spectator__jockey-stat__label">{label}</p>
      <strong className="spectator__jockey-stat__value">{value}</strong>
    </div>
  );
}

function Cell({ label, value }) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          color: "#747b75",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, color: "#002a15", fontSize: "1.1rem", fontWeight: 700 }}>
        {value}
      </p>
    </div>
  );
}
