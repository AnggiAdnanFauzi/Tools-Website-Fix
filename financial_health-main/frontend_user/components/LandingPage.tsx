import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldAlert,
  Sparkles,
  Coins,
  TrendingUp,
  X,
  FileText,
  Shield,
  HelpCircle,
  MessageSquare,
  Volume2,
  VolumeX,
  Smartphone,
  Check,
  Sun,
  Moon,
  Activity,
  BarChart3,
  Database,
  HeartPulse,
  RefreshCw,
  Layers,
  Calculator,
  ShieldCheck,
  Menu
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  lang: 'en' | 'id';
  onToggleLang: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
}

// Translations dictionary for Landing Page
const L_TEXT = {
  en: {
    heroTag: 'Deterministic Financial Diagnostic Tool',
    heroTitlePrefix: 'Take Absolute Control of ',
    heroTitleHighlight: 'Your Financial Destiny',
    heroSubtitle: 'A premium, rule-based analysis platform for households and micro-businesses. Assess your Cashflow, DSR, Runway, and Payroll Efficiency in 5 minutes with structured, actionable insights.',
    ctaBtn: 'Start Free Diagnostic Check',
    featuresMenu: 'Features',
    problemMenu: 'The Divide',
    demoMenu: 'Live Demo',
    testimonialMenu: 'Testimonials',
    contactMenu: 'Connect',

    // Problem Section
    probTitle: 'The Fatal Roadblocks',
    probSubtitle: 'Why do most individuals and small companies struggle financially? Here are the four underlying causes of fiscal crisis.',
    problems: [
      {
        title: 'Cashflow Blindness',
        desc: 'Earn a high income but end up with empty pockets. Savings vanish into mysterious monthly operational or lifestyle leaks.',
        metric: 'Net Margin < 0'
      },
      {
        title: 'High-Debt Service Chokehold',
        desc: 'Crushed with multiple installment packages. Monthly debt service ratio exceeds 50%, completely blocking investment or cash building.',
        metric: 'DSR > 50%'
      },
      {
        title: 'Dry Cash Runway Exposure',
        desc: 'A complete lack of cash reserves. Solopreneurs and micro-businesses face immediate liquidation on a single month of lean revenue.',
        metric: 'Runway < 3 Months'
      },
      {
        title: 'Bloated Overhead Burn',
        desc: 'Spending too much on employee payroll or heavy operational overhead, converting potential growth margins into a constant loss.',
        metric: 'Payroll > 50%'
      }
    ],

    // Solution Section
    solTitle: 'Deterministic Solutions',
    solSubtitle: 'Through rigid metric diagnostics, we map out exact rules to restructure cash, clear debt bottlenecks, and lengthen runways.',
    solutions: [
      {
        title: 'Dynamic Flow Mapping',
        desc: 'Gain 100% clarity on income vs outgoing expenditures. Systematically redirect surplus cash to immediate capital reserves.',
        metric: 'Net Margin > 15%'
      },
      {
        title: 'Optimal Debt Cap Rule',
        desc: 'Implement a rigid maximum ceiling for installment liabilities, freeing cashflow and preventing debt accumulation spirals.',
        metric: 'DSR < 35%'
      },
      {
        title: 'Bulletproof Cash Buffer',
        desc: 'Establish and automate standard runway margins to protect businesses from macroeconomic volatility for months on end.',
        metric: 'Runway > 12 Months'
      },
      {
        title: 'Optimized Payroll Ratios',
        desc: 'Keep human resource costs aligned with genuine revenues to fuel sustainable expansion while protecting team stability.',
        metric: 'Payroll < 30%'
      }
    ],

    // Demo Section
    demoTitle: 'Interactive Preview',
    demoSubtitle: 'Watch our calculator evaluate core financial variables, adjust scenarios, and output clean risk scores instantly.',
    demoPlay: 'Simulate Tool Run',
    demoRunning: 'Running Simulation...',
    demoReset: 'Reset Simulation',
    demoMute: 'Mute Effects',
    demoUnmute: 'Unmute Effects',
    demoStage1: 'Populating Input Data...',
    demoStage2: 'Calculating Score & Aggregates...',
    demoStage3: 'Rendering Interactive Metrics...',

    // Testimonials Section
    testTitle: 'Trusted by Families & Solopreneurs',
    testSubtitle: 'Real feedback from micro-business owners and family breadwinners who restored financial transparency using our tools.',
    testimonials: [
      {
        name: 'Budi Santoso',
        role: 'Café & Roastery Owner',
        location: 'Jakarta',
        text: 'This tool saved my business! We discovered our payroll cost was running at over 54% of revenue. By applying the recommended actions, we trimmed overhead and restored our net margin back to a healthy 18%.',
        rating: 5,
        target: 'Overhead RESTORED'
      },
      {
        name: 'Sarah Wijaya',
        role: 'Personal Financial Planner',
        location: 'Surabaya',
        text: 'Unlike other vague calculators, FHD is direct and rule-based. It makes DSR bottlenecks completely transparent for my clients, yielding a structured, clear roadmap to tackle debt.',
        rating: 5,
        target: '100% Deterministic'
      },
      {
        name: 'Andi Pratama',
        role: 'Tech Solopreneur',
        location: 'Bandung',
        text: 'My business runway was a blank slate, usually lasting only two weeks. Testing scenarios in this app gave me precise guidelines to save up a solid 12-month emergency safety nest.',
        rating: 5,
        target: 'Runway SECURED'
      },
      {
        name: 'Rina Maharani',
        role: 'Family Household Head',
        location: 'Medan',
        text: 'My spouse and I were constantly wondering where our cash was going. The Emergency Fund Coverage diagnostic helped us plan structured savings of 6+ months in record time.',
        rating: 5,
        target: 'Household SAVED'
      }
    ],

    // CTA
    ctaTitle: 'Ready to Discover Your True Financial Health Score?',
    ctaSubtitle: 'No logins required. No credentials harvested. Enter your numbers anonymously and secure immediate actionable advice.',
    ctaAction: 'Launch Diagnostics Now',

    // Popups
    popups: {
      privacy: {
        title: 'Privacy Policy',
        content: 'Your financial absolute safety is our design principle. We believe that money is personal, which is why the Financial Health Diagnostic platform operates entirely inside your browser. No details, values, or calculations are sent to external databases or stored on remote servers. All local audit histories remain fully isolated inside your browser\'s local storage. You choose when to print or download reports.'
      },
      terms: {
        title: 'Terms of Service',
        content: 'The Financial Health Diagnostic belongs to an educational initiative developed to calculate deterministic ratios based on traditional accounting principles. While the thresholds mimic industry benchmarks faithfully, the scoring models should serve as analytical indicators. This is not certified wealth advisory, so please coordinate complex portfolios with standard financial consultancies.'
      },
      disclaimer: {
        title: 'Disclaimer Notice',
        content: 'All results, projections, and simulation changes produced by this application are mathematical estimations based on the provided inputs. Our engine guarantees formula accuracy, but external economic changes, inflationary pressures, or banking shifts remains the sole responsibility of the calculating user. Play responsibly with budgets!'
      },
      contact: {
        title: 'Contact & Support',
        content: 'Have questions, ideas, or feedback? Contech ID is dedicated to providing robust financial diagnostic tools that make complex accounting accessible. Reach out to our engineers at info@contech.id, or follow our official media handles to keep in absolute sync.'
      }
    }
  },
  id: {
    heroTag: 'Alat Diagnosa Keuangan Deterministik',
    heroTitlePrefix: 'Pegang Kendali Penuh Atas ',
    heroTitleHighlight: 'Masa Depan Finansial Anda',
    heroSubtitle: 'Platform analisis premium berbasis aturan (rule-based) untuk rumah tangga dan usaha mikro. Evaluasi Arus Kas, DSR, Runway, dan Efisiensi Gaji Anda dalam 5 menit dengan wawasan yang terstruktur dan siap tindak.',
    ctaBtn: 'Mulai Cek Diagnosa Gratis',
    featuresMenu: 'Fitur UTama',
    problemMenu: 'Kesenjangan',
    demoMenu: 'Demo Interaktif',
    testimonialMenu: 'Testimoni',
    contactMenu: 'Hubungi Kami',

    // Problem Section
    probTitle: 'Kendala Finansial Kritis',
    probSubtitle: 'Mengapa sebagian besar individu dan perusahaan mikro mengalami krisis? Berikut adalah empat akar masalah utama penyebab kegagalan finansial.',
    problems: [
      {
        title: 'Buta Arus Kas',
        desc: 'Pendapatan besar tapi selalu berakhir dengan saku kosong. Tabungan menguap begitu saja ke dalam kebocoran gaya hidup atau operasional bulanan tanpa jejak.',
        metric: 'Rasio Bersih < 0'
      },
      {
        title: 'Cekikan Utang Berlebih',
        desc: 'Terjebak dalam cicilan tanpa henti. Rasio pembayaran utang bulanan melebihi 50%, menutup total peluang cadangan kas atau reinvestasi.',
        metric: 'DSR > 50%'
      },
      {
        title: 'Kerentanan Cadangan Kas Kering',
        desc: 'Bisnis atau solopreneur tidak memiliki tabungan likuid. Satu bulan sepi pelanggan langsung berakibat pada penutupan mendadak.',
        metric: 'Runway < 3 Bulan'
      },
      {
        title: 'Beban Operasional Gemuk',
        desc: 'Membelanjakan terlalu banyak anggaran untuk upah karyawan atau overhead tanpa diimbangi margin omzet, mematikan profitabilitas bisnis sejak awal.',
        metric: 'Gaji > 50%'
      }
    ],

    // Solution Section
    solTitle: 'Solusi Deterministik Keuangan',
    solSubtitle: 'Melalui analisis metrik yang ketat, kami memetakan aturan pasti untuk mengalirkan kas, menghapus kemacetan utang, dan memperpanjang runway bisnis.',
    solutions: [
      {
        title: 'Peta Aliran Kas Dinamis',
        desc: 'Mendapat kejelasan 100% tentang arus pendapatan vs pengeluaran. Dengan sengaja mengalirkan kelebihan pendapatan ke pos tabungan darurat.',
        metric: 'Rasio Bersih > 15%'
      },
      {
        title: 'Aturan Batas Utang Sehat',
        desc: 'Menerapkan batas rigid maksimal untuk cicilan berjalan, membebaskan arus kas bulanan Anda, dan mencegah lingkaran setan kredit.',
        metric: 'DSR < 35%'
      },
      {
        title: 'Penyangga Amunisi Cadangan',
        desc: 'Membangun standardisasi cadangan dana darurat yang kokoh untuk menopang ketahanan bisnis dari badai ekonomi ekstrem.',
        metric: 'Runway > 12 Bulan'
      },
      {
        title: 'Rasio Penggajian Maksimal',
        desc: 'Menjaga margin pengeluaran tim tetap ideal dengan performa omzet guna menjamin pertumbuhan bisnis yang sehat dan stabil.',
        metric: 'Gaji < 30%'
      }
    ],

    // Demo Section
    demoTitle: 'Pratinjau Alat Interaktif',
    demoSubtitle: 'Lihat bagaimana kalkulator kami menguji variabel finansial Anda, mensimulasikan skenario, dan menghasilkan rekomendasi aksi nyata.',
    demoPlay: 'Simulasikan Sistem',
    demoRunning: 'Menjalankan Simulasi...',
    demoReset: 'Ulangi Simulasi',
    demoMute: 'Matikan Efek',
    demoUnmute: 'Nyalakan Efek',
    demoStage1: 'Memasukkan Data Contoh...',
    demoStage2: 'Menghitung Skor & Rasio Aggregat...',
    demoStage3: 'Menyajikan Wawasan Interaktif...',

    // Testimonials Section
    testTitle: 'Dipercaya oleh Keluarga & Pengusaha',
    testSubtitle: 'Wawasan objektif dari para pemilik bisnis mikro dan kepala rumah tangga yang memulihkan stabilitas finansial mereka menggunakan plaform ini.',
    testimonials: [
      {
        name: 'Budi Santoso',
        role: 'Pemilik Kafe & Roastery',
        location: 'Jakarta',
        text: 'Alat ini menyelamatkan bisnis saya! Kami mendeteksi pengeluaran gaji mencapai 54% dari omzet. Melalui rekomendasi aksi di sini, kami merestrukturisasi operasional dan mengembalikan margin laba ke angka aman 18%.',
        rating: 5,
        target: 'Beban Tim DIPERBAIKI'
      },
      {
        name: 'Sarah Wijaya',
        role: 'Konsultan Keuangan Mandiri',
        location: 'Surabaya',
        text: 'Sangat berbeda dengan kalkulator biasa, FHD sangat objektif dan berbasis rumus real-world. Membantu menyingkap kemacetan cicilan utang klien saya secara logis dan menyodorkan rencana aksi nyata.',
        rating: 5,
        target: '100% Deterministik'
      },
      {
        name: 'Andi Pratama',
        role: 'Teknologi Solopreneur',
        location: 'Bandung',
        text: 'Sebelum tahu ini, runway kas saya acak-acakan dan hanya bertahan dua minggu. Mencoba simulator skor di sini memberi saya target simpanan darurat 12 bulan yang sangat presisi.',
        rating: 5,
        target: 'Runway DIKERASAKAN'
      },
      {
        name: 'Rina Maharani',
        role: 'Kepala Keuangan Rumah Tangga',
        location: 'Medan',
        text: 'Dulu saya dan suami bingung kemana perginya sisa uang bulanan. Diagnosa Cangkupan Dana Darurat membantu kami menyusun tabungan 6 bulan aman dengan sangat cepat dan disiplin.',
        rating: 5,
        target: 'Rumah Tangga SEHAT'
      }
    ],

    // CTA
    ctaTitle: 'Siap Menemukan Skor Kesehatan Finansial Anda yang Sebenarnya?',
    ctaSubtitle: 'Tanpa perlu masuk akun atau pendaftaran apapun. Masukkan data keuangan Anda secara anonim dan peroleh tindakan solusi sekuritas finansial.',
    ctaAction: 'Jalankan Diagnosa Sekarang',

    // Popups
    popups: {
      privacy: {
        title: 'Kebijakan Privasi',
        content: 'Keamanan penuh data finansial Anda adalah prioritas utama kami. Platform Financial Health Diagnostic bekerja sepenuhnya di dalam browser Anda. Tidak ada detail nilai, jumlah, atau hasil hitung yang dikirimkan ke database eksternal maupun server jauh. Riwayat audit lokal tetap aman tersimpan lokal di dalam LocalStorage Anda sendiri. Anda bebas mencetak atau mengunduh laporan kapan saja.'
      },
      terms: {
        title: 'Syarat & Ketentuan',
        content: 'Alat Analisis Diagnosa ini dikembangkan sebagai sarana edukasi pemetaan keuangan didasari prinsip akuntansi global teruji. Seluruh tolok ukur merupakan representasi terbaik namun skor akhir tetap berfungsi sebagai panduan analitis mandiri. Ini bukan sarana anjuran investasi wajib, koordinasikan portofolio kompleks Anda bersama penasihat keuangan bersertifikat.'
      },
      disclaimer: {
        title: 'Pernyataan Penyangkalan (Disclaimer)',
        content: 'Seluruh hasil, proyeksi, dan perubahan simulator dalam aplikasi ini merupakan perkiraan matematis murni. Sistem kami menjamin kesesuaian formula, namun perubahan pasar, gejolak inflasi regional, atau kebijakan perbankan sepenuhnya di luar jangkauan tanggung jawab pengembang aplikasi. Gunakan analisis ini dengan bijak!'
      },
      contact: {
        title: 'Hubungi Kami',
        content: 'Ada pertanyaan, saran kolaborasi, atau butuh bantuan lebih lanjut? Contech ID berdedikasi menciptakan instrumen analisis keuangan yang inklusif untuk kemajuan bisnis. Layangkan surel Anda ke info@contech.id, atau ikuti terus media sosial resmi kami.'
      }
    }
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, lang, onToggleLang, isDark: propIsDark, onToggleDark, onLogin, onSignUp }) => {
  const t = L_TEXT[lang];

  // Dark/Light Theme state
  const [localIsDark, setLocalIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd-theme');
      return saved === 'dark';
    }
    return false;
  });

  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    if (onToggleDark) {
      onToggleDark();
    } else {
      setLocalIsDark(prev => {
        const newVal = !prev;
        localStorage.setItem('fhd-theme', newVal ? 'dark' : 'light');
        return newVal;
      });
    }
  };

  // Dynamic Laptop Zoom effect
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // If screen is Laptop (typically between 1024px and 1536px wide), zoom out to 80% (0.8)
      if (width >= 1024 && width <= 1536) {
        document.body.style.zoom = "0.8";
      } else {
        document.body.style.zoom = "1";
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.zoom = "1";
    };
  }, []);

  // Synchronize dynamic background color of body to prevent white bottom line or bleed issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.backgroundColor = isDark ? '#0b0f19' : '#fafbfc';
      document.body.style.transition = 'background-color 0.5s ease-in-out';
    }
  }, [isDark]);

  // Interactive states for Hero Widgets
  const [heroRunway, setHeroRunway] = useState(6);
  const [heroActiveFlow, setHeroActiveFlow] = useState<'standard' | 'high' | 'crisis'>('standard');
  const [heroCount, setHeroCount] = useState(18482);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Interval to slightly increment total diagnostic check counter to make it look active & busy
  useEffect(() => {
    const countInterval = setInterval(() => {
      setHeroCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);

    const tickerInterval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % 4);
    }, 4000);

    return () => {
      clearInterval(countInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  // Navbar visibility logic
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  // Video Demo interactive simulator states
  const [isPlaying, setIsPlaying] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simProgress, setSimProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock Simulated values for preview
  const [mockRevenue, setMockRevenue] = useState(30000);
  const [mockPayroll, setMockPayroll] = useState(16000);
  const [soundNotification, setSoundNotification] = useState('');

  // Modals for legal/contacts
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'disclaimer' | 'contact' | null>(null);

  // Monitor Scroll for Navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false); // Hide on scroll down
      } else {
        setNavVisible(true); // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Video Demo Interval Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimProgress(prev => {
          if (prev >= 100) {
            // Circle steps back or stops
            setIsPlaying(false);
            setSimStep(3); // Completed display
            if (soundEnabled) playSimSound('complete');
            return 100;
          }
          const next = prev + 1.5;

          // Phase shifts based on progress percentages
          if (next > 1 && next < 35) {
            setSimStep(0);
          } else if (next >= 35 && next < 70) {
            setSimStep(1);
          } else if (next >= 70 && next < 100) {
            setSimStep(2);
          }

          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, soundEnabled]);

  const playSimSound = (type: string) => {
    // Elegant system visual sound description without actual audio crashing issues
    if (type === 'start') {
      setSoundNotification('🔊 Simulating Calculation Core Initialization');
    } else if (type === 'complete') {
      setSoundNotification('🎉 Calculation Complete: Score 74 - Healthy Rating!');
    }
    setTimeout(() => setSoundNotification(''), 4500);
  };

  const handleSimStart = () => {
    if (simProgress >= 100) {
      setSimProgress(0);
      setSimStep(0);
    }
    setIsPlaying(true);
    if (soundEnabled) playSimSound('start');
  };

  const handleSimPause = () => {
    setIsPlaying(false);
  };

  const handleSimReset = () => {
    setIsPlaying(false);
    setSimProgress(0);
    setSimStep(0);
  };

  // Smooth Scroll Trigger
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Formatted state mock variables
  const mockNetMargin = ((mockRevenue - mockPayroll - 8000) / mockRevenue) * 100;

  return (
    <div className={`relative min-h-screen transition-colors duration-500 overflow-x-hidden ${isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#fafbfc] text-[#0f172a]'}`}>

      {/* Premium Autohide Navbar */}
      <nav id="landing-navbar" className={`fixed top-0 left-0 w-full backdrop-blur-md border-b z-50 transition-all duration-300 transform ${isDark ? 'bg-[#0b0f19]/80 border-slate-800 text-slate-100' : 'bg-white/80 border-slate-100 text-slate-900'
        } ${navVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">

          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/logo.png"
              alt="Financial Health logo"
              className="w-10 h-10 rounded-xl object-contain shadow-md shadow-blue-100"
            />
            <div className="flex flex-col">
              <span className={`font-extrabold text-xl tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Financial<span className="text-blue-600 font-extrabold">Health</span>
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-widest mt-0.5 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Diagnostic Platform</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollTo('features-section')} className={`text-sm font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'}`}>
              {t.featuresMenu}
            </button>
            <button onClick={() => scrollTo('problems-solutions')} className={`text-sm font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-red-400' : 'text-slate-600 hover:text-red-500'}`}>
              {t.problemMenu}
            </button>
            <button onClick={() => scrollTo('demo-preview')} className={`text-sm font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'}`}>
              {t.demoMenu}
            </button>
            <button onClick={() => scrollTo('testimonials-section')} className={`text-sm font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'}`}>
              {t.testimonialMenu}
            </button>
            <button onClick={() => scrollTo('footer-anchor')} className={`text-sm font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'}`}>
              {t.contactMenu}
            </button>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 sm:p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${isDark
                  ? 'border-slate-800 bg-slate-900 text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Desktop-only Lang and Account utilities */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors text-xs font-bold cursor-pointer hover:scale-105 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                {lang === 'en' ? 'ENGLISH' : 'INDONESIA'}
              </button>

              {onLogin && (
                <button
                  onClick={onLogin}
                  className={`px-3.5 py-2 font-extrabold text-xs rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${isDark
                      ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                    }`}
                >
                  {lang === 'en' ? 'Sign In' : 'Masuk'}
                </button>
              )}
            </div>

            <div className="hidden lg:block">
              <button
                onClick={onSignUp}
                className="relative px-5 py-2.5 font-bold text-sm rounded-xl overflow-hidden group shadow-lg transition-all border cursor-pointer bg-blue-600 border-blue-600 text-white shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 font-black">
                  {lang === 'en' ? 'Sign Up' : 'Daftar'}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Premium Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${isDark
                  ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Burger Menu Overlay / Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden w-full border-t overflow-hidden ${isDark ? 'bg-[#0b0f19] border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
                }`}
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <button
                  onClick={() => { scrollTo('features-section'); setMobileMenuOpen(false); }}
                  className={`text-left text-sm font-bold py-2 border-b transition-colors ${isDark ? 'border-slate-850 text-slate-300 hover:text-blue-400' : 'border-slate-100 text-slate-600 hover:text-blue-600'}`}
                >
                  {t.featuresMenu}
                </button>
                <button
                  onClick={() => { scrollTo('problems-solutions'); setMobileMenuOpen(false); }}
                  className={`text-left text-sm font-bold py-2 border-b transition-colors ${isDark ? 'border-slate-850 text-slate-300 hover:text-red-400' : 'border-slate-100 text-slate-600 hover:text-red-550'}`}
                >
                  {t.problemMenu}
                </button>
                <button
                  onClick={() => { scrollTo('demo-preview'); setMobileMenuOpen(false); }}
                  className={`text-left text-sm font-bold py-2 border-b transition-colors ${isDark ? 'border-slate-850 text-slate-300 hover:text-blue-400' : 'border-slate-100 text-slate-600 hover:text-blue-600'}`}
                >
                  {t.demoMenu}
                </button>
                <button
                  onClick={() => { scrollTo('testimonials-section'); setMobileMenuOpen(false); }}
                  className={`text-left text-sm font-bold py-2 border-b transition-colors ${isDark ? 'border-slate-850 text-slate-300 hover:text-blue-400' : 'border-slate-100 text-slate-600 hover:text-blue-600'}`}
                >
                  {t.testimonialMenu}
                </button>
                <button
                  onClick={() => { scrollTo('footer-anchor'); setMobileMenuOpen(false); }}
                  className={`text-left text-sm font-bold py-2 border-b transition-colors ${isDark ? 'border-slate-850 text-slate-300 hover:text-blue-400' : 'border-slate-100 text-slate-600 hover:text-blue-600'}`}
                >
                  {t.contactMenu}
                </button>

                {/* Mobile language & auth actions */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-2">
                  <button
                    onClick={() => { onToggleLang(); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isDark
                        ? 'bg-slate-900 text-slate-350 border-slate-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                    {lang === 'en' ? 'ENGLISH' : 'INDONESIA'}
                  </button>

                  {onLogin && (
                    <button
                      onClick={() => { onLogin(); setMobileMenuOpen(false); }}
                      className={`px-4 py-2 font-extrabold text-xs rounded-xl border cursor-pointer ${isDark
                          ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {lang === 'en' ? 'Sign In' : 'Masuk'}
                    </button>
                  )}

                  <button
                    onClick={() => { onSignUp(); setMobileMenuOpen(false); }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-650 hover:from-blue-800 hover:to-indigo-750 text-white font-extrabold text-xs rounded-xl text-center shadow-lg shadow-blue-500/10 cursor-pointer"
                  >
                    {lang === 'en' ? 'Sign Up' : 'Daftar'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-200/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-36 left-1/4 w-[400px] h-[400px] bg-blue-200/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Animated background floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-30 ${isDark ? 'bg-blue-900/25' : 'bg-blue-200/45'}`}
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              x: [0, -20, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className={`absolute bottom-10 right-12 w-96 h-96 rounded-full blur-3xl opacity-35 ${isDark ? 'bg-indigo-900/25' : 'bg-indigo-200/40'}`}
          />
          {/* Subtle star particle floaters */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-blue-500'}`}
              style={{
                top: `${20 + i * 12}%`,
                left: `${15 + (i * 19) % 70}%`,
              }}
              animate={{
                opacity: [0.15, 0.9, 0.15],
                scale: [1, 1.8, 1],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 relative animate-in fade-in duration-700">

          {/* Main Hero Copywriting & CTA Centered */}
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto mb-16 relative z-10">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${isDark
                  ? 'bg-blue-950/40 border-blue-900/50 text-blue-400'
                  : 'bg-blue-50 border-blue-100 text-blue-700'
                }`}
            >
              <Sparkles size={14} className="text-blue-500 animate-spin-slow" />
              {t.heroTag}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-4xl sm:text-5xl md:text-[54px] lg:text-[64px] font-black tracking-tight leading-[1.08] ${isDark ? 'text-white' : 'text-slate-900'
                }`}
            >
              {t.heroTitlePrefix}
              <span className="block mt-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-700 bg-clip-text text-transparent italic font-serif leading-none py-1">
                {t.heroTitleHighlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-500'
                }`}
            >
              {t.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 group border border-blue-500"
              >
                {t.ctaBtn}
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo('demo-preview')}
                className={`w-full sm:w-auto px-8 py-4 font-bold text-lg rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] border ${isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
              >
                <Play size={16} fill="currentColor" className={isDark ? "text-indigo-400" : "text-slate-500"} />
                {lang === 'en' ? 'Watch Simulation' : 'Lihat Simulasi'}
              </button>
            </motion.div>

            {/* Micro Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`pt-8 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-semibold font-mono uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'
                }`}
            >
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <CheckCircle2 size={16} className="text-emerald-500" />
                100% Secure & Local
              </div>
              <div className={`hidden sm:block ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>•</div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <CheckCircle2 size={16} className="text-emerald-500" />
                No Account Required
              </div>
              <div className={`hidden sm:block ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>•</div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Multilingual EN / ID
              </div>
            </motion.div>

          </div>

          {/* Panoramic Interactive Software Mockup Banner (Stretches Very Wide, High-tech, Beautiful, Lively, Animated) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`w-full max-w-[1680px] mx-auto rounded-3xl border shadow-2xl overflow-hidden relative backdrop-blur-md ${isDark
                ? 'bg-[#121827]/90 border-slate-800 shadow-indigo-950/20'
                : 'bg-white/95 border-slate-200 shadow-slate-200/50'
              }`}
          >
            {/* Top Browser Bar Controls */}
            <div className={`px-4 py-3.5 border-b flex items-center justify-between ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              {/* Window buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>

              {/* URL Address Bar */}
              <div className={`hidden md:flex items-center justify-center gap-2 px-6 py-1 rounded-lg text-xs font-mono font-medium max-w-lg w-full text-center ${isDark ? 'bg-slate-900 border border-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-500'
                }`}>
                <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
                <span>takedestiny.app/diagnostic-workspace</span>
              </div>

              {/* Right Side Status Indicators */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className={`font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === 'en' ? 'LOCAL CALIBRATOR LIVE' : 'KALIBRATOR LOKAL AKTIF'}
                </span>
              </div>
            </div>

            {/* Inner Dashboard Live Layout Preview */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-8 text-left">

              {/* Top Quick Ratio Meter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: lang === 'en' ? 'Cash Cushion Health' : 'Kesehatan Bantalan Kas',
                    value: lang === 'en' ? 'Healthy Level' : 'Tingkat Sehat',
                    badge: lang === 'en' ? 'SECURED' : 'TERJAMIN',
                    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
                    percentage: '78.4%',
                    subText: lang === 'en' ? 'Sufficient reserve liquidity' : 'Cadangan likuiditas cukup',
                    icon: <Database className="text-emerald-500" size={18} />
                  },
                  {
                    title: lang === 'en' ? 'Debt Service Ratio (DSR)' : 'Rasio Pembayaran Utang (DSR)',
                    value: '28.5%',
                    badge: lang === 'en' ? 'OPTIMAL' : 'OPTIMAL',
                    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
                    percentage: '28.5%',
                    subText: lang === 'en' ? 'Under 35% health ceiling' : 'Di bawah batas kritis 35%',
                    icon: <ShieldCheck className="text-blue-500" size={18} />
                  },
                  {
                    title: lang === 'en' ? 'Emergency Runway Buffer' : 'Bantalan Runway Darurat',
                    value: '6.4 Months',
                    badge: lang === 'en' ? 'BUFFERED' : 'TERSEDIA',
                    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
                    percentage: '53.3%',
                    subText: lang === 'en' ? 'Standard 6-month buffer met' : 'Standar 6 bulan terpenuhi',
                    icon: <Activity className="text-indigo-500" size={18} />
                  },
                  {
                    title: lang === 'en' ? 'Savings Capacity Efficiency' : 'Efisiensi Kapasitas Tabung',
                    value: '+32.4%',
                    badge: lang === 'en' ? 'HIGH CAPACITY' : 'KAPASITAS TINGGI',
                    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
                    percentage: '32.4%',
                    subText: lang === 'en' ? 'Healthy accumulative surplus' : 'Surplus akumulatif sehat',
                    icon: <BarChart3 className="text-purple-500" size={18} />
                  }
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between space-y-4 ${isDark
                        ? 'bg-[#121827] border-slate-800 text-slate-100 hover:border-slate-700/80 shadow-lg'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100/50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {card.icon}
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.title}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold uppercase border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black tracking-tight">{card.value}</span>
                        <span className="text-xs font-semibold text-emerald-500 font-mono">{card.percentage}</span>
                      </div>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.subText}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800/80' : 'bg-slate-200'}`}>
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: card.percentage }}
                          transition={{ duration: 1, delay: 0.1 * idx }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Huge Diagnostic Visualizer Banner & Live Metrics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

                {/* Embedded Big Interactive SVG Mockup Dashboard Visualization */}
                <div className={`lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between relative overflow-hidden min-h-[380px] ${isDark
                    ? 'bg-[#0f1424] border-slate-800 shadow-inner'
                    : 'bg-slate-50 border-slate-200'
                  }`}>

                  {/* Decorative background grids */}
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-25 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between w-full mb-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest block">Simulation Plotter</span>
                      <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {lang === 'en' ? 'Mathematical Cashflow Trajectory Diagnostic' : 'Diagnostik Lintasan Arus Kas Matematis'}
                      </h3>
                    </div>

                    {/* Timeframe selector simulated */}
                    <div className="flex gap-1.5 font-mono text-[10px]">
                      {['M1', 'M3', 'M6', 'M12'].map((term, i) => (
                        <span
                          key={term}
                          className={`px-2.5 py-1 rounded-lg border font-bold ${i === 2
                              ? 'bg-blue-600 border-blue-600 text-white shadow'
                              : isDark
                                ? 'bg-slate-950 border-slate-800 text-slate-450'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fully Animated Custom SVG Waveform Chart Area */}
                  <div className="relative h-48 w-full flex items-center justify-center -my-2">

                    {/* SVG Chart Graphic */}
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Horizontal Guidelines */}
                      <line x1="0" y1="50" x2="800" y2="50" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="100" x2="800" y2="100" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="150" x2="800" y2="150" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="1" strokeDasharray="4 4" />

                      {/* Main Cashflow Trend Area */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        d="M0,130 C150,140 250,60 380,80 C500,100 600,160 800,110 L800,200 L0,200 Z"
                        fill="url(#chartGlow)"
                      />

                      {/* Line 1 Indicator (Inflows Trend) */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                        d="M0,130 C150,140 250,60 380,80 C500,100 600,160 800,110"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3.5"
                      />

                      {/* Line 2 Indicator (Required Threshold) */}
                      <line x1="0" y1="110" x2="800" y2="110" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="6 4" />

                      {/* Flow Dot indicators animating on paths */}
                      <motion.circle
                        cx="380"
                        cy="80"
                        r="6"
                        fill="#60a5fa"
                        stroke="#1d4ed8"
                        strokeWidth="2.5"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2
                        }}
                      />

                      <motion.circle
                        cx="800"
                        cy="110"
                        r="5"
                        fill="#10b981"
                        stroke="#065f46"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Overlay badges hovering inside chart frame */}
                    <div className="absolute top-4 left-10 scale-95 sm:scale-100 flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-900/40 border-slate-700/50 text-slate-100 text-[10px] font-mono shadow-md backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span>Net Inflow: <strong>+Rp 4,824,000</strong></span>
                    </div>

                    <div className="absolute top-1/2 right-[20%] scale-95 sm:scale-100 flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-900/40 border-slate-700/50 text-slate-100 text-[10px] font-mono shadow-md backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>OpEx Threshold Check: <strong>PASSED</strong></span>
                    </div>
                  </div>

                  {/* Mathematical Equations Validation Log ticker */}
                  <div className={`mt-2 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 text-[11px] font-mono ${isDark ? 'bg-slate-950/85 border-slate-800 text-slate-400' : 'bg-white border-slate-205 text-slate-600'
                    }`}>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="text-blue-500 animate-spin-slow shrink-0" size={13} />
                      <span className="font-bold">{lang === 'en' ? 'Calibration standard logs:' : 'Log standar kalibrasi:'}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                        v2.4-deterministic
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-sm">
                      DSR_RATIO = SUM(Obligations) / NET_CAPACITY = 28.5% [SUCCESS]
                    </div>
                  </div>

                </div>

                {/* Right Panel: Structured Modern Audit Status Board */}
                <div className="lg:col-span-4 gap-4 flex flex-col justify-between">

                  {/* Calibration Standard Overview */}
                  <div className={`p-5 rounded-2xl border flex-1 space-y-4 text-left ${isDark ? 'bg-[#0f1424] border-slate-800' : 'bg-slate-50 border-slate-205'
                    }`}>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-blue-500 shrink-0" />
                      <span className={`text-[11px] font-bold font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lang === 'en' ? 'Mathematical Validation Engine' : 'Mesin Validasi Matematis'}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {lang === 'en'
                        ? 'Your finances are processed locally inside your browser using precise, rule-based economic logic. No algorithms guess; it relies strictly on real arithmetic calculations.'
                        : 'Keuangan Anda diproses secara lokal langsung di peramban menggunakan logika ekonomi berbasis aturan dasar. Tidak ada tebakan algoritma; murni perhitungan aritmatika nyata.'}
                    </p>

                    {/* Core Rules Checklist */}
                    <div className="space-y-3 pt-2">
                      {[
                        { label: lang === 'en' ? 'Cashflow Allocation check' : 'Cek Alokasi Arus Kas', val: 'PASSED' },
                        { label: lang === 'en' ? 'Required Emergency Reserve Buffer' : 'Bantalan Kas Darurat Wajib', val: '6.4 MONTHS' },
                        { label: lang === 'en' ? 'Obligations and DSR evaluation' : 'Evaluasi DSR & Kewajiban Utang', val: 'OPTIMAL' },
                        { label: lang === 'en' ? 'Household Budget Diagnostics' : 'Diagnostik Anggaran Rumah Tangga', val: '100% SECURED' }
                      ].map((rule, key) => (
                        <div key={key} className="flex items-center justify-between text-[11px] font-mono">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{rule.label}</span>
                          <span className="font-extrabold text-emerald-500 text-right">{rule.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calibration Live Ticker Status */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between text-left ${isDark ? 'bg-[#0d1222] border-slate-805' : 'bg-white border-slate-200'
                    }`}>
                    <div className="flex items-center gap-3">
                      <Activity className="text-blue-500 animate-pulse shrink-0" size={24} />
                      <div className="leading-none">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Calibration Rigidity</div>
                        <div className="text-[9px] font-mono mt-1 text-slate-500">100% Mathematical Certainty</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Feature Cards Grid: WIDE Screen optimization */}
      <section id="features-section" className={`py-20 border-y transition-colors duration-500 ${isDark ? 'bg-[#0f1322] border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-500">Core Ratios</span>
            <h2 className={`text-3xl font-extrabold sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'en' ? 'Rigid Framework Indicators' : 'Indikator Kerangka Rigid Kami'}
            </h2>
            <p className={`text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'en' ? 'Calculated automatically with mathematical precision across household cash flows and enterprise balance reserves.' : 'Dihitung otomatis dengan tingkat presisi matematis untuk pengeluaran bulanan dan kas bisnis Anda.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Coins className="text-blue-500" />, title: lang === 'en' ? 'Cashflow Health' : 'Kesehatan Arus Kas', metric: 'Net Margin', desc: lang === 'en' ? 'Evaluating household income against all domestic outflows to determine your absolute accumulation velocity.' : 'Mengevaluasi pemasukan dibandingkan dengan pengeluaran bulanan Anda untuk mengukur kecepatan tabungan.' },
              { icon: <ShieldAlert className="text-orange-500" />, title: lang === 'en' ? 'Debt Service Ratio' : 'Debt Service Ratio (DSR)', metric: 'DSR Limit 35%', desc: lang === 'en' ? 'Assessing your installment burdens against incoming monthly revenues to avoid catastrophic leverage spirals.' : 'Mengukur cicilan utang bulanan Anda dibandingkan pendapatan untuk menghindari jeratan beban utang kritis.' },
              { icon: <TrendingUp className="text-emerald-500" />, title: lang === 'en' ? 'Business Runway' : 'Runway Bisnis', metric: 'Burn Rate Buffer', desc: lang === 'en' ? 'Determining exactly how many months your enterprise can operate productively based on static cash reserves.' : 'Menghitung waktu bertahan bisnis Anda berdasarkan cadangan kas saat ini dikurangi biaya opex rutin.' },
              { icon: <Users className="text-purple-500" />, title: lang === 'en' ? 'Overhead Efficiency' : 'Efisiensi Beban Tim', metric: 'Payroll Limit 30%', desc: lang === 'en' ? 'Reviewing the health ratios of payroll commitments against receipts to optimize sustainable capital deployment.' : 'Menjaga margin pengeluaran tim tetap ideal dengan performa omzet guna menjamin ekspansi bisnis.' }
            ].map((f, i) => (
              <motion.div
                whileHover={{ scale: 1.04, y: -6 }}
                transition={{ duration: 0.3 }}
                id={`feature-card-${i}`}
                key={i}
                className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${isDark
                    ? 'bg-[#121827] border-slate-800 hover:border-blue-900/60 shadow-lg shadow-indigo-950/10 hover:shadow-indigo-900/25'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
                  }`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50'
                    }`}>
                    {f.icon}
                  </div>
                  <h3 className={`font-bold text-lg ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{f.title}</h3>
                  <p className={`text-xs font-mono font-bold w-max px-2.5 py-1 rounded ${isDark ? 'bg-blue-950/50 text-blue-400 border border-blue-900/30' : 'bg-blue-50 text-blue-600'
                    }`}>{f.metric}</p>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems & Solutions Dual Sections (Styled Red & Green) */}
      <section id="problems-solutions" className="py-24">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">

            {/* PROBLEM ROADBLOCKS - RED STYLING */}
            <div className={`space-y-10 flex flex-col justify-between p-8 lg:p-12 rounded-3xl border relative overflow-hidden transition-all duration-300 ${isDark ? 'bg-red-950/10 border-red-900/30' : 'bg-red-50/20 border-red-100/40'
              }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-rose-700 bg-rose-100/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle size={14} className="animate-pulse text-red-500" />
                  {lang === 'en' ? 'The Threats' : 'Ancaman'}
                </div>
                <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-red-300' : 'text-rose-950'}`}>
                  {t.probTitle}
                </h3>
                <p className={`text-base ${isDark ? 'text-slate-400' : 'text-rose-900/70'}`}>
                  {t.probSubtitle}
                </p>
              </div>

              {/* Problems list */}
              <div className="space-y-6 mt-8">
                {t.problems.map((prob, index) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    id={`prob-item-${index}`}
                    key={index}
                    className={`flex gap-4 p-4 rounded-xl transition-all border cursor-pointer ${isDark
                        ? 'hover:bg-red-950/30 border-transparent hover:border-red-900/40'
                        : 'hover:bg-white/80 border-transparent hover:border-red-100'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`font-extrabold text-base ${isDark ? 'text-rose-200' : 'text-rose-950'}`}>{prob.title}</h4>
                        <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded font-bold ${isDark ? 'bg-red-950/40 text-red-400' : 'bg-rose-200/50 text-rose-800'
                          }`}>
                          {prob.metric}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-rose-900/60'}`}>{prob.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SOLUTIONS CORRECTION - GREEN STYLING */}
            <div className={`space-y-10 flex flex-col justify-between p-8 lg:p-12 rounded-3xl border relative overflow-hidden transition-all duration-300 ${isDark ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-emerald-50/20 border-emerald-100/40'
              }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-100/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {lang === 'en' ? 'The Paradigm Reset' : 'Prinsip Solusi'}
                </div>
                <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>
                  {t.solTitle}
                </h3>
                <p className={`text-base ${isDark ? 'text-slate-400' : 'text-emerald-900/70'}`}>
                  {t.solSubtitle}
                </p>
              </div>

              {/* Solutions list */}
              <div className="space-y-6 mt-8">
                {t.solutions.map((sol, index) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    id={`sol-item-${index}`}
                    key={index}
                    className={`flex gap-4 p-4 rounded-xl transition-all border cursor-pointer ${isDark
                        ? 'hover:bg-emerald-950/30 border-transparent hover:border-emerald-900/40'
                        : 'hover:bg-white/80 border-transparent hover:border-emerald-100'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`font-extrabold text-base ${isDark ? 'text-emerald-200' : 'text-emerald-950'}`}>{sol.title}</h4>
                        <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded font-bold ${isDark ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-200/50 text-emerald-800'
                          }`}>
                          {sol.metric}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-emerald-900/60'}`}>{sol.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Video Demo Preview Section */}
      <section id="demo-preview" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded">
              {t.demoTitle}
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
              {lang === 'en' ? 'Calculations in Real Time' : 'Mekanisme Hitung Real-Time'}
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              {t.demoSubtitle}
            </p>
          </div>

          {/* Simulated Browser Frame Container (Anti Space-Hogging Wide Layout) */}
          <div className="relative max-w-5xl mx-auto bg-slate-950/80 rounded-2xl border border-slate-700/50 shadow-2xl p-4 sm:p-8 backdrop-blur overflow-hidden">

            {/* Header circles */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 w-3 h-3 h-3 rounded-full bg-rose-500 block"></span>
                <span className="w-3 w-3 h-3 h-3 rounded-full bg-amber-500 block"></span>
                <span className="w-3 w-3 h-3 h-3 rounded-full bg-emerald-500 block"></span>
                <span className="text-xs text-slate-500 ml-3 font-mono">https://contech.id/diagnostic</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className="p-2 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                >
                  {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  <span className="hidden sm:inline font-mono">{soundEnabled ? 'Sfx On' : 'Sfx Off'}</span>
                </button>
              </div>
            </div>

            {/* Live active dashboard simulator body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">

              {/* Simulator controller sidebar */}
              <div className="lg:col-span-5 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-slate-300 font-mono tracking-wider uppercase">
                      Interactive Inputs
                    </h4>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold uppercase font-mono tracking-widest leading-none">
                      Mock Variables
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Input Variable A */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{lang === 'en' ? 'Household Income' : 'Pendapatan Bulanan'}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          ${mockRevenue.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="80000"
                        step="1000"
                        value={mockRevenue}
                        onChange={(e) => {
                          setMockRevenue(Number(e.target.value));
                          if (simProgress >= 100) setSimProgress(99);
                        }}
                        className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-850 rounded-lg"
                      />
                    </div>

                    {/* Input Variable B */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{lang === 'en' ? 'Employee Payroll' : 'Total Gaji Pegawai'}</span>
                        <span className="font-mono text-rose-400 font-bold">
                          ${mockPayroll.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2000"
                        max="40000"
                        step="500"
                        value={mockPayroll}
                        onChange={(e) => {
                          setMockPayroll(Number(e.target.value));
                          if (simProgress >= 100) setSimProgress(99);
                        }}
                        className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-850 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Micro Info Info */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold font-mono text-[10px] uppercase">
                      <CheckCircle2 size={12} />
                      Simulated Payroll Ratio:
                    </div>
                    <p className="font-mono">
                      {((mockPayroll / mockRevenue) * 100).toFixed(1)}% {((mockPayroll / mockRevenue) * 100) > 50 ? '❌ Bloated (Critial > 50%)' : '✅ Healthy (< 30%)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80">
                  {!isPlaying ? (
                    <button
                      onClick={handleSimStart}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm"
                    >
                      <Play size={15} fill="currentColor" />
                      {simProgress > 0 && simProgress < 100 ? 'Resume' : t.demoPlay}
                    </button>
                  ) : (
                    <button
                      onClick={handleSimPause}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <Pause size={15} fill="currentColor" />
                      Pause
                    </button>
                  )}

                  <button
                    onClick={handleSimReset}
                    className="p-3 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-800"
                    title={t.demoReset}
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>

              {/* Simulation Visual Window */}
              <div className="lg:col-span-7 bg-slate-950 p-6 rounded-xl border border-slate-900/50 flex flex-col justify-between space-y-6 min-h-[300px] relative">

                {/* Active process toast overlay */}
                <AnimatePresence>
                  {soundNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-4 left-6 right-6 px-4 py-2.5 bg-blue-600 text-white font-mono text-xs font-bold rounded-lg shadow-xl flex items-center gap-2 border border-blue-500 z-20"
                    >
                      <Smartphone size={15} className="animate-bounce" />
                      {soundNotification}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest">
                    Diagnostic Workspace
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded">
                    Progress: <span className="text-blue-400 font-extrabold">{Math.floor(simProgress)}%</span>
                  </span>
                </div>

                {/* Simulated Diagnostic Dashboard UI based on calculation progress */}
                <div className="flex-1 flex flex-col justify-center space-y-6 py-4">
                  {simProgress === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 bg-slate-900/80 rounded-full border border-slate-800 flex items-center justify-center mx-auto text-slate-500 animate-pulse">
                        <Play size={20} fill="currentColor" onClick={handleSimStart} className="cursor-pointer hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-300">
                          {lang === 'en' ? 'Ready to Simulate Diagnostic Engine' : 'Sistem Siap Mensimulasikan Diagnosa'}
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {lang === 'en' ? 'Click simulation run to inspect custom mathematical models evaluated on mock inputs.' : 'Klik Mulai Cek atau Simulasi Run untuk melihat visualisasi kalkulasi.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5 animate-in fade-in duration-300">

                      {/* Active simulation phase indicator */}
                      <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                        {simStep === 0 && t.demoStage1}
                        {simStep === 1 && t.demoStage2}
                        {simStep >= 2 && t.demoStage3}
                      </div>

                      {/* Diagnostic Score Circle and metrics */}
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-850 flex flex-col items-center justify-center space-y-1">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Diagnostic Score</span>
                          <span className="text-3xl font-black text-slate-200">
                            {simProgress < 70 ? 'Calculating...' : '74'}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded font-mono ${simProgress < 70 ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                            {simProgress < 70 ? 'Processing' : 'HEALTHY'}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {/* Financial metric runway indicator */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                              <span>Net Margin Result</span>
                              <span className="font-bold text-slate-200">{simProgress < 40 ? '...' : `${mockNetMargin.toFixed(1)}%`}</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${mockNetMargin > 15 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{ width: `${simProgress < 40 ? 0 : Math.max(0, Math.min(100, mockNetMargin))}%` }}
                              />
                            </div>
                          </div>

                          {/* DSR Indicator */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                              <span>Payroll Allocation</span>
                              <span className="font-bold text-slate-200">{simProgress < 65 ? '...' : `${((mockPayroll / mockRevenue) * 100).toFixed(0)}%`}</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${((mockPayroll / mockRevenue) * 100) > 50 ? 'bg-rose-550' : 'bg-blue-500'}`}
                                style={{ width: `${simProgress < 65 ? 0 : Math.min(100, (mockPayroll / mockRevenue) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommended actions summary simulation */}
                      {simProgress >= 80 && (
                        <div className="p-3 bg-emerald-950/30 border border-emerald-820 rounded-lg text-xs text-emerald-300 animate-in slide-in-from-bottom duration-300">
                          <div className="flex gap-2 items-start">
                            <CheckCircle2 size={13} className="shrink-0 text-emerald-400 mt-0.5" />
                            <div>
                              <span className="font-extrabold block">Restructuring Action Recommendation:</span>
                              Keep domestic reserves stacked above 6 months and reinvest {mockNetMargin.toFixed(0)}% surplus cash flows into safe high-yield assets.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar timeline */}
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-75" style={{ width: `${simProgress}%` }} />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Testimoni Sections (4 Cards Responsive Grid layout) */}
      <section id="testimonials-section" className={`py-24 transition-colors duration-500 ${isDark ? 'bg-[#0b0f19] border-t border-slate-800/80' : 'bg-slate-50 border-t border-slate-100'}`}>
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12">

          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-500">Client Reviews</span>
            <h2 className={`text-3xl font-extrabold sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.testTitle}
            </h2>
            <p className={`text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.testSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.testimonials.map((test, i) => (
              <motion.div
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                id={`testimonial-card-${i}`}
                key={i}
                className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer ${isDark
                    ? 'bg-[#121827] border-slate-800 hover:border-blue-900/60 shadow-lg shadow-indigo-950/10'
                    : 'bg-white border-slate-100 hover:border-blue-100 shadow-sm'
                  }`}
              >
                <div className="space-y-3">
                  {/* Stars block */}
                  <div className="flex gap-1">
                    {[...Array(test.rating)].map((_, idx) => (
                      <span key={idx} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>

                  {/* Text quotes */}
                  <p className={`text-sm leading-relaxed font-medium italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "{test.text}"
                  </p>
                </div>

                {/* Testimonial Author profile element */}
                <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-serif shadow-inner ${isDark ? 'bg-slate-900 border border-slate-800 text-slate-300' : 'bg-slate-100/80 border border-slate-200/80 text-slate-700'
                      }`}>
                      {test.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className={`font-extrabold text-sm leading-none ${isDark ? 'text-slate-105' : 'text-slate-900'}`}>{test.name}</h4>
                      <span className="text-xs text-slate-500 block mt-1">{test.role} • {test.location}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2.5 py-1 rounded border ${isDark ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                    {test.target}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Solid High-Contrast CTA Banner Section */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 text-center relative z-10 space-y-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {t.ctaTitle}
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto">
              {t.ctaSubtitle}
            </p>
          </div>

          <button
            onClick={onStart}
            className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-blue-500/20 active:scale-95 transition-all inline-flex items-center gap-3 group border border-blue-500"
          >
            {t.ctaAction}
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform animate-pulse" />
          </button>
        </div>
      </section>

      {/* Premium Footer with precise target links & custom active modals */}
      <footer id="footer-anchor" className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

            {/* Branding widget */}
            <div className="md:col-span-6 lg:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Financial Health logo"
                  className="w-9 h-9 rounded-lg object-contain shadow-sm"
                />
                <span className="font-extrabold text-base tracking-tight text-white">
                  Financial<span className="text-blue-500 font-extrabold">Health</span>
                </span>
              </div>

              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                {lang === 'en' ? 'Calculative diagnostics engineered to secure operational survival ranges. Built for micro-enterprises and diligent domestic budgeting.' : 'Asesmen finansial deterministik yang dirancang khusus untuk mewujudkan sekuritas arus kas pribadi maupun bisnis Anda.'}
              </p>

              {/* Exact social media channels requested with custom matching brand SVGs */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase block font-mono">
                  Official Channels (CONTECH ID)
                </span>
                <div className="flex items-center gap-3">

                  {/* INSTAGRAM */}
                  <a
                    href="https://www.instagram.com/contech.id/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750"
                    title="Instagram - contech.id"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>

                  {/* THREADS */}
                  <a
                    href="https://www.threads.com/@contech.id?hl=id"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750"
                    title="Threads - contech.id"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      {/* Accurate premium Threads logo outline */}
                      <path d="M12.553 14.194c-.655 0-1.164-.176-1.527-.527-.364-.352-.546-.867-.546-1.545 0-.703.188-1.221.562-1.553a1.99 1.99 0 011.511-.5c.67 0 1.18.172 1.533.515.353.344.53.86.53 1.549 0 .691-.18 1.207-.538 1.549-.359.342-.871.512-1.524.512zm9.157-1.198a9.423 9.423 0 00-1.693-5.266c-.66-1.127-1.61-2.008-2.848-2.645A9.23 9.23 0 0012.32 4.13a9.404 9.404 0 00-6.732 2.583C4.246 8.013 3.575 9.773 3.575 12c0 2.227.671 3.987 2.013 5.287 1.342 1.3 3.586 1.95 6.733 1.95 2.52 0 4.58-.387 6.182-1.16v-2.39a11.1251 11.1251 0 01-5.182 1.3c-2.368 0-3.931-.475-4.688-1.425-.563-.7-0.814-1.666-.753-2.9h8.552c.03-.092.045-.2.045-.325v-.312c0-1.133-.238-1.953-.715-2.46-.477-.508-1.187-.762-2.132-.762-.973 0-1.742.333-2.307 1-.565.667-.848 1.59-.848 2.77s.28 2.103.84 2.77c.56.667 1.334 1 2.321 1 .987 0 1.76-.328 2.322-.983l1.833 1.157c-.896 1.367-2.348 2.05-4.355 2.05-1.97 0-3.413-.591-4.33-1.774-.916-1.182-1.374-2.83-1.374-4.943s.458-3.766 1.374-4.95c.917-1.183 2.36-1.774 4.33-1.774 1.944 0 3.391.547 4.342 1.64 1.096 1.205 1.503 3.033 1.258 5.617h-1.077z" />
                    </svg>
                  </a>

                  {/* X (FORMERLY TWITTER) */}
                  <a
                    href="https://x.com/contechofficial"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750"
                    title="X - contechofficial"
                  >
                    <svg className="w-4 h-4 fill-current0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* FACEBOOK */}
                  <a
                    href="https://web.facebook.com/contech.id."
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750"
                    title="Facebook - contech.id"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V5.7C13 4.8 13.5 4 14.7 4H17V0h-3.8C9.5 0 8 1.5 8 4.7V8z" />
                    </svg>
                  </a>

                  {/* TIKTOK */}
                  <a
                    href="https://www.tiktok.com/@contech.id"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750"
                    title="TikTok - contech.id"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.21-.42-.45-.61-.7v5.13c.03 2.9-.92 5.86-3.11 7.68-2.26 1.93-5.59 2.45-8.31 1.4-3.06-1.11-5.32-4.04-5.41-7.39-.12-3.88 2.58-7.55 6.42-8.11 1.13-.18 2.29-.11 3.41.13V10.2c-1.16-.36-2.47-.2-3.48.5-.94.62-1.49 1.73-1.42 2.87.03 1.43 1.05 2.74 2.44 3.03 1.25.28 2.68-.18 3.36-1.25.4-.59.51-1.32.48-2.01V.02z" />
                    </svg>
                  </a>

                  {/* YOUTUBE */}
                  <a
                    href="https://www.youtube.com/@contechid1288"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-750"
                    title="YouTube - contechid1288"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                </div>
              </div>
            </div>

            {/* Quick navigations */}
            <div className="md:col-span-3 lg:col-span-2 space-y-4">
              <h4 className="font-extrabold text-white text-sm tracking-wider uppercase font-mono">
                {lang === 'en' ? 'Core Anchors' : 'Navigasi Menu'}
              </h4>
              <ul className="space-y-2.5 text-sm font-semibold">
                <li>
                  <button onClick={() => scrollTo('features-section')} className="hover:text-white hover:underline transition-all">
                    {t.featuresMenu}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('problems-solutions')} className="hover:text-white hover:underline transition-all">
                    {t.problemMenu}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('demo-preview')} className="hover:text-white hover:underline transition-all">
                    {t.demoMenu}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('testimonials-section')} className="hover:text-white hover:underline transition-all">
                    {t.testimonialMenu}
                  </button>
                </li>
              </ul>
            </div>

            {/* Interactive Terms/Legal files triggers (Will open modals) */}
            <div className="md:col-span-3 lg:col-span-3 space-y-4">
              <h4 className="font-extrabold text-white text-sm tracking-wider uppercase font-mono">
                {lang === 'en' ? 'Legal & Help Resources' : 'Informasi Hukum & Layanan'}
              </h4>
              <ul className="space-y-2.5 text-sm font-semibold">
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="hover:text-white flex items-center gap-2 hover:underline transition-all text-left">
                    <Shield size={14} className="text-blue-500 animate-pulse" />
                    {lang === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('terms')} className="hover:text-white flex items-center gap-2 hover:underline transition-all text-left">
                    <FileText size={14} className="text-blue-500" />
                    {lang === 'en' ? 'Terms & Conditions' : 'Syarat & Ketentuan'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('disclaimer')} className="hover:text-white flex items-center gap-2 hover:underline transition-all text-left">
                    <HelpCircle size={14} className="text-blue-500" />
                    {lang === 'en' ? 'Disclaimer Notice' : 'Pernyataan Penyangkalan'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('contact')} className="hover:text-white flex items-center gap-2 hover:underline transition-all text-left">
                    <MessageSquare size={14} className="text-blue-550" />
                    {lang === 'en' ? 'Contact Contech Support' : 'Hubungi Tim Teknis Kami'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Footer operational summary */}
            <div className="md:col-span-12 lg:col-span-3">
              <div className="border border-slate-800 bg-slate-950/40 p-5 rounded-2xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-white text-sm tracking-wider uppercase font-mono">
                      {lang === 'en' ? 'Diagnostic Snapshot' : 'Ringkasan Diagnostik'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">
                      {lang === 'en' ? 'Core checks available inside the platform.' : 'Pemeriksaan inti tersedia di dalam platform.'}
                    </p>
                  </div>
                  <ShieldCheck size={22} className="text-blue-500 shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                    <Activity size={16} className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white">Cashflow</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {lang === 'en' ? 'Margin health' : 'Kesehatan margin'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                    <BarChart3 size={16} className="text-blue-400 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white">DSR</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {lang === 'en' ? 'Debt pressure' : 'Tekanan utang'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 border border-slate-800 p-3">
                    <Database size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-white">Runway</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {lang === 'en' ? 'Reserve coverage' : 'Cakupan cadangan'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
            <p>&copy; {new Date().getFullYear()} Contech ID. All rights reserved. Precision-crafted deterministic platform.</p>
          </div>
        </div>

        {/* Dynamic Interactive Modal Popup explain dialog (The requested functional Legal Popups) */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-55"
              style={{ zIndex: 999 }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden"
              >
                {/* Background design elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/40 rounded-full blur-xl pointer-events-none" />

                <h3 className="text-xl font-extrabold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-4 pr-8">
                  <Shield size={20} className="text-blue-600 shrink-0" />
                  {t.popups[activeModal].title}
                </h3>

                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="py-4 text-sm text-slate-600 leading-relaxed font-medium space-y-4 max-h-[400px] overflow-y-auto">
                  <p>{t.popups[activeModal].content}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all shadow-sm"
                  >
                    {lang === 'en' ? 'Understand & Close' : 'Mengerti & Tutup'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </footer>

    </div>
  );
};
