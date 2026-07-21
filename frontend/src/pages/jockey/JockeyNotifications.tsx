import React from 'react';
import { Link } from 'react-router-dom';
import JockeyHeader from '../../components/jockey/JockeyHeader.tsx';
import { Footer } from '../../components/common/Footer.tsx';
import './JockeyNotifications.css';

export type JockeyNotification = {
  id: string | number;
  title: string;
  message: string;
  createdAt?: string;
  read?: boolean;
  type?: 'invitation' | 'update' | 'alert';
  targetUrl?: string;
};

type Props = {
  notifications?: JockeyNotification[];
  loading?: boolean;
  error?: string;
  onAcknowledge?: (notification: JockeyNotification) => void | Promise<void>;
  onMarkAllRead?: (notifications: JockeyNotification[]) => void | Promise<void>;
};

export default function JockeyNotifications({
  notifications = [],
  loading = false,
  error,
  onAcknowledge,
  onMarkAllRead,
}: Props) {
  const [view, setView] = React.useState<'all' | 'unread'>('all');
  const [readIds, setReadIds] = React.useState<Set<string | number>>(new Set());

  const isRead = (notification: JockeyNotification) => Boolean(notification.read || readIds.has(notification.id));
  const visibleNotifications = notifications.filter((notification) => view === 'all' || !isRead(notification));
  const unreadCount = notifications.filter((notification) => !isRead(notification)).length;

  const acknowledge = async (notification: JockeyNotification) => {
    setReadIds((current) => new Set(current).add(notification.id));
    await onAcknowledge?.(notification);
  };

  const markAllRead = async () => {
    setReadIds(new Set(notifications.map((notification) => notification.id)));
    await onMarkAllRead?.(notifications);
  };

  return (
    <div className="jockey-notifications">
      <JockeyHeader />
      <main className="jockey-notifications__main" aria-busy={loading}>
        <section className="jockey-notifications__intro">
          <div>
            <h1>Notifications</h1>
            <p>Track invitation alerts and important updates from horse owners.</p>
          </div>
          <div className="jockey-notifications__controls">
            <div className="jockey-notifications__filter" role="group" aria-label="Notification filter">
              <button className={view === 'all' ? 'is-active' : ''} type="button" onClick={() => setView('all')}>All</button>
              <button className={view === 'unread' ? 'is-active' : ''} type="button" onClick={() => setView('unread')}>Unread ({unreadCount})</button>
            </div>
            <button type="button" className="jockey-notifications__mark" onClick={markAllRead} disabled={!unreadCount}>
              Mark All Read
            </button>
          </div>
        </section>

        <section className="jockey-notifications__list" aria-label="Notification list">
          {loading ? (
            <div className="jockey-notifications__state" role="status">Loading notifications...</div>
          ) : error ? (
            <div className="jockey-notifications__state jockey-notifications__state--error" role="alert">{error}</div>
          ) : visibleNotifications.length ? (
            visibleNotifications.map((notification) => {
              const read = isRead(notification);
              return (
                <article className={`jockey-notification-card ${read ? 'is-read' : 'is-unread'}`} key={notification.id}>
                  <div className={`jockey-notification-card__icon jockey-notification-card__icon--${notification.type || 'update'}`} aria-hidden="true">
                    <span>!</span>
                  </div>
                  <div className="jockey-notification-card__content">
                    <div className="jockey-notification-card__heading">
                      <h2>{notification.title}</h2>
                      {notification.createdAt ? <time>{notification.createdAt}</time> : null}
                    </div>
                    <p>{notification.message}</p>
                    <div className="jockey-notification-card__actions">
                      {!read ? <button type="button" onClick={() => void acknowledge(notification)}>Acknowledge</button> : null}
                      {notification.targetUrl ? <Link to={notification.targetUrl}>View Invitation</Link> : null}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="jockey-notifications__state">
              {view === 'unread' ? 'There are no unread notifications.' : 'No notifications available yet.'}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
