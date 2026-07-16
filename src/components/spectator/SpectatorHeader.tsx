import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './SpectatorLayout.css';

export type SpectatorNavLink = {
  label: string;
  href: string;
};

const defaultNavLinks: SpectatorNavLink[] = [
  { label: 'Home', href: '/Spectator/Home' },
  { label: 'Tournaments', href: '/Spectator/Tournaments' },
  { label: 'Horses', href: '/Spectator/Horses' },
  { label: 'My Bets', href: '/Spectator/MyBets' },
];

type SpectatorHeaderProps = {
  navLinks?: SpectatorNavLink[];
  showFunds?: boolean;
  showNotifications?: boolean;
};

function SpectatorProfileMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
  };

  return <div className="spectator-header__profile" onBlur={handleBlur}>
    <button type="button" className="spectator-header__profile-button" aria-label="Profile menu" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M13 13C14.35 13 15.5 12.53 16.45 11.58C17.4 10.63 17.88 9.48 17.88 8.12C17.88 6.77 17.4 5.62 16.45 4.67C15.5 3.72 14.35 3.25 13 3.25C11.65 3.25 10.5 3.72 9.55 4.67C8.6 5.62 8.12 6.77 8.12 8.12C8.12 9.48 8.6 10.63 9.55 11.58C10.5 12.53 11.65 13 13 13ZM4.02 22.75C5.05 21.14 6.36 19.9 7.94 19.01C9.52 18.13 11.21 17.69 13 17.69C14.79 17.69 16.48 18.13 18.06 19.01C19.64 19.9 20.95 21.14 21.98 22.75C19.53 25 16.54 26 13 26C9.46 26 6.47 25 4.02 22.75Z" fill="currentColor" /></svg>
    </button>
    {open ? <div className="spectator-header__menu" role="menu"><Link to="/Spectator/Profile" role="menuitem" onClick={close}>Profile</Link><Link to="/Spectator/MyBets" role="menuitem" onClick={close}>My Bets</Link><button type="button" role="menuitem" onClick={() => { close(); navigate('/'); }}>Logout</button></div> : null}
  </div>;
}

export const SpectatorHeader: React.FC<SpectatorHeaderProps> = ({
  navLinks = defaultNavLinks,
}) => {
  return (
    <header className="spectator-header">
      <div className="spectator-header__inner">
        <Link to="/Spectator/Home" className="spectator-header__brand">
          Heritage Racing
        </Link>

        <nav className="spectator-header__nav" aria-label="Spectator navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) => `spectator-header__link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="spectator-header__actions">
            <button type="button" className="spectator-header__icon-button" aria-label="Notifications">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
                <path
                  d="M9 19.2C10.12 19.2 11.04 18.32 11.15 17.22H6.85C6.96 18.32 7.88 19.2 9 19.2ZM16.35 14.55L14.7 12.9V8.35C14.7 5.55 13.2 3.22 10.55 2.6V1.95C10.55 1.1 9.85.4 9 .4C8.15.4 7.45 1.1 7.45 1.95V2.6C4.8 3.22 3.3 5.55 3.3 8.35V12.9L1.65 14.55V15.45H16.35V14.55Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          <SpectatorProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default SpectatorHeader;
