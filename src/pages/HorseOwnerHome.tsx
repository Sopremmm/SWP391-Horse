import React from 'react';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { WelcomeSection } from '../components/sections/WelcomeSection.tsx';
import { RaceCardList } from '../components/sections/RaceCardList.tsx';
import { StatsSection } from '../components/sections/StatsSection.tsx';
import { FeaturedRaceCard } from '../components/cards/FeaturedRaceCard.tsx';
import { FEATURED_RACE } from '../constants/index.ts';
import './HorseOwnerHome.css';


/**
 * Horse Owner Home - Main Homepage
 * Displays the complete dashboard with header, welcome section, featured race, race cards, stats, and footer
 */
export const HorseOwnerHome: React.FC = () => {
  return (
    <div className="horse-owner-home">
      <Header />
      <main className="horse-owner-home__main">
        <WelcomeSection />
        <FeaturedRaceCard {...FEATURED_RACE} />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="/HorseOwner/MyHorses"

            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 700,
              color: "#14532d",
              textDecoration: 'none',
              border: '1px solid #14532d',
              padding: '10px 18px',
              borderRadius: 2,
              background: '#f5f5f4',
            }}
          >
            My Horses
          </a>
        </div>

        <RaceCardList />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default HorseOwnerHome;
