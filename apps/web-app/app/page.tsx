import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            FizzUp
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              À propos
            </Link>
            <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 mb-6 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
            🚀 Bienvenue sur FizzUp
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Votre application
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> moderne</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Découvrez une expérience unique avec Next.js, TypeScript et une architecture moderne.
            Construite avec les meilleures pratiques du développement web.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
              Commencer
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200">
              En savoir plus
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Ultra Rapide</h3>
              <p className="text-gray-600">
                Performance optimale avec Next.js et les dernières technologies web.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Design Moderne</h3>
              <p className="text-gray-600">
                Interface élégante et responsive avec Tailwind CSS.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Sécurisé</h3>
              <p className="text-gray-600">
                Architecture robuste avec TypeScript et les meilleures pratiques.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600">
          <div className="mb-4 md:mb-0">
            <p>© 2026 FizzUp. Tous droits réservés.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Conditions
            </Link>
            <Link href="/docs" className="hover:text-blue-600 transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
