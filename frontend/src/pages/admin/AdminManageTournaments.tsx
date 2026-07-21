import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.tsx';
import { fetchAllTournaments, formatCurrency, formatDate, fetchAdminRaceControlList } from '../../services/integration.ts';
import './AdminManageTournaments.css';

type TournamentStatus = 'REGISTRATION OPEN' | 'DRAFT' | 'COMPLETED' | 'CLOSING SOON';

type ManagedTournament = {
  name: string;
  grade: string;
  registered: string;
  status: TournamentStatus;
  starts: string;
  closes: string;
  prizePool: string;
};

function Icon({ name }: { name: 'bell' | 'user' | 'grid' | 'users' | 'trophy' | 'check' | 'settings' | 'plus' | 'filter' | 'star' | 'logout' | 'help' }) {
  const paths: Record<string, string> = {
    bell:
      'M6 20v-2h2V9c0-1.4.4-2.6 1.3-3.7.8-1.1 1.9-1.8 3.2-2.1v-.7c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1v.7c1.3.3 2.4 1 3.2 2.1C19.6 6.4 20 7.6 20 9v9h2v2H6Zm8 3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4h4c0 .5-.2 1-.6 1.4-.4.4-.8.6-1.4.6Z',
    user:
      'M12 12c-1.1 0-2-.4-2.8-1.2C8.4 10 8 9.1 8 8s.4-2 1.2-2.8C10 4.4 10.9 4 12 4s2 .4 2.8 1.2C15.6 6 16 6.9 16 8s-.4 2-1.2 2.8C14 11.6 13.1 12 12 12ZM4 20v-2.8c0-.6.1-1.1.4-1.6.3-.5.7-.8 1.2-1.1 1-.5 2.1-.9 3.2-1.2 1.1-.2 2.1-.3 3.2-.3s2.1.1 3.2.3c1.1.3 2.2.7 3.2 1.2.5.3.9.6 1.2 1.1.3.5.4 1 .4 1.6V20H4Z',
    grid: 'M3 11V3h8v8H3Zm10 0V3h8v8h-8ZM3 21v-8h8v8H3Zm10 0v-8h8v8h-8Z',
    users:
      'M2 19v-2.1c0-.7.2-1.3.6-1.8.4-.5.9-.9 1.5-1.2 1.1-.5 2.2-.9 3.4-1.2 1.1-.3 2.3-.4 3.5-.4s2.4.1 3.5.4c1.2.3 2.3.7 3.4 1.2.6.3 1.1.7 1.5 1.2.4.5.6 1.1.6 1.8V19H2Zm5-9.5c-.9 0-1.7-.3-2.3-1C4.1 7.9 3.8 7.1 3.8 6.2s.3-1.7.9-2.3c.6-.7 1.4-1 2.3-1s1.7.3 2.3 1c.6.6.9 1.4.9 2.3s-.3 1.7-.9 2.3c-.6.7-1.4 1-2.3 1Z',
    trophy:
      'M7 21v-2h4v-3.1c-.9-.2-1.7-.6-2.4-1.2-.7-.6-1.2-1.3-1.5-2.1-1.4-.2-2.5-.8-3.4-1.8C2.8 9.8 2.3 8.6 2.3 7.2V6c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6H7V2h10v1.9h2.6c.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5v1.2c0 1.4-.5 2.6-1.4 3.6-.9 1-2.1 1.6-3.4 1.8-.3.8-.8 1.5-1.5 2.1-.7.6-1.5 1-2.4 1.2V19h4v2H7Z',
    check:
      'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z',
    settings:
      'm10 22-.4-3c-.3-.1-.6-.2-.9-.4-.3-.1-.6-.3-.8-.5l-2.8 1.2-2-3.5 2.4-1.8v-2l-2.4-1.8 2-3.5 2.8 1.2c.2-.2.5-.4.8-.5.3-.2.6-.3.9-.4l.4-3h4l.4 3c.3.1.6.2.9.4.3.1.6.3.8.5l2.8-1.2 2 3.5-2.4 1.8v2l2.4 1.8-2 3.5-2.8-1.2c-.2.2-.5.4-.8.5-.3.2-.6.3-.9.4l-.4 3h-4Z',
    plus: 'M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z',
    filter: 'M3 7V5h18v2H3Zm4 6v-2h10v2H7Zm3 6v-2h4v2h-4Z',
    star:
      'm12 17.3 4.2 2.5-1.1-4.8 3.7-3.2-4.9-.4L12 6.9l-1.9 4.5-4.9.4L8.9 15l-1.1 4.8 4.2-2.5Z',
    logout:
      'M4 21c-.6 0-1.1-.2-1.5-.6S2 19.5 2 18.9V5.1c0-.6.2-1.1.6-1.5S3.4 3 4 3h7v2H4v14h7v2H4Zm11-4-1.4-1.4 2.6-2.6H8v-2h8.2l-2.6-2.6L15 7l5 5-5 5Z',
    help:
      'M11 18h2v-2h-2v2Zm1-16C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8Z',
  };

  return (
    <svg className="admin-manage-tournaments__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function statusClass(status: TournamentStatus) {
  return status.toLowerCase().replaceAll(' ', '-');
}

export default function AdminManageTournaments() {
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sort, setSort] = React.useState('date');
  const [tournaments, setTournaments] = React.useState<ManagedTournament[]>([]);
  const [insights, setInsights] = React.useState([
    { label: 'Active Tournaments', value: '0', copy: 'No active tournaments yet.' },
    { label: 'Prize Pool Live', value: '$0', copy: 'No prize pool has been published yet.' },
    { label: 'Upcoming Deadlines', value: '0', copy: 'No registration deadlines are scheduled.' },
  ]);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [items, races] = await Promise.all([
        fetchAllTournaments().catch(() => []),
        fetchAdminRaceControlList().catch(() => []),
      ]);
      if (cancelled) return;

      const registrationMap = races.reduce<Record<number, number>>((acc, race) => {
        if (!race.tournamentId) return acc;
        const count = race.checklist?.approvedEntries || 0;
        acc[race.tournamentId] = Math.max(acc[race.tournamentId] || 0, count);
        return acc;
      }, {});

      const mapped = items.map((item) => ({
        name: item.name,
        grade: item.description || 'Tournament',
        registered: `${registrationMap[item.id] || 0} / ${item.maxHorses || 0} registered`,
        status: (String(item.status || 'DRAFT').replace(/_/g, ' ').toUpperCase() as TournamentStatus),
        starts: formatDate(item.startDate),
        closes: formatDate(item.endDate),
        prizePool: formatCurrency(item.prizePool),
      }));

      setTournaments(mapped);
      setInsights([
        {
          label: 'Active Tournaments',
          value: String(items.filter((item) => ['OPEN', 'ONGOING'].includes(String(item.status || '').toUpperCase())).length),
          copy: 'Tournaments currently open or in progress.',
        },
        {
          label: 'Prize Pool Live',
          value: formatCurrency(items.reduce((sum, item) => sum + Number(item.prizePool || 0), 0)),
          copy: 'Combined published prize pools.',
        },
        {
          label: 'Upcoming Deadlines',
          value: String(items.filter((item) => new Date(item.endDate || '').getTime() >= Date.now()).length),
          copy: 'Upcoming tournament end dates still visible.',
        },
      ]);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTournaments = [...tournaments]
    .filter((item) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'open') return item.status.includes('OPEN');
      if (statusFilter === 'draft') return item.status === 'DRAFT';
      if (statusFilter === 'completed') return item.status === 'COMPLETED';
      return true;
    })
    .sort((a, b) => {
      if (sort === 'prize') return (Number(b.prizePool.replace(/[^\d.]/g, '')) || 0) - (Number(a.prizePool.replace(/[^\d.]/g, '')) || 0);
      return Date.parse(a.starts) - Date.parse(b.starts);
    });

  return (
    <AdminLayout active="tournaments" title="Manage Tournaments" topNavActive="reports">
      <div className="admin-manage-tournaments">
        <section className="admin-manage-tournaments__canvas">
          <div className="admin-manage-tournaments__heading">
            <div>
              <h1>Manage Tournaments</h1>
              <p>
                Oversee the elite circuit of Heritage Racing. Create new events, track registration progress,
                and manage prize disbursements for prestigious grade stakes.
              </p>
            </div>
            <Link to="/Admin/ManageTournaments/Create" className="admin-manage-tournaments__add"><Icon name="plus" />Add Tournament</Link>
          </div>

          <div className="admin-manage-tournaments__filters" aria-label="Filter and sort tournaments">
            <label>
              <span>Status:</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All Statuses</option>
                <option value="open">Registration Open</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label>
              <Icon name="filter" />
              <span>Sort By:</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="date">Date (Upcoming)</option>
                <option value="prize">Prize Pool</option>
              </select>
            </label>
          </div>

          <section className="admin-manage-tournaments__table-card" aria-label="Tournaments list">
            <div className="admin-manage-tournaments__table-head">
              <span>Tournament & Grade</span>
              <span>Status</span>
              <span>Key Dates</span>
              <span>Prize Pool</span>
              <span>Actions</span>
            </div>
            {filteredTournaments.map((tournament) => (
              <article className="admin-manage-tournaments__row" key={tournament.name}>
                <div className="admin-manage-tournaments__name-cell">
                  <div className="admin-manage-tournaments__mark"><Icon name="star" /></div>
                  <div>
                    <strong>{tournament.name}</strong>
                    <small>{tournament.grade}</small>
                    <em>{tournament.registered}</em>
                  </div>
                </div>
                <div>
                  <span className={`admin-manage-tournaments__status admin-manage-tournaments__status--${statusClass(tournament.status)}`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="admin-manage-tournaments__dates">
                  <strong>Starts: {tournament.starts}</strong>
                  <span>Closes: {tournament.closes}</span>
                </div>
                <div className="admin-manage-tournaments__prize">{tournament.prizePool}</div>
                <div className="admin-manage-tournaments__actions-cell">
                  <Link to={`/Admin/ManageTournaments/${encodeURIComponent(tournament.name)}`}>Manage</Link>
                </div>
              </article>
            ))}
          </section>

          <section className="admin-manage-tournaments__insights" aria-label="Tournament insights">
            {insights.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.copy}</p>
              </article>
            ))}
          </section>
        </section>
      </div>
    </AdminLayout>
  );
}
