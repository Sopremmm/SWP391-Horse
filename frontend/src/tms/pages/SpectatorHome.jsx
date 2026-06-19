import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SpectatorLayout from '../components/spectator/SpectatorLayout.jsx';
import {
  TEST_FEATURED_RACES,
  TEST_JOCKEYS,
  TEST_RACES,
} from '../data/spectatorTestData.js';
import { ParticleOverlay } from '../components/spectator/SpectatorEffects.jsx';
import './SpectatorHome.css';

const HERO_BG =
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=85&auto=format&fit=crop';

const HERO_IMAGE_2 =
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=85&auto=format&fit=crop';

function ArrowRight({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
    </svg>
  );
}

export default function SpectatorHome() {
  const featured = TEST_FEATURED_RACES.slice(0, 2);

  // Build latest results from finished races
  const latestResults = TEST_RACES
    .filter((r) => r.status === 'Finished')
    .map((r) => ({
      race: r.name,
      venue: r.venue,
      winner: r.winner?.horseName || r.registrations?.[0]?.horseName || 'TBD',
      time: '--:--',
      payout: r.winner ? `$${(r.prizePool / 1000).toFixed(0)}K` : '-',
    }));

  // Top jockeys for display
  const topJockeys = TEST_JOCKEYS.slice(0, 2).map((j) => ({
    name: j.name,
    rank: TEST_JOCKEYS.indexOf(j) + 1,
    winRate: `${j.winRate}%`,
    rides: `${j.careerWins} Wins`,
    image: j.image,
  }));

  return (
    <SpectatorLayout>
      <div className="spec-home">
        {/* ─── HERO ──────────────────────────────────────── */}
        <section className="spec-hero" aria-labelledby="spec-home-title">
          <div className="spec-hero__media">
            <img src={HERO_BG} alt="Tour de Hubs racing" className="spec-hero__img" />
            <div className="spec-hero__overlay" />
          </div>
          <ParticleOverlay count={18} />
          <div className="shell spec-hero__content">
            <p className="spec-hero__eyebrow">
              <span className="spec-hero__eyebrow-line" />
              Official Race Schedule — Sept 22, 2024
            </p>
            <h1 id="spec-home-title" className="spec-hero__title">
              Tour de Hubs
            </h1>
            <p className="spec-hero__subtitle">
              Witness the pinnacle of flat racing across the world's most prestigious venues.
              Place a bet, follow your favorites, and let the season unfold.
            </p>

            <div className="spec-hero__facts">
              <div className="spec-hero__fact">
                <span className="spec-hero__fact-label">Total Prize Pool</span>
                <strong className="spec-hero__fact-value">$24,000,000</strong>
              </div>
              <div className="spec-hero__fact">
                <span className="spec-hero__fact-label">Race Date</span>
                <strong className="spec-hero__fact-value">Oct 15, 2024</strong>
              </div>
            </div>

            <div className="spec-hero__actions">
              <Link to="/spectator/live" className="spec-btn spec-btn--gold spec-btn--lg">
                <span className="spec-live-dot" />
                Watch Live
              </Link>
              <Link to="/spectator/tournaments" className="spec-btn spec-btn--ghost spec-btn--lg">
                Place a Bet <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 3-COLUMN CONTENT GRID ─────────────────────── */}
        <section className="spec-home__content">
          <div className="shell">
            <div className="spec-home__grid">

              {/* Featured Races */}
              <div className="spec-home__panel">
                <div className="spec-home__panel-head">
                  <p className="spec-panel__eyebrow">
                    <span className="spec-panel__eyebrow-line" />
                    Featured Races
                  </p>
                  <Link to="/spectator/tournaments" className="spec-home__see-all">
                    See All <ArrowRight />
                  </Link>
                </div>
                <div className="spec-featured-stack">
                  {featured.map((race, idx) => (
                    <article key={race.id} className={`spec-featured-card spec-featured-card--${idx === 0 ? 'gold' : 'dark'}`}>
                      <div className="spec-featured-card__inner">
                        <span className="spec-pill spec-pill--dark">{race.badge}</span>
                        <h3 className="spec-featured-card__title">{race.name}</h3>
                        <p className="spec-featured-card__meta">
                          {race.location} &middot; {race.classLine}
                        </p>
                        <div className="spec-featured-card__footer">
                          <div className="spec-featured-card__prize">
                            <span>Prize</span>
                            <strong>{race.prizePool}</strong>
                          </div>
                          <Link
                            to={`/spectator/tournaments/${race.id}`}
                            className="spec-featured-card__cta"
                          >
                            Place a Bet <ArrowRight />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Top Jockeys */}
              <div className="spec-home__panel">
                <div className="spec-home__panel-head">
                  <p className="spec-panel__eyebrow">
                    <span className="spec-panel__eyebrow-line" />
                    Top Jockeys
                  </p>
                  <Link to="/spectator/jockeys" className="spec-home__see-all">
                    View All <ArrowRight />
                  </Link>
                </div>
                <div className="spec-jockey-list">
                  {topJockeys.map((j) => (
                    <article key={j.name} className="spec-jockey-row">
                      <div className="spec-jockey-row__avatar">
                        <img src={j.image} alt={j.name} />
                      </div>
                      <div className="spec-jockey-row__info">
                        <strong>{j.name}</strong>
                        <p>Rank #{j.rank} &middot; {j.winRate} Win Rate</p>
                      </div>
                      <span className="spec-jockey-row__tag">{j.rides}</span>
                    </article>
                  ))}
                </div>
                <Link to="/spectator/jockeys" className="spec-home__see-all-inline">
                  View all jockeys <ArrowRight />
                </Link>
              </div>

              {/* Latest Results */}
              <div className="spec-home__panel">
                <div className="spec-home__panel-head">
                  <p className="spec-panel__eyebrow">
                    <span className="spec-panel__eyebrow-line" />
                    Latest Results
                  </p>
                  <Link to="/spectator/bets" className="spec-home__see-all">
                    History <ArrowRight />
                  </Link>
                </div>
                <div className="spec-results-list">
                  {latestResults.map((r, i) => (
                    <div key={r.race} className="spec-result-row">
                      <div
                        className="spec-result-row__pos"
                        style={{
                          background: i === 0 ? '#ffdea5' : i === 1 ? '#e7e5e4' : '#002a15',
                          color: i === 2 ? '#ffdea5' : '#002a15',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="spec-result-row__info">
                        <strong>{r.race}</strong>
                        <p>{r.winner} &middot; {r.time}</p>
                      </div>
                      <span className="spec-result-row__payout">{r.payout}</span>
                    </div>
                  ))}
                </div>
                <Link to="/spectator/bets" className="spec-home__see-all-inline">
                  Full betting history <ArrowRight />
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ─── SPLIT BANNER ─────────────────────────────── */}
        <section className="spec-split" aria-label="Destined for Greatness">
          <div className="shell">
            <div className="spec-split__inner">
              <div className="spec-split__copy">
                <p className="spec-split__eyebrow">
                  <span className="spec-split__eyebrow-line" />
                  Destined for Greatness
                </p>
                <h2 className="spec-split__heading">The Prestige Cup awaits</h2>
                <p className="spec-split__text">
                  Twelve of the finest three-year-olds gather at Epsom Downs. The $5M purse
                  and a permanent place in racing history are on the line.
                </p>
                <Link
                  to="/spectator/tournaments/derby-invitational"
                  className="spec-btn spec-btn--gold spec-btn--lg"
                >
                  Discover the Field <ArrowRight />
                </Link>
              </div>
              <div className="spec-split__media">
                <img src={HERO_IMAGE_2} alt="The Prestige Cup" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS ─────────────────────────────────────── */}
        <section className="spec-stats" aria-label="Heritage Racing statistics">
          <div className="shell">
            <div className="spec-stats__grid">
              {[
                { num: '1,248', label: 'Registered Horses', icon: '🐎' },
                { num: '42', label: 'Elite Jockeys', icon: '🏇' },
                { num: '150+', label: 'Tournaments Hosted', icon: '🏆' },
                { num: '$24M', label: 'Annual Prize Pool', icon: '💰' },
              ].map((s) => (
                <div key={s.label} className="spec-stat-item">
                  <span className="spec-stat-item__icon" aria-hidden="true">{s.icon}</span>
                  <strong className="spec-stat-item__num">{s.num}</strong>
                  <span className="spec-stat-item__label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SpectatorLayout>
  );
}
