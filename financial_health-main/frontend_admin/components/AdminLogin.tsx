import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sun, Moon, Globe } from 'lucide-react';

interface AdminLoginProps {
  isDark: boolean;
  lang: 'en' | 'id';
  onLoginSubmit: (e: React.FormEvent, email: string, pass: string) => void;
  authLoading: boolean;
  onSwitchToUser: () => void;
  onToggleDark: () => void;
  onToggleLang: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  isDark, lang, onLoginSubmit, authLoading, onSwitchToUser, onToggleDark, onToggleLang
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = lang === 'id' ? {
    title: 'MASUK ADMIN',
    subtitle: 'Masuk untuk mengakses panel kontrol administrator sistem.',
    emailLabel: 'Alamat Email Admin',
    emailPlaceholder: 'admin@financialhealth.com',
    passLabel: 'Kata Sandi',
    passPlaceholder: '••••••••',
    signIn: 'Masuk ke Panel Admin',
    loading: 'Memproses...',
    switchToUser: 'Bukan admin? Login sebagai User',
  } : {
    title: 'ADMIN SIGN IN',
    subtitle: 'Sign in to access the system administrator control panel.',
    emailLabel: 'Admin Email Address',
    emailPlaceholder: 'admin@financialhealth.com',
    passLabel: 'Password',
    passPlaceholder: '••••••••',
    signIn: 'Sign In to Admin Panel',
    loading: 'Authenticating...',
    switchToUser: "Not an admin? Login as User",
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={onSwitchToUser}
          className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer px-3 py-2 rounded-xl ${
            isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          {lang === 'id' ? 'Ke Tampilan User' : 'Back to User'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
            }`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={onToggleLang}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-white text-blue-600 hover:bg-slate-100 shadow-sm'
            }`}
          >
            <Globe size={13} />
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>
      </div>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className={`w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl border transition-all ${
          isDark
            ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800'
            : 'bg-white/90 backdrop-blur-xl border-white shadow-slate-200/80'
        }`}>

          {/* Logo — sama dengan login user */}
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src="/logo.png"
              alt="Financial Health logo"
              className="w-12 h-12 rounded-2xl object-contain shadow-lg shadow-blue-500/20 mb-3 hover:rotate-6 transition-transform"
            />
            <h2 className={`text-xl font-black tracking-tight leading-none mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Financial<span className="text-blue-500 font-black">Health</span>
            </h2>
            <div className={`text-[9.5px] font-mono uppercase tracking-widest font-bold mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Admin Panel
            </div>
            <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-1 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
              {t.title}
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => onLoginSubmit(e, email, password)} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-rose-500/20 ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {t.passLabel}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={15} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passPlaceholder}
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-rose-500/20 ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-500 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full mt-2 py-3.5 rounded-xl font-extrabold text-xs text-white shadow-lg transition-all ${
                authLoading
                  ? 'opacity-70 cursor-wait bg-rose-700'
                  : 'cursor-pointer hover:scale-[1.01] bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-500/20'
              }`}
            >
              {authLoading ? t.loading : t.signIn}
            </button>
          </form>

          {/* Switch to user */}
          <div className="text-center mt-6">
            <button
              onClick={onSwitchToUser}
              className={`text-[11px] font-extrabold transition-colors cursor-pointer ${
                isDark ? 'text-slate-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-600'
              }`}
            >
              {t.switchToUser}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


