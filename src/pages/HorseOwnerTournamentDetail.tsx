import React from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import ProfileDropdown from '../components/common/ProfileDropdown.tsx';
import { getPageData } from '../data/pageData.ts';
import './HorseOwnerTournamentDetail.css';

type RuleIcon = 'shield' | 'gavel' | 'trophy';

const tournamentFallback = {
  title: 'The Platinum Jubilee Stakes',
  description:
    'A heritage sprint across the hallowed turf, celebrating seventy years of excellence in thoroughbred breeding and competitive spirit.',
  classLabel: 'International Grade I Invitational',
  date: 'July 14, 2024',
  purse: '$2,500,000',
  location: 'Ascot, UK',
  distance: '2400m',
  entries: '12/20 Horses',
};

const ruleCards: Array<{ title: string; icon: RuleIcon; items: string[] }> = [
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
  {
    title: 'Prize Breakdown',
    icon: 'trophy',
    items: ['1st Place: $1,500,000', '2nd Place: $750,000', '3rd Place: $250,000'],
  },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/\n/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanTitle(value: string) {
  return value.replace(/\n/g, ' ');
}

function horseMeta(value: string) {
  const parts = value.split(' - ').map((part) => part.trim());
  return parts.length >= 3 ? `${parts[1]} ${parts[2]}` : value;
}

function DetailIcon({ name }: { name: RuleIcon | 'arrow' | 'external' | 'bell' | 'close' }) {
  const paths: Record<typeof name, string> = {
    shield:
      'M8 20c-2.3-.6-4.2-1.9-5.7-4C.8 13.9 0 11.6 0 9.1V3l8-3 8 3v6.1c0 2.5-.8 4.8-2.3 6.9-1.5 2.1-3.4 3.4-5.7 4Zm-1-6.5 5.7-5.7-1.4-1.4L7 10.7 4.9 8.6 3.5 10 7 13.5Z',
    gavel:
      'M1 22v-2h12v2H1Zm5.7-4.9L1.1 11.5l2.1-2.1 5.7 5.6-2.2 2.1Zm6.3-6.4L7.4 5l2.1-2.1 5.7 5.6-2.2 2.2Zm4.6 10.2L4.6 7.9 6 6.5l13 13-1.4 1.4Z',
    trophy:
      'M4 18v-2h4v-3.1a6.12 6.12 0 0 1-3.6-2.95 5.1 5.1 0 0 1-3.14-1.64A4.85 4.85 0 0 1 0 5V4c0-.55.2-1.02.59-1.41C.98 2.2 1.45 2 2 2h2V0h10v2h2c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v1c0 1.27-.42 2.37-1.26 3.31a5.1 5.1 0 0 1-3.14 1.64A6.12 6.12 0 0 1 10 12.9V16h4v2H4Z',
    arrow: 'M10.1 7.5H0V5.8h10.1L5.5 1.2 6.7 0l6.6 6.7-6.6 6.6-1.2-1.2 4.6-4.6Z',
    external:
      'M1.3 12c-.4 0-.7-.1-.9-.4-.3-.3-.4-.6-.4-.9V1.3C0 .9.1.6.4.4.6.1.9 0 1.3 0H6v1.3H1.3v9.4h9.4V6H12v4.7c0 .4-.1.7-.4.9-.3.3-.6.4-.9.4H1.3Zm3.2-3.5-.9-.9 6.1-6.3H7.3V0H12v4.7h-1.3V2.3L4.5 8.5Z',
    bell:
      'M0 17v-2h2V8c0-1.38.42-2.61 1.25-3.69A6.34 6.34 0 0 1 6.5 2.2v-.7c0-.42.15-.77.44-1.06C7.23.15 7.58 0 8 0s.77.15 1.06.44c.29.29.44.64.44 1.06v.7a6.34 6.34 0 0 1 3.25 2.11A5.86 5.86 0 0 1 14 8v7h2v2H0Zm8 3c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 6 18h4c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59Z',
    close: 'M5.4 18.6 4 17.2l5.2-5.2L4 6.8l1.4-1.4 5.2 5.2 5.2-5.2 1.4 1.4-5.2 5.2 5.2 5.2-1.4 1.4-5.2-5.2-5.2 5.2Z',
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export default function HorseOwnerTournamentDetail() {
  const { name } = useParams<{ name?: string }>();
  const { tournamentPage, myHorses } = getPageData();
  const decodedName = decodeURIComponent(name ?? '');
  const tournament = tournamentPage.tournaments.find(
    (item) => normalize(item.id) === normalize(decodedName) || normalize(item.title) === normalize(decodedName),
  );
  const isPlatinum = !tournament || tournament.id === 'platinum-jubilee';
  const title = isPlatinum ? tournamentFallback.title : cleanTitle(tournament.title);
  const description = isPlatinum ? tournamentFallback.description : tournament.description;
  const [selectedHorse, setSelectedHorse] = React.useState('');
  const [horseModalOpen, setHorseModalOpen] = React.useState(false);
  const [horseSearch, setHorseSearch] = React.useState('');
  const [notice, setNotice] = React.useState('');

  const filteredHorses = myHorses.horses.filter((horse) =>
    horse.name.toLowerCase().includes(horseSearch.trim().toLowerCase()),
  );

  React.useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const selectHorse = (horseName: string) => {
    setSelectedHorse(horseName);
    setHorseModalOpen(false);
    setHorseSearch('');
  };

  const confirmRegistration = () => {
    if (!selectedHorse) {
      setNotice('Please select a horse before confirming registration.');
      return;
    }
    setNotice(`${selectedHorse} has been submitted for administrative review.`);
  };

  return (
    <div className="ho-tournament-detail">
      <header className="ho-tournament-detail__header">
        <div className="ho-tournament-detail__header-inner">
          <Link className="ho-tournament-detail__brand" to="/HorseOwnerHome">Heritage Racing</Link>
          <nav aria-label="Horse owner navigation">
            <NavLink className="is-active" to="/HorseOwner/Tournaments">Tournaments</NavLink>
            <NavLink to="/HorseOwner/MyHorses">My Stable</NavLink>
            <NavLink to="/HorseOwner/MyJockeyinvitations">Jockeys</NavLink>
            <NavLink to="/HorseOwner/MyTournament">History</NavLink>
          </nav>
          <div className="ho-tournament-detail__header-actions">
            <Link to="/HorseOwner/Notifications" aria-label="Notifications"><DetailIcon name="bell" /></Link>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <main>
        <section className="ho-tournament-detail__hero">
          <div className="ho-tournament-detail__hero-inner">
            <div className="ho-tournament-detail__hero-copy">
              <span>{tournamentFallback.classLabel}</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <dl className="ho-tournament-detail__hero-stats">
              <div><dt>Date</dt><dd>{isPlatinum ? tournamentFallback.date : tournament.dateValue ?? tournamentFallback.date}</dd></div>
              <div><dt>Purse</dt><dd>{isPlatinum ? tournamentFallback.purse : tournament.prizePool}</dd></div>
              <div><dt>Location</dt><dd>{tournamentFallback.location}</dd></div>
              <div><dt>Distance</dt><dd>{tournamentFallback.distance}</dd></div>
              <div><dt>Entries</dt><dd>{tournamentFallback.entries}</dd></div>
            </dl>
          </div>
        </section>

        <div className="ho-tournament-detail__body">
          <section id="rules" className="ho-tournament-detail__section">
            <div className="ho-tournament-detail__section-title"><h2>Rules of Participation</h2><span /></div>
            <div className="ho-tournament-detail__rules">
              {ruleCards.map((rule) => (
                <article key={rule.title}>
                  <div className="ho-tournament-detail__rule-icon"><DetailIcon name={rule.icon} /></div>
                  <div>
                    <h3>{rule.title}</h3>
                    <ul>
                      {rule.items.map((item, index) => (
                        <li className={rule.icon === 'trophy' && index === 0 ? 'is-gold' : ''} key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="ho-tournament-detail__section ho-tournament-detail__entry">
            <div className="ho-tournament-detail__section-title"><h2>Race Entry Form</h2><span /></div>
            <div className="ho-tournament-detail__entry-layout">
              <div className="ho-tournament-detail__horse-picker">
                <div className="ho-tournament-detail__horse-picker-head">
                  <h3>Select Your Horse</h3>
                  <button type="button" onClick={() => setHorseModalOpen(true)}>View All Horses <DetailIcon name="external" /></button>
                </div>
                <div className="ho-tournament-detail__horse-grid">
                  {myHorses.horses.slice(0, 2).map((horse) => (
                    <button
                      className={`ho-tournament-detail__horse-card ${selectedHorse === horse.name ? 'is-selected' : ''}`}
                      key={horse.name}
                      type="button"
                      onClick={() => setSelectedHorse(horse.name)}
                    >
                      <img src={horse.imageSrc} alt={horse.name} />
                      <span><strong>{horse.name}</strong><small>{horseMeta(horse.meta)}</small></span>
                    </button>
                  ))}
                </div>
              </div>

              <aside className="ho-tournament-detail__summary" aria-label="Registration summary">
                <h3>Registration Summary</h3>
                <div className="ho-tournament-detail__selected-row">
                  <span>Horse selected</span><strong>{selectedHorse || 'None selected'}</strong>
                </div>
                <div className="ho-tournament-detail__summary-action">
                  <button type="button" onClick={confirmRegistration}>Confirm Registration <DetailIcon name="arrow" /></button>
                  <p>Your registration will be submitted for administrative review.</p>
                  <small>By clicking confirm, you agree to the <a href="#rules">Official Rules</a>.</small>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <footer className="ho-tournament-detail__footer">
        <div className="ho-tournament-detail__footer-inner">
          <div><h2>Heritage Racing</h2><p>Elevating the spirit of equestrian competition<br />since 1954.</p></div>
          <div>
            <nav aria-label="Footer navigation">
              <a href="#rules">Rules of Racing</a><a href="#privacy">Privacy Policy</a><a href="#terms">Terms of Service</a><a href="#support">Contact Support</a>
            </nav>
            <p>© 2024 Heritage Racing Club. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {horseModalOpen ? (
        <div className="ho-tournament-detail__modal-overlay" role="presentation" onMouseDown={() => setHorseModalOpen(false)}>
          <section className="ho-tournament-detail__modal" role="dialog" aria-modal="true" aria-labelledby="horse-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="ho-tournament-detail__modal-head">
              <div><h2 id="horse-modal-title">Select Your Horse</h2><p>Choose an eligible thoroughbred for this race.</p></div>
              <button type="button" aria-label="Close horse selector" onClick={() => setHorseModalOpen(false)}><DetailIcon name="close" /></button>
            </div>
            <input value={horseSearch} onChange={(event) => setHorseSearch(event.target.value)} placeholder="Search horses..." autoFocus />
            <div className="ho-tournament-detail__modal-grid">
              {filteredHorses.map((horse) => (
                <button key={horse.name} type="button" className={selectedHorse === horse.name ? 'is-selected' : ''} onClick={() => selectHorse(horse.name)}>
                  <img src={horse.imageSrc} alt={horse.name} />
                  <span><strong>{horse.name}</strong><small>{horseMeta(horse.meta)}</small></span>
                </button>
              ))}
              {!filteredHorses.length ? <p className="ho-tournament-detail__empty">No horses found.</p> : null}
            </div>
          </section>
        </div>
      ) : null}

      {notice ? <div className="ho-tournament-detail__notice" role="status">{notice}</div> : null}
    </div>
  );
}
