import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  Button,
  Pill,
  BetSlipCard,
  ArrowRight,
} from "../components/spectator/SpectatorUI.jsx";
import { HORSE_REGISTRY } from "../data/spectatorData.js";

export default function HorseDetail() {
  const { horseId } = useParams();
  const horse = HORSE_REGISTRY.find((h) => h.id === horseId) || HORSE_REGISTRY[0];
  const [toast, setToast] = useState(null);

  const handlePlaceBet = () => {
    setToast({ title: "Bet Placed", message: `Your wager on ${horse.name} has been confirmed.` });
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <SpectatorLayout>
      {/* HERO IMAGE */}
      <section
        className="relative"
        style={{ background: "#0c0a08" }}
      >
        <div
          className="relative overflow-hidden"
          style={{ height: "clamp(360px, 50vh, 480px)" }}
        >
          <img
            src={horse.image}
            alt={horse.name}
            className="block w-full h-full"
            style={{ objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,42,21,0.18) 0%, rgba(0,42,21,0.78) 100%)",
            }}
          />
          <div
            className="absolute"
            style={{ left: "clamp(20px, 5vw, 64px)", top: 100 }}
          >
            <Link
              to="/spectator/horses"
              className="no-underline inline-flex items-center"
              style={{
                color: "#ffdea5",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                gap: 6,
              }}
            >
              ← Back to Registry
            </Link>
          </div>
          <div
            className="absolute"
            style={{ left: "clamp(20px, 5vw, 64px)", bottom: 24 }}
          >
            <Pill tone="dark">{horse.performance.toUpperCase()} THOROUGHBRED</Pill>
          </div>
        </div>
      </section>

      {/* BODY — 2 col */}
      <section style={{ paddingBlock: "clamp(40px, 6vw, 64px) clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1.2fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* LEFT: name, meta, bio, 3 stats */}
            <div>
              <h1
                className="m-0"
                style={{
                  color: "#002a15",
                  fontSize: "clamp(2.6rem, 5vw, 4rem)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                {horse.name}
              </h1>
              <p
                className="m-0"
                style={{
                  marginTop: 12,
                  color: "#555e58",
                  fontSize: "1rem",
                }}
              >
                {horse.meta}
              </p>
              <p
                className="m-0"
                style={{
                  marginTop: 24,
                  color: "#1f231f",
                  fontSize: "1.02rem",
                  lineHeight: 1.7,
                  maxWidth: 560,
                }}
              >
                {horse.bio}
              </p>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 16,
                  marginTop: 36,
                }}
              >
                <StatBlock label="Total Races" value={horse.races} />
                <StatBlock label="Win Rate" value={horse.winRate} />
                <StatBlock label="Podium Rate" value={horse.podiumRate} />
              </div>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginTop: 32,
                }}
              >
                <Button variant="outline" size="md" onClick={handlePlaceBet}>
                  View Race History
                  <ArrowRight />
                </Button>
                <Button variant="solid" size="md" onClick={handlePlaceBet}>
                  Follow {horse.name}
                </Button>
              </div>
            </div>

            {/* RIGHT: sticky Place a Bet */}
            <aside>
              <BetSlipCard
                selectionLabel={horse.name}
                odds={horse.odds}
                onSubmit={handlePlaceBet}
                defaultStake={50}
                confirmLabel="Place Bet — Step Forward"
                extraRows={
                  <p
                    className="m-0"
                    style={{
                      color: "#555e58",
                      fontSize: "0.82rem",
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ color: "#002a15", fontWeight: 700 }}>{horse.name}</span>{" "}
                    is eligible for the upcoming{" "}
                    <span style={{ color: "#002a15", fontWeight: 700 }}>Derby Invitational</span>.
                  </p>
                }
              />
            </aside>
          </div>
        </div>
      </section>

      {/* TOAST */}
      {toast && (
        <div
          className="fixed flex items-center"
          style={{
            bottom: 24, right: 24, gap: 12,
            padding: "14px 20px", background: "#002a15", color: "#ffdea5",
            borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            zIndex: 50, maxWidth: 360,
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

function StatBlock({ label, value }) {
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
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
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
