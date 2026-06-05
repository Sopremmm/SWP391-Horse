import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NAV_LINKS, BRAND } from '../../constants/index.ts';
import ProfileDropdown from './ProfileDropdown.tsx';

import './Header.css';

/**
 * Header - Top navigation bar (based on provided Figma structure)
 */
export const Header: React.FC = () => {
  // Brand always routes to HorseOwnerHome
  const homeHref = '/HorseOwnerHome';

  return (
    <div className="header">
      <div className="header-inner">
        <div className="brand-nav">
          {/* Brand */}
          <div className="brand-name">
            <Link to={homeHref} style={{ color: 'inherit', textDecoration: 'none' }}>
              {BRAND.name}
            </Link>
          </div>
        </div>

        {/* Nav links */}
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
              end
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Notifications + Profile */}
        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 18.3333C11.0133 18.3333 11.8333 17.5133 11.8333 16.5H8.16667C8.16667 17.5133 8.98667 18.3333 10 18.3333Z"
                fill="#717971"
              />
              <path
                d="M16.3333 14.4167V11.25C16.3333 7.77667 14.5367 5.31333 11.8333 4.65V3.75C11.8333 2.73667 11.0133 1.91667 10 1.91667C8.98667 1.91667 8.16667 2.73667 8.16667 3.75V4.65C5.46333 5.31333 3.66667 7.77667 3.66667 11.25V14.4167L2.5 15.5833V16.5H17.5V15.5833L16.3333 14.4167Z"
                fill="#717971"
              />
            </svg>
          </button>

          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default Header;






