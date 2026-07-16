import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SpectatorFooter, SpectatorHeader } from '../../components/spectator/index.ts';
import horse1 from '../../assets/images/horse1.webp';
import horse2 from '../../assets/images/horse2.jpg';
import horse3 from '../../assets/images/horse3.jpg';
import horse4 from '../../assets/images/horse4.jpg';
import './SpectatorRaceDetail.css';

type Runner = {
  gate: number;
  horse: string;
  meta: string;
  jockey: string;
  weight: string;
  image?: string;
};

type Bet = {
  horse: string;
  stake: number;
};

type BetMode = 'place' | 'edit';

const runners: Runner[] = [
  {
    gate: 1,
    horse: 'Sovereign Victory',
    meta: 'Thoroughbred - 5 Years',
    jockey: 'James Whitaker',
    weight: 'W: 126lbs',
    image: horse1,
  },
  {
    gate: 2,
    horse: 'Emerald Legacy',
    meta: 'Thoroughbred - 4 Years',
    jockey: 'Elena Rossi',
    weight: 'W: 124lbs',
    image: horse2,
  },
  {
    gate: 3,
    horse: 'Gilded Thunder',
    meta: 'Arabian - 6 Years',
    jockey: 'Marcus Thorne',
    weight: 'W: 128lbs',
    image: horse3,
  },
  {
    gate: 4,
    horse: 'Midnight Rose',
    meta: 'Thoroughbred - 5 Years',
    jockey: 'Julian Vane',
    weight: 'W: 125lbs',
    image: horse4,
  },
  {
    gate: 5,
    horse: 'Silver Streak',
    meta: 'Thoroughbred - 4 Years',
    jockey: 'Sarah Jenkins',
    weight: 'W: 122lbs',
  },
  {
    gate: 6,
    horse: 'Desert Wind',
    meta: 'Arabian - 5 Years',
    jockey: 'Ahmed Al-Fayed',
    weight: 'W: 125lbs',
  },
  {
    gate: 7,
    horse: 'Royal Guard',
    meta: 'Thoroughbred - 6 Years',
    jockey: 'David Miller',
    weight: 'W: 128lbs',
  },
  {
    gate: 8,
    horse: 'Velvet Shadow',
    meta: 'Thoroughbred - 4 Years',
    jockey: 'Lucia Santos',
    weight: 'W: 123lbs',
  },
];
void runners;

const horsePath = (horseName: string) => `/Spectator/Horses/${horseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const titleCaseFromParam = (value?: string, fallback = '') => {
  if (!value) return fallback;

  const decoded = decodeURIComponent(value).replace(/[-_]+/g, ' ').trim();
  if (!decoded) return fallback;

  return decoded
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const RunnerImage: React.FC<{ runner: Runner }> = ({ runner }) => {
  if (runner.image) {
    return <img src={runner.image} alt={runner.horse} />;
  }

  return (
    <span className="spectator-runner-placeholder" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 15H15V3H3V15ZM4.5 13.5L7.15 10.05L9.1 12.4L11.05 9.9L13.5 13.5H4.5ZM6.25 7.25C5.85 7.25 5.51 7.11 5.23 6.82C4.94 6.54 4.8 6.2 4.8 5.8C4.8 5.4 4.94 5.06 5.23 4.78C5.51 4.49 5.85 4.35 6.25 4.35C6.65 4.35 6.99 4.49 7.27 4.78C7.56 5.06 7.7 5.4 7.7 5.8C7.7 6.2 7.56 6.54 7.27 6.82C6.99 7.11 6.65 7.25 6.25 7.25Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
};

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M5 14C5.28 14 5.52 13.9 5.71 13.71C5.9 13.52 6 13.28 6 13C6 12.72 5.9 12.48 5.71 12.29C5.52 12.1 5.28 12 5 12C4.72 12 4.48 12.1 4.29 12.29C4.1 12.48 4 12.72 4 13C4 13.28 4.1 13.52 4.29 13.71C4.48 13.9 4.72 14 5 14ZM5 10C5.28 10 5.52 9.9 5.71 9.71C5.9 9.52 6 9.28 6 9C6 8.72 5.9 8.48 5.71 8.29C5.52 8.1 5.28 8 5 8C4.72 8 4.48 8.1 4.29 8.29C4.1 8.48 4 8.72 4 9C4 9.28 4.1 9.52 4.29 9.71C4.48 9.9 4.72 10 5 10ZM5 6C5.28 6 5.52 5.9 5.71 5.71C5.9 5.52 6 5.28 6 5C6 4.72 5.9 4.48 5.71 4.29C5.52 4.1 5.28 4 5 4C4.72 4 4.48 4.1 4.29 4.29C4.1 4.48 4 4.72 4 5C4 5.28 4.1 5.52 4.29 5.71C4.48 5.9 4.72 6 5 6ZM8 14H14V12H8V14ZM8 10H14V8H8V10ZM8 6H14V4H8V6ZM2 18C1.45 18 0.98 17.8 0.59 17.41C0.2 17.02 0 16.55 0 16V2C0 1.45 0.2 0.98 0.59 0.59C0.98 0.2 1.45 0 2 0H16C16.55 0 17.02 0.2 17.41 0.59C17.8 0.98 18 1.45 18 2V16C18 16.55 17.8 17.02 17.41 17.41C17.02 17.8 16.55 18 16 18H2ZM2 16H16V2H2V16Z"
      fill="currentColor"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M6.75 11.25H8.25V6.75H6.75V11.25ZM7.5 5.25C7.71 5.25 7.89 5.18 8.03 5.03C8.18 4.89 8.25 4.71 8.25 4.5C8.25 4.29 8.18 4.11 8.03 3.97C7.89 3.82 7.71 3.75 7.5 3.75C7.29 3.75 7.11 3.82 6.97 3.97C6.82 4.11 6.75 4.29 6.75 4.5C6.75 4.71 6.82 4.89 6.97 5.03C7.11 5.18 7.29 5.25 7.5 5.25ZM7.5 15C6.46 15 5.49 14.8 4.58 14.41C3.66 14.02 2.87 13.48 2.19 12.81C1.52 12.13 0.98 11.34 0.59 10.43C0.2 9.51 0 8.54 0 7.5C0 6.46 0.2 5.49 0.59 4.58C0.98 3.66 1.52 2.87 2.19 2.19C2.87 1.52 3.66 0.98 4.58 0.59C5.49 0.2 6.46 0 7.5 0C8.54 0 9.51 0.2 10.43 0.59C11.34 0.98 12.13 1.52 12.81 2.19C13.48 2.87 14.02 3.66 14.41 4.58C14.8 5.49 15 6.46 15 7.5C15 8.54 14.8 9.51 14.41 10.43C14.02 11.34 13.48 12.13 12.81 12.81C12.13 13.48 11.34 14.02 10.43 14.41C9.51 14.8 8.54 15 7.5 15Z"
      fill="currentColor"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C8.62 20 7.33 19.74 6.13 19.21C4.92 18.69 3.88 17.98 3 17C2.02 16.12 1.31 15.08 0.79 13.87C0.26 12.67 0 11.38 0 10C0 8.62 0.26 7.33 0.79 6.13C1.31 4.92 2.02 3.88 3 3C3.88 2.02 4.92 1.31 6.13 0.79C7.33 0.26 8.62 0 10 0C11.38 0 12.67 0.26 13.87 0.79C15.08 1.31 16.12 2.02 17 3C17.98 3.88 18.69 4.92 19.21 6.13C19.74 7.33 20 8.62 20 10C20 11.38 19.74 12.67 19.21 13.87C18.69 15.08 17.98 16.12 17 17C16.12 17.98 15.08 18.69 13.87 19.21C12.67 19.74 11.38 20 10 20Z"
      fill="currentColor"
    />
  </svg>
);

const formatMoney = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

type SpectatorRaceData = { description?: string; date?: string; time?: string; distance?: string; runnerCount?: number };
type SpectatorRaceDetailProps = { data?: SpectatorRaceData | null; runners?: Runner[]; loading?: boolean; error?: string };

export const SpectatorRaceDetail: React.FC<SpectatorRaceDetailProps> = ({ data, runners = [], loading = false, error }) => {
  const { name, racename } = useParams();
  const tournamentName = titleCaseFromParam(name, 'The Royal Heritage Cup');
  const raceName = titleCaseFromParam(racename, 'Qualifier A');
  const [bet, setBet] = useState<Bet | null>(null);
  const [betMode, setBetMode] = useState<BetMode>('place');
  const [isBetFormOpen, setIsBetFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [draftHorse, setDraftHorse] = useState(runners[0]?.horse ?? '');
  const [draftStake, setDraftStake] = useState('100');

  const draftStakeNumber = Number(draftStake);
  const minimumStake = betMode === 'edit' && bet ? bet.stake : 1;
  const isDraftValid = draftHorse.trim().length > 0 && Number.isFinite(draftStakeNumber) && draftStakeNumber >= minimumStake;
  const payout = useMemo(() => (bet ? bet.stake * 5 : 0), [bet]);
  const draftPayout = Number.isFinite(draftStakeNumber) ? draftStakeNumber * 5 : 0;

  const openBetForm = (mode: BetMode) => {
    setBetMode(mode);
    setDraftHorse(bet?.horse || runners[0]?.horse || '');
    setDraftStake(String(bet?.stake || 100));
    setIsBetFormOpen(true);
  };

  const closeBetFlow = () => {
    setIsBetFormOpen(false);
    setIsConfirmOpen(false);
  };

  const requestConfirmation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDraftValid) return;
    setIsConfirmOpen(true);
  };

  const confirmBet = () => {
    if (!isDraftValid) return;
    setBet({ horse: draftHorse, stake: draftStakeNumber });
    closeBetFlow();
  };

  if (!data) return <div className="spectator-race-page"><SpectatorHeader /><main className="spectator-race-api-empty">{loading ? 'Loading race data...' : error || 'No race data is available.'}</main></div>;

  return (
    <div className="spectator-race-page">
      <SpectatorHeader />

      <main className="spectator-race-main">
        <section className="spectator-race-hero">
          <div className="spectator-race-hero__inner">
            <div className="spectator-race-hero__copy">
              <h1>{tournamentName}</h1>
              {data.description ? <p>{data.description}</p> : null}
            </div>

            <div className="spectator-race-summary" aria-label="Race summary">
              <div>
                <span>Date &amp; Time</span>
                <strong>{data.date || 'Pending'}</strong>
                <p>{data.time || 'Pending'}</p>
              </div>
              <div className="spectator-race-summary__distance">
                <span>Distance</span>
                <strong>{data.distance || 'Pending'}</strong>
                <p>meters</p>
              </div>
              <div>
                <span>Runners</span>
                <strong>{data.runnerCount ?? runners.length}</strong>
                <p>Confirmed</p>
              </div>
            </div>
          </div>
        </section>

        <section className="spectator-race-content">
          <article className="spectator-lineup">
            <header className="spectator-lineup__header">
              <h2>
                <ListIcon />
                {raceName}
              </h2>
              <span>
                <InfoIcon />
                Final Declaration
              </span>
            </header>

            <div className="spectator-lineup__table" role="table" aria-label={`${raceName} lineup`}>
              <div className="spectator-lineup__row spectator-lineup__row--head" role="row">
                <span>Gate</span>
                <span>Horse</span>
                <span>Jockey</span>
                <span>Finish Time</span>
                <span>Rank</span>
              </div>
              {runners.map((runner) => (
                <div className="spectator-lineup__row" role="row" key={runner.gate}>
                  <span className="spectator-lineup__gate">{runner.gate}</span>
                  <div className="spectator-lineup__horse">
                    <RunnerImage runner={runner} />
                    <div>
                      <Link to={horsePath(runner.horse)} className="spectator-lineup__horse-link">
                        {runner.horse}
                      </Link>
                      <span>{runner.meta}</span>
                    </div>
                  </div>
                  <div className="spectator-lineup__jockey">
                    <strong>{runner.jockey}</strong>
                    <span>{runner.weight}</span>
                  </div>
                  <span className="spectator-lineup__pending">Pending</span>
                  <span className="spectator-lineup__rank">-</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="spectator-active-bet" aria-label="Active bet">
            <header>
              <CheckIcon />
              <h2>Active Bet</h2>
            </header>
            <div className="spectator-active-bet__body">
              {bet ? (
                <>
                  <dl>
                    <div>
                      <dt>Selected Horse</dt>
                      <dd>{bet.horse}</dd>
                    </div>
                    <div>
                      <dt>Stake Amount</dt>
                      <dd>{formatMoney(bet.stake)}</dd>
                    </div>
                  </dl>
                  <div className="spectator-active-bet__payout">
                    <span>Est. Payout</span>
                    <strong>{formatMoney(payout)}</strong>
                  </div>
                  <button type="button" onClick={() => openBetForm('edit')}>
                    Edit Bet
                  </button>
                  <p>Bet ID: #HR-2024-9921. T&amp;Cs Apply.</p>
                </>
              ) : (
                <div className="spectator-active-bet__empty">
                  <p>Select a runner from this race and place your first stake before the gates open.</p>
                  <button type="button" onClick={() => openBetForm('place')}>
                    Place Bet
                  </button>
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>

      {isBetFormOpen && (
        <div className="spectator-bet-modal" role="dialog" aria-modal="true" aria-labelledby="bet-form-title">
          <div className="spectator-bet-modal__panel">
            <form onSubmit={requestConfirmation}>
              <div className="spectator-bet-modal__header">
                <div>
                  <span>{betMode === 'edit' ? 'Update Stake' : 'New Bet'}</span>
                  <h2 id="bet-form-title">{betMode === 'edit' ? 'Edit Bet' : 'Place Bet'}</h2>
                </div>
                <button type="button" onClick={closeBetFlow} aria-label="Close bet form">
                  x
                </button>
              </div>

              <label>
                <span>Horse</span>
                <select value={draftHorse} onChange={(event) => setDraftHorse(event.target.value)}>
                  {runners.map((runner) => (
                    <option key={runner.horse} value={runner.horse}>
                      Gate {runner.gate} - {runner.horse}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Stake Amount</span>
                <input
                  type="number"
                  min={minimumStake}
                  step="1"
                  value={draftStake}
                  onChange={(event) => setDraftStake(event.target.value)}
                />
              </label>

              {betMode === 'edit' && bet && (
                <p className="spectator-bet-modal__hint">
                  Current stake is {formatMoney(bet.stake)}. You can switch horses or increase the stake, but not reduce it.
                </p>
              )}

              <div className="spectator-bet-modal__preview">
                <span>Estimated payout</span>
                <strong>{isDraftValid ? formatMoney(draftPayout) : '-'}</strong>
              </div>

              <div className="spectator-bet-modal__actions">
                <button type="button" onClick={closeBetFlow}>
                  Cancel
                </button>
                <button type="submit" disabled={!isDraftValid}>
                  {betMode === 'edit' ? 'Update Bet' : 'Place Bet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="spectator-bet-modal" role="dialog" aria-modal="true" aria-labelledby="bet-confirm-title">
          <div className="spectator-bet-modal__panel spectator-bet-modal__panel--confirm">
            <div className="spectator-bet-confirm">
              <span>Confirmation</span>
              <h2 id="bet-confirm-title">Confirm Your Bet</h2>
              <dl>
                <div>
                  <dt>Horse</dt>
                  <dd>{draftHorse}</dd>
                </div>
                <div>
                  <dt>Stake</dt>
                  <dd>{formatMoney(draftStakeNumber)}</dd>
                </div>
                <div>
                  <dt>Estimated Payout</dt>
                  <dd>{formatMoney(draftPayout)}</dd>
                </div>
              </dl>
              <div className="spectator-bet-modal__actions">
                <button type="button" onClick={() => setIsConfirmOpen(false)}>
                  Back
                </button>
                <button type="button" onClick={confirmBet}>
                  Confirm Bet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SpectatorFooter />
    </div>
  );
};

export default SpectatorRaceDetail;
