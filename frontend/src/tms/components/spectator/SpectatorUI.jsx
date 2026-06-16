import React from 'react';

// Shared color tokens aligned with the Stitch AI design language.
export const COLORS = {
  green: '#002a15',
  greenSoft: '#004225',
  gold: '#ffdea5',
  goldStrong: '#ffbd6b',
  parchment: '#f7f6f1',
  paperSoft: '#f0ede4',
  ink: '#1f231f',
  copy: '#555e58',
  muted: '#747b75',
  border: 'rgba(215,211,199,0.5)',
};

export const FONT_SERIF = '"EB Garamond", Georgia, serif';
export const FONT_SANS = 'Inter, ui-sans-serif, system-ui, sans-serif';

// Section eyebrow + headline.
export function SectionHead({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex justify-between items-end gap-8 flex-wrap" style={{ marginBottom: 36 }}>
      <div>
        {eyebrow ? (
          <p
            className="m-0"
            style={{
              color: '#ffbd6b',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className="m-0"
          style={{
            color: COLORS.green,
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            fontFamily: FONT_SERIF,
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className="m-0"
            style={{
              marginTop: 12,
              color: COLORS.copy,
              fontSize: '0.95rem',
              lineHeight: 1.55,
              width: 'min(100%, 480px)',
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

// Simple stat card.
export function StatTile({ value, label, sub }) {
  return (
    <div
      className="grid"
      style={{
        background: '#fff',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 24,
        gap: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <strong
        style={{
          color: COLORS.green,
          fontSize: '1.8rem',
          fontWeight: 500,
          lineHeight: 1,
          fontFamily: FONT_SERIF,
        }}
      >
        {value}
      </strong>
      <span
        style={{
          color: COLORS.muted,
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginTop: 6,
        }}
      >
        {label}
      </span>
      {sub ? (
        <span
          style={{
            color: COLORS.copy,
            fontSize: '0.78rem',
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}

// Pill (badge).
export function Pill({ children, tone = 'gold', className = '' }) {
  const toneMap = {
    gold: { bg: 'rgba(255,222,165,0.85)', color: '#7a5a00' },
    dark: { bg: 'rgba(0,42,21,0.92)', color: '#ffdea5' },
    soft: { bg: '#f4f1e8', color: COLORS.copy },
    green: { bg: 'rgba(0,66,37,0.08)', color: COLORS.green },
    red: { bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a' },
  };
  const t = toneMap[tone] || toneMap.gold;
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 4,
        background: t.bg,
        color: t.color,
        fontSize: '0.66rem',
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

// Status pill with semantic colors.
export function StatusPill({ status }) {
  const map = {
    Pending: { bg: 'rgba(255,222,165,0.85)', color: '#7a5a00' },
    Win: { bg: 'rgba(0,66,37,0.85)', color: '#ffdea5' },
    Settled: { bg: 'rgba(0,0,0,0.06)', color: COLORS.copy },
    Lost: { bg: 'rgba(186,26,26,0.08)', color: '#ba1a1a' },
  };
  const t = map[status] || map.Pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 999,
        background: t.bg,
        color: t.color,
        fontSize: '0.68rem',
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  );
}

// Card primitive.
export function Card({ children, padding = 28, className = '', style = {} }) {
  return (
    <div
      className={`bg-white ${className}`}
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// CTA Button (solid / outline).
export function Button({
  children,
  variant = 'solid',
  size = 'md',
  as: As = 'button',
  to,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...rest
}) {
  const sizeMap = {
    sm: { padding: '10px 18px', fontSize: '0.7rem', letterSpacing: '0.1em' },
    md: { padding: '14px 24px', fontSize: '0.72rem', letterSpacing: '0.12em' },
    lg: { padding: '18px 36px', fontSize: '0.75rem', letterSpacing: '0.12em' },
  };
  const sz = sizeMap[size] || sizeMap.md;
  const variants = {
    solid: { bg: COLORS.green, color: '#fff', boxShadow: 'none' },
    outline: { bg: 'transparent', color: COLORS.green, boxShadow: 'inset 0 0 0 1px #002a15' },
    ghost: { bg: 'transparent', color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.32)' },
    gold: { bg: COLORS.gold, color: COLORS.green },
  };
  const v = variants[variant] || variants.solid;

  const inner = (
    <As
      type={As === 'button' ? type : undefined}
      to={to}
      onClick={onClick}
      className={`uppercase inline-flex items-center justify-center no-underline ${className}`}
      style={{
        minHeight: 44,
        background: v.bg,
        color: v.color,
        boxShadow: v.boxShadow,
        borderRadius: 2,
        fontSize: sz.fontSize,
        fontWeight: 800,
        letterSpacing: sz.letterSpacing,
        padding: sz.padding,
        textTransform: 'uppercase',
        border: 0,
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </As>
  );
  return inner;
}

// Right-arrow icon used in CTAs.
export function ArrowRight({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ marginLeft: 8 }}
    >
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

// Filter / tab button row.
export function Tabs({ tabs, active, onChange, size = 'md' }) {
  return (
    <div className="flex flex-wrap" style={{ gap: 8 }}>
      {tabs.map((t) => {
        const isActive = active === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className="cursor-pointer border-0"
            style={{
              padding: size === 'sm' ? '8px 16px' : '10px 22px',
              borderRadius: 999,
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              background: isActive ? COLORS.green : '#e7e5e4',
              color: isActive ? '#fff' : COLORS.copy,
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// Sort dropdown (visual only).
export function SortPill({ label }) {
  return (
    <div className="flex items-center" style={{ gap: 12 }}>
      <span
        style={{
          color: COLORS.muted,
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        Sort By
      </span>
      <div
        className="inline-flex items-center"
        style={{
          gap: 8,
          padding: '8px 14px',
          borderRadius: 999,
          background: '#fff',
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <span style={{ color: COLORS.green, fontSize: '0.82rem', fontWeight: 700 }}>{label}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// Page title block (eyebrow + h1 + sub).
export function PageHead({ eyebrow, title, subtitle, breadcrumb }) {
  return (
    <header style={{ paddingBlock: 'clamp(40px, 6vw, 72px) 28px' }}>
      {breadcrumb ? (
        <p
          className="m-0"
          style={{
            color: COLORS.muted,
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          {breadcrumb.map((b, i) => (
            <React.Fragment key={b.label}>
              {i > 0 ? <span style={{ marginInline: 8 }}>/</span> : null}
              <span style={{ color: i === breadcrumb.length - 1 ? COLORS.green : COLORS.muted }}>
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </p>
      ) : null}
      {eyebrow ? (
        <p
          className="m-0"
          style={{
            color: COLORS.goldStrong,
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className="m-0"
        style={{
          color: COLORS.green,
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 500,
          lineHeight: 1.05,
          fontFamily: FONT_SERIF,
        }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className="m-0"
          style={{
            marginTop: 14,
            color: COLORS.copy,
            fontSize: '1rem',
            lineHeight: 1.6,
            width: 'min(100%, 640px)',
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

// Search input row used in subpages.
export function SearchBar({ placeholder = 'Search for races, horses, or jockeys...' }) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 12,
        padding: '6px 8px 6px 18px',
        background: '#fff',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 999,
        width: 'min(100%, 520px)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: COLORS.muted }}>
        <path
          d="M11 11l3 3M7 13A6 6 0 1 1 7 1a6 6 0 0 1 0 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 border-0 outline-none"
        style={{
          background: 'transparent',
          padding: '12px 4px',
          fontSize: '0.88rem',
          color: COLORS.green,
        }}
      />
      <button
        type="button"
        className="cursor-pointer border-0 inline-flex items-center justify-center"
        style={{
          minHeight: 40,
          minWidth: 40,
          background: COLORS.green,
          color: '#fff',
          borderRadius: 999,
        }}
        aria-label="Filter"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M1 3h12M3 7h8M5 11h4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// Avatar with circular frame.
export function Avatar({ src, alt, size = 56 }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: '#e4e1d7',
        boxShadow: '0 0 0 4px #fff',
        flex: '0 0 auto',
      }}
    >
      <img
        src={src}
        alt={alt}
        className="block w-full h-full"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

// Bet slip card (place a bet form).
export function BetSlipCard({
  selectionLabel = 'Sovereign',
  odds = 4.2,
  onSubmit,
  defaultStake = 50,
  confirmLabel = 'Place Bet — Step Forward',
  extraRows,
}) {
  const [stake, setStake] = React.useState(defaultStake);
  const payout = Math.round(stake * odds * 100) / 100;

  return (
    <div
      className="bg-white"
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: 28,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 100,
      }}
    >
      <p
        className="m-0"
        style={{
          color: COLORS.muted,
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Place a Bet
      </p>
      <div className="flex items-baseline justify-between" style={{ marginBottom: 20 }}>
        <span
          style={{
            color: COLORS.green,
            fontSize: '1.8rem',
            fontWeight: 500,
            fontFamily: FONT_SERIF,
            lineHeight: 1,
          }}
        >
          {odds.toFixed(2)}x
        </span>
        <span style={{ color: COLORS.muted, fontSize: '0.74rem', fontWeight: 700 }}>Estimated Payout</span>
      </div>

      <p
        className="m-0"
        style={{
          color: COLORS.green,
          fontSize: '0.95rem',
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        On {selectionLabel}
      </p>
      <p
        className="m-0"
        style={{
          color: COLORS.muted,
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: 18,
        }}
      >
        Set your stake and confirm your wager
      </p>

      <label
        htmlFor="bet-stake"
        style={{
          display: 'block',
          color: COLORS.muted,
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Stake Amount (USD)
      </label>
      <div
        className="flex items-center"
        style={{
          background: COLORS.parchment,
          borderRadius: 2,
          padding: '12px 14px',
          marginBottom: 18,
        }}
      >
        <span
          style={{
            color: COLORS.muted,
            fontSize: '1rem',
            fontWeight: 700,
            marginRight: 6,
          }}
        >
          $
        </span>
        <input
          id="bet-stake"
          type="number"
          min="1"
          step="1"
          value={stake}
          onChange={(e) => setStake(Math.max(1, Number(e.target.value) || 0))}
          className="w-full border-0 outline-none"
          style={{
            background: 'transparent',
            color: COLORS.green,
            fontSize: '1.05rem',
            fontWeight: 700,
          }}
        />
      </div>

      {extraRows}

      <div
        className="flex items-baseline justify-between"
        style={{
          paddingTop: 16,
          marginTop: 4,
          borderTop: `1px solid ${COLORS.border}`,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            color: COLORS.muted,
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Potential Payout
        </span>
        <strong
          style={{
            color: COLORS.green,
            fontSize: '1.4rem',
            fontWeight: 500,
            fontFamily: FONT_SERIF,
          }}
        >
          ${payout.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </strong>
      </div>

      <Button variant="solid" size="lg" onClick={onSubmit} className="w-full" style={{ width: '100%' }}>
        {confirmLabel}
        <ArrowRight />
      </Button>
    </div>
  );
}
