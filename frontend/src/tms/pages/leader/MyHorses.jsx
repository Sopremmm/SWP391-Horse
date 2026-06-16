import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import { getPageData } from '../../data/pageData.js';
import './MyHorses.css';

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M5 6.67H0V5h5V0h1.67v5h5v1.67h-5v5H5v-5Z" fill="currentColor" />
  </svg>
);

const MyHorses = () => {
  const horses = getPageData().myHorses.horses;
  const stats = getPageData().myHorses.stats;

  const STATS = [
    { label: 'TOTAL VALUE', value: stats.totalValue },
    { label: 'STABLE SIZE', value: stats.stableSize },
    { label: 'RECENT WINS', value: stats.recentWins },
  ];

  return (
    <div className="my-horses">
      <Header />

      <main className="my-horses__main" aria-label="My Horses page">
        <section className="my-horses__hero">
          <div className="my-horses__hero-left">
            <h1 className="my-horses__title">My Stable</h1>
            <p className="my-horses__subtitle">
              Manage your elite thoroughbreds and track their performance. View heritage records,
              training status, and upcoming race schedules for your premium equine roster.
            </p>
          </div>

          <div className="my-horses__hero-actions">
            <button className="my-horses__btn my-horses__btn--secondary" type="button">
              Manage Stable
            </button>
            <Link className="my-horses__btn my-horses__btn--primary" to="/HorseOwner/MyHorses/Add">
              <span className="my-horses__btn-plus" aria-hidden="true">
                <PlusIcon />
              </span>
              Add New Horse
            </Link>
          </div>
        </section>

        <section className="my-horses__stats-bento" aria-label="Quick stats">
          {STATS.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <div className="stat-card__bg-icon" aria-hidden="true" />
              <div className="stat-card__label">{stat.label}</div>
              <div className="stat-card__value">{stat.value}</div>
            </article>
          ))}
        </section>

        <section className="my-horses__horse-grid" aria-label="Horse listings">
          {horses.map((horse) => (
            <article key={horse.name} className="horse-card">
              <div className="horse-card__image">
                <img src={horse.imageSrc} alt={horse.name} />
              </div>
              <div className="horse-card__body">
                <div>
                  <h2 className="horse-card__name">{horse.name}</h2>
                  <p className="horse-card__meta">{horse.meta}</p>
                </div>
                <Link className="horse-card__manage" to={`/HorseOwner/MyHorses/${encodeURIComponent(horse.name)}`}>
                  Manage Horse
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyHorses;
