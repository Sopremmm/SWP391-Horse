import React from 'react';
import { RaceCardProps } from '../../types/index.ts';
import { CalendarIcon, ClockIcon, ExclaimIcon } from '../../assets/icons/index.tsx';
import './RaceCard.css';

/**
 * RaceCard Component - Individual Race Card
 * Displays race information including date, status, title, location, and participating horse
 */
export const RaceCard: React.FC<RaceCardProps> = ({
  date,
  status,
  statusDate,
  title,
  location,
  horseParticipating,
}) => {
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
