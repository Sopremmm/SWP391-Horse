import { useState } from 'react';
import { EMERALD, TOURNAMENT_STATUSES } from '../utils/constants';
import { TOURNAMENT_SEED } from '../data/tournament';
import { RACES_SEED } from '../data/races';
import { fmtDate, fmtMillions } from '../utils/format';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import StatusPill from '../components/common/StatusPill';

export default function TournamentPage() {
  const [tournament] = useState(TOURNAMENT_SEED);

  return (
    <div>
      <SectionTitle icon="trophy" sub="Overview of the tournament — status, prize fund, and key dates.">
        Tournament Overview
      </SectionTitle>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827' }}>{tournament.name}</h3>
              <StatusPill status={tournament.status} />
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>{tournament.organizer}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {[
            ['Location',        tournament.location,                   'map-pin'],
            ['Start date',      fmtDate(tournament.startDate),         'calendar-event'],
            ['End date',        fmtDate(tournament.endDate),           'calendar-off'],
            ['Prize fund',      fmtMillions(tournament.totalPrize),    'trophy'],
            ['Reg. deadline',   fmtDate(tournament.registrationDeadline), 'clock'],
            ['Contact',         tournament.contactEmail,               'mail'],
          ].map(([k, v, ic]) => (
            <div key={k} style={{ background: '#F9FAFB', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className={`ti ti-${ic}`} style={{ fontSize: 12 }} aria-hidden />{k}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</div>
            </div>
          ))}
        </div>
        {tournament.description && (
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#FAFAFA', borderRadius: 8, fontSize: 13, color: '#374151' }}>
            {tournament.description}
          </div>
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16 }}>
        {[
          ['Total Races',  RACES_SEED.length,                                       '#6B7280'],
          ['Total Prize',  '$' + RACES_SEED.reduce((s, r) => s + r.prizePool, 0).toLocaleString(), EMERALD],
          ['Upcoming',     RACES_SEED.filter(r => r.status === 'Upcoming').length,  '#1E40AF'],
          ['Registrations', RACES_SEED.reduce((s, r) => s + r.registrations.length, 0), '#6B7280'],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
