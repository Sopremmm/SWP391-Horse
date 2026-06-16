import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import HeritageLayout, { FONT_SERIF } from "../components/layout/HeritageLayout.jsx";
import { HeritageButton, HeritageField, HeritageInput, HeritageStatusPill } from "../components/layout/HeritageUI.jsx";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=80&auto=format&fit=crop";

const FEATURED_IMAGES = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80&auto=format&fit=crop",
];

const STATS = [
  { value: "150+", label: "Tournaments Hosted" },
  { value: "42", label: "Elite Jockeys" },
  { value: "12", label: "Global Hubs" },
  { value: "$24M+", label: "Annual Prize Pool" },
];

const HERO_TOURNAMENTS = [
  {
    title: "Autumn Classic Series",
    location: "Ascot Park · Group 1 Stakes",
    state: "Registering",
    dateLabel: "Starts",
    dateValue: "Nov 12, 2024",
    prizePool: "$750,000",
  },
  {
    title: "The Emerald Invitational",
    location: "Dubai Meadows · Invitations Only",
    state: "In Progress",
    dateLabel: "Phase",
    dateValue: "Quarter Finals",
    prizePool: "$1,200,000",
  },
  {
    title: "Crown of St. Petersburg",
    location: "Winterthur Estate · Maiden Cup",
    state: "Opening Soon",
    dateLabel: "Opens",
    dateValue: "Dec 02, 2024",
    prizePool: "$480,000",
  },
];

const ROLES = [
  { value: "spectator", label: "Spectator" },
  { value: "owner", label: "Horse Owner" },
  { value: "jockey", label: "Jockey" },
  { value: "host", label: "Venue Host" },
  { value: "referee", label: "Referee" },
];

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, user } = useApp();

  const [signInOpen, setSignInOpen] = useState(false);
  const [authTab, setAuthTab] = useState("signin");
  const [signInId, setSignInId] = useState("");
  const [signInPw, setSignInPw] = useState("");
  const [signInError, setSignInError] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignInError("");
    if (signInId === "U001" && signInPw === "admin123") {
      login("U001"); setSignInOpen(false); navigate("/admin");
    } else if (signInId === "U002" && signInPw === "host123") {
      login("U002"); setSignInOpen(false); navigate("/host");
    } else if (signInId === "U003" && signInPw === "jockey123") {
      login("U003"); setSignInOpen(false); navigate("/jockey");
    } else if (signInId === "U006" && signInPw === "owner123") {
      login("U006"); setSignInOpen(false); navigate("/owner");
    } else if (signInId === "U008" && signInPw === "referee123") {
      login("U008"); setSignInOpen(false); navigate("/referee");
    } else if (signInId === "U009" && signInPw === "spectator123") {
      login("U009"); setSignInOpen(false); navigate("/spectator/home");
    } else {
      setSignInError("Invalid ID or password.");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setRegError("");
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regRole) {
      setRegError("Please fill in all fields and select a role.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegError("Please enter a valid email address.");
      return;
    }
    setRegSuccess(true);
    setRegName(""); setRegEmail(""); setRegPhone(""); setRegRole("");
  };

  const openSignIn = () => { setSignInOpen(true); setAuthTab("signin"); setRegSuccess(false); };
  const openSignUp = () => { setSignInOpen(true); setAuthTab("signup"); setSignInError(""); };

  return (
    <HeritageLayout role="spectator">
      {/* HERO */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: "clamp(560px, 78vh, 760px)" }}
      >
        <img
          src={HERO_IMAGE}
          alt="Heritage Racing hero"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scale(1.02)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,42,21,0.92) 0%, rgba(0,42,21,0.55) 50%, rgba(0,42,21,0.08) 100%), linear-gradient(0deg, rgba(0,42,21,0.18), rgba(0,42,21,0.04))",
          }}
        />
        <div
          className="relative z-10 w-full mx-auto px-7 md:px-10 lg:px-16"
          style={{ paddingBlock: "112px 72px" }}
        >
          <div className="flex flex-col items-start" style={{ width: "min(100%, 720px)", gap: 22 }}>
            <p
              className="m-0 inline-flex items-center"
              style={{
                color: "#ffdea5",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                gap: 14,
              }}
            >
              <span style={{ width: 48, height: 1, background: "#ffdea5" }} />
              Premier Horse Racing Events
            </p>
            <h1
              className="m-0 text-white"
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(2.8rem, 6.4vw, 5.2rem)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Heritage Racing — Bet on the World&apos;s Finest Thoroughbreds
            </h1>
            <p
              className="m-0"
              style={{
                width: "min(100%, 580px)",
                color: "rgba(245,245,244,0.9)",
                fontSize: "1rem",
                lineHeight: 1.65,
              }}
            >
              Place a stake in seconds. Track your bets, follow live races, and watch the world&apos;s most prestigious tournaments unfold — all in one place.
            </p>
            <div className="flex flex-wrap gap-4 pt-3">
              {user ? (
                <HeritageButton size="lg" onClick={() => navigate("/spectator/tournaments")}>
                  Browse Tournaments
                </HeritageButton>
              ) : (
                <>
                  <HeritageButton size="lg" variant="accent" onClick={openSignIn}>
                    Sign In to Bet
                  </HeritageButton>
                  <HeritageButton size="lg" variant="ghost" onClick={openSignUp} style={{ color: "#fff", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.32)" }}>
                    Sign Up Free
                  </HeritageButton>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        aria-label="Platform statistics"
        style={{ background: "#002a15", paddingBlock: 56 }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid gap-9"
          style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="grid justify-items-center gap-2 text-center">
              <strong
                style={{
                  color: "#ffdea5",
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  fontWeight: 500,
                  lineHeight: 1,
                  fontFamily: FONT_SERIF,
                }}
              >
                {s.value}
              </strong>
              <span
                style={{
                  color: "rgba(210,245,219,0.82)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TOURNAMENTS */}
      <section
        id="tournaments"
        style={{ paddingBlock: "clamp(64px, 8vw, 96px)" }}
      >
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="flex justify-between items-end gap-8 flex-wrap"
            style={{ marginBottom: 48 }}
          >
            <div>
              <h2
                className="m-0"
                style={{
                  color: "#002a15",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  fontFamily: FONT_SERIF,
                }}
              >
                Live &amp; Upcoming Tournaments
              </h2>
              <p
                className="m-0"
                style={{ marginTop: 12, color: "#555e58", fontSize: "1rem", lineHeight: 1.55, width: "min(100%, 460px)" }}
              >
                Top stakes, qualified fields, and live odds — all ready for you to place a bet.
              </p>
            </div>
            <Link
              to="/spectator/tournaments"
              className="inline-flex items-center no-underline whitespace-nowrap"
              style={{
                paddingBottom: 5,
                color: "#004225",
                borderBottom: "1px solid #004225",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                gap: 8,
              }}
            >
              View All Tournaments
              <ArrowRight />
            </Link>
          </div>

          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            {HERO_TOURNAMENTS.map((t, idx) => (
              <article
                key={t.title}
                className="bg-white overflow-hidden"
                style={{
                  border: "1px solid rgba(215,211,199,0.5)",
                  borderRadius: 8,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: 220, background: "#e4e1d7" }}
                >
                  <img
                    src={FEATURED_IMAGES[idx % FEATURED_IMAGES.length]}
                    alt={t.title}
                    className="block w-full h-full object-cover"
                  />
                  <span
                    className="absolute"
                    style={{
                      top: 14, right: 14,
                      padding: "6px 12px", borderRadius: 4,
                      background: t.state === "In Progress" ? "rgba(0,42,21,0.92)" : t.state === "Registering" ? "rgba(255,222,165,0.95)" : "#e7e5dd",
                      color: t.state === "In Progress" ? "#fff" : t.state === "Registering" ? "#263b12" : "#555e58",
                      fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t.state}
                  </span>
                </div>
                <div className="grid gap-4" style={{ padding: 28 }}>
                  <div>
                    <h3
                      className="m-0"
                      style={{
                        color: "#002a15",
                        fontSize: "1.5rem",
                        fontWeight: 500,
                        lineHeight: 1.2,
                        fontFamily: FONT_SERIF,
                      }}
                    >
                      {t.title}
                    </h3>
                    <p
                      className="m-0"
                      style={{ marginTop: 6, color: "#5e655f", fontSize: "0.86rem", lineHeight: 1.5 }}
                    >
                      {t.location}
                    </p>
                  </div>
                  <dl className="m-0 grid gap-2.5">
                    {[
                      { k: t.dateLabel, v: t.dateValue },
                      { k: "Prize Pool", v: t.prizePool },
                    ].map((row) => (
                      <div key={row.k} className="flex justify-between">
                        <dt
                          style={{
                            color: "#747b75",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {row.k}
                        </dt>
                        <dd
                          className="m-0"
                          style={{
                            color: "#002a15",
                            fontSize: "0.85rem",
                            fontWeight: 800,
                          }}
                        >
                          {row.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SIGN IN / SIGN UP MODAL */}
      {signInOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,42,21,0.55)", backdropFilter: "blur(3px)" }}
          onClick={() => setSignInOpen(false)}
        >
          <div
            className="bg-white overflow-hidden"
            style={{
              width: "min(100%, 460px)",
              borderRadius: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between"
              style={{ padding: "20px 28px", borderBottom: "1px solid #d7d3c7" }}
            >
              <h2
                className="m-0"
                style={{
                  color: "#002a15", fontSize: "1.5rem", fontWeight: 500,
                  fontFamily: FONT_SERIF,
                }}
              >
                {authTab === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <button
                type="button"
                onClick={() => setSignInOpen(false)}
                aria-label="Close"
                className="cursor-pointer bg-transparent border-0"
                style={{ color: "#002a15" }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex" style={{ borderBottom: "1px solid #d7d3c7" }}>
              {[
                { id: "signin", label: "Sign In" },
                { id: "signup", label: "Sign Up" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setAuthTab(t.id); setSignInError(""); setRegError(""); }}
                  className="cursor-pointer border-0 flex-1"
                  style={{
                    padding: "16px 20px",
                    background: "transparent",
                    color: authTab === t.id ? "#002a15" : "#555e58",
                    fontSize: "0.78rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    borderBottom: authTab === t.id ? "2px solid #002a15" : "2px solid transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {authTab === "signin" ? (
              <form onSubmit={handleSignIn} className="grid gap-4" style={{ padding: 28 }}>
                <p className="m-0" style={{ color: "#555e58", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  Sign in with your demo credentials (e.g. <strong>U009</strong> / <strong>spectator123</strong>).
                </p>
                <HeritageField label="User ID" required>
                  <HeritageInput
                    value={signInId}
                    onChange={(e) => setSignInId(e.target.value)}
                    placeholder="e.g. U009"
                    required
                  />
                </HeritageField>
                <HeritageField label="Password" required>
                  <HeritageInput
                    type="password"
                    value={signInPw}
                    onChange={(e) => setSignInPw(e.target.value)}
                    placeholder="Your password"
                    required
                  />
                </HeritageField>
                {signInError && (
                  <p
                    className="m-0"
                    style={{
                      color: "#9f1239", fontSize: "0.82rem", fontWeight: 600,
                      padding: 10, background: "#fff1f2", borderRadius: 4,
                    }}
                  >
                    {signInError}
                  </p>
                )}
                <HeritageButton type="submit" size="lg" style={{ width: "100%", justifyContent: "center" }}>
                  Sign In
                </HeritageButton>
                <div
                  className="grid gap-2"
                  style={{ marginTop: 8, padding: 14, background: "#f7f6f1", borderRadius: 6 }}
                >
                  <p className="m-0" style={{ color: "#555e58", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Demo accounts
                  </p>
                  {[
                    ["U001", "admin123", "Admin"],
                    ["U002", "host123", "Host"],
                    ["U003", "jockey123", "Jockey"],
                    ["U006", "owner123", "Owner"],
                    ["U008", "referee123", "Referee"],
                    ["U009", "spectator123", "Spectator"],
                  ].map(([id, pw, role]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { setSignInId(id); setSignInPw(pw); }}
                      className="cursor-pointer bg-transparent border-0 flex items-center justify-between"
                      style={{
                        padding: "6px 8px",
                        fontSize: "0.78rem",
                        color: "#002a15",
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{role}</span>
                      <span style={{ color: "#555e58", fontSize: "0.72rem" }}>{id} / {pw}</span>
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="grid gap-4" style={{ padding: 28 }}>
                {regSuccess ? (
                  <div
                    className="text-center"
                    style={{ padding: 32, background: "#dcfce7", borderRadius: 6 }}
                  >
                    <p
                      className="m-0"
                      style={{ color: "#166534", fontSize: "1.05rem", fontWeight: 700 }}
                    >
                      ✓ Account request submitted
                    </p>
                    <p
                      className="m-0"
                      style={{ color: "#166534", fontSize: "0.85rem", marginTop: 8 }}
                    >
                      Our team will review and contact you shortly.
                    </p>
                    <HeritageButton
                      size="md"
                      onClick={() => { setSignInOpen(false); setRegSuccess(false); setAuthTab("signin"); }}
                      style={{ marginTop: 16 }}
                    >
                      Back to Sign In
                    </HeritageButton>
                  </div>
                ) : (
                  <>
                    <HeritageField label="Full Name" required>
                      <HeritageInput
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </HeritageField>
                    <HeritageField label="Email Address" required>
                      <HeritageInput
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </HeritageField>
                    <HeritageField label="Phone Number" required>
                      <HeritageInput
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+1 555 0000"
                        required
                      />
                    </HeritageField>
                    <HeritageField label="Account Type" required>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 text-sm border-0 outline-none cursor-pointer"
                        style={{ background: "#f7f6f1", color: "#002a15", borderRadius: 2 }}
                      >
                        <option value="">— Choose your role —</option>
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </HeritageField>
                    {regError && (
                      <p
                        className="m-0"
                        style={{
                          color: "#9f1239", fontSize: "0.82rem", fontWeight: 600,
                          padding: 10, background: "#fff1f2", borderRadius: 4,
                        }}
                      >
                        {regError}
                      </p>
                    )}
                    <HeritageButton type="submit" size="lg" style={{ width: "100%", justifyContent: "center" }}>
                      Create Account
                    </HeritageButton>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </HeritageLayout>
  );
}
