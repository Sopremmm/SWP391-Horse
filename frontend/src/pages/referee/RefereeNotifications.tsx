import React from 'react';
import { Link } from 'react-router-dom';
import { RefereeShell } from '../../components/referee/index.ts';
import './RefereeNotifications.css';

export type RefereeNotification = {
  id: string | number;
  title: string;
  message: string;
  createdAt?: string;
  raceName?: string;
  read?: boolean;
  type?: 'assignment' | 'reassignment' | 'update' | 'alert';
};

type Props = {
  notifications?: RefereeNotification[];
  loading?: boolean;
  error?: string;
  onAcknowledge?: (notification: RefereeNotification) => void | Promise<void>;
  onMarkAllRead?: (notifications: RefereeNotification[]) => void | Promise<void>;
};

const racePath = (raceName: string) => `/Referee/Races/${encodeURIComponent(raceName)}`;

export default function RefereeNotifications({
  notifications = [],
  loading = false,
  error,
  onAcknowledge,
  onMarkAllRead,
}: Props) {
  const [view, setView] = React.useState<'all' | 'unread'>('all');
  const [readIds, setReadIds] = React.useState<Set<string | number>>(new Set());

  const isRead = (notification: RefereeNotification) => Boolean(notification.read || readIds.has(notification.id));
  const visibleNotifications = notifications.filter((notification) => view === 'all' || !isRead(notification));
  const unreadCount = notifications.filter((notification) => !isRead(notification)).length;

  const acknowledge = async (notification: RefereeNotification) => {
    setReadIds((current) => new Set(current).add(notification.id));
    await onAcknowledge?.(notification);
  };

  const markAllRead = async () => {
    setReadIds(new Set(notifications.map((notification) => notification.id)));
    await onMarkAllRead?.(notifications);
  };

  return (
    <RefereeShell>
      <section className="referee-notifications" aria-busy={loading}>
        <header className="referee-notifications__intro">
          <div>
            <h1>Notifications</h1>
            <p>Review your latest assignments, updates, and alerts.</p>
          </div>
          <div className="referee-notifications__controls">
            <div className="referee-notifications__filter" role="group" aria-label="Notification filter">
              <button className={view === 'all' ? 'is-active' : ''} type="button" onClick={() => setView('all')}>All</button>
              <button className={view === 'unread' ? 'is-active' : ''} type="button" onClick={() => setView('unread')}>Unread ({unreadCount})</button>
            </div>
            <button type="button" className="referee-notifications__mark" onClick={markAllRead} disabled={!unreadCount}>
              Mark All Read
            </button>
          </div>
        </header>

        <section className="referee-notifications__list" aria-label="Notification list">
          {loading ? (
            <div className="referee-notifications__state" role="status">Loading notifications...</div>
          ) : error ? (
            <div className="referee-notifications__state referee-notifications__state--error" role="alert">{error}</div>
          ) : visibleNotifications.length ? (
            visibleNotifications.map((notification) => {
              const read = isRead(notification);
              return (
                <article className={`referee-notification-card ${read ? 'is-read' : 'is-unread'}`} key={notification.id}>
                  <div className={`referee-notification-card__icon referee-notification-card__icon--${notification.type || 'update'}`} aria-hidden="true">
                    <span>!</span>
                  </div>
                  <div className="referee-notification-card__content">
                    <div className="referee-notification-card__heading">
                      <h2>{notification.title}</h2>
                      {notification.createdAt ? <time>{notification.createdAt}</time> : null}
                    </div>
                    <p>{notification.message}</p>
                    <div className="referee-notification-card__actions">
                      {!read ? <button type="button" onClick={() => void acknowledge(notification)}>Acknowledge</button> : null}
                      {notification.raceName ? <Link to={racePath(notification.raceName)}>View Details</Link> : null}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="referee-notifications__state">
              {view === 'unread' ? 'There are no unread notifications.' : 'No notification data is available.'}
            </div>
          )}
        </section>
      </section>
    </RefereeShell>
  );
}
