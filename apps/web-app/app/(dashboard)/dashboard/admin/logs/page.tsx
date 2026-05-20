'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, getToken, type AdminLog } from '../../../../lib/api';
import { exportCsv } from '../../../../lib/csv';

type LogLevel = 'info' | 'warn' | 'error' | 'success';
type LogCategory = 'auth' | 'user' | 'device' | 'system' | 'payment' | 'security';

const LEVEL_STYLES: Record<LogLevel, string> = {
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  warn: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  error: 'bg-red-500/15 text-red-400 border-red-500/20',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};
const LEVEL_ICONS: Record<LogLevel, string> = { info: 'ℹ', warn: '⚠', error: '✕', success: '✓' };
const LEVEL_LABELS: Record<LogLevel, string> = { info: 'Info', warn: 'Warning', error: 'Erreur', success: 'Succès' };

const CAT_LABELS: Record<LogCategory, string> = {
  auth: 'Auth', user: 'Utilisateur', device: 'Appareil',
  system: 'Système', payment: 'Paiement', security: 'Sécurité',
};
const CAT_STYLES: Record<LogCategory, string> = {
  auth: 'text-violet-400 bg-violet-500/10',
  user: 'text-sky-400 bg-sky-500/10',
  device: 'text-cyan-400 bg-cyan-500/10',
  system: 'text-gray-400 bg-white/6',
  payment: 'text-emerald-400 bg-emerald-500/10',
  security: 'text-red-400 bg-red-500/10',
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<'all' | LogLevel>('all');
  const [catFilter, setCatFilter] = useState<'all' | LogCategory>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchLogs = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await api.admin.getLogs(token);
      setLogs(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors du chargement des logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  const filtered = logs.filter(l => {
    const matchLevel = levelFilter === 'all' || l.level === levelFilter;
    const matchCat = catFilter === 'all' || l.category === catFilter;
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase())
      || (l.actor || '').toLowerCase().includes(search.toLowerCase())
      || (l.target || '').toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchCat && matchSearch;
  });

  const counts = {
    error: logs.filter(l => l.level === 'error').length,
    warn: logs.filter(l => l.level === 'warn').length,
    info: logs.filter(l => l.level === 'info').length,
    success: logs.filter(l => l.level === 'success').length,
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Logs & Audit</h1>
          <p className="text-sm text-gray-500 mt-1">Journal complet des événements système</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${autoRefresh ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-white/4 text-gray-400 border-white/8 hover:bg-white/6'}`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
            {autoRefresh ? 'Live' : 'Refresh off'}
          </button>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/4 text-gray-400 border border-white/8 text-sm font-medium hover:bg-white/6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
          <button
            onClick={() => exportCsv(filtered, [
              { key: 'id', label: 'ID' },
              { key: 'timestamp', label: 'Horodatage' },
              { key: 'level', label: 'Niveau' },
              { key: 'category', label: 'Catégorie' },
              { key: 'message', label: 'Message' },
              { key: 'actor', label: 'Acteur' },
              { key: 'target', label: 'Cible' },
              { key: 'ip', label: 'IP' },
              { key: 'details', label: 'Détails' },
            ], `logs_${new Date().toISOString().slice(0, 10)}.csv`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 text-sm font-medium hover:bg-amber-500/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter
          </button>
        </div>
      </div>

      {/* Level counters */}
      <div className="grid grid-cols-4 gap-4">
        {(['error', 'warn', 'success', 'info'] as LogLevel[]).map(lvl => (
          <button
            key={lvl}
            onClick={() => setLevelFilter(v => v === lvl ? 'all' : lvl)}
            className={`rounded-2xl border p-4 text-left transition-all ${levelFilter === lvl ? LEVEL_STYLES[lvl] + ' ring-1 ring-inset' : 'border-white/8 hover:border-white/12'}`}
            style={levelFilter !== lvl ? { background: 'var(--fz-bg-surface)' } : undefined}
          >
            <div className="text-2xl font-mono font-bold mb-1 text-white">{loading ? '—' : counts[lvl]}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${LEVEL_STYLES[lvl]}`}>{LEVEL_ICONS[lvl]}</span>
              {LEVEL_LABELS[lvl]}
            </div>
          </button>
        ))}
      </div>

      {/* Log list */}
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'var(--fz-bg-surface)' }}>
        {/* Filters */}
        <div className="p-4 border-b border-white/8 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher dans les logs…"
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 border border-white/8 bg-white/4 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value as 'all' | LogCategory)} className="px-3 py-2 rounded-xl text-sm text-gray-300 border border-white/8 bg-white/4 focus:outline-none cursor-pointer">
            <option value="all">Toutes les catégories</option>
            {(Object.keys(CAT_LABELS) as LogCategory[]).map(c => (
              <option key={c} value={c}>{CAT_LABELS[c]}</option>
            ))}
          </select>
          <button
            onClick={() => { setLevelFilter('all'); setCatFilter('all'); setSearch(''); }}
            className="px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 border border-white/8 bg-white/4 hover:bg-white/6 transition-colors"
          >
            Réinitialiser
          </button>
          <span className="text-xs text-gray-600 ml-auto">{filtered.length} entrée{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Entries */}
        <div className="divide-y divide-white/4 font-mono text-xs">
          {loading && (
            <div className="px-4 py-12 text-center">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-600 font-sans text-sm">Chargement des logs…</p>
            </div>
          )}

          {!loading && error && (
            <div className="px-4 py-12 text-center">
              <p className="text-red-400 font-sans text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.map(log => (
            <div key={log.id}>
              <div
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${expandedId === log.id ? 'bg-white/4' : 'hover:bg-white/2'}`}
                onClick={() => setExpandedId(v => v === log.id ? null : log.id)}
              >
                {/* Level badge */}
                <span className={`shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none ${LEVEL_STYLES[log.level as LogLevel] ?? 'bg-white/8 text-gray-400 border-white/12'}`}>
                  {LEVEL_ICONS[log.level as LogLevel] ?? '•'}
                </span>

                {/* Timestamp */}
                <div className="shrink-0 w-[130px]">
                  <div className="text-gray-400">{formatTime(log.timestamp)}</div>
                  <div className="text-gray-700">{formatDate(log.timestamp)}</div>
                </div>

                {/* Category */}
                <span className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${CAT_STYLES[log.category as LogCategory] ?? 'text-gray-400 bg-white/6'}`}>
                  {(CAT_LABELS[log.category as LogCategory] ?? log.category).toUpperCase()}
                </span>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 font-sans">{log.message}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {log.actor && <span className="text-gray-600">→ {log.actor}</span>}
                    {log.target && <span className="text-gray-600">↳ {log.target}</span>}
                    {log.ip && <span className="text-gray-700">IP: {log.ip}</span>}
                  </div>
                </div>

                {/* Expand indicator */}
                {log.details && (
                  <svg className={`w-3.5 h-3.5 text-gray-600 shrink-0 mt-1 transition-transform ${expandedId === log.id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>

              {/* Expanded details */}
              {expandedId === log.id && log.details && (
                <div className="px-4 pb-3 ml-[calc(1rem+8px+130px+2.5rem+8px)]">
                  <div className="rounded-xl bg-white/4 border border-white/8 px-3 py-2.5">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1.5 font-sans">Détails</p>
                    <p className="text-gray-300 font-sans text-xs leading-relaxed">{log.details}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {!loading && !error && filtered.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-gray-600 font-sans text-sm">Aucun log correspondant aux filtres.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
