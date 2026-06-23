import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { OwnerPortalHeader } from '../components/horseOwner/OwnerPortalChrome.tsx';
import { getPageData, MyHorse } from '../data/pageData.ts';
import './MyHorses.css';

type Horse = MyHorse;

type MyHorsesStats = {
  totalValue: string;
  stableSize: string;
  recentWins: string;
};

type MyHorsesData = {
  stats?: Partial<MyHorsesStats> & Partial<Record<'totalRaces' | 'totalHorses', number>>;
  horses?: Array<Partial<Horse>>;
};

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M5 6.67H0V5h5V0h1.67v5h5v1.67h-5v5H5v-5Z" fill="currentColor" />
  </svg>
);

const normalizeHorses = (raw?: Array<Partial<Horse>>): Horse[] => {
  const fallbackHorses = getPageData().myHorses.horses;
  const horses = Array.isArray(raw) ? raw : [];

  if (horses.length === 0) return fallbackHorses;

  const fallbackImages = fallbackHorses.map((horse) => horse.imageSrc);

  return horses.map((h, idx) => ({
    name: h.name ?? `Horse ${idx + 1}`,
    meta: h.meta ?? 'Thoroughbred',
    imageSrc: h.imageSrc ?? fallbackImages[idx % fallbackImages.length],
  }));
};

const normalizeStats = (data: MyHorsesData | null | undefined, horses: Horse[]): MyHorsesStats => {
  const s = data?.stats ?? {};
  const fallbackStats = getPageData().myHorses.stats;

  return {
    totalValue: s.totalValue ?? fallbackStats.totalValue,
    stableSize:
      s.stableSize ?? `${String(horses.length).padStart(2, '0')} Thoroughbreds`,
    recentWins: s.recentWins ?? fallbackStats.recentWins,
  };
};

const readMyHorsesFromLocalStorage = (): MyHorsesData | null => {
  try {
    const raw = window.localStorage.getItem('my_horses_data');
    if (!raw) return null;
    return JSON.parse(raw) as MyHorsesData;
  } catch {
    return null;
  }
};

const readMyHorsesFromApi = async (): Promise<MyHorsesData | null> => {
  // TODO(API): Replace with real endpoint + auth headers.
  // Current code is designed to work even when API is not wired yet.
  try {
    const endpoint = '/api/my-horses';
    const res = await fetch(endpoint, { method: 'GET' });
    if (!res.ok) return null;
    const json = (await res.json()) as MyHorsesData;
    return json ?? null;
  } catch {
    return null;
  }
};

export const MyHorses: React.FC = () => {
  const location = useLocation();
  const useOwnerPortalHeader = Boolean(
    (location.state as { ownerPortalHeader?: boolean } | null)?.ownerPortalHeader,
  );
  const [state, setState] = React.useState<{
    horses: Horse[];
    stats: MyHorsesStats;
  }>(() => {
    const horses = getPageData().myHorses.horses;
    return {
      horses,
      stats: normalizeStats(null, horses),
    };
  });

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // API-first, fallback to localStorage
      const apiData = await readMyHorsesFromApi();
      const fallbackData = readMyHorsesFromLocalStorage();
      const data = apiData ?? fallbackData;

      const horses = normalizeHorses(data?.horses);
      const stats = normalizeStats(data, horses);

      if (!cancelled) setState({ horses, stats });
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const STATS = [
    { label: 'TOTAL VALUE', value: state.stats.totalValue },
    { label: 'STABLE SIZE', value: state.stats.stableSize },
    { label: 'RECENT WINS', value: state.stats.recentWins },
  ];

  return (
    <div className={`my-horses ${useOwnerPortalHeader ? 'my-horses--owner-portal' : ''}`}>
      {useOwnerPortalHeader ? <OwnerPortalHeader /> : <Header />}

      <main className="my-horses__main" aria-label="My Horses page">
        <section className="my-horses__hero">
          <div className="my-horses__hero-left">
            <h1 className="my-horses__title">My Stable</h1>
            <p className="my-horses__subtitle">
              Manage your elite thoroughbreds and track their performance. View heritage records,
              training status, and upcoming race schedules for your premium equine roster.
            </p>
          </div>

          <div className="my-horses__hero-actions">
            <button className="my-horses__btn my-horses__btn--secondary" type="button">
              Manage Stable
            </button>
            <Link className="my-horses__btn my-horses__btn--primary" to="/HorseOwner/MyHorses/Add">
              <span className="my-horses__btn-plus" aria-hidden="true">
                <PlusIcon />
              </span>
              Add New Horse
            </Link>
          </div>
        </section>

        <section className="my-horses__stats-bento" aria-label="Quick stats">
          {STATS.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <div className="stat-card__bg-icon" aria-hidden="true" />
              <div className="stat-card__label">{stat.label}</div>
              <div className="stat-card__value">{stat.value}</div>
            </article>
          ))}
        </section>

        <section className="my-horses__horse-grid" aria-label="Horse listings">
          {state.horses.map((horse) => (
            <article key={horse.name} className="horse-card">
              <div className="horse-card__image">
                <img src={horse.imageSrc} alt={horse.name} />
              </div>
              <div className="horse-card__body">
                <div>
                  <h2 className="horse-card__name">{horse.name}</h2>
                  <p className="horse-card__meta">{horse.meta}</p>
                </div>
                <Link className="horse-card__manage" to={`/HorseOwner/MyHorses/${encodeURIComponent(horse.name)}`}>
                  Manage Horse
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyHorses;
