import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/common/Header.tsx';
import { getPageData, MyHorse } from '../data/pageData.ts';
import './HorseOwnerTournamentEntryRegister.css';

type RuleIcon = 'shield' | 'gavel' | 'trophy';

type TournamentRule = {
  title: string;
  icon: RuleIcon;
  items: string[];
};

type TournamentRegisterData = {
  classLabel: string;
  title: string;
  description: string;
  stats: Array<{ label: string; value: string; tone?: 'gold' | 'light' }>;
  rules: TournamentRule[];
};

type RawRegisterData = Partial<TournamentRegisterData>;

type HorsesPayload = {
  horses?: Array<Partial<MyHorse>>;
};

const EMPTY_REGISTER_DATA: TournamentRegisterData = {
  classLabel: 'International Grade I Invitational',
  title: 'The Platinum Jubilee Stakes',
  description:
    'A heritage sprint across the hallowed turf, celebrating seventy years of excellence in thoroughbred breeding and competitive spirit.',
  stats: [
    { label: 'Date', value: 'July 14, 2024' },
    { label: 'Purse', value: '$2,500,000', tone: 'gold' },
    { label: 'Location', value: 'Ascot, UK' },
    { label: 'Distance', value: '2400m' },
    { label: 'Entries', value: '12/20 Horses', tone: 'gold' },
  ],
  rules: [
    {
      title: 'Eligibility',
      icon: 'shield',
      items: [
        'Horses must be aged 3 years or older.',
        'Minimum Grade II certification required.',
        'Owner must hold a valid Heritage Club license.',
      ],
    },
    {
      title: 'Racing Rules',
      icon: 'gavel',
      items: [
        'Standard flat racing regulations apply.',
        'Mandatory post-race blood testing.',
        'Fixed weight-for-age penalties strictly enforced.',
      ],
    },
    {
      title: 'Prize Breakdown',
      icon: 'trophy',
      items: ['1st Place: $1,500,000', '2nd Place: $750,000', '3rd Place: $250,000'],
    },
  ],
};

function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/\n/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeRegisterData(raw?: RawRegisterData | null): TournamentRegisterData {
  return {
    ...EMPTY_REGISTER_DATA,
    ...raw,
    stats: raw?.stats?.length ? raw.stats : EMPTY_REGISTER_DATA.stats,
    rules: raw?.rules?.length ? raw.rules : EMPTY_REGISTER_DATA.rules,
  };
}

function normalizeHorses(raw?: Array<Partial<MyHorse>>): MyHorse[] {
  return Array.isArray(raw)
    ? raw
        .filter((horse): horse is MyHorse => Boolean(horse.name))
        .map((horse) => ({
          name: horse.name,
          meta: horse.meta || '',
          imageSrc: horse.imageSrc || '',
        }))
    : [];
}

function readRegisterFromLocalStorage(slug: string): RawRegisterData | null {
  try {
    const specific = window.localStorage.getItem(`horse_owner_tournament_register_${slug}`);
    const shared = window.localStorage.getItem('horse_owner_tournament_register_data');
    return specific ? (JSON.parse(specific) as RawRegisterData) : shared ? (JSON.parse(shared) as RawRegisterData) : null;
  } catch {
    return null;
  }
}

function readHorsesFromLocalStorage(): HorsesPayload | null {
  try {
    const raw = window.localStorage.getItem('my_horses_data');
    return raw ? (JSON.parse(raw) as HorsesPayload) : null;
  } catch {
    return null;
  }
}

async function readRegisterFromApi(slug: string): Promise<RawRegisterData | null> {
  try {
    const base = process.env.REACT_APP_HORSE_OWNER_TOURNAMENT_REGISTER_API || '/api/horse-owner/tournaments';
    const response = await fetch(`${base}/${encodeURIComponent(slug)}/register`, { method: 'GET' });
    if (!response.ok) return null;
    return (await response.json()) as RawRegisterData;
  } catch {
    return null;
  }
}

async function readHorsesFromApi(): Promise<HorsesPayload | null> {
  try {
    const endpoint = process.env.REACT_APP_HORSE_OWNER_MY_HORSES_API || '/api/horse-owner/my-horses';
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) return null;
    return (await response.json()) as HorsesPayload;
  } catch {
    return null;
  }
}

function horseAgeLabel(meta: string) {
  const parts = meta.split(' - ').map((part) => part.trim()).filter(Boolean);
  return parts.length >= 3 ? `${parts[1]} ${parts[2]}` : meta || 'Details pending';
}

function RuleSvg({ name }: { name: RuleIcon }) {
  const paths: Record<RuleIcon, string> = {
    shield:
      'M8 20c-2.3-.6-4.2-1.9-5.7-4C.8 13.9 0 11.6 0 9.1V3l8-3 8 3v6.1c0 2.5-.8 4.8-2.3 6.9-1.5 2.1-3.4 3.4-5.7 4Zm-1-6.5 5.7-5.7-1.4-1.4L7 10.7 4.9 8.6 3.5 10 7 13.5Z',
    gavel:
      'M1 22v-2h12v2H1Zm5.7-4.9L1.1 11.5l2.1-2.1 5.7 5.6-2.2 2.1Zm6.3-6.4L7.4 5l2.1-2.1 5.7 5.6-2.2 2.2Zm4.6 10.2L4.6 7.9 6 6.5l13 13-1.4 1.4Z',
    trophy:
      'M4 18v-2h4v-3.1a6.12 6.12 0 0 1-3.6-2.95 5.1 5.1 0 0 1-3.14-1.64A4.85 4.85 0 0 1 0 5V4c0-.55.2-1.02.59-1.41C.98 2.2 1.45 2 2 2h2V0h10v2h2c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v1c0 1.27-.42 2.37-1.26 3.31a5.1 5.1 0 0 1-3.14 1.64A6.12 6.12 0 0 1 10 12.9V16h4v2H4Z',
  };

  return (
    <svg viewBox="0 0 22 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M10.1 7.5H0V5.8h10.1L5.5 1.2 6.7 0l6.6 6.7-6.6 6.6-1.2-1.2 4.6-4.6Z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M1.3 12c-.4 0-.7-.1-.9-.4-.3-.3-.4-.6-.4-.9V1.3C0 .9.1.6.4.4.6.1.9 0 1.3 0H6v1.3H1.3v9.4h9.4V6H12v4.7c0 .4-.1.7-.4.9-.3.3-.6.4-.9.4H1.3Zm3.2-3.5-.9-.9 6.1-6.3H7.3V0H12v4.7h-1.3V2.3L4.5 8.5Z" />
    </svg>
  );
}

function HorseCard({
  horse,
  selected,
  onSelect,
}: {
  horse: MyHorse;
  selected: boolean;
  onSelect: (horse: MyHorse) => void;
}) {
  return (
    <button className={`ho-register-horse-card ${selected ? 'is-selected' : ''}`} type="button" onClick={() => onSelect(horse)}>
      <span className="ho-register-horse-card__image">
        {horse.imageSrc ? <img src={horse.imageSrc} alt={horse.name} /> : null}
      </span>
      <span className="ho-register-horse-card__body">
        <strong>{horse.name}</strong>
        <small>{horseAgeLabel(horse.meta)}</small>
      </span>
    </button>
  );
}

export default function HorseOwnerTournamentEntryRegister() {
  const { name } = useParams<{ name?: string }>();
  const decodedName = decodeURIComponent(name ?? '');
  const slug = normalizeSlug(decodedName || EMPTY_REGISTER_DATA.title);
  const { tournamentPage, myHorses } = getPageData();
  const fallbackTournament = tournamentPage.tournaments.find(
    (item) => normalizeSlug(item.id) === slug || normalizeSlug(item.title) === slug,
  );
  const fallbackData = React.useMemo(
    () =>
      normalizeRegisterData({
        title: fallbackTournament?.title?.replace(/\n/g, ' ') || decodedName || EMPTY_REGISTER_DATA.title,
        description: fallbackTournament?.description || EMPTY_REGISTER_DATA.description,
        stats: fallbackTournament
          ? [
              { label: 'Date', value: fallbackTournament.dateValue || 'TBA' },
              { label: 'Purse', value: fallbackTournament.prizePool || 'TBA', tone: 'gold' },
              { label: 'Location', value: 'Ascot, UK' },
              { label: 'Distance', value: '2400m' },
              { label: 'Entries', value: '12/20 Horses', tone: 'gold' },
            ]
          : EMPTY_REGISTER_DATA.stats,
      }),
    [decodedName, fallbackTournament],
  );
  const [data, setData] = React.useState<TournamentRegisterData>(() =>
    normalizeRegisterData(readRegisterFromLocalStorage(slug) ?? fallbackData),
  );
  const [horses, setHorses] = React.useState<MyHorse[]>(() => {
    const local = readHorsesFromLocalStorage();
    return local ? normalizeHorses(local.horses) : normalizeHorses(myHorses.horses);
  });
  const [selectedHorse, setSelectedHorse] = React.useState<MyHorse | null>(null);
  const [allHorsesOpen, setAllHorsesOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiData = await readRegisterFromApi(slug);
      const localData = readRegisterFromLocalStorage(slug);
      const apiHorses = await readHorsesFromApi();
      const localHorses = readHorsesFromLocalStorage();

      if (!cancelled) {
        setData(normalizeRegisterData(apiData ?? localData ?? fallbackData));
        setHorses(normalizeHorses((apiHorses ?? localHorses)?.horses ?? myHorses.horses));
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [fallbackData, myHorses.horses, slug]);

  const previewHorses = horses.slice(0, 2);
  const hasHorses = horses.length > 0;

  const handleRegister = () => {
    if (!selectedHorse) return;
    setConfirmOpen(true);
  };

  const handleConfirmRegistration = () => {
    setSubmitted(true);
    setConfirmOpen(false);
  };

  const handleSelectFromModal = (horse: MyHorse) => {
    setSelectedHorse(horse);
    setAllHorsesOpen(false);
  };

  return (
    <div className="ho-register-page">
      <Header />

      <main className="ho-register-main">
        <section className="ho-register-hero" aria-label={data.title}>
          <div className="ho-register-hero__copy">
            <p>{data.classLabel}</p>
            <h1>{data.title}</h1>
            <span>{data.description}</span>
          </div>
          <dl className="ho-register-hero__stats">
            {data.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd className={stat.tone === 'gold' ? 'is-gold' : undefined}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="ho-register-body">
          <section className="ho-register-section" aria-labelledby="rules-title">
            <div className="ho-register-section__heading">
              <h2 id="rules-title">Rules of Participation</h2>
              <span />
            </div>
            <div className="ho-register-rules">
              {data.rules.map((rule) => (
                <article key={rule.title}>
                  <RuleSvg name={rule.icon} />
                  <div>
                    <h3>{rule.title}</h3>
                    <ul>
                      {rule.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="ho-register-section" aria-labelledby="entry-title">
            <div className="ho-register-section__heading">
              <h2 id="entry-title">Race Entry Form</h2>
              <span />
            </div>

            <div className="ho-register-entry">
              <div className="ho-register-picker">
                <div className="ho-register-picker__head">
                  <h3>Select Your Horse</h3>
                  {hasHorses ? (
                    <button type="button" onClick={() => setAllHorsesOpen(true)}>
                      View All Horses
                      <ExternalIcon />
                    </button>
                  ) : null}
                </div>

                {hasHorses ? (
                  <div className="ho-register-horse-grid">
                    {previewHorses.map((horse) => (
                      <HorseCard
                        key={horse.name}
                        horse={horse}
                        selected={selectedHorse?.name === horse.name}
                        onSelect={setSelectedHorse}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="ho-register-empty-horses">
                    <h4>No horses registered yet</h4>
                    <p>Add a horse to your stable before entering this tournament.</p>
                    <Link to="/HorseOwner/MyHorses/Add">Add Horse</Link>
                  </div>
                )}
              </div>

              <aside className="ho-register-summary" aria-label="Registration summary">
                <h3>Registration Summary</h3>
                <div className="ho-register-summary__row">
                  <span>Horse selected</span>
                  <strong>{selectedHorse?.name || 'None selected'}</strong>
                </div>
                <div className="ho-register-summary__action">
                  <button type="button" onClick={handleRegister} disabled={!selectedHorse}>
                    Confirm Registration
                    <ArrowIcon />
                  </button>
                  <p>Your registration will be submitted for administrative review.</p>
                  <small>
                    By clicking confirm, you agree to the <a href="#rules-title">Official Rules</a>.
                  </small>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <footer className="ho-register-footer">
        <div>
          <h2>Heritage Racing</h2>
          <p>Elevating the spirit of equestrian competition since 1954.</p>
        </div>
        <nav aria-label="Register page footer navigation">
          <a href="#rules-title">Rules of Racing</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Contact Support</a>
        </nav>
        <p>(c) 2024 Heritage Racing Club. All rights reserved.</p>
      </footer>

      {allHorsesOpen ? (
        <div className="ho-register-modal-backdrop" role="presentation" onMouseDown={() => setAllHorsesOpen(false)}>
          <section
            className="ho-register-horses-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-horses-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <h2 id="all-horses-title">All Registered Horses</h2>
                <p>Select one horse from your stable for this tournament.</p>
              </div>
              <button type="button" aria-label="Close horse list" onClick={() => setAllHorsesOpen(false)}>
                x
              </button>
            </header>
            {hasHorses ? (
              <div className="ho-register-modal-grid">
                {horses.map((horse) => (
                  <HorseCard
                    key={horse.name}
                    horse={horse}
                    selected={selectedHorse?.name === horse.name}
                    onSelect={handleSelectFromModal}
                  />
                ))}
              </div>
            ) : (
              <div className="ho-register-empty-horses ho-register-empty-horses--modal">
                <h4>No horses registered yet</h4>
                <p>Your stable is empty. Add a horse before entering the tournament.</p>
                <Link to="/HorseOwner/MyHorses/Add">Add Horse</Link>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {confirmOpen ? (
        <div className="ho-register-modal-backdrop" role="presentation" onMouseDown={() => setConfirmOpen(false)}>
          <section
            className="ho-register-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-register-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="confirm-register-title">Confirm Registration</h2>
            <p>
              Register <strong>{selectedHorse?.name}</strong> for <strong>{data.title}</strong>?
            </p>
            <div>
              <button type="button" onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={handleConfirmRegistration}>
                Confirm
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {submitted ? (
        <div className="ho-register-toast" role="status">
          {selectedHorse?.name} has been submitted for administrative review.
        </div>
      ) : null}
    </div>
  );
}
