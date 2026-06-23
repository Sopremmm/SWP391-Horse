import React from 'react';
import { FOOTER_LINKS, BRAND } from '../../constants/index.ts';

import './Footer.css';

/**
 * Footer Component - Application Footer
 * Contains branding, navigation links, and copyright information
 */
export const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="footer-inner">
        {/* Left Section - Branding */}
        <div className="footer-branding">
          <h3>{BRAND.name}</h3>
          <p>{BRAND.tagline}</p>
        </div>

        {/* Right Section - Links & Copyright */}
        <div className="footer-links-block">
          {/* Navigation Links */}
          <nav className="footer-links" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="footer-copyright">{BRAND.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

