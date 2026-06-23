import React from 'react';
import {
  OwnerPortalFooter,
  OwnerPortalHeader,
  OwnerPortalIcon,
  OwnerPortalIconName,
} from '../components/horseOwner/OwnerPortalChrome.tsx';
import './HorseOwnerNotifications.css';

type NotificationTone = 'tournament' | 'jockey' | 'approved' | 'declined';

type OwnerNotification = {
  title: string;
  body: React.ReactNode;
  time: string;
  icon: OwnerPortalIconName;
  tone: NotificationTone;
  unread?: boolean;
};

const notifications: OwnerNotification[] = [
  {
    title: 'Tournament Registration Approved',
    body: (
      <>
        Your entry <strong>"Midnight Sovereign"</strong> for the Grand National Cup has been approved by the Admin.
      </>
    ),
    time: '2 hours ago',
    icon: 'trophy',
    tone: 'tournament',
    unread: true,
  },
  {
    title: 'Jockey Accepted Invitation',
    body: (
      <>
        <strong>Elena Vance</strong> has accepted your invitation for the Royal Ascot Sprint.
      </>
    ),
    time: '5 hours ago',
    icon: 'user',
    tone: 'jockey',
    unread: true,
  },
  {
    title: 'Tournament Approved',
    body: (
      <>
        Your registration for the <strong>St. Leger Stakes</strong> is now active. View your heat assignments in the dashboard.
      </>
    ),
    time: 'Yesterday',
    icon: 'badge',
    tone: 'approved',
  },
  {
    title: 'Jockey Declined Invitation',
    body: (
      <>
        <strong>Marcus Thorne</strong> has declined your invitation for the Winter Classic due to a scheduling conflict.
      </>
    ),
    time: '2 days ago',
    icon: 'user',
    tone: 'declined',
  },
];

export default function HorseOwnerNotifications() {
  const [view, setView] = React.useState<'all' | 'unread'>('all');
  const visibleNotifications = view === 'unread' ? notifications.filter((item) => item.unread) : notifications;

  return (
    <div className="horse-owner-notifications">
      <OwnerPortalHeader />

      <main className="owner-notifications-main" aria-label="Notifications">
        <section className="owner-notifications-head">
          <h1>Notifications</h1>

          <div className="owner-notifications-controls">
            <div className="owner-notifications-view" aria-label="Notification view filter">
              <span>View</span>
              <div>
                <button
                  className={view === 'all' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setView('all')}
                >
                  All
                </button>
                <button
                  className={view === 'unread' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setView('unread')}
                >
                  Unread
                </button>
              </div>
            </div>

            <label className="owner-notifications-sort">
              <span>Sort By Date</span>
              <select defaultValue="newest">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </label>
          </div>
        </section>

        <section className="owner-notifications-list" aria-label="Notification list">
          {visibleNotifications.map((notification) => (
            <article className="owner-notification-item" key={`${notification.title}-${notification.time}`}>
              <div className={`owner-notification-icon owner-notification-icon--${notification.tone}`}>
                <OwnerPortalIcon name={notification.icon} />
              </div>

              <div className="owner-notification-copy">
                <div>
                  <h2>{notification.title}</h2>
                  <time>{notification.time}</time>
                </div>
                <p>{notification.body}</p>
              </div>

              <div className="owner-notification-meta">
                {notification.unread ? <span aria-label="Unread notification" /> : null}
              </div>
            </article>
          ))}
        </section>

        <div className="owner-notifications-more">
          <button type="button">
            View Older Notifications
            <OwnerPortalIcon name="tenure" />
          </button>
        </div>
      </main>

      <OwnerPortalFooter />
    </div>
  );
}
