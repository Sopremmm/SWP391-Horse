import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { DERBY_INVITATIONAL, FEATURED_RACES } from "../data/spectatorData.js";

function ArrowRight({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

const FIELD_TABS = [
  { value: "a", label: "Field · A" },
  { value: "b", label: "Field · B" },
];

export default function TournamentDetail() {
  const { raceId } = useParams();
  const tournament =
    raceId === "derby-invitational"
      ? DERBY_INVITATIONAL
      : FEATURED_RACES.find((r) => r.id === raceId) || DERBY_INVITATIONAL;

  const [activeField, setActiveField] = useState("a");
  const [selectedEntry, setSelectedEntry] = useState(tournament.entries[0].id);
  const [stake, setStake] = useState(50);
  const [toast, setToast] = useState(null);

  const half = Math.ceil(tournament.entries.length / 2) || 1;
  const tabA = tournament.entries.slice(0, half);
  const tabB = tournament.entries.slice(half);
  const currentList = activeField === "a" ? tabA : tabB;
  const selected = tournament.entries.find((e) => e.id === selectedEntry) || tournament.entries[0];
  const payout = Math.round(stake * selected.odds * 100) / 100;

  const handlePlaceBet = () => {
    setToast({
      title: "Bet Placed",
      message: `Your wager on ${selected.name} has been confirmed.`,
    });
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* PAGE HEAD */}
        <div className="shell">
          <header className="spectator__page-head">
            <div className="spectator__breadcrumb">
              <Link to="/spectator/home">Home</Link>
              <span className="spectator__breadcrumb__sep">/</span>
              <Link to="/spectator/tournaments">Tournaments</Link>
              <span className="spectator__breadcrumb__sep">/</span>
              <span className="spectator__breadcrumb__current">{tournament.name}</span>
            </div>
            <span className="spectator__page-eyebrow">
              {tournament.classLine} · {tournament.distance} · {tournament.surface}
            </span>
            <h1>{tournament.name}</h1>
            <p>{tournament.description}</p>
          </header>
        </div>

        {/* DETAIL BODY */}
        <section className="spectator__section" style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="spectator__detail">
              {/* LEFT: hero + stats + buttons */}
              <div>
                <div className="spectator__hero-image--detail">
                  <img src={tournament.heroImage} alt={tournament.name} />
                  <span className="spectator__pill spectator__pill--dark">{tournament.badge}</span>
                </div>

                <div className="spectator__stat-grid">
                  <StatBlock
                    label="Total Prize Pool"
                    value={tournament.prizePool}
                    note="Across all finishing positions"
                  />
                  <StatBlock
                    label="Race Date"
                    value={tournament.raceDate}
                    note={`Post time ${tournament.time}`}
                  />
                  <StatBlock
                    label="Total Runners"
                    value={`${tournament.runners} horses`}
                    note="Elite three-year-olds"
                  />
                  <StatBlock
                    label="Track Type"
                    value={tournament.surface}
                    note={`Distance ${tournament.distance}`}
                  />
                </div>

                <div className="spectator__button-row">
                  <button
                    type="button"
                    className="spectator__btn spectator__btn--primary"
                    onClick={handlePlaceBet}
                  >
                    Register Horse
                  </button>
                  <button
                    type="button"
                    className="spectator__btn spectator__btn--secondary"
                    onClick={handlePlaceBet}
                  >
                    View Race Details
                    <span style={{ marginLeft: 10 }}><ArrowRight /></span>
                  </button>
                </div>
              </div>

              {/* RIGHT: confirmed entries + bet slip */}
              <div style={{ display: "grid", gap: 24 }}>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "#002a15",
                      fontFamily: '"EB Garamond", Georgia, serif',
                      fontSize: "1.4rem",
                      fontWeight: 500,
                      marginBottom: 6,
                    }}
                  >
                    Confirmed Entries
                  </h2>
                  <p
                    style={{
                      margin: "0 0 16px",
                      color: "#747b75",
                      fontSize: "0.85rem",
                    }}
                  >
                    {tournament.entries.length} runners declared · {tournament.distance} {tournament.surface}
                  </p>

                  <div className="spectator__tabs" style={{ marginBottom: 16 }}>
                    {FIELD_TABS.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setActiveField(t.value)}
                        className={
                          activeField === t.value
                            ? "spectator__tab spectator__tab--active"
                            : "spectator__tab"
                        }
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="spectator__entries">
                    {currentList.map((entry) => {
                      const isSelected = selectedEntry === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setSelectedEntry(entry.id)}
                          className={
                            isSelected
                              ? "spectator__entry spectator__entry--selected"
                              : "spectator__entry"
                          }
                        >
                          <div className="spectator__avatar">
                            <img src={entry.avatar} alt={entry.jockey} />
                          </div>
                          <div className="spectator__entry__name">
                            <strong>{entry.name}</strong>
                            <span>{entry.jockey}</span>
                          </div>
                          <div className="spectator__entry__odds">
                            {entry.odds.toFixed(2)}x
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bet slip */}
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
                    <span className="spectator__betslip__odds">{selected.odds.toFixed(2)}x</span>
                    <span style={{ color: "#747b75", fontSize: "0.74rem", fontWeight: 700 }}>
                      Estimated Payout
                    </span>
                  </div>
                  <h3 className="spectator__betslip__heading">On {selected.name}</h3>
                  <p className="spectator__betslip__sub">
                    Set your stake and confirm your wager
                  </p>

                  <label className="spectator__betslip__field" htmlFor="bet-stake">
                    Stake Amount (USD)
                  </label>
                  <div className="spectator__betslip__input">
                    <span>$</span>
                    <input
                      id="bet-stake"
                      type="number"
                      min="1"
                      step="1"
                      value={stake}
                      onChange={(e) => setStake(Math.max(1, Number(e.target.value) || 0))}
                    />
                  </div>

                  <div className="spectator__betslip__payout-row">
                    <span className="label">Potential Payout</span>
                    <strong>
                      ${payout.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </strong>
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

function StatBlock({ label, value, note }) {
  return (
    <div className="spectator__stat-block">
      <p className="spectator__stat-block__label">{label}</p>
      <strong className="spectator__stat-block__value">{value}</strong>
      <p className="spectator__stat-block__note">{note}</p>
    </div>
  );
}
