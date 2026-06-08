import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminManageTournaments.css';

type TournamentStatus = 'REGISTRATION OPEN' | 'DRAFT' | 'COMPLETED' | 'CLOSING SOON';

type ManagedTournament = {
  name: string;
  grade: string;
  registered: string;
  status: TournamentStatus;
  starts: string;
  closes: string;
  prizePool: string;
};

const tournaments: ManagedTournament[] = [
  {
    name: 'Royal Ascot Gold Cup',
    grade: 'Grade I Stakes',
    registered: '18 / 20 registered',
    status: 'REGISTRATION OPEN',
    starts: 'Jun 18, 2024',
    closes: 'Jun 10, 2024',
    prizePool: '$2,500,000',
  },
  {
    name: 'Emerald Derby Classic',
    grade: 'Grade II Turf',
    registered: '11 / 16 registered',
    status: 'CLOSING SOON',
    starts: 'Jul 02, 2024',
    closes: 'Jun 20, 2024',
    prizePool: '$1,200,000',
  },
  {
    name: 'Heritage Breeders Cup',
    grade: 'Grade III',
    registered: '24 / 24 registered',
    status: 'COMPLETED',
    starts: 'May 12, 2024',
    closes: 'Apr 30, 2024',
    prizePool: '$750,000',
  },
  {
    name: 'Winter Solstice Sprint',
    grade: 'Invitational',
    registered: '0 / 14 registered',
    status: 'DRAFT',
    starts: 'Dec 05, 2024',
    closes: 'Nov 22, 2024',
    prizePool: '$500,000',
  },
];

const insights = [
  {
    label: 'Active Tournaments',
    value: '12',
    copy: 'Four elite stakes are currently accepting stable entries.',
  },
  {
    label: 'Prize Pool Live',
    value: '$8.4M',
    copy: 'Committed across active and upcoming race events.',
  },
  {
    label: 'Upcoming Deadlines',
    value: '3',
    copy: 'Tournaments closing within the next 48 hours.',
  },
];

function Icon({ name }: { name: 'bell' | 'user' | 'grid' | 'users' | 'trophy' | 'check' | 'settings' | 'plus' | 'filter' | 'star' | 'logout' | 'help' }) {
  const paths: Record<string, string> = {
    bell:
      'M6 20v-2h2V9c0-1.4.4-2.6 1.3-3.7.8-1.1 1.9-1.8 3.2-2.1v-.7c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1v.7c1.3.3 2.4 1 3.2 2.1C19.6 6.4 20 7.6 20 9v9h2v2H6Zm8 3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4h4c0 .5-.2 1-.6 1.4-.4.4-.8.6-1.4.6Z',
    user:
      'M12 12c-1.1 0-2-.4-2.8-1.2C8.4 10 8 9.1 8 8s.4-2 1.2-2.8C10 4.4 10.9 4 12 4s2 .4 2.8 1.2C15.6 6 16 6.9 16 8s-.4 2-1.2 2.8C14 11.6 13.1 12 12 12ZM4 20v-2.8c0-.6.1-1.1.4-1.6.3-.5.7-.8 1.2-1.1 1-.5 2.1-.9 3.2-1.2 1.1-.2 2.1-.3 3.2-.3s2.1.1 3.2.3c1.1.3 2.2.7 3.2 1.2.5.3.9.6 1.2 1.1.3.5.4 1 .4 1.6V20H4Z',
    grid: 'M3 11V3h8v8H3Zm10 0V3h8v8h-8ZM3 21v-8h8v8H3Zm10 0v-8h8v8h-8Z',
    users:
      'M2 19v-2.1c0-.7.2-1.3.6-1.8.4-.5.9-.9 1.5-1.2 1.1-.5 2.2-.9 3.4-1.2 1.1-.3 2.3-.4 3.5-.4s2.4.1 3.5.4c1.2.3 2.3.7 3.4 1.2.6.3 1.1.7 1.5 1.2.4.5.6 1.1.6 1.8V19H2Zm5-9.5c-.9 0-1.7-.3-2.3-1C4.1 7.9 3.8 7.1 3.8 6.2s.3-1.7.9-2.3c.6-.7 1.4-1 2.3-1s1.7.3 2.3 1c.6.6.9 1.4.9 2.3s-.3 1.7-.9 2.3c-.6.7-1.4 1-2.3 1Z',
    trophy:
      'M7 21v-2h4v-3.1c-.9-.2-1.7-.6-2.4-1.2-.7-.6-1.2-1.3-1.5-2.1-1.4-.2-2.5-.8-3.4-1.8C2.8 9.8 2.3 8.6 2.3 7.2V6c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6H7V2h10v1.9h2.6c.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5v1.2c0 1.4-.5 2.6-1.4 3.6-.9 1-2.1 1.6-3.4 1.8-.3.8-.8 1.5-1.5 2.1-.7.6-1.5 1-2.4 1.2V19h4v2H7Z',
    check:
      'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z',
    settings:
      'm10 22-.4-3c-.3-.1-.6-.2-.9-.4-.3-.1-.6-.3-.8-.5l-2.8 1.2-2-3.5 2.4-1.8v-2l-2.4-1.8 2-3.5 2.8 1.2c.2-.2.5-.4.8-.5.3-.2.6-.3.9-.4l.4-3h4l.4 3c.3.1.6.2.9.4.3.1.6.3.8.5l2.8-1.2 2 3.5-2.4 1.8v2l2.4 1.8-2 3.5-2.8-1.2c-.2.2-.5.4-.8.5-.3.2-.6.3-.9.4l-.4 3h-4Z',
    plus: 'M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z',
    filter: 'M3 7V5h18v2H3Zm4 6v-2h10v2H7Zm3 6v-2h4v2h-4Z',
    star:
      'm12 17.3 4.2 2.5-1.1-4.8 3.7-3.2-4.9-.4L12 6.9l-1.9 4.5-4.9.4L8.9 15l-1.1 4.8 4.2-2.5Z',
    logout:
      'M4 21c-.6 0-1.1-.2-1.5-.6S2 19.5 2 18.9V5.1c0-.6.2-1.1.6-1.5S3.4 3 4 3h7v2H4v14h7v2H4Zm11-4-1.4-1.4 2.6-2.6H8v-2h8.2l-2.6-2.6L15 7l5 5-5 5Z',
    help:
      'M11 18h2v-2h-2v2Zm1-16C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8Z',
  };

  return (
    <svg className="admin-manage-tournaments__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function AdminProfileDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  };

  return (
    <div className="admin-manage-tournaments__profile" onBlur={handleBlur}>
      <button type="button" aria-label="Admin profile" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <Icon name="user" />
      </button>
      {open ? (
        <div className="admin-manage-tournaments__profile-menu" role="menu">
          <Link to="/Admin/Profile" role="menuitem" onClick={() => setOpen(false)}>Profile</Link>
          <Link to="/Admin/ManageUsers" role="menuitem" onClick={() => setOpen(false)}>Manage User</Link>
          <Link to="/Admin/ManageTournaments" role="menuitem" onClick={() => setOpen(false)}>Manage Tournament</Link>
          <Link to="/Admin/ConfirmRegistration" role="menuitem" onClick={() => setOpen(false)}>Confirm Registration</Link>
          <button type="button" role="menuitem" onClick={() => navigate('/')}>Log Out</button>
        </div>
      ) : null}
    </div>
  );
}

function statusClass(status: TournamentStatus) {
  return status.toLowerCase().replaceAll(' ', '-');
}

export default function AdminManageTournaments() {
  return (
    <div className="admin-manage-tournaments">
      <aside className="admin-manage-tournaments__sidebar" aria-label="Admin navigation">
        <div>
          <div className="admin-manage-tournaments__brand">Heritage Racing</div>
          <div className="admin-manage-tournaments__kicker">Administration Portal</div>
          <nav className="admin-manage-tournaments__side-nav">
            <Link to="/admin"><Icon name="grid" />Dashboard</Link>
            <Link to="/Admin/ManageUsers"><Icon name="users" />Users</Link>
            <Link className="is-active" to="/Admin/ManageTournaments"><Icon name="trophy" />Tournaments</Link>
            <Link to="/Admin/ConfirmRegistration"><Icon name="check" />Registrations</Link>
            <Link to="/Admin/Profile"><Icon name="settings" />Settings</Link>
          </nav>
        </div>
        <div className="admin-manage-tournaments__side-bottom">
          <button type="button"><Icon name="plus" />Create Tournament</button>
          <Link to="#help"><Icon name="help" />Help Center</Link>
          <Link to="/"><Icon name="logout" />Logout</Link>
        </div>
      </aside>

      <main className="admin-manage-tournaments__main">
        <header className="admin-manage-tournaments__topbar">
          <nav aria-label="Admin sections">
            <Link to="/admin">Overview</Link>
            <Link className="is-active" to="/Admin/ManageTournaments">Reports</Link>
            <Link to="#analytics">Analytics</Link>
          </nav>
          <div className="admin-manage-tournaments__top-actions">
            <button type="button" aria-label="Notifications"><Icon name="bell" /></button>
            <AdminProfileDropdown />
          </div>
        </header>

        <section className="admin-manage-tournaments__canvas">
          <div className="admin-manage-tournaments__heading">
            <div>
              <h1>Manage Tournaments</h1>
              <p>
                Oversee the elite circuit of Heritage Racing. Create new events, track registration progress,
                and manage prize disbursements for prestigious grade stakes.
              </p>
            </div>
            <button type="button" className="admin-manage-tournaments__add"><Icon name="plus" />Add Tournament</button>
          </div>

          <div className="admin-manage-tournaments__filters" aria-label="Filter and sort tournaments">
            <label>
              <span>Status:</span>
              <select defaultValue="all">
                <option value="all">All Statuses</option>
                <option value="open">Registration Open</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label>
              <Icon name="filter" />
              <span>Sort By:</span>
              <select defaultValue="date">
                <option value="date">Date (Upcoming)</option>
                <option value="prize">Prize Pool</option>
                <option value="entries">Entries</option>
              </select>
            </label>
          </div>

          <section className="admin-manage-tournaments__table-card" aria-label="Tournaments list">
            <div className="admin-manage-tournaments__table-head">
              <span>Tournament & Grade</span>
              <span>Status</span>
              <span>Key Dates</span>
              <span>Prize Pool</span>
              <span>Actions</span>
            </div>
            {tournaments.map((tournament) => (
              <article className="admin-manage-tournaments__row" key={tournament.name}>
                <div className="admin-manage-tournaments__name-cell">
                  <div className="admin-manage-tournaments__mark"><Icon name="star" /></div>
                  <div>
                    <strong>{tournament.name}</strong>
                    <small>{tournament.grade}</small>
                    <em>{tournament.registered}</em>
                  </div>
                </div>
                <div>
                  <span className={`admin-manage-tournaments__status admin-manage-tournaments__status--${statusClass(tournament.status)}`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="admin-manage-tournaments__dates">
                  <strong>Starts: {tournament.starts}</strong>
                  <span>Closes: {tournament.closes}</span>
                </div>
                <div className="admin-manage-tournaments__prize">{tournament.prizePool}</div>
                <div className="admin-manage-tournaments__actions-cell">
                  <button type="button">Manage</button>
                </div>
              </article>
            ))}
          </section>

          <section className="admin-manage-tournaments__insights" aria-label="Tournament insights">
            {insights.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.copy}</p>
              </article>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
