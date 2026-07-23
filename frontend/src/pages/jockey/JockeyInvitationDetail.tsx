import React from 'react';
import { Link } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import HomeBanner from '../../assets/images/HomeBanner.png';
import { JockeyInvitation } from './JockeyInvitationPage.tsx';
import './JockeyInvitationDetail.css';

type Props = { invitation?: JockeyInvitation | null; onDecision?: (id: string, decision: 'accepted' | 'declined') => void };
type Decision = 'accepted' | 'declined';

export default function JockeyInvitationDetail({ invitation, onDecision }: Props) {
  const item = invitation || null;
  const [decision, setDecision] = React.useState<Decision | null>(null);
  const [status, setStatus] = React.useState(item?.status);

  const confirmDecision = () => {
    if (!item || !decision) return;
    setStatus(decision); onDecision?.(item.id, decision); setDecision(null);
  };

  return <div className="jockey-invite-detail"><JockeyHeader /><main>
    {item ? <><header className="jockey-invite-detail__heading"><span>Registry › Invitations › {item.horseName}</span><div><section><h1>Race Invitation: {item.horseName}</h1><p>You have been invited by {item.stableName || item.ownerName || 'a stable owner'} to compete in an upcoming racing event.</p></section><b className={`is-${status}`}>{status === 'pending' ? '◉ Pending Review' : status}</b></div></header>
    <div className="jockey-invite-detail__grid"><div className="jockey-invite-detail__left">
      <article className="jockey-invite-detail__horse"><div className="jockey-invite-detail__image"><img src={item.horseImageUrl || HomeBanner} alt={item.horseName} /><span>Elite Grade</span></div><section><header><h2>{item.horseName}</h2><b>{item.horseWinRate ?? '—'}%<small>Win rate</small></b></header><div><strong>{item.horseBreed || 'Breed pending'}</strong><strong>{item.horseAge !== undefined ? `${item.horseAge} YRS` : 'Age pending'}</strong></div><Link to={`/Jockey/Horse/${encodeURIComponent(item.horseName)}`}>◉ View Horse Profile</Link></section></article>
      <article className="jockey-invite-detail__tournament"><h2>♜ {item.tournamentName || 'Tournament pending'}</h2><dl><div><dt>Date &amp; time</dt><dd>{item.raceDate || 'To be announced'}</dd></div><div><dt>Prize</dt><dd>{item.prize || 'To be announced'}</dd></div><div><dt>Location</dt><dd>{item.location || 'To be announced'}</dd></div></dl><Link to={`/Jockey/Tournaments/${encodeURIComponent(item.tournamentName || item.id)}`}>View Tournament Details</Link></article>
    </div><aside className="jockey-invite-detail__side">
      <article className="jockey-invite-detail__message"><header><small>Invitation from</small><h2>{item.ownerName || item.stableName || 'Stable Owner'}</h2></header><blockquote>“{item.message || 'We would be honored to have you compete with us.'}”</blockquote><footer><span>Stakes offered</span><strong>{item.prize || '—'}</strong></footer></article>
      <article className="jockey-invite-detail__requirements"><h3>Required Actions</h3><p>✓ Medical Clearance Up-to-Date</p><p>✓ Regional License Verified</p><p>ⓘ Sign Non-Disclosure Agreement</p></article>
      {status === 'pending' ? <div className="jockey-invite-detail__actions"><button onClick={() => setDecision('accepted')}>Accept Invitation</button><button onClick={() => setDecision('declined')}>Decline Invitation</button><small>Response required by {item.responseDeadline || 'the stated deadline'}</small></div> : <div className="jockey-invite-detail__resolved">Invitation {status}.</div>}
    </aside></div></> : <div className="jockey-invite-detail__missing">Invitation not found.<Link to="/Jockey/Invitation">Back to Invitations</Link></div>}
  </main><Footer />
  {decision ? <div className="jockey-invite-detail__modal-backdrop" role="presentation"><section className="jockey-invite-detail__modal" role="dialog" aria-modal="true" aria-labelledby="decision-title"><h2 id="decision-title">Confirm {decision === 'accepted' ? 'Acceptance' : 'Decline'}</h2><p>Are you sure you want to {decision === 'accepted' ? 'accept' : 'decline'} the invitation for <strong>{item?.horseName}</strong>?</p><div><button onClick={() => setDecision(null)}>Cancel</button><button className={decision === 'declined' ? 'is-danger' : ''} onClick={confirmDecision}>Confirm {decision === 'accepted' ? 'Acceptance' : 'Decline'}</button></div></section></div> : null}
  </div>;
}
