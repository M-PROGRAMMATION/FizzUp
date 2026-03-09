'use client';

import { useState } from 'react';

type Status = 'active' | 'completed' | 'failed' | 'pending';
type Difficulty = 'facile' | 'moyen' | 'difficile';

type Challenge = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: Difficulty;
  status: Status;
  progress: number;
  goal: number;
  unit: string;
  reward: string;
  rewardPoints: number;
  expiresIn?: string;
  completedAt?: string;
  group?: string;
  participants?: number;
};

const CHALLENGES: Challenge[] = [
  // Active
  {
    id: '1',
    title: 'Roi de la semaine',
    description: 'Sois le premier du classement verres sur 7 jours consécutifs.',
    emoji: '👑',
    difficulty: 'difficile',
    status: 'active',
    progress: 5,
    goal: 7,
    unit: 'jours au top',
    reward: 'Badge Roi',
    rewardPoints: 500,
    expiresIn: '2 jours',
    group: 'Global',
    participants: 10,
  },
  {
    id: '2',
    title: 'Soirée marathon',
    description: 'Tracker une soirée de plus de 5 heures avec tes appareils connectés.',
    emoji: '⏱️',
    difficulty: 'moyen',
    status: 'active',
    progress: 3,
    goal: 5,
    unit: 'heures',
    reward: 'Badge Endurant',
    rewardPoints: 250,
    expiresIn: '5 jours',
    group: 'Les Potes du Jeudi',
    participants: 6,
  },
  {
    id: '3',
    title: 'Hydratation express',
    description: 'Bois 20 verres en moins de 2 heures lors d\'une soirée.',
    emoji: '💧',
    difficulty: 'facile',
    status: 'active',
    progress: 14,
    goal: 20,
    unit: 'verres',
    reward: 'Badge Express',
    rewardPoints: 100,
    expiresIn: '3 jours',
    group: 'Global',
    participants: 8,
  },
  {
    id: '4',
    title: 'Décapsuleur fou',
    description: 'Décapsule 10 bouteilles lors d\'une seule soirée.',
    emoji: '🍾',
    difficulty: 'moyen',
    status: 'active',
    progress: 7,
    goal: 10,
    unit: 'bouteilles',
    reward: 'Badge Décapsuleur',
    rewardPoints: 200,
    expiresIn: '1 jour',
    group: 'Coloc Voltaire',
    participants: 4,
  },
  // Pending (à débloquer)
  {
    id: '5',
    title: 'Streak de feu',
    description: 'Maintiens une streak de 14 jours sans interruption.',
    emoji: '🔥',
    difficulty: 'difficile',
    status: 'pending',
    progress: 0,
    goal: 14,
    unit: 'jours',
    reward: 'Badge Flamme',
    rewardPoints: 750,
    group: 'Global',
    participants: 3,
  },
  {
    id: '6',
    title: 'Festival ready',
    description: 'Organise 3 soirées en moins d\'une semaine.',
    emoji: '🎵',
    difficulty: 'moyen',
    status: 'pending',
    progress: 0,
    goal: 3,
    unit: 'soirées',
    reward: 'Badge Festival',
    rewardPoints: 300,
    group: 'Festival Vibe',
    participants: 12,
  },
  // Completed
  {
    id: '7',
    title: 'Premier verre',
    description: 'Utilise ta tireuse connectée pour la première fois.',
    emoji: '🥂',
    difficulty: 'facile',
    status: 'completed',
    progress: 1,
    goal: 1,
    unit: 'verre',
    reward: 'Badge Débutant',
    rewardPoints: 50,
    completedAt: 'Il y a 3 semaines',
    group: 'Global',
  },
  {
    id: '8',
    title: 'Top 3 mensuel',
    description: 'Termine dans le top 3 du classement mensuel.',
    emoji: '🏅',
    difficulty: 'difficile',
    status: 'completed',
    progress: 2,
    goal: 1,
    unit: 'fois dans le top 3',
    reward: 'Badge Podium',
    rewardPoints: 400,
    completedAt: 'Il y a 1 mois',
    group: 'Global',
  },
  {
    id: '9',
    title: 'Social butterfly',
    description: 'Rejoins 3 groupes différents.',
    emoji: '🦋',
    difficulty: 'facile',
    status: 'completed',
    progress: 3,
    goal: 3,
    unit: 'groupes',
    reward: 'Badge Social',
    rewardPoints: 75,
    completedAt: 'Il y a 2 semaines',
    group: 'Global',
  },
  // Failed
  {
    id: '10',
    title: 'Week-end warrior',
    description: 'Fais 3 soirées ce week-end.',
    emoji: '⚔️',
    difficulty: 'moyen',
    status: 'failed',
    progress: 1,
    goal: 3,
    unit: 'soirées',
    reward: 'Badge Warrior',
    rewardPoints: 200,
    completedAt: 'Expiré il y a 2 jours',
    group: 'Les Potes du Jeudi',
  },
];

const DIFF_STYLE: Record<Difficulty, string> = {
  facile: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  moyen: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  difficile: 'bg-red-500/15 text-red-400 border-red-500/25',
};

const STATUS_FILTER = ['tous', 'active', 'completed', 'failed', 'pending'] as const;
type StatusFilter = typeof STATUS_FILTER[number];

const STATUS_LABELS: Record<StatusFilter, string> = {
  tous: 'Tous',
  active: 'En cours',
  completed: 'Complétés',
  failed: 'Échoués',
  pending: 'À venir',
};

function ChallengeCard({ c }: { c: Challenge }) {
  const pct = Math.min(100, Math.round((c.progress / c.goal) * 100));

  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-4 transition-all ${
      c.status === 'active' ? 'border-white/10 hover:border-violet-500/30' :
      c.status === 'completed' ? 'border-emerald-500/20 opacity-80' :
      c.status === 'failed' ? 'border-red-500/15 opacity-60' :
      'border-white/6 opacity-70'
    }`} style={{ background: c.status === 'active' ? 'rgba(255,255,255,0.03)' : c.status === 'completed' ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)' }}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`text-3xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0 ${
            c.status === 'completed' ? 'bg-emerald-500/15' :
            c.status === 'failed' ? 'bg-red-500/10' :
            'bg-violet-500/12'
          }`}>{c.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">{c.title}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFF_STYLE[c.difficulty]}`}>
                {c.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="shrink-0">
          {c.status === 'active' && c.expiresIn && (
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/12 border border-amber-500/20 text-amber-400 font-medium whitespace-nowrap">
              ⏰ {c.expiresIn}
            </span>
          )}
          {c.status === 'completed' && (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-medium">
              ✓ Complété
            </span>
          )}
          {c.status === 'failed' && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/12 border border-red-500/20 text-red-400 font-medium">
              ✗ Échoué
            </span>
          )}
          {c.status === 'pending' && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-500/12 border border-gray-500/20 text-gray-500 font-medium">
              🔒 À venir
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      {c.status !== 'pending' && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">
              {c.progress} / {c.goal} {c.unit}
            </span>
            <span className={`text-xs font-semibold ${
              c.status === 'completed' ? 'text-emerald-400' :
              c.status === 'failed' ? 'text-red-400' :
              'text-violet-400'
            }`}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                c.status === 'completed' ? 'bg-emerald-500' :
                c.status === 'failed' ? 'bg-red-500/60' :
                'bg-violet-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">{c.group}</span>
          {c.participants && c.status === 'active' && (
            <span className="text-xs text-gray-600">· {c.participants} participants</span>
          )}
          {c.completedAt && (
            <span className="text-xs text-gray-600">{c.completedAt}</span>
          )}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${
          c.status === 'completed' ? 'text-emerald-400' :
          c.status === 'failed' ? 'text-gray-600' :
          'text-violet-400'
        }`}>
          <span>+{c.rewardPoints} pts</span>
          <span>·</span>
          <span>{c.reward}</span>
        </div>
      </div>
    </div>
  );
}

export default function DefisPage() {
  const [filter, setFilter] = useState<StatusFilter>('tous');

  const filtered = filter === 'tous' ? CHALLENGES : CHALLENGES.filter((c) => c.status === filter);
  const active = CHALLENGES.filter((c) => c.status === 'active');
  const totalPts = CHALLENGES.filter((c) => c.status === 'completed').reduce((sum, c) => sum + c.rewardPoints, 0);

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Défis</h1>
          <p className="text-gray-500 text-sm mt-0.5">Relève des défis, gagne des points et débloque des badges</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-500/25 bg-violet-500/10">
          <span className="text-base">⭐</span>
          <div>
            <p className="text-xs text-gray-500 leading-none">Points gagnés</p>
            <p className="text-sm font-bold text-violet-300">{totalPts.toLocaleString()} pts</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'En cours', value: CHALLENGES.filter(c => c.status === 'active').length, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
          { label: 'Complétés', value: CHALLENGES.filter(c => c.status === 'completed').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Échoués', value: CHALLENGES.filter(c => c.status === 'failed').length, color: 'text-red-400', bg: 'bg-red-500/8 border-red-500/15' },
          { label: 'À venir', value: CHALLENGES.filter(c => c.status === 'pending').length, color: 'text-gray-400', bg: 'bg-white/4 border-white/8' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active challenges highlight */}
      {active.length > 0 && filter === 'tous' && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">
            ⚡ En cours · {active.length} défi{active.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {active.map((c) => <ChallengeCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8 w-fit" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {STATUS_FILTER.filter(f => f !== 'active' || filter !== 'tous').map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {STATUS_LABELS[f]}
            <span className="ml-1.5 text-xs opacity-60">
              {f === 'tous' ? CHALLENGES.length : CHALLENGES.filter(c => c.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* All / filtered */}
      {filter !== 'tous' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.length > 0
            ? filtered.map((c) => <ChallengeCard key={c.id} c={c} />)
            : <p className="text-gray-600 text-sm col-span-2 py-8 text-center">Aucun défi dans cette catégorie.</p>
          }
        </div>
      )}

      {filter === 'tous' && (
        <>
          {(['pending', 'completed', 'failed'] as Status[]).map((s) => {
            const list = CHALLENGES.filter((c) => c.status === s);
            if (list.length === 0) return null;
            const labels: Record<Status, string> = { active: '', completed: '✅ Complétés', failed: '❌ Échoués', pending: '🔒 À débloquer' };
            return (
              <div key={s}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">{labels[s]}</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {list.map((c) => <ChallengeCard key={c.id} c={c} />)}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
