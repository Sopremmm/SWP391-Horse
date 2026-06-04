import { useState } from 'react';
import { RACES_SEED } from '../data/races';
import { REFEREES_POOL } from '../data/referees';
import { GRADES, CONDITIONS, RACE_STATUSES } from '../utils/constants';
import { fmtDate } from '../utils/format';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import StatusPill from '../components/common/StatusPill';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Field from '../components/common/Field';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const EMPTY_RACE = {
  name: '', venue: '', date: '', time: '14:00',
  distance: '1600', grade: 'G1', prizePool: '100000',
  condition: 'Firm', status: 'Upcoming',
};

export default function RacesPage() {
  const [races, setRaces] = useState(RACES_SEED);
  const [filterStatus, setFilterStatus] = useState('All');
  const [editRace, setEditRace] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = filterStatus === 'All' ? races : races.filter(r => r.status === filterStatus);

  const saveRace = () => {
    if (!editRace.name || !editRace.venue || !editRace.date) return;
    const r = { ...editRace, distance: +editRace.distance, prizePool: +editRace.prizePool };
    if (editRace.id) {
      setRaces(rs => rs.map(x => x.id === editRace.id ? r : x));
    } else {
      setRaces(rs => [...rs, { ...r, id: 'RACE' + Date.now(), registrations: [] }]);
    }
    setEditRace(null);
    setShowModal(false);
  };

  const setF = (k) => (v) => setEditRace(r => ({ ...r, [k]: v }));

  const tabStyle = (s) => {
    const active = filterStatus === s;
    const colors = { All: { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' }, Upcoming: { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' }, Running: { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' }, Finished: { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' }, Cancelled: { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' } };
    const c = colors[s] || colors.All;
    return { padding: '6px 14px', fontSize: 12, fontWeight: 500, borderRadius: 8, background: active ? c.bg : 'transparent', color: active ? c.color : '#6B7280', border: `1px solid ${active ? c.border : '#E5E7EB'}`, cursor: 'pointer', fontFamily: 'inherit' };
  };

  return (
    <div>
      <SectionTitle icon="run" sub="Create, edit, and manage all races in this tournament.">
        Races
      </SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          ['Total',    races.length,                                       '#6B7280'],
          ['Upcoming', races.filter(r => r.status === 'Upcoming').length,  '#1E40AF'],
          ['Running',  races.filter(r => r.status === 'Running').length,   '#92400E'],
          ['Finished', races.filter(r => r.status === 'Finished').length,   '#166534'],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Upcoming', 'Running', 'Finished', 'Cancelled'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={tabStyle(s)}>{s}</button>
          ))}
        </div>
        <Button variant="primary" onClick={() => { setEditRace({ ...EMPTY_RACE }); setShowModal(true); }} icon="plus">
          Add Race
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(race => {
          const ref = REFEREES_POOL.find(r => r.id === race.refereeId);
          return (
            <Card key={race.id} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{race.name}</span>
                    <StatusPill status={race.status} />
                    <span style={{ fontSize: 11, background: '#F3F4F6', color: '#374151', padding: '1px 7px', borderRadius: 20, fontWeight: 500 }}>{race.grade}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span><i className="ti ti-map-pin" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{race.venue}</span>
                    <span><i className="ti ti-calendar" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{fmtDate(race.date)} {race.time}</span>
                    <span><i className="ti ti-ruler-measure" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{race.distance}m</span>
                    <span><i className="ti ti-users" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{race.registrations.filter(r => r.status === 'Approved').length} approved</span>
                    <span><i className="ti ti-trophy" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />${race.prizePool.toLocaleString()}</span>
                    <span><i className="ti ti-weather-partly-cloudy" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{race.condition}</span>
                    {ref && <span style={{ color: '#10B981' }}><i className="ti ti-shield-check" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{ref.name}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
                  <Button small variant="ghost" onClick={() => { setEditRace({ ...race }); setShowModal(true); }} icon="edit">Edit</Button>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px 0', fontSize: 14 }}>
            No races found for this filter.
          </div>
        )}
      </div>

      {editRace && (
        <Modal
          title={editRace.id ? `Edit Race — ${editRace.name}` : 'Add New Race'}
          onClose={() => { setEditRace(null); setShowModal(false); }}
          wide
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px' }}>
            <Field label="Race name" required>
              <Input value={editRace.name} onChange={setF('name')} placeholder="e.g. Spring Classic" />
            </Field>
            <Field label="Venue" required half>
              <Input value={editRace.venue} onChange={setF('venue')} placeholder="e.g. Churchill Downs" />
            </Field>
            <Field label="Grade" half>
              <Select value={editRace.grade} onChange={setF('grade')} options={GRADES} />
            </Field>
            <Field label="Date" required half>
              <Input type="date" value={editRace.date} onChange={setF('date')} />
            </Field>
            <Field label="Time" half>
              <Input type="time" value={editRace.time} onChange={setF('time')} />
            </Field>
            <Field label="Distance (m)" half>
              <Input type="number" value={editRace.distance} onChange={setF('distance')} />
            </Field>
            <Field label="Track condition" half>
              <Select value={editRace.condition} onChange={setF('condition')} options={CONDITIONS} />
            </Field>
            <Field label="Prize pool ($)" half>
              <Input type="number" value={editRace.prizePool} onChange={setF('prizePool')} />
            </Field>
            <Field label="Status" half>
              <Select value={editRace.status} onChange={setF('status')} options={RACE_STATUSES} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <Button variant="ghost" onClick={() => { setEditRace(null); setShowModal(false); }}>Cancel</Button>
            <Button variant="primary" onClick={saveRace} icon="device-floppy">
              {editRace.id ? 'Update Race' : 'Create Race'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
