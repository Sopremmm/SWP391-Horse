import React from 'react';
import { Link } from 'react-router-dom';
import { updateCurrentUserProfile } from '../../services/auth.ts';
import { getHorseOwnerProfileData } from '../../services/integration.ts';
import {
  OwnerPortalFooter,
  OwnerPortalHeader,
  OwnerPortalIcon,
  OwnerPortalIconName,
} from '../../components/horseOwner/OwnerPortalChrome.tsx';
import './HorseOwnerProfile.css';

type OwnerProfileForm = {
  fullName: string;
  username: string;
  role: string;
  age: string;
  gender: string;
  bio: string;
  avatarUrl?: string;
  initials?: string;
};

type OwnerProfileStat = {
  label: string;
  value: string;
  icon?: OwnerPortalIconName;
  variant?: 'dark' | 'light';
  action?: string;
  href?: string;
};

type OwnerProfileData = {
  profile?: Partial<OwnerProfileForm>;
  stats?: OwnerProfileStat[];
  readonlyStats?: Array<{ label: string; value: string }>;
};

const EMPTY_PROFILE: OwnerProfileForm = {
  fullName: '',
  username: '',
  role: '',
  age: '',
  gender: '',
  bio: '',
};

const normalizeProfile = (raw?: OwnerProfileData | null): OwnerProfileForm => ({
  fullName: raw?.profile?.fullName ?? '',
  username: raw?.profile?.username ?? '',
  role: raw?.profile?.role ?? '',
  age: raw?.profile?.age ?? '',
  gender: raw?.profile?.gender ?? '',
  bio: raw?.profile?.bio ?? '',
  avatarUrl: raw?.profile?.avatarUrl,
  initials: raw?.profile?.initials,
});

const profileInitials = (profile: OwnerProfileForm) => {
  if (profile.initials) return profile.initials;
  return profile.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

function ProfileOverview({
  profile,
  stats,
  onEdit,
}: {
  profile: OwnerProfileForm;
  stats: OwnerProfileStat[];
  onEdit: () => void;
}) {
  return (
    <main className="owner-profile-main owner-profile-main--overview">
      <section className="owner-profile-hero" aria-label="Owner summary">
        <div className="owner-profile-hero__wash" aria-hidden="true" />
        <div className="owner-profile-avatar" aria-label={`${profile.fullName || 'Owner'} verified profile`}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.fullName || 'Owner profile'} />
          ) : (
            <div className="owner-profile-avatar__letters">{profileInitials(profile)}</div>
          )}
          <div className="owner-profile-avatar__badge">
            <OwnerPortalIcon name="badge" />
          </div>
        </div>

        <div className="owner-profile-hero__copy">
          <h1>{profile.fullName || 'Owner Profile'}</h1>
          <p>{[profile.username, profile.role].filter(Boolean).join(' • ')}</p>
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
              <dd>{profile.age}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{profile.gender}</dd>
            </div>
            <div className="owner-profile-details__bio">
              <dt>Bio</dt>
              <dd>{profile.bio}</dd>
            </div>
          </dl>
        </aside>

        <div className="owner-profile-stats">
          {stats.length ? (
            stats.map((stat) => (
              <article
                className={`owner-profile-stat ${stat.variant === 'dark' ? 'owner-profile-stat--dark' : ''}`}
                key={stat.label}
              >
                <div className="owner-profile-stat__icon">
                  <OwnerPortalIcon name={stat.icon || 'badge'} />
                </div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                {stat.action ? (
                  <Link to={stat.href || '/HorseOwner/MyHorses'}>
                    {stat.action}
                    <OwnerPortalIcon name="arrow" />
                  </Link>
                ) : null}
              </article>
            ))
          ) : (
            <div className="owner-profile-empty">Profile stats are empty.</div>
          )}
        </div>
      </section>
    </main>
  );
}

function ProfileEdit({
  profile,
  readonlyStats,
  onCancel,
  onSave,
}: {
  profile: OwnerProfileForm;
  readonlyStats: Array<{ label: string; value: string }>;
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
              {draft.avatarUrl ? <img src={draft.avatarUrl} alt={`${draft.fullName} profile`} /> : null}
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
                <option value=""></option>
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
              {readonlyStats.length ? (
                readonlyStats.map((stat) => (
                  <article key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </article>
                ))
              ) : (
                <div className="owner-profile-empty">Readonly stats are empty.</div>
              )}
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
  const [profile, setProfile] = React.useState<OwnerProfileForm>(EMPTY_PROFILE);
  const [stats, setStats] = React.useState<OwnerProfileStat[]>([]);
  const [readonlyStats, setReadonlyStats] = React.useState<Array<{ label: string; value: string }>>([]);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      const data = await getHorseOwnerProfileData().catch(() => null);
      if (!cancelled && data) {
        setProfile(normalizeProfile(data));
        setStats(data.stats || []);
        setReadonlyStats(data.readonlyStats || []);
      }
    };

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = (nextProfile: OwnerProfileForm) => {
    updateCurrentUserProfile({
      fullName: nextProfile.fullName,
      email: nextProfile.username,
    });
    setProfile(nextProfile);
    setEditing(false);
  };

  return (
    <div className="horse-owner-profile">
      <OwnerPortalHeader />
      {editing ? (
        <ProfileEdit profile={profile} readonlyStats={readonlyStats} onCancel={() => setEditing(false)} onSave={handleSave} />
      ) : (
        <ProfileOverview profile={profile} stats={stats} onEdit={() => setEditing(true)} />
      )}
      <OwnerPortalFooter />
    </div>
  );
}
