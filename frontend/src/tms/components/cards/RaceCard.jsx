import React from 'react';
import { CalendarIcon, ClockIcon, ExclaimIcon } from '../../data/icons.jsx';
import './RaceCard.css';

export const RaceCard = ({ date, status, statusDate, title, location, horseParticipating }) => {
  const isClosingSoon = status === 'closing-soon';

  return (
    <article className="race-card">
      <div className="race-card-top">
        <CalendarIcon />
        <span className="race-card-date">{date}</span>
      </div>

      <div className="race-card-status">
        {isClosingSoon ? <ClockIcon /> : <ExclaimIcon />}
        <span className="race-card-status-text">
          {isClosingSoon ? 'CLOSES IN 2 DAYS' : `ENDS ${statusDate}`}
        </span>
      </div>

      <h3 className="race-card-title">{title}</h3>
      <p className="race-card-location">{location}</p>

      <div className="race-card-footer">
        <span className="race-card-footer-label">Participating</span>
        <span className="race-card-footer-horse">{horseParticipating}</span>
      </div>
    </article>
  );
};

export default RaceCard;
