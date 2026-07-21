import React from 'react';
import { getHorseOwnerNotificationsData, markNotificationRead } from '../../services/integration.ts';
import {
  OwnerPortalFooter,
  OwnerPortalHeader,
  OwnerPortalIcon,
  OwnerPortalIconName,
} from '../../components/horseOwner/OwnerPortalChrome.tsx';
import './HorseOwnerNotifications.css';

type NotificationTone = 'tournament' | 'jockey' | 'approved' | 'declined';

type OwnerNotification = {
  id?: string | number;
  title: string;
  body?: string;
  time?: string;
  icon?: OwnerPortalIconName;
  tone?: NotificationTone;
  unread?: boolean;
  createdAt?: string;
};

type OwnerNotificationsData = {
  notifications?: OwnerNotification[];
};

const normalizeNotifications = (data?: OwnerNotificationsData | null): OwnerNotification[] =>
  (data?.notifications || [])
    .filter((item) => item.title)
    .map((item) => ({
      ...item,
      body: item.body || '',
      time: item.time || item.createdAt || '',
      icon: item.icon || 'badge',
      tone: item.tone || 'approved',
    }));

export default function HorseOwnerNotifications() {
  const [view, setView] = React.useState<'all' | 'unread'>('all');
  const [sort, setSort] = React.useState<'newest' | 'oldest'>('newest');
  const [notifications, setNotifications] = React.useState<OwnerNotification[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    const loadNotifications = async () => {
      const apiData = await getHorseOwnerNotificationsData().catch(() => null);
      if (!cancelled) setNotifications(normalizeNotifications(apiData));
    };

    void loadNotifications();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleNotifications = React.useMemo(() => {
    const filtered = view === 'unread' ? notifications.filter((item) => item.unread) : notifications;
    return [...filtered].sort((a, b) => {
      const first = Date.parse(a.createdAt || a.time || '');
      const second = Date.parse(b.createdAt || b.time || '');
      if (!Number.isFinite(first) || !Number.isFinite(second)) return 0;
      return sort === 'newest' ? second - first : first - second;
    });
  }, [notifications, sort, view]);

  const handleMarkRead = async (notification: OwnerNotification) => {
    if (!notification.unread || !notification.id) return;
    await markNotificationRead(Number(notification.id)).catch(() => undefined);
    setNotifications((current) =>
      current.map((item) => (item.id === notification.id ? { ...item, unread: false } : item)),
    );
  };

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
              <select value={sort} onChange={(event) => setSort(event.target.value as 'newest' | 'oldest')}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </label>
          </div>
        </section>

        <section className="owner-notifications-list" aria-label="Notification list">
          {visibleNotifications.length ? (
            visibleNotifications.map((notification) => (
              <article
                className="owner-notification-item"
                key={notification.id || `${notification.title}-${notification.time}`}
                onClick={() => void handleMarkRead(notification)}
              >
                <div className={`owner-notification-icon owner-notification-icon--${notification.tone}`}>
                  <OwnerPortalIcon name={notification.icon || 'badge'} />
                </div>

                <div className="owner-notification-copy">
                  <div>
                    <h2>{notification.title}</h2>
                    {notification.time ? <time>{notification.time}</time> : null}
                  </div>
                  {notification.body ? <p>{notification.body}</p> : null}
                </div>

                <div className="owner-notification-meta">
                  {notification.unread ? <span aria-label="Unread notification" /> : null}
                </div>
              </article>
            ))
          ) : (
            <div className="owner-notifications-empty">Notification data is empty.</div>
          )}
        </section>
      </main>

      <OwnerPortalFooter />
    </div>
  );
}
