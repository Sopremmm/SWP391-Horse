import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPageData, Jockey } from '../data/pageData.ts';
import './JockeyProfile.css';

const PLACEHOLDER_IMG = 'https://placehold.co/480x600';

const navLinks = [
  { label: 'Home', href: '/HorseOwnerHome' },
  { label: 'Tournament', href: '/HorseOwner/Tournaments' },
  { label: 'My Horses', href: '/HorseOwner/MyHorses' },
  { label: 'Hire Jockey', href: '/HorseOwner/HireJockeys', active: true },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 14 13" aria-hidden="true">
      <path d="M2.55 12.67 3.63 7.98 0 4.83l4.8-.41L6.67 0l1.86 4.42 4.8.41L9.7 7.98l1.08 4.69-4.11-2.49-4.12 2.49Z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 17 10" aria-hidden="true">
      <path d="M1.17 10 0 8.83l6.17-6.2L9.5 5.96l4.33-4.3h-2.16V0h5v5H15V2.83L9.5 8.33 6.17 5l-5 5Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 32 36" aria-hidden="true">
      <path d="M8 25v-2h2v-7c0-1.38.42-2.61 1.25-3.69.83-1.07 1.92-1.78 3.25-2.11v-.7c0-.42.15-.77.44-1.06.29-.29.65-.44 1.06-.44s.77.15 1.06.44c.29.29.44.64.44 1.06v.7c1.33.33 2.42 1.04 3.25 2.11.83 1.08 1.25 2.31 1.25 3.69v7h2v2H8Zm8 3c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 14 26h4c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59Zm-4-5h8v-7c0-1.1-.39-2.04-1.17-2.83A3.86 3.86 0 0 0 16 12c-1.1 0-2.04.39-2.83 1.17A3.86 3.86 0 0 0 12 16v7Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M11.85 23.1a10 10 0 0 1 12.3 0A8.04 8.04 0 0 0 26 18c0-2.22-.78-4.1-2.34-5.66A7.72 7.72 0 0 0 18 10c-2.22 0-4.1.78-5.66 2.34A7.72 7.72 0 0 0 10 18c0 .98.16 1.91.49 2.78.32.86.78 1.64 1.36 2.32ZM18 19c-.98 0-1.81-.34-2.49-1.01a3.39 3.39 0 0 1-1.01-2.49c0-.98.34-1.81 1.01-2.49A3.39 3.39 0 0 1 18 12c.98 0 1.81.34 2.49 1.01.67.68 1.01 1.51 1.01 2.49s-.34 1.81-1.01 2.49A3.39 3.39 0 0 1 18 19Zm0 9c-1.38 0-2.68-.26-3.9-.79a10.06 10.06 0 0 1-5.31-5.31A9.74 9.74 0 0 1 8 18c0-1.38.26-2.68.79-3.9a10.06 10.06 0 0 1 5.31-5.31A9.74 9.74 0 0 1 18 8c1.38 0 2.68.26 3.9.79a10.06 10.06 0 0 1 5.31 5.31c.53 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9a10.06 10.06 0 0 1-5.31 5.31A9.74 9.74 0 0 1 18 28Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 18 20" aria-hidden="true">
      <path d="M15 20c-.83 0-1.54-.29-2.13-.88A2.9 2.9 0 0 1 12 17c0-.1.03-.33.08-.7l-7.03-4.1A3 3 0 0 1 3 13c-.83 0-1.54-.29-2.13-.88A2.9 2.9 0 0 1 0 10c0-.83.29-1.54.87-2.13A2.9 2.9 0 0 1 3 7c.4 0 .78.07 1.13.21.35.14.66.34.92.59l7.03-4.1A4.1 4.1 0 0 1 12 3c0-.83.29-1.54.87-2.13A2.9 2.9 0 0 1 15 0c.83 0 1.54.29 2.13.87C17.71 1.46 18 2.17 18 3s-.29 1.54-.87 2.13A2.9 2.9 0 0 1 15 6c-.4 0-.78-.07-1.13-.21-.35-.14-.66-.34-.92-.59L5.93 9.3c.05.23.07.47.07.7s-.02.47-.07.7l7.02 4.1A3 3 0 0 1 15 14c.83 0 1.54.29 2.13.87.58.59.87 1.3.87 2.13s-.29 1.54-.87 2.13A2.9 2.9 0 0 1 15 20Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 16c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 14V2C0 1.45.2.98.59.59A1.93 1.93 0 0 1 2 0h16c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v12c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H2Zm8-7 8-5V2l-8 5-8-5v2l8 5Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71A.97.97 0 0 0 10 5c-.28 0-.52.1-.71.29A.97.97 0 0 0 9 6c0 .28.1.52.29.71.19.19.43.29.71.29Zm0 13a9.7 9.7 0 0 1-3.9-.79 10.06 10.06 0 0 1-5.31-5.31A9.74 9.74 0 0 1 0 10c0-1.38.26-2.68.79-3.9A10.06 10.06 0 0 1 6.1.79 9.74 9.74 0 0 1 10 0c1.38 0 2.68.26 3.9.79a10.06 10.06 0 0 1 5.31 5.31c.53 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9a10.06 10.06 0 0 1-5.31 5.31A9.74 9.74 0 0 1 10 20Z" />
    </svg>
  );
}

function yearsFrom(text: string) {
  return text.match(/\d+/)?.[0] ?? text;
}

function priceFrom(text: string) {
  return text.match(/\$[\d,]+/)?.[0] ?? text;
}

function buildFallbackProfile(jockey: Jockey) {
  return {
    classLabel: jockey.level.includes('ELITE') || jockey.level.includes('MASTER') ? 'ELITE CLASS' : 'PROFESSIONAL CLASS',
    tierLabel: jockey.hired ? 'Contracted Professional' : 'Available Professional',
    bio: `${jockey.name} brings disciplined racecraft, reliable pacing, and strong tactical instincts to competitive events across the Heritage Racing circuit.`,
    totalWins: jockey.hired ? '118' : '86',
    winRate: jockey.hired ? '22.4%' : '18.6%',
    performanceSeason: 'SEASON 2024',
    performance: [
      { raceName: 'Epsom Invitational', horse: 'Ivory Sovereign', position: '1st', earnings: '$45,000', trackCondition: 'Firm' },
      { raceName: 'Heritage Stakes', horse: 'Emerald King', position: '2nd', earnings: '$18,500', trackCondition: 'Soft' },
      { raceName: 'Royal Ascot Qualifiers', horse: 'Midnight Silk', position: '1st', earnings: '$32,000', trackCondition: 'Good' },
      { raceName: 'Prestige Derby', horse: 'Golden Mare', position: '4th', earnings: '$5,000', trackCondition: 'Heavy' },
    ],
    gallery: [
      { label: 'CHAMPIONSHIP MOMENT', title: 'Epsom Downs 2023' },
      { label: 'PREPARATION', title: 'The Royal Stables' },
    ],
  };
}

export default function JockeyProfile() {
  const params = useParams<{ name?: string }>();
  const { hireJockey } = getPageData();
  const decodedName = decodeURIComponent(params.name ?? '').trim();
  const selectedJockey =
    hireJockey.jockeys.find((jockey) => jockey.name.toLowerCase() === decodedName.toLowerCase()) ??
    hireJockey.jockeys[0];
  const profile = selectedJockey.profile ?? buildFallbackProfile(selectedJockey);
  const isAvailable = !selectedJockey.hired && selectedJockey.variant !== 'hired';

  return (
    <div className="jockey-profile">
      <header className="jockey-profile__header">
        <div className="jockey-profile__nav">
          <Link className="jockey-profile__brand" to="/HorseOwnerHome">
            Heritage Racing
          </Link>
          <nav className="jockey-profile__links" aria-label="Horse owner navigation">
            {navLinks.map((link) => (
              <Link
                className={`jockey-profile__link ${link.active ? 'jockey-profile__link--active' : ''}`}
                to={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="jockey-profile__actions" aria-label="Account actions">
            <button type="button" aria-label="Notifications">
              <BellIcon />
            </button>
            <button type="button" aria-label="Profile">
              <UserIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="jockey-profile__main">
        <section className="jockey-profile__hero" aria-labelledby="jockey-profile-title">
          <div className="jockey-profile__portrait">
            <img src={selectedJockey.imageSrc || PLACEHOLDER_IMG} alt={`${selectedJockey.name} portrait`} />
          </div>

          <div className="jockey-profile__summary">
            <div className="jockey-profile__badges">
              <span className="jockey-profile__class-badge">{profile.classLabel}</span>
              <span className="jockey-profile__tier">
                <StarIcon />
                {profile.tierLabel}
              </span>
            </div>

            <h1 id="jockey-profile-title">{selectedJockey.name}</h1>
            <p className="jockey-profile__bio">{profile.bio}</p>

            <div className="jockey-profile__stats" aria-label="Jockey statistics">
              <article className="jockey-profile__stat">
                <span>Experience</span>
                <strong>{yearsFrom(selectedJockey.experienceText)}</strong>
                <small>Years</small>
              </article>
              <article className="jockey-profile__stat">
                <span>Total Wins</span>
                <strong>{profile.totalWins}</strong>
                <small>Gold</small>
              </article>
              <article className="jockey-profile__stat">
                <span>Win Rate</span>
                <strong>{profile.winRate}</strong>
                <TrendIcon />
              </article>
              <article className="jockey-profile__stat">
                <span>Hiring Price</span>
                <strong>{priceFrom(selectedJockey.priceText)}</strong>
                <small>/ race</small>
              </article>
            </div>

            <button className="jockey-profile__hire" type="button" disabled={!isAvailable}>
              {isAvailable ? 'Hire' : 'Already Hired'}
            </button>
          </div>
        </section>

        <section className="jockey-profile__performance" aria-labelledby="jockey-performance-title">
          <div className="jockey-profile__section-head">
            <h2 id="jockey-performance-title">Recent Racing Performance</h2>
            <span>{profile.performanceSeason}</span>
          </div>

          <div className="jockey-profile__table" role="table" aria-label="Recent racing performance">
            <div className="jockey-profile__table-row jockey-profile__table-row--head" role="row">
              <span role="columnheader">Race Name</span>
              <span role="columnheader">Horse</span>
              <span role="columnheader">Position</span>
              <span role="columnheader">Earnings</span>
              <span role="columnheader">Track Condition</span>
            </div>
            {profile.performance.map((race) => (
              <div className="jockey-profile__table-row" role="row" key={`${race.raceName}-${race.horse}`}>
                <strong role="cell">{race.raceName}</strong>
                <span role="cell">{race.horse}</span>
                <span role="cell">
                  <mark className={race.position === '1st' ? 'is-gold' : ''}>{race.position}</mark>
                </span>
                <b role="cell">{race.earnings}</b>
                <span role="cell">{race.trackCondition}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="jockey-profile__gallery" aria-label="Jockey visual proof">
          {profile.gallery.map((item, index) => (
            <article className="jockey-profile__gallery-card" key={item.title}>
              {item.imageSrc ? <img src={item.imageSrc} alt={item.title} /> : null}
              <div className={`jockey-profile__gallery-fill jockey-profile__gallery-fill--${index + 1}`} />
              <div className="jockey-profile__gallery-overlay" />
              <div className="jockey-profile__gallery-copy">
                <span>{item.label}</span>
                <strong>{item.title}</strong>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="jockey-profile__footer">
        <div className="jockey-profile__footer-inner">
          <strong>Heritage Racing</strong>
          <span>(c) 2024 Elite Management Group. All rights reserved.</span>
          <div className="jockey-profile__socials" aria-label="Footer actions">
            <ShareIcon />
            <MailIcon />
            <InfoIcon />
          </div>
        </div>
      </footer>
    </div>
  );
}
