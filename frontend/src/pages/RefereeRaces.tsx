import React from 'react';
import { Link } from 'react-router-dom';
import { RefereeShell } from '../components/referee/index.ts';
import './RefereeRaces.css';

type RaceStatus = 'Live Now' | 'Upcoming' | 'Completed';

type AssignedRace = {
  date: string;
  time: string;
  series: string;
  race: string;
  address: string;
  distance: string;
  surface: string;
  participants: string;
  status: RaceStatus;
  action: string;
};

const races: AssignedRace[] = [
  {
    date: 'Oct 23, 2024',
    time: '14:30',
    series: 'Royal Gold Cup',
    race: 'Qualifier A: The Sovereign Dash',
    address: '124 Derby Ln, London',
    distance: '1,200m',
    surface: 'Sprint',
    participants: '12 Runners',
    status: 'Live Now',
    action: 'Manage',
  },
  {
    date: 'Oct 23, 2024',
    time: '17:45',
    series: 'Epsom Invitational',
    race: 'Derby Prep: Stakes II',
    address: '77 Paddock Way, Surrey',
    distance: '2,400m',
    surface: 'Turf',
    participants: '8 Runners',
    status: 'Upcoming',
    action: 'Manage',
  },
  {
    date: 'Oct 23, 2024',
    time: '11:00',
    series: 'Season Finals',
    race: 'Consolation Plate',
    address: 'Results Verified',
    distance: '1,000m',
    surface: 'Sprint',
    participants: '16 Runners',
    status: 'Completed',
    action: 'Manage',
  },
];

const racePath = (raceName: string) => `/Referee/Races/${raceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const CalendarIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
    <path d="M2 20C1.45 20 0.98 19.8 0.59 19.41C0.2 19.02 0 18.55 0 18V4C0 3.45 0.2 2.98 0.59 2.59C0.98 2.2 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.02 2.2 17.41 2.59C17.8 2.98 18 3.45 18 4V18C18 18.55 17.8 19.02 17.41 19.41C17.02 19.8 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="currentColor" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden="true">
    <path d="M9 11C9.55 11 10.02 10.8 10.41 10.41C10.8 10.02 11 9.55 11 9C11 8.45 10.8 7.98 10.41 7.59C10.02 7.2 9.55 7 9 7C8.45 7 7.98 7.2 7.59 7.59C7.2 7.98 7 8.45 7 9C7 9.55 7.2 10.02 7.59 10.41C7.98 10.8 8.45 11 9 11ZM9 22C6.58 19.93 4.44 17.64 2.58 15.13C0.86 12.79 0 10.75 0 9C0 6.25 0.88 4.06 2.64 2.43C4.41 0.81 6.53 0 9 0C11.47 0 13.59 0.81 15.36 2.43C17.12 4.06 18 6.25 18 9C18 10.75 17.14 12.79 15.42 15.13C13.56 17.64 11.42 19.93 9 22Z" fill="currentColor" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
    <path d="M7.1 15.4L0.7 9L2.1 7.6L7.1 12.6L17.9 1.8L19.3 3.2L7.1 15.4ZM7.1 9.75L3.55 6.2L4.95 4.8L7.1 6.95L13.45 0.6L14.85 2L7.1 9.75Z" fill="currentColor" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
    <path d="M8 38V8H16C16.17 5.83 17.08 4 18.75 2.5C20.42 1 22.5 0.25 25 0.25C27.5 0.25 29.58 1 31.25 2.5C32.92 4 33.83 5.83 34 8H42V38H8ZM12 34H38V12H32V16H18V12H12V34ZM22 12H28V8.25C28 7.42 27.71 6.71 27.12 6.12C26.54 5.54 25.83 5.25 25 5.25C24.17 5.25 23.46 5.54 22.88 6.12C22.29 6.71 22 7.42 22 8.25V12Z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
    <path d="M18.1 29.4L32.2 15.3L29.4 12.5L18.1 23.8L12.4 18.1L9.6 20.9L18.1 29.4ZM21 42C18.1 42 15.38 41.45 12.84 40.35C10.3 39.25 8.09 37.76 6.2 35.9C4.34 34.01 2.85 31.8 1.75 29.26C0.65 26.72 0.1 24 0.1 21C0.1 18 0.65 15.28 1.75 12.74C2.85 10.2 4.34 7.99 6.2 6.1C8.09 4.24 10.3 2.75 12.84 1.65C15.38 0.55 18.1 0 21 0C23.9 0 26.62 0.55 29.16 1.65C31.7 2.75 33.91 4.24 35.8 6.1C37.66 7.99 39.15 10.2 40.25 12.74C41.35 15.28 41.9 18 41.9 21C41.9 24 41.35 26.72 40.25 29.26C39.15 31.8 37.66 34.01 35.8 35.9C33.91 37.76 31.7 39.25 29.16 40.35C26.62 41.45 23.9 42 21 42Z" fill="currentColor" />
  </svg>
);

const TrayIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
    <path d="M7 38C5.9 38 4.96 37.61 4.17 36.83C3.39 36.04 3 35.1 3 34V25H11.7L15.7 31H26.3L30.3 25H39V34C39 35.1 38.61 36.04 37.83 36.83C37.04 37.61 36.1 38 35 38H7ZM18 22V3H24V22L31 15L35.2 19.2L21 33.4L6.8 19.2L11 15L18 22Z" fill="currentColor" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M11.8 15L5.8 9L11.8 3L13.2 4.4L8.6 9L13.2 13.6L11.8 15Z" fill="currentColor" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M6.2 15L4.8 13.6L9.4 9L4.8 4.4L6.2 3L12.2 9L6.2 15Z" fill="currentColor" />
  </svg>
);

const StatusBadge: React.FC<{ status: RaceStatus }> = ({ status }) => (
  <span className={`referee-races-status is-${status.toLowerCase().replace(/\s+/g, '-')}`}>
    {status === 'Live Now' && <i />}
    {status}
  </span>
);

const SummaryCard: React.FC<{ tone: 'green' | 'neutral' | 'warm'; label: string; value: string; icon: React.ReactNode }> = ({
  tone,
  label,
  value,
  icon,
}) => (
  <article className={`referee-races-summary__card is-${tone}`}>
    <span>{icon}</span>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  </article>
);

export const RefereeRaces: React.FC = () => {
  return (
    <RefereeShell>
      <section className="referee-races-page">
        <h1>My Assigned Races</h1>

        <nav className="referee-races-tabs" aria-label="Race filters">
          {['All', 'Upcoming', 'History'].map((tab, index) => (
            <button type="button" className={index === 0 ? 'is-active' : undefined} key={tab}>
              {tab}
            </button>
          ))}
        </nav>

        <section className="referee-races-card" aria-label="Assigned races table">
          <div className="referee-races-table" role="table">
            <div className="referee-races-row referee-races-row--head" role="row">
              <span>Date &amp; Time</span>
              <span>Race Details</span>
              <span>Address</span>
              <span>Distance</span>
              <span>Participants</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {races.map((race) => (
              <div className="referee-races-row" role="row" key={`${race.race}-${race.time}`}>
                <div className="referee-races-date">
                  <CalendarIcon />
                  <strong>
                    {race.date}
                    <span>{race.time}</span>
                  </strong>
                </div>
                <div className="referee-races-detail">
                  <span>{race.series}</span>
                  <strong>{race.race}</strong>
                </div>
                <div className={`referee-races-address ${race.status === 'Completed' ? 'is-verified' : ''}`}>
                  {race.status === 'Completed' ? <VerifiedIcon /> : <LocationIcon />}
                  <span>{race.address}</span>
                </div>
                <div className="referee-races-distance">
                  <strong>{race.distance}</strong>
                  <span>{race.surface}</span>
                </div>
                <span>{race.participants}</span>
                <StatusBadge status={race.status} />
                <Link className={race.status === 'Completed' ? 'is-disabled' : undefined} to={racePath(race.race)}>
                  {race.action}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <div className="referee-races-pagination">
          <span>Showing 1-10 of 24 races</span>
          <nav aria-label="Assigned races pagination">
            <button type="button" aria-label="Previous page">
              <ChevronLeftIcon />
            </button>
            <button type="button" className="is-active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <span>...</span>
            <button type="button" aria-label="Next page">
              <ChevronRightIcon />
            </button>
          </nav>
        </div>

        <section className="referee-races-summary" aria-label="Race assignment totals">
          <SummaryCard tone="green" label="Total Assigned" value="06" icon={<ClipboardIcon />} />
          <SummaryCard tone="neutral" label="Completed" value="02" icon={<CheckIcon />} />
          <SummaryCard tone="warm" label="Upcoming" value="04" icon={<TrayIcon />} />
        </section>
      </section>
    </RefereeShell>
  );
};

export default RefereeRaces;
