import React from 'react';
import { useParams } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import './JockeyRaceDetail.css';

export type RaceLineupEntry = {
  id: string;
  gate?: number;
  horseName?: string;
  breed?: string;
  sex?: string;
  ownerName?: string;
  jockeyName?: string;
  jockeyAvatarUrl?: string;
  finishTime?: string;
  rankLabel?: string;
  isCurrentJockey?: boolean;
};

export type JockeyRaceDetailData = {
  tournamentName?: string;
  raceName?: string;
  statusLabel?: string;
  dateTime?: string;
  distance?: string;
  venue?: string;
  heroImageUrl?: string;
  lineup?: RaceLineupEntry[];
};

type Props = { data?: JockeyRaceDetailData | null; loading?: boolean };

export default function JockeyRaceDetail({ data, loading = false }: Props) {
  const params = useParams();
  const tournamentName = data?.tournamentName || decodeURIComponent(params.name || 'Tournament');
  const raceName = data?.raceName || decodeURIComponent(params.race || 'Race');
  const lineup = data?.lineup ?? [];

  return (
    <div className="jockey-race-detail">
      <JockeyHeader />
      <main className="jockey-race-detail__main" aria-busy={loading}>
        <section className="jockey-race-detail__hero">
          {data?.heroImageUrl ? <img src={data.heroImageUrl} alt="" /> : null}
          <div className="jockey-race-detail__shade" />
          <div className="jockey-race-detail__hero-copy">
            <span>{data?.statusLabel || 'Race details'}</span>
            <h1>{raceName}</h1>
            <p>{[data?.dateTime, data?.distance, data?.venue].filter(Boolean).join(' • ') || tournamentName}</p>
          </div>
        </section>

        <section className="jockey-race-detail__lineup">
          <h2>Official Race Lineup</h2>
          {lineup.length ? (
            <div className="jockey-race-detail__table" role="table" aria-label="Official race lineup">
              <div className="jockey-race-detail__head" role="row"><span>Gate</span><span>Horse</span><span>Owner</span><span>Jockey</span><span>Finish time</span><span>Rank</span></div>
              {lineup.map((entry) => (
                <article className={`jockey-race-detail__row ${entry.isCurrentJockey ? 'is-current' : ''}`} role="row" key={entry.id}>
                  <strong className="jockey-race-detail__gate" data-label="Gate">{entry.gate !== undefined ? String(entry.gate).padStart(2, '0') : '—'}</strong>
                  <div className="jockey-race-detail__horse" data-label="Horse"><strong>{entry.horseName || 'Unnamed horse'}</strong>{entry.isCurrentJockey ? <b>Your horse</b> : null}<small>♞ {[entry.breed, entry.sex].filter(Boolean).join(' · ') || 'Details pending'}</small></div>
                  <span data-label="Owner">{entry.ownerName || '—'}</span>
                  <div className="jockey-race-detail__jockey" data-label="Jockey">{entry.jockeyAvatarUrl ? <img src={entry.jockeyAvatarUrl} alt="" /> : <i aria-hidden="true" /> }<strong>{entry.jockeyName || 'Unassigned'}{entry.isCurrentJockey ? ' (Me)' : ''}</strong></div>
                  <strong className="jockey-race-detail__time" data-label="Finish time">{entry.finishTime || 'Pending'}</strong>
                  <span data-label="Rank"><b className={`jockey-race-detail__rank ${entry.rankLabel ? 'has-rank' : ''}`}>{entry.rankLabel || 'Pending'}</b></span>
                </article>
              ))}
            </div>
          ) : <div className="jockey-race-detail__empty">The official lineup has not been announced.</div>}
        </section>
      </main>
      <Footer />
    </div>
  );
}
