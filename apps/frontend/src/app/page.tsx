"use client"

import { Palette, Users, Zap, Layers, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter();

  const onNavigate = (path: string) => {
    router.push(path);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Palette className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">collArt</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all hover:shadow-lg hover:shadow-blue-500/30"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Create together,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                design in real-time
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Collaborative whiteboarding made simple. Draw, sketch, and brainstorm with your team in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('signup')}
                className="group px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg transition-all hover:shadow-xl hover:shadow-blue-500/30 flex items-center space-x-2"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 font-semibold text-lg transition-all border-2 border-slate-200 hover:border-slate-300"
              >
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Palette className="w-20 h-20 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Your canvas awaits</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time Collaboration</h3>
              <p className="text-slate-600 leading-relaxed">
                Work seamlessly with your team. See changes instantly as multiple people draw and edit together.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">
                Built for speed. No lag, no delays. Your ideas flow from mind to canvas instantaneously.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Powerful Tools</h3>
              <p className="text-slate-600 leading-relaxed">
                Everything you need to bring ideas to life. Shapes, text, drawing tools, and more.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your ideas?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already creating amazing things with collArt.
            </p>
            <button
              onClick={() => onNavigate('signup')}
              className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold text-lg transition-all hover:shadow-xl inline-flex items-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Palette className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">collArt</span>
            </div>
            <p className="text-slate-600">
              © 2025 collArt. Collaborative creativity unleashed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
