import React, { useState, useMemo } from 'react';
import { CalculationResult, SubScore, FinancialInputs, HistoryEntry, Language, ActionItem } from '../types';
import { calculateFinancialHealth } from '../services/calculator';
import { TEXT } from '../services/translations';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, ReferenceLine, Cell
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, TrendingDown, TrendingUp, AlertOctagon, Printer, 
  Sliders, ArrowRight, History, Clock, CheckSquare, Zap, Calendar, Flag, RotateCcw, Layers,
  ChevronRight, BrainCircuit, ShieldAlert, Sparkles, HelpCircle, FileSpreadsheet, LayoutDashboard, Settings
} from 'lucide-react';

interface Props {
  results: CalculationResult;
  inputs: FinancialInputs;
  history: HistoryEntry[];
  onPrint: () => void;
  lang: Language;
  isDark: boolean;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  checkedSteps: Record<string, boolean>;
  onToggleStep: (stepKey: string) => void;
}

// 1. Custom SVG Circular/Radial Gauge 
const HealthGauge = ({ score, grade, isDark, lang }: { score: number; grade: string; isDark: boolean; lang: Language }) => {
  const radius = 72;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getGradientId = (s: number) => {
    if (s >= 80) return 'emeraldGlow';
    if (s >= 65) return 'blueGlow';
    if (s >= 50) return 'amberGlow';
    return 'roseGlow';
  };

  const getTierName = (s: number) => {
    if (s >= 80) return lang === 'id' ? 'Sangat Sehat' : 'Excellent';
    if (s >= 65) return lang === 'id' ? 'Stabil & Sehat' : 'Healthy';
    if (s >= 50) return lang === 'id' ? 'Perlu Perhatian' : 'Warning';
    return lang === 'id' ? 'Beresiko Tinggi' : 'Critical Threat';
  };

  const getTextColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 65) return 'text-blue-500';
    if (s >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-4 w-full">
      <div className="absolute inset-0 bg-blue-500/3 dark:bg-blue-500/1 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 absolute inset-0 z-10">
          {/* Background track circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="transparent"
            stroke={isDark ? '#1e293b' : '#f1f5f9'}
            strokeWidth={strokeWidth}
          />
          {/* Fill track circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="transparent"
            stroke={`url(#${getGradientId(score)})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="roseGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Floating Center Badge Score */}
        <div className="absolute flex flex-col items-center justify-center text-center z-20">
          <span className={`text-4xl md:text-5xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {Math.round(score)}
          </span>
          <span className="text-[10px] font-bold text-slate-450 mt-1 uppercase tracking-wider">
            Score Level
          </span>
          <div className={`mt-2.5 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm border ${
            score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
            score >= 65 ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
            score >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
          }`}>
            <span>Grade {grade}</span>
          </div>
        </div>
      </div>

      <span className={`text-xs font-bold ${getTextColor(score)} uppercase tracking-widest mt-4`}>
        {getTierName(score)}
      </span>
    </div>
  );
};

// 2. Metric ScoreCard Component
const ScoreCard = ({ subScore, isDark }: { subScore: SubScore; isDark: boolean }) => {
  const colors = {
    critical: isDark ? 'bg-rose-950/20 text-rose-400 border-rose-900/50' : 'bg-rose-50 text-rose-700 border-rose-200',
    warning: isDark ? 'bg-amber-950/20 text-amber-400 border-amber-900/50' : 'bg-amber-50 text-amber-700 border-amber-200',
    healthy: isDark ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    excellent: isDark ? 'bg-blue-950/20 text-blue-450 border-blue-900/50' : 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const icons = {
    critical: <AlertOctagon size={18} className="text-rose-500 animate-bounce" />,
    warning: <AlertTriangle size={18} className="text-amber-500" />,
    healthy: <CheckCircle size={18} className="text-emerald-500" />,
    excellent: <TrendingUp size={18} className="text-blue-500" />,
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical': return 'CRITICAL';
      case 'warning': return 'WARNING';
      case 'healthy': return 'HEALTHY';
      default: return 'EXCELLENT';
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between h-full ${
      isDark ? 'bg-slate-900/40 border-slate-850 hover:bg-slate-900/60' : 'bg-white border-slate-200 shadow-sm shadow-slate-100 hover:shadow-md'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {subScore.label}
          </span>
          <div className="shrink-0">
            {icons[subScore.status]}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-2.5">
          <span className={`text-xl md:text-2xl font-black tracking-tight break-words ${isDark ? 'text-white' : 'text-slate-900'}`} title={subScore.valueDisplay}>
            {subScore.valueDisplay}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
              subScore.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
              subScore.score >= 65 ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
              subScore.score >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}>
              Score: {subScore.score}
            </span>
          </div>
        </div>

        <p className={`text-xs mt-2.5 leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {subScore.description}
        </p>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-800/10 dark:border-slate-200/5">
        <div className="flex justify-between items-center text-[9px] font-black tracking-widest uppercase mb-1 text-slate-450">
          <span>Tier Progress</span>
          <span className={subScore.score >= 75 ? 'text-emerald-500' : subScore.score >= 50 ? 'text-amber-500' : 'text-rose-500'}>
            {getStatusLabel(subScore.status)}
          </span>
        </div>
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div 
            className={`h-full transition-all duration-1000 ${
              subScore.status === 'excellent' ? 'bg-blue-500' :
              subScore.status === 'healthy' ? 'bg-emerald-500' :
              subScore.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
            }`} 
            style={{ width: `${subScore.score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// 3. Scenario Comparative Simulator Component
const ScenarioSimulator = ({ initialInputs, baselineScore, baselineRunway, lang, isDark, showToast }: { initialInputs: FinancialInputs, baselineScore: number, baselineRunway: number, lang: Language; isDark: boolean; showToast: (message: string, type?: 'info' | 'success' | 'warning') => void }) => {
  const t = TEXT[lang];
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');
  const [scenarioA, setScenarioA] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd_scenario_a');
      return saved ? JSON.parse(saved) : { revenue: 0, cogs: 0, payroll: 0, opEx: 0 };
    }
    return { revenue: 0, cogs: 0, payroll: 0, opEx: 0 };
  });
  const [scenarioB, setScenarioB] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fhd_scenario_b');
      return saved ? JSON.parse(saved) : { revenue: 0, cogs: 0, payroll: 0, opEx: 0 };
    }
    return { revenue: 0, cogs: 0, payroll: 0, opEx: 0 };
  });

  React.useEffect(() => {
    localStorage.setItem('fhd_scenario_a', JSON.stringify(scenarioA));
  }, [scenarioA]);

  React.useEffect(() => {
    localStorage.setItem('fhd_scenario_b', JSON.stringify(scenarioB));
  }, [scenarioB]);

  const handleReset = () => {
    const fresh = { revenue: 0, cogs: 0, payroll: 0, opEx: 0 };
    setScenarioA(fresh);
    setScenarioB(fresh);
    showToast(lang === 'id' ? 'Model skenario perbandingan diatur ulang!' : 'Scenario forecast models reset!', 'info');
  };

  const updateScenario = (field: string, value: number) => {
    if (activeTab === 'A') {
      setScenarioA(prev => ({ ...prev, [field]: value }));
    } else {
      setScenarioB(prev => ({ ...prev, [field]: value }));
    }
  };

  const getSimulatedResults = (adjustments: typeof scenarioA) => {
    const simulatedInputs: FinancialInputs = {
      ...initialInputs,
      revenue: initialInputs.revenue * (1 + adjustments.revenue / 100),
      cogs: initialInputs.cogs * (1 + adjustments.cogs / 100),
      payroll: initialInputs.payroll * (1 + adjustments.payroll / 100),
      opCosts: initialInputs.opCosts * (1 + adjustments.opEx / 100),
    };
    return calculateFinancialHealth(simulatedInputs, lang);
  };

  const resultsA = useMemo(() => getSimulatedResults(scenarioA), [initialInputs, scenarioA, lang]);
  const resultsB = useMemo(() => getSimulatedResults(scenarioB), [initialInputs, scenarioB, lang]);

  const SliderControl = ({ label, value, onChange, colorClass }: { label: string, value: number, onChange: (val: number) => void, colorClass: string }) => (
    <div className={`p-4.5 rounded-xl border ${
      isDark ? 'bg-slate-900/10 border-slate-850' : 'bg-slate-50/50 border-slate-150'
    }`}>
      <div className="flex justify-between items-center mb-2.5">
        <label className={`text-xs font-bold leading-none ${isDark ? 'text-slate-300' : 'text-slate-705'}`}>{label}</label>
        <span className={`text-xs font-black ${
          value > 0 ? 'text-emerald-500' : value < 0 ? 'text-rose-500' : 'text-slate-400'
        }`}>
          {value > 0 ? '+' : ''}{value}%
        </span>
      </div>
      <input 
        type="range" 
        min="-50" 
        max="50" 
        step="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer ${colorClass}`}
      />
      <div className="flex justify-between text-[9px] text-slate-450 font-bold mt-1.5 uppercase tracking-widest">
        <span>-50%</span>
        <span>0%</span>
        <span>+50%</span>
      </div>
    </div>
  );

  const currentAdjustments = activeTab === 'A' ? scenarioA : scenarioB;

  return (
    <div className={`rounded-3xl border p-6 md:p-8 shadow-xl relative overflow-hidden ${
      isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.scenarioSimulator}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Simulate comparative adjustments to project score updates
            </p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className={`text-xs flex items-center gap-2 px-3.5 py-2 border rounded-xl font-bold transition-all cursor-pointer ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white' 
              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
          }`}
        >
          <RotateCcw size={13} /> Reset Simulated Models
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Tab Switcher */}
          <div className={`flex p-1 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50 border-slate-200'
          }`}>
            <button 
              onClick={() => setActiveTab('A')}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'A' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-450 hover:text-slate-300'
              }`}
            >
              Scenario A Model
            </button>
            <button 
              onClick={() => setActiveTab('B')}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'B' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-450 hover:text-slate-300'
              }`}
            >
              Scenario B Model
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SliderControl 
              label={t.revenueAdj} 
              value={currentAdjustments.revenue} 
              onChange={(v) => updateScenario('revenue', v)} 
              colorClass={activeTab === 'A' ? "accent-blue-600" : "accent-indigo-600"}
            />
            <SliderControl 
              label={t.cogsAdj} 
              value={currentAdjustments.cogs} 
              onChange={(v) => updateScenario('cogs', v)} 
              colorClass={activeTab === 'A' ? "accent-blue-600" : "accent-indigo-600"}
            />
            <SliderControl 
              label={t.payrollAdj} 
              value={currentAdjustments.payroll} 
              onChange={(v) => updateScenario('payroll', v)} 
              colorClass={activeTab === 'A' ? "accent-blue-600" : "accent-indigo-600"}
            />
            <SliderControl 
              label={t.opexAdj} 
              value={currentAdjustments.opEx} 
              onChange={(v) => updateScenario('opEx', v)} 
              colorClass={activeTab === 'A' ? "accent-blue-600" : "accent-indigo-600"}
            />
          </div>
        </div>

        {/* Results Comparison Column */}
        <div className="lg:col-span-7">
          <div className={`rounded-2xl border overflow-hidden h-full flex flex-col justify-between ${
            isDark ? 'bg-slate-900/10 border-slate-850' : 'bg-slate-50/20 border-slate-150'
          }`}>
            <div className={`px-5 py-3 border-b flex items-center gap-2 ${
              isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50 border-slate-150'
            }`}>
              <Layers size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Comparative Forecast Analysis
              </span>
            </div>
            
            <div className="overflow-x-auto text-xs font-bold">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] font-black uppercase tracking-wider text-slate-450 ${
                    isDark ? 'border-slate-850 bg-slate-950/40' : 'border-slate-150 bg-slate-50'
                  }`}>
                    <th className="p-4">Key Metric Index</th>
                    <th className="p-4 text-right">Baseline</th>
                    <th className="p-4 text-right text-blue-550">Scenario A</th>
                    <th className="p-4 text-right text-indigo-505">Scenario B</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-850/50' : 'divide-slate-150'}`}>
                  <tr>
                    <td className={`p-4 font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total Score</td>
                    <td className="p-4 text-right font-mono font-semibold">{Math.round(baselineScore)}</td>
                    <td className="p-4 text-right font-mono font-black text-blue-500">
                      {Math.round(resultsA.totalScore)}
                      <span className={`text-[10px] ml-1.5 font-bold ${resultsA.totalScore >= baselineScore ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {resultsA.totalScore >= baselineScore ? '↑' : '↓'}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-black text-indigo-500">
                      {Math.round(resultsB.totalScore)}
                      <span className={`text-[10px] ml-1.5 font-bold ${resultsB.totalScore >= baselineScore ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {resultsB.totalScore >= baselineScore ? '↑' : '↓'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className={`p-4 font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Runway Length</td>
                    <td className="p-4 text-right font-mono font-semibold">
                      {baselineRunway >= 99 ? '∞' : `${baselineRunway.toFixed(1)} ${lang === 'id' ? 'bln' : 'mo'}`}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-blue-500">
                      {resultsA.metrics.runwayMonths >= 99 ? '∞' : `${resultsA.metrics.runwayMonths.toFixed(1)} ${lang === 'id' ? 'bln' : 'mo'}`}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-indigo-500">
                      {resultsB.metrics.runwayMonths >= 99 ? '∞' : `${resultsB.metrics.runwayMonths.toFixed(1)} ${lang === 'id' ? 'bln' : 'mo'}`}
                    </td>
                  </tr>
                  <tr>
                    <td className={`p-4 font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Net Cashflow</td>
                    <td className="p-4 text-right font-mono font-semibold text-[11px]">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', compactDisplay: 'short' }).format(initialInputs.monthlyIncome - initialInputs.monthlyExpenses)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-blue-500 text-[11px] animate-pulse">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', compactDisplay: 'short' }).format(resultsA.metrics.netCashflow)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-indigo-505 text-[11px]">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact', compactDisplay: 'short' }).format(resultsB.metrics.netCashflow)}
                    </td>
                  </tr>
                  <tr>
                    <td className={`p-4 font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Forecast Grade</td>
                    <td className="p-4 text-right font-extrabold text-xs">{resultsA.grade /* approximate baseline grade */}</td>
                    <td className="p-4 text-right font-black text-blue-500">{resultsA.grade}</td>
                    <td className="p-4 text-right font-black text-indigo-505">{resultsB.grade}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="p-4 text-[9px] text-slate-500 font-medium leading-normal border-t dark:border-slate-850">
              {t.scenarioNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Historical Trends Component
const HistoricalTrends = ({ history, lang, isDark }: { history: HistoryEntry[], lang: Language; isDark: boolean }) => {
  if (history.length < 2) {
    return (
      <div className={`rounded-3xl border p-12 text-center shadow-xl ${
        isDark ? 'bg-slate-950/50 border-slate-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
          <History size={32} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {lang === 'id' ? 'Belum Ada Cukup Data' : 'Not Enough Data Yet'}
        </h3>
        <p className={`max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {lang === 'id' 
            ? 'Kami membutuhkan setidaknya 2 riwayat diagnostik untuk dapat menampilkan tren historis. Lakukan diagnostik lagi di masa depan untuk melihat perkembangannya.'
            : 'We need at least 2 diagnostic records to show historical trends. Run another diagnostic in the future to see your progress.'}
        </p>
      </div>
    );
  }
  const t = TEXT[lang];

  const data = history.slice(-20).map(h => ({
    ...h,
    dateStr: new Date(h.timestamp).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short' }),
    timeStr: new Date(h.timestamp).toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-GB', { hour: '2-digit', minute: '2-digit' }),
    cashflowDisplay: h.netCashflow / 1000000, 
    runwayChartValue: h.runwayMonths > 24 ? 24 : h.runwayMonths
  }));

  return (
    <div className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
      isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl">
          <History size={20} />
        </div>
        <div>
          <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-905'}`}>
            {t.historicalTrends}
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Historical diagnostic comparison trails</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Trend */}
        <div className={`p-4 rounded-2xl border h-64 ${
          isDark ? 'bg-slate-900/30 border-slate-850' : 'bg-slate-50 border-slate-150'
        }`}>
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
            Diagnostic Health Score Trail
          </h4>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#e2e8f0"} />
              <XAxis dataKey="dateStr" tick={{fontSize: 9, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#020617' : '#ffffff',
                  border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}
                labelFormatter={(label, payload) => payload[0]?.payload?.timeStr ? `${label} ${payload[0].payload.timeStr}` : label}
              />
              <Area type="monotone" dataKey="totalScore" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cashflow Trend */}
        <div className={`p-4 rounded-2xl border h-64 ${
          isDark ? 'bg-slate-900/30 border-slate-850' : 'bg-slate-50 border-slate-150'
        }`}>
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
            Net Monthly Cashflow (Mill IDR)
          </h4>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#e2e8f0"} />
              <XAxis dataKey="dateStr" tick={{fontSize: 9, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} width={25} />
              <Tooltip 
                formatter={(val: number) => `Rp ${val.toFixed(1)} jt`}
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#020617' : '#ffffff',
                  border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}
                labelFormatter={(label, payload) => payload[0]?.payload?.timeStr ? `${label} ${payload[0].payload.timeStr}` : label}
              />
              <ReferenceLine y={0} stroke={isDark ? "#475569" : "#cbd5e1"} />
              <Bar dataKey="cashflowDisplay" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.netCashflow >= 0 ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Runway Trend */}
        <div className={`p-4 rounded-2xl border h-64 ${
          isDark ? 'bg-slate-900/30 border-slate-850' : 'bg-slate-50 border-slate-150'
        }`}>
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
            Corporate Operating Runway (Months)
          </h4>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRunway" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#e2e8f0"} />
              <XAxis dataKey="dateStr" tick={{fontSize: 9, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} width={25} />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => {
                  const val = props?.payload?.runwayMonths;
                  return val >= 999 ? "Infinite" : `${val?.toFixed(1)} mo`;
                }}
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#020617' : '#ffffff',
                  border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}
                labelFormatter={(label, payload) => payload[0]?.payload?.timeStr ? `${label} ${payload[0].payload.timeStr}` : label}
              />
              <Area type="monotone" dataKey="runwayChartValue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRunway)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 5. Intelligent AI Recommendation Copilot Card Component
const AICopilotCard = ({ score, grade, results, isDark, lang }: { score: number, grade: string, results: CalculationResult, isDark: boolean, lang: Language }) => {
  const dynamicAdvice = useMemo(() => {
    const issues: string[] = [];
    
    if (results.metrics.netCashflow < 0) {
      issues.push(lang === 'id' 
        ? 'Arus kas pribadi rumah tangga mengalami defisit. Fokus utama wajib ditekankan pada penghematan pengeluaran atau diversifikasi pemasukan.'
        : 'Household cashflow shows a deficit. Core focus must be placed on reducing operational expenditures or diversifying family income streams.');
    }
    if (results.metrics.dsrRatio > 0.4) {
      issues.push(lang === 'id'
        ? 'Rasio Utang (DSR) berada di zona merah (>40%). Sangat direkomendasikan melakukan renegosiasi suku bunga atau pembatasan cicilan tambahan.'
        : 'Debt Service Ratio (DSR) is above safe 40% boundaries. Restructuring debt options or freezing additional credit pipelines is highly advised.');
    }
    if (results.metrics.runwayMonths < 6) {
      issues.push(lang === 'id'
        ? 'Runway cadangan bisnis berada di bawah batas ketahanan 6 bulan. Segera amankan modal kerja tambahan atau pangkas biaya tetap non-esensial.'
        : 'Business current liquid runway spans under 6 critical months. Secure intermediate bridge-debts or suspend capital spending.');
    }
    if (results.metrics.currentRatio < 1.2) {
      issues.push(lang === 'id'
        ? 'Likuiditas jangka pendek korporasi (Current Ratio) sangat rendah. Anda beresiko kesulitan membayar utang lancar dalam 12 bulan ke depan.'
        : 'Short term corporate liquidity (Current Ratio) is compressed. High risk of liquidity crunch when bills/short debts mature.');
    }

    if (issues.length === 0) {
      return lang === 'id'
        ? 'Analisis algoritma GAAP menunjukkan koordinat keuangan Anda berada dalam performa prima di seluruh lini dasar. Pertahankan struktur rasio cadangan saat ini dan pertimbangkan ekspansi investasi strategis.'
        : 'GAAP algorithmic metrics evaluate your corporate and family finances in solid alignment. Maintain current reserve structures and prepare capital deployments for strategic expansion.';
    }

    return issues.join(' ');
  }, [results, lang]);

  return (
    <div className={`p-6 rounded-3xl border relative overflow-hidden ${
      isDark 
        ? 'bg-slate-950/40 border-indigo-500/20 shadow-indigo-500/5 shadow-xl' 
        : 'bg-indigo-50/10 border-indigo-200/50 shadow-sm shadow-indigo-50'
    }`}>
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-lg">
            <BrainCircuit size={15} />
          </div>
          <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
            FHD Audit Intelligence Copilot
          </span>
        </div>
        <span className="flex items-center gap-1 text-[8px] font-extrabold text-emerald-500 bg-emerald-550/10 px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span>Real-time Active</span>
        </span>
      </div>

      <h4 className={`text-sm font-black mb-2 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {lang === 'id' ? `Hasil Diagnosa Utama - Grade ${grade}` : `Executive Strategy Assessment - Grade ${grade}`}
      </h4>

      <p className={`text-xs leading-relaxed font-semibold relative z-10 ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
        {dynamicAdvice}
      </p>

      {score < 65 && (
        <div className="flex items-center gap-2 mt-4 text-[9px] text-rose-455 font-black uppercase tracking-widest relative z-10 bg-rose-500/5 p-2 rounded-xl border border-rose-500/10 w-fit">
          <ShieldAlert size={12} className="text-rose-500 shrink-0" />
          <span>Immediate Priority Actions Detected below</span>
        </div>
      )}
    </div>
  );
};

// 6. Heatmap Dashboard Risk Summary Column
const RiskHeatmap = ({ results, lang, isDark }: { results: CalculationResult, lang: Language, isDark: boolean }) => {
  const { subScores } = results;

  const categories = useMemo(() => {
    const list = [
      { key: 'cfh', ...subScores.cfh, desc: lang === 'id' ? 'Arus Kas Rumah Tangga' : 'Household Net Cashflow' },
      { key: 'dsr', ...subScores.dsr, desc: lang === 'id' ? 'Rasio Utang Keluarga' : 'Family Debt Servicing' },
      { key: 'efc', ...subScores.efc, desc: lang === 'id' ? 'Cakupan Kas Darurat' : 'Emergency Liquid Cash' },
      { key: 'runway', ...subScores.runway, desc: lang === 'id' ? 'Ketahanan Runway Bisnis' : 'Operating Business Runway' },
      { key: 'profitability', ...subScores.profitability, desc: lang === 'id' ? 'Margin Bersih Bisnis' : 'Corporate Net Margins' },
      { key: 'payroll', ...subScores.payroll, desc: lang === 'id' ? 'Efisiensi Upah Karyawan' : 'Payroll Capital Efficiency' },
      { key: 'liquidity', ...subScores.liquidity, desc: lang === 'id' ? 'Rasio Lancar Jangka Pendek' : 'Asset Solvency (Current Ratio)' },
    ];

    return {
      highAlert: list.filter(item => item.score < 50),
      caution: list.filter(item => item.score >= 50 && item.score < 75),
      fullyOptimized: list.filter(item => item.score >= 75),
    };
  }, [subScores, lang]);

  return (
    <div className={`p-6 rounded-3xl border ${
      isDark ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50/20 border-slate-150'
    }`}>
      <div className="mb-5">
        <h4 className={`text-sm font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <LayoutDashboard size={16} className="text-blue-500" />
          <span>Metric Risk Categorization</span>
        </h4>
        <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wide mt-0.5">Heatmap channels based on deterministic scores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: Critical Threat */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
          isDark ? 'bg-slate-900/10 border-rose-500/10' : 'bg-rose-50/10 border-rose-500/10'
        }`}>
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
            <span>High Alert ({categories.highAlert.length})</span>
          </span>
          <div className="flex flex-col gap-2">
            {categories.highAlert.length === 0 ? (
              <span className="text-[10px] font-extrabold text-slate-450 uppercase py-2">No critical risks</span>
            ) : (
              categories.highAlert.map(item => (
                <div key={item.key} className={`p-2.5 rounded-xl border text-xs font-bold flex justify-between items-center ${
                  isDark ? 'bg-rose-950/10 border-rose-900/30 text-rose-350' : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}>
                  <span className="truncate">{item.desc}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500">{item.score}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Caution */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
          isDark ? 'bg-slate-900/10 border-amber-500/10' : 'bg-amber-50/10 border-amber-500/10'
        }`}>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            <span>Caution ({categories.caution.length})</span>
          </span>
          <div className="flex flex-col gap-2">
            {categories.caution.length === 0 ? (
              <span className="text-[10px] font-extrabold text-slate-450 uppercase py-2">No active warnings</span>
            ) : (
              categories.caution.map(item => (
                <div key={item.key} className={`p-2.5 rounded-xl border text-xs font-bold flex justify-between items-center ${
                  isDark ? 'bg-amber-950/10 border-amber-900/30 text-amber-300 animate-pulse' : 'bg-amber-50 border-amber-100 text-amber-700'
                }`}>
                  <span className="truncate">{item.desc}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">{item.score}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Safe Channels */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
          isDark ? 'bg-slate-900/10 border-emerald-500/10' : 'bg-emerald-50/10 border-emerald-500/10'
        }`}>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>Sufficient ({categories.fullyOptimized.length})</span>
          </span>
          <div className="flex flex-col gap-2">
            {categories.fullyOptimized.length === 0 ? (
              <span className="text-[10px] font-extrabold text-slate-450 uppercase py-2">No optimized channels yet</span>
            ) : (
              categories.fullyOptimized.map(item => (
                <div key={item.key} className={`p-2.5 rounded-xl border text-xs font-bold flex justify-between items-center ${
                  isDark ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                  <span className="truncate">{item.desc}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">{item.score}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const Dashboard: React.FC<Props> = ({ results, inputs, history, onPrint, lang, isDark, showToast, checkedSteps, onToggleStep }) => {
  const t = TEXT[lang];
  const { totalScore, grade, subScores } = results;
  const [activeSegment, setActiveSegment] = useState<'overview' | 'scenario' | 'trends'>('overview');
  const handleToggleStep = onToggleStep;
  
  const gradeColors = {
    'A': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'B': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'C': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'D': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'E': 'text-rose-500 bg-rose-500/10 border-rose-505/20',
  };

  const radarData = [
    { subject: 'Cashflow', A: subScores.cfh.score, fullMark: 100 },
    { subject: 'Debt Service', A: subScores.dsr.score, fullMark: 100 },
    { subject: 'Emergency', A: subScores.efc.score, fullMark: 100 },
    { subject: 'Runway', A: subScores.runway.score, fullMark: 100 },
    { subject: 'Profit Ratio', A: subScores.profitability.score, fullMark: 100 },
    { subject: 'Payroll Cap', A: subScores.payroll.score, fullMark: 100 },
    { subject: 'Liquidity', A: subScores.liquidity.score, fullMark: 100 },
  ];

  const getEffortColor = (effort: string) => {
    const e = effort.toLowerCase();
    if (e.includes('high') || e.includes('urgent') || e.includes('critical') || e.includes('tinggi') || e.includes('mendesak') || e.includes('kritis')) return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    if (e.includes('medium') || e.includes('sedang')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };
  
  const getPriorityColor = (priorityCode: string | undefined) => {
      if (priorityCode === 'immediate') return 'bg-rose-500/10 text-rose-500 border-rose-500/25';
      if (priorityCode === 'short') return 'bg-amber-500/10 text-amber-500 border-amber-500/25';
      return 'bg-blue-500/10 text-blue-500 border-blue-500/25';
  }

  const getPriorityIcon = (priorityCode: string | undefined) => {
      if (priorityCode === 'immediate') return <Zap size={13} className="fill-current animate-pulse text-rose-500" />;
      if (priorityCode === 'short') return <Calendar size={13} className="text-amber-500" />;
      return <Flag size={13} className="text-blue-500" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 select-none">
      
      {/* 1. Sleek Tab Navigation for Dashboard Panels */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800/10 dark:border-slate-200/5 pb-5">
        <div className={`flex p-1 rounded-2xl border transition-all duration-300 ${
          isDark 
            ? 'bg-slate-950 border-slate-800/80 shadow-inner' 
            : 'bg-slate-100/90 border-slate-200/80 shadow-sm'
        }`}>
          <button
            onClick={() => {
              setActiveSegment('overview');
              showToast(lang === 'id' ? 'Dasbor Utama Aktif' : 'Diagnostics Hub Active', 'info');
            }}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
              activeSegment === 'overview'
                ? isDark 
                  ? 'bg-slate-900 text-white border-slate-700/40 shadow-sm' 
                  : 'bg-white text-slate-900 border-slate-200 shadow-sm'
                : isDark
                  ? 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/20'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Diagnostics Hub</span>
          </button>
          
          <button
            onClick={() => {
              setActiveSegment('scenario');
              showToast(lang === 'id' ? 'Modeler Skenario Aktif' : 'Scenario Modeler Active', 'info');
            }}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
              activeSegment === 'scenario'
                ? isDark 
                  ? 'bg-slate-900 text-white border-slate-700/40 shadow-sm' 
                  : 'bg-white text-slate-900 border-slate-200 shadow-sm'
                : isDark
                  ? 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/20'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Sliders size={14} />
            <span>Scenario Modeler</span>
          </button>
          
          <button
            onClick={() => {
              setActiveSegment('trends');
              showToast(lang === 'id' ? 'Jejak Diagnostik Aktif' : 'Diagnostic Trails Active', 'info');
            }}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
              activeSegment === 'trends'
                ? isDark 
                  ? 'bg-slate-900 text-white border-slate-700/40 shadow-sm' 
                  : 'bg-white text-slate-900 border-slate-200 shadow-sm'
                : isDark
                  ? 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/20'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <History size={14} />
            <span>Diagnostic Trails</span>
          </button>
        </div>

        {/* Quick action printing */}
        <button 
          onClick={onPrint}
          className={`px-4 py-2 text-xs border rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer self-end sm:self-auto ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white' 
              : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <Printer size={13} />
          <span>Export Summary (PDF)</span>
        </button>
      </div>

      {activeSegment === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
          
          {/* Main Visual Panels: Circular Gauge + Recharts Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Health Gauge Indicator Card */}
            <div className={`lg:col-span-4 p-6 md:p-8 rounded-3xl border flex flex-col items-center justify-center relative overflow-hidden text-center h-full ${
              isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
            }`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
              <span className={`text-[11px] font-black uppercase tracking-widest leading-none mb-3 ${isDark ? 'text-slate-450' : 'text-slate-400'}`}>
                {t.scoreTitle}
              </span>
              
              <HealthGauge score={totalScore} grade={grade} isDark={isDark} lang={lang} />
            </div>

            {/* Radar Balance Visualizer Card */}
            <div className={`lg:col-span-8 p-6 md:p-8 rounded-3xl border flex flex-col min-h-[300px] h-full ${
              isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200 shadow-xl shadow-slate-100/50'
            }`}>
              <div className="mb-4">
                <span className={`text-[11px] font-black uppercase tracking-widest leading-none ${isDark ? 'text-slate-450' : 'text-slate-400'}`}>
                  {t.metricBalance}
                </span>
                <p className="text-xs text-slate-400/80 font-bold mt-1 uppercase tracking-wider">Algorithmic Balance Audit Distribution Map</p>
              </div>

              <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Score Distribution"
                      dataKey="A"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fill="#3b82f6"
                      fillOpacity={0.16}
                    />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: isDark ? '#020617' : '#ffffff',
                        border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Core Intelligence Copilot & Risk Summary channels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AICopilotCard score={totalScore} grade={grade} results={results} isDark={isDark} lang={lang} />
            <RiskHeatmap results={results} lang={lang} isDark={isDark} />
          </div>

          {/* Detailed Category Scorecards breakdown */}
          <div>
            <h3 className={`text-base font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? 'text-slate-305' : 'text-slate-800'}`}>
              <TrendingDown className="text-blue-500" size={18} /> 
              <span>{t.diagnosticBreakdown}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <ScoreCard subScore={subScores.cfh} isDark={isDark} />
              <ScoreCard subScore={subScores.dsr} isDark={isDark} />
              <ScoreCard subScore={subScores.efc} isDark={isDark} />
              <ScoreCard subScore={subScores.runway} isDark={isDark} />
              <ScoreCard subScore={subScores.profitability} isDark={isDark} />
              <ScoreCard subScore={subScores.payroll} isDark={isDark} />
              <ScoreCard subScore={subScores.liquidity} isDark={isDark} />
            </div>
          </div>

          {/* Execution Strategy list */}
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${
            isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-6 md:p-8 flex items-center gap-3 border-b border-dashed ${
              isDark ? 'bg-slate-900/40 border-slate-850 text-white' : 'bg-slate-50 border-slate-150 text-slate-800'
            }`}>
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                <BrainCircuit size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  {t.actionPlan}
                </h3>
                <p className="text-slate-450 text-xs font-semibold mt-0.5">{t.actionPlanDesc}</p>
              </div>
            </div>

            <div className={`divide-y ${isDark ? 'divide-slate-850/50' : 'divide-slate-150'}`}>
              {results.actionPlan.length > 0 ? (
                results.actionPlan.map((action, idx) => (
                  <div key={idx} className={`p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-start hover:bg-slate-50/10 dark:hover:bg-slate-900/10 transition-colors`}>
                    
                    <div className={`
                      shrink-0 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border shadow-sm
                      ${getPriorityColor(action.priorityCode)}
                    `}>
                      {getPriorityIcon(action.priorityCode)}
                      <span>{action.priority}</span>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-black text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{action.title}</h4>
                          <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>{action.description}</p>
                        </div>
                        {action.effort && (
                          <div className={`hidden md:flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getEffortColor(action.effort)}`}>
                            <Clock size={12} />
                            <span>Effort: {action.effort}</span>
                          </div>
                        )}
                      </div>

                      {action.effort && (
                        <div className={`md:hidden flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border w-fit mb-4 ${getEffortColor(action.effort)}`}>
                          <Clock size={12} />
                          <span>Effort: {action.effort}</span>
                        </div>
                      )}

                      {action.steps && action.steps.length > 0 && (
                        <div className={`rounded-2xl p-5 border shadow-sm ${
                          isDark ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/60 border-slate-150'
                        }`}>
                          <h5 className="text-[10px] font-black uppercase text-slate-450 mb-3.5 flex items-center gap-2 tracking-widest">
                            <CheckSquare size={13} className="text-blue-500" /> {t.executionChecklist}
                          </h5>
                          <ul className="space-y-3.5">
                            {action.steps.map((step, stepIdx) => {
                              const stepKey = `action-${idx}-step-${stepIdx}`;
                              const isChecked = !!checkedSteps[stepKey];
                              return (
                                <li 
                                  key={stepIdx} 
                                  onClick={() => handleToggleStep(stepKey)}
                                  className="flex items-start gap-3.5 text-xs font-bold leading-relaxed group cursor-pointer"
                                >
                                  <div className={`mt-0.5 w-5 h-5 rounded-lg border shrink-0 flex items-center justify-center transition-all ${
                                    isChecked
                                      ? 'bg-blue-600/10 border-blue-500 shadow-sm shadow-blue-500/10'
                                      : isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-300'
                                  }`}>
                                    <div className={`w-2.5 h-2.5 rounded bg-blue-600 transition-all duration-200 ${
                                      isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-40'
                                    }`} />
                                  </div>
                                  <span className={`transition-all select-none ${
                                    isChecked 
                                      ? 'line-through text-slate-400 dark:text-slate-500' 
                                      : isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-650 group-hover:text-slate-900'
                                  }`}>
                                    {step}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <CheckCircle className="mx-auto mb-3 text-emerald-500" size={32} />
                  <p>{t.noActions}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {activeSegment === 'scenario' && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
          <ScenarioSimulator 
            initialInputs={inputs} 
            baselineScore={totalScore} 
            baselineRunway={results.metrics.runwayMonths} 
            lang={lang}
            isDark={isDark}
            showToast={showToast}
          />
        </div>
      )}

      {activeSegment === 'trends' && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
          <HistoricalTrends history={history} lang={lang} isDark={isDark} />
        </div>
      )}

    </div>
  );
};

export default Dashboard;
