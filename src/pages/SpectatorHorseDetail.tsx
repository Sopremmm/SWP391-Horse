import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../components/spectator/index.ts';
import horse1 from '../assets/images/horse1.webp';
import horse2 from '../assets/images/horse2.jpg';
import horse3 from '../assets/images/horse3.jpg';
import horse4 from '../assets/images/horse4.jpg';
import runningHorse from '../assets/images/RunningHorse.jpg';
import './SpectatorHorseDetail.css';

type HorseProfile = {
  name: string;
  owner: string;
  breed: string;
  age: string;
  gender: string;
  rank: string;
  winRatio: number;
  starts: number;
  earnings: string;
  hero: string;
};

type RaceHistoryRow = {
  tournament: string;
  date: string;
  race: string;
  jockey: string;
  time: string;
  position: string;
  tone: 'first' | 'second' | 'third' | 'neutral';
};

const titleCaseFromParam = (value?: string, fallback = 'Majestic Sovereign') => {
  if (!value) return fallback;

  const decoded = decodeURIComponent(value).replace(/[-_]+/g, ' ').trim();
  if (!decoded) return fallback;

  return decoded
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const profileBySlug: Record<string, Partial<HorseProfile>> = {
  'majestic-sovereign': {
    owner: 'R. Sterling',
    breed: 'Thoroughbred',
    age: '4 Yrs',
    gender: 'Stallion',
    rank: '01',
    winRatio: 64,
    starts: 28,
    earnings: '$450,000',
    hero: horse1,
  },
  'silver-streak': {
    owner: 'L. Vance',
    breed: 'Arabian',
    age: '5 Yrs',
    gender: 'Mare',
    rank: '02',
    winRatio: 58,
    starts: 32,
    earnings: '$390,000',
    hero: horse2,
  },
  'desert-wind': {
    owner: 'A. Al-Fayed',
    breed: 'Arabian',
    age: '5 Yrs',
    gender: 'Stallion',
    rank: '06',
    winRatio: 42,
    starts: 19,
    earnings: '$210,000',
    hero: horse3,
  },
  'midnight-thunder': {
    owner: 'E. Hart',
    breed: 'Thoroughbred',
    age: '5 Yrs',
    gender: 'Stallion',
    rank: '01',
    winRatio: 84,
    starts: 31,
    earnings: '$620,000',
    hero: horse4,
  },
};

const raceHistory: RaceHistoryRow[] = [
  {
    tournament: 'Epsom Derby',
    date: 'May 24, 2024',
    race: 'Qualifier A',
    jockey: 'Elias Vance',
    time: '02:12.45',
    position: '1st Place',
    tone: 'first',
  },
  {
    tournament: 'Heritage Cup',
    date: 'Jun 12, 2024',
    race: 'Qualifier B',
    jockey: 'Marcus Thorne',
    time: '02:13.10',
    position: '2nd Place',
    tone: 'second',
  },
  {
    tournament: 'Royal Ascot',
    date: 'Jun 18, 2024',
    race: 'Semi-final A',
    jockey: 'Sarah Jenkins',
    time: '02:14.05',
    position: '3rd Place',
    tone: 'third',
  },
  {
    tournament: 'Morning Gallop',
    date: 'Jul 02, 2024',
    race: 'Semi-final B',
    jockey: 'Leo Sato',
    time: '02:11.80',
    position: '1st Place',
    tone: 'first',
  },
  {
    tournament: 'Sunset Derby',
    date: 'Aug 15, 2024',
    race: 'Grand Final',
    jockey: 'Elena Rossi',
    time: '02:15.50',
    position: '4th Place',
    tone: 'neutral',
  },
];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const StarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path
      d="M8.36 24.5L9.85 16.75L4 11.55L11.73 10.55L14 3.5L16.27 10.55L24 11.55L18.15 16.75L19.64 24.5L14 20.45L8.36 24.5Z"
      fill="currentColor"
    />
  </svg>
);

const TrophyIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
    <path
      d="M12 37V23.8C9.93 23.33 8.24 22.27 6.94 20.62C5.65 18.98 5 17.1 5 15V8H12V5H30V8H37V15C37 17.1 36.35 18.98 35.06 20.62C33.76 22.27 32.07 23.33 30 23.8V37H12ZM9 15C9 16.03 9.28 16.98 9.84 17.84C10.4 18.7 11.12 19.35 12 19.78V12H9V15ZM30 19.78C30.88 19.35 31.6 18.7 32.16 17.84C32.72 16.98 33 16.03 33 15V12H30V19.78ZM16 33H26V9H16V33Z"
      fill="currentColor"
    />
  </svg>
);

const MoneyIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
    <path
      d="M6 32V12H36V32H6ZM10 28H32V16H10V28ZM21 26C19.9 26 18.96 25.61 18.17 24.83C17.39 24.04 17 23.1 17 22C17 20.9 17.39 19.96 18.17 19.17C18.96 18.39 19.9 18 21 18C22.1 18 23.04 18.39 23.83 19.17C24.61 19.96 25 20.9 25 22C25 23.1 24.61 24.04 23.83 24.83C23.04 25.61 22.1 26 21 26ZM12 24C12.55 24 13.02 23.8 13.41 23.41C13.8 23.02 14 22.55 14 22C14 21.45 13.8 20.98 13.41 20.59C13.02 20.2 12.55 20 12 20V24ZM30 24V20C29.45 20 28.98 20.2 28.59 20.59C28.2 20.98 28 21.45 28 22C28 22.55 28.2 23.02 28.59 23.41C28.98 23.8 29.45 24 30 24Z"
      fill="currentColor"
    />
  </svg>
);

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 21C9.5 21 7.38 20.12 5.64 18.36C3.88 16.62 3 14.5 3 12H1L4 9L7 12H5C5 13.93 5.68 15.58 7.04 16.96C8.42 18.32 10.07 19 12 19C13.93 19 15.57 18.32 16.94 16.94C18.31 15.57 19 13.93 19 12C19 10.07 18.31 8.42 16.94 7.04C15.57 5.68 13.93 5 12 5C10.93 5 9.93 5.22 9 5.66C8.07 6.1 7.28 6.72 6.62 7.5L5.2 6.08C6.05 5.12 7.06 4.37 8.24 3.82C9.42 3.27 10.67 3 12 3C14.5 3 16.62 3.88 18.36 5.64C20.12 7.38 21 9.5 21 12C21 14.5 20.12 16.62 18.36 18.36C16.62 20.12 14.5 21 12 21ZM14.8 16.2L11 12.4V7H13V11.6L16.2 14.8L14.8 16.2Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M11.3 8.4H0V6.6H11.3L6.1 1.4L7.5 0L15 7.5L7.5 15L6.1 13.6L11.3 8.4Z" fill="currentColor" />
  </svg>
);

export const SpectatorHorseDetail: React.FC = () => {
  const { name } = useParams();
  const slug = slugify(name || '');
  const displayName = titleCaseFromParam(name);
  const profile: HorseProfile = {
    name: displayName,
    owner: 'R. Sterling',
    breed: 'Thoroughbred',
    age: '4 Yrs',
    gender: 'Stallion',
    rank: '01',
    winRatio: 64,
    starts: 28,
    earnings: '$450,000',
    hero: runningHorse,
    ...profileBySlug[slug],
  };

  return (
    <div className="spectator-horse-detail-page">
      <SpectatorHeader showFunds={false} showNotifications />

      <main className="spectator-horse-detail-main">
        <section className="spectator-horse-detail-hero" aria-label={`${profile.name} profile`}>
          <img src={profile.hero} alt={profile.name} />
          <div className="spectator-horse-detail-hero__overlay" />
          <div className="spectator-horse-detail-hero__content">
            <div className="spectator-horse-detail-crumb">
              <Link to="/Spectator/Horses">Registry</Link>
              <span>Horse</span>
              <strong>{profile.name}</strong>
            </div>
            <h1>{profile.name}</h1>
            <dl className="spectator-horse-detail-meta">
              <div>
                <dt>Owner</dt>
                <dd>{profile.owner}</dd>
              </div>
              <div>
                <dt>Breed</dt>
                <dd>{profile.breed}</dd>
              </div>
              <div>
                <dt>Age</dt>
                <dd>{profile.age}</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{profile.gender}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="spectator-horse-detail-stats" aria-label="Horse performance statistics">
          <article className="spectator-horse-stat">
            <span>System Rank</span>
            <strong>{profile.rank}</strong>
            <i>
              <StarIcon />
            </i>
          </article>
          <article className="spectator-horse-stat">
            <span>Win Ratio</span>
            <strong>{profile.winRatio}%</strong>
            <div className="spectator-horse-stat__bar">
              <em style={{ width: `${profile.winRatio}%` }} />
            </div>
          </article>
          <article className="spectator-horse-stat">
            <span>Total Starts</span>
            <strong>{profile.starts}</strong>
            <i className="is-muted">
              <TrophyIcon />
            </i>
          </article>
          <article className="spectator-horse-stat">
            <span>Total Earnings</span>
            <strong>{profile.earnings}</strong>
            <i>
              <MoneyIcon />
            </i>
          </article>
        </section>

        <section className="spectator-horse-history">
          <div className="spectator-horse-history__header">
            <h2>
              <HistoryIcon />
              Recent Race History
            </h2>
            <Link to="/Spectator/Tournaments">
              View Full Career <ArrowIcon />
            </Link>
          </div>

          <div className="spectator-horse-history__table" role="table" aria-label={`${profile.name} recent race history`}>
            <div className="spectator-horse-history__row spectator-horse-history__row--head" role="row">
              <span>Tournament</span>
              <span>Race</span>
              <span>Jockey</span>
              <span>Time</span>
              <span>Position</span>
            </div>
            {raceHistory.map((race) => (
              <div className="spectator-horse-history__row" role="row" key={`${race.tournament}-${race.date}`}>
                <div>
                  <strong>{race.tournament}</strong>
                  <span>{race.date}</span>
                </div>
                <span>{race.race}</span>
                <strong>{race.jockey}</strong>
                <strong>{race.time}</strong>
                <span className={`spectator-horse-history__badge is-${race.tone}`}>{race.position}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SpectatorFooter />
    </div>
  );
};

export default SpectatorHorseDetail;
