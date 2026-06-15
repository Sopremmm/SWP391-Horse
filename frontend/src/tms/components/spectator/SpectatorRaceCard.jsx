import { useState } from "react";
import { useApp } from "../../AppContext.jsx";
import { fmtDate, fmtCurrency } from "../../format.js";
import { getOddsForHorse } from "../../data.js";
import StatusPill from "../common/StatusPill.jsx";
import Modal from "../common/Modal.jsx";

const HorseEmoji = () => <span aria-hidden="true">🐎</span>;

function BetModal({ race, onClose, onPlaced }) {
  const { placeBet, user } = useApp();
  const approved = (race.registrations || []).filter((r) => r.status === "Approved");
  const [selectedHorse, setSelectedHorse] = useState(approved[0]?.horseName || null);
  const [amount, setAmount] = useState(100);
  const [confirmed, setConfirmed] = useState(false);

  const selectedReg = approved.find((r) => r.horseName === selectedHorse);
  const odds = selectedHorse ? getOddsForHorse(selectedHorse) : 0;
  const numericAmount = Number(amount) || 0;
  const payout = Math.round(numericAmount * odds * 100) / 100;
  const canPlace = selectedHorse && numericAmount > 0;

  const handleConfirm = () => {
    if (!canPlace) return;
    placeBet({
      raceId: race.id,
      horseName: selectedHorse,
      jockeyName: selectedReg?.jockeyName,
      amount: numericAmount,
    });
    setConfirmed(true);
    onPlaced?.();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title={confirmed ? "Bet Placed" : `Place a Bet — ${race.name}`}
      onClose={handleClose}
    >
      {confirmed ? (
        <div className="text-center py-2">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "var(--color-brand-light)", border: "1px solid var(--color-brand-border)" }}
          >
            <i className="ti ti-circle-check text-2xl" style={{ color: "var(--color-brand-text)" }} />
          </div>
          <p className="text-sm text-slate-600 mb-1">You bet</p>
          <p className="text-2xl font-black text-slate-800 mb-1">
            {fmtCurrency(numericAmount)}
          </p>
          <p className="text-sm text-slate-600 mb-3">
            on <span className="font-semibold text-slate-800">{selectedHorse}</span>
          </p>
          <p className="text-xs text-slate-500">
            Potential payout: <span className="font-semibold" style={{ color: "var(--color-accent-gold)" }}>{fmtCurrency(payout)}</span> at odds {odds.toFixed(2)}x
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--color-brand)" }}
          >
            Done
          </button>
        </div>
      ) : (
        <>
          <div
            className="rounded-xl p-3 mb-4 border"
            style={{ background: "var(--color-surface-muted)", borderColor: "var(--color-border)" }}
          >
            <p className="text-sm font-bold text-slate-800">{race.name}</p>
            <p className="text-xs text-slate-500">
              {race.venue} · {fmtDate(race.date)} · {race.time}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span
                className="font-bold px-2 py-0.5 rounded-md"
                style={{
                  background: "var(--color-brand-light)",
                  color: "var(--color-brand-text)",
                  border: "1px solid var(--color-brand-border)",
                }}
              >
                {race.grade}
              </span>
              <span className="text-slate-500">Prize pool: {fmtCurrency(race.prizePool)}</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Select a horse
          </p>
          {approved.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No approved participants yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2 mb-4">
              {approved.map((reg) => {
                const horseOdds = getOddsForHorse(reg.horseName);
                const isSelected = selectedHorse === reg.horseName;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedHorse(reg.horseName)}
                    className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer font-sans"
                    style={{
                      background: isSelected ? "var(--color-brand-light)" : "var(--color-surface)",
                      borderColor: isSelected ? "var(--color-brand)" : "var(--color-border)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ background: "var(--color-surface-muted)" }}
                    >
                      <HorseEmoji />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{reg.horseName}</p>
                      <p className="text-xs text-slate-500">
                        {reg.jockeyName} · {reg.horseColor} · Age {reg.horseAge}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-black"
                        style={{ color: "var(--color-accent-gold)" }}
                      >
                        {horseOdds.toFixed(2)}x
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">odds</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Bet amount
          </p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-slate-500">$</span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 font-sans"
              style={{ borderColor: "var(--color-border-input)" }}
            />
            {[50, 100, 500, 1000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className="px-2.5 py-2 text-xs font-semibold rounded-lg border bg-transparent cursor-pointer font-sans"
                style={{
                  borderColor: "var(--color-border-input)",
                  color: "var(--color-text-muted)",
                }}
              >
                ${preset}
              </button>
            ))}
          </div>

          {selectedHorse && numericAmount > 0 && (
            <div
              className="rounded-xl p-3 mb-4 flex items-center justify-between"
              style={{
                background: "var(--color-accent-gold-light)",
                border: "1px solid var(--color-accent-gold-border)",
              }}
            >
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Potential payout
              </span>
              <span className="text-lg font-black" style={{ color: "var(--color-accent-gold)" }}>
                {fmtCurrency(payout)}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border bg-transparent cursor-pointer font-sans"
              style={{ borderColor: "var(--color-border-input)", color: "var(--color-text-muted)" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canPlace}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white border-none cursor-pointer font-sans transition-opacity"
              style={{
                background: "var(--color-brand)",
                opacity: canPlace ? 1 : 0.5,
              }}
            >
              <i className="ti ti-currency-dogecoin mr-1" />
              Confirm Bet
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default function SpectatorRaceCard({ race, onPlaceBet }) {
  const approvedCount = (race.registrations || []).filter((r) => r.status === "Approved").length;
  const canBet = race.status === "Upcoming" && approvedCount > 0;

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card transition-shadow hover:shadow-card-hover flex flex-col"
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-md"
            style={{
              background: "var(--color-brand-light)",
              color: "var(--color-brand-text)",
              border: "1px solid var(--color-brand-border)",
            }}
          >
            {race.grade}
          </span>
          <StatusPill status={race.status} />
          {approvedCount > 0 && (
            <span className="text-[11px] text-slate-400 ml-auto">
              {approvedCount} runners
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-slate-800 mb-1">{race.name}</h3>
        <p className="text-xs text-slate-400 mb-2">
          <i className="ti ti-map-pin mr-1" />
          {race.venue} · {fmtDate(race.date)} · {race.time}
        </p>
        <div className="text-lg font-black mb-3" style={{ color: "var(--color-brand-text)" }}>
          {fmtCurrency(race.prizePool)}
        </div>
        <div className="mt-auto">
          <button
            type="button"
            onClick={() => onPlaceBet(race)}
            disabled={!canBet}
            className="w-full py-2 rounded-xl text-sm font-semibold text-white border-none cursor-pointer font-sans transition-opacity"
            style={{
              background: "var(--color-brand)",
              opacity: canBet ? 1 : 0.5,
            }}
          >
            <i className="ti ti-currency-dogecoin mr-1.5" />
            {canBet ? "Place Bet" : race.status === "Finished" ? "Race Finished" : "No Runners"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { BetModal };
