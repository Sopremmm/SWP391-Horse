import React from 'react';
import { Footer } from '../../components/common/Footer.jsx';
import JockeyHeader from '../../components/jockey/JockeyHeader.jsx';
import HomeBanner from '../../assets/images/HomeBanner.png';
import './JockeyHome.css';

const invitations = [
  {
    owner: 'Owner: Lord Harrington',
    time: '2h ago',
    message: 'Requesting you for the "Autumn Sprint" on Silver Shadow.',
  },
  {
    owner: 'Estates of Valerius',
    time: '5h ago',
    message: 'Stakes race invitation for Noble Spirit at Epsom.',
  },
];

const tournaments = [
  { name: 'Grand National Steeplechase', horse: 'Thunder Dash', invitedBy: 'Lord Harrington', date: 'Oct 25, 2024' },
  { name: 'The Autumn Sprint', horse: 'Silver Shadow', invitedBy: 'Lord Harrington', date: 'Nov 02, 2024' },
  { name: 'Epsom Stakes', horse: 'Noble Spirit', invitedBy: 'Estates of Valerius', date: 'Nov 15, 2024' },
];

const careerStats = [
  { label: 'Total Races', value: '1,248' },
  { label: 'Total Wins', value: '312' },
  { label: 'Win Rate', value: '25.0%', highlight: true },
  { label: 'Career Earnings', value: 'GBP 2.4M' },
];

function Icon({ name }) {
  const paths = {
    arrow: 'M7.1 5.3H0V4.1h7.1L3.8.8 4.7 0l4.6 4.7-4.6 4.6-.9-.8 3.3-3.2Z',
    calendar:
      'M1.2 11.7c-.3 0-.6-.1-.8-.3-.3-.3-.4-.6-.4-.9V2.3c0-.3.1-.6.4-.8.2-.2.5-.3.8-.3h.6V0h1.1v1.2h4.7V0h1.1v1.2h.6c.3 0 .6.1.8.3.3.2.4.5.4.8v8.2c0 .3-.1.6-.4.9-.2.2-.5.3-.8.3H1.2Z',
    horse:
      'M1.5 5.3C1.1 5.3.7 5.1.4 4.8.1 4.5 0 4.2 0 3.8s.1-.8.4-1.1c.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1s-.1.7-.4 1c-.3.3-.7.5-1.1.5Zm8.7 0c-.4 0-.8-.2-1.1-.5-.3-.3-.4-.6-.4-1s.1-.8.4-1.1c.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1s-.1.7-.4 1c-.3.3-.7.5-1.1.5ZM2.7 11.1c-.4 0-.8-.2-1.1-.5-.3-.3-.4-.7-.4-1.2 0-.5.2-.9.5-1.3.3-.4.7-.8 1-1.2.3-.3.5-.6.7-1 .2-.4.5-.7.8-1 .2-.3.5-.5.8-.6.3-.2.6-.2.9-.2s.6.1.9.2c.3.1.6.3.8.6.3.3.5.7.7 1 .2.4.5.7.8 1 .3.4.7.8 1 1.2.3.4.5.8.5 1.3 0 .5-.1.9-.4 1.2-.3.3-.7.5-1.1.5-.5 0-1 0-1.6-.1-.5-.1-1-.1-1.5-.1s-1 0-1.6.1c-.5.1-1 .1-1.5.1Z',
  };

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default function JockeyHome() {
  return (
    <div className="jockey-home">
      <JockeyHeader />
      <main className="jockey-home__main">
        <section className="jockey-home__welcome">
          <h1>Welcome back, Elena.</h1>
          <p>Your next triumph is just over the horizon.</p>
        </section>

        <section className="jockey-home__grid" aria-label="Jockey dashboard">
          <article className="jockey-home__panel jockey-home__stats">
            <span className="jockey-home__eyebrow">Career Performance</span>
            <div className="jockey-home__stats-list">
              {careerStats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong className={stat.highlight ? 'is-highlight' : ''}>{stat.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="jockey-home__panel jockey-home__invites">
            <div className="jockey-home__panel-head">
              <h2>Race Invitations</h2>
              <span>3 New</span>
            </div>
            <div className="jockey-home__invite-list">
              {invitations.map((invite) => (
                <section className="jockey-home__invite" key={invite.owner}>
                  <div>
                    <strong>{invite.owner}</strong>
                    <time>{invite.time}</time>
                  </div>
                  <p>{invite.message}</p>
                  <div className="jockey-home__invite-actions">
                    <button type="button">Accept</button>
                    <button type="button">Decline</button>
                  </div>
                </section>
              ))}
            </div>
            <button className="jockey-home__text-action" type="button">View All Invitations <Icon name="arrow" /></button>
          </article>

          <article className="jockey-home__panel jockey-home__tournaments">
            <h2>My Tournaments</h2>
            <div className="jockey-home__table">
              <div className="jockey-home__table-row jockey-home__table-row--head">
                <span>Tournament & Horse</span>
                <span>Invited By</span>
                <span>Race Date</span>
              </div>
              {tournaments.map((tournament) => (
                <div className="jockey-home__table-row" key={tournament.name}>
                  <div>
                    <strong>{tournament.name}</strong>
                    <small>Riding: {tournament.horse}</small>
                  </div>
                  <p>{tournament.invitedBy}</p>
                  <time>{tournament.date}</time>
                </div>
              ))}
            </div>
            <button className="jockey-home__text-action" type="button">View All Tournaments <Icon name="arrow" /></button>
          </article>

          <article className="jockey-home__next-race">
            <img src={HomeBanner} alt="Next race horse" />
            <div className="jockey-home__next-overlay" />
            <div className="jockey-home__next-content">
              <div>
                <span>Upcoming Event</span>
                <h2>The Prestige Cup</h2>
                <p><Icon name="calendar" />Oct 14, 2024 - Ascot Main Track</p>
                <p><Icon name="horse" />Riding: Midnight Sovereign</p>
              </div>
              <button type="button">View Details</button>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
