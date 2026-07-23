import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/common/Footer.tsx';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import './JockeyInvitationPage.css';

export type JockeyInvitation = {
  id: string;
  horseName: string;
  stableName?: string;
  tournamentName?: string;
  raceDate?: string;
  status: 'pending' | 'accepted' | 'declined';
  ownerName?: string;
  contact?: string;
  message?: string;
  prize?: string;
  horseImageUrl?: string;
  horseBreed?: string;
  horseAge?: number;
  horseWinRate?: number;
  location?: string;
  responseDeadline?: string;
};

type Props = {
  invitations?: JockeyInvitation[] | null;
  loading?: boolean;
  onDecision?: (id: string, decision: 'accepted' | 'declined') => void | Promise<void>;
};
type Filter = 'all' | 'pending' | 'accepted' | 'declined';

export default function JockeyInvitationPage({ invitations, loading = false, onDecision }: Props) {
  const [items, setItems] = React.useState<JockeyInvitation[]>(() => invitations ?? []);
  const [filter, setFilter] = React.useState<Filter>('all');
  React.useEffect(() => { if (invitations) setItems(invitations); }, [invitations]);
  const visible = items.filter((item) => filter === 'all' || item.status === filter);
  const count = (status: JockeyInvitation['status']) => items.filter((item) => item.status === status).length;

  const handleDecision = async (id: string, decision: 'accepted' | 'declined') => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: decision } : item)));
    await onDecision?.(id, decision);
  };

  return <div className="jockey-invitation"><JockeyHeader /><main className="jockey-invitation__main" aria-busy={loading}>
    <section className="jockey-invitation__heading"><h1>Race Invitations</h1><p>Manage your upcoming ride offers from prestigious owners and trainers. Review horse performance data and track conditions before confirming your schedule.</p></section>
    <nav className="jockey-invitation__tabs" aria-label="Invitation status filters">
      {([['all','All'],['pending','Pending'],['accepted','Accepted'],['declined','Declined']] as [Filter,string][]).map(([value,label]) => <button className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)} key={value}>{label}<span>{value === 'all' ? items.length : count(value)}</span></button>)}
    </nav>
    <div className="jockey-invitation__layout"><section className="jockey-invitation__list">
      {visible.length ? visible.map((invite) => <article className="jockey-invitation__card" key={invite.id}><div><span className={`is-${invite.status}`}>{invite.status}</span><h2>{invite.horseName}</h2><p>{[invite.stableName, invite.tournamentName].filter(Boolean).join(' • ')}</p><time>▣ {invite.raceDate || 'Date pending'}</time></div><div className="jockey-invitation__card-actions">{invite.status === 'pending' ? <><button type="button" className="jockey-invitation__decision jockey-invitation__decision--accept" onClick={() => void handleDecision(invite.id, 'accepted')}>Accept</button><button type="button" className="jockey-invitation__decision jockey-invitation__decision--decline" onClick={() => void handleDecision(invite.id, 'declined')}>Decline</button></> : null}<Link to={`/Jockey/Invitation/${encodeURIComponent(invite.id)}`}>View Details</Link></div></article>) : <div className="jockey-invitation__empty">No invitations found for this status.</div>}
    </section><aside className="jockey-invitation__summary"><h2>Invitation Summary</h2><dl><div><dt>Total Invitations</dt><dd>{items.length}</dd></div><div><dt>Accepted</dt><dd>{count('accepted')}</dd></div><div><dt>Declined</dt><dd>{count('declined')}</dd></div><div><dt>Pending</dt><dd>{count('pending')}</dd></div></dl></aside></div>
  </main><Footer /></div>;
}
