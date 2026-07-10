/**
 * Type Definitions for Heritage Racing Application
 */

// Race Card Types
export interface Race {
  id: string;
  date: string;
  status: 'closing-soon' | 'ends-on';
  statusDate: string;
  title: string;
  location: string;
  horseParticipating: string;
}

export interface FeaturedRaceCardProps {
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  prizePool: string;
  raceDate: string;
  timeUntilStart: string;
}

export interface RaceCardProps {
  date: string;
  status: 'closing-soon' | 'ends-on';
  statusDate: string;
  title: string;
  location: string;
  horseParticipating: string;
}

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

// Statistics Types
export interface Stat {
  value: string;
  label: string;
}

// Footer Types
export interface FooterLink {
  label: string;
  href: string;
}
