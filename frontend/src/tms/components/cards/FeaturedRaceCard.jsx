import React from 'react';
import { LocationIcon } from '../../data/icons.jsx';
import './FeaturedRaceCard.css';

export const FeaturedRaceCard = ({
  title,
  location,
  description,
  imageUrl,
  prizePool,
  raceDate,
  timeUntilStart,
}) => {
  return (
    <section className="featured-race-card">
      <img src={imageUrl} alt={title} className="featured-race-image" />
      <div className="featured-race-overlay" />
      <div className="featured-race-content">
        <div className="race-main">
          <div className="race-badge-row">
            <span className="race-badge">UPCOMING FEATURE</span>
            <div className="race-location">
              <LocationIcon />
              <span>{location}</span>
            </div>
          </div>

          <h2 className="race-title">{title}</h2>
          <p className="race-description">{description}</p>
        </div>

        <aside className="race-info-card">
          <div className="info-header">
            <span className="info-label">Prize Pool</span>
            <span className="info-pill">{timeUntilStart}</span>
          </div>
          <div className="info-prize">{prizePool}</div>
          <div className="info-row">
            <span className="info-label">Race Date</span>
            <span className="info-value">{raceDate}</span>
          </div>
          <button className="details-button">View Race Details</button>
        </aside>
      </div>
    </section>
  );
};

export default FeaturedRaceCard;
