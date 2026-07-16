import React from 'react';
import { Link } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../../components/spectator/index.ts';
import HomeBanner from '../../assets/images/HomeBanner.png';
import horse1 from '../../assets/images/horse1.webp';
import horse2 from '../../assets/images/horse2.jpg';
import horse3 from '../../assets/images/horse3.jpg';
import horse4 from '../../assets/images/horse4.jpg';
import horse5 from '../../assets/images/horse5.jpg';
import './SpectatorHome.css';

const upcomingRaces = [
  { date: 'OCT 24, 2024', title: 'Longchamp Grand Prix', location: 'Paris, France' },
  { date: 'OCT 28, 2024', title: 'The Kentucky Invitation', location: 'Louisville, USA' },
  { date: 'NOV 02, 2024', title: 'Sandown Classic', location: 'Melbourne, AUS' },
];

const horseLeaders = [
  { rank: '01', name: 'Midnight Thunder', ratio: '84% WIN RATIO', image: horse1 },
  { rank: '02', name: 'Star Chaser', ratio: '79% WIN RATIO', image: horse2 },
  { rank: '03', name: 'Royal Flush', ratio: '72% WIN RATIO', image: horse3 },
  { rank: '04', name: 'Morning Glory', ratio: '68% WIN RATIO', image: horse4 },
  { rank: '05', name: 'Empire Gold', ratio: '65% WIN RATIO', image: horse5 },
];

const horsePath = (horseName: string) => `/Spectator/Horses/${horseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const recentBets = [
  { race: 'Kensington Sprint', horse: 'Midnight Thunder', amount: '$450.00', status: 'Won' },
  { race: 'The Heritage Oaks', horse: 'Star Chaser', amount: '$1,200.00', status: 'Pending' },
  { race: 'Sunset Derby', horse: 'Royal Flush', amount: '$200.00', status: 'Lost' },
  { race: 'Grand Valley Stakes', horse: 'Morning Glory', amount: '$750.00', status: 'Won' },
];

const stats = [
  { label: 'Total bets placed', value: '48' },
  { label: 'Win rate', value: '64%' },
  { label: 'Total winnings', value: '$12,450' },
];

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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`spectator-bets__status spectator-bets__status--${status.toLowerCase()}`}>
    <span />
    {status}
  </span>
);

type SpectatorHomeProps = {
  upcomingRaces?: typeof upcomingRaces;
  horseLeaders?: typeof horseLeaders;
  recentBets?: typeof recentBets;
  stats?: typeof stats;
  loading?: boolean;
  error?: string;
};

export const SpectatorHome: React.FC<SpectatorHomeProps> = ({ upcomingRaces = [], horseLeaders = [], recentBets = [], stats = [], loading = false, error }) => {
  return (
    <div className="spectator-home">
      <SpectatorHeader />

      <main className="spectator-home__main">
        <section className="spectator-welcome">
          <p className="spectator-eyebrow">Spectator Dashboard</p>
          <h1>Welcome back, Arthur.</h1>
          <p>
            Your betting portfolio is currently outperforming the market by 12%. The Royal Heritage Cup is live, do not
            miss the chance to capitalize on the morning's favorable odds.
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
                <Link to="/Spectator/Tournaments" className="spectator-race-card__button">
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

          <article className="spectator-panel spectator-bets">
            <div className="spectator-panel__header">
              <h2>Recent Bets</h2>
              <Link to="/Spectator/MyBets">History</Link>
            </div>

            <div className="spectator-bets__table" role="table" aria-label="Recent bets">
              <div className="spectator-bets__row spectator-bets__row--head" role="row">
                <span>Race Name</span>
                <span>Horse</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {recentBets.map((bet) => (
                <div className="spectator-bets__row" role="row" key={bet.race}>
                  <strong>{bet.race}</strong>
                  <Link to={horsePath(bet.horse)} className="spectator-horse-link spectator-horse-link--table">
                    {bet.horse}
                  </Link>
                  <strong className="spectator-bets__amount">{bet.amount}</strong>
                  <StatusBadge status={bet.status} />
                  <button aria-label={`Actions for ${bet.race}`} className="spectator-bets__menu">
                    <svg width="4" height="18" viewBox="0 0 4 18" fill="none" aria-hidden="true">
                      <path
                        d="M2 4C2.55 4 3.02 3.8 3.41 3.41C3.8 3.02 4 2.55 4 2C4 1.45 3.8 0.98 3.41 0.59C3.02 0.2 2.55 0 2 0C1.45 0 0.98 0.2 0.59 0.59C0.2 0.98 0 1.45 0 2C0 2.55 0.2 3.02 0.59 3.41C0.98 3.8 1.45 4 2 4ZM2 11C2.55 11 3.02 10.8 3.41 10.41C3.8 10.02 4 9.55 4 9C4 8.45 3.8 7.98 3.41 7.59C3.02 7.2 2.55 7 2 7C1.45 7 0.98 7.2 0.59 7.59C0.2 7.98 0 8.45 0 9C0 9.55 0.2 10.02 0.59 10.41C0.98 10.8 1.45 11 2 11ZM2 18C2.55 18 3.02 17.8 3.41 17.41C3.8 17.02 4 16.55 4 16C4 15.45 3.8 14.98 3.41 14.59C3.02 14.2 2.55 14 2 14C1.45 14 0.98 14.2 0.59 14.59C0.2 14.98 0 15.45 0 16C0 16.55 0.2 17.02 0.59 17.41C0.98 17.8 1.45 18 2 18Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="spectator-stats" aria-label="Betting statistics">
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
