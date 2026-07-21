import React from 'react';
import { Link } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import './JockeyHorseLeaderboard.css';

export type LeaderboardHorse = {
  id: string;
  rank?: number;
  name?: string;
  imageUrl?: string;
  ownerName?: string;
  breed?: string;
  origin?: string;
  age?: number;
  winRatio?: number;
  totalStarts?: number;
  lastPlace?: string;
  lastRace?: string;
};

export type HorseLeaderboardData = { horses?: LeaderboardHorse[]; total?: number; season?: string };
type Props = { data?: HorseLeaderboardData | null; loading?: boolean };
const PAGE_SIZE = 10;

export default function JockeyHorseLeaderboard({ data, loading = false }: Props) {
  const horses = React.useMemo(() => data?.horses ?? [], [data?.horses]);
  const [page, setPage] = React.useState(1);
  const pageCount = Math.max(1, Math.ceil(horses.length / PAGE_SIZE));
  const visible = horses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => setPage((value) => Math.min(value, pageCount)), [pageCount]);

  return <div className="jockey-horse-board"><JockeyHeader />
    <main aria-busy={loading}>
      <section className="jockey-horse-board__hero"><span>Registry › Live Leaderboard</span><h1>Horse Registry &amp; Leaderboard</h1><p>Explore elite racehorses{data?.season ? ` of the ${data.season} season` : ''}. Track performance, win ratios, and racing lineage with professional-grade analytics.</p></section>
      <section className="jockey-horse-board__content">
        {visible.length ? <div className="jockey-horse-board__table">
          <div className="jockey-horse-board__head"><span>Rank</span><span>Horse name</span><span>Breed/Origin</span><span>Win ratio (%)</span><span>Total starts</span><span>Last result</span><span>Action</span></div>
          {visible.map((horse) => { const href = `/Jockey/Horse/${encodeURIComponent(horse.name || horse.id)}`; return <article className="jockey-horse-board__row" key={horse.id}>
            <strong className={horse.rank === 1 ? 'is-first' : ''} data-label="Rank">{horse.rank ? String(horse.rank).padStart(2, '0') : '—'}{horse.rank === 1 ? '☆' : ''}</strong>
            <div className="jockey-horse-board__horse" data-label="Horse name">{horse.imageUrl ? <img src={horse.imageUrl} alt="" /> : <i />}<div><Link to={href}>{horse.name || 'Unnamed horse'}</Link><small>Owner: {horse.ownerName || '—'}</small></div></div>
            <div data-label="Breed/Origin"><span>{horse.breed || '—'}</span><small>{[horse.origin, horse.age !== undefined ? `Age: ${horse.age} yrs` : ''].filter(Boolean).join(' · ')}</small></div>
            <div className="jockey-horse-board__ratio" data-label="Win ratio"><strong>{horse.winRatio !== undefined ? `${horse.winRatio}%` : '—'}</strong><i><b style={{ width: `${Math.min(100, Math.max(0, horse.winRatio || 0))}%` }} /></i></div>
            <span data-label="Total starts">{horse.totalStarts ?? '—'}</span>
            <div className="jockey-horse-board__result" data-label="Last result">{horse.lastPlace ? <b>{horse.lastPlace}</b> : <span>—</span>}<small>{horse.lastRace || ''}</small></div>
            <Link className="jockey-horse-board__action" to={href} aria-label={`View ${horse.name || 'horse'} details`}>▥</Link>
          </article>; })}
          <footer><span>Showing {visible.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, horses.length)} of {data?.total ?? horses.length} Horses</span><nav aria-label="Leaderboard pages"><button disabled={page === 1} onClick={() => setPage(1)}>‹|</button><button disabled={page === 1} onClick={() => setPage((v) => v - 1)}>‹</button><b>{page}</b><span>/ {pageCount}</span><button disabled={page === pageCount} onClick={() => setPage((v) => v + 1)}>›</button><button disabled={page === pageCount} onClick={() => setPage(pageCount)}>|</button></nav></footer>
        </div> : <div className="jockey-horse-board__empty">Leaderboard data is not available.</div>}
      </section>
    </main><Footer />
  </div>;
}
