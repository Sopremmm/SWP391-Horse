import { useState } from 'react';
import { TOURNAMENT_SEED } from '../data/tournament.js';
import { RACES_SEED } from '../data/races.js';
import Header from '../components/layout/Header.jsx';
import Breadcrumb from '../components/layout/Breadcrumb.jsx';
import TournamentModule from '../components/modules/TournamentModule.jsx';
import RefereeModule from '../components/modules/RefereeModule.jsx';
import RegistrationModule from '../components/modules/RegistrationModule.jsx';

export default function Dashboard() {
  const [tournament, setTournament] = useState(TOURNAMENT_SEED);
  const [races,      setRaces]      = useState(RACES_SEED);
  const [page,       setPage]       = useState('tournament');

  const pendingCount = races
    .flatMap((r) => r.registrations)
    .filter((r) => r.status === 'Pending').length;

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: '#F8F7F4', minHeight: '100vh', color: '#111827' }}>
      <Header page={page} setPage={setPage} pendingCount={pendingCount} />
      <Breadcrumb page={page} tournamentName={tournament.name} tournamentStatus={tournament.status} />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
        {page === 'tournament'    && <TournamentModule   tournament={tournament} setTournament={setTournament} races={races} setRaces={setRaces} />}
        {page === 'referee'       && <RefereeModule      races={races} setRaces={setRaces} />}
        {page === 'registration'  && <RegistrationModule races={races} setRaces={setRaces} />}
      </main>
    </div>
  );
}
