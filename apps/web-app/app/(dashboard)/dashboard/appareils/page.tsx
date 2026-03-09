'use client';

import { useState } from 'react';

type DeviceStatus = 'active' | 'idle' | 'offline' | 'pairing';
type DeviceType = 'tireuse' | 'capsule' | 'thermometre' | 'balance';

type Session = {
  startedAt: string;
  duration: string;
  glasses: number;
  bottles: number;
  participants: number;
  group: string;
};

type Device = {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  serialNumber: string;
  status: DeviceStatus;
  battery: number | null; // null = branché secteur
  signal: number; // 0-4
  firmware: string;
  lastSeen: string;
  pairedAt: string;
  totalGlasses: number;
  totalSessions: number;
  totalBottles: number;
  temperature: number | null;
  flowRate: number | null; // mL/s si en cours de tirage
  pressure: number | null; // bar
  co2Level: number | null; // %
  kegLevel: number | null; // % restant dans le fût
  location: string;
  ipAddress: string;
  macAddress: string;
  currentSession: Session | null;
  alerts: string[];
};

const DEVICES: Device[] = [
  {
    id: '1',
    name: 'Tireuse Salon',
    type: 'tireuse',
    model: 'FizzUp Pro X1',
    serialNumber: 'FZP-X1-2024-001',
    status: 'active',
    battery: null,
    signal: 4,
    firmware: '2.4.1',
    lastSeen: 'En ligne',
    pairedAt: '12 jan. 2024',
    totalGlasses: 1284,
    totalSessions: 47,
    totalBottles: 214,
    temperature: 4.2,
    flowRate: 18.5,
    pressure: 1.4,
    co2Level: 78,
    kegLevel: 62,
    location: 'Salon',
    ipAddress: '192.168.1.42',
    macAddress: 'A4:B2:C3:D1:E5:F6',
    currentSession: {
      startedAt: '21h30',
      duration: '1h 24min',
      glasses: 23,
      bottles: 4,
      participants: 6,
      group: 'Les Potes du Jeudi',
    },
    alerts: [],
  },
  {
    id: '2',
    name: 'Tireuse Cave',
    type: 'tireuse',
    model: 'FizzUp Pro X1',
    serialNumber: 'FZP-X1-2024-002',
    status: 'idle',
    battery: null,
    signal: 3,
    firmware: '2.4.1',
    lastSeen: 'Il y a 3h',
    pairedAt: '18 fév. 2024',
    totalGlasses: 876,
    totalSessions: 31,
    totalBottles: 146,
    temperature: 3.8,
    flowRate: null,
    pressure: 1.3,
    co2Level: 45,
    kegLevel: 15,
    location: 'Cave',
    ipAddress: '192.168.1.43',
    macAddress: 'A4:B2:C3:D1:E5:F7',
    currentSession: null,
    alerts: ['Niveau CO₂ bas — pensez à recharger la bouteille', 'Fût presque vide (15%)'],
  },
  {
    id: '3',
    name: 'Capsuleur Cuisine',
    type: 'capsule',
    model: 'FizzUp Cap 2',
    serialNumber: 'FZC-2-2024-014',
    status: 'active',
    battery: 82,
    signal: 4,
    firmware: '1.2.0',
    lastSeen: 'En ligne',
    pairedAt: '5 mars 2024',
    totalGlasses: 342,
    totalSessions: 47,
    totalBottles: 57,
    temperature: null,
    flowRate: null,
    pressure: null,
    co2Level: null,
    kegLevel: null,
    location: 'Cuisine',
    ipAddress: '192.168.1.51',
    macAddress: 'B1:C3:D4:E2:F6:A7',
    currentSession: {
      startedAt: '21h30',
      duration: '1h 24min',
      glasses: 8,
      bottles: 2,
      participants: 6,
      group: 'Les Potes du Jeudi',
    },
    alerts: [],
  },
  {
    id: '4',
    name: 'Thermomètre Frigo',
    type: 'thermometre',
    model: 'FizzUp Thermo+',
    serialNumber: 'FZT-P-2024-007',
    status: 'idle',
    battery: 61,
    signal: 3,
    firmware: '1.0.5',
    lastSeen: 'Il y a 2min',
    pairedAt: '20 janv. 2024',
    totalGlasses: 0,
    totalSessions: 0,
    totalBottles: 0,
    temperature: 5.1,
    flowRate: null,
    pressure: null,
    co2Level: null,
    kegLevel: null,
    location: 'Cuisine',
    ipAddress: '192.168.1.55',
    macAddress: 'C2:D4:E5:F3:A7:B8',
    currentSession: null,
    alerts: ['Température légèrement haute (idéal < 4°C)'],
  },
  {
    id: '5',
    name: 'Balance Terrasse',
    type: 'balance',
    model: 'FizzUp Scale Pro',
    serialNumber: 'FZS-P-2024-003',
    status: 'offline',
    battery: 12,
    signal: 0,
    firmware: '1.1.2',
    lastSeen: 'Il y a 2 jours',
    pairedAt: '1 fév. 2024',
    totalGlasses: 198,
    totalSessions: 14,
    totalBottles: 33,
    temperature: null,
    flowRate: null,
    pressure: null,
    co2Level: null,
    kegLevel: null,
    location: 'Terrasse',
    ipAddress: '—',
    macAddress: 'D3:E5:F6:A4:B8:C9',
    currentSession: null,
    alerts: ['Batterie critique (12%) — appareil hors ligne', 'Connexion perdue'],
  },
];

const TYPE_LABELS: Record<DeviceType, string> = {
  tireuse: 'Tireuse connectée',
  capsule: 'Capsuleur',
  thermometre: 'Thermomètre',
  balance: 'Balance de fût',
};

const TYPE_ICONS: Record<DeviceType, string> = {
  tireuse: '🍺',
  capsule: '🍾',
  thermometre: '🌡️',
  balance: '⚖️',
};

const STATUS_CONFIG = {
  active: { label: 'En cours', dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/25' },
  idle: { label: 'En veille', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  offline: { label: 'Hors ligne', dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  pairing: { label: 'Appairage…', dot: 'bg-violet-400 animate-pulse', text: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
};

function SignalBars({ level }: { level: number }) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 rounded-sm transition-colors ${
            i <= level ? 'bg-emerald-400' : 'bg-white/15'
          }`}
          style={{ height: `${4 + i * 3}px` }}
        />
      ))}
    </div>
  );
}

function BatteryIcon({ level }: { level: number }) {
  const color = level <= 20 ? 'text-red-400' : level <= 40 ? 'text-amber-400' : 'text-emerald-400';
  const fillColor = level <= 20 ? 'bg-red-400' : level <= 40 ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-7 h-3.5 rounded-sm border border-white/25 flex items-center px-[2px]">
        <div className={`h-2 rounded-[1px] transition-all ${fillColor}`} style={{ width: `${(level / 100) * 18}px` }} />
        <div className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-1 h-2 rounded-r-sm bg-white/25" />
      </div>
      <span className={`text-xs font-semibold ${color}`}>{level}%</span>
    </div>
  );
}

function StatPill({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-white/4 border border-white/6">
      <span className="text-[10px] text-gray-500">{icon} {label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function DeviceCard({ device, onSelect, selected }: { device: Device; onSelect: () => void; selected: boolean }) {
  const sc = STATUS_CONFIG[device.status];

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border p-5 flex flex-col gap-4 cursor-pointer transition-all ${
        selected
          ? 'border-violet-500/50 shadow-lg shadow-violet-500/5'
          : device.status === 'offline'
          ? 'border-white/6 opacity-70 hover:opacity-90 hover:border-white/12'
          : 'border-white/10 hover:border-violet-500/30'
      }`}
      style={{ background: selected ? 'rgba(139,92,246,0.06)' : device.status === 'offline' ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.03)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
            device.status === 'active' ? 'bg-violet-500/15' :
            device.status === 'offline' ? 'bg-white/5' : 'bg-white/8'
          }`}>
            {TYPE_ICONS[device.type]}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{device.name}</h3>
            <p className="text-xs text-gray-500">{TYPE_LABELS[device.type]} · {device.model}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${sc.bg} ${sc.text} shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          {sc.label}
        </div>
      </div>

      {/* Alerts */}
      {device.alerts.length > 0 && (
        <div className="space-y-1.5">
          {device.alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/20">
              <span className="text-amber-400 text-xs shrink-0">⚠</span>
              <span className="text-xs text-amber-300">{alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Session en cours */}
      {device.currentSession && (
        <div className="px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Session en cours</span>
            <span className="text-[10px] text-violet-300 font-medium">{device.currentSession.duration}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-lg font-black text-white">{device.currentSession.glasses}</p>
              <p className="text-[10px] text-gray-500">verres</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">{device.currentSession.bottles}</p>
              <p className="text-[10px] text-gray-500">bouteilles</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">{device.currentSession.participants}</p>
              <p className="text-[10px] text-gray-500">participants</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-1.5">· {device.currentSession.group} · Depuis {device.currentSession.startedAt}</p>
        </div>
      )}

      {/* Métriques temps réel */}
      <div className="grid grid-cols-2 gap-2">
        {device.temperature !== null && (
          <StatPill icon="🌡️" label="Température" value={`${device.temperature}°C`} />
        )}
        {device.flowRate !== null && (
          <StatPill icon="💧" label="Débit" value={`${device.flowRate} mL/s`} />
        )}
        {device.pressure !== null && (
          <StatPill icon="🔵" label="Pression" value={`${device.pressure} bar`} />
        )}
        {device.co2Level !== null && (
          <StatPill
            icon="🫧"
            label="CO₂"
            value={`${device.co2Level}%`}
          />
        )}
        {device.kegLevel !== null && (
          <div className="flex flex-col gap-1.5 px-3 py-2 rounded-lg bg-white/4 border border-white/6 col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">🍺 Niveau du fût</span>
              <span className={`text-xs font-bold ${device.kegLevel < 20 ? 'text-red-400' : device.kegLevel < 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {device.kegLevel}%
              </span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  device.kegLevel < 20 ? 'bg-red-500' : device.kegLevel < 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${device.kegLevel}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats globales */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        <div className="flex-1 text-center">
          <p className="text-base font-black text-violet-300">{device.totalGlasses.toLocaleString()}</p>
          <p className="text-[10px] text-gray-600">verres totaux</p>
        </div>
        <div className="w-px h-8 bg-white/8" />
        <div className="flex-1 text-center">
          <p className="text-base font-black text-white">{device.totalSessions}</p>
          <p className="text-[10px] text-gray-600">sessions</p>
        </div>
        <div className="w-px h-8 bg-white/8" />
        <div className="flex-1 text-center">
          <p className="text-base font-black text-white">{device.totalBottles}</p>
          <p className="text-[10px] text-gray-600">bouteilles</p>
        </div>
      </div>

      {/* Footer: signal + batterie + localisation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SignalBars level={device.signal} />
          {device.battery !== null ? (
            <BatteryIcon level={device.battery} />
          ) : (
            <span className="text-[10px] text-gray-600 flex items-center gap-1">
              <span>⚡</span> Secteur
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-600">📍</span>
          <span className="text-[10px] text-gray-500">{device.location}</span>
          <span className="text-[10px] text-gray-700">· {device.lastSeen}</span>
        </div>
      </div>
    </div>
  );
}

function DeviceDetail({ device }: { device: Device }) {
  const sc = STATUS_CONFIG[device.status];

  return (
    <div className="space-y-5 sticky top-8">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/15 flex items-center justify-center text-4xl">
            {TYPE_ICONS[device.type]}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{device.name}</h2>
            <p className="text-sm text-gray-400">{device.model}</p>
            <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {sc.label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500 mb-0.5">Numéro de série</p>
            <p className="text-xs font-mono text-gray-300">{device.serialNumber}</p>
          </div>
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500 mb-0.5">Firmware</p>
            <p className="text-xs font-mono text-gray-300">v{device.firmware}</p>
          </div>
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500 mb-0.5">Adresse IP</p>
            <p className="text-xs font-mono text-gray-300">{device.ipAddress}</p>
          </div>
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500 mb-0.5">Adresse MAC</p>
            <p className="text-xs font-mono text-gray-300">{device.macAddress}</p>
          </div>
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500 mb-0.5">Emplacement</p>
            <p className="text-xs text-gray-300">📍 {device.location}</p>
          </div>
          <div className="rounded-xl bg-white/4 border border-white/6 p-3">
            <p className="text-[10px] text-gray-500 mb-0.5">Appairé le</p>
            <p className="text-xs text-gray-300">{device.pairedAt}</p>
          </div>
        </div>
      </div>

      {/* Métriques live */}
      {(device.temperature !== null || device.pressure !== null || device.co2Level !== null || device.kegLevel !== null) && (
        <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-4">Métriques en temps réel</p>

          <div className="space-y-4">
            {device.temperature !== null && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-400">🌡️ Température bière</span>
                  <span className={`text-xs font-bold ${device.temperature > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {device.temperature}°C
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${device.temperature > 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (device.temperature / 10) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 mt-1">Idéal : 2–5°C</p>
              </div>
            )}
            {device.pressure !== null && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-400">🔵 Pression</span>
                  <span className="text-xs font-bold text-violet-300">{device.pressure} bar</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-violet-500" style={{ width: `${(device.pressure / 3) * 100}%` }} />
                </div>
                <p className="text-[10px] text-gray-600 mt-1">Idéal : 1.2–1.6 bar</p>
              </div>
            )}
            {device.co2Level !== null && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-400">🫧 Niveau CO₂</span>
                  <span className={`text-xs font-bold ${device.co2Level < 30 ? 'text-red-400' : device.co2Level < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {device.co2Level}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${device.co2Level < 30 ? 'bg-red-500' : device.co2Level < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${device.co2Level}%` }}
                  />
                </div>
              </div>
            )}
            {device.kegLevel !== null && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-400">🍺 Niveau du fût</span>
                  <span className={`text-xs font-bold ${device.kegLevel < 20 ? 'text-red-400' : device.kegLevel < 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {device.kegLevel}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${device.kegLevel < 20 ? 'bg-red-500' : device.kegLevel < 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${device.kegLevel}%` }}
                  />
                </div>
                {device.flowRate !== null && (
                  <p className="text-[10px] text-violet-400 mt-1.5 font-medium">⚡ Tirage en cours · {device.flowRate} mL/s</p>
                )}
              </div>
            )}
            {device.battery !== null && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-400">🔋 Batterie</span>
                  <span className={`text-xs font-bold ${device.battery <= 20 ? 'text-red-400' : device.battery <= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {device.battery}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${device.battery <= 20 ? 'bg-red-500' : device.battery <= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${device.battery}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alertes */}
      {device.alerts.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 p-5" style={{ background: 'rgba(245,158,11,0.04)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500/70 mb-3">⚠ Alertes actives</p>
          <div className="space-y-2">
            {device.alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/15">
                <span className="text-amber-400 text-sm shrink-0 mt-0.5">⚠</span>
                <p className="text-xs text-amber-200">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques globales */}
      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-4">Statistiques globales</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-violet-500/10 border border-violet-500/15">
            <p className="text-2xl font-black text-violet-300">{device.totalGlasses.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">verres</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/4 border border-white/8">
            <p className="text-2xl font-black text-white">{device.totalSessions}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">sessions</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/4 border border-white/8">
            <p className="text-2xl font-black text-white">{device.totalBottles}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">bouteilles</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-3">Actions</p>
        <div className="space-y-2">
          {device.status === 'active' && (
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/15 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Terminer la session
            </button>
          )}
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-gray-300 text-sm font-medium hover:bg-white/8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser les données
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-gray-300 text-sm font-medium hover:bg-white/8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Paramètres de l'appareil
          </button>
          {device.firmware !== '2.4.1' && (
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-violet-500/12 border border-violet-500/25 text-violet-300 text-sm font-medium hover:bg-violet-500/18 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Mettre à jour le firmware
            </button>
          )}
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-red-500/70 text-sm font-medium hover:bg-red-500/8 hover:text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
            Désappairer l'appareil
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppareilsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'tous' | DeviceStatus>('tous');

  const selectedDevice = DEVICES.find((d) => d.id === selectedId) ?? null;

  function toggleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  const filtered = statusFilter === 'tous' ? DEVICES : DEVICES.filter((d) => d.status === statusFilter);

  const counts = {
    active: DEVICES.filter((d) => d.status === 'active').length,
    idle: DEVICES.filter((d) => d.status === 'idle').length,
    offline: DEVICES.filter((d) => d.status === 'offline').length,
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes appareils</h1>
          <p className="text-gray-500 text-sm mt-0.5">{DEVICES.length} appareils appairés · {counts.active} actif{counts.active > 1 ? 's' : ''}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 transition-colors text-white text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un appareil
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Appareils total', value: DEVICES.length, color: 'text-white', bg: 'bg-white/4 border-white/8' },
          { label: 'En cours', value: counts.active, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'En veille', value: counts.idle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Hors ligne', value: counts.offline, color: 'text-red-400', bg: 'bg-red-500/8 border-red-500/15' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-white/8 w-fit" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {([
          { key: 'tous', label: 'Tous', count: DEVICES.length },
          { key: 'active', label: 'En cours', count: counts.active },
          { key: 'idle', label: 'En veille', count: counts.idle },
          { key: 'offline', label: 'Hors ligne', count: counts.offline },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === f.key ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Main layout: liste + détail */}
      <div className={`grid gap-6 ${selectedDevice ? 'grid-cols-1 xl:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
        {/* Liste */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 content-start">
          {filtered.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              selected={selectedId === device.id}
              onSelect={() => toggleSelect(device.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-600 text-sm col-span-2 py-12 text-center">Aucun appareil dans cette catégorie.</p>
          )}
        </div>

        {/* Panneau détail — only shown when a device is selected */}
        {selectedDevice && <DeviceDetail device={selectedDevice} />}
      </div>
    </div>
  );
}
