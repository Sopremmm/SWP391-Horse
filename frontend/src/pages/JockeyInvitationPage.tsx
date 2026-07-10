import React from 'react';
import { Footer } from '../components/common/Footer.tsx';
import JockeyHeader from '../components/jockey/JockeyHeader.tsx';
import HomeBanner from '../assets/images/HomeBanner.png';
import './JockeyInvitationPage.css';

type Invite = {
  id: string;
  owner: string;
  stable: string;
  horse: string;
  tournament: string;
  contact: string;
  tier: string;
};

const initialInvites: Invite[] = [
  {
    id: 'kensington',
    owner: 'Lord Kensington',
    stable: 'Royal Ascot Stables',
    horse: 'Sterling Shadow',
    tournament: 'Grand National Steeplechase',
    contact: '+44 7700 900077',
    tier: 'Verified Owner',
  },
  {
    id: 'moretti',
    owner: 'Elena Moretti',
    stable: 'Tuscany Equine',
    horse: 'Crimson Velvet',
    tournament: 'Dubai World Cup',
    contact: '+39 055 123 4567',
    tier: 'International',
  },
  {
    id: 'sterling',
    owner: 'William Sterling',
    stable: 'Sterling Heights',
    horse: 'Emerald Duke',
    tournament: 'Kentucky Derby Invitation',
    contact: '+1 502 555 0199',
    tier: 'Premier Tier',
  },
];

function BadgeIcon() {
  return (
    <svg viewBox="0 0 17 16" aria-hidden="true">
      <path d="m5.7 15.8-1.4-2.4-2.7-.6.3-2.8L0 7.9l1.9-2.1L1.6 3l2.7-.6L5.7 0l2.6 1.1L10.8 0l1.4 2.4 2.7.6-.3 2.8 1.9 2.1-1.9 2.1.3 2.8-2.7.6-1.4 2.4-2.5-1.1-2.6 1.1Zm1.8-5.2 4.2-4.2-1.1-1.1-3.1 3.1-1.6-1.6-1.1 1.1 2.7 2.7Z" />
    </svg>
  );
}

export default function JockeyInvitationPage() {
  const [invites, setInvites] = React.useState(initialInvites);
  const [toast, setToast] = React.useState('');

  const handleDecision = (inviteId: string, action: 'accepted' | 'declined') => {
    setInvites((current) => current.filter((invite) => invite.id !== inviteId));
    setToast(`You have ${action} the invite.`);
    window.setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="jockey-invitation">
      <JockeyHeader />

      <main className="jockey-invitation__main">
        <section className="jockey-invitation__heading">
          <div>
            <h1>Race Invitations</h1>
            <p>
              Review and manage your pending invitations from stable owners and tournament organizers.
              Your next prestigious ride awaits.
            </p>
          </div>
          <div className="jockey-invitation__offer-badge">
            <BadgeIcon />
            {invites.length} Pending Offers
          </div>
        </section>

        <section className="jockey-invitation__table-card" aria-label="Race invitations">
          <div className="jockey-invitation__table-row jockey-invitation__table-row--head">
            <span>Stable Owner</span>
            <span>Horse</span>
            <span>Tournament</span>
            <span>Contact</span>
            <span>Actions</span>
          </div>

          {invites.map((invite) => (
            <article className="jockey-invitation__table-row" key={invite.id}>
              <div>
                <strong>{invite.owner}</strong>
                <small>{invite.stable}</small>
              </div>
              <div className="jockey-invitation__horse">{invite.horse}</div>
              <div><em>{invite.tournament}</em></div>
              <div>
                <p>{invite.contact}</p>
                <small>{invite.tier}</small>
              </div>
              <div className="jockey-invitation__actions">
                <button type="button" onClick={() => handleDecision(invite.id, 'accepted')}>Accept</button>
                <button type="button" onClick={() => handleDecision(invite.id, 'declined')}>Decline</button>
              </div>
            </article>
          ))}

          {invites.length === 0 ? (
            <div className="jockey-invitation__empty">No pending race invitations.</div>
          ) : null}
        </section>

        <section className="jockey-invitation__bottom-grid">
          <article className="jockey-invitation__opportunity">
            <img src={HomeBanner} alt="Majestic racehorse in stables" />
            <div className="jockey-invitation__opportunity-shade" />
            <div>
              <span>Trending Opportunity</span>
              <h2>Stallion of the Season: Northern Star</h2>
              <p>
                Available for the upcoming Melbourne Cup. Owners are looking for an elite jockey with grass track
                experience.
              </p>
            </div>
          </article>

          <aside className="jockey-invitation__stats">
            <h2>Jockey Stats</h2>
            <div>
              <span>Win Rate</span>
              <strong>24.8%</strong>
            </div>
            <div>
              <span>Total Rides</span>
              <strong>1,240</strong>
            </div>
            <div>
              <span>Earnings</span>
              <strong>$2.4M</strong>
            </div>
            <button type="button">Update Bio</button>
          </aside>
        </section>
      </main>

      <div className={`jockey-invitation__toast ${toast ? 'is-visible' : ''}`} role="status">
        <i />
        <div>
          <strong>Invitation Updated</strong>
          <span>{toast}</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
