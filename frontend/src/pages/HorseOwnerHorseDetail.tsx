import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/common/Header.tsx';
import { Footer } from '../components/common/Footer.tsx';
import { getPageData, MyHorse } from '../data/pageData.ts';
import './HorseOwnerHorseDetail.css';

type HorsePerformance = {
  event: string;
  detail: string;
  position: string;
  jockey: string;
  earnings: string;
};

const performanceRows: HorsePerformance[] = [
  { event: 'Royal Ascot Classic', detail: 'Oct 14, 2023 - 2400m Turf', position: '1st', jockey: 'S. Whitmore', earnings: '850k Cr' },
  { event: 'Heritage Stakes', detail: 'Sep 02, 2023 - 1800m Dirt', position: '2nd', jockey: 'L. Hamilton', earnings: '420k Cr' },
  { event: 'Emerald Derby', detail: 'Jul 28, 2023 - 2200m Turf', position: '1st', jockey: 'S. Whitmore', earnings: '1.2M Cr' },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function readStoredHorses(): MyHorse[] {
  try {
    const raw = window.localStorage.getItem('my_horses_data');
    const parsed = raw ? JSON.parse(raw) as { horses?: MyHorse[] } : null;
    return parsed?.horses?.length ? parsed.horses : getPageData().myHorses.horses;
  } catch {
    return getPageData().myHorses.horses;
  }
}

function parseHorseMeta(meta: string) {
  const parts = meta.split(' - ').map((part) => part.trim()).filter(Boolean);
  const breed = parts[0] ?? 'Thoroughbred';
  const age = parts.find((part) => /\d+\s*yo/i.test(part))?.match(/\d+/)?.[0] ?? '5';
  const ageClass = parts.find((part) => ['Colt', 'Stallion', 'Gelding', 'Filly', 'Mare', 'Dam'].includes(part)) ?? 'Stallion';
  const condition = parts.find((part) => /condition/i.test(part))?.replace(/ condition/i, '') ?? 'Peak Performance';
  const winRate = parts.find((part) => /win rate/i.test(part))?.match(/\d+/)?.[0] ?? '78';

  return { breed, age, ageClass, condition, winRate };
}

function Icon({ name }: { name: 'calendar' | 'edit' | 'race' | 'sex' | 'type' }) {
  const paths = {
    calendar:
      'M1.5 15c-.4 0-.8-.1-1.1-.4A1.5 1.5 0 0 1 0 13.5V3c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4h.8V0h1.5v1.5h6V0h1.5v1.5h.7c.4 0 .8.1 1.1.4.3.3.4.7.4 1.1v10.5c0 .4-.1.8-.4 1.1-.3.3-.7.4-1.1.4H1.5Zm0-1.5H12V6H1.5v7.5Z',
    edit:
      'M1.7 13.3h1.2L11 5.2 9.8 4 1.7 12.1v1.2ZM0 15v-3.5L11 .5c.2-.2.4-.3.6-.4.2-.1.4-.1.6-.1.3 0 .5 0 .7.1.2.1.4.2.5.4l1.2 1.2c.2.2.3.4.4.6.1.2.1.4.1.6 0 .3 0 .5-.1.7-.1.2-.2.4-.4.6L3.5 15H0Z',
    race:
      'M.8 4.2V.8L4.2 2.5.8 4.2Zm6.7-.9V0l3.3 1.7-3.3 1.6Zm0 13.4c-1.1 0-2.1-.1-3-.3-.9-.1-1.7-.3-2.3-.5-.7-.2-1.2-.5-1.6-.8C.2 14.8 0 14.5 0 14.2V6.7c0-.4.2-.7.7-1 .4-.3 1-.6 1.7-.8.8-.2 1.7-.4 2.7-.5 1-.1 2.1-.2 3.2-.2 1.2 0 2.3.1 3.3.2 1 .1 1.9.3 2.6.5.8.2 1.4.5 1.8.8.4.3.7.6.7 1v7.5c0 .3-.2.6-.6.9-.4.3-.9.6-1.6.8-.7.2-1.5.4-2.4.5-.9.2-1.9.3-2.9.3v-3.3H7.5v3.3Z',
    sex:
      'M12 0v4.5h-1.5V2.6l-3 3c.2.4.4.7.5 1.1.2.4.2.8.2 1.2 0 1.2-.4 2.1-1.2 2.9-.8.8-1.8 1.2-2.9 1.2-1.1 0-2.1-.4-2.9-1.2C.4 10 0 9 0 7.9c0-1.2.4-2.1 1.2-2.9.8-.8 1.8-1.2 2.9-1.2.4 0 .8.1 1.2.2.4.1.8.3 1.1.5l3-3H7.5V0H12Z',
    type:
      'M7.5 15c-1 0-2-.2-2.9-.6-.9-.4-1.7-.9-2.4-1.6-.7-.7-1.2-1.5-1.6-2.4C.2 9.5 0 8.5 0 7.5s.2-2 .6-2.9c.4-.9.9-1.7 1.6-2.4C2.9 1.5 3.7 1 4.6.6 5.5.2 6.5 0 7.5 0s2 .2 2.9.6c.9.4 1.7.9 2.4 1.6.7.7 1.2 1.5 1.6 2.4.4.9.6 1.9.6 2.9s-.2 2-.6 2.9c-.4.9-.9 1.7-1.6 2.4-.7.7-1.5 1.2-2.4 1.6-.9.4-1.9.6-2.9.6Zm0-4.5 2.3-3-2.3-3-2.3 3 2.3 3Z',
  };

  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default function HorseOwnerHorseDetail() {
  const { name } = useParams<{ name?: string }>();
  const decodedName = decodeURIComponent(name ?? '');
  const horses = readStoredHorses();
  const horse = horses.find((item) => normalize(item.name) === normalize(decodedName)) ?? horses[0];
  const info = parseHorseMeta(horse.meta);

  return (
    <div className="horse-detail">
      <Header />

      <main className="horse-detail__main">
        <section className="horse-detail__hero">
          <img src={horse.imageSrc} alt={horse.name} />
          <div className="horse-detail__hero-gradient" />
          <div className="horse-detail__hero-content">
            <span className="horse-detail__status">Active</span>
            <h1>{horse.name}</h1>
            <div className="horse-detail__meta">
              <span><Icon name="type" />{info.breed}</span>
              <span><Icon name="calendar" />{info.age}yo</span>
              <span><Icon name="sex" />{info.ageClass}</span>
            </div>
          </div>
        </section>

        <section className="horse-detail__grid">
          <div className="horse-detail__left">
            <article className="horse-detail__metrics">
              <span>Key Performance Metrics</span>
              <div className="horse-detail__metric-row">
                <p>Win Rate</p>
                <strong>{info.winRate}%</strong>
              </div>
              <div className="horse-detail__bar"><i style={{ width: `${Math.min(Number(info.winRate), 100)}%` }} /></div>
              <div className="horse-detail__mini-grid">
                <div>
                  <span>Total Earnings</span>
                  <strong>4.2M <small>CR</small></strong>
                </div>
                <div>
                  <span>Starts</span>
                  <strong>24</strong>
                </div>
              </div>
            </article>

            <article className="horse-detail__condition">
              <div>
                <span>Condition</span>
                <strong>{info.condition}</strong>
              </div>
              <div className="horse-detail__condition-bars" aria-hidden="true"><i /><i /><i /><i /></div>
            </article>
          </div>

          <div className="horse-detail__right">
            <div className="horse-detail__actions">
              <Link className="horse-detail__primary" to="/HorseOwner/Tournaments">
                <Icon name="race" />
                Register for Race
              </Link>
              <Link className="horse-detail__secondary" to={`/HorseOwner/MyHorses/edit/${encodeURIComponent(horse.name)}`}>
                <Icon name="edit" />
                Edit Details
              </Link>
            </div>

            <article className="horse-detail__performance">
              <div className="horse-detail__table-head">
                <h2>Recent Performance</h2>
                <span>Showing last 5 events</span>
              </div>
              <div className="horse-detail__table">
                <div className="horse-detail__table-row horse-detail__table-row--head">
                  <span>Event / Race</span>
                  <span>Position</span>
                  <span>Jockey</span>
                  <span>Earnings</span>
                </div>
                {performanceRows.map((row) => (
                  <div className="horse-detail__table-row" key={row.event}>
                    <div><strong>{row.event}</strong><small>{row.detail}</small></div>
                    <span className={`horse-detail__position ${row.position === '1st' ? 'is-first' : ''}`}>{row.position}</span>
                    <p>{row.jockey}</p>
                    <b>{row.earnings}</b>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="horse-detail__heritage">
          <div className="horse-detail__heritage-copy">
            <h2>The Heritage of<br />Speed</h2>
            <p>
              {horse.name} carries the legacy of the Royal Ascot lineage, combining a powerful stride with a focused
              temperament that has defined our stables for decades.
            </p>
            <a href="#pedigree">Explore Full Pedigree</a>
          </div>
          <div className="horse-detail__gallery">
            <img src={horse.imageSrc} alt={`${horse.name} stable portrait`} />
            <img src={horse.imageSrc} alt={`${horse.name} racing profile`} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
