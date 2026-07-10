import React from 'react';
import { Link } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../components/spectator/index.ts';
import horse1 from '../assets/images/horse1.webp';
import horse2 from '../assets/images/horse2.jpg';
import horse3 from '../assets/images/horse3.jpg';
import horse4 from '../assets/images/horse4.jpg';
import horse5 from '../assets/images/horse5.jpg';
import './SpectatorHorses.css';

type ResultTone = 'gold' | 'green' | 'neutral';

type HorseRow = {
  rank: string;
  featured?: boolean;
  name: string;
  owner: string;
  breed: string;
  age: string;
  winRatio: number;
  starts: number;
  result: string;
  event: string;
  tone: ResultTone;
  image?: string;
};

const horses: HorseRow[] = [
  {
    rank: '01',
    featured: true,
    name: 'Majestic Sovereign',
    owner: 'R. Sterling',
    breed: 'Thoroughbred',
    age: '4 YRS',
    winRatio: 64,
    starts: 28,
    result: '1st Place',
    event: 'Epsom Derby, May 24',
    tone: 'green',
    image: horse1,
  },
  {
    rank: '02',
    name: 'Silver Streak',
    owner: 'L. Vance',
    breed: 'Arabian',
    age: '5 YRS',
    winRatio: 58,
    starts: 32,
    result: '2nd Place',
    event: 'Heritage Cup, Jun 12',
    tone: 'gold',
    image: horse2,
  },
  {
    rank: '03',
    name: 'Golden Heiress',
    owner: 'M. Chen',
    breed: 'Thoroughbred',
    age: '3 YRS',
    winRatio: 52,
    starts: 15,
    result: '4th Place',
    event: 'Spring Invitational, Apr 08',
    tone: 'neutral',
    image: horse3,
  },
  {
    rank: '04',
    name: 'Midnight Comet',
    owner: 'S. Knox',
    breed: 'American Quarter',
    age: '6 YRS',
    winRatio: 48,
    starts: 44,
    result: '2nd Place',
    event: 'Sunset Derby, May 15',
    tone: 'gold',
    image: horse4,
  },
  {
    rank: '05',
    name: 'Royal Vanguard',
    owner: 'J. Thorne',
    breed: 'Thoroughbred',
    age: '4 YRS',
    winRatio: 45,
    starts: 22,
    result: '3rd Place',
    event: 'Royal Ascot, Jun 18',
    tone: 'neutral',
    image: horse1,
  },
  {
    rank: '06',
    name: 'Desert Wind',
    owner: 'A. Al-Fayed',
    breed: 'Arabian',
    age: '5 YRS',
    winRatio: 42,
    starts: 19,
    result: '1st Place',
    event: 'Dubai World Cup, Mar 30',
    tone: 'green',
    image: horse2,
  },
  {
    rank: '07',
    name: 'Velvet Thunder',
    owner: 'P. Harrison',
    breed: 'Thoroughbred',
    age: '3 YRS',
    winRatio: 39,
    starts: 12,
    result: '2nd Place',
    event: 'Kentucky Derby, May 04',
    tone: 'gold',
    image: horse3,
  },
  {
    rank: '08',
    name: 'Shadow Dancer',
    owner: "K. O'Malley",
    breed: 'American Quarter',
    age: '6 YRS',
    winRatio: 36,
    starts: 38,
    result: '5th Place',
    event: 'Preakness Stakes, May 18',
    tone: 'neutral',
    image: horse4,
  },
  {
    rank: '09',
    name: 'Iron Heart',
    owner: 'G. Miller',
    breed: 'Thoroughbred',
    age: '4 YRS',
    winRatio: 33,
    starts: 25,
    result: '1st Place',
    event: 'Belmont Stakes, Jun 08',
    tone: 'green',
    image: horse1,
  },
  {
    rank: '10',
    name: 'Silver Bullet',
    owner: 'D. West',
    breed: 'Arabian',
    age: '5 YRS',
    winRatio: 30,
    starts: 21,
    result: '2nd Place',
    event: 'Breeders Cup, Nov 02',
    tone: 'gold',
    image: horse5,
  },
];

const horsePath = (horseName: string) => `/Spectator/Horses/${horseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M16.6 18L10.3 11.7C9.8 12.1 9.23 12.42 8.58 12.65C7.93 12.88 7.23 13 6.5 13C4.68 13 3.15 12.37 1.89 11.11C0.63 9.85 0 8.32 0 6.5C0 4.68 0.63 3.15 1.89 1.89C3.15 0.63 4.68 0 6.5 0C8.32 0 9.85 0.63 11.11 1.89C12.37 3.15 13 4.68 13 6.5C13 7.23 12.88 7.93 12.65 8.58C12.42 9.23 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81 10.56 9.69 9.69C10.56 8.81 11 7.75 11 6.5C11 5.25 10.56 4.19 9.69 3.31C8.81 2.44 7.75 2 6.5 2C5.25 2 4.19 2.44 3.31 3.31C2.44 4.19 2 5.25 2 6.5C2 7.75 2.44 8.81 3.31 9.69C4.19 10.56 5.25 11 6.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M4.8 10.5L7 9.17L9.2 10.52L8.62 8L10.57 6.32L8 6.08L7 3.7L5.98 6.07L3.43 6.3L5.37 8L4.8 10.5ZM2.68 13.34L3.82 8.4L0 5.08L5.05 4.65L7 0L8.97 4.65L14 5.08L10.18 8.4L11.32 13.34L7 10.72L2.68 13.34Z"
      fill="currentColor"
    />
  </svg>
);

const TrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M0 18V16L2 14V18H0ZM4 18V12L6 10V18H4ZM8 18V10L10 12.03V18H8ZM12 18V12.03L14 10.03V18H12ZM16 18V8L18 6V18H16ZM0 12.83V10L7 3L11 7L18 0V2.83L11 9.83L7 5.83L0 12.83Z"
      fill="currentColor"
    />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
    <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4Z" fill="currentColor" />
  </svg>
);

const HorseImage: React.FC<{ horse: HorseRow }> = ({ horse }) => {
  if (horse.image) {
    return <img src={horse.image} alt={horse.name} />;
  }

  return <span className="spectator-horses-placeholder" aria-hidden="true" />;
};

export const SpectatorHorses: React.FC = () => {
  return (
    <div className="spectator-horses-page">
      <SpectatorHeader />

      <main className="spectator-horses-main">
        <section className="spectator-horses-hero">
          <div className="spectator-horses-hero__inner">
            <div className="spectator-horses-hero__crumb">
              <span>Registry</span>
              <span aria-hidden="true">›</span>
              <strong>Live Leaderboard</strong>
            </div>
            <h1>Horse Registry &amp; Leaderboard</h1>
            <p>
              Explore the elite thoroughbreds of the 2024 season. Track performance, win ratios, and racing lineage with
              professional-grade analytics.
            </p>
          </div>
        </section>

        <section className="spectator-horses-toolbar" aria-label="Horse search and sort">
          <label className="spectator-horses-search">
            <SearchIcon />
            <input type="search" placeholder="Search horses by name..." aria-label="Search horses by name" />
          </label>
          <label className="spectator-horses-sort">
            <select aria-label="Sort horses">
              <option>Sort by Breed</option>
              <option>Sort by Win Ratio</option>
              <option>Sort by Starts</option>
            </select>
            <ChevronIcon />
          </label>
        </section>

        <section className="spectator-horses-card" aria-label="Horse registry leaderboard">
          <div className="spectator-horses-table">
            <div className="spectator-horses-row spectator-horses-row--head" role="row">
              <span>Rank</span>
              <span>Horse Name</span>
              <span>Breed/Origin</span>
              <span>Win Ratio (%)</span>
              <span>Total Starts</span>
              <span>Last Result</span>
              <span>Action</span>
            </div>

            {horses.map((horse) => (
              <div className="spectator-horses-row" role="row" key={horse.rank}>
                <div className={`spectator-horses-rank ${horse.featured ? 'is-featured' : ''}`}>
                  <span>{horse.rank}</span>
                  {horse.featured && <StarIcon />}
                </div>
                <div className="spectator-horses-name">
                  <Link to={horsePath(horse.name)} className="spectator-horses-image-link" aria-label={`View ${horse.name}`}>
                    <HorseImage horse={horse} />
                  </Link>
                  <div>
                    <Link to={horsePath(horse.name)} className="spectator-horses-name-link">
                      {horse.name}
                    </Link>
                    <span>Owner: {horse.owner}</span>
                  </div>
                </div>
                <div className="spectator-horses-breed">
                  <strong>{horse.breed}</strong>
                  <span>Age: {horse.age}</span>
                </div>
                <div className="spectator-horses-ratio">
                  <strong>{horse.winRatio}%</strong>
                  <span>
                    <i style={{ width: `${horse.winRatio}%` }} />
                  </span>
                </div>
                <div className="spectator-horses-starts">{horse.starts}</div>
                <div className="spectator-horses-result">
                  <strong className={`is-${horse.tone}`}>{horse.result}</strong>
                  <span>{horse.event}</span>
                </div>
                <Link className="spectator-horses-action" to={horsePath(horse.name)} aria-label={`View ${horse.name} analytics`}>
                  <TrendIcon />
                </Link>
              </div>
            ))}
          </div>

          <footer className="spectator-horses-pagination">
            <span>Showing 1-10 of 284 Horses</span>
            <nav aria-label="Horse leaderboard pagination">
              <button type="button" aria-label="First page">|‹</button>
              <button type="button" aria-label="Previous page">‹</button>
              <button type="button" className="is-active">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <span>...</span>
              <button type="button">29</button>
              <button type="button" aria-label="Next page">›</button>
              <button type="button" aria-label="Last page">›|</button>
            </nav>
          </footer>
        </section>
      </main>

      <SpectatorFooter />
    </div>
  );
};

export default SpectatorHorses;
