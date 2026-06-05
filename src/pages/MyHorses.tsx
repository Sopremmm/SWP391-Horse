import React from 'react';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import './MyHorses.css';

import horse1 from '../assets/images/horse1.webp';
import horse2 from '../assets/images/horse2.jpg';
import horse3 from '../assets/images/horse3.jpg';



type Horse = {
  name: string;
  meta: string;
  imageSrc: string;
};

const HORSES: Horse[] = [
  {
    name: 'Midnight Sovereign',
    meta: 'Thoroughbred • 5yo • Stallion',
    imageSrc: horse1,
  },
  {
    name: 'Royal Velvet',
    meta: 'Thoroughbred • 3yo • Mare',
    imageSrc: horse2,
  },
  {
    name: 'Ivory Ghost',
    meta: 'Arabian Cross • 4yo • Stallion',
    imageSrc: horse3,
  },
];

export const MyHorses: React.FC = () => {
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
            <button className="my-horses__btn my-horses__btn--primary" type="button">
              <span className="my-horses__btn-plus" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 6.66667H0V5H5V0H6.66667V5H11.6667V6.66667H6.66667V11.6667H5V6.66667V6.66667"
                    fill="white"
                  />
                </svg>
              </span>
              Add New Horse
            </button>
          </div>
        </section>

        <section className="my-horses__stats-bento" aria-label="Quick stats">
          <div className="stat-card stat-card--total">
            <div className="stat-card__bg-icon" aria-hidden="true">
              <svg width="95" height="65" viewBox="0 0 95 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M65 45C60.8333 45 57.2917 43.5417 54.375 40.625C51.4583 37.7083 50 34.1667 50 30C50 25.8333 51.4583 22.2917 54.375 19.375C57.2917 16.4583 60.8333 15 65 15C69.1667 15 72.7083 16.4583 75.625 19.375C78.5417 22.2917 80 25.8333 80 30C80 34.1667 78.5417 37.7083 75.625 40.625C72.7083 43.5417 69.1667 45 65 45V45M30 60C27.25 60 24.8958 59.0208 22.9375 57.0625C20.9792 55.1042 20 52.75 20 50V10C20 7.25 20.9792 4.89583 22.9375 2.9375C24.8958 0.979167 27.25 0 30 0H100C102.75 0 105.104 0.979167 107.062 2.9375C109.021 4.89583 110 7.25 110 10V50C110 52.75 109.021 55.1042 107.062 57.0625C105.104 59.0208 102.75 60 100 60H30V60M40 50H90C90 47.25 90.9792 44.8958 92.9375 42.9375C94.8958 40.9792 97.25 40 100 40V20C97.25 20 94.8958 19.0208 92.9375 17.0625C90.9792 15.1042 90 12.75 90 10H40C40 12.75 39.0208 15.1042 37.0625 17.0625C35.1042 19.0208 32.75 20 30 20V40C32.75 40 35.1042 40.9792 37.0625 42.9375C39.0208 44.8958 40 47.25 40 50V50M95 80H10C7.25 80 4.89583 79.0208 2.9375 77.0625C0.979167 75.1042 0 72.75 0 70V15H10V70V70V70H95V80V80M30 50V50V50V50V10V10V10V10V10V10V50V50V50V50"
                  fill="#002A15"
                  fill-opacity="0.05"
                />
              </svg>
            </div>
            <div className="stat-card__label">TOTAL VALUE</div>
            <div className="stat-card__value">12.4M Credits</div>
          </div>

          <div className="stat-card stat-card--stable-size">
            <div className="stat-card__bg-icon" aria-hidden="true">
              <svg width="95" height="75" viewBox="0 0 95 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 90V39.25L6 50L0 42L55 0L110 42L104 50L90 39.25V90H80V75H30V90H20V90M30 45H80V35H30V45V45M30 65H80V55H30V65V65M38.75 25H71.25L55 12.625L38.75 25V25"
                  fill="#002A15"
                  fill-opacity="0.05"
                />
              </svg>
            </div>
            <div className="stat-card__label">STABLE SIZE</div>
            <div className="stat-card__value">{String(HORSES.length).padStart(2, '0')} Thoroughbreds</div>

          </div>

          <div className="stat-card stat-card--recent-wins">
            <div className="stat-card__bg-icon" aria-hidden="true">
              <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 90V80H40V64.5C35.9167 63.5833 32.2708 61.8542 29.0625 59.3125C25.8542 56.7708 23.5 53.5833 22 49.75C15.75 49 10.5208 46.2708 6.3125 41.5625C2.10417 36.8542 0 31.3333 0 25V20C0 17.25 0.979167 14.8958 2.9375 12.9375C4.89583 10.9792 7.25 10 10 10H20V0H70V10H80C82.75 10 85.104 10.9792 87.0625 12.9375C89.0208 14.8958 90 17.25 90 20V25C90 31.3333 87.8958 36.8542 83.6875 41.5625C79.4792 46.2708 74.25 49 68 49.75C66.5 53.5833 64.1458 56.7708 60.9375 59.3125C57.7292 61.8542 54.0833 63.5833 50 64.5V80H70V90H20V90M20 39V20H10V25C10 28.1667 10.9167 31.0208 12.75 33.5625C14.5833 36.1042 17 37.9167 20 39V39M45 55C49.1667 55 52.7083 53.5417 55.625 50.625C58.5417 47.7083 60 44.1667 60 40V10H30V40C30 44.1667 31.4583 47.7083 34.375 50.625C37.2917 53.5417 40.8333 55 45 55V55M70 39C73 37.9167 75.4167 36.1042 77.25 33.5625C79.0833 31.0208 80 28.1667 80 25V20H70V39V39M45 32.5V32.5V32.5V32.5V32.5V32.5V32.5V32.5V32.5"
                  fill="#002A15"
                  fill-opacity="0.05"
                />
              </svg>
            </div>
            <div className="stat-card__label">RECENT WINS</div>
            <div className="stat-card__value">03 Stakes</div>
          </div>
        </section>

        <section className="my-horses__horse-grid" aria-label="Horse listings">
          {HORSES.map((h) => (
            <article key={h.name} className="horse-card">
              <div className="horse-card__image">
                <img src={h.imageSrc} alt={h.name} />
              </div>
              <div className="horse-card__body">
                <div className="horse-card__name">{h.name}</div>
                <div className="horse-card__meta">{h.meta}</div>
                <button className="horse-card__manage" type="button">
                  Manage Horse
                </button>
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

