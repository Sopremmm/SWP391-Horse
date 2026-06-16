import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { HORSE_REGISTRY } from "../data/spectatorData.js";

function ArrowRight({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

export default function HorseDetail() {
  const { horseId } = useParams();
  const horse = HORSE_REGISTRY.find((h) => h.id === horseId) || HORSE_REGISTRY[0];
  const [stake, setStake] = useState(50);
  const [toast, setToast] = useState(null);
  const payout = Math.round(stake * horse.odds * 100) / 100;

  const handlePlaceBet = () => {
    setToast({ title: "Bet Placed", message: `Your wager on ${horse.name} has been confirmed.` });
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* HERO */}
        <section className="spectator__horse-hero">
          <img src={horse.image} alt={horse.name} />
          <div className="spectator__horse-hero__gradient" />
          <Link to="/spectator/horses" className="spectator__horse-hero__back">
            ← Back to Registry
          </Link>
          <span className="spectator__pill spectator__pill--dark spectator__horse-hero__pill">
            {horse.performance.toUpperCase()} THOROUGHBRED
          </span>
        </section>

        {/* DETAIL */}
        <section className="spectator__section" style={{ paddingTop: "clamp(40px, 5vw, 56px)" }}>
          <div className="shell">
            <div className="spectator__horse-detail">
              {/* LEFT: name, meta, bio, stats, buttons */}
              <div>
                <div className="spectator__horse-detail__name">
                  <h1>{horse.name}</h1>
                  <p>{horse.meta}</p>
                </div>

                <p className="spectator__horse-detail__bio">{horse.bio}</p>

                <div className="spectator__horse-detail__stats">
                  <Stat label="Total Races" value={horse.races} />
                  <Stat label="Win Rate" value={horse.winRate} />
                  <Stat label="Podium Rate" value={horse.podiumRate} />
                </div>

                <div className="spectator__horse-detail__buttons">
                  <button
                    type="button"
                    className="spectator__btn spectator__btn--secondary"
                    onClick={handlePlaceBet}
                  >
                    View Race History
                    <span style={{ marginLeft: 10 }}><ArrowRight /></span>
                  </button>
                  <button
                    type="button"
                    className="spectator__btn spectator__btn--primary"
                    onClick={handlePlaceBet}
                  >
                    Follow {horse.name}
                  </button>
                </div>
              </div>

              {/* RIGHT: sticky bet slip */}
              <div className="spectator__betslip">
                <p className="spectator__betslip__label">Place a Bet</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span className="spectator__betslip__odds">{horse.odds.toFixed(2)}x</span>
                  <span style={{ color: "#747b75", fontSize: "0.74rem", fontWeight: 700 }}>
                    Estimated Payout
                  </span>
                </div>
                <h3 className="spectator__betslip__heading">On {horse.name}</h3>
                <p className="spectator__betslip__sub">
                  <span style={{ color: "#002a15", fontWeight: 700 }}>{horse.name}</span> is eligible
                  for the upcoming{" "}
                  <span style={{ color: "#002a15", fontWeight: 700 }}>Derby Invitational</span>.
                </p>

                <label className="spectator__betslip__field" htmlFor="horse-stake">
                  Stake Amount (USD)
                </label>
                <div className="spectator__betslip__input">
                  <span>$</span>
                  <input
                    id="horse-stake"
                    type="number"
                    min="1"
                    step="1"
                    value={stake}
                    onChange={(e) => setStake(Math.max(1, Number(e.target.value) || 0))}
                  />
                </div>

                <div className="spectator__betslip__payout-row">
                  <span className="label">Potential Payout</span>
                  <strong>${payout.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
                </div>

                <button
                  type="button"
                  className="spectator__btn spectator__btn--primary"
                  style={{ width: "100%" }}
                  onClick={handlePlaceBet}
                >
                  Place Bet — Step Forward
                  <span style={{ marginLeft: 10 }}><ArrowRight /></span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TOAST */}
        {toast && (
          <div className="spectator__toast" role="status">
            <div className="spectator__toast__icon">✓</div>
            <div>
              <strong>{toast.title}</strong>
              <p>{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </SpectatorLayout>
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
