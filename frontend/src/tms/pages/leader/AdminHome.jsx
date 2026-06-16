import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import './AdminHome.css';

const stats = [
  { label: 'Total Active Users', value: '12,482', icon: 'users', tone: 'teal', badge: '+12% Monthly' },
  { label: 'Upcoming Tournaments', value: '24', icon: 'trophy', tone: 'amber', badge: 'Next 48h' },
  { label: 'Pending Registrations', value: '186', icon: 'check', tone: 'red', badge: 'Action Req.' },
];

const tournaments = [
  { name: 'Royal Ascot Gold Cup', grade: 'Grade I Stakes', capacity: '18 / 20 registered' },
  { name: 'Emerald Derby Classic', grade: 'Grade II Turf', capacity: '11 / 16 registered' },
];

const registrations = [
  { stable: 'Highclere', rep: 'Rep: A. Spencer', tournament: 'Royal Ascot Gold Cup', status: 'Pending' },
  { stable: 'Godolphin', rep: 'Rep: L. Hayes', tournament: 'Emerald Derby Classic', status: 'Confirmed' },
  { stable: 'Coolmore', rep: 'Rep: J. Doyle', tournament: 'Oaks Invitational', status: 'Confirmed' },
];

function Icon({ name }) {
  const paths = {
    bell:
      'M6 20v-2h2V9c0-1.4.4-2.6 1.3-3.7.8-1.1 1.9-1.8 3.2-2.1v-.7c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1v.7c1.3.3 2.4 1 3.2 2.1C19.6 6.4 20 7.6 20 9v9h2v2H6Zm8 3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4h4c0 .5-.2 1-.6 1.4-.4.4-.8.6-1.4.6Z',
    check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z',
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

  return (
    <svg className="admin-home__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default function AdminHome() {
  return (
    <AdminLayout active="dashboard" title="Admin Dashboard" topNavActive="overview">
      <div className="admin-home">
        <section className="admin-home__content">
          <section className="admin-home__stats" aria-label="Admin statistics">
            {stats.map((item) => (
              <article className="admin-home__stat-card" key={item.label}>
                <div className="admin-home__stat-head">
                  <div className={`admin-home__stat-icon admin-home__tone-${item.tone}`}><Icon name={item.icon} /></div>
                  <span className={`admin-home__badge admin-home__tone-${item.tone}`}>{item.badge}</span>
                </div>
                <div className="admin-home__stat-label">{item.label}</div>
                <div className="admin-home__stat-value">{item.value}</div>
              </article>
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
                    <span className="admin-home__badge admin-home__tone-teal">Live</span>
                  </div>
                  <h3>{tournament.name}</h3>
                  <p>{tournament.grade}</p>
                  <div className="admin-home__capacity">
                    <div>
                      <span>Capacity</span>
                      <strong>{tournament.capacity}</strong>
                    </div>
                    <button type="button" aria-label={`Open ${tournament.name}`}>+</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-home__panel" aria-label="Registration queue">
            <div className="admin-home__panel-head">
              <h2>Recent Registrations</h2>
              <div className="admin-home__table-tools">
                <button type="button">Filter</button>
                <button type="button">Export</button>
              </div>
            </div>
            <div className="admin-home__table">
              <div className="admin-home__row admin-home__row--head">
                <div>Stable</div>
                <div>Representative</div>
                <div>Tournament</div>
                <div>Status</div>
              </div>
              {registrations.map((registration) => (
                <div className="admin-home__row" key={`${registration.stable}-${registration.tournament}`}>
                  <div className="admin-home__horse"><span>{registration.stable.slice(0, 2).toUpperCase()}</span><strong>{registration.stable}</strong></div>
                  <div><small>{registration.rep}</small></div>
                  <div>{registration.tournament}</div>
                  <div><span className="admin-home__status">{registration.status}</span></div>
                </div>
              ))}
            </div>
            <button className="admin-home__history" type="button">View Complete History</button>
          </section>
        </section>
      </div>
    </AdminLayout>
  );
}
