import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/common/Footer.tsx';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import tournamentFallbackOne from '../../assets/images/horseracing1.jpg';
import tournamentFallbackTwo from '../../assets/images/RunningHorse.jpg';
import './JockeyTournaments.css';

export type JockeyTournament = {
  id: string;
  name?: string;
  description?: string;
  status?: string;
  dateLabel?: string;
  startDate?: string;
  imageUrl?: string;
  prizePool?: string;
  raceCount?: number;
  detailsUrl?: string;
};

export type JockeyTournamentsData = {
  featured?: JockeyTournament[];
  tournaments?: JockeyTournament[];
};

type Props = { data?: JockeyTournamentsData | null; loading?: boolean };
const PAGE_SIZE = 6;
const TOURNAMENT_FALLBACKS = [tournamentFallbackOne, tournamentFallbackTwo];

function Empty({ children }: React.PropsWithChildren) {
  return <div className="jockey-tournaments__empty">{children}</div>;
}

function TournamentImage({ tournament, index }: { tournament: JockeyTournament; index: number }) {
  const fallback = TOURNAMENT_FALLBACKS[index % TOURNAMENT_FALLBACKS.length];
  return (
    <img
      src={tournament.imageUrl || fallback}
      alt={tournament.name || 'Tournament'}
      onError={(event) => {
        if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
      }}
    />
  );
}

function DetailsLink({ tournament, featured = false }: { tournament: JockeyTournament; featured?: boolean }) {
  return tournament.detailsUrl ? <Link className={featured ? 'jockey-tournaments__hero-link' : 'jockey-tournaments__card-link'} to={tournament.detailsUrl}>View {featured ? 'Details →' : 'Tournament'}</Link> : null;
}

export default function JockeyTournaments({ data, loading = false }: Props) {
  const featured = data?.featured ?? [];
  const tournaments = React.useMemo(() => data?.tournaments ?? [], [data?.tournaments]);
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('date-asc');
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return tournaments
      .filter((item) => !normalized || item.name?.toLocaleLowerCase().includes(normalized))
      .sort((a, b) => {
        const first = a.startDate ? Date.parse(a.startDate) : Number.MAX_SAFE_INTEGER;
        const second = b.startDate ? Date.parse(b.startDate) : Number.MAX_SAFE_INTEGER;
        return sort === 'date-desc' ? second - first : first - second;
      });
  }, [query, sort, tournaments]);

  React.useEffect(() => setVisibleCount(PAGE_SIZE), [query, sort]);

  return (
    <div className="jockey-tournaments">
      <JockeyHeader />
      <main className="jockey-tournaments__main" aria-busy={loading}>
        <section>
          <p className="jockey-tournaments__eyebrow">Elite Events</p>
          <h1>Featured Tournaments</h1>
          <div className="jockey-tournaments__featured">
            {featured.length ? featured.map((item, index) => (
              <article className="jockey-tournaments__hero-card" key={item.id}>
                <TournamentImage tournament={item} index={index} /><div className="jockey-tournaments__hero-shade" />
                <div className="jockey-tournaments__hero-content">
                  <div><span>{item.status || 'Featured'}</span><h2>{item.name || 'Untitled tournament'}</h2>{item.description ? <p>{item.description}</p> : null}</div>
                  {item.prizePool ? <aside><small>Prize pool</small><strong>{item.prizePool}</strong></aside> : null}
                  <DetailsLink tournament={item} featured />
                </div>
              </article>
            )) : <Empty>No featured tournaments available.</Empty>}
          </div>
        </section>

        <section className="jockey-tournaments__filters" aria-label="Tournament filters">
          <label><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tournaments by name..." aria-label="Search tournaments" /></label>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort tournaments"><option value="date-asc">Sort by Date</option><option value="date-desc">Newest First</option></select>
          <button type="button" onClick={() => setVisibleCount(PAGE_SIZE)}>Filter</button>
        </section>

        <section className="jockey-tournaments__schedule">
          <h2>Active &amp; Upcoming Schedule</h2>
          {filtered.length ? (
            <div className="jockey-tournaments__grid">
              {filtered.slice(0, visibleCount).map((item, index) => (
                <article className="jockey-tournaments__card" key={item.id}>
                  <div className="jockey-tournaments__card-image"><TournamentImage tournament={item} index={index} /></div>
                  <div className="jockey-tournaments__card-body">
                    {item.status ? <span className="jockey-tournaments__status">{item.status}</span> : null}
                    <h3>{item.name || 'Untitled tournament'}</h3>
                    {item.dateLabel ? <time>▣ {item.dateLabel}</time> : null}
                    <dl><div><dt>Races</dt><dd>{item.raceCount ?? '—'}{item.raceCount !== undefined ? ' Events' : ''}</dd></div><div><dt>Prize pool</dt><dd>{item.prizePool || '—'}</dd></div></dl>
                    <DetailsLink tournament={item} />
                  </div>
                </article>
              ))}
            </div>
          ) : <Empty>{query ? 'No tournaments match your search.' : 'Tournament schedule is currently empty.'}</Empty>}
          {visibleCount < filtered.length ? <button className="jockey-tournaments__more" type="button" onClick={() => setVisibleCount((value) => value + PAGE_SIZE)}>Load More Tournaments⌄</button> : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
