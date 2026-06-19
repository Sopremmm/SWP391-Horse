/**
 * Spectator Mock Test Data
 * Comprehensive test data for testing all spectator flows (happy case)
 *
 * Test User: U009 (Lisa Spectator) - Pre-authenticated for testing
 * Test Scenarios:
 *   1. Browse public pages (Home, Tournaments, Horses, Jockeys, Live)
 *   2. Sign in and access authenticated pages
 *   3. Place bets and track betting history
 *   4. View live races
 *   5. Receive and view notifications
 *   6. View profile and activity
 */

// ============================================
// TEST USERS
// ============================================

export const TEST_USERS = [
  {
    id: 'U009',
    name: 'Lisa Spectator',
    email: 'lisa.spectator@heritageracing.com',
    role: 'spectator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    joinDate: '2024-01-15',
    totalBets: 24,
    activeBets: 4,
    lifetimePayouts: 12400,
  },
  {
    id: 'U010',
    name: 'John Smith',
    email: 'john.smith@test.com',
    role: 'spectator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    joinDate: '2024-03-22',
    totalBets: 12,
    activeBets: 2,
    lifetimePayouts: 5200,
  },
];

// Pre-authenticated state for testing
export const TEST_AUTH_STATE = {
  user: TEST_USERS[0],
  isAuthenticated: true,
  token: 'mock-jwt-token-for-testing',
};

// ============================================
// RACE DATA (for Dashboard & Tournaments)
// ============================================

export const TEST_RACES = [
  // Upcoming races
  {
    id: 'RACE-TEST-001',
    name: 'Heritage Derby Finals',
    venue: 'Epsom Downs, UK',
    date: '2026-06-25',
    time: '15:30',
    distance: 2400,
    distanceUnit: 'm',
    grade: 'G1',
    prizePool: 5000000,
    prizePoolFormatted: '$5,000,000',
    condition: 'Firm',
    status: 'Upcoming',
    registrations: [
      { id: 'REG-001', horseName: 'Thunder Bolt', jockeyName: 'Miguel Torres', odds: 4.2, status: 'Confirmed' },
      { id: 'REG-002', horseName: 'Silver Arrow', jockeyName: 'Carlos Ruiz', odds: 5.5, status: 'Confirmed' },
      { id: 'REG-003', horseName: 'Dark Knight', jockeyName: 'Emma Sinclair', odds: 6.8, status: 'Confirmed' },
      { id: 'REG-004', horseName: 'Desert Storm', jockeyName: 'James O\'Brien', odds: 8.0, status: 'Confirmed' },
    ],
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=85',
    totalRegistrations: 4,
  },
  {
    id: 'RACE-TEST-002',
    name: 'Champions Sprint Cup',
    venue: 'Meydan Racecourse, UAE',
    date: '2026-06-26',
    time: '14:00',
    distance: 1200,
    distanceUnit: 'm',
    grade: 'G2',
    prizePool: 1200000,
    prizePoolFormatted: '$1,200,000',
    condition: 'Fast',
    status: 'Upcoming',
    registrations: [
      { id: 'REG-005', horseName: 'Silver Arrow', jockeyName: 'Carlos Ruiz', odds: 3.5, status: 'Confirmed' },
      { id: 'REG-006', horseName: 'Red Blazer', jockeyName: 'Miguel Torres', odds: 4.8, status: 'Confirmed' },
      { id: 'REG-007', horseName: 'Blue Horizon', jockeyName: 'Yuki Tanaka', odds: 6.2, status: 'Confirmed' },
    ],
    image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=85',
    totalRegistrations: 3,
  },
  {
    id: 'RACE-TEST-003',
    name: 'Melbourne Cup',
    venue: 'Flemington, AUS',
    date: '2026-07-05',
    time: '15:00',
    distance: 3200,
    distanceUnit: 'm',
    grade: 'G1',
    prizePool: 8000000,
    prizePoolFormatted: '$8,000,000',
    condition: 'Good',
    status: 'Upcoming',
    registrations: [
      { id: 'REG-008', horseName: 'Royal Velvet', jockeyName: 'Sophia Lee', odds: 7.5, status: 'Confirmed' },
      { id: 'REG-009', horseName: 'Mystic Bay', jockeyName: 'Tom Wilson', odds: 9.2, status: 'Confirmed' },
    ],
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1200&q=85',
    totalRegistrations: 2,
  },
  // Ongoing race
  {
    id: 'RACE-TEST-004',
    name: 'Belmont Stakes',
    venue: 'Belmont Park, NY',
    date: '2026-06-19',
    time: '16:00',
    distance: 2400,
    distanceUnit: 'm',
    grade: 'G1',
    prizePool: 1500000,
    prizePoolFormatted: '$1,500,000',
    condition: 'Firm',
    status: 'Ongoing',
    progress: 68,
    elapsedTime: '01:37',
    registrations: [
      { id: 'REG-010', horseName: 'Thunder Dash', jockeyName: 'Liam Hamilton', odds: 4.2, position: 1, result: null },
      { id: 'REG-011', horseName: 'Noble Spirit', jockeyName: 'Sophie Whitmore', odds: 5.5, position: 2, result: null },
      { id: 'REG-012', horseName: 'Midnight Legend', jockeyName: 'Arthur Thorne', odds: 6.8, position: 3, result: null },
      { id: 'REG-013', horseName: 'Velvet Storm', jockeyName: 'Elena Vance', odds: 8.0, position: 4, result: null },
    ],
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=85',
    totalRegistrations: 4,
  },
  // Finished races
  {
    id: 'RACE-TEST-005',
    name: 'Kentucky Derby',
    venue: 'Churchill Downs, KY',
    date: '2026-06-10',
    time: '17:00',
    distance: 2000,
    distanceUnit: 'm',
    grade: 'G1',
    prizePool: 3000000,
    prizePoolFormatted: '$3,000,000',
    condition: 'Firm',
    status: 'Finished',
    registrations: [
      { id: 'REG-014', horseName: 'Eclipse', jockeyName: 'Carlos Ruiz', odds: 5.2, position: 1, result: 1 },
      { id: 'REG-015', horseName: 'Golden Flash', jockeyName: 'Yuki Tanaka', odds: 4.5, position: 2, result: 2 },
      { id: 'REG-016', horseName: 'Iron Fist', jockeyName: 'Lucas Martini', odds: 7.0, position: 3, result: 3 },
      { id: 'REG-017', horseName: 'Crimson Tide', jockeyName: 'Marcus Webb', odds: 9.5, position: 4, result: 4 },
    ],
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1200&q=85',
    totalRegistrations: 4,
    winner: { horseName: 'Eclipse', jockeyName: 'Carlos Ruiz', payout: 1560000 },
  },
  {
    id: 'RACE-TEST-006',
    name: 'Dubai World Cup',
    venue: 'Meydan Racecourse, UAE',
    date: '2026-06-05',
    time: '20:30',
    distance: 2000,
    distanceUnit: 'm',
    grade: 'G1',
    prizePool: 12000000,
    prizePoolFormatted: '$12,000,000',
    condition: 'Tapeta',
    status: 'Finished',
    registrations: [
      { id: 'REG-018', horseName: 'Thunder Dash', jockeyName: 'Liam Hamilton', odds: 3.8, position: 1, result: 1 },
      { id: 'REG-019', horseName: 'Silver Ghost', jockeyName: 'Sophie Whitmore', odds: 5.0, position: 2, result: 2 },
      { id: 'REG-020', horseName: 'Phantom Rider', jockeyName: 'Arthur Thorne', odds: 8.5, position: 3, result: 3 },
    ],
    image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=85',
    totalRegistrations: 3,
    winner: { horseName: 'Thunder Dash', jockeyName: 'Liam Hamilton', payout: 45600000 },
  },
];

// ============================================
// BET DATA (for Betting History & Dashboard)
// ============================================

export const TEST_BETS = [
  // Pending bets (race not finished)
  {
    id: 'BET-TEST-001',
    userId: 'U009',
    raceId: 'RACE-TEST-001',
    raceName: 'Heritage Derby Finals',
    raceVenue: 'Epsom Downs, UK',
    raceDate: '2026-06-25',
    horseName: 'Thunder Bolt',
    horseId: 'HORSE-001',
    jockeyName: 'Miguel Torres',
    stake: 50,
    odds: 4.2,
    potentialPayout: 210,
    status: 'Pending',
    placedAt: '2026-06-18T10:30:00Z',
    settledAt: null,
    raceImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&q=80',
  },
  {
    id: 'BET-TEST-002',
    userId: 'U009',
    raceId: 'RACE-TEST-002',
    raceName: 'Champions Sprint Cup',
    raceVenue: 'Meydan Racecourse, UAE',
    raceDate: '2026-06-26',
    horseName: 'Silver Arrow',
    horseId: 'HORSE-002',
    jockeyName: 'Carlos Ruiz',
    stake: 100,
    odds: 3.5,
    potentialPayout: 350,
    status: 'Pending',
    placedAt: '2026-06-18T14:45:00Z',
    settledAt: null,
    raceImage: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=200&q=80',
  },
  {
    id: 'BET-TEST-003',
    userId: 'U009',
    raceId: 'RACE-TEST-003',
    raceName: 'Melbourne Cup',
    raceVenue: 'Flemington, AUS',
    raceDate: '2026-07-05',
    horseName: 'Royal Velvet',
    horseId: 'HORSE-003',
    jockeyName: 'Sophia Lee',
    stake: 75,
    odds: 7.5,
    potentialPayout: 562.5,
    status: 'Pending',
    placedAt: '2026-06-19T09:15:00Z',
    settledAt: null,
    raceImage: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=200&q=80',
  },
  {
    id: 'BET-TEST-004',
    userId: 'U009',
    raceId: 'RACE-TEST-004',
    raceName: 'Belmont Stakes',
    raceVenue: 'Belmont Park, NY',
    raceDate: '2026-06-19',
    horseName: 'Thunder Dash',
    horseId: 'HORSE-004',
    jockeyName: 'Liam Hamilton',
    stake: 60,
    odds: 4.2,
    potentialPayout: 252,
    status: 'Pending',
    placedAt: '2026-06-19T15:50:00Z',
    settledAt: null,
    raceImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&q=80',
  },
  // Won bets
  {
    id: 'BET-TEST-005',
    userId: 'U009',
    raceId: 'RACE-TEST-005',
    raceName: 'Kentucky Derby',
    raceVenue: 'Churchill Downs, KY',
    raceDate: '2026-06-10',
    horseName: 'Eclipse',
    horseId: 'HORSE-005',
    jockeyName: 'Carlos Ruiz',
    stake: 100,
    odds: 5.2,
    potentialPayout: 520,
    actualPayout: 520,
    status: 'Won',
    placedAt: '2026-06-05T11:24:00Z',
    settledAt: '2026-06-10T19:30:00Z',
    raceImage: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=200&q=80',
  },
  {
    id: 'BET-TEST-006',
    userId: 'U009',
    raceId: 'RACE-TEST-006',
    raceName: 'Dubai World Cup',
    raceVenue: 'Meydan Racecourse, UAE',
    raceDate: '2026-06-05',
    horseName: 'Thunder Dash',
    horseId: 'HORSE-004',
    jockeyName: 'Liam Hamilton',
    stake: 50,
    odds: 3.8,
    potentialPayout: 190,
    actualPayout: 190,
    status: 'Won',
    placedAt: '2026-06-01T16:00:00Z',
    settledAt: '2026-06-05T22:45:00Z',
    raceImage: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=200&q=80',
  },
  // Settled bets (lost)
  {
    id: 'BET-TEST-007',
    userId: 'U009',
    raceId: 'RACE-OLD-001',
    raceName: 'Eclipse Stakes',
    raceVenue: 'Sandown Park, UK',
    raceDate: '2026-05-22',
    horseName: 'Mystic Bay',
    horseId: 'HORSE-006',
    jockeyName: 'Tom Wilson',
    stake: 60,
    odds: 5.2,
    potentialPayout: 312,
    actualPayout: 0,
    status: 'Lost',
    placedAt: '2026-05-18T10:00:00Z',
    settledAt: '2026-05-22T16:30:00Z',
    raceImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200&q=80',
  },
  {
    id: 'BET-TEST-008',
    userId: 'U009',
    raceId: 'RACE-OLD-002',
    raceName: 'Royal Ascot Gold Cup',
    raceVenue: 'Ascot, UK',
    raceDate: '2026-05-15',
    horseName: 'Silver Ghost',
    horseId: 'HORSE-007',
    jockeyName: 'Sophie Whitmore',
    stake: 40,
    odds: 6.0,
    potentialPayout: 240,
    actualPayout: 0,
    status: 'Lost',
    placedAt: '2026-05-10T13:45:00Z',
    settledAt: '2026-05-15T18:20:00Z',
    raceImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&q=80',
  },
];

// ============================================
// LIVE RACE DATA (for Live Racing page)
// ============================================

export const TEST_LIVE_RACES = [
  {
    id: 'LIVE-TEST-001',
    name: 'Heritage Derby Finals',
    location: 'Epsom Downs, UK',
    classLine: 'Group 1',
    date: 'Today',
    time: '15:30',
    prizePool: '$5,000,000',
    distance: '2,400m',
    surface: 'Turf',
    runners: 12,
    status: 'ONGOING',
    badge: 'LIVE NOW',
    badgeColor: '#ef4444',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=85',
    progress: 68,
    elapsedTime: '01:37',
    participants: [
      { id: 'P1', horseName: 'Thunder Dash', jockey: 'Liam Hamilton', odds: 4.2, position: 1, progress: 82, color: '#002a15' },
      { id: 'P2', horseName: 'Noble Spirit', jockey: 'Sophie Whitmore', odds: 5.5, position: 2, progress: 76, color: '#1e3a8a' },
      { id: 'P3', horseName: 'Midnight Legend', jockey: 'Arthur Thorne', odds: 6.8, position: 3, progress: 71, color: '#4a1d1d' },
      { id: 'P4', horseName: 'Velvet Storm', jockey: 'Elena Vance', odds: 8.0, position: 4, progress: 65, color: '#4a1d6b' },
      { id: 'P5', horseName: 'Crimson Tide', jockey: 'Marcus Webb', odds: 10.0, position: 5, progress: 58, color: '#7f1d1d' },
      { id: 'P6', horseName: 'Golden Hoof', jockey: 'Iris Nakamura', odds: 12.0, position: 6, progress: 52, color: '#b8860b' },
    ],
    commentary: [
      { time: '01:37', text: 'Thunder Dash takes the lead entering the final stretch!', highlight: true },
      { time: '01:24', text: 'Noble Spirit makes a strong push on the inside rail.', highlight: false },
      { time: '01:10', text: 'Midnight Legend surges from the back of the pack!', highlight: false },
      { time: '00:45', text: 'Field bunching up at the clubhouse turn.', highlight: false },
      { time: '00:00', text: 'And they\'re off! The Heritage Derby is underway.', highlight: false },
    ],
  },
  {
    id: 'LIVE-TEST-002',
    name: 'Champions Sprint Cup',
    location: 'Meydan Racecourse, UAE',
    classLine: 'Group 2',
    date: 'Today',
    time: '14:00',
    prizePool: '$1,200,000',
    distance: '1,200m',
    surface: 'Tapeta',
    runners: 8,
    status: 'ONGOING',
    badge: 'LIVE NOW',
    badgeColor: '#ef4444',
    image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=85',
    progress: 35,
    elapsedTime: '00:24',
    participants: [
      { id: 'SP1', horseName: 'Silver Arrow', jockey: 'Carlos Ruiz', odds: 3.5, position: 1, progress: 48, color: '#71717a' },
      { id: 'SP2', horseName: 'Red Blazer', jockey: 'Miguel Torres', odds: 4.8, position: 2, progress: 45, color: '#dc2626' },
      { id: 'SP3', horseName: 'Blue Horizon', jockey: 'Yuki Tanaka', odds: 6.2, position: 3, progress: 42, color: '#1e40af' },
      { id: 'SP4', horseName: 'Green Flash', jockey: 'Nina Rodriguez', odds: 9.0, position: 4, progress: 38, color: '#166534' },
    ],
    commentary: [
      { time: '00:24', text: 'Silver Arrow with the early burst! Explosive start!', highlight: true },
      { time: '00:12', text: 'Red Blazer matching stride for stride.', highlight: false },
      { time: '00:00', text: 'Sprinters away! The 1,200m dash begins!', highlight: false },
    ],
  },
];

// ============================================
// NOTIFICATION DATA (for Notifications page)
// ============================================

export const TEST_NOTIFICATIONS = [
  // Unread notifications
  {
    id: 'NOTIF-001',
    type: 'BET_WIN',
    title: 'You Won!',
    message: 'Your bet on Thunder Dash paid off.',
    amount: 210,
    race: 'Heritage Derby',
    horse: 'Thunder Dash',
    timestamp: '2 minutes ago',
    timestampISO: '2026-06-19T15:14:00Z',
    read: false,
  },
  {
    id: 'NOTIF-002',
    type: 'RACE_RESULT',
    title: 'Race Finished',
    message: 'Heritage Derby Finals has concluded. Thunder Dash wins.',
    race: 'Heritage Derby Finals',
    winner: 'Thunder Dash',
    timestamp: '5 minutes ago',
    timestampISO: '2026-06-19T15:11:00Z',
    read: false,
  },
  {
    id: 'NOTIF-003',
    type: 'RACE_STARTING',
    title: 'Race Starting Soon',
    message: 'Champions Sprint Cup begins in 10 minutes. Place your bets!',
    race: 'Champions Sprint Cup',
    timestamp: '10 minutes ago',
    timestampISO: '2026-06-19T15:06:00Z',
    read: false,
  },
  {
    id: 'NOTIF-004',
    type: 'BET_SETTLED',
    title: 'Bet Settled',
    message: 'Your bet on Kentucky Derby has been settled.',
    race: 'Kentucky Derby',
    horse: 'Eclipse',
    amount: 520,
    timestamp: '30 minutes ago',
    timestampISO: '2026-06-19T14:46:00Z',
    read: false,
  },
  // Read notifications
  {
    id: 'NOTIF-005',
    type: 'BET_LOSE',
    title: 'Bet Settled',
    message: 'Your bet on Royal Velvet did not win. Better luck next time.',
    race: 'Melbourne Cup',
    horse: 'Royal Velvet',
    timestamp: '1 hour ago',
    timestampISO: '2026-06-19T14:16:00Z',
    read: true,
  },
  {
    id: 'NOTIF-006',
    type: 'SYSTEM',
    title: 'New Tournament',
    message: 'Heritage Spring Series is now open for registration.',
    tournament: 'Heritage Spring Series',
    timestamp: '3 hours ago',
    timestampISO: '2026-06-19T12:16:00Z',
    read: true,
  },
  {
    id: 'NOTIF-007',
    type: 'ODDS_UPDATE',
    title: 'Odds Updated',
    message: 'Thunder Bolt odds have changed from 4.0 to 4.2 for Heritage Derby Finals.',
    race: 'Heritage Derby Finals',
    horse: 'Thunder Bolt',
    oldOdds: 4.0,
    newOdds: 4.2,
    timestamp: '5 hours ago',
    timestampISO: '2026-06-19T10:16:00Z',
    read: true,
  },
  {
    id: 'NOTIF-008',
    type: 'RACE_RESULT',
    title: 'Race Finished',
    message: 'Dubai World Cup has concluded. Thunder Dash wins.',
    race: 'Dubai World Cup',
    winner: 'Thunder Dash',
    timestamp: '1 day ago',
    timestampISO: '2026-06-18T22:45:00Z',
    read: true,
  },
];

// ============================================
// HORSE DATA (for Horse Registry & Detail)
// ============================================

export const TEST_HORSES = [
  {
    id: 'HORSE-001',
    name: 'Thunder Bolt',
    meta: 'Thoroughbred · 5 yrs · Stallion',
    breed: 'Thoroughbred',
    age: 5,
    gender: 'Stallion',
    color: 'Bay',
    performance: 'Elite',
    rating: 96,
    bio: 'Thunder Bolt is a thoroughbred stallion celebrated for his powerful stride and unwavering focus. With five championship titles to his name, he is regarded as one of the finest competitors in the modern racing era.',
    races: 48,
    wins: 32,
    winRate: '67%',
    podiumRate: '89%',
    odds: 4.2,
    trainer: 'John Williams',
    owner: 'Thunder Stables',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80',
    recentForm: ['1st', '2nd', '1st', '3rd', '1st'],
  },
  {
    id: 'HORSE-002',
    name: 'Silver Arrow',
    meta: 'Thoroughbred · 4 yrs · Mare',
    breed: 'Thoroughbred',
    age: 4,
    gender: 'Mare',
    color: 'Grey',
    performance: 'Champion',
    rating: 92,
    bio: 'A champion mare known for her elegance and lightning-fast sprints across the turf circuit.',
    races: 36,
    wins: 22,
    winRate: '61%',
    podiumRate: '83%',
    odds: 5.5,
    trainer: 'Maria Garcia',
    owner: 'Silver Farms',
    image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=900&q=80',
    recentForm: ['1st', '1st', '2nd', '1st', '4th'],
  },
  {
    id: 'HORSE-003',
    name: 'Royal Velvet',
    meta: 'Thoroughbred · 3 yrs · Mare',
    breed: 'Thoroughbred',
    age: 3,
    gender: 'Mare',
    color: 'Chestnut',
    performance: 'Promising',
    rating: 88,
    bio: 'A young rising star with a velvet-smooth stride and a fierce competitive instinct on the home stretch.',
    races: 24,
    wins: 13,
    winRate: '54%',
    podiumRate: '75%',
    odds: 7.5,
    trainer: 'Robert Brown',
    owner: 'Royal Racing',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80',
    recentForm: ['2nd', '3rd', '1st', '2nd', '1st'],
  },
  {
    id: 'HORSE-004',
    name: 'Thunder Dash',
    meta: 'Thoroughbred · 5 yrs · Gelding',
    breed: 'Thoroughbred',
    age: 5,
    gender: 'Gelding',
    color: 'Black',
    performance: 'Elite',
    rating: 95,
    bio: 'A powerhouse gelding known for explosive starts and relentless finishing pace.',
    races: 52,
    wins: 30,
    winRate: '58%',
    podiumRate: '79%',
    odds: 4.2,
    trainer: 'Sarah Johnson',
    owner: 'Dash Racing',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=80',
    recentForm: ['1st', '1st', '2nd', '1st', '3rd'],
  },
  {
    id: 'HORSE-005',
    name: 'Eclipse',
    meta: 'Thoroughbred · 4 yrs · Mare',
    breed: 'Thoroughbred',
    age: 4,
    gender: 'Mare',
    color: 'Bay',
    performance: 'Champion',
    rating: 91,
    bio: 'A champion mare known for her tactical brilliance and consistent performances in Group 1 events.',
    races: 38,
    wins: 23,
    winRate: '61%',
    podiumRate: '82%',
    odds: 5.2,
    trainer: 'James Wilson',
    owner: 'Eclipse Stables',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80',
    recentForm: ['1st', '2nd', '1st', '1st', '2nd'],
  },
  {
    id: 'HORSE-006',
    name: 'Mystic Bay',
    meta: 'Arabian Cross · 6 yrs · Stallion',
    breed: 'Arabian Cross',
    age: 6,
    gender: 'Stallion',
    color: 'Grey',
    performance: 'Veteran',
    rating: 85,
    bio: 'A veteran campaigner whose experience on long-distance courses has earned him a cult following.',
    races: 72,
    wins: 35,
    winRate: '48%',
    podiumRate: '70%',
    odds: 9.2,
    trainer: 'Michael Lee',
    owner: 'Mystic Farms',
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=900&q=80',
    recentForm: ['4th', '3rd', '2nd', '5th', '1st'],
  },
];

// ============================================
// JOCKEY DATA (for Jockeys List & Profile)
// ============================================

export const TEST_JOCKEYS = [
  {
    id: 'JOCKEY-001',
    name: 'Liam Hamilton',
    country: 'UK',
    countryCode: 'GB',
    licenseNo: 'JLN-4821',
    age: 28,
    weight: 52,
    careerWins: 142,
    winRate: 24.8,
    prizeEarnings: 1240000,
    yearsExp: 8,
    totalWins: 142,
    yearsActive: 8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1600&q=80',
    bio: 'A precision rider with an eye for pace, Liam is the go-to jockey for Group 1 stakes on firm ground.',
    tierLabel: 'Top Tier Professional',
    classLabel: 'MASTER CLASS',
    stamina: 'Elite',
    socials: ['twitter', 'instagram'],
    performance: [
      { race: 'Dubai World Cup', horse: 'Thunder Dash', position: '1st', earnings: '$45,000', track: 'Firm' },
      { race: 'Heritage Stakes', horse: 'Golden Flash', position: '2nd', earnings: '$18,500', track: 'Good' },
      { race: 'Royal Ascot Qualifiers', horse: 'Silver Spirit', position: '1st', earnings: '$32,000', track: 'Firm' },
      { race: 'Melbourne Cup', horse: 'Royal Velvet', position: '3rd', earnings: '$22,000', track: 'Turf' },
      { race: 'Kentucky Derby', horse: 'Eclipse', position: '2nd', earnings: '$25,000', track: 'Firm' },
    ],
    recentPerformance: [
      { race: 'Dubai World Cup', horse: 'Thunder Dash', position: '1st', earnings: '$45,000', track: 'Firm' },
      { race: 'Heritage Stakes', horse: 'Golden Flash', position: '2nd', earnings: '$18,500', track: 'Good' },
      { race: 'Royal Ascot Qualifiers', horse: 'Silver Spirit', position: '1st', earnings: '$32,000', track: 'Firm' },
    ],
    seasonStats: { year: '2024', wins: 22, starts: 78, rate: 28, earned: 410000 },
    gallery: [
      { title: 'Dubai World Cup Victory', label: 'G1 WIN', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80' },
      { title: 'Heritage Stakes Podium', label: 'PODIUM', image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=600&q=80' },
      { title: 'Royal Ascot Champion', label: 'CHAMPION', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80' },
    ],
  },
  {
    id: 'JOCKEY-002',
    name: 'Carlos Ruiz',
    country: 'Spain',
    countryCode: 'ES',
    licenseNo: 'JLN-7156',
    age: 32,
    weight: 51,
    careerWins: 198,
    winRate: 26,
    prizeEarnings: 2150000,
    yearsExp: 12,
    totalWins: 198,
    yearsActive: 12,
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1600&q=80',
    bio: 'Veteran Spanish rider with 12 G1 wins. Renowned for late-kick tactics in long-distance classics.',
    tierLabel: 'Elite Professional',
    classLabel: 'MASTER CLASS',
    stamina: 'Strong',
    socials: ['twitter', 'globe'],
    performance: [
      { race: 'Kentucky Derby', horse: 'Eclipse', position: '1st', earnings: '$50,000', track: 'Firm' },
      { race: 'Breeders Cup', horse: 'Silver Arrow', position: '3rd', earnings: '$15,000', track: 'Dirt' },
      { race: 'Melbourne Cup', horse: 'Royal Velvet', position: '2nd', earnings: '$28,000', track: 'Turf' },
      { race: 'Dubai World Cup', horse: 'Thunder Dash', position: '4th', earnings: '$12,000', track: 'Firm' },
    ],
    recentPerformance: [
      { race: 'Kentucky Derby', horse: 'Eclipse', position: '1st', earnings: '$50,000', track: 'Firm' },
      { race: 'Breeders Cup', horse: 'Silver Arrow', position: '3rd', earnings: '$15,000', track: 'Dirt' },
    ],
    seasonStats: { year: '2024', wins: 28, starts: 95, rate: 29, earned: 520000 },
    gallery: [
      { title: 'Kentucky Derby Champion', label: 'G1 WIN', image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600&q=80' },
      { title: 'Breeders Cup Podium', label: 'G1 PODIUM', image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=600&q=80' },
      { title: 'Melbourne Cup Runner-Up', label: 'G1 PLACE', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80' },
    ],
  },
  {
    id: 'JOCKEY-003',
    name: 'Sophie Whitmore',
    country: 'UK',
    countryCode: 'GB',
    licenseNo: 'JLN-3390',
    age: 24,
    weight: 50,
    careerWins: 86,
    winRate: 19,
    prizeEarnings: 720000,
    yearsExp: 4,
    totalWins: 86,
    yearsActive: 4,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1600&q=80',
    bio: 'One of the brightest young talents in international flat racing. Champion apprentice in 2023.',
    tierLabel: 'Rising Star',
    classLabel: 'PROFESSIONAL',
    stamina: 'Good',
    socials: ['instagram', 'twitter'],
    performance: [
      { race: 'Epsom Invitational', horse: 'Noble Spirit', position: '2nd', earnings: '$20,000', track: 'Firm' },
      { race: 'Heritage Stakes', horse: 'Silver Ghost', position: '4th', earnings: '$5,000', track: 'Good' },
      { race: 'Champions Sprint Cup', horse: 'Red Blazer', position: '1st', earnings: '$18,000', track: 'Fast' },
      { race: 'Royal Ascot Qualifiers', horse: 'Blue Horizon', position: '3rd', earnings: '$8,000', track: 'Firm' },
    ],
    recentPerformance: [
      { race: 'Epsom Invitational', horse: 'Noble Spirit', position: '2nd', earnings: '$20,000', track: 'Firm' },
      { race: 'Heritage Stakes', horse: 'Silver Ghost', position: '4th', earnings: '$5,000', track: 'Good' },
    ],
    seasonStats: { year: '2024', wins: 18, starts: 82, rate: 22, earned: 280000 },
    gallery: [
      { title: 'Epsom Invitational Runner-Up', label: 'G2 PLACE', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80' },
      { title: 'Champion Apprentice 2023', label: 'AWARD', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80' },
      { title: 'Champions Sprint Cup Winner', label: 'G2 WIN', image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=600&q=80' },
    ],
  },
  {
    id: 'JOCKEY-004',
    name: 'Yuki Tanaka',
    country: 'Japan',
    countryCode: 'JP',
    licenseNo: 'JLN-3891',
    age: 29,
    weight: 51,
    careerWins: 167,
    winRate: 24,
    prizeEarnings: 1820000,
    yearsExp: 9,
    totalWins: 167,
    yearsActive: 9,
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=80',
    bio: 'Top Japanese jockey with an exceptional record on firm and good tracks. Triple Crown contender.',
    tierLabel: 'Elite Professional',
    classLabel: 'MASTER CLASS',
    stamina: 'Elite',
    socials: ['twitter', 'instagram', 'globe'],
    performance: [
      { race: 'Japan Cup', horse: 'Blue Horizon', position: '1st', earnings: '$60,000', track: 'Firm' },
      { race: 'Melbourne Cup', horse: 'Golden Flash', position: '2nd', earnings: '$25,000', track: 'Turf' },
      { race: 'Dubai World Cup', horse: 'Thunder Bolt', position: '3rd', earnings: '$20,000', track: 'Firm' },
      { race: 'Champions Sprint Cup', horse: 'Blue Horizon', position: '1st', earnings: '$22,000', track: 'Fast' },
    ],
    recentPerformance: [
      { race: 'Japan Cup', horse: 'Blue Horizon', position: '1st', earnings: '$60,000', track: 'Firm' },
      { race: 'Melbourne Cup', horse: 'Golden Flash', position: '2nd', earnings: '$25,000', track: 'Turf' },
    ],
    seasonStats: { year: '2024', wins: 24, starts: 88, rate: 27, earned: 480000 },
    gallery: [
      { title: 'Japan Cup Champion', label: 'G1 WIN', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80' },
      { title: 'Triple Crown Contender', label: 'ELITE', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&q=80' },
      { title: 'Melbourne Cup Runner-Up', label: 'G1 PLACE', image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600&q=80' },
    ],
  },
];

// ============================================
// FEATURED TOURNAMENTS (for Tournaments List)
// ============================================

export const TEST_FEATURED_RACES = [
  {
    id: 'FEATURED-001',
    name: 'Heritage Derby Finals',
    location: 'Epsom Downs, UK',
    classLine: 'Group 1',
    date: 'Jun 25, 2026',
    time: '15:30',
    prizePool: '$5,000,000',
    distance: '2,400m',
    surface: 'Turf',
    runners: 12,
    status: 'upcoming',
    badge: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80',
  },
  {
    id: 'FEATURED-002',
    name: 'Champions Sprint Cup',
    location: 'Meydan Racecourse, UAE',
    classLine: 'Group 2',
    date: 'Jun 26, 2026',
    time: '14:00',
    prizePool: '$1,200,000',
    distance: '1,200m',
    surface: 'Tapeta',
    runners: 8,
    status: 'upcoming',
    badge: 'REGISTRATION OPEN',
    image: 'https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=900&q=80',
  },
  {
    id: 'FEATURED-003',
    name: 'Melbourne Cup',
    location: 'Flemington, AUS',
    classLine: 'Group 1',
    date: 'Jul 05, 2026',
    time: '15:00',
    prizePool: '$8,000,000',
    distance: '3,200m',
    surface: 'Turf',
    runners: 24,
    status: 'upcoming',
    badge: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=900&q=80',
  },
  {
    id: 'FEATURED-004',
    name: 'Kentucky Derby',
    location: 'Churchill Downs, KY',
    classLine: 'Grade 1',
    date: 'Jun 10, 2026',
    time: '17:00',
    prizePool: '$3,000,000',
    distance: '2,000m',
    surface: 'Dirt',
    runners: 20,
    status: 'finished',
    badge: 'FINISHED',
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=900&q=80',
    winner: 'Eclipse',
  },
];

// ============================================
// SPECTATOR STATS (for Dashboard & Profile)
// ============================================

export const TEST_SPECTATOR_STATS = {
  totalHorses: '1,248',
  activeDisciplines: '6',
  newSeason: '84',
  totalBets: '24',
  activeBets: '4',
  settledBets: '18',
  lifetimePayouts: '$12,400',
  winRate: '75%',
  totalStaked: '$1,450',
  totalWon: '$710',
  biggestWin: '$520',
};

// ============================================
// HELPER FUNCTIONS FOR TESTING
// ============================================

/**
 * Get races filtered by status
 */
export function getRacesByStatus(status) {
  return TEST_RACES.filter((race) => race.status === status);
}

/**
 * Get bets filtered by status for a specific user
 */
export function getBetsByStatus(userId, status) {
  return TEST_BETS.filter((bet) => bet.userId === userId && bet.status === status);
}

/**
 * Get bets for a specific user
 */
export function getUserBets(userId) {
  return TEST_BETS.filter((bet) => bet.userId === userId);
}

/**
 * Get unread notifications for a user
 */
export function getUnreadNotifications() {
  return TEST_NOTIFICATIONS.filter((notif) => !notif.read);
}

/**
 * Get notifications by type
 */
export function getNotificationsByType(type) {
  return TEST_NOTIFICATIONS.filter((notif) => notif.type === type);
}

/**
 * Calculate user's betting statistics
 */
export function calculateUserStats(userId) {
  const bets = getUserBets(userId);
  const pending = bets.filter((b) => b.status === 'Pending');
  const won = bets.filter((b) => b.status === 'Won');
  const lost = bets.filter((b) => b.status === 'Lost');

  return {
    totalBets: bets.length,
    activeBets: pending.length,
    settledBets: won.length + lost.length,
    wonBets: won.length,
    lostBets: lost.length,
    totalStaked: bets.reduce((sum, b) => sum + b.stake, 0),
    totalWon: won.reduce((sum, b) => sum + (b.actualPayout || 0), 0),
    totalLost: lost.reduce((sum, b) => sum + b.stake, 0),
    winRate: bets.length > 0 ? ((won.length / (won.length + lost.length)) * 100).toFixed(1) + '%' : '0%',
  };
}

/**
 * Get horse by ID
 */
export function getHorseById(horseId) {
  return TEST_HORSES.find((h) => h.id === horseId);
}

/**
 * Get jockey by ID
 */
export function getJockeyById(jockeyId) {
  return TEST_JOCKEYS.find((j) => j.id === jockeyId);
}

/**
 * Get race by ID
 */
export function getRaceById(raceId) {
  return TEST_RACES.find((r) => r.id === raceId);
}

/**
 * Get featured race by ID
 */
export function getFeaturedRaceById(raceId) {
  return TEST_FEATURED_RACES.find((r) => r.id === raceId);
}
