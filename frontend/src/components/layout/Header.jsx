import { GOLD, GOLD_BORDER } from '../../utils/constants.js';

export default function Header({ page, setPage, pendingCount }) {
  const nav = [
    { id: 'tournament',   label: 'Tournament',          icon: 'trophy'          },
    { id: 'referee',     label: 'Referee Assignment',   icon: 'shield-check'    },
    { id: 'registration',label: 'Registrations',        icon: 'clipboard-check' },
  ];

  return (
    <div style={{
      background: '#111827', color: '#fff',
      padding: '0 24px', height: 56,
      display: 'flex', alignItems: 'center', gap: 16,
      borderBottom: `2px solid ${GOLD}`,
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, background: GOLD, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className="ti ti-trophy" style={{ fontSize: 18, color: '#111827' }} aria-hidden />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.03em', fontFamily: "'Georgia',serif" }}>
            RACING TMS
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', letterSpacing: '0.08em' }}>
            ADMIN PANEL
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <nav style={{ display: 'flex', gap: 4 }}>
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', fontSize: 12, fontWeight: 500,
              background: page === n.id ? GOLD : 'transparent',
              color: page === n.id ? '#111827' : '#9CA3AF',
              border: page === n.id ? `1px solid ${GOLD_BORDER}` : '1px solid transparent',
              borderRadius: 8, cursor: 'pointer', transition: 'all .15s',
              fontFamily: 'inherit', position: 'relative',
            }}
          >
            <i className={`ti ti-${n.icon}`} style={{ fontSize: 14 }} aria-hidden />
            {n.label}
            {n.id === 'registration' && pendingCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#EF4444', color: '#fff',
                fontSize: 10, fontWeight: 700,
                width: 17, height: 17, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #111827',
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#374151', border: '1px solid #4B5563',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#E5E7EB',
        }}>
          A
        </div>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>Admin</span>
      </div>
    </div>
  );
}
