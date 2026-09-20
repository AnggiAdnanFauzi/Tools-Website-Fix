﻿import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('fhd_admin_token');
    if (token) setIsAuthenticated(true);

    const savedDark = localStorage.getItem('fhd_admin_dark');
    if (savedDark === 'true') {
      setIsDark(true);
    } else if (savedDark === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
    const savedLang = localStorage.getItem('fhd_admin_lang') as 'id' | 'en';
    if (savedLang === 'id' || savedLang === 'en') setLang(savedLang);
  }, []);

  const handleToggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('fhd_admin_dark', String(next));
  };

  const handleToggleLang = () => {
    const next: 'id' | 'en' = lang === 'id' ? 'en' : 'id';
    setLang(next);
    localStorage.setItem('fhd_admin_lang', next);
  };

  const showToast = (message: string, type: 'success' | 'warning' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleLoginSubmit = async (e: React.FormEvent, email: string, pass: string) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch('https://api-financialhealth.kembangin.online/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const role = data.user?.role || '';
        if (role !== 'admin') {
          showToast(
            lang === 'id'
              ? '⛔ Akun User biasa tidak bisa login di sini. Silakan gunakan halaman User.'
              : '⛔ Regular user accounts cannot sign in here. Please use the User Platform.',
            'warning'
          );
        } else {
          localStorage.setItem('fhd_admin_token', data.token);
          setIsAuthenticated(true);
        }
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      alert('Network error. Failed to connect to server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fhd_admin_token');
    setIsAuthenticated(false);
  };

  const switchToUser = () => {
    window.location.href = 'https://financialhealth.kembangin.online';
  };

  const toastColors: Record<string, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`${toastColors[t.type] || 'bg-slate-700'} text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl`}>
            {t.message}
          </div>
        ))}
      </div>

      {isAuthenticated ? (
        <AdminDashboard
          isDark={isDark}
          lang={lang}
          onLogout={handleLogout}
          onToggleDark={handleToggleDark}
          onToggleLang={handleToggleLang}
          onSwitchToUserView={switchToUser}
          showToast={showToast}
        />
      ) : (
        <AdminLogin
          isDark={isDark}
          lang={lang}
          onLoginSubmit={handleLoginSubmit}
          authLoading={authLoading}
          onSwitchToUser={switchToUser}
          onToggleDark={handleToggleDark}
          onToggleLang={handleToggleLang}
        />
      )}
    </>
  );
}

export default App;

