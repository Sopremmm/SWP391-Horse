import React from 'react';
import { SpectatorFooter, SpectatorHeader } from '../../components/spectator/index.ts';
import './SpectatorProfile.css';

type SpectatorProfileData = {
  fullName?: string;
  email?: string;
  role?: string;
  status?: string;
  stats?: Array<{ label: string; value: string }>;
};

type Props = {
  profile?: SpectatorProfileData | null;
  loading?: boolean;
};

export default function SpectatorProfile({ profile, loading = false }: Props) {
  if (!profile) {
    return (
      <div className="spectator-profile-page">
        <SpectatorHeader />
        <main className="spectator-profile-main">
          <section className="spectator-profile-empty">
            <h1>Spectator Profile</h1>
            <p>{loading ? 'Loading profile...' : 'Profile data is not available.'}</p>
          </section>
        </main>
        <SpectatorFooter />
      </div>
    );
  }

  const initials = (profile.fullName || profile.email || 'S')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="spectator-profile-page">
      <SpectatorHeader />
      <main className="spectator-profile-main">
        <section className="spectator-profile-hero">
          <div className="spectator-profile-avatar" aria-hidden="true">
            {initials || 'S'}
          </div>
          <div className="spectator-profile-heading">
            <p className="spectator-profile-eyebrow">Spectator Profile</p>
            <h1>{profile.fullName || 'Spectator'}</h1>
            <p>Manage your account information and keep track of racing activity available for the spectator role.</p>
          </div>
        </section>

        <section className="spectator-profile-grid">
          <article className="spectator-profile-card">
            <h2>Account Details</h2>
            <dl className="spectator-profile-details">
              <div>
                <dt>Full Name</dt>
                <dd>{profile.fullName || '—'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile.email || '—'}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{profile.role || 'Spectator'}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{profile.status || 'Active'}</dd>
              </div>
            </dl>
          </article>

          <article className="spectator-profile-card">
            <h2>Activity Overview</h2>
            <div className="spectator-profile-stats">
              {(profile.stats || []).map((stat) => (
                <div key={stat.label} className="spectator-profile-stat">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
      <SpectatorFooter />
    </div>
  );
}
