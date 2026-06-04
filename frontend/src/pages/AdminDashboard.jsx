import { useNavigate } from 'react-router-dom';
import { EMERALD, STATUS_STYLES } from '../utils/constants';
import { RACES_SEED } from '../data/races';
import { TOURNAMENT_SEED } from '../data/tournament';
import { REFEREES_POOL } from '../data/referees';

const allRegs = RACES_SEED.flatMap(r => r.registrations.map(reg => ({ ...reg, raceId: r.id, raceName: r.name })));
const counts = {
  races: RACES_SEED.length,
  upcoming: RACES_SEED.filter(r => r.status === 'Upcoming').length,
  running: RACES_SEED.filter(r => r.status === 'Running').length,
  finished: RACES_SEED.filter(r => r.status === 'Finished').length,
  referees: REFEREES_POOL.length,
  available: REFEREES_POOL.filter(r => r.available).length,
  pending: allRegs.filter(r => r.status === 'Pending').length,
  approved: allRegs.filter(r => r.status === 'Approved').length,
  totalPrize: RACES_SEED.reduce((s, r) => s + r.prizePool, 0),
};

const statusColor = (s) => {
  const map = {
    Active: '#DCFCE7', Upcoming: '#DBEAFE', Running: '#FEF3C7',
    Finished: '#D1FAE5', Cancelled: '#FEE2E2', Draft: '#F3F4F6',
    Pending: '#FEF9C3', Approved: '#D1FAE5', Rejected: '#FEE2E2',
  };
  return map[s] || '#F3F4F6';
};
const statusText = (s) => {
  const map = {
    Active: '#166534', Upcoming: '#1E40AF', Running: '#92400E',
    Finished: '#065F46', Cancelled: '#991B1B', Draft: '#374151',
    Pending: '#713F12', Approved: '#065F46', Rejected: '#991B1B',
  };
  return map[s] || '#374151';
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Races',    value: counts.races,    icon: 'run',            color: '#1E40AF', onClick: () => navigate('/admin/races') },
    { label: 'Upcoming',       value: counts.upcoming,  icon: 'clock',          color: '#92400E', onClick: () => navigate('/admin/races') },
    { label: 'Running',       value: counts.running,   icon: 'player-play',    color: '#6B7280', onClick: () => navigate('/admin/races') },
    { label: 'Finished',      value: counts.finished,  icon: 'circle-check',   color: '#166534', onClick: () => navigate('/admin/races') },
    { label: 'Total Prize',   value: '$' + counts.totalPrize.toLocaleString(), icon: 'trophy', color: EMERALD, onClick: () => navigate('/admin/tournament') },
    { label: 'Referees',      value: `${counts.referees} (${counts.available} avail.)`, icon: 'shield-check', color: '#374151', onClick: () => navigate('/admin/referees') },
    { label: 'Registrations', value: counts.pending,   icon: 'clipboard-check', color: '#713F12', onClick: () => navigate('/admin/registrations') },
    { label: 'Approved',      value: counts.approved, icon: 'circle-check',   color: '#065F46', onClick: () => navigate('/admin/registrations') },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
          {TOURNAMENT_SEED.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20,
            background: STATUS_STYLES.Active.bg, color: STATUS_STYLES.Active.color,
            border: `1px solid ${STATUS_STYLES.Active.border}`,
          }}>
            {TOURNAMENT_SEED.status.toUpperCase()}
          </span>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            {TOURNAMENT_SEED.organizer}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map(({ label, value, icon, color, onClick }) => (
          <div
            key={label}
            onClick={onClick}
            style={{
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
              padding: '16px 18px', cursor: onClick ? 'pointer' : 'default',
              transition: 'box-shadow .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <i className={`ti ti-${icon}`} style={{ fontSize: 16, color }} aria-hidden />
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Upcoming Races</span>
            <button onClick={() => navigate('/admin/races')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: EMERALD, fontFamily: 'inherit', fontWeight: 500 }}>
              View all
            </button>
          </div>
          {RACES_SEED.filter(r => r.status === 'Upcoming').map((race, i, arr) => (
            <div key={race.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: i < arr.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{race.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{race.venue} · {race.date} · {race.distance}m</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: statusColor(race.status), color: statusText(race.status), marginBottom: 4 }}>
                  {race.status}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>${race.prizePool.toLocaleString()}</div>
              </div>
            </div>
          ))}
          {RACES_SEED.filter(r => r.status === 'Upcoming').length === 0 && (
            <div style={{ padding: '24px 18px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No upcoming races</div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Pending Registrations</span>
            <button onClick={() => navigate('/admin/registrations')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: EMERALD, fontFamily: 'inherit', fontWeight: 500 }}>
              View all
            </button>
          </div>
          {allRegs.filter(r => r.status === 'Pending').slice(0, 5).map((reg, i, arr) => (
            <div key={reg.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: i < arr.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{reg.horseName}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{reg.jockeyName} · {reg.raceName}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: '#FEF9C3', color: '#713F12' }}>Pending</span>
            </div>
          ))}
          {allRegs.filter(r => r.status === 'Pending').length === 0 && (
            <div style={{ padding: '24px 18px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No pending registrations</div>
          )}
        </div>
      </div>
    </div>
  );
}
