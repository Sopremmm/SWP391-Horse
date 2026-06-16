import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  Pill,
  SearchBar,
  PageHead,
  Tabs,
  ArrowRight,
} from "../components/spectator/SpectatorUI.jsx";
import { HORSE_REGISTRY, SPECTATOR_STATS } from "../data/spectatorData.js";

const FILTERS = [
  { value: "all", label: "All Breeds" },
  { value: "thoroughbred", label: "Thoroughbred" },
  { value: "arabian", label: "Arabian Cross" },
  { value: "elite", label: "Elite Tier" },
];

export default function HorseRegistry() {
  return (
    <SpectatorLayout>
      {/* HEADER STRIP — search */}
      <section
        style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between flex-wrap"
          style={{ paddingBlock: 18, gap: 16 }}
        >
          <SearchBar placeholder="Search for horses, races, or jockeys..." />
        </div>
      </section>

      {/* PAGE HEAD */}
      <section>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <PageHead
            breadcrumb={[
              { label: "Home", to: "/spectator/home" },
              { label: "Horse Registry" },
            ]}
            eyebrow="Explore Thoroughbreds"
            title="Horse Registry"
            subtitle="A complete index of every horse competing this season. Tap a profile to view lineage, recent form, and place a bet on the next race."
          />
        </div>
      </section>

      {/* STATS BENTO */}
      <section style={{ paddingBlock: "8px 32px" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1.4fr 1fr 1fr",
              gap: 18,
            }}
          >
            <BentoStat
              large
              eyebrow="Total Registered Horses"
              value={SPECTATOR_STATS.totalHorses}
              note="Across all disciplines and tiers — Thoroughbred, Arabian, Quarter Horse, and Standardbred."
            />
            <BentoStat
              eyebrow="Active Disciplines"
              value={SPECTATOR_STATS.activeDisciplines}
              note="Flat · Steeplechase · Sprint"
            />
            <BentoStat
              eyebrow="New This Season"
              value={SPECTATOR_STATS.newSeason}
              note="First-time registrations 2024"
            />
          </div>
        </div>
      </section>

      {/* FILTER ROW */}
      <section>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div className="flex items-center" style={{ marginBlock: "12px 28px" }}>
            <Tabs tabs={FILTERS} active="all" onChange={() => {}} />
          </div>
        </div>
      </section>

      {/* HORSE GRID */}
      <section style={{ paddingBlock: "8px clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 24,
            }}
          >
            {HORSE_REGISTRY.map((h) => (
              <article
                key={h.id}
                className="bg-white overflow-hidden flex flex-col"
                style={{
                  border: "1px solid rgba(215,211,199,0.5)",
                  borderRadius: 12,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="relative"
                  style={{ height: 240, background: "#e4e1d7" }}
                >
                  <img
                    src={h.image}
                    alt={h.name}
                    className="block w-full h-full"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    className="absolute"
                    style={{
                      top: 14,
                      left: 14,
                      padding: "5px 12px",
                      borderRadius: 4,
                      background: "#002a15",
                      color: "#ffdea5",
                      fontSize: "0.66rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h.performance}
                  </span>
                </div>
                <div className="grid" style={{ padding: 24, gap: 16 }}>
                  <div>
                    <h3
                      className="m-0"
                      style={{
                        color: "#002a15",
                        fontSize: "1.7rem",
                        fontWeight: 500,
                        lineHeight: 1.1,
                        fontFamily: '"EB Garamond", Georgia, serif',
                      }}
                    >
                      {h.name}
                    </h3>
                    <p
                      className="m-0"
                      style={{
                        marginTop: 6,
                        color: "#5e655f",
                        fontSize: "0.85rem",
                      }}
                    >
                      {h.meta}
                    </p>
                  </div>

                  <Link
                    to={`/spectator/horses/${h.id}`}
                    className="uppercase inline-flex items-center justify-center no-underline"
                    style={{
                      padding: "12px 18px",
                      background: "transparent",
                      color: "#002a15",
                      borderRadius: 2,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      gap: 8,
                      boxShadow: "inset 0 0 0 1px #002a15",
                    }}
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
    </SpectatorLayout>
  );
}

function BentoStat({ eyebrow, value, note, large }) {
  return (
    <div
      className="flex flex-col justify-between"
      style={{
        background: large ? "#002a15" : "#fff",
        color: large ? "#fff" : "#002a15",
        border: large ? "none" : "1px solid rgba(215,211,199,0.5)",
        borderRadius: 12,
        padding: large ? "clamp(28px, 3vw, 40px)" : 24,
        boxShadow: large ? "0 6px 18px rgba(0,0,0,0.08)" : "0 1px 2px rgba(0,0,0,0.04)",
        minHeight: large ? 200 : 160,
      }}
    >
      <div>
        <p
          className="m-0"
          style={{
            color: large ? "#ffbd6b" : "#747b75",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {eyebrow}
        </p>
        <strong
          style={{
            display: "block",
            fontSize: large ? "clamp(2.6rem, 4vw, 3.4rem)" : "clamp(2rem, 3vw, 2.6rem)",
            fontWeight: 500,
            lineHeight: 1,
            fontFamily: '"EB Garamond", Georgia, serif',
            color: large ? "#ffdea5" : "#002a15",
          }}
        >
          {value}
        </strong>
      </div>
      <p
        className="m-0"
        style={{
          color: large ? "rgba(255,255,255,0.75)" : "#555e58",
          fontSize: "0.85rem",
          lineHeight: 1.5,
          maxWidth: 420,
        }}
      >
        {note}
      </p>
    </div>
  );
}
