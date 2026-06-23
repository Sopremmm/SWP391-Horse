import React from 'react';
import { Link } from 'react-router-dom';
import {
  OwnerPortalFooter,
  OwnerPortalHeader,
  OwnerPortalIcon,
  OwnerPortalIconName,
} from '../components/horseOwner/OwnerPortalChrome.tsx';
import './HorseOwnerProfile.css';

type OwnerProfileForm = {
  fullName: string;
  username: string;
  role: string;
  age: string;
  gender: string;
  bio: string;
};

const INITIAL_PROFILE: OwnerProfileForm = {
  fullName: 'Alistair Sterling',
  username: '@asterling',
  role: 'Senior Managing Partner',
  age: '42',
  gender: 'Male',
  bio: 'Dedicated to the preservation and progress of the purebred thoroughbred legacy.',
};

const statCards = [
  { label: 'TOTAL EARNINGS', value: '$12,408,000', icon: 'money' as OwnerPortalIconName, variant: 'dark' },
  { label: 'TOURNAMENT WINS', value: '24 Wins', icon: 'trophy' as OwnerPortalIconName },
  { label: 'STABLE SIZE', value: '15 Registered', icon: 'stable' as OwnerPortalIconName, action: 'Active Horses' },
  { label: 'INDUSTRY TENURE', value: '12 Years', icon: 'tenure' as OwnerPortalIconName },
];

function ProfileOverview({
  profile,
  onEdit,
}: {
  profile: OwnerProfileForm;
  onEdit: () => void;
}) {
  return (
    <main className="owner-profile-main owner-profile-main--overview">
      <section className="owner-profile-hero" aria-label="Owner summary">
        <div className="owner-profile-hero__wash" aria-hidden="true" />
        <div className="owner-profile-avatar" aria-label={`${profile.fullName} verified profile`}>
          <div className="owner-profile-avatar__letters">AS</div>
          <div className="owner-profile-avatar__badge">
            <OwnerPortalIcon name="badge" />
          </div>
        </div>

        <div className="owner-profile-hero__copy">
          <h1>{profile.fullName}</h1>
          <p>
            {profile.username} <span aria-hidden="true">•</span> {profile.role}
          </p>
        </div>

        <button className="owner-profile-btn owner-profile-btn--primary" type="button" onClick={onEdit}>
          Edit Profile
        </button>
      </section>

      <section className="owner-profile-grid" aria-label="Personal details and account statistics">
        <aside className="owner-profile-details">
          <h2>
            <OwnerPortalIcon name="user" />
            Personal Details
          </h2>
          <dl>
            <div>
              <dt>Age</dt>
              <dd>{profile.age} Years</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{profile.gender}</dd>
            </div>
            <div className="owner-profile-details__bio">
              <dt>Bio</dt>
              <dd>"{profile.bio}"</dd>
            </div>
          </dl>
        </aside>

        <div className="owner-profile-stats">
          {statCards.map((stat) => (
            <article
              className={`owner-profile-stat ${stat.variant === 'dark' ? 'owner-profile-stat--dark' : ''}`}
              key={stat.label}
            >
              <div className="owner-profile-stat__icon">
                <OwnerPortalIcon name={stat.icon} />
              </div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              {stat.action ? (
                <Link to="/HorseOwner/MyHorses">
                  {stat.action}
                  <OwnerPortalIcon name="arrow" />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProfileEdit({
  profile,
  onCancel,
  onSave,
}: {
  profile: OwnerProfileForm;
  onCancel: () => void;
  onSave: (profile: OwnerProfileForm) => void;
}) {
  const [draft, setDraft] = React.useState(profile);

  const updateDraft = (field: keyof OwnerProfileForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <main className="owner-profile-main owner-profile-main--edit">
      <section className="owner-profile-edit-head">
        <h1>Edit Owner Profile</h1>
        <p>Manage your racing legacy and stable presence.</p>
      </section>

      <section className="owner-profile-form-card" aria-label="Edit owner profile form">
        <form onSubmit={handleSubmit}>
          <div className="owner-profile-upload">
            <div className="owner-profile-upload__photo">
              <img src="https://placehold.co/116x116" alt={`${draft.fullName} profile`} />
              <button type="button" aria-label="Change profile picture">
                <OwnerPortalIcon name="edit" />
              </button>
            </div>
            <span>Change Profile Picture</span>
          </div>

          <div className="owner-profile-field-grid">
            <label>
              <span>Full Name</span>
              <input value={draft.fullName} onChange={updateDraft('fullName')} />
            </label>
            <label>
              <span>Username</span>
              <input value={draft.username} disabled onChange={updateDraft('username')} />
              <em>Username cannot be changed after registration.</em>
            </label>
            <label>
              <span>Age</span>
              <input value={draft.age} inputMode="numeric" onChange={updateDraft('age')} />
            </label>
            <label>
              <span>Gender</span>
              <select value={draft.gender} onChange={updateDraft('gender')}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label className="owner-profile-bio-field">
            <span>Bio / Description</span>
            <textarea value={draft.bio} onChange={updateDraft('bio')} />
          </label>

          <section className="owner-profile-readonly" aria-label="Account statistics read only">
            <h2>Account Statistics (Read Only)</h2>
            <div>
              <article>
                <span>Stable Size</span>
                <strong>12</strong>
              </article>
              <article>
                <span>Total Wins</span>
                <strong>45</strong>
              </article>
              <article>
                <span>Tier</span>
                <strong>Elite</strong>
              </article>
            </div>
          </section>

          <div className="owner-profile-form-actions">
            <button className="owner-profile-btn owner-profile-btn--ghost" type="button" onClick={onCancel}>
              Cancel
            </button>
            <button className="owner-profile-btn owner-profile-btn--primary owner-profile-btn--wide" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default function HorseOwnerProfile() {
  const [profile, setProfile] = React.useState(INITIAL_PROFILE);
  const [editing, setEditing] = React.useState(false);

  const handleSave = (nextProfile: OwnerProfileForm) => {
    setProfile(nextProfile);
    setEditing(false);
  };

  return (
    <div className="horse-owner-profile">
      <OwnerPortalHeader />
      {editing ? (
        <ProfileEdit profile={profile} onCancel={() => setEditing(false)} onSave={handleSave} />
      ) : (
        <ProfileOverview profile={profile} onEdit={() => setEditing(true)} />
      )}
      <OwnerPortalFooter />
    </div>
  );
}
