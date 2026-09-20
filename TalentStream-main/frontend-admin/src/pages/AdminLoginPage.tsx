import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SparklesIcon, EnvelopeIcon, LockClosedIcon } from '../components/icons/Icons';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { apiLogin } from '../services/api';

interface AdminLoginPageProps {
  language: 'en' | 'id';
  onAuthSuccess: (user: any) => void;
  onBack: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ language, onAuthSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isId = language === 'id';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(isId ? 'Harap masukkan email dan password admin.' : 'Please enter admin email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiLogin(email, password);
      if (res.success && res.user) {
        if (res.user.role !== 'super_admin') {
          setError(isId ? 'Akses ditolak: Akun ini bukan akun Super Administrator.' : 'Access denied: Account does not have Super Admin authority.');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('ts_session', JSON.stringify(res.user));
        onAuthSuccess(res.user);
      } else {
        setError(res.message || (isId ? 'Autentikasi admin gagal. Periksa kembali kredensial Anda.' : 'Admin authentication failed. Please check credentials.'));
      }
    } catch (err: any) {
      setError(err.message || (isId ? 'Terjadi kesalahan koneksi ke server.' : 'Network error connecting to backend'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden">
      
      {/* Left Branding Panel (Hidden on small screens) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-slate-900 overflow-hidden items-center justify-center p-12 lg:p-24">
        <div className="absolute inset-0 bg-indigo-950"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none bg-purple-600/50"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none bg-indigo-500/40"></div>
        
        <div className="relative z-10 w-full max-w-xl text-white space-y-10">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/20">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">TalentStream</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
              Platform Authority & Control.
            </h1>
            <p className="text-xl text-indigo-200 font-medium leading-relaxed max-w-lg">
              {isId 
                ? 'Pusat kendali operasional, manajemen pengguna dan otorisasi sistem platform tingkat tinggi.'
                : 'High-level operational control center, user governance, and infrastructure security authorization.'}
            </p>
          </div>
          
          <div className="pt-10 border-t border-indigo-900/60 flex items-center gap-4 text-sm text-indigo-300">
            <div className="flex -space-x-2">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-950" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-950" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-950" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-950" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="" />
            </div>
            <span>{isId ? 'Otoritas Keamanan Tingkat 1' : 'Level 1 Security Clearance'}</span>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-24 bg-white dark:bg-slate-950 relative z-10 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          
          <button 
            onClick={onBack}
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{isId ? 'Kembali' : 'Back'}</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Badge */}
            <div className="mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                {isId ? 'Akses Khusus Otoritas' : 'Restricted Authority Access'}
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isId ? 'Portal Super Admin' : 'Super Admin Portal'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isId 
                ? 'Masuk ke panel manajemen pengguna & kontrol infrastruktur platform TalentStream.'
                : 'Sign in to access platform user governance and cloud infrastructure controls.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {isId ? 'Email Super Admin' : 'Super Admin Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-medium text-sm"
                    placeholder="superadmin@talentstream.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {isId ? 'Password' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-medium text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold text-center">
                    {error}
                  </p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 text-white font-bold rounded-xl transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  isId ? 'Masuk sebagai Super Admin' : 'Sign in as Super Admin'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
