import React from 'react';
import { FOOTER_LINKS, BRAND } from '../../data/constants.js';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-inner">
        <div className="footer-branding">
          <h3>{BRAND.name}</h3>
          <p>{BRAND.tagline}</p>
        </div>

        <div className="footer-links-block">
          <nav className="footer-links" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <p className="footer-copyright">{BRAND.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
