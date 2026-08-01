import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../../components/common/Footer.tsx';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import './JockeyTournamentDetail.css';

export type TournamentRace = {
  id: string;
  name: string;
  round: 'qualifying' | 'semifinal' | 'final';
  dateTime?: string;
  distance?: string;
  status?: 'completed' | 'live' | 'upcoming';
  winner?: string;
  venue?: string;
};

export type JockeyTournamentDetailData = {
  name?: string;
  label?: string;
  location?: string;
  dateRange?: string;
  imageUrl?: string;
  races?: TournamentRace[];
};

type Props = { data?: JockeyTournamentDetailData | null; loading?: boolean };
const roundLabels = { qualifying: 'Qualifying', semifinal: 'Semi-finals', final: 'Tournament Finals' };

function racePath(tournamentName: string, race: TournamentRace) {
  return `/Jockey/Tournaments/${encodeURIComponent(tournamentName)}/${encodeURIComponent(race.name || race.id)}`;
}

function Status({ value }: { value?: TournamentRace['status'] }) {
  if (!value) return null;
  return <span className={`jockey-tournament-detail__status is-${value}`}>{value === 'live' ? 'Live now' : value}</span>;
}

export default function JockeyTournamentDetail({ data, loading = false }: Props) {
  const params = useParams();
  const tournamentName = data?.name || decodeURIComponent(params.name || 'Tournament');
  const races = data?.races ?? [];

  return (
    <div className="jockey-tournament-detail">
      <JockeyHeader />
      <main className="jockey-tournament-detail__main" aria-busy={loading}>
        <section className="jockey-tournament-detail__hero">
          {data?.imageUrl ? <img src={data.imageUrl} alt={`${data.name || 'Tournament'} banner`} onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : null}<div className="jockey-tournament-detail__hero-shade" />
          <div><span>{data?.label || 'Heritage Racing presents'}</span><h1>{tournamentName}</h1><p>{data?.location || 'Location to be announced'} {data?.dateRange ? <>• {data.dateRange}</> : null}</p></div>
        </section>

        <section className="jockey-tournament-detail__bracket">
          <h2>Tournament Bracket</h2>
          {races.length ? <div className="jockey-tournament-detail__rounds">
            {(Object.keys(roundLabels) as TournamentRace['round'][]).map((round) => {
              const roundRaces = races.filter((race) => race.round === round);
              return <div className={`jockey-tournament-detail__round is-${round}`} key={round}>
                <h3>{roundLabels[round]}</h3><div className="jockey-tournament-detail__round-list">
                  {roundRaces.map((race) => <Link className="jockey-tournament-detail__race" to={racePath(tournamentName, race)} key={race.id}>
                    <div><small>{race.dateTime || 'Schedule pending'}</small><Status value={race.status} /></div><strong>{race.name}</strong>
                    <p><b>{race.round === 'final' ? '★' : race.id.slice(0, 2).toUpperCase()}</b>{race.winner || [race.dateTime, race.distance].filter(Boolean).join(' • ') || 'Race details pending'}</p><span>View Race →</span>
                  </Link>)}
                </div>
              </div>;
            })}
          </div> : <div className="jockey-tournament-detail__empty">Bracket data is not available.</div>}
        </section>

        <section className="jockey-tournament-detail__schedule">
          <h2>Race Schedule</h2>
          {races.length ? <div className="jockey-tournament-detail__table">
            <div className="jockey-tournament-detail__table-head"><span>Date &amp; time</span><span>Race name</span><span>Distance</span><span>Status</span><span>Action</span></div>
            {races.map((race) => <div className="jockey-tournament-detail__table-row" key={race.id}><strong>{race.dateTime || '—'}</strong><strong>{race.name}</strong><strong>{race.distance || '—'}</strong><Status value={race.status} /><Link to={racePath(tournamentName, race)}>View Race</Link></div>)}
          </div> : <div className="jockey-tournament-detail__empty">Race schedule is currently empty.</div>}
        </section>
      </main><Footer />
    </div>
  );
}
