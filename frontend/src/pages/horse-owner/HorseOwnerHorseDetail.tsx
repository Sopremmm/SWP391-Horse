import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Header } from '../../components/common/Header.tsx';
import { OwnerPortalHeader } from '../../components/horseOwner/OwnerPortalChrome.tsx';
import { getPageData, MyHorse } from '../../data/pageData.ts';
import { getHorseOwnerHorseDetailData } from '../../services/integration.ts';
import './HorseOwnerHorseDetail.css';

type RaceHistoryRow = {
  tournament: string;
  date?: string;
  race?: string;
  jockey?: string;
  time?: string;
  position?: string;
};

type HorseDetailData = {
  id?: string;
  name: string;
  owner: string;
  breed: string;
  age: string;
  gender: string;
  imageSrc: string;
  heroImageSrc: string;
  rank?: number;
  winRatio?: number;
  totalStarts?: number;
  totalEarnings?: string;
  raceHistory: RaceHistoryRow[];
};

type RawHorse = Partial<HorseDetailData> & Partial<MyHorse> & {
  meta?: string;
  image?: string;
  imageUrl?: string;
  heroImage?: string;
  ownerName?: string;
  breedOrigin?: string;
  sex?: string;
  systemRank?: number;
  starts?: number;
  earnings?: string;
  lastResult?: {
    position?: string;
    race?: string;
    date?: string;
  };
  history?: RaceHistoryRow[];
  performances?: RaceHistoryRow[];
};

type RawHorseResponse = {
  horses?: RawHorse[];
  items?: RawHorse[];
  leaderboard?: RawHorse[];
};

const fallbackImage = getPageData().myHorses.horses[0]?.imageSrc || 'https://placehold.co/1280x650';

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseHorseMeta(meta?: string) {
  const parts = String(meta || '').split(' - ').map((part) => part.trim()).filter(Boolean);
  const ageText = parts.find((part) => /\d+\s*yo/i.test(part) || /\d+\s*yrs?/i.test(part));

  return {
    breed: parts[0] || 'Thoroughbred',
    age: ageText?.match(/\d+/)?.[0] || 'TBA',
    gender: parts.find((part) => /stallion|gelding|mare|filly|colt|dam/i.test(part)) || 'TBA',
    winRatio: Number(parts.find((part) => /win rate/i.test(part))?.match(/\d+/)?.[0] || 0),
  };
}

function pickString(...values: unknown[]) {
  const value = values.find((item) => typeof item === 'string' && item.trim().length > 0);
  return typeof value === 'string' ? value : undefined;
}

function pickDisplayValue(...values: unknown[]) {
  const value = values.find((item) => {
    if (typeof item === 'string') return item.trim().length > 0;
    return typeof item === 'number' && Number.isFinite(item);
  });
  return value === undefined ? undefined : String(value);
}

function pickNumber(...values: unknown[]) {
  const value = values.find((item) => item !== undefined && item !== null && item !== '');
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function normalizeRaceHistory(raw: RawHorse): RaceHistoryRow[] {
  const rows = raw.raceHistory || raw.history || raw.performances || [];
  if (Array.isArray(rows) && rows.length > 0) {
    return rows.map((row) => ({
      tournament: pickString(row.tournament, 'Unnamed Tournament') || 'Unnamed Tournament',
      date: pickString(row.date),
      race: pickString(row.race, 'Race TBA'),
      jockey: pickString(row.jockey, 'Jockey TBA'),
      time: pickString(row.time, 'TBA'),
      position: pickString(row.position, 'TBA'),
    }));
  }

  if (raw.lastResult?.race || raw.lastResult?.position) {
    return [{
      tournament: raw.lastResult.race || 'Recent Race',
      date: raw.lastResult.date,
      race: raw.lastResult.race,
      jockey: 'TBA',
      time: 'TBA',
      position: raw.lastResult.position,
    }];
  }

  return [];
}

function normalizeHorse(raw: RawHorse, index = 0): HorseDetailData {
  const meta = parseHorseMeta(raw.meta);
  const imageSrc = pickString(raw.heroImageSrc, raw.heroImage, raw.imageSrc, raw.imageUrl, raw.image) || fallbackImage;

  return {
    id: raw.id,
    name: pickString(raw.name, `Horse ${index + 1}`) || `Horse ${index + 1}`,
    owner: pickString(raw.owner, raw.ownerName, 'Unassigned') || 'Unassigned',
    breed: pickString(raw.breed, raw.breedOrigin, meta.breed) || 'Thoroughbred',
    age: (pickDisplayValue(raw.age, meta.age) || 'TBA').replace(/\s*(yrs?|yo)$/i, ''),
    gender: pickString(raw.gender, raw.sex, meta.gender) || 'TBA',
    imageSrc,
    heroImageSrc: imageSrc,
    rank: pickNumber(raw.rank, raw.systemRank),
    winRatio: pickNumber(raw.winRatio, meta.winRatio),
    totalStarts: pickNumber(raw.totalStarts, raw.starts),
    totalEarnings: pickDisplayValue(raw.totalEarnings, raw.earnings, '$0'),
    raceHistory: normalizeRaceHistory(raw),
  };
}

function normalizeResponse(raw?: RawHorseResponse | null): HorseDetailData[] {
  const horses = raw?.horses || raw?.items || raw?.leaderboard || [];
  return horses.map(normalizeHorse);
}

function readJsonFromStorage(key: string): RawHorseResponse | null {
  return null;
}

function fallbackMyHorses(): HorseDetailData[] {
  return getPageData().myHorses.horses.map((horse, index) => normalizeHorse(horse, index));
}

function findHorse(horses: HorseDetailData[], selectedName: string) {
  const target = normalize(selectedName);
  return horses.find((horse) => normalize(horse.id || horse.name) === target || normalize(horse.name) === target);
}

function PositionBadge({ value }: { value?: string }) {
  const text = value || 'TBA';
  const tone = /1|first/i.test(text) ? 'first' : /2|second/i.test(text) ? 'second' : /3|third/i.test(text) ? 'third' : 'neutral';
  return <span className={`horse-detail__position is-${tone}`}>{text}</span>;
}

function SimpleIcon({ name }: { name: 'edit' | 'race' | 'rank' | 'starts' | 'earnings' | 'history' }) {
  const paths = {
    edit: 'M4 14.5H1.5V12L11 .5 13.5 3 4 14.5Zm8.2-8.9L8.4 1.8',
    race: 'M2 15c2-4 5-6 9-6h3M3 5l3 2 3-4 3 4 3-2M6 16l2-5m4 5-2-5',
    rank: 'M9 1l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L1.8 6.2l5-.7L9 1Z',
    starts: 'M3 3h12v12H3V3Zm3 9V8m3 4V5m3 7v-2',
    earnings: 'M3 6c0-1.7 2.7-3 6-3s6 1.3 6 3-2.7 3-6 3-6-1.3-6-3Zm0 0v6c0 1.7 2.7 3 6 3s6-1.3 6-3V6',
    history: 'M4 4a7 7 0 1 1-1.7 7M2 4v4h4M9 5v4l3 2',
  };

  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default function HorseOwnerHorseDetail() {
  const { name } = useParams<{ name?: string }>();
  const location = useLocation();
  const isRegistryView = location.pathname.startsWith('/HorseOwner/Horses/');
  const decodedName = decodeURIComponent(name ?? '');
  const [horse, setHorse] = React.useState<HorseDetailData | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiHorse = await getHorseOwnerHorseDetailData(normalize(decodedName)).catch(() => null);
      const fallbackData = isRegistryView ? [] : fallbackMyHorses();
      const nextHorse = apiHorse || findHorse(fallbackData, decodedName) || fallbackData[0] || null;

      if (!cancelled) setHorse(nextHorse);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [decodedName, isRegistryView]);

  if (!horse) {
    return (
      <div className={`horse-detail ${isRegistryView ? '' : 'horse-detail--owner-portal'}`}>
        {isRegistryView ? <Header /> : <OwnerPortalHeader />}
        <main className="horse-detail__main horse-detail__main--empty">
          <section className="horse-detail__empty">
            <h1>Horse detail data is empty.</h1>
            <p>Horse data is not available.</p>
          </section>
        </main>
      </div>
    );
  }

  const winRatio = Math.min(Math.max(Number(horse.winRatio || 0), 0), 100);

  return (
    <div className={`horse-detail ${isRegistryView ? '' : 'horse-detail--owner-portal'}`}>
      {isRegistryView ? <Header /> : <OwnerPortalHeader />}

      <main className="horse-detail__main">
        <section className="horse-detail__hero">
          <img src={horse.heroImageSrc} alt={horse.name} />
          <div className="horse-detail__hero-overlay" />
          <div className="horse-detail__hero-content">
            <div className="horse-detail__hero-copy">
              <p className="horse-detail__breadcrumb">Registry <span /> Horses <span /> {horse.name}</p>
              <h1>{horse.name}</h1>
              <dl className="horse-detail__identity">
                <div>
                  <dt>Owner</dt>
                  <dd>{horse.owner}</dd>
                </div>
                <div>
                  <dt>Breed</dt>
                  <dd>{horse.breed}</dd>
                </div>
                <div>
                  <dt>Age</dt>
                  <dd>{horse.age} Yrs</dd>
                </div>
                <div>
                  <dt>Gender</dt>
                  <dd>{horse.gender}</dd>
                </div>
              </dl>
            </div>

            {!isRegistryView ? (
              <div className="horse-detail__hero-actions">
                <Link className="horse-detail__outline-button" to={`/HorseOwner/MyHorses/edit/${encodeURIComponent(horse.name)}`}>
                  <SimpleIcon name="edit" />
                  Edit Horse
                </Link>
                <Link className="horse-detail__solid-button" to="/HorseOwner/Tournaments">
                  <SimpleIcon name="race" />
                  Register for Race
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        <section className="horse-detail__stats" aria-label="Horse statistics">
          <article>
            <span>System Rank</span>
            <strong>{horse.rank ? String(horse.rank).padStart(2, '0') : '--'}</strong>
            <i><SimpleIcon name="rank" /></i>
          </article>
          <article>
            <span>Win Ratio</span>
            <strong>{winRatio || '--'}{winRatio ? '%' : ''}</strong>
            <div className="horse-detail__progress"><b style={{ width: `${winRatio}%` }} /></div>
          </article>
          <article>
            <span>Total Starts</span>
            <strong>{horse.totalStarts ?? '--'}</strong>
            <i><SimpleIcon name="starts" /></i>
          </article>
          <article>
            <span>Total Earnings</span>
            <strong>{horse.totalEarnings || '$0'}</strong>
            <i><SimpleIcon name="earnings" /></i>
          </article>
        </section>

        <section className="horse-detail__history">
          <div className="horse-detail__section-title">
            <h2><SimpleIcon name="history" /> Recent Race History</h2>
            <Link to={isRegistryView ? '/HorseOwner/Horses' : '/HorseOwner/MyHorses'}>View Full Career</Link>
          </div>

          <div className="horse-detail__history-card">
            {horse.raceHistory.length > 0 ? (
              <div className="horse-detail__table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tournament</th>
                      <th>Race</th>
                      <th>Jockey</th>
                      <th>Time</th>
                      <th>Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horse.raceHistory.map((row, index) => (
                      <tr key={`${row.tournament}-${row.race}-${index}`}>
                        <td>
                          <strong>{row.tournament}</strong>
                          {row.date ? <small>{row.date}</small> : null}
                        </td>
                        <td>{row.race || 'Race TBA'}</td>
                        <td><b>{row.jockey || 'Jockey TBA'}</b></td>
                        <td><b>{row.time || 'TBA'}</b></td>
                        <td><PositionBadge value={row.position} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="horse-detail__empty-table">
                No race history yet. When the database returns race history, it will appear here automatically.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="horse-detail__footer">
        <div className="horse-detail__footer-inner">
          <div>
            <h2>Heritage Racing</h2>
            <p>
              The world's premier platform for professional horse racing management, lineage tracking,
              and real-time performance analytics. Bridging legacy and innovation.
            </p>
          </div>
          <nav aria-label="Navigation">
            <strong>Navigation</strong>
            <a href="#about">About Us</a>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#rules">Racing Rules</a>
          </nav>
          <nav aria-label="Contact">
            <strong>Contact</strong>
            <a href="mailto:support@heritageracing.com">support@heritageracing.com</a>
            <span>share</span>
          </nav>
        </div>
        <div className="horse-detail__copyright">(c) 2024 Heritage Racing Management. All rights reserved.</div>
      </footer>
    </div>
  );
}
