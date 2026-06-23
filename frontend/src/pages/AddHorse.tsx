import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { getPageData } from '../data/pageData.ts';
import './AddHorse.css';

type HorseAgeClass = 'Colt' | 'Stallion' | 'Gelding' | 'Filly' | 'Mare' | 'Dam';
type HorseCondition = 'Peak' | 'Good' | 'Recovering';

type StoredHorse = {
  name: string;
  meta: string;
  imageSrc: string;
};

type StoredHorseData = {
  horses?: StoredHorse[];
  stats?: {
    totalValue?: string;
    stableSize?: string;
    recentWins?: string;
  };
};

type AddHorseProps = {
  mode?: 'add' | 'edit';
};

const DEFAULT_PHOTO = 'https://placehold.co/800x800';

function CameraIcon() {
  return (
    <svg viewBox="0 0 30 35" aria-hidden="true">
      <path d="M15 21.75c1.88 0 3.47-.66 4.78-1.97A6.52 6.52 0 0 0 21.75 15c0-1.88-.66-3.47-1.97-4.78A6.52 6.52 0 0 0 15 8.25c-1.88 0-3.47.66-4.78 1.97A6.52 6.52 0 0 0 8.25 15c0 1.88.66 3.47 1.97 4.78A6.52 6.52 0 0 0 15 21.75Zm0-3c-1.05 0-1.94-.36-2.66-1.09A3.63 3.63 0 0 1 11.25 15c0-1.05.36-1.94 1.09-2.66A3.63 3.63 0 0 1 15 11.25c1.05 0 1.94.36 2.66 1.09.73.72 1.09 1.61 1.09 2.66s-.36 1.94-1.09 2.66A3.63 3.63 0 0 1 15 18.75ZM3 27c-.83 0-1.53-.29-2.12-.88A2.9 2.9 0 0 1 0 24V6c0-.83.29-1.53.88-2.12A2.9 2.9 0 0 1 3 3h4.73L10.5 0h9l2.78 3H27c.83 0 1.53.29 2.12.88.59.59.88 1.29.88 2.12v18c0 .83-.29 1.53-.88 2.12A2.9 2.9 0 0 1 27 27H3Zm0-3h24V6h-6.08l-2.73-3h-6.38L9.08 6H3v18Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 16h1.43l9.77-9.78-1.42-1.42L2 14.58V16Zm-2 2v-4.25L13.2.58c.2-.18.42-.33.66-.43.24-.1.5-.15.77-.15.26 0 .52.05.77.15.25.1.47.25.65.45L17.43 2c.2.18.34.4.43.65.09.25.14.5.14.75 0 .27-.05.52-.14.76-.09.24-.24.46-.43.66L4.25 18H0Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71A.97.97 0 0 0 10 5c-.28 0-.52.1-.71.29A.97.97 0 0 0 9 6c0 .28.1.52.29.71.19.19.43.29.71.29Zm0 13a9.7 9.7 0 0 1-3.9-.79 10.06 10.06 0 0 1-5.31-5.31A9.74 9.74 0 0 1 0 10c0-1.38.26-2.68.79-3.9A10.06 10.06 0 0 1 6.1.79 9.74 9.74 0 0 1 10 0c1.38 0 2.68.26 3.9.79a10.06 10.06 0 0 1 5.31 5.31c.53 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9a10.06 10.06 0 0 1-5.31 5.31A9.74 9.74 0 0 1 10 20Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 14h2V9H4v5Zm8 0h2V4h-2v10Zm-4 0h2v-3H8v3Zm0-5h2V7H8v2ZM2 18c-.55 0-1.02-.2-1.41-.59A1.93 1.93 0 0 1 0 16V2C0 1.45.2.98.59.59A1.93 1.93 0 0 1 2 0h14c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v14c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H2Zm0-2h14V2H2v14Z" />
    </svg>
  );
}

function readStoredData(): StoredHorseData {
  try {
    const raw = window.localStorage.getItem('my_horses_data');
    return raw ? (JSON.parse(raw) as StoredHorseData) : {};
  } catch {
    return {};
  }
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseStoredHorse(horse?: StoredHorse) {
  const metaParts = horse?.meta.split(' - ').map((part) => part.trim()).filter(Boolean) ?? [];
  const breed = metaParts[0] ?? '';
  const age = metaParts.find((part) => /\d+\s*yo/i.test(part))?.match(/\d+/)?.[0] ?? '';
  const ageClass = (metaParts.find((part) => ['Colt', 'Stallion', 'Gelding', 'Filly', 'Mare', 'Dam'].includes(part)) ?? 'Colt') as HorseAgeClass;
  const winRate = metaParts.find((part) => /win rate/i.test(part))?.match(/\d+/)?.[0] ?? '0';
  const earnings = metaParts.find((part) => /credits/i.test(part))?.match(/[\d,.]+/)?.[0]?.replace(/,/g, '') ?? '0.00';
  const condition = (metaParts.find((part) => /condition/i.test(part))?.replace(/ condition/i, '') ?? 'Peak') as HorseCondition;

  return {
    horseName: horse?.name ?? '',
    breed,
    age,
    ageClass,
    winRate,
    earnings,
    condition: ['Peak', 'Good', 'Recovering'].includes(condition) ? condition : 'Peak',
    imageSrc: horse?.imageSrc ?? '',
  };
}

export default function AddHorse({ mode = 'add' }: AddHorseProps) {
  const navigate = useNavigate();
  const { name } = useParams<{ name?: string }>();
  const isEdit = mode === 'edit';
  const decodedName = decodeURIComponent(name ?? '');
  const initialHorse = React.useMemo(() => {
    const existing = readStoredData();
    const horses = existing.horses ?? getPageData().myHorses.horses;
    return horses.find((horse) => normalize(horse.name) === normalize(decodedName));
  }, [decodedName]);
  const initialValues = React.useMemo(() => parseStoredHorse(initialHorse), [initialHorse]);

  const [horseName, setHorseName] = React.useState(initialValues.horseName);
  const [breed, setBreed] = React.useState(initialValues.breed);
  const [age, setAge] = React.useState(initialValues.age);
  const [ageClass, setAgeClass] = React.useState<HorseAgeClass>(initialValues.ageClass);
  const [winRate, setWinRate] = React.useState(initialValues.winRate);
  const [earnings, setEarnings] = React.useState(initialValues.earnings);
  const [condition, setCondition] = React.useState<HorseCondition>(initialValues.condition);
  const [certified, setCertified] = React.useState(isEdit);
  const [photoPreview, setPhotoPreview] = React.useState<string>(initialValues.imageSrc);
  const [showToast, setShowToast] = React.useState(false);

  const canSubmit = horseName.trim() !== '' && breed.trim() !== '' && age !== '' && certified;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const existing = readStoredData();
    const horses = existing.horses ?? getPageData().myHorses.horses;
    const nextHorse: StoredHorse = {
      name: horseName.trim(),
      meta: `${breed.trim()} - ${age}yo - ${ageClass} - ${condition} condition - ${winRate}% win rate - ${Number(earnings || 0).toLocaleString()} credits`,
      imageSrc: photoPreview || DEFAULT_PHOTO,
    };
    const nextHorses = isEdit
      ? horses.map((horse) => (normalize(horse.name) === normalize(decodedName) ? nextHorse : horse))
      : [...horses, nextHorse];

    window.localStorage.setItem(
      'my_horses_data',
      JSON.stringify({
        ...existing,
        horses: nextHorses,
        stats: {
          ...existing.stats,
          stableSize: `${String(nextHorses.length).padStart(2, '0')} Thoroughbreds`,
        },
      })
    );

    setShowToast(true);
    window.setTimeout(() => navigate(isEdit ? `/HorseOwner/MyHorses/${encodeURIComponent(nextHorse.name)}` : '/HorseOwner/MyHorses'), 650);
  };

  return (
    <div className="add-horse">
      <Header />
      <div className="add-horse__decor" aria-hidden="true" />
      <div className={`add-horse__toast ${showToast ? 'is-visible' : ''}`} role="status">
        <span />
        {isEdit ? 'Horse details updated successfully.' : 'New horse added successfully to Heritage Racing.'}
      </div>

      <main className="add-horse__main">
        <section className="add-horse__page-head">
          <h1>{isEdit ? 'Edit Horse Details' : 'Register New Horse'}</h1>
          <p>{isEdit ? 'Update the profile and performance details for this horse.' : 'Add a new contender to your elite stable collection.'}</p>
        </section>

        <form className="add-horse__form" onSubmit={handleSubmit}>
          <section className="add-horse__upload" aria-label="Profile image upload">
            <label className="add-horse__photo">
              {photoPreview ? <img src={photoPreview} alt="Horse preview" /> : null}
              <span className="add-horse__photo-empty">
                <CameraIcon />
                <strong>Upload Photo</strong>
              </span>
              <input type="file" accept="image/png,image/jpeg" onChange={handlePhotoChange} />
            </label>
            <label className="add-horse__edit" aria-label="Choose horse photo">
              <EditIcon />
              <input type="file" accept="image/png,image/jpeg" onChange={handlePhotoChange} />
            </label>
            <p>Minimum 800 x 800 px - JPG or PNG</p>
          </section>

          <section className="add-horse__panel">
            <div className="add-horse__panel-title">
              <InfoIcon />
              <h2>Basic Information</h2>
            </div>
            <div className="add-horse__fields">
              <label className="add-horse__field">
                <span>Horse Name</span>
                <input value={horseName} onChange={(event) => setHorseName(event.target.value)} placeholder="e.g. Midnight Thunder" required />
              </label>
              <label className="add-horse__field">
                <span>Breed</span>
                <input value={breed} onChange={(event) => setBreed(event.target.value)} placeholder="e.g. Thoroughbred" required />
              </label>
              <label className="add-horse__field">
                <span>Age (Years)</span>
                <input type="number" min={0} value={age} onChange={(event) => setAge(event.target.value)} placeholder="e.g. 4" required />
              </label>
              <label className="add-horse__field">
                <span>Age Class</span>
                <select value={ageClass} onChange={(event) => setAgeClass(event.target.value as HorseAgeClass)}>
                  <option>Colt</option>
                  <option>Stallion</option>
                  <option>Gelding</option>
                  <option>Filly</option>
                  <option>Mare</option>
                  <option>Dam</option>
                </select>
              </label>
            </div>
          </section>

          <section className="add-horse__panel">
            <div className="add-horse__panel-title">
              <ChartIcon />
              <h2>Performance Metrics</h2>
            </div>
            <div className="add-horse__fields add-horse__fields--three">
              <label className="add-horse__field add-horse__field--suffix">
                <span>Win Rate (%)</span>
                <input type="number" min={0} max={100} value={winRate} onChange={(event) => setWinRate(event.target.value)} />
                <em>%</em>
              </label>
              <label className="add-horse__field">
                <span>Earnings (Credits)</span>
                <input type="number" min={0} step="0.01" value={earnings} onChange={(event) => setEarnings(event.target.value)} />
              </label>
              <label className="add-horse__field">
                <span>Current Condition</span>
                <select value={condition} onChange={(event) => setCondition(event.target.value as HorseCondition)}>
                  <option>Peak</option>
                  <option>Good</option>
                  <option>Recovering</option>
                </select>
              </label>
            </div>
          </section>

          <label className="add-horse__certify">
            <input type="checkbox" checked={certified} onChange={(event) => setCertified(event.target.checked)} />
            <span>I certify that the information provided above is true and accurate.</span>
          </label>

          <div className="add-horse__actions">
            <button className="add-horse__submit" type="submit" disabled={!canSubmit}>
              {isEdit ? 'Save Horse Details' : 'Add Horse to Stable'}
            </button>
            <Link className="add-horse__cancel" to={isEdit && initialHorse ? `/HorseOwner/MyHorses/${encodeURIComponent(initialHorse.name)}` : '/HorseOwner/MyHorses'}>
              Cancel
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
