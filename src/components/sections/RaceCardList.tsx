import React from 'react';
import { Link } from 'react-router-dom';
import { RaceCard } from '../cards/RaceCard.tsx';
import { ArrowIcon } from '../../assets/icons/index.tsx';
import { RACE_CARDS } from '../../constants/index.ts';
import './RaceCardList.css';


/**
 * RaceCardList Component - Race Cards Section
 * Displays a grid of upcoming race cards with header and view calendar button
 */
export const RaceCardList: React.FC = () => {
  return (
    <section className="race-card-list">
      <div className="race-card-list-header">
        <div>
          <h2 className="race-card-list-title">Subsequent Entries</h2>
          <p className="race-card-list-copy">Your registered schedule for the next 30 days.</p>
        </div>
        <Link to="/HorseOwner/Tournaments" className="race-card-list-button" aria-label="View full calendar">
          <span>View Full Calendar</span>
          <ArrowIcon />
        </Link>
      </div>

      <div className="race-card-grid">
        {RACE_CARDS.map((card) => (
          <RaceCard
            key={card.id}
            date={card.date}
            status={card.status}
            statusDate={card.statusDate}
            title={card.title}
            location={card.location}
            horseParticipating={card.horseParticipating}
          />
        ))}
      </div>
    </section>
  );
};
