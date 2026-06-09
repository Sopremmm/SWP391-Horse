import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { getPageData } from '../data/pageData.ts';
import './HorseOwnerTournamentDetail.css';

type RuleBlock = {
  title: string;
  icon: 'shield' | 'gavel';
  items: string[];
};

const fallbackTournament = {
  title: 'The Platinum Jubilee Stakes',
  subtitle:
    'A heritage sprint across the hallowed turf, celebrating seventy years of excellence in thoroughbred breeding and competitive spirit.',
  classLabel: 'International Grade I Invitational',
  date: 'July 14, 2024',
  purse: '$2,500,000',
  location: 'Ascot, UK',
  distance: '2400m',
};

const rules: RuleBlock[] = [
  {
    title: 'Eligibility',
    icon: 'shield',
    items: [
      'Horses must be aged 3 years or older.',
      'Minimum Grade II certification required.',
      'Owner must hold a valid Heritage Club license.',
    ],
  },
  {
    title: 'Racing Rules',
    icon: 'gavel',
    items: [
      'Standard flat racing regulations apply.',
      'Mandatory post-race blood testing.',
      'Fixed weight-for-age penalties strictly enforced.',
    ],
  },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/\n/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function displayTitle(title: string) {
  return title.replace(/\n/g, ' ');
}

function Icon({ name }: { name: 'arrow' | 'check' | 'gavel' | 'shield' }) {
  const paths = {
    arrow: 'M10.1 7.5H0V5.8h10.1L5.5 1.2 6.7 0l6.6 6.7-6.6 6.6-1.2-1.2 4.6-4.6Z',
    check: 'M6.8 11.6 2.6 7.4 1.2 8.8l5.6 5.6L18.8 2.4 17.4 1 6.8 11.6Z',
    gavel:
      'M1 22v-2h12v2H1Zm5.7-4.9L1.1 11.5l2.1-2.1 5.7 5.6-2.2 2.1Zm6.3-6.4L7.4 5l2.1-2.1 5.7 5.6-2.2 2.2Zm4.6 10.2L4.6 7.9 6 6.5l13 13-1.4 1.4Z',
    shield:
      'M8 20c-2.3-.6-4.2-1.9-5.7-4C.8 13.9 0 11.6 0 9.1V3l8-3 8 3v6.1c0 2.5-.8 4.8-2.3 6.9-1.5 2.1-3.4 3.4-5.7 4Zm-1-6.5 5.7-5.7-1.4-1.4L7 10.7 4.9 8.6 3.5 10 7 13.5Z',
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default function HorseOwnerTournamentDetail() {
  const { name } = useParams<{ name?: string }>();
  const { tournamentPage, myHorses, hireJockey } = getPageData();
  const decodedName = decodeURIComponent(name ?? '');
  const selectedTournament =
    tournamentPage.tournaments.find((item) => normalize(item.id) === normalize(decodedName) || normalize(item.title) === normalize(decodedName)) ??
    tournamentPage.tournaments[0];

  const [selectedHorse, setSelectedHorse] = React.useState('');
  const [selectedJockey, setSelectedJockey] = React.useState('');
  const [horseModalOpen, setHorseModalOpen] = React.useState(false);
  const [jockeyModalOpen, setJockeyModalOpen] = React.useState(false);
  const [horseSearch, setHorseSearch] = React.useState('');
  const [jockeySearch, setJockeySearch] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);
  const title = selectedTournament ? displayTitle(selectedTournament.title) : fallbackTournament.title;
  const jockeys = hireJockey.jockeys.slice(0, 3);
  const hiredJockeys = hireJockey.jockeys.filter((jockey) => jockey.hired);
  const filteredHorses = myHorses.horses.filter((horse) => horse.name.toLowerCase().includes(horseSearch.trim().toLowerCase()));
  const filteredJockeys = hiredJockeys.filter((jockey) => jockey.name.toLowerCase().includes(jockeySearch.trim().toLowerCase()));

  const handleConfirm = () => {
    if (!selectedHorse || !selectedJockey) return;
    setConfirmed(true);
    window.setTimeout(() => setConfirmed(false), 2600);
  };

  const handleHorseSelect = (horseName: string) => {
    setSelectedHorse(horseName);
    setHorseModalOpen(false);
    setHorseSearch('');
  };

  const handleJockeySelect = (jockeyName: string) => {
    setSelectedJockey(jockeyName);
    setJockeyModalOpen(false);
    setJockeySearch('');
  };

  return (
    <div className="ho-tournament-detail">
      <Header />

      <main className="ho-tournament-detail__main">
        <section className="ho-tournament-detail__hero">
          <div className="ho-tournament-detail__hero-bg">
            <img src={selectedTournament?.imageUrl} alt="" />
            <div />
          </div>

          <div className="ho-tournament-detail__hero-inner">
            <div className="ho-tournament-detail__hero-copy">
              <span>{fallbackTournament.classLabel}</span>
              <h1>{title}</h1>
              <p>{selectedTournament?.description ?? fallbackTournament.subtitle}</p>
            </div>

            <dl className="ho-tournament-detail__hero-stats">
              <div>
                <dt>Date</dt>
                <dd>{selectedTournament?.dateValue ?? fallbackTournament.date}</dd>
              </div>
              <div>
                <dt>Purse</dt>
                <dd>{selectedTournament?.prizePool ?? fallbackTournament.purse}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{fallbackTournament.location}</dd>
              </div>
              <div>
                <dt>Distance</dt>
                <dd>{fallbackTournament.distance}</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="ho-tournament-detail__shell">
          <div className="ho-tournament-detail__content">
            <section className="ho-tournament-detail__section">
              <div className="ho-tournament-detail__section-head">
                <h2>Rules of Participation</h2>
                <span />
              </div>

              <div className="ho-tournament-detail__rules">
                {rules.map((rule) => (
                  <article key={rule.title} className="ho-tournament-detail__rule">
                    <div className="ho-tournament-detail__rule-icon">
                      <Icon name={rule.icon} />
                    </div>
                    <div>
                      <h3>{rule.title}</h3>
                      <ul>
                        {rule.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="ho-tournament-detail__section">
              <div className="ho-tournament-detail__section-head">
                <h2>Race Entry Form</h2>
                <span />
              </div>

              <div className="ho-tournament-detail__entry-block">
                <div className="ho-tournament-detail__entry-head">
                  <h3>1. Select Your Horse</h3>
                  <button type="button" onClick={() => setHorseModalOpen(true)}>View All Horses</button>
                </div>

                <div className="ho-tournament-detail__horse-grid">
                  {myHorses.horses.slice(0, 2).map((horse) => (
                    <button
                      key={horse.name}
                      type="button"
                      className={`ho-tournament-detail__horse ${selectedHorse === horse.name ? 'is-selected' : ''}`}
                      onClick={() => setSelectedHorse(horse.name)}
                    >
                      <img src={horse.imageSrc} alt={horse.name} />
                      <span>
                        <strong>{horse.name}</strong>
                        <small>{horse.meta.replace(/Thoroughbred - /, '').replace(/Arabian Cross - /, '')}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="ho-tournament-detail__entry-block">
                <div className="ho-tournament-detail__entry-head">
                  <h3>2. Select Your Jockey</h3>
                  <button type="button" onClick={() => setJockeyModalOpen(true)}>View All Jockeys</button>
                </div>

                <div className="ho-tournament-detail__jockey-list">
                  {jockeys.map((jockey) => (
                    <button
                      key={jockey.name}
                      type="button"
                      className={`ho-tournament-detail__jockey ${selectedJockey === jockey.name ? 'is-selected' : ''}`}
                      onClick={() => setSelectedJockey(jockey.name)}
                    >
                      <img src={jockey.imageSrc} alt={jockey.name} />
                      <span>
                        <strong>{jockey.name}</strong>
                        <small>
                          Experience: {jockey.experienceText.match(/\d+/)?.[0] ?? '8'} Years - Win Rate:{' '}
                          {jockey.profile?.winRate ?? '21%'}
                        </small>
                      </span>
                      <em>
                        <small>Rating</small>
                        4.7/5.0
                      </em>
                      <i aria-hidden="true">
                        <Icon name="check" />
                      </i>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="ho-tournament-detail__summary" aria-label="Registration summary">
            <h3>Registration Summary</h3>
            <div className="ho-tournament-detail__summary-lines">
              <div>
                <span>Horse selected</span>
                <strong>{selectedHorse || 'None selected'}</strong>
              </div>
              <div>
                <span>Jockey selected</span>
                <strong>{selectedJockey || 'None selected'}</strong>
              </div>
            </div>

            <div className="ho-tournament-detail__summary-action">
              <button type="button" disabled={!selectedHorse || !selectedJockey} onClick={handleConfirm}>
                Confirm Registration
                <Icon name="arrow" />
              </button>
              {confirmed ? <div className="ho-tournament-detail__saved">Registration prepared successfully.</div> : null}
              <p>Invitation will be sent to the selected jockey after confirmation.</p>
              <small>
                By clicking confirm, you agree to the <a href="#rules">Official Rules of Racing</a> and the{' '}
                <a href="#agreement">Participation Agreement</a>.
              </small>
            </div>
          </aside>
        </div>
      </main>

      {horseModalOpen ? (
        <div className="ho-tournament-detail__modal-overlay" role="presentation">
          <section className="ho-tournament-detail__modal" role="dialog" aria-modal="true" aria-labelledby="horse-modal-title">
            <div className="ho-tournament-detail__modal-head">
              <div>
                <h2 id="horse-modal-title">Select Horse</h2>
                <p>Choose one horse to register for this tournament.</p>
              </div>
              <button type="button" aria-label="Close horse selector" onClick={() => setHorseModalOpen(false)}>x</button>
            </div>

            <label className="ho-tournament-detail__modal-search">
              <span>Search by name</span>
              <input value={horseSearch} onChange={(event) => setHorseSearch(event.target.value)} placeholder="Enter horse name..." autoFocus />
            </label>

            <div className="ho-tournament-detail__modal-grid">
              {filteredHorses.length ? (
                filteredHorses.map((horse) => (
                  <button
                    key={horse.name}
                    type="button"
                    className={`ho-tournament-detail__modal-horse ${selectedHorse === horse.name ? 'is-selected' : ''}`}
                    onClick={() => handleHorseSelect(horse.name)}
                  >
                    <img src={horse.imageSrc} alt={horse.name} />
                    <span>
                      <strong>{horse.name}</strong>
                      <small>{horse.meta}</small>
                    </span>
                  </button>
                ))
              ) : (
                <div className="ho-tournament-detail__empty">No horses found.</div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {jockeyModalOpen ? (
        <div className="ho-tournament-detail__modal-overlay" role="presentation">
          <section className="ho-tournament-detail__modal" role="dialog" aria-modal="true" aria-labelledby="jockey-modal-title">
            <div className="ho-tournament-detail__modal-head">
              <div>
                <h2 id="jockey-modal-title">Select Hired Jockey</h2>
                <p>Only jockeys previously hired by this owner are listed here.</p>
              </div>
              <button type="button" aria-label="Close jockey selector" onClick={() => setJockeyModalOpen(false)}>x</button>
            </div>

            <label className="ho-tournament-detail__modal-search">
              <span>Search by name</span>
              <input value={jockeySearch} onChange={(event) => setJockeySearch(event.target.value)} placeholder="Enter jockey name..." autoFocus />
            </label>

            <div className="ho-tournament-detail__modal-list">
              {filteredJockeys.length ? (
                filteredJockeys.map((jockey) => (
                  <button
                    key={jockey.name}
                    type="button"
                    className={`ho-tournament-detail__modal-jockey ${selectedJockey === jockey.name ? 'is-selected' : ''}`}
                    onClick={() => handleJockeySelect(jockey.name)}
                  >
                    <img src={jockey.imageSrc} alt={jockey.name} />
                    <span>
                      <strong>{jockey.name}</strong>
                      <small>{jockey.level} - {jockey.experienceText} - {jockey.priceText}</small>
                    </span>
                    <em>Hired</em>
                  </button>
                ))
              ) : (
                <div className="ho-tournament-detail__empty">No hired jockeys found.</div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
