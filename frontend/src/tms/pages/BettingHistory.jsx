import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  Tabs,
  StatusPill,
  PageHead,
  SearchBar,
} from "../components/spectator/SpectatorUI.jsx";
import { BETTING_HISTORY_SEED, SPECTATOR_STATS } from "../data/spectatorData.js";

const FILTER_TABS = [
  { value: "all", label: "All Bets" },
  { value: "pending", label: "Active" },
  { value: "win", label: "Settled" },
];

export default function BettingHistory() {
  const [activeTab, setActiveTab] = useState("all");
  const bets = BETTING_HISTORY_SEED;

  const filtered = useMemo(() => {
    if (activeTab === "all") return bets;
    if (activeTab === "pending") return bets.filter((b) => b.status === "Pending");
    if (activeTab === "win") return bets.filter((b) => b.status === "Win" || b.status === "Settled");
    return bets;
  }, [activeTab, bets]);

  return (
    <SpectatorLayout>
      {/* HEADER STRIP — search */}
      <section style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between flex-wrap"
          style={{ paddingBlock: 18, gap: 16 }}
        >
          <SearchBar placeholder="Search for races, horses, or jockeys..." />
        </div>
      </section>

      {/* PAGE HEAD */}
      <section>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <PageHead
            breadcrumb={[
              { label: "Home", to: "/spectator/home" },
              { label: "My Betting History" },
            ]}
            eyebrow="Your Active Wagers"
            title="My Betting History"
            subtitle="A complete record of every wager you have placed — from the moment you tap Place a Bet to the final payout."
          />
        </div>
      </section>

      {/* STATS — 4 cards */}
      <section style={{ paddingBlock: "8px 24px" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            <StatBlock label="Total Bets" value={SPECTATOR_STATS.totalBets} />
            <StatBlock label="Active Bets" value={SPECTATOR_STATS.activeBets} />
            <StatBlock label="Settled Bets" value={SPECTATOR_STATS.settledBets} />
            <StatBlock
              label="Lifetime Payouts"
              value={SPECTATOR_STATS.lifetimePayouts}
              accent
            />
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <section>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="flex items-center justify-between flex-wrap"
            style={{ marginBlock: "16px 24px", gap: 16 }}
          >
            <Tabs tabs={FILTER_TABS} active={activeTab} onChange={setActiveTab} />
            <Link
              to="/spectator/tournaments"
              className="uppercase inline-flex items-center no-underline"
              style={{
                padding: "10px 22px",
                background: "#002a15",
                color: "#fff",
                borderRadius: 2,
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                gap: 8,
              }}
            >
              Place a New Bet
            </Link>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section style={{ paddingBlock: "8px clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="bg-white overflow-hidden"
            style={{
              border: "1px solid rgba(215,211,199,0.5)",
              borderRadius: 12,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="hidden md:grid"
              style={{
                gridTemplateColumns: "1.5fr 1.4fr 0.8fr 0.8fr 1.2fr 1fr",
                background: "#f7f6f1",
                borderBottom: "1px solid #d7d3c7",
                padding: "16px 24px",
                gap: 16,
              }}
            >
              {["Race", "Horse", "Stake", "Odds", "Potential Payout", "Status"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#555e58",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {filtered.map((bet, i) => (
              <div
                key={bet.id}
                className="md:grid flex flex-col"
                style={{
                  gridTemplateColumns: "1.5fr 1.4fr 0.8fr 0.8fr 1.2fr 1fr",
                  padding: "20px 24px",
                  gap: 16,
                  alignItems: "center",
                  borderBottom:
                    i === filtered.length - 1 ? "none" : "1px solid #f0ede4",
                }}
              >
                {/* Race */}
                <div className="flex items-center" style={{ gap: 12 }}>
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: 8,
                      background: "#e4e1d7", overflow: "hidden", flex: "0 0 auto",
                    }}
                  >
                    <img
                      src={bet.raceImage}
                      alt=""
                      className="block w-full h-full"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <p
                      className="m-0"
                      style={{
                        color: "#002a15",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        fontFamily: '"EB Garamond", Georgia, serif',
                      }}
                    >
                      {bet.race}
                    </p>
                    <p
                      className="m-0"
                      style={{ color: "#747b75", fontSize: "0.74rem", marginTop: 2 }}
                    >
                      {new Date(bet.placedAt).toLocaleDateString("en-US", {
                        month: "short", day: "2-digit", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {/* Horse */}
                <p
                  className="m-0"
                  style={{ color: "#002a15", fontSize: "0.9rem", fontWeight: 600 }}
                >
                  {bet.horse}
                </p>
                {/* Stake */}
                <p
                  className="m-0"
                  style={{ color: "#002a15", fontSize: "0.92rem", fontWeight: 800 }}
                >
                  ${bet.stake}
                </p>
                {/* Odds */}
                <p
                  className="m-0"
                  style={{ color: "#1f231f", fontSize: "0.9rem", fontWeight: 700 }}
                >
                  {bet.odds.toFixed(2)}x
                </p>
                {/* Potential Payout */}
                <p
                  className="m-0"
                  style={{ color: "#002a15", fontSize: "1rem", fontWeight: 700 }}
                >
                  ${bet.payout.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                {/* Status */}
                <div>
                  <StatusPill status={bet.status} />
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div
            className="flex items-center justify-center"
            style={{ marginTop: 32, gap: 8 }}
          >
            {[1, 2, 3].map((n, i) => (
              <button
                key={n}
                type="button"
                className="cursor-pointer border-0"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: i === 0 ? "#002a15" : "transparent",
                  color: i === 0 ? "#ffdea5" : "#002a15",
                  boxShadow: i === 0 ? "none" : "inset 0 0 0 1px #d7d3c7",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>
    </SpectatorLayout>
  );
}

function StatBlock({ label, value, accent }) {
  return (
    <div
      style={{
        background: accent ? "#002a15" : "#fff",
        color: accent ? "#fff" : "#002a15",
        border: accent ? "none" : "1px solid rgba(215,211,199,0.5)",
        borderRadius: 12,
        padding: 24,
        boxShadow: accent
          ? "0 6px 18px rgba(0,0,0,0.08)"
          : "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <p
        className="m-0"
        style={{
          color: accent ? "#ffbd6b" : "#747b75",
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
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          fontWeight: 500,
          lineHeight: 1,
          fontFamily: '"EB Garamond", Georgia, serif',
          color: accent ? "#ffdea5" : "#002a15",
        }}
      >
        {value}
      </strong>
    </div>
  );
}
