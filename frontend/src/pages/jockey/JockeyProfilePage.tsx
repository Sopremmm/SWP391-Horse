import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/common/Footer.tsx';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import './JockeyProfilePage.css';

type ProfileIconName = 'badge' | 'camera' | 'shield';

function ProfileIcon({ name }: { name: ProfileIconName }) {
  const paths: Record<ProfileIconName, string> = {
    badge:
      'M7.6 21 5.7 17.8 2.1 17l.4-3.7L0 10.5l2.5-2.8L2.1 4l3.6-.8L7.6 0 11 1.5 14.4 0l1.9 3.2 3.6.8-.4 3.7 2.5 2.8-2.5 2.8.4 3.7-3.6.8-1.9 3.2-3.4-1.5L7.6 21Zm2.4-7 5.6-5.6-1.4-1.5-4.2 4.3-2.2-2.1-1.4 1.4 3.6 3.5Z',
    camera:
      'M8.3 12.1c1 0 1.9-.4 2.6-1.1.7-.7 1.1-1.6 1.1-2.6s-.4-1.9-1.1-2.6c-.7-.7-1.6-1.1-2.6-1.1s-1.9.4-2.6 1.1c-.7.7-1.1 1.6-1.1 2.6s.4 1.9 1.1 2.6c.7.7 1.6 1.1 2.6 1.1Zm-6.7 2.9c-.5 0-.9-.2-1.2-.5C.2 14.1 0 13.7 0 13.3v-10c0-.5.2-.9.5-1.2.3-.3.7-.5 1.2-.5h2.6L5.8 0h5l1.5 1.7H15c.5 0 .9.2 1.2.5.3.3.5.7.5 1.2v10c0 .5-.2.9-.5 1.2-.3.3-.7.5-1.2.5H1.7Z',
    shield:
      'M8 20c-2.3-.6-4.2-1.9-5.7-4C.8 13.9 0 11.6 0 9.1V3l8-3 8 3v6.1c0 2.5-.8 4.8-2.3 6.9-1.5 2.1-3.4 3.4-5.7 4Z',
  };

  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export type JockeyEditableProfile = {
  fullName?: string; avatarUrl?: string; age?: number; gender?: string; professionalStatus?: string;
  bio?: string; experienceYears?: number; totalRaces?: number; winRate?: number;
  invitationRate?: string; internationalTravel?: boolean; roleTitle?: string;
};

type Props = { profile?: JockeyEditableProfile | null; onSave?: (profile: JockeyEditableProfile, avatarFile?: File) => void | Promise<void> };
const EMPTY_PROFILE: JockeyEditableProfile = { fullName: '', avatarUrl: '', gender: '', professionalStatus: '', bio: '', invitationRate: '', internationalTravel: false };

export default function JockeyProfilePage({ profile, onSave }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = React.useState<JockeyEditableProfile>(() => ({ ...EMPTY_PROFILE, ...profile }));
  const [avatarFile, setAvatarFile] = React.useState<File>();
  const [avatarPreview, setAvatarPreview] = React.useState(profile?.avatarUrl || '');
  const fileInput = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { setForm({ ...EMPTY_PROFILE, ...profile }); setAvatarPreview(profile?.avatarUrl || ''); }, [profile]);
  React.useEffect(() => () => { if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview); }, [avatarPreview]);
  const update = (key: keyof JockeyEditableProfile, value: string | number | boolean | undefined) => setForm((current) => ({ ...current, [key]: value }));
  const numberValue = (value: string) => value === '' ? undefined : Number(value);
  const selectAvatar = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave?.(form, avatarFile);
    navigate('/Jockey/Profile', { replace: true });
  };

  return (
    <div className="jockey-profile-page">
      <JockeyHeader />

      <main className="jockey-profile-page__main">
        <aside className="jockey-profile-page__side">
          <section className="jockey-profile-page__identity">
            <div className="jockey-profile-page__photo-wrap">
              {avatarPreview ? <img src={avatarPreview} alt={form.fullName ? `${form.fullName} profile` : 'Jockey profile'} /> : <div className="jockey-profile-page__photo-empty">No photo</div>}
              <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={selectAvatar} hidden />
              <button type="button" aria-label="Change profile photo" onClick={() => fileInput.current?.click()}>
                <ProfileIcon name="camera" />
              </button>
            </div>

            <div className="jockey-profile-page__identity-copy">
              <h1>{form.fullName || 'Jockey Profile'}</h1>
              <p>{form.roleTitle || 'Professional Jockey'}</p>
            </div>

            <div className="jockey-profile-page__quick-stats">
              <div>
                <strong>{form.totalRaces ?? '—'}</strong>
                <span>Total Races</span>
              </div>
              <div>
                <strong>{form.winRate !== undefined ? `${form.winRate}%` : '—'}</strong>
                <span>Win Rate</span>
              </div>
            </div>
          </section>

          <section className="jockey-profile-page__integrity">
            <h2>Account Integrity</h2>
            <ul>
              <li><ProfileIcon name="badge" />Credential status is managed by the system</li>
              <li><ProfileIcon name="shield" />Account security is active</li>
            </ul>
          </section>
        </aside>

        <section className="jockey-profile-page__card">
          <form className="jockey-profile-page__form" onSubmit={handleSubmit}>
            <section className="jockey-profile-page__section">
              <h2>Professional Credentials</h2>
              <div className="jockey-profile-page__fields jockey-profile-page__fields--two">
                <label>
                  <span>Full Legal Name</span>
                  <input value={form.fullName || ''} onChange={(e) => update('fullName', e.target.value)} />
                </label>
                <label>
                  <span>Age (Years)</span>
                  <input value={form.age ?? ''} onChange={(e) => update('age', numberValue(e.target.value))} type="number" min="16" />
                </label>
                <label>
                  <span>Gender</span>
                  <select value={form.gender || ''} onChange={(e) => update('gender', e.target.value)}>
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  <span>Professional Status</span>
                  <select value={form.professionalStatus || ''} onChange={(e) => update('professionalStatus', e.target.value)}>
                    <option value="">Select Status</option>
                    <option>Active</option>
                    <option>Unavailable</option>
                    <option>In Review</option>
                  </select>
                </label>
                <label className="jockey-profile-page__wide">
                  <span>Bio</span>
                  <textarea value={form.bio || ''} onChange={(e) => update('bio', e.target.value)} rows={5} placeholder="Write a short professional biography..." />
                </label>
              </div>
            </section>

            <section className="jockey-profile-page__section">
              <h2>Experience &amp; Performance</h2>
              <div className="jockey-profile-page__fields jockey-profile-page__fields--three">
                <label className="jockey-profile-page__suffix">
                  <span>Years Experience</span>
                  <input value={form.experienceYears ?? ''} onChange={(e) => update('experienceYears', numberValue(e.target.value))} type="number" min="0" />
                  <em>yr</em>
                </label>
                <label>
                  <span>Total Races (System)</span>
                  <input value={form.totalRaces ?? ''} type="number" readOnly aria-readonly="true" />
                </label>
                <label>
                  <span>Win Rate % (System)</span>
                  <input value={form.winRate ?? ''} type="number" readOnly aria-readonly="true" />
                </label>
              </div>
            </section>

            <section className="jockey-profile-page__section">
              <h2>Service Terms</h2>
              <div className="jockey-profile-page__service-row">
                <label className="jockey-profile-page__price">
                  <span>Invitation Rate (Per Race)</span>
                  <div>
                    <strong>GBP</strong>
                    <input value={form.invitationRate || ''} onChange={(e) => update('invitationRate', e.target.value)} inputMode="decimal" />
                  </div>
                </label>
                <label className="jockey-profile-page__toggle">
                  <input type="checkbox" checked={Boolean(form.internationalTravel)} onChange={(e) => update('internationalTravel', e.target.checked)} />
                  <span />
                  Available for International Travel
                </label>
              </div>
            </section>

            <div className="jockey-profile-page__actions">
              <span>Profile data will be saved to your account.</span>
              <div>
                <button type="button" className="jockey-profile-page__discard" onClick={() => navigate('/Jockey/Profile')}>Discard</button>
                <button type="submit" className="jockey-profile-page__save">Save Changes</button>
              </div>
            </div>
          </form>
        </section>
      </main>


      <Footer />
    </div>
  );
}
