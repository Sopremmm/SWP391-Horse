import React from 'react';
import {
  OwnerPortalFooter,
  OwnerPortalHeader,
  OwnerPortalIcon,
} from '../components/horseOwner/OwnerPortalChrome.tsx';
import './HorseOwnerMyTournament.css';

type TournamentStatus = 'Approved' | 'Pending Review';

type RegisteredTournament = {
  name: string;
  location: string;
  horse: string;
  jockey: string;
  raceDate: string;
  prizePool: string;
  status: TournamentStatus;
};

const registeredTournaments: RegisteredTournament[] = [
  {
    name: 'Royal Ascot Gold Cup',
    location: 'Ascot, Berkshire, UK',
    horse: 'Midnight Sovereign',
    jockey: 'Arthur Sterling',
    raceDate: 'June 22 - 24, 2024',
    prizePool: '$500,000',
    status: 'Approved',
  },
  {
    name: 'The Dubai World Cup',
    location: 'Meydan Racecourse, UAE',
    horse: 'Desert Mirage',
    jockey: 'Elena Rossi',
    raceDate: 'July 15 - 17, 2024',
    prizePool: '$12,000,000',
    status: 'Pending Review',
  },
  {
    name: 'Kentucky Derby',
    location: 'Churchill Downs, USA',
    horse: 'Silver Shadow',
    jockey: 'Arthur Sterling',
    raceDate: 'August 04 - 06, 2024',
    prizePool: '$3,000,000',
    status: 'Approved',
  },
  {
    name: "Prix de l'Arc de Triomphe",
    location: 'Longchamp, Paris, France',
    horse: 'Nocturnal',
    jockey: 'Marc-Andre Dubois',
    raceDate: 'Sept 28 - 30, 2024',
    prizePool: '$5,500,000',
    status: 'Pending Review',
  },
];

function StatusChip({ status }: { status: TournamentStatus }) {
  return <span className={`owner-tournament-status owner-tournament-status--${status === 'Approved' ? 'approved' : 'pending'}`}>{status}</span>;
}

export default function HorseOwnerMyTournament() {
  return (
    <div className="horse-owner-my-tournament">
      <OwnerPortalHeader />

      <main className="owner-tournament-main" aria-label="Registered tournaments">
        <section className="owner-tournament-hero">
          <div>
            <h1>Registered Tournaments</h1>
            <p>
              Oversee your elite racing schedule. Manage assigned jockeys and monitor the performance
              of your stable's finest thoroughbreds across the season's premier events.
            </p>
          </div>
          <button className="owner-tournament-enter" type="button">
            Enter New Event
          </button>
        </section>

        <section className="owner-tournament-stats" aria-label="Tournament summary">
          <article>
            <span>Upcoming Events</span>
            <strong>12</strong>
          </article>
          <article>
            <span>Total Committed Stakes</span>
            <strong>$4.2M</strong>
          </article>
        </section>

        <section className="owner-tournament-table-card" aria-label="Registered tournament table">
          <div className="owner-tournament-table">
            <div className="owner-tournament-table__head" role="row">
              <div role="columnheader">Tournament</div>
              <div role="columnheader">Assigned Horse</div>
              <div role="columnheader">Assigned Jockey</div>
              <div role="columnheader">Race Date</div>
              <div role="columnheader">Prize Pool</div>
              <div role="columnheader">Status</div>
              <div aria-hidden="true" />
            </div>

            {registeredTournaments.map((tournament) => (
              <article className="owner-tournament-row" key={tournament.name}>
                <div className="owner-tournament-row__title" data-label="Tournament">
                  <strong>{tournament.name}</strong>
                  <span>{tournament.location}</span>
                </div>
                <div data-label="Assigned Horse">{tournament.horse}</div>
                <div data-label="Assigned Jockey">{tournament.jockey}</div>
                <div data-label="Race Date">{tournament.raceDate}</div>
                <div className="owner-tournament-row__prize" data-label="Prize Pool">
                  {tournament.prizePool}
                </div>
                <div data-label="Status">
                  <StatusChip status={tournament.status} />
                </div>
                <button className="owner-tournament-menu" type="button" aria-label={`Actions for ${tournament.name}`}>
                  <OwnerPortalIcon name="more" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="owner-tournament-notice" aria-label="Registration deadlines">
          <OwnerPortalIcon name="info" />
          <div>
            <h2>Registration Deadlines</h2>
            <p>
              Tournament changes and jockey reassignments must be finalized at least 72 hours prior to the race date.
              Please contact the Club Concierge for expedited modifications.
            </p>
          </div>
        </aside>
      </main>

      <OwnerPortalFooter />
    </div>
  );
}
