import React from 'react';
import { Language } from '../types';
import { TEXT } from '../services/translations';
import { motion } from 'motion/react';
import { 
  BookOpen, Calculator, Scale, Target, TrendingUp, Users, Shield, 
  HelpCircle, AlertTriangle, Activity, Database, Sparkles, Building2,
  Percent, Clock, ShieldCheck, DollarSign, RefreshCcw, Landmark
} from 'lucide-react';

interface Props {
  lang: Language;
  isDark: boolean;
}

const I_TEXT = {
  en: {
    title: 'Methodology & Diagnostics',
    subtitle: 'Explore the 12 core algorithmic rules that guide our diagnostic engine to evaluate your personal and business financial health.',
    formula: 'Formula',
    benchmark: 'Benchmark',
    whyItMatters: 'Why it matters',
    disclaimer: 'Our algorithms are designed based on Generally Accepted Accounting Principles (GAAP) and modern corporate finance best practices.',
    items: [
      {
        title: 'Cashflow Health',
        formula: 'Net Cashflow = Income - Expenses',
        benchmark: 'Positive (> 0) / Month',
        why: 'The absolute lifeblood of personal finance. Without positive cashflow, debt accumulation is inevitable and investing is impossible.',
        icon: 'trending'
      },
      {
        title: 'Debt Service Ratio (DSR)',
        formula: 'Monthly Debt Payments / Monthly Income',
        benchmark: 'Ideal: < 35%, Critical: > 50%',
        why: 'Measures your monthly debt bottleneck. High DSR locks your cash flow, completely choking compound growth potential.',
        icon: 'scale'
      },
      {
        title: 'Emergency Fund Coverage',
        formula: 'Total Liquid Cash / Monthly Expenses',
        benchmark: 'Safe: > 6 Months coverage',
        why: 'Your ultimate buffer against unexpected personal shocks (medical, unemployment), protecting long-term retirement investments from premature liquidation.',
        icon: 'shield'
      },
      {
        title: 'Business Runway',
        formula: 'Cash Reserves / Monthly Burn Rate',
        benchmark: 'Safe: > 12 Months',
        why: 'How long the business can survive without generating new top-line revenue. Highly critical for weathering macro crises or pivoting models.',
        icon: 'target'
      },
      {
        title: 'Net Profit Margin',
        formula: '(Revenue - All Expenses) / Revenue',
        benchmark: 'Healthy: > 15%',
        why: 'Measures operational yield efficiency. Low-margin entities are highly fragile, risking quick liquidation upon slight inflation or pricing wars.',
        icon: 'calculator'
      },
      {
        title: 'Payroll Efficiency',
        formula: 'Total Payroll / Revenue',
        benchmark: 'Ideal: < 30% for high growth, < 50% for service',
        why: 'Human cost is often the largest business expense. If it exceeds 50%, the business works for the employees, not the owners.',
        icon: 'users'
      },
      {
        title: 'Current Ratio (Liquidity)',
        formula: 'Current Assets / Current Liabilities',
        benchmark: 'Healthy: > 1.5 ratio',
        why: 'Measures short-term solvency. Confirms if the business holds enough liquid assets to pay debts maturing in the next 12 months.',
        icon: 'book'
      },
      {
        title: 'Client Concentration Risk',
        formula: 'Top Client Share * 100',
        benchmark: 'Optimal: < 25%, Vulnerable: > 50%',
        why: 'Having too much revenue tied to one client is dangerous. Losing a single contract shouldn\'t trigger immediate corporate bankruptcy.',
        icon: 'activity'
      },
      {
        title: 'Accounts Receivable Velocity',
        formula: 'Receivables Over 90 Days / Total Receivables',
        benchmark: 'Excellent: < 10% aging rate',
        why: 'Cash stuck in accounts receivable is idle money. High receivable aging reveals bad collection velocity or high write-off risk.',
        icon: 'clock'
      },
      {
        title: 'Operating Cash Burn Safety',
        formula: 'Business Cash Reserves / Monthly Operating Expense',
        benchmark: 'Safe: 3 to 6 Months',
        why: 'Defines the pure non-COGS overhead burn runway. Keeps operational structures solid during pivot stages or supply delays.',
        icon: 'building'
      },
      {
        title: 'Product COGS Efficiency',
        formula: 'COGS / Revenue',
        benchmark: 'Safe: < 40% (Services) or < 65% (Products)',
        why: 'Measures raw procurement and direct production efficiency. Controlling direct costs is the absolute baseline of scaling pricing power.',
        icon: 'percent'
      },
      {
        title: 'Solvency Leverage (Debt/Assets)',
        formula: 'Current Liabilities / Current Assets',
        benchmark: 'Comfortable: < 0.6',
        why: 'Indicates the leverage scale of current operations. Excessively leveraged entities rely too heavily on creditors, risking sudden debt recall panic.',
        icon: 'landmark'
      }
    ]
  },
  id: {
    title: 'Metodologi & Diagnosa',
    subtitle: 'Pelajari 12 aturan algoritmik inti yang membimbing mesin diagnosa kami dalam mengevaluasi kesehatan finansial pribadi dan bisnis Anda.',
    formula: 'Rumus',
    benchmark: 'Tolak Ukur',
    whyItMatters: 'Mengapa ini penting',
    disclaimer: 'Algoritma kami dirancang berdasarkan Prinsip Akuntansi yang Berlaku Umum (GAAP) dan praktik terbaik manajemen keuangan korporat modern.',
    items: [
      {
        title: 'Kesehatan Arus Kas',
        formula: 'Arus Kas Bersih = Pendapatan - Pengeluaran',
        benchmark: 'Positif (> 0) / Bulan',
        why: 'Nadi utama dari keuangan pribadi. Tanpa arus kas bersih yang positif, akumulasi utang tak dapat dihindari dan investasi mustahil dilakukan.',
        icon: 'trending'
      },
      {
        title: 'Rasio Cicilan Utang (DSR)',
        formula: 'Cicilan Utang Bulanan / Pendapatan Bulanan',
        benchmark: 'Ideal: < 35%, Kritis: > 50%',
        why: 'Mengukur hambatan cicilan utang bulanan Anda. DSR yang tinggi mematikan kelenturan arus kas, menahan pencapaian kebebasan finansial.',
        icon: 'scale'
      },
      {
        title: 'Cakupan Dana Darurat',
        formula: 'Total Kas Likuid / Pengeluaran Bulanan',
        benchmark: 'Aman: > 6 Bulan cakupan',
        why: 'Penyangga utama terhadap guncangan pribadi tak terduga (PHK, kesehatan), menghindarkan Anda dari keharusan mencairkan investasi jangka panjang.',
        icon: 'shield'
      },
      {
        title: 'Runway Bisnis',
        formula: 'Cadangan Kas / Burn Rate Bulanan',
        benchmark: 'Aman: > 12 Bulan',
        why: 'Seberapa lama bisnis Anda mampu bernafas tanpa menghasilkan omzet baru. Sangat krusial demi bertahan di kala resesi ekonomi makro.',
        icon: 'target'
      },
      {
        title: 'Margin Laba Bersih',
        formula: '(Revenue - Semua Biaya) / Revenue',
        benchmark: 'Sehat: > 15%',
        why: 'Mengukur efisiensi laba operasional. Entitas bermargin rendah sangat rentan runtuh ketika terjadi inflasi biaya sedikit saja.',
        icon: 'calculator'
      },
      {
        title: 'Efisiensi Gaji Karyawan',
        formula: 'Total Gaji / Revenue',
        benchmark: 'Ideal: < 30% (Growth), < 50% (Jasa)',
        why: 'Upah karyawan seringkali menjadi biaya terbesar. Jika melampaui 50%, bisnis seolah-olah bekerja untuk karyawan, bukan pemiliknya.',
        icon: 'users'
      },
      {
        title: 'Rasio Lancar (Likuiditas)',
        formula: 'Aset Lancar / Utang Lancar',
        benchmark: 'Sehat: Rasio > 1.5',
        why: 'Mengukur solvabilitas jangka pendek. Memastikan persediaan aset lancar cukup untuk melunasi kewajiban yang jatuh tempo dalam 12 bulan.',
        icon: 'book'
      },
      {
        title: 'Risiko Konsentrasi Klien',
        formula: 'Porsi Klien Terbesar * 100',
        benchmark: 'Optimal: < 25%, Rentan: > 50%',
        why: 'Terlalu bergantung pada satu klien kunci sangatlah berbahaya. Kehilangan satu kontrak tidak boleh melumpuhkan operasional korporasi Anda.',
        icon: 'activity'
      },
      {
        title: 'Kecepatan Penagihan Piutang',
        formula: 'Piutang Lebih dari 90 Hari / Total Piutang',
        benchmark: 'Luar Biasa: < 10% kedaluwarsa',
        why: 'Piutang macet adalah dana mati yang tidak produktif di bank Anda. Persentase tinggi menunjukkan lambatnya perputaran dana piutang.',
        icon: 'clock'
      },
      {
        title: 'Keamanan Cadangan Operasional',
        formula: 'Cadangan Kas Bisnis / Pengeluaran OpEx Bulanan',
        benchmark: 'Aman: 3 sampai 6 Bulan',
        why: 'Definisi kekuatan kas di luar harga pokok produksi. Menjaga infrastruktur kantor agar tetap solid di masa transisi pasar atau kendala suplai.',
        icon: 'building'
      },
      {
        title: 'Efisiensi Harga Pokok Penjualan (HPP)',
        formula: 'HPP / Revenue',
        benchmark: 'Aman: < 40% (Jasa) atau < 65% (Produk)',
        why: 'Mengukur efisiensi atas biaya langsung produk atau jasa. Mengontrol HPP adalah kunci mutlak untuk menaikkan kekuatan harga jual.',
        icon: 'percent'
      },
      {
        title: 'Leverage Solvabilitas (Utang/Aset)',
        formula: 'Kewajiban Lancar / Aset Lancar',
        benchmark: 'Nyaman: < 0.6',
        why: 'Menunjukkan seberapa besar rasio ketergantungan modal kerja pada utang. Leverage berlebih memicu kerentanan pada panggilan eksekusi kredit.',
        icon: 'landmark'
      }
    ]
  }
};

export const InsightsView: React.FC<Props> = ({ lang, isDark }) => {
  const t = I_TEXT[lang];

  const getIcon = (type: string) => {
    const classes = "w-6 h-6 stroke-[1.8]";
    switch(type) {
      case 'trending': return <TrendingUp className={`${classes} text-emerald-500`} />;
      case 'scale': return <Scale className={`${classes} text-blue-500`} />;
      case 'shield': return <Shield className={`${classes} text-indigo-500`} />;
      case 'target': return <Target className={`${classes} text-red-500`} />;
      case 'calculator': return <Calculator className={`${classes} text-amber-500`} />;
      case 'users': return <Users className={`${classes} text-teal-500`} />;
      case 'book': return <BookOpen className={`${classes} text-violet-500`} />;
      case 'activity': return <Activity className={`${classes} text-rose-500`} />;
      case 'clock': return <Clock className={`${classes} text-orange-500`} />;
      case 'building': return <Building2 className={`${classes} text-sky-500`} />;
      case 'percent': return <Percent className={`${classes} text-fuchsia-500`} />;
      case 'landmark': return <Landmark className={`${classes} text-emerald-600`} />;
      default: return <HelpCircle className={`${classes} text-slate-400`} />;
    }
  };

  return (
    <div className="max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 py-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full text-blue-500 text-xs font-semibold mb-3">
          <Sparkles size={12} fill="currentColor" />
          <span>FHD Method Engine v1.0</span>
        </div>
        <h1 className={`text-4xl font-extrabold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.title}
        </h1>
        <p className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.subtitle}
        </p>
      </div>

      {/* Grid containing exactly 12 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {t.items.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all group duration-300 hover:shadow-xl hover:scale-[1.01] ${
              isDark 
                ? 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800 hover:border-slate-700' 
                : 'bg-white hover:bg-slate-50/50 border-slate-200/80 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300 ${
                  isDark ? 'bg-slate-950 border border-slate-800' : 'bg-slate-50 border border-slate-100'
                }`}>
                  {getIcon(card.icon)}
                </div>
                <h3 className={`font-bold text-base leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {card.title}
                </h3>
              </div>

              {/* Formula & Benchmarks */}
              <div className="space-y-3.5 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                    {t.formula}
                  </span>
                  <code className={`block p-2 rounded-lg text-xs font-mono border leading-normal break-all ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-slate-330' 
                      : 'bg-slate-50 border-slate-100 text-slate-650'
                  }`}>
                    {card.formula}
                  </code>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                    {t.benchmark}
                  </span>
                  <div className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {card.benchmark}
                  </div>
                </div>
              </div>
            </div>

            {/* Why it Matters Description */}
            <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                {t.whyItMatters}
              </span>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {card.why}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Corporate disclaimer footer info */}
      <div className={`mt-14 rounded-2xl p-6 text-center border ${
        isDark 
          ? 'bg-slate-900/30 border-slate-800 text-slate-450' 
          : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <p className="text-xs leading-relaxed max-w-3xl mx-auto">
          {t.disclaimer}
        </p>
      </div>

    </div>
  );
};

export default InsightsView;
