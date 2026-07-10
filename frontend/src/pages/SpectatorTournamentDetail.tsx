import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../components/spectator/index.ts';
import HomeBanner from '../assets/images/HomeBanner.png';
import './SpectatorTournamentDetail.css';

type RaceStatus = 'completed' | 'live' | 'upcoming';

type BracketRace = {
  date: string;
  title: string;
  status: RaceStatus;
  chip: string;
  entry: string;
  entryTone?: 'winner' | 'live';
};

type ScheduleRace = {
  time: string;
  name: string;
  distance: string;
  status: RaceStatus;
};

const qualifyingRaces: BracketRace[] = [
  {
    date: 'Aug 20 - 14:00',
    title: 'Qualifying A',
    status: 'completed',
    chip: 'W',
    entry: 'Midnight Thunder',
    entryTone: 'winner',
  },
  {
    date: 'Aug 21 - 14:00',
    title: 'Qualifying B',
    status: 'live',
    chip: '2',
    entry: 'Star Chaser',
    entryTone: 'live',
  },
  {
    date: 'Aug 21 - 16:00',
    title: 'Qualifying C',
    status: 'upcoming',
    chip: '3',
    entry: 'Aug 21 - 16:00 - 1600M',
  },
  {
    date: 'Aug 21 - 18:00',
    title: 'Qualifying D',
    status: 'upcoming',
    chip: '4',
    entry: 'Aug 21 - 18:00 - 1600M',
  },
];

const semiFinalRaces: BracketRace[] = [
  {
    date: 'Aug 22 - 14:00',
    title: 'Semi-Final A',
    status: 'upcoming',
    chip: 'S1',
    entry: 'Aug 22 - 14:00 - 2000M',
  },
  {
    date: 'Aug 22 - 16:00',
    title: 'Semi-Final B',
    status: 'upcoming',
    chip: 'S2',
    entry: 'Aug 22 - 16:00 - 2000M',
  },
];

const schedule: ScheduleRace[] = [
  { time: 'Aug 20 - 14:00', name: 'Qualifying A', distance: '1,600M', status: 'completed' },
  { time: 'Aug 21 - 14:00', name: 'Qualifying B', distance: '1,600M', status: 'live' },
  { time: 'Aug 21 - 16:00', name: 'Qualifying C', distance: '1,600M', status: 'upcoming' },
  { time: 'Aug 21 - 18:00', name: 'Qualifying D', distance: '1,600M', status: 'upcoming' },
  { time: 'Aug 22 - 14:00', name: 'Semi-Final A', distance: '2,000M', status: 'upcoming' },
  { time: 'Aug 22 - 16:00', name: 'Semi-Final B', distance: '2,000M', status: 'upcoming' },
  { time: 'Aug 24 - 18:00', name: 'Grand Final', distance: '2,400M', status: 'upcoming' },
];

const raceSlug = (raceName: string) => raceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const formatTournamentName = (rawName?: string) => {
  if (!rawName) return 'The Royal Gold Cup';

  const decoded = decodeURIComponent(rawName).replace(/[-_]+/g, ' ').trim();
  if (!decoded) return 'The Royal Gold Cup';

  return decoded
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const statusLabel: Record<RaceStatus, string> = {
  completed: 'Completed',
  live: 'Live Now',
  upcoming: 'Upcoming',
};

const ArrowIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
    <path d="M6.09 4.5H0V3.5H6.09L3.29 0.7L4 0L8 4L4 8L3.29 7.3L6.09 4.5Z" fill="currentColor" />
  </svg>
);

const LocationIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
    <path
      d="M4.67 5.83C4.99 5.83 5.26 5.72 5.49 5.49C5.72 5.26 5.83 4.99 5.83 4.67C5.83 4.35 5.72 4.07 5.49 3.84C5.26 3.61 4.99 3.5 4.67 3.5C4.35 3.5 4.07 3.61 3.84 3.84C3.61 4.07 3.5 4.35 3.5 4.67C3.5 4.99 3.61 5.26 3.84 5.49C4.07 5.72 4.35 5.83 4.67 5.83ZM4.67 10.12C5.85 9.03 6.73 8.04 7.31 7.15C7.88 6.26 8.17 5.47 8.17 4.78C8.17 3.72 7.83 2.86 7.15 2.18C6.48 1.5 5.65 1.17 4.67 1.17C3.68 1.17 2.86 1.5 2.18 2.18C1.5 2.86 1.17 3.72 1.17 4.78C1.17 5.47 1.45 6.26 2.03 7.15C2.6 8.04 3.48 9.03 4.67 10.12ZM4.67 11.67C3.1 10.33 1.93 9.1 1.16 7.96C0.39 6.81 0 5.76 0 4.78C0 3.33 0.47 2.16 1.41 1.3C2.35 0.43 3.43 0 4.67 0C5.9 0 6.99 0.43 7.93 1.3C8.86 2.16 9.33 3.33 9.33 4.78C9.33 5.76 8.95 6.81 8.17 7.96C7.4 9.1 6.23 10.33 4.67 11.67Z"
      fill="currentColor"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
    <path
      d="M1.17 11.67C0.85 11.67 0.57 11.55 0.34 11.32C0.11 11.1 0 10.82 0 10.5V2.33C0 2.01 0.11 1.74 0.34 1.51C0.57 1.28 0.85 1.17 1.17 1.17H1.75V0H2.92V1.17H7.58V0H8.75V1.17H9.33C9.65 1.17 9.93 1.28 10.16 1.51C10.39 1.74 10.5 2.01 10.5 2.33V10.5C10.5 10.82 10.39 11.1 10.16 11.32C9.93 11.55 9.65 11.67 9.33 11.67H1.17ZM1.17 10.5H9.33V4.67H1.17V10.5ZM1.17 3.5H9.33V2.33H1.17V3.5Z"
      fill="currentColor"
    />
  </svg>
);

const StatusBadge: React.FC<{ status: RaceStatus }> = ({ status }) => (
  <span className={`spectator-detail-status is-${status}`}>{statusLabel[status]}</span>
);

const RaceNode: React.FC<{ race: BracketRace; tournamentName: string; className?: string }> = ({ race, tournamentName, className }) => (
  <article className={`spectator-bracket-node ${race.status === 'live' ? 'is-live' : ''} ${className || ''}`}>
    <div className="spectator-bracket-node__top">
      <span>{race.date}</span>
      <StatusBadge status={race.status} />
    </div>
    <h3>{race.title}</h3>
    <div className={`spectator-bracket-node__entry ${race.entryTone ? `is-${race.entryTone}` : ''}`}>
      <span>{race.chip}</span>
      <strong>{race.entry}</strong>
    </div>
    <Link to={`/Spectator/Tournaments/${encodeURIComponent(tournamentName)}/${raceSlug(race.title)}`}>
      View Race <ArrowIcon />
    </Link>
  </article>
);

export const SpectatorTournamentDetail: React.FC = () => {
  const { name } = useParams();
  const tournamentName = formatTournamentName(name);

  return (
    <div className="spectator-detail-page">
      <SpectatorHeader />

      <main className="spectator-detail-main">
        <section className="spectator-detail-hero">
          <img src={HomeBanner} alt={`${tournamentName} hero`} />
          <div className="spectator-detail-hero__overlay">
            <p>Heritage Racing Presents</p>
            <h1>{tournamentName}</h1>
            <div className="spectator-detail-hero__meta">
              <span>
                <LocationIcon /> Grand Valley Circuit, UK
              </span>
              <span>
                <CalendarIcon /> Aug 20 - Aug 24, 2024
              </span>
            </div>
          </div>
        </section>

        <section className="spectator-detail-bracket" aria-labelledby="tournament-bracket-heading">
          <div className="spectator-detail-section-title">
            <h2 id="tournament-bracket-heading">Tournament Bracket</h2>
          </div>

          <div className="spectator-bracket-shell">
            <div className="spectator-bracket-grid">
              <section className="spectator-bracket-column spectator-bracket-column--qualifying" aria-label="Qualifying">
                <h3>Qualifying</h3>
                <div className="spectator-bracket-column__stack">
                  {qualifyingRaces.map((race) => (
                    <RaceNode key={race.title} race={race} tournamentName={tournamentName} />
                  ))}
                </div>
              </section>

              <section className="spectator-bracket-column spectator-bracket-column--semi" aria-label="Semi-finals">
                <h3>Semi-Finals</h3>
                <div className="spectator-bracket-column__stack">
                  {semiFinalRaces.map((race) => (
                    <RaceNode key={race.title} race={race} tournamentName={tournamentName} />
                  ))}
                </div>
              </section>

              <section className="spectator-bracket-column spectator-bracket-column--final" aria-label="Tournament finals">
                <h3>Tournament Finals</h3>
                <article className="spectator-final-card">
                  <div className="spectator-final-card__title">
                    <div>
                      <h4>Grand Finale</h4>
                      <p>Aug 24 - 18:00 EST</p>
                    </div>
                    <span aria-hidden="true">
                      <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
                        <path
                          d="M9 0C11.49 0 13.5 2.01 13.5 4.5V8.84L17 10.6L13.5 12.36V24L9 20.62L4.5 24V12.36L1 10.6L4.5 8.84V4.5C4.5 2.01 6.51 0 9 0ZM9 2.25C7.76 2.25 6.75 3.26 6.75 4.5C6.75 5.74 7.76 6.75 9 6.75C10.24 6.75 11.25 5.74 11.25 4.5C11.25 3.26 10.24 2.25 9 2.25Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="spectator-final-card__facts">
                    <div>
                      <span>Venue</span>
                      <strong>Royal Track</strong>
                    </div>
                    <div>
                      <span>Distance</span>
                      <strong>2400m</strong>
                    </div>
                  </div>
                  <Link to={`/Spectator/Tournaments/${encodeURIComponent(tournamentName)}/grand-final`}>
                    View Race
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M4 3H11V10H9.8V5.05L3.85 11L3 10.15L8.95 4.2H4V3Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                </article>
              </section>
            </div>
          </div>
        </section>

        <section className="spectator-race-schedule" id="race-schedule" aria-labelledby="race-schedule-heading">
          <h2 id="race-schedule-heading">Race Schedule</h2>
          <div className="spectator-race-schedule__table" role="table" aria-label="Race schedule">
            <div className="spectator-race-schedule__row spectator-race-schedule__row--head" role="row">
              <span>Date &amp; Time</span>
              <span>Race Name</span>
              <span>Distance</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {schedule.map((race) => (
              <div className="spectator-race-schedule__row" role="row" key={race.name}>
                <strong>{race.time}</strong>
                <strong>{race.name}</strong>
                <strong>{race.distance}</strong>
                <StatusBadge status={race.status} />
                <Link to={`/Spectator/Tournaments/${encodeURIComponent(tournamentName)}/${raceSlug(race.name)}`}>View Race</Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SpectatorFooter />
    </div>
  );
};

export default SpectatorTournamentDetail;
