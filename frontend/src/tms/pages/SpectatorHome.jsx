import { useState } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { useApp } from "../AppContext.jsx";
import { RACES_SEED } from "../races.js";
import { INITIAL_HORSES } from "../data.js";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=80&auto=format&fit=crop";

const RACE_COVER_IMAGES = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=900&q=80&auto=format&fit=crop",
];

const INVITE_IMAGE =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80&auto=format&fit=crop";

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 1.5 10 6 3 10.5v-9Z" fill="currentColor" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

export default function SpectatorHome() {
  const { user } = useApp();
  const upcoming = RACES_SEED.filter((r) => r.status === "Upcoming").slice(0, 3);
  const [subEmail, setSubEmail] = useState("");
  const [subDone, setSubDone] = useState(false);
  const [subscribedRaces, setSubscribedRaces] = useState({});

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subEmail && /\S+@\S+\.\S+/.test(subEmail)) {
      setSubDone(true);
      setSubEmail("");
    }
  };

  const toggleSub = (raceId) =>
    setSubscribedRaces((s) => ({ ...s, [raceId]: !s[raceId] }));

  return (
    <SpectatorLayout>
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
                fontFamily: '"EB Garamond", Georgia, serif',
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
              <Link
                to="/spectator/tournaments"
                className="uppercase inline-flex items-center justify-center no-underline"
                style={{
                  minWidth: 180,
                  padding: "18px 36px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#fff",
                  background: "#002a15",
                }}
              >
                Browse Tournaments
              </Link>
              {user ? (
                <Link
                  to="/spectator/bets"
                  className="uppercase inline-flex items-center justify-center no-underline"
                  style={{
                    minWidth: 180,
                    padding: "18px 36px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#fff",
                    background: "transparent",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.32)",
                  }}
                >
                  My Betting History
                </Link>
              ) : (
                <Link
                  to="/"
                  className="uppercase inline-flex items-center justify-center no-underline"
                  style={{
                    minWidth: 180,
                    padding: "18px 36px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#fff",
                    background: "transparent",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.32)",
                  }}
                >
                  Sign In to Bet
                </Link>
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
          {[
            { value: "150+", label: "Tournaments Hosted" },
            { value: "42", label: "Elite Jockeys" },
            { value: "12", label: "Global Hubs" },
            { value: "$24M+", label: "Annual Prize Pool" },
          ].map((s) => (
            <div key={s.label} className="grid justify-items-center gap-2 text-center">
              <strong
                style={{
                  color: "#ffdea5",
                  fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                  fontWeight: 500,
                  lineHeight: 1,
                  fontFamily: '"EB Garamond", Georgia, serif',
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

      {/* LIVE / UPCOMING RACES */}
      <section
        aria-labelledby="live-races-heading"
        style={{ paddingBlock: "clamp(64px, 8vw, 96px)" }}
      >
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="flex justify-between items-end gap-8 flex-wrap"
            style={{ marginBottom: 48 }}
          >
            <div>
              <h2
                id="live-races-heading"
                className="m-0"
                style={{
                  color: "#002a15",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                Live &amp; Upcoming Races
              </h2>
              <p
                className="m-0"
                style={{ marginTop: 12, color: "#555e58", fontSize: "1rem", lineHeight: 1.55, width: "min(100%, 460px)" }}
              >
                Top tournaments, qualified fields, and live odds — all ready for you to place a bet.
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
            {upcoming.map((race, idx) => {
              const horseCount = (race.registrations || []).filter((r) => r.status === "Approved").length;
              const isSub = subscribedRaces[race.id];
              return (
                <article
                  key={race.id}
                  className="bg-white overflow-hidden"
                  style={{
                    border: "1px solid rgba(215,211,199,0.5)",
                    borderRadius: 8,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ height: 196, background: "#e4e1d7" }}
                  >
                    <img
                      src={RACE_COVER_IMAGES[idx % RACE_COVER_IMAGES.length]}
                      alt={race.name}
                      className="block w-full h-full object-cover"
                    />
                    <span
                      className="absolute"
                      style={{
                        top: 14, left: 14,
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: "rgba(0,42,21,0.92)",
                        color: "#ffdea5",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        display: "inline-flex", alignItems: "center", gap: 6,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: "#ffbd6b" }} />
                      {idx === 0 ? "Live Soon" : "Upcoming"}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        top: 14, right: 14,
                        padding: "6px 12px",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.95)",
                        color: "#002a15",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {race.grade}
                    </span>
                  </div>
                  <div className="grid gap-4" style={{ padding: 28 }}>
                    <div>
                      <h3
                        className="m-0"
                        style={{
                          color: "#002a15",
                          fontSize: "1.55rem",
                          fontWeight: 500,
                          lineHeight: 1.2,
                          fontFamily: '"EB Garamond", Georgia, serif',
                        }}
                      >
                        {race.name}
                      </h3>
                      <p
                        className="m-0"
                        style={{ marginTop: 6, color: "#5e655f", fontSize: "0.86rem", lineHeight: 1.5 }}
                      >
                        {race.venue} · {race.distance}m
                      </p>
                    </div>
                    <dl className="m-0 grid gap-2.5" style={{ padding: "4px 0" }}>
                      <div className="flex justify-between items-center">
                        <dt
                          style={{
                            color: "#747b75",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Race Date
                        </dt>
                        <dd
                          className="m-0"
                          style={{
                            color: "#1f231f",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {new Date(race.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} · {race.time}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt
                          style={{
                            color: "#747b75",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Prize Pool
                        </dt>
                        <dd
                          className="m-0"
                          style={{
                            color: "#002a15",
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            letterSpacing: "0.04em",
                          }}
                        >
                          ${race.prizePool.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt
                          style={{
                            color: "#747b75",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Field
                        </dt>
                        <dd
                          className="m-0"
                          style={{
                            color: "#1f231f",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {horseCount} horses
                        </dd>
                      </div>
                    </dl>
                    <div className="flex gap-2.5">
                      <Link
                        to={`/spectator/tournaments/${race.id}`}
                        className="flex-1 inline-flex items-center justify-center no-underline transition-colors"
                        style={{
                          padding: "13px 16px",
                          color: "#fff",
                          background: "#002a15",
                          borderRadius: 2,
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          gap: 8,
                        }}
                      >
                        Place Bet
                        <ArrowRight />
                      </Link>
                      <button
                        type="button"
                        aria-label="Subscribe to race alerts"
                        onClick={() => toggleSub(race.id)}
                        className="cursor-pointer border-0"
                        style={{
                          width: 48,
                          background: isSub ? "#ffdea5" : "#fff",
                          color: "#002a15",
                          boxShadow: "inset 0 0 0 1px " + (isSub ? "transparent" : "#002a15"),
                          borderRadius: 2,
                          fontSize: "1rem",
                        }}
                      >
                        {isSub ? "★" : "☆"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* VIP INVITE CARD */}
            <article
              className="relative overflow-hidden flex flex-col justify-end"
              style={{
                borderRadius: 8,
                minHeight: 520,
                background: "#002a15",
                color: "#fff",
                gridColumn: "span 1",
              }}
            >
              <img
                src={INVITE_IMAGE}
                alt="VIP invitation"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.4 }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,42,21,0.4) 0%, rgba(0,42,21,0.92) 100%)",
                }}
              />
              <div
                className="relative z-10 grid gap-5"
                style={{ padding: 36 }}
              >
                <span
                  className="inline-flex items-center"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 4,
                    background: "rgba(255,222,165,0.16)",
                    color: "#ffdea5",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    alignSelf: "flex-start",
                    gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: "#ffbd6b" }} />
                  VIP Invite
                </span>
                <h3
                  className="m-0"
                  style={{
                    color: "#fff",
                    fontSize: "2rem",
                    fontWeight: 500,
                    lineHeight: 1.15,
                    fontFamily: '"EB Garamond", Georgia, serif',
                  }}
                >
                  Crown Championship 2025
                </h3>
                <p
                  className="m-0"
                  style={{
                    color: "rgba(245,245,244,0.85)",
                    fontSize: "0.95rem",
                    lineHeight: 1.55,
                  }}
                >
                  An exclusive, members-only invitational featuring the top eight stables in the world.
                </p>
                <button
                  type="button"
                  className="uppercase cursor-pointer border-0 inline-flex items-center"
                  style={{
                    alignSelf: "flex-start",
                    padding: "14px 28px",
                    color: "#002a15",
                    background: "#ffdea5",
                    borderRadius: 2,
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    gap: 10,
                  }}
                >
                  Request Invitation
                  <ArrowRight />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FEATURED HORSES */}
      <section
        aria-labelledby="featured-horses-heading"
        style={{ background: "#f0ede4", paddingBlock: "clamp(64px, 8vw, 96px)" }}
      >
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="flex justify-between items-end gap-8 flex-wrap"
            style={{ marginBottom: 48 }}
          >
            <div>
              <h2
                id="featured-horses-heading"
                className="m-0"
                style={{
                  color: "#002a15",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                Featured Horses
              </h2>
              <p
                className="m-0"
                style={{ marginTop: 12, color: "#555e58", fontSize: "1rem", lineHeight: 1.55, width: "min(100%, 460px)" }}
              >
                The thoroughbreds shaping the season — top of the form charts and ready to run.
              </p>
            </div>
            <Link
              to="/spectator/horses"
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
              Browse Registry
              <ArrowRight />
            </Link>
          </div>

          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
          >
            {INITIAL_HORSES.slice(0, 5).map((h) => (
              <Link
                key={h.id}
                to={`/spectator/horses/${h.id}`}
                className="no-underline"
              >
                <article
                  className="bg-white overflow-hidden"
                  style={{
                    border: "1px solid rgba(215,211,199,0.5)",
                    borderRadius: 8,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ height: 168, background: "#e4e1d7" }}
                  >
                    <img
                      src={h.imgUrl}
                      alt={h.name}
                      className="block w-full h-full object-cover"
                    />
                    <span
                      className="absolute"
                      style={{
                        top: 10, right: 10,
                        padding: "4px 10px",
                        borderRadius: 4,
                        background: "#002a15",
                        color: "#ffdea5",
                        fontSize: "0.66rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {h.rating} PTS
                    </span>
                  </div>
                  <div className="grid gap-2" style={{ padding: 18 }}>
                    <h3
                      className="m-0"
                      style={{
                        color: "#002a15",
                        fontSize: "1.08rem",
                        fontWeight: 500,
                        lineHeight: 1.2,
                        fontFamily: '"EB Garamond", Georgia, serif',
                      }}
                    >
                      {h.name}
                    </h3>
                    <p
                      className="m-0"
                      style={{ color: "#5e655f", fontSize: "0.74rem", lineHeight: 1.4 }}
                    >
                      {h.breed} · {h.color}
                    </p>
                    <div className="flex" style={{ marginTop: 6, gap: 4 }}>
                      {h.form.slice(0, 4).map((p, i) => (
                        <span
                          key={i}
                          className="grid place-items-center"
                          style={{
                            width: 22, height: 22, borderRadius: 999,
                            fontSize: "0.66rem", fontWeight: 800,
                            background: p === 1 ? "#ffdea5" : p <= 3 ? "#f4f1e8" : "#f4f1e8",
                            color: p === 1 ? "#002a15" : "#555e58",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section
        aria-labelledby="subscribe-heading"
        style={{ paddingBlock: "clamp(64px, 8vw, 96px)" }}
      >
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid items-center gap-10"
            style={{ gridTemplateColumns: "1.1fr 1fr" }}
          >
            <div>
              <h2
                id="subscribe-heading"
                className="m-0"
                style={{
                  color: "#002a15",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                Get the Race-Day Brief
              </h2>
              <p
                className="m-0"
                style={{ marginTop: 14, color: "#555e58", fontSize: "1rem", lineHeight: 1.6, width: "min(100%, 480px)" }}
              >
                Once a week, receive the fixtures, top contenders, and value odds straight to your inbox. No spam, just the essentials.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-3"
              style={{
                background: "#fff",
                padding: 32,
                borderRadius: 8,
                border: "1px solid rgba(215,211,199,0.5)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <label
                htmlFor="sub-email"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#747b75",
                }}
              >
                Email Address
              </label>
              <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
                <input
                  id="sub-email"
                  type="email"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-4 py-3 text-sm border-0 outline-none font-sans"
                  style={{
                    background: "#f7f6f1",
                    color: "#002a15",
                    borderRadius: 2,
                    minWidth: 200,
                  }}
                />
                <button
                  type="submit"
                  className="uppercase cursor-pointer border-0 inline-flex items-center"
                  style={{
                    padding: "12px 28px",
                    color: "#fff",
                    background: "#002a15",
                    borderRadius: 2,
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    gap: 8,
                  }}
                >
                  Subscribe
                  <ArrowRight />
                </button>
              </div>
              {subDone && (
                <p
                  className="m-0"
                  style={{
                    color: "#166534",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    padding: 10,
                    background: "#dcfce7",
                    borderRadius: 4,
                  }}
                >
                  ✓ You&apos;re on the list. Check your inbox for the next race-day brief.
                </p>
              )}
              <p
                className="m-0"
                style={{ color: "#747b75", fontSize: "0.72rem", lineHeight: 1.4 }}
              >
                By subscribing, you agree to receive race-related updates. Unsubscribe any time.
              </p>
            </form>
          </div>
        </div>
      </section>
    </SpectatorLayout>
  );
}
