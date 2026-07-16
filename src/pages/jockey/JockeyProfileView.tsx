import React from 'react';
import { Link } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import './JockeyProfileView.css';

export type JockeyPublicProfile = {
  name?: string;
  imageUrl?: string;
  active?: boolean;
  license?: string;
  age?: number;
  gender?: string;
  experienceYears?: number;
  biography?: string;
  winRate?: number;
  totalRaces?: number;
  hiringPrice?: string;
};

type Props = { profile?: JockeyPublicProfile | null; loading?: boolean };

export default function JockeyProfileView({ profile, loading = false }: Props) {
  const hasProfile = Boolean(profile);
  return <div className="jockey-profile-view"><JockeyHeader /><main aria-busy={loading}>
    {hasProfile ? <div className="jockey-profile-view__grid">
      <section className="jockey-profile-view__identity">
        <div className="jockey-profile-view__portrait">{profile?.imageUrl ? <img src={profile.imageUrl} alt={profile.name || 'Jockey profile'} /> : <span>Profile photo</span>}</div>
        <h1>{profile?.name || 'Jockey'}</h1><div className="jockey-profile-view__license">{profile?.active !== false ? <b>● Active</b> : <b className="is-inactive">Inactive</b>}<span>{profile?.license || 'License information pending'}</span></div>
        <dl><div><dt>Age</dt><dd>{profile?.age ?? '—'}</dd></div><div><dt>Gender</dt><dd>{profile?.gender || '—'}</dd></div><div><dt>Experience</dt><dd>{profile?.experienceYears !== undefined ? `${profile.experienceYears} Years` : '—'}</dd></div></dl>
      </section>
      <section className="jockey-profile-view__details"><span className="jockey-profile-view__eyebrow">Professional Biography</span><p className="jockey-profile-view__bio">{profile?.biography || 'Biography information has not been provided.'}</p><h2>Key Statistics</h2><dl className="jockey-profile-view__stats"><div><dt>Experience</dt><dd>{profile?.experienceYears ?? '—'}<small>{profile?.experienceYears !== undefined ? ' Years' : ''}</small></dd></div><div><dt>Win Rate</dt><dd className="is-gold">{profile?.winRate ?? '—'}<small>{profile?.winRate !== undefined ? ' %' : ''}</small></dd></div><div><dt>Total Races</dt><dd>{profile?.totalRaces ?? '—'}</dd></div><div><dt>Hiring Price</dt><dd className="is-green">{profile?.hiringPrice || '—'}</dd></div></dl><Link className="jockey-profile-view__edit" to="/Jockey/Profile/edit">✎ Edit Profile</Link></section>
    </div> : <section className="jockey-profile-view__empty"><h1>Jockey Profile</h1><p>Profile data is not available.</p><Link to="/Jockey/Profile/edit">Edit Profile</Link></section>}
  </main><Footer /></div>;
}
