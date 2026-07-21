import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout.tsx';
import { deleteAdminUser, fetchAdminUsers, updateAdminUserStatus } from '../../services/integration.ts';

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

const PAGE_SIZE = 10;

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
  const [users, setUsers] = React.useState<ManagedUser[]>([]);
  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState<'All Roles' | UserRole>('All Roles');
  const [page, setPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(null);
  const [toast, setToast] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const toastTimer = React.useRef<number | null>(null);

  React.useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  };

  React.useEffect(() => {
    let cancelled = false;

    const roleMap: Record<UserRole, string> = {
      'Horse Owner': 'HORSE_OWNER',
      Jockey: 'JOCKEY',
      Referee: 'REFEREE',
      Spectator: 'SPECTATOR',
    };

    const titleCaseRole = (value?: string): UserRole => {
      if (value === 'JOCKEY') return 'Jockey';
      if (value === 'REFEREE') return 'Referee';
      if (value === 'SPECTATOR') return 'Spectator';
      return 'Horse Owner';
    };

    const toneForRole = (value: UserRole) => {
      if (value === 'Jockey') return 'gold';
      if (value === 'Referee') return 'slate';
      if (value === 'Spectator') return 'green';
      return 'teal';
    };

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminUsers({
          q: query.trim() || undefined,
          role: role === 'All Roles' ? undefined : roleMap[role],
        });
        if (cancelled) return;
        setUsers(
          response.map((user) => {
            const mappedRole = titleCaseRole(String(user.role || '').replace(/^ROLE_/i, '').toUpperCase());
            return {
              id: String(user.id),
              name: user.fullName || user.email,
              email: user.email,
              role: mappedRole,
              status: String(user.status || 'ACTIVE').toUpperCase() === 'SUSPENDED' ? 'Suspended' : 'Active',
              initials: (user.fullName || user.email || 'U')
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join(''),
              tone: toneForRole(mappedRole),
              joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : '—',
              location: user.phone || '—',
            };
          }),
        );
      } catch (err) {
        if (!cancelled) notify(err instanceof Error ? err.message : 'Failed to load users.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [query, role]);

  const filteredUsers = users;
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleStatus = async (user: ManagedUser) => {
    const nextStatus: UserStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await updateAdminUserStatus(Number(user.id), nextStatus.toUpperCase());
      setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)));
      setSelectedUser((current) => (current?.id === user.id ? { ...current, status: nextStatus } : current));
      notify(`${user.name} is now ${nextStatus.toLowerCase()}.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update user status.');
    }
  };

  const deleteUser = async (user: ManagedUser) => {
    if (!window.confirm(`Delete ${user.name} from the system?`)) return;
    try {
      await deleteAdminUser(Number(user.id));
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setSelectedUser((current) => (current?.id === user.id ? null : current));
      notify(`${user.name} was removed.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to delete user.');
    }
  };

  return (
    <AdminLayout
      active="users"
      title="User Management"
      topNavActive="overview"
    >
      <div className="admin-users" aria-busy={loading}>
        <section className="admin-users__canvas">
          <header className="admin-users__heading">
            <h1>User Management</h1>
            <p>View and manage all registered users in the Heritage Racing system. Oversee profiles, manage permissions, and maintain the integrity of the racing ecosystem.</p>
          </header>

          <section className="admin-users__stats" aria-label="User statistics">
            {[
              ['Total Users', users.length],
              ['Horse Owners', users.filter((user) => user.role === 'Horse Owner').length],
              ['Jockeys', users.filter((user) => user.role === 'Jockey').length],
              ['Spectators', users.filter((user) => user.role === 'Spectator').length],
              ['Referees', users.filter((user) => user.role === 'Referee').length],
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

              {pageUsers.length ? pageUsers.map((user) => (
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
                    <button type="button" title={user.status === 'Suspended' ? 'Restore user' : 'Suspend user'} aria-label={user.status === 'Suspended' ? `Restore ${user.name}` : `Suspend ${user.name}`} onClick={() => void toggleStatus(user)}>
                      <Icon name={user.status === 'Suspended' ? 'restore' : 'ban'} />
                    </button>
                    <button type="button" className="admin-users__delete" title="Delete user" aria-label={`Delete ${user.name}`} onClick={() => void deleteUser(user)}>
                      <Icon name="trash" />
                    </button>
                  </div>
                </article>
              )) : (
                <div className="admin-users__empty">{loading ? 'Loading users...' : 'No users match your search.'}</div>
              )}
            </div>

            <footer className="admin-users__pagination">
              <span>Showing {pageUsers.length ? `${(currentPage - 1) * PAGE_SIZE + 1}-${(currentPage - 1) * PAGE_SIZE + pageUsers.length}` : '0'} of {filteredUsers.length} users</span>
              <nav aria-label="User list pages">
                <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><Icon name="left" /></button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button type="button" className={currentPage === number ? 'is-active' : ''} key={number} onClick={() => setPage(number)}>{number}</button>)}
                <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><Icon name="right" /></button>
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
              <button type="button" className="admin-users__modal-action" onClick={() => { void toggleStatus(selectedUser); setSelectedUser(null); }}>
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
