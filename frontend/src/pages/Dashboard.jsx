import { useState } from 'react';
import { RACES_SEED } from '../data/races.js';
import { TOURNAMENT_SEED } from '../data/tournament.js';
import { REFEREES_POOL } from '../data/referees.js';
import { EMERALD } from '../utils/constants.js';
import { fmtDate, fmtMillions } from '../utils/format.js';
import SectionTitle from '../components/common/SectionTitle.jsx';
import Card from '../components/common/Card.jsx';
import StatusPill from '../components/common/StatusPill.jsx';

export default function Dashboard() {
  const [races] = useState(RACES_SEED);

  const pendingCount = races
    .flatMap((r) => r.registrations)
    .filter((r) => r.status === 'Pending').length;

  const approvedCount = races
    .flatMap((r) => r.registrations)
    .filter((r) => r.status === 'Approved').length;

  const assignedReferees = races.filter((r) => r.refereeId).length;
  const totalHorses = races.flatMap((r) => r.registrations).length;

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: '#F8F7F4', minHeight: '100vh', color: '#111827' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#059669', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
            <i className="ti ti-trophy" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '0.05em' }}>RACING TMS</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Dashboard</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>
          {TOURNAMENT_SEED.organizer}
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
        <SectionTitle icon="layout-dashboard" sub="Overview of the Grand Prix Championship Series 2025 tournament and its current status.">
          Tournament Overview
        </SectionTitle>

        {/* Tournament Info */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>{TOURNAMENT_SEED.name}</h3>
                <StatusPill status={TOURNAMENT_SEED.status} />
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>{TOURNAMENT_SEED.organizer}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {[
              ['Location', TOURNAMENT_SEED.location, 'map-pin'],
              ['Start date', fmtDate(TOURNAMENT_SEED.startDate), 'calendar-event'],
              ['End date', fmtDate(TOURNAMENT_SEED.endDate), 'calendar-off'],
              ['Prize fund', fmtMillions(TOURNAMENT_SEED.totalPrize), 'trophy'],
              ['Reg. deadline', fmtDate(TOURNAMENT_SEED.registrationDeadline), 'clock'],
              ['Contact', TOURNAMENT_SEED.contactEmail, 'mail'],
            ].map(([k, v, ic]) => (
              <div key={k} style={{ background: '#F9FAFB', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className={`ti ti-${ic}`} style={{ fontSize: 12 }} aria-hidden />{k}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</div>
              </div>
            ))}
          </div>
          {TOURNAMENT_SEED.description && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#FAFAFA', borderRadius: 8, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              {TOURNAMENT_SEED.description}
            </div>
          )}
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16 }}>
          {[
            ['Total Races', races.length, '#6B7280', 'trophy'],
            ['Pending Registrations', pendingCount, '#92400E', 'clock'],
            ['Approved Entries', approvedCount, '#059669', 'circle-check'],
            ['Referees Assigned', assignedReferees, '#1E40AF', 'shield-check'],
          ].map(([l, v, c, ic]) => (
            <div key={l} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 11, marginBottom: 6 }}>
                <i className={`ti ti-${ic}`} style={{ color: c }} aria-hidden />{l}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Quick race list */}
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>Races</h3>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{races.length} races total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {races.map(race => {
              const ref = REFEREES_POOL.find(r => r.id === race.refereeId);
              return (
                <div key={race.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F9FAFB', borderRadius: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{race.name}</span>
                      <StatusPill status={race.status} />
                      <span style={{ fontSize: 11, background: '#F3F4F6', color: '#374151', padding: '1px 7px', borderRadius: 20, fontWeight: 500 }}>{race.grade}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', gap: 12 }}>
                      <span><i className="ti ti-map-pin" style={{ marginRight: 3, fontSize: 11 }} aria-hidden />{race.venue}</span>
                      <span><i className="ti ti-calendar" style={{ marginRight: 3, fontSize: 11 }} aria-hidden />{fmtDate(race.date)}</span>
                      <span><i className="ti ti-users" style={{ marginRight: 3, fontSize: 11 }} aria-hidden />{race.registrations.filter(r => r.status === 'Approved').length} approved</span>
                      {ref && <span style={{ color: EMERALD }}><i className="ti ti-shield-check" style={{ marginRight: 3, fontSize: 11 }} aria-hidden />{ref.name}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: EMERALD }}>
                    ${race.prizePool.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
