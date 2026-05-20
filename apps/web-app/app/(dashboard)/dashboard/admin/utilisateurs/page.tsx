'use client';

import { useEffect, useState } from 'react';
import { api, getToken, type AdminUser } from '../../../../lib/api';
import { exportCsv } from '../../../../lib/csv';

type Role = 'admin' | 'user' | 'mod';
type Status = 'active' | 'banned' | 'suspended';

type DbUser = AdminUser;

interface UserRow extends DbUser {
  status: Status;
  username: string;
  verified: boolean;
  lastSeen: string;
  devices: number;
  totalDrinks: number;
  friends: number;
}

function deriveUsername(email: string): string {
  return email.split('@')[0];
}

function enrichUser(u: DbUser): UserRow {
  return {
    ...u,
    username: deriveUsername(u.email),
    status: 'active',
    verified: true,
    lastSeen: 'Récemment',
    devices: 0,
    totalDrinks: 0,
    friends: 0,
  };
}

const ROLE_STYLES: Record<Role, string> = {
  admin: 'bg-red-500/15 text-red-400 border border-red-500/25',
  mod: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  user: 'bg-white/6 text-gray-400 border border-white/10',
};
const ROLE_LABELS: Record<Role, string> = { admin: 'Admin', mod: 'Modo', user: 'User' };

const STATUS_STYLES: Record<Status, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  banned: 'bg-red-500/15 text-red-400',
  suspended: 'bg-amber-500/15 text-amber-400',
};
const STATUS_LABELS: Record<Status, string> = { active: 'Actif', banned: 'Banni', suspended: 'Suspendu' };
const STATUS_DOT: Record<Status, string> = { active: 'bg-emerald-400', banned: 'bg-red-400', suspended: 'bg-amber-400' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'ban' | 'unban' | 'delete' | 'role'; user: UserRow } | null>(null);
  const [pendingRole, setPendingRole] = useState<Role>('user');

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.admin
      .getUsers(token)
      .then((data) => {
        setUsers(data.map(enrichUser));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    banned: users.filter((u) => u.status === 'banned').length,
    admins: users.filter((u) => u.role === 'admin').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-4xl">⚠️</div>
        <p className="text-red-400 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
              Administration
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} comptes enregistrés</p>
        </div>
        <button
          onClick={() => exportCsv(filtered, [
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'username', label: 'Pseudo' },
            { key: 'role', label: 'Rôle' },
            { key: 'status', label: 'Statut' },
            { key: 'createdAt', label: 'Inscription' },
            { key: 'updatedAt', label: 'Dernière mise à jour' },
          ], `utilisateurs_${new Date().toISOString().slice(0, 10)}.csv`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 text-sm font-medium hover:bg-amber-500/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total utilisateurs', value: stats.total, icon: '👥', color: 'text-white' },
          { label: 'Actifs', value: stats.active, icon: '✅', color: 'text-emerald-400' },
          { label: 'Bannis', value: stats.banned, icon: '🚫', color: 'text-red-400' },
          { label: 'Admins', value: stats.admins, icon: '🛡️', color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 p-4" style={{ background: 'var(--fz-bg-surface)' }}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={`grid gap-6 transition-all ${selectedUser ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
        {/* Table */}
        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--fz-bg-surface)' }}>
          {/* Filters */}
          <div className="p-4 border-b border-white/8 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher email, username…"
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 border border-white/8 bg-white/4 focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | Role)}
              className="px-3 py-2 rounded-xl text-sm text-gray-300 border border-white/8 bg-white/4 focus:outline-none cursor-pointer"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="mod">Modérateur</option>
              <option value="user">Utilisateur</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | Status)}
              className="px-3 py-2 rounded-xl text-sm text-gray-300 border border-white/8 bg-white/4 focus:outline-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="banned">Banni</option>
              <option value="suspended">Suspendu</option>
            </select>
            <span className="text-xs text-gray-600 ml-auto">
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {['Utilisateur', 'Rôle', 'Statut', 'Inscription', ''].map((h) => (
                    <th key={h} className="text-left text-[10px] uppercase tracking-widest text-gray-600 font-semibold px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser((prev) => (prev?.id === u.id ? null : u))}
                    className={`group cursor-pointer transition-colors ${selectedUser?.id === u.id ? 'bg-amber-500/6' : 'hover:bg-white/3'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-sm font-bold shrink-0">
                          {u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-white">{u.username}</span>
                          <p className="text-xs text-gray-600">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[u.role as Role] ?? ROLE_STYLES.user}`}>
                        {ROLE_LABELS[u.role as Role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${STATUS_STYLES[u.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[u.status]}`} />
                        {STATUS_LABELS[u.status]}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); setPendingRole(u.role as Role); setActionModal({ type: 'role', user: u }); }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title="Changer le rôle"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActionModal({ type: u.status === 'banned' ? 'unban' : 'ban', user: u }); }}
                          className={`p-1.5 rounded-lg transition-colors ${u.status === 'banned' ? 'text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'}`}
                          title={u.status === 'banned' ? 'Débannir' : 'Bannir'}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-600 text-sm">Aucun utilisateur correspondant aux filtres.</div>
            )}
          </div>
        </div>

        {/* User Detail Panel */}
        {selectedUser && (
          <div className="rounded-2xl border border-white/8 overflow-hidden sticky top-8 h-fit" style={{ background: 'var(--fz-bg-surface)' }}>
            <div className="p-4 border-b border-white/8 flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Détails</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-5">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 border-2 border-violet-500/30 flex items-center justify-center text-violet-300 text-2xl font-bold">
                  {selectedUser.username[0].toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white">{selectedUser.username}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[selectedUser.role as Role] ?? ROLE_STYLES.user}`}>
                    {ROLE_LABELS[selectedUser.role as Role] ?? selectedUser.role}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[selectedUser.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[selectedUser.status]}`} />
                    {STATUS_LABELS[selectedUser.status]}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                {[
                  { label: 'ID', value: selectedUser.id },
                  { label: 'Inscription', value: new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) },
                  { label: 'Dernière mise à jour', value: new Date(selectedUser.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between py-1.5 border-b border-white/4 last:border-0 gap-4">
                    <span className="text-xs text-gray-500 shrink-0">{row.label}</span>
                    <span className="text-xs text-gray-300 font-medium font-mono text-right break-all">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => { setPendingRole(selectedUser.role as Role); setActionModal({ type: 'role', user: selectedUser }); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Changer le rôle
                </button>
                <button
                  onClick={() => setActionModal({ type: selectedUser.status === 'banned' ? 'unban' : 'ban', user: selectedUser })}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedUser.status === 'banned'
                      ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15'
                      : 'text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  {selectedUser.status === 'banned' ? "Débannir l'utilisateur" : "Bannir l'utilisateur"}
                </button>
                <button
                  onClick={() => setActionModal({ type: 'delete', user: selectedUser })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-500/8 border border-red-500/15 hover:bg-red-500/12 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 p-6" style={{ background: 'var(--fz-bg-elevated)' }}>
            {actionModal.type === 'role' ? (
              <>
                <h3 className="font-semibold text-white mb-1">Changer le rôle</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Rôle actuel de <span className="text-white font-medium">{actionModal.user.username}</span> :{' '}
                  <span className="text-amber-400">{ROLE_LABELS[actionModal.user.role as Role] ?? actionModal.user.role}</span>
                </p>
                <div className="space-y-2 mb-5">
                  {(['user', 'mod', 'admin'] as Role[]).map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        pendingRole === r ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/8 bg-white/3 hover:bg-white/5'
                      }`}
                    >
                      <input type="radio" name="role" value={r} checked={pendingRole === r} onChange={() => setPendingRole(r)} className="accent-amber-500" />
                      <div>
                        <p className={`text-sm font-medium ${r === 'admin' ? 'text-red-400' : r === 'mod' ? 'text-amber-400' : 'text-gray-300'}`}>
                          {ROLE_LABELS[r]}
                        </p>
                        <p className="text-xs text-gray-600">
                          {r === 'admin' ? 'Accès complet au back office' : r === 'mod' ? 'Peut modérer le contenu' : 'Compte standard'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 rounded-xl text-sm text-gray-400 bg-white/6 border border-white/8 hover:bg-white/8 transition-colors">
                    Annuler
                  </button>
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/15 border border-amber-500/25 hover:bg-amber-500/20 transition-colors">
                    Appliquer
                  </button>
                </div>
              </>
            ) : actionModal.type === 'delete' ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Supprimer le compte</h3>
                <p className="text-sm text-gray-400 mb-5">
                  Cette action est <span className="text-red-400 font-medium">irréversible</span>. Le compte de{' '}
                  <span className="text-white font-medium">{actionModal.user.username}</span> sera définitivement supprimé.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 rounded-xl text-sm text-gray-400 bg-white/6 border border-white/8 hover:bg-white/8 transition-colors">
                    Annuler
                  </button>
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 rounded-xl text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 transition-colors">
                    Supprimer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${actionModal.type === 'ban' ? 'bg-red-500/15' : 'bg-emerald-500/15'}`}>
                  <svg className={`w-5 h-5 ${actionModal.type === 'ban' ? 'text-red-400' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">{actionModal.type === 'ban' ? "Bannir l'utilisateur" : "Débannir l'utilisateur"}</h3>
                <p className="text-sm text-gray-400 mb-5">
                  {actionModal.type === 'ban' ? (
                    <><span className="text-white font-medium">{actionModal.user.username}</span> ne pourra plus se connecter.</>
                  ) : (
                    <>Le compte de <span className="text-white font-medium">{actionModal.user.username}</span> sera réactivé.</>
                  )}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 rounded-xl text-sm text-gray-400 bg-white/6 border border-white/8 hover:bg-white/8 transition-colors">
                    Annuler
                  </button>
                  <button
                    onClick={() => setActionModal(null)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${actionModal.type === 'ban' ? 'text-white bg-red-500/80 hover:bg-red-500' : 'text-white bg-emerald-500/80 hover:bg-emerald-500'}`}
                  >
                    {actionModal.type === 'ban' ? 'Bannir' : 'Débannir'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
