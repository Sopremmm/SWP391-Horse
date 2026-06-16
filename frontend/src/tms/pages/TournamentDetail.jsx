import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  Button,
  Pill,
  Tabs,
  PageHead,
  Avatar,
  BetSlipCard,
  ArrowRight,
} from "../components/spectator/SpectatorUI.jsx";
import { DERBY_INVITATIONAL, FEATURED_RACES, HORSE_REGISTRY } from "../data/spectatorData.js";

export default function TournamentDetail() {
  const { raceId } = useParams();
  const tournament = raceId === "derby-invitational"
    ? DERBY_INVITATIONAL
    : FEATURED_RACES.find((r) => r.id === raceId) || DERBY_INVITATIONAL;

  const [activeTab, setActiveTab] = useState("qualifying-a");
  const [selectedEntry, setSelectedEntry] = useState(tournament.entries[0].id);
  const [toast, setToast] = useState(null);

  const half = Math.ceil(tournament.entries.length / 2) || 1;
  const tabA = tournament.entries.slice(0, half);
  const tabB = tournament.entries.slice(half);
  const currentList = activeTab === "qualifying-a" ? tabA : tabB;
  const selected = tournament.entries.find((e) => e.id === selectedEntry) || tournament.entries[0];

  const handlePlaceBet = () => {
    setToast({
      title: "Bet Placed",
      message: `Your wager on ${selected.name} has been confirmed.`,
    });
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <SpectatorLayout>
      {/* HERO + TITLE + STATS — split 1.2fr 1fr */}
      <section style={{ background: "#f7f6f1", paddingBlock: "clamp(24px, 4vw, 48px) 0" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <PageHead
            breadcrumb={[
              { label: "Home", to: "/spectator/home" },
              { label: "Tournaments", to: "/spectator/tournaments" },
              { label: tournament.name },
            ]}
            eyebrow={`${tournament.classLine} · ${tournament.distance} · ${tournament.surface}`}
            title={tournament.name}
            subtitle={tournament.description}
          />
        </div>
      </section>

      <section style={{ paddingBlock: "clamp(40px, 6vw, 64px) clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1.2fr 1fr",
              gap: 32,
              alignItems: "start",
            }}
          >
            {/* LEFT: hero image + 2x2 stats + 2 buttons */}
            <div>
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: 12,
                  height: 360,
                  background: "#e4e1d7",
                  marginBottom: 28,
                }}
              >
                <img
                  src={tournament.heroImage}
                  alt={tournament.name}
                  className="block w-full h-full"
                  style={{ objectFit: "cover" }}
                />
                <span
                  className="absolute"
                  style={{
                    top: 16,
                    left: 16,
                    padding: "6px 14px",
                    borderRadius: 4,
                    background: "rgba(0,42,21,0.92)",
                    color: "#ffdea5",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  {tournament.badge}
                </span>
              </div>

              {/* 2x2 STATS GRID */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <StatBlock
                  eyebrow="Total Prize Pool"
                  value={tournament.prizePool}
                  footnote="Across all finishing positions"
                />
                <StatBlock
                  eyebrow="Race Date"
                  value={tournament.raceDate}
                  footnote={`Post time ${tournament.time}`}
                />
                <StatBlock
                  eyebrow="Total Runners"
                  value={`${tournament.runners} horses`}
                  footnote="Elite three-year-olds"
                />
                <StatBlock
                  eyebrow="Track Type"
                  value={tournament.surface}
                  footnote={`Distance ${tournament.distance}`}
                />
              </div>

              {/* 2 BUTTONS */}
              <div className="flex" style={{ gap: 12, flexWrap: "wrap" }}>
                <Button
                  variant="solid"
                  size="md"
                  onClick={handlePlaceBet}
                >
                  Register Horse
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePlaceBet}
                >
                  View Race Details
                  <ArrowRight />
                </Button>
              </div>
            </div>

            {/* RIGHT: confirmed entries + Place a Bet sidebar */}
            <div className="grid" style={{ gap: 24 }}>
              <div>
                <h2
                  className="m-0"
                  style={{
                    color: "#002a15",
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    fontFamily: '"EB Garamond", Georgia, serif',
                    marginBottom: 6,
                  }}
                >
                  Confirmed Entries
                </h2>
                <p
                  className="m-0"
                  style={{
                    color: "#747b75",
                    fontSize: "0.85rem",
                    marginBottom: 16,
                  }}
                >
                  {tournament.entries.length} runners declared · {tournament.distance} {tournament.surface}
                </p>

                <div className="flex" style={{ marginBottom: 16 }}>
                  <Tabs
                    size="sm"
                    tabs={[
                      { value: "qualifying-a", label: "Field · A" },
                      { value: "qualifying-b", label: "Field · B" },
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                  />
                </div>

                <div
                  className="bg-white"
                  style={{
                    border: "1px solid rgba(215,211,199,0.5)",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {currentList.map((entry, i) => {
                    const isSelected = selectedEntry === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedEntry(entry.id)}
                        className="w-full flex items-center cursor-pointer border-0 text-left"
                        style={{
                          gap: 14,
                          padding: "16px 18px",
                          background: isSelected ? "rgba(255,222,165,0.35)" : "transparent",
                          borderBottom:
                            i === currentList.length - 1
                              ? "none"
                              : "1px solid rgba(215,211,199,0.4)",
                        }}
                      >
                        <Avatar src={entry.avatar} alt={entry.jockey} size={44} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong
                            style={{
                              display: "block",
                              color: "#002a15",
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              fontFamily: '"EB Garamond", Georgia, serif',
                            }}
                          >
                            {entry.name}
                          </strong>
                          <p
                            className="m-0"
                            style={{
                              color: "#747b75",
                              fontSize: "0.78rem",
                              marginTop: 2,
                            }}
                          >
                            {entry.jockey}
                          </p>
                        </div>
                        <div
                          style={{
                            padding: "6px 12px",
                            borderRadius: 999,
                            background: isSelected ? "#002a15" : "#f4f1e8",
                            color: isSelected ? "#ffdea5" : "#002a15",
                            fontSize: "0.78rem",
                            fontWeight: 800,
                          }}
                        >
                          {entry.odds.toFixed(2)}x
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Place a Bet sidebar */}
              <BetSlipCard
                selectionLabel={selected.name}
                odds={selected.odds}
                onSubmit={handlePlaceBet}
                confirmLabel="Place Bet — Step Forward"
                defaultStake={50}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TOAST */}
      {toast && (
        <div
          className="fixed flex items-center"
          style={{
            bottom: 24,
            right: 24,
            gap: 12,
            padding: "14px 20px",
            background: "#002a15",
            color: "#ffdea5",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            zIndex: 50,
            maxWidth: 360,
          }}
          role="status"
        >
          <span
            style={{
              width: 28, height: 28, borderRadius: 999,
              background: "#ffdea5", color: "#002a15",
              display: "grid", placeItems: "center",
              fontSize: "0.85rem", fontWeight: 800,
            }}
          >
            ✓
          </span>
          <div>
            <strong style={{ display: "block", color: "#fff", fontSize: "0.92rem", fontWeight: 600 }}>
              {toast.title}
            </strong>
            <p className="m-0" style={{ color: "rgba(255,255,255,0.78)", fontSize: "0.8rem" }}>
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </SpectatorLayout>
  );
}

function StatBlock({ eyebrow, value, footnote }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(215,211,199,0.5)",
        borderRadius: 8,
        padding: 20,
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
        {eyebrow}
      </p>
      <strong
        style={{
          display: "block",
          color: "#002a15",
          fontSize: "1.4rem",
          fontWeight: 500,
          lineHeight: 1.1,
          fontFamily: '"EB Garamond", Georgia, serif',
        }}
      >
        {value}
      </strong>
      <p
        className="m-0"
        style={{
          color: "#747b75",
          fontSize: "0.78rem",
          marginTop: 6,
        }}
      >
        {footnote}
      </p>
    </div>
  );
}
