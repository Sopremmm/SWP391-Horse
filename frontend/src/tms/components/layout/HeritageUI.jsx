// Heritage design system: shared UI primitives
// Palette: navy #002a15, gold #ffdea5, parchment #f7f6f1, stone border #d7d3c7

const FONT_SERIF = '"EB Garamond", Georgia, serif';
const FONT_SANS = "Inter, ui-sans-serif, system-ui, sans-serif";

export function HeritageTabs({ tabs, active, onChange }) {
  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #d7d3c7",
      }}
    >
      <div
        className="w-full mx-auto px-7 md:px-10 lg:px-16 flex overflow-x-auto"
        style={{ gap: 4 }}
      >
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className="cursor-pointer border-0 flex items-center"
              style={{
                padding: "22px 20px",
                background: "transparent",
                color: isActive ? "#002a15" : "#555e58",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderBottom: isActive ? "2px solid #002a15" : "2px solid transparent",
                whiteSpace: "nowrap",
                gap: 8,
              }}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span
                  style={{
                    padding: "1px 8px",
                    borderRadius: 999,
                    background: isActive ? "#002a15" : "#f0ede4",
                    color: isActive ? "#ffdea5" : "#555e58",
                    fontSize: "0.66rem",
                    fontWeight: 800,
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HeritageStat({ value, label, color = "#002a15" }) {
  return (
    <div
      className="bg-white"
      style={{
        border: "1px solid rgba(215,211,199,0.5)",
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <p
        className="m-0"
        style={{
          color,
          fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
          fontWeight: 500,
          lineHeight: 1,
          fontFamily: FONT_SERIF,
        }}
      >
        {value}
      </p>
      <p
        className="m-0"
        style={{
          marginTop: 8,
          color: "#747b75",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export function HeritageCard({ children, padding = 32, style = {} }) {
  return (
    <div
      className="bg-white"
      style={{
        border: "1px solid rgba(215,211,199,0.5)",
        borderRadius: 8,
        padding,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function HeritageButton({ children, variant = "primary", size = "md", onClick, type = "button", disabled = false, style = {}, ...rest }) {
  const sizes = {
    sm: { padding: "8px 14px", fontSize: "0.7rem", minHeight: 32 },
    md: { padding: "12px 20px", fontSize: "0.72rem", minHeight: 40 },
    lg: { padding: "16px 32px", fontSize: "0.78rem", minHeight: 48 },
  };
  const variants = {
    primary: { bg: "#002a15", color: "#fff", border: "transparent" },
    outline: { bg: "transparent", color: "#002a15", border: "1px solid #002a15" },
    ghost: { bg: "transparent", color: "#002a15", border: "1px solid #d7d3c7" },
    danger: { bg: "transparent", color: "#9f1239", border: "1px solid #fecdd3" },
    accent: { bg: "#ffdea5", color: "#002a15", border: "transparent" },
  };
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="border-0"
      style={{
        ...s,
        background: disabled ? "#9ca3af" : v.bg,
        color: v.color,
        boxShadow: v.border === "transparent" ? "none" : `inset 0 0 0 1px ${v.border.replace("1px solid ", "")}`,
        borderRadius: 2,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function HeritageField({ label, children, hint, required }) {
  return (
    <div className="m-0" style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#747b75",
          marginBottom: 8,
        }}
      >
        {label} {required ? "*" : ""}
      </label>
      {children}
      {hint && (
        <p className="m-0" style={{ marginTop: 6, color: "#747b75", fontSize: "0.72rem", lineHeight: 1.4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function HeritageInput(props) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 text-sm border-0 outline-none"
      style={{
        background: "#f7f6f1",
        color: "#002a15",
        borderRadius: 2,
        fontFamily: FONT_SANS,
        ...props.style,
      }}
    />
  );
}

export function HeritageTextarea(props) {
  return (
    <textarea
      {...props}
      className="w-full px-3.5 py-2.5 text-sm border-0 outline-none resize-none"
      style={{
        background: "#f7f6f1",
        color: "#002a15",
        borderRadius: 2,
        fontFamily: FONT_SANS,
        ...props.style,
      }}
    />
  );
}

export function HeritageSelect({ value, onChange, children, ...rest }) {
  return (
    <select
      value={value}
      onChange={onChange}
      {...rest}
      className="w-full px-3 py-2.5 text-sm border-0 outline-none cursor-pointer"
      style={{
        background: "#f7f6f1",
        color: "#002a15",
        borderRadius: 2,
        fontFamily: FONT_SANS,
        ...rest.style,
      }}
    >
      {children}
    </select>
  );
}

export function HeritageStatusPill({ status, size = "md" }) {
  const map = {
    Active: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    Draft: { bg: "#f3f4f6", color: "#6b7280", border: "#d1d5db" },
    Closed: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
    Upcoming: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
    Running: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    Finished: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    Cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
    Pending: { bg: "#fef9c3", color: "#713f12", border: "#fde047" },
    Approved: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    Rejected: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
    Accepted: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    Declined: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  };
  const s = map[status] || { bg: "#f3f4f6", color: "#6b7280", border: "#d1d5db" };
  const dims = size === "sm" ? { padding: "3px 9px", fontSize: "0.66rem" } : { padding: "5px 12px", fontSize: "0.7rem" };
  return (
    <span
      className="inline-flex items-center"
      style={{
        ...dims,
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        gap: 6,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.color }} />
      {status}
    </span>
  );
}

export function HeritageSlidePanel({ open, onClose, title, children, width = 460 }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50"
      style={{ background: "rgba(0,42,21,0.5)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 bottom-0 bg-white flex flex-col"
        style={{ width: `min(100%, ${width}px)`, boxShadow: "-10px 0 30px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: "20px 28px", borderBottom: "1px solid #d7d3c7" }}
        >
          <h2
            className="m-0"
            style={{
              color: "#002a15",
              fontSize: "1.4rem",
              fontWeight: 500,
              fontFamily: FONT_SERIF,
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer bg-transparent border-0"
            style={{ color: "#002a15" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ padding: 28 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function HeritageToast({ message, type = "success", onClose }) {
  if (!message) return null;
  const styles = {
    success: { bg: "#dcfce7", color: "#166534", border: "#86efac", icon: "✓" },
    error: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5", icon: "!" },
    info: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd", icon: "i" },
  };
  const s = styles[type] || styles.success;
  return (
    <div
      className="fixed z-50"
      style={{ top: 24, right: 24, animation: "slideIn 0.2s ease-out" }}
    >
      <div
        className="flex items-center"
        style={{
          padding: "12px 20px",
          background: s.bg,
          color: s.color,
          border: `1px solid ${s.border}`,
          borderRadius: 6,
          fontSize: "0.85rem",
          fontWeight: 600,
          gap: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          minWidth: 240,
        }}
      >
        <span
          style={{
            width: 22, height: 22, borderRadius: 999,
            background: s.color, color: "#fff",
            display: "grid", placeItems: "center",
            fontSize: "0.7rem", fontWeight: 800,
          }}
        >
          {s.icon}
        </span>
        {message}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer bg-transparent border-0"
            style={{ marginLeft: 8, color: s.color, fontSize: "1.1rem", lineHeight: 1 }}
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function HeritagePageHeader({ eyebrow, title, subtitle, children, accent = "#ffdea5" }) {
  return (
    <section
      style={{
        background: "#002a15",
        paddingBlock: "56px 48px",
      }}
    >
      <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
        {eyebrow && (
          <p
            className="m-0 inline-flex items-center"
            style={{
              color: accent,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              gap: 12,
            }}
          >
            <span style={{ width: 36, height: 1, background: accent }} />
            {eyebrow}
          </p>
        )}
        <h1
          className="m-0"
          style={{
            color: "#fff",
            fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)",
            fontWeight: 500,
            lineHeight: 1.1,
            marginTop: 12,
            fontFamily: FONT_SERIF,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="m-0"
            style={{
              marginTop: 14,
              color: "rgba(210,245,219,0.82)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              width: "min(100%, 580px)",
            }}
          >
            {subtitle}
          </p>
        )}
        {children && <div style={{ marginTop: 24 }}>{children}</div>}
      </div>
    </section>
  );
}

export { FONT_SERIF, FONT_SANS };
