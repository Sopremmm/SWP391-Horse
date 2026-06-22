import React from 'react';
import { Link } from 'react-router-dom';
import {
  OwnerPortalFooter,
  OwnerPortalHeader,
  OwnerPortalIcon,
} from '../components/horseOwner/OwnerPortalChrome.tsx';
import './HorseOwnerMyJockeys.css';

type InvitationStatus = 'Accepted' | 'Pending' | 'Declined';

type JockeyInvitation = {
  event: string;
  horse: string;
  status: InvitationStatus;
};

type ManagedJockey = {
  name: string;
  title: string;
  titleVariant: 'gold' | 'neutral' | 'green';
  image: string;
  winRate: string;
  experience: string;
  invitations: JockeyInvitation[];
};

const managedJockeys: ManagedJockey[] = [
  {
    name: 'Marcus Thorne',
    title: 'Master Jockey',
    titleVariant: 'gold',
    image: 'https://placehold.co/84x84',
    winRate: '24.8%',
    experience: '12 Seasons',
    invitations: [
      { event: 'Grand National Cup', horse: 'Emerald Sovereign', status: 'Accepted' },
      { event: 'Derby Invitational', horse: 'Midnight Runner', status: 'Pending' },
      { event: 'St. Leger Stakes', horse: 'Heritage Gold', status: 'Declined' },
    ],
  },
  {
    name: 'Elena Vance',
    title: 'Senior Rider',
    titleVariant: 'neutral',
    image: 'https://placehold.co/84x84',
    winRate: '19.2%',
    experience: '8 Seasons',
    invitations: [
      { event: 'Royal Ascot Sprint', horse: 'Silver Bullet', status: 'Accepted' },
      { event: 'Winter Classic', horse: 'Frost Weaver', status: 'Accepted' },
    ],
  },
  {
    name: 'Caleb Zhang',
    title: 'Rising Star',
    titleVariant: 'green',
    image: 'https://placehold.co/84x84',
    winRate: '15.0%',
    experience: '3 Seasons',
    invitations: [
      { event: 'Spring Novice Sprint', horse: 'Young Gallant', status: 'Pending' },
    ],
  },
];

function HorseMark() {
  return (
    <svg viewBox="0 0 12 11" aria-hidden="true">
      <path d="M1.31 4.96c-.37 0-.68-.13-.93-.38A1.27 1.27 0 0 1 0 3.65c0-.37.13-.68.38-.94.25-.25.56-.38.93-.38s.68.13.93.38c.26.25.39.57.39.94s-.13.68-.39.93c-.25.25-.56.38-.93.38Zm2.63-2.33c-.37 0-.68-.13-.93-.39a1.27 1.27 0 0 1-.38-.93c0-.37.13-.68.38-.93C3.26.13 3.57 0 3.94 0s.68.13.93.38c.25.25.38.56.38.93s-.13.68-.38.93c-.25.26-.56.39-.93.39Zm3.5 0c-.37 0-.68-.13-.93-.39a1.27 1.27 0 0 1-.38-.93c0-.37.13-.68.38-.93C6.76.13 7.07 0 7.44 0s.68.13.93.38c.25.25.38.56.38.93s-.13.68-.38.93c-.25.26-.56.39-.93.39Zm2.62 2.33c-.37 0-.68-.13-.93-.38a1.27 1.27 0 0 1-.38-.93c0-.37.13-.68.38-.94.25-.25.56-.38.93-.38s.68.13.94.38c.25.25.38.57.38.94s-.13.68-.38.93c-.26.25-.57.38-.94.38Zm-7.49 5.83c-.4 0-.73-.15-1-.46a1.62 1.62 0 0 1-.4-1.08c0-.49.17-.91.51-1.27.34-.36.67-.72 1-1.08.28-.3.53-.63.73-.98.21-.35.45-.69.73-1 .2-.24.43-.43.69-.59.26-.16.55-.24.86-.24s.6.08.86.23c.27.15.5.35.7.59.27.31.51.64.72 1 .21.35.45.69.73 1 .33.36.66.72 1 1.08.34.36.51.78.51 1.27 0 .42-.13.78-.4 1.08-.27.31-.6.46-1 .46-.53 0-1.05-.04-1.56-.13a9.31 9.31 0 0 0-1.56-.13c-.53 0-1.05.04-1.56.13-.52.09-1.04.13-1.56.13Z" />
    </svg>
  );
}

function StatusDot({ status }: { status: InvitationStatus }) {
  return (
    <span className={`owner-jockey-status owner-jockey-status--${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}

function JockeyCard({ jockey }: { jockey: ManagedJockey }) {
  return (
    <article className="owner-jockey-card">
      <section className="owner-jockey-card__bio" aria-label={`${jockey.name} summary`}>
        <div className="owner-jockey-card__photo">
          <img src={jockey.image} alt={jockey.name} />
        </div>
        <h2>{jockey.name}</h2>
        <span className={`owner-jockey-card__badge owner-jockey-card__badge--${jockey.titleVariant}`}>
          {jockey.title}
        </span>

        <dl>
          <div>
            <dt>Win Rate</dt>
            <dd>{jockey.winRate}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{jockey.experience}</dd>
          </div>
        </dl>
      </section>

      <section className="owner-jockey-card__invites" aria-label={`${jockey.name} active invitations`}>
        <header>
          <h3>Active Invitations</h3>
          <span>Showing last {jockey.invitations.length}</span>
        </header>

        <div className="owner-jockey-invite-list">
          {jockey.invitations.map((invitation) => (
            <div className="owner-jockey-invite" key={`${jockey.name}-${invitation.event}`}>
              <div>
                <strong>{invitation.event}</strong>
                <span>
                  <HorseMark />
                  {invitation.horse}
                </span>
              </div>
              <StatusDot status={invitation.status} />
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export default function HorseOwnerMyJockeys() {
  return (
    <div className="horse-owner-my-jockeys">
      <OwnerPortalHeader />

      <main className="owner-jockey-main" aria-label="Jockey management">
        <section className="owner-jockey-hero">
          <div>
            <h1>Jockey Management</h1>
            <p>
              Monitor your hired elite riders and manage active tournament invitations. Our jockeys
              represent the pinnacle of racing heritage and precision.
            </p>
          </div>

          <div className="owner-jockey-actions">
            <div className="owner-jockey-count" aria-label="12 hired jockeys">
              <OwnerPortalIcon name="user" />
              <span>12 Hired</span>
            </div>
            <Link className="owner-jockey-hire" to="/HorseOwner/HireJockeys">
              Hire Jockeys
            </Link>
          </div>
        </section>

        <section className="owner-jockey-grid" aria-label="Hired jockeys">
          {managedJockeys.map((jockey) => (
            <JockeyCard jockey={jockey} key={jockey.name} />
          ))}
        </section>
      </main>

      <OwnerPortalFooter />
    </div>
  );
}
