import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/common/Header.tsx';
import './HorseOwnerHome.css';

type OwnerTournament = {
  id?: string;
  name: string;
  date: string;
  prizePool: string;
};

type RegisteredHorse = {
  id?: string;
  name: string;
  age: string;
  gender: string;
  imageSrc?: string;
};

type OwnerHomeData = {
  ownerName: string;
  welcomeText: string;
  featuredRace?: {
    id?: string;
    badge?: string;
    title: string;
    location?: string;
    description?: string;
    imageUrl?: string;
    prizePool?: string;
    raceDate?: string;
    startsIn?: string;
  };
  tournaments: OwnerTournament[];
  horses: RegisteredHorse[];
  stats: Array<{ label: string; value: string }>;
};

type RawOwnerHomeData = Partial<OwnerHomeData> & {
  owner?: { name?: string; fullName?: string };
  user?: { name?: string; fullName?: string };
  upcomingTournaments?: OwnerTournament[];
  registeredHorses?: RegisteredHorse[];
};

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M8 2.5 12.5 7 8 11.5M12 7H1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="m11.8 11.1-2.9 2.8a1.3 1.3 0 0 1-1.8 0l-2.9-2.8a5.33 5.33 0 1 1 7.6 0Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 7.3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatMoney = (value: string) =>
  value
    .replace(/^GBP\s?/i, '\u00a3')
    .replace(/^EUR\s?/i, '\u20ac')
    .replace(/^USD\s?/i, '$');

const normalizeOwnerHomeData = (raw?: RawOwnerHomeData | null): OwnerHomeData => {
  const ownerName =
    raw?.ownerName ||
    raw?.owner?.fullName ||
    raw?.owner?.name ||
    raw?.user?.fullName ||
    raw?.user?.name ||
    window.localStorage.getItem('fullName') ||
    window.localStorage.getItem('username') ||
    '';

  const tournaments = raw?.tournaments || raw?.upcomingTournaments || [];
  const horses = raw?.horses || raw?.registeredHorses || [];
  const featuredRace = raw?.featuredRace?.title ? raw.featuredRace : undefined;

  return {
    ownerName,
    welcomeText: raw?.welcomeText || '',
    featuredRace,
    tournaments: tournaments.slice(0, 4).map((tournament, index) => ({
      id: tournament.id || tournament.name,
      name: tournament.name || '',
      date: tournament.date || '',
      prizePool: tournament.prizePool || '',
    })),
    horses: horses.slice(0, 4).map((horse, index) => ({
      id: horse.id || horse.name,
      name: horse.name || '',
      age: horse.age || '',
      gender: horse.gender || '',
      imageSrc: horse.imageSrc,
    })),
    stats: (raw?.stats || []).slice(0, 3),
  };
};

const readOwnerHomeFromLocalStorage = (): RawOwnerHomeData | null => {
  try {
    const raw = window.localStorage.getItem('horse_owner_home_data');
    return raw ? (JSON.parse(raw) as RawOwnerHomeData) : null;
  } catch {
    return null;
  }
};

const readOwnerHomeFromApi = async (): Promise<RawOwnerHomeData | null> => {
  try {
    const endpoint = process.env.REACT_APP_HORSE_OWNER_HOME_API || '/api/horse-owner/home';
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) return null;
    return (await response.json()) as RawOwnerHomeData;
  } catch {
    return null;
  }
};

export const HorseOwnerHome: React.FC = () => {
  const [dashboard, setDashboard] = React.useState<OwnerHomeData>(() =>
    normalizeOwnerHomeData(readOwnerHomeFromLocalStorage()),
  );

  React.useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      const apiData = await readOwnerHomeFromApi();
      const localData = readOwnerHomeFromLocalStorage();
      if (!cancelled) setDashboard(normalizeOwnerHomeData(apiData ?? localData));
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="owner-home">
      <Header />

      <main className="owner-home__main">
        <section className="owner-home__welcome" aria-labelledby="owner-home-title">
          <p>Owner Dashboard</p>
          <h1 id="owner-home-title">{dashboard.ownerName ? `Welcome back, ${dashboard.ownerName}.` : 'Welcome back.'}</h1>
          {dashboard.welcomeText ? <span>{dashboard.welcomeText}</span> : null}
        </section>

        <section className="owner-home__feature" aria-label={dashboard.featuredRace?.title || 'Featured tournament'}>
          {dashboard.featuredRace?.imageUrl ? <img src={dashboard.featuredRace.imageUrl} alt={dashboard.featuredRace.title} /> : null}
          <div className="owner-home__feature-shade" />
          {dashboard.featuredRace ? <div className="owner-home__feature-content">
            <div className="owner-home__feature-copy">
              <div className="owner-home__feature-meta">
                {dashboard.featuredRace.badge ? <strong>{dashboard.featuredRace.badge}</strong> : null}
                {dashboard.featuredRace.location ? <span>
                  <LocationIcon />
                  {dashboard.featuredRace.location}
                </span> : null}
              </div>
              <h2>{dashboard.featuredRace.title}</h2>
              {dashboard.featuredRace.description ? <p>{dashboard.featuredRace.description}</p> : null}
            </div>

            <aside className="owner-home__prize-card">
              <div className="owner-home__prize-head">
                <span>Prize Pool</span>
                {dashboard.featuredRace.startsIn ? <strong>{dashboard.featuredRace.startsIn}</strong> : null}
              </div>
              {dashboard.featuredRace.prizePool ? <div className="owner-home__prize-value">{formatMoney(dashboard.featuredRace.prizePool)}</div> : null}
              {dashboard.featuredRace.raceDate ? <div className="owner-home__race-date">
                <span>Race Date</span>
                <strong>{dashboard.featuredRace.raceDate}</strong>
              </div> : null}
              <Link
                className="owner-home__details-button"
                to={`/HorseOwner/Tournaments/${encodeURIComponent(dashboard.featuredRace.title)}/entry`}
              >
                View Race Details
              </Link>
            </aside>
          </div> : <div className="owner-home__empty-feature">Featured tournament data is empty.</div>}
        </section>

        <section className="owner-home__tables" aria-label="Owner dashboard lists">
          <article className="owner-home__panel">
            <div className="owner-home__panel-head">
              <h2>Upcoming Tournaments</h2>
              <Link to="/HorseOwner/Tournaments">
                Full Schedule
                <ArrowIcon />
              </Link>
            </div>
            <div className="owner-home__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tournament</th>
                    <th>Date</th>
                    <th>Prize Pool</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.tournaments.length ? dashboard.tournaments.map((tournament) => (
                    <tr key={tournament.id || tournament.name}>
                      <td>{tournament.name}</td>
                      <td>{tournament.date}</td>
                      <td>{formatMoney(tournament.prizePool)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3}>Tournament data is empty.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="owner-home__panel">
            <div className="owner-home__panel-head">
              <h2>My Registered Horses</h2>
              <Link to="/HorseOwner/MyHorses">
                View All ({dashboard.horses.length})
                <ArrowIcon />
              </Link>
            </div>
            <div className="owner-home__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Horse Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.horses.length ? dashboard.horses.map((horse) => (
                    <tr key={horse.id || horse.name}>
                      <td>
                        <Link className="owner-home__horse-name" to={`/HorseOwner/MyHorses/${encodeURIComponent(horse.name)}`}>
                          {horse.imageSrc ? <img src={horse.imageSrc} alt="" /> : null}
                          {horse.name}
                        </Link>
                      </td>
                      <td>{horse.age}</td>
                      <td>
                        <span className={`owner-home__gender owner-home__gender--${horse.gender.toLowerCase()}`}>
                          {horse.gender}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3}>Horse data is empty.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="owner-home__stats" aria-label="Stable statistics">
          {dashboard.stats.length ? dashboard.stats.map((stat) => (
            <div className="owner-home__stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          )) : <div className="owner-home__empty-stats">Stats data is empty.</div>}
        </section>
      </main>

      <footer className="owner-home__footer">
        <div className="owner-home__footer-inner">
          <div className="owner-home__footer-brand">
            <h2>Heritage Racing</h2>
            <p>
              The world's premier platform for professional horse racing management, lineage tracking,
              and real-time performance analytics.
            </p>
          </div>
          <nav className="owner-home__footer-nav" aria-label="Footer navigation">
            <strong>Navigation</strong>
            <a href="#about">About Us</a>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#rules">Racing Rules</a>
          </nav>
          <div className="owner-home__footer-contact">
            <strong>Contact</strong>
            <a href="mailto:support@heritageracing.com">support@heritageracing.com</a>
            <div>
              <a href="#twitter" aria-label="Twitter">T</a>
              <a href="#instagram" aria-label="Instagram">I</a>
            </div>
          </div>
        </div>
        <div className="owner-home__copyright">
          <span>(c) 2024 Heritage Racing Management. All rights reserved.</span>
          <span>Shielded racing data</span>
        </div>
      </footer>
    </div>
  );
};

export default HorseOwnerHome;
