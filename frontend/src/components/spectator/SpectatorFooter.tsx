import React from 'react';
import './SpectatorLayout.css';

const footerGroups = [
  {
    title: 'Resources',
    links: ['Terms of Service', 'Privacy Policy', 'Responsible Gambling', 'Contact Us'],
  },
  {
    title: 'Connect',
    links: ['Instagram', 'Twitter / X', 'YouTube', 'LinkedIn'],
  },
  {
    title: 'Platform',
    links: ['Live Racing', 'Horse Registry', 'Jockey Rankings'],
  },
];

export const SpectatorFooter: React.FC = () => {
  return (
    <footer className="spectator-footer">
      <div className="spectator-footer__inner">
        <div className="spectator-footer__brand">
          <h2>Heritage Racing</h2>
          <p>
            Elevating the equestrian tradition through precision technology and timeless luxury. Our platform brings the
            prestige of the track to your digital dashboard with authoritative data and elite event management.
          </p>
          <span>(c) 2024 Heritage Racing. Gamble Responsibly.</span>
        </div>

        <div className="spectator-footer__links" aria-label="Footer links">
          {footerGroups.map((group) => (
            <div key={group.title} className="spectator-footer__group">
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <a key={link} href={`#${link.toLowerCase().replaceAll(' ', '-')}`}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="spectator-footer__bar">
        <span>Version 4.21-release</span>
        <span>Data feed secured by Heritage Encryption</span>
      </div>
    </footer>
  );
};

export default SpectatorFooter;
