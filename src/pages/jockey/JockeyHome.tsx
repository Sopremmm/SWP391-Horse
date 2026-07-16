import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/common/Footer.tsx';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import './JockeyHome.css';

export type JockeyDashboardData = {
  jockeyName?: string;
  intro?: string;
  featuredEvent?: {
    label?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    invitationUrl?: string;
  } | null;
  stats?: Array<{ id: string; label: string; value?: string | number; suffix?: string }>;
  invitations?: Array<{
    id: string;
    horseName?: string;
    stableName?: string;
    raceName?: string;
    raceDate?: string;
    horseImageUrl?: string;
    invitationUrl?: string;
  }>;
  leaderboard?: Array<{ id: string; rank?: number; horseName?: string; breed?: string }>;
};

type JockeyHomeProps = { data?: JockeyDashboardData | null; loading?: boolean };

const EMPTY_DATA: Required<Pick<JockeyDashboardData, 'stats' | 'invitations' | 'leaderboard'>> = {
  stats: [],
  invitations: [],
  leaderboard: [],
};

function EmptyState({ children }: React.PropsWithChildren) {
  return <div className="jockey-home__empty">{children}</div>;
}

export default function JockeyHome({ data, loading = false }: JockeyHomeProps) {
  const dashboard = { ...EMPTY_DATA, ...data };
  const displayName = dashboard.jockeyName?.trim();

  return (
    <div className="jockey-home">
      <JockeyHeader />
      <main className="jockey-home__main" aria-busy={loading}>
        <section className="jockey-home__welcome">
          <h1>{displayName ? `Welcome back, ${displayName}` : 'Welcome back'}</h1>
          <p>{dashboard.intro || 'Your stables are ready and the track is clear for today’s sessions.'}</p>
        </section>

        {dashboard.featuredEvent ? (
          <section className="jockey-home__hero">
            {dashboard.featuredEvent.imageUrl ? <img src={dashboard.featuredEvent.imageUrl} alt="" /> : null}
            <div className="jockey-home__hero-shade" />
            <div className="jockey-home__hero-content">
              {dashboard.featuredEvent.label ? <span>{dashboard.featuredEvent.label}</span> : null}
              {dashboard.featuredEvent.title ? <h2>{dashboard.featuredEvent.title}</h2> : null}
              {dashboard.featuredEvent.description ? <p>{dashboard.featuredEvent.description}</p> : null}
              {dashboard.featuredEvent.invitationUrl ? <Link to={dashboard.featuredEvent.invitationUrl}>View Invitation <b>→</b></Link> : null}
            </div>
          </section>
        ) : (
          <EmptyState>No featured event available.</EmptyState>
        )}

        <section className="jockey-home__stats" aria-label="Career statistics">
          {dashboard.stats.length ? dashboard.stats.map((stat) => (
            <article key={stat.id}>
              <span>{stat.label}</span>
              <strong>{stat.value ?? '—'}{stat.suffix ? <small>{stat.suffix}</small> : null}</strong>
            </article>
          )) : <EmptyState>Statistics will appear here.</EmptyState>}
        </section>

        <div className="jockey-home__dashboard-grid">
          <section className="jockey-home__section">
            <header><h2><span aria-hidden="true">✉</span> Race Invitations</h2><Link to="/Jockey/Invitations">View All</Link></header>
            <div className="jockey-home__invitation-list">
              {dashboard.invitations.length ? dashboard.invitations.map((invite) => (
                <article className="jockey-home__invitation" key={invite.id}>
                  {invite.horseImageUrl ? <img src={invite.horseImageUrl} alt="" /> : <div className="jockey-home__image-placeholder" />}
                  <div className="jockey-home__invitation-info">
                    <strong>{invite.horseName || 'Unnamed horse'}</strong>
                    {invite.stableName ? <p>Invitation from <b>{invite.stableName}</b></p> : null}
                  </div>
                  <div className="jockey-home__race-info">
                    {invite.raceDate ? <time>{invite.raceDate}</time> : null}
                    {invite.raceName ? <span>{invite.raceName}</span> : null}
                  </div>
                  {invite.invitationUrl ? <Link to={invite.invitationUrl}>View Invitation</Link> : null}
                </article>
              )) : <EmptyState>No race invitations yet.</EmptyState>}
            </div>
          </section>

          <section className="jockey-home__section jockey-home__leaderboard">
            <header><h2><span aria-hidden="true">♛</span> Horses Leaderboard</h2><Link to="/Jockey/HorseLeaderBoard">View Full Rank</Link></header>
            {dashboard.leaderboard.length ? (
              <div className="jockey-home__rank-table">
                <div className="jockey-home__rank-head"><span>Rank</span><span>Horse name</span><span>Breed</span></div>
                {dashboard.leaderboard.map((horse) => <div className="jockey-home__rank-row" key={horse.id}><span>{horse.rank ? String(horse.rank).padStart(2, '0') : '—'}</span><strong>{horse.horseName || '—'}</strong><span>{horse.breed || '—'}</span></div>)}
                <p>Ranking based on the latest performance data</p>
              </div>
            ) : <EmptyState>Leaderboard data is not available.</EmptyState>}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
