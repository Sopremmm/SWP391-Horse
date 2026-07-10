import React from 'react';
import { NavLink } from 'react-router-dom';
import './RefereeLayout.css';

type SidebarLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const GridIcon = () => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M12 8V1H21V8H12ZM1 12V1H10V12H1ZM12 21V10H21V21H12ZM1 21V14H10V21H1ZM3 10H8V3H3V10ZM14 19H19V12H14V19ZM14 6H19V3H14V6ZM3 19H8V16H3V19Z" fill="currentColor" />
  </svg>
);

const TimerIcon = () => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M8 2V0H14V2H8ZM10 13H12V7H10V13ZM11 22C9.77 22 8.6 21.76 7.51 21.29C6.42 20.81 5.47 20.17 4.65 19.35C3.83 18.53 3.19 17.58 2.71 16.49C2.24 15.4 2 14.23 2 13C2 11.77 2.24 10.6 2.71 9.51C3.19 8.42 3.83 7.47 4.65 6.65C5.47 5.83 6.42 5.19 7.51 4.71C8.6 4.24 9.77 4 11 4C12.03 4 13.03 4.17 14 4.5C14.97 4.83 15.87 5.32 16.7 5.95L18.1 4.55L19.5 5.95L18.1 7.35C18.73 8.18 19.21 9.08 19.54 10.04C19.87 11.01 20.04 11.99 20.04 13C20.04 14.23 19.8 15.4 19.33 16.49C18.85 17.58 18.21 18.53 17.39 19.35C16.57 20.17 15.62 20.81 14.53 21.29C13.44 21.76 12.27 22 11 22ZM11 20C12.93 20 14.58 19.32 15.95 17.95C17.32 16.58 18 14.93 18 13C18 11.07 17.32 9.42 15.95 8.05C14.58 6.68 12.93 6 11 6C9.07 6 7.42 6.68 6.05 8.05C4.68 9.42 4 11.07 4 13C4 14.93 4.68 16.58 6.05 17.95C7.42 19.32 9.07 20 11 20Z" fill="currentColor" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 22" fill="none" aria-hidden="true">
    <path d="M0 22L12 1L24 22H0ZM3.45 20H20.55L12 5L3.45 20ZM12 18C12.28 18 12.52 17.9 12.71 17.71C12.9 17.52 13 17.28 13 17C13 16.72 12.9 16.48 12.71 16.29C12.52 16.1 12.28 16 12 16C11.72 16 11.48 16.1 11.29 16.29C11.1 16.48 11 16.72 11 17C11 17.28 11.1 17.52 11.29 17.71C11.48 17.9 11.72 18 12 18ZM11 15H13V10H11V15Z" fill="currentColor" />
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M11 22C8.3 22 5.98 21.1 4.04 19.3C2.1 17.5 1.02 15.27 0.8 12.6H3.05C3.28 14.77 4.17 16.55 5.71 17.95C7.25 19.32 9.02 20 11 20C13.48 20 15.6 19.12 17.36 17.36C19.12 15.6 20 13.48 20 11C20 8.52 19.12 6.4 17.36 4.64C15.6 2.88 13.48 2 11 2C9.62 2 8.33 2.3 7.13 2.9C5.93 3.5 4.92 4.33 4.1 5.4H7V7.4H0.7V1.1H2.7V3.65C3.73 2.5 4.96 1.6 6.39 0.95C7.81 0.32 9.35 0 11 0C12.53 0 13.96 0.29 15.3 0.88C16.63 1.45 17.8 2.23 18.8 3.23C19.8 4.23 20.58 5.4 21.15 6.74C21.72 8.08 22 9.5 22 11C22 12.5 21.72 13.92 21.15 15.26C20.58 16.6 19.8 17.77 18.8 18.77C17.8 19.77 16.63 20.55 15.3 21.12C13.96 21.71 12.53 22 11 22ZM13.8 15.2L10 11.4V6H12V10.6L15.2 13.8L13.8 15.2Z" fill="currentColor" />
  </svg>
);

const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 14C15.33 14 16.46 13.54 17.39 12.61C18.32 11.68 18.79 10.55 18.79 9.21C18.79 7.88 18.32 6.75 17.39 5.82C16.46 4.89 15.33 4.42 14 4.42C12.67 4.42 11.54 4.89 10.61 5.82C9.68 6.75 9.21 7.88 9.21 9.21C9.21 10.55 9.68 11.68 10.61 12.61C11.54 13.54 12.67 14 14 14ZM5 24.5C6.08 22.92 7.42 21.73 9.03 20.91C10.64 20.1 12.3 19.69 14 19.69C15.7 19.69 17.36 20.1 18.97 20.91C20.58 21.73 21.92 22.92 23 24.5H5Z" fill="currentColor" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="currentColor" />
  </svg>
);

const links: SidebarLink[] = [
  { label: 'Dashboard', href: '/Referee/Home', icon: <GridIcon /> },
  { label: 'Live Races', href: '/Referee/Races', icon: <TimerIcon /> },
  { label: 'Incident Log', href: '/Referee/IncidentReports', icon: <AlertIcon /> },
  { label: 'History', href: '/Referee/History', icon: <HistoryIcon /> },
];

export const RefereeSidebar: React.FC = () => {
  return (
    <aside className="referee-sidebar">
      <div>
        <div className="referee-sidebar__profile">
          <span className="referee-sidebar__avatar">
            <UserIcon />
          </span>
          <div>
            <h2>Race Official</h2>
            <p>Senior Referee</p>
          </div>
        </div>

        <nav className="referee-sidebar__nav" aria-label="Referee workspace navigation">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) => `referee-sidebar__link ${isActive ? 'is-active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="referee-sidebar__report">
        <button type="button">
          <PlusIcon />
          Report Incident
        </button>
      </div>
    </aside>
  );
};

export default RefereeSidebar;
