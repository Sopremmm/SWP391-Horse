import HomeBanner from '../assets/images/HomeBanner.png';

export const NAV_LINKS = [
  { label: 'Home', href: '/HorseOwnerHome', active: true },
  { label: 'Tournament', href: '/HorseOwner/Tournaments', active: false },
  { label: 'My Horses', href: '/HorseOwner/MyHorses', active: false },
  { label: 'Hire Jockey', href: '/HorseOwner/HireJockeys', active: false },
];

export const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Contact Support', href: '#support' },
  { label: 'About Us', href: '#about' },
];

export const STATISTICS = [
  { value: '12', label: 'ACTIVE THOROUGHBREDS' },
  { value: '08', label: 'STAKES WINS' },
  { value: 'GBP 4.2M', label: 'SEASON EARNINGS' },
];

export const RACE_CARDS = [
  {
    id: 'race-001',
    date: 'JULY 02',
    status: 'closing-soon',
    statusDate: 'JUNE 20',
    title: 'Longchamp Grand Prix',
    location: 'Paris, France - Class 2 Stakes',
    horseParticipating: 'Noble Grace',
  },
  {
    id: 'race-002',
    date: 'JULY 15',
    status: 'ends-on',
    statusDate: 'JUNE 20',
    title: 'The Kentucky Invitation',
    location: 'Lexington, USA - Grade 1 Stakes',
    horseParticipating: 'Empire Gold',
  },
  {
    id: 'race-003',
    date: 'AUGUST 05',
    status: 'ends-on',
    statusDate: 'JULY 25',
    title: 'Sandown Classic',
    location: 'Melbourne, AUS - Group 3 Flat',
    horseParticipating: 'Thunderclap',
  },
];

export const FEATURED_RACE = {
  title: 'The Royal Heritage Cup',
  location: 'Ascot, United Kingdom',
  description:
    "A Class 1 Group 1 international flat race for horses aged three years and older. Your stallion, 'Midnight Sovereign', is currently the second favorite.",
  imageUrl: HomeBanner,
  prizePool: 'GBP 2,500,000',
  raceDate: 'JUNE 24, 2024',
  timeUntilStart: 'STARTS IN 48H',
};

export const BRAND = {
  name: 'Heritage Racing',
  tagline: 'Elevating the legacy of equestrian management through precision, tradition, and performance.',
  copyright: '(c) 2024 Heritage Racing Management. All rights reserved.',
};
