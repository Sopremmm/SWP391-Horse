/**
 * Spectator Bets Seed Data
 * Mock betting history for testing spectator flows
 */

// Pre-generated bets for consistent test data
export const BETS_SEED = [
  // === PENDING BETS (race not finished) ===
  {
    id: "BET-001",
    userId: "U009",
    raceId: "RACE01",
    raceName: "Heritage Derby Finals",
    raceVenue: "Epsom Downs, UK",
    raceDate: "2026-06-25",
    horseName: "Thunder Bolt",
    horseId: "HORSE-001",
    jockeyName: "Miguel Torres",
    stake: 50,
    odds: 4.2,
    potentialPayout: 210,
    actualPayout: null,
    status: "Pending",
    placedAt: "2026-06-18T10:30:00Z",
    settledAt: null,
    raceImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&q=80",
  },
  {
    id: "BET-002",
    userId: "U009",
    raceId: "RACE02",
    raceName: "Champions Sprint Cup",
    raceVenue: "Meydan Racecourse, UAE",
    raceDate: "2026-06-26",
    horseName: "Silver Arrow",
    horseId: "HORSE-002",
    jockeyName: "Carlos Ruiz",
    stake: 100,
    odds: 3.5,
    potentialPayout: 350,
    actualPayout: null,
    status: "Pending",
    placedAt: "2026-06-18T14:45:00Z",
    settledAt: null,
    raceImage: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=200&q=80",
  },
  {
    id: "BET-003",
    userId: "U009",
    raceId: "RACE03",
    raceName: "Melbourne Cup",
    raceVenue: "Flemington, AUS",
    raceDate: "2026-07-05",
    horseName: "Royal Velvet",
    horseId: "HORSE-003",
    jockeyName: "Sophia Lee",
    stake: 75,
    odds: 7.5,
    potentialPayout: 562.5,
    actualPayout: null,
    status: "Pending",
    placedAt: "2026-06-19T09:15:00Z",
    settledAt: null,
    raceImage: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=200&q=80",
  },
  {
    id: "BET-004",
    userId: "U009",
    raceId: "RACE04",
    raceName: "Belmont Stakes",
    raceVenue: "Belmont Park, NY",
    raceDate: "2026-06-19",
    horseName: "Thunder Dash",
    horseId: "HORSE-004",
    jockeyName: "Liam Hamilton",
    stake: 60,
    odds: 4.2,
    potentialPayout: 252,
    actualPayout: null,
    status: "Pending",
    placedAt: "2026-06-19T15:50:00Z",
    settledAt: null,
    raceImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&q=80",
  },
  // === WON BETS ===
  {
    id: "BET-005",
    userId: "U009",
    raceId: "RACE05",
    raceName: "Kentucky Derby",
    raceVenue: "Churchill Downs, KY",
    raceDate: "2026-06-10",
    horseName: "Eclipse",
    horseId: "HORSE-005",
    jockeyName: "Carlos Ruiz",
    stake: 100,
    odds: 5.2,
    potentialPayout: 520,
    actualPayout: 520,
    status: "Won",
    placedAt: "2026-06-05T11:24:00Z",
    settledAt: "2026-06-10T19:30:00Z",
    raceImage: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=200&q=80",
  },
  {
    id: "BET-006",
    userId: "U009",
    raceId: "RACE06",
    raceName: "Dubai World Cup",
    raceVenue: "Meydan Racecourse, UAE",
    raceDate: "2026-06-05",
    horseName: "Thunder Dash",
    horseId: "HORSE-004",
    jockeyName: "Liam Hamilton",
    stake: 50,
    odds: 3.8,
    potentialPayout: 190,
    actualPayout: 190,
    status: "Won",
    placedAt: "2026-06-01T16:00:00Z",
    settledAt: "2026-06-05T22:45:00Z",
    raceImage: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=200&q=80",
  },
  // === LOST BETS ===
  {
    id: "BET-007",
    userId: "U009",
    raceId: "RACE-OLD-001",
    raceName: "Eclipse Stakes",
    raceVenue: "Sandown Park, UK",
    raceDate: "2026-05-22",
    horseName: "Mystic Bay",
    horseId: "HORSE-006",
    jockeyName: "Tom Wilson",
    stake: 60,
    odds: 5.2,
    potentialPayout: 312,
    actualPayout: 0,
    status: "Lost",
    placedAt: "2026-05-18T10:00:00Z",
    settledAt: "2026-05-22T16:30:00Z",
    raceImage: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200&q=80",
  },
  {
    id: "BET-008",
    userId: "U009",
    raceId: "RACE-OLD-002",
    raceName: "Royal Ascot Gold Cup",
    raceVenue: "Ascot, UK",
    raceDate: "2026-05-15",
    horseName: "Silver Ghost",
    horseId: "HORSE-007",
    jockeyName: "Sophie Whitmore",
    stake: 40,
    odds: 6.0,
    potentialPayout: 240,
    actualPayout: 0,
    status: "Lost",
    placedAt: "2026-05-10T13:45:00Z",
    settledAt: "2026-05-15T18:20:00Z",
    raceImage: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&q=80",
  },
];

// Helper functions
export function getBetsByUser(userId) {
  return BETS_SEED.filter((bet) => bet.userId === userId);
}

export function getBetsByStatus(userId, status) {
  return BETS_SEED.filter((bet) => bet.userId === userId && bet.status === status);
}

export function getPendingBets(userId) {
  return getBetsByStatus(userId, "Pending");
}

export function getSettledBets(userId) {
  return BETS_SEED.filter(
    (bet) => bet.userId === userId && (bet.status === "Won" || bet.status === "Lost")
  );
}

export function calculateBettingStats(userId) {
  const bets = getBetsByUser(userId);
  const pending = getPendingBets(userId);
  const won = getBetsByStatus(userId, "Won");
  const lost = getBetsByStatus(userId, "Lost");

  const totalStaked = bets.reduce((sum, b) => sum + b.stake, 0);
  const totalWon = won.reduce((sum, b) => sum + (b.actualPayout || 0), 0);
  const settledCount = won.length + lost.length;
  const winRate = settledCount > 0 ? ((won.length / settledCount) * 100).toFixed(0) + "%" : "0%";

  return {
    totalBets: bets.length,
    activeBets: pending.length,
    settledBets: settledCount,
    wonBets: won.length,
    lostBets: lost.length,
    totalStaked,
    totalWon,
    netProfit: totalWon - totalStaked,
    winRate,
  };
}
