﻿﻿﻿﻿﻿import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { FinancialInputs, CalculationResult, HistoryEntry, Language } from './types';
import { calculateFinancialHealth, DEMO_DATA_ABELL, getRandomDemoScenario } from './services/calculator';
import { TEXT } from './services/translations';
import { 
  apiRegister, apiLogin, apiLogout, apiUpdateProfile, 
  apiSaveDiagnostic, apiGetHistories, apiClearHistories, apiUploadAvatar, apiGetUserProfile,
  apiGetLatestUserDiagnostic 
} from './services/api';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';
import InsightsView from './components/InsightsView';
import SimulationView from './components/SimulationView';
import { LandingPage } from './components/LandingPage';
import { 
  LayoutDashboard, FileText, ArrowLeft, Printer, Download, Loader2, Globe, BookOpen,
  Sun, Moon, User, Settings, LogOut, Activity, Check, Zap, Sparkles, ShieldCheck, Trash2, X, ChevronDown, UserCheck, AlertTriangle, Info,
  Shield, HelpCircle, MessageSquare, Upload, TrendingUp, Mail, Lock, Eye, EyeOff, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const NAV_TEXT = {
  en: {
    diagnostic: 'Diagnostic Dashboard',
    stressTest: 'Stress Simulation',
    methodology: 'Methodology Benchmarks',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    report: 'Report Details',
    userStatus: 'Member',
    close: 'Close',
    resetTitle: 'System Hard Reset',
    resetData: 'Clear Diagnostic History',
    resetConfirm: 'Are you sure you want to delete all local diagnostics history? This action is irreversible.',
    currency: 'Default Currency',
    currencyOption: 'IDR (Indonesian Rupiah)',
    profileTitle: 'GAAP Diagnostic Profile',
    diagnosticsRan: 'Total Run Diagnostics',
    verifiedEmail: 'Verified Account',
    memberSince: 'Member Since',
    joinedDate: 'May 2026'
  },
  id: {
    diagnostic: 'Dasbor Diagnosa',
    stressTest: 'Simulasi Stres',
    methodology: 'Tolak Ukur Metodologi',
    profile: 'Profil Saya',
    settings: 'Pengaturan',
    logout: 'Keluar',
    report: 'Detail Laporan',
    userStatus: 'Anggota',
    close: 'Tutup',
    resetTitle: 'Reset Sistem Menyeluruh',
    resetData: 'Hapus Riwayat Diagnosa',
    resetConfirm: 'Apakah Anda yakin ingin menghapus seluruh riwayat diagnosis lokal Anda? Tindakan ini tidak dapat dibatalkan.',
    currency: 'Mata Uang Default',
    currencyOption: 'IDR (Rupiah Indonesia)',
    profileTitle: 'GAAP Profil Diagnosa',
    diagnosticsRan: 'Total Diagnosa Dijalankan',
    verifiedEmail: 'Akun Terverifikasi',
    memberSince: 'Anggota Sejak',
    joinedDate: 'Mei 2026'
  }
};

const FOOTER_TEXT = {
  en: {
    about: 'Calculative diagnostics engineered to secure operational survival ranges. Built for micro-enterprises and diligent domestic budgeting.',
    navHeader: 'Core Navigation Menu',
    legalHeader: 'Legal & Help Resources',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    disclaimer: 'Disclaimer Notice',
    contact: 'Contact Contech Support',
    popups: {
      privacy: {
        title: 'Privacy Policy',
        content: `Your financial absolute safety is our design principle. We believe that money is personal, which is why the Financial Health Diagnostic platform operates entirely inside your browser. No details, values, or calculations are sent to external databases or stored on remote servers. All local audit histories remain fully isolated inside your browser's local storage. You choose when to print or download reports.`,
      },
      terms: {
        title: 'Terms of Service',
        content: `The Financial Health Diagnostic belongs to an educational initiative developed to calculate deterministic ratios based on traditional accounting principles. While the thresholds mimic industry benchmarks faithfully, the scoring models should serve as analytical indicators. This is not certified wealth advisory, so please coordinate complex portfolios with standard financial consultancies.`,
      },
      disclaimer: {
        title: 'Disclaimer Notice',
        content: `All results, projections, and simulation changes produced by this application are mathematical estimations based on the provided inputs. Our engine guarantees formula accuracy, but external economic changes, inflationary pressures, or banking shifts remains the sole responsibility of the calculating user. Play responsibly with budgets!`,
      },
      contact: {
        title: 'Contact & Support',
        content: `Have questions, ideas, or feedback? Contech ID is dedicated to providing robust financial diagnostic tools that make complex accounting accessible. Reach out to our engineers at info@contech.id, or follow our official media handles to keep in absolute sync.`,
      }
    }
  },
  id: {
    about: 'Asesmen finansial deterministik yang dirancang khusus untuk mewujudkan sekuritas arus kas pribadi maupun bisnis Anda.',
    navHeader: 'Navigasi Menu Utama',
    legalHeader: 'Informasi Hukum & Layanan',
    privacy: 'Kebijakan Privasi',
    terms: 'Syarat & Ketentuan',
    disclaimer: 'Pernyataan Penyangkalan',
    contact: 'Hubungi Tim Teknis Kami',
    popups: {
      privacy: {
        title: 'Kebijakan Privasi',
        content: `Keamanan penuh data finansial Anda adalah prioritas utama kami. Platform Financial Health Diagnostic bekerja sepenuhnya di dalam browser Anda. Tidak ada detail nilai, jumlah, atau hasil hitung yang dikirimkan ke database eksternal maupun server jauh. Riwayat audit lokal tetap aman tersimpan lokal di dalam LocalStorage Anda sendiri. Anda bebas mencetak atau mengunduh laporan kapan saja.`,
      },
      terms: {
        title: 'Syarat & Ketentuan',
        content: `Alat Analisis Diagnosa ini dikembangkan sebagai sarana edukasi pemetaan keuangan didasari prinsip akuntansi global teruji. Seluruh tolok ukur merupakan representasi terbaik namun skor akhir tetap berfungsi sebagai panduan analitis mandiri. Ini bukan sarana anjuran investasi wajib, koordinasikan portofolio kompleks Anda bersama penasihat keuangan bersertifikat.`,
      },
      disclaimer: {
        title: 'Pernyataan Penyangkalan (Disclaimer)',
        content: `Seluruh hasil, proyeksi, dan perubahan simulator dalam aplikasi ini merupakan perkiraan matematis murni. Sistem kami menjamin kesesuaian formula, namun perubahan pasar, gejolak inflasi regional, atau kebijakan perbankan sepenuhnya di luar jangkauan tanggung jawab pengembang aplikasi. Gunakan analisis ini dengan bijak!`,
      },
      contact: {
        title: 'Hubungi Kami',
        content: `Ada pertanyaan, saran kolaborasi, atau butuh bantuan lebih lanjut? Contech ID berdedikasi menciptakan instrumen analisis keuangan yang inklusif untuk kemajuan bisnis. Layangkan surel Anda ke info@contech.id, atau ikuti terus media sosial resmi kami.`,
      }
    }
  }
};

const PROFILE_TEXT = {
  en: {
    title: 'Financial Profile Coordinates',
    subtitle: 'Manage your primary organizational goals, investment targets, and executive coordinates.',
    personalInfo: 'Personal Coordinates',
    financialTargets: 'GAAP Financial Focus',
    name: 'Full Name',
    phone: 'Phone Number',
    email: 'Corporate Email Address',
    goal: 'Primary Financial Goal / Asset Target',
    annualTarget: 'Annual Investment Target (IDR)',
    monthlyTarget: 'Monthly Savings Target (IDR)',
    saveBtn: 'Save Settings & Update Coordinates',
    activeStatus: 'Active Executive Member',
    verificationStatus: 'Highly Secure Account',
  },
  id: {
    title: 'Pusat Kontrol Profil Finansial',
    subtitle: 'Kelola tujuan organisasi utama Anda, target investasi, dan koordinat eksekutif.',
    personalInfo: 'Rincian Koordinat Pribadi',
    financialTargets: 'Target Fokus Keuangan GAAP',
    name: 'Nama Lengkap',
    phone: 'Nomor Telepon',
    email: 'Alamat Email Perusahaan',
    goal: 'Tujuan Finansial Utama / Target Aset',
    annualTarget: 'Target Investasi Tahunan (IDR)',
    monthlyTarget: 'Target Tabungan Bulanan (IDR)',
    saveBtn: 'Simpan Pengaturan & Perbarui Koordinat',
    activeStatus: 'Anggota Eksekutif Aktif',
    verificationStatus: 'Akun Keamanan Tinggi',
  }
};

const AUTH_TEXT = {
  en: {
    backToHome: 'Back to Home',
    signInTitle: 'Welcome Back, Executive',
    signInSubtitle: 'Sign in to access your secure GAAP diagnostics and simulated risk stress tests.',
    signUpTitle: 'Create Executive Account',
    signUpSubtitle: 'Establish your certified credentials to access customized capital intelligence systems.',
    email: 'Corporate Email Address',
    name: 'Full Name',
    phone: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signInBtn: 'Sign In to Platform',
    signUpBtn: 'Register Account',
    hasAccount: 'Already have an account? Sign In',
    noAccount: 'New to Platform? Create Account',
    demoBtn: 'Quick Login (Demo Account)',
    passwordsMismatch: 'Passwords do not match!',
    emailRegistered: 'Email already registered!',
    registerSuccess: 'Registration successful! Please sign in.',
    invalidCredentials: 'Invalid email or password!',
    emailNotRegistered: 'Email not registered!',
    loginSuccess: 'Login successful! Welcome back.',
  },
  id: {
    backToHome: 'Kembali ke Beranda',
    signInTitle: 'Selamat Datang Kembali, Eksekutif',
    signInSubtitle: 'Masuk sesi untuk mengakses laporan GAAP aman dan simulasi stress-test risiko Anda.',
    signUpTitle: 'Buat Akun Eksekutif Baru',
    signUpSubtitle: 'Daftarkan koordinat digital Anda untuk membuka rekomendasi kecerdasan kapital yang dikustomisasi.',
    email: 'Alamat Email Perusahaan',
    name: 'Nama Lengkap',
    phone: 'Nomor Telepon Seluler',
    password: 'Kata Sandi',
    confirmPassword: 'Konfirmasi Kata Sandi',
    signInBtn: 'Masuk ke Platform',
    signUpBtn: 'Daftarkan Akun',
    hasAccount: 'Sudah memiliki akun? Masuk Sini',
    noAccount: 'Belum punya akun? Daftarkan Baru',
    demoBtn: 'Masuk Cepat dengan Akun Demo',
    passwordsMismatch: 'Password dan Konfirmasi Password tidak sesuai!',
    emailRegistered: 'Alamat email sudah terdaftar!',
    registerSuccess: 'Registrasi berhasil! Silakan masuk sesi.',
    invalidCredentials: 'Email atau kata sandi tidak sesuai!',
    emailNotRegistered: 'Email tidak terdaftar!',
    loginSuccess: 'Login berhasil! Selamat datang kembali.',
  }
};

type ViewType = 'landing' | 'input' | 'dashboard' | 'report' | 'insights' | 'simulation' | 'profile' | 'login' | 'register';

const getViewFromPath = (path: string): ViewType => {
  const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
  const validViews: ViewType[] = ['input', 'dashboard', 'report', 'insights', 'simulation', 'profile', 'login', 'register'];
  if (validViews.includes(clean as ViewType)) {
    return clean as ViewType;
  }
  return 'landing';
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      // Cek apakah diakses dari subdomain khusus admin
        if (typeof window !== 'undefined' && window.location.hostname.includes('admin')) {
          if (window.location.pathname === '/' || window.location.pathname === '') {
            return 'admin-login';
          }
        }
        
        const fromPath = getViewFromPath(window.location.pathname);

      if (fromPath !== 'landing') {
        return fromPath;
      }
      const saved = localStorage.getItem('fhd_active_view') as ViewType;
      const validViews: ViewType[] = ['landing', 'input', 'dashboard', 'report', 'insights', 'simulation', 'profile', 'login', 'register'];
      if (saved && validViews.includes(saved)) {
        return saved;
      }
    }
    return 'landing';
  });

  const [userRole, setUserRole] = useState<'user' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('fhd_user_role') as 'user' | 'admin') || 'user';
    }
    return 'user';
  });

  const [inputs, setInputs] = useState<FinancialInputs | null>(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('fhd_current_user_email') || '';
      if (email) {
        const userPrefix = 'fhd_user_' + email.trim().toLowerCase().replace(/[@.]/g, '_') + '_';
        const cached = localStorage.getItem(userPrefix + 'inputs');
        if (cached) {
          try { return JSON.parse(cached); } catch (e) {}
        }
      }
    }
    return null;
  });

  const [results, setResults] = useState<CalculationResult | null>(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('fhd_current_user_email') || '';
      if (email) {
        const userPrefix = 'fhd_user_' + email.trim().toLowerCase().replace(/[@.]/g, '_') + '_';
        const cached = localStorage.getItem(userPrefix + 'results');
        if (cached) {
          try { return JSON.parse(cached); } catch (e) {}
        }
      }
    }
    return null;
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  // Authenticated session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhd_is_logged_in') === 'true';
    }
    return false;
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhd_current_user_email') || '';
    }
    return '';
  });

  // Login form status
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Register form status
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd-theme');
      return saved === 'dark';
    }
    return false;
  });

  // Profil & Settings states
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Legal Popups state
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'disclaimer' | 'contact' | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);
  const [enableToasts, setEnableToasts] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd_enable_toasts');
      return saved !== 'false';
    }
    return true;
  });

  // Profile data state
  const [profileName, setProfileName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhd_profile_name') || 'Abell RJ';
    }
    return 'Abell RJ';
  });
  const [profilePhone, setProfilePhone] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhd_profile_phone') || '+62 812-3456-7890';
    }
    return '+62 812-3456-7890';
  });
  const [profilePassword, setProfilePassword] = useState('');
  const [profilePasswordConfirm, setProfilePasswordConfirm] = useState('');
  const [profileEmail, setProfileEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhd_profile_email') || 'belajargg334@gmail.com';
    }
    return 'belajargg334@gmail.com';
  });
  const [profileGoal, setProfileGoal] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhd_profile_goal') || 'Business Capital Expansion & Debt Reduction';
    }
    return 'Business Capital Expansion & Debt Reduction';
  });
  const [profileAnnualTarget, setProfileAnnualTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd_profile_ann_target');
      return saved ? parseInt(saved, 10) : 120000000;
    }
    return 120000000;
  });
  const [profileMonthlyTarget, setProfileMonthlyTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd_profile_mon_target');
      return saved ? parseInt(saved, 10) : 10000500;
    }
    return 10000500;
  });

  const [profileAvatar, setProfileAvatar] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhd_profile_avatar') || '';
    }
    return '';
  });

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd_checked_steps');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const handleToggleStep = (stepKey: string) => {
    setCheckedSteps(prev => {
      const isChecked = !prev[stepKey];
      const updated = {
        ...prev,
        [stepKey]: isChecked
      };
      
      localStorage.setItem('fhd_checked_steps', JSON.stringify(updated));
      
      // Delay toast microtask to keep rendering sequence snappy
      setTimeout(() => {
        if (isChecked) {
          showToast(
            lang === 'id' 
              ? `Langkah selesai ditandai` 
              : `Action step completed!`, 
            'success'
          );
        } else {
          showToast(
            lang === 'id' 
              ? `Langkah diubah belum selesai` 
              : `Action marked incomplete`, 
            'info'
          );
        }
      }, 0);

      return updated;
    });
  };

  const t = TEXT[lang];
  const nt = NAV_TEXT[lang];
  const pt = PROFILE_TEXT[lang];

  // Sync view state to URL location pathname
  useEffect(() => {
    const path = location.pathname;
    
    // Redirect unauthenticated user attempting to access dashboard/input/etc.
    if (!isLoggedIn && ['/input', '/dashboard', '/report', '/insights', '/simulation', '/profile'].includes(path)) {
      setView('login');
      navigate('/login');
      showToast(lang === 'id' ? 'Silakan masuk atau daftar terlebih dahulu!' : 'Please log in or register to proceed!', 'info');
    } else {
      if (path === '/' || path === '') {
        if (view !== 'landing') setView('landing');
      } else if (path === '/login') {
        if (view !== 'login') setView('login');
      } else if (path === '/register') {
        if (view !== 'register') setView('register');
      } else if (path === '/input') {
        if (view !== 'input') setView('input');
      } else if (path === '/dashboard') {
        if (view !== 'dashboard') setView('dashboard');
      } else if (path === '/report') {
        if (view !== 'report') setView('report');
      } else if (path === '/insights') {
        if (view !== 'insights') setView('insights');
      } else if (path === '/simulation') {
        if (view !== 'simulation') setView('simulation');
      } else if (path === '/profile') {
        if (view !== 'profile') setView('profile');
      }
    }
  }, [location.pathname, isLoggedIn]);

  // Sync state view of the application to URL path change
  useEffect(() => {
    const pathMap: Record<string, string> = {
      landing: '/',
      login: '/login',
      register: '/register',
      input: '/input',
      dashboard: '/dashboard',
      report: '/report',
      insights: '/insights',
      simulation: '/simulation',
      profile: '/profile',
    };
    const targetPath = pathMap[view];
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [view]);

  // Save/load authentication and sync profile coordinates to current user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fhd_is_logged_in', isLoggedIn ? 'true' : 'false');
      localStorage.setItem('fhd_current_user_email', currentUserEmail);
    }
  }, [isLoggedIn, currentUserEmail]);

  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      const userPrefix = 'fhd_user_' + currentUserEmail.replace(/[@.]/g, '_') + '_';
      
      const loadedName = localStorage.getItem(userPrefix + 'name') || (currentUserEmail === 'demo@gmail.com' ? 'Demo Akun' : 'User');
      const loadedPhone = localStorage.getItem(userPrefix + 'phone') || (currentUserEmail === 'demo@gmail.com' ? '+62 812-1111-2222' : '+62 812-3456-7890');
      const loadedGoal = localStorage.getItem(userPrefix + 'goal') || (currentUserEmail === 'demo@gmail.com' ? 'Rencana Pensiun & Investasi Eksekutif' : 'Business Capital Expansion & Debt Reduction');
      const loadedAnn = localStorage.getItem(userPrefix + 'ann_target');
      const loadedMon = localStorage.getItem(userPrefix + 'mon_target');
      const loadedAvatar = localStorage.getItem(userPrefix + 'avatar') || '';

      setProfileName(loadedName);
      setProfilePhone(loadedPhone);
      setProfileEmail(currentUserEmail);
      setProfileGoal(loadedGoal);
      setProfileAnnualTarget(loadedAnn ? parseInt(loadedAnn, 10) : (currentUserEmail === 'demo@gmail.com' ? 350000000 : 120000000));
      setProfileMonthlyTarget(loadedMon ? parseInt(loadedMon, 10) : (currentUserEmail === 'demo@gmail.com' ? 25000000 : 10000500));
      setProfileAvatar(loadedAvatar);

      // Load user-specific diagnostic history from MySQL Cloud
      apiGetHistories(currentUserEmail).then(cloudHistories => {
        if (cloudHistories && cloudHistories.length > 0) {
          setHistory(cloudHistories);
          localStorage.setItem('fhd_history', JSON.stringify(cloudHistories));
        } else {
          setHistory([]);
        }
      });
    } else {
      setProfileName('Abell RJ');
      setProfilePhone('+62 812-3456-7890');
      setProfileEmail('belajargg334@gmail.com');
      setProfileGoal('Business Capital Expansion & Debt Reduction');
      setProfileAnnualTarget(120000000);
      setProfileMonthlyTarget(10000500);
      setProfileAvatar('');
    }
  }, [isLoggedIn, currentUserEmail]);

  // Scroll to top on page navigation transitions - Multi-layered bulletproof reset
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo({ top: 0 });
      document.body.scrollTo({ top: 0 });
      
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTo({ top: 0 });
        mainEl.scrollTop = 0;
      }
      
      const appContainer = document.getElementById('app-container');
      if (appContainer) {
        appContainer.scrollTo({ top: 0 });
        appContainer.scrollTop = 0;
      }
    } catch (err) {
      console.warn('Scroll reset error:', err);
    }
  }, [view]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'success') => {
    if (!enableToasts) return;
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 2800);
  };

  const syncUserData = async (email: string) => {
    const userEmail = email.trim().toLowerCase();
    if (!userEmail) return false;

    const userPrefix = 'fhd_user_' + userEmail.replace(/[@.]/g, '_') + '_';

    // 1. Instant recovery from per-user cache
    let hasLoaded = false;
    try {
      const cachedInputs = localStorage.getItem(userPrefix + 'inputs');
      const cachedResults = localStorage.getItem(userPrefix + 'results');
      if (cachedInputs && cachedResults) {
        const parsedInputs = JSON.parse(cachedInputs);
        const parsedResults = JSON.parse(cachedResults);
        setInputs(parsedInputs);
        setResults(parsedResults);
        hasLoaded = true;
      }
    } catch (e) {
      console.warn('Failed parsing cached user inputs', e);
    }

    // 2. Fetch fresh data from MySQL Cloud Aiven
    try {
      const profile = await apiGetUserProfile();
      if (profile) {
        localStorage.setItem(userPrefix + 'name', profile.name || '');
        localStorage.setItem(userPrefix + 'phone', profile.phone || '');
        localStorage.setItem(userPrefix + 'goal', profile.goal || '');
        localStorage.setItem(userPrefix + 'ann_target', profile.annual_target || '0');
        localStorage.setItem(userPrefix + 'mon_target', profile.monthly_target || '0');
        if (profile.avatar) localStorage.setItem(userPrefix + 'avatar', profile.avatar);
          setProfileName(profile.name || '');
          setProfilePhone(profile.phone || '');
            setProfileEmail(profile.email || '');
            setCurrentUserEmail(profile.email || '');
            localStorage.setItem('fhd_user_email', profile.email || '');
          setProfileGoal(profile.goal || '');
      }

      const latest = await apiGetLatestUserDiagnostic(userEmail);
      if (latest && latest.inputs) {
        setInputs(latest.inputs);
        const calculated = calculateFinancialHealth(latest.inputs, lang);
        setResults(calculated);

        localStorage.setItem(userPrefix + 'inputs', JSON.stringify(latest.inputs));
        localStorage.setItem(userPrefix + 'results', JSON.stringify(calculated));

        hasLoaded = true;
      } else {
        // If there's no latest diagnostic in the cloud (e.g., deleted by admin), clear local cache
        setInputs(null);
        setResults(null);
        localStorage.removeItem(userPrefix + 'inputs');
        localStorage.removeItem(userPrefix + 'results');
        hasLoaded = false;
      }
    } catch (e) {
      console.warn('Failed fetching latest user diagnostic from cloud', e);
    }

    // 3. Sync histories
    try {
      const histories = await apiGetHistories(userEmail);
      if (histories && histories.length > 0) {
        setHistory(histories);
        localStorage.setItem('fhd_history', JSON.stringify(histories));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.warn('Failed syncing histories from cloud', e);
      if (!hasLoaded) setHistory([]);
    }

    if (!hasLoaded) {
      setInputs(null);
      setResults(null);
    }

    return hasLoaded;
  };

  // Synchronize URL and localStorage with active view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fhd_active_view', view);
      const targetPath = view === 'landing' ? '/' : `/${view}`;
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [view]);

  // Synchronize view when browser back/forward buttons are pressed
  useEffect(() => {
    const fromPath = getViewFromPath(location.pathname);
    setView(prev => (prev !== fromPath ? fromPath : prev));
  }, [location.pathname]);

  // Quiet background synchronization with MySQL Cloud Aiven
  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      syncUserData(currentUserEmail);
    } else {
      try {
        const stored = localStorage.getItem('fhd_history');
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, [isLoggedIn, currentUserEmail]);

  // Sync dark theme with body tag
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.backgroundColor = isDark ? '#0b0f19' : '#fafbfc';
      document.body.style.transition = 'background-color 0.5s ease-in-out';
    }
  }, [isDark]);

  // Recalculate if language changes while viewing dashboard/report
  useEffect(() => {
    if (results && inputs) {
       const newRes = calculateFinancialHealth(inputs, lang);
       setResults(newRes);
    }
  }, [lang]);

  const handleCalculate = (data: FinancialInputs) => {
    setInputs(data);
    const res = calculateFinancialHealth(data, lang);
    
    const newEntry: HistoryEntry = {
      timestamp: new Date().toISOString(),
      totalScore: res.totalScore,
      netCashflow: res.metrics.netCashflow,
      runwayMonths: res.metrics.runwayMonths,
    };

    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('fhd_history', JSON.stringify(updatedHistory));

    // Save to MySQL in Laravel API
    apiSaveDiagnostic(res, data);

    // Save to per-user localStorage cache
    if (currentUserEmail) {
      const userPrefix = 'fhd_user_' + currentUserEmail.replace(/[@.]/g, '_') + '_';
      localStorage.setItem(userPrefix + 'inputs', JSON.stringify(data));
      localStorage.setItem(userPrefix + 'results', JSON.stringify(res));
    }

    setResults(res);
    setView('dashboard');
    showToast(lang === 'id' ? 'Kalkulasi diagnosa berhasil dijalankan!' : 'Diagnostic calculation successful!', 'success');
  };

  const handleCancelEdit = () => {
    if (currentUserEmail) {
      const userPrefix = 'fhd_user_' + currentUserEmail.replace(/[@.]/g, '_') + '_';
      const cachedInputs = localStorage.getItem(userPrefix + 'inputs');
      const cachedResults = localStorage.getItem(userPrefix + 'results');
      if (cachedInputs && cachedResults) {
        try {
          setInputs(JSON.parse(cachedInputs));
          setResults(JSON.parse(cachedResults));
        } catch (e) {
          console.warn('Failed resetting cached inputs on cancel', e);
        }
      }
    }
    setView('dashboard');
    showToast(lang === 'id' ? 'Perubahan dibatalkan. Kembali ke dashboard.' : 'Changes cancelled. Returned to dashboard.', 'info');
  };

  const navigateWithAutoDiscard = (targetView: typeof view) => {
    if (view === 'input' && targetView !== 'input') {
      if (currentUserEmail) {
        const userPrefix = 'fhd_user_' + currentUserEmail.replace(/[@.]/g, '_') + '_';
        const cachedInputs = localStorage.getItem(userPrefix + 'inputs');
        const cachedResults = localStorage.getItem(userPrefix + 'results');
        if (cachedInputs && cachedResults) {
          try {
            setInputs(JSON.parse(cachedInputs));
            setResults(JSON.parse(cachedResults));
          } catch (e) {
            console.warn('Error resetting cached inputs', e);
          }
        }
      }
    }
    setView(targetView);
  };

  const handlePrint = () => {
    setView('report');
    setTimeout(() => {
        window.print();
    }, 100);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsDownloading(true);
    showToast(lang === 'id' ? 'Menyiapkan unduhan PDF...' : 'Preparing PDF download...', 'info');

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let currentPage = 0;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        currentPage++;
        pdf.addImage(imgData, 'PNG', 0, -(pdfHeight * currentPage), pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Financial_Health_Report_${lang}_${new Date().toISOString().split('T')[0]}.pdf`);
      showToast(lang === 'id' ? 'Laporan PDF berhasil diunduh!' : 'PDF report downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF generation failed', error);
      alert('Failed to generate PDF. Please try printing to PDF instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleLang = () => {
    setLang(prev => {
      const nextLang = prev === 'en' ? 'id' : 'en';
      showToast(nextLang === 'id' ? 'Bahasa berhasil diubah!' : 'Language updated successfully!', 'info');
      return nextLang;
    });
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const newVal = !prev;
      localStorage.setItem('fhd-theme', newVal ? 'dark' : 'light');
      showToast(newVal ? 'Mode Gelap diaktifkan!' : 'Mode Terang diaktifkan!', 'info');
      return newVal;
    });
  };

  const handleStartApp = () => {
    if (isLoggedIn) {
      setView('input');
    } else {
      setView('login');
      showToast(lang === 'id' ? 'Silakan masuk atau daftar terlebih dahulu!' : 'Please log in or register to proceed!', 'info');
    }
  };

  const handleLogout = () => {
    setShowAccountDropdown(false);
    setIsLoggedIn(false);
    setUserRole('user');
    localStorage.removeItem('fhd_user_role');
    
    // Clear demo data on logout so it doesn't persist across sessions
    if (currentUserEmail === 'demo@gmail.com') {
      const userPrefix = 'fhd_user_demo_gmail_com_';
      localStorage.removeItem(userPrefix + 'inputs');
      localStorage.removeItem(userPrefix + 'results');
      localStorage.removeItem('fhd_history');
    }

    setCurrentUserEmail('');
    setInputs(null);
    setResults(null);
    setHistory([]);
    apiLogout();
    setView('landing');
    showToast(lang === 'id' ? 'Berhasil keluar sesi.' : 'Successfully logged out.', 'info');
  };

  const clearDiagnosticHistory = () => {
    const userPrefix = 'fhd_user_' + currentUserEmail.replace(/[@.]/g, '_') + '_';
    localStorage.removeItem('fhd_history');
    localStorage.removeItem(userPrefix + 'inputs');
    localStorage.removeItem(userPrefix + 'results');
    setHistory([]);
    setInputs(null);
    setResults(null);
    apiClearHistories(currentUserEmail);
    setShowSettingsModal(false);
    setView('input');
    showToast(lang === 'id' ? 'Seluruh data riwayat & hasil aktif dibersihkan!' : 'All active results & diagnostic history cleared!', 'warning');
  };

  const handleAvatarFileChange = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showToast(lang === 'id' ? 'Ukuran file terlalu besar (Maks 10MB)' : 'File size too large (Max 10MB)', 'warning');
      return;
    }
    
    // Immediate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProfileAvatar(base64);
      localStorage.setItem('fhd_profile_avatar', base64);
    };
    reader.readAsDataURL(file);

    showToast(lang === 'id' ? 'Mengunggah foto ke Cloudinary CDN...' : 'Uploading photo to Cloudinary CDN...', 'info');

    try {
      const cloudinaryUrl = await apiUploadAvatar(file, currentUserEmail);
      if (cloudinaryUrl) {
        setProfileAvatar(cloudinaryUrl);
        localStorage.setItem('fhd_profile_avatar', cloudinaryUrl);
        const userPrefix = 'fhd_user_' + currentUserEmail.replace(/[@.]/g, '_') + '_';
        localStorage.setItem(userPrefix + 'avatar', cloudinaryUrl);
        showToast(lang === 'id' ? 'Foto profil tersimpan di Cloudinary CDN!' : 'Profile photo saved to Cloudinary CDN!', 'success');
      }
    } catch (err) {
      console.warn('Avatar Cloudinary upload error:', err);
    }
  };

  const handleLoadDemoFromTest = () => {
    handleCalculate(DEMO_DATA_ABELL);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    if (registerPassword !== registerConfirmPassword) {
      showToast(AUTH_TEXT[lang].passwordsMismatch, 'warning');
      setRegisterLoading(false);
      return;
    }

    const emailNormalized = registerEmail.trim().toLowerCase();

    // Register to Laravel MySQL backend FIRST (authoritative)
    const apiRes = await apiRegister(registerName.trim(), emailNormalized, registerPassword, registerPhone.trim());
    
    let users = [];
    try {
      const savedUsersStr = localStorage.getItem('fhd_registered_users') || '[]';
      users = JSON.parse(savedUsersStr);
    } catch (err) {
      users = [];
    }

    if (apiRes) {
      // Backend is online
      if (!apiRes.success) {
        showToast(apiRes.message || AUTH_TEXT[lang].emailRegistered, 'warning');
        setRegisterLoading(false);
        return;
      }
      // Backend success! Overwrite/add to local storage for offline fallback
      users = users.filter((u: any) => u.email.toLowerCase() !== emailNormalized);
    } else {
      // Backend is offline, rely on local storage check
      const emailExists = users.some((u: any) => u.email.toLowerCase() === emailNormalized) || emailNormalized === 'demo@gmail.com';
      if (emailExists) {
        showToast(AUTH_TEXT[lang].emailRegistered, 'warning');
        setRegisterLoading(false);
        return;
      }
    }

    // Purge any stale cache from previous deleted session for this email
    const userPrefix = 'fhd_user_' + emailNormalized.replace(/[@.]/g, '_') + '_';
    localStorage.removeItem(userPrefix + 'inputs');
    localStorage.removeItem(userPrefix + 'results');
    localStorage.removeItem(userPrefix + 'name');
    localStorage.removeItem(userPrefix + 'phone');
    localStorage.removeItem(userPrefix + 'goal');
    localStorage.removeItem(userPrefix + 'ann_target');
    localStorage.removeItem(userPrefix + 'mon_target');
    localStorage.removeItem(userPrefix + 'avatar');

    // Save to local storage
    const newUser = {
      name: registerName.trim(),
      phone: registerPhone.trim(),
      email: emailNormalized,
      password: registerPassword
    };
    users.push(newUser);
    localStorage.setItem('fhd_registered_users', JSON.stringify(users));

    showToast(AUTH_TEXT[lang].registerSuccess, 'success');
    
    // Clear registration fields
    setRegisterName('');
    setRegisterPhone('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    
    // Switch to login
    setRegisterLoading(false);
    setView('login');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const emailNormalized = loginEmail.trim().toLowerCase();
    
    // Check Demo Login
    if (emailNormalized === 'demo@gmail.com') {
      const isDemoPassCorrect = loginPassword === 'demo123' || loginPassword === 'demo';
      if (isDemoPassCorrect) {
        setIsLoggedIn(true);
        setUserRole('user');
        localStorage.setItem('fhd_user_role', 'user');
        setCurrentUserEmail('demo@gmail.com');
        showToast(AUTH_TEXT[lang].loginSuccess, 'success');
        setLoginEmail('');
        setLoginPassword('');
        const hasData = await syncUserData('demo@gmail.com');
        setView(hasData ? 'dashboard' : 'input');
        setAuthLoading(false);
        return;
      }
    }


    // Try Laravel API login first
    const apiRes = await apiLogin(emailNormalized, loginPassword);
    if (apiRes) {
      if (apiRes.success && apiRes.user) {
        setIsLoggedIn(true);
        const role = (apiRes.user.role as 'user' | 'admin') || 'user';
        setUserRole(role);
        localStorage.setItem('fhd_user_role', role);
        // Blokir akun admin dari login di halaman user
        if (role === 'admin') {
          setAuthLoading(false);
          setIsLoggedIn(false);
          showToast(
            lang === 'id'
              ? '⛔ Akun Admin tidak bisa login di sini. Silakan gunakan halaman Admin Panel.'
              : '⛔ Admin accounts cannot sign in here. Please use the Admin Panel.',
            'warning'
          );
          return;
        }
        setCurrentUserEmail(emailNormalized);
        showToast(AUTH_TEXT[lang].loginSuccess, 'success');
        setLoginEmail('');
        setLoginPassword('');
        const hasData = await syncUserData(emailNormalized);
        setView(hasData ? 'dashboard' : 'input');
        setAuthLoading(false);
        return;
      } else {
        // Server explicitly rejected the login (e.g. invalid credentials or user deleted by admin)
        // We MUST block fallback to local storage so deleted users can't bypass the admin deletion
        showToast(apiRes.message || AUTH_TEXT[lang].invalidCredentials, 'warning');
        setAuthLoading(false);
        return;
      }
    } else if (navigator.onLine) {
      // If apiRes is null (network error) but we are online, it's likely a CORS error 
      // resulting from a 401 Unauthorized response when the user was deleted by Admin.
      // We must block local fallback to prevent the deleted user from logging in.
      showToast(AUTH_TEXT[lang].invalidCredentials, 'warning');
      setAuthLoading(false);
      return;
    }

    // Check Multi-user Register local fallback
    let users = [];
    try {
      const savedUsersStr = localStorage.getItem('fhd_registered_users') || '[]';
      users = JSON.parse(savedUsersStr);
    } catch (err) {
      users = [];
    }

    const matchedUserIndex = users.findIndex((u: any) => u.email.toLowerCase() === emailNormalized);
    if (matchedUserIndex === -1) {
      showToast(AUTH_TEXT[lang].emailNotRegistered, 'warning');
      setAuthLoading(false);
      return;
    }

    const matchedUser = users[matchedUserIndex];
    if (matchedUser.password !== loginPassword) {
      showToast(AUTH_TEXT[lang].invalidCredentials, 'warning');
      setAuthLoading(false);
      return;
    }

    // Login success local fallback
    setIsLoggedIn(true);
    const role = (matchedUser.role as 'user' | 'admin') || 'user';
    setUserRole(role);
    localStorage.setItem('fhd_user_role', role);
    // Blokir akun admin dari login di halaman user (local fallback)
    if (role === 'admin') {
      setAuthLoading(false);
      setIsLoggedIn(false);
      showToast(
        lang === 'id'
          ? '⛔ Akun Admin tidak bisa login di sini. Silakan gunakan halaman Admin Panel.'
          : '⛔ Admin accounts cannot sign in here. Please use the Admin Panel.',
        'warning'
      );
      return;
    }
    setCurrentUserEmail(emailNormalized);
    showToast(AUTH_TEXT[lang].loginSuccess, 'success');
    setLoginEmail('');
    setLoginPassword('');
    const hasData = await syncUserData(emailNormalized);
    setView(hasData ? 'dashboard' : 'input');
    setAuthLoading(false);
  };

  const handleDemoQuickLogin = async () => {
    setIsLoggedIn(true);
    setUserRole('user');
    localStorage.setItem('fhd_user_role', 'user');
    setCurrentUserEmail('demo@gmail.com');
    showToast(AUTH_TEXT[lang].loginSuccess, 'success');
    const hasData = await syncUserData('demo@gmail.com');
    setView(hasData ? 'dashboard' : 'input');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      view === 'landing' 
        ? '' 
        : isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#fafbfc] text-[#0f172a]'
    }`}>
      
      {view === 'landing' ? (
        <LandingPage 
          onStart={handleStartApp} 
          lang={lang} 
          onToggleLang={toggleLang} 
          isDark={isDark}
          onToggleDark={toggleTheme}
          onLogin={() => setView('login')}
          onSignUp={() => setView('register')}
        />
      ) : view === 'login' || view === 'register' || view === 'admin-login' ? (
        <div className={`min-h-screen flex flex-col justify-between transition-colors duration-500 relative overflow-hidden ${
          isDark ? 'bg-[#060814] text-slate-100' : 'bg-[#f8fafc] text-[#0f172a]'
        }`}>
          {/* Glowing gradient backdrops in dark mode */}
          {isDark && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] animate-pulse duration-[7s]" />
              <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse duration-[10s]" />
            </div>
          )}

          {/* Premium Utility Navigation */}
          <header className="w-full max-w-[1780px] mx-auto px-6 sm:px-12 h-20 flex items-center justify-between relative z-10 no-print">
            {/* Elegant Back Button */}
            <button 
              onClick={() => setView('landing')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isDark 
                  ? 'border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-850' 
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs shadow-slate-100'
              }`}
            >
              <ArrowLeft size={14} />
              <span>{AUTH_TEXT[lang].backToHome}</span>
            </button>

            {/* Quick settings: Language & Theme Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-105 ${
                  isDark 
                    ? 'border-slate-800 bg-slate-900 text-amber-400 hover:text-amber-300 hover:bg-slate-850' 
                    : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <button 
                onClick={toggleLang}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-extrabold cursor-pointer hover:scale-105 ${
                  isDark 
                    ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                {lang === 'en' ? 'ENGLISH' : 'INDONESIA'}
              </button>
            </div>
          </header>

          {/* Premium Glass Card */}
          <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`w-full max-w-[480px] p-5 sm:p-10 rounded-3xl border shadow-2xl backdrop-blur-xl ${
                isDark 
                  ? 'bg-slate-950/80 border-slate-850 shadow-slate-950/40' 
                  : 'bg-white border-slate-200/80 shadow-slate-100'
              }`}
            >
              {/* Logo / Title */}
              <div className="flex flex-col items-center text-center mb-8">
                <img
                  src="/logo.png"
                  alt="Financial Health logo"
                  className="w-12 h-12 rounded-2xl object-contain shadow-lg shadow-blue-500/20 mb-3 hover:rotate-6 transition-transform"
                />
                <h2 className="text-xl font-black tracking-tight leading-none mb-1">
                  Financial<span className="text-blue-655 font-black text-blue-600">Health</span>
                </h2>
                <div className={`text-[9.5px] font-mono uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Diagnostic Platform
                </div>
              </div>

              {/* Login Page Card */}
              {view === 'admin-login' ? (
                <AdminLogin 
                  isDark={isDark} 
                  lang={lang} 
                  onLoginSubmit={(e, email, pass) => {
                    setLoginEmail(email);
                    setLoginPassword(pass);
                    handleLoginSubmit(e);
                  }}
                  authLoading={authLoading}
                  onSwitchToUser={() => setView('login')}
                />
              ) : view === 'login' ? (
                <div>
                  <div className="text-center mb-6">
                    <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {lang === 'en' ? 'Sign In' : 'Masuk Sesi'}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {AUTH_TEXT[lang].signInSubtitle}
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {AUTH_TEXT[lang].email}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Mail size={15} />
                        </span>
                        <input 
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="executive@company.com"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' 
                              : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {AUTH_TEXT[lang].password}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock size={15} />
                        </span>
                        <input 
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-11 pr-11 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' 
                              : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={authLoading}
                      className={`w-full mt-2 py-3 bg-gradient-to-r from-blue-700 to-indigo-650 hover:from-blue-800 hover:to-indigo-750 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all ${authLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:scale-[1.01]'}`}
                    >
                      {authLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        AUTH_TEXT[lang].signInBtn
                      )}
                    </button>
                  </form>

                  {/* Elegant Separator */}
                  <div className="relative my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-800/10 dark:border-slate-150/10"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">or</span>
                    <span className="flex-grow border-t border-slate-800/10 dark:border-slate-150/10"></span>
                  </div>

                  {/* Interactive Quick Access Account Demo Button */}
                  <button 
                    onClick={handleDemoQuickLogin}
                    className={`w-full py-3 border font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] ${
                      isDark 
                        ? 'border-sky-500/30 bg-sky-950/10 text-sky-400 hover:bg-sky-950/20' 
                        : 'border-sky-150 bg-sky-50 text-sky-700 hover:bg-sky-100'
                    }`}
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    <span>{AUTH_TEXT[lang].demoBtn}</span>
                  </button>

                  {/* Form Switch Trigger */}
                  <div className="text-center mt-6">
                    <button 
                      onClick={() => setView('register')}
                      className={`text-[11px] font-extrabold transition-colors cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'
                      }`}
                    >
                      {AUTH_TEXT[lang].noAccount}
                    </button>
                  </div>
                </div>
              ) : (
                /* Register Page Card */
                <div>
                  <div className="text-center mb-6">
                    <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {lang === 'en' ? 'Register Account' : 'Registrasi Akun'}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {AUTH_TEXT[lang].signUpSubtitle}
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {AUTH_TEXT[lang].name}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <User size={15} />
                        </span>
                        <input 
                          type="text"
                          required
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          placeholder="Your Full Name"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' 
                              : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {AUTH_TEXT[lang].phone}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Smartphone size={15} />
                        </span>
                        <input 
                          type="tel"
                          required
                          value={registerPhone}
                          onChange={(e) => setRegisterPhone(e.target.value)}
                          placeholder="+62 812-3456-7890"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' 
                              : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {AUTH_TEXT[lang].email}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Mail size={15} />
                        </span>
                        <input 
                          type="email"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="executive@company.com"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' 
                              : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {AUTH_TEXT[lang].password}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock size={15} />
                        </span>
                        <input 
                          type={showRegisterPassword ? 'text' : 'password'}
                          required
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-11 pr-11 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' 
                              : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                        >
                          {showRegisterPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        {AUTH_TEXT[lang].confirmPassword}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock size={15} />
                        </span>
                        <input 
                          type={showRegisterPassword ? 'text' : 'password'}
                          required
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-11 pr-11 py-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' 
                              : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={registerLoading}
                      className={`w-full mt-2 py-3 bg-gradient-to-r from-blue-700 to-indigo-650 hover:from-blue-800 hover:to-indigo-750 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all ${registerLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:scale-[1.01]'}`}
                    >
                      {registerLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        AUTH_TEXT[lang].signUpBtn
                      )}
                    </button>
                  </form>

                  {/* Switch to Login */}
                  <div className="text-center mt-6">
                    <button 
                      onClick={() => setView('login')}
                      className={`text-[11px] font-extrabold transition-colors cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'
                      }`}
                    >
                      {AUTH_TEXT[lang].hasAccount}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </main>

          <footer className={`w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 py-6 text-center text-[10px] font-mono uppercase tracking-widest ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Â© {new Date().getFullYear()} Contech ID. Secured Financial Diagnostic Environment.
          </footer>
        </div>
      ) : view === 'admin' ? (
        <AdminDashboard 
          isDark={isDark}
          lang={lang}
          onSwitchToUserView={() => setView(inputs ? 'dashboard' : 'input')}
          onLogout={handleLogout}
          onToggleDark={toggleTheme}
          onToggleLang={toggleLang}
          showToast={showToast}
        />
      ) : (
        <>
          {/* Re-designed Premium Navigation / Header - Aligned with the Landing Page exact style & width */}
          <div className={`no-print border-b sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
            isDark ? 'bg-[#0b0f19]/85 border-slate-800 text-slate-100' : 'bg-white/85 border-slate-150 text-[#0f172a]'
          }`}>
            <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
              
              {/* Brand Logo */}
              <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setView('landing')}>
                <img
                  src="/logo.png"
                  alt="Financial Health logo"
                  className="w-10 h-10 rounded-xl object-contain shadow-md shadow-blue-500/20"
                />
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-tight leading-none">
                    Financial<span className="text-blue-600 font-extrabold">Health</span>
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-widest mt-0.5 font-bold ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>Diagnostic Platform</span>
                </div>
              </div>

              {/* Main Desktop Navigation Menu - 3 items requested + clean positioning */}
              <div className="hidden md:flex items-center gap-1.5 bg-slate-100/5 px-2 py-1.5 rounded-full border border-transparent">
                
                {/* 1. Diagnostic Hub (Dashboard or Input form based on active inputs) */}
                <button 
                  onClick={() => navigateWithAutoDiscard(inputs ? 'dashboard' : 'input')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-350 flex items-center gap-2 ${
                    view === 'dashboard' || view === 'input' || view === 'report'
                      ? isDark 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-[#0f172a] text-white shadow-md'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  <span>{nt.diagnostic}</span>
                </button>

                {/* 2. Brand-new Scenario Simulation view (Stress testing & Crises modeling) */}
                <button 
                  onClick={() => navigateWithAutoDiscard('simulation')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-350 flex items-center gap-2 ${
                    view === 'simulation'
                      ? isDark 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-[#0f172a] text-white shadow-md'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Zap size={14} className={view === 'simulation' ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'} />
                  <span>{nt.stressTest}</span>
                </button>

                {/* 3. Methodology & Diagnostics benchmark terms */}
                <button 
                  onClick={() => navigateWithAutoDiscard('insights')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-350 flex items-center gap-2 ${
                    view === 'insights'
                      ? isDark 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-[#0f172a] text-white shadow-md'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>{nt.methodology}</span>
                </button>

                {/* 4. Admin Panel Quick Switcher (Only visible to Admin) */}
                {userRole === 'admin' && (
                  <button 
                    onClick={() => setView('admin')}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-350 flex items-center gap-1.5 cursor-pointer ${
                      view === 'admin'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                        : isDark
                          ? 'text-purple-400 hover:text-white hover:bg-purple-900/30 border border-purple-500/30'
                          : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 border border-purple-200'
                    }`}
                  >
                    <ShieldCheck size={14} />
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>

              {/* Utility Tools on right portion of Navbar: dark toggle, locale, and Avatar Profile Dropdown */}
              <div className="flex items-center gap-3">
                 
                 {/* Quick Back link which helps user to revise their metric inputs immediately */}
                 {view !== 'input' && (
                     <button 
                       onClick={() => setView('input')}
                       className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                         isDark 
                           ? 'border-slate-800 bg-slate-900/30 hover:bg-slate-900 text-slate-300' 
                           : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                       } hidden sm:flex cursor-pointer`}
                     >
                       <ArrowLeft size={13} /> {t.editInputs}
                     </button>
                 )}

                 {/* Light/Dark mode switcher */}
                 <button
                    onClick={toggleTheme}
                    className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                      isDark 
                        ? 'border-slate-800 bg-slate-900/40 text-amber-400 hover:text-amber-300 hover:bg-slate-800' 
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                 >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                 </button>

                 {/* Language selector Globe button */}
                 <button 
                    onClick={toggleLang}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark 
                        ? 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-800' 
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                 >
                    <Globe size={13} />
                    <span>{lang === 'en' ? 'EN' : 'ID'}</span>
                 </button>

                 {/* Account Profile Box with interactive dropdown trigger */}
                 <div className="relative">
                   <button
                     onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                     className={`flex items-center gap-2 p-1.5 pl-3 rounded-xl border cursor-pointer select-none transition-all ${
                       showAccountDropdown 
                         ? 'border-blue-500 bg-blue-500/5' 
                         : isDark 
                           ? 'border-slate-800 bg-slate-900/30 hover:border-slate-700' 
                           : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                     }`}
                   >
                     <div className="flex flex-col text-right hidden sm:flex">
                       <span className={`text-xs font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{profileName}</span>
                       <span className="text-[9px] text-emerald-500 font-extrabold uppercase leading-none">{nt.userStatus}</span>
                     </div>
                     {profileAvatar ? (
                       <img 
                         src={profileAvatar} 
                         alt="Avatar" 
                         referrerPolicy="no-referrer"
                         className="w-8 h-8 rounded-lg object-cover shadow-sm bg-slate-100 border border-slate-200/20 shrink-0" 
                       />
                     ) : (
                       <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold uppercase text-xs flex items-center justify-center shadow-sm shrink-0">
                         {(() => {
                           const parts = profileName.trim().split(/\s+/);
                           if (!parts || parts.length === 0 || parts[0] === '') return 'P';
                           if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                           return (parts[0][0] + parts[1][0]).toUpperCase();
                         })()}
                       </div>
                     )}
                     <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showAccountDropdown ? 'rotate-180' : ''}`} />
                   </button>

                   {/* Dropdown Menu - Aligned perfectly with neat margins */}
                   {showAccountDropdown && (
                     <>
                       {/* Transparent background blocker overlay */}
                       <div className="fixed inset-0 z-40" onClick={() => setShowAccountDropdown(false)}></div>
                       
                       <div className={`absolute right-0 mt-2.5 w-60 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
                         isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                       }`}>
                         
                         {/* Dropdown Header containing User Info */}
                         <div className={`px-4 py-3 border-b mb-1 ${isDark ? 'border-slate-850' : 'border-slate-100'}`}>
                           <p className={`text-xs font-extrabold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{profileName}</p>
                           <p className="text-[10px] text-slate-400 truncate mt-0.5">{profileEmail}</p>
                         </div>

                         {/* Dropdown Options */}
                          {userRole === 'admin' && (
                            <button
                              onClick={() => { setShowAccountDropdown(false); setView('admin'); }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                                isDark ? 'hover:bg-purple-950/40 text-purple-400' : 'hover:bg-purple-50 text-purple-700'
                              }`}
                            >
                              <ShieldCheck size={14} className="text-purple-500" />
                              <span>Admin Console</span>
                            </button>
                          )}
                         <button
                           onClick={() => { setShowAccountDropdown(false); setView('profile'); }}
                           className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                             isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                           }`}
                         >
                           <User size={14} className="text-blue-500" />
                           <span>{nt.profile}</span>
                         </button>

                         <button
                           onClick={() => { setShowAccountDropdown(false); setShowSettingsModal(true); }}
                           className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                             isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                           }`}
                         >
                           <Settings size={14} className="text-purple-500" />
                           <span>{nt.settings}</span>
                         </button>

                         <div className={`border-t my-1 ${isDark ? 'border-slate-850' : 'border-slate-100'}`}></div>

                         <button
                           onClick={handleLogout}
                           className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-rose-500 hover:bg-rose-500/10 transition-all flex items-center gap-2.5"
                         >
                           <LogOut size={14} />
                           <span>{nt.logout}</span>
                         </button>

                       </div>
                     </>
                   )}
                 </div>

              </div>
            </div>
            
          </div>

          {/* Mobile Bottom Navigation Bar (Diagnostic Dashboard, Stress Simulation, Methodology, Profile) */}
          <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t backdrop-blur-md flex items-center justify-around px-2 no-print shadow-2xl transition-all ${
            isDark ? 'bg-[#0b0f19]/90 border-slate-850 text-slate-100' : 'bg-white/94 border-slate-200 text-[#0f172a]'
          }`}>
            <button 
              onClick={() => navigateWithAutoDiscard(inputs ? 'dashboard' : 'input')} 
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9.5px] font-black tracking-tight transition-all cursor-pointer ${
                view === 'dashboard' || view === 'input' || view === 'report' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <LayoutDashboard size={18} className="mb-0.5" />
              <span>{lang === 'id' ? 'Diagnosa' : 'Diagnostic'}</span>
            </button>
            <button 
              onClick={() => navigateWithAutoDiscard('simulation')} 
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9.5px] font-black tracking-tight transition-all cursor-pointer ${
                view === 'simulation' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Zap size={18} className="mb-0.5" />
              <span>{lang === 'id' ? 'Simulasi' : 'Simulation'}</span>
            </button>
            <button 
              onClick={() => navigateWithAutoDiscard('insights')} 
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9.5px] font-black tracking-tight transition-all cursor-pointer ${
                view === 'insights' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <BookOpen size={18} className="mb-0.5" />
              <span>{lang === 'id' ? 'Metode' : 'Methodology'}</span>
            </button>
            <button 
              onClick={() => navigateWithAutoDiscard('profile')} 
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9.5px] font-black tracking-tight transition-all cursor-pointer ${
                view === 'profile' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <User size={18} className="mb-0.5" />
              <span>{lang === 'id' ? 'Profil' : 'Profile'}</span>
            </button>
          </div>

          {/* Main Content with Premium Full Page width aligned left/right to mock Landing page constraints */}
          <main className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-6 pb-24 md:pb-6 min-h-[calc(100vh-140px)]">
            
            {view === 'input' && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-4">
                   <div className="w-9 h-9 mx-auto bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-1.5 shadow-sm border border-blue-500/10">
                     <Activity size={18} className="animate-pulse" />
                   </div>
                   <h1 className={`text-xl sm:text-2xl font-black tracking-tight mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.inputTitle}</h1>
                   <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.inputSubtitle}</p>
                </div>
                <InputForm 
                  initialInputs={inputs} 
                  onCalculate={handleCalculate} 
                  onCancel={inputs ? handleCancelEdit : undefined}
                  lang={lang} 
                  isDark={isDark} 
                />
              </div>
            )}

            {view === 'dashboard' && results && inputs && (
              <Dashboard 
                results={results} 
                inputs={inputs} 
                history={history}
                onPrint={handlePrint} 
                lang={lang}
                isDark={isDark}
                showToast={showToast}
                checkedSteps={checkedSteps}
                onToggleStep={handleToggleStep}
              />
            )}

            {view === 'insights' && (
              <InsightsView lang={lang} isDark={isDark} />
            )}

            {view === 'simulation' && (
              <SimulationView 
                inputs={inputs}
                onLoadDemo={() => handleCalculate(getRandomDemoScenario().data)}
                onEditInputs={() => setView('input')}
                lang={lang}
                isDark={isDark}
              />
            )}

            {view === 'report' && inputs && results && (
               <div className="animate-in fade-in duration-300">
                  <div className="no-print mb-6 flex items-center justify-between gap-4">
                    <button 
                      onClick={() => setView('dashboard')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        isDark 
                          ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-slate-300 hover:text-white' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm'
                      }`}
                    >
                      <ArrowLeft size={13} />
                      <span>{lang === 'id' ? 'Kembali' : 'Back'}</span>
                    </button>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-950 disabled:bg-slate-400 flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-slate-700"
                      >
                        {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isDownloading ? t.generating : t.downloadPdf}
                      </button>
                      <button 
                        onClick={() => window.print()} 
                        className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all cursor-pointer shadow-blue-500/20"
                      >
                        <Printer size={16} /> {t.print}
                      </button>
                    </div>
                  </div>
                  <div id="report-content" className="bg-white rounded-3xl overflow-hidden border shadow-xl p-8">
                    <ReportView inputs={inputs} results={results} lang={lang} checkedSteps={checkedSteps} />
                  </div>
               </div>
            )}

            {/* Premium, Dedicated Profile Page View (NOT a pop-up modal) */}
            {view === 'profile' && (
              <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-400">
                
                {/* Back button link */}
                <button 
                  onClick={() => setView(inputs ? 'dashboard' : 'input')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all mb-6 border ${
                    isDark 
                      ? 'border-slate-800 bg-slate-900/30 hover:bg-slate-900 text-slate-300' 
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
                  }`}
                >
                  <ArrowLeft size={13} /> {lang === 'id' ? 'Kembali ke Dasbor' : 'Back to Dashboard'}
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold mb-2">
                      <Sparkles size={11} fill="currentColor" />
                      <span>{pt.activeStatus}</span>
                    </div>
                    <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lang === 'id' ? 'Profil Keuangan Premium' : pt.title}
                    </h1>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{pt.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Premium Interactive Avatar Spot & Profile Completion Card */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Bento Box: Photo Upload Hub */}
                    <div className={`p-6 rounded-3xl border text-center flex flex-col items-center ${
                      isDark ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200/80 shadow-sm shadow-slate-100'
                    }`}>
                      <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lang === 'id' ? 'Foto Profil' : 'Profile Picture'}
                      </h3>
                      
                      {/* Avatar Image Circle Container */}
                      <div className="relative group mb-5">
                        <div className={`w-32 h-32 rounded-full overflow-hidden border-2 flex items-center justify-center transition-all bg-gradient-to-tr ${
                          isDark ? 'border-slate-800' : 'border-slate-150 shadow-inner'
                        }`}>
                          {profileAvatar ? (
                            <img 
                              src={profileAvatar} 
                              alt="Profile" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-blue-600 to-pink-500 flex items-center justify-center text-white font-black text-4xl uppercase">
                              {(() => {
                                const parts = profileName.trim().split(/\s+/);
                                if (!parts || parts.length === 0 || parts[0] === '') return 'P';
                                if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
                                return (parts[0][0] + parts[1][0]).toUpperCase();
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Interactive hover overlay */}
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-[10px] font-bold gap-1 mt-0">
                          <Upload size={16} />
                          <span>{lang === 'id' ? 'Ganti Foto' : 'Upload New'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleAvatarFileChange(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Drop File text and controls */}
                      <div className="flex flex-col gap-2 w-full">
                        <p className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {lang === 'id' ? 'Disarankan rasio kotak max 10MB.' : 'Standard square ratio, max 10MB limit.'}
                        </p>
                        
                        <div className="flex justify-center gap-2 mt-2 w-full">
                          <label className={`cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                            isDark 
                              ? 'border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 text-slate-300' 
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-xs'
                          }`}>
                            {lang === 'id' ? 'Pilih Berkas' : 'Browse File'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleAvatarFileChange(file);
                                }
                              }}
                            />
                          </label>
                          
                          {profileAvatar && (
                            <button 
                              onClick={() => {
                                setProfileAvatar('');
                                localStorage.removeItem('fhd_profile_avatar');
                                showToast(lang === 'id' ? 'Foto profil dihapus' : 'Profile photo cleared', 'info');
                              }}
                              className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                                isDark 
                                  ? 'border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-900/30' 
                                  : 'border-red-150 bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              {lang === 'id' ? 'Hapus' : 'Delete'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bento Box: Completeness State */}
                    <div className={`p-6 rounded-3xl border ${
                      isDark ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200/80 shadow-sm shadow-slate-100'
                    }`}>
                      <h4 className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lang === 'id' ? 'Kelengkapan Profil' : 'Profile Completeness'}
                      </h4>
                      {(() => {
                        let filled = 0;
                        let pct = 0;
                        if (profileEmail === 'demo@gmail.com') {
                          filled = 5;
                          pct = 100;
                        } else {
                          if (profileName.trim() && profileName !== 'Abell RJ') filled++;
                          if (profilePhone.trim() && profilePhone !== '+62 812-3456-7890') filled++;
                          if (profileEmail.trim() && profileEmail !== 'belajargg334@gmail.com') filled++;
                          if (profileGoal.trim()) filled++;
                          if (profileAvatar) filled++;
                          pct = Math.round((filled / 5) * 100);
                        }
                        return (
                          <div>
                            <div className="flex justify-between items-center text-xs font-black mb-1.5">
                              <span className="text-blue-500">{pct}% Completed</span>
                              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                {filled}/5 Fields
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                              <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className={`text-[10px] mt-2.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {lang === 'id' 
                                ? 'Lengkapi semua koordinat personal untuk personalisasi rekomendasi model finansial Anda secara presisi.' 
                                : 'Fill out all target metrics and avatar credentials to yield high-fidelity, tailor-made executive financial strategies.'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Premium Coordinates Inputs Forms */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const userPrefix = 'fhd_user_' + profileEmail.replace(/[@.]/g, '_') + '_';
                        localStorage.setItem(userPrefix + 'name', profileName);
                        localStorage.setItem(userPrefix + 'phone', profilePhone);
                        localStorage.setItem(userPrefix + 'email', profileEmail);
                        localStorage.setItem(userPrefix + 'goal', profileGoal);
                        localStorage.setItem(userPrefix + 'ann_target', profileAnnualTarget.toString());
                        localStorage.setItem(userPrefix + 'mon_target', profileMonthlyTarget.toString());
                        if (profileAvatar) {
                          localStorage.setItem(userPrefix + 'avatar', profileAvatar);
                        }

                        localStorage.setItem('fhd_profile_name', profileName);
                        localStorage.setItem('fhd_profile_phone', profilePhone);
                        localStorage.setItem('fhd_profile_email', profileEmail);
                        localStorage.setItem('fhd_user_email', profileEmail);
                        setCurrentUserEmail(profileEmail);
                        localStorage.setItem('fhd_profile_goal', profileGoal);
                        localStorage.setItem('fhd_profile_ann_target', profileAnnualTarget.toString());
                        localStorage.setItem('fhd_profile_mon_target', profileMonthlyTarget.toString());

                        // Sync profile update to Laravel MySQL API
                        const profilePayload: any = {
                          name: profileName,
                          email: profileEmail,
                          phone: profilePhone,
                          goal: profileGoal,
                          annual_target: profileAnnualTarget,
                          monthly_target: profileMonthlyTarget,
                          avatar: profileAvatar || null,
                        };
                        if (profilePassword) {
                          if (profilePassword !== profilePasswordConfirm) {
                            showToast(lang === 'id' ? 'Password tidak cocok!' : 'Passwords do not match!', 'error');
                            return;
                          }
                          profilePayload.password = profilePassword;
                        }
                        apiUpdateProfile(profilePayload);
                        setProfilePassword('');
                        setProfilePasswordConfirm('');

                        showToast(lang === 'id' ? 'Profil Finansial berhasil diperbarui!' : 'Financial profile updated successfully!', 'success');
                      }} 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      
                      {/* Personal Coordinates */}
                      <div className={`p-6 rounded-3xl border flex flex-col gap-4 md:col-span-2 ${
                        isDark ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200/80 shadow-sm shadow-slate-100'
                      }`}>
                        <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-800/10 dark:border-slate-150/10">
                          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <User size={16} />
                          </div>
                          <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {pt.personalInfo}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                          {/* Full Name */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{pt.name}</label>
                            <input 
                              type="text"
                              required
                              value={profileName}
                              onChange={(e) => setProfileName(e.target.value)}
                              className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                              }`}
                              placeholder="John Doe"
                            />
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{pt.phone}</label>
                            <input 
                              type="tel"
                              required
                              value={profilePhone}
                              onChange={(e) => setProfilePhone(e.target.value)}
                              className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                              }`}
                              placeholder="+62 812-3456-7890"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{pt.email}</label>
                            <input 
                              type="email"
                              required
                              value={profileEmail}
                              onChange={(e) => setProfileEmail(e.target.value)}
                              className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                              }`}
                              placeholder="executive@company.com"
                            />
                          </div>
                        </div>
                      </div>                      {/* Security Credentials */}
                      <div className={`p-6 rounded-3xl border flex flex-col gap-4 md:col-span-2 ${
                        isDark ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200/80 shadow-sm shadow-slate-100'
                      }`}>
                        <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-800/10 dark:border-slate-150/10">
                          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                            <Lock size={16} />
                          </div>
                          <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {lang === 'id' ? 'Kredensial Keamanan' : 'Security Credentials'}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                          {/* New Password */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                              {lang === 'id' ? 'Password Baru (Opsional)' : 'New Password (Optional)'}
                            </label>
                            <input 
                              type="password"
                              value={profilePassword}
                              onChange={(e) => setProfilePassword(e.target.value)}
                              className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                              }`}
                              placeholder="********"
                            />
                          </div>

                          {/* Confirm Password */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                              {lang === 'id' ? 'Konfirmasi Password' : 'Confirm Password'}
                            </label>
                            <input 
                              type="password"
                              value={profilePasswordConfirm}
                              onChange={(e) => setProfilePasswordConfirm(e.target.value)}
                              className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                              }`}
                              placeholder="********"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Financial Focus Metrics */}
                      <div className={`p-6 rounded-3xl border flex flex-col gap-4 md:col-span-2 ${
                        isDark ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200/80 shadow-sm shadow-slate-100'
                      }`}>
                        <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-800/10 dark:border-slate-150/10">
                          <div className="p-2 rounded-xl bg-purple-550/10 text-purple-500">
                            <TrendingUp size={16} />
                          </div>
                          <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {pt.financialTargets}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                          {/* Primary Financial Goal */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{pt.goal}</label>
                            <input 
                              type="text"
                              required
                              value={profileGoal}
                              onChange={(e) => setProfileGoal(e.target.value)}
                              className={`w-full p-3 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-550/20 ${
                                isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                              }`}
                              placeholder="Business Capital Expansion & Debt Reduction"
                            />
                          </div>

                          {/* Annual Investment Target */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{pt.annualTarget}</label>
                            <div className="relative flex items-center">
                              <input 
                                type="text"
                                inputMode="numeric"
                                required
                                value={profileAnnualTarget === 0 ? '' : profileAnnualTarget.toLocaleString('id-ID')}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/\D/g, '');
                                  setProfileAnnualTarget(digits ? parseInt(digits, 10) : 0);
                                }}
                                className={`w-full p-3 pr-12 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-550/20 ${
                                  isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                                }`}
                                placeholder="e.g. 150.000.000"
                              />
                              <span className="absolute right-3.5 text-[9px] font-extrabold text-slate-450 tracking-wider">IDR</span>
                            </div>
                          </div>

                          {/* Monthly Savings Target */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{pt.monthlyTarget}</label>
                            <div className="relative flex items-center">
                              <input 
                                type="text"
                                inputMode="numeric"
                                required
                                value={profileMonthlyTarget === 0 ? '' : profileMonthlyTarget.toLocaleString('id-ID')}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/\D/g, '');
                                  setProfileMonthlyTarget(digits ? parseInt(digits, 10) : 0);
                                }}
                                className={`w-full p-3 pr-12 rounded-xl border font-bold text-xs outline-none transition-all focus:ring-2 focus:ring-blue-550/20 ${
                                  isDark ? 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-550' : 'bg-slate-50 border-slate-150 text-slate-800 focus:border-blue-500 focus:bg-white'
                                }`}
                                placeholder="e.g. 10.000.000"
                              />
                              <span className="absolute right-3.5 text-[9px] font-extrabold text-slate-450 tracking-wider">IDR</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submission and Save button */}
                      <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                          type="submit"
                          className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          {pt.saveBtn}
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            )}
            
          </main>

          {/* Premium App Mode Footer */}
          <footer className="no-print mt-auto bg-slate-900 border-t border-slate-800 text-slate-400">
            <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                
                {/* Branding widget */}
                <div className="md:col-span-6 lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Financial Health logo"
                      className="w-8 h-8 rounded-lg object-contain shadow-sm"
                    />
                    <span className="font-extrabold text-base tracking-tight text-white">
                      Financial<span className="text-blue-500 font-extrabold">Health</span>
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    {FOOTER_TEXT[lang].about}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase block font-mono">
                      Official Channels (CONTECH ID)
                    </span>
                    <div className="flex items-center gap-2">
                       {/* Instagram */}
                      <a href="https://www.instagram.com/contech.id/" target="_blank" rel="noreferrer noopener" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750" title="Instagram">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                      {/* Threads */}
                      <a href="https://www.threads.net/@contech.id" target="_blank" rel="noreferrer noopener" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750" title="Threads">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.553 14.194c-.655 0-1.164-.176-1.527-.527-.364-.352-.546-.867-.546-1.545 0-.703.188-1.221.562-1.553a1.99 1.99 0 011.511-.5c.67 0 1.18.172 1.533.515.353.344.53.86.53 1.549 0 .691-.18 1.207-.538 1.549-.359.342-.871.512-1.524.512zm9.157-1.198a9.423 9.423 0 00-1.693-5.266c-.66-1.127-1.61-2.008-2.848-2.645A9.23 9.23 0 0012.32 4.13a9.404 9.404 0 00-6.732 2.583C4.246 8.013 3.575 9.773 3.575 12c0 2.227.671 3.987 2.013 5.287 1.342 1.3 3.586 1.95 6.733 1.95 2.52 0 4.58-.387 6.182-1.16v-2.39a11.1251 11.1251 0 01-5.182 1.3c-2.368 0-3.931-.475-4.688-1.425-.563-.7-0.814-1.666-.753-2.9h8.552c.03-.092.045-.2.045-.325v-.312c0-1.133-.238-1.953-.715-2.46-.477-.508-1.187-.762-2.132-.762-.973 0-1.742.333-2.307 1-.565.667-.848 1.59-.848 2.77s.28 2.103.84 2.77c.56.667 1.334 1 2.321 1 .987 0 1.76-.328 2.322-.983l1.833 1.157c-.896 1.367-2.348 2.05-4.355 2.05-1.97 0-3.413-.591-4.33-1.774-.916-1.182-1.374-2.83-1.374-4.943s.458-3.766 1.374-4.95c.917-1.183 2.36-1.774 4.33-1.774 1.944 0 3.391.547 4.342 1.64 1.096 1.205 1.503 3.033 1.258 5.617h-1.077z" />
                        </svg>
                      </a>
                      {/* X */}
                      <a href="https://x.com/contechofficial" target="_blank" rel="noreferrer noopener" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750" title="X">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      {/* Facebook */}
                      <a href="https://web.facebook.com/contech.id." target="_blank" rel="noreferrer noopener" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750" title="Facebook">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V5.7C13 4.8 13.5 4 14.7 4H17V0h-3.8C9.5 0 8 1.5 8 4.7V8z" />
                        </svg>
                      </a>
                      {/* TikTok */}
                      <a href="https://www.tiktok.com/@contech.id" target="_blank" rel="noreferrer noopener" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750" title="TikTok">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.21-.42-.45-.61-.7v5.13c.03 2.9-.92 5.86-3.11 7.68-2.26 1.93-5.59 2.45-8.31 1.4-3.06-1.11-5.32-4.04-5.41-7.39-.12-3.88 2.58-7.55 6.42-8.11 1.13-.18 2.29-.11 3.41.13V10.2c-1.16-.36-2.47-.2-3.48.5-.94.62-1.49 1.73-1.42 2.87.03 1.43 1.05 2.74 2.44 3.03 1.25.28 2.68-.18 3.36-1.25.4-.59.51-1.32.48-2.01V.02z" />
                        </svg>
                      </a>
                      {/* YouTube */}
                      <a href="https://www.youtube.com/@contechid1288" target="_blank" rel="noreferrer noopener" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750" title="YouTube">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Core Navigation Anchors (Adjusted to App mode setView coordinates) */}
                <div className="md:col-span-3 lg:col-span-2 space-y-3">
                  <h4 className="font-bold text-white text-xs tracking-wider uppercase font-mono">
                    {FOOTER_TEXT[lang].navHeader}
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold">
                    <li>
                      <button onClick={() => setView(inputs ? 'dashboard' : 'input')} className="hover:text-white hover:underline transition-all text-left">
                        {nt.diagnostic}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setView('simulation')} className="hover:text-white hover:underline transition-all text-left">
                        {nt.stressTest}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setView('insights')} className="hover:text-white hover:underline transition-all text-left">
                        {nt.methodology}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setView('profile')} className="hover:text-white hover:underline transition-all text-left">
                        {nt.profile}
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Legal Popups resources */}
                <div className="md:col-span-3 lg:col-span-3 space-y-3">
                  <h4 className="font-bold text-white text-xs tracking-wider uppercase font-mono">
                    {FOOTER_TEXT[lang].legalHeader}
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold">
                    <li>
                      <button onClick={() => setActiveModal('privacy')} className="hover:text-white flex items-center gap-1.5 hover:underline transition-all text-left">
                        <Shield size={12} className="text-blue-500" />
                        {FOOTER_TEXT[lang].privacy}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveModal('terms')} className="hover:text-white flex items-center gap-1.5 hover:underline transition-all text-left">
                        <FileText size={12} className="text-blue-500" />
                        {FOOTER_TEXT[lang].terms}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveModal('disclaimer')} className="hover:text-white flex items-center gap-1.5 hover:underline transition-all text-left">
                        <HelpCircle size={12} className="text-blue-500" />
                        {FOOTER_TEXT[lang].disclaimer}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveModal('contact')} className="hover:text-white flex items-center gap-1.5 hover:underline transition-all text-left">
                        <MessageSquare size={12} className="text-blue-500" />
                        {FOOTER_TEXT[lang].contact}
                      </button>
                    </li>
                  </ul>
                </div>

                {/* App operational summary */}
                <div className="md:col-span-12 lg:col-span-3">
                  <div className="border border-slate-800 bg-slate-950/40 p-5 rounded-2xl space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-white text-xs tracking-wider uppercase font-mono">
                          {lang === 'id' ? 'Ringkasan Platform' : 'Platform Snapshot'}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                          {lang === 'id' ? 'Status fitur utama aplikasi.' : 'Primary app feature status.'}
                        </p>
                      </div>
                      <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                        <LayoutDashboard size={15} className="text-blue-400 shrink-0" />
                        <div>
                          <div className="text-xs font-black text-white">{nt.diagnostic}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {lang === 'id' ? 'Analisis utama' : 'Core analysis'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                        <Activity size={15} className="text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-black text-white">{nt.stressTest}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {lang === 'id' ? 'Skenario risiko' : 'Risk scenarios'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                        <TrendingUp size={15} className="text-amber-400 shrink-0" />
                        <div>
                          <div className="text-xs font-black text-white">{nt.methodology}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {lang === 'id' ? 'Benchmark rasio' : 'Ratio benchmark'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono">
                <p>&copy; {new Date().getFullYear()} Contech ID. All rights reserved. Precision GAAP Diagnostics.</p>
              </div>
            </div>
          </footer>

          {/* Interactive Legal Modal Dialog Widget */}
          <AnimatePresence>
            {activeModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className={`border shadow-2xl rounded-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <h3 className="text-lg font-black flex items-center gap-2 border-b border-slate-100/10 pb-4 pr-8">
                    <Shield size={18} className="text-blue-500 shrink-0" />
                    {FOOTER_TEXT[lang].popups[activeModal].title}
                  </h3>
                  
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-800/20 hover:bg-slate-800/50 rounded-full transition-all cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>

                  <div className="py-4 text-xs leading-relaxed font-semibold space-y-4 max-h-[350px] overflow-y-auto">
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>{FOOTER_TEXT[lang].popups[activeModal].content}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-150/10 flex justify-end">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      {lang === 'id' ? 'Mengerti & Tutup' : 'Understand & Close'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Modern, Upgraded Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowSettingsModal(false)}></div>
          
          <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 z-50 ${
            isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button 
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors cursor-pointer"
              onClick={() => setShowSettingsModal(false)}
            >
              <X size={16} />
            </button>

            <h3 className={`text-lg font-black mb-5 pb-3 border-b border-slate-150/10 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Settings size={18} className="text-blue-500" />
              <span>Platform Control Panel</span>
            </h3>

            <div className="space-y-5">
              
              {/* Feature 1: Ubah Bahasa (EN / ID switch tabs) */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest mb-1.5">
                  {lang === 'id' ? 'Ubah Bahasa Platform' : 'Change Platform Language'}
                </label>
                <div className={`p-1 rounded-xl border flex ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <button
                    type="button"
                    onClick={() => { if (lang !== 'id') toggleLang(); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      lang === 'id' 
                        ? 'bg-blue-600 text-white shadow' 
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (lang !== 'en') toggleLang(); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      lang === 'en' 
                        ? 'bg-blue-600 text-white shadow' 
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English (US)
                  </button>
                </div>
              </div>

              {/* Feature 2: Ubah Light/Dark theme mode switch */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest mb-1.5">
                  {lang === 'id' ? 'Pilih Tema Visual' : 'Select Theme Environment'}
                </label>
                <div className={`p-1 rounded-xl border flex ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <button
                    type="button"
                    onClick={() => { if (isDark) toggleTheme(); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      !isDark 
                        ? 'bg-[#0f172a] text-white shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sun size={13} className={!isDark ? 'text-amber-500' : ''} />
                    <span>Light Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (!isDark) toggleTheme(); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      isDark 
                        ? 'bg-blue-600 text-white shadow animate-in fade-in duration-100' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Moon size={13} />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Feature 3: Toast Notification Toggle switch */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-150'
              }`}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold leading-none">{lang === 'id' ? 'Notifikasi Toast' : 'Toast Alerts'}</span>
                  <span className="text-[9px] text-slate-400">{lang === 'id' ? 'Aktifkan pesan alert aksi' : 'Pop-up updates on user actions'}</span>
                </div>
                
                {/* Visual Toggle sliding checkbox Switch */}
                <button
                  type="button"
                  onClick={() => {
                    setEnableToasts(prev => {
                      const newVal = !prev;
                      localStorage.setItem('fhd_enable_toasts', newVal ? 'true' : 'false');
                      if (newVal) {
                        setTimeout(() => {
                          showToast(lang === 'id' ? 'Notifikasi toast diaktifkan!' : 'Toast notifications enabled!', 'success');
                        }, 50);
                      }
                      return newVal;
                    });
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors relative duration-350 focus:outline-none ${
                    enableToasts ? 'bg-blue-600' : 'bg-slate-700/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all transform duration-300 shadow-sm ${
                    enableToasts ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className={`border-t my-1 ${isDark ? 'border-slate-850' : 'border-slate-150/10'}`}></div>

              {/* Reset History operations */}
              <div>
                <h4 className="text-xs font-extrabold text-rose-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  {nt.resetTitle}
                </h4>
                <p className="text-[10px] text-slate-450 leading-relaxed mb-3">
                  {nt.resetConfirm}
                </p>
                <button
                  onClick={clearDiagnosticHistory}
                  disabled={history.length === 0 && !results}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-500/20 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <Trash2 size={13} />
                  {nt.resetData}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className={`w-full mt-6 py-3 font-bold text-sm rounded-2xl transition-all cursor-pointer border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'}`}
            >
              {nt.close}
            </button>
          </div>
        </div>
      )}

      {/* Floating React Toast notification component */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[1000] animate-in slide-in-from-bottom-5 fade-in duration-350 pointer-events-none">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-md max-w-sm ${
            isDark 
              ? 'bg-slate-950/90 border-slate-800 text-white shadow-black/80' 
              : 'bg-white/90 border-slate-150 text-slate-800 shadow-slate-200'
          }`}>
            <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-505' 
                : toast.type === 'warning' 
                  ? 'bg-rose-500/10 text-rose-505' 
                  : 'bg-blue-500/10 text-blue-505'
            }`}>
              {toast.type === 'success' ? <Check size={18} /> : toast.type === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />}
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-normal">{toast.message}</span>
              <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">FHD Platform Notification</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;











