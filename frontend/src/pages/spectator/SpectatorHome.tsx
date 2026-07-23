import React from 'react';
import { Link } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../../components/spectator/index.ts';
import HomeBanner from '../../assets/images/HomeBanner.png';
import './SpectatorHome.css';

const horsePath = (horseName: string) => `/Spectator/Horses/${horseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M12.18 9H0V7H12.18L6.58 1.4L8 0L16 8L8 16L6.58 14.6L12.18 9Z" fill="currentColor" />
  </svg>
);

const CalendarIcon = () => (
  <span className="spectator-race-card__icon" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 18C4.45 18 3.98 17.8 3.59 17.41C3.2 17.02 3 16.55 3 16V5C3 4.45 3.2 3.98 3.59 3.59C3.98 3.2 4.45 3 5 3H6V1H8V3H12V1H14V3H15C15.55 3 16.02 3.2 16.41 3.59C16.8 3.98 17 4.45 17 5V16C17 16.55 16.8 17.02 16.41 17.41C16.02 17.8 15.55 18 15 18H5ZM5 16H15V8H5V16ZM5 6H15V5H5V6ZM10 13.5C9.58 13.5 9.23 13.35 8.94 13.06C8.65 12.77 8.5 12.42 8.5 12C8.5 11.58 8.65 11.23 8.94 10.94C9.23 10.65 9.58 10.5 10 10.5C10.42 10.5 10.77 10.65 11.06 10.94C11.35 11.23 11.5 11.58 11.5 12C11.5 12.42 11.35 12.77 11.06 13.06C10.77 13.35 10.42 13.5 10 13.5Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

type SpectatorHomeProps = {
  displayName?: string;
  introText?: string;
  upcomingRaces?: Array<{ date: string; title: string; location: string }>;
  horseLeaders?: Array<{ rank: string; name: string; ratio: string; image?: string }>;
  stats?: Array<{ label: string; value: string }>;
  loading?: boolean;
  error?: string;
};

export const SpectatorHome: React.FC<SpectatorHomeProps> = ({
  displayName,
  introText,
  upcomingRaces = [],
  horseLeaders = [],
  stats = [],
  loading = false,
  error,
}) => {
  return (
    <div className="spectator-home">
      <SpectatorHeader />

      <main className="spectator-home__main">
        <section className="spectator-welcome">
          <p className="spectator-eyebrow">Spectator Dashboard</p>
          <h1>{displayName ? `Welcome back, ${displayName}.` : 'Welcome back.'}</h1>
          <p>
            {introText || 'Follow tournaments, discover top horses, and keep up with the latest race schedule.'}
          </p>
        </section>

        <section className="spectator-featured" aria-label="Featured tournament">
          <img src={HomeBanner} alt="Thoroughbreds racing in front of a grandstand" />
          <div className="spectator-featured__overlay">
            <span className="spectator-featured__badge">Ongoing Feature</span>
            <h2>The Royal Heritage Cup</h2>
            <p>
              Experience the pinnacle of equestrian excellence. $1.2M prize pool on the line as the world's most elite
              thoroughbreds compete for the historic Triple Crown.
            </p>
            <div className="spectator-featured__actions">
              <div>
                <span>Prize pool</span>
                <strong>$1,200,000</strong>
              </div>
              <Link to="/Spectator/Tournaments" className="spectator-featured__button">
                View Tournament Details <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        <section className="spectator-section">
          <div className="spectator-section__header">
            <h2>Upcoming Races</h2>
            <Link to="/Spectator/Tournaments" className="spectator-section__link">
              View All Races <ArrowIcon />
            </Link>
          </div>

          <div className="spectator-races-grid">
            {upcomingRaces.map((race) => (
              <article key={race.title} className="spectator-race-card">
                <div className="spectator-race-card__top">
                  <CalendarIcon />
                  <span>{race.date}</span>
                </div>
                <h3>{race.title}</h3>
                <p>{race.location}</p>
                <Link to={`/Spectator/Tournaments/${encodeURIComponent(race.title.toLowerCase().replace(/\s+/g, '-'))}`} className="spectator-race-card__button">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="spectator-dashboard-grid">
          <article className="spectator-panel spectator-leaderboard">
            <div className="spectator-panel__header">
              <h2>Horse Leaderboard</h2>
              <Link to="/Spectator/Horses" aria-label="Open horse leaderboard">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 15L15 3M8 3H15V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            </div>

            <ol className="spectator-leaderboard__list">
              {horseLeaders.map((horse) => (
                <li key={horse.name} className={horse.rank === '01' ? 'is-top' : undefined}>
                  <span className="spectator-leaderboard__rank">{horse.rank}</span>
                  <img src={horse.image} alt={horse.name} />
                  <div>
                    <Link to={horsePath(horse.name)} className="spectator-horse-link">
                      {horse.name}
                    </Link>
                    <span>{horse.ratio}</span>
                  </div>
                </li>
              ))}
            </ol>

            <Link to="/Spectator/Horses" className="spectator-leaderboard__button">
              View Full Rankings
            </Link>
          </article>
        </section>

        <section className="spectator-stats" aria-label="Spectator statistics">
          {stats.map((stat) => (
            <div key={stat.label} className="spectator-stats__item">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </section>
      </main>

      <SpectatorFooter />
    </div>
  );
};

export default SpectatorHome;
