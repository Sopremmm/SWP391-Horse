import HomeBanner from '../assets/images/HomeBanner.png';
import HorseRaceCartoon from '../Main UI/horse_race_cartoon.png';
import horse1 from '../assets/images/horse1.webp';
import horse2 from '../assets/images/horse2.jpg';
import horse3 from '../assets/images/horse3.jpg';

export type Tone = 'teal' | 'amber' | 'red' | 'stone';

export type HomepageTournamentState = 'registering' | 'in-progress' | 'opening-soon';

export type HomepageData = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    prizePool: string;
    raceDate: string;
    primaryAction: string;
    secondaryAction: string;
    image: string;
  };
  stats: Array<{ value: string; label: string }>;
  tournaments: Array<{
    title: string;
    location: string;
    state: HomepageTournamentState;
    stateText: string;
    dateLabel: string;
    dateValue: string;
    prizePool: string;
    action: string;
    image: string;
  }>;
};

export type TournamentListData = {
  filterTabs: Array<{ label: string; value: 'all' | 'registration-open' | 'upcoming' | 'completed' }>;
  sortOptions: Array<{ label: string; value: string }>;
  tournaments: Array<{
    id: string;
    featured: boolean;
    badge: string;
    badgeTone: Tone;
    title: string;
    description: string;
    imageUrl: string;
    prizePool: string;
    dateValue?: string;
    deadlineText?: string;
    meta1Label?: string;
    meta1Value?: string;
    actionText: string;
  }>;
  secondaryEvents: {
    title: string;
    actionText: string;
    rows: Array<{
      name: string;
      classLine: string;
      status: string;
      statusTone: Tone;
      deadline: string;
      prizePool: string;
      action: string;
    }>;
  };
};

export type Jockey = {
  name: string;
  level: string;
  gender: string;
  ageText: string;
  experienceText: string;
  priceText: string;
  hired: boolean;
  imageSrc?: string;
  variant: 'hire' | 'hired';
  profile?: {
    classLabel: string;
    tierLabel: string;
    bio: string;
    totalWins: string;
    winRate: string;
    performanceSeason: string;
    performance: Array<{
      raceName: string;
      horse: string;
      position: string;
      earnings: string;
      trackCondition: string;
    }>;
    gallery: Array<{
      label: string;
      title: string;
      imageSrc?: string;
    }>;
  };
};

export type HireJockeyData = {
  title: string;
  subtitle: string;
  jockeys: Jockey[];
};

export type AdminData = {
  stats: Array<{
    label: string;
    value: string;
    badge: string;
    tone: 'teal' | 'amber' | 'red';
    icon: 'users' | 'trophy' | 'clipboard';
  }>;
  tournaments: Array<{
    name: string;
    venue: string;
    date: string;
    filled: string;
    status: string;
    tone: 'teal' | 'amber';
  }>;
  registrations: Array<{
    horse: string;
    owner: string;
    rep: string;
    tournament: string;
    status: string;
  }>;
};

export type MyHorse = {
  name: string;
  meta: string;
  imageSrc: string;
};

export type MyHorsesPageData = {
  stats: {
    totalValue: string;
    stableSize: string;
    recentWins: string;
  };
  horses: MyHorse[];
};

export type PageData = {
  homepage: HomepageData;
  tournamentPage: TournamentListData;
  hireJockey: HireJockeyData;
  admin: AdminData;
  myHorses: MyHorsesPageData;
};

const PLACEHOLDER_IMG = 'https://placehold.co/361x451';

export const DEFAULT_PAGE_DATA: PageData = {
  homepage: {
    hero: {
      eyebrow: 'Premier Event',
      title: 'The Royal Heritage Cup',
      description:
        'Experience the pinnacle of equestrian precision. A legacy defined by speed, lineage, and the pursuit of ultimate glory on the hallowed grounds of the Royal Oaks.',
      prizePool: '$2,500,000 USD',
      raceDate: 'October 24, 2024',
      primaryAction: 'View Details',
      secondaryAction: 'Full Calendar',
      image: HomeBanner,
    },
    stats: [
      { value: '150+', label: 'Total tournaments hosted' },
      { value: '42', label: 'Elite class jockeys' },
      { value: '12', label: 'Global racing hubs' },
    ],
    tournaments: [
      {
        title: 'Autumn Classic Series',
        location: 'Ascot Park - Group 1 Stakes',
        state: 'registering',
        stateText: 'Registering',
        dateLabel: 'Starts',
        dateValue: 'Nov 12, 2024',
        prizePool: '$750,000',
        action: 'View Stakes',
        image: HorseRaceCartoon,
      },
      {
        title: 'The Emerald Invitational',
        location: 'Dubai Meadows - Invitations Only',
        state: 'in-progress',
        stateText: 'In Progress',
        dateLabel: 'Phase',
        dateValue: 'Quarter Finals',
        prizePool: '$1,200,000',
        action: 'Live Leaderboard',
        image: HomeBanner,
      },
      {
        title: 'Heritage Breeders Cup',
        location: 'Kentucky Downs - Grade II',
        state: 'opening-soon',
        stateText: 'Opening Soon',
        dateLabel: 'Opens',
        dateValue: 'Dec 05, 2024',
        prizePool: '$500,000',
        action: 'Notify Me',
        image: HorseRaceCartoon,
      },
    ],
  },
  tournamentPage: {
    filterTabs: [
      { label: 'All Events', value: 'all' },
      { label: 'Registration Open', value: 'registration-open' },
      { label: 'Upcoming', value: 'upcoming' },
      { label: 'Completed', value: 'completed' },
    ],
    sortOptions: [{ label: 'Date: Soonest first', value: 'soonest' }],
    tournaments: [
      {
        id: 'platinum-jubilee',
        featured: true,
        badge: 'REGISTRATION OPEN',
        badgeTone: 'amber',
        title: 'The Platinum Jubilee\nStakes',
        description:
          'The crown jewel of the autumn season. A legendary G1 event where legacies are forged and champions rise above the rest.',
        imageUrl: HomeBanner,
        prizePool: 'GBP 1,000,000',
        dateValue: 'Oct 24, 2024',
        deadlineText: 'DEADLINE: SEP 15, 2024',
        actionText: 'Register Now',
      },
      {
        id: 'emerald-derby',
        featured: false,
        badge: 'UPCOMING',
        badgeTone: 'stone',
        title: 'Emerald Derby',
        description: 'A test of endurance and speed across the verdant hills of the North.',
        imageUrl: HorseRaceCartoon,
        prizePool: 'GBP 250,000',
        meta1Label: 'STARTS',
        meta1Value: 'Nov 12, 2024',
        actionText: 'View Details',
      },
      {
        id: 'winter-solstice',
        featured: false,
        badge: 'REGISTRATION OPEN',
        badgeTone: 'amber',
        title: 'Winter Solstice Cup',
        description: 'The premier winter sprint. Short distance, high stakes, and absolute precision.',
        imageUrl: HorseRaceCartoon,
        prizePool: 'GBP 500,000',
        meta1Label: 'DEADLINE',
        meta1Value: 'Oct 05, 2024',
        actionText: 'Register Now',
      },
    ],
    secondaryEvents: {
      title: 'Regional Qualifiers',
      actionText: 'View All Schedule',
      rows: [
        {
          name: 'Southern Fields Invitational',
          classLine: 'Class 3 - Turf - 1200m',
          status: 'UPCOMING',
          statusTone: 'stone',
          deadline: 'Oct 20, 2024',
          prizePool: 'GBP 50,000',
          action: 'View',
        },
        {
          name: 'Highland Sprint Cup',
          classLine: 'Class 2 - Dirt - 1000m',
          status: 'OPEN',
          statusTone: 'amber',
          deadline: 'Sep 10, 2024',
          prizePool: 'GBP 120,000',
          action: 'Register',
        },
        {
          name: 'The Heritage Plate',
          classLine: 'Class 4 - All-Weather - 1400m',
          status: 'UPCOMING',
          statusTone: 'stone',
          deadline: 'Oct 28, 2024',
          prizePool: 'GBP 35,000',
          action: 'View',
        },
      ],
    },
  },
  hireJockey: {
    title: 'Professional Jockeys',
    subtitle:
      "Secure the industry's most disciplined riders for your stable. Our curated selection of elite racing partners brings precision, heritage, and a track record of excellence to every finish line.",
    jockeys: [
      {
        name: 'Liam Hamilton',
        hired: false,
        level: 'LEVEL 3',
        gender: 'Male',
        ageText: '28 years old',
        experienceText: '10 years experience',
        priceText: 'Hiring Price: $5,000 / race',
        variant: 'hire',
        imageSrc: PLACEHOLDER_IMG,
      },
      {
        name: 'Sophie Whitmore',
        hired: true,
        level: 'MASTER',
        gender: 'Female',
        ageText: '26 years old',
        experienceText: '8 years experience',
        priceText: 'Hiring Price: $8,500 / race',
        variant: 'hired',
        imageSrc: PLACEHOLDER_IMG,
        profile: {
          classLabel: 'ELITE CLASS',
          tierLabel: 'Top Tier Professional',
          bio:
            'A veteran of the circuit with a clinical eye for pace and a signature calm hand. Sophie specializes in middle-distance turf races and is known for her exceptional tactical awareness and dedication to the sport.',
          totalWins: '142',
          winRate: '24.8%',
          performanceSeason: 'SEASON 2024',
          performance: [
            {
              raceName: 'Epsom Invitational',
              horse: 'Ivory Sovereign',
              position: '1st',
              earnings: '$45,000',
              trackCondition: 'Firm',
            },
            {
              raceName: 'Heritage Stakes',
              horse: 'Emerald King',
              position: '2nd',
              earnings: '$18,500',
              trackCondition: 'Soft',
            },
            {
              raceName: 'Royal Ascot Qualifiers',
              horse: 'Midnight Silk',
              position: '1st',
              earnings: '$32,000',
              trackCondition: 'Good',
            },
            {
              raceName: 'Prestige Derby',
              horse: 'Golden Mare',
              position: '4th',
              earnings: '$5,000',
              trackCondition: 'Heavy',
            },
          ],
          gallery: [
            { label: 'CHAMPIONSHIP MOMENT', title: 'Epsom Downs 2023', imageSrc: HomeBanner },
            { label: 'PREPARATION', title: 'The Royal Stables', imageSrc: HorseRaceCartoon },
          ],
        },
      },
      {
        name: 'Arthur Thorne',
        hired: false,
        level: 'ELITE',
        gender: 'Male',
        ageText: '42 years old',
        experienceText: '22 years experience',
        priceText: 'Hiring Price: $12,000 / race',
        variant: 'hire',
        imageSrc: PLACEHOLDER_IMG,
      },
      {
        name: 'Elena Vance',
        hired: false,
        level: 'RISING STAR',
        gender: 'Female',
        ageText: '24 years old',
        experienceText: '4 years experience',
        priceText: 'Hiring Price: $3,500 / race',
        variant: 'hire',
        imageSrc: PLACEHOLDER_IMG,
      },
      {
        name: 'Marcus Reed',
        hired: true,
        level: 'VETERAN',
        gender: 'Male',
        ageText: '35 years old',
        experienceText: '15 years experience',
        priceText: 'Hiring Price: $7,200 / race',
        variant: 'hired',
        imageSrc: PLACEHOLDER_IMG,
      },
      {
        name: 'Diana Prince',
        hired: false,
        level: 'ELITE',
        gender: 'Female',
        ageText: '31 years old',
        experienceText: '12 years experience',
        priceText: 'Hiring Price: $11,500 / race',
        variant: 'hire',
        imageSrc: PLACEHOLDER_IMG,
      },
    ],
  },
  admin: {
    stats: [
      { label: 'Total active users', value: '12,482', badge: '+12% monthly', tone: 'teal', icon: 'users' },
      { label: 'Upcoming tournaments', value: '24', badge: 'Next 48h', tone: 'amber', icon: 'trophy' },
      { label: 'Pending registrations', value: '186', badge: 'Action req.', tone: 'red', icon: 'clipboard' },
    ],
    tournaments: [
      {
        name: 'Royal Ascot Qualifier',
        venue: 'Ascot Heritage Track',
        date: 'Jun 18, 2026',
        filled: '138 / 160 entries',
        status: 'Closing soon',
        tone: 'amber',
      },
      {
        name: 'Oaks Invitational',
        venue: 'Epsom Downs',
        date: 'Jun 22, 2026',
        filled: '96 / 120 entries',
        status: 'Open',
        tone: 'teal',
      },
    ],
    registrations: [
      {
        horse: 'Silver Monarch',
        owner: 'Windsor Stables',
        rep: 'M. Carter',
        tournament: 'Royal Ascot Qualifier',
        status: 'Confirmed',
      },
      {
        horse: 'Midnight Vale',
        owner: 'Coolmore',
        rep: 'J. Doyle',
        tournament: 'Oaks Invitational',
        status: 'Confirmed',
      },
      {
        horse: 'Golden Cipher',
        owner: 'Highclere Racing',
        rep: 'A. Bennett',
        tournament: 'Derby Preview Cup',
        status: 'Review',
      },
    ],
  },
  myHorses: {
    stats: {
      totalValue: '12.4M Credits',
      stableSize: '03 Thoroughbreds',
      recentWins: '03 Stakes',
    },
    horses: [
      {
        name: 'Midnight Sovereign',
        meta: 'Thoroughbred - 5yo - Stallion',
        imageSrc: horse1,
      },
      {
        name: 'Royal Velvet',
        meta: 'Thoroughbred - 3yo - Mare',
        imageSrc: horse2,
      },
      {
        name: 'Ivory Ghost',
        meta: 'Arabian Cross - 4yo - Stallion',
        imageSrc: horse3,
      },
    ],
  },
};

export function getPageData(): PageData {
  if (typeof window === 'undefined') return DEFAULT_PAGE_DATA;

  try {
    const raw = window.localStorage.getItem('heritage_page_data');
    if (!raw) return DEFAULT_PAGE_DATA;

    const custom = JSON.parse(raw) as Partial<PageData>;
    return {
      ...DEFAULT_PAGE_DATA,
      ...custom,
      homepage: { ...DEFAULT_PAGE_DATA.homepage, ...custom.homepage },
      tournamentPage: { ...DEFAULT_PAGE_DATA.tournamentPage, ...custom.tournamentPage },
      hireJockey: { ...DEFAULT_PAGE_DATA.hireJockey, ...custom.hireJockey },
      admin: { ...DEFAULT_PAGE_DATA.admin, ...custom.admin },
      myHorses: { ...DEFAULT_PAGE_DATA.myHorses, ...custom.myHorses },
    };
  } catch {
    return DEFAULT_PAGE_DATA;
  }
}
