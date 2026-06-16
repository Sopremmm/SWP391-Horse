import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  Pill,
  Tabs,
  PageHead,
  Avatar,
  ArrowRight,
} from "../components/spectator/SpectatorUI.jsx";
import { LEO_VANE } from "../data/spectatorData.js";

const PROFILE_TABS = [
  { value: "overview", label: "Overview" },
  { value: "performance", label: "Performance" },
  { value: "gallery", label: "Gallery" },
];

export default function JockeyProfile() {
  const { jockeyId } = useParams();
  const jockey = LEO_VANE; // demo: single locked profile
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SpectatorLayout>
      {/* COVER + HEADER */}
      <section
        className="relative"
        style={{ background: "#0c0a08" }}
      >
        <div
          className="relative overflow-hidden"
          style={{ height: "clamp(300px, 36vh, 380px)" }}
        >
          <img
            src={jockey.coverImage}
            alt="cover"
            className="block w-full h-full"
            style={{ objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,42,21,0.55) 100%)",
            }}
          />
          <Link
            to="/spectator/jockeys"
            className="absolute no-underline"
            style={{
              top: 100,
              left: "clamp(20px, 5vw, 64px)",
              color: "#ffdea5",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back
          </Link>

          {/* SOCIAL ICONS top right */}
          <div
            className="absolute flex items-center"
            style={{ top: 100, right: "clamp(20px, 5vw, 64px)", gap: 8 }}
          >
            {jockey.socials.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="no-underline inline-grid place-items-center"
                style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                }}
                aria-label={s}
              >
                {s === "twitter" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.8c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.7 1A4.2 4.2 0 0 0 12 9c0 .3 0 .7.1 1A12 12 0 0 1 3 4.7a4.2 4.2 0 0 0 1.3 5.6c-.7 0-1.3-.2-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1c-.6.2-1.3.2-2 .1a4.2 4.2 0 0 0 4 2.9 8.4 8.4 0 0 1-5.2 1.8H2A11.8 11.8 0 0 0 8.3 20c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2-2.1Z"/></svg>
                )}
                {s === "instagram" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                )}
                {s === "globe" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* PROFILE HEAD — avatar + name + pill + bio + tabs */}
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "128px 1fr",
              gap: 24,
              alignItems: "end",
              marginTop: -64,
            }}
          >
            <Avatar src={jockey.avatar} alt={jockey.name} size={128} />
            <div style={{ paddingBottom: 16 }}>
              <Pill tone="gold">{jockey.classLabel}</Pill>
              <h1
                className="m-0"
                style={{
                  marginTop: 12,
                  color: "#002a15",
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                {jockey.name}
              </h1>
              <p
                className="m-0"
                style={{
                  marginTop: 6,
                  color: "#747b75",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {jockey.tierLabel}
              </p>
            </div>
          </div>

          {/* TABS */}
          <div
            className="flex items-center"
            style={{
              marginTop: 24,
              borderBottom: "1px solid #d7d3c7",
            }}
          >
            <Tabs
              tabs={PROFILE_TABS}
              active={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>
      </section>

      {/* TAB CONTENT */}
      <section style={{ paddingBlock: "clamp(40px, 5vw, 56px) clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {activeTab === "overview" ? (
            <div
              className="grid"
              style={{ gridTemplateColumns: "1.5fr 1fr", gap: 40, alignItems: "start" }}
            >
              {/* LEFT: 2x2 stats + recent performance */}
              <div className="grid" style={{ gap: 28 }}>
                <div
                  className="grid"
                  style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}
                >
                  <Stat label="Total Wins" value={jockey.totalWins} />
                  <Stat label="Win Rate" value={jockey.winRate} />
                  <Stat label="Years Active" value={jockey.yearsActive} />
                  <Stat label="Stamina" value={jockey.stamina} />
                </div>

                <div>
                  <h2
                    className="m-0"
                    style={{
                      color: "#002a15",
                      fontSize: "1.4rem",
                      fontWeight: 500,
                      fontFamily: '"EB Garamond", Georgia, serif',
                      marginBottom: 14,
                    }}
                  >
                    Recent Performance
                  </h2>
                  <div
                    className="bg-white"
                    style={{
                      border: "1px solid rgba(215,211,199,0.5)",
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    {jockey.performance.map((p, i) => (
                      <div
                        key={p.race}
                        className="flex items-center"
                        style={{
                          gap: 16,
                          padding: "16px 20px",
                          borderBottom:
                            i === jockey.performance.length - 1
                              ? "none"
                              : "1px solid rgba(215,211,199,0.4)",
                        }}
                      >
                        <PositionBadge pos={p.position} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            className="m-0"
                            style={{
                              color: "#002a15",
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              fontFamily: '"EB Garamond", Georgia, serif',
                            }}
                          >
                            {p.race}
                          </p>
                          <p
                            className="m-0"
                            style={{
                              color: "#747b75",
                              fontSize: "0.78rem",
                              marginTop: 2,
                            }}
                          >
                            {p.horse} · {p.track} track
                          </p>
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
                          className="cursor-pointer bg-transparent border-0"
                          style={{ color: "#747b75", padding: 4 }}
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
              <div>
                <h2
                  className="m-0"
                  style={{
                    color: "#002a15",
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    fontFamily: '"EB Garamond", Georgia, serif',
                    marginBottom: 14,
                  }}
                >
                  Career Highlights
                </h2>
                <p
                  className="m-0"
                  style={{
                    color: "#555e58",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  {jockey.bio}
                </p>

                <div className="grid" style={{ gap: 16 }}>
                  {jockey.gallery.map((g) => (
                    <article
                      key={g.title}
                      className="relative overflow-hidden"
                      style={{
                        borderRadius: 12,
                        aspectRatio: "16/9",
                        background: "#e4e1d7",
                      }}
                    >
                      <img
                        src={g.image}
                        alt={g.title}
                        className="block w-full h-full"
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,42,21,0.0) 40%, rgba(0,42,21,0.85) 100%)",
                        }}
                      />
                      <div
                        className="absolute"
                        style={{ left: 16, bottom: 16, right: 16 }}
                      >
                        <p
                          className="m-0"
                          style={{
                            color: "#ffbd6b",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          {g.label}
                        </p>
                        <p
                          className="m-0"
                          style={{
                            color: "#fff",
                            fontSize: "1.05rem",
                            fontWeight: 500,
                            fontFamily: '"EB Garamond", Georgia, serif',
                          }}
                        >
                          {g.title}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "performance" ? (
            <PerformanceView />
          ) : null}

          {activeTab === "gallery" ? (
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              {jockey.gallery.map((g) => (
                <article
                  key={g.title}
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: 12,
                    aspectRatio: "4/3",
                    background: "#e4e1d7",
                  }}
                >
                  <img
                    src={g.image}
                    alt={g.title}
                    className="block w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </SpectatorLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(215,211,199,0.5)",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <p
        className="m-0"
        style={{
          color: "#747b75",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </p>
      <strong
        style={{
          display: "block",
          color: "#002a15",
          fontSize: "clamp(1.7rem, 3vw, 2.2rem)",
          fontWeight: 500,
          lineHeight: 1,
          fontFamily: '"EB Garamond", Georgia, serif',
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function PositionBadge({ pos }) {
  const colors = {
    "1st": { bg: "#ffdea5", color: "#002a15" },
    "2nd": { bg: "#cbd5e1", color: "#002a15" },
    "3rd": { bg: "#d6a373", color: "#fff" },
    "4th": { bg: "#e7e5e4", color: "#555e58" },
  };
  const c = colors[pos] || colors["4th"];
  return (
    <span
      className="inline-grid place-items-center"
      style={{
        width: 36, height: 36, borderRadius: 999,
        background: c.bg, color: c.color,
        fontSize: "0.82rem", fontWeight: 800,
        flex: "0 0 auto",
      }}
    >
      {pos}
    </span>
  );
}

function PerformanceView() {
  const seasons = [
    { year: "2024", wins: 22, starts: 78, rate: 28, earned: 410000 },
    { year: "2023", wins: 24, starts: 92, rate: 26, earned: 380000 },
    { year: "2022", wins: 21, starts: 86, rate: 24, earned: 350000 },
    { year: "2021", wins: 17, starts: 74, rate: 23, earned: 290000 },
  ];
  return (
    <div className="grid" style={{ gap: 16 }}>
      {seasons.map((s) => (
        <div
          key={s.year}
          className="bg-white"
          style={{
            border: "1px solid rgba(215,211,199,0.5)",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
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
            <span
              style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}
            >
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
            className="grid"
            style={{
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

function Cell({ label, value }) {
  return (
    <div>
      <p
        className="m-0"
        style={{
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
      <p
        className="m-0"
        style={{ color: "#002a15", fontSize: "1.1rem", fontWeight: 700 }}
      >
        {value}
      </p>
    </div>
  );
}
