import React from 'react';
import { Link } from 'react-router-dom';
import { getPageData } from '../data/pageData.ts';
import './Homepage.css';

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M13.83 15 8.58 9.75a5.43 5.43 0 0 1-3.16 1.08A5.23 5.23 0 0 1 0 5.42 5.23 5.23 0 0 1 5.42 0a5.23 5.23 0 0 1 5.41 5.42 5.43 5.43 0 0 1-1.08 3.16L15 13.83 13.83 15ZM5.42 9.17A3.62 3.62 0 0 0 9.17 5.42a3.62 3.62 0 0 0-3.75-3.75 3.62 3.62 0 0 0-3.75 3.75 3.62 3.62 0 0 0 3.75 3.75Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
  </svg>
);

const Homepage: React.FC = () => {
  const { homepage } = getPageData();
  const { hero, stats, tournaments } = homepage;

  return (
    <div className="homepage">
      <header className="homepage__header">
        <div className="homepage__shell homepage__header-inner">
          <div className="homepage__brand-row">
            <a className="homepage__brand" href="#top">
              Heritage Racing
            </a>
            <nav className="homepage__nav" aria-label="Primary navigation">
              <a className="homepage__nav-link homepage__nav-link--active" href="#tournaments">
                Tournaments
              </a>
              <a className="homepage__nav-link" href="#race-info">
                Race Info
              </a>
              <a className="homepage__nav-link" href="#about">
                About Us
              </a>
            </nav>
          </div>

          <div className="homepage__header-actions">
            <button className="homepage__icon-button" type="button" aria-label="Search">
              <SearchIcon />
            </button>
            <Link className="homepage__auth-link homepage__auth-link--ghost" to="/login">
              Sign In
            </Link>
            <Link className="homepage__auth-link homepage__auth-link--solid" to="/register">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="homepage__hero" aria-labelledby="homepage-title">
          <img className="homepage__hero-image" src={hero.image} alt={hero.title} />
          <div className="homepage__hero-gradient" />
          <div className="homepage__shell homepage__hero-inner">
            <div className="homepage__hero-copy">
              <p className="homepage__eyebrow">
                <span />
                {hero.eyebrow}
              </p>
              <h1 id="homepage-title">{hero.title}</h1>
              <p className="homepage__hero-text">{hero.description}</p>

              <div className="homepage__facts">
                <div>
                  <span>Prize Pool</span>
                  <strong>{hero.prizePool}</strong>
                </div>
                <div>
                  <span>Race Date</span>
                  <strong>{hero.raceDate}</strong>
                </div>
              </div>

              <div className="homepage__hero-actions">
                <button className="homepage__button homepage__button--primary" type="button">
                  {hero.primaryAction}
                </button>
                <button className="homepage__button homepage__button--secondary" type="button">
                  {hero.secondaryAction}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="homepage__stats" aria-label="Heritage Racing statistics">
          <div className="homepage__shell homepage__stats-grid">
            {stats.map((item) => (
              <div className="homepage__stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="homepage__tournaments" id="tournaments" aria-labelledby="tournaments-heading">
          <div className="homepage__shell">
            <div className="homepage__section-head">
              <div>
                <h2 id="tournaments-heading">Current Tournaments</h2>
                <p>Join the most prestigious racing circles in the world. Real-time stakes, legendary venues.</p>
              </div>
              <a className="homepage__text-link" href="#all-stakes">
                View All Stakes
                <ArrowIcon />
              </a>
            </div>

            <div className="homepage__cards">
              {tournaments.map((tournament) => (
                <article className="homepage__card" key={tournament.title}>
                  <div className="homepage__card-media">
                    <img src={tournament.image} alt={tournament.title} />
                    <span className={`homepage__status homepage__status--${tournament.state}`}>
                      {tournament.stateText}
                    </span>
                  </div>
                  <div className="homepage__card-body">
                    <div>
                      <h3>{tournament.title}</h3>
                      <p>{tournament.location}</p>
                    </div>
                    <dl className="homepage__details">
                      <div>
                        <dt>{tournament.dateLabel}</dt>
                        <dd>{tournament.dateValue}</dd>
                      </div>
                      <div>
                        <dt>Prize Pool</dt>
                        <dd>{tournament.prizePool}</dd>
                      </div>
                    </dl>
                    <button className="homepage__card-button" type="button">
                      {tournament.action}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="homepage__footer">
        <div className="homepage__shell homepage__footer-inner">
          <div>
            <h2>Heritage Racing</h2>
            <p>(c) 2024 Heritage Racing. All rights reserved.</p>
          </div>
          <nav className="homepage__footer-nav" aria-label="Footer navigation">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#support">Contact Support</a>
            <a className="homepage__footer-highlight" href="#standings">
              Global Standings
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
