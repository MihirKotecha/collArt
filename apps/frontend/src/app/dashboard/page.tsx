"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Palette, LogOut } from 'lucide-react';

export default function Dashboard() {
    const { signOut } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Palette className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-slate-900">collArt</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-slate-700">{'asss'}</span>
                            <button
                                onClick={signOut}
                                className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Welcome to your workspace
                    </h1>
                    <p className="text-xl text-slate-600">
                        Start creating something amazing
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button className="group bg-white rounded-xl p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Palette className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">New Canvas</h3>
                        <p className="text-slate-600 text-sm">Start a fresh collaborative board</p>
                    </button>
                </div>
            </main>
        </div>
    );
}
