import { useState } from 'react';
import { EMERALD, EMERALD_LIGHT, EMERALD_BORDER } from '../utils/constants';
import { RACES_SEED } from '../data/races';
import { REFEREES_POOL } from '../data/referees';
import { fmtDate } from '../utils/format';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import StatusPill from '../components/common/StatusPill';

function Toast({ msg, type }) {
  const styles = {
    success: { bg: '#F0FDF4', color: '#166534', border: '#86EFAC', icon: 'circle-check' },
    info:    { bg: '#EFF6FF', color: '#1E40AF', border: '#93C5FD', icon: 'info-circle'  },
    danger:  { bg: '#FFF1F2', color: '#9F1239', border: '#FECDD3', icon: 'circle-x'     },
  };
  const s = styles[type] || styles.success;
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 99999,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 10, padding: '12px 18px', fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <i className={`ti ti-${s.icon}`} aria-hidden />
      {msg}
    </div>
  );
}

const initials = (name) => name.split(' ').map(n => n[0]).join('');

export default function RefereePage() {
  const [races, setRaces] = useState(RACES_SEED);
  const [selectedRace, setSelectedRace] = useState(null);
  const [confirmAssign, setConfirmAssign] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const assign = (raceId, refId) => {
    setRaces(rs => rs.map(r => r.id === raceId ? { ...r, refereeId: refId } : r));
    setConfirmAssign(null);
    setSelectedRace(null);
    showToast('Referee assigned successfully.');
  };

  const unassign = (raceId) => {
    setRaces(rs => rs.map(r => r.id === raceId ? { ...r, refereeId: null } : r));
    showToast('Referee removed from race.', 'info');
  };

  return (
    <div>
      <SectionTitle icon="shield-check" sub="Assign certified referees to races. Only available referees can be selected.">
        Assign Referee to Race
      </SectionTitle>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>Referee Roster</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REFEREES_POOL.map(ref => (
              <div key={ref.id} style={{
                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px',
                opacity: ref.available ? 1 : 0.65,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: ref.available ? EMERALD_LIGHT : '#F3F4F6',
                      border: `1px solid ${ref.available ? EMERALD_BORDER : '#E5E7EB'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: ref.available ? EMERALD : '#9CA3AF',
                    }}>
                      {initials(ref.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{ref.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{ref.badge} · {ref.speciality}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
                    background: ref.available ? '#D1FAE5' : '#FEE2E2',
                    color: ref.available ? '#166534' : '#991B1B',
                  }}>
                    {ref.available ? 'AVAILABLE' : 'BUSY'}
                  </span>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: '#9CA3AF', display: 'flex', gap: 12 }}>
                  <span><i className="ti ti-award" style={{ marginRight: 3 }} aria-hidden />{ref.experience} yrs exp.</span>
                  <span><i className="ti ti-mail"  style={{ marginRight: 3 }} aria-hidden />{ref.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>Race Assignments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {races.map(race => {
              const ref = REFEREES_POOL.find(r => r.id === race.refereeId);
              return (
                <div key={race.id} style={{
                  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px',
                  borderLeft: ref ? `3px solid ${EMERALD}` : '3px solid #E5E7EB',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{race.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{race.venue} · {fmtDate(race.date)}</div>
                    </div>
                    <StatusPill status={race.status} />
                  </div>

                  {ref ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: EMERALD_LIGHT, border: `1px solid ${EMERALD_BORDER}`, borderRadius: 8, padding: '7px 10px' }}>
                      <div style={{ fontSize: 12, color: '#92400E' }}>
                        <i className="ti ti-shield-check" style={{ marginRight: 5 }} aria-hidden />
                        <strong>{ref.name}</strong> <span style={{ fontWeight: 400 }}>({ref.badge})</span>
                      </div>
                      {race.status !== 'Finished' && (
                        <button onClick={() => unassign(race.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#92400E', textDecoration: 'underline', fontFamily: 'inherit' }}>
                          Remove
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontStyle: 'italic' }}>No referee assigned</div>
                      {race.status !== 'Finished' && race.status !== 'Cancelled' && (
                        <Button small variant="info" onClick={() => setSelectedRace(race)} icon="user-plus">Assign Referee</Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedRace && (
        <Modal title={`Assign Referee — ${selectedRace.name}`} onClose={() => setSelectedRace(null)}>
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#374151' }}>
            <strong>{selectedRace.venue}</strong> · {fmtDate(selectedRace.date)} {selectedRace.time} · {selectedRace.distance}m · {selectedRace.grade}
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px' }}>Select an available referee:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REFEREES_POOL.filter(r => r.available).map(ref => (
              <div key={ref.id}
                style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setConfirmAssign({ race: selectedRace, ref })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: EMERALD_LIGHT, border: `1px solid ${EMERALD_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: EMERALD }}>
                    {initials(ref.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{ref.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{ref.badge} · {ref.speciality} · {ref.experience} yrs</div>
                  </div>
                </div>
                <Button small variant="primary" icon="check">Select</Button>
              </div>
            ))}
            {REFEREES_POOL.filter(r => r.available).length === 0 && (
              <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, padding: '20px 0' }}>
                No available referees at this time.
              </div>
            )}
          </div>
        </Modal>
      )}

      {confirmAssign && (
        <Modal title="Confirm Assignment" onClose={() => setConfirmAssign(null)}>
          <p style={{ fontSize: 14, color: '#374151', margin: '0 0 14px' }}>
            Assign <strong>{confirmAssign.ref.name}</strong> ({confirmAssign.ref.badge}) as referee for <strong>{confirmAssign.race.name}</strong>?
          </p>
          <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1E40AF', marginBottom: 14 }}>
            <i className="ti ti-info-circle" style={{ marginRight: 6 }} aria-hidden />
            This referee will be responsible for officiating and ensuring compliance during this race.
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setConfirmAssign(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => assign(confirmAssign.race.id, confirmAssign.ref.id)} icon="shield-check">Confirm Assignment</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
