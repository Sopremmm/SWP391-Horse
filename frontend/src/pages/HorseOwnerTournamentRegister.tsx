import React from 'react';
import { Link } from 'react-router-dom';
import {
  OwnerPortalHeader,
  OwnerPortalIcon,
} from '../components/horseOwner/OwnerPortalChrome.tsx';
import './HorseOwnerMyTournament.css';

type RegisteredTournament = {
  id?: string;
  name: string;
  location?: string;
  horse?: string;
  jockey?: string;
  date?: string;
  entryStatus?: string;
  status?: string;
  prizePool?: string;
};

type MyTournamentStats = {
  upcomingEvents?: string | number;
  totalCommittedStakes?: string;
};

type RawMyTournamentData = {
  title?: string;
  subtitle?: string;
  stats?: MyTournamentStats;
  tournaments?: Array<Partial<RegisteredTournament>>;
  registeredTournaments?: Array<Partial<RegisteredTournament>>;
  items?: Array<Partial<RegisteredTournament>>;
  deadlineTitle?: string;
  deadlineText?: string;
  total?: number;
};

const PAGE_SIZE = 5;

function normalizeTournament(raw: Partial<RegisteredTournament>, index: number): RegisteredTournament {
  return {
    id: raw.id,
    name: raw.name || `Tournament ${index + 1}`,
    location: raw.location || '',
    horse: raw.horse || 'TBA',
    jockey: raw.jockey || 'TBA',
    date: raw.date || 'TBA',
    entryStatus: raw.entryStatus || 'TBA',
    status: raw.status || 'TBA',
    prizePool: raw.prizePool,
  };
}

function normalizeData(raw?: RawMyTournamentData | null) {
  const source = raw?.tournaments || raw?.registeredTournaments || raw?.items || [];
  const tournaments = source.map(normalizeTournament);
  const upcomingEvents = raw?.stats?.upcomingEvents ?? tournaments.filter((item) => !/finished|complete|completed/i.test(item.status || '')).length;

  return {
    title: raw?.title || 'Registered Tournaments',
    subtitle:
      raw?.subtitle ||
      "Oversee your elite racing schedule. Manage assigned jockeys and monitor the performance of your stable's finest thoroughbreds across the season's premier events.",
    stats: {
      upcomingEvents,
      totalCommittedStakes: raw?.stats?.totalCommittedStakes || 'TBA',
    },
    tournaments,
    total: raw?.total ?? tournaments.length,
    deadlineTitle: raw?.deadlineTitle || 'Registration Deadlines',
    deadlineText:
      raw?.deadlineText ||
      'Tournament changes and jockey reassignments must be finalized at least 72 hours prior to the race date. Please contact the Club Concierge for expedited modifications.',
  };
}

function readMyTournamentsFromLocalStorage(): RawMyTournamentData | null {
  try {
    const raw = window.localStorage.getItem('horse_owner_my_tournaments_data');
    return raw ? (JSON.parse(raw) as RawMyTournamentData) : null;
  } catch {
    return null;
  }
}

async function readMyTournamentsFromApi(): Promise<RawMyTournamentData | null> {
  try {
    const endpoint = process.env.REACT_APP_HORSE_OWNER_MY_TOURNAMENTS_API || '/api/horse-owner/my-tournaments';
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) return null;
    return (await response.json()) as RawMyTournamentData;
  } catch {
    return null;
  }
}

function entryTone(status?: string) {
  const text = String(status || '').toLowerCase();
  if (text.includes('reject')) return 'rejected';
  if (text.includes('approved')) return 'approved';
  if (text.includes('pending')) return 'pending';
  return 'neutral';
}

function statusTone(status?: string) {
  const text = String(status || '').toLowerCase();
  if (text.includes('1st') || text.includes('place')) return 'success';
  if (text.includes('ongoing') || text.includes('on going')) return 'active';
  return 'neutral';
}

function StatusChip({ value }: { value?: string }) {
  return <span className={`owner-tournament-status owner-tournament-status--${entryTone(value)}`}>{value || 'TBA'}</span>;
}

export default function HorseOwnerMyTournament() {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState(() => normalizeData(readMyTournamentsFromLocalStorage()));

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiData = await readMyTournamentsFromApi();
      const localData = readMyTournamentsFromLocalStorage();
      if (!cancelled) {
        setData(normalizeData(apiData ?? localData));
        setPage(1);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageCount = Math.max(1, Math.ceil(data.tournaments.length / PAGE_SIZE));
  const visibleTournaments = data.tournaments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start = data.tournaments.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, data.tournaments.length);

  React.useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  return (
    <div className="horse-owner-my-tournament">
      <OwnerPortalHeader />

      <main className="owner-tournament-main" aria-label="Registered tournaments">
        <section className="owner-tournament-hero">
          <div>
            <h1>{data.title}</h1>
            <p>{data.subtitle}</p>
          </div>
          <Link className="owner-tournament-enter" to="/HorseOwner/Tournaments">
            Enter New Event
          </Link>
        </section>

        <section className="owner-tournament-stats" aria-label="Tournament summary">
          <article>
            <span>Upcoming Events</span>
            <strong>{data.stats.upcomingEvents}</strong>
          </article>
          <article>
            <span>Total Committed Stakes</span>
            <strong>{data.stats.totalCommittedStakes}</strong>
          </article>
        </section>

        <section className="owner-tournament-table-card" aria-label="Registered tournament table">
          <div className="owner-tournament-table">
            <div className="owner-tournament-table__head" role="row">
              <div role="columnheader">Tournament Name</div>
              <div role="columnheader">Horse</div>
              <div role="columnheader">Jockey</div>
              <div role="columnheader">Date</div>
              <div role="columnheader">Entry Status</div>
              <div role="columnheader">Status</div>
              <div aria-hidden="true" />
            </div>

            {visibleTournaments.map((tournament) => (
              <article className="owner-tournament-row" key={tournament.id || tournament.name}>
                <div className="owner-tournament-row__title" data-label="Tournament Name">
                  <strong>{tournament.name}</strong>
                  {tournament.location ? <span>{tournament.location}</span> : null}
                </div>
                <div data-label="Horse">{tournament.horse}</div>
                <div data-label="Jockey">{tournament.jockey}</div>
                <div data-label="Date">{tournament.date}</div>
                <div data-label="Entry Status">
                  <StatusChip value={tournament.entryStatus} />
                </div>
                <div className={`owner-tournament-row__status is-${statusTone(tournament.status)}`} data-label="Status">
                  {tournament.status}
                </div>
                <button className="owner-tournament-menu" type="button" aria-label={`Actions for ${tournament.name}`}>
                  <OwnerPortalIcon name="more" />
                </button>
              </article>
            ))}

            {data.tournaments.length === 0 ? (
              <div className="owner-tournament-empty">
                Registered tournament data is empty. Connect `/api/horse-owner/my-tournaments`, set
                `REACT_APP_HORSE_OWNER_MY_TOURNAMENTS_API`, or provide `horse_owner_my_tournaments_data`
                in localStorage.
              </div>
            ) : null}
          </div>

          {data.tournaments.length > 0 ? (
            <div className="owner-tournament-pagination">
              <span>Showing {start}-{end} of {data.total} tournaments</span>
              <nav aria-label="Registered tournament pages">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    className={pageNumber === page ? 'is-active' : ''}
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={pageNumber === page ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                ))}
                {pageCount > 3 ? <span>...</span> : null}
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                  disabled={page === pageCount}
                  aria-label="Next page"
                >
                  ›
                </button>
              </nav>
            </div>
          ) : null}
        </section>

        <aside className="owner-tournament-notice" aria-label="Registration deadlines">
          <OwnerPortalIcon name="info" />
          <div>
            <h2>{data.deadlineTitle}</h2>
            <p>{data.deadlineText}</p>
          </div>
        </aside>
      </main>

      <footer className="owner-tournament-footer">
        <div>
          <h2>Heritage Racing</h2>
          <p>(c) 2024 Heritage Racing. All rights reserved.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#rules">Rules of Racing</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </nav>
      </footer>
    </div>
  );
}
