import React from 'react';
import { Link } from 'react-router-dom';
import { OwnerPortalHeader } from '../components/horseOwner/OwnerPortalChrome.tsx';
import { getPageData } from '../data/pageData.ts';
import './HorseOwnerMyJockeys.css';

type InvitationStatus = 'Pending' | 'Accepted' | 'Declined';
type StatusFilter = 'All' | InvitationStatus;

type JockeyInvitation = {
  id: number;
  jockey: string;
  tournament: string;
  horse: string;
  sentDate: string;
  status: InvitationStatus;
  image: string;
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

function buildInvitations(): JockeyInvitation[] {
  const jockeys = getPageData().inviteJockeys.jockeys;
  const image = (index: number) => jockeys[index % jockeys.length]?.imageSrc ?? 'https://placehold.co/80x80';
  return [
    { id: 1, jockey: 'Julian Sterling', tournament: 'Royal Ascot Invitational', horse: 'Midnight Cavalier', sentDate: 'Oct 12, 2024', status: 'Pending', image: image(0) },
    { id: 2, jockey: 'Elara Vance', tournament: 'Dubai World Cup', horse: 'Golden Scepter', sentDate: 'Oct 08, 2024', status: 'Accepted', image: image(3) },
    { id: 3, jockey: 'Marcus Thorne', tournament: "Breeders' Cup Classic", horse: 'Titan’s Echo', sentDate: 'Oct 05, 2024', status: 'Declined', image: image(4) },
    { id: 4, jockey: 'Sasha Romanoff', tournament: 'The Epsom Derby', horse: 'Silver Streak', sentDate: 'Sep 28, 2024', status: 'Accepted', image: image(1) },
    { id: 5, jockey: "Liam O'Conner", tournament: "Prix de l'Arc de Triomphe", horse: 'Storm King', sentDate: 'Oct 14, 2024', status: 'Pending', image: image(2) },
    { id: 6, jockey: 'Diana Prince', tournament: 'Emerald Derby', horse: 'Royal Velvet', sentDate: 'Sep 24, 2024', status: 'Accepted', image: image(5) },
    { id: 7, jockey: 'Arthur Thorne', tournament: 'Winter Solstice Cup', horse: 'Ivory Ghost', sentDate: 'Sep 20, 2024', status: 'Pending', image: image(2) },
    { id: 8, jockey: 'Sophie Whitmore', tournament: 'Heritage Plate', horse: 'Midnight Sovereign', sentDate: 'Sep 18, 2024', status: 'Accepted', image: image(1) },
    { id: 9, jockey: 'Marcus Reed', tournament: 'Highland Sprint Cup', horse: 'Golden Scepter', sentDate: 'Sep 15, 2024', status: 'Declined', image: image(4) },
    { id: 10, jockey: 'Elena Vance', tournament: 'Southern Fields Invitational', horse: 'Silver Streak', sentDate: 'Sep 12, 2024', status: 'Pending', image: image(3) },
    { id: 11, jockey: 'Liam Hamilton', tournament: 'Royal Ascot Invitational', horse: 'Storm King', sentDate: 'Sep 08, 2024', status: 'Accepted', image: image(0) },
    { id: 12, jockey: 'Sophie Whitmore', tournament: 'Dubai World Cup', horse: 'Titan’s Echo', sentDate: 'Sep 04, 2024', status: 'Accepted', image: image(1) },
    { id: 13, jockey: 'Arthur Thorne', tournament: "Breeders' Cup Classic", horse: 'Royal Velvet', sentDate: 'Aug 30, 2024', status: 'Pending', image: image(2) },
    { id: 14, jockey: 'Diana Prince', tournament: 'The Epsom Derby', horse: 'Ivory Ghost', sentDate: 'Aug 25, 2024', status: 'Accepted', image: image(5) },
    { id: 15, jockey: 'Elara Vance', tournament: 'Emerald Derby', horse: 'Midnight Cavalier', sentDate: 'Aug 22, 2024', status: 'Declined', image: image(3) },
    { id: 16, jockey: 'Marcus Thorne', tournament: 'Heritage Plate', horse: 'Storm King', sentDate: 'Aug 18, 2024', status: 'Accepted', image: image(4) },
    { id: 17, jockey: 'Liam Hamilton', tournament: 'Highland Sprint Cup', horse: 'Silver Streak', sentDate: 'Aug 14, 2024', status: 'Pending', image: image(0) },
    { id: 18, jockey: 'Sophie Whitmore', tournament: 'Winter Solstice Cup', horse: 'Royal Velvet', sentDate: 'Aug 10, 2024', status: 'Accepted', image: image(1) },
    { id: 19, jockey: 'Diana Prince', tournament: 'Dubai World Cup', horse: 'Ivory Ghost', sentDate: 'Aug 06, 2024', status: 'Declined', image: image(5) },
    { id: 20, jockey: 'Arthur Thorne', tournament: 'Royal Ascot Invitational', horse: 'Titan’s Echo', sentDate: 'Aug 02, 2024', status: 'Pending', image: image(2) },
    { id: 21, jockey: 'Elena Vance', tournament: 'Southern Fields Invitational', horse: 'Midnight Sovereign', sentDate: 'Jul 28, 2024', status: 'Accepted', image: image(3) },
    { id: 22, jockey: 'Marcus Reed', tournament: 'Emerald Derby', horse: 'Golden Scepter', sentDate: 'Jul 24, 2024', status: 'Accepted', image: image(4) },
    { id: 23, jockey: 'Liam Hamilton', tournament: "Prix de l'Arc de Triomphe", horse: 'Storm King', sentDate: 'Jul 20, 2024', status: 'Pending', image: image(0) },
    { id: 24, jockey: 'Sophie Whitmore', tournament: 'The Epsom Derby', horse: 'Silver Streak', sentDate: 'Jul 16, 2024', status: 'Accepted', image: image(1) },
  ];
}

export default function HorseOwnerMyJockeys() {
  const [invitations, setInvitations] = React.useState(buildInvitations);
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<StatusFilter>('All');
  const [page, setPage] = React.useState(1);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [toast, setToast] = React.useState('');

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
          <Link to="/HorseOwner/InviteJockeys">Jockeys</Link><span>›</span><strong>Invitations</strong>
        </nav>

        <section className="jockey-invitations__hero">
          <div>
            <h1>Jockey Recruitment Status</h1>
            <p>Manage your formal invitations to professional jockeys. Track response times and confirm assignments for upcoming seasonal tournaments.</p>
          </div>
          <Link to="/HorseOwner/InviteJockeys"><InvitationIcon name="plus" /> Invite New Jockey</Link>
        </section>

        <section className="jockey-invitations__metrics" aria-label="Invitation summary">
          <article>
            <div><span>Total Invitations</span><InvitationIcon name="mail" /></div>
            <strong>24</strong>
            <small className="is-positive"><InvitationIcon name="trend" /> +12% from last season</small>
          </article>
          <article>
            <div><span>Pending Response</span><InvitationIcon name="hourglass" /></div>
            <strong>08</strong>
            <small>Average wait: 2.4 days</small>
          </article>
          <article>
            <div><span>Active Assignments</span><InvitationIcon name="check" /></div>
            <strong>14</strong>
            <small>Ready for Epsom Derby</small>
          </article>
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
                    <div className="jockey-invitations__person"><img src={invitation.image} alt="" /><strong>{invitation.jockey}</strong></div>
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
                {!rows.length ? <div className="jockey-invitations__empty">No invitations match your search.</div> : null}
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
          <p>© 2024 Heritage Racing Management. All rights reserved.</p>
        </div>
      </footer>

      {toast ? <div className="jockey-invitations__toast" role="status">{toast}</div> : null}
    </div>
  );
}
