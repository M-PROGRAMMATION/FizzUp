'use client';

import { useState } from 'react';

type Period = '7j' | '30j' | '90j' | '1an';

const PERIOD_LABELS: Record<Period, string> = { '7j': '7 derniers jours', '30j': '30 derniers jours', '90j': '90 derniers jours', '1an': 'Cette année' };

const METRICS: Record<Period, {
  users: number; usersGrowth: number;
  devices: number; devicesGrowth: number;
  drinks: number; drinksGrowth: number;
  sessions: number; sessionsGrowth: number;
  activeUsers: number; retention: number;
  avgDrinksPerSession: number; avgSessionDuration: string;
}> = {
  '7j': { users: 12, usersGrowth: 18, devices: 4, devicesGrowth: 33, drinks: 2341, drinksGrowth: 12, sessions: 89, sessionsGrowth: 7, activeUsers: 67, retention: 74, avgDrinksPerSession: 26.3, avgSessionDuration: '2h14' },
  '30j': { users: 47, usersGrowth: 22, devices: 11, devicesGrowth: 15, drinks: 9812, drinksGrowth: 19, sessions: 341, sessionsGrowth: 14, activeUsers: 89, retention: 68, avgDrinksPerSession: 28.8, avgSessionDuration: '2h31' },
  '90j': { users: 112, usersGrowth: 31, devices: 28, devicesGrowth: 40, drinks: 28445, drinksGrowth: 27, sessions: 934, sessionsGrowth: 22, activeUsers: 78, retention: 61, avgDrinksPerSession: 30.5, avgSessionDuration: '2h18' },
  '1an': { users: 398, usersGrowth: 156, devices: 67, devicesGrowth: 89, drinks: 94231, drinksGrowth: 112, sessions: 3421, sessionsGrowth: 98, activeUsers: 71, retention: 58, avgDrinksPerSession: 27.5, avgSessionDuration: '2h07' },
};

const TOP_USERS = [
  { rank: 1, username: 'ThomasM', drinks: 847, sessions: 34, badge: '🥇' },
  { rank: 2, username: 'SophieB', drinks: 612, sessions: 28, badge: '🥈' },
  { rank: 3, username: 'JulieM', drinks: 445, sessions: 21, badge: '🥉' },
  { rank: 4, username: 'CamilleR', drinks: 521, sessions: 19, badge: '' },
  { rank: 5, username: 'EmmaB', drinks: 334, sessions: 17, badge: '' },
];

const TOP_DEVICES = [
  { name: 'FizzTap Pro #1', owner: 'ThomasM', drinks: 1248, uptime: 98 },
  { name: 'FizzCap Elite', owner: 'SophieB', drinks: 891, uptime: 94 },
  { name: 'FizzCap Elite v2', owner: 'EmmaB', drinks: 334, uptime: 91 },
  { name: 'FizzGlass NFC x4', owner: 'AlexD', drinks: 445, uptime: 87 },
  { name: 'FizzTap Standard', owner: 'ThomasM', drinks: 312, uptime: 82 },
];

const DEVICE_TYPES = [
  { type: 'Tireuses', count: 3, pct: 37, color: 'bg-violet-500' },
  { type: 'Décapsuleurs', count: 3, pct: 37, color: 'bg-blue-500' },
  { type: 'Verres NFC', count: 2, pct: 26, color: 'bg-cyan-500' },
];

const WEEKLY_DRINKS = [
  { day: 'Lun', drinks: 284 },
  { day: 'Mar', drinks: 198 },
  { day: 'Mer', drinks: 312 },
  { day: 'Jeu', drinks: 267 },
  { day: 'Ven', drinks: 521 },
  { day: 'Sam', drinks: 847 },
  { day: 'Dim', drinks: 634 },
];

const HOURLY = [
  { h: '18h', v: 12 }, { h: '19h', v: 28 }, { h: '20h', v: 45 }, { h: '21h', v: 78 },
  { h: '22h', v: 95 }, { h: '23h', v: 87 }, { h: '0h', v: 64 }, { h: '1h', v: 38 },
];

export default function AdminStatsPage() {
  const [period, setPeriod] = useState<Period>('30j');
  const m = METRICS[period];
  const maxDrinks = Math.max(...WEEKLY_DRINKS.map(d => d.drinks));
  const maxHourly = Math.max(...HOURLY.map(d => d.v));

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Statistiques globales</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de l&apos;activité de la plateforme</p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
          {(['7j', '30j', '90j', '1an'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-amber-500/20 text-amber-300 border border-amber-500/25' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Nouveaux utilisateurs', value: `+${m.users}`, sub: `+${m.usersGrowth}% vs période préc.`, icon: '👥', color: 'text-violet-400', positive: true },
          { label: 'Nouveaux appareils', value: `+${m.devices}`, sub: `+${m.devicesGrowth}% vs période préc.`, icon: '📡', color: 'text-blue-400', positive: true },
          { label: 'Verres servis', value: m.drinks.toLocaleString(), sub: `+${m.drinksGrowth}% vs période préc.`, icon: '🍺', color: 'text-amber-400', positive: true },
          { label: 'Soirées organisées', value: m.sessions.toLocaleString(), sub: `+${m.sessionsGrowth}% vs période préc.`, icon: '🎉', color: 'text-emerald-400', positive: true },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl border border-white/8 p-4" style={{ background: 'var(--fz-bg-surface)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="text-xl">{kpi.icon}</div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">↑ {kpi.positive ? '+' : ''}{kpi.sub.split('%')[0].replace('+', '')}%</span>
            </div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Utilisateurs actifs', value: `${m.activeUsers}%`, icon: '⚡', color: 'text-amber-400' },
          { label: 'Taux de rétention', value: `${m.retention}%`, icon: '🔄', color: 'text-violet-400' },
          { label: 'Moy. verres/soirée', value: m.avgDrinksPerSession, icon: '📊', color: 'text-blue-400' },
          { label: 'Durée moy. soirée', value: m.avgSessionDuration, icon: '⏱️', color: 'text-emerald-400' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl border border-white/8 p-4" style={{ background: 'var(--fz-bg-surface)' }}>
            <div className="text-xl mb-3">{kpi.icon}</div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Weekly bar chart */}
        <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'var(--fz-bg-surface)' }}>
          <h3 className="font-semibold text-white text-sm mb-4">Verres servis par jour (7 derniers jours)</h3>
          <div className="flex items-end gap-2 h-32">
            {WEEKLY_DRINKS.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-gray-600">{d.drinks}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 transition-all"
                  style={{ height: `${(d.drinks / maxDrinks) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly activity */}
        <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'var(--fz-bg-surface)' }}>
          <h3 className="font-semibold text-white text-sm mb-4">Activité par heure (soirée type)</h3>
          <div className="flex items-end gap-2 h-32">
            {HOURLY.map(d => (
              <div key={d.h} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-gray-600">{d.v}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 transition-all"
                  style={{ height: `${(d.v / maxHourly) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-gray-500">{d.h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Top users */}
        <div className="col-span-1 rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--fz-bg-surface)' }}>
          <div className="p-4 border-b border-white/8">
            <h3 className="font-semibold text-white text-sm">Top utilisateurs</h3>
          </div>
          <div className="divide-y divide-white/4">
            {TOP_USERS.map(u => (
              <div key={u.rank} className="flex items-center gap-3 px-4 py-3">
                <span className="text-base w-6 text-center">{u.badge || <span className="text-xs text-gray-600 font-bold">#{u.rank}</span>}</span>
                <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                  {u.username[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{u.username}</p>
                  <p className="text-xs text-gray-600">{u.sessions} soirées</p>
                </div>
                <span className="text-sm font-bold text-amber-400">{u.drinks}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top devices */}
        <div className="col-span-1 rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--fz-bg-surface)' }}>
          <div className="p-4 border-b border-white/8">
            <h3 className="font-semibold text-white text-sm">Top appareils</h3>
          </div>
          <div className="divide-y divide-white/4">
            {TOP_DEVICES.map((d, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs text-gray-600 font-bold w-6 text-center">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{d.name}</p>
                  <p className="text-xs text-gray-600">{d.owner} · {d.uptime}% uptime</p>
                </div>
                <span className="text-sm font-bold text-violet-400">{d.drinks}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device repartition */}
        <div className="col-span-1 rounded-2xl border border-white/8 p-5" style={{ background: 'var(--fz-bg-surface)' }}>
          <h3 className="font-semibold text-white text-sm mb-4">Répartition des appareils</h3>
          <div className="space-y-3">
            {DEVICE_TYPES.map(d => (
              <div key={d.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">{d.type}</span>
                  <span className="text-xs font-bold text-white">{d.count} <span className="text-gray-600 font-normal">({d.pct}%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-white/6 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color} transition-all`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/8 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Uptime moyen global</span>
              <span className="font-bold text-emerald-400">90.4%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Appareils avec alertes</span>
              <span className="font-bold text-red-400">2 / {DEVICE_TYPES.reduce((a, d) => a + d.count, 0)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Firmware à jour</span>
              <span className="font-bold text-amber-400">6 / {DEVICE_TYPES.reduce((a, d) => a + d.count, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
