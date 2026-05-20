'use client';

import { useEffect, useState } from 'react';
import { getToken, api, BadgeItem, UserProfile } from '../../lib/api';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';

// ── Mock data (charts / leaderboard / devices stay static for now) ─────────────

const weeklyConsumption = [
  { day: 'Lun', verres: 24, bouteilles: 8 },
  { day: 'Mar', verres: 31, bouteilles: 12 },
  { day: 'Mer', verres: 18, bouteilles: 6 },
  { day: 'Jeu', verres: 42, bouteilles: 15 },
  { day: 'Ven', verres: 67, bouteilles: 22 },
  { day: 'Sam', verres: 89, bouteilles: 34 },
  { day: 'Dim', verres: 53, bouteilles: 19 },
];

const monthlyHistory = [
  { week: 'S1', total: 210 },
  { week: 'S2', total: 185 },
  { week: 'S3', total: 324 },
  { week: 'S4', total: 267 },
];

const leaderboard = [
  { rank: 1, name: 'Alex M.', verres: 342, badge: '🏆' },
  { rank: 2, name: 'Julie R.', verres: 289, badge: '🥈' },
  { rank: 3, name: 'Tom B.', verres: 241, badge: '🥉' },
  { rank: 4, name: 'Camille D.', verres: 198, badge: '' },
  { rank: 5, name: 'Vous', verres: 163, badge: '', isMe: true },
];

const devices = [
  { name: 'Tireuse cuisine', type: 'tireuse', verres: 187, status: 'online' },
  { name: 'Tireuse salon', type: 'tireuse', verres: 134, status: 'online' },
  { name: 'Décapsuleur principal', type: 'decapsuleur', bouteilles: 89, status: 'online' },
  { name: 'Décapsuleur terrasse', type: 'decapsuleur', bouteilles: 42, status: 'offline' },
];

const goalData = [{ name: 'Objectif', value: 75, fill: '#8b5cf6' }];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon, trend,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
}) {
  return (
    <div className="rounded-2xl border border-white/8 p-5 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
        <span className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
      {trend && (
        <p className={`text-xs font-medium ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend.up ? '↑' : '↓'} {trend.value} vs semaine dernière
        </p>
      )}
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { background: '#0d0d12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 12 },
  cursor: { stroke: 'rgba(139,92,246,0.2)', strokeWidth: 1 },
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<BadgeItem[]>([]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.auth.me(token).then(setUser).catch(() => null);
      api.profiles.getMe(token).then(setProfile).catch(() => null);
      api.badges.getMe(token).then(setBadges).catch(() => null);
    }
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}{user ? `, ${user.email.split('@')[0]}` : ''} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Voici un aperçu de votre consommation FizzUp</p>
        </div>
        <span className="text-xs text-gray-600 mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Verres total"
          value={profile ? profile.totalVerres.toLocaleString() : '—'}
          sub="Tireuses connectées"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}
        />
        <StatCard
          label="Bouteilles décapsulées"
          value={profile ? profile.totalBouteilles.toLocaleString() : '—'}
          sub="Décapsuleurs connectés"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <StatCard
          label="Soirées"
          value={profile ? profile.totalSoirees.toLocaleString() : '—'}
          sub={profile?.streak ? `🔥 ${profile.streak} jours de streak` : 'Aucun streak actif'}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>}
        />
        <StatCard
          label="Points"
          value={profile ? profile.points.toLocaleString() : '—'}
          sub="Score global"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Weekly area chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Consommation cette semaine</p>
              <p className="text-xs text-gray-500">Verres & bouteilles par jour</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />Verres</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />Bouteilles</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyConsumption} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gVerres" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBouteilles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="verres" stroke="#8b5cf6" strokeWidth={2} fill="url(#gVerres)" dot={false} />
              <Area type="monotone" dataKey="bouteilles" stroke="#6366f1" strokeWidth={2} fill="url(#gBouteilles)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Objectif hebdo radial */}
        <div className="rounded-2xl border border-white/8 p-5 flex flex-col" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-sm font-semibold text-white mb-0.5">Objectif hebdo</p>
          <p className="text-xs text-gray-500 mb-2">324 / 430 verres</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" data={goalData} startAngle={210} endAngle={-30}>
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(255,255,255,0.04)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-3xl font-bold text-white -mt-6">75%</p>
            <p className="text-xs text-gray-500 mt-1">106 verres restants</p>
          </div>
          <div className="mt-4 rounded-xl px-4 py-3 text-xs text-violet-300 border border-violet-500/20 bg-violet-500/8">
            🎯 À ce rythme, vous atteindrez l'objectif samedi !
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Monthly bar chart */}
        <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-sm font-semibold text-white mb-0.5">Historique mensuel</p>
          <p className="text-xs text-gray-500 mb-4">Total verres par semaine</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="total" fill="#8b5cf6" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-sm font-semibold text-white mb-0.5">Classement du groupe</p>
          <p className="text-xs text-gray-500 mb-4">Cette semaine</p>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                  entry.isMe
                    ? 'bg-violet-500/12 border border-violet-500/20'
                    : 'border border-transparent'
                }`}
              >
                <span className="text-base w-6 text-center">{entry.badge || <span className="text-gray-600 text-xs font-mono">#{entry.rank}</span>}</span>
                <span className={`flex-1 text-sm font-medium truncate ${entry.isMe ? 'text-violet-300' : 'text-gray-300'}`}>
                  {entry.name}
                </span>
                <span className="text-xs text-gray-500 font-mono">{entry.verres} 🥤</span>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-sm font-semibold text-white mb-0.5">Appareils connectés</p>
          <p className="text-xs text-gray-500 mb-4">État en temps réel</p>
          <div className="space-y-2.5">
            {devices.map((device) => (
              <div key={device.name} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${device.status === 'online' ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{device.name}</p>
                  <p className="text-xs text-gray-600">
                    {device.type === 'tireuse'
                      ? `${device.verres} verres`
                      : `${device.bouteilles} bouteilles`}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  device.status === 'online'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-gray-700/40 text-gray-500'
                }`}>
                  {device.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Badges */}
      <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-sm font-semibold text-white mb-0.5">Badges & Trophées</p>
        <p className="text-xs text-gray-500 mb-4">Vos récompenses débloquées</p>
        {badges.length === 0 ? (
          <p className="text-gray-600 text-sm py-4">Chargement des badges…</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  badge.unlocked
                    ? 'border-violet-500/25 bg-violet-500/8'
                    : 'border-white/6 opacity-40 grayscale'
                }`}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-white">{badge.label}</p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
