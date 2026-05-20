'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, api, NotificationItem } from '../../../lib/api';

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  return `Il y a ${d} jours`;
}

const TYPE_ICON: Record<string, string> = {
  group_invite: '👥',
  party_started: '🎉',
  friend_request: '🤝',
  system_info: 'ℹ️',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await api.notifications.getAll(token);
      setNotifications(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function markAllRead() {
    const token = getToken();
    if (!token) return;
    await api.notifications.markAllRead(token).catch(() => null);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function handleAcceptGroupInvite(notif: NotificationItem) {
    const token = getToken();
    if (!token) return;
    setProcessing((prev) => new Set([...prev, notif.id]));
    try {
      const result = await api.notifications.acceptGroupInvite(token, notif.id);
      // Join the group
      await api.groups.joinGroup(token, result.groupId);
      setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n));
      router.push('/dashboard/groupes');
    } catch {
      /* ignore */
    } finally {
      setProcessing((prev) => { const s = new Set(prev); s.delete(notif.id); return s; });
    }
  }

  async function handleDeclineGroupInvite(notif: NotificationItem) {
    const token = getToken();
    if (!token) return;
    setProcessing((prev) => new Set([...prev, notif.id]));
    try {
      await api.notifications.declineGroupInvite(token, notif.id);
      setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n));
    } catch {
      /* ignore */
    } finally {
      setProcessing((prev) => { const s = new Set(prev); s.delete(notif.id); return s; });
    }
  }

  async function handleMarkRead(notif: NotificationItem) {
    if (notif.isRead) return;
    const token = getToken();
    if (!token) return;
    await api.notifications.markRead(token, notif.id).catch(() => null);
    setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/25 hover:border-violet-500/40 transition-colors"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-gray-600 text-sm">Chargement…</div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-gray-500 text-sm">Aucune notification pour l'instant</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif)}
              className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                notif.isRead
                  ? 'border-white/6 opacity-60'
                  : 'border-violet-500/20 bg-violet-500/5'
              }`}
              style={{ background: notif.isRead ? 'rgba(255,255,255,0.02)' : undefined }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-xl shrink-0">
                  {TYPE_ICON[notif.type] ?? '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                      )}
                      <span className="text-[10px] text-gray-600 whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>

                  {/* Group invite actions */}
                  {notif.type === 'group_invite' && !notif.isRead && (
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAcceptGroupInvite(notif); }}
                        disabled={processing.has(notif.id)}
                        className="px-4 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                      >
                        {processing.has(notif.id) ? '…' : 'Rejoindre'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeclineGroupInvite(notif); }}
                        disabled={processing.has(notif.id)}
                        className="px-4 py-1.5 rounded-lg bg-white/6 border border-white/8 hover:bg-white/10 disabled:opacity-50 text-gray-400 text-xs font-medium transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  )}

                  {/* Party started — go to groups */}
                  {notif.type === 'party_started' && !notif.isRead && notif.data?.groupId && (
                    <div className="mt-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(notif); router.push('/dashboard/groupes'); }}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                      >
                        Voir la soirée →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
