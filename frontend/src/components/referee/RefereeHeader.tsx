import React from 'react';
import { NavLink } from 'react-router-dom';
import './RefereeLayout.css';

export type RefereeNavLink = {
  label: string;
  href: string;
};

const defaultNavLinks: RefereeNavLink[] = [
  { label: 'Home', href: '/Referee/Home' },
  { label: 'My Races', href: '/Referee/Races' },
];

type RefereeHeaderProps = {
  navLinks?: RefereeNavLink[];
};

export const RefereeHeader: React.FC<RefereeHeaderProps> = ({ navLinks = defaultNavLinks }) => {
  return (
    <header className="referee-header">
      <div className="referee-header__inner">
        <h1 className="referee-header__brand">Referee Dashboard</h1>

        <nav className="referee-header__nav" aria-label="Referee navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) => `referee-header__link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="referee-header__actions">
          <NavLink to="/Referee/Notifications" className="referee-header__notification" aria-label="Notifications">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </NavLink>
          <button type="button" className="referee-header__profile" aria-label="Profile">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M13 13C14.38 13 15.56 12.51 16.54 11.54C17.51 10.56 18 9.38 18 8C18 6.62 17.51 5.44 16.54 4.46C15.56 3.49 14.38 3 13 3C11.62 3 10.44 3.49 9.46 4.46C8.49 5.44 8 6.62 8 8C8 9.38 8.49 10.56 9.46 11.54C10.44 12.51 11.62 13 13 13ZM3.35 23C4.37 21.42 5.71 20.19 7.38 19.31C9.05 18.44 10.92 18 13 18C15.08 18 16.95 18.44 18.62 19.31C20.29 20.19 21.63 21.42 22.65 23C20.17 25 16.95 26 13 26C9.05 26 5.83 25 3.35 23Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default RefereeHeader;
