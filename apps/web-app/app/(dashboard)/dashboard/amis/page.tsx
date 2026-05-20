'use client';

import { useState, useEffect } from 'react';
import {
  getToken, api,
  FriendItem, FriendRequest as ApiFriendRequest, SuggestionItem,
  UserProfile, GroupSummary,
} from '../../../lib/api';

// ── Avatar color palette (deterministic from first letter) ─────────────────────

const AVATAR_PALETTES = [
  'bg-violet-500/30 border-violet-500/40 text-violet-200',
  'bg-pink-500/25 border-pink-500/40 text-pink-200',
  'bg-emerald-500/25 border-emerald-500/40 text-emerald-200',
  'bg-amber-500/25 border-amber-500/40 text-amber-200',
  'bg-cyan-500/25 border-cyan-500/40 text-cyan-200',
  'bg-orange-500/25 border-orange-500/40 text-orange-200',
  'bg-rose-500/25 border-rose-500/40 text-rose-200',
  'bg-blue-500/25 border-blue-500/40 text-blue-200',
  'bg-teal-500/25 border-teal-500/40 text-teal-200',
  'bg-purple-500/25 border-purple-500/40 text-purple-200',
];

function avatarColor(str: string): string {
  return AVATAR_PALETTES[(str.charCodeAt(0) || 0) % AVATAR_PALETTES.length];
}

function formatLastSeen(iso: string | null): string | undefined {
  if (!iso) return undefined;
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Il y a moins d\'1h';
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  return `Il y a ${d} jours`;
}

function formatSince(iso: string | null): string {
  if (!iso) return 'Inconnu';
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function formatSentAt(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Il y a moins d\'1h';
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  return `Il y a ${d} jours`;
}

// ── Local types (mapped from API) ─────────────────────────────────────────────

type FriendStatus = 'online' | 'en-soiree' | 'offline';

type Friend = {
  id: string; // friendshipId
  userId: string; // actual user id
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  status: FriendStatus;
  lastSeen?: string;
  mutualGroups: string[];
  mutualFriends: number;
  stats: { verres: number; bouteilles: number; soirees: number; streak: number; points: number };
  badges: string[];
  friendSince: string;
  currentActivity?: string;
};

type FriendRequest = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  mutualFriends: number;
  mutualGroups: string[];
  sentAt: string;
};

type SuggestedUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  mutualFriends: number;
  mutualGroups: string[];
};

// ── Mapping helpers ────────────────────────────────────────────────────────────

function mapFriend(item: FriendItem): Friend {
  const u = item.user;
  const name = u.displayName || u.username || u.email;
  const letter = name.charAt(0).toUpperCase();
  const status = (u.status === 'en-soiree' ? 'en-soiree' : u.status === 'online' ? 'online' : 'offline') as FriendStatus;
  return {
    id: item.friendshipId,
    userId: u.id,
    name,
    username: u.username.startsWith('@') ? u.username : `@${u.username}`,
    avatar: letter,
    avatarColor: avatarColor(letter),
    status,
    lastSeen: formatLastSeen(u.lastSeen ?? null),
    mutualGroups: item.mutualGroups,
    mutualFriends: item.mutualFriends,
    stats: {
      verres: u.totalVerres,
      bouteilles: u.totalBouteilles,
      soirees: u.totalSoirees,
      streak: u.streak,
      points: u.points,
    },
    badges: u.badges,
    friendSince: formatSince(item.since),
    currentActivity: u.currentActivity ?? undefined,
  };
}

function mapRequest(item: ApiFriendRequest): FriendRequest {
  const u = item.user;
  const name = u.displayName || u.username || u.email;
  const letter = name.charAt(0).toUpperCase();
  return {
    id: item.id,
    name,
    username: u.username.startsWith('@') ? u.username : `@${u.username}`,
    avatar: letter,
    avatarColor: avatarColor(letter),
    mutualFriends: item.mutualFriends,
    mutualGroups: item.mutualGroups,
    sentAt: formatSentAt(item.sentAt),
  };
}

function mapSuggestion(item: SuggestionItem): SuggestedUser {
  const u = item.user;
  const name = u.displayName || u.username || u.email;
  const letter = name.charAt(0).toUpperCase();
  return {
    id: item.id,
    name,
    username: u.username.startsWith('@') ? u.username : `@${u.username}`,
    avatar: letter,
    avatarColor: avatarColor(letter),
    mutualFriends: item.mutualFriends,
    mutualGroups: item.mutualGroups,
  };
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<FriendStatus, { label: string; dot: string; text: string }> = {
  online: { label: 'En ligne', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  'en-soiree': { label: 'En soirée 🎉', dot: 'bg-violet-400 animate-pulse', text: 'text-violet-300' },
  offline: { label: 'Hors ligne', dot: 'bg-gray-600', text: 'text-gray-600' },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function Avatar({ letter, color, size = 'md' }: { letter: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-xl' };
  return (
    <div className={`${sizes[size]} rounded-full border flex items-center justify-center font-bold shrink-0 ${color}`}>
      {letter}
    </div>
  );
}

function CompareBar({ myVal, friendVal, label }: { myVal: number; friendVal: number; label: string }) {
  const max = Math.max(myVal, friendVal, 1);
  const myPct = Math.round((myVal / max) * 100);
  const friendPct = Math.round((friendVal / max) * 100);
  const diff = friendVal - myVal;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-gray-500">{label}</span>
        <span className={`text-[10px] font-semibold ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
          {diff > 0 ? `+${diff.toLocaleString()} pour eux` : diff < 0 ? `+${Math.abs(diff).toLocaleString()} pour toi` : 'Égalité'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-violet-400 w-10 text-right font-semibold">{myVal.toLocaleString()}</span>
        <div className="flex-1 flex gap-0.5 items-center">
          <div className="flex-1 flex justify-end">
            <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${myPct}%` }} />
          </div>
          <div className="w-px h-3 bg-white/15 shrink-0" />
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-white/30" style={{ width: `${friendPct}%` }} />
          </div>
        </div>
        <span className="text-[10px] text-gray-400 w-10 font-semibold">{friendVal.toLocaleString()}</span>
      </div>
    </div>
  );
}

function FriendCard({ friend, onSelect, selected }: { friend: Friend; onSelect: () => void; selected: boolean }) {
  const sc = STATUS_CONFIG[friend.status];
  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border p-4 flex flex-col gap-3 cursor-pointer transition-all ${
        selected
          ? 'border-violet-500/50'
          : friend.status === 'en-soiree'
          ? 'border-violet-500/20 hover:border-violet-500/35'
          : 'border-white/8 hover:border-white/16'
      }`}
      style={{ background: selected ? 'rgba(139,92,246,0.07)' : friend.status === 'en-soiree' ? 'rgba(139,92,246,0.04)' : 'rgba(255,255,255,0.025)' }}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar letter={friend.avatar} color={friend.avatarColor} size="md" />
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#050508] ${sc.dot}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white truncate">{friend.name}</span>
            {friend.badges.map((b, i) => <span key={i} className="text-xs">{b}</span>)}
          </div>
          <p className="text-xs text-gray-600">{friend.username}</p>
          <p className={`text-[10px] font-medium ${sc.text} mt-0.5`}>{sc.label}</p>
        </div>
      </div>

      {friend.currentActivity && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
          <span className="text-[11px] text-violet-300 font-medium">{friend.currentActivity}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
        <div className="text-center">
          <p className="text-sm font-black text-white">{friend.stats.verres.toLocaleString()}</p>
          <p className="text-[10px] text-gray-600">verres</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-white">{friend.stats.soirees}</p>
          <p className="text-[10px] text-gray-600">soirées</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-violet-300">{friend.stats.points.toLocaleString()}</p>
          <p className="text-[10px] text-gray-600">pts</p>
        </div>
      </div>

      {friend.mutualGroups.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {friend.mutualGroups.map((g) => (
            <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-white/6 border border-white/8 text-gray-400">{g}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function FriendDetail({ friend, myProfile, onRemove, onInvite }: { friend: Friend; myProfile: UserProfile | null; onRemove: () => void; onInvite: () => void }) {
  const sc = STATUS_CONFIG[friend.status];
  return (
    <div className="space-y-4 sticky top-8">
      <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex flex-col items-center text-center gap-3 mb-5">
          <div className="relative">
            <Avatar letter={friend.avatar} color={friend.avatarColor} size="lg" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#050508] ${sc.dot}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{friend.name}</h2>
            <p className="text-sm text-gray-500">{friend.username}</p>
            <p className={`text-xs font-medium ${sc.text} mt-1`}>{sc.label}</p>
            {friend.lastSeen && <p className="text-[10px] text-gray-700 mt-0.5">{friend.lastSeen}</p>}
          </div>
          {friend.badges.length > 0 && (
            <div className="flex gap-1.5">
              {friend.badges.map((b, i) => (
                <span key={i} className="text-xl">{b}</span>
              ))}
            </div>
          )}
        </div>

        {friend.currentActivity && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shrink-0" />
            <span className="text-xs text-violet-300 font-medium">{friend.currentActivity}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500">Amis depuis</p>
            <p className="text-sm font-semibold text-white mt-0.5">{friend.friendSince}</p>
          </div>
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500">Amis en commun</p>
            <p className="text-sm font-semibold text-white mt-0.5">{friend.mutualFriends}</p>
          </div>
        </div>
      </div>

      {myProfile && (
        <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Comparaison all time</p>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-full bg-violet-500" /> Toi</span>
              <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-full bg-white/30" /> {friend.name.split(' ')[0]}</span>
            </div>
          </div>
          <div className="space-y-4">
            <CompareBar myVal={myProfile.totalVerres} friendVal={friend.stats.verres} label="Verres" />
            <CompareBar myVal={myProfile.totalBouteilles} friendVal={friend.stats.bouteilles} label="Bouteilles" />
            <CompareBar myVal={myProfile.totalSoirees} friendVal={friend.stats.soirees} label="Soirées" />
            <CompareBar myVal={myProfile.points} friendVal={friend.stats.points} label="Points" />
          </div>
        </div>
      )}

      {friend.mutualGroups.length > 0 && (
        <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">Groupes en commun</p>
          <div className="space-y-2">
            {friend.mutualGroups.map((g) => (
              <div key={g} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 border border-white/6">
                <span className="text-lg">👥</span>
                <span className="text-sm text-gray-200">{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="space-y-2">
          <button
            onClick={onInvite}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-violet-300 text-sm font-medium hover:bg-violet-500/8 hover:text-violet-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Inviter dans un groupe
          </button>
          <button
            onClick={onRemove}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-red-500/70 text-sm font-medium hover:bg-red-500/8 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
            Retirer de mes amis
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AmisPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [addedSuggestions, setAddedSuggestions] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'amis' | 'demandes' | 'suggestions'>('amis');
  const [inviteTarget, setInviteTarget] = useState<Friend | null>(null);
  const [myGroups, setMyGroups] = useState<GroupSummary[]>([]);
  const [invitingGroupId, setInvitingGroupId] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      api.friends.getAll(token).then((data) => setFriends(data.map(mapFriend))).catch(() => null),
      api.friends.getRequests(token).then((data) => setRequests(data.map(mapRequest))).catch(() => null),
      api.friends.getSuggestions(token).then((data) => setSuggestions(data.map(mapSuggestion))).catch(() => null),
      api.profiles.getMe(token).then(setMyProfile).catch(() => null),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!inviteTarget) return;
    const token = getToken();
    if (!token) return;
    api.groups.getAll(token).then(setMyGroups).catch(() => null);
  }, [inviteTarget]);

  const selectedFriend = friends.find((f) => f.id === selectedId) ?? null;

  function toggleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  const online = friends.filter((f) => f.status === 'online' || f.status === 'en-soiree');
  const offline = friends.filter((f) => f.status === 'offline');

  const filteredFriends = search.trim()
    ? friends.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.username.toLowerCase().includes(search.toLowerCase())
      )
    : friends;

  async function acceptRequest(id: string) {
    const token = getToken();
    if (!token) return;
    try {
      await api.friends.acceptRequest(token, id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      // Refresh friends list
      const data = await api.friends.getAll(token);
      setFriends(data.map(mapFriend));
    } catch {
      /* ignore */
    }
  }

  function declineRequest(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  async function addSuggestion(userId: string) {
    const token = getToken();
    if (!token) return;
    try {
      await api.friends.sendRequest(token, userId);
      setAddedSuggestions((prev) => new Set([...prev, userId]));
    } catch {
      /* ignore */
    }
  }

  async function removeFriend(friendshipId: string) {
    const token = getToken();
    if (!token) return;
    try {
      await api.friends.remove(token, friendshipId);
      setFriends((prev) => prev.filter((f) => f.id !== friendshipId));
      setSelectedId(null);
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-600 text-sm">
        Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ami(e)s</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {friends.length} ami(e)s · {online.length} en ligne
          </p>
        </div>
        <button
          onClick={() => setTab('suggestions')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 transition-colors text-white text-sm font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Ajouter un ami
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Amis total', value: friends.length, color: 'text-white', bg: 'bg-white/4 border-white/8' },
          { label: 'En soirée', value: friends.filter(f => f.status === 'en-soiree').length, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
          { label: 'En ligne', value: online.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Demandes', value: requests.length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8 w-fit" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {([
          { key: 'amis', label: 'Mes amis', count: friends.length },
          { key: 'demandes', label: 'Demandes', count: requests.length },
          { key: 'suggestions', label: 'Suggestions', count: suggestions.length },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ml-1.5 text-xs ${tab === t.key ? 'opacity-70' : 'opacity-50'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ---- TAB: Amis ---- */}
      {tab === 'amis' && (
        <div className={`grid gap-6 ${selectedFriend ? 'grid-cols-1 xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
          <div className="space-y-5">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un ami…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 transition-colors"
              />
            </div>

            {friends.length === 0 && !search && (
              <div className="py-16 text-center text-gray-600">
                <p className="text-4xl mb-3">👥</p>
                <p className="text-sm">Vous n'avez encore aucun ami. Consultez les suggestions !</p>
              </div>
            )}

            {/* En ligne / en soirée */}
            {!search && online.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">
                  ● En ligne · {online.length}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {online.map((f) => (
                    <FriendCard key={f.id} friend={f} selected={selectedId === f.id} onSelect={() => toggleSelect(f.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Hors ligne */}
            {!search && offline.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">
                  Hors ligne · {offline.length}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {offline.map((f) => (
                    <FriendCard key={f.id} friend={f} selected={selectedId === f.id} onSelect={() => toggleSelect(f.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Résultats de recherche */}
            {search && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredFriends.length > 0
                  ? filteredFriends.map((f) => (
                      <FriendCard key={f.id} friend={f} selected={selectedId === f.id} onSelect={() => toggleSelect(f.id)} />
                    ))
                  : <p className="text-gray-600 text-sm col-span-2 py-8 text-center">Aucun ami trouvé pour « {search} »</p>
                }
              </div>
            )}
          </div>

          {selectedFriend && (
            <FriendDetail
              friend={selectedFriend}
              myProfile={myProfile}
              onRemove={() => removeFriend(selectedFriend.id)}
              onInvite={() => setInviteTarget(selectedFriend)}
            />
          )}
        </div>
      )}

      {/* ---- TAB: Demandes ---- */}
      {tab === 'demandes' && (
        <div className="max-w-xl space-y-3">
          {requests.length === 0 && (
            <div className="py-16 text-center text-gray-600">
              <p className="text-4xl mb-3">🤝</p>
              <p className="text-sm">Aucune demande en attente</p>
            </div>
          )}
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-white/8 p-4 flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <Avatar letter={req.avatar} color={req.avatarColor} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{req.name}</span>
                  <span className="text-xs text-gray-600">{req.username}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-gray-600">{req.mutualFriends} ami(s) en commun</span>
                  {req.mutualGroups.length > 0 && (
                    <span className="text-[10px] text-gray-600">· {req.mutualGroups[0]}</span>
                  )}
                  {req.sentAt && <span className="text-[10px] text-gray-700">{req.sentAt}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => acceptRequest(req.id)}
                  className="px-3 py-1.5 rounded-lg bg-violet-500 text-white text-xs font-semibold hover:bg-violet-600 transition-colors"
                >
                  Accepter
                </button>
                <button
                  onClick={() => declineRequest(req.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-gray-400 text-xs font-medium hover:bg-white/10 transition-colors"
                >
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- TAB: Suggestions ---- */}
      {tab === 'suggestions' && (
        <div className="max-w-xl space-y-3">
          <p className="text-xs text-gray-600">Personnes que vous pourriez connaître, basé sur vos groupes et amis communs.</p>
          {suggestions.length === 0 && (
            <div className="py-16 text-center text-gray-600">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">Aucune suggestion pour l'instant</p>
            </div>
          )}
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-white/8 p-4 flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <Avatar letter={s.avatar} color={s.avatarColor} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{s.name}</span>
                  <span className="text-xs text-gray-600">{s.username}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-gray-600">{s.mutualFriends} ami(s) en commun</span>
                  {s.mutualGroups.length > 0 && (
                    <span className="text-[10px] text-gray-600">· {s.mutualGroups[0]}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => addSuggestion(s.id)}
                disabled={addedSuggestions.has(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  addedSuggestions.has(s.id)
                    ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 cursor-default'
                    : 'bg-violet-500/15 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25'
                }`}
              >
                {addedSuggestions.has(s.id) ? (
                  <>✓ Demande envoyée</>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---- Invite to group modal ---- */}
      {inviteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm rounded-2xl border border-white/12 p-6 space-y-4" style={{ background: 'rgba(10,10,15,0.98)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Inviter {inviteTarget.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Choisissez un groupe</p>
              </div>
              <button onClick={() => { setInviteTarget(null); setInvitingGroupId(null); }} className="text-gray-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myGroups.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Aucun groupe</p>}
              {myGroups.map((g) => {
                const key = `${g.id}-${inviteTarget.userId}`;
                const sent = inviteSuccess.has(key);
                return (
                  <button
                    key={g.id}
                    onClick={async () => {
                      if (sent) return;
                      const token = getToken();
                      if (!token) return;
                      setInvitingGroupId(g.id);
                      try {
                        await api.groups.invite(token, g.id, inviteTarget.userId);
                        setInviteSuccess((prev) => new Set([...prev, key]));
                      } catch {
                        /* ignore */
                      } finally {
                        setInvitingGroupId(null);
                      }
                    }}
                    disabled={!!invitingGroupId || sent}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      sent
                        ? 'border-emerald-500/25 bg-emerald-500/8 text-emerald-400 cursor-default'
                        : 'border-white/8 hover:border-violet-500/30 hover:bg-violet-500/8 text-white'
                    }`}
                  >
                    <span className="text-xl">{g.emoji}</span>
                    <span className="flex-1 text-sm font-medium truncate">{g.name}</span>
                    {sent ? (
                      <span className="text-xs text-emerald-400">✓ Invité</span>
                    ) : invitingGroupId === g.id ? (
                      <span className="text-xs text-gray-500">…</span>
                    ) : (
                      <span className="text-xs text-gray-500">{g.memberCount} membres</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { setInviteTarget(null); setInvitingGroupId(null); }}
              className="w-full px-4 py-2.5 rounded-xl border border-white/8 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
