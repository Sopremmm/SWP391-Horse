import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import SpectatorLayout from '../components/spectator/SpectatorLayout.jsx';
import { LIVE_RACES, FEATURED_RACES } from '../data/spectatorData.js';
import { SpectatorToast, ParticleOverlay, LiveRaceTrack, useScrollReveal } from '../components/spectator/SpectatorEffects.jsx';

function ArrowRight({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#ffdea5" />
      <path d="M5 8l2.5 2.5L11 5" stroke="#002a15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LiveRaces() {
  useScrollReveal();
  const [liveRaces, setLiveRaces] = useState(LIVE_RACES);
  const [selectedRace, setSelectedRace] = useState(LIVE_RACES[0]?.id);
  const [toasts, setToasts] = useState([]);
  const intervalRef = useRef(null);

  const currentRace = liveRaces.find((r) => r.id === selectedRace) || liveRaces[0];

  const addToast = useCallback((toast) => {
    setToasts((prev) => [{ ...toast, id: `toast-${Date.now()}` }, ...prev].slice(0, 5));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Simulate live progress updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLiveRaces((prev) =>
        prev.map((race) => ({
          ...race,
          progress: Math.min(race.progress + (Math.random() * 0.8), 95),
          elapsedTime: (() => {
            const [m, s] = race.elapsedTime.split(':').map(Number);
            const totalSec = m * 60 + s + 1;
            return `${String(Math.floor(totalSec / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`;
          })(),
          participants: race.participants.map((p, i) => ({
            ...p,
            progress: Math.min(p.progress + (Math.random() * 1.2 - 0.2), 95),
          })),
        }))
      );
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const upcomingRaces = FEATURED_RACES.filter((r) => r.status === 'upcoming');

  return (
    <SpectatorLayout>
      <div className="spectator spect-page-enter">
        <SpectatorToast toasts={toasts} onDismiss={dismissToast} />

        {/* HERO BANNER */}
        <section
          style={{
            background: 'linear-gradient(135deg, #002a15 0%, #004225 60%, #006b35 100%)',
            padding: 'clamp(48px, 7vw, 80px) 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <ParticleOverlay count={25} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 70% 50%, rgba(255,189,107,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <div className="shell">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span className="spect-live-dot" />
              <span
                style={{
                  color: '#ffbd6b',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                }}
              >
                Live Racing
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                color: '#fff',
                fontFamily: '"EB Garamond", Georgia, serif',
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 500,
                lineHeight: 1.05,
                maxWidth: 600,
              }}
            >
              Watch the Race Unfold
            </h1>
            <p
              style={{
                margin: '14px 0 0',
                color: 'rgba(210,245,219,0.82)',
                fontSize: '1rem',
                lineHeight: 1.6,
                maxWidth: 560,
              }}
            >
              Follow every stride in real time. Live positions, commentary, and instant results — all on one screen.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Link to="/spectator/tournaments" className="spectator__btn spectator__btn--gold">
                Browse All Tournaments
                <span style={{ marginLeft: 8 }}><ArrowRight /></span>
              </Link>
              <Link to="/spectator/bets" className="spectator__btn spectator__btn--ghost">
                My Betting History
              </Link>
            </div>
          </div>
        </section>

        {/* LIVE RACE SELECTOR */}
        <section style={{ background: '#fff', borderBottom: '1px solid #d7d3c7' }}>
          <div className="shell">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                overflowX: 'auto',
                paddingBlock: 12,
                scrollbarWidth: 'none',
              }}
            >
              {liveRaces.map((race) => (
                <button
                  key={race.id}
                  type="button"
                  onClick={() => setSelectedRace(race.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 18px',
                    border: '1px solid',
                    borderColor: selectedRace === race.id ? '#002a15' : '#d7d3c7',
                    borderRadius: 8,
                    background: selectedRace === race.id ? '#002a15' : '#fff',
                    color: selectedRace === race.id ? '#ffdea5' : '#002a15',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    flexShrink: 0,
                  }}
                >
                  {selectedRace === race.id && (
                    <span
                      className="spect-live-dot"
                      style={{ transform: 'scale(0.8)' }}
                    />
                  )}
                  {race.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN LIVE RACE VIEW */}
        {currentRace && (
          <section className="spectator__section" style={{ paddingTop: 'clamp(40px, 5vw, 56px)' }}>
            <div className="shell">
              {/* Race Header Card */}
              <div
                className="spect-reveal"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(215,211,199,0.5)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 32,
                  boxShadow: '0 4px 20px rgba(0,42,21,0.08)',
                }}
              >
                {/* Hero Image */}
                <div
                  style={{
                    position: 'relative',
                    height: 280,
                    overflow: 'hidden',
                    background: '#0c0a08',
                  }}
                >
                  <img
                    src={currentRace.image}
                    alt={currentRace.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.7,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,42,21,0) 30%, rgba(0,42,21,0.85) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      left: 24,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span className="spect-live-dot" />
                    <span
                      style={{
                        padding: '6px 14px',
                        borderRadius: 4,
                        background: 'rgba(0,42,21,0.9)',
                        color: '#ffdea5',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      LIVE NOW
                    </span>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      left: 24,
                      right: 24,
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        color: '#fff',
                        fontFamily: '"EB Garamond", Georgia, serif',
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                        fontWeight: 500,
                        lineHeight: 1.1,
                      }}
                    >
                      {currentRace.name}
                    </h2>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginTop: 8,
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <span>{currentRace.location}</span>
                      <span>·</span>
                      <span>{currentRace.distance}</span>
                      <span>·</span>
                      <span>{currentRace.surface}</span>
                      <span>·</span>
                      <span style={{ color: '#ffbd6b', fontWeight: 800 }}>
                        {currentRace.prizePool}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: 48,
                    background: '#e4e1d7',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${currentRace.progress}%`,
                      background: 'linear-gradient(90deg, #002a15, #004225)',
                      transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: 16,
                    }}
                  >
                    <span
                      style={{
                        color: '#ffdea5',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentRace.elapsedTime}
                    </span>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#555e58',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {Math.round(currentRace.progress)}% Race Complete
                  </div>
                </div>
              </div>

              {/* Two Column: Live Track + Commentary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr',
                  gap: 24,
                  alignItems: 'start',
                }}
              >
                {/* Live Track */}
                <div className="spect-reveal">
                  <h3
                    style={{
                      margin: '0 0 14px',
                      color: '#002a15',
                      fontFamily: '"EB Garamond", Georgia, serif',
                      fontSize: '1.4rem',
                      fontWeight: 500,
                    }}
                  >
                    Live Positions
                  </h3>
                  <div
                    style={{
                      background: '#c8b98a',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <LiveRaceTrack participants={currentRace.participants} />
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    {currentRace.participants.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        style={{
                          background: '#fff',
                          border: '1px solid rgba(215,211,199,0.5)',
                          borderRadius: 8,
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#002a15',
                            color: '#ffdea5',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {p.position}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              color: '#002a15',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {p.horseName}
                          </p>
                          <p
                            style={{
                              margin: '2px 0 0',
                              color: '#747b75',
                              fontSize: '0.7rem',
                            }}
                          >
                            {p.jockey}
                          </p>
                        </div>
                        <span
                          style={{
                            marginLeft: 'auto',
                            color: '#002a15',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {p.odds.toFixed(2)}x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commentary */}
                <div className="spect-reveal spect-delay-2">
                  <h3
                    style={{
                      margin: '0 0 14px',
                      color: '#002a15',
                      fontFamily: '"EB Garamond", Georgia, serif',
                      fontSize: '1.4rem',
                      fontWeight: 500,
                    }}
                  >
                    Live Commentary
                  </h3>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(215,211,199,0.5)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                    {currentRace.commentary.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '14px 18px',
                          borderBottom:
                            i < currentRace.commentary.length - 1
                              ? '1px solid rgba(215,211,199,0.4)'
                              : 'none',
                          background: c.highlight ? 'rgba(255,222,165,0.15)' : 'transparent',
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            color: '#747b75',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            flexShrink: 0,
                            paddingTop: 2,
                            fontFamily: 'monospace',
                          }}
                        >
                          {c.time}
                        </span>
                        <p
                          style={{
                            margin: 0,
                            color: c.highlight ? '#002a15' : '#555e58',
                            fontSize: '0.85rem',
                            fontWeight: c.highlight ? 700 : 400,
                            lineHeight: 1.5,
                          }}
                        >
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="spectator__btn spectator__btn--secondary"
                    style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
                    onClick={() =>
                      addToast({
                        type: 'RACE_RESULT',
                        title: 'Following Race',
                        message: `You're now following ${currentRace.name} updates.`,
                      })
                    }
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span style={{ marginLeft: 8 }}>Follow This Race</span>
                  </button>
                </div>
              </div>

              {/* Other Live Races */}
              {liveRaces.length > 1 && (
                <div style={{ marginTop: 48 }}>
                  <h3
                    className="spect-reveal"
                    style={{
                      margin: '0 0 20px',
                      color: '#002a15',
                      fontFamily: '"EB Garamond", Georgia, serif',
                      fontSize: '1.4rem',
                      fontWeight: 500,
                    }}
                  >
                    Other Live Races
                  </h3>
                  <div
                    className="spect-reveal spect-delay-2"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: 20,
                    }}
                  >
                    {liveRaces
                      .filter((r) => r.id !== selectedRace)
                      .map((race) => (
                        <button
                          key={race.id}
                          type="button"
                          onClick={() => setSelectedRace(race.id)}
                          style={{
                            background: '#fff',
                            border: '1px solid rgba(215,211,199,0.5)',
                            borderRadius: 12,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,42,21,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                          }}
                        >
                          <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                            <img
                              src={race.image}
                              alt={race.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                  'linear-gradient(180deg, rgba(0,42,21,0) 40%, rgba(0,42,21,0.7) 100%)',
                              }}
                            />
                            <span
                              style={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '4px 10px',
                                borderRadius: 4,
                                background: 'rgba(239,68,68,0.9)',
                                color: '#fff',
                                fontSize: '0.66rem',
                                fontWeight: 800,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                              }}
                            >
                              <span className="spect-live-dot" style={{ transform: 'scale(0.6)' }} />
                              LIVE
                            </span>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 12,
                                left: 14,
                              }}
                            >
                              <h4
                                style={{
                                  margin: 0,
                                  color: '#fff',
                                  fontFamily: '"EB Garamond", Georgia, serif',
                                  fontSize: '1.2rem',
                                  fontWeight: 500,
                                }}
                              >
                                {race.name}
                              </h4>
                              <p
                                style={{
                                  margin: '4px 0 0',
                                  color: 'rgba(255,255,255,0.82)',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {race.location} · {race.elapsedTime}
                              </p>
                            </div>
                          </div>
                          <div style={{ padding: 14 }}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <span style={{ color: '#747b75', fontSize: '0.78rem' }}>
                                Race Progress
                              </span>
                              <span style={{ color: '#002a15', fontSize: '0.82rem', fontWeight: 800 }}>
                                {Math.round(race.progress)}%
                              </span>
                            </div>
                            <div
                              style={{
                                height: 4,
                                background: '#f0ede4',
                                borderRadius: 999,
                                marginTop: 6,
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${race.progress}%`,
                                  height: '100%',
                                  background: '#002a15',
                                  borderRadius: 999,
                                  transition: 'width 0.5s ease',
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 10,
                                color: '#747b75',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}
                            >
                              <span>{race.participants[0]?.horseName} leading</span>
                              <span>{race.prizePool}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Upcoming Races CTA */}
              {upcomingRaces.length > 0 && (
                <div className="spect-reveal" style={{ marginTop: 48 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: '#002a15',
                        fontFamily: '"EB Garamond", Georgia, serif',
                        fontSize: '1.4rem',
                        fontWeight: 500,
                      }}
                    >
                      Upcoming Races
                    </h3>
                    <Link to="/spectator/tournaments" className="spectator__text-link">
                      View All <ArrowRight />
                    </Link>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: 20,
                    }}
                  >
                    {upcomingRaces.map((race) => (
                      <Link
                        key={race.id}
                        to={`/spectator/tournaments/${race.id}`}
                        style={{
                          background: '#fff',
                          border: '1px solid rgba(215,211,199,0.5)',
                          borderRadius: 12,
                          overflow: 'hidden',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          display: 'block',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,42,21,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = '';
                          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                        }}
                      >
                        <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                          <img
                            src={race.image}
                            alt={race.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              padding: '4px 10px',
                              borderRadius: 4,
                              background: 'rgba(0,42,21,0.85)',
                              color: '#ffdea5',
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                            }}
                          >
                            UPCOMING
                          </span>
                        </div>
                        <div style={{ padding: 16 }}>
                          <h4
                            style={{
                              margin: 0,
                              color: '#002a15',
                              fontFamily: '"EB Garamond", Georgia, serif',
                              fontSize: '1.1rem',
                              fontWeight: 500,
                            }}
                          >
                            {race.name}
                          </h4>
                          <p
                            style={{
                              margin: '4px 0 10px',
                              color: '#747b75',
                              fontSize: '0.78rem',
                            }}
                          >
                            {race.location} · {race.date} · {race.time}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingTop: 10,
                              borderTop: '1px solid rgba(215,211,199,0.4)',
                            }}
                          >
                            <span style={{ color: '#002a15', fontSize: '0.9rem', fontWeight: 700 }}>
                              {race.prizePool}
                            </span>
                            <span style={{ color: '#747b75', fontSize: '0.72rem', fontWeight: 800 }}>
                              {race.runners} runners
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </SpectatorLayout>
  );
}
