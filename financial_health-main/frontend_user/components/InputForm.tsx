import React, { useState } from 'react';
import { FinancialInputs, Language } from '../types';
import { DEMO_DATA_ABELL, getRandomDemoScenario, DemoScenario } from '../services/calculator';
import { TEXT } from '../services/translations';
import { 
  Info, PlayCircle, Wallet, ShoppingCart, PiggyBank, CreditCard, 
  TrendingUp, Users, Package, Activity, Building2, 
  Briefcase, AlertCircle, PieChart, Landmark, Sparkles, Check, ChevronRight, ChevronLeft, BarChart3, Shuffle,
  ArrowLeft, X
} from 'lucide-react';

interface Props {
  initialInputs?: FinancialInputs | null;
  onCalculate: (data: FinancialInputs) => void;
  onCancel?: () => void;
  lang: Language;
  isDark: boolean;
}

const formatNumberWithDots = (val: number): string => {
  if (val === 0) return '';
  return val.toLocaleString('id-ID');
};

const parseDotsToNumber = (val: string): number => {
  const digits = val.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
};

const getIconForField = (field: keyof FinancialInputs, isActive: boolean) => {
  const classes = "w-5 h-5 transition-colors duration-300";
  switch(field) {
    case 'monthlyIncome': 
      return <Wallet className={`${classes} ${isActive ? 'text-emerald-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'monthlyExpenses': 
      return <ShoppingCart className={`${classes} ${isActive ? 'text-rose-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'cashAvailable': 
      return <PiggyBank className={`${classes} ${isActive ? 'text-blue-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'monthlyDebtPayments': 
      return <CreditCard className={`${classes} ${isActive ? 'text-amber-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'revenue': 
      return <TrendingUp className={`${classes} ${isActive ? 'text-emerald-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'payroll': 
      return <Users className={`${classes} ${isActive ? 'text-teal-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'cogs': 
      return <Package className={`${classes} ${isActive ? 'text-orange-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'opCosts': 
      return <Activity className={`${classes} ${isActive ? 'text-rose-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'businessCashReserves': 
      return <Building2 className={`${classes} ${isActive ? 'text-blue-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'currentAssets': 
      return <Briefcase className={`${classes} ${isActive ? 'text-cyan-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'currentLiabilities': 
      return <AlertCircle className={`${classes} ${isActive ? 'text-red-500 shadow-sm' : 'text-slate-400'}`} />;
    case 'topClientShare': 
      return <PieChart className={`${classes} ${isActive ? 'text-violet-500 shadow-sm' : 'text-slate-400'}`} />;
    default: 
      return <Landmark className={`${classes} text-slate-400`} />;
  }
};

interface InputFieldProps {
  label: string;
  field: keyof FinancialInputs;
  value: number;
  isActive: boolean;
  isDark: boolean;
  lang: Language;
  tooltip?: string;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (field: keyof FinancialInputs, val: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  field,
  value,
  isActive,
  isDark,
  lang,
  tooltip,
  onFocus,
  onBlur,
  onChange
}) => {
  const displayValue = formatNumberWithDots(value);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value);
  };

  return (
    <div className={`p-2.5 rounded-xl border transition-all duration-300 relative group ${
      isActive 
        ? isDark 
          ? 'border-blue-500 bg-slate-900/50 ring-2 ring-blue-500/10 shadow-lg shadow-blue-500/5' 
          : 'border-blue-500 bg-white ring-2 ring-blue-100 shadow-md'
        : isDark 
          ? 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40' 
          : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50/60'
    }`}>
      <label className="block text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {label}
          {tooltip && (
            <span className="group relative inline-block">
              <Info size={11} className="text-slate-450 cursor-help hover:text-blue-500 transition-colors" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2.5 bg-slate-950 text-slate-300 text-[10px] leading-relaxed rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 shadow-xl border border-slate-800">
                {tooltip}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-slate-800 rotate-45"></span>
              </span>
            </span>
          )}
        </span>
        {value > 0 && (
          <span className="text-[8px] text-emerald-500 font-extrabold tracking-wider uppercase flex items-center gap-0.5">
            <Check size={8} strokeWidth={3} /> Active
          </span>
        )}
      </label>
      
      <div className="relative flex items-center">
        <div className="absolute left-0.5 flex items-center justify-center">
          {getIconForField(field, isActive)}
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleTextChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-8 pr-12 py-0 bg-transparent border-0 outline-none focus:ring-0 font-black text-base transition-all ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
          placeholder="0"
        />
        <span className="absolute right-0.5 text-slate-450 text-[10px] font-extrabold tracking-widest">IDR</span>
      </div>

      <div className="mt-1 h-4 flex items-center justify-between text-[9px] font-bold text-slate-400/80 border-t border-dashed border-slate-800/10 dark:border-slate-200/5 pt-0.5">
        <span>{value > 0 ? `Rp ${value.toLocaleString('id-ID')}` : 'Rp 0'}</span>
        {isActive && <span className="text-blue-500 font-extrabold tracking-wider animate-pulse uppercase text-[7px]">ACTIVE ENTRY</span>}
      </div>
    </div>
  );
};

const InputForm: React.FC<Props> = ({ initialInputs, onCalculate, onCancel, lang, isDark }) => {
  const t = TEXT[lang];
  const [inputs, setInputs] = useState<FinancialInputs>(() => {
    return initialInputs || {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      cashAvailable: 0,
      monthlyDebtPayments: 0,
      revenue: 0,
      payroll: 0,
      opCosts: 0,
      businessCashReserves: 0,
      cogs: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      receivablesOver90: 0,
      totalReceivables: 0,
      topClientShare: 0
    };
  });

  // Sync inputs whenever initialInputs prop updates (e.g. from restored database session)
  React.useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs);
    }
  }, [initialInputs]);

  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeField, setActiveField] = useState<string | null>(null);

  const tooltips = {
    monthlyIncome: lang === 'id' ? 'Total pendapatan rutin rumah tangga (Gaji, Dividen, dll)' : 'Total recurring household income (Salary, Dividends, etc)',
    monthlyExpenses: lang === 'id' ? 'Total pengeluaran rutin (Makan, Transport, Listrik, dll)' : 'Total recurring expenses (Food, Transport, Utilities, etc)',
    cashAvailable: lang === 'id' ? 'Uang tunai yang bisa diakses cepat (Tabungan, Deposito cair)' : 'Cash accessible immediately (Savings, Liquid Deposits)',
    monthlyDebtPayments: lang === 'id' ? 'Total cicilan utang (KPR, KKB, Kartu Kredit)' : 'Total monthly debt installments (Mortgage, Car loan, CC)',
    revenue: lang === 'id' ? 'Omzet / Penjualan kotor bulanan rata-rata' : 'Average monthly gross revenue / sales',
    payroll: lang === 'id' ? 'Total gaji karyawan termasuk tunjangan & bonus' : 'Total employee payroll including benefits & bonuses',
    cogs: lang === 'id' ? 'Harga Pokok Penjualan (Biaya bahan baku/produk)' : 'Cost of Goods Sold (Raw materials/product costs)',
    opCosts: lang === 'id' ? 'Biaya operasional (Sewa, Listrik, Software, Marketing)' : 'Operating costs (Rent, Utilities, Software, Marketing)',
    businessCashReserves: lang === 'id' ? 'Uang kas perusahaan yang ada di bank saat ini' : 'Current business cash in bank',
    currentAssets: lang === 'id' ? 'Aset lancar perusahaan (Kas, Piutang < 1 Tahun)' : 'Assets liquidatable < 1 year (Cash, AR, Stock)',
    currentLiabilities: lang === 'id' ? 'Kewajiban jangka pendek yang harus dilunasi < 1 Tahun' : 'Debts due < 1 year',
  };

  const handleChange = (field: keyof FinancialInputs, enteredValue: string) => {
    if (field === 'topClientShare') {
      const parsedFloat = parseFloat(enteredValue);
      setInputs(prev => ({ ...prev, [field]: isNaN(parsedFloat) ? 0 : parsedFloat }));
    } else {
      const parsed = parseDotsToNumber(enteredValue);
      setInputs(prev => ({ ...prev, [field]: parsed }));
    }
  };

  const [activeDemoScenario, setActiveDemoScenario] = useState<DemoScenario | null>(null);

  const loadDemoData = () => {
    const scenario = getRandomDemoScenario();
    setInputs(scenario.data);
    setActiveDemoScenario(scenario);
  };

  const coreFields: (keyof FinancialInputs)[] = [
    'monthlyIncome', 'monthlyExpenses', 'cashAvailable', 'monthlyDebtPayments',
    'revenue', 'payroll', 'cogs', 'opCosts', 'businessCashReserves',
    'currentAssets', 'currentLiabilities'
  ];
  const filledCount = coreFields.filter(f => inputs[f] > 0).length + (inputs.topClientShare > 0 ? 1 : 0);
  const totalFields = 12;
  const coveragePercent = Math.round((filledCount / totalFields) * 100);

  const steps = [
    {
      id: 1,
      title: lang === 'id' ? 'Arus Kas Rumah Tangga' : 'Household Cashflow',
      desc: lang === 'id' ? 'Ubah koordinat pendapatan, pengeluaran & utang keluarga' : 'Manage family salary, operating expenses & debt services',
      icon: Wallet,
      color: 'from-emerald-500 to-teal-500',
      badge: lang === 'id' ? 'Langkah 1: Pribadi' : 'Step 1: Family'
    },
    {
      id: 2,
      title: lang === 'id' ? 'Kas & Operasional Bisnis' : 'Corporate Operations',
      desc: lang === 'id' ? 'Rasio kinerja bisnis, cadangan kas & upah karyawan' : 'Corporate performance, payroll ratios & operating expenditures',
      icon: Building2,
      color: 'from-blue-500 to-indigo-500',
      badge: lang === 'id' ? 'Langkah 2: Bisnis' : 'Step 2: Corporate'
    },
    {
      id: 3,
      title: lang === 'id' ? 'Uji Likuiditas & Konsentrasi Klien' : 'Liquidity & Assets Ratios',
      desc: lang === 'id' ? 'Lihat ketangguhan jangka pendek & ketergantungan klien' : 'Examine balance sheet strength & custom revenue concentration',
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      badge: lang === 'id' ? 'Langkah 3: Lanjutan' : 'Step 3: Advanced'
    }
  ];

  return (
    <div className={`rounded-3xl border transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden ${
      isDark ? 'bg-slate-950 border-slate-850 text-white' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      
      {/* 1. Sleek Header Area - Glassmorphism, load demo toggle */}
      <div className={`px-5 md:px-6 py-2 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 relative overflow-hidden ${
        isDark ? 'border-slate-850 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-wider mb-0.5">
            <Sparkles size={9} className="fill-blue-500" />
            <span>Deterministic GAAP Algorithm Engine</span>
          </div>
          <h2 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-905'}`}>{t.inputHeader}</h2>
          <p className={`text-[10px] font-semibold ${isDark ? 'text-slate-450' : 'text-slate-500'}`}>{t.inputSubtitle}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 shrink-0 relative z-10">
          {activeDemoScenario && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold border animate-in fade-in zoom-in duration-200 ${activeDemoScenario.badgeColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>Grade {activeDemoScenario.targetGrade}:</span>
              <span className="truncate max-w-[130px] sm:max-w-[200px]">
                {lang === 'id' ? activeDemoScenario.name : activeDemoScenario.nameEn}
              </span>
            </div>
          )}

          {onCancel && initialInputs && (
            <button
              type="button"
              onClick={onCancel}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-bold transition-all duration-200 border cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={lang === 'id' ? 'Batal ubah dan kembali ke Dashboard' : 'Cancel editing and return to Dashboard'}
            >
              <ArrowLeft size={12} />
              <span>{lang === 'id' ? 'Batal' : 'Cancel'}</span>
            </button>
          )}

          <button 
            type="button"
            onClick={loadDemoData}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-bold transition-all duration-300 shadow-sm cursor-pointer border ${
              isDark 
                ? 'bg-blue-600/10 border-blue-550/30 text-blue-400 hover:bg-blue-600/20' 
                : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'
            }`}
            title="Klik untuk memuat studi kasus acak (Grade A - E)"
          >
            <Shuffle size={12} className="text-blue-500" /> 
            <span>{t.loadDemo} (Acak)</span>
          </button>
        </div>

        {/* Backdrop glowing dots */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Professional Stepper Tracker Header */}
      <div className={`border-b px-5 md:px-6 py-2 ${
        isDark ? 'border-slate-850 bg-slate-950/40' : 'border-slate-100 bg-slate-50/20'
      }`}>
        {/* Progress tracker summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-blue-500 uppercase tracking-widest text-[8px]">Diagnostics Target</span>
            <span className={`px-1.5 py-0.5 rounded text-[8px] ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              Step {activeStep} of 3
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-right whitespace-nowrap text-[8px] tracking-widest uppercase">Coverage density: {coveragePercent}%</span>
            <div className={`h-1 w-24 rounded-full relative overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Giant clickable visual tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {steps.map(step => {
            const Icon = step.icon;
            const isCompleted = step.id < activeStep;
            const isActive = step.id === activeStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`text-left p-2 rounded-xl border transition-all duration-350 cursor-pointer flex items-center justify-between relative overflow-hidden ${
                  isActive 
                    ? isDark 
                      ? 'bg-slate-900/60 border-blue-550/80 shadow-md ring-1 ring-blue-550/10' 
                      : 'bg-white border-blue-500 shadow-sm shadow-blue-100 ring-2 ring-blue-100'
                    : isCompleted
                      ? isDark ? 'bg-slate-950/80 border-emerald-500/20 hover:border-emerald-500/50' : 'bg-slate-50/30 border-emerald-500/10 hover:border-emerald-500/40'
                      : isDark ? 'bg-slate-950/40 border-slate-850 hover:border-slate-800' : 'bg-slate-50/20 border-slate-150 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 relative z-10 w-full">
                  <div className={`p-1 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : isCompleted ? 'bg-emerald-500/10 text-emerald-500' : isDark ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? <Check size={11} strokeWidth={3} /> : <Icon size={11} />}
                  </div>

                  <div className="truncate flex-1 pr-1">
                    <span className="block text-[7px] font-extrabold text-slate-450 uppercase tracking-widest leading-none mb-0.5">
                      {step.badge}
                    </span>
                    <span className={`block text-xs font-black tracking-tight transition-colors truncate ${
                      isActive ? isDark ? 'text-white' : 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-10 h-10 bg-blue-500/3 rounded-full blur-xl pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Gorgeous Large Responsive Input Workspace Card */}
      <div className="p-3 md:p-4 overflow-y-auto flex-1 select-none min-h-[140px] max-h-[50vh]">
        
        {steps.map(step => {
          if (step.id !== activeStep) return null;

          const Icon = step.icon;

          return (
            <div key={step.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Step info headline banner */}
              <div className={`p-2 rounded-xl border mb-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 ${
                isDark ? 'bg-slate-900/10 border-slate-850' : 'bg-slate-50/30 border-slate-150/60'
              }`}>
                <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${step.color} text-white shadow-md`}>
                  <Icon size={12} className="stroke-white" />
                </div>
                <div>
                  <h3 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-905'}`}>
                    {step.title}
                  </h3>
                  <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Step Particular Input Grids */}
              {step.id === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <InputField 
                    label={t.monthlyIncome} 
                    field="monthlyIncome" 
                    value={inputs.monthlyIncome} 
                    isActive={activeField === 'monthlyIncome'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.monthlyIncome}
                    onFocus={() => setActiveField('monthlyIncome')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <InputField 
                    label={t.monthlyExpenses} 
                    field="monthlyExpenses" 
                    value={inputs.monthlyExpenses} 
                    isActive={activeField === 'monthlyExpenses'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.monthlyExpenses}
                    onFocus={() => setActiveField('monthlyExpenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <InputField 
                    label={t.cashAvailable} 
                    field="cashAvailable" 
                    value={inputs.cashAvailable} 
                    isActive={activeField === 'cashAvailable'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.cashAvailable}
                    onFocus={() => setActiveField('cashAvailable')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <InputField 
                    label={t.monthlyDebtPayments} 
                    field="monthlyDebtPayments" 
                    value={inputs.monthlyDebtPayments} 
                    isActive={activeField === 'monthlyDebtPayments'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.monthlyDebtPayments}
                    onFocus={() => setActiveField('monthlyDebtPayments')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                </div>
              )}

              {step.id === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <InputField 
                    label={t.revenue} 
                    field="revenue" 
                    value={inputs.revenue} 
                    isActive={activeField === 'revenue'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.revenue}
                    onFocus={() => setActiveField('revenue')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <InputField 
                    label={t.payroll} 
                    field="payroll" 
                    value={inputs.payroll} 
                    isActive={activeField === 'payroll'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.payroll}
                    onFocus={() => setActiveField('payroll')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <InputField 
                    label={t.cogs} 
                    field="cogs" 
                    value={inputs.cogs} 
                    isActive={activeField === 'cogs'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.cogs}
                    onFocus={() => setActiveField('cogs')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <InputField 
                    label={t.opCosts} 
                    field="opCosts" 
                    value={inputs.opCosts} 
                    isActive={activeField === 'opCosts'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.opCosts}
                    onFocus={() => setActiveField('opCosts')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <div className="md:col-span-2">
                    <InputField 
                      label={t.businessCashReserves} 
                      field="businessCashReserves" 
                      value={inputs.businessCashReserves} 
                      isActive={activeField === 'businessCashReserves'}
                      isDark={isDark}
                      lang={lang}
                      tooltip={tooltips.businessCashReserves}
                      onFocus={() => setActiveField('businessCashReserves')}
                      onBlur={() => setActiveField(null)}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {step.id === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <InputField 
                    label={t.currentAssets} 
                    field="currentAssets" 
                    value={inputs.currentAssets} 
                    isActive={activeField === 'currentAssets'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.currentAssets}
                    onFocus={() => setActiveField('currentAssets')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  <InputField 
                    label={t.currentLiabilities} 
                    field="currentLiabilities" 
                    value={inputs.currentLiabilities} 
                    isActive={activeField === 'currentLiabilities'}
                    isDark={isDark}
                    lang={lang}
                    tooltip={tooltips.currentLiabilities}
                    onFocus={() => setActiveField('currentLiabilities')}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                  />
                  
                  {/* Top Client Share Ratio Field */}
                  <div className={`p-2.5 rounded-xl border transition-all duration-300 relative md:col-span-2 group ${
                    activeField === 'topClientShare'
                      ? isDark 
                        ? 'border-blue-500 bg-slate-900/50 ring-2 ring-blue-500/10 shadow-lg shadow-blue-500/5' 
                        : 'border-blue-500 bg-white ring-2 ring-blue-100 shadow-md'
                      : isDark 
                        ? 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40' 
                        : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}>
                    <label className="block text-[10px] font-extrabold text-slate-450 tracking-widest uppercase mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {t.topClientShare}
                        <span className="group relative">
                          <Info size={11} className="text-slate-450 cursor-help hover:text-blue-500 transition-colors" />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2.5 bg-slate-950 text-slate-300 text-[10px] leading-relaxed rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 shadow-xl border border-slate-800">
                            {lang === 'id' ? 'Persentase pendapatan dari 1 klien terbesar (Contoh: 0.25 = 25%)' : 'Percentage of revenue from largest client (e.g. 0.25 = 25%)'}
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-slate-800 rotate-45"></span>
                          </span>
                        </span>
                      </span>
                      {inputs.topClientShare > 0 && (
                        <span className="text-[8px] text-emerald-500 font-extrabold tracking-wider uppercase flex items-center gap-0.5">
                          <Check size={8} strokeWidth={3} /> Active
                        </span>
                      )}
                    </label>
                    <div className="relative flex items-center mt-0.5">
                      <div className="absolute left-0.5">
                        <PieChart className={`w-5 h-5 transition-colors duration-300 ${activeField === 'topClientShare' ? 'text-violet-500 shadow-sm' : 'text-slate-400'}`} />
                      </div>
                      <input 
                        type="number" 
                        step="0.01" 
                        max="1" 
                        className={`w-full pl-8 pr-12 py-0 bg-transparent border-0 outline-none focus:ring-0 font-black text-base transition-all ${
                          isDark ? 'text-white' : 'text-slate-905'
                        }`}
                        value={inputs.topClientShare || ''}
                        onFocus={() => setActiveField('topClientShare')}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => handleChange('topClientShare', e.target.value)}
                        placeholder="0.25"
                      />
                    </div>
                    <div className="mt-1 h-4 flex items-center justify-between text-[9px] font-bold text-slate-450/80 border-t border-dashed border-slate-800/10 dark:border-slate-200/5 pt-0.5">
                      <span>{inputs.topClientShare > 0 ? `${Math.round(inputs.topClientShare * 100)}% of corporate revenue` : '0%'}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* 4. Elegant Footer Controls Area */}
      <div className={`px-6 md:px-8 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900/35 border-slate-850' : 'bg-slate-50/50 border-slate-100'
      }`}>
        
        {/* Step cycle indicators */}
        <div className="flex items-center gap-1.5">
          {steps.map(s => (
            <div 
              key={s.id} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.id === activeStep ? 'w-5 bg-blue-600' : 'w-1.5 bg-slate-600/30'
              }`}
            />
          ))}
        </div>

        {/* Action Button Navigation Trigger flow */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {onCancel && initialInputs && (
            <button
              type="button"
              onClick={onCancel}
              className={`py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-rose-400' 
                  : 'bg-white border-slate-200 text-slate-500 shadow-sm hover:bg-rose-50 hover:text-rose-600'
              }`}
              title={lang === 'id' ? 'Batal mengubah dan kembali ke Dashboard' : 'Cancel and return to Dashboard'}
            >
              <X size={13} />
              <span>{lang === 'id' ? 'Batal' : 'Cancel'}</span>
            </button>
          )}

          {activeStep > 1 && (
            <button
              type="button"
              onClick={() => setActiveStep(prev => prev - 1)}
              className={`flex-1 sm:flex-initial py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50'
              }`}
            >
              <ChevronLeft size={14} />
              <span>{lang === 'id' ? 'Sebelumnya' : 'Previous'}</span>
            </button>
          )}

          {activeStep < 3 ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => prev + 1)}
              className="flex-1 sm:flex-initial py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer transform transition-all active:scale-[0.98]"
            >
              <span>{lang === 'id' ? 'Selanjutnya' : 'Next Step'}</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => onCalculate(inputs)}
              className="flex-1 sm:flex-initial py-2.5 px-6 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity size={14} className="animate-pulse" />
              <span>{t.runDiagnostic}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default InputForm;
