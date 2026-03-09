'use client';

import { useState } from 'react';

type Scope = 'global' | 'amis';
type Period = 'semaine' | 'mois' | 'annee' | 'alltime';
type Category = 'verres' | 'bouteilles' | 'soirees';

// IDs des amis (partagés avec la page amis)
const FRIEND_IDS = new Set(['1', '2', '3', '4', '6']);

type Player = {
  id: string;
  name: string;
  avatar: string;
  isMe?: boolean;
  isFriend?: boolean;
  verres: number;
  bouteilles: number;
  soirees: number;
  streak: number;
  badge?: string;
  group?: string;
};

const DATA: Record<Period, Player[]> = {
  semaine: [
    { id: '1', name: 'Alex M.', avatar: 'A', verres: 89, bouteilles: 34, soirees: 3, streak: 7, badge: '🔥', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '2', name: 'Julie R.', avatar: 'J', verres: 74, bouteilles: 28, soirees: 3, streak: 5, badge: '⚡', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '3', name: 'Tom B.', avatar: 'T', verres: 61, bouteilles: 22, soirees: 2, streak: 4, isFriend: true, group: 'Coloc Voltaire' },
    { id: '4', name: 'Camille D.', avatar: 'C', verres: 55, bouteilles: 19, soirees: 2, streak: 3, isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '5', name: 'Vous', avatar: '?', verres: 48, bouteilles: 16, soirees: 2, streak: 6, badge: '💎', isMe: true, group: 'Les Potes du Jeudi' },
    { id: '6', name: 'Léa K.', avatar: 'L', verres: 43, bouteilles: 14, soirees: 2, streak: 2, group: 'Coloc Voltaire' },
    { id: '7', name: 'Romain V.', avatar: 'R', verres: 39, bouteilles: 12, soirees: 1, streak: 1, isFriend: true, group: 'Coloc Voltaire' },
    { id: '8', name: 'Sarah M.', avatar: 'S', verres: 32, bouteilles: 10, soirees: 1, streak: 3, group: 'Festival Vibe' },
    { id: '9', name: 'Baptiste L.', avatar: 'B', verres: 28, bouteilles: 9, soirees: 1, streak: 0, group: 'Festival Vibe' },
    { id: '10', name: 'Marie C.', avatar: 'M', verres: 21, bouteilles: 7, soirees: 1, streak: 0, group: 'Festival Vibe' },
  ],
  mois: [
    { id: '1', name: 'Alex M.', avatar: 'A', verres: 342, bouteilles: 118, soirees: 11, streak: 12, badge: '🏆', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '5', name: 'Vous', avatar: '?', verres: 289, bouteilles: 98, soirees: 9, streak: 6, badge: '💎', isMe: true, group: 'Les Potes du Jeudi' },
    { id: '2', name: 'Julie R.', avatar: 'J', verres: 271, bouteilles: 91, soirees: 10, streak: 5, badge: '⚡', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '7', name: 'Romain V.', avatar: 'R', verres: 248, bouteilles: 84, soirees: 8, streak: 4, isFriend: true, group: 'Coloc Voltaire' },
    { id: '3', name: 'Tom B.', avatar: 'T', verres: 231, bouteilles: 77, soirees: 8, streak: 3, isFriend: true, group: 'Coloc Voltaire' },
    { id: '4', name: 'Camille D.', avatar: 'C', verres: 198, bouteilles: 66, soirees: 7, streak: 2, isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '6', name: 'Léa K.', avatar: 'L', verres: 176, bouteilles: 59, soirees: 6, streak: 1, group: 'Coloc Voltaire' },
    { id: '8', name: 'Sarah M.', avatar: 'S', verres: 154, bouteilles: 51, soirees: 5, streak: 0, group: 'Festival Vibe' },
    { id: '9', name: 'Baptiste L.', avatar: 'B', verres: 132, bouteilles: 44, soirees: 4, streak: 0, group: 'Festival Vibe' },
    { id: '10', name: 'Marie C.', avatar: 'M', verres: 98, bouteilles: 32, soirees: 3, streak: 0, group: 'Festival Vibe' },
  ],
  annee: [
    { id: '1', name: 'Alex M.', avatar: 'A', verres: 3842, bouteilles: 1284, soirees: 98, streak: 12, badge: '🏆', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '7', name: 'Romain V.', avatar: 'R', verres: 3241, bouteilles: 1077, soirees: 87, streak: 4, isFriend: true, group: 'Coloc Voltaire' },
    { id: '2', name: 'Julie R.', avatar: 'J', verres: 2987, bouteilles: 991, soirees: 81, streak: 5, badge: '⚡', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '3', name: 'Tom B.', avatar: 'T', verres: 2654, bouteilles: 882, soirees: 74, streak: 3, isFriend: true, group: 'Coloc Voltaire' },
    { id: '5', name: 'Vous', avatar: '?', verres: 2441, bouteilles: 813, soirees: 67, streak: 6, badge: '💎', isMe: true, group: 'Les Potes du Jeudi' },
    { id: '4', name: 'Camille D.', avatar: 'C', verres: 2198, bouteilles: 731, soirees: 61, streak: 2, isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '6', name: 'Léa K.', avatar: 'L', verres: 1976, bouteilles: 658, soirees: 54, streak: 1, group: 'Coloc Voltaire' },
    { id: '8', name: 'Sarah M.', avatar: 'S', verres: 1754, bouteilles: 584, soirees: 48, streak: 0, group: 'Festival Vibe' },
    { id: '9', name: 'Baptiste L.', avatar: 'B', verres: 1532, bouteilles: 510, soirees: 42, streak: 0, group: 'Festival Vibe' },
    { id: '10', name: 'Marie C.', avatar: 'M', verres: 1198, bouteilles: 399, soirees: 35, streak: 0, group: 'Festival Vibe' },
  ],
  alltime: [
    { id: '1', name: 'Alex M.', avatar: 'A', verres: 8421, bouteilles: 2807, soirees: 214, streak: 12, badge: '🏆', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '7', name: 'Romain V.', avatar: 'R', verres: 7234, bouteilles: 2411, soirees: 189, streak: 4, isFriend: true, group: 'Coloc Voltaire' },
    { id: '2', name: 'Julie R.', avatar: 'J', verres: 6987, bouteilles: 2329, soirees: 177, streak: 5, badge: '⚡', isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '3', name: 'Tom B.', avatar: 'T', verres: 5654, bouteilles: 1884, soirees: 153, streak: 3, isFriend: true, group: 'Coloc Voltaire' },
    { id: '5', name: 'Vous', avatar: '?', verres: 4841, bouteilles: 1613, soirees: 131, streak: 6, badge: '💎', isMe: true, group: 'Les Potes du Jeudi' },
    { id: '4', name: 'Camille D.', avatar: 'C', verres: 4198, bouteilles: 1399, soirees: 118, streak: 2, isFriend: true, group: 'Les Potes du Jeudi' },
    { id: '6', name: 'Léa K.', avatar: 'L', verres: 3876, bouteilles: 1292, soirees: 104, streak: 1, group: 'Coloc Voltaire' },
    { id: '8', name: 'Sarah M.', avatar: 'S', verres: 3154, bouteilles: 1051, soirees: 89, streak: 0, group: 'Festival Vibe' },
    { id: '9', name: 'Baptiste L.', avatar: 'B', verres: 2432, bouteilles: 810, soirees: 71, streak: 0, group: 'Festival Vibe' },
    { id: '10', name: 'Marie C.', avatar: 'M', verres: 1998, bouteilles: 666, soirees: 58, streak: 0, group: 'Festival Vibe' },
  ],
};

const PERIOD_LABELS: Record<Period, string> = {
  semaine: 'Cette semaine',
  mois: 'Ce mois',
  annee: 'Cette année',
  alltime: 'All time',
};

const CAT_LABELS: Record<Category, string> = {
  verres: '🥤 Verres',
  bouteilles: '🍾 Bouteilles',
  soirees: '🎉 Soirées',
};

const RANK_STYLE = [
  { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-300', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]', emoji: '🏆' },
  { bg: 'bg-gray-400/10 border-gray-400/20', text: 'text-gray-300', glow: '', emoji: '🥈' },
  { bg: 'bg-orange-500/12 border-orange-500/25', text: 'text-orange-300', glow: '', emoji: '🥉' },
];

export default function ClassementPage() {
  const [scope, setScope] = useState<Scope>('global');
  const [period, setPeriod] = useState<Period>('semaine');
  const [category, setCategory] = useState<Category>('verres');

  const baseList = [...DATA[period]];
  const scopedList = scope === 'amis'
    ? baseList.filter((p) => p.isMe || p.isFriend)
    : baseList;
  const players = scopedList.sort((a, b) => b[category] - a[category]);
  const me = players.find((p) => p.isMe);
  const myRank = players.findIndex((p) => p.isMe) + 1;
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);
  const max = players[0]?.[category] || 1;

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Classement</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {scope === 'amis' ? 'Classement parmi tes amis' : 'Compare tes performances avec tous les utilisateurs FizzUp'}
          </p>
        </div>
        {/* Scope toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <button
            onClick={() => setScope('global')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              scope === 'global' ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            🌍 Global
          </button>
          <button
            onClick={() => setScope('amis')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              scope === 'amis' ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            👥 Mes amis
          </button>
        </div>
      </div>

      {/* My rank banner */}
      {me && (
        <div className="rounded-2xl border border-violet-500/25 px-6 py-4 flex items-center gap-5" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.06))' }}>
          <div className="text-4xl font-black text-violet-300 w-12 text-center">#{myRank}</div>
          <div className="w-px h-10 bg-white/8" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">
              Votre position · <span className="text-violet-300 font-medium">{PERIOD_LABELS[period]}</span>
              {scope === 'amis' && <span className="ml-1 text-gray-600">· parmi tes amis</span>}
            </p>
            <p className="text-white font-semibold mt-0.5">
              {me[category].toLocaleString()} {category === 'verres' ? 'verres' : category === 'bouteilles' ? 'bouteilles' : 'soirées'}
              {myRank > 1 && (
                <span className="text-xs text-gray-500 font-normal ml-2">
                  · {(players[myRank - 2][category] - me[category]).toLocaleString()} de moins que #{myRank - 1}
                </span>
              )}
            </p>
          </div>
          {me.streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/25">
              <span className="text-base">🔥</span>
              <span className="text-sm font-semibold text-orange-300">{me.streak} jours</span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p ? 'bg-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {(Object.keys(CAT_LABELS) as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === c ? 'bg-white/12 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4">
        {[top3[1], top3[0], top3[2]].map((player, i) => {
          if (!player) return <div key={i} />;
          const actualRank = i === 1 ? 0 : i === 0 ? 1 : 2;
          const style = RANK_STYLE[actualRank];
          return (
            <div
              key={player.id}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border ${style.bg} ${style.glow} ${i === 1 ? 'scale-105' : ''} transition-transform`}
            >
              <span className="text-3xl">{style.emoji}</span>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                player.isMe ? 'bg-violet-500/30 border-violet-500/60 text-violet-200' : 'bg-white/8 border-white/15 text-white'
              }`}>
                {player.avatar}
              </div>
              <div className="text-center">
                <p className={`text-sm font-bold ${player.isMe ? 'text-violet-300' : style.text}`}>{player.name}</p>
                {player.badge && <span className="text-base">{player.badge}</span>}
                <p className="text-2xl font-black text-white mt-1">{player[category].toLocaleString()}</p>
                <p className="text-xs text-gray-500">{category === 'verres' ? 'verres' : category === 'bouteilles' ? 'bouteilles' : 'soirées'}</p>
                <p className="text-xs text-gray-600 mt-1">{player.group}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="px-5 py-3 border-b border-white/6 flex items-center text-[10px] font-semibold uppercase tracking-widest text-gray-600 gap-4">
          <span className="w-8">#</span>
          <span className="flex-1">Joueur</span>
          <span className="w-28 text-right hidden md:block">Groupe</span>
          <span className="w-20 text-right">Verres</span>
          <span className="w-20 text-right hidden sm:block">Bouteilles</span>
          <span className="w-20 text-right hidden lg:block">Soirées</span>
          <span className="w-16 text-right hidden lg:block">Streak</span>
        </div>

        {[...top3, ...rest].map((player, idx) => {
          const pct = Math.round((player[category] / max) * 100);
          return (
            <div
              key={player.id}
              className={`flex items-center gap-4 px-5 py-3.5 border-b border-white/4 last:border-0 transition-colors ${
                player.isMe ? 'bg-violet-500/8' : 'hover:bg-white/3'
              }`}
            >
              <span className={`w-8 text-center text-sm font-bold ${idx < 3 ? ['text-amber-400','text-gray-300','text-orange-400'][idx] : 'text-gray-600'}`}>
                {idx < 3 ? RANK_STYLE[idx].emoji : `${idx + 1}`}
              </span>

              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  player.isMe ? 'bg-violet-500/30 border border-violet-500/40 text-violet-300' : player.isFriend ? 'bg-white/10 border border-white/20 text-gray-200' : 'bg-white/8 text-gray-300'
                }`}>
                  {player.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium truncate ${player.isMe ? 'text-violet-300' : 'text-gray-200'}`}>
                      {player.name}
                    </span>
                    {player.isFriend && !player.isMe && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400">ami</span>}
                    {player.badge && <span className="text-xs">{player.badge}</span>}
                  </div>
                  <div className="h-1 rounded-full bg-white/6 mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${player.isMe ? 'bg-violet-500' : idx === 0 ? 'bg-amber-400' : 'bg-white/25'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <span className="w-28 text-right text-xs text-gray-600 hidden md:block truncate">{player.group}</span>
              <span className={`w-20 text-right text-sm font-semibold ${player.isMe ? 'text-violet-300' : 'text-white'}`}>
                {player.verres.toLocaleString()}
              </span>
              <span className="w-20 text-right text-sm text-gray-400 hidden sm:block">{player.bouteilles.toLocaleString()}</span>
              <span className="w-20 text-right text-sm text-gray-400 hidden lg:block">{player.soirees}</span>
              <span className="w-16 text-right text-sm hidden lg:block">
                {player.streak > 0 ? <span className="text-orange-400">🔥 {player.streak}j</span> : <span className="text-gray-700">—</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
