import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../../components/common/Header.tsx';
import './JockeyProfile.css';

type RacePerformance = {
  raceName: string;
  horse: string;
  position: string;
  earnings: string;
  trackCondition: string;
};

type GalleryItem = {
  label: string;
  title: string;
  imageSrc?: string;
};

type JockeyProfileData = {
  id?: string;
  name: string;
  statusLabel: string;
  bio: string;
  imageSrc?: string;
  experience: string;
  winRate: string;
  totalRaces: string;
  hiringPrice: string;
  invited: boolean;
  performanceSeason: string;
  performance: RacePerformance[];
  gallery: GalleryItem[];
};

type RawJockey = Partial<JockeyProfileData> & {
  age?: string | number;
  ageText?: string;
  avatarUrl?: string;
  imageUrl?: string;
  level?: string;
  gender?: string;
  invited?: boolean;
  variant?: string;
  status?: string;
  priceText?: string;
  experienceText?: string;
  totalRaceCount?: number;
  totalStarts?: number;
  races?: number;
  profile?: Partial<JockeyProfileData> & {
    classLabel?: string;
    tierLabel?: string;
    totalWins?: string;
    performance?: RacePerformance[];
    gallery?: GalleryItem[];
  };
  performances?: RacePerformance[];
  raceHistory?: RacePerformance[];
};

type RawJockeyResponse = {
  jockey?: RawJockey;
  data?: RawJockey;
  jockeys?: RawJockey[];
  items?: RawJockey[];
  professionals?: RawJockey[];
};

const PLACEHOLDER_IMG = 'https://placehold.co/560x680';

function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pickString(...values: unknown[]) {
  const value = values.find((item) => typeof item === 'string' && item.trim().length > 0);
  return typeof value === 'string' ? value : undefined;
}

function pickDisplay(...values: unknown[]) {
  const value = values.find((item) => {
    if (typeof item === 'string') return item.trim().length > 0;
    return typeof item === 'number' && Number.isFinite(item);
  });
  return value === undefined ? undefined : String(value);
}

function yearsFrom(text?: string) {
  return text?.match(/\d+(?:\.\d+)?/)?.[0];
}

function moneyFrom(text?: string) {
  return text?.match(/[$£€]\s?[\d,]+/)?.[0];
}

function normalizePerformance(raw: RawJockey): RacePerformance[] {
  const rows = raw.performance || raw.profile?.performance || raw.performances || raw.raceHistory || [];
  return Array.isArray(rows)
    ? rows.map((race, index) => ({
      raceName: pickString(race.raceName, `Race ${index + 1}`) || `Race ${index + 1}`,
      horse: pickString(race.horse, 'TBA') || 'TBA',
      position: pickString(race.position, 'TBA') || 'TBA',
      earnings: pickString(race.earnings, '$0') || '$0',
      trackCondition: pickString(race.trackCondition, 'TBA') || 'TBA',
    }))
    : [];
}

function normalizeGallery(raw: RawJockey): GalleryItem[] {
  const rows = raw.gallery || raw.profile?.gallery || [];
  return Array.isArray(rows)
    ? rows.map((item, index) => ({
      label: pickString(item.label, index === 0 ? 'Championship Moment' : 'Preparation') || 'Gallery',
      title: pickString(item.title, `Highlight ${index + 1}`) || `Highlight ${index + 1}`,
      imageSrc: pickString(item.imageSrc),
    }))
    : [];
}

function normalizeJockey(raw: RawJockey): JockeyProfileData {
  const profile = raw.profile || {};
  const invited = Boolean(raw.invited || raw.variant === 'invited' || /invited/i.test(String(raw.status || '')));

  return {
    id: raw.id,
    name: pickString(raw.name, 'Unnamed Jockey') || 'Unnamed Jockey',
    statusLabel: pickString(raw.statusLabel, profile.classLabel, invited ? 'Invited Selection' : 'Active Selection') || 'Active Selection',
    bio:
      pickString(raw.bio, profile.bio) ||
      'Professional jockey profile details will appear here when the database returns a biography.',
    imageSrc: pickString(raw.imageSrc, raw.imageUrl, raw.avatarUrl),
    experience: pickDisplay(raw.experience, yearsFrom(raw.experienceText), 'TBA') || 'TBA',
    winRate: pickString(raw.winRate, profile.winRate, 'TBA') || 'TBA',
    totalRaces: pickDisplay(raw.totalRaces, raw.totalRaceCount, raw.totalStarts, raw.races, profile.totalWins, 'TBA') || 'TBA',
    hiringPrice: pickString(raw.hiringPrice, moneyFrom(raw.priceText), raw.priceText, 'TBA') || 'TBA',
    invited,
    performanceSeason: pickString(raw.performanceSeason, profile.performanceSeason, 'Season 2024') || 'Season 2024',
    performance: normalizePerformance(raw),
    gallery: normalizeGallery(raw),
  };
}

function extractJockeys(raw?: RawJockeyResponse | null): RawJockey[] {
  if (!raw) return [];
  if (raw.jockey) return [raw.jockey];
  if (raw.data) return [raw.data];
  return raw.jockeys || raw.items || raw.professionals || [];
}

function readJockeysFromLocalStorage(): RawJockeyResponse | null {
  try {
    const raw = window.localStorage.getItem('invite_jockeys_data');
    return raw ? (JSON.parse(raw) as RawJockeyResponse) : null;
  } catch {
    return null;
  }
}

async function readJockeysFromApi(name: string): Promise<RawJockeyResponse | null> {
  const encoded = encodeURIComponent(name);
  const detailEndpoint = process.env.REACT_APP_INVITE_JOCKEY_DETAIL_API?.replace(':name', encoded);
  const listEndpoint = process.env.REACT_APP_INVITE_JOCKEYS_API || '/api/horse-owner/jockeys';

  for (const endpoint of [detailEndpoint, listEndpoint].filter(Boolean) as string[]) {
    try {
      const response = await fetch(endpoint, { method: 'GET' });
      if (response.ok) return (await response.json()) as RawJockeyResponse;
    } catch {
      // Try next configured source.
    }
  }

  return null;
}

function findJockey(raw: RawJockey[], name: string) {
  const target = normalizeSlug(name);
  return raw.find((jockey) => (
    normalizeSlug(String(jockey.id || jockey.name || '')) === target ||
    normalizeSlug(String(jockey.name || '')) === target
  ));
}

function PositionBadge({ value }: { value: string }) {
  const tone = /1|first/i.test(value) ? 'first' : /2|second/i.test(value) ? 'second' : 'neutral';
  return <span className={`jockey-profile__position is-${tone}`}>{value}</span>;
}

export default function JockeyProfile() {
  const params = useParams<{ name?: string }>();
  const decodedName = decodeURIComponent(params.name ?? '').trim();
  const [jockey, setJockey] = React.useState<JockeyProfileData | null>(() => {
    const raw = extractJockeys(readJockeysFromLocalStorage());
    const selected = findJockey(raw, decodedName);
    return selected ? normalizeJockey(selected) : null;
  });

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiData = await readJockeysFromApi(decodedName);
      const localData = readJockeysFromLocalStorage();
      const selected = findJockey(extractJockeys(apiData ?? localData), decodedName);
      if (!cancelled) setJockey(selected ? normalizeJockey(selected) : null);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [decodedName]);

  if (!jockey) {
    return (
      <div className="jockey-profile">
        <Header />
        <main className="jockey-profile__main jockey-profile__main--empty">
          <section className="jockey-profile__empty">
            <h1>Jockey profile data is empty.</h1>
            <p>
              Connect `/api/horse-owner/jockeys`, set `REACT_APP_INVITE_JOCKEYS_API`, or provide
              `invite_jockeys_data` in localStorage to render this profile.
            </p>
            <Link to="/HorseOwner/InviteJockeys">Back to jockeys</Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="jockey-profile">
      <Header />

      <main className="jockey-profile__main">
        <section className="jockey-profile__hero" aria-labelledby="jockey-profile-title">
          <div className="jockey-profile__portrait">
            <img src={jockey.imageSrc || PLACEHOLDER_IMG} alt={`${jockey.name} portrait`} />
          </div>

          <div className="jockey-profile__summary">
            <span className="jockey-profile__status">{jockey.statusLabel}</span>
            <h1 id="jockey-profile-title">{jockey.name}</h1>
            <p>{jockey.bio}</p>

            <dl className="jockey-profile__stats" aria-label="Jockey statistics">
              <div>
                <dt>Experience</dt>
                <dd>{jockey.experience}<small> Years</small></dd>
              </div>
              <div>
                <dt>Win Rate</dt>
                <dd>{jockey.winRate}</dd>
              </div>
              <div>
                <dt>Total Races</dt>
                <dd>{jockey.totalRaces}</dd>
              </div>
              <div>
                <dt>Hiring Price</dt>
                <dd>{jockey.hiringPrice}<small> / race</small></dd>
              </div>
            </dl>

            {jockey.invited ? (
              <button className="jockey-profile__invite" type="button" disabled>Already Invited</button>
            ) : (
              <Link className="jockey-profile__invite" to={`/HorseOwner/InviteJockeys/${encodeURIComponent(jockey.id || jockey.name)}/invite`}>
                Invite to Tournament <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </section>

        <section className="jockey-profile__performance" aria-labelledby="jockey-performance-title">
          <div className="jockey-profile__section-head">
            <h2 id="jockey-performance-title">Recent Racing Performance</h2>
            <span>{jockey.performanceSeason}</span>
          </div>

          {jockey.performance.length > 0 ? (
            <div className="jockey-profile__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Race Name</th>
                    <th>Horse</th>
                    <th>Position</th>
                    <th>Earnings</th>
                    <th>Track Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {jockey.performance.map((race, index) => (
                    <tr key={`${race.raceName}-${race.horse}-${index}`}>
                      <td>{race.raceName}</td>
                      <td>{race.horse}</td>
                      <td><PositionBadge value={race.position} /></td>
                      <td>{race.earnings}</td>
                      <td>{race.trackCondition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="jockey-profile__empty-table">
              Recent racing performance will appear here when the database returns results.
            </div>
          )}
        </section>

        {jockey.gallery.length > 0 ? (
          <section className="jockey-profile__gallery" aria-label="Jockey highlights">
            {jockey.gallery.map((item, index) => (
              <article className="jockey-profile__gallery-card" key={`${item.title}-${index}`}>
                {item.imageSrc ? <img src={item.imageSrc} alt={item.title} /> : <span aria-hidden="true" />}
                <div className="jockey-profile__gallery-overlay" />
                <div>
                  <small>{item.label}</small>
                  <strong>{item.title}</strong>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </main>

      <footer className="jockey-profile__footer">
        <div>
          <h2>Heritage Racing</h2>
          <p>Precision. Prestige. Performance.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Contact Support</a>
        </nav>
        <p>(c) 2024 Equine Heritage Management. All rights reserved.</p>
      </footer>
    </div>
  );
}
