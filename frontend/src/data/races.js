export const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

const makeReg = (raceName, horse, jockey, grade, owner, days) => ({
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
  status: "Pending",
  note: "",
});

export const RACES_SEED = [
  {
    id: "RACE01", name: "Spring Classic", venue: "Churchill Downs",
    date: "2025-04-15", time: "14:00", distance: 1600, grade: "G1",
    prizePool: 500000, condition: "Firm", status: "Upcoming",
    refereeId: null,
    registrations: [
      makeReg("Spring Classic", "Thunder Bolt", "Miguel Torres", "G1", "Sunrise Stables",  5),
      makeReg("Spring Classic", "Silver Arrow", "Carlos Ruiz",   "G1", "Blue River Farm",  3),
      makeReg("Spring Classic", "Dark Knight",  "Emma Sinclair", "G1", "Nightfall Racing", 7),
      makeReg("Spring Classic", "Desert Storm", "James O'Brien", "G1", "Desert Run LLC",   2),
    ],
  },
  {
    id: "RACE02", name: "Derby Cup", venue: "Royal Ascot",
    date: "2025-05-20", time: "15:30", distance: 2000, grade: "G1",
    prizePool: 750000, condition: "Good", status: "Upcoming",
    refereeId: "R01",
    registrations: [
      makeReg("Derby Cup", "Golden Flash", "Yuki Tanaka",   "G1", "Golden Gate Stables", 10),
      makeReg("Derby Cup", "Iron Fist",    "Lucas Martini", "G1", "Iron Forge Racing",    8),
    ],
  },
  {
    id: "RACE03", name: "Mid-Season Stakes", venue: "Flemington",
    date: "2025-06-10", time: "13:00", distance: 1400, grade: "G2",
    prizePool: 250000, condition: "Soft", status: "Upcoming",
    refereeId: "R02",
    registrations: [
      makeReg("Mid-Season Stakes", "Phantom Rider", "Sofia Costa", "G2", "Phantom LLC",      4),
      makeReg("Mid-Season Stakes", "Blue Horizon",  "Andre Blanc", "G2", "Azure Farms",       6),
      makeReg("Mid-Season Stakes", "Red Wind",      "Priya Patel", "G2", "Red Rock Stables",  1),
    ],
  },
  {
    id: "RACE04", name: "Golden Handicap", venue: "Santa Anita",
    date: "2025-07-05", time: "16:00", distance: 1800, grade: "G3",
    prizePool: 150000, condition: "Fast", status: "Upcoming",
    refereeId: null,
    registrations: [],
  },
];
