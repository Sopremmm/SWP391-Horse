import React from 'react';
import { Link } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../../components/spectator/index.ts';
import HomeBanner from '../../assets/images/HomeBanner.png';
import RunningHorse from '../../assets/images/RunningHorse.jpg';
import HorseRacing from '../../assets/images/horseracing1.jpg';
import HorseRiding1 from '../../assets/images/horseriding1.webp';
import HorseRiding2 from '../../assets/images/horseriding2.webp';
import WhiteHorse from '../../assets/images/white horse.jpg';
import Horse1 from '../../assets/images/horse1.webp';
import './SpectatorTournament.css';

type Tone = 'live' | 'open' | 'upcoming';

type FeaturedTournament = {
  badge: string;
  tone: 'live' | 'neutral';
  title: string;
  description: string;
  prizePool: string;
  image: string;
};

type Tournament = {
  title: string;
  slug: string;
  dates: string;
  status: string;
  tone: Tone;
  races: string;
  prizePool: string;
  image: string;
};

const featuredTournaments: FeaturedTournament[] = [
  {
    badge: 'Live Now',
    tone: 'live',
    title: 'The Royal Heritage Cup',
    description: "Heritage Racing's premier summer tournament. A three-day display of speed, endurance, and historical prestige.",
    prizePool: '$1.2M',
    image: HomeBanner,
  },
  {
    badge: 'Starts Aug 28',
    tone: 'neutral',
    title: 'Grand Valley Masters',
    description: "The season's most grueling test of tactical jockeying and equine stamina through the valley circuits.",
    prizePool: '$850K',
    image: RunningHorse,
  },
];

const tournaments: Tournament[] = [
  {
    title: 'Emerald Oaks Classic',
    slug: 'emerald-oaks-classic',
    dates: 'Aug 21 - Aug 24, 2024',
    status: 'Ongoing',
    tone: 'live',
    races: '12 Events',
    prizePool: '$450,000',
    image: HorseRacing,
  },
  {
    title: 'Autumn Derby Series',
    slug: 'autumn-derby-series',
    dates: 'Sep 05 - Sep 12, 2024',
    status: 'Registration Open',
    tone: 'open',
    races: '24 Events',
    prizePool: '$320,000',
    image: HorseRiding1,
  },
  {
    title: 'Windsor Invitational',
    slug: 'windsor-invitational',
    dates: 'Oct 02 - Oct 04, 2024',
    status: 'Upcoming',
    tone: 'upcoming',
    races: '8 Events',
    prizePool: '$180,000',
    image: WhiteHorse,
  },
  {
    title: 'Novice Summer Shield',
    slug: 'novice-summer-shield',
    dates: 'Aug 29 - Aug 30, 2024',
    status: 'Upcoming',
    tone: 'upcoming',
    races: '10 Events',
    prizePool: '$95,000',
    image: Horse1,
  },
  {
    title: 'Victorian Cup Invitational',
    slug: 'victorian-cup-invitational',
    dates: 'Aug 18 - Aug 25, 2024',
    status: 'Ongoing',
    tone: 'live',
    races: '15 Events',
    prizePool: '$650,000',
    image: HorseRiding2,
  },
  {
    title: 'International Stakes',
    slug: 'international-stakes',
    dates: 'Nov 12 - Nov 15, 2024',
    status: 'Upcoming',
    tone: 'upcoming',
    races: '6 Events',
    prizePool: '$210,000',
    image: HomeBanner,
  },
];
void featuredTournaments;
void tournaments;

const ArrowIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M7.1 5.25H0V4.08H7.1L3.84 0.82L4.67 0L9.33 4.67L4.67 9.33L3.84 8.52L7.1 5.25Z" fill="currentColor" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
    <path
      d="M1.17 11.67C0.85 11.67 0.57 11.55 0.34 11.32C0.11 11.1 0 10.82 0 10.5V2.33C0 2.01 0.11 1.74 0.34 1.51C0.57 1.28 0.85 1.17 1.17 1.17H1.75V0H2.92V1.17H7.58V0H8.75V1.17H9.33C9.65 1.17 9.93 1.28 10.16 1.51C10.39 1.74 10.5 2.01 10.5 2.33V10.5C10.5 10.82 10.39 11.1 10.16 11.32C9.93 11.55 9.65 11.67 9.33 11.67H1.17ZM1.17 10.5H9.33V4.67H1.17V10.5ZM1.17 3.5H9.33V2.33H1.17V3.5Z"
      fill="currentColor"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M16.6 18L10.3 11.7C9.8 12.1 9.23 12.42 8.58 12.65C7.93 12.88 7.23 13 6.5 13C4.68 13 3.15 12.37 1.89 11.11C0.63 9.85 0 8.32 0 6.5C0 4.68 0.63 3.15 1.89 1.89C3.15 0.63 4.68 0 6.5 0C8.32 0 9.85 0.63 11.11 1.89C12.37 3.15 13 4.68 13 6.5C13 7.23 12.88 7.93 12.65 8.58C12.42 9.23 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81 10.56 9.69 9.69C10.56 8.81 11 7.75 11 6.5C11 5.25 10.56 4.19 9.69 3.31C8.81 2.44 7.75 2 6.5 2C5.25 2 4.19 2.44 3.31 3.31C2.44 4.19 2 5.25 2 6.5C2 7.75 2.44 8.81 3.31 9.69C4.19 10.56 5.25 11 6.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const FeaturedTournamentCard: React.FC<{ tournament: FeaturedTournament }> = ({ tournament }) => (
  <article className="spectator-tournament-feature">
    <img src={tournament.image} alt={tournament.title} />
    <div className="spectator-tournament-feature__content">
      <div className="spectator-tournament-feature__meta">
        <div>
          <span className={`spectator-tournament-feature__badge is-${tournament.tone}`}>{tournament.badge}</span>
          <h3>{tournament.title}</h3>
          <p>{tournament.description}</p>
        </div>
        <div className="spectator-tournament-feature__prize">
          <span>Prize Pool</span>
          <strong>{tournament.prizePool}</strong>
        </div>
      </div>
      <Link to="/Spectator/Tournaments" className="spectator-tournament-feature__button">
        View Details <ArrowIcon />
      </Link>
    </div>
  </article>
);

const TournamentCard: React.FC<{ tournament: Tournament }> = ({ tournament }) => (
  <article className="spectator-tournament-card">
    <img src={tournament.image} alt={tournament.title} />
    <div className="spectator-tournament-card__body">
      <span className={`spectator-tournament-card__badge is-${tournament.tone}`}>{tournament.status}</span>
      <h3>{tournament.title}</h3>
      <p className="spectator-tournament-card__date">
        <CalendarIcon /> {tournament.dates}
      </p>
      <div className="spectator-tournament-card__facts">
        <div>
          <span>Races</span>
          <strong>{tournament.races}</strong>
        </div>
        <div>
          <span>Prize Pool</span>
          <strong>{tournament.prizePool}</strong>
        </div>
      </div>
    </div>
    <div className="spectator-tournament-card__action">
      <Link to={`/Spectator/Tournaments/${tournament.slug}`}>View Tournament</Link>
    </div>
  </article>
);

type SpectatorTournamentProps = { featuredTournaments?: FeaturedTournament[]; tournaments?: Tournament[]; loading?: boolean; error?: string };

export const SpectatorTournament: React.FC<SpectatorTournamentProps> = ({ featuredTournaments = [], tournaments = [], loading = false, error }) => {
  return (
    <div className="spectator-tournament-page">
      <SpectatorHeader />

      <main className="spectator-tournament-main">
        <section className="spectator-tournament-hero">
          <div>
            <p className="spectator-tournament-eyebrow">Elite Events</p>
            <h1>Featured Tournaments</h1>
          </div>

          <div className="spectator-tournament-feature-grid">
            {featuredTournaments.map((tournament) => (
              <FeaturedTournamentCard key={tournament.title} tournament={tournament} />
            ))}
          </div>
        </section>

        <section className="spectator-tournament-filter" aria-label="Search and filter tournaments">
          <label className="spectator-tournament-search">
            <SearchIcon />
            <input type="search" placeholder="Search tournaments by name..." aria-label="Search tournaments by name" />
          </label>
          <select aria-label="Sort tournaments">
            <option>Sort by Date</option>
            <option>Prize Pool</option>
            <option>Registration Status</option>
          </select>
          <button type="button">Filter</button>
        </section>

        <section className="spectator-tournament-schedule">
          <h2>Active &amp; Upcoming Schedule</h2>
          <div className="spectator-tournament-grid">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.title} tournament={tournament} />
            ))}
          </div>
          <button type="button" className="spectator-tournament-load">
            Load More Tournaments
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>
      </main>

      <SpectatorFooter />
    </div>
  );
};

export default SpectatorTournament;
