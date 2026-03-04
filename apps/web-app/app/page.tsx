const objects = [
  {
    accent: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.10)',
    accentIcon: 'bg-violet-500/20 border-violet-500/30',
    accentText: 'text-violet-400',
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    label: 'Objet connecté',
    title: 'Tireuse connectée',
    description: 'Comptabilise chaque verre servi en temps réel. Historique, statistiques et classements accessibles instantanément depuis l\'app.',
    tags: ['Comptage automatique', 'Stats en direct', 'Historique'],
  },
  {
    accent: '#2563eb',
    accentBg: 'rgba(37,99,235,0.10)',
    accentIcon: 'bg-indigo-500/20 border-indigo-500/30',
    accentText: 'text-indigo-400',
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    label: 'Objet connecté',
    title: 'Décapsuleur intelligent',
    description: 'Suit le nombre de bouteilles décapsulées par utilisateur. Idéal pour les soirées privées comme les événements de grande envergure.',
    tags: ['Suivi par utilisateur', 'Mode événement', 'Compatible app'],
  },
  {
    accent: '#059669',
    accentBg: 'rgba(5,150,105,0.08)',
    accentIcon: 'bg-emerald-500/20 border-emerald-500/30',
    accentText: 'text-emerald-400',
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2v-1a2 2 0 00-2-2H8a2 2 0 00-2 2v1a2 2 0 002 2zM12 3C9.239 3 7 5.239 7 8s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" />
      </svg>
    ),
    label: 'Extension',
    title: 'Verre NFC',
    description: 'Identifie chaque utilisateur à la prise en main. Relie automatiquement la consommation au profil et met à jour le classement en temps réel.',
    tags: ['Identification NFC', 'Profil lié', 'Classement live'],
  },
];

const appFeatures = [
  {
    accent: 'rgba(124,58,237,0.10)',
    glow: 'bg-violet-600/12',
    iconClass: 'bg-violet-500/20 border-violet-500/30',
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    span: 'md:col-span-7',
    title: 'Dashboard interactif',
    description: 'Visualisez votre consommation globale, votre historique par jour, semaine, mois ou année. Tout en un seul coup d\'œil.',
    extra: (
      <div className="mt-auto flex gap-3">
        {[['Aujourd\'hui', '12 verres'], ['Cette semaine', '74 verres'], ['Record', '23 verres']].map(([label, val]) => (
          <div key={label} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
            <p className="text-xs text-gray-500 whitespace-nowrap">{label}</p>
            <p className="text-sm font-bold text-violet-400">{val}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    accent: 'rgba(217,119,6,0.07)',
    glow: 'bg-amber-600/8',
    iconClass: 'bg-amber-500/20 border-amber-500/30',
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    span: 'md:col-span-5',
    title: 'Classements & défis',
    description: 'Lancez des défis entre amis, suivez les classements de groupe et remportez des badges exclusifs.',
    extra: (
      <div className="mt-auto space-y-1.5">
        {[['🥇 Rudy A.', '23 verres'], ['🥈 Mark A.', '19 verres'], ['🥉 Enzo B.', '15 verres']].map(([name, score]) => (
          <div key={name} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{name}</span>
            <span className="text-amber-400 font-semibold">{score}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    accent: 'rgba(5,150,105,0.08)',
    glow: 'bg-emerald-600/8',
    iconClass: 'bg-emerald-500/20 border-emerald-500/30',
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    span: 'md:col-span-5',
    title: 'Badges & gamification',
    description: 'Débloquez des trophées, partagez vos exploits et grimpez dans le classement général.',
    extra: (
      <div className="mt-auto flex flex-wrap gap-2">
        {['🏆 Champion', '🔥 En feu', '💧 Hydraté', '⚡ Record'].map((badge) => (
          <span key={badge} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-gray-400">
            {badge}
          </span>
        ))}
      </div>
    ),
  },
  {
    accent: 'rgba(37,99,235,0.10)',
    glow: 'bg-indigo-600/10',
    iconClass: 'bg-indigo-500/20 border-indigo-500/30',
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    span: 'md:col-span-7',
    title: 'Social & partage',
    description: 'Partagez vos stats, invitez des amis, créez des groupes pour vos événements. FizzUp est conçu pour être vécu ensemble.',
    extra: (
      <div className="mt-auto flex items-center gap-2">
        <div className="flex -space-x-2">
          {['#7c3aed', '#2563eb', '#059669', '#d97706'].map((c, i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050508]" style={{ background: c }} />
          ))}
        </div>
        <span className="text-xs text-gray-500">+4 amis connectés ce soir</span>
      </div>
    ),
  },
];

const useCases = [
  {
    emoji: '🏠',
    title: 'Soirée entre amis',
    description: 'La tireuse affiche les verres servis en direct, le décapsuleur compte les bouteilles. L\'app génère le classement des meilleurs buveurs d\'eau en temps réel.',
    tags: ['Tireuse connectée', 'Décapsuleur', 'Classement live'],
  },
  {
    emoji: '🎪',
    title: 'Festival & événements',
    description: 'Tireuses installées sur site, verres NFC distribués aux participants. Le dashboard affiche une expérience gamifiée à grande échelle pour les organisateurs.',
    tags: ['Verres NFC', 'Dashboard organisateur', 'Grande échelle'],
  },
  {
    emoji: '🍺',
    title: 'Bars & établissements',
    description: 'Suivi de consommation par client, fidélisation par badges et défis. Créez une expérience unique qui donne envie de revenir.',
    tags: ['Fidélisation', 'Badges', 'Expérience client'],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">

      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">

        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-[-20%] left-[0%] w-[700px] h-[700px] rounded-full bg-violet-600/20 blur-[140px] animate-float" />
          <div className="absolute top-[15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[100px] animate-float-2" />
          <div className="absolute bottom-[-15%] left-[25%] w-[450px] h-[450px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-float-3" />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 85% 65% at 50% 50%, transparent 35%, #050508 100%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 rounded-full text-sm font-medium text-gray-300 border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-base">🍻</span>
            Objets connectés · App mobile · Dashboard social
          </div>

          <h1
            className="animate-fade-up-1 font-bold tracking-tight leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            <span className="text-white">Connecté pour</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 animate-gradient-x">
              mieux trinquer
            </span>
          </h1>

          <p className="animate-fade-up-2 text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            FizzUp réinvente la convivialité grâce à des objets connectés et une app sociale.
            Comptez, comparez, défiez vos amis — et faites de chaque verre un moment mémorable.
          </p>

          <div className="animate-fade-up-3 flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <a
              href="#objects"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-base hover:bg-gray-100 transition-all duration-200 shadow-[0_0_50px_rgba(139,92,246,0.35)]"
            >
              Découvrir les objets
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#app"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base text-gray-300 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2v-1a2 2 0 00-2-2H8a2 2 0 00-2 2v1a2 2 0 002 2zM12 3C9.239 3 7 5.239 7 8s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" />
              </svg>
              Voir l&apos;application
            </a>
          </div>

          <div className="animate-fade-up-3 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Tireuse connectée
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Décapsuleur intelligent
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Verres NFC
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> App & dashboard social
            </div>
          </div>
        </div>
      </section>

      <section id="objects" className="px-4 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">Objets connectés</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            L&apos;écosystème FizzUp
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Des objets pensés pour s&apos;intégrer naturellement dans vos soirées, bars et événements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {objects.map((obj) => (
            <div
              key={obj.title}
              className="rounded-2xl border border-white/8 p-6 relative overflow-hidden group hover:border-white/15 transition-all duration-300 flex flex-col"
              style={{ background: `linear-gradient(135deg, ${obj.accentBg} 0%, rgba(5,5,8,0.5) 100%)` }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: obj.accent + '20' }}
              />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${obj.accentIcon}`}>
                    {obj.icon}
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${obj.accentText}`}>
                    {obj.label}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{obj.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">{obj.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {obj.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-xs text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-white/6 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
             style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-xl">🔌</span>
          <div>
            <span className="text-white font-semibold text-sm">Extensions à venir — </span>
            <span className="text-gray-400 text-sm">capteurs pour bouteilles d&apos;eau, doseurs intelligents pour soirées, accessoires événementiels.</span>
          </div>
        </div>
      </section>

      <section id="app" className="px-4 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">Application</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tout centralisé dans votre poche
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            L&apos;app FizzUp relie tous vos objets connectés et transforme vos données en expériences sociales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4" style={{ gridAutoRows: '210px' }}>
          {appFeatures.map((feat) => (
            <div
              key={feat.title}
              className={`${feat.span} rounded-2xl border border-white/8 p-6 relative overflow-hidden group hover:border-white/15 transition-all duration-300`}
              style={{ background: `linear-gradient(135deg, ${feat.accent} 0%, rgba(5,5,8,0.5) 100%)` }}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${feat.glow}`} />
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${feat.iconClass}`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{feat.title}</h3>
                <p className="text-gray-400 text-sm">{feat.description}</p>
                {feat.extra}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">Cas d&apos;usage</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pour chaque occasion
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              De la soirée intime au festival de masse — FizzUp s&apos;adapte à tous les contextes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="p-6 rounded-2xl border border-white/8 hover:border-white/15 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div className="text-4xl mb-4">{uc.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{uc.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{uc.description}</p>
                <div className="flex flex-wrap gap-2">
                  {uc.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-xs text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/8 border border-white/8 rounded-2xl overflow-hidden"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            {[
              { emoji: '🎓', label: 'Étudiants', desc: 'Soirées entre amis' },
              { emoji: '🎪', label: 'Festivals', desc: 'Événements & concerts' },
              { emoji: '🍺', label: 'Bars', desc: 'Établissements festifs' },
              { emoji: '📱', label: 'Tech lovers', desc: 'Gadgets connectés' },
            ].map((item) => (
              <div key={item.label} className="px-6 py-8 text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="font-semibold text-white text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-24 max-w-5xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 p-12 md:p-16 text-center"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(124,58,237,0.18) 0%, rgba(5,5,8,0.85) 100%)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/20 rounded-full blur-3xl" />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="relative z-10">
            <div className="text-4xl mb-4">🍻</div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Prêt à rejoindre
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 animate-gradient-x">
                l&apos;aventure&nbsp;?
              </span>
            </h2>

            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
              FizzUp cherche à s&apos;installer dans vos soirées, bars et festivals.
              Contactez-nous pour en savoir plus ou rejoindre le projet.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:contact@fizzup.fr"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-bold text-base hover:bg-gray-100 transition-all duration-200 shadow-[0_0_60px_rgba(139,92,246,0.4)]"
              >
                Nous contacter
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#objects"
                className="px-8 py-4 rounded-xl font-semibold text-base text-gray-300 border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
