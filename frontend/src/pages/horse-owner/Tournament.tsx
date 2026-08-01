import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/common/Header.tsx';
import { getHorseOwnerTournamentListData } from '../../services/integration.ts';
import featuredTournamentOne from '../../assets/images/horseracing1.jpg';
import featuredTournamentTwo from '../../assets/images/RunningHorse.jpg';
import './Tournament.css';

type TournamentStatus = 'live' | 'ongoing' | 'registration-open' | 'upcoming' | 'completed' | string;

type FeaturedTournament = {
  id?: string;
  title: string;
  description?: string;
  statusLabel?: string;
  prizePool?: string;
  imageUrl?: string;
};

type ScheduleTournament = {
  id?: string;
  title: string;
  dateRange?: string;
  status?: TournamentStatus;
  statusLabel?: string;
  races?: string | number;
  prizePool?: string;
  imageUrl?: string;
};

type TournamentPageData = {
  featuredTournaments: FeaturedTournament[];
  tournaments: ScheduleTournament[];
  sortOptions: Array<{ label: string; value: string }>;
};

type RawTournamentPageData = Partial<TournamentPageData> & {
  featured?: FeaturedTournament[];
  schedules?: ScheduleTournament[];
  items?: ScheduleTournament[];
};

const EMPTY_TOURNAMENT_PAGE_DATA: TournamentPageData = {
  featuredTournaments: [],
  tournaments: [],
  sortOptions: [
    { label: 'Sort by Date', value: 'date' },
    { label: 'Prize Pool', value: 'prizePool' },
    { label: 'Tournament Name', value: 'title' },
  ],
};

const FEATURED_TOURNAMENT_IMAGES = [featuredTournamentOne, featuredTournamentTwo];

function tournamentHref(value: string) {
  return `/HorseOwner/Tournaments/${encodeURIComponent(value)}`;
}

const ArrowRightIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path d="M7.45 5.8H.6V4.45h6.85L4.3 1.3 5.25.35 10 5.1 5.25 9.85 4.3 8.9l3.15-3.1Z" fill="currentColor" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
    <path d="M6 7.4 0 1.4 1.4 0 6 4.6 10.6 0 12 1.4 6 7.4Z" fill="currentColor" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M16.6 18 10.3 11.7a6.5 6.5 0 1 1 1.4-1.4L18 16.6 16.6 18ZM6.5 11a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
      fill="currentColor"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M1.33 12c-.37 0-.69-.13-.95-.4-.25-.26-.38-.57-.38-.94V2.67c0-.37.13-.69.38-.95.26-.25.58-.39.95-.39H2V0h1.33v1.33h5.34V0H10v1.33h.67c.37 0 .68.14.94.39.26.26.39.58.39.95v8c0 .36-.13.67-.39.93-.26.27-.57.4-.94.4H1.33Zm0-1.33h9.34V5.33H1.33v5.34Zm0-6.67h9.34V2.67H1.33V4Z"
      fill="currentColor"
    />
  </svg>
);

const normalizeStatus = (status?: TournamentStatus) => String(status || 'upcoming').toLowerCase();

const getStatusLabel = (item: ScheduleTournament) => {
  if (item.statusLabel) return item.statusLabel;
  const status = normalizeStatus(item.status);
  if (status === 'registration-open') return 'Registration Open';
  if (status === 'ongoing') return 'Ongoing';
  if (status === 'live') return 'Live Now';
  if (status === 'completed') return 'Completed';
  return 'Upcoming';
};

const getFeaturedStatusLabel = (item: FeaturedTournament) => item.statusLabel || 'Starts Soon';

const normalizeTournamentData = (raw?: RawTournamentPageData | null): TournamentPageData => ({
  featuredTournaments: raw?.featuredTournaments || raw?.featured || [],
  tournaments: raw?.tournaments || raw?.schedules || raw?.items || [],
  sortOptions: raw?.sortOptions?.length ? raw.sortOptions : EMPTY_TOURNAMENT_PAGE_DATA.sortOptions,
});

const compareBySort = (sortValue: string) => (a: ScheduleTournament, b: ScheduleTournament) => {
  if (sortValue === 'title') return a.title.localeCompare(b.title);
  if (sortValue === 'prizePool') return String(b.prizePool || '').localeCompare(String(a.prizePool || ''));
  return String(a.dateRange || '').localeCompare(String(b.dateRange || ''));
};

export default function Tournament() {
  const [pageData, setPageData] = React.useState<TournamentPageData>(EMPTY_TOURNAMENT_PAGE_DATA);
  const [query, setQuery] = React.useState('');
  const [sortValue, setSortValue] = React.useState(EMPTY_TOURNAMENT_PAGE_DATA.sortOptions[0].value);
  const [visibleCount, setVisibleCount] = React.useState(6);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiData = await getHorseOwnerTournamentListData().catch(() => null);
      if (!cancelled) {
        const data = normalizeTournamentData(apiData);
        setPageData(data);
        setSortValue(data.sortOptions[0]?.value || 'date');
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTournaments = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return pageData.tournaments
      .filter((item) => !normalizedQuery || item.title.toLowerCase().includes(normalizedQuery))
      .sort(compareBySort(sortValue));
  }, [pageData.tournaments, query, sortValue]);

  const visibleTournaments = filteredTournaments.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTournaments.length;

  return (
    <div className="owner-tournaments">
      <Header />

      <main className="owner-tournaments__main" aria-label="Tournament listing">
        <section className="owner-tournaments__featured" aria-labelledby="featured-tournaments-title">
          <div>
            <p>Elite Events</p>
            <h1 id="featured-tournaments-title">Featured Tournaments</h1>
          </div>

          {pageData.featuredTournaments.length > 0 ? (
            <div className="owner-tournaments__featured-grid">
              {pageData.featuredTournaments.slice(0, 2).map((tournament, index) => (
                <article className="owner-tournaments__featured-card" key={tournament.id || tournament.title}>
                  <img
                    src={tournament.imageUrl || FEATURED_TOURNAMENT_IMAGES[index % FEATURED_TOURNAMENT_IMAGES.length]}
                    alt={tournament.title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FEATURED_TOURNAMENT_IMAGES[index % FEATURED_TOURNAMENT_IMAGES.length];
                    }}
                  />
                  <div className="owner-tournaments__featured-gradient" />
                  <div className="owner-tournaments__featured-content">
                    <div className="owner-tournaments__featured-row">
                      <div>
                        <span className={index === 0 ? 'is-live' : ''}>{getFeaturedStatusLabel(tournament)}</span>
                        <h2>{tournament.title}</h2>
                        {tournament.description ? <p>{tournament.description}</p> : null}
                      </div>
                      {tournament.prizePool ? (
                        <div className="owner-tournaments__featured-prize">
                          <small>Prize Pool</small>
                          <strong>{tournament.prizePool}</strong>
                        </div>
                      ) : null}
                    </div>
                    <Link className={index === 0 ? 'owner-tournaments__button-solid' : 'owner-tournaments__button-outline'} to={tournamentHref(tournament.id || tournament.title)}>
                      View Details
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="owner-tournaments__empty owner-tournaments__empty--featured">
              Featured tournaments will appear here when your database returns them.
            </div>
          )}
        </section>

        <section className="owner-tournaments__filters" aria-label="Search and filter tournaments">
          <label className="owner-tournaments__search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tournaments by name..."
            />
          </label>
          <div className="owner-tournaments__filter-controls">
            <select value={sortValue} onChange={(event) => setSortValue(event.target.value)} aria-label="Sort tournaments">
              {pageData.sortOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setVisibleCount(6)}>
              Filter
            </button>
          </div>
        </section>

        <section className="owner-tournaments__schedule" aria-labelledby="schedule-title">
          <h2 id="schedule-title">Active &amp; Upcoming Schedule</h2>

          {visibleTournaments.length > 0 ? (
            <div className="owner-tournaments__grid">
              {visibleTournaments.map((tournament) => {
                const status = normalizeStatus(tournament.status);
                return (
                  <article className="owner-tournaments__card" key={tournament.id || tournament.title}>
                    {tournament.imageUrl ? (
                      <img src={tournament.imageUrl} alt={tournament.title} />
                    ) : (
                      <div className="owner-tournaments__card-placeholder" aria-hidden="true" />
                    )}
                    <div className="owner-tournaments__card-body">
                      <span className={`owner-tournaments__status owner-tournaments__status--${status}`}>
                        {getStatusLabel(tournament)}
                      </span>
                      <h3>{tournament.title}</h3>
                      {tournament.dateRange ? (
                        <p>
                          <CalendarIcon />
                          {tournament.dateRange}
                        </p>
                      ) : null}
                      <div className="owner-tournaments__meta">
                        <div>
                          <small>Races</small>
                          <strong>{tournament.races ? `${tournament.races} Events` : 'TBA'}</strong>
                        </div>
                        <div>
                          <small>Prize Pool</small>
                          <strong>{tournament.prizePool || 'TBA'}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="owner-tournaments__card-action">
                      <Link to={tournamentHref(tournament.id || tournament.title)}>View Tournament</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="owner-tournaments__empty">
              No tournaments to display yet.
            </div>
          )}

          {hasMore ? (
            <button className="owner-tournaments__load-more" type="button" onClick={() => setVisibleCount((count) => count + 6)}>
              Load More Tournaments
              <ChevronIcon />
            </button>
          ) : null}
        </section>
      </main>

      <footer className="owner-tournaments__footer">
        <div className="owner-tournaments__footer-inner">
          <div className="owner-tournaments__footer-brand">
            <h2>Heritage Racing</h2>
            <p>
              Elevating the equestrian tradition through precision technology and timeless luxury.
              Our platform brings the prestige of the track to your digital dashboard with authoritative
              data and elite event management.
            </p>
            <span>(c) 2024 Heritage Racing. Gamble Responsibly.</span>
          </div>

          <div className="owner-tournaments__footer-links">
            <nav aria-label="Resources">
              <strong>Resources</strong>
              <a href="#terms">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#responsible">Responsible Gambling</a>
              <a href="#contact">Contact Us</a>
            </nav>
            <nav aria-label="Connect">
              <strong>Connect</strong>
              <a href="#instagram">Instagram</a>
              <a href="#twitter">Twitter / X</a>
              <a href="#youtube">YouTube</a>
              <a href="#linkedin">LinkedIn</a>
            </nav>
            <nav aria-label="Platform">
              <strong>Platform</strong>
              <a href="#live">Live Racing</a>
              <a href="#registry">Horse Registry</a>
              <a href="#rankings">Jockey Rankings</a>
            </nav>
          </div>
        </div>
        <div className="owner-tournaments__footer-bottom">
          <span>VERSION 4.2.1-RELEASE</span>
          <span>DATA FEED SECURED BY HERITAGE ENCRYPTION</span>
        </div>
      </footer>
    </div>
  );
}
