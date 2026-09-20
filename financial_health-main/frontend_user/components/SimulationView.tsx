import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FinancialInputs, CalculationResult, Language } from '../types';
import { calculateFinancialHealth, DEMO_DATA_ABELL } from '../services/calculator';
import { 
  Zap, AlertTriangle, ShieldCheck, TrendingDown, TrendingUp, HelpCircle,
  TrendingUp as TrendUpIcon, ArrowRight, ShieldAlert, Sparkles, RefreshCw,
  Percent, DollarSign, Briefcase, ChevronRight, Activity, CircleDot, PlayCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  inputs: FinancialInputs | null;
  onLoadDemo: () => void;
  onEditInputs?: () => void;
  lang: Language;
  isDark: boolean;
}

const S_TEXT = {
  en: {
    title: 'Advanced Stress Testing',
    subtitle: 'Evaluate your resilience by exposing your financials to rigorous macroeconomic shocks and custom crisis simulations.',
    noInputsTitle: 'Initialize Financial Data',
    noInputsDesc: 'To run stress simulations, the machine requires baseline financial metrics. Load the standard case study of Abell RJ or go back to input details.',
    loadDemoBtn: 'Load Premium Case Study',
    activeScenario: 'Active Simulation Scenario',
    selectScenario: 'Select Preset Financial Shocks',
    impactAnalysis: 'Real-Time Impact Breakdown',
    customTitle: 'Custom Friction Sliders',
    scoreMetric: 'Resilience Score',
    runwayMetric: 'Expected Runway',
    cashflowMetric: 'Net Cashflow',
    solvencyMetric: 'Solvency Gap',
    actionPlanTitle: 'Stress Mitigation Directives',
    actionPlanDesc: 'Preventative measures generated deterministically under active shock stress levels.',
    projectedEffects: 'Dynamic Runway Projection',
    projectedEffectsDesc: 'Simulated cash balance burn over a 6-month severe downturn.',
    month: 'Mo',
    balance: 'Balance',
    baseline: 'Baseline',
    stressed: 'Stressed',
    
    presets: [
      {
        id: 'black_swan',
        name: 'The Black Swan (Market Crash)',
        desc: 'Severe macroeconomic freeze: -40% gross revenue, with rigid fixed cost overheads remaining fully locked.',
        impact: 'High',
        rev: -40, cogs: 0, opex: 15, payroll: 0,
        advice: 'Immediately institute a 15% discretionary spending freeze and prepare line-of-credit facilities. Restructure accounts receivable terms to collect cash upstream.',
        tag: 'CRITICAL'
      },
      {
        id: 'supply_shock',
        name: 'Global Supply Chain Shock',
        desc: 'COGS inflation and procurement logistics distress: +30% product delivery and raw material expenses.',
        impact: 'Medium',
        rev: 0, cogs: 30, opex: 10, payroll: 0,
        advice: 'Renegotiate vendor terms immediately or pass 10% inflation overhead down to premium customers. Diversify sourcing logistics across decentralized regions.',
        tag: 'WARNING'
      },
      {
        id: 'client_loss',
        name: 'Losing Top Client (Concentration Shock)',
        desc: 'Losing your largest client. Revenue drops by your exact Top Client Concentration Share.',
        impact: 'Severe',
        rev: -100, // calculated dynamically
        cogs: -15, opex: 0, payroll: 0,
        advice: 'Accelerate outbound micro-sales diversification channels. Enforce strict Client Concentration Limits (< 25% allocation per client) for future safety.',
        tag: 'HIGH RISK'
      },
      {
        id: 'inflation_spiral',
        name: 'Wage-Push Stagflation',
        desc: 'Competitive marketplace talent and operations price spiral: +15% payroll expenses and +20% operating expenses.',
        impact: 'Medium',
        rev: 5, cogs: 5, opex: 20, payroll: 15,
        advice: 'Optimize human resource operational efficiency. Freeze non-critical hiring, shifting efforts to automated digital workflows and SaaS tooling.',
        tag: 'MODERATE'
      }
    ],
    customPreset: 'Interactive Customize Mode',
    customPresetDesc: 'Manually tweak variables to test custom financial stress scenarios.',
    customReset: 'Reset to Baseline'
  },
  id: {
    title: 'Stress Testing Tingkat Lanjut',
    subtitle: 'Evaluasi ketahanan finansial Anda dengan mensimulasikan guncangan ekonomi makro dan krisis kustom.',
    noInputsTitle: 'Inisialisasi Data Keuangan',
    noInputsDesc: 'Untuk menjalankan simulasi stres, mesin memerlukan metrik keuangan dasar. Muat studi kasus standar Abell RJ atau kembali ke input data.',
    loadDemoBtn: 'Muat Premium Studi Kasus',
    activeScenario: 'Skenario Simulasi Aktif',
    selectScenario: 'Pilih Preset Guncangan Keuangan',
    impactAnalysis: 'Rincian Dampak Real-Time',
    customTitle: 'Slider Friksi Kustom',
    scoreMetric: 'Skor Ketahanan',
    runwayMetric: 'Proyeksi Runway',
    cashflowMetric: 'Arus Kas Bersih',
    solvencyMetric: 'Kesenjangan Solvabilitas',
    actionPlanTitle: 'Direktif Mitigasi Stres',
    actionPlanDesc: 'Langkah pencegahan yang dihasilkan secara deterministik berdasarkan tingkat stres aktif.',
    projectedEffects: 'Proyeksi Runway Dinamis',
    projectedEffectsDesc: 'Simulasi penurunan saldo kas selama 6 bulan krisis parah.',
    month: 'Bl',
    balance: 'Saldo Kas',
    baseline: 'Dasar',
    stressed: 'Tertekan',

    presets: [
      {
        id: 'black_swan',
        name: 'The Black Swan (Krisis Pasar)',
        desc: 'Penurunan ekonomi makro yang parah: omzet turun -40%, sementara biaya overhead tetap mengikat.',
        impact: 'Tinggi',
        rev: -40, cogs: 0, opex: 15, payroll: 0,
        advice: 'Segera bekukan pengeluaran non-prioritas sebesar 15% dan siapkan fasilitas darurat. Ubah jangka waktu piutang agar arus kas lancar ke dalam.',
        tag: 'KRITIS'
      },
      {
        id: 'supply_shock',
        name: 'Guncangan Rantai Pasok Global',
        desc: 'Inflasi harga pokok penjualan dan logistik: biaya bahan baku / produk naik +30%.',
        impact: 'Sedang',
        rev: 0, cogs: 30, opex: 10, payroll: 0,
        advice: 'Kembangkan kontrak vendor baru atau teruskan 10% beban inflasi kepada konsumen premium Anda. Diversifikasi pemasok logistik Anda.',
        tag: 'PERINGATAN'
      },
      {
        id: 'client_loss',
        name: 'Kehilangan Klien Terbesar',
        desc: 'Lumpuhnya hubungan klien utama. Pendapatan terpangkas sesuai Porsi Klien Terbesar Anda.',
        impact: 'Sangat Tinggi',
        rev: -100, // dihitung dinamis
        cogs: -15, opex: 0, payroll: 0,
        advice: 'Genjot lini pemasaran outbound secepatnya. Batasi batas konsentrasi klien untuk masa depan (< 25% pembagian per klien) demi keamanan.',
        tag: 'RISIKO TINGGI'
      },
      {
        id: 'inflation_spiral',
        name: 'Stagflasi Biaya / Upah Karyawan',
        desc: 'Kenaikan biaya rekrutmen dan operasional pasar: total gaji naik +15% dan OpEx naik +20%.',
        impact: 'Sedang',
        rev: 5, cogs: 5, opex: 20, payroll: 15,
        advice: 'Optimalkan rasio efisiensi karyawan. Tangguhkan perekrutan non-prioritas, beralihlah ke otomatisasi alur kerja digital.',
        tag: 'MODERAT'
      }
    ],
    customPreset: 'Mode Kustom Interaktif',
    customPresetDesc: 'Sesuaikan variabel secara manual untuk menguji skenario stres keuangan Anda sendiri.',
    customReset: 'Reset ke Baseline'
  }
};

export const SimulationView: React.FC<Props> = ({ inputs, onLoadDemo, onEditInputs, lang, isDark }) => {
  const t = S_TEXT[lang];
  const [selectedPreset, setSelectedPreset] = useState<string>('black_swan');
  
  // Custom stress parameters
  const [customRev, setCustomRev] = useState(0);
  const [customCogs, setCustomCogs] = useState(0);
  const [customPayroll, setCustomPayroll] = useState(0);
  const [customOpex, setCustomOpex] = useState(0);

  // If no inputs, render beautiful call to action
  if (!inputs) {
    return (
      <div className={`max-w-4xl mx-auto my-12 p-8 rounded-2xl border text-center transition-colors duration-500 shadow-xl ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
          <Activity size={32} className="animate-pulse" />
        </div>
        <h2 className={`text-2xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.noInputsTitle}
        </h2>
        <p className={`text-sm max-w-lg mx-auto mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.noInputsDesc}
        </p>
        <button
          onClick={onLoadDemo}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <PlayCircle size={20} className="fill-white/10" />
          {t.loadDemoBtn}
        </button>
      </div>
    );
  }

  // Calculate baseline metrics
  const baselineResult = useMemo(() => {
    return calculateFinancialHealth(inputs, lang);
  }, [inputs, lang]);

  // Determine current adjustments
  const activePresetItem = t.presets.find(p => p.id === selectedPreset);
  
  // Client Concentration drop formula
  const calculatedClientLossRev = inputs.topClientShare > 0 
    ? -(inputs.topClientShare * 100)
    : -30; // fallback if 0

  const adjustments = useMemo(() => {
    if (selectedPreset === 'custom') {
      return { rev: customRev, cogs: customCogs, payroll: customPayroll, opex: customOpex };
    }
    if (selectedPreset === 'client_loss') {
      return { rev: calculatedClientLossRev, cogs: -15, opex: 0, payroll: 0 };
    }
    if (activePresetItem) {
      return { rev: activePresetItem.rev, cogs: activePresetItem.cogs, payroll: activePresetItem.payroll, opex: activePresetItem.opex };
    }
    return { rev: 0, cogs: 0, payroll: 0, opex: 0 };
  }, [selectedPreset, activePresetItem, customRev, customCogs, customPayroll, customOpex, calculatedClientLossRev]);

  // Compute stressed inputs & results
  const stressedInputs = useMemo((): FinancialInputs => {
    return {
      ...inputs,
      revenue: Math.max(0, inputs.revenue * (1 + adjustments.rev / 100)),
      cogs: Math.max(0, inputs.cogs * (1 + adjustments.cogs / 100)),
      payroll: Math.max(0, inputs.payroll * (1 + adjustments.payroll / 100)),
      opCosts: Math.max(0, inputs.opCosts * (1 + adjustments.opex / 100)),
    };
  }, [inputs, adjustments]);

  const stressedResult = useMemo(() => {
    return calculateFinancialHealth(stressedInputs, lang);
  }, [stressedInputs, lang]);

  // Change aggregates
  const scoreDiff = stressedResult.totalScore - baselineResult.totalScore;
  const originalRunway = baselineResult.metrics.runwayMonths;
  const stressedRunway = stressedResult.metrics.runwayMonths;

  // Gen 6 months projected balance burn comparison data
  const runwayChartData = useMemo(() => {
    const dataList = [];
    let baseCash = inputs.businessCashReserves > 0 ? inputs.businessCashReserves : inputs.cashAvailable;
    let stressedCash = inputs.businessCashReserves > 0 ? inputs.businessCashReserves : inputs.cashAvailable;
    
    // Monthly cashflow rates
    const baseFlow = baselineResult.metrics.netCashflow;
    const stressedFlow = stressedResult.metrics.netCashflow;

    for (let i = 1; i <= 6; i++) {
      baseCash = Math.max(0, baseCash + (baseFlow));
      stressedCash = Math.max(0, stressedCash + (stressedFlow));
      
      dataList.push({
        name: `${t.month} ${i}`,
        [t.baseline]: Math.round(baseCash / 1000000), // convert to Millions
        [t.stressed]: Math.round(stressedCash / 1000000),
      });
    }
    return dataList;
  }, [inputs, baselineResult, stressedResult, lang, t]);

  const handleResetCustom = () => {
    setCustomRev(0);
    setCustomCogs(0);
    setCustomPayroll(0);
    setCustomOpex(0);
  };

  return (
    <div className="max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 py-6 animate-in fade-in duration-500">
      
      {/* Title with Edit Inputs button */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <Zap className="text-yellow-500 fill-yellow-500 animate-pulse" size={30} />
            {t.title}
          </h1>
          <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.subtitle}
          </p>
        </div>

        {onEditInputs && (
          <button
            onClick={onEditInputs}
            className={`self-start md:self-center shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isDark 
                ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white' 
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
            }`}
          >
            <ArrowRight className="rotate-180 text-blue-500" size={14} />
            <span>{lang === 'id' ? 'Ubah Input Dasar' : 'Edit Baseline Inputs'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset Shocks selection and Slider Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset shock cards selector */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-lg font-bold mb-4 tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <CircleDot className="text-blue-500" size={18} />
              {t.selectScenario}
            </h2>

            <div className="space-y-3">
              {t.presets.map((p) => {
                const isActive = selectedPreset === p.id;
                let activeColor = isDark 
                  ? 'border-blue-500 bg-blue-950/25 ring-1 ring-blue-500/25' 
                  : 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-100';
                
                if (p.id === 'black_swan') {
                  activeColor = isDark 
                    ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500/20' 
                    : 'border-red-500 bg-red-50/50 ring-1 ring-red-100';
                }

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPreset(p.id)}
                    className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition-all transform hover:scale-[1.01] ${
                      isActive 
                        ? activeColor
                        : isDark 
                          ? 'border-slate-800 hover:border-slate-700 bg-slate-950/30 text-slate-300' 
                          : 'border-slate-200 hover:border-slate-350 bg-slate-50/30 text-slate-700'
                    }`}
                  >
                    <div className={`mt-1 p-1.5 rounded-lg ${
                      isActive 
                        ? p.id === 'black_swan' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                        : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.id === 'black_swan' ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{p.name}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          p.id === 'black_swan' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' 
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                        }`}>
                          {p.tag}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* Custom Selector button */}
              <button
                onClick={() => setSelectedPreset('custom')}
                className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition-all transform hover:scale-[1.01] ${
                  selectedPreset === 'custom'
                    ? isDark 
                      ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500/20' 
                      : 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-100'
                    : isDark 
                      ? 'border-slate-800 hover:border-slate-700 bg-slate-950/30' 
                      : 'border-slate-200 hover:border-slate-350 bg-slate-50/30'
                }`}
              >
                <div className={`mt-1 p-1.5 rounded-lg ${
                  selectedPreset === 'custom' ? 'bg-purple-600 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Sparkles size={16} />
                </div>
                <div className="flex-1">
                  <span className={`font-bold text-sm block mb-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.customPreset}</span>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.customPresetDesc}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Customize Controls: Show only when 'custom' selected */}
          <AnimatePresence>
            {selectedPreset === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`overflow-hidden p-6 rounded-2xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.customTitle}
                  </h3>
                  <button 
                    onClick={handleResetCustom}
                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-500 hover:text-purple-600 transition-colors"
                  >
                    <RefreshCw size={12} />
                    {t.customReset}
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Revenue friction */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Revenue Change</span>
                      <span className={customRev > 0 ? 'text-emerald-500' : customRev < 0 ? 'text-rose-500' : 'text-slate-400'}>
                        {customRev > 0 ? '+' : ''}{customRev}%
                      </span>
                    </div>
                    <input 
                      type="range" min="-80" max="60" step="5" value={customRev} onChange={e => setCustomRev(parseInt(e.target.value))}
                      className="w-full h-1.5 accent-purple-600 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* COGS friction */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>COGS Change</span>
                      <span className={customCogs > 0 ? 'text-rose-500' : customCogs < 0 ? 'text-emerald-500' : 'text-slate-400'}>
                        {customCogs > 0 ? '+' : ''}{customCogs}%
                      </span>
                    </div>
                    <input 
                      type="range" min="-50" max="80" step="5" value={customCogs} onChange={e => setCustomCogs(parseInt(e.target.value))}
                      className="w-full h-1.5 accent-purple-600 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Payroll friction */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Payroll Change</span>
                      <span className={customPayroll > 0 ? 'text-rose-500' : customPayroll < 0 ? 'text-emerald-500' : 'text-slate-400'}>
                        {customPayroll > 0 ? '+' : ''}{customPayroll}%
                      </span>
                    </div>
                    <input 
                      type="range" min="-50" max="60" step="5" value={customPayroll} onChange={e => setCustomPayroll(parseInt(e.target.value))}
                      className="w-full h-1.5 accent-purple-600 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* OpEx friction */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Operating Cost Change</span>
                      <span className={customOpex > 0 ? 'text-rose-500' : customOpex < 0 ? 'text-emerald-500' : 'text-slate-400'}>
                        {customOpex > 0 ? '+' : ''}{customOpex}%
                      </span>
                    </div>
                    <input 
                      type="range" min="-40" max="80" step="5" value={customOpex} onChange={e => setCustomOpex(parseInt(e.target.value))}
                      className="w-full h-1.5 accent-purple-600 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Comparative Metrics dashboard, projections and active advices */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main comparative score widget */}
          <div className={`p-6 rounded-2xl border relative overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`text-lg font-bold mb-6 tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Activity className="text-yellow-500" size={18} />
              {t.impactAnalysis}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score card */}
              <div className={`p-5 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">{t.scoreMetric}</span>
                  <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    scoreDiff >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {scoreDiff >= 0 ? '+' : ''}{scoreDiff}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black">{stressedResult.totalScore}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>

                  <span className={`text-[11px] font-extrabold uppercase tracking-widest block mt-2 ${
                    stressedResult.totalScore >= 80 ? 'text-emerald-500' : stressedResult.totalScore >= 50 ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {stressedResult.grade}
                  </span>
                </div>
              </div>

              {/* Runway card */}
              <div className={`p-5 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">{t.runwayMetric}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    stressedRunway >= originalRunway 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {stressedRunway >= 99 && originalRunway >= 99 
                      ? '0' 
                      : `${stressedRunway - originalRunway > 0 ? '+' : ''}${Math.round((stressedRunway - originalRunway) * 10) / 10}`
                    } Mo
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span id="stressed-runway-value" className="text-3xl font-black">
                      {stressedRunway >= 99 ? '∞' : Math.round(stressedRunway * 10) / 10}
                    </span>
                    <span className="text-xs text-slate-500">{lang === 'id' ? 'Bulan' : 'Months'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-2">
                    Baseline: {originalRunway >= 99 ? '∞' : Math.round(originalRunway * 10) / 10} Mo
                  </span>
                </div>
              </div>

              {/* Net Cashflow card */}
              <div className={`p-5 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">{t.cashflowMetric}</span>
                  <span className="text-[10px] text-slate-500">IDR/mo</span>
                </div>

                <div>
                  <div className={`text-xl font-black truncate ${
                    stressedResult.metrics.netCashflow >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {stressedResult.metrics.netCashflow.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
                  </div>
                  <span className="text-[10px] text-slate-450 block mt-2 truncate">
                    Baseline: {baselineResult.metrics.netCashflow.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Runway balance projections graph */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="mb-4">
              <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.projectedEffects}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.projectedEffectsDesc}</p>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={runwayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradientStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={10} tickLine={false} />
                  <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={10} tickLine={false} label={{ value: 'm IDR', angle: -90, position: 'insideLeft', fill: isDark ? "#64748b" : "#94a3b8", fontSize: 9 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      borderRadius: '8px', 
                      fontSize: '11px',
                      color: isDark ? '#ffffff' : '#000000'
                    }} 
                  />
                  <Area type="monotone" dataKey={t.baseline} stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#gradientBase)" />
                  <Area type="monotone" dataKey={t.stressed} stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#gradientStress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action directives for the current stress scenario */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-md font-extrabold tracking-tight mb-2 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              <ShieldCheck className="text-emerald-500" size={18} />
              {t.actionPlanTitle}
            </h3>
            <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.actionPlanDesc}</p>

            <div className={`p-4 rounded-xl border flex gap-3 leading-relaxed text-xs font-medium ${
              isDark ? 'bg-[#0f1424] border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-150 text-slate-600'
            }`}>
              <CircleDot className="text-blue-500 mt-1 flex-shrink-0" size={14} />
              <div>
                <span className={`font-bold block mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {selectedPreset === 'custom' ? t.customPreset : activePresetItem?.name} Advice:
                </span>
                {selectedPreset === 'custom' 
                  ? (scoreDiff >= 0 
                      ? (lang === 'id' ? 'Skenario Anda menguntungkan. Terus pantau margin kontribusi untuk memastikan keberlanjutan ekspansi.' : 'Your scenario is favorable. Monitor contribution margins continuously to maintain sustainable growth.')
                      : (lang === 'id' ? 'Risiko terpantau meningkat. Prioritaskan pembentukan kas cadangan likuid dan tinjau ulang struktur biaya tidak tetap.' : 'Stress risk is mounting. Prioritize liquid cash reserves accumulation and revisit variable pricing mechanisms.'))
                  : activePresetItem?.advice
                }
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SimulationView;
