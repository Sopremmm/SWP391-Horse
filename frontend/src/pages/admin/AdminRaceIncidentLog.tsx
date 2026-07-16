import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.tsx';
import './AdminRaceIncidentLog.css';

export type AdminRaceIncident = {
  id: string; raceName: string; tournamentName: string; reportedAt?: string;
  refereeName?: string; category?: string; status?: 'open' | 'reviewing' | 'resolved'; summary?: string;
};
type Props = { incidents?: AdminRaceIncident[] | null; total?: number; loading?: boolean };
const PAGE_SIZE = 8;

export default function AdminRaceIncidentLog({ incidents, total, loading = false }: Props) {
  const rows = React.useMemo(() => incidents ?? [], [incidents]);
  const [query, setQuery] = React.useState(''); const [status, setStatus] = React.useState('all'); const [page, setPage] = React.useState(1);
  const filtered = rows.filter((item) => { const key = query.trim().toLowerCase(); return (!key || [item.raceName,item.tournamentName,item.refereeName,item.category].some((value) => value?.toLowerCase().includes(key))) && (status === 'all' || item.status === status); });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const currentPage = Math.min(page,pageCount); const visible = filtered.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);
  React.useEffect(() => setPage(1), [query,status]);
  return <AdminLayout active="settings" title="Race Incident Log" topNavActive="overview"><section className="admin-incident-log" aria-busy={loading}>
    <header><h1>Incident Log</h1><p>Comprehensive history of recorded race violations and incidents.</p></header>
    <div className="admin-incident-log__card"><div className="admin-incident-log__tools"><label><span>⌕</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search incidents, races, or officials..." /></label><select value={status} onChange={(e)=>setStatus(e.target.value)} aria-label="Filter incident status"><option value="all">All Statuses</option><option value="open">Open</option><option value="reviewing">Reviewing</option><option value="resolved">Resolved</option></select></div>
      <div className="admin-incident-log__head"><span>Race Name</span><span>Tournament Name</span><span>Date &amp; Time</span><span>Referee Name</span><span>Actions</span></div>
      {visible.length ? visible.map((item)=><article className="admin-incident-log__row" key={item.id}>
        <Link to={`/Admin/ManageTournaments/${encodeURIComponent(item.tournamentName)}/${encodeURIComponent(item.raceName)}`}>{item.raceName}</Link>
        <Link to={`/Admin/ManageTournaments/${encodeURIComponent(item.tournamentName)}`}>{item.tournamentName}</Link>
        <span>{item.reportedAt || '—'}</span><span>{item.refereeName || '—'}</span>
        <Link className="admin-incident-log__view" to={`/Admin/RaceIncidentsLog/${encodeURIComponent(item.tournamentName)}/${encodeURIComponent(item.raceName)}`}>View</Link>
      </article>) : <div className="admin-incident-log__empty">No race incidents match the current filters.</div>}
      <footer><span>Showing {visible.length ? (currentPage-1)*PAGE_SIZE+1 : 0}–{Math.min(currentPage*PAGE_SIZE,filtered.length)} of {total ?? filtered.length} entries</span><nav><button disabled={currentPage===1} onClick={()=>setPage(v=>v-1)}>‹</button><b>{currentPage}</b><span>/ {pageCount}</span><button disabled={currentPage===pageCount} onClick={()=>setPage(v=>v+1)}>›</button></nav></footer>
    </div></section></AdminLayout>;
}
