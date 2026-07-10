import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header.tsx';
import { Jockey } from '../data/pageData.ts';
import './InviteJockeys.css';

type DisplayJockey = {
  id?: string;
  name: string;
  age: string;
  gender: string;
  totalRaces: number;
  imageSrc?: string;
  invited?: boolean;
};

type RawJockey = Partial<Jockey> & Partial<DisplayJockey> & {
  ageText?: string;
  imageUrl?: string;
  avatarUrl?: string;
  totalRaceCount?: number;
  races?: number;
  status?: string;
};

type RawInviteJockeysData = {
  title?: string;
  subtitle?: string;
  jockeys?: RawJockey[];
  items?: RawJockey[];
  professionals?: RawJockey[];
  total?: number;
};

const PAGE_SIZE = 8;
const PLACEHOLDER_IMG = 'https://placehold.co/84x84';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M16.6 18 10.3 11.7c-.5.4-1.08.72-1.73.95-.65.23-1.34.35-2.07.35-1.82 0-3.35-.63-4.61-1.89C.63 9.85 0 8.32 0 6.5s.63-3.35 1.89-4.61C3.15.63 4.68 0 6.5 0s3.35.63 4.61 1.89C12.37 3.15 13 4.68 13 6.5c0 .73-.12 1.43-.35 2.08-.23.65-.55 1.22-.95 1.72L18 16.6 16.6 18ZM6.5 11c1.25 0 2.31-.44 3.19-1.31C10.56 8.81 11 7.75 11 6.5s-.44-2.31-1.31-3.19C8.81 2.44 7.75 2 6.5 2s-2.31.44-3.19 1.31C2.44 4.19 2 5.25 2 6.5s.44 2.31 1.31 3.19C4.19 10.56 5.25 11 6.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true">
    <path d="M5.25 9V7.5h3V9h-3ZM2.25 5.25v-1.5h9v1.5h-9ZM0 1.5V0h13.5v1.5H0Z" fill="currentColor" />
  </svg>
);

function parseAge(raw: RawJockey) {
  if (raw.age !== undefined) return String(raw.age).replace(/\s*(years?\s*old|yrs?|yo)$/i, '');
  const age = raw.ageText?.match(/\d+/)?.[0];
  return age || 'TBA';
}

function normalizeGender(value?: string) {
  const gender = String(value || 'TBA').trim();
  if (/^male$/i.test(gender)) return 'M';
  if (/^female$/i.test(gender)) return 'F';
  return gender.charAt(0).toUpperCase() || 'TBA';
}

function normalizeJockey(raw: RawJockey, index: number): DisplayJockey {
  return {
    id: raw.id,
    name: raw.name || `Jockey ${index + 1}`,
    age: parseAge(raw),
    gender: normalizeGender(raw.gender),
    totalRaces: Number(raw.totalRaces ?? raw.totalRaceCount ?? raw.races ?? 0),
    imageSrc: raw.imageSrc || raw.imageUrl || raw.avatarUrl,
    invited: Boolean(raw.invited || /invited/i.test(String(raw.status || '')) || raw.variant === 'invited'),
  };
}

function normalizeData(raw?: RawInviteJockeysData | null) {
  const source = raw?.jockeys || raw?.items || raw?.professionals || [];
  const jockeys = source.map(normalizeJockey);

  return {
    title: raw?.title || 'Jockey Invitations',
    subtitle:
      raw?.subtitle ||
      "Partner with the industry's most prestigious athletes. Review detailed performance metrics and invite elite jockeys to represent your stable in upcoming high-stakes tournaments.",
    total: raw?.total ?? jockeys.length,
    jockeys,
  };
}

function readInviteJockeysFromLocalStorage(): RawInviteJockeysData | null {
  try {
    const raw = window.localStorage.getItem('invite_jockeys_data');
    return raw ? (JSON.parse(raw) as RawInviteJockeysData) : null;
  } catch {
    return null;
  }
}

async function readInviteJockeysFromApi(): Promise<RawInviteJockeysData | null> {
  try {
    const endpoint = process.env.REACT_APP_INVITE_JOCKEYS_API || '/api/horse-owner/jockeys';
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) return null;
    return (await response.json()) as RawInviteJockeysData;
  } catch {
    return null;
  }
}

function JockeyCard({ jockey }: { jockey: DisplayJockey }) {
  const profileHref = `/HorseOwner/InviteJockeys/${encodeURIComponent(jockey.id || jockey.name)}`;
  const inviteHref = `${profileHref}/invite`;

  return (
    <article className="invite-jockeys__card" aria-label={`Jockey ${jockey.name}`}>
      <Link className="invite-jockeys__avatar" to={profileHref} aria-label={`View ${jockey.name}`}>
        <img src={jockey.imageSrc || PLACEHOLDER_IMG} alt={jockey.name} />
      </Link>

      <h2>{jockey.name}</h2>

      <dl className="invite-jockeys__metrics">
        <div>
          <dt>Age</dt>
          <dd>{jockey.age}</dd>
        </div>
        <div>
          <dt>Gen</dt>
          <dd>{jockey.gender}</dd>
        </div>
        <div>
          <dt>Total<br />Races</dt>
          <dd>{jockey.totalRaces}</dd>
        </div>
      </dl>

      {jockey.invited ? (
        <span className="invite-jockeys__invited">Already Invited</span>
      ) : (
        <Link className="invite-jockeys__invite" to={inviteHref}>
          Invite to Tournament
        </Link>
      )}
    </article>
  );
}

export default function InviteJockeys() {
  const [data, setData] = React.useState(() => normalizeData(readInviteJockeysFromLocalStorage()));
  const [query, setQuery] = React.useState('');
  const [gender, setGender] = React.useState('all');
  const [sort, setSort] = React.useState('races-desc');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const apiData = await readInviteJockeysFromApi();
      const localData = readInviteJockeysFromLocalStorage();
      if (!cancelled) setData(normalizeData(apiData ?? localData));
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredJockeys = React.useMemo(() => {
    const search = query.trim().toLowerCase();
    const next = data.jockeys.filter((jockey) => {
      const matchesSearch = !search || jockey.name.toLowerCase().includes(search);
      const matchesGender = gender === 'all' || jockey.gender.toLowerCase() === gender;
      return matchesSearch && matchesGender;
    });

    return [...next].sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'races-asc') return a.totalRaces - b.totalRaces;
      return b.totalRaces - a.totalRaces;
    });
  }, [data.jockeys, gender, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredJockeys.length / PAGE_SIZE));
  const visibleJockeys = filteredJockeys.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [query, gender, sort]);

  React.useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  return (
    <div className="invite-jockeys">
      <Header />

      <main className="invite-jockeys__main">
        <section className="invite-jockeys__hero">
          <h1>{data.title}</h1>
          <p>{data.subtitle}</p>
        </section>

        <section className="invite-jockeys__filters" aria-label="Filter jockeys">
          <label className="invite-jockeys__search">
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jockeys..."
              aria-label="Search jockeys"
            />
          </label>

          <div className="invite-jockeys__filter-controls">
            <button className="invite-jockeys__all" type="button" onClick={() => { setQuery(''); setGender('all'); }}>
              <FilterIcon />
              All Jockeys
            </button>

            <label className="invite-jockeys__select">
              <span>Gender:</span>
              <select value={gender} onChange={(event) => setGender(event.target.value)} aria-label="Filter by gender">
                <option value="all">All</option>
                <option value="m">M</option>
                <option value="f">F</option>
              </select>
            </label>

            <label className="invite-jockeys__select">
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort jockeys">
                <option value="races-desc">Sort by Races</option>
                <option value="races-asc">Fewest Races</option>
                <option value="name-asc">Name A-Z</option>
              </select>
            </label>
          </div>

          <strong>Showing {filteredJockeys.length} elite professionals</strong>
        </section>

        {visibleJockeys.length > 0 ? (
          <section className="invite-jockeys__grid" aria-label="Jockey invitations">
            {visibleJockeys.map((jockey) => (
              <JockeyCard jockey={jockey} key={jockey.id || jockey.name} />
            ))}
          </section>
        ) : (
          <section className="invite-jockeys__empty">
            No jockeys match the current filters. Connect `/api/horse-owner/jockeys`, set
            `REACT_APP_INVITE_JOCKEYS_API`, or provide `invite_jockeys_data` in localStorage.
          </section>
        )}

        {pageCount > 1 ? (
          <nav className="invite-jockeys__pagination" aria-label="Jockey pages">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button
                className={pageNumber === page ? 'is-active' : ''}
                type="button"
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                aria-current={pageNumber === page ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}
            {pageCount > 3 ? <span>...</span> : null}
            <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount}>
              ›
            </button>
          </nav>
        ) : null}
      </main>

      <footer className="invite-jockeys__footer">
        <div>
          <h2>Equine Heritage</h2>
          <p>(c) 2024 Equine Heritage Management. All rights reserved.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Contact Support</a>
        </nav>
      </footer>
    </div>
  );
}
