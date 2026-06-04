import { useState } from 'react';
import { EMERALD, EMERALD_LIGHT, EMERALD_BORDER } from '../utils/constants';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Field from '../components/common/Field';
import Input from '../components/common/Input';

const JOCKEYS_SEED = [
  { id: 'J01', name: 'Miguel Torres',    age: 34, license: 'JLN-2847', nationality: 'Mexico',    speciality: 'Flat Racing', races: 120, wins: 38, available: true,  invited: false },
  { id: 'J02', name: 'Carlos Ruiz',      age: 28, license: 'JLN-3156', nationality: 'Spain',      speciality: 'Flat Racing', races: 85,  wins: 22, available: true,  invited: false },
  { id: 'J03', name: 'Emma Sinclair',     age: 31, license: 'JLN-2201', nationality: 'UK',         speciality: 'Flat Racing', races: 200, wins: 67, available: false, invited: true  },
  { id: 'J04', name: "James O'Brien",   age: 40, license: 'JLN-1893', nationality: 'Ireland',   speciality: 'Jump Racing', races: 310, wins: 95, available: true,  invited: true  },
  { id: 'J05', name: 'Yuki Tanaka',      age: 26, license: 'JLN-4022', nationality: 'Japan',      speciality: 'Flat Racing', races: 45,  wins: 12, available: true,  invited: false },
  { id: 'J06', name: 'Lucas Martini',    age: 33, license: 'JLN-2556', nationality: 'Italy',      speciality: 'Flat Racing', races: 150, wins: 44, available: true,  invited: false },
  { id: 'J07', name: 'Sofia Costa',       age: 29, license: 'JLN-3788', nationality: 'Brazil',    speciality: 'Flat Racing', races: 78,  wins: 19, available: false, invited: true  },
  { id: 'J08', name: 'Andre Blanc',       age: 37, license: 'JLN-1433', nationality: 'France',     speciality: 'Flat Racing', races: 230, wins: 71, available: true,  invited: false },
];

export default function JockeysPage() {
  const [jockeys, setJockeys] = useState(JOCKEYS_SEED);
  const [filter, setFilter] = useState('All');
  const [inviteModal, setInviteModal] = useState(null);
  const [inviteForm, setInviteForm] = useState({ race: '', message: '' });

  const filtered = jockeys.filter(j => {
    if (filter === 'Invited') return j.invited;
    if (filter === 'Available') return j.available;
    if (filter === 'Not Invited') return !j.invited;
    return true;
  });

  const sendInvite = () => {
    setJockeys(js => js.map(j => j.id === inviteModal.id ? { ...j, invited: true } : j));
    setInviteModal(null);
  };

  const revokeInvite = (id) => {
    setJockeys(js => js.map(j => j.id === id ? { ...j, invited: false } : j));
  };

  const tabStyle = (s) => {
    const active = filter === s;
    return { padding: '6px 14px', fontSize: 12, fontWeight: 500, borderRadius: 8, background: active ? EMERALD : 'transparent', color: active ? '#111827' : '#6B7280', border: `1px solid ${active ? EMERALD_BORDER : '#E5E7EB'}`, cursor: 'pointer', fontFamily: 'inherit' };
  };

  return (
    <div>
      <SectionTitle icon="user" sub="Invite jockeys to participate in races. Manage invitations and track responses.">
        Jockey Invitation
      </SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          ['Total Jockeys', jockeys.length, '#6B7280'],
          ['Available',     jockeys.filter(j => j.available).length, '#166534'],
          ['Invited',      jockeys.filter(j => j.invited).length, EMERALD],
          ['Pending Invite',jockeys.filter(j => j.available && !j.invited).length, '#92400E'],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['All', 'Available', 'Invited', 'Not Invited'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={tabStyle(s)}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {filtered.map(jockey => (
          <Card key={jockey.id} style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: jockey.available ? EMERALD_LIGHT : '#F3F4F6',
                  border: `1px solid ${jockey.available ? EMERALD_BORDER : '#E5E7EB'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                  color: jockey.available ? EMERALD : '#9CA3AF',
                }}>
                  {jockey.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{jockey.name}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{jockey.license} · {jockey.nationality}</div>
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                background: jockey.available ? '#D1FAE5' : '#FEE2E2',
                color: jockey.available ? '#166534' : '#991B1B',
              }}>
                {jockey.available ? 'AVAILABLE' : 'UNAVAILABLE'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: 11, color: '#6B7280' }}>
              <span><i className="ti ti-calendar" style={{ marginRight: 3 }} aria-hidden />Age: {jockey.age}</span>
              <span><i className="ti ti-run" style={{ marginRight: 3 }} aria-hidden />{jockey.races} races</span>
              <span><i className="ti ti-trophy" style={{ marginRight: 3 }} aria-hidden />{jockey.wins} wins</span>
            </div>

            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>
              <i className="ti ti-star" style={{ marginRight: 3 }} aria-hidden />{jockey.speciality}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {!jockey.invited ? (
                <Button
                  small variant="primary"
                  onClick={() => { setInviteModal(jockey); setInviteForm({ race: '', message: `Dear ${jockey.name}, you are invited to participate in our upcoming races.` }); }}
                  icon="send"
                >
                  Send Invite
                </Button>
              ) : (
                <>
                  <span style={{ fontSize: 11, color: EMERALD, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ti ti-circle-check" aria-hidden /> Invited
                  </span>
                  <Button small variant="ghost" onClick={() => revokeInvite(jockey.id)} icon="x">Revoke</Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {inviteModal && (
        <Modal title={`Send Invitation — ${inviteModal.name}`} onClose={() => setInviteModal(null)}>
          <div style={{ background: EMERALD_LIGHT, border: `1px solid ${EMERALD_BORDER}`, borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
            <strong>{inviteModal.name}</strong> · {inviteModal.license} · {inviteModal.speciality}
          </div>
          <Field label="Select Race" required>
            <Input value={inviteForm.race} onChange={v => setInviteForm(f => ({ ...f, race: v }))} placeholder="e.g. Spring Classic — Churchill Downs" />
          </Field>
          <Field label="Invitation Message">
            <textarea
              rows={4}
              value={inviteForm.message}
              onChange={e => setInviteForm(f => ({ ...f, message: e.target.value }))}
              style={{ width: '100%', padding: '8px 11px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </Field>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setInviteModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={sendInvite} icon="send">Send Invitation</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
