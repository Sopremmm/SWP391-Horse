import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { WelcomeSection } from '../components/sections/WelcomeSection';
import { RaceCardList } from '../components/sections/RaceCardList';
import { StatsSection } from '../components/sections/StatsSection';
import { FeaturedRaceCard } from '../components/cards/FeaturedRaceCard';
import { FEATURED_RACE } from '../constants/index';

/**
 * Dashboard Page - Main Homepage
 * Displays the complete dashboard with header, welcome section, featured race, race cards, stats, and footer
 */
export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main className="w-full max-w-[1280px] mx-auto px-16 py-24 flex flex-col gap-16 pt-32">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Featured Race Card */}
        <FeaturedRaceCard {...FEATURED_RACE} />

        {/* Race Card List */}
        <RaceCardList />

        {/* Stats Section */}
        <StatsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
