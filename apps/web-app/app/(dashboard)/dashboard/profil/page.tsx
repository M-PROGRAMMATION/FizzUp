'use client';

import { useState } from 'react';

type Badge = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  earnedAt: string;
  rarity: 'commun' | 'rare' | 'épique' | 'légendaire';
};

type Activity = {
  id: string;
  type: 'soiree' | 'defi' | 'badge' | 'classement' | 'ami';
  label: string;
  detail: string;
  date: string;
  points?: number;
};

const BADGES: Badge[] = [
  { id: '1', emoji: '💎', label: 'Premium', description: 'Membre FizzUp Premium', earnedAt: 'janv. 2024', rarity: 'légendaire' },
  { id: '2', emoji: '🏆', label: 'Top 1', description: 'Terminé 1er du classement mensuel', earnedAt: 'fév. 2024', rarity: 'épique' },
  { id: '3', emoji: '🔥', label: 'Streak 30j', description: '30 jours d\'activité consécutifs', earnedAt: 'mars 2024', rarity: 'épique' },
  { id: '4', emoji: '🥂', label: 'Premier verre', description: 'Premier tirage connecté', earnedAt: 'janv. 2024', rarity: 'commun' },
  { id: '5', emoji: '🦋', label: 'Social', description: 'A rejoint 3 groupes', earnedAt: 'fév. 2024', rarity: 'commun' },
  { id: '6', emoji: '⚡', label: 'Express', description: '20 verres en moins de 2h', earnedAt: 'mars 2024', rarity: 'rare' },
  { id: '7', emoji: '🎵', label: 'Festival', description: '3 soirées en une semaine', earnedAt: 'avril 2024', rarity: 'rare' },
  { id: '8', emoji: '🏅', label: 'Podium', description: '3 fois dans le top 3', earnedAt: 'mai 2024', rarity: 'épique' },
];

const ACTIVITY: Activity[] = [
  { id: '1', type: 'soiree', label: 'Soirée terminée', detail: 'Les Potes du Jeudi · 23 verres · 4 bouteilles', date: 'Aujourd\'hui à 2h14', points: 180 },
  { id: '2', type: 'defi', label: 'Défi complété', detail: 'Social butterfly — Rejoins 3 groupes', date: 'Hier', points: 75 },
  { id: '3', type: 'classement', label: 'Nouveau rang', detail: '#5 → #4 au classement hebdomadaire', date: 'Il y a 2 jours' },
  { id: '4', type: 'badge', label: 'Badge obtenu', detail: '🎵 Festival — 3 soirées en une semaine', date: 'Il y a 4 jours', points: 300 },
  { id: '5', type: 'ami', label: 'Nouvel ami', detail: 'Léa K. a accepté ta demande', date: 'Il y a 5 jours' },
  { id: '6', type: 'soiree', label: 'Soirée terminée', detail: 'Coloc Voltaire · 18 verres · 3 bouteilles', date: 'Il y a 6 jours', points: 140 },
  { id: '7', type: 'defi', label: 'Défi complété', detail: 'Premier verre — Premier tirage connecté', date: 'Il y a 3 semaines', points: 50 },
];

const GROUPS = [
  { name: 'Les Potes du Jeudi', emoji: '🎉', members: 8, rank: 2, sessions: 18 },
  { name: 'Coloc Voltaire', emoji: '🏠', members: 4, rank: 1, sessions: 11 },
  { name: 'Festival Vibe', emoji: '🎵', members: 15, rank: 5, sessions: 4 },
];

const RARITY_STYLE = {
  commun: 'border-white/12 bg-white/4 text-gray-400',
  rare: 'border-blue-500/30 bg-blue-500/8 text-blue-300',
  épique: 'border-violet-500/35 bg-violet-500/10 text-violet-300',
  légendaire: 'border-amber-500/40 bg-amber-500/12 text-amber-300',
};

const RARITY_LABEL_STYLE = {
  commun: 'text-gray-600',
  rare: 'text-blue-400',
  épique: 'text-violet-400',
  légendaire: 'text-amber-400',
};

const ACTIVITY_ICONS: Record<Activity['type'], string> = {
  soiree: '🎉',
  defi: '⚡',
  badge: '🏅',
  classement: '📊',
  ami: '👥',
};

const ACTIVITY_DOT: Record<Activity['type'], string> = {
  soiree: 'bg-violet-500',
  defi: 'bg-amber-400',
  badge: 'bg-emerald-400',
  classement: 'bg-blue-400',
  ami: 'bg-pink-400',
};

type ProfileTab = 'activite' | 'badges' | 'groupes' | 'stats';

export default function ProfilPage() {
  const [tab, setTab] = useState<ProfileTab>('activite');
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('Fan de bières artisanales et de belles soirées entre amis. 🍺');
  const [editBio, setEditBio] = useState(bio);
  const [displayName, setDisplayName] = useState('Marc A.');
  const [editName, setEditName] = useState(displayName);

  function saveEdit() {
    setBio(editBio);
    setDisplayName(editName);
    setEditMode(false);
  }

  const totalPoints = 2840;
  const nextLevelPoints = 3500;
  const levelPct = Math.round((totalPoints / nextLevelPoints) * 100);

  return (
    <div className="space-y-7 pb-10">
      {/* Profile hero */}
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {/* Banner */}
        <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.25) 50%, rgba(16,185,129,0.15) 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139,92,246,0.6) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(99,102,241,0.4) 0%, transparent 50%)' }} />
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/30 border border-white/15 text-xs text-gray-300 hover:text-white hover:bg-black/50 transition-all backdrop-blur-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-8 mb-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl border-4 border-[#050508] bg-violet-500/30 flex items-center justify-center text-2xl font-black text-violet-200">
                M
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#050508]" />
            </div>
            {editMode && (
              <div className="flex items-center gap-2">
                <button onClick={() => setEditMode(false)} className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-gray-400 text-sm hover:bg-white/10 transition-colors">Annuler</button>
                <button onClick={saveEdit} className="px-3 py-1.5 rounded-lg bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-colors">Enregistrer</button>
              </div>
            )}
          </div>

          {/* Name & bio */}
          <div className="space-y-2">
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Nom d'affichage</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full max-w-xs px-3 py-2 rounded-xl bg-white/4 border border-violet-500/30 text-sm text-white outline-none focus:border-violet-500/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={2}
                    maxLength={120}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/4 border border-violet-500/30 text-sm text-white outline-none focus:border-violet-500/60 transition-colors resize-none"
                  />
                  <p className="text-[10px] text-gray-700 mt-1">{editBio.length}/120</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-white">{displayName}</h1>
                  <span className="text-sm text-gray-600">@marc_a</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 font-semibold">💎 Premium</span>
                </div>
                <p className="text-sm text-gray-400">{bio}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>📅 Membre depuis janv. 2024</span>
                  <span>📍 Paris, France</span>
                </div>
              </>
            )}
          </div>

          {/* Level progress */}
          <div className="mt-5 p-4 rounded-xl bg-white/3 border border-white/6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Niveau 14</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-300">Expert</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-violet-300">{totalPoints.toLocaleString()}</span>
                <span className="text-xs text-gray-600"> / {nextLevelPoints.toLocaleString()} pts</span>
              </div>
            </div>
            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${levelPct}%`, background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }}
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-1.5">{(nextLevelPoints - totalPoints).toLocaleString()} pts pour passer Niveau 15</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Verres', value: '4 841', color: 'text-violet-300', icon: '🍺' },
              { label: 'Soirées', value: '131', color: 'text-white', icon: '🎉' },
              { label: 'Amis', value: '6', color: 'text-emerald-400', icon: '👥' },
              { label: 'Rang global', value: '#5', color: 'text-amber-300', icon: '📊' },
            ].map((s) => (
              <div key={s.label} className="text-center px-3 py-3 rounded-xl bg-white/3 border border-white/6">
                <p className="text-base mb-0.5">{s.icon}</p>
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8 w-fit" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {([
          { key: 'activite', label: 'Activité' },
          { key: 'badges', label: `Badges · ${BADGES.length}` },
          { key: 'groupes', label: 'Groupes' },
          { key: 'stats', label: 'Statistiques' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---- Activité ---- */}
      {tab === 'activite' && (
        <div className="space-y-1">
          {ACTIVITY.map((a, i) => (
            <div
              key={a.id}
              className="flex items-start gap-4 px-4 py-3.5 rounded-xl hover:bg-white/3 transition-colors group"
            >
              <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 ${
                  a.type === 'soiree' ? 'bg-violet-500/15' :
                  a.type === 'defi' ? 'bg-amber-500/15' :
                  a.type === 'badge' ? 'bg-emerald-500/15' :
                  a.type === 'ami' ? 'bg-pink-500/15' :
                  'bg-blue-500/15'
                }`}>
                  {ACTIVITY_ICONS[a.type]}
                </div>
                {i < ACTIVITY.length - 1 && (
                  <div className="w-px flex-1 bg-white/6 mt-1.5 min-h-[16px]" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{a.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.points && (
                      <span className="text-xs font-semibold text-violet-400">+{a.points} pts</span>
                    )}
                    <span className="text-xs text-gray-600">{a.date}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Badges ---- */}
      {tab === 'badges' && (
        <div className="space-y-5">
          {(['légendaire', 'épique', 'rare', 'commun'] as const).map((rarity) => {
            const list = BADGES.filter((b) => b.rarity === rarity);
            if (list.length === 0) return null;
            const labels = { légendaire: '✨ Légendaire', épique: '💜 Épique', rare: '💙 Rare', commun: '⬜ Commun' };
            return (
              <div key={rarity}>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${RARITY_LABEL_STYLE[rarity]}`}>
                  {labels[rarity]}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {list.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all hover:scale-[1.02] ${RARITY_STYLE[badge.rarity]}`}
                    >
                      <span className="text-4xl">{badge.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{badge.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{badge.description}</p>
                        <p className="text-[10px] text-gray-700 mt-1">{badge.earnedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Groupes ---- */}
      {tab === 'groupes' && (
        <div className="space-y-3">
          {GROUPS.map((g) => (
            <div
              key={g.name}
              className="rounded-2xl border border-white/8 p-5 flex items-center gap-5 hover:border-white/14 transition-colors"
              style={{ background: 'rgba(255,255,255,0.025)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                {g.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{g.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-600">{g.members} membres</span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-600">{g.sessions} soirées ensemble</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-black text-white">#{g.rank}</p>
                <p className="text-[10px] text-gray-600">ton rang</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Stats ---- */}
      {tab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Totaux */}
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-4">Totaux all time</p>
            <div className="space-y-4">
              {[
                { label: 'Verres tirés', value: '4 841', pct: 72, color: 'bg-violet-500' },
                { label: 'Bouteilles décapsulées', value: '1 613', pct: 54, color: 'bg-indigo-500' },
                { label: 'Soirées organisées', value: '131', pct: 67, color: 'bg-emerald-500' },
                { label: 'Groupes rejoints', value: '3', pct: 30, color: 'bg-pink-500' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-gray-400">{s.label}</span>
                    <span className="text-xs font-bold text-white">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classements */}
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-4">Classements</p>
            <div className="space-y-3">
              {[
                { label: 'Classement global', value: '#5', sub: 'sur 847 joueurs', color: 'text-amber-300' },
                { label: 'Cette semaine', value: '#5', sub: 'en hausse de 2 places', color: 'text-emerald-400' },
                { label: 'Ce mois', value: '#2', sub: 'meilleur résultat', color: 'text-amber-300' },
                { label: 'Dans Les Potes du Jeudi', value: '#2', sub: 'sur 8 membres', color: 'text-violet-300' },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/3 border border-white/6">
                  <span className="text-xs text-gray-400">{r.label}</span>
                  <div className="text-right">
                    <p className={`text-sm font-black ${r.color}`}>{r.value}</p>
                    <p className="text-[10px] text-gray-600">{r.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moy. soirée */}
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-4">Moyennes par soirée</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Verres', value: '36.9', unit: 'verres / soirée' },
                { label: 'Durée', value: '3h 12min', unit: 'durée moyenne' },
                { label: 'Participants', value: '7.2', unit: 'personnes / soirée' },
                { label: 'Bouteilles', value: '12.3', unit: 'bouteilles / soirée' },
              ].map((s) => (
                <div key={s.label} className="px-3 py-3 rounded-xl bg-white/3 border border-white/6">
                  <p className="text-lg font-black text-white">{s.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.unit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Streak & points */}
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-4">Progression</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-orange-500/8 border border-orange-500/15">
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="text-2xl font-black text-orange-300">6 jours</p>
                  <p className="text-xs text-gray-500">Streak actuel</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-bold text-gray-400">Record</p>
                  <p className="text-lg font-black text-white">30 j.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-violet-500/8 border border-violet-500/15">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="text-2xl font-black text-violet-300">2 840</p>
                  <p className="text-xs text-gray-500">Points totaux</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-bold text-gray-400">Niveau</p>
                  <p className="text-lg font-black text-white">14</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                <span className="text-3xl">🏅</span>
                <div>
                  <p className="text-2xl font-black text-emerald-300">{BADGES.length}</p>
                  <p className="text-xs text-gray-500">Badges débloqués</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-bold text-gray-400">Défis</p>
                  <p className="text-lg font-black text-white">3 / 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
