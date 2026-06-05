import React from 'react';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';


import HomeBanner from '../assets/images/HomeBanner.png';
import horseRaceCartoon from '../Main UI/horse_race_cartoon.png';
import './Tournament.css';

type FilterTab = 'all' | 'registration-open' | 'upcoming' | 'completed';

type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [{ label: 'Date: Soonest first', value: 'soonest' }];

const tournaments = [
  {
    id: 'platinum-jubilee',
    featured: true,
    badge: 'REGISTRATION OPEN',
    badgeTone: 'amber',
    title: 'The Platinum Jubilee\nStakes',
    description:
      'The crown jewel of the autumn season. A legendary G1 event where legacies are forged and champions rise above the rest.',
    imageUrl: HomeBanner,
    prizePool: '£1,000,000',
    dateLabel: 'RACE DATE',
    dateValue: 'Oct 24, 2024',
    deadlineText: 'DEADLINE: SEP 15, 2024',
    actionText: 'Register Now',
  },
  {
    id: 'emerald-derby',
    featured: false,
    badge: 'UPCOMING',
    badgeTone: 'stone',
    title: 'Emerald Derby',
    description:
      'A test of endurance and speed across the verdant hills of the North.',
    imageUrl: horseRaceCartoon,
    prizePool: '£250,000',
    meta1Label: 'STARTS',
    meta1Value: 'Nov 12, 2024',
    actionText: 'View Details',
  },
  {
    id: 'winter-solstice',
    featured: false,
    badge: 'REGISTRATION OPEN',
    badgeTone: 'amber',
    title: 'Winter Solstice Cup',
    description:
      'The premier winter sprint. Short distance, high stakes, and absolute precision.',
    imageUrl: horseRaceCartoon,
    prizePool: '£500,000',
    meta1Label: 'DEADLINE',
    meta1Value: 'Oct 05, 2024',
    actionText: 'Register Now',
  },
];

const secondaryEvents = {
  title: 'Regional Qualifiers',
  actionText: 'View All Schedule',
  columns: ['TOURNAMENT NAME', 'STATUS', 'REG. DEADLINE', 'PRIZE POOL', 'ACTION'],
  rows: [
    {
      name: 'Southern Fields Invitational',
      classLine: 'Class 3 • Turf • 1200m',
      status: 'UPCOMING',
      statusTone: 'stone',
      deadline: 'Oct 20, 2024',
      prizePool: '£50,000',
      action: 'View',
    },
    {
      name: 'Highland Sprint Cup',
      classLine: 'Class 2 • Dirt • 1000m',
      status: 'OPEN',
      statusTone: 'amber',
      deadline: 'Sep 10, 2024',
      prizePool: '£120,000',
      action: 'Register',
    },
    {
      name: 'The Heritage Plate',
      classLine: 'Class 4 • All-Weather • 1400m',
      status: 'UPCOMING',
      statusTone: 'stone',
      deadline: 'Oct 28, 2024',
      prizePool: '£35,000',
      action: 'View',
    },
  ],
};

export default function Tournament() {
  const [activeFilter, setActiveFilter] = React.useState<FilterTab>('all');
  const [activeSort] = React.useState(sortOptions[0].value);

  // UI-only state for now (matches the static Figma layout requirement)
  void activeFilter;
  void activeSort;

  return (
    <div className="tournament-page">
      <Header />

      <main className="tournament-page__main" aria-label="Tournament listing">
        <section className="tournament-page__hero">
          <div className="tournament-page__shell">
            <h1 className="tournament-page__title">Available Tournaments</h1>
            <p className="tournament-page__subtitle">
              Experience the pinnacle of equestrian excellence. Register your finest thoroughbreds for
              <br /> the season&apos;s most prestigious events and compete for unprecedented stakes.
            </p>
          </div>
        </section>

        <section className="tournament-page__filters">
          <div className="tournament-page__shell tournament-page__filters-inner">
            <div className="tournament-page__tabs" role="tablist" aria-label="Filters">
              <button
                type="button"
                className={`tournament-page__tab ${activeFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Events
              </button>
              <button
                type="button"
                className={`tournament-page__tab ${activeFilter === 'registration-open' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('registration-open')}
              >
                Registration Open
              </button>
              <button
                type="button"
                className={`tournament-page__tab ${activeFilter === 'upcoming' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                type="button"
                className={`tournament-page__tab ${activeFilter === 'completed' ? 'is-active' : ''}`}
                onClick={() => setActiveFilter('completed')}
              >
                Completed
              </button>
            </div>

            <div className="tournament-page__sort">
              <div className="tournament-page__sort-label">SORT BY</div>
              <div className="tournament-page__sort-pill">
                <span className="tournament-page__sort-value">Date: Soonest first</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tournament-page__list">
          <div className="tournament-page__shell">
            <div className="tournament-page__featured-grid">
              {tournaments
                .filter((t) => t.featured)
                .map((t) => (
                  <article key={t.id} className="tournament-page__card tournament-page__card--featured">
                    <div className="tournament-page__card-media">
                      <img className="tournament-page__card-image" src={t.imageUrl} alt={t.id} />
                    </div>

                    <div className="tournament-page__card-body">
                      <div className="tournament-page__badge tournament-page__badge--amber">{t.badge}</div>
                      <h2 className="tournament-page__card-title">
                        {t.title.split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx === 0 ? <br /> : null}
                          </React.Fragment>
                        ))}
                      </h2>
                      <p className="tournament-page__card-desc">{t.description}</p>

                      <div className="tournament-page__meta-2cols">
                        <div className="tournament-page__meta-item">
                          <div className="tournament-page__meta-label">PRIZE POOL</div>
                          <div className="tournament-page__meta-value">{t.prizePool}</div>
                        </div>
                        <div className="tournament-page__meta-item">
                          <div className="tournament-page__meta-label">RACE DATE</div>
                          <div className="tournament-page__meta-value">{t.dateValue}</div>
                        </div>
                      </div>

                      <div className="tournament-page__deadline">
                        <div className="tournament-page__deadline-icon" aria-hidden="true">
                          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M4 1.33333V0H8V1.33333H4V1.33333M5.33333 8.66667H6.66667V4.66667H5.33333V8.66667V8.66667M6 14C5.17778 14 4.40278 13.8417 3.675 13.525C2.94722 13.2083 2.31111 12.7778 1.76667 12.2333C1.22222 11.6889 0.791667 11.0528 0.475 10.325C0.158333 9.59722 0 8.82222 0 8C0 7.17778 0.158333 6.40278 0.475 5.675C0.791667 4.94722 1.22222 4.31111 1.76667 3.76667C2.31111 3.22222 2.94722 2.79167 3.675 2.475C4.40278 2.15833 5.17778 2 6 2C6.68889 2 7.35 2.11111 7.98333 2.33333C8.61667 2.55556 9.21111 2.87778 9.76667 3.3L10.7 2.36667L11.6333 3.3L10.7 4.23333C11.1222 4.78889 11.4444 5.38333 11.6667 6.01667C11.8889 6.65 12 7.31111 12 8C12 8.82222 11.8417 9.59722 11.525 10.325C11.2083 11.0528 10.7778 11.6889 10.2333 12.2333C9.68889 12.7778 9.05278 13.2083 8.325 13.525C7.59722 13.8417 6.82222 14 6 14V14M6 12.6667C7.28889 12.6667 8.38889 12.2111 9.3 11.3C10.2111 10.3889 10.6667 9.28889 10.6667 8C10.6667 6.71111 10.2111 5.61111 9.3 4.7C8.38889 3.78889 7.28889 3.33333 6 3.33333C4.71111 3.33333 3.61111 3.78889 2.7 4.7C1.78889 5.61111 1.33333 6.71111 1.33333 8C1.33333 9.28889 1.78889 10.3889 2.7 11.3C3.61111 12.2111 4.71111 12.6667 6 12.6667V12.6667M6 8V8V8V8V8V8V8V8V8V8" fill="#BA1A1A"/>
                          </svg>
                        </div>
                        <div className="tournament-page__deadline-text">{t.deadlineText}</div>
                      </div>

                      <div className="tournament-page__card-action">
                        <button type="button" className="tournament-page__primary-btn">
                          {t.actionText}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </div>

            <div className="tournament-page__cards-row">
              {tournaments
                .filter((t) => !t.featured)
                .map((t) => (
                  <article key={t.id} className="tournament-page__card tournament-page__card--sm">
                    <div className="tournament-page__card-media tournament-page__card-media--sm">
                      <img className="tournament-page__card-image" src={t.imageUrl} alt={t.title} />
                      <div
                        className={`tournament-page__small-badge ${t.badgeTone === 'amber' ? 'tournament-page__small-badge--amber' : ''}`}
                      >
                        {t.badge}
                      </div>
                    </div>

                    <div className="tournament-page__sm-body">
                      <h3 className="tournament-page__sm-title">{t.title}</h3>
                      <p className="tournament-page__sm-desc">{t.description}</p>

                      <div className="tournament-page__sm-divider">
                        <div className="tournament-page__sm-meta-label">PRIZE POOL</div>
                        <div className="tournament-page__sm-meta-value">{t.prizePool}</div>
                      </div>

                      <div className="tournament-page__sm-divider">
                        <div className="tournament-page__sm-meta-label">{t.meta1Label}</div>
                        <div className="tournament-page__sm-meta-value">{t.meta1Value}</div>
                      </div>

                      <div className="tournament-page__sm-action">
                        <button type="button" className="tournament-page__outline-btn">
                          {t.actionText}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

              {/* Bento “table-like” secondary events */}
              <div className="tournament-page__table">
                <div className="tournament-page__table-head">
                  <h3 className="tournament-page__table-title">{secondaryEvents.title}</h3>
                  <button type="button" className="tournament-page__link-btn">{secondaryEvents.actionText}</button>
                </div>

                <div className="tournament-page__table-grid">
                  <div className="tournament-page__table-header-row">
                    <div className="tournament-page__th tournament-page__th--name">TOURNAMENT NAME</div>
                    <div className="tournament-page__th tournament-page__th--status">STATUS</div>
                    <div className="tournament-page__th tournament-page__th--deadline">REG. DEADLINE</div>
                    <div className="tournament-page__th tournament-page__th--prize">PRIZE POOL</div>
                    <div className="tournament-page__th tournament-page__th--action" />
                  </div>

                  {secondaryEvents.rows.map((r, idx) => (
                    <div
                      key={idx}
                      className={`tournament-page__table-row ${idx === 0 ? '' : 'tournament-page__table-row--border'}`}
                    >
                      <div className="tournament-page__td tournament-page__td--name">
                        <div className="tournament-page__row-name">{r.name}</div>
                        <div className="tournament-page__row-class">{r.classLine}</div>
                      </div>

                      <div className="tournament-page__td tournament-page__td--status">
                        <div
                          className={`tournament-page__status-pill ${r.statusTone === 'amber' ? 'tournament-page__status-pill--amber' : ''}`}
                        >
                          {r.status}
                        </div>
                      </div>

                      <div className="tournament-page__td tournament-page__td--deadline">{r.deadline}</div>
                      <div className="tournament-page__td tournament-page__td--prize">{r.prizePool}</div>

                      <div className="tournament-page__td tournament-page__td--action">
                        <button type="button" className={`tournament-page__action-btn ${r.statusTone === 'amber' ? 'tournament-page__action-btn--amber' : ''}`}>
                          {r.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

