import { environment } from '../environments/environment';

const API_URL = environment.apiUrl;

export interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; role: string };
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  actor?: string;
  target?: string;
  ip?: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  displayName?: string;
  totalVerres: number;
  totalBouteilles: number;
  totalSoirees: number;
  streak: number;
  points: number;
  status: string;
  currentActivity?: string;
}

export interface BadgeItem {
  id: string;
  emoji: string;
  label: string;
  description: string;
  category: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface GroupSummary {
  id: string;
  name: string;
  emoji: string;
  description: string;
  memberCount: number;
  hasActiveParty: boolean;
  partyCount: number;
  isOwner: boolean;
}

export interface PartyMemberItem {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  isMe: boolean;
  verres: number;
  bouteilles: number;
}

export interface PartyItem {
  id: string;
  name: string;
  status: 'active' | 'finished';
  startedAt: string | null;
  endedAt: string | null;
  duration: string | null;
  members: PartyMemberItem[];
}

export interface GroupDetail {
  id: string;
  name: string;
  emoji: string;
  description: string;
  memberCount: number;
  parties: PartyItem[];
}

export interface FriendUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  status: string;
  currentActivity?: string | null;
  lastSeen?: string | null;
  totalVerres: number;
  totalBouteilles: number;
  totalSoirees: number;
  streak: number;
  points: number;
  badges: string[];
}

export interface FriendItem {
  friendshipId: string;
  since: string | null;
  mutualGroups: string[];
  mutualFriends: number;
  user: FriendUser;
}

export interface FriendRequest {
  id: string;
  sentAt: string | null;
  mutualFriends: number;
  mutualGroups: string[];
  user: FriendUser;
}

export interface SuggestionItem {
  id: string;
  mutualGroups: string[];
  mutualFriends: number;
  user: FriendUser;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  description: string;
  data: {
    groupId?: string;
    groupName?: string;
    groupEmoji?: string;
    inviterId?: string;
    inviterName?: string;
    partyId?: string;
    partyName?: string;
  } | null;
  isRead: boolean;
  createdAt: string | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(error.message || 'Une erreur est survenue');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export const api = {
  admin: {
    getUsers: (token: string) =>
      request<AdminUser[]>('/users', { headers: authHeaders(token) }),
    getLogs: (token: string) =>
      request<AdminLog[]>('/logs', { headers: authHeaders(token) }),
  },
  auth: {
    login: (email: string, password: string) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (email: string, password: string) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: (token: string) =>
      request<AuthResponse['user']>('/auth/me', { headers: authHeaders(token) }),
    logout: (token: string) =>
      fetch(`${API_URL}/auth/logout`, { method: 'POST', headers: authHeaders(token) }).catch(() => null),
  },
  profiles: {
    getMe: (token: string) =>
      request<UserProfile>('/profiles/me', { headers: authHeaders(token) }),
    updateMe: (token: string, data: Partial<UserProfile>) =>
      request<UserProfile>('/profiles/me', { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(data) }),
  },
  badges: {
    getMe: (token: string) =>
      request<BadgeItem[]>('/badges/me', { headers: authHeaders(token) }),
  },
  groups: {
    getAll: (token: string) =>
      request<GroupSummary[]>('/groups', { headers: authHeaders(token) }),
    getOne: (token: string, id: string) =>
      request<GroupDetail>(`/groups/${id}`, { headers: authHeaders(token) }),
    create: (token: string, data: { name: string; emoji?: string; description?: string }) =>
      request<{ id: string; name: string; emoji: string }>('/groups', {
        method: 'POST', headers: authHeaders(token), body: JSON.stringify(data),
      }),
    createParty: (token: string, groupId: string, name: string) =>
      request<{ id: string; name: string; status: string }>(`/groups/${groupId}/parties`, {
        method: 'POST', headers: authHeaders(token), body: JSON.stringify({ name }),
      }),
    finishParty: (token: string, groupId: string, partyId: string) =>
      request<{ id: string; status: string }>(`/groups/${groupId}/parties/${partyId}/finish`, {
        method: 'PUT', headers: authHeaders(token),
      }),
    invite: (token: string, groupId: string, userId: string) =>
      request<void>(`/groups/${groupId}/invite`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ userId }) }),
    joinGroup: (token: string, groupId: string) =>
      request<void>(`/groups/${groupId}/join`, { method: 'POST', headers: authHeaders(token) }),
  },
  notifications: {
    getAll: (token: string) =>
      request<NotificationItem[]>('/notifications', { headers: authHeaders(token) }),
    getUnreadCount: (token: string) =>
      request<{ count: number }>('/notifications/unread-count', { headers: authHeaders(token) }),
    markRead: (token: string, id: string) =>
      request<void>(`/notifications/${id}/read`, { method: 'POST', headers: authHeaders(token) }),
    markAllRead: (token: string) =>
      request<void>('/notifications/read-all', { method: 'POST', headers: authHeaders(token) }),
    acceptGroupInvite: (token: string, id: string) =>
      request<{ groupId: string }>(`/notifications/${id}/accept-group-invite`, { method: 'POST', headers: authHeaders(token) }),
    declineGroupInvite: (token: string, id: string) =>
      request<void>(`/notifications/${id}/decline-group-invite`, { method: 'POST', headers: authHeaders(token) }),
  },
  friends: {
    getAll: (token: string) =>
      request<FriendItem[]>('/friends', { headers: authHeaders(token) }),
    getRequests: (token: string) =>
      request<FriendRequest[]>('/friends/requests', { headers: authHeaders(token) }),
    getSuggestions: (token: string) =>
      request<SuggestionItem[]>('/friends/suggestions', { headers: authHeaders(token) }),
    sendRequest: (token: string, addresseeId: string) =>
      request<{ id: string }>('/friends/request', {
        method: 'POST', headers: authHeaders(token), body: JSON.stringify({ addresseeId }),
      }),
    acceptRequest: (token: string, id: string) =>
      request<{ id: string; status: string }>(`/friends/${id}/accept`, {
        method: 'POST', headers: authHeaders(token),
      }),
    remove: (token: string, id: string) =>
      request<void>(`/friends/${id}`, { method: 'DELETE', headers: authHeaders(token) }),
  },
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setToken(token: string): void {
  localStorage.setItem('access_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('access_token');
}
