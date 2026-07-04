import React from 'react';
import { Link } from 'react-router-dom';
import { RefereeShell } from '../components/referee/index.ts';
import raceImage from '../assets/images/horseracing1.jpg';
import './RefereeHome.css';

type ScheduleStatus = 'Completed' | 'In Progress' | 'Upcoming';

const schedule: Array<{
  time: string;
  race: string;
  details: string;
  address: string;
  status: ScheduleStatus;
  action: string;
}> = [
  {
    time: 'Oct 22',
    race: 'The Heritage Plate',
    details: 'Group 2 - 1,600m',
    address: '124 Derby Ln, London',
    status: 'Completed',
    action: 'Review',
  },
  {
    time: 'Oct 23',
    race: 'The Northern Sprints',
    details: 'Class 1 - 1,200m',
    address: '456 Racing Way, Melbourne',
    status: 'In Progress',
    action: 'Manage',
  },
  {
    time: 'Oct 24',
    race: 'Qualifier A',
    details: 'Class 4 - 1,000m',
    address: '88 Oakwood Dr, Surrey',
    status: 'Upcoming',
    action: 'Briefing',
  },
];

const TimerIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
    <path d="M7 2V0H13V2H7ZM9 13H11V7H9V13ZM10 22C8.62 22 7.33 21.74 6.13 21.21C4.92 20.69 3.88 19.98 3 19C2.02 18.12 1.31 17.08 0.79 15.87C0.26 14.67 0 13.38 0 12C0 10.62 0.26 9.33 0.79 8.13C1.31 6.92 2.02 5.88 3 5C3.88 4.02 4.92 3.31 6.13 2.79C7.33 2.26 8.62 2 10 2C11.15 2 12.25 2.19 13.31 2.58C14.36 2.96 15.34 3.5 16.25 4.2L17.8 2.65L19.2 4.05L17.65 5.6C18.35 6.51 18.89 7.49 19.27 8.54C19.66 9.6 19.85 10.75 19.85 12C19.85 13.38 19.59 14.67 19.06 15.87C18.54 17.08 17.83 18.12 16.85 19C15.97 19.98 14.93 20.69 13.72 21.21C12.52 21.74 11.28 22 10 22Z" fill="currentColor" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
    <path d="M2 22C1.45 22 0.98 21.8 0.59 21.41C0.2 21.02 0 20.55 0 20V4C0 3.45 0.2 2.98 0.59 2.59C0.98 2.2 1.45 2 2 2H3V0H5V2H15V0H17V2H18C18.55 2 19.02 2.2 19.41 2.59C19.8 2.98 20 3.45 20 4V20C20 20.55 19.8 21.02 19.41 21.41C19.02 21.8 18.55 22 18 22H2ZM2 20H18V9H2V20ZM2 7H18V4H2V7Z" fill="currentColor" />
  </svg>
);

const RulerIcon = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
    <path d="M2 16C1.45 16 0.98 15.8 0.59 15.41C0.2 15.02 0 14.55 0 14V2C0 1.45 0.2 0.98 0.59 0.59C0.98 0.2 1.45 0 2 0H20C20.55 0 21.02 0.2 21.41 0.59C21.8 0.98 22 1.45 22 2V14C22 14.55 21.8 15.02 21.41 15.41C21.02 15.8 20.55 16 20 16H2ZM2 14H20V2H17V7H15V2H13V7H11V2H9V7H7V2H5V7H3V2H2V14Z" fill="currentColor" />
  </svg>
);

const UsersIcon = () => (
  <svg width="26" height="18" viewBox="0 0 29 18" fill="none" aria-hidden="true">
    <path d="M0 18V15.9C0 15.03 0.47 14.33 1.41 13.8C2.35 13.27 3.55 13 5 13C5.25 13 5.5 13.01 5.75 13.03C6 13.04 6.23 13.07 6.45 13.12C6.17 13.53 5.96 13.96 5.83 14.42C5.69 14.87 5.63 15.34 5.63 15.84V18H0ZM7 18V15.85C7 15.18 7.18 14.57 7.54 14.03C7.9 13.49 8.42 13.02 9.1 12.62C9.78 12.22 10.58 11.92 11.51 11.72C12.44 11.52 13.44 11.42 14.5 11.42C15.58 11.42 16.59 11.52 17.52 11.72C18.45 11.92 19.25 12.22 19.92 12.62C20.59 13.02 21.1 13.49 21.46 14.03C21.82 14.57 22 15.18 22 15.85V18H7ZM23.38 18V15.84C23.38 15.34 23.31 14.87 23.18 14.42C23.04 13.96 22.83 13.53 22.55 13.12C22.77 13.07 23 13.04 23.25 13.03C23.5 13.01 23.75 13 24 13C25.45 13 26.65 13.27 27.59 13.8C28.53 14.33 29 15.03 29 15.9V18H23.38ZM14.5 9.5C13.47 9.5 12.59 9.13 11.86 8.39C11.12 7.66 10.75 6.78 10.75 5.75C10.75 4.7 11.12 3.81 11.86 3.08C12.59 2.36 13.47 2 14.5 2C15.55 2 16.44 2.36 17.17 3.08C17.89 3.81 18.25 4.7 18.25 5.75C18.25 6.78 17.89 7.66 17.17 8.39C16.44 9.13 15.55 9.5 14.5 9.5Z" fill="currentColor" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
    <path d="M2 22C1.45 22 0.98 21.8 0.59 21.41C0.2 21.02 0 20.55 0 20V7C0 6.45 0.2 5.98 0.59 5.59C0.98 5.2 1.45 5 2 5H6V2C6 1.45 6.2 0.98 6.59 0.59C6.98 0.2 7.45 0 8 0H12C12.55 0 13.02 0.2 13.41 0.59C13.8 0.98 14 1.45 14 2V5H18C18.55 5 19.02 5.2 19.41 5.59C19.8 5.98 20 6.45 20 7V20C20 20.55 19.8 21.02 19.41 21.41C19.02 21.8 18.55 22 18 22H2ZM8 5H12V2H8V5ZM8 16V14H4V12H8V10H10V12H16V14H10V16H8Z" fill="currentColor" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M14.2 15.6L10 11.4V5H12V10.6L15.6 14.2L14.2 15.6ZM11 22C9.48 22 8.05 21.71 6.71 21.13C5.38 20.56 4.22 19.78 3.23 18.77C2.22 17.78 1.44 16.62 0.87 15.29C0.29 13.95 0 12.52 0 11C0 9.48 0.29 8.05 0.87 6.71C1.44 5.38 2.22 4.22 3.23 3.23C4.22 2.22 5.38 1.44 6.71 0.87C8.05 0.29 9.48 0 11 0C12.52 0 13.95 0.29 15.29 0.87C16.62 1.44 17.78 2.22 18.77 3.23C19.78 4.22 20.56 5.38 21.13 6.71C21.71 8.05 22 9.48 22 11C22 12.52 21.71 13.95 21.13 15.29C20.56 16.62 19.78 17.78 18.77 18.77C17.78 19.78 16.62 20.56 15.29 21.13C13.95 21.71 12.52 22 11 22Z" fill="currentColor" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M12.18 9H0V7H12.18L6.58 1.4L8 0L16 8L8 16L6.58 14.6L12.18 9Z" fill="currentColor" />
  </svg>
);

const WindIcon = () => (
  <svg width="130" height="130" viewBox="0 0 130 130" fill="none" aria-hidden="true">
    <path d="M20 82H89C99.5 82 108 73.5 108 63C108 52.5 99.5 44 89 44C80.7 44 73.7 49.3 71.1 56.7" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
    <path d="M20 104H73C81.8 104 89 96.8 89 88C89 79.2 81.8 72 73 72" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
    <path d="M20 60H48C55.7 60 62 53.7 62 46C62 38.3 55.7 32 48 32" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
  </svg>
);

const StatusBadge: React.FC<{ status: ScheduleStatus }> = ({ status }) => (
  <span className={`referee-schedule__status is-${status.toLowerCase().replace(/\s+/g, '-')}`}>
    {status === 'In Progress' && <i />}
    {status}
  </span>
);

export const RefereeHome: React.FC = () => {
  return (
    <RefereeShell>
      <section className="referee-home-heading">
        <div>
          <h1>Referee Dashboard</h1>
          <p>Wednesday, October 23rd - Heritage National Circuit</p>
        </div>
        <div className="referee-home-stats" aria-label="Race assignment summary">
          <div>
            <span>Assigned</span>
            <strong>06</strong>
          </div>
          <div>
            <span>Completed</span>
            <strong>02</strong>
          </div>
        </div>
      </section>

      <section className="referee-home-grid">
        <article className="referee-live-card">
          <header>
            <TimerIcon />
            <span>Live Now</span>
          </header>
          <div className="referee-live-card__media">
            <img src={raceImage} alt="Racecourse with active horses and grandstand" />
            <div className="referee-live-card__overlay">
              <div className="referee-live-card__title">
                <div>
                  <span>Royal Gold Cup Series</span>
                  <h2>Qualifier A</h2>
                </div>
                <div className="referee-live-card__participants">
                  <UsersIcon />
                  <div>
                    <span>Participants</span>
                    <strong>12 Registered</strong>
                  </div>
                </div>
              </div>

              <div className="referee-live-card__details">
                <div>
                  <CalendarIcon />
                  <dl>
                    <dt>Date &amp; Time</dt>
                    <dd>Oct 23rd - 14:30 GMT</dd>
                  </dl>
                </div>
                <div>
                  <RulerIcon />
                  <dl>
                    <dt>Distance</dt>
                    <dd>1,200m Sprint</dd>
                  </dl>
                </div>
                <Link to="/Referee/Races" className="referee-live-card__button">
                  View Race Details <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </article>

        <aside className="referee-side-stack">
          <article className="referee-notifications">
            <h2>Recent Notifications</h2>
            <div className="referee-notification is-primary">
              <BriefcaseIcon />
              <div>
                <strong>New Assignment</strong>
                <p>You have been assigned to Race: Qualifier A</p>
              </div>
            </div>
            <div className="referee-notification">
              <ClockIcon />
              <div>
                <strong>Schedule Update</strong>
                <p>The Northern Sprints start time adjusted by 5 mins.</p>
              </div>
            </div>
            <Link to="/Referee/Notifications">View All Notifications</Link>
          </article>

          <article className="referee-weather">
            <div>
              <h2>Weather Warning</h2>
              <p>Wind gusts exceeding 35mph expected at 16:00. May affect sprint stability.</p>
              <strong>Gate opens in 04:11</strong>
            </div>
            <WindIcon />
          </article>
        </aside>
      </section>

      <section className="referee-schedule">
        <header>
          <h2>Assigned Race Schedule</h2>
          <div className="referee-schedule__legend">
            <span><i className="is-upcoming" />Upcoming</span>
            <span><i className="is-progress" />In Progress</span>
          </div>
        </header>

        <div className="referee-schedule__table" role="table" aria-label="Assigned race schedule">
          <div className="referee-schedule__row referee-schedule__row--head" role="row">
            <span>Time</span>
            <span>Race Details</span>
            <span>Address</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {schedule.map((race) => (
            <div className="referee-schedule__row" role="row" key={race.race}>
              <strong>{race.time}</strong>
              <div>
                <strong>{race.race}</strong>
                <span>{race.details}</span>
              </div>
              <span>{race.address}</span>
              <StatusBadge status={race.status} />
              <Link to="/Referee/Races">{race.action}</Link>
            </div>
          ))}
        </div>
      </section>
    </RefereeShell>
  );
};

export default RefereeHome;
