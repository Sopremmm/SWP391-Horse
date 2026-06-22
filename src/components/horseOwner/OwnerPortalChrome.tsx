import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ProfileDropdown from '../common/ProfileDropdown.tsx';
import './OwnerPortalChrome.css';

export type OwnerPortalIconName =
  | 'user'
  | 'badge'
  | 'money'
  | 'trophy'
  | 'stable'
  | 'tenure'
  | 'bell'
  | 'account'
  | 'edit'
  | 'arrow'
  | 'info'
  | 'more';

const OWNER_NAV = [
  { label: 'Profile', href: '/HorseOwner/Profile' },
  { label: 'My Tournaments', href: '/HorseOwner/MyTournament' },
  { label: 'My Jockeys', href: '/HorseOwner/MyJockeyinvitations' },
  { label: 'My Stable', href: '/HorseOwner/MyHorses' },
  { label: 'Notifications', href: '/HorseOwner/Notifications' },
];

export function OwnerPortalIcon({ name }: { name: OwnerPortalIconName }) {
  const paths: Record<OwnerPortalIconName, string> = {
    user:
      'M8 8c-1.1 0-2.04-.39-2.83-1.17A3.86 3.86 0 0 1 4 4c0-1.1.39-2.04 1.17-2.83A3.86 3.86 0 0 1 8 0c1.1 0 2.04.39 2.83 1.17A3.86 3.86 0 0 1 12 4c0 1.1-.39 2.04-1.17 2.83A3.86 3.86 0 0 1 8 8ZM0 16v-2.8c0-.57.15-1.09.44-1.56.29-.48.68-.84 1.16-1.09a14.7 14.7 0 0 1 3.15-1.16A13.7 13.7 0 0 1 8 9c1.1 0 2.18.13 3.25.39 1.07.26 2.12.65 3.15 1.16.48.25.87.61 1.16 1.09.29.47.44.99.44 1.56V16H0Z',
    badge:
      'M7.6 21 5.7 17.8 2.1 17l.35-3.7L0 10.5l2.45-2.8L2.1 4l3.6-.8L7.6 0 11 1.45 14.4 0l1.9 3.2 3.6.8-.35 3.7L22 10.5l-2.45 2.8.35 3.7-3.6.8-1.9 3.2L11 19.55 7.6 21Zm2.35-6.95 5.65-5.65-1.4-1.45-4.25 4.25L7.8 9.1l-1.4 1.4 3.55 3.55Z',
    money:
      'M2 16c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 14V3h2v11h17v2H2Zm4-4c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 4 10V2c0-.55.2-1.02.59-1.41C4.98.2 5.45 0 6 0h14c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v8c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H6Zm7-3c.83 0 1.54-.29 2.13-.88A2.9 2.9 0 0 0 16 6c0-.83-.29-1.54-.87-2.13A2.9 2.9 0 0 0 13 3c-.83 0-1.54.29-2.13.87A2.9 2.9 0 0 0 10 6c0 .83.29 1.54.87 2.12.59.59 1.3.88 2.13.88Z',
    trophy:
      'M4 18v-2h4v-3.1a6.12 6.12 0 0 1-3.6-2.95 5.1 5.1 0 0 1-3.14-1.64A4.85 4.85 0 0 1 0 5V4c0-.55.2-1.02.59-1.41C.98 2.2 1.45 2 2 2h2V0h10v2h2c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v1c0 1.27-.42 2.37-1.26 3.31a5.1 5.1 0 0 1-3.14 1.64A6.12 6.12 0 0 1 10 12.9V16h4v2H4Z',
    stable:
      'M3 15h1.5v-1.5h11V15H17v-3.85c0-.7-.25-1.3-.75-1.8V7c0-.55-.2-1.02-.59-1.41A1.93 1.93 0 0 0 14.25 5H11c-.37 0-.7.1-1 .3-.3-.2-.63-.3-1-.3H5.75c-.55 0-1.02.2-1.41.59A1.93 1.93 0 0 0 3.75 7v2.35c-.5.5-.75 1.1-.75 1.8V15Zm1.5-3v-1c0-.28.1-.52.29-.71.19-.19.43-.29.71-.29h9c.28 0 .52.1.71.29.19.19.29.43.29.71v1h-11ZM2 20c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 18V2C0 1.45.2.98.59.59 1 .2 1.45 0 2 0h16c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v16c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H2Z',
    tenure:
      'M3 17c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 1 15V4h2v11h11v2H3Zm4-4c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 5 11V2c0-.55.2-1.02.59-1.41C5.98.2 6.45 0 7 0h9c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v9c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H7Zm3-3 6-6-1.4-1.4L10 7.2 8.4 5.6 7 7l3 3Z',
    bell:
      'M0 17v-2h2V8c0-1.38.42-2.61 1.25-3.69A6.34 6.34 0 0 1 6.5 2.2v-.7c0-.42.15-.77.44-1.06C7.23.15 7.58 0 8 0s.77.15 1.06.44c.29.29.44.64.44 1.06v.7a6.34 6.34 0 0 1 3.25 2.11A5.86 5.86 0 0 1 14 8v7h2v2H0Zm8 3c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 6 18h4c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59ZM4 15h8V8c0-1.1-.39-2.04-1.17-2.83A3.86 3.86 0 0 0 8 4c-1.1 0-2.04.39-2.83 1.17A3.86 3.86 0 0 0 4 8v7Z',
    account:
      'M19 19c-1.1 0-2.04-.39-2.83-1.17A3.86 3.86 0 0 1 15 15c0-1.1.39-2.04 1.17-2.83A3.86 3.86 0 0 1 19 11c1.1 0 2.04.39 2.83 1.17A3.86 3.86 0 0 1 23 15c0 1.1-.39 2.04-1.17 2.83A3.86 3.86 0 0 1 19 19Zm-8 8v-2.8c0-.57.15-1.09.44-1.56.29-.48.68-.84 1.16-1.09a14.7 14.7 0 0 1 3.15-1.16A13.7 13.7 0 0 1 19 20c1.1 0 2.18.13 3.25.39 1.07.26 2.12.65 3.15 1.16.48.25.87.61 1.16 1.09.29.47.44.99.44 1.56V27H11Z',
    edit:
      'M1.17 9.33H2l5.7-5.7-.83-.83-5.7 5.7v.83ZM0 10.5V8.02L7.7.34c.12-.11.25-.19.39-.25A1.2 1.2 0 0 1 8.53 0c.16 0 .31.03.45.09.15.06.28.14.38.26l.8.82c.12.1.2.23.26.38.05.15.08.29.08.43 0 .16-.03.31-.08.45-.06.14-.14.27-.26.39L2.48 10.5H0Z',
    arrow:
      'M12.6 11.4H0V9.4h12.6L6.8 3.6 8.2 2.2 16.4 10.4l-8.2 8.2-1.4-1.4 5.8-5.8Z',
    info:
      'M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71A.97.97 0 0 0 10 5c-.28 0-.52.1-.71.29A.97.97 0 0 0 9 6c0 .28.1.52.29.71.19.19.43.29.71.29Zm0 13c-1.38 0-2.68-.26-3.9-.79a10.1 10.1 0 0 1-3.17-2.14A10.1 10.1 0 0 1 .79 13.9 9.76 9.76 0 0 1 0 10c0-1.38.26-2.68.79-3.9a10.1 10.1 0 0 1 2.14-3.17A10.1 10.1 0 0 1 6.1.79 9.76 9.76 0 0 1 10 0c1.38 0 2.68.26 3.9.79a10.1 10.1 0 0 1 3.17 2.14A10.1 10.1 0 0 1 19.21 6.1c.53 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9a10.1 10.1 0 0 1-2.14 3.17 10.1 10.1 0 0 1-3.17 2.14A9.76 9.76 0 0 1 10 20Z',
    more:
      'M2 16c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 14c0-.55.2-1.02.59-1.41C.98 12.2 1.45 12 2 12s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41C3.02 15.8 2.55 16 2 16Zm0-6c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 8c0-.55.2-1.02.59-1.41C.98 6.2 1.45 6 2 6s1.02.2 1.41.59c.39.39.59.86.59 1.41s-.2 1.02-.59 1.41C3.02 9.8 2.55 10 2 10Zm0-6C1.45 4 .98 3.8.59 3.41A1.93 1.93 0 0 1 0 2C0 1.45.2.98.59.59 1 .2 1.45 0 2 0s1.02.2 1.41.59C3.8.98 4 1.45 4 2s-.2 1.02-.59 1.41C3.02 3.8 2.55 4 2 4Z',
  };

  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export function OwnerPortalHeader() {
  return (
    <header className="owner-profile-header">
      <div className="owner-profile-header__inner">
        <Link className="owner-profile-header__brand" to="/HorseOwnerHome">
          Heritage Racing
        </Link>

        <nav className="owner-profile-header__nav" aria-label="Horse owner navigation">
          {OWNER_NAV.map((item) =>
            item.href.startsWith('#') ? (
              <a className="owner-profile-header__link" href={item.href} key={item.label}>
                {item.label}
              </a>
            ) : (
              <NavLink
                className={({ isActive }) => `owner-profile-header__link ${isActive ? 'is-active' : ''}`}
                end={
                  item.href === '/HorseOwner/Profile' ||
                  item.href === '/HorseOwner/MyTournament' ||
                  item.href === '/HorseOwner/MyHorses' ||
                  item.href === '/HorseOwner/Notifications'
                }
                key={item.label}
                state={item.href === '/HorseOwner/MyHorses' ? { ownerPortalHeader: true } : undefined}
                to={item.href}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="owner-profile-header__actions">
          <Link
            className="owner-profile-header__icon"
            to="/HorseOwner/Notifications"
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 18.3333C11.0133 18.3333 11.8333 17.5133 11.8333 16.5H8.16667C8.16667 17.5133 8.98667 18.3333 10 18.3333Z"
                fill="#717971"
              />
              <path
                d="M16.3333 14.4167V11.25C16.3333 7.77667 14.5367 5.31333 11.8333 4.65V3.75C11.8333 2.73667 11.0133 1.91667 10 1.91667C8.98667 1.91667 8.16667 2.73667 8.16667 3.75V4.65C5.46333 5.31333 3.66667 7.77667 3.66667 11.25V14.4167L2.5 15.5833V16.5H17.5V15.5833L16.3333 14.4167Z"
                fill="#717971"
              />
            </svg>
          </Link>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

export function OwnerPortalFooter() {
  return (
    <footer className="owner-profile-footer">
      <div className="owner-profile-footer__inner">
        <div>
          <h2>Heritage Racing</h2>
          <p>(c) 2024 Heritage Racing. All rights reserved.</p>
        </div>
        <nav aria-label="Owner portal footer navigation">
          <a href="#rules">Rules of Racing</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </nav>
      </div>
    </footer>
  );
}
