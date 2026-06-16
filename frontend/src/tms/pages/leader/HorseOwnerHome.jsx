import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header.jsx';
import Footer from '../../components/common/Footer.jsx';
import WelcomeSection from '../../components/sections/WelcomeSection.jsx';
import RaceCardList from '../../components/sections/RaceCardList.jsx';
import StatsSection from '../../components/sections/StatsSection.jsx';
import FeaturedRaceCard from '../../components/cards/FeaturedRaceCard.jsx';
import { FEATURED_RACE } from '../../data/constants.js';
import './HorseOwnerHome.css';

export const HorseOwnerHome = () => {
  return (
    <div className="horse-owner-home">
      <Header />
      <main className="horse-owner-home__main">
        <WelcomeSection />
        <FeaturedRaceCard {...FEATURED_RACE} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            to="/HorseOwner/MyHorses"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              color: '#14532d',
              textDecoration: 'none',
              border: '1px solid #14532d',
              padding: '10px 18px',
              borderRadius: 2,
              background: '#f5f5f4',
            }}
          >
            My Horses
          </Link>
        </div>

        <RaceCardList />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default HorseOwnerHome;
