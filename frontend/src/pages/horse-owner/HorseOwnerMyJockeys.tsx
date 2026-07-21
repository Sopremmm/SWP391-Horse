import React from 'react';
import { Link } from 'react-router-dom';
import { OwnerPortalHeader } from '../../components/horseOwner/OwnerPortalChrome.tsx';
import { getCachedOwnerSentInvitationsData } from '../../services/integration.ts';
import './HorseOwnerMyJockeys.css';

type InvitationStatus = 'Pending' | 'Accepted' | 'Declined';
type StatusFilter = 'All' | InvitationStatus;

type JockeyInvitation = {
  id: string | number;
  jockey: string;
  tournament: string;
  horse: string;
  sentDate?: string;
  status: InvitationStatus;
  image?: string;
};

type InvitationMetric = {
  label: string;
  value: string;
  note?: string;
  icon?: 'check' | 'hourglass' | 'mail' | 'trend';
  positive?: boolean;
};

type MyJockeyInvitationsData = {
  title?: string;
  subtitle?: string;
  metrics?: InvitationMetric[];
  invitations?: Array<Partial<JockeyInvitation>>;
};

const PAGE_SIZE = 5;

function InvitationIcon({ name }: { name: 'check' | 'chevron-left' | 'chevron-right' | 'filter' | 'hourglass' | 'mail' | 'plus' | 'search' | 'trend' }) {
  const paths: Record<typeof name, string> = {
    check: 'M8.6 14.6 15.7 7.5l-1.4-1.4-5.7 5.7-2.8-2.9-1.4 1.4 4.2 4.3ZM10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
    'chevron-left': 'm15.4 7.4-1.4-1.4-6 6 6 6 1.4-1.4-4.6-4.6 4.6-4.6Z',
    'chevron-right': 'm8.6 16.6 1.4 1.4 6-6-6-6-1.4 1.4 4.6 4.6-4.6 4.6Z',
    filter: 'M0 1.7V0h15v1.7H0Zm2.5 4.1V4.2h10v1.6h-10ZM5.8 10V8.3h3.4V10H5.8Z',
    hourglass: 'M4 18h8v-3c0-1.1-.4-2-1.2-2.8A3.8 3.8 0 0 0 8 11c-1.1 0-2 .4-2.8 1.2A3.8 3.8 0 0 0 4 15v3Zm4-9c1.1 0 2-.4 2.8-1.2A3.8 3.8 0 0 0 12 5V2H4v3c0 1.1.4 2 1.2 2.8A3.8 3.8 0 0 0 8 9ZM0 20v-2h2v-3c0-1 .2-2 .7-2.9.5-.9 1.2-1.6 2-2.1-.8-.5-1.5-1.2-2-2.1C2.2 7 2 6 2 5V2H0V0h16v2h-2v3c0 1-.2 2-.7 2.9-.5.9-1.2 1.6-2 2.1.8.5 1.5 1.2 2 2.1.5.9.7 1.9.7 2.9v3h2v2H0Z',
    mail: 'M2 16c-.6 0-1-.2-1.4-.6C.2 15 0 14.6 0 14V2C0 1.4.2 1 .6.6 1 .2 1.4 0 2 0h16c.6 0 1 .2 1.4.6.4.4.6.8.6 1.4v12c0 .6-.2 1-.6 1.4-.4.4-.8.6-1.4.6H2Zm8-7 8-5V2l-8 5-8-5v2l8 5Z',
    plus: 'M6 8H0V6h6V0h2v6h6v2H8v6H6V8Z',
    search: 'm13.8 15-5.2-5.2c-.4.3-.9.6-1.5.8-.5.1-1.1.2-1.7.2-1.5 0-2.8-.5-3.8-1.5A5.2 5.2 0 0 1 0 5.4c0-1.5.5-2.8 1.6-3.8A5.2 5.2 0 0 1 5.4 0c1.5 0 2.8.5 3.9 1.6a5.2 5.2 0 0 1 1.5 3.8c0 .6-.1 1.2-.3 1.7-.2.6-.4 1.1-.8 1.5L15 13.8 13.8 15ZM5.4 9.2c1.1 0 2-.4 2.7-1.1.7-.7 1.1-1.6 1.1-2.7s-.4-2-1.1-2.7a3.7 3.7 0 0 0-2.7-1.1c-1 0-1.9.4-2.7 1.1a3.7 3.7 0 0 0-1.1 2.7c0 1.1.4 2 1.1 2.7.8.7 1.7 1.1 2.7 1.1Z',
    trend: 'M.9 8 0 7.1l4.9-5 2.7 2.7L11.1 1H9.3V0h4v4H12V2.3L7.6 6.7 4.9 4 .9 8Z',
  };
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d={paths[name]} /></svg>;
}

const normalizeStatus = (status?: string): InvitationStatus => {
  if (status === 'Accepted' || status === 'Declined' || status === 'Pending') return status;
  return 'Pending';
};

const normalizeInvitations = (raw?: Array<Partial<JockeyInvitation>>): JockeyInvitation[] =>
  (raw || [])
    .filter((item) => item.jockey || item.tournament || item.horse)
    .map((item, index) => ({
      id: item.id ?? index + 1,
      jockey: item.jockey || '',
      tournament: item.tournament || '',
      horse: item.horse || '',
      sentDate: item.sentDate || '',
      status: normalizeStatus(item.status),
      image: item.image,
    }));

const buildMetrics = (data: MyJockeyInvitationsData | null, invitations: JockeyInvitation[]): InvitationMetric[] => {
  if (data?.metrics?.length) return data.metrics;
  if (!invitations.length) return [];
  return [
    { label: 'Total Invitations', value: String(invitations.length), icon: 'mail' },
    { label: 'Pending Response', value: String(invitations.filter((item) => item.status === 'Pending').length), icon: 'hourglass' },
    { label: 'Active Assignments', value: String(invitations.filter((item) => item.status === 'Accepted').length), icon: 'check' },
  ];
};

export default function HorseOwnerMyJockeys() {
  const initialData = React.useMemo(() => getCachedOwnerSentInvitationsData() as MyJockeyInvitationsData, []);
  const [pageData, setPageData] = React.useState<MyJockeyInvitationsData | null>(initialData);
  const [invitations, setInvitations] = React.useState<JockeyInvitation[]>(() =>
    normalizeInvitations(initialData?.invitations),
  );
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<StatusFilter>('All');
  const [page, setPage] = React.useState(1);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [toast, setToast] = React.useState('');
  const metrics = buildMetrics(pageData, invitations);

  React.useEffect(() => {
    let cancelled = false;
    const loadInvitations = async () => {
      const data = getCachedOwnerSentInvitationsData() as MyJockeyInvitationsData;
      if (!cancelled) {
        setPageData(data);
        setInvitations(normalizeInvitations(data?.invitations));
      }
    };

    void loadInvitations();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = invitations.filter((invitation) => {
    const matchesQuery = `${invitation.jockey} ${invitation.tournament} ${invitation.horse}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (filter === 'All' || invitation.status === filter);
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [query, filter]);

  React.useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const resend = (invitation: JockeyInvitation) => {
    setInvitations((current) => current.map((item) => item.id === invitation.id ? { ...item, sentDate: 'Today' } : item));
    setToast(`Invitation resent to ${invitation.jockey}.`);
  };

  return (
    <div className="jockey-invitations">
      <OwnerPortalHeader />

      <main className="jockey-invitations__main">
        <nav className="jockey-invitations__breadcrumb" aria-label="Breadcrumb">
          <Link to="/HorseOwner/InviteJockeys">Jockeys</Link><span>&gt;</span><strong>Invitations</strong>
        </nav>

        <section className="jockey-invitations__hero">
          <div>
            <h1>{pageData?.title || 'Jockey Recruitment Status'}</h1>
            {pageData?.subtitle ? <p>{pageData.subtitle}</p> : null}
          </div>
          <Link to="/HorseOwner/InviteJockeys"><InvitationIcon name="plus" /> Invite New Jockey</Link>
        </section>

        <section className="jockey-invitations__metrics" aria-label="Invitation summary">
          {metrics.length ? metrics.map((metric) => (
            <article key={metric.label}>
              <div><span>{metric.label}</span><InvitationIcon name={metric.icon || 'mail'} /></div>
              <strong>{metric.value}</strong>
              {metric.note ? <small className={metric.positive ? 'is-positive' : ''}>{metric.positive ? <InvitationIcon name="trend" /> : null}{metric.note}</small> : null}
            </article>
          )) : <div className="jockey-invitations__empty">Invitation metrics are empty.</div>}
        </section>

        <section className="jockey-invitations__table-card" aria-label="Active recruitment list">
          <header>
            <h2>Active Recruitment List</h2>
            <div className="jockey-invitations__tools">
              <label><InvitationIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jockeys..." /></label>
              <div className="jockey-invitations__filter-wrap">
                <button type="button" onClick={() => setFilterOpen((current) => !current)}><InvitationIcon name="filter" /> Filter</button>
                {filterOpen ? (
                  <div className="jockey-invitations__filter-menu">
                    {(['All', 'Pending', 'Accepted', 'Declined'] as StatusFilter[]).map((item) => (
                      <button className={filter === item ? 'is-active' : ''} type="button" key={item} onClick={() => { setFilter(item); setFilterOpen(false); }}>{item}</button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="jockey-invitations__table-scroll">
            <div className="jockey-invitations__table">
              <div className="jockey-invitations__table-head">
                <span>Jockey</span><span>Tournament</span><span>Assigned Horse</span><span>Sent Date</span><span>Status</span><span>Actions</span>
              </div>
              <div className="jockey-invitations__table-body">
                {rows.map((invitation) => (
                  <article key={invitation.id}>
                    <div className="jockey-invitations__person">{invitation.image ? <img src={invitation.image} alt="" /> : null}<strong>{invitation.jockey}</strong></div>
                    <span>{invitation.tournament}</span>
                    <span>{invitation.horse}</span>
                    <span>{invitation.sentDate}</span>
                    <span><i className={`is-${invitation.status.toLowerCase()}`}>{invitation.status}</i></span>
                    <div className="jockey-invitations__action">
                      {invitation.status === 'Pending' ? <button type="button" onClick={() => resend(invitation)}>Resend</button> : null}
                      {invitation.status === 'Declined' ? <Link to="/HorseOwner/InviteJockeys">Invite Another</Link> : null}
                    </div>
                  </article>
                ))}
                {!rows.length ? <div className="jockey-invitations__empty">Invitation data is empty.</div> : null}
              </div>
            </div>
          </div>

          <footer>
            <span>Showing {rows.length} of {filtered.length} invitations</span>
            <nav aria-label="Invitation pages">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><InvitationIcon name="chevron-left" /></button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button className={currentPage === number ? 'is-active' : ''} type="button" key={number} onClick={() => setPage(number)}>{number}</button>
              ))}
              <button type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}><InvitationIcon name="chevron-right" /></button>
            </nav>
          </footer>
        </section>
      </main>

      <footer className="jockey-invitations__footer">
        <div>
          <section><h2>Heritage Racing</h2><strong>Prestige. Performance. Legacy.</strong></section>
          <nav><a href="#privacy">Privacy Policy</a><a href="#terms">Terms of Service</a><a href="#support">Contact Support</a></nav>
          <p>(c) 2024 Heritage Racing Management. All rights reserved.</p>
        </div>
      </footer>

      {toast ? <div className="jockey-invitations__toast" role="status">{toast}</div> : null}
    </div>
  );
}
