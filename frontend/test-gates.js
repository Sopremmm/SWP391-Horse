const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@demo.com',
      password: '123456'
    });
    const token = login.data.token;
    
    // Find a tournament
    const t = await axios.get('http://localhost:8080/api/tournaments');
    const tId = t.data[0].id;
    
    // Find races
    const races = await axios.get(`http://localhost:8080/api/tournaments/${tId}/races`);
    const rId = races.data[0].id;
    
    // Find horses
    const horses = await axios.get('http://localhost:8080/api/admin/horses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const hId = horses.data[0].id;
    
    console.log(`Setting gate for race ${rId} with horse ${hId}`);
    
    const res = await axios.post(`http://localhost:8080/api/admin/races/${rId}/gates`, {
      gateCount: 6,
      assignments: [{ gateNumber: 1, horseId: hId }]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Saved gates:", res.data.gatesConfigured);
    
    const entries = await axios.get(`http://localhost:8080/api/entries/tournament/${tId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const raceEntries = entries.data.filter(e => e.race && e.race.id === rId);
    console.log("Entries in race:", raceEntries.length);
    if (raceEntries.length > 0) {
      console.log("Entry race id:", raceEntries[0].race.id);
      console.log("Entry gate:", raceEntries[0].gateNumber);
    }
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
