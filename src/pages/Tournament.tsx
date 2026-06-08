import React from 'react';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { getPageData } from '../data/pageData.ts';
import './Tournament.css';

type FilterTab = 'all' | 'registration-open' | 'upcoming' | 'completed';

export default function Tournament() {
  const { tournamentPage } = getPageData();
  const { filterTabs, sortOptions, tournaments, secondaryEvents } = tournamentPage;
  const defaultSort = sortOptions[0] ?? { label: 'Date: Soonest first', value: 'soonest' };
  const [activeFilter, setActiveFilter] = React.useState<FilterTab>('all');
  const [activeSort] = React.useState(defaultSort.value);

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
              <br /> the season's most prestigious events and compete for unprecedented stakes.
            </p>
          </div>
        </section>

        <section className="tournament-page__filters">
          <div className="tournament-page__shell tournament-page__filters-inner">
            <div className="tournament-page__tabs" role="tablist" aria-label="Filters">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={`tournament-page__tab ${activeFilter === tab.value ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="tournament-page__sort">
              <div className="tournament-page__sort-label">SORT BY</div>
              <div className="tournament-page__sort-pill">
                <span className="tournament-page__sort-value">{defaultSort.label}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tournament-page__list">
          <div className="tournament-page__shell">
            <div className="tournament-page__featured-grid">
              {tournaments
                .filter((tournament) => tournament.featured)
                .map((tournament) => (
                  <article key={tournament.id} className="tournament-page__card tournament-page__card--featured">
                    <div className="tournament-page__card-media">
                      <img className="tournament-page__card-image" src={tournament.imageUrl} alt={tournament.title} />
                    </div>

                    <div className="tournament-page__card-body">
                      <div className="tournament-page__badge tournament-page__badge--amber">{tournament.badge}</div>
                      <h2 className="tournament-page__card-title">
                        {tournament.title.split('\n').map((line, index) => (
                          <React.Fragment key={line}>
                            {line}
                            {index === 0 ? <br /> : null}
                          </React.Fragment>
                        ))}
                      </h2>
                      <p className="tournament-page__card-desc">{tournament.description}</p>

                      <div className="tournament-page__meta-2cols">
                        <div className="tournament-page__meta-item">
                          <div className="tournament-page__meta-label">PRIZE POOL</div>
                          <div className="tournament-page__meta-value">{tournament.prizePool}</div>
                        </div>
                        <div className="tournament-page__meta-item">
                          <div className="tournament-page__meta-label">RACE DATE</div>
                          <div className="tournament-page__meta-value">{tournament.dateValue}</div>
                        </div>
                      </div>

                      <div className="tournament-page__deadline">
                        <div className="tournament-page__deadline-text">{tournament.deadlineText}</div>
                      </div>

                      <div className="tournament-page__card-action">
                        <button type="button" className="tournament-page__primary-btn">
                          {tournament.actionText}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </div>

            <div className="tournament-page__cards-row">
              {tournaments
                .filter((tournament) => !tournament.featured)
                .map((tournament) => (
                  <article key={tournament.id} className="tournament-page__card tournament-page__card--sm">
                    <div className="tournament-page__card-media tournament-page__card-media--sm">
                      <img className="tournament-page__card-image" src={tournament.imageUrl} alt={tournament.title} />
                      <div
                        className={`tournament-page__small-badge ${
                          tournament.badgeTone === 'amber' ? 'tournament-page__small-badge--amber' : ''
                        }`}
                      >
                        {tournament.badge}
                      </div>
                    </div>

                    <div className="tournament-page__sm-body">
                      <h3 className="tournament-page__sm-title">{tournament.title}</h3>
                      <p className="tournament-page__sm-desc">{tournament.description}</p>

                      <div className="tournament-page__sm-divider">
                        <div className="tournament-page__sm-meta-label">PRIZE POOL</div>
                        <div className="tournament-page__sm-meta-value">{tournament.prizePool}</div>
                      </div>

                      <div className="tournament-page__sm-divider">
                        <div className="tournament-page__sm-meta-label">{tournament.meta1Label}</div>
                        <div className="tournament-page__sm-meta-value">{tournament.meta1Value}</div>
                      </div>

                      <div className="tournament-page__sm-action">
                        <button type="button" className="tournament-page__outline-btn">
                          {tournament.actionText}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

              <div className="tournament-page__table">
                <div className="tournament-page__table-head">
                  <h3 className="tournament-page__table-title">{secondaryEvents.title}</h3>
                  <button type="button" className="tournament-page__link-btn">
                    {secondaryEvents.actionText}
                  </button>
                </div>

                <div className="tournament-page__table-grid">
                  <div className="tournament-page__table-header-row">
                    <div className="tournament-page__th tournament-page__th--name">TOURNAMENT NAME</div>
                    <div className="tournament-page__th tournament-page__th--status">STATUS</div>
                    <div className="tournament-page__th tournament-page__th--deadline">REG. DEADLINE</div>
                    <div className="tournament-page__th tournament-page__th--prize">PRIZE POOL</div>
                    <div className="tournament-page__th tournament-page__th--action" />
                  </div>

                  {secondaryEvents.rows.map((row) => (
                    <div key={row.name} className="tournament-page__table-row tournament-page__table-row--border">
                      <div className="tournament-page__td tournament-page__td--name">
                        <div className="tournament-page__row-name">{row.name}</div>
                        <div className="tournament-page__row-class">{row.classLine}</div>
                      </div>

                      <div className="tournament-page__td tournament-page__td--status">
                        <div
                          className={`tournament-page__status-pill ${
                            row.statusTone === 'amber' ? 'tournament-page__status-pill--amber' : ''
                          }`}
                        >
                          {row.status}
                        </div>
                      </div>

                      <div className="tournament-page__td tournament-page__td--deadline">{row.deadline}</div>
                      <div className="tournament-page__td tournament-page__td--prize">{row.prizePool}</div>

                      <div className="tournament-page__td tournament-page__td--action">
                        <button
                          type="button"
                          className={`tournament-page__action-btn ${
                            row.statusTone === 'amber' ? 'tournament-page__action-btn--amber' : ''
                          }`}
                        >
                          {row.action}
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
