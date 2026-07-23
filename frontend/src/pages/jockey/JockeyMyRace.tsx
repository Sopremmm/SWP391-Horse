import React from 'react';
import { Link } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import './JockeyMyRace.css';

export type JockeyRaceAssignment = {
  id: string;
  tournamentName: string;
  raceName: string;
  seriesName?: string;
  distance?: string;
  horseName?: string;
  horseImageUrl?: string;
  horseBreed?: string;
  horseSex?: string;
  position?: number;
  status: 'upcoming' | 'completed';
};

export type JockeyMyRaceData = { assignments?: JockeyRaceAssignment[]; totalRaces?: number; winRate?: number; total?: number };
type Props = { data?: JockeyMyRaceData | null; loading?: boolean };
type RaceFilter = 'upcoming' | 'completed';
const PAGE_SIZE = 5;

export default function JockeyMyRace({ data, loading = false }: Props) {
  const assignments = React.useMemo(() => data?.assignments ?? [], [data?.assignments]);
  const [filter, setFilter] = React.useState<RaceFilter>('upcoming');
  const [page, setPage] = React.useState(1);
  const filtered = assignments.filter((race) => race.status === filter);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  React.useEffect(() => setPage(1), [filter]);

  return <div className="jockey-my-race"><JockeyHeader /><main aria-busy={loading}>
    <section className="jockey-my-race__hero"><span>Dashboard › My Races</span><h1>My Race Assignments</h1><p>Track your professional schedule, upcoming tournament entries, and historical performance data across the current season.</p></section>
    <section className="jockey-my-race__content">
      <div className="jockey-my-race__stats"><article><span>Total Races</span><strong>{data?.totalRaces ?? '—'}</strong></article><article><span>Win Rate</span><strong>{data?.winRate !== undefined ? `${data.winRate}%` : '—'}</strong></article></div>
      <section className="jockey-my-race__panel"><header><div><h2>Current Assignments</h2><p>{filtered.length} {filter} races</p></div><nav aria-label="Race filters"><button className={filter === 'upcoming' ? 'is-active' : ''} onClick={() => setFilter('upcoming')}>Upcoming</button><button className={filter === 'completed' ? 'is-active' : ''} onClick={() => setFilter('completed')}>Completed</button></nav></header>
        {visible.length ? <div className="jockey-my-race__table"><div className="jockey-my-race__head"><span>Race name</span><span>Horse</span><span>Position</span><span>Status</span><span>Action</span></div>{visible.map((race) => <article className="jockey-my-race__row" key={race.id}>
          <div data-label="Race name"><strong>{race.raceName}</strong><small>{[race.seriesName || race.tournamentName, race.distance].filter(Boolean).join(' • ')}</small></div>
          <div className="jockey-my-race__horse" data-label="Horse">{race.horseImageUrl ? <img src={race.horseImageUrl} alt="" /> : <i />}<span><strong>{race.horseName || 'Horse pending'}</strong><small>{[race.horseBreed, race.horseSex].filter(Boolean).join(' • ')}</small></span></div>
          <div className="jockey-my-race__position" data-label="Position">{race.status === 'completed' && race.position ? <><strong>{String(race.position).padStart(2, '0')}</strong><small>Official rank</small></> : <b>Pending</b>}</div>
          <span className={`jockey-my-race__status is-${race.status}`} data-label="Status">{race.status}</span>
          <Link className={`jockey-my-race__view is-${race.status}`} to={`/jockey/tournament/${encodeURIComponent(race.tournamentName)}/${encodeURIComponent(race.raceName)}`}>View Race</Link>
        </article>)}</div> : <div className="jockey-my-race__empty">No {filter} race assignments available.</div>}
        {filtered.length ? <footer><span>Showing {visible.length} of {data?.total ?? filtered.length} assignments</span><nav><button disabled={page === 1} onClick={() => setPage((v) => v - 1)}>‹</button><b>{page}</b><span>/ {pageCount}</span><button disabled={page === pageCount} onClick={() => setPage((v) => v + 1)}>›</button></nav></footer> : null}
      </section>
    </section>
  </main><Footer /></div>;
}
