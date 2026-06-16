import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  Button,
  Card,
  Pill,
  Tabs,
  SortPill,
  SearchBar,
  PageHead,
  ArrowRight,
} from "../components/spectator/SpectatorUI.jsx";
import { FEATURED_RACES } from "../data/spectatorData.js";

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "g1", label: "Grade 1" },
  { value: "group1", label: "Group 1" },
  { value: "group3", label: "Group 3" },
  { value: "upcoming", label: "Upcoming" },
];

export default function TournamentsList() {
  const [activeTab, setActiveTab] = useState("all");
  const races = FEATURED_RACES;

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
      {/* HEADER STRIP — search + filter row */}
      <section
        style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between flex-wrap"
          style={{ paddingBlock: 18, gap: 16 }}
        >
          <SearchBar />
        </div>
      </section>

      {/* BREADCRUMB + PAGE HEAD */}
      <section>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <PageHead
            breadcrumb={[
              { label: "Home", to: "/spectator/home" },
              { label: "Tournaments" },
            ]}
            eyebrow="Destined for Greatness"
            title="Available Races & Tournaments"
            subtitle="The world's most prestigious thoroughbred events — discover qualifiers, group stakes, and invitationals with a single click."
          />

          {/* FILTER BAR */}
          <div
            className="flex items-center justify-between flex-wrap"
            style={{ marginBlock: "8px 32px", gap: 16 }}
          >
            <Tabs tabs={FILTER_TABS} active={activeTab} onChange={setActiveTab} />
            <SortPill label="By Race Date" />
          </div>
        </div>
      </section>

      {/* GRID OF RACE CARDS */}
      <section style={{ paddingBlock: "0 clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 24,
            }}
          >
            {filtered.map((race) => (
              <article
                key={race.id}
                className="bg-white overflow-hidden flex flex-col"
                style={{
                  border: "1px solid rgba(215,211,199,0.5)",
                  borderRadius: 8,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="relative"
                  style={{ height: 220, background: "#e4e1d7" }}
                >
                  <img
                    src={race.image}
                    alt={race.name}
                    className="block w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    className="absolute"
                    style={{
                      top: 14,
                      left: 14,
                      padding: "6px 12px",
                      borderRadius: 4,
                      background: "rgba(0,42,21,0.92)",
                      color: "#ffdea5",
                      fontSize: "0.66rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {race.badge}
                  </span>
                </div>
                <div className="grid" style={{ padding: 24, gap: 16 }}>
                  <div>
                    <h3
                      className="m-0"
                      style={{
                        color: "#002a15",
                        fontSize: "1.6rem",
                        fontWeight: 500,
                        lineHeight: 1.15,
                        fontFamily: '"EB Garamond", Georgia, serif',
                      }}
                    >
                      {race.name}
                    </h3>
                    <p
                      className="m-0"
                      style={{
                        marginTop: 6,
                        color: "#5e655f",
                        fontSize: "0.85rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 14" fill="none" aria-hidden="true" style={{ color: "#747b75" }}>
                        <path d="M6 0a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="currentColor" />
                      </svg>
                      {race.location}
                    </p>
                  </div>

                  <div
                    className="grid"
                    style={{
                      gap: 10,
                      paddingTop: 12,
                      borderTop: "1px solid rgba(215,211,199,0.4)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          color: "#747b75",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Prize Pool
                      </span>
                      <strong
                        style={{
                          color: "#002a15",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          fontFamily: '"EB Garamond", Georgia, serif',
                        }}
                      >
                        {race.prizePool}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          color: "#747b75",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Distance
                      </span>
                      <strong
                        style={{
                          color: "#002a15",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                        }}
                      >
                        {race.distance}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          color: "#747b75",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Runners
                      </span>
                      <strong
                        style={{
                          color: "#002a15",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                        }}
                      >
                        {race.runners}
                      </strong>
                    </div>
                  </div>

                  <Link
                    to={`/spectator/tournaments/${race.id}`}
                    className="uppercase inline-flex items-center justify-center no-underline"
                    style={{
                      marginTop: 8,
                      padding: "12px 18px",
                      background: "#002a15",
                      color: "#fff",
                      borderRadius: 2,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      gap: 8,
                    }}
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
    </SpectatorLayout>
  );
}
