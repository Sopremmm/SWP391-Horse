import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { RACES_SEED } from "../races.js";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  PAGE_BG,
  TEXT,
  TEXT_MUTED,
} from "../constants.js";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=80&auto=format&fit=crop";

const TOURNAMENT_IMAGES = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80&auto=format&fit=crop",
];

function getStatus(state) {
  if (state === "registering") return { text: "Registering", tone: "amber" };
  if (state === "in-progress") return { text: "In Progress", tone: "green" };
  return { text: "Opening Soon", tone: "stone" };
}

const HERO_DATA = {
  eyebrow: "Premier Event",
  title: "The Royal Heritage Cup",
  description:
    "Experience the pinnacle of equestrian precision. A legacy defined by speed, lineage, and the pursuit of ultimate glory on the hallowed grounds of the Royal Oaks.",
  prizePool: "$2,500,000 USD",
  raceDate: "October 24, 2024",
  primaryAction: "View Details",
  secondaryAction: "Full Calendar",
};

const STATS = [
  { value: "150+", label: "Total tournaments hosted" },
  { value: "42", label: "Elite class jockeys" },
  { value: "12", label: "Global racing hubs" },
];

const TOURNAMENTS = [
  {
    title: "Autumn Classic Series",
    location: "Ascot Park \u2014 Group 1 Stakes",
    state: "registering",
    stateText: "Registering",
    dateLabel: "Starts",
    dateValue: "Nov 12, 2024",
    prizePool: "$750,000",
    action: "View Stakes",
  },
  {
    title: "The Emerald Invitational",
    location: "Dubai Meadows \u2014 Invitations Only",
    state: "in-progress",
    stateText: "In Progress",
    dateLabel: "Phase",
    dateValue: "Quarter Finals",
    prizePool: "$1,200,000",
    action: "Follow Live",
  },
  {
    title: "Crown of St. Petersburg",
    location: "Winterthur Estate \u2014 Maiden Cup",
    state: "opening-soon",
    stateText: "Opening Soon",
    dateLabel: "Opens",
    dateValue: "Dec 02, 2024",
    prizePool: "$480,000",
    action: "Notify Me",
  },
];

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M13.83 15 8.58 9.75a5.43 5.43 0 0 1-3.16 1.08A5.23 5.23 0 0 1 0 5.42 5.23 5.23 0 0 1 5.42 0a5.23 5.23 0 0 1 5.41 5.42 5.43 5.43 0 0 1-1.08 3.16L15 13.83 13.83 15ZM5.42 9.17A3.62 3.62 0 0 0 9.17 5.42a3.62 3.62 0 0 0-3.75-3.75 3.62 3.62 0 0 0-3.75 3.75 3.62 3.62 0 0 0 3.75 3.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, user } = useApp();

  const [signInOpen, setSignInOpen] = useState(false);
  const [authTab, setAuthTab] = useState("signin");
  const [authMode, setAuthMode] = useState("form");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [signInId, setSignInId] = useState("");
  const [signInPw, setSignInPw] = useState("");
  const [signInError, setSignInError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    setRegError("");
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regRole) {
      setRegError("Please fill in all fields and select a role.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setRegError("Please enter a valid email address.");
      return;
    }
    setRegSuccess(true);
    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setRegRole("");
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignInError("");
    if (signInId === "U001" && signInPw === "admin123") {
      login("U001");
      setSignInOpen(false);
      setSignInId("");
      setSignInPw("");
      navigate("/admin");
    } else if (signInId === "U002" && signInPw === "host123") {
      login("U002");
      setSignInOpen(false);
      navigate("/host");
    } else if (signInId === "U003" && signInPw === "jockey123") {
      login("U003");
      setSignInOpen(false);
      navigate("/jockey");
    } else if (signInId === "U006" && signInPw === "owner123") {
      login("U006");
      setSignInOpen(false);
      navigate("/owner");
    } else if (signInId === "U008" && signInPw === "referee123") {
      login("U008");
      setSignInOpen(false);
      navigate("/referee");
    } else if (signInId === "U009" && signInPw === "spectator123") {
      login("U009");
      setSignInOpen(false);
      navigate("/spectator");
    } else {
      setSignInError("Invalid ID or password.");
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#f7f6f1", color: "#002a15" }}
    >
      {/* HEADER */}
      <header
        className="fixed inset-x-0 top-0 z-30 bg-white/95 backdrop-blur"
        style={{ height: 80, borderBottom: "1px solid #d7d3c7", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between gap-6"
          style={{ height: 80 }}
        >
          <div className="flex items-center gap-12 min-w-0">
            <a
              href="#top"
              className="flex-shrink-0 no-underline"
              style={{
                color: "#002a15",
                fontSize: "1.3rem",
                fontWeight: 600,
                fontFamily: '"EB Garamond", Georgia, serif',
              }}
            >
              Heritage Racing
            </a>
            <nav
              className="hidden md:flex items-center"
              style={{ gap: "clamp(18px, 3vw, 32px)" }}
              aria-label="Primary navigation"
            >
              <a
                href="#tournaments"
                className="px-0 py-1 text-xs font-bold tracking-widest no-underline"
                style={{
                  color: "#002a15",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  borderBottom: "2px solid #002a15",
                }}
              >
                Tournaments
              </a>
              <a
                href="#race-info"
                className="text-xs font-bold tracking-widest no-underline"
                style={{ color: "#555e58", letterSpacing: "0.08em", borderBottom: "2px solid transparent" }}
              >
                Race Info
              </a>
              <a
                href="#about"
                className="text-xs font-bold tracking-widest no-underline"
                style={{ color: "#555e58", letterSpacing: "0.08em", borderBottom: "2px solid transparent" }}
              >
                About Us
              </a>
            </nav>
          </div>

          <div className="flex items-center" style={{ gap: "clamp(14px, 2vw, 24px)" }}>
            <button
              type="button"
              aria-label="Search"
              className="inline-grid place-items-center bg-transparent border-0 cursor-pointer"
              style={{ width: 40, height: 40, color: "#002a15" }}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              onClick={() => setSignInOpen(true)}
              className="uppercase inline-flex items-center justify-center cursor-pointer transition-colors"
              style={{
                minHeight: 44,
                padding: "0 28px",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "#002a15",
                background: "transparent",
                boxShadow: "inset 0 0 0 1px rgba(0,42,21,0.25)",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setSignInOpen(true);
                setAuthTab("signup");
              }}
              className="uppercase inline-flex items-center justify-center cursor-pointer transition-colors"
              style={{
                minHeight: 44,
                padding: "0 28px",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "#fff",
                background: "#002a15",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* SIGN IN / SIGN UP MODAL */}
      {signInOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-end px-7 pt-24"
          onClick={() => setSignInOpen(false)}
        >
          <div
            className="w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden"
            style={{ borderColor: BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 text-center border-b" style={{ borderColor: "#f1f5f9" }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: BRAND_LIGHT, border: `2px solid ${BRAND_BORDER}` }}
              >
                <i className="ti ti-user text-2xl" style={{ color: BRAND }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: TEXT }}>Welcome!</p>
              <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
                Sign in to access your account
              </p>
            </div>
            <div className="flex border-b" style={{ borderColor: "#f1f5f9" }}>
              <button
                type="button"
                onClick={() => { setAuthTab("signin"); setAuthMode("form"); setSignInError(""); }}
                className="flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer bg-transparent border-0"
                style={{
                  color: authTab === "signin" ? BRAND : TEXT_MUTED,
                  borderBottom: authTab === "signin" ? `2px solid ${BRAND}` : "2px solid transparent",
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab("signup"); setRegError(""); }}
                className="flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer bg-transparent border-0"
                style={{
                  color: authTab === "signup" ? BRAND : TEXT_MUTED,
                  borderBottom: authTab === "signup" ? `2px solid ${BRAND}` : "2px solid transparent",
                }}
              >
                Sign Up
              </button>
            </div>
            <div className="p-5">
              {authTab === "signin" && authMode === "form" && (
                <form onSubmit={handleSignIn}>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                      User ID
                    </label>
                    <input
                      type="text"
                      value={signInId}
                      onChange={(e) => setSignInId(e.target.value)}
                      placeholder="U001"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: BORDER, color: TEXT }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={signInPw}
                      onChange={(e) => setSignInPw(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: BORDER, color: TEXT }}
                    />
                  </div>
                  {signInError && <p className="text-xs text-red-500 mb-3">{signInError}</p>}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-0 transition-all"
                    style={{ background: BRAND }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("forgot"); setSignInError(""); }}
                    className="w-full mt-2 bg-transparent border-0 font-sans text-xs cursor-pointer transition-all"
                    style={{ color: TEXT_MUTED }}
                  >
                    Forgot password?
                  </button>
                </form>
              )}
              {authTab === "signin" && authMode === "forgot" && !forgotSent && (
                <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }}>
                  <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>
                    Enter your email and we&apos;ll send you a link to reset your password.
                  </p>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: BORDER, color: TEXT }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-0 transition-all"
                    style={{ background: BRAND }}
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("form"); setForgotEmail(""); }}
                    className="w-full mt-2 bg-transparent border-0 font-sans text-xs cursor-pointer transition-all"
                    style={{ color: TEXT_MUTED }}
                  >
                    Back to Sign In
                  </button>
                </form>
              )}
              {authTab === "signin" && authMode === "forgot" && forgotSent && (
                <div className="text-center py-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: BRAND_LIGHT }}
                  >
                    <i className="ti ti-mail text-xl" style={{ color: BRAND }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Check your email</p>
                  <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>
                    We sent a password reset link to <span className="font-semibold">{forgotEmail}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("form"); setForgotSent(false); setForgotEmail(""); }}
                    className="px-4 py-2 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-0 transition-all"
                    style={{ background: BRAND }}
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
              {authTab === "signup" && !regSuccess && (
                <form onSubmit={handleSignUp}>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: BORDER, color: TEXT }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: BORDER, color: TEXT }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 555 0000"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: BORDER, color: TEXT }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: TEXT_MUTED }}>
                      Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans focus:outline-none focus:ring-2 transition-all cursor-pointer"
                      style={{ borderColor: BORDER, color: TEXT }}
                    >
                      <option value="">Select your role</option>
                      <option value="owner">Horse Owner</option>
                      <option value="jockey">Jockey</option>
                      <option value="spectator">Spectator</option>
                    </select>
                  </div>
                  {regError && <p className="text-xs text-red-500 mb-3">{regError}</p>}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-0 transition-all"
                    style={{ background: BRAND }}
                  >
                    Create Account
                  </button>
                </form>
              )}
              {authTab === "signup" && regSuccess && (
                <div className="text-center py-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "#d1fae5" }}
                  >
                    <i className="ti ti-circle-check text-2xl" style={{ color: "#166534" }} />
                  </div>
                  <p className="text-base font-bold mb-1" style={{ color: TEXT }}>Registration Submitted!</p>
                  <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>
                    Your request is pending approval. You will be notified once reviewed.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setAuthTab("signin"); setRegSuccess(false); setRegError(""); }}
                    className="px-4 py-2 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-0 transition-all"
                    style={{ background: BRAND }}
                  >
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main id="top">
        {/* HERO */}
        <section
          className="relative flex items-center overflow-hidden"
          style={{ minHeight: "clamp(680px, 92vh, 980px)" }}
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
                "linear-gradient(90deg, rgba(0,42,21,0.92) 0%, rgba(0,42,21,0.48) 48%, rgba(0,42,21,0.04) 100%), linear-gradient(0deg, rgba(0,42,21,0.18), rgba(0,42,21,0.04))",
            }}
          />
          <div
            className="relative z-10 w-full mx-auto px-7 md:px-10 lg:px-16"
            style={{ paddingBlock: "128px 80px" }}
          >
            <div
              className="flex flex-col items-start"
              style={{ width: "min(100%, 672px)", gap: 24 }}
            >
              <p
                className="m-0 inline-flex items-center gap-3"
                style={{
                  color: "#ffdea5",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ width: 48, height: 1, background: "#ffdea5" }} />
                {HERO_DATA.eyebrow}
              </p>
              <h1
                className="m-0 text-white"
                style={{
                  fontFamily: '"EB Garamond", Georgia, serif',
                  fontSize: "clamp(3rem, 7vw, 5.6rem)",
                  fontWeight: 600,
                  lineHeight: 1.04,
                }}
              >
                {HERO_DATA.title}
              </h1>
              <p
                className="m-0"
                style={{
                  width: "min(100%, 540px)",
                  color: "rgba(245,245,244,0.9)",
                  fontSize: "1rem",
                  lineHeight: 1.65,
                }}
              >
                {HERO_DATA.description}
              </p>

              <div
                className="grid gap-7"
                style={{
                  width: "min(100%, 560px)",
                  paddingLeft: 32,
                  borderLeft: "1px solid rgba(255,222,165,0.32)",
                }}
              >
                <div className="grid gap-1.5">
                  <span
                    style={{
                      color: "rgba(255,222,165,0.82)",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Prize Pool
                  </span>
                  <strong
                    style={{
                      color: "#fff",
                      fontSize: "1.7rem",
                      fontWeight: 500,
                      lineHeight: 1.2,
                      fontFamily: '"EB Garamond", Georgia, serif',
                    }}
                  >
                    {HERO_DATA.prizePool}
                  </strong>
                </div>
                <div className="grid gap-1.5">
                  <span
                    style={{
                      color: "rgba(255,222,165,0.82)",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Race Date
                  </span>
                  <strong
                    style={{
                      color: "#fff",
                      fontSize: "1.7rem",
                      fontWeight: 500,
                      lineHeight: 1.2,
                      fontFamily: '"EB Garamond", Georgia, serif',
                    }}
                  >
                    {HERO_DATA.raceDate}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-3">
                <button
                  type="button"
                  className="uppercase cursor-pointer border-0 transition-colors"
                  style={{
                    minWidth: 164,
                    padding: "18px 36px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#fff",
                    background: "#002a15",
                  }}
                >
                  {HERO_DATA.primaryAction}
                </button>
                <button
                  type="button"
                  className="uppercase cursor-pointer transition-colors"
                  style={{
                    minWidth: 164,
                    padding: "18px 36px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#fff",
                    background: "transparent",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.32)",
                  }}
                >
                  {HERO_DATA.secondaryAction}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section
          aria-label="Heritage Racing statistics"
          style={{ background: "#002a15", paddingBlock: 64 }}
        >
          <div
            className="w-full mx-auto px-7 md:px-10 lg:px-16 grid gap-9"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="grid justify-items-center gap-2 text-center">
                <strong
                  style={{
                    color: "#ffdea5",
                    fontSize: "clamp(3rem, 5vw, 4.25rem)",
                    fontWeight: 600,
                    lineHeight: 1,
                    fontFamily: '"EB Garamond", Georgia, serif',
                  }}
                >
                  {stat.value}
                </strong>
                <span
                  style={{
                    color: "rgba(210,245,219,0.82)",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* TOURNAMENTS */}
        <section
          id="tournaments"
          aria-labelledby="tournaments-heading"
          style={{ paddingBlock: "clamp(64px, 9vw, 96px)" }}
        >
          <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
            <div
              className="flex justify-between items-end gap-8"
              style={{ marginBottom: 64 }}
            >
              <div>
                <h2
                  id="tournaments-heading"
                  className="m-0"
                  style={{
                    color: "#002a15",
                    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    fontFamily: '"EB Garamond", Georgia, serif',
                  }}
                >
                  Current Tournaments
                </h2>
                <p
                  className="mt-4 m-0"
                  style={{ width: "min(100%, 420px)", color: "#555e58", fontSize: "1rem", lineHeight: 1.55 }}
                >
                  Join the most prestigious racing circles in the world. Real-time stakes, legendary venues.
                </p>
              </div>
              <a
                href="#all-stakes"
                className="inline-flex items-center gap-2 no-underline whitespace-nowrap"
                style={{
                  paddingBottom: 5,
                  color: "#004225",
                  borderBottom: "1px solid #004225",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "none",
                }}
              >
                View All Stakes
                <ArrowIcon />
              </a>
            </div>

            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
            >
              {TOURNAMENTS.map((t, idx) => {
                const status = getStatus(t.state);
                const statusBg =
                  status.tone === "amber"
                    ? "rgba(255,222,165,0.92)"
                    : status.tone === "green"
                    ? "rgba(0,42,21,0.92)"
                    : "#e7e5dd";
                const statusColor = status.tone === "amber" ? "#263b12" : status.tone === "green" ? "#fff" : "#555e58";
                return (
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
                      style={{ height: 192, background: "#e4e1d7" }}
                    >
                      <img
                        src={TOURNAMENT_IMAGES[idx]}
                        alt={t.title}
                        className="block w-full h-full object-cover"
                      />
                      <span
                        className="absolute"
                        style={{
                          top: 12,
                          right: 12,
                          padding: "6px 12px",
                          borderRadius: 999,
                          background: statusBg,
                          color: statusColor,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          lineHeight: 1.25,
                          textTransform: "uppercase",
                        }}
                      >
                        {status.text}
                      </span>
                    </div>
                    <div className="grid gap-5" style={{ padding: 32 }}>
                      <div>
                        <h3
                          className="m-0"
                          style={{
                            color: "#002a15",
                            fontSize: "1.58rem",
                            fontWeight: 500,
                            lineHeight: 1.25,
                            fontFamily: '"EB Garamond", Georgia, serif',
                          }}
                        >
                          {t.title}
                        </h3>
                        <p
                          className="m-0"
                          style={{ marginTop: 8, color: "#5e655f", fontSize: "0.88rem", lineHeight: 1.45 }}
                        >
                          {t.location}
                        </p>
                      </div>
                      <dl className="m-0 grid gap-3.5" style={{ padding: "4px 0 6px" }}>
                        <div className="flex justify-between items-center gap-4">
                          <dt
                            style={{
                              color: "#747b75",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                            }}
                          >
                            {t.dateLabel}
                          </dt>
                          <dd
                            className="m-0 text-right"
                            style={{
                              color: "#1f231f",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {t.dateValue}
                          </dd>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <dt
                            style={{
                              color: "#747b75",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                            }}
                          >
                            Prize Pool
                          </dt>
                          <dd
                            className="m-0 text-right"
                            style={{
                              color: "#002a15",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {t.prizePool}
                          </dd>
                        </div>
                      </dl>
                      <button
                        type="button"
                        className="w-full cursor-pointer transition-colors"
                        style={{
                          padding: "14px 18px",
                          color: "#002a15",
                          background: "#fff",
                          borderRadius: 2,
                          boxShadow: "inset 0 0 0 1px #002a15",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {t.action}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#3f4541", borderTop: "1px solid rgba(215,211,199,0.1)" }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
          style={{ paddingBlock: 48 }}
        >
          <div>
            <h2
              className="m-0"
              style={{
                color: "#ffdea5",
                fontSize: "1.55rem",
                fontWeight: 500,
                lineHeight: 1.25,
                fontFamily: '"EB Garamond", Georgia, serif',
              }}
            >
              Heritage Racing
            </h2>
            <p
              className="m-0"
              style={{
                marginTop: 8,
                color: "rgba(217,217,217,0.72)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              © 2024 Heritage Racing. All rights reserved.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-7"
            aria-label="Footer navigation"
          >
            <a href="#privacy" className="no-underline" style={{ color: "rgba(217,217,217,0.76)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>Privacy Policy</a>
            <a href="#terms" className="no-underline" style={{ color: "rgba(217,217,217,0.76)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>Terms of Service</a>
            <a href="#support" className="no-underline" style={{ color: "rgba(217,217,217,0.76)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>Contact Support</a>
            <a href="#standings" className="no-underline" style={{ color: "#ffbd6b", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textDecoration: "underline" }}>Global Standings</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
