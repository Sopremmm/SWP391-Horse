import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../AppContext.jsx';
import { fmtDate, fmtCurrency } from '../../format.js';
import { getOddsForHorse } from '../../data.js';
import './SpectatorUI.css';

const HorseEmoji = () => <span aria-hidden="true">🐎</span>;

function BetModal({ race, onClose, onPlaced, onBetSuccess }) {
  const { placeBet, user } = useApp();
  const approved = (race.registrations || []).filter((r) => r.status === 'Approved');
  const [selectedHorse, setSelectedHorse] = useState(approved[0]?.horseName || null);
  const [amount, setAmount] = useState(100);
  const [confirmed, setConfirmed] = useState(false);
  const [closing, setClosing] = useState(false);

  const selectedReg = approved.find((r) => r.horseName === selectedHorse);
  const odds = selectedHorse ? getOddsForHorse(selectedHorse) : 0;
  const numericAmount = Number(amount) || 0;
  const payout = Math.round(numericAmount * odds * 100) / 100;
  const canPlace = selectedHorse && numericAmount > 0;

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 350);
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (!canPlace) return;
    const bet = placeBet({
      raceId: race.id,
      horseName: selectedHorse,
      jockeyName: selectedReg?.jockeyName,
      amount: numericAmount,
    });
    setConfirmed(true);
    onPlaced?.();
    onBetSuccess?.({ ...bet, horseName: selectedHorse, odds });
  }, [canPlace, placeBet, race.id, selectedHorse, selectedReg, numericAmount, onPlaced, onBetSuccess, odds]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="spect-bet-modal-backdrop"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label="Place a Bet"
        style={{ opacity: closing ? 0 : 1, transition: 'opacity 0.3s ease' }}
      />

      {/* Panel */}
      <div
        className="spect-bet-modal-panel"
        style={{ opacity: closing ? 0 : 1, transform: closing ? 'translateY(20px) scale(0.97)' : 'none', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: '#002a15',
                fontFamily: '"EB Garamond", Georgia, serif',
                fontSize: '1.5rem',
                fontWeight: 500,
              }}
            >
              {confirmed ? '🎉 Bet Confirmed!' : `Place a Bet`}
            </h2>
            {!confirmed && (
              <p style={{ margin: '4px 0 0', color: '#747b75', fontSize: '0.82rem' }}>
                {race.name} · {race.venue}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: '#f0ede4',
              border: '0',
              borderRadius: 999,
              width: 36,
              height: 36,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#747b75',
              transition: 'all 0.2s ease',
            }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {confirmed ? (
          /* Success State */
          <div
            className="spect-bet-success"
            style={{ textAlign: 'center', paddingTop: 16 }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(0,66,37,0.1)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px',
                border: '2px solid rgba(0,66,37,0.2)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#002a15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p
              style={{
                margin: '0 0 4px',
                color: '#747b75',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              You bet
            </p>
            <p
              style={{
                margin: '0 0 4px',
                color: '#002a15',
                fontSize: '2.2rem',
                fontWeight: 500,
                fontFamily: '"EB Garamond", Georgia, serif',
                lineHeight: 1.1,
              }}
            >
              ${numericAmount.toLocaleString()}
            </p>
            <p
              style={{
                margin: '0 0 20px',
                color: '#555e58',
                fontSize: '0.95rem',
              }}
            >
              on{' '}
              <strong style={{ color: '#002a15' }}>{selectedHorse}</strong>
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                background: '#f7f6f1',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', color: '#747b75', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Odds</p>
                <p style={{ margin: 0, color: '#002a15', fontSize: '1.1rem', fontWeight: 700 }}>{odds.toFixed(2)}x</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', color: '#747b75', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Potential Win</p>
                <p style={{ margin: 0, color: '#b8860b', fontSize: '1.1rem', fontWeight: 800 }}>${payout.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="spectator__btn spectator__btn--primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done — Good Luck!
            </button>
          </div>
        ) : (
          <>
            {/* Race Info */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(0,42,21,0.04)',
                border: '1px solid rgba(215,211,199,0.5)',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ margin: 0, color: '#002a15', fontSize: '0.95rem', fontWeight: 700 }}>{race.name}</p>
                  <p style={{ margin: '2px 0 0', color: '#747b75', fontSize: '0.78rem' }}>
                    {race.venue} · {fmtDate(race.date)} · {race.time}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, color: '#002a15', fontSize: '0.95rem', fontWeight: 800 }}>{fmtCurrency(race.prizePool)}</p>
                  <p style={{ margin: '2px 0 0', color: '#747b75', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prize Pool</p>
                </div>
              </div>
            </div>

            {/* Horse Selection */}
            <p style={{ margin: '0 0 12px', color: '#555e58', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Select a horse
            </p>

            {approved.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#747b75', fontSize: '0.88rem', padding: '24px 0' }}>
                No approved participants yet.
              </p>
            ) : (
              <div
                style={{
                  maxHeight: 280,
                  overflowY: 'auto',
                  marginBottom: 20,
                  borderRadius: 10,
                  border: '1px solid rgba(215,211,199,0.4)',
                }}
              >
                {approved.map((reg) => {
                  const horseOdds = getOddsForHorse(reg.horseName);
                  const isSelected = selectedHorse === reg.horseName;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => setSelectedHorse(reg.horseName)}
                      className={`spect-bet-horse-card ${isSelected ? 'spect-bet-horse-selected' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        padding: '14px 16px',
                        border: '0',
                        borderBottom: '1px solid rgba(215,211,199,0.4)',
                        background: isSelected ? 'rgba(0,42,21,0.06)' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        color: 'inherit',
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: '#f0ede4',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '1.3rem',
                          flexShrink: 0,
                          border: isSelected ? '2px solid #002a15' : '2px solid transparent',
                          transition: 'border-color 0.2s ease',
                        }}
                      >
                        🐎
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, color: '#002a15', fontSize: '0.92rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {reg.horseName}
                        </p>
                        <p style={{ margin: '2px 0 0', color: '#747b75', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {reg.jockeyName} · {reg.horseColor}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            color: isSelected ? '#b8860b' : '#002a15',
                            fontSize: '1rem',
                            fontWeight: 800,
                            transition: 'color 0.2s ease',
                          }}
                        >
                          {horseOdds.toFixed(2)}x
                        </p>
                        {isSelected && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 4,
                              marginTop: 2,
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L4.5 8.5 2 6" stroke="#002a15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span style={{ color: '#747b75', fontSize: '0.7rem', fontWeight: 800 }}>Selected</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Amount */}
            <p style={{ margin: '0 0 12px', color: '#555e58', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Bet amount
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flex: 1,
                  minWidth: 160,
                  padding: '12px 16px',
                  background: '#f7f6f1',
                  borderRadius: 8,
                  border: '1px solid rgba(215,211,199,0.5)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <span style={{ color: '#747b75', fontSize: '1rem', fontWeight: 700 }}>$</span>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    flex: 1,
                    border: '0',
                    outline: '0',
                    background: 'transparent',
                    color: '#002a15',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    minWidth: 0,
                  }}
                />
              </div>
              {[25, 50, 100, 250].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className="spect-amount-preset"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(215,211,199,0.5)',
                    background: amount === preset ? 'rgba(0,42,21,0.08)' : '#fff',
                    color: amount === preset ? '#002a15' : '#747b75',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ${preset}
                </button>
              ))}
            </div>

            {/* Payout Display */}
            {selectedHorse && numericAmount > 0 && (
              <div
                className="spect-payout-display"
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(255,222,165,0.25), rgba(255,189,107,0.15))',
                  border: '1px solid rgba(184,134,11,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}
              >
                <div>
                  <p style={{ margin: 0, color: '#555e58', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Potential Payout
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#747b75', fontSize: '0.75rem' }}>
                    {odds.toFixed(2)}x odds on {selectedHorse}
                  </p>
                </div>
                <strong
                  style={{
                    color: '#b8860b',
                    fontSize: '1.6rem',
                    fontWeight: 500,
                    fontFamily: '"EB Garamond", Georgia, serif',
                    lineHeight: 1,
                  }}
                >
                  ${payout.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </strong>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: 8,
                  border: '1px solid rgba(215,211,199,0.5)',
                  background: '#fff',
                  color: '#747b75',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canPlace}
                style={{
                  flex: 2,
                  padding: '14px 20px',
                  borderRadius: 8,
                  border: '0',
                  background: canPlace ? '#002a15' : '#c8c3bb',
                  color: canPlace ? '#ffdea5' : '#9c9690',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: canPlace ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {canPlace ? `Confirm Bet — $${numericAmount.toLocaleString()}` : 'Select a Horse'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function SpectatorRaceCard({ race, onPlaceBet, onBetSuccess }) {
  const approvedCount = (race.registrations || []).filter((r) => r.status === 'Approved').length;
  const canBet = race.status === 'Upcoming' && approvedCount > 0;

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card transition-shadow hover:shadow-card-hover flex flex-col"
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-md"
            style={{
              background: 'var(--color-brand-light)',
              color: 'var(--color-brand-text)',
              border: '1px solid var(--color-brand-border)',
            }}
          >
            {race.grade}
          </span>
          {race.status === 'ONGOING' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 999,
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                fontSize: '0.66rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span className="spect-live-dot" />
              Live
            </span>
          )}
          <span
            style={{
              display: 'inline-flex',
              padding: '3px 10px',
              borderRadius: 999,
              background:
                race.status === 'Upcoming'
                  ? 'rgba(255,222,165,0.7)'
                  : race.status === 'Finished'
                  ? 'rgba(0,0,0,0.06)'
                  : 'rgba(0,66,37,0.08)',
              color:
                race.status === 'Upcoming'
                  ? '#7a5a00'
                  : race.status === 'Finished'
                  ? '#555e58'
                  : '#002a15',
              fontSize: '0.66rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {race.status}
          </span>
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
        <div
          className="text-lg font-black mb-3"
          style={{ color: 'var(--color-brand-text)' }}
        >
          {fmtCurrency(race.prizePool)}
        </div>
        <div className="mt-auto">
          <button
            type="button"
            onClick={() => onPlaceBet(race)}
            disabled={!canBet}
            style={{
              width: '100%',
              padding: '10px 20px',
              borderRadius: 8,
              border: '0',
              background: canBet ? 'var(--color-brand)' : '#e5e7eb',
              color: canBet ? '#fff' : '#9ca3af',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: canBet ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {race.status === 'ONGOING' ? (
              <>
                <span className="spect-live-dot" />
                Watch Live
              </>
            ) : canBet ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                Place Bet
              </>
            ) : race.status === 'Finished' ? (
              'Race Finished'
            ) : (
              'No Runners'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export { BetModal };
