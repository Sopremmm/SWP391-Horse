import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/common/Footer.tsx';
import { OwnerPortalHeader } from '../../components/horseOwner/OwnerPortalChrome.tsx';
import './MyHorses.css';

type Horse = {
  id?: string;
  name: string;
  meta?: string;
  imageSrc?: string;
};

type MyHorsesStats = {
  totalValue: string;
  stableSize: string;
  recentWins: string;
};

type MyHorsesData = {
  stats?: Partial<MyHorsesStats> & Partial<Record<'totalRaces' | 'totalHorses', number>>;
  horses?: Array<Partial<Horse>>;
};

const PAGE_SIZE = 9;

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M5 6.67H0V5h5V0h1.67v5h5v1.67h-5v5H5v-5Z" fill="currentColor" />
  </svg>
);

const normalizeHorses = (raw?: Array<Partial<Horse>>): Horse[] => {
  const horses = Array.isArray(raw) ? raw : [];

  return horses.filter((horse): horse is Horse => Boolean(horse.name)).map((h) => ({
    id: h.id,
    name: h.name,
    meta: h.meta ?? '',
    imageSrc: h.imageSrc,
  }));
};

const normalizeStats = (data: MyHorsesData | null | undefined, horses: Horse[]): MyHorsesStats => {
  const s = data?.stats ?? {};

  return {
    totalValue: s.totalValue ?? '',
    stableSize:
      s.stableSize ?? `${String(horses.length).padStart(2, '0')} Thoroughbreds`,
    recentWins: s.recentWins ?? '',
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
  try {
    const endpoint = process.env.REACT_APP_HORSE_OWNER_MY_HORSES_API || '/api/horse-owner/my-horses';
    const res = await fetch(endpoint, { method: 'GET' });
    if (!res.ok) return null;
    const json = (await res.json()) as MyHorsesData;
    return json ?? null;
  } catch {
    return null;
  }
};

export const MyHorses: React.FC = () => {
  const [isManaging, setIsManaging] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<Horse | null>(null);
  const [state, setState] = React.useState<{
    horses: Horse[];
    stats: MyHorsesStats;
  }>(() => {
    const initialData = readMyHorsesFromLocalStorage();
    const horses = normalizeHorses(initialData?.horses);
    return {
      horses,
      stats: normalizeStats(initialData, horses),
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

      if (!cancelled) {
        setState({ horses, stats });
        setPage(1);
      }
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
  const pageCount = Math.max(1, Math.ceil(state.horses.length / PAGE_SIZE));
  const visibleHorses = state.horses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    setState((current) => {
      const horses = current.horses.filter((horse) => horse.name !== pendingDelete.name);
      return {
        horses,
        stats: normalizeStats({ stats: current.stats }, horses),
      };
    });
    setPendingDelete(null);
  };

  const handleSave = () => {
    setIsManaging(false);
    setPendingDelete(null);
  };

  return (
    <div className="my-horses my-horses--owner-portal">
      <OwnerPortalHeader />

      <main className="my-horses__main" aria-label="My Horses page">
        <section className="my-horses__welcome">
          <div className="my-horses__welcome-copy">
            <p className="my-horses__eyebrow">Stable Management</p>
            <h1 className="my-horses__title">My Stable</h1>
            <p className="my-horses__subtitle">
              Manage your elite thoroughbreds and track their performance. View heritage records,
              training status, and upcoming race schedules for your premium equine roster.
            </p>
          </div>

          <div className="my-horses__actions">
            <button
              className={`my-horses__btn ${isManaging ? 'my-horses__btn--primary' : 'my-horses__btn--secondary'}`}
              type="button"
              onClick={isManaging ? handleSave : () => setIsManaging(true)}
            >
              {isManaging ? 'Save' : 'Manage Stable'}
            </button>
            <Link
              className={`my-horses__btn my-horses__btn--primary ${isManaging ? 'is-disabled' : ''}`}
              to="/HorseOwner/MyHorses/Add"
              aria-disabled={isManaging}
              tabIndex={isManaging ? -1 : undefined}
              onClick={(event) => {
                if (isManaging) event.preventDefault();
              }}
            >
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

        <section className="my-horses__panel" aria-label="Horse listings">
          <div className="my-horses__panel-head">
            <h2>Stable Roster</h2>
            <Link to="/HorseOwner/Horses">View Leaderboard</Link>
          </div>

          <div className="my-horses__horse-grid">
            {visibleHorses.map((horse) => (
              <article key={horse.name} className="horse-card">
                <div className="horse-card__image">
                  {horse.imageSrc ? <img src={horse.imageSrc} alt={horse.name} /> : null}
                </div>
                <div className="horse-card__body">
                  <div>
                    <h2 className="horse-card__name">{horse.name}</h2>
                    <p className="horse-card__meta">{horse.meta}</p>
                  </div>
                  {isManaging ? (
                    <button
                      className="horse-card__manage horse-card__manage--delete"
                      type="button"
                      onClick={() => setPendingDelete(horse)}
                    >
                      Delete
                    </button>
                  ) : (
                    <Link
                      className="horse-card__manage"
                      state={{ ownerPortalHeader: true }}
                      to={`/HorseOwner/MyHorses/${encodeURIComponent(horse.name)}`}
                    >
                      Manage Horse
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          {pageCount > 1 ? (
            <nav className="my-horses__pagination" aria-label="Horse stable pages">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  className={pageNumber === page ? 'is-active' : ''}
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === page ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              ))}
            </nav>
          ) : null}

          {state.horses.length === 0 ? (
            <div className="my-horses__empty">
              Stable data is empty. Connect `/api/my-horses` or provide `my_horses_data` in localStorage.
            </div>
          ) : null}
        </section>
      </main>

      <Footer />

      {pendingDelete ? (
        <div className="my-horses__modal-backdrop" role="presentation">
          <div
            className="my-horses__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-horse-title"
          >
            <h2 id="delete-horse-title">Delete horse?</h2>
            <p>
              Are you sure you want to delete <strong>{pendingDelete.name}</strong> from your stable?
            </p>
            <div className="my-horses__modal-actions">
              <button
                className="my-horses__btn my-horses__btn--secondary"
                type="button"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                className="my-horses__btn my-horses__btn--danger"
                type="button"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyHorses;
