import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout.tsx';

import './AdminHome.css';

type AdminIconName = 'bell' | 'check' | 'grid' | 'help' | 'logout' | 'settings' | 'trophy' | 'user' | 'users';

const stats = [
  { label: 'Registered Users', value: '166', icon: 'users', tone: 'teal', badge: '4 User Roles', to: '/Admin/User' },
  { label: 'Managed Tournaments', value: '4', icon: 'trophy', tone: 'amber', badge: '2 Accepting Entries', to: '/Admin/ManageTournaments' },
  { label: 'Pending Registrations', value: '8', icon: 'check', tone: 'red', badge: 'Review Required', to: '/Admin/ConfirmRegistration' },
] as const;

const tournaments = [
  { name: 'Royal Ascot Gold Cup', grade: 'Grade I Stakes', capacity: '18 / 20 registered', status: 'Registration Open', prize: '$2,500,000' },
  { name: 'Emerald Derby Classic', grade: 'Grade II Turf', capacity: '11 / 16 registered', status: 'Closing Soon', prize: '$1,200,000' },
];

const registrations = [
  { horse: 'Midnight Sovereign', owner: 'Alexander Sterling', tournament: 'Royal Ascot Gold Cup', status: 'Pending' },
  { horse: 'Velvet Comet', owner: 'Claire Beaumont', tournament: 'Emerald Derby Classic', status: 'Pending' },
  { horse: 'Northern Crown', owner: 'James Whitmore', tournament: 'Heritage Breeders Cup', status: 'Pending' },
  { horse: 'Golden Gallop', owner: 'Julian Rossi', tournament: 'Preakness Stakes', status: 'Approved' },
];

function Icon({ name }: { name: AdminIconName }) {
  const paths: Record<AdminIconName, string> = {
    bell:
      'M6 20v-2h2V9c0-1.4.4-2.6 1.3-3.7.8-1.1 1.9-1.8 3.2-2.1v-.7c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1v.7c1.3.3 2.4 1 3.2 2.1C19.6 6.4 20 7.6 20 9v9h2v2H6Zm8 3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4h4c0 .5-.2 1-.6 1.4-.4.4-.8.6-1.4.6Z',
    check:
      'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z',
    grid: 'M3 11V3h8v8H3Zm10 0V3h8v8h-8ZM3 21v-8h8v8H3Zm10 0v-8h8v8h-8Z',
    help:
      'M11 18h2v-2h-2v2Zm1-16C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8Z',
    logout:
      'M4 21c-.6 0-1.1-.2-1.5-.6S2 19.5 2 18.9V5.1c0-.6.2-1.1.6-1.5S3.4 3 4 3h7v2H4v14h7v2H4Zm11-4-1.4-1.4 2.6-2.6H8v-2h8.2l-2.6-2.6L15 7l5 5-5 5Z',
    settings:
      'm10 22-.4-3c-.3-.1-.6-.2-.9-.4-.3-.1-.6-.3-.8-.5l-2.8 1.2-2-3.5 2.4-1.8v-2l-2.4-1.8 2-3.5 2.8 1.2c.2-.2.5-.4.8-.5.3-.2.6-.3.9-.4l.4-3h4l.4 3c.3.1.6.2.9.4.3.1.6.3.8.5l2.8-1.2 2 3.5-2.4 1.8v2l2.4 1.8-2 3.5-2.8-1.2c-.2.2-.5.4-.8.5-.3.2-.6.3-.9.4l-.4 3h-4Z',
    trophy:
      'M7 21v-2h4v-3.1c-.9-.2-1.7-.6-2.4-1.2-.7-.6-1.2-1.3-1.5-2.1-1.4-.2-2.5-.8-3.4-1.8C2.8 9.8 2.3 8.6 2.3 7.2V6c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6H7V2h10v1.9h2.6c.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5v1.2c0 1.4-.5 2.6-1.4 3.6-.9 1-2.1 1.6-3.4 1.8-.3.8-.8 1.5-1.5 2.1-.7.6-1.5 1-2.4 1.2V19h4v2H7Z',
    user:
      'M12 12c-1.1 0-2-.4-2.8-1.2C8.4 10 8 9.1 8 8s.4-2 1.2-2.8C10 4.4 10.9 4 12 4s2 .4 2.8 1.2C15.6 6 16 6.9 16 8s-.4 2-1.2 2.8C14 11.6 13.1 12 12 12ZM4 20v-2.8c0-.6.1-1.1.4-1.6.3-.5.7-.8 1.2-1.1 1-.5 2.1-.9 3.2-1.2 1.1-.2 2.1-.3 3.2-.3s2.1.1 3.2.3c1.1.3 2.2.7 3.2 1.2.5.3.9.6 1.2 1.1.3.5.4 1 .4 1.6V20H4Z',
    users:
      'M2 19v-2.1c0-.7.2-1.3.6-1.8.4-.5.9-.9 1.5-1.2 1.1-.5 2.2-.9 3.4-1.2 1.1-.3 2.3-.4 3.5-.4s2.4.1 3.5.4c1.2.3 2.3.7 3.4 1.2.6.3 1.1.7 1.5 1.2.4.5.6 1.1.6 1.8V19H2Zm5-9.5c-.9 0-1.7-.3-2.3-1C4.1 7.9 3.8 7.1 3.8 6.2s.3-1.7.9-2.3c.6-.7 1.4-1 2.3-1s1.7.3 2.3 1c.6.6.9 1.4.9 2.3s-.3 1.7-.9 2.3c-.6.7-1.4 1-2.3 1Z',
  };

  const outlinePaths: Partial<Record<AdminIconName, string>> = {
    users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9v-1a7 7 0 0 1 14 0v1m1-16a3.5 3.5 0 0 1 0 7m1.5 3a6 6 0 0 1 3.5 5.5',
    trophy: 'M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5a2 2 0 0 0 2 4h1m8-4h3a2 2 0 0 1-2 4h-1m-4 3v5m-4 2h8',
    check: 'M4 20v-2.5A4.5 4.5 0 0 1 8.5 13H12M8.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 6 2 2 4-5',
  };

  return (
    <svg className="admin-home__icon" viewBox="0 0 24 24" aria-hidden="true">
      {outlinePaths[name] ? (
        <path d={outlinePaths[name]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      ) : <path d={paths[name]} />}
    </svg>
  );
}

export default function AdminHome() {
  return (
    <AdminLayout active="dashboard" title="Admin Dashboard" topNavActive="overview">
      <div className="admin-home">
        <section className="admin-home__content">
          <header className="admin-home__intro">
            <div>
              <span>Racing administration overview</span>
              <h2>Heritage operations at a glance</h2>
              <p>Monitor users, tournament activity, and registration approvals from one unified workspace.</p>
            </div>
            <Link to="/Admin/ManageTournaments/Create">Create Tournament</Link>
          </header>

          <section className="admin-home__stats" aria-label="Admin statistics">
            {stats.map((item) => (
              <Link className="admin-home__stat-card" key={item.label} to={item.to}>
                <div className="admin-home__stat-head">
                  <div className={`admin-home__stat-icon admin-home__tone-${item.tone}`}><Icon name={item.icon} /></div>
                  <span className={`admin-home__badge admin-home__tone-${item.tone}`}>{item.badge}</span>
                </div>
                <div className="admin-home__stat-label">{item.label}</div>
                <div className="admin-home__stat-value">{item.value}</div>
              </Link>
            ))}
          </section>

          <section className="admin-home__panel" aria-label="Tournament spotlight">
            <div className="admin-home__panel-head">
              <h2>Tournament Spotlight</h2>
              <Link to="/Admin/ManageTournaments">Browse All Tournaments</Link>
            </div>
            <div className="admin-home__tournament-grid">
              {tournaments.map((tournament) => (
                <article className="admin-home__tournament" key={tournament.name}>
                  <div className="admin-home__tournament-top">
                    <div className="admin-home__thumb"><Icon name="trophy" /></div>
                    <span className="admin-home__badge admin-home__tone-teal">{tournament.status}</span>
                  </div>
                  <h3>{tournament.name}</h3>
                  <p>{tournament.grade} · {tournament.prize}</p>
                  <div className="admin-home__capacity">
                    <div>
                      <span>Capacity</span>
                      <strong>{tournament.capacity}</strong>
                    </div>
                    <Link aria-label={`Manage ${tournament.name}`} to={`/Admin/ManageTournaments/${encodeURIComponent(tournament.name)}`}>→</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-home__panel" aria-label="Registration queue">
            <div className="admin-home__panel-head">
              <h2>Recent Registrations</h2>
              <Link to="/Admin/ConfirmRegistration">Review All Entries</Link>
            </div>
            <div className="admin-home__table">
              <div className="admin-home__row admin-home__row--head">
                <div>Horse</div>
                <div>Owner</div>
                <div>Tournament</div>
                <div>Status</div>
              </div>
              {registrations.map((registration) => (
                <div className="admin-home__row" key={`${registration.horse}-${registration.tournament}`}>
                  <div className="admin-home__horse"><span>{registration.horse.slice(0, 2).toUpperCase()}</span><strong>{registration.horse}</strong></div>
                  <div><small>{registration.owner}</small></div>
                  <div>{registration.tournament}</div>
                  <div><span className={`admin-home__status admin-home__status--${registration.status.toLowerCase()}`}>{registration.status}</span></div>
                </div>
              ))}
            </div>
            <Link className="admin-home__history" to="/Admin/ConfirmRegistration">View Complete Registration Queue</Link>
          </section>
        </section>
      </div>
    </AdminLayout>
  );
}
