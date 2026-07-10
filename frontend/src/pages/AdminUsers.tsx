import React from 'react';
import AdminLayout from '../components/admin/AdminLayout.tsx';

import './AdminUsers.css';

type UserRole = 'Horse Owner' | 'Jockey' | 'Referee' | 'Spectator';
type UserStatus = 'Active' | 'Suspended' | 'Inactive';

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  initials: string;
  tone: string;
  joined: string;
  location: string;
};

const initialUsers: ManagedUser[] = [
  { id: 'HR-1001', name: 'Julian Sterling', email: 'j.sterling@heritage.com', role: 'Horse Owner', status: 'Active', initials: 'JS', tone: 'forest', joined: 'Jan 18, 2022', location: 'Berkshire, UK' },
  { id: 'HR-1002', name: 'Elara Vance', email: 'evance.racing@pro.net', role: 'Jockey', status: 'Active', initials: 'EV', tone: 'gold', joined: 'Mar 06, 2023', location: 'Newmarket, UK' },
  { id: 'HR-1003', name: 'Marcus Thorne', email: 'm.thorne@equine.org', role: 'Referee', status: 'Active', initials: 'MT', tone: 'slate', joined: 'Aug 11, 2021', location: 'York, UK' },
  { id: 'HR-1004', name: 'Sarah Jenkins', email: 's.jenkins@fanmail.com', role: 'Spectator', status: 'Active', initials: 'SJ', tone: 'rose', joined: 'Sep 22, 2024', location: 'London, UK' },
  { id: 'HR-1005', name: 'David Chen', email: 'd.chen@stable.net', role: 'Horse Owner', status: 'Suspended', initials: 'DC', tone: 'blue', joined: 'Nov 04, 2022', location: 'Surrey, UK' },
  { id: 'HR-1006', name: 'Elena Rodriguez', email: 'e.rodriguez@jockeyclub.com', role: 'Jockey', status: 'Active', initials: 'ER', tone: 'emerald', joined: 'Feb 15, 2023', location: 'Madrid, Spain' },
  { id: 'HR-1007', name: 'Thomas Wright', email: 't.wright@heritage.com', role: 'Referee', status: 'Inactive', initials: 'TW', tone: 'stone', joined: 'May 27, 2020', location: 'Kent, UK' },
  { id: 'HR-1008', name: 'Aria Montgomery', email: 'aria.m@spectate.net', role: 'Spectator', status: 'Active', initials: 'AM', tone: 'violet', joined: 'Oct 09, 2024', location: 'Bath, UK' },
];

function Icon({ name }: { name: 'search' | 'user' | 'ban' | 'restore' | 'trash' | 'left' | 'right' }) {
  const paths = {
    search: 'm21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
    ban: 'M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm-5.3 2.2 10.6 10.6',
    restore: 'm6.5 12.5 3.2 3.2 7.8-8.1',
    trash: 'M7 7.5h10M10 4.5h4l1 3H9l1-3Zm-1.5 3 1 12h5l1-12M11 11v5m2-5v5',
    left: 'm15 18-6-6 6-6',
    right: 'm9 18 6-6-6-6',
  } as const;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.15" />
    </svg>
  );
}

function roleClass(role: UserRole) {
  return role.toLowerCase().replace(' ', '-');
}

export default function AdminUsers() {
  const [users, setUsers] = React.useState(initialUsers);
  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState<'All Roles' | UserRole>('All Roles');
  const [page, setPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(null);
  const [toast, setToast] = React.useState('');
  const toastTimer = React.useRef<number | null>(null);

  React.useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  };

  const filteredUsers = users.filter((user) => {
    const keyword = query.trim().toLowerCase();
    const matchesQuery = !keyword || [user.name, user.email, user.id].some((value) => value.toLowerCase().includes(keyword));
    return matchesQuery && (role === 'All Roles' || user.role === role);
  });

  const toggleStatus = (user: ManagedUser) => {
    const nextStatus: UserStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)));
    notify(`${user.name} is now ${nextStatus.toLowerCase()}.`);
  };

  const deleteUser = (user: ManagedUser) => {
    if (!window.confirm(`Delete ${user.name} from the system?`)) return;
    setUsers((current) => current.filter((item) => item.id !== user.id));
    notify(`${user.name} was removed.`);
  };

  return (
    <AdminLayout
      active="users"
      breadcrumb={[
        { label: 'Users', to: '/Admin/User' },
        { label: 'User Management' },
      ]}
    >
      <div className="admin-users">
        <section className="admin-users__canvas">
          <header className="admin-users__heading">
            <h1>User Management</h1>
            <p>View and manage all registered users in the Heritage Racing system. Oversee profiles, manage permissions, and maintain the integrity of the racing ecosystem.</p>
          </header>

          <section className="admin-users__stats" aria-label="User statistics">
            {[
              ['Total Users', '166'],
              ['Horse Owners', '42'],
              ['Jockeys', '85'],
              ['Spectators', '24'],
              ['Referees', '15'],
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </section>

          <section className="admin-users__filters" aria-label="Search and filter users">
            <label className="admin-users__search">
              <Icon name="search" />
              <input
                type="search"
                value={query}
                placeholder="Search by name, email, or ID..."
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <select
              aria-label="Filter by role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value as 'All Roles' | UserRole);
                setPage(1);
              }}
            >
              <option>All Roles</option>
              <option>Horse Owner</option>
              <option>Jockey</option>
              <option>Referee</option>
              <option>Spectator</option>
            </select>
          </section>

          <section className="admin-users__table-card" aria-label="Registered users">
            <div className="admin-users__table">
              <div className="admin-users__row admin-users__row--head">
                <span>User Profile</span>
                <span>User Role</span>
                <span>Status</span>
                <span>Administrative Actions</span>
              </div>

              {filteredUsers.length ? filteredUsers.map((user) => (
                <article className="admin-users__row" key={user.id}>
                  <div className="admin-users__profile-cell">
                    <div className={`admin-users__avatar admin-users__avatar--${user.tone}`}>{user.initials}</div>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <div><span className={`admin-users__role admin-users__role--${roleClass(user.role)}`}>{user.role}</span></div>
                  <div><span className={`admin-users__status admin-users__status--${user.status.toLowerCase()}`}>{user.status}</span></div>
                  <div className="admin-users__actions">
                    <button type="button" className="admin-users__view" onClick={() => setSelectedUser(user)}>View Profile</button>
                    <button type="button" title={user.status === 'Suspended' ? 'Restore user' : 'Suspend user'} aria-label={user.status === 'Suspended' ? `Restore ${user.name}` : `Suspend ${user.name}`} onClick={() => toggleStatus(user)}>
                      <Icon name={user.status === 'Suspended' ? 'restore' : 'ban'} />
                    </button>
                    <button type="button" className="admin-users__delete" title="Delete user" aria-label={`Delete ${user.name}`} onClick={() => deleteUser(user)}>
                      <Icon name="trash" />
                    </button>
                  </div>
                </article>
              )) : (
                <div className="admin-users__empty">No users match your search.</div>
              )}
            </div>

            <footer className="admin-users__pagination">
              <span>Showing {filteredUsers.length ? `1-${filteredUsers.length}` : '0'} of {query || role !== 'All Roles' ? filteredUsers.length : 166} users</span>
              <nav aria-label="User list pages">
                <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><Icon name="left" /></button>
                {[1, 2, 3].map((number) => <button type="button" className={page === number ? 'is-active' : ''} key={number} onClick={() => setPage(number)}>{number}</button>)}
                <span>...</span>
                <button type="button" className={page === 21 ? 'is-active' : ''} onClick={() => setPage(21)}>21</button>
                <button type="button" aria-label="Next page" disabled={page === 21} onClick={() => setPage((current) => Math.min(21, current + 1))}><Icon name="right" /></button>
              </nav>
            </footer>
          </section>
        </section>

        {selectedUser ? (
          <div className="admin-users__modal-backdrop" role="presentation" onMouseDown={() => setSelectedUser(null)}>
            <section className="admin-users__modal" role="dialog" aria-modal="true" aria-labelledby="admin-user-profile-title" onMouseDown={(event) => event.stopPropagation()}>
              <button className="admin-users__modal-close" type="button" aria-label="Close profile" onClick={() => setSelectedUser(null)}>×</button>
              <div className={`admin-users__avatar admin-users__avatar--large admin-users__avatar--${selectedUser.tone}`}>{selectedUser.initials}</div>
              <h2 id="admin-user-profile-title">{selectedUser.name}</h2>
              <p>{selectedUser.email}</p>
              <dl>
                <div><dt>User ID</dt><dd>{selectedUser.id}</dd></div>
                <div><dt>Role</dt><dd>{selectedUser.role}</dd></div>
                <div><dt>Status</dt><dd>{selectedUser.status}</dd></div>
                <div><dt>Joined</dt><dd>{selectedUser.joined}</dd></div>
                <div><dt>Location</dt><dd>{selectedUser.location}</dd></div>
              </dl>
              <button type="button" className="admin-users__modal-action" onClick={() => { toggleStatus(selectedUser); setSelectedUser(null); }}>
                {selectedUser.status === 'Suspended' ? 'Restore Account' : 'Suspend Account'}
              </button>
            </section>
          </div>
        ) : null}

        {toast ? <div className="admin-users__toast" role="status">{toast}</div> : null}
      </div>
    </AdminLayout>
  );
}
