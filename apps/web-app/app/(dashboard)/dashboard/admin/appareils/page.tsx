'use client';

import { useState } from 'react';

type DeviceType = 'tireuse' | 'decapsuleur' | 'verre';
type DeviceStatus = 'online' | 'idle' | 'offline' | 'error';

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  serial: string;
  firmware: string;
  status: DeviceStatus;
  owner: string;
  ownerEmail: string;
  registeredAt: string;
  lastSeen: string;
  totalUses: number;
  totalDrinks: number;
  ip: string;
  mac: string;
  battery?: number;
  signal: number;
  alerts: string[];
}

const DEVICES: Device[] = [
  { id: 'd1', name: 'FizzTap Pro #1', type: 'tireuse', serial: 'FTP-2024-001', firmware: '2.4.1', status: 'online', owner: 'ThomasM', ownerEmail: 'thomas.martin@gmail.com', registeredAt: '2024-02-10', lastSeen: 'Il y a 2 min', totalUses: 312, totalDrinks: 1248, ip: '192.168.1.101', mac: 'A1:B2:C3:D4:E5:F6', signal: 95, alerts: [] },
  { id: 'd2', name: 'FizzCap Elite', type: 'decapsuleur', serial: 'FCE-2024-089', firmware: '1.9.3', status: 'online', owner: 'SophieB', ownerEmail: 'sophie.b@outlook.fr', registeredAt: '2024-03-15', lastSeen: 'Il y a 5 min', totalUses: 891, totalDrinks: 891, ip: '192.168.0.45', mac: 'B2:C3:D4:E5:F6:A1', battery: 82, signal: 88, alerts: [] },
  { id: 'd3', name: 'FizzGlass NFC x4', type: 'verre', serial: 'FGN-2024-034', firmware: '3.1.0', status: 'idle', owner: 'AlexD', ownerEmail: 'alex.dupont@gmail.com', registeredAt: '2024-04-22', lastSeen: 'Il y a 1h', totalUses: 445, totalDrinks: 445, ip: '192.168.1.203', mac: 'C3:D4:E5:F6:A1:B2', battery: 67, signal: 72, alerts: [] },
  { id: 'd4', name: 'FizzTap Pro #2', type: 'tireuse', serial: 'FTP-2024-002', firmware: '2.3.8', status: 'error', owner: 'CamilleR', ownerEmail: 'camille.r@free.fr', registeredAt: '2024-05-08', lastSeen: 'Il y a 2h', totalUses: 189, totalDrinks: 756, ip: '10.0.0.14', mac: 'D4:E5:F6:A1:B2:C3', signal: 41, alerts: ['Capteur CO₂ défaillant', 'Température élevée'] },
  { id: 'd5', name: 'FizzCap Basic', type: 'decapsuleur', serial: 'FCB-2024-201', firmware: '1.8.0', status: 'offline', owner: 'LeaD', ownerEmail: 'lea.dupuis@yahoo.fr', registeredAt: '2024-06-30', lastSeen: 'Il y a 3 jours', totalUses: 156, totalDrinks: 156, ip: '—', mac: 'E5:F6:A1:B2:C3:D4', battery: 12, signal: 0, alerts: ['Batterie critique'] },
  { id: 'd6', name: 'FizzGlass NFC x2', type: 'verre', serial: 'FGN-2024-078', firmware: '3.0.5', status: 'online', owner: 'JulieM', ownerEmail: 'julie.m@gmail.com', registeredAt: '2024-07-14', lastSeen: 'Il y a 10 min', totalUses: 267, totalDrinks: 267, ip: '192.168.2.55', mac: 'F6:A1:B2:C3:D4:E5', battery: 91, signal: 97, alerts: [] },
  { id: 'd7', name: 'FizzTap Standard', type: 'tireuse', serial: 'FTS-2024-007', firmware: '2.2.1', status: 'idle', owner: 'ThomasM', ownerEmail: 'thomas.martin@gmail.com', registeredAt: '2024-08-01', lastSeen: 'Il y a 30 min', totalUses: 78, totalDrinks: 312, ip: '192.168.1.102', mac: 'A2:B3:C4:D5:E6:F7', signal: 84, alerts: [] },
  { id: 'd8', name: 'FizzCap Elite v2', type: 'decapsuleur', serial: 'FCE-2024-112', firmware: '1.9.5', status: 'online', owner: 'EmmaB', ownerEmail: 'emma.b@gmail.com', registeredAt: '2024-09-18', lastSeen: 'Il y a 20 min', totalUses: 334, totalDrinks: 334, ip: '10.0.1.77', mac: 'B3:C4:D5:E6:F7:A2', battery: 75, signal: 91, alerts: [] },
];

const TYPE_LABELS: Record<DeviceType, string> = { tireuse: 'Tireuse', decapsuleur: 'Décapsuleur', verre: 'Verre NFC' };
const TYPE_ICONS: Record<DeviceType, string> = { tireuse: '🍺', decapsuleur: '🔩', verre: '🥂' };
const TYPE_STYLES: Record<DeviceType, string> = {
  tireuse: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  decapsuleur: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  verre: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
};

const STATUS_STYLES: Record<DeviceStatus, string> = {
  online: 'bg-emerald-500/15 text-emerald-400',
  idle: 'bg-amber-500/15 text-amber-400',
  offline: 'bg-white/6 text-gray-500',
  error: 'bg-red-500/15 text-red-400',
};
const STATUS_DOT: Record<DeviceStatus, string> = {
  online: 'bg-emerald-400 animate-pulse',
  idle: 'bg-amber-400',
  offline: 'bg-gray-600',
  error: 'bg-red-400 animate-pulse',
};
const STATUS_LABELS: Record<DeviceStatus, string> = { online: 'En ligne', idle: 'Inactif', offline: 'Hors ligne', error: 'Erreur' };

function SignalBars({ level }: { level: number }) {
  const bars = [25, 50, 75, 100];
  return (
    <div className="flex items-end gap-0.5 h-4">
      {bars.map((threshold, i) => (
        <div
          key={i}
          style={{ height: `${(i + 1) * 25}%` }}
          className={`w-1 rounded-sm transition-colors ${level >= threshold ? 'bg-emerald-400' : 'bg-white/10'}`}
        />
      ))}
    </div>
  );
}

export default function AdminDevicesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | DeviceType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | DeviceStatus>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const filtered = DEVICES.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
      || d.serial.toLowerCase().includes(search.toLowerCase())
      || d.owner.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total: DEVICES.length,
    online: DEVICES.filter(d => d.status === 'online').length,
    errors: DEVICES.filter(d => d.status === 'error').length,
    totalDrinks: DEVICES.reduce((acc, d) => acc + d.totalDrinks, 0),
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Gestion des appareils</h1>
          <p className="text-sm text-gray-500 mt-1">{DEVICES.length} appareils enregistrés</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 text-sm font-medium hover:bg-amber-500/20 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total appareils', value: stats.total, icon: '📡', color: 'text-white' },
          { label: 'En ligne', value: stats.online, icon: '✅', color: 'text-emerald-400' },
          { label: 'En erreur', value: stats.errors, icon: '⚠️', color: 'text-red-400' },
          { label: 'Verres servis', value: stats.totalDrinks.toLocaleString(), icon: '🍺', color: 'text-violet-400' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-white/8 p-4" style={{ background: 'var(--fz-bg-surface)' }}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={`grid gap-6 transition-all ${selectedDevice ? 'xl:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
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
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher nom, serial, propriétaire…"
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 border border-white/8 bg-white/4 focus:outline-none focus:border-amber-500/40"
              />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as 'all' | DeviceType)} className="px-3 py-2 rounded-xl text-sm text-gray-300 border border-white/8 bg-white/4 focus:outline-none cursor-pointer">
              <option value="all">Tous les types</option>
              <option value="tireuse">Tireuse</option>
              <option value="decapsuleur">Décapsuleur</option>
              <option value="verre">Verre NFC</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'all' | DeviceStatus)} className="px-3 py-2 rounded-xl text-sm text-gray-300 border border-white/8 bg-white/4 focus:outline-none cursor-pointer">
              <option value="all">Tous les statuts</option>
              <option value="online">En ligne</option>
              <option value="idle">Inactif</option>
              <option value="offline">Hors ligne</option>
              <option value="error">Erreur</option>
            </select>
            <span className="text-xs text-gray-600 ml-auto">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {['Appareil', 'Type', 'Statut', 'Propriétaire', 'Signal', 'Total servis', 'Alertes', 'Dernière activité'].map(h => (
                    <th key={h} className="text-left text-[10px] uppercase tracking-widest text-gray-600 font-semibold px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map(d => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDevice(prev => prev?.id === d.id ? null : d)}
                    className={`cursor-pointer transition-colors ${selectedDevice?.id === d.id ? 'bg-amber-500/6' : 'hover:bg-white/3'}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">{d.name}</p>
                        <p className="text-xs text-gray-600">{d.serial}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLES[d.type]}`}>
                        {TYPE_ICONS[d.type]} {TYPE_LABELS[d.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${STATUS_STYLES[d.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[d.status]}`} />
                        {STATUS_LABELS[d.status]}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-300">{d.owner}</p>
                      <p className="text-xs text-gray-600">{d.ownerEmail}</p>
                    </td>
                    <td className="px-4 py-3"><SignalBars level={d.signal} /></td>
                    <td className="px-4 py-3 text-sm text-gray-400">{d.totalDrinks.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {d.alerts.length > 0
                        ? <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">{d.alerts.length} alerte{d.alerts.length > 1 ? 's' : ''}</span>
                        : <span className="text-xs text-gray-700">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{d.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Detail Panel */}
        {selectedDevice && (
          <div className="rounded-2xl border border-white/8 overflow-hidden sticky top-8 h-fit" style={{ background: 'var(--fz-bg-surface)' }}>
            <div className="p-4 border-b border-white/8 flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Détails appareil</h3>
              <button onClick={() => setSelectedDevice(null)} className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-5">
              {/* Header */}
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="text-4xl">{TYPE_ICONS[selectedDevice.type]}</div>
                <div className="text-center">
                  <p className="font-semibold text-white">{selectedDevice.name}</p>
                  <p className="text-xs text-gray-500">{selectedDevice.serial}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLES[selectedDevice.type]}`}>{TYPE_ICONS[selectedDevice.type]} {TYPE_LABELS[selectedDevice.type]}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[selectedDevice.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[selectedDevice.status]}`} />
                    {STATUS_LABELS[selectedDevice.status]}
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {selectedDevice.alerts.length > 0 && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">Alertes actives</p>
                  {selectedDevice.alerts.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-red-300">
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              )}

              {/* Owner */}
              <div className="rounded-xl bg-white/4 border border-white/6 p-3">
                <p className="text-[10px] text-gray-600 uppercase tracking-wide mb-2">Propriétaire</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold">
                    {selectedDevice.owner[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{selectedDevice.owner}</p>
                    <p className="text-xs text-gray-500">{selectedDevice.ownerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Total utilisations', value: selectedDevice.totalUses },
                  { label: 'Total servis', value: selectedDevice.totalDrinks },
                ].map(s => (
                  <div key={s.label} className="rounded-xl bg-white/4 border border-white/6 p-3 text-center">
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px] text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tech info */}
              <div className="space-y-1.5">
                {[
                  { label: 'Firmware', value: `v${selectedDevice.firmware}` },
                  { label: 'Adresse IP', value: selectedDevice.ip },
                  { label: 'Adresse MAC', value: selectedDevice.mac },
                  { label: 'Enregistré le', value: new Date(selectedDevice.registeredAt).toLocaleDateString('fr-FR') },
                  { label: 'Dernière activité', value: selectedDevice.lastSeen },
                  { label: 'Signal', value: `${selectedDevice.signal}%` },
                  ...(selectedDevice.battery !== undefined ? [{ label: 'Batterie', value: `${selectedDevice.battery}%` }] : []),
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0">
                    <span className="text-xs text-gray-500">{row.label}</span>
                    <span className="text-xs text-gray-300 font-medium font-mono">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Forcer mise à jour firmware
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Désactiver l&apos;appareil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
