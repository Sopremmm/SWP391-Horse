import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../components/common/Header.tsx';
import {
  fetchAllTournaments,
  fetchEntriesByTournament,
  fetchJockeys,
  fetchMyHorses,
  sendJockeyInvitation,
  slugify,
} from '../../services/integration.ts';
import './InviteJockeyForm.css';

type Jockey = {
  id: number;
  name: string;
  imageSrc?: string;
  totalRaces?: number;
  winRate?: string;
  priceText?: string;
};

function InviteIcon({ name }: { name: 'arrow-left' | 'arrow-right' | 'bell' | 'info' | 'star' | 'money' }) {
  const paths: Record<typeof name, string> = {
    'arrow-left': 'M3.8 9 9.4 14.6 8 16 0 8 8 0l1.4 1.4L3.8 7H16v2H3.8Z',
    'arrow-right': 'M10.1 7.5H0V5.8h10.1L5.5 1.2 6.7 0l6.6 6.7-6.6 6.6-1.2-1.2 4.6-4.6Z',
    bell:
      'M0 17v-2h2V8c0-1.4.4-2.6 1.3-3.7.8-1.1 1.9-1.8 3.2-2.1v-.7c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1v.7c1.3.3 2.4 1 3.2 2.1C13.6 5.4 14 6.6 14 8v7h2v2H0Zm8 3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4h4c0 .5-.2 1-.6 1.4-.4.4-.8.6-1.4.6Z',
    info:
      'M9 15h2V9H9v6Zm1-8c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7s-.1-.5-.3-.7C10.5 5.1 10.3 5 10 5s-.5.1-.7.3c-.2.2-.3.4-.3.7s.1.5.3.7c.2.2.4.3.7.3Zm0 13a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z',
    star:
      'M4 10.7 6.7 8.6l2.6 2.1-1-3.3L11 5.5H7.7L6.7 2 5.6 5.5H2.3L5 7.4l-1 3.3Zm2.7 2.6a6.7 6.7 0 1 1 0-13.3 6.7 6.7 0 0 1 0 13.3Z',
    money:
      'M8.7 6c-.6 0-1.1-.2-1.5-.6-.4-.4-.5-.9-.5-1.4 0-.6.2-1.1.5-1.5.4-.3.9-.5 1.5-.5.5 0 1 .2 1.4.5.4.4.6.9.6 1.5 0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6ZM4 8c-.4 0-.7-.1-.9-.4-.3-.3-.4-.6-.4-.9V1.3c0-.4.1-.7.4-.9C3.3.1 3.6 0 4 0h9.3c.4 0 .7.1.9.4.3.2.4.5.4.9v5.4c0 .3-.1.6-.4.9-.2.3-.5.4-.9.4H4Z',
  };
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function fallbackWinRate(jockey: Jockey) {
  return jockey.winRate || '84%';
}

function dailyRate(jockey: Jockey) {
  const amount = jockey.priceText?.match(/[\d,]+/)?.[0] ?? '2,500';
  return `${amount} G / Day`;
}

export default function InviteJockeyForm() {
  const { name } = useParams<{ name?: string }>();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name ?? '').trim();
  const [jockey, setJockey] = React.useState<Jockey | null>(null);
  const [tournaments, setTournaments] = React.useState<Array<{ id: number; title: string }>>([]);
  const [eligibleHorses, setEligibleHorses] = React.useState<Record<string, Array<{ id: number; name: string; raceId: number }>>>({});
  const [tournamentId, setTournamentId] = React.useState('');
  const [horseName, setHorseName] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [jockeys, tournamentItems, myHorseItems] = await Promise.all([
        fetchJockeys().catch(() => []),
        fetchAllTournaments().catch(() => []),
        fetchMyHorses().catch(() => []),
      ]);

      if (cancelled) return;

      const mappedJockeys = jockeys.map((item) => ({
        id: item.id,
        name: item.fullName || item.email,
        imageSrc: item.avatarUrl,
        totalRaces: 0,
        priceText: '2,500 G / race',
      }));
      setJockey(
        mappedJockeys.find(
          (item) => String(item.id) === decodedName || slugify(item.name) === slugify(decodedName),
        ) || mappedJockeys[0] || null,
      );
      setTournaments(tournamentItems.map((item) => ({ id: item.id, title: item.name })));
      const myHorseIds = new Set(myHorseItems.map((item) => item.id));
      const tournamentEntries = await Promise.all(
        tournamentItems.map(async (item) => {
          const entries = await fetchEntriesByTournament(item.id).catch(() => []);
          const eligible = entries
            .filter((entry) => entry.status === 'APPROVED' && entry.race?.id && entry.horse?.id && myHorseIds.has(entry.horse.id))
            .map((entry) => ({ id: entry.horse!.id, name: entry.horse!.name, raceId: entry.race!.id }));
          return [String(item.id), eligible] as const;
        }),
      );
      if (!cancelled) setEligibleHorses(Object.fromEntries(tournamentEntries));
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [decodedName]);

  const submitInvitation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!tournamentId || !horseName || !jockey?.id) {
      setNotice('Please select both a tournament and a horse.');
      return;
    }
    const horse = (eligibleHorses[tournamentId] || []).find((item) => item.name === horseName);
    const tournament = tournaments.find((item) => String(item.id) === tournamentId);

    if (!horse?.id || !horse.raceId) {
      setNotice('This horse must be registered and approved for a race before inviting a jockey.');
      return;
    }

    setSubmitting(true);
    try {
      await sendJockeyInvitation({
        horseId: horse.id,
        jockeyId: jockey.id,
        raceId: horse.raceId,
        message,
      });
      setNotice(`Official invitation sent to ${jockey.name} for ${tournament?.title ?? 'the selected event'}.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Unable to send invitation.');
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const profileTarget = encodeURIComponent(jockey?.id ? String(jockey.id) : decodedName);

  return (
    <div className="invite-jockey-form-page">
      <Header />

      <main className="invite-jockey-form-page__main">
        <div className="invite-jockey-form-page__glow invite-jockey-form-page__glow--gold" />
        <div className="invite-jockey-form-page__glow invite-jockey-form-page__glow--green" />

        <section className="invite-jockey-form-page__card" aria-labelledby="invite-jockey-title">
          <header>
            <Link to={`/HorseOwner/InviteJockeys/${profileTarget}`}>
              <InviteIcon name="arrow-left" /> Back to profiles
            </Link>
            <h1 id="invite-jockey-title">Invite Jockey</h1>
            <p>Official Invitation for {jockey?.name || 'Selected Jockey'}</p>
          </header>

          <form onSubmit={submitInvitation}>
            <section className="invite-jockey-form-page__jockey-summary">
              <img src={jockey?.imageSrc || 'https://placehold.co/180x180'} alt={jockey?.name || 'Jockey'} />
              <div>
                <h2>{jockey?.name || 'Jockey'}</h2>
                <p><span><InviteIcon name="star" /> {jockey ? fallbackWinRate(jockey) : '84%'} Win Rate</span><span><InviteIcon name="money" /> {jockey ? dailyRate(jockey) : '2,500 G / Day'}</span></p>
              </div>
            </section>

            <div className="invite-jockey-form-page__fields">
              <label>
                <span>Select tournament</span>
                <select value={tournamentId} onChange={(event) => { setTournamentId(event.target.value); setHorseName(''); }}>
                  <option value="">Choose registered event</option>
                  {tournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>{tournament.title}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Select horse</span>
                <select value={horseName} onChange={(event) => setHorseName(event.target.value)} disabled={!tournamentId}>
                  <option value="">Select a horse from stable</option>
                  {(eligibleHorses[tournamentId] || []).map((horse) => <option key={horse.id} value={horse.name}>{horse.name}</option>)}
                </select>
                <small>Only horses approved for a race in the selected tournament are shown.</small>
              </label>
            </div>

            <label className="invite-jockey-form-page__message">
              <span>Personal message</span>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add details to your invitation (optional)..." />
            </label>

            <div className="invite-jockey-form-page__notice-box">
              <InviteIcon name="info" />
              <p>Upon submission, this invitation will be sent to <strong>{jockey?.name || 'the selected jockey'}</strong> for formal review. Jockeys typically respond within 12 hours. Funds will be held in escrow upon acceptance.</p>
            </div>

            <div className="invite-jockey-form-page__cta">
              <button type="submit" disabled={submitting || !jockey}>
                {submitting ? 'Sending...' : <>Send Official Invitation <InviteIcon name="arrow-right" /></>}
              </button>
              <button type="button" onClick={() => navigate(`/HorseOwner/InviteJockeys/${profileTarget}`)}>Cancel Invitation</button>
            </div>
          </form>
        </section>
      </main>

      <footer className="invite-jockey-form-page__footer">
        <div>
          <section><h2>Heritage Racing</h2><p>Elevating the spirit of equestrian competition<br />since 1954.</p></section>
          <section><nav><a href="#rules">Rules of Racing</a><a href="#privacy">Privacy Policy</a><a href="#terms">Terms of Service</a><a href="#support">Contact Support</a></nav><p>© 2024 Heritage Racing Club. All rights reserved.</p></section>
        </div>
      </footer>

      {notice ? <div className="invite-jockey-form-page__toast" role="status">{notice}</div> : null}
    </div>
  );
}
