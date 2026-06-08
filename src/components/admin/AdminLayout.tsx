import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import './AdminLayout.css';

type AdminIconName = 'bell' | 'check' | 'grid' | 'help' | 'logout' | 'settings' | 'trophy' | 'user' | 'users';

type AdminLayoutProps = {
  active: 'dashboard' | 'users' | 'tournaments' | 'registrations' | 'settings';
  children: React.ReactNode;
  title?: string;
  breadcrumb?: Array<{ label: string; to?: string }>;
  topNavActive?: 'overview' | 'reports' | 'analytics';
};

function AdminIcon({ name }: { name: AdminIconName }) {
  const paths: Record<AdminIconName, string> = {
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
    <svg className="admin-layout__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function ProfileMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  };

  return (
    <div className="admin-layout__profile" onBlur={handleBlur}>
      <button type="button" aria-label="Admin profile" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <AdminIcon name="user" />
      </button>
      {open ? (
        <div className="admin-layout__profile-menu" role="menu">
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

export default function AdminLayout({ active, children, title, breadcrumb, topNavActive = 'overview' }: AdminLayoutProps) {
  const sideLinks = [
    { key: 'dashboard', label: 'Dashboard', to: '/admin', icon: 'grid' },
    { key: 'users', label: 'Users', to: '/Admin/ManageUsers', icon: 'users' },
    { key: 'tournaments', label: 'Tournaments', to: '/Admin/ManageTournaments', icon: 'trophy' },
    { key: 'registrations', label: 'Registrations', to: '/Admin/ConfirmRegistration', icon: 'check' },
    { key: 'settings', label: 'Settings', to: '/Admin/Profile', icon: 'settings' },
  ] as const;

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar" aria-label="Admin navigation">
        <div>
          <div className="admin-layout__brand">Heritage Racing</div>
          <div className="admin-layout__kicker">Administration Portal</div>
          <nav className="admin-layout__side-nav">
            {sideLinks.map((link) => (
              <NavLink key={link.key} className={active === link.key ? 'is-active' : ''} to={link.to}>
                <AdminIcon name={link.icon} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="admin-layout__side-bottom">
          <Link className="admin-layout__create" to="/Admin/ManageTournaments/Create"><AdminIcon name="trophy" />Create Tournament</Link>
          <Link to="#help"><AdminIcon name="help" />Help Center</Link>
          <Link to="/"><AdminIcon name="logout" />Logout</Link>
        </div>
      </aside>

      <main className="admin-layout__main">
        <header className="admin-layout__topbar">
          <div className="admin-layout__topbar-left">
            {breadcrumb ? (
              <nav className="admin-layout__breadcrumb" aria-label="Breadcrumb">
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={`${item.label}-${index}`}>
                    {index > 0 ? <span aria-hidden="true">&gt;</span> : null}
                    {item.to ? <Link to={item.to}>{item.label}</Link> : <strong>{item.label}</strong>}
                  </React.Fragment>
                ))}
              </nav>
            ) : (
              <>
                {title ? <h1>{title}</h1> : null}
                <nav className="admin-layout__topnav" aria-label="Admin sections">
                  <Link className={topNavActive === 'overview' ? 'is-active' : ''} to="/admin">Overview</Link>
                  <Link className={topNavActive === 'reports' ? 'is-active' : ''} to="/Admin/ManageTournaments">Reports</Link>
                  <Link className={topNavActive === 'analytics' ? 'is-active' : ''} to="#analytics">Analytics</Link>
                </nav>
              </>
            )}
          </div>
          <div className="admin-layout__actions">
            <button type="button" aria-label="Notifications"><AdminIcon name="bell" /></button>
            <ProfileMenu />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
