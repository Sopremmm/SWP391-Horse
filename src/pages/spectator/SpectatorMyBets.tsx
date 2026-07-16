import React from 'react';
import { Link } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../../components/spectator/index.ts';
import horse1 from '../../assets/images/horse1.webp';
import horse2 from '../../assets/images/horse2.jpg';
import horse3 from '../../assets/images/horse3.jpg';
import horse4 from '../../assets/images/horse4.jpg';
import horse5 from '../../assets/images/horse5.jpg';
import './SpectatorMyBets.css';

type BetStatus = 'Winning' | 'Lost' | 'Pending';
type BetState = 'Closed' | 'Open';

type BetRow = {
  state: BetState;
  race: string;
  horse: string;
  type: string;
  amount: string;
  status: BetStatus;
  payout: string;
  image?: string;
  icon?: 'oak' | 'paw' | 'medal' | 'star' | 'bolt' | 'cup';
};

const summaryStats = [
  { label: 'Total Bets', value: '142', note: '+12.4% vs last month', icon: 'receipt' },
  { label: 'Win Rate (%)', value: '34.2%', note: 'Top 5% of spectators', icon: 'chart' },
  { label: 'Total Winnings', value: '$15,240.00', note: 'Available for withdrawal', icon: 'wallet' },
];

const bets: BetRow[] = [
  {
    state: 'Closed',
    race: 'Kensington Sprint',
    horse: 'Royal Galloper',
    type: 'Win',
    amount: '$250.00',
    status: 'Winning',
    payout: '$1,250.00',
    image: horse1,
  },
  {
    state: 'Closed',
    race: 'Highland Derby',
    horse: 'Silver Streak',
    type: 'Each-Way',
    amount: '$100.00',
    status: 'Lost',
    payout: '$0.00',
    image: horse2,
  },
  {
    state: 'Open',
    race: 'Emerald Vase',
    horse: 'Sovereign Oak',
    type: 'Place',
    amount: '$500.00',
    status: 'Pending',
    payout: '-',
    icon: 'oak',
  },
  {
    state: 'Closed',
    race: 'Autumn Cup',
    horse: 'Night Shadow',
    type: 'Win',
    amount: '$150.00',
    status: 'Winning',
    payout: '$900.00',
    image: horse4,
  },
  {
    state: 'Closed',
    race: 'Derby Sprint',
    horse: 'Golden Mane',
    type: 'Win',
    amount: '$200.00',
    status: 'Lost',
    payout: '$0.00',
    icon: 'paw',
  },
  {
    state: 'Closed',
    race: 'Royal Ascot',
    horse: 'Noble Steed',
    type: 'Each-Way',
    amount: '$300.00',
    status: 'Winning',
    payout: '$1,800.00',
    icon: 'medal',
  },
  {
    state: 'Open',
    race: 'Golden Gate',
    horse: 'Starlight',
    type: 'Place',
    amount: '$100.00',
    status: 'Pending',
    payout: '-',
    icon: 'star',
  },
  {
    state: 'Closed',
    race: 'Heritage Oaks',
    horse: 'Iron Heart',
    type: 'Win',
    amount: '$400.00',
    status: 'Winning',
    payout: '$2,400.00',
    image: horse3,
  },
  {
    state: 'Closed',
    race: 'Silver Cup',
    horse: 'Thunder Bolt',
    type: 'Win',
    amount: '$150.00',
    status: 'Lost',
    payout: '$0.00',
    image: horse5,
  },
  {
    state: 'Closed',
    race: 'Grand National',
    horse: 'Champion',
    type: 'Each-Way',
    amount: '$500.00',
    status: 'Winning',
    payout: '$3,500.00',
    icon: 'cup',
  },
];
void bets;

const horsePath = (horseName: string) =>
  `/Spectator/Horses/${horseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const SummaryIcon: React.FC<{ icon: string }> = ({ icon }) => {
  if (icon === 'chart') {
    return (
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <path d="M6 48V18H20V6H34V24H48V48H6ZM12 42H20V24H12V42ZM26 42H34V12H26V42ZM40 42H48V30H40V42Z" fill="currentColor" />
      </svg>
    );
  }

  if (icon === 'wallet') {
    return (
      <svg width="56" height="54" viewBox="0 0 56 54" fill="none" aria-hidden="true">
        <path
          d="M6 48C4.35 48 2.94 47.41 1.76 46.24C0.59 45.06 0 43.65 0 42V12C0 10.35 0.59 8.94 1.76 7.76C2.94 6.59 4.35 6 6 6H46C47.65 6 49.06 6.59 50.24 7.76C51.41 8.94 52 10.35 52 12V18H46V12H6V42H46V36H52V42C52 43.65 51.41 45.06 50.24 46.24C49.06 47.41 47.65 48 46 48H6ZM30 38C28.35 38 26.94 37.41 25.76 36.24C24.59 35.06 24 33.65 24 32V22C24 20.35 24.59 18.94 25.76 17.76C26.94 16.59 28.35 16 30 16H54V38H30ZM30 32H48V22H30V32ZM38 30C38.83 30 39.54 29.71 40.12 29.12C40.71 28.54 41 27.83 41 27C41 26.17 40.71 25.46 40.12 24.88C39.54 24.29 38.83 24 38 24C37.17 24 36.46 24.29 35.88 24.88C35.29 25.46 35 26.17 35 27C35 27.83 35.29 28.54 35.88 29.12C36.46 29.71 37.17 30 38 30Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <path
        d="M10 50C7.8 50 5.92 49.22 4.34 47.66C2.78 46.08 2 44.2 2 42V34H10V4L14 8L18 4L22 8L26 4L30 8L34 4L38 8L42 4L50 12V42C50 44.2 49.22 46.08 47.66 47.66C46.08 49.22 44.2 50 42 50H10ZM42 44C42.55 44 43.02 43.8 43.41 43.41C43.8 43.02 44 42.55 44 42V14H16V34H38V42C38 42.55 38.2 43.02 38.59 43.41C38.98 43.8 39.45 44 40 44H42ZM20 22V16H34V22H20ZM20 30V24H34V30H20ZM10 44H32V40H8V42C8 42.55 8.2 43.02 8.59 43.41C8.98 43.8 9.45 44 10 44Z"
        fill="currentColor"
      />
    </svg>
  );
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M16.6 18L10.3 11.7C9.8 12.1 9.23 12.42 8.58 12.65C7.93 12.88 7.23 13 6.5 13C4.68 13 3.15 12.37 1.89 11.11C0.63 9.85 0 8.32 0 6.5C0 4.68 0.63 3.15 1.89 1.89C3.15 0.63 4.68 0 6.5 0C8.32 0 9.85 0.63 11.11 1.89C12.37 3.15 13 4.68 13 6.5C13 7.23 12.88 7.93 12.65 8.58C12.42 9.23 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81 10.56 9.69 9.69C10.56 8.81 11 7.75 11 6.5C11 5.25 10.56 4.19 9.69 3.31C8.81 2.44 7.75 2 6.5 2C5.25 2 4.19 2.44 3.31 3.31C2.44 4.19 2 5.25 2 6.5C2 7.75 2.44 8.81 3.31 9.69C4.19 10.56 5.25 11 6.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const FilterIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
    <path d="M4.5 8V6.67H7.17V8H4.5ZM1.83 4.67V3.33H9.83V4.67H1.83ZM0 1.33V0H12V1.33H0Z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M5.1 8.6L9.2 4.5L8.25 3.55L5.1 6.7L3.75 5.35L2.8 6.3L5.1 8.6ZM6 12C5.17 12 4.39 11.84 3.66 11.52C2.93 11.21 2.3 10.78 1.76 10.24C1.22 9.7 0.79 9.07 0.48 8.34C0.16 7.61 0 6.83 0 6C0 5.17 0.16 4.39 0.48 3.66C0.79 2.93 1.22 2.3 1.76 1.76C2.3 1.22 2.93 0.79 3.66 0.48C4.39 0.16 5.17 0 6 0C6.83 0 7.61 0.16 8.34 0.48C9.07 0.79 9.7 1.22 10.24 1.76C10.78 2.3 11.21 2.93 11.52 3.66C11.84 4.39 12 5.17 12 6C12 6.83 11.84 7.61 11.52 8.34C11.21 9.07 10.78 9.7 10.24 10.24C9.7 10.78 9.07 11.21 8.34 11.52C7.61 11.84 6.83 12 6 12Z"
      fill="currentColor"
    />
  </svg>
);

const MiniHorseIcon: React.FC<{ type?: BetRow['icon'] }> = ({ type }) => {
  const paths: Record<NonNullable<BetRow['icon']>, string> = {
    oak: 'M10 19V15.4C8.17 15 6.67 14.1 5.5 12.7C4.33 11.3 3.75 9.7 3.75 7.9C3.75 5.95 4.44 4.31 5.82 2.97C7.21 1.62 8.93 0.95 11 0.95C13.07 0.95 14.79 1.62 16.18 2.97C17.56 4.31 18.25 5.95 18.25 7.9C18.25 9.7 17.67 11.3 16.5 12.7C15.33 14.1 13.83 15 12 15.4V19H10ZM7.3 9.15H14.7L11 3.85L7.3 9.15Z',
    paw: 'M6.5 10.5C5.53 10.5 4.71 10.16 4.02 9.48C3.34 8.79 3 7.97 3 7C3 6.03 3.34 5.21 4.02 4.52C4.71 3.84 5.53 3.5 6.5 3.5C7.47 3.5 8.29 3.84 8.98 4.52C9.66 5.21 10 6.03 10 7C10 7.97 9.66 8.79 8.98 9.48C8.29 10.16 7.47 10.5 6.5 10.5ZM13.5 10.5C12.53 10.5 11.71 10.16 11.02 9.48C10.34 8.79 10 7.97 10 7C10 6.03 10.34 5.21 11.02 4.52C11.71 3.84 12.53 3.5 13.5 3.5C14.47 3.5 15.29 3.84 15.98 4.52C16.66 5.21 17 6.03 17 7C17 7.97 16.66 8.79 15.98 9.48C15.29 10.16 14.47 10.5 13.5 10.5ZM10 20C8.33 20 6.92 19.42 5.75 18.25C4.58 17.08 4 15.67 4 14C4 12.33 4.58 10.92 5.75 9.75C6.92 8.58 8.33 8 10 8C11.67 8 13.08 8.58 14.25 9.75C15.42 10.92 16 12.33 16 14C16 15.67 15.42 17.08 14.25 18.25C13.08 19.42 11.67 20 10 20Z',
    medal: 'M8 20V13.8C6.53 13.4 5.33 12.6 4.4 11.4C3.47 10.2 3 8.83 3 7.3V1H17V7.3C17 8.83 16.53 10.2 15.6 11.4C14.67 12.6 13.47 13.4 12 13.8V20H8ZM7 5H13V3H7V5ZM7 9H13V7H7V9ZM10 12C10.8 12 11.5 11.73 12.1 11.2C12.7 10.67 13.07 10 13.2 9.2H6.8C6.93 10 7.3 10.67 7.9 11.2C8.5 11.73 9.2 12 10 12Z',
    star: 'M5.9 18L7 12.15L2.5 8.2L8.42 7.45L10 2L11.58 7.45L17.5 8.2L13 12.15L14.1 18L10 14.95L5.9 18Z',
    bolt: 'M7.5 20L9 13H4L12.5 0L11 8H16L7.5 20Z',
    cup: 'M6 20V14.6C4.53 14.27 3.33 13.5 2.4 12.3C1.47 11.1 1 9.73 1 8.2V3H6V1H14V3H19V8.2C19 9.73 18.53 11.1 17.6 12.3C16.67 13.5 15.47 14.27 14 14.6V20H6ZM4 8.2C4 8.93 4.18 9.58 4.55 10.15C4.92 10.72 5.4 11.17 6 11.5V6H4V8.2ZM14 11.5C14.6 11.17 15.08 10.72 15.45 10.15C15.82 9.58 16 8.93 16 8.2V6H14V11.5Z',
  };

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d={paths[type || 'star']} fill="currentColor" />
    </svg>
  );
};

const StatusBadge: React.FC<{ status: BetStatus }> = ({ status }) => (
  <span className={`spectator-mybets-status is-${status.toLowerCase()}`}>
    <CheckIcon />
    {status}
  </span>
);

type SpectatorMyBetsProps = { bets?: BetRow[]; summaryStats?: typeof summaryStats; loading?: boolean; error?: string };

export const SpectatorMyBets: React.FC<SpectatorMyBetsProps> = ({ bets = [], summaryStats = [], loading = false, error }) => {
  return (
    <div className="spectator-mybets-page">
      <SpectatorHeader showFunds={false} />

      <main className="spectator-mybets-main">
        <section className="spectator-mybets-heading">
          <h1>Betting History</h1>
          <p>Track your performance, analyze your wagering patterns, and manage your active stakes across the heritage racing circuit.</p>
        </section>

        <section className="spectator-mybets-summary" aria-label="Betting summary">
          {summaryStats.map((stat) => (
            <article className="spectator-mybets-stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.note}</p>
              <i>
                <SummaryIcon icon={stat.icon} />
              </i>
            </article>
          ))}
        </section>

        <section className="spectator-mybets-toolbar" aria-label="Bet filters">
          <div className="spectator-mybets-tabs" role="tablist" aria-label="Bet status">
            {['All Bets', 'Winning', 'Lost', 'Pending'].map((filter, index) => (
              <button type="button" className={index === 0 ? 'is-active' : undefined} key={filter}>
                {filter}
              </button>
            ))}
          </div>

          <div className="spectator-mybets-searchbar">
            <label className="spectator-mybets-search">
              <SearchIcon />
              <input type="search" placeholder="Search race or horse..." aria-label="Search race or horse" />
            </label>
            <button type="button" className="spectator-mybets-filter">
              <FilterIcon />
              Filter
            </button>
          </div>
        </section>

        <section className="spectator-mybets-card" aria-label="Betting history table">
          <div className="spectator-mybets-table" role="table">
            <div className="spectator-mybets-row spectator-mybets-row--head" role="row">
              <span>Betting</span>
              <span>Race Name</span>
              <span>Horse</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Payout</span>
            </div>

            {bets.map((bet) => (
              <div className="spectator-mybets-row" role="row" key={`${bet.race}-${bet.horse}`}>
                <span className={`spectator-mybets-state is-${bet.state.toLowerCase()}`}>{bet.state}</span>
                <Link className="spectator-mybets-race" to="/Spectator/Tournaments">
                  {bet.race}
                </Link>
                <div className="spectator-mybets-horse">
                  <Link to={horsePath(bet.horse)} className="spectator-mybets-horse__image" aria-label={`View ${bet.horse}`}>
                    {bet.image ? <img src={bet.image} alt={bet.horse} /> : <MiniHorseIcon type={bet.icon} />}
                  </Link>
                  <Link to={horsePath(bet.horse)}>{bet.horse}</Link>
                </div>
                <span>{bet.type}</span>
                <span className="spectator-mybets-money">{bet.amount}</span>
                <StatusBadge status={bet.status} />
                <span className={`spectator-mybets-payout is-${bet.status.toLowerCase()}`}>{bet.payout}</span>
              </div>
            ))}
          </div>

          <footer className="spectator-mybets-pagination">
            <span>Showing 1 to 10 of 142 entries</span>
            <nav aria-label="Betting history pagination">
              <button type="button" aria-label="Previous page">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M11.8 15L5.8 9L11.8 3L13.2 4.4L8.6 9L13.2 13.6L11.8 15Z" fill="currentColor" />
                </svg>
              </button>
              <button type="button" className="is-active">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <span>...</span>
              <button type="button">36</button>
              <button type="button" aria-label="Next page">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M6.2 15L4.8 13.6L9.4 9L4.8 4.4L6.2 3L12.2 9L6.2 15Z" fill="currentColor" />
                </svg>
              </button>
            </nav>
          </footer>
        </section>
      </main>

      <SpectatorFooter />
    </div>
  );
};

export default SpectatorMyBets;
