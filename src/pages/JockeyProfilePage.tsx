import React from 'react';
import { Footer } from '../components/common/Footer.tsx';
import JockeyHeader from '../components/jockey/JockeyHeader.tsx';
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

export default function JockeyProfilePage() {
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className="jockey-profile-page">
      <JockeyHeader />

      <main className="jockey-profile-page__main">
        <aside className="jockey-profile-page__side">
          <section className="jockey-profile-page__identity">
            <div className="jockey-profile-page__photo-wrap">
              <img src="https://placehold.co/184x184" alt="Julian Thorne profile" />
              <button type="button" aria-label="Change profile photo">
                <ProfileIcon name="camera" />
              </button>
            </div>

            <div className="jockey-profile-page__identity-copy">
              <h1>Julian Thorne</h1>
              <p>Premier Division Jockey</p>
            </div>

            <div className="jockey-profile-page__quick-stats">
              <div>
                <strong>142</strong>
                <span>Career Wins</span>
              </div>
              <div>
                <strong>18%</strong>
                <span>Win Rate</span>
              </div>
            </div>
          </section>

          <section className="jockey-profile-page__integrity">
            <h2>Account Integrity</h2>
            <ul>
              <li><ProfileIcon name="badge" />Credential Verified: Jan 2024</li>
              <li><ProfileIcon name="shield" />Insurance Active</li>
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
                  <input defaultValue="Julian Thorne" />
                </label>
                <label>
                  <span>Age (Years)</span>
                  <input defaultValue="28" type="number" min="16" />
                </label>
                <label>
                  <span>Gender</span>
                  <select defaultValue="">
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  <span>Professional Status</span>
                  <select defaultValue="Active">
                    <option>Active</option>
                    <option>Unavailable</option>
                    <option>In Review</option>
                  </select>
                </label>
                <label className="jockey-profile-page__wide">
                  <span>Active Racing Licenses</span>
                  <textarea defaultValue="BHA Professional, HRI Flat, FEI International Grade A" rows={3} />
                </label>
              </div>
            </section>

            <section className="jockey-profile-page__section">
              <h2>Experience &amp; Performance</h2>
              <div className="jockey-profile-page__fields jockey-profile-page__fields--three">
                <label className="jockey-profile-page__suffix">
                  <span>Years Experience</span>
                  <input defaultValue="9" type="number" min="0" />
                  <em>yr</em>
                </label>
                <label>
                  <span>Total Wins</span>
                  <input defaultValue="142" type="number" min="0" />
                </label>
                <label>
                  <span>Win Rate %</span>
                  <input defaultValue="18" type="number" min="0" max="100" />
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
                    <input defaultValue="450.00" inputMode="decimal" />
                  </div>
                </label>
                <label className="jockey-profile-page__toggle">
                  <input type="checkbox" defaultChecked />
                  <span />
                  Available for International Travel
                </label>
              </div>
            </section>

            <div className="jockey-profile-page__actions">
              <span>Last updated: Oct 24, 2024 at 09:15 AM</span>
              <div>
                <button type="reset" className="jockey-profile-page__discard">Discard</button>
                <button type="submit" className="jockey-profile-page__save">Save Changes</button>
              </div>
            </div>
          </form>
        </section>
      </main>

      <div className={`jockey-profile-page__toast ${saved ? 'is-visible' : ''}`} role="status">
        <i />
        Profile changes saved successfully.
      </div>

      <Footer />
    </div>
  );
}
