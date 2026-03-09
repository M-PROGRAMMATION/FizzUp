'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '../../lib/api';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères minimum', ok: password.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Un chiffre', ok: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const levels = [
    { label: '', color: '' },
    { label: 'Faible', color: 'bg-red-500' },
    { label: 'Moyen', color: 'bg-amber-500' },
    { label: 'Bien', color: 'bg-blue-500' },
    { label: 'Fort', color: 'bg-emerald-500' },
  ];
  const level = levels[score];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? level.color : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map((c) => (
            <span key={c.label} className={`text-[10px] flex items-center gap-1 ${c.ok ? 'text-emerald-400' : 'text-gray-600'}`}>
              <span>{c.ok ? '✓' : '○'}</span>
              {c.label}
            </span>
          ))}
        </div>
        {level.label && (
          <span className={`text-[10px] font-semibold shrink-0 ${
            score === 1 ? 'text-red-400' : score === 2 ? 'text-amber-400' : score === 3 ? 'text-blue-400' : 'text-emerald-400'
          }`}>
            {level.label}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const passwordScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const canSubmit =
    email.trim() &&
    password.length >= 8 &&
    passwordScore >= 2 &&
    passwordsMatch &&
    confirmPassword.length > 0 &&
    acceptTerms &&
    !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordsMatch) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (passwordScore < 2) {
      setError('Le mot de passe est trop faible.');
      return;
    }

    setLoading(true);
    try {
      const { accessToken } = await api.auth.register(email.trim(), password);
      setToken(accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[-20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[130px] animate-float" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/12 blur-[110px] animate-float-2" />
        <div className="absolute top-[30%] right-[40%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/8 blur-[90px] animate-float-3" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-6">
            <Image src="/fizzup-logo.png" alt="FizzUp" width={130} height={39} className="h-10 w-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte 🍺</h1>
          <p className="text-gray-400 text-sm">Rejoins la communauté FizzUp et commence à tracker tes soirées</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Error */}
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm text-red-400 border border-red-500/20 bg-red-500/10 flex items-center gap-2">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Adresse e-mail
              </label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-600 border border-white/8 outline-none transition-all duration-200 focus:border-violet-500/50"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder:text-gray-600 border outline-none transition-all duration-200 ${
                    password && passwordScore < 2
                      ? 'border-red-500/40 focus:border-red-500/60'
                      : password && passwordScore >= 3
                      ? 'border-emerald-500/30 focus:border-emerald-500/50'
                      : 'border-white/8 focus:border-violet-500/50'
                  }`}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder:text-gray-600 border outline-none transition-all duration-200 ${
                    confirmPassword && !passwordsMatch
                      ? 'border-red-500/40 focus:border-red-500/60'
                      : confirmPassword && passwordsMatch
                      ? 'border-emerald-500/30 focus:border-emerald-500/50'
                      : 'border-white/8 focus:border-violet-500/50'
                  }`}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {/* Match indicator */}
                {confirmPassword && (
                  <span className={`absolute right-10 top-1/2 -translate-y-1/2 text-sm ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                    {passwordsMatch ? '✓' : '✗'}
                  </span>
                )}
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-400 mt-1.5">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            {/* CGU */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border transition-all ${
                  acceptTerms
                    ? 'bg-violet-500 border-violet-500'
                    : 'bg-white/5 border-white/20 group-hover:border-white/35'
                }`}>
                  {acceptTerms && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 leading-relaxed">
                J'accepte les{' '}
                <Link href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Politique de confidentialité
                </Link>{' '}
                de FizzUp
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-[0_0_40px_rgba(139,92,246,0.3)] mt-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Création du compte…
                </>
              ) : (
                <>
                  Créer mon compte
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-600" style={{ background: 'rgba(5,5,8,1)' }}>
                ou s'inscrire avec
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 text-sm text-gray-300 hover:border-white/20 hover:text-white transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 text-sm text-gray-300 hover:border-white/20 hover:text-white transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
