import { useState, useEffect, useCallback } from 'react';
import './SpectatorUI.css';

const TOAST_ICONS = {
  BET_WIN: '🏆',
  BET_LOSE: '✗',
  RACE_RESULT: '🏇',
  SYSTEM: '🔔',
  JOCKEY_INVITE: '📨',
  REG_APPROVED: '✓',
  REG_REJECTED: '✗',
};

const TOAST_COLORS = {
  BET_WIN: 'win',
  BET_LOSE: 'lose',
  RACE_RESULT: 'neutral',
  SYSTEM: 'neutral',
};

export function SpectatorToast({ toasts, onDismiss }) {
  return (
    <div className="spect-toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [dismissing, setDismissing] = useState(false);
  const colorType = TOAST_COLORS[toast.type] || 'neutral';
  const iconClass = `spect-toast__icon spect-toast__icon--${colorType}`;

  const dismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(() => onDismiss(toast.id), 400);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, [dismiss]);

  return (
    <div
      className={`spect-toast${dismissing ? ' dismissing' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={iconClass}>
        {toast.type === 'BET_WIN' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : toast.type === 'BET_LOSE' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : toast.type === 'RACE_RESULT' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        )}
      </div>
      <div className="spect-toast__content">
        <span className="spect-toast__title">{toast.title}</span>
        <span className="spect-toast__message">{toast.message}</span>
        {toast.amount != null && (
          <span
            style={{
              display: 'inline-block',
              marginTop: 6,
              padding: '2px 10px',
              borderRadius: 999,
              background: 'rgba(255,222,165,0.2)',
              color: '#ffbd6b',
              fontSize: '0.82rem',
              fontWeight: 800,
            }}
          >
            +${toast.amount.toLocaleString()}
          </span>
        )}
      </div>
      <button
        type="button"
        className="spect-toast__close"
        onClick={dismiss}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Scroll Reveal Hook ─────────────────────────────── */
export function useScrollReveal(options = {}) {
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.spect-reveal, .spect-reveal-left, .spect-reveal-right, .spect-reveal-scale'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Particle Overlay Component ─────────────────────── */
export function ParticleOverlay({ count = 20 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${8 + Math.random() * 6}s`,
    size: `${4 + Math.random() * 4}px`,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  return (
    <div className="spect-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="spect-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Live Race Track Component ─────────────────────── */
export function LiveRaceTrack({ participants, raceId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {participants.map((p, idx) => (
        <div
          key={p.id}
          className="spect-race-track__lane"
          style={{
            background: idx % 2 === 0 ? '#c8b98a' : '#b8a97a',
            borderRadius: idx === 0 ? '8px 8px 0 0' : idx === participants.length - 1 ? '0 0 8px 8px' : '0',
          }}
        >
          <div
            className="spect-race-track"
            style={{ width: '100%', background: 'transparent', boxShadow: 'none', height: '100%' }}
          >
            <div
              className="spect-race-horse-icon"
              style={{
                left: `calc(${p.progress}% - 14px)`,
                fontSize: '1.2rem',
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
              }}
            >
              🐎
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                left: 0,
                width: `${p.progress}%`,
                height: 3,
                background: 'linear-gradient(90deg, #ffbd6b, #ffdea5)',
                borderRadius: '0 999px 0 0',
                transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 3,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#002a15',
                color: '#ffdea5',
                display: 'grid',
                placeItems: 'center',
                fontSize: '0.65rem',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {p.position}
            </span>
            <span
              style={{
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 100,
              }}
            >
              {p.horseName}
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 3,
            }}
          >
            <span
              style={{
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 800,
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              {p.odds.toFixed(2)}x
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Animated Stat Counter ─────────────────────────── */
export function AnimatedCounter({ value, duration = 1200 }) {
  const [display, setDisplay] = useState('0');
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

  useEffect(() => {
    if (!numericValue || isNaN(numericValue)) {
      setDisplay(value);
      return;
    }
    const isFormatted = value.includes('$') || value.includes(',');
    const prefix = value.match(/^[^0-9]*/)?.[0] || '';
    const suffix = value.match(/[^0-9.]*$/)?.[0] || '';

    let start = 0;
    const step = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericValue) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        let formatted;
        if (isFormatted) {
          formatted = prefix + Math.round(start).toLocaleString() + suffix;
        } else {
          formatted = prefix + start.toFixed(1) + suffix;
        }
        setDisplay(formatted);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration, numericValue]);

  return <span className="spect-stat-animated">{display}</span>;
}
