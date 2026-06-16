import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import {
  FEATURED_RACES,
  TOP_JOCKEYS,
  LATEST_RESULTS,
  SPECTATOR_STATS,
} from "../data/spectatorData.js";

const HERO_BG =
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=85&auto=format&fit=crop";

const HERO_IMAGE_2 =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=85&auto=format&fit=crop";

function ArrowRight({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

export default function SpectatorHome() {
  const featured = FEATURED_RACES.slice(0, 2);

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* HERO */}
        <section className="spectator__hero" aria-labelledby="spectator-home-title">
          <img src={HERO_BG} alt="Tour de Hubs" className="spectator__hero-image" />
          <div className="spectator__hero-gradient" />
          <div className="shell spectator__hero-inner">
            <p className="spectator__eyebrow">
              <span />
              Official Race Schedule — Sept 22, 2024
            </p>
            <h1 id="spectator-home-title">Tour de Hubs</h1>
            <p className="spectator__hero-text">
              Witness the pinnacle of flat racing across the world&apos;s most prestigious venues.
              Place a bet, follow your favorites, and let the season unfold.
            </p>
            <div className="spectator__facts">
              <div>
                <span>Total Prize Pool</span>
                <strong>$24,000,000</strong>
              </div>
              <div>
                <span>Race Date</span>
                <strong>Oct 15, 2024</strong>
              </div>
            </div>
            <div className="spectator__hero-actions">
              <Link to="/spectator/tournaments" className="spectator__btn spectator__btn--primary">
                Place a Bet
                <span style={{ marginLeft: 10 }}><ArrowRight /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3-COL MAIN GRID */}
        <section className="spectator__section">
          <div className="shell">
            <div className="spectator__home-grid">
              {/* Featured Races */}
              <div className="spectator__home-col">
                <div className="spectator__featured-stack__head">
                  <h2>Featured Races</h2>
                  <Link to="/spectator/tournaments" className="spectator__text-link">
                    See All
                    <ArrowRight />
                  </Link>
                </div>
                <div className="spectator__featured-stack">
                  {featured.map((race, idx) => (
                    <article
                      key={race.id}
                      className={
                        idx === 0
                          ? "spectator__featured-card spectator__featured-card--gold"
                          : "spectator__featured-card spectator__featured-card--dark"
                      }
                    >
                      <div className="spectator__featured-card__inner">
                        <span className="spectator__pill spectator__pill--dark">{race.badge}</span>
                        <h3>{race.name}</h3>
                        <p className="spectator__featured-card__meta">
                          {race.location} · {race.classLine}
                        </p>
                        <div className="spectator__featured-card__prize">
                          <span>Prize</span>
                          <strong>{race.prizePool}</strong>
                        </div>
                        <Link
                          to={`/spectator/tournaments/${race.id}`}
                          className="spectator__featured-card__cta"
                        >
                          Place a Bet
                          <ArrowRight />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Top Jockeys */}
              <div className="spectator__home-col">
                <h2>Top Jockeys</h2>
                {TOP_JOCKEYS.map((j) => (
                  <article key={j.name} className="spectator__top-jockey">
                    <div className="spectator__top-jockey__avatar">
                      <img src={j.image} alt={j.name} />
                    </div>
                    <div className="spectator__top-jockey__name">
                      <strong>{j.name}</strong>
                      <p>Rank #{j.rank} · {j.winRate} Win Rate</p>
                    </div>
                    <span className="spectator__top-jockey__tag">{j.rides}</span>
                  </article>
                ))}
              </div>

              {/* Latest Results */}
              <div className="spectator__home-col">
                <h2>Latest Results</h2>
                <div className="spectator__results">
                  {LATEST_RESULTS.map((r, i) => (
                    <div className="spectator__result-row" key={r.race}>
                      <div
                        className="spectator__result-row__index"
                        style={{
                          background: i === 0 ? "#ffdea5" : i === 1 ? "#e7e5e4" : "#002a15",
                          color: i === 2 ? "#ffdea5" : "#002a15",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="spectator__result-row__name">
                        <strong>{r.race}</strong>
                        <p>{r.winner} · {r.time}</p>
                      </div>
                      <span className="spectator__result-row__payout">{r.payout}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESTINED FOR GREATNESS */}
        <section className="spectator__split-banner" aria-label="Destined for greatness">
          <div className="shell">
            <div className="spectator__split-banner__inner">
              <div className="spectator__split-banner__copy">
                <p className="spectator__eyebrow" style={{ color: "#ffbd6b" }}>
                  <span style={{ background: "#ffbd6b" }} />
                  Destined for Greatness
                </p>
                <h2>The Prestige Cup awaits</h2>
                <p>
                  Twelve of the finest three-year-olds gather at Epsom Downs. The $5M purse
                  and a permanent place in racing history are on the line.
                </p>
                <div className="actions">
                  <Link
                    to="/spectator/tournaments/derby-invitational"
                    className="spectator__btn spectator__btn--gold"
                  >
                    Discover the Field
                    <span style={{ marginLeft: 10 }}><ArrowRight /></span>
                  </Link>
                </div>
              </div>
              <div className="spectator__split-banner__image">
                <img src={HERO_IMAGE_2} alt="The Prestige Cup" />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="spectator__stats" aria-label="Heritage Racing statistics">
          <div className="shell">
            <div className="spectator__stats-grid">
              <div className="spectator__stat">
                <strong>1,248</strong>
                <span>Registered Horses</span>
              </div>
              <div className="spectator__stat">
                <strong>42</strong>
                <span>Elite Jockeys</span>
              </div>
              <div className="spectator__stat">
                <strong>150+</strong>
                <span>Tournaments Hosted</span>
              </div>
              <div className="spectator__stat">
                <strong>$24M</strong>
                <span>Annual Prize Pool</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SpectatorLayout>
  );
}
