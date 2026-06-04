import { EMERALD, EMERALD_LIGHT, EMERALD_BORDER } from '../../utils/constants';

export default function SectionTitle({ icon, children, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: EMERALD_LIGHT,
            border: `1px solid ${EMERALD_BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className={`ti ti-${icon}`} style={{ fontSize: 18, color: EMERALD }} aria-hidden />
        </div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>{children}</h2>
      </div>
      {sub && (
        <p style={{ margin: '6px 0 0 46px', fontSize: 13, color: '#6B7280' }}>{sub}</p>
      )}
    </div>
  );
}
