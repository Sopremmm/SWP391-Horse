/**
 * Application Constants
 */

import { NavLink, Stat, Race, FooterLink } from '../types';
import HomeBanner from '../assets/images/HomeBanner.png';

// Navigation Links
export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/HorseOwnerHome', active: true },
  { label: 'Tournament', href: '/tournament', active: false },
  { label: 'My Horses', href: '/horses', active: false },
  { label: 'Hire Jockey', href: '/hire-jockey', active: false },

];


// Footer Links
export const FOOTER_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact Support', href: '#' },
  { label: 'About Us', href: '#' },
];

// Statistics
export const STATISTICS: Stat[] = [
  { value: '12', label: 'ACTIVE THOROUGHBREDS' },
  { value: '08', label: 'STAKES WINS' },
  { value: '£4.2M', label: 'SEASON EARNINGS' },
];

// Race Cards Data
export const RACE_CARDS: Race[] = [
  {
    id: 'race-001',
    date: 'JULY 02',
    status: 'closing-soon',
    statusDate: 'JUNE 20',
    title: 'Longchamp Grand Prix',
    location: 'Paris, France • Class 2 Stakes',
    horseParticipating: 'Noble Grace',
  },
  {
    id: 'race-002',
    date: 'JULY 15',
    status: 'ends-on',
    statusDate: 'JUNE 20',
    title: 'The Kentucky Invitation',
    location: 'Lexington, USA • Grade 1 Stakes',
    horseParticipating: 'Empire Gold',
  },
  {
    id: 'race-003',
    date: 'AUGUST 05',
    status: 'ends-on',
    statusDate: 'JULY 25',
    title: 'Sandown Classic',
    location: 'Melbourne, AUS • Group 3 Flat',
    horseParticipating: 'Thunderclap',
  },
];

// Featured Race Data
export const FEATURED_RACE = {
  title: 'The Royal Heritage Cup',
  location: 'Ascot, United Kingdom',
  description:
    "A Class 1 Group 1 international flat race for horses aged three years and older. Your stallion, 'Midnight Sovereign', is currently the second favorite.",
  imageUrl: HomeBanner,
  prizePool: '£2,500,000',
  raceDate: 'JUNE 24, 2024',
  timeUntilStart: 'STARTS IN 48H',
};

// Branding
export const BRAND = {
  name: 'Heritage Racing',
  tagline: 'Elevating the legacy of equestrian management through precision, tradition, and performance.',
  copyright: '© 2024 Heritage Racing Management. All rights reserved.',
};
