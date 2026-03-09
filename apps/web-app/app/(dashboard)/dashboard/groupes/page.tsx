'use client';

import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type Member = { id: string; name: string; avatar: string; verres: number; bouteilles: number };
type Party = {
  id: string;
  name: string;
  date: string;
  status: 'active' | 'finished';
  duration?: string;
  members: Member[];
};
type Group = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  memberCount: number;
  activeParty: boolean;
  parties: Party[];
};

// ── Mock data ──────────────────────────────────────────────────────────────────

const INITIAL_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Les Potes du Jeudi',
    emoji: '🍺',
    description: 'Soirées hebdo chez Alex',
    memberCount: 6,
    activeParty: true,
    parties: [
      {
        id: 'p1',
        name: 'Soirée jeudi 6 mars 🔥',
        date: '6 mars 2026',
        status: 'active',
        members: [
          { id: '1', name: 'Alex M.', avatar: 'A', verres: 14, bouteilles: 5 },
          { id: '2', name: 'Julie R.', avatar: 'J', verres: 11, bouteilles: 4 },
          { id: '3', name: 'Tom B.', avatar: 'T', verres: 9, bouteilles: 3 },
          { id: '4', name: 'Camille D.', avatar: 'C', verres: 8, bouteilles: 2 },
          { id: '5', name: 'Vous', avatar: '?', verres: 7, bouteilles: 2 },
          { id: '6', name: 'Léa K.', avatar: 'L', verres: 6, bouteilles: 1 },
        ],
      },
      {
        id: 'p2',
        name: 'Soirée du 20 fév 🎉',
        date: '20 fév 2026',
        status: 'finished',
        duration: '4h12',
        members: [
          { id: '1', name: 'Alex M.', avatar: 'A', verres: 21, bouteilles: 7 },
          { id: '5', name: 'Vous', avatar: '?', verres: 18, bouteilles: 6 },
          { id: '2', name: 'Julie R.', avatar: 'J', verres: 15, bouteilles: 4 },
          { id: '3', name: 'Tom B.', avatar: 'T', verres: 12, bouteilles: 3 },
          { id: '6', name: 'Léa K.', avatar: 'L', verres: 10, bouteilles: 2 },
          { id: '4', name: 'Camille D.', avatar: 'C', verres: 9, bouteilles: 2 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Coloc Voltaire',
    emoji: '🏠',
    description: 'La coloc du 12 rue Voltaire',
    memberCount: 4,
    activeParty: false,
    parties: [
      {
        id: 'p3',
        name: 'Crémaillère 🎊',
        date: '14 janv 2026',
        status: 'finished',
        duration: '6h30',
        members: [
          { id: '5', name: 'Vous', avatar: '?', verres: 19, bouteilles: 6 },
          { id: '7', name: 'Romain V.', avatar: 'R', verres: 17, bouteilles: 5 },
          { id: '8', name: 'Sarah M.', avatar: 'S', verres: 14, bouteilles: 4 },
          { id: '9', name: 'Baptiste L.', avatar: 'B', verres: 11, bouteilles: 3 },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Festival Vibe 2026',
    emoji: '🎵',
    description: 'Groupe festival cet été',
    memberCount: 12,
    activeParty: false,
    parties: [],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const RANK_COLORS = ['text-amber-400', 'text-gray-300', 'text-orange-400'];
const RANK_BG = ['bg-amber-500/15 border-amber-500/25', 'bg-gray-500/10 border-gray-500/20', 'bg-orange-500/12 border-orange-500/20'];
const RANK_EMOJI = ['🏆', '🥈', '🥉'];

function PartyLeaderboard({ party }: { party: Party }) {
  const sorted = [...party.members].sort((a, b) => b.verres - a.verres);
  const max = sorted[0]?.verres || 1;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          party.status === 'active'
            ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
            : 'bg-gray-700/30 border-white/8 text-gray-400'
        }`}>
          {party.status === 'active' ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />En cours</>
          ) : (
            <><span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />Terminée • {party.duration}</>
          )}
        </div>
        <span className="text-xs text-gray-600">{party.date}</span>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[sorted[1], sorted[0], sorted[2]].map((member, i) => {
          if (!member) return <div key={i} />;
          const actualRank = i === 1 ? 0 : i === 0 ? 1 : 2;
          return (
            <div
              key={member.id}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${RANK_BG[actualRank]} ${i === 1 ? 'scale-105' : ''} transition-transform`}
            >
              <span className="text-2xl">{RANK_EMOJI[actualRank]}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                member.name === 'Vous' ? 'bg-violet-500/30 border-2 border-violet-500/50 text-violet-300' : 'bg-white/8 text-white'
              }`}>
                {member.avatar}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${member.name === 'Vous' ? 'text-violet-300' : RANK_COLORS[actualRank]}`}>
                  {member.name}
                </p>
                <p className="text-lg font-bold text-white">{member.verres}</p>
                <p className="text-[10px] text-gray-500">verres</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full leaderboard */}
      <div className="space-y-1.5">
        {sorted.map((member, idx) => {
          const pct = Math.round((member.verres / max) * 100);
          const isMe = member.name === 'Vous';
          return (
            <div
              key={member.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                isMe ? 'bg-violet-500/10 border-violet-500/20' : 'border-transparent hover:bg-white/4'
              }`}
            >
              <span className="w-5 text-center text-xs font-bold text-gray-600">
                {idx < 3 ? RANK_EMOJI[idx] : `#${idx + 1}`}
              </span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isMe ? 'bg-violet-500/30 text-violet-300 border border-violet-500/40' : 'bg-white/8 text-gray-300'
              }`}>
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isMe ? 'text-violet-300' : 'text-gray-200'}`}>
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{member.verres} 🥤 · {member.bouteilles} 🍾</span>
                </div>
                <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isMe ? 'bg-violet-500' : 'bg-white/20'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function GroupesPage() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<Group>(INITIAL_GROUPS[0]);
  const [selectedParty, setSelectedParty] = useState<Party>(INITIAL_GROUPS[0].parties[0]);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewParty, setShowNewParty] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupEmoji, setNewGroupEmoji] = useState('🍺');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newPartyName, setNewPartyName] = useState('');

  function selectGroup(g: Group) {
    setSelectedGroup(g);
    setSelectedParty(g.parties[0]);
  }

  function createGroup() {
    if (!newGroupName.trim()) return;
    const g: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      emoji: newGroupEmoji,
      description: newGroupDesc.trim() || 'Nouveau groupe',
      memberCount: 1,
      activeParty: false,
      parties: [],
    };
    setGroups((prev) => [...prev, g]);
    setSelectedGroup(g);
    setSelectedParty(undefined as unknown as Party);
    setShowNewGroup(false);
    setNewGroupName('');
    setNewGroupDesc('');
  }

  function createParty() {
    if (!newPartyName.trim()) return;
    const party: Party = {
      id: Date.now().toString(),
      name: newPartyName.trim(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'active',
      members: [{ id: '5', name: 'Vous', avatar: '?', verres: 0, bouteilles: 0 }],
    };
    const updated = groups.map((g) =>
      g.id === selectedGroup.id
        ? { ...g, activeParty: true, parties: [party, ...g.parties] }
        : g
    );
    setGroups(updated);
    const updatedGroup = updated.find((g) => g.id === selectedGroup.id)!;
    setSelectedGroup(updatedGroup);
    setSelectedParty(party);
    setShowNewParty(false);
    setNewPartyName('');
  }

  const emojis = ['🍺', '🍻', '🎉', '🎵', '🏠', '🔥', '💎', '⚡', '🎯', '🚀'];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Groupes & Soirées</h1>
          <p className="text-gray-500 text-sm mt-0.5">Crée des groupes, lance des soirées, suis les classements</p>
        </div>
        <button
          onClick={() => setShowNewGroup(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nouveau groupe
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">

        {/* Groups list */}
        <div className="col-span-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">
            Mes groupes ({groups.length})
          </p>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => selectGroup(g)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-150 ${
                selectedGroup.id === g.id
                  ? 'bg-violet-500/15 border-violet-500/25 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                  : 'border-white/6 hover:border-white/12 hover:bg-white/4'
              }`}
              style={selectedGroup.id !== g.id ? { background: 'rgba(255,255,255,0.02)' } : {}}
            >
              <span className="text-2xl">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold truncate ${selectedGroup.id === g.id ? 'text-violet-200' : 'text-white'}`}>
                    {g.name}
                  </p>
                  {g.activeParty && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{g.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500">{g.memberCount} membres</p>
                <p className="text-xs text-gray-600">{g.parties.length} soirée{g.parties.length !== 1 ? 's' : ''}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Group detail */}
        <div className="col-span-8">
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>

            {/* Group header */}
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedGroup.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedGroup.name}</h2>
                  <p className="text-xs text-gray-500">{selectedGroup.description} · {selectedGroup.memberCount} membres</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewParty(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 hover:bg-violet-500/20 border border-white/8 hover:border-violet-500/30 text-sm text-gray-300 hover:text-violet-300 font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Lancer une soirée
              </button>
            </div>

            {/* Parties tabs */}
            {selectedGroup.parties.length > 0 ? (
              <>
                <div className="flex items-center gap-1 px-4 pt-4 pb-0 overflow-x-auto">
                  {selectedGroup.parties.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedParty(p)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                        selectedParty?.id === p.id
                          ? 'text-white border-violet-500 bg-white/4'
                          : 'text-gray-500 border-transparent hover:text-gray-300'
                      }`}
                    >
                      {p.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/6 mx-4" />

                {selectedParty && (
                  <div className="p-6">
                    <h3 className="text-base font-bold text-white mb-4">{selectedParty.name}</h3>
                    <PartyLeaderboard party={selectedParty} />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-8">
                <span className="text-5xl">🎉</span>
                <p className="text-white font-semibold">Aucune soirée pour l'instant</p>
                <p className="text-gray-500 text-sm">Lance une soirée pour commencer à tracker la consommation en temps réel !</p>
                <button
                  onClick={() => setShowNewParty(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-colors"
                >
                  Lancer la première soirée 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal — Nouveau groupe */}
      {showNewGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl border border-white/12 p-6 space-y-5" style={{ background: 'rgba(10,10,15,0.98)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Nouveau groupe</h2>
              <button onClick={() => setShowNewGroup(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Emoji du groupe</p>
              <div className="flex flex-wrap gap-2">
                {emojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => setNewGroupEmoji(e)}
                    className={`w-10 h-10 rounded-xl text-xl transition-all ${newGroupEmoji === e ? 'bg-violet-500/25 border border-violet-500/50 scale-110' : 'bg-white/6 border border-white/6 hover:bg-white/10'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Nom du groupe *</label>
              <input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ex: Les Potes du Vendredi"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none focus:border-violet-500/50 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Description</label>
              <input
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                placeholder="Ex: Soirées du jeudi chez Marc"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none focus:border-violet-500/50 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowNewGroup(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/8 text-sm text-gray-400 hover:text-white transition-colors">
                Annuler
              </button>
              <button onClick={createGroup} disabled={!newGroupName.trim()} className="flex-1 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
                Créer le groupe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal — Nouvelle soirée */}
      {showNewParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl border border-white/12 p-6 space-y-5" style={{ background: 'rgba(10,10,15,0.98)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Lancer une soirée</h2>
                <p className="text-xs text-gray-500 mt-0.5">dans {selectedGroup.emoji} {selectedGroup.name}</p>
              </div>
              <button onClick={() => setShowNewParty(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Nom de la soirée *</label>
              <input
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                placeholder="Ex: Soirée du 15 mars 🔥"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none focus:border-violet-500/50 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/8 px-4 py-3 text-xs text-violet-300">
              🎯 Une fois la soirée lancée, tes appareils connectés commencent à tracker la consommation en temps réel.
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowNewParty(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/8 text-sm text-gray-400 hover:text-white transition-colors">
                Annuler
              </button>
              <button onClick={createParty} disabled={!newPartyName.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <span className="text-base">🚀</span>
                Lancer la soirée !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
