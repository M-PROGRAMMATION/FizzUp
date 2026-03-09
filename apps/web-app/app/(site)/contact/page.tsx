'use client';

import { useState } from 'react';

const contactReasons = [
  { value: 'partnership', label: 'Partenariat / Collaboration' },
  { value: 'demo', label: 'Demande de démo' },
  { value: 'event', label: 'Événement / Festival / Bar' },
  { value: 'press', label: 'Presse / Médias' },
  { value: 'other', label: 'Autre' },
];

const teamMembers = [
  { name: 'Mark Albanese–Alessandrini', role: 'Fondateur · Dev Web & API', avatar: 'M', color: '#2563eb' },
  { name: 'Rudy Alimet', role: 'Dev Software · Dev Web & API', avatar: 'R', color: '#7c3aed' },
  { name: 'Enzo Baboulene', role: 'Dev Hardware · Décapsuleur connecté', avatar: 'E', color: '#059669' },
  { name: 'Marvin Richard', role: 'Dev Hardware · Verre connecté', avatar: 'Mv', color: '#dc2626' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">

      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[130px] animate-float" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/12 blur-[110px] animate-float-2" />
      </div>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">

        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-6 rounded-full text-sm font-medium text-gray-300 border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
            Nous sommes disponibles
          </div>
          <h1
            className="font-bold tracking-tight leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            <span className="text-white">Parlons de votre</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 animate-gradient-x">
              projet
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Une question, un partenariat, une démo ? L&apos;équipe FizzUp vous répond rapidement.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">

          <div className="md:col-span-3">
            {submitted ? (
              <div
                className="rounded-2xl border border-white/8 p-10 flex flex-col items-center justify-center text-center h-full"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message envoyé !</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Merci pour votre message. L&apos;équipe FizzUp vous répondra dans les meilleurs délais.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-2.5 rounded-xl border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/25 transition-all duration-200"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/8 p-8 space-y-5"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
                    <input
                      type="text"
                      placeholder="Votre prénom"
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none transition-all duration-200 focus:border-violet-500/50"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none transition-all duration-200 focus:border-violet-500/50"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Adresse e-mail</label>
                  <input
                    type="email"
                    placeholder="vous@exemple.com"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none transition-all duration-200 focus:border-violet-500/50"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sujet</label>
                  <select
                    required
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-xl text-sm border border-white/8 outline-none transition-all duration-200 focus:border-violet-500/50 appearance-none"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgb(209 213 219)' }}
                  >
                    <option value="" disabled style={{ background: '#0a0a12', color: '#6b7280' }}>
                      Choisissez un sujet
                    </option>
                    {contactReasons.map((r) => (
                      <option key={r.value} value={r.value} style={{ background: '#0a0a12', color: '#f0f0f5' }}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Décrivez votre projet, votre événement ou votre demande..."
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none transition-all duration-200 focus:border-violet-500/50 resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                >
                  Envoyer le message
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-5">

            <div
              className="rounded-2xl border border-white/8 p-6"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">Contact direct</h3>
              <div className="space-y-4">
                <a
                  href="mailto:contact@fizzup.fr"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">E-mail</p>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">contact@fizzup.fr</p>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Temps de réponse</p>
                    <p className="text-sm text-gray-300">Sous 48h ouvrées</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border border-white/8 p-6"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">L&apos;équipe</h3>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{member.name}</p>
                      <p className="text-xs text-gray-500 truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border border-violet-500/20 p-6"
              style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(124,58,237,0.12) 0%, rgba(5,5,8,0.6) 100%)' }}
            >
              <div className="text-2xl mb-3">🍻</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Vous organisez un événement et souhaitez intégrer FizzUp ?{' '}
                <span className="text-violet-400">Contactez-nous</span> pour une démo personnalisée.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
