import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout.tsx';

import './AdminCreateTournament.css';

type IconName = 'bell' | 'camera' | 'check' | 'grid' | 'help' | 'logout' | 'map' | 'money' | 'plus' | 'ruler' | 'settings' | 'trophy' | 'user' | 'users';

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    bell: 'M6 20v-2h2V9c0-1.4.4-2.6 1.3-3.7.8-1.1 1.9-1.8 3.2-2.1v-.7c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4s.8.1 1.1.4c.3.3.4.7.4 1.1v.7c1.3.3 2.4 1 3.2 2.1C19.6 6.4 20 7.6 20 9v9h2v2H6Zm8 3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4h4c0 .5-.2 1-.6 1.4-.4.4-.8.6-1.4.6Z',
    camera: 'M4 20c-.6 0-1.1-.2-1.5-.6S2 18.5 2 17.9V8.1c0-.6.2-1.1.6-1.5S3.4 6 4 6h3.2L9 4h6l1.8 2H20c.6 0 1.1.2 1.5.6s.6.9.6 1.5v9.8c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H4Zm8-3.2c1.3 0 2.4-.5 3.3-1.4.9-.9 1.4-2 1.4-3.3s-.5-2.4-1.4-3.3c-.9-.9-2-1.4-3.3-1.4s-2.4.5-3.3 1.4c-.9.9-1.4 2-1.4 3.3s.5 2.4 1.4 3.3c.9.9 2 1.4 3.3 1.4ZM18 9V7h2V5h2v2h2v2h-2v2h-2V9h-2Z',
    check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z',
    grid: 'M3 11V3h8v8H3Zm10 0V3h8v8h-8ZM3 21v-8h8v8H3Zm10 0v-8h8v8h-8Z',
    help: 'M11 18h2v-2h-2v2Zm1-16C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8Z',
    logout: 'M4 21c-.6 0-1.1-.2-1.5-.6S2 19.5 2 18.9V5.1c0-.6.2-1.1.6-1.5S3.4 3 4 3h7v2H4v14h7v2H4Zm11-4-1.4-1.4 2.6-2.6H8v-2h8.2l-2.6-2.6L15 7l5 5-5 5Z',
    map: 'M12 22c-2.7-2.3-4.7-4.4-6-6.4C4.7 13.7 4 11.9 4 10.2c0-2.5.8-4.5 2.4-6C8 2.7 9.9 2 12 2s4 .7 5.6 2.2c1.6 1.5 2.4 3.5 2.4 6 0 1.7-.7 3.5-2 5.4-1.3 2-3.3 4.1-6 6.4Zm0-9.8c.6 0 1.1-.2 1.5-.6.4-.4.6-.9.6-1.5s-.2-1.1-.6-1.5C13.1 8.2 12.6 8 12 8s-1.1.2-1.5.6c-.4.4-.6.9-.6 1.5s.2 1.1.6 1.5c.4.4.9.6 1.5.6Z',
    money: 'M4 18c-.6 0-1.1-.2-1.5-.6S2 16.5 2 15.9V8.1c0-.6.2-1.1.6-1.5S3.4 6 4 6h16c.6 0 1.1.2 1.5.6s.6.9.6 1.5v7.8c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H4Zm8-3c.8 0 1.5-.3 2.1-.9.6-.6.9-1.3.9-2.1s-.3-1.5-.9-2.1C13.5 9.3 12.8 9 12 9s-1.5.3-2.1.9C9.3 10.5 9 11.2 9 12s.3 1.5.9 2.1c.6.6 1.3.9 2.1.9Z',
    plus: 'M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z',
    ruler: 'M3 17.3 17.3 3 21 6.7 6.7 21 3 17.3Zm4.1.9 1.4-1.4-1.3-1.3 1.4-1.4 1.3 1.3 1.4-1.4-1.3-1.3 1.4-1.4 1.3 1.3 1.4-1.4-1.3-1.3 1.4-1.4 1.3 1.3 1.7-1.7-1.9-1.9L5.2 17.3l1.9 1.9Z',
    settings: 'm10 22-.4-3c-.3-.1-.6-.2-.9-.4-.3-.1-.6-.3-.8-.5l-2.8 1.2-2-3.5 2.4-1.8v-2l-2.4-1.8 2-3.5 2.8 1.2c.2-.2.5-.4.8-.5.3-.2.6-.3.9-.4l.4-3h4l.4 3c.3.1.6.2.9.4.3.1.6.3.8.5l2.8-1.2 2 3.5-2.4 1.8v2l2.4 1.8-2 3.5-2.8-1.2c-.2.2-.5.4-.8.5-.3.2-.6.3-.9.4l-.4 3h-4Z',
    trophy: 'M7 21v-2h4v-3.1c-.9-.2-1.7-.6-2.4-1.2-.7-.6-1.2-1.3-1.5-2.1-1.4-.2-2.5-.8-3.4-1.8C2.8 9.8 2.3 8.6 2.3 7.2V6c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6H7V2h10v1.9h2.6c.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5v1.2c0 1.4-.5 2.6-1.4 3.6-.9 1-2.1 1.6-3.4 1.8-.3.8-.8 1.5-1.5 2.1-.7.6-1.5 1-2.4 1.2V19h4v2H7Z',
    user: 'M12 12c-1.1 0-2-.4-2.8-1.2C8.4 10 8 9.1 8 8s.4-2 1.2-2.8C10 4.4 10.9 4 12 4s2 .4 2.8 1.2C15.6 6 16 6.9 16 8s-.4 2-1.2 2.8C14 11.6 13.1 12 12 12ZM4 20v-2.8c0-.6.1-1.1.4-1.6.3-.5.7-.8 1.2-1.1 1-.5 2.1-.9 3.2-1.2 1.1-.2 2.1-.3 3.2-.3s2.1.1 3.2.3c1.1.3 2.2.7 3.2 1.2.5.3.9.6 1.2 1.1.3.5.4 1 .4 1.6V20H4Z',
    users: 'M2 19v-2.1c0-.7.2-1.3.6-1.8.4-.5.9-.9 1.5-1.2 1.1-.5 2.2-.9 3.4-1.2 1.1-.3 2.3-.4 3.5-.4s2.4.1 3.5.4c1.2.3 2.3.7 3.4 1.2.6.3 1.1.7 1.5 1.2.4.5.6 1.1.6 1.8V19H2Zm5-9.5c-.9 0-1.7-.3-2.3-1C4.1 7.9 3.8 7.1 3.8 6.2s.3-1.7.9-2.3c.6-.7 1.4-1 2.3-1s1.7.3 2.3 1c.6.6.9 1.4.9 2.3s-.3 1.7-.9 2.3c-.6.7-1.4 1-2.3 1Z',
  };

  return (
    <svg className="admin-create-tournament__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

type AdminCreateTournamentProps = {
  mode?: 'create' | 'edit';
};

type TournamentRouteParams = {
  name?: string;
};

export default function AdminCreateTournament({ mode = 'create' }: AdminCreateTournamentProps) {
  const { name } = useParams<TournamentRouteParams>();
  const decodedName = name ? decodeURIComponent(name) : 'The Heritage Autumn Cup';
  const isEdit = mode === 'edit';
  const [created, setCreated] = React.useState(false);
  const initialTournament = {
    name: isEdit ? decodedName : '',
    description: isEdit
      ? 'The pinnacle of the autumn racing season, where tradition meets speed. A gathering of elite breeders and thoroughbreds.'
      : '',
    participants: isEdit ? 20 : 24,
    distance: isEdit ? 2400 : 2400,
    prize: isEdit ? '500,000' : '50,000',
    registrationStart: isEdit ? '06/01/2024, 09:00' : '',
    registrationDeadline: isEdit ? '06/10/2024, 17:00' : '',
    tournamentStart: isEdit ? '06/18/2024' : '',
    tournamentEnd: isEdit ? '06/20/2024' : '',
    venue: isEdit ? 'Berkshire, UK' : '',
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreated(true);
    window.setTimeout(() => setCreated(false), 3000);
  };

  return (
    <AdminLayout
      active="tournaments"
      breadcrumb={[
        { label: 'Tournaments', to: '/Admin/ManageTournaments' },
        { label: isEdit ? 'Edit Tournament' : 'Add New Tournament' },
      ]}
    >
      <div className="admin-create-tournament">
        {created ? (
          <div className="admin-create-tournament__success" role="status">
            <Icon name="check" />
            {isEdit ? 'Tournament changes saved successfully.' : 'Tournament draft created successfully.'}
          </div>
        ) : null}

        <form className="admin-create-tournament__canvas" onSubmit={handleSubmit}>
          <section className="admin-create-tournament__hero">
            <h1>{isEdit ? 'Edit Tournament' : 'Create New Tournament'}</h1>
            <p>
              {isEdit
                ? 'Update tournament details, technical limits, scheduling, media, and venue information before saving changes.'
                : 'Define the parameters for a new equestrian event. All listed tournaments will be subject to final steward approval before going live to the public registry.'}
            </p>
          </section>

          <section className="admin-create-tournament__section admin-create-tournament__media-card" aria-labelledby="media-title">
            <h2 id="media-title">Tournament Media</h2>
            <label className="admin-create-tournament__upload">
              <input name="banner" type="file" accept="image/*" />
              <span className="admin-create-tournament__upload-content">
                <Icon name="camera" />
                <strong>Upload Tournament Banner</strong>
                <small>Recommended: 1920x600px - Max 5MB</small>
              </span>
            </label>
          </section>

          <div className="admin-create-tournament__info-row">
            <section className="admin-create-tournament__section admin-create-tournament__basic-card" aria-labelledby="basic-title">
              <h2 id="basic-title">Basic Information</h2>
              <div className="admin-create-tournament__stack">
                <label className="admin-create-tournament__field">
                  <span>Tournament Name</span>
                  <input name="name" defaultValue={initialTournament.name} placeholder="e.g. The Heritage Autumn Cup" required />
                </label>
                <label className="admin-create-tournament__field">
                  <span>Description</span>
                  <textarea name="description" rows={7} defaultValue={initialTournament.description} placeholder="Describe the history, prestige, and specific rules of this event..." />
                </label>
              </div>
            </section>

            <section className="admin-create-tournament__section admin-create-tournament__technical-card" aria-labelledby="technical-title">
              <h2 id="technical-title">Technicalities</h2>
              <div className="admin-create-tournament__stack">
                <label className="admin-create-tournament__field admin-create-tournament__compound-field">
                  <span>Max Participation</span>
                  <div>
                    <Icon name="users" />
                    <input name="participants" type="number" min="1" max="64" defaultValue={initialTournament.participants} />
                    <strong>Horses</strong>
                  </div>
                </label>
                <label className="admin-create-tournament__field admin-create-tournament__compound-field">
                  <span>Race Distance</span>
                  <div>
                    <Icon name="ruler" />
                    <input name="distance" type="number" min="0" defaultValue={initialTournament.distance} />
                    <strong>Meters</strong>
                  </div>
                </label>
                <label className="admin-create-tournament__field admin-create-tournament__compound-field admin-create-tournament__money">
                  <span>Prize Pool</span>
                  <div>
                    <Icon name="money" />
                    <input name="prize" type="text" defaultValue={initialTournament.prize} />
                    <strong>GBP</strong>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <section className="admin-create-tournament__section admin-create-tournament__schedule-card" aria-labelledby="schedule-title">
            <h2 id="schedule-title">Scheduling &amp; Timeline</h2>
            <div className="admin-create-tournament__schedule-grid">
              <label className="admin-create-tournament__field">
                <span>Registration Start</span>
                <input name="registrationStart" type="text" defaultValue={initialTournament.registrationStart} placeholder="mm/dd/yyyy, --:--" />
              </label>
              <label className="admin-create-tournament__field">
                <span>Registration Deadline</span>
                <input name="registrationDeadline" type="text" defaultValue={initialTournament.registrationDeadline} placeholder="mm/dd/yyyy, --:--" />
              </label>
              <label className="admin-create-tournament__field">
                <span>Tournament Start</span>
                <input name="tournamentStart" type="text" defaultValue={initialTournament.tournamentStart} placeholder="mm/dd/yyyy" />
              </label>
              <label className="admin-create-tournament__field">
                <span>Tournament End</span>
                <input name="tournamentEnd" type="text" defaultValue={initialTournament.tournamentEnd} placeholder="mm/dd/yyyy" />
              </label>
            </div>
          </section>

          <section className="admin-create-tournament__section admin-create-tournament__venue-card" aria-labelledby="venue-title">
            <h2 id="venue-title">Venue &amp; Location</h2>
            <label className="admin-create-tournament__field admin-create-tournament__compound-field admin-create-tournament__venue-field">
              <span>Host City/Venue</span>
              <div>
                <Icon name="map" />
                <input name="venue" defaultValue={initialTournament.venue} placeholder="e.g. Newmarket Racecourse, Suffolk" />
              </div>
            </label>
          </section>

          <div className="admin-create-tournament__actions">
            <Link to="/Admin/ManageTournaments">Cancel</Link>
            <button type="submit">
              {isEdit ? 'Save Changes' : 'Create Tournament'}
              <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
