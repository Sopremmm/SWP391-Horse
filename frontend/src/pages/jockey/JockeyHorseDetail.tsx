import React from 'react';
import { Link, useParams } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import './JockeyHorseLeaderboard.css';

type JockeyHorseDetailData = {
  name: string;
  owner?: string;
  breed?: string;
  age?: string;
  winRatio?: string;
  totalRaces?: string;
  currentTournament?: string;
  imageUrl?: string;
  history?: Array<{
    raceName: string;
    tournamentName?: string;
    status?: string;
    jockeyName?: string;
  }>;
};

type Props = {
  data?: JockeyHorseDetailData | null;
  loading?: boolean;
  error?: string;
};

export default function JockeyHorseDetail({ data, loading = false, error }: Props) {
  const { name = '' } = useParams();
  const displayName = data?.name || decodeURIComponent(name);

  return (
    <div className="jockey-horse-board">
      <JockeyHeader />
      <main aria-busy={loading}>
        <section className="jockey-horse-board__hero">
          <span>Horse Registry</span>
          <h1>{displayName}</h1>
          <p>
            {data
              ? [data.owner ? `Owner: ${data.owner}` : '', data.currentTournament ? `Current Event: ${data.currentTournament}` : '']
                  .filter(Boolean)
                  .join(' • ') || 'Horse profile synced from the backend.'
              : 'Horse profile and performance data will be loaded from the API.'}
          </p>
        </section>

        <section className="jockey-horse-board__content">
          {data ? (
            <div className="jockey-horse-board__table">
              <div className="jockey-horse-board__head">
                <span>Breed</span>
                <span>Age</span>
                <span>Win ratio</span>
                <span>Total starts</span>
                <span>Current tournament</span>
                <span>Action</span>
              </div>
              <article className="jockey-horse-board__row">
                <div data-label="Breed">
                  <strong>{data.breed || '—'}</strong>
                  <small>{data.owner || 'Owner pending'}</small>
                </div>
                <span data-label="Age">{data.age || '—'}</span>
                <div className="jockey-horse-board__ratio" data-label="Win ratio">
                  <strong>{data.winRatio || '—'}</strong>
                  <i>
                    <b style={{ width: `${Math.min(100, Math.max(0, Number(String(data.winRatio || '0').replace(/[^\d.]/g, '')) || 0))}%` }} />
                  </i>
                </div>
                <span data-label="Total starts">{data.totalRaces || '—'}</span>
                <div data-label="Current tournament">
                  <strong>{data.currentTournament || '—'}</strong>
                  <small>{data.history?.[0]?.raceName || 'Race pending'}</small>
                </div>
                <Link className="jockey-horse-board__action" to="/Jockey/HorseLeaderBoard" aria-label="Back to leaderboard">
                  ▥
                </Link>
              </article>

              {data.history?.length ? (
                <>
                  <div className="jockey-horse-board__head">
                    <span>Recent race</span>
                    <span>Tournament</span>
                    <span>Status</span>
                    <span>Jockey</span>
                    <span />
                    <span />
                  </div>
                  {data.history.map((item, index) => (
                    <article className="jockey-horse-board__row" key={`${item.raceName}-${index}`}>
                      <strong data-label="Recent race">{item.raceName}</strong>
                      <span data-label="Tournament">{item.tournamentName || '—'}</span>
                      <span data-label="Status">{item.status || '—'}</span>
                      <span data-label="Jockey">{item.jockeyName || '—'}</span>
                      <span />
                      <span />
                    </article>
                  ))}
                </>
              ) : null}
            </div>
          ) : (
            <div className="jockey-horse-board__empty">
              {loading ? 'Loading horse details...' : error || 'Horse details are not available.'}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
