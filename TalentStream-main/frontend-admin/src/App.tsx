import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from './types';
import AdminLoginPage from './pages/AdminLoginPage';
import SuperAdminUserManagement from './pages/SuperAdminUserManagement';
import SuperAdminSystemMetrics from './pages/SuperAdminSystemMetrics';
import { apiGetCurrentUser } from './services/api';
import { ShieldCheck, Users, BarChart3, LogOut, Moon, Sun, Globe, Sparkles } from 'lucide-react';

type AdminTab = 'users' | 'metrics';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [language, setLanguage] = useState<'en' | 'id'>('id');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

  const isId = language === 'id';

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const stored = localStorage.getItem('ts_admin_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.role === 'super_admin') {
            // Verify with backend
            const res = await apiGetCurrentUser();
            if (res && res.user && res.user.role === 'super_admin') {
              setUser(res.user);
            } else {
              localStorage.removeItem('ts_admin_session');
            }
          }
        } catch {
          localStorage.removeItem('ts_admin_session');
        }
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    if (authenticatedUser.role !== 'super_admin') {
      addToast(isId ? 'Akses ditolak: Bukan Super Administrator.' : 'Access denied: Not a Super Administrator.', 'error');
      return;
    }
    localStorage.setItem('ts_admin_session', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    addToast(isId ? `Selamat datang, ${authenticatedUser.name}!` : `Welcome, ${authenticatedUser.name}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('ts_admin_session');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ts_')) localStorage.removeItem(key);
    });
    setUser(null);
    addToast(isId ? 'Berhasil keluar.' : 'Logged out.', 'info');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </div>
    );
  }

  // Login screen
  if (!user) {
    return (
      <AdminLoginPage
        language={language}
        onAuthSuccess={handleAuthSuccess}
        onBack={() => {}} // No "back" in dedicated admin portal
      />
    );
  }

  // Main admin dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">TalentStream</span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Super Admin</span>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              {isId ? 'Manajemen Pengguna' : 'User Management'}
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'metrics'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {isId ? 'Metrik Sistem' : 'System Metrics'}
            </button>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(l => l === 'id' ? 'en' : 'id')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Toggle Language"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                <span className="text-xs font-bold text-purple-300">
                  {user.name?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
                title={isId ? 'Keluar' : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden border-t border-slate-800 flex">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              activeTab === 'users' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-500'
            }`}
          >
            <Users className="w-4 h-4" />
            {isId ? 'Pengguna' : 'Users'}
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              activeTab === 'metrics' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {isId ? 'Metrik' : 'Metrics'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'users' && (
              <SuperAdminUserManagement
                language={language}
                currentUser={user}
                addToast={addToast}
              />
            )}
            {activeTab === 'metrics' && (
              <SuperAdminSystemMetrics
                language={language}
                currentUser={user}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold max-w-xs backdrop-blur-md border ${
                toast.type === 'success'
                  ? 'bg-green-900/80 border-green-700 text-green-200'
                  : toast.type === 'error'
                  ? 'bg-red-900/80 border-red-700 text-red-200'
                  : 'bg-slate-800/90 border-slate-700 text-slate-200'
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
