'use client';

import { useState, useEffect } from 'react';
import { useTheme, type Theme } from '../../../providers/ThemeProvider';

type SettingsTab = 'compte' | 'notifications' | 'confidentialite' | 'apparence' | 'danger';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${checked ? 'bg-violet-500' : 'bg-white/15'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-[20px]' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)' }}>
      <div className="px-5 py-3.5 border-b border-white/6 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('compte');

  const [email, setEmail] = useState('marc.albanese@example.com');
  const [editEmail, setEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [editPwd, setEditPwd] = useState(false);

  const [notifs, setNotifs] = useState({
    soireeStart: true,
    soireeEnd: true,
    classementChange: true,
    defiCompleted: true,
    defiExpiring: true,
    amiRequest: true,
    amiAccepted: true,
    groupeInvite: true,
    weeklyRecap: false,
    marketing: false,
    pushEnabled: true,
    emailEnabled: false,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showStats: true,
    showGroups: true,
    showActivity: false,
    allowFriendRequests: true,
    showOnlineStatus: true,
    showInLeaderboard: true,
  });

  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState<'violet' | 'blue' | 'emerald' | 'orange'>('violet');
  const [compactMode, setCompactMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  }, [reduceMotion]);
  useEffect(() => {
    document.documentElement.classList.toggle('compact', compactMode);
  }, [compactMode]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const TABS: { key: SettingsTab; label: string; icon: string }[] = [
    { key: 'compte', label: 'Compte', icon: '👤' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'confidentialite', label: 'Confidentialité', icon: '🔒' },
    { key: 'apparence', label: 'Apparence', icon: '🎨' },
    { key: 'danger', label: 'Zone danger', icon: '⚠️' },
  ];

  const ACCENT_COLORS = [
    { key: 'violet', label: 'Violet', bg: 'bg-violet-500' },
    { key: 'blue', label: 'Bleu', bg: 'bg-blue-500' },
    { key: 'emerald', label: 'Vert', bg: 'bg-emerald-500' },
    { key: 'orange', label: 'Orange', bg: 'bg-orange-500' },
  ] as const;

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-0.5">Gérez votre compte et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar nav */}
        <nav className="space-y-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === t.key
                  ? t.key === 'danger'
                    ? 'bg-red-500/12 border border-red-500/20 text-red-300'
                    : 'bg-violet-500/15 border border-violet-500/20 text-violet-300'
                  : t.key === 'danger'
                  ? 'text-red-500/70 hover:text-red-400 hover:bg-red-500/8 border border-transparent'
                  : 'text-gray-400 hover:text-white hover:bg-white/6 border border-transparent'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-5">

          {/* ---- COMPTE ---- */}
          {activeTab === 'compte' && (
            <>
              <Section title="Informations du compte" icon="👤">
                {/* Email */}
                <div className="py-4 border-b border-white/5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-sm text-white font-medium">Adresse e-mail</p>
                      {!editEmail && <p className="text-xs text-gray-500 mt-0.5">{email}</p>}
                    </div>
                    {!editEmail && (
                      <button onClick={() => { setNewEmail(email); setEditEmail(true); }} className="text-xs text-violet-400 hover:text-violet-300 transition-colors shrink-0">
                        Modifier
                      </button>
                    )}
                  </div>
                  {editEmail && (
                    <div className="space-y-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/4 border border-violet-500/30 text-sm text-white outline-none focus:border-violet-500/60 transition-colors"
                        placeholder="Nouvelle adresse e-mail"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setEmail(newEmail); setEditEmail(false); }} className="px-3 py-1.5 rounded-lg bg-violet-500 text-white text-xs font-semibold hover:bg-violet-600 transition-colors">Enregistrer</button>
                        <button onClick={() => setEditEmail(false)} className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-gray-400 text-xs hover:bg-white/10 transition-colors">Annuler</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="py-4 border-b border-white/5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-sm text-white font-medium">Mot de passe</p>
                      {!editPwd && <p className="text-xs text-gray-500 mt-0.5">••••••••••••</p>}
                    </div>
                    {!editPwd && (
                      <button onClick={() => setEditPwd(true)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors shrink-0">
                        Modifier
                      </button>
                    )}
                  </div>
                  {editPwd && (
                    <div className="space-y-2">
                      <input type="password" placeholder="Mot de passe actuel" className="w-full px-3 py-2 rounded-xl bg-white/4 border border-white/8 text-sm text-white outline-none focus:border-violet-500/40 transition-colors" />
                      <input type="password" placeholder="Nouveau mot de passe" className="w-full px-3 py-2 rounded-xl bg-white/4 border border-white/8 text-sm text-white outline-none focus:border-violet-500/40 transition-colors" />
                      <input type="password" placeholder="Confirmer le nouveau mot de passe" className="w-full px-3 py-2 rounded-xl bg-white/4 border border-white/8 text-sm text-white outline-none focus:border-violet-500/40 transition-colors" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => setEditPwd(false)} className="px-3 py-1.5 rounded-lg bg-violet-500 text-white text-xs font-semibold hover:bg-violet-600 transition-colors">Enregistrer</button>
                        <button onClick={() => setEditPwd(false)} className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-gray-400 text-xs hover:bg-white/10 transition-colors">Annuler</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Abonnement */}
                <SettingRow label="Abonnement" description="FizzUp Premium — Renouvellement le 12 avril 2025">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 font-semibold">💎 Premium</span>
                </SettingRow>

                {/* Langue */}
                <SettingRow label="Langue">
                  <select className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-sm text-white outline-none">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </SettingRow>
              </Section>

              <Section title="Sécurité" icon="🔐">
                <SettingRow label="Authentification à deux facteurs" description="Renforcez la sécurité de votre compte">
                  <button className="px-3 py-1.5 rounded-lg bg-violet-500/12 border border-violet-500/25 text-violet-300 text-xs font-semibold hover:bg-violet-500/20 transition-colors">
                    Activer
                  </button>
                </SettingRow>
                <SettingRow label="Sessions actives" description="2 appareils connectés">
                  <button className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-gray-300 text-xs hover:bg-white/10 transition-colors">
                    Gérer
                  </button>
                </SettingRow>
              </Section>
            </>
          )}

          {/* ---- NOTIFICATIONS ---- */}
          {activeTab === 'notifications' && (
            <>
              <Section title="Canaux" icon="📡">
                <SettingRow label="Notifications push" description="Recevoir des notifications sur cet appareil">
                  <Toggle checked={notifs.pushEnabled} onChange={(v) => setNotifs((p) => ({ ...p, pushEnabled: v }))} />
                </SettingRow>
                <SettingRow label="Notifications par e-mail" description="Résumés et alertes importantes par e-mail">
                  <Toggle checked={notifs.emailEnabled} onChange={(v) => setNotifs((p) => ({ ...p, emailEnabled: v }))} />
                </SettingRow>
              </Section>

              <Section title="Soirées" icon="🎉">
                <SettingRow label="Début de soirée" description="Quand une soirée commence dans ton groupe">
                  <Toggle checked={notifs.soireeStart} onChange={(v) => setNotifs((p) => ({ ...p, soireeStart: v }))} />
                </SettingRow>
                <SettingRow label="Fin de soirée" description="Résumé et statistiques de fin de soirée">
                  <Toggle checked={notifs.soireeEnd} onChange={(v) => setNotifs((p) => ({ ...p, soireeEnd: v }))} />
                </SettingRow>
              </Section>

              <Section title="Classement & Défis" icon="🏆">
                <SettingRow label="Changement de rang" description="Quand ta position dans le classement change">
                  <Toggle checked={notifs.classementChange} onChange={(v) => setNotifs((p) => ({ ...p, classementChange: v }))} />
                </SettingRow>
                <SettingRow label="Défi complété" description="Quand tu complètes un défi">
                  <Toggle checked={notifs.defiCompleted} onChange={(v) => setNotifs((p) => ({ ...p, defiCompleted: v }))} />
                </SettingRow>
                <SettingRow label="Défi bientôt expiré" description="Rappel 24h avant l'expiration d'un défi actif">
                  <Toggle checked={notifs.defiExpiring} onChange={(v) => setNotifs((p) => ({ ...p, defiExpiring: v }))} />
                </SettingRow>
              </Section>

              <Section title="Social" icon="👥">
                <SettingRow label="Demandes d'amis" description="Quand quelqu'un t'envoie une demande d'ami">
                  <Toggle checked={notifs.amiRequest} onChange={(v) => setNotifs((p) => ({ ...p, amiRequest: v }))} />
                </SettingRow>
                <SettingRow label="Ami ajouté" description="Quand ta demande d'ami est acceptée">
                  <Toggle checked={notifs.amiAccepted} onChange={(v) => setNotifs((p) => ({ ...p, amiAccepted: v }))} />
                </SettingRow>
                <SettingRow label="Invitation à un groupe" description="Quand tu es invité à rejoindre un groupe">
                  <Toggle checked={notifs.groupeInvite} onChange={(v) => setNotifs((p) => ({ ...p, groupeInvite: v }))} />
                </SettingRow>
              </Section>

              <Section title="Récapitulatifs" icon="📊">
                <SettingRow label="Récap hebdomadaire" description="Résumé de ton activité chaque lundi">
                  <Toggle checked={notifs.weeklyRecap} onChange={(v) => setNotifs((p) => ({ ...p, weeklyRecap: v }))} />
                </SettingRow>
                <SettingRow label="Offres et nouveautés" description="Actualités FizzUp et offres spéciales">
                  <Toggle checked={notifs.marketing} onChange={(v) => setNotifs((p) => ({ ...p, marketing: v }))} />
                </SettingRow>
              </Section>
            </>
          )}

          {/* ---- CONFIDENTIALITÉ ---- */}
          {activeTab === 'confidentialite' && (
            <>
              <Section title="Profil public" icon="👁">
                <SettingRow label="Profil visible publiquement" description="Ton profil peut être vu par tous les utilisateurs FizzUp">
                  <Toggle checked={privacy.publicProfile} onChange={(v) => setPrivacy((p) => ({ ...p, publicProfile: v }))} />
                </SettingRow>
                <SettingRow label="Afficher mes statistiques" description="Verres, soirées et autres chiffres sur ton profil public">
                  <Toggle checked={privacy.showStats} onChange={(v) => setPrivacy((p) => ({ ...p, showStats: v }))} />
                </SettingRow>
                <SettingRow label="Afficher mes groupes" description="La liste des groupes que tu as rejoints">
                  <Toggle checked={privacy.showGroups} onChange={(v) => setPrivacy((p) => ({ ...p, showGroups: v }))} />
                </SettingRow>
                <SettingRow label="Afficher mon activité récente" description="Les soirées et défis récents visibles par les autres">
                  <Toggle checked={privacy.showActivity} onChange={(v) => setPrivacy((p) => ({ ...p, showActivity: v }))} />
                </SettingRow>
              </Section>

              <Section title="Social" icon="👥">
                <SettingRow label="Autoriser les demandes d'amis" description="Les autres utilisateurs peuvent t'envoyer une demande">
                  <Toggle checked={privacy.allowFriendRequests} onChange={(v) => setPrivacy((p) => ({ ...p, allowFriendRequests: v }))} />
                </SettingRow>
                <SettingRow label="Afficher mon statut en ligne" description="Tes amis peuvent voir si tu es connecté">
                  <Toggle checked={privacy.showOnlineStatus} onChange={(v) => setPrivacy((p) => ({ ...p, showOnlineStatus: v }))} />
                </SettingRow>
                <SettingRow label="Apparaître dans les classements" description="Ton profil est visible dans les classements publics">
                  <Toggle checked={privacy.showInLeaderboard} onChange={(v) => setPrivacy((p) => ({ ...p, showInLeaderboard: v }))} />
                </SettingRow>
              </Section>

              <Section title="Données" icon="📦">
                <SettingRow label="Exporter mes données" description="Télécharger une copie de toutes tes données FizzUp">
                  <button className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-gray-300 text-xs hover:bg-white/10 transition-colors">
                    Exporter
                  </button>
                </SettingRow>
              </Section>
            </>
          )}

          {/* ---- APPARENCE ---- */}
          {activeTab === 'apparence' && (
            <>
              <Section title="Thème" icon="🌙">
                <div className="py-4">
                  <p className="text-sm text-white font-medium mb-3">Mode d'affichage</p>
                  <div className="flex gap-3">
                    {([
                      { key: 'dark' as Theme, label: 'Sombre', icon: '🌙', description: 'Interface sombre' },
                      { key: 'light' as Theme, label: 'Clair', icon: '☀️', description: 'Interface claire' },
                      { key: 'system' as Theme, label: 'Automatique', icon: '⚙️', description: 'Suit l\'OS' },
                    ]).map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTheme(t.key)}
                        className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-all ${
                          theme === t.key
                            ? 'border-violet-500/40 bg-violet-500/12 text-violet-300'
                            : 'border-white/8 bg-white/4 text-gray-400 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        <span className="text-2xl">{t.icon}</span>
                        <span>{t.label}</span>
                        <span className="text-[10px] opacity-60">{t.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Couleur d'accentuation" icon="🎨">
                <div className="py-4">
                  <p className="text-sm text-gray-400 mb-3">Personnalise la couleur principale de l'interface</p>
                  <div className="flex items-center gap-3">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setAccentColor(c.key)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          accentColor === c.key ? 'border-white/30 bg-white/8' : 'border-white/6 hover:border-white/15'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full ${c.bg}`} />
                        <span className="text-[10px] text-gray-400">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Interface" icon="🖥">
                <SettingRow label="Mode compact" description="Réduit l'espacement pour afficher plus de contenu">
                  <Toggle checked={compactMode} onChange={setCompactMode} />
                </SettingRow>
                <SettingRow label="Réduire les animations" description="Désactive les transitions et animations de l'interface">
                  <Toggle checked={reduceMotion} onChange={setReduceMotion} />
                </SettingRow>
              </Section>
            </>
          )}

          {/* ---- ZONE DANGER ---- */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-500/20 p-5" style={{ background: 'rgba(239,68,68,0.04)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500/60 mb-4">⚠ Zone de danger</p>

                {/* Déconnecter toutes les sessions */}
                <div className="flex items-start justify-between gap-4 py-4 border-b border-red-500/10">
                  <div>
                    <p className="text-sm text-white font-medium">Déconnecter tous les appareils</p>
                    <p className="text-xs text-gray-500 mt-0.5">Ferme toutes les sessions actives sauf celle-ci</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-gray-300 text-xs hover:bg-white/10 transition-colors shrink-0">
                    Déconnecter tout
                  </button>
                </div>

                {/* Réinitialiser les stats */}
                <div className="flex items-start justify-between gap-4 py-4 border-b border-red-500/10">
                  <div>
                    <p className="text-sm text-white font-medium">Réinitialiser mes statistiques</p>
                    <p className="text-xs text-gray-500 mt-0.5">Efface définitivement toutes tes données d'activité (irréversible)</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/18 transition-colors shrink-0">
                    Réinitialiser
                  </button>
                </div>

                {/* Supprimer le compte */}
                <div className="py-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm text-red-400 font-semibold">Supprimer mon compte</p>
                      <p className="text-xs text-gray-500 mt-0.5">Suppression définitive et irréversible de ton compte et de toutes tes données</p>
                    </div>
                    {!showDeleteConfirm && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-colors shrink-0"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  {showDeleteConfirm && (
                    <div className="mt-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 space-y-3">
                      <p className="text-xs text-red-300">
                        Cette action est <span className="font-bold">irréversible</span>. Tape <span className="font-mono font-bold text-white">SUPPRIMER</span> pour confirmer.
                      </p>
                      <input
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="SUPPRIMER"
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-red-500/30 text-sm text-white font-mono outline-none focus:border-red-500/60 transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          disabled={deleteInput !== 'SUPPRIMER'}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                        >
                          Confirmer la suppression
                        </button>
                        <button
                          onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                          className="px-4 py-2 rounded-lg bg-white/6 border border-white/8 text-gray-400 text-sm hover:bg-white/10 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
