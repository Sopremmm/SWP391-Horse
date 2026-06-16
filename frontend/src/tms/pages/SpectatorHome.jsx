import { useState } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  Button,
  SectionHead,
  StatTile,
  Pill,
  ArrowRight,
} from "../components/spectator/SpectatorUI.jsx";
import {
  FEATURED_RACES,
  TOP_JOCKEYS,
  LATEST_RESULTS,
  SPECTATOR_STATS,
} from "../data/spectatorData.js";

const HERO_BG =
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=85&auto=format&fit=crop";

export default function SpectatorHome() {
  const [featured] = useState(FEATURED_RACES.slice(0, 2));

  return (
    <SpectatorLayout>
      {/* HERO */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "clamp(580px, 82vh, 760px)" }}
      >
        <img
          src={HERO_BG}
          alt="Tour de Hubs"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover", transform: "scale(1.02)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,42,21,0.18) 0%, rgba(0,42,21,0.55) 55%, rgba(0,42,21,0.92) 100%)",
          }}
        />
        <div
          className="relative z-10 w-full mx-auto px-7 md:px-10 lg:px-16"
          style={{ paddingBlock: "112px 56px" }}
        >
          <p
            className="m-0 inline-flex items-center"
            style={{
              color: "#ffdea5",
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <span style={{ width: 48, height: 1, background: "#ffdea5" }} />
            Official Race Schedule — Sept 22, 2024
          </p>
          <h1
            className="m-0"
            style={{
              color: "#fff",
              fontSize: "clamp(3.4rem, 8vw, 6.4rem)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              fontFamily: '"EB Garamond", Georgia, serif',
              maxWidth: 900,
            }}
          >
            Tour de Hubs
          </h1>
          <p
            className="m-0"
            style={{
              marginTop: 22,
              color: "rgba(255,255,255,0.88)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Witness the pinnacle of flat racing across the world&apos;s most prestigious venues.
            Place a bet, follow your favorites, and let the season unfold.
          </p>
          <div className="flex flex-wrap" style={{ gap: 14, marginTop: 32 }}>
            <Button as={Link} to="/spectator/tournaments" variant="ghost" size="lg">
              Place a Bet
              <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* MAIN GRID — Featured Races / Top Jockeys / Latest Results */}
      <section style={{ paddingBlock: "clamp(56px, 8vw, 88px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1.5fr 1fr 1fr",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {/* Featured Races (2 stacked) */}
            <div className="grid" style={{ gap: 24 }}>
              <div className="flex items-end justify-between">
                <h2
                  className="m-0"
                  style={{
                    color: "#002a15",
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    fontFamily: '"EB Garamond", Georgia, serif',
                  }}
                >
                  Featured Races
                </h2>
                <Link
                  to="/spectator/tournaments"
                  className="no-underline"
                  style={{
                    color: "#004225",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    paddingBottom: 4,
                    borderBottom: "1px solid #004225",
                  }}
                >
                  See All
                </Link>
              </div>
              {featured.map((race, idx) => (
                <article
                  key={race.id}
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: 8,
                    minHeight: 260,
                    background: idx === 0 ? "#ffdea5" : "#002a15",
                    color: idx === 0 ? "#002a15" : "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                  }}
                >
                  {idx === 0 ? (
                    <div
                      className="absolute"
                      style={{
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(255,222,165,0.4) 0%, rgba(255,222,165,0.95) 70%)",
                      }}
                    />
                  ) : null}
                  <div className="relative z-10">
                    <Pill tone={idx === 0 ? "dark" : "gold"}>
                      {race.badge}
                    </Pill>
                    <h3
                      className="m-0"
                      style={{
                        marginTop: 12,
                        fontSize: "1.6rem",
                        fontWeight: 500,
                        lineHeight: 1.15,
                        fontFamily: '"EB Garamond", Georgia, serif',
                      }}
                    >
                      {race.name}
                    </h3>
                    <p
                      className="m-0"
                      style={{
                        marginTop: 6,
                        fontSize: "0.82rem",
                        opacity: 0.85,
                      }}
                    >
                      {race.location} · {race.classLine}
                    </p>
                    <div className="flex items-center" style={{ gap: 12, marginTop: 14 }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          opacity: 0.75,
                        }}
                      >
                        Prize
                      </span>
                      <strong
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          fontFamily: '"EB Garamond", Georgia, serif',
                        }}
                      >
                        {race.prizePool}
                      </strong>
                    </div>
                    <Link
                      to={`/spectator/tournaments/${race.id}`}
                      className="no-underline inline-flex items-center"
                      style={{
                        marginTop: 18,
                        color: idx === 0 ? "#002a15" : "#ffdea5",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        paddingBottom: 4,
                        borderBottom: `1px solid ${idx === 0 ? "#002a15" : "#ffdea5"}`,
                        gap: 8,
                      }}
                    >
                      Place a Bet
                      <ArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Top Jockeys */}
            <div>
              <h2
                className="m-0"
                style={{
                  color: "#002a15",
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  fontFamily: '"EB Garamond", Georgia, serif',
                  marginBottom: 18,
                }}
              >
                Top Jockeys
              </h2>
              <div className="grid" style={{ gap: 12 }}>
                {TOP_JOCKEYS.map((j) => (
                  <article
                    key={j.name}
                    className="bg-white flex items-center"
                    style={{
                      gap: 14,
                      padding: 16,
                      border: "1px solid rgba(215,211,199,0.5)",
                      borderRadius: 8,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                        overflow: "hidden",
                        background: "#e4e1d7",
                        flex: "0 0 auto",
                      }}
                    >
                      <img
                        src={j.image}
                        alt={j.name}
                        className="block w-full h-full"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong
                        style={{
                          display: "block",
                          color: "#002a15",
                          fontSize: "1rem",
                          fontWeight: 500,
                          fontFamily: '"EB Garamond", Georgia, serif',
                        }}
                      >
                        {j.name}
                      </strong>
                      <p
                        className="m-0"
                        style={{
                          color: "#747b75",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          marginTop: 2,
                        }}
                      >
                        Rank #{j.rank} · {j.winRate} Win Rate
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: 4,
                        background: "#002a15",
                        color: "#ffdea5",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {j.rides}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Latest Results */}
            <div>
              <h2
                className="m-0"
                style={{
                  color: "#002a15",
                  fontSize: "1.6rem",
                  fontWeight: 500,
                  fontFamily: '"EB Garamond", Georgia, serif',
                  marginBottom: 18,
                }}
              >
                Latest Results
              </h2>
              <div
                className="bg-white"
                style={{
                  border: "1px solid rgba(215,211,199,0.5)",
                  borderRadius: 8,
                  padding: 8,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                {LATEST_RESULTS.map((r, i) => (
                  <div
                    key={r.race}
                    className="flex items-center"
                    style={{
                      gap: 12,
                      padding: 14,
                      borderBottom:
                        i === LATEST_RESULTS.length - 1
                          ? "none"
                          : "1px solid rgba(215,211,199,0.45)",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        background:
                          i === 0 ? "#ffdea5" : i === 1 ? "#e7e5e4" : "#002a15",
                        color: i === 2 ? "#ffdea5" : "#002a15",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        flex: "0 0 auto",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong
                        style={{
                          display: "block",
                          color: "#002a15",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                        }}
                      >
                        {r.race}
                      </strong>
                      <p
                        className="m-0"
                        style={{
                          color: "#747b75",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          marginTop: 2,
                        }}
                      >
                        {r.winner} · {r.time}
                      </p>
                    </div>
                    <span
                      style={{
                        color: "#002a15",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                      }}
                    >
                      {r.payout}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINED FOR GREATNESS — split dark CTA banner */}
      <section
        aria-label="Destined for greatness"
        className="relative overflow-hidden"
        style={{
          background: "#002a15",
          color: "#fff",
        }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            minHeight: 320,
            alignItems: "stretch",
          }}
        >
          <div
            className="flex flex-col justify-center"
            style={{ padding: "48px clamp(24px, 5vw, 56px)" }}
          >
            <p
              className="m-0"
              style={{
                color: "#ffbd6b",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Destined for Greatness
            </p>
            <h2
              className="m-0"
              style={{
                color: "#fff",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.05,
                fontFamily: '"EB Garamond", Georgia, serif',
              }}
            >
              The Prestige Cup awaits
            </h2>
            <p
              className="m-0"
              style={{
                marginTop: 14,
                color: "rgba(255,255,255,0.78)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                width: "min(100%, 480px)",
              }}
            >
              Twelve of the finest three-year-olds gather at Epsom Downs. The £5M purse
              and a permanent place in racing history are on the line.
            </p>
            <div style={{ marginTop: 28 }}>
              <Link
                to="/spectator/tournaments/derby-invitational"
                className="uppercase inline-flex items-center no-underline"
                style={{
                  padding: "14px 28px",
                  background: "#ffdea5",
                  color: "#002a15",
                  borderRadius: 2,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  gap: 8,
                }}
              >
                Discover the Field
                <ArrowRight />
              </Link>
            </div>
          </div>
          <div
            className="relative"
            style={{ minHeight: 320, background: "#0c0a08" }}
          >
            <img
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=85&auto=format&fit=crop"
              alt="The Prestige Cup"
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "cover", opacity: 0.85 }}
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        aria-label="Heritage Racing statistics"
        style={{ background: "#f0ede4", paddingBlock: "clamp(48px, 7vw, 72px)" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid"
          style={{
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          <StatTile value="1,248" label="Registered Horses" sub="Across all disciplines" />
          <StatTile value="42" label="Elite Jockeys" sub="Master & Champion tier" />
          <StatTile value="150+" label="Tournaments Hosted" sub="This decade" />
          <StatTile value="$24M" label="Annual Prize Pool" sub="Across all series" />
        </div>
      </section>
    </SpectatorLayout>
  );
}
