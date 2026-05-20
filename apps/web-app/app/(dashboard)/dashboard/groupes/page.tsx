'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken, api, GroupSummary, GroupDetail, PartyItem, PartyMemberItem } from '../../../lib/api';

// ── Sub-components ─────────────────────────────────────────────────────────────

const RANK_COLORS = ['text-amber-400', 'text-gray-300', 'text-orange-400'];
const RANK_BG = ['bg-amber-500/15 border-amber-500/25', 'bg-gray-500/10 border-gray-500/20', 'bg-orange-500/12 border-orange-500/20'];
const RANK_EMOJI = ['🏆', '🥈', '🥉'];

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PartyLeaderboard({ party }: { party: PartyItem }) {
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
            <><span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />Terminée{party.duration ? ` • ${party.duration}` : ''}</>
          )}
        </div>
        <span className="text-xs text-gray-600">{formatDate(party.startedAt)}</span>
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
                member.isMe ? 'bg-violet-500/30 border-2 border-violet-500/50 text-violet-300' : 'bg-white/8 text-white'
              }`}>
                {member.avatar.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${member.isMe ? 'text-violet-300' : RANK_COLORS[actualRank]}`}>
                  {member.isMe ? 'Vous' : member.name}
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
          return (
            <div
              key={member.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                member.isMe ? 'bg-violet-500/10 border-violet-500/20' : 'border-transparent hover:bg-white/4'
              }`}
            >
              <span className="w-5 text-center text-xs font-bold text-gray-600">
                {idx < 3 ? RANK_EMOJI[idx] : `#${idx + 1}`}
              </span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                member.isMe ? 'bg-violet-500/30 text-violet-300 border border-violet-500/40' : 'bg-white/8 text-gray-300'
              }`}>
                {member.avatar.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${member.isMe ? 'text-violet-300' : 'text-gray-200'}`}>
                    {member.isMe ? 'Vous' : member.name}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{member.verres} 🥤 · {member.bouteilles} 🍾</span>
                </div>
                <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${member.isMe ? 'bg-violet-500' : 'bg-white/20'}`}
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
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<GroupSummary | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<GroupDetail | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewParty, setShowNewParty] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupEmoji, setNewGroupEmoji] = useState('🍺');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newPartyName, setNewPartyName] = useState('');

  const fetchGroups = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await api.groups.getAll(token);
      setGroups(data);
      return data;
    } catch {
      return [];
    }
  }, []);

  const loadDetail = useCallback(async (groupId: string) => {
    const token = getToken();
    if (!token) return;
    setLoadingDetail(true);
    try {
      const detail = await api.groups.getOne(token, groupId);
      setSelectedDetail(detail);
      setSelectedPartyId(detail.parties[0]?.id ?? null);
    } catch {
      setSelectedDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoadingGroups(true);
      const token = getToken();
      if (!token) { setLoadingGroups(false); return; }
      try {
        const data = await api.groups.getAll(token);
        setGroups(data);
        if (data.length > 0) {
          setSelectedSummary(data[0]);
          const detail = await api.groups.getOne(token, data[0].id);
          setSelectedDetail(detail);
          setSelectedPartyId(detail.parties[0]?.id ?? null);
        }
      } catch {
        /* ignore */
      } finally {
        setLoadingGroups(false);
      }
    };
    init();
  }, []);

  async function selectGroup(summary: GroupSummary) {
    setSelectedSummary(summary);
    setSelectedDetail(null);
    await loadDetail(summary.id);
  }

  async function createGroup() {
    if (!newGroupName.trim()) return;
    const token = getToken();
    if (!token) return;
    try {
      await api.groups.create(token, {
        name: newGroupName.trim(),
        emoji: newGroupEmoji,
        description: newGroupDesc.trim() || undefined,
      });
      const data = await fetchGroups();
      if (data && data.length > 0) {
        const last = data[data.length - 1];
        setSelectedSummary(last);
        await loadDetail(last.id);
      }
      setShowNewGroup(false);
      setNewGroupName('');
      setNewGroupDesc('');
    } catch {
      /* ignore */
    }
  }

  async function createParty() {
    if (!newPartyName.trim() || !selectedSummary) return;
    const token = getToken();
    if (!token) return;
    try {
      await api.groups.createParty(token, selectedSummary.id, newPartyName.trim());
      await Promise.all([fetchGroups(), loadDetail(selectedSummary.id)]);
      setShowNewParty(false);
      setNewPartyName('');
    } catch {
      /* ignore */
    }
  }

  const selectedParty: PartyItem | undefined = selectedDetail?.parties.find((p) => p.id === selectedPartyId);
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

      {loadingGroups ? (
        <div className="flex items-center justify-center py-20 text-gray-600 text-sm">Chargement…</div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <span className="text-5xl">👥</span>
          <p className="text-white font-semibold">Aucun groupe pour l'instant</p>
          <p className="text-gray-500 text-sm">Crée ton premier groupe pour tracker les soirées avec tes amis !</p>
          <button onClick={() => setShowNewGroup(true)} className="mt-2 px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-colors">
            Créer un groupe 🚀
          </button>
        </div>
      ) : (
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
                  selectedSummary?.id === g.id
                    ? 'bg-violet-500/15 border-violet-500/25 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                    : 'border-white/6 hover:border-white/12 hover:bg-white/4'
                }`}
                style={selectedSummary?.id !== g.id ? { background: 'rgba(255,255,255,0.02)' } : {}}
              >
                <span className="text-2xl">{g.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold truncate ${selectedSummary?.id === g.id ? 'text-violet-200' : 'text-white'}`}>
                      {g.name}
                    </p>
                    {g.hasActiveParty && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{g.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">{g.memberCount} membres</p>
                  <p className="text-xs text-gray-600">{g.partyCount} soirée{g.partyCount !== 1 ? 's' : ''}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Group detail */}
          <div className="col-span-8">
            {selectedSummary && (
              <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>

                {/* Group header */}
                <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedSummary.emoji}</span>
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedSummary.name}</h2>
                      <p className="text-xs text-gray-500">{selectedSummary.description} · {selectedSummary.memberCount} membres</p>
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

                {/* Content */}
                {loadingDetail ? (
                  <div className="flex items-center justify-center py-20 text-gray-600 text-sm">Chargement…</div>
                ) : selectedDetail && selectedDetail.parties.length > 0 ? (
                  <>
                    <div className="flex items-center gap-1 px-4 pt-4 pb-0 overflow-x-auto">
                      {selectedDetail.parties.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPartyId(p.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                            selectedPartyId === p.id
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
            )}
          </div>
        </div>
      )}

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
      {showNewParty && selectedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl border border-white/12 p-6 space-y-5" style={{ background: 'rgba(10,10,15,0.98)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Lancer une soirée</h2>
                <p className="text-xs text-gray-500 mt-0.5">dans {selectedSummary.emoji} {selectedSummary.name}</p>
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
