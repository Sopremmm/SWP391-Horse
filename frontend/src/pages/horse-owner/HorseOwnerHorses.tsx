import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/common/Header.tsx';
import { getHorseOwnerHorseLeaderboardData } from '../../services/integration.ts';
import './HorseOwnerHorses.css';

export type LeaderboardHorse = {
  id?: string;
  rank?: number;
  name: string;
  owner?: string;
  breed?: string;
  age?: string | number;
  winRatio?: number;
  totalStarts?: number;
  lastResult?: {
    position?: string;
    race?: string;
  };
  imageSrc?: string;
};

type HorsesLeaderboardData = {
  horses: LeaderboardHorse[];
  total?: number;
};

type RawHorsesLeaderboardData = Partial<HorsesLeaderboardData> & {
  items?: LeaderboardHorse[];
  leaderboard?: LeaderboardHorse[];
};

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M4 14h2V9H4v5Zm8 0h2V4h-2v10Zm-4 0h2v-3H8v3Zm0-5h2V7H8v2ZM2 18c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 16V2C0 1.45.2.98.59.59 1 .2 1.45 0 2 0h14c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v14c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H2Zm0-2h14V2H2v14Z"
      fill="currentColor"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="m2.68 13 1.1-4.75L.1 5.05l4.86-.42L6.85.15l1.9 4.48 4.86.42-3.68 3.2L11.03 13 6.85 10.48 2.68 13Z"
      fill="currentColor"
    />
  </svg>
);

const normalizeHorsesData = (raw?: RawHorsesLeaderboardData | null): HorsesLeaderboardData => {
  const horses = raw?.horses || raw?.items || raw?.leaderboard || [];
  return {
    horses: horses.map((horse, index) => ({
      ...horse,
      rank: horse.rank ?? index + 1,
      owner: horse.owner || 'Unassigned',
      breed: horse.breed || 'Unknown',
      age: horse.age ?? 'TBA',
      winRatio: Number(horse.winRatio ?? 0),
      totalStarts: Number(horse.totalStarts ?? 0),
      lastResult: horse.lastResult || {},
    })),
    total: raw?.total ?? horses.length,
  };
};

const resultTone = (position?: string) => {
  const text = String(position || '').toLowerCase();
  if (text.includes('1')) return 'first';
  if (text.includes('2')) return 'second';
  return 'neutral';
};

const horseHref = (horse: LeaderboardHorse) => `/HorseOwner/Horses/${encodeURIComponent(horse.id || horse.name)}`;

export default function HorseOwnerHorses() {
  const [data, setData] = React.useState<HorsesLeaderboardData>(() => normalizeHorsesData(null));
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiData = await getHorseOwnerHorseLeaderboardData().catch(() => null);
      if (!cancelled) setData(normalizeHorsesData(apiData));
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const total = data.total ?? data.horses.length;
  const pageCount = Math.max(1, Math.ceil(data.horses.length / pageSize));
  const start = (page - 1) * pageSize;
  const visibleHorses = data.horses.slice(start, start + pageSize);

  return (
    <div className="horse-leaderboard">
      <Header />

      <main className="horse-leaderboard__main">
        <section className="horse-leaderboard__hero">
          <p>Registry <span /> Live Leaderboard</p>
          <h1>Horse Registry &amp; Leaderboard</h1>
          <strong>
            Explore the elite thoroughbreds of the 2024 season. Track performance, win ratios,
            and racing lineage with professional-grade analytics.
          </strong>
        </section>

        <section className="horse-leaderboard__table-card" aria-label="Horse leaderboard">
          {visibleHorses.length > 0 ? (
            <>
              <div className="horse-leaderboard__table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Horse Name</th>
                      <th>Breed/Origin</th>
                      <th>Win Ratio (%)</th>
                      <th>Total Starts</th>
                      <th>Last Result</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleHorses.map((horse) => (
                      <tr key={horse.id || horse.name}>
                        <td>
                          <span className={horse.rank === 1 ? 'horse-leaderboard__rank is-top' : 'horse-leaderboard__rank'}>
                            {String(horse.rank).padStart(2, '0')}
                            {horse.rank === 1 ? <StarIcon /> : null}
                          </span>
                        </td>
                        <td>
                          <Link className="horse-leaderboard__horse" to={horseHref(horse)}>
                            {horse.imageSrc ? <img src={horse.imageSrc} alt="" /> : <span aria-hidden="true" />}
                            <div>
                              <b>{horse.name}</b>
                              <small>Owner: {horse.owner}</small>
                            </div>
                          </Link>
                        </td>
                        <td>
                          <div className="horse-leaderboard__breed">
                            <b>{horse.breed}</b>
                            <small>AGE: {horse.age} YRS</small>
                          </div>
                        </td>
                        <td>
                          <div className="horse-leaderboard__ratio">
                            <b>{horse.winRatio}%</b>
                            <span><i style={{ width: `${Math.min(Math.max(horse.winRatio || 0, 0), 100)}%` }} /></span>
                          </div>
                        </td>
                        <td>{horse.totalStarts}</td>
                        <td>
                          <div className="horse-leaderboard__result">
                            <span className={`horse-leaderboard__result-pill is-${resultTone(horse.lastResult?.position)}`}>
                              {horse.lastResult?.position || 'TBA'}
                            </span>
                            <small>{horse.lastResult?.race || 'No recent race'}</small>
                          </div>
                        </td>
                        <td>
                          <Link className="horse-leaderboard__action" to={horseHref(horse)} aria-label={`View ${horse.name}`}>
                            <ChartIcon />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="horse-leaderboard__pagination">
                <span>
                  Showing {start + 1}-{Math.min(start + visibleHorses.length, total)} of {total} Horses
                </span>
                <div>
                  <button type="button" onClick={() => setPage(1)} disabled={page === 1}>|&lt;</button>
                  <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>&lt;</button>
                  <strong>{page}</strong>
                  <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount}>&gt;</button>
                  <button type="button" onClick={() => setPage(pageCount)} disabled={page === pageCount}>&gt;|</button>
                </div>
              </div>
            </>
          ) : (
            <div className="horse-leaderboard__empty">
              Horse leaderboard data is empty.
            </div>
          )}
        </section>
      </main>

      <footer className="horse-leaderboard__footer">
        <div className="horse-leaderboard__footer-inner">
          <div>
            <h2>Heritage Racing</h2>
            <p>The world's premier platform for professional horse racing management, lineage tracking, and real-time performance analytics.</p>
          </div>
          <nav aria-label="Navigation">
            <strong>Navigation</strong>
            <a href="#about">About Us</a>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#rules">Racing Rules</a>
          </nav>
          <nav aria-label="Contact">
            <strong>Contact</strong>
            <a href="mailto:support@heritageracing.com">support@heritageracing.com</a>
          </nav>
        </div>
        <div className="horse-leaderboard__copyright">
          <span>(c) 2024 Heritage Racing Management. All rights reserved.</span>
          <span>Verified registry data</span>
        </div>
      </footer>
    </div>
  );
}
