'use client';

import { useState } from 'react';

type LogLevel = 'info' | 'warn' | 'error' | 'success';
type LogCategory = 'auth' | 'user' | 'device' | 'system' | 'payment' | 'security';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  actor?: string;
  target?: string;
  ip?: string;
  details?: string;
}

const LOGS: LogEntry[] = [
  { id: 'l001', timestamp: '2026-03-09T14:32:11', level: 'error', category: 'device', message: 'Capteur CO₂ défaillant détecté', actor: 'SYSTÈME', target: 'FizzTap Pro #2 (FTP-2024-002)', ip: '10.0.0.14', details: 'Valeur hors plage : -12.3 ppm. Seuil minimal : 0 ppm.' },
  { id: 'l002', timestamp: '2026-03-09T14:28:44', level: 'warn', category: 'security', message: 'Tentatives de connexion répétées échouées', actor: 'unknown@mail.com', ip: '185.220.101.33', details: '7 tentatives en 3 minutes depuis une IP non reconnue.' },
  { id: 'l003', timestamp: '2026-03-09T14:15:02', level: 'success', category: 'user', message: 'Compte utilisateur créé', actor: 'emma.b@gmail.com', target: 'User #10 (EmmaB)' },
  { id: 'l004', timestamp: '2026-03-09T13:58:30', level: 'info', category: 'auth', message: 'Connexion réussie', actor: 'thomas.martin@gmail.com', ip: '82.64.112.45' },
  { id: 'l005', timestamp: '2026-03-09T13:45:17', level: 'info', category: 'device', message: 'Appareil enregistré', actor: 'ThomasM', target: 'FizzTap Standard (FTS-2024-007)' },
  { id: 'l006', timestamp: '2026-03-09T13:22:08', level: 'warn', category: 'device', message: 'Appareil hors ligne depuis 72h', target: 'FizzCap Basic (FCB-2024-201)', details: 'Dernière connexion : 2026-03-06T08:11:22' },
  { id: 'l007', timestamp: '2026-03-09T12:55:44', level: 'error', category: 'system', message: 'Erreur base de données — timeout', actor: 'SYSTÈME', ip: '10.0.0.1', details: 'Query timeout après 30s. Table: sessions. Requête relancée avec succès.' },
  { id: 'l008', timestamp: '2026-03-09T12:41:19', level: 'success', category: 'user', message: 'Rôle utilisateur modifié', actor: 'thomas.martin@gmail.com (admin)', target: 'NicoP → moderator' },
  { id: 'l009', timestamp: '2026-03-09T12:08:33', level: 'info', category: 'auth', message: 'Déconnexion', actor: 'alex.dupont@gmail.com', ip: '78.192.44.201' },
  { id: 'l010', timestamp: '2026-03-09T11:44:22', level: 'warn', category: 'security', message: 'Accès back-office depuis IP inconnue', actor: 'thomas.martin@gmail.com', ip: '195.154.37.218', details: 'Première connexion depuis cette adresse IP.' },
  { id: 'l011', timestamp: '2026-03-09T11:21:05', level: 'success', category: 'device', message: 'Firmware mis à jour', target: 'FizzCap Elite (FCE-2024-089)', details: 'v1.9.2 → v1.9.3' },
  { id: 'l012', timestamp: '2026-03-09T10:58:47', level: 'error', category: 'payment', message: 'Échec de paiement abonnement', actor: 'camille.r@free.fr', details: 'Carte refusée. Code erreur : insufficient_funds.' },
  { id: 'l013', timestamp: '2026-03-09T10:33:14', level: 'info', category: 'user', message: 'Export données demandé (RGPD)', actor: 'sophie.b@outlook.fr' },
  { id: 'l014', timestamp: '2026-03-09T10:11:38', level: 'success', category: 'auth', message: 'Inscription vérifiée', actor: 'SYSTÈME', target: 'paul.garnier@outlook.com' },
  { id: 'l015', timestamp: '2026-03-09T09:47:22', level: 'warn', category: 'system', message: 'Utilisation CPU élevée', actor: 'SYSTÈME', ip: '10.0.0.1', details: 'CPU à 87% pendant 5 minutes. Processus : image-processing-worker.' },
  { id: 'l016', timestamp: '2026-03-09T09:22:11', level: 'error', category: 'security', message: 'Compte utilisateur banni', actor: 'thomas.martin@gmail.com (admin)', target: 'maxime.lb@gmail.com (MaximeLB)', details: 'Raison : comportement abusif répété.' },
  { id: 'l017', timestamp: '2026-03-09T08:55:03', level: 'info', category: 'system', message: 'Démarrage du serveur', actor: 'SYSTÈME', details: 'Node.js 20.11.0 — NestJS 10.3.2' },
  { id: 'l018', timestamp: '2026-03-09T08:30:00', level: 'success', category: 'system', message: 'Backup base de données effectué', actor: 'SYSTÈME', details: 'Durée : 4m12s — Taille : 2.3 GB' },
];

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
  const [levelFilter, setLevelFilter] = useState<'all' | LogLevel>('all');
  const [catFilter, setCatFilter] = useState<'all' | LogCategory>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const filtered = LOGS.filter(l => {
    const matchLevel = levelFilter === 'all' || l.level === levelFilter;
    const matchCat = catFilter === 'all' || l.category === catFilter;
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase())
      || (l.actor || '').toLowerCase().includes(search.toLowerCase())
      || (l.target || '').toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchCat && matchSearch;
  });

  const counts = {
    error: LOGS.filter(l => l.level === 'error').length,
    warn: LOGS.filter(l => l.level === 'warn').length,
    info: LOGS.filter(l => l.level === 'info').length,
    success: LOGS.filter(l => l.level === 'success').length,
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 text-sm font-medium hover:bg-amber-500/20 transition-colors">
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
            <div className="text-2xl font-mono font-bold mb-1 text-white">{counts[lvl]}</div>
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
          {filtered.map(log => (
            <div key={log.id}>
              <div
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${expandedId === log.id ? 'bg-white/4' : 'hover:bg-white/2'}`}
                onClick={() => setExpandedId(v => v === log.id ? null : log.id)}
              >
                {/* Level badge */}
                <span className={`shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none ${LEVEL_STYLES[log.level]}`}>
                  {LEVEL_ICONS[log.level]}
                </span>

                {/* Timestamp */}
                <div className="shrink-0 w-[130px]">
                  <div className="text-gray-400">{formatTime(log.timestamp)}</div>
                  <div className="text-gray-700">{formatDate(log.timestamp)}</div>
                </div>

                {/* Category */}
                <span className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${CAT_STYLES[log.category]}`}>
                  {CAT_LABELS[log.category].toUpperCase()}
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

          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-gray-600 font-sans text-sm">Aucun log correspondant aux filtres.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
