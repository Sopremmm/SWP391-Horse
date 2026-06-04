import { GOLD } from '../../utils/constants.js';
import StatusPill from '../common/StatusPill.jsx';

const PAGE_LABELS = {
  tournament:   'Tournament',
  referee:      'Referee Assignment',
  registration: 'Registrations',
};

export default function Breadcrumb({ page, tournamentName, tournamentStatus }) {
  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      padding: '8px 24px',
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 12, color: '#6B7280',
      fontFamily: 'sans-serif',
    }}>
      <i className="ti ti-home" style={{ fontSize: 13 }} aria-hidden />
      <span>/</span>
      <span style={{ color: GOLD, fontWeight: 500 }}>{PAGE_LABELS[page]}</span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 8 }}>
        {tournamentName}
        <StatusPill status={tournamentStatus} />
      </span>
    </div>
  );
}
