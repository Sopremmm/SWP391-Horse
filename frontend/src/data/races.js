export const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

// Registrations with 'Approved' status for betting (SpectatorRaceCard checks Approved)
const makeReg = (raceName, horse, jockey, grade, owner, days, odds = null) => ({
  id: uid(),
  submittedAt: new Date(Date.now() - days * 86400000).toISOString(),
  ownerName: owner,
  horseName: horse,
  horseAge: 3 + Math.floor(Math.random() * 5),
  horseColor: ["Bay", "Chestnut", "Grey", "Black", "Roan"][Math.floor(Math.random() * 5)],
  jockeyName: jockey,
  licenseNo: "JLN-" + Math.floor(Math.random() * 9000 + 1000),
  trainerName: ["Williams", "García", "Brown", "Davis", "Smith"][Math.floor(Math.random() * 5)],
  raceName,
  grade,
  odds: odds || (3 + Math.random() * 7).toFixed(1),
  status: "Approved", // Use 'Approved' so spectator can bet
  note: "",
});

// Pre-generated races for consistent test data
export const RACES_SEED = [
  // === UPCOMING RACES ===
  {
    id: "RACE01", name: "Heritage Derby Finals", venue: "Epsom Downs, UK",
    date: "2026-06-25", time: "15:30", distance: 2400, grade: "G1",
    prizePool: 5000000, condition: "Firm", status: "Upcoming",
    refereeId: null, image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=85",
    registrations: [
      { ...makeReg("Heritage Derby Finals", "Thunder Bolt", "Miguel Torres", "G1", "Thunder Stables", 5, 4.2), position: null, result: null },
      { ...makeReg("Heritage Derby Finals", "Silver Arrow", "Carlos Ruiz", "G1", "Silver Farms", 3, 5.5), position: null, result: null },
      { ...makeReg("Heritage Derby Finals", "Dark Knight", "Emma Sinclair", "G1", "Nightfall Racing", 7, 6.8), position: null, result: null },
      { ...makeReg("Heritage Derby Finals", "Desert Storm", "James O'Brien", "G1", "Desert Run LLC", 2, 8.0), position: null, result: null },
    ],
  },
  {
    id: "RACE02", name: "Champions Sprint Cup", venue: "Meydan Racecourse, UAE",
    date: "2026-06-26", time: "14:00", distance: 1200, grade: "G2",
    prizePool: 1200000, condition: "Fast", status: "Upcoming",
    refereeId: "R01", image: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=85",
    registrations: [
      { ...makeReg("Champions Sprint Cup", "Silver Arrow", "Carlos Ruiz", "G2", "Silver Farms", 10, 3.5), position: null, result: null },
      { ...makeReg("Champions Sprint Cup", "Red Blazer", "Miguel Torres", "G2", "Red Racing", 8, 4.8), position: null, result: null },
      { ...makeReg("Champions Sprint Cup", "Blue Horizon", "Yuki Tanaka", "G2", "Blue Sky Stables", 6, 6.2), position: null, result: null },
    ],
  },
  {
    id: "RACE03", name: "Melbourne Cup", venue: "Flemington, AUS",
    date: "2026-07-05", time: "15:00", distance: 3200, grade: "G1",
    prizePool: 8000000, condition: "Good", status: "Upcoming",
    refereeId: null, image: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1200&q=85",
    registrations: [
      { ...makeReg("Melbourne Cup", "Royal Velvet", "Sophia Lee", "G1", "Royal Racing", 4, 7.5), position: null, result: null },
      { ...makeReg("Melbourne Cup", "Mystic Bay", "Tom Wilson", "G1", "Mystic Farms", 6, 9.2), position: null, result: null },
    ],
  },
  // === ONGOING RACE ===
  {
    id: "RACE04", name: "Belmont Stakes", venue: "Belmont Park, NY",
    date: "2026-06-19", time: "16:00", distance: 2400, grade: "G1",
    prizePool: 1500000, condition: "Firm", status: "Ongoing",
    refereeId: "R02", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=85",
    progress: 68, elapsedTime: "01:37",
    registrations: [
      { ...makeReg("Belmont Stakes", "Thunder Dash", "Liam Hamilton", "G1", "Dash Racing", 5, 4.2), position: 1, result: null },
      { ...makeReg("Belmont Stakes", "Noble Spirit", "Sophie Whitmore", "G1", "Noble Stables", 3, 5.5), position: 2, result: null },
      { ...makeReg("Belmont Stakes", "Midnight Legend", "Arthur Thorne", "G1", "Midnight LLC", 7, 6.8), position: 3, result: null },
      { ...makeReg("Belmont Stakes", "Velvet Storm", "Elena Vance", "G1", "Velvet Farms", 2, 8.0), position: 4, result: null },
    ],
  },
  // === FINISHED RACES ===
  {
    id: "RACE05", name: "Kentucky Derby", venue: "Churchill Downs, KY",
    date: "2026-06-10", time: "17:00", distance: 2000, grade: "G1",
    prizePool: 3000000, condition: "Firm", status: "Finished",
    refereeId: "R03", image: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1200&q=85",
    registrations: [
      { ...makeReg("Kentucky Derby", "Eclipse", "Carlos Ruiz", "G1", "Eclipse Stables", 5, 5.2), position: 1, result: 1 },
      { ...makeReg("Kentucky Derby", "Golden Flash", "Yuki Tanaka", "G1", "Golden Gate", 8, 4.5), position: 2, result: 2 },
      { ...makeReg("Kentucky Derby", "Iron Fist", "Lucas Martini", "G1", "Iron Forge", 6, 7.0), position: 3, result: 3 },
      { ...makeReg("Kentucky Derby", "Crimson Tide", "Marcus Webb", "G1", "Crimson Racing", 2, 9.5), position: 4, result: 4 },
    ],
    winner: { horseName: "Eclipse", jockeyName: "Carlos Ruiz", payout: 1560000 },
  },
  {
    id: "RACE06", name: "Dubai World Cup", venue: "Meydan Racecourse, UAE",
    date: "2026-06-05", time: "20:30", distance: 2000, grade: "G1",
    prizePool: 12000000, condition: "Tapeta", status: "Finished",
    refereeId: "R04", image: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=1200&q=85",
    registrations: [
      { ...makeReg("Dubai World Cup", "Thunder Dash", "Liam Hamilton", "G1", "Dash Racing", 5, 3.8), position: 1, result: 1 },
      { ...makeReg("Dubai World Cup", "Silver Ghost", "Sophie Whitmore", "G1", "Silver Farms", 8, 5.0), position: 2, result: 2 },
      { ...makeReg("Dubai World Cup", "Phantom Rider", "Arthur Thorne", "G1", "Phantom LLC", 6, 8.5), position: 3, result: 3 },
    ],
    winner: { horseName: "Thunder Dash", jockeyName: "Liam Hamilton", payout: 45600000 },
  },
];
