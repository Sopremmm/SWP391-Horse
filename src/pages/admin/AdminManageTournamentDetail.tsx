import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.tsx';
import HomeBanner from '../../assets/images/HomeBanner.png';
import '../AdminManageTournamentDetail.css';
import './AdminRaceDetail.css';
import './AdminRaceDetailOverrides.css';

type Race = { id: string; title: string; date: string; time: string; runners: number; state: string };
type Bracket = { qualifiers: Race[]; semifinals: Race[]; final: Race };

const tournamentName = (name?: string) => decodeURIComponent(name ?? 'Royal Ascot Autumn Derby');

function RaceCard({ race, tournament, featured = false }: { race: Race; tournament: string; featured?: boolean }) {
  return (
    <Link className={`amtBracketRace ${featured ? 'amtBracketRace--final' : ''}`} to={`/Admin/ManageTournaments/${encodeURIComponent(tournament)}/${encodeURIComponent(race.id)}`}>
      {featured ? <div className="amtBracketRace__championship">The Championship Match</div> : null}
      <div className="amtBracketRace__body">
        <div className="amtBracketRace__top"><h3>{race.title}</h3><span>{race.state}</span></div>
        <div className="amtBracketRace__detail"><b>▣</b> {race.date} · {race.time}</div>
        <div className="amtBracketRace__detail"><b>━</b> 2400m</div>
        <div className="amtBracketRace__detail"><b>♟</b> {race.runners} Runners</div>
        <p>Ref: Official Official</p>
      </div>
      <footer>{featured ? 'Pending final results' : 'Pending bracket'} <span>↗</span></footer>
    </Link>
  );
}

const availableHorses = [
  { name: 'Midnight Sovereign', jockey: 'James Harrington', owner: 'Heritage Stables' },
  { name: 'Royal Emissary', jockey: 'Sarah Whitmore', owner: 'Oaks Racing Group' },
  { name: 'Crimson Baron', jockey: 'Marcus Vane', owner: 'Baroness Bloodstock' },
  { name: 'Emerald Legacy', jockey: 'Elena Rossi', owner: 'Wellington Racing' },
];
const referees = ['Official Assign', 'Michael Harrington', 'Amelia Clarke', 'Victor Nguyen', 'Sophia Bennett'];

function RaceDetailView({ tournament, raceName }: { tournament: string; raceName: string }) {
  const [race, setRace] = React.useState({ date: '2024-11-12', time: '14:00', distance: '1200' });
  const [participants, setParticipants] = React.useState<Array<{ horse: string }>>([]);
  const [referee, setReferee] = React.useState(referees[0]);
  const [editOpen, setEditOpen] = React.useState(false);
  const [gatesOpen, setGatesOpen] = React.useState(false);
  const [gateCount, setGateCount] = React.useState(4);
  const displayRace = raceName.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const changeHorse = (index: number, horse: string) => setParticipants((items) => items.map((item, itemIndex) => itemIndex === index ? { horse } : item));
  const createGates = (event: React.FormEvent) => { event.preventDefault(); setParticipants(Array.from({ length: gateCount }, () => ({ horse: '' }))); setGatesOpen(false); };
  return <div className="adminRaceDetail">
    <section className="adminRaceHero"><button type="button" onClick={() => setEditOpen(true)}>✎ Edit Race</button><div><h1>Heat: {displayRace}</h1><div className="adminRaceHero__facts"><span>▣ Nov 12, 2024</span><span>◷ {race.time} GMT</span><span>━ {race.distance}m</span></div></div></section>
    <div className="adminRaceContent"><section className="adminRacePanel"><header className="adminRacePanel__heading"><h2>Race Participant Assignment</h2><button type="button" onClick={() => setGatesOpen(true)}>✎ Configure Gates</button></header>{participants.length === 0 ? <div className="adminRaceEmpty"><b>No participants created yet</b><p>Configure race gates to start assigning registered horses to this heat.</p><button type="button" onClick={() => setGatesOpen(true)}>Configure Gates</button></div> : <><div className="adminParticipantHead"><span>Gate</span><span>Horse Name</span><span>Jockey</span><span>Finish Time</span><span>Status</span></div>{participants.map((participant, index) => { const horse = availableHorses.find((item) => item.name === participant.horse); return <div className="adminParticipantRow" key={index}><strong>{String(index + 1).padStart(2, '0')}</strong><div><select value={participant.horse} onChange={(event) => changeHorse(index, event.target.value)}><option value="">Select horse...</option>{availableHorses.map((item) => <option value={item.name} key={item.name}>{item.name}</option>)}</select><small>{horse?.owner ?? '—'}</small></div><span>{horse?.jockey ?? '—'}</span><input aria-label={`Finish time gate ${index + 1}`} placeholder="--:--:--" /><span className="adminParticipantStatus">Pending</span></div>})}<button className="adminAddEntry" type="button" onClick={() => setParticipants((items) => [...items, { horse: '' }])}>+ Add additional entry</button></>}</section>
    <aside className="adminRaceSide"><section className="adminRefereeCard"><h2>♢ Referee Assignment</h2><p>Select the presiding official for this qualifier heat.</p><label>Assigned official</label><select value={referee} onChange={(event) => setReferee(event.target.value)}>{referees.map((item) => <option key={item}>{item}</option>)}</select><button type="button">♙ Assign Official</button></section><section className="adminFinalActions"><span>Final actions</span><button type="button">↥ Publish Results</button><button type="button">▣ Save Draft</button><p>Last auto-saved: just now</p></section></aside></div>
    {editOpen && <div className="adminRaceModal" onMouseDown={() => setEditOpen(false)}><form onSubmit={(event) => { event.preventDefault(); setEditOpen(false); }} onMouseDown={(event) => event.stopPropagation()}><h2>Edit Race</h2><p>Update the race schedule and distance.</p><div className="adminRaceModal__fields"><label>Date<input type="date" value={race.date} onChange={(event) => setRace({ ...race, date: event.target.value })} /></label><label>Start time<input type="time" value={race.time} onChange={(event) => setRace({ ...race, time: event.target.value })} /></label></div><label>Distance (metres)<input type="number" min="100" value={race.distance} onChange={(event) => setRace({ ...race, distance: event.target.value })} /></label><div className="adminRaceModal__actions"><button type="button" onClick={() => setEditOpen(false)}>Cancel</button><button type="submit">Save changes</button></div></form></div>}
    {gatesOpen && <div className="adminRaceModal" onMouseDown={() => setGatesOpen(false)}><form onSubmit={createGates} onMouseDown={(event) => event.stopPropagation()}><h2>Configure Gates</h2><p>Choose the number of participant gates for this race.</p><label>Number of gates<select value={gateCount} onChange={(event) => setGateCount(Number(event.target.value))}>{[1,2,3,4,5,6,8,10,12].map((value) => <option value={value} key={value}>{value} gates</option>)}</select></label><div className="adminRaceModal__actions"><button type="button" onClick={() => setGatesOpen(false)}>Cancel</button><button type="submit">Create participants</button></div></form></div>}
  </div>;
}

export default function AdminManageTournamentDetail() {
  const { name, racename } = useParams<{ name?: string; racename?: string }>();
  const title = tournamentName(name);
  const [bracket, setBracket] = React.useState<Bracket | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [qualifierCount, setQualifierCount] = React.useState(3);
  const [semifinalCount, setSemifinalCount] = React.useState(2);

  const createBracket = (event: React.FormEvent) => {
    event.preventDefault();
    const qualifiers = Array.from({ length: qualifierCount }, (_, index) => ({
      id: `qualifier-${index + 1}`, title: `Qualifier ${String.fromCharCode(65 + index)}`,
      date: 'Nov 12, 2024', time: index === 0 ? '14:00' : `${14 + index}:30`, runners: 12, state: 'Awaiting entries',
    }));
    const semifinals = Array.from({ length: semifinalCount }, (_, index) => ({
      id: `semi-final-${index + 1}`, title: `Semi-final ${String.fromCharCode(65 + index)}`,
      date: 'Nov 13, 2024', time: index === 0 ? '18:00' : '16:00', runners: 8, state: 'Awaiting qualifiers',
    }));
    setBracket({ qualifiers, semifinals, final: { id: 'grand-finals', title: 'Grand Finals', date: 'Nov 15, 2024', time: '15:00 GMT', runners: 6, state: 'Final' } });
    setModalOpen(false);
  };

  if (racename) {
    const raceTitle = decodeURIComponent(racename).replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    return (
      <AdminLayout active="tournaments" breadcrumb={[{ label: 'Tournaments', to: '/Admin/ManageTournaments' }, { label: title, to: `/Admin/ManageTournaments/${encodeURIComponent(title)}` }, { label: raceTitle }]}>
        <RaceDetailView tournament={title} raceName={racename} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="tournaments" breadcrumb={[{ label: 'Tournaments', to: '/Admin/ManageTournaments' }, { label: title }]}>
      <div className="amtDetailPage">
        <main className="amtDetailMain">
          <section className="amtDetailHero">
            <div className="amtDetailHeroBg"><img alt="Racecourse" className="amtDetailHeroImg" src={HomeBanner} /><div className="amtDetailHeroGradient" /></div>
            <div className="amtDetailHeroContent">
              <div className="amtDetailHeroLeft"><span className="amtRegistration">Registration open</span><h1 className="amtDetailHeroTitle">{title}</h1><p className="amtDetailHeroDesc">The pinnacle of the autumn racing season, where tradition meets speed. A gathering of the world's most elite breeders and thoroughbreds.</p></div>
              <div className="amtHeroActions"><button type="button" className="amtViewEntries">▦ View Entries</button><Link className="amtDetailEditBtn" to={`/Admin/ManageTournaments/edit/${encodeURIComponent(title)}`}>✎ Edit Tournament</Link></div>
            </div>
          </section>

          <section className="amtDetailGrid" aria-label="Tournament information">
            {[['▣', 'Date', 'Nov 12 - 15, 2024'], ['▤', 'Prize pool', '$150,000'], ['♟', 'Entries / total', '10/20'], ['⌖', 'Location', 'Berkshire, UK']].map(([icon, label, value]) => <article className="amtDetailStat" key={label}><i>{icon}</i><div><span>{label}</span><strong>{value}</strong></div></article>)}
          </section>

          <section className="amtBracketSection">
            <header className="amtBracketHeader"><div><h2>Tournament Bracket</h2><p>Official management view of the Autumn Series progression.</p></div><button type="button" onClick={() => setModalOpen(true)}>✎ {bracket ? 'Edit Bracket' : 'Create Bracket'}</button></header>
            {!bracket ? <div className="amtBracketEmpty"><div>♜</div><strong>No bracket created yet</strong><p>Create a bracket to organize qualifying races, semi-finals, and the championship match.</p></div> : (
              <div className="amtBracketBoard">
                <div className="amtBracketColumn"><h3>Qualifiers</h3><div className="amtBracketStack">{bracket.qualifiers.map((race) => <RaceCard key={race.id} race={race} tournament={title} />)}</div></div>
                <div className="amtBracketColumn"><h3>Semi-finals</h3><div className="amtBracketStack amtBracketStack--middle">{bracket.semifinals.map((race) => <RaceCard key={race.id} race={race} tournament={title} />)}</div></div>
                <div className="amtBracketColumn amtBracketColumn--final"><h3>Grand finals</h3><RaceCard race={bracket.final} tournament={title} featured /></div>
              </div>
            )}
          </section>
        </main>
        {modalOpen && <div className="amtModalOverlay" onMouseDown={() => setModalOpen(false)}><form className="amtCreateHeatModal" onSubmit={createBracket} onMouseDown={(event) => event.stopPropagation()}><div className="amtModalHeader"><div><h2 className="amtModalTitle">{bracket ? 'Edit' : 'Create'} Tournament Bracket</h2><p className="amtModalDesc">Enter the number of races in each stage. The Grand Final is always included.</p></div><button className="amtModalClose" type="button" onClick={() => setModalOpen(false)}>×</button></div><div className="amtModalFieldGrid"><label className="amtModalField"><span>Qualifying races</span><input type="number" min="0" max="32" value={qualifierCount} onChange={(e) => setQualifierCount(Math.max(0, Number(e.target.value)))} /></label><label className="amtModalField"><span>Semi-final races</span><input type="number" min="0" max="16" value={semifinalCount} onChange={(e) => setSemifinalCount(Math.max(0, Number(e.target.value)))} /></label></div><div className="amtModalActions"><button className="amtModalSecondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button><button className="amtModalPrimary" type="submit">Create Bracket</button></div></form></div>}
      </div>
    </AdminLayout>
  );
}
