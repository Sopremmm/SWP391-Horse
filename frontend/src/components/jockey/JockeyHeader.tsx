import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './JockeyHeader.css';

type JockeyHeaderProps = {
  brandName?: string;
};

type JockeyHeaderIconName = 'bell' | 'user';

function JockeyHeaderIcon({ name }: { name: JockeyHeaderIconName }) {
  const paths: Record<JockeyHeaderIconName, string> = {
    bell:
      'M0 17v-2h2V8c0-1.4.4-2.6 1.3-3.7.8-1.1 1.9-1.8 3.2-2.1v-.7c0-.4.1-.8.4-1.1C7.2.1 7.6 0 8 0s.8.1 1.1.4c.3.3.4.7.4 1.1v.7c1.3.3 2.4 1 3.2 2.1.9 1.1 1.3 2.3 1.3 3.7v7h2v2H0Zm8 3c-.6 0-1-.2-1.4-.6A1.9 1.9 0 0 1 6 18h4c0 .6-.2 1-.6 1.4-.4.4-.8.6-1.4.6Z',
    user:
      'M3.9 15.1c.9-.7 1.8-1.2 2.9-1.6 1-.4 2.1-.6 3.2-.6s2.2.2 3.3.6c1 .4 2 .9 2.8 1.6.6-.7 1.1-1.5 1.4-2.3.3-.9.5-1.8.5-2.8 0-2.2-.8-4.1-2.3-5.7C14.1 2.8 12.2 2 10 2S5.9 2.8 4.3 4.3C2.8 5.9 2 7.8 2 10c0 1 .2 1.9.5 2.8.3.8.8 1.6 1.4 2.3ZM10 11c-1 0-1.8-.3-2.5-1-.7-.7-1-1.5-1-2.5s.3-1.8 1-2.5C8.2 4.3 9 4 10 4s1.8.3 2.5 1c.7.7 1 1.5 1 2.5s-.3 1.8-1 2.5c-.7.7-1.5 1-2.5 1Z',
  };

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function JockeyProfileDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    navigate('/');
  };

  return (
    <div className="jockey-header__profile" onBlur={handleBlur}>
      <button
        type="button"
        className="jockey-header__profile-trigger"
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <JockeyHeaderIcon name="user" />
      </button>
      {open ? (
        <div className="jockey-header__menu" role="menu">
          <Link to="/Jockey/Profile" role="menuitem" onClick={() => setOpen(false)}>Profile</Link>
          <Link to="/Jockey/Tournaments" role="menuitem" onClick={() => setOpen(false)}>Tournament</Link>
          <Link to="/Jockey/Invitation" role="menuitem" onClick={() => setOpen(false)}>My Invitations</Link>
          <button type="button" role="menuitem" onClick={handleLogout}>Logout</button>
        </div>
      ) : null}
    </div>
  );
}

export default function JockeyHeader({ brandName = 'Heritage Racing' }: JockeyHeaderProps) {
  const nav = [
    { label: 'Home', to: '/Jockey/Home' },
    { label: 'Profile', to: '/Jockey/Profile' },
    { label: 'Tournaments', to: '/Jockey/Tournaments' },
    { label: 'My Invitations', to: '/Jockey/Invitation' },
  ];

  return (
    <header className="jockey-header">
      <div className="jockey-header__inner">
        <div className="jockey-header__left">
          <Link className="jockey-header__brand" to="/Jockey/Home">{brandName}</Link>
          <nav className="jockey-header__nav" aria-label="Jockey navigation">
            {nav.map((item) => (
              <NavLink key={item.label} to={item.to} className={({ isActive }) => `jockey-header__link ${isActive ? 'is-active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="jockey-header__actions">
          <button type="button" className="jockey-header__icon-button" aria-label="Notifications"><JockeyHeaderIcon name="bell" /></button>
          <JockeyProfileDropdown />
        </div>
      </div>
    </header>
  );
}
