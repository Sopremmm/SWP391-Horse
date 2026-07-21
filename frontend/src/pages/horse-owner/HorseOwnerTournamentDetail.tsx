import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../../components/common/Header.tsx';
import { getPageData } from '../../data/pageData.ts';
import './HorseOwnerTournamentDetail.css';

type RaceStatus = 'completed' | 'live' | 'upcoming' | string;

type TournamentRace = {
  id: string;
  round: 'qualifying' | 'semi' | 'final' | string;
  name: string;
  dateTime: string;
  distance: string;
  status: RaceStatus;
  entrantLabel?: string;
  entrantTone?: 'winner' | 'live' | 'pending';
};

type TournamentParticipant = {
  id?: string | number;
  horse: string;
  breedAge: string;
  jockey: string;
  owner: string;
};

type TournamentDetailData = {
  title: string;
  presenter: string;
  location: string;
  dateRange: string;
  heroImage?: string;
  races: TournamentRace[];
  participants: TournamentParticipant[];
  final: {
    title: string;
    dateTime: string;
    venue: string;
    distance: string;
    status?: RaceStatus;
  };
};

type RawTournamentDetailData = Partial<TournamentDetailData> & {
  bracket?: TournamentRace[];
  schedule?: TournamentRace[];
};

const fallbackRaces: TournamentRace[] = [
  {
    id: 'qualifying-a',
    round: 'qualifying',
    name: 'Qualifying A',
    dateTime: 'Aug 20 - 14:00',
    distance: '1,600M',
    status: 'completed',
    entrantLabel: 'Midnight Thunder',
    entrantTone: 'winner',
  },
  {
    id: 'qualifying-b',
    round: 'qualifying',
    name: 'Qualifying B',
    dateTime: 'Aug 21 - 14:00',
    distance: '1,600M',
    status: 'live',
    entrantLabel: 'Star Chaser',
    entrantTone: 'live',
  },
  {
    id: 'qualifying-c',
    round: 'qualifying',
    name: 'Qualifying C',
    dateTime: 'Aug 21 - 16:00',
    distance: '1,600M',
    status: 'upcoming',
  },
  {
    id: 'qualifying-d',
    round: 'qualifying',
    name: 'Qualifying D',
    dateTime: 'Aug 21 - 18:00',
    distance: '1,600M',
    status: 'upcoming',
  },
  {
    id: 'semi-final-a',
    round: 'semi',
    name: 'Semi-Final A',
    dateTime: 'Aug 22 - 14:00',
    distance: '2,000M',
    status: 'upcoming',
  },
  {
    id: 'semi-final-b',
    round: 'semi',
    name: 'Semi-Final B',
    dateTime: 'Aug 22 - 16:00',
    distance: '2,000M',
    status: 'upcoming',
  },
  {
    id: 'grand-final',
    round: 'final',
    name: 'Grand Final',
    dateTime: 'Aug 24 - 18:00',
    distance: '2,400M',
    status: 'upcoming',
  },
];

const EMPTY_DETAIL_DATA: TournamentDetailData = {
  title: 'The Royal Gold Cup',
  presenter: 'Heritage Racing Presents',
  location: 'Grand Valley Circuit, UK',
  dateRange: 'Aug 20 - Aug 24, 2024',
  races: fallbackRaces,
  participants: [
    { horse: 'Sovereign Victory', breedAge: 'Thoroughbred · 5yo Stallion', jockey: 'James Whitaker', owner: 'Lord Winston Churchill' },
    { horse: 'Emerald Legacy', breedAge: 'Thoroughbred · 4yo Mare', jockey: 'Elena Rossi', owner: 'Duke of Wellington' },
    { horse: 'Gilded Thunder', breedAge: 'Arabian Cross · 6yo Stallion', jockey: 'Marcus Thorne', owner: 'Eleanor Rigby' },
    { horse: 'Midnight Rose', breedAge: 'Thoroughbred · 3yo Mare', jockey: 'Julian Vane', owner: 'Sir Arthur Dayne' },
    { horse: 'Royal Radiance', breedAge: 'Warmblood · 5yo Mare', jockey: 'Sarah Jenkins', owner: 'Lady Katherine' },
    { horse: 'Velvet Gallop', breedAge: 'Thoroughbred · 4yo Gelding', jockey: 'Oliver Reed', owner: 'Baron von Richter' },
    { horse: 'Majestic Wind', breedAge: 'Arabian · 5yo Stallion', jockey: 'Leo Sterling', owner: 'Countess of Kent' },
    { horse: 'Golden Mane', breedAge: 'Thoroughbred · 6yo Stallion', jockey: 'Thomas Wright', owner: 'General Montgomery' },
    { horse: 'Autumn Regent', breedAge: 'Thoroughbred · 4yo Gelding', jockey: 'Amelia Hart', owner: 'Helena Ward' },
    { horse: 'Ivory Monarch', breedAge: 'Arabian Cross · 3yo Stallion', jockey: 'Noah Bennett', owner: 'Edward Sinclair' },
  ],
  final: {
    title: 'Grand Finale',
    dateTime: 'Aug 24 - 18:00 EST',
    venue: 'Royal Track',
    distance: '2400m',
    status: 'upcoming',
  },
};

function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/\n/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function statusLabel(status: RaceStatus) {
  if (status === 'live') return 'Live Now';
  if (status === 'completed') return 'Completed';
  return 'Upcoming';
}

function displayDate(value: string) {
  return value.replace(' - ', ' • ');
}

function raceHref(race: TournamentRace) {
  return `#${race.id}`;
}

function normalizeDetailData(raw?: RawTournamentDetailData | null): TournamentDetailData {
  const races = raw?.races || raw?.bracket || raw?.schedule || EMPTY_DETAIL_DATA.races;
  return {
    ...EMPTY_DETAIL_DATA,
    ...raw,
    races: races.length ? races : [],
    participants: raw?.participants || EMPTY_DETAIL_DATA.participants,
    final: {
      ...EMPTY_DETAIL_DATA.final,
      ...raw?.final,
    },
  };
}

function readDetailFromLocalStorage(slug: string): RawTournamentDetailData | null {
  try {
    const specific = window.localStorage.getItem(`horse_owner_tournament_detail_${slug}`);
    const shared = window.localStorage.getItem('horse_owner_tournament_detail_data');
    return specific ? (JSON.parse(specific) as RawTournamentDetailData) : shared ? (JSON.parse(shared) as RawTournamentDetailData) : null;
  } catch {
    return null;
  }
}

async function readDetailFromApi(slug: string): Promise<RawTournamentDetailData | null> {
  try {
    const base = process.env.REACT_APP_HORSE_OWNER_TOURNAMENT_DETAIL_API || '/api/horse-owner/tournaments';
    const response = await fetch(`${base}/${encodeURIComponent(slug)}`, { method: 'GET' });
    if (!response.ok) return null;
    return (await response.json()) as RawTournamentDetailData;
  } catch {
    return null;
  }
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 10 12" aria-hidden="true">
      <path d="M5 11.7C3.3 10.2 2 8.9 1.2 7.8.4 6.7 0 5.7 0 4.8 0 3.3.5 2.2 1.4 1.3A5 5 0 0 1 5 0c1.3 0 2.5.4 3.6 1.3.9.9 1.4 2 1.4 3.5 0 .9-.4 1.9-1.2 3.1-.8 1.1-2.1 2.4-3.8 3.8Zm0-5.8c.4 0 .7-.1 1-.4.2-.2.4-.5.4-.9S6.2 3.9 6 3.6c-.3-.2-.6-.4-1-.4s-.7.1-1 .4c-.2.3-.4.6-.4 1s.1.7.4.9c.3.3.6.4 1 .4Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M1.3 12c-.4 0-.7-.1-.9-.4-.3-.3-.4-.6-.4-.9v-8c0-.4.1-.7.4-.9.2-.3.5-.5.9-.5H2V0h1.3v1.3h5.4V0H10v1.3h.7c.4 0 .7.2.9.5.3.2.4.5.4.9v8c0 .3-.1.6-.4.9-.2.3-.5.4-.9.4H1.3Zm0-1.3h9.4V5.3H1.3v5.4Zm0-6.7h9.4V2.7H1.3V4Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true">
      <path d="M6.1 4.5H0v-1h6.1L3.3.7 4 0l4 4-4 4-.7-.7 2.8-2.8Z" />
    </svg>
  );
}

function RaceBadge({ race, index }: { race: TournamentRace; index: number }) {
  const label = race.entrantLabel || `${displayDate(race.dateTime)} • ${race.distance}`;
  const marker = race.entrantTone === 'winner' ? 'W' : race.entrantTone === 'live' ? '2' : String(index + 1);

  return (
    <div className="ho-tourney-race-card__entrant">
      <span className={`ho-tourney-race-card__marker ho-tourney-race-card__marker--${race.entrantTone || 'pending'}`}>
        {marker}
      </span>
      <strong>{label}</strong>
    </div>
  );
}

function RaceCard({ race, index }: { race: TournamentRace; index: number }) {
  return (
    <article className={`ho-tourney-race-card ${race.status === 'live' ? 'is-live' : ''}`} id={race.id}>
      <div className="ho-tourney-race-card__meta">
        <span>{displayDate(race.dateTime)}</span>
        <small className={`ho-tourney-status ho-tourney-status--${race.status}`}>{statusLabel(race.status)}</small>
      </div>
      <h3>{race.name}</h3>
      <RaceBadge race={race} index={index} />
      <Link to={raceHref(race)}>
        View Race
        <ArrowIcon />
      </Link>
    </article>
  );
}

export default function HorseOwnerTournamentDetail() {
  const { name } = useParams<{ name?: string }>();
  const decodedName = decodeURIComponent(name ?? '');
  const routeName = encodeURIComponent(decodedName || EMPTY_DETAIL_DATA.title);
  const slug = normalizeSlug(decodedName || EMPTY_DETAIL_DATA.title);
  const { tournamentPage } = getPageData();
  const fallbackTournament = tournamentPage.tournaments.find(
    (item) => normalizeSlug(item.id) === slug || normalizeSlug(item.title) === slug,
  );
  const fallbackData = React.useMemo(
    () =>
      normalizeDetailData({
        title: fallbackTournament?.title?.replace(/\n/g, ' ') || EMPTY_DETAIL_DATA.title,
        heroImage: fallbackTournament?.imageUrl,
        dateRange: fallbackTournament?.dateValue || EMPTY_DETAIL_DATA.dateRange,
      }),
    [fallbackTournament?.dateValue, fallbackTournament?.imageUrl, fallbackTournament?.title],
  );
  const [detail, setDetail] = React.useState<TournamentDetailData>(() =>
    normalizeDetailData(readDetailFromLocalStorage(slug) ?? fallbackData),
  );
  const [participantsOpen, setParticipantsOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiData = await readDetailFromApi(slug);
      const localData = readDetailFromLocalStorage(slug);
      if (!cancelled) setDetail(normalizeDetailData(apiData ?? localData ?? fallbackData));
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [fallbackData, slug]);

  const qualifying = detail.races.filter((race) => race.round === 'qualifying');
  const semiFinals = detail.races.filter((race) => race.round === 'semi');
  const schedule = detail.races;
  const participantCount = detail.participants.length;

  return (
    <div className="ho-tourney-detail">
      <Header />

      <main className="ho-tourney-detail__main">
        <section className="ho-tourney-hero" aria-label={detail.title}>
          {detail.heroImage ? <img src={detail.heroImage} alt={detail.title} /> : <div className="ho-tourney-hero__placeholder" />}
          <div className="ho-tourney-hero__overlay">
            <p>{detail.presenter}</p>
            <h1>{detail.title}</h1>
            <div className="ho-tourney-hero__meta">
              <span>
                <LocationIcon />
                {detail.location}
              </span>
              <span>
                <CalendarIcon />
                {detail.dateRange}
              </span>
            </div>
            <div className="ho-tourney-hero__actions">
              <button type="button" onClick={() => setParticipantsOpen(true)}>
                View Participants
              </button>
              <Link to={`/HorseOwner/Tournaments/${routeName}/Register`}>Register</Link>
            </div>
          </div>
        </section>

        <section className="ho-tourney-section" aria-labelledby="bracket-title">
          <div className="ho-tourney-section__heading">
            <h2 id="bracket-title">Tournament Bracket</h2>
          </div>

          <div className="ho-tourney-bracket">
            <div className="ho-tourney-bracket__column">
              <h3>Qualifying</h3>
              <div className="ho-tourney-bracket__stack">
                {qualifying.map((race, index) => (
                  <RaceCard key={race.id} race={race} index={index} />
                ))}
              </div>
            </div>

            <div className="ho-tourney-bracket__column ho-tourney-bracket__column--middle">
              <h3>Semi-Finals</h3>
              <div className="ho-tourney-bracket__stack">
                {semiFinals.map((race, index) => (
                  <RaceCard key={race.id} race={race} index={index} />
                ))}
              </div>
            </div>

            <div className="ho-tourney-bracket__column ho-tourney-bracket__column--final">
              <h3>Tournament Finals</h3>
              <article className="ho-tourney-final">
                <div>
                  <h4>{detail.final.title}</h4>
                  <p>{detail.final.dateTime}</p>
                </div>
                <div className="ho-tourney-final__stats">
                  <span>
                    Venue
                    <strong>{detail.final.venue}</strong>
                  </span>
                  <span>
                    Distance
                    <strong>{detail.final.distance}</strong>
                  </span>
                </div>
                <Link to="#grand-final">
                  View Race
                  <ArrowIcon />
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="ho-tourney-section" aria-labelledby="schedule-title">
          <div className="ho-tourney-section__heading">
            <h2 id="schedule-title">Race Schedule</h2>
          </div>

          <div className="ho-tourney-schedule" role="table" aria-label="Race schedule">
            <div className="ho-tourney-schedule__head" role="row">
              <span role="columnheader">Date &amp; Time</span>
              <span role="columnheader">Race Name</span>
              <span role="columnheader">Distance</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">Action</span>
            </div>
            {schedule.map((race) => (
              <div className="ho-tourney-schedule__row" role="row" key={race.id}>
                <strong role="cell">{race.dateTime}</strong>
                <strong role="cell">{race.name}</strong>
                <strong role="cell">{race.distance}</strong>
                <span role="cell">
                  <small className={`ho-tourney-status ho-tourney-status--${race.status}`}>{statusLabel(race.status)}</small>
                </span>
                <span role="cell">
                  <Link to={raceHref(race)}>View Race</Link>
                </span>
              </div>
            ))}
            {!schedule.length ? (
              <div className="ho-tourney-schedule__empty">Race schedule will appear here when your tournament data is available.</div>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="ho-tourney-footer">
        <div>
          <h2>StallionElite</h2>
          <p>Elevating the equestrian tradition through precision technology and timeless luxury.</p>
        </div>
        <nav aria-label="Tournament footer navigation">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Contact Support</a>
        </nav>
        <p>(c) 2024 StallionElite Racing Management. All rights reserved.</p>
      </footer>

      {participantsOpen ? (
        <div className="ho-tourney-modal-backdrop" role="presentation" onMouseDown={() => setParticipantsOpen(false)}>
          <section
            className="ho-tourney-participants-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="participants-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <h2 id="participants-title">Tournament Entries</h2>
                <p>{participantCount} horses registered for {detail.title}.</p>
              </div>
              <button type="button" aria-label="Close participants" onClick={() => setParticipantsOpen(false)}>
                ×
              </button>
            </header>

            <div className="ho-tourney-participants-table" role="table" aria-label="Tournament entries">
              <div className="ho-tourney-participants-table__head" role="row">
                <span role="columnheader">#</span>
                <span role="columnheader">Horse</span>
                <span role="columnheader">Breed / Age</span>
                <span role="columnheader">Jockey</span>
                <span role="columnheader">Owner</span>
              </div>
              {detail.participants.map((participant, index) => (
                <div className="ho-tourney-participants-table__row" role="row" key={participant.id ?? participant.horse}>
                  <span role="cell">{index + 1}</span>
                  <strong role="cell">{participant.horse}</strong>
                  <span role="cell">{participant.breedAge}</span>
                  <span role="cell">{participant.jockey}</span>
                  <span role="cell">{participant.owner}</span>
                </div>
              ))}
              {!participantCount ? (
                <div className="ho-tourney-participants-table__empty">
                  Participants will appear here when registration data is available.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
