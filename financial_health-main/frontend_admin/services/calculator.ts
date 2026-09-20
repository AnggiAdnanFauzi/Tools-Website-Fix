
import { FinancialInputs, CalculationResult, SubScore, ActionItem, Language } from '../types';

const getStatus = (score: number): SubScore['status'] => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'healthy';
  if (score >= 40) return 'warning';
  return 'critical';
};

export const calculateFinancialHealth = (inputs: FinancialInputs, lang: Language = 'en'): CalculationResult => {
  const subScores: Partial<CalculationResult['subScores']> = {};
  const actions: ActionItem[] = [];

  // Helper strings based on language
  const T = {
    months: lang === 'id' ? 'Bulan' : 'Months',
    inf: lang === 'id' ? 'Tak Terbatas' : 'Infinite',
    burning: lang === 'id' ? 'Bakar uang' : 'Burning',
    mo: lang === 'id' ? 'bln' : 'mo',
    positiveCash: lang === 'id' ? 'Bisnis positif arus kas.' : 'Business is cashflow positive.',
    negCash: lang === 'id' ? 'Arus kas negatif terdeteksi.' : 'Negative cashflow detected.',
    posCash: lang === 'id' ? 'Surplus arus kas positif.' : 'Positive cashflow surplus.',
    dsrHigh: lang === 'id' ? 'Beban utang berat relatif terhadap pendapatan.' : 'Debt load is heavy relative to income.',
    dsrOk: lang === 'id' ? 'Beban utang terkendali.' : 'Debt load is manageable.',
    efcCrit: lang === 'id' ? 'Kekurangan likuiditas kritis.' : 'Critical lack of liquidity.',
    efcOk: lang === 'id' ? 'Penyangga likuiditas aktif.' : 'Liquidity buffer is active.',
    loss: lang === 'id' ? 'Bisnis merugi.' : 'Business is operating at a loss.',
    profit: lang === 'id' ? 'Bisnis menghasilkan laba.' : 'Business is generating profit.',
    payrollHigh: lang === 'id' ? 'Biaya gaji sangat tinggi dan tidak berkelanjutan.' : 'Payroll costs are unsustainably high.',
    payrollOk: lang === 'id' ? 'Biaya gaji dalam batas sehat.' : 'Payroll costs are within healthy limits.',
    liquidityDesc: lang === 'id' ? 'Kemampuan menutupi kewajiban jangka pendek.' : 'Ability to cover short-term obligations.',
    
    // Priority Labels
    pImm: lang === 'id' ? 'Segera (7 Hari)' : 'Immediate (7 Days)',
    pShort: lang === 'id' ? 'Jangka Pendek (30 Hari)' : 'Short Term (30 Days)',
    pStrat: lang === 'id' ? 'Strategis (90 Hari)' : 'Strategic (90 Days)',
    
    // Effort Labels
    effHighDaily: lang === 'id' ? 'Tinggi - Butuh fokus harian' : 'High - Daily focus required',
    effMed: lang === 'id' ? 'Sedang - 2-3 minggu' : 'Medium - 2-3 weeks',
    effHighUrgent: lang === 'id' ? 'Tinggi - Mendesak' : 'High - Urgent',
    effHighCrit: lang === 'id' ? 'Tinggi - Kritis' : 'High - Critical',
    effHighStrat: lang === 'id' ? 'Tinggi - Perombakan Strategis' : 'High - Strategic Overhaul',
    effMedPers: lang === 'id' ? 'Sedang - Tinjauan Personil' : 'Medium - Personnel Review',
    effMedSales: lang === 'id' ? 'Sedang - Fokus Penjualan' : 'Medium - Sales Focus',
  };

  // --- 1. Cashflow Health (CFH) ---
  const netCashflow = inputs.monthlyIncome - inputs.monthlyExpenses;
  let cfhScore = 40;
  if (netCashflow > 0) {
    cfhScore = Math.min(100, 40 + (netCashflow / (inputs.monthlyIncome || 1)) * 300);
  }
  
  subScores.cfh = {
    score: cfhScore,
    label: lang === 'id' ? 'Kesehatan Arus Kas' : 'Cashflow Health',
    valueDisplay: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(netCashflow),
    status: getStatus(cfhScore),
    description: netCashflow <= 0 ? T.negCash : T.posCash,
  };
  
  if (netCashflow <= 0) {
    actions.push({
      priority: T.pImm,
      priorityCode: 'immediate',
      title: lang === 'id' ? 'Hentikan Kebocoran Kas' : 'Stop Bleeding Cash',
      description: lang === 'id' 
        ? 'Hentikan semua pengeluaran non-esensial segera. Lacak arus kas harian.' 
        : 'Stop all non-essential expenses immediately. Track daily cashflow.',
      effort: T.effHighDaily,
      steps: lang === 'id' ? [
        'Periksa rekening koran 90 hari terakhir; identifikasi biaya berulang >Rp500rb yang tidak menghasilkan revenue.',
        'Batalkan langganan tidak terpakai dan bekukan pembayaran vendor non-kritis selama 7 hari.',
        'Negosiasi termin pembayaran dengan 3 pemasok terbesar (minta Tempo 30 atau 45 hari).',
        'Terapkan lembar pelacakan kas harian: Update saldo kas setiap pagi jam 9.'
      ] : [
        'Review bank statements for the last 90 days; identify recurring charges >$50 that do not drive revenue.',
        'Cancel unused SaaS subscriptions and freeze non-critical vendor payments for 7 days.',
        'Negotiate payment terms with top 3 largest suppliers (ask for Net-30 or Net-45).',
        'Implement a daily cashflow tracking sheet: Update cash balance every morning at 9 AM.'
      ]
    });
  }

  // --- 2. Debt Service Ratio (DSR) ---
  const dsr = inputs.monthlyDebtPayments / Math.max(1, inputs.monthlyIncome);
  let dsrScore = 20;
  if (dsr <= 0.20) dsrScore = 100;
  else if (dsr <= 0.35) dsrScore = 80 - ((dsr - 0.20) / 0.15) * 20;
  else if (dsr <= 0.50) dsrScore = 60 - ((dsr - 0.35) / 0.15) * 30;
  
  subScores.dsr = {
    score: Math.max(0, dsrScore),
    label: lang === 'id' ? 'Rasio Cicilan Utang' : 'Debt Service Ratio',
    valueDisplay: `${(dsr * 100).toFixed(1)}%`,
    status: getStatus(dsrScore),
    description: dsr > 0.35 ? T.dsrHigh : T.dsrOk,
  };

  if (dsr > 0.4) {
    actions.push({
      priority: T.pShort,
      priorityCode: 'short',
      title: lang === 'id' ? 'Restrukturisasi Utang' : 'Restructure Debt',
      description: lang === 'id' 
        ? 'Negosiasikan opsi pembiayaan ulang untuk menurunkan cicilan bulanan. DSR sangat tinggi.' 
        : 'Negotiate refinancing options to lower monthly payments. DSR is critically high.',
      effort: T.effMed,
      steps: lang === 'id' ? [
        'List semua utang: Pokok, Bunga, Cicilan Bulanan, Tanggal Jatuh Tempo.',
        'Hubungi pemberi pinjaman untuk meminta bunga lebih rendah atau periode "Interest-only" selama 6 bulan.',
        'Pertimbangkan konsolidasi utang bunga tinggi (>12%) menjadi satu fasilitas bunga rendah.',
        'Jalankan "Metode Avalanche": Arahkan semua kelebihan kas ke pinjaman bunga tertinggi dulu.'
      ] : [
        'List all debts in a spreadsheet: Principal, Interest Rate, Monthly Payment, Maturity Date.',
        'Contact lenders to request lower interest rates or "Interest-only" periods for 6 months.',
        'Consider consolidating high-interest debt (>12%) into a single lower-rate facility.',
        'Execute "Avalanche Method": Direct all excess cash to the highest interest loan first.'
      ]
    });
  }

  // --- 3. Emergency Fund Coverage (EFC) ---
  const efcMonths = inputs.cashAvailable / Math.max(1, inputs.monthlyExpenses);
  let efcScore = 10;
  if (efcMonths >= 12) efcScore = 100;
  else if (efcMonths >= 9) efcScore = 90;
  else if (efcMonths >= 6) efcScore = 75;
  else if (efcMonths >= 3) efcScore = 50;
  else if (efcMonths >= 1) efcScore = 30;

  subScores.efc = {
    score: efcScore,
    label: lang === 'id' ? 'Dana Darurat' : 'Emergency Fund',
    valueDisplay: `${efcMonths.toFixed(1)} ${T.months}`,
    status: getStatus(efcScore),
    description: efcMonths < 3 ? T.efcCrit : T.efcOk,
  };

  if (efcMonths < 3) {
    actions.push({
      priority: T.pImm,
      priorityCode: 'immediate',
      title: lang === 'id' ? 'Amankan Kas Darurat' : 'Secure Emergency Cash',
      description: lang === 'id' 
        ? 'Likuidasi aset non-esensial untuk membangun setidaknya 3 bulan penyangga.' 
        : 'Liquidate non-essential assets to build at least 3 months of buffer.',
      effort: T.effHighUrgent,
      steps: lang === 'id' ? [
        'Identifikasi aset non-inti (stok mati, alat lama) dan jual di marketplace segera.',
        'Hentikan semua CapEx (Belanja Modal); tidak ada pembelian alat baru selama 90 hari.',
        'Ajukan fasilitas pinjaman siaga (line of credit) sebagai cadangan.',
        'Otomatisasi transfer harian 2-5% dari revenue ke rekening tabungan terpisah.'
      ] : [
        'Identify non-core assets (inventory, old equipment) and list on marketplaces immediately.',
        'Pause all CapEx (Capital Expenditures); no new equipment purchases for 90 days.',
        'Apply for a business line of credit (LOC) to have as a backup facility.',
        'Automate a daily transfer of 2-5% of revenue into a separate, hard-to-access savings account.'
      ]
    });
  }

  // --- 4. Runway (Business) ---
  const businessOutflow = inputs.cogs + inputs.payroll + inputs.opCosts;
  
  const monthlyBurn = Math.max(0, businessOutflow - inputs.revenue);
  let runwayMonths = 999;
  let runwayScore = 100;

  if (monthlyBurn > 0) {
    runwayMonths = inputs.businessCashReserves / monthlyBurn;
    if (runwayMonths >= 12) runwayScore = 100;
    else if (runwayMonths >= 6) runwayScore = 75;
    else if (runwayMonths >= 3) runwayScore = 50;
    else runwayScore = 20;
  }

  subScores.runway = {
    score: runwayScore,
    label: lang === 'id' ? 'Nafas Bisnis (Runway)' : 'Business Runway',
    valueDisplay: monthlyBurn === 0 ? `${T.inf}` : `${runwayMonths.toFixed(1)} ${T.months}`,
    status: getStatus(runwayScore),
    description: monthlyBurn > 0 ? `${T.burning} ${new Intl.NumberFormat('id-ID', { compactDisplay: 'short', notation: 'compact' }).format(monthlyBurn)}/${T.mo}` : T.positiveCash,
  };

  if (monthlyBurn > 0 && runwayMonths < 3) {
    actions.push({
      priority: T.pImm,
      priorityCode: 'immediate',
      title: lang === 'id' ? 'Perpanjang Runway' : 'Extend Runway',
      description: lang === 'id' 
        ? 'Pemotongan biaya segera diperlukan. Bekukan rekrutmen dan pembayaran vendor non-esensial.' 
        : 'Immediate cost cutting required. Freeze hiring and non-essential vendor payments.',
      effort: T.effHighCrit,
      steps: lang === 'id' ? [
        'Terapkan "Hiring Freeze" ketat: Tidak ada penggantian staf yang keluar.',
        'Audit OpEx: Potong 20% biaya terbawah yang tidak berkontribusi langsung ke pendapatan.',
        'Negosiasi keringanan sewa dengan pemilik gedung atau sewakan ruang kantor yang tidak terpakai.',
        'Luncurkan "Promo Pre-payment": Diskon 10% untuk pelanggan yang bayar 12 bulan di muka.'
      ] : [
        'Implement a strict "Hiring Freeze": No backfills for departing staff.',
        'Audit OpEx: Cut the bottom 20% of expenses that do not directly contribute to revenue.',
        'Negotiate rent abatement with landlord or sublease unused office space.',
        'Launch a "Pre-payment Promo": Offer 10% discount for customers who pay 12 months upfront.'
      ]
    });
  }

  // --- 5. Profitability (Net Margin) ---
  const netProfit = inputs.revenue - inputs.cogs - inputs.payroll - inputs.opCosts - inputs.monthlyDebtPayments;
  const netMargin = netProfit / Math.max(1, inputs.revenue);
  
  let profitScore = 10;
  if (netMargin >= 0.15) profitScore = 100;
  else if (netMargin >= 0.10) profitScore = 80;
  else if (netMargin >= 0.05) profitScore = 60;
  else if (netMargin >= 0.00) profitScore = 40;

  subScores.profitability = {
    score: profitScore,
    label: lang === 'id' ? 'Margin Bersih' : 'Net Margin',
    valueDisplay: `${(netMargin * 100).toFixed(1)}%`,
    status: getStatus(profitScore),
    description: netMargin < 0 ? T.loss : T.profit,
  };

  if (netMargin < 0) {
    actions.push({
      priority: T.pStrat,
      priorityCode: 'strategic',
      title: lang === 'id' ? 'Pivot ke Profitabilitas' : 'Pivot to Profitability',
      description: lang === 'id' 
        ? 'Tinjau unit economics. Naikkan harga atau hentikan lini produk margin rendah.' 
        : 'Review unit economics. Raise prices or discontinue low-margin product lines.',
      effort: T.effHighStrat,
      steps: lang === 'id' ? [
        'Hitung Unit Economics (CAC vs LTV) dan Margin Kontribusi per produk.',
        'Hentikan 20% SKU/Layanan terbawah dengan margin terendah.',
        'Uji kenaikan harga 5-10% pada produk utama; ukur dampak churn.',
        'Kurangi biaya variabel (HPP) dengan meminta penawaran dari 3 pemasok alternatif.'
      ] : [
        'Calculate Unit Economics (CAC vs LTV) and Contribution Margin for each product line.',
        'Discontinue the bottom 20% of SKUs/Services with the lowest margins.',
        'Test a 5-10% price increase on key products; measure churn impact.',
        'Reduce variable costs (COGS) by getting quotes from 3 alternative suppliers.'
      ]
    });
  }

  // --- 6. Payroll Efficiency ---
  const payrollRatio = inputs.payroll / Math.max(1, inputs.revenue);
  let payrollScore = 20;
  if (payrollRatio <= 0.20) payrollScore = 100;
  else if (payrollRatio <= 0.35) payrollScore = 80;
  else if (payrollRatio <= 0.50) payrollScore = 50;
  
  subScores.payroll = {
    score: payrollScore,
    label: lang === 'id' ? 'Efisiensi Gaji' : 'Payroll Efficiency',
    valueDisplay: `${(payrollRatio * 100).toFixed(1)}%`,
    status: getStatus(payrollScore),
    description: payrollRatio > 0.5 ? T.payrollHigh : T.payrollOk,
  };

  if (payrollRatio > 0.5) {
     actions.push({
      priority: T.pShort,
      priorityCode: 'short',
      title: lang === 'id' ? 'Optimalkan Struktur Tim' : 'Optimize Team Structure',
      description: lang === 'id' 
        ? 'Gaji >50% dari revenue. Pertimbangkan model kontraktor atau bekukan rekrutmen.' 
        : 'Payroll is >50% of revenue. Consider contractor models or hiring freeze.',
      effort: T.effMedPers,
      steps: lang === 'id' ? [
        'Lakukan analisis ROI per peran; petakan setiap karyawan ke OKR Pendapatan.',
        'Transisikan peran full-time yang cocok ke model kontraktor atau freelance.',
        'Bekukan semua kenaikan gaji dan bonus sampai Margin Bersih > 15%.',
        'Ubah struktur kompensasi: Gaji pokok lebih rendah, komisi berbasis kinerja lebih tinggi.'
      ] : [
        'Conduct a role-by-role ROI analysis; map every employee to a Revenue OKR.',
        'Transition suitable full-time roles to contractor or freelance models.',
        'Freeze all salary increases and bonuses until Net Margin > 15%.',
        'Shift compensation structure: Lower base salary, higher performance-based commission.'
      ]
    });
  }

  // --- 7. Liquidity (Current Ratio) ---
  const currentRatio = inputs.currentAssets / Math.max(1, inputs.currentLiabilities);
  let liquidityScore = 50; 
  
  if (inputs.currentAssets > 0 && inputs.currentLiabilities > 0) {
      if (currentRatio >= 1.5) liquidityScore = 100;
      else if (currentRatio >= 1.2) liquidityScore = 80;
      else if (currentRatio >= 1.0) liquidityScore = 60;
      else liquidityScore = 30;
  }

  subScores.liquidity = {
    score: liquidityScore,
    label: lang === 'id' ? 'Rasio Likuiditas' : 'Liquidity Ratio',
    valueDisplay: inputs.currentLiabilities === 0 ? 'N/A' : currentRatio.toFixed(2),
    status: getStatus(liquidityScore),
    description: T.liquidityDesc,
  };

  if (inputs.currentLiabilities > 0 && currentRatio < 1.0) {
    actions.push({
      priority: T.pImm,
      priorityCode: 'immediate',
      title: lang === 'id' ? 'Krisis Likuiditas' : 'Liquidity Crisis',
      description: lang === 'id'
        ? 'Aset lancar tidak cukup menutup utang jangka pendek. Risiko gagal bayar tinggi.'
        : 'Current assets cannot cover short-term liabilities. High risk of default.',
      effort: T.effHighUrgent,
      steps: lang === 'id' ? [
        'Percepat penagihan piutang (AR): Berikan diskon 2-5% untuk pelunasan minggu ini.',
        'Jual rugi inventaris lama/mati (Dead Stock) untuk menjadi uang tunai secepatnya.',
        'Minta penundaan pembayaran ke pemasok (Accounts Payable) jika memungkinkan.',
        'Suntik modal pribadi atau cari pinjaman modal kerja darurat.'
      ] : [
        'Accelerate AR collection: Offer 2-5% discounts for payments made this week.',
        'Liquidate dead stock inventory immediately to generate cash.',
        'Negotiate payment extensions with suppliers (Accounts Payable).',
        'Inject personal capital or secure an emergency working capital loan.'
      ]
    });
  }

  // --- Total Score ---
  let weightedScore = 
    (subScores.cfh!.score * 0.20) +
    (subScores.dsr!.score * 0.15) +
    (subScores.efc!.score * 0.15) +
    (subScores.runway!.score * 0.10) +
    (subScores.profitability!.score * 0.15) +
    (subScores.payroll!.score * 0.10) +
    (subScores.liquidity!.score * 0.10);
    
  if (inputs.topClientShare > 0.30) {
    weightedScore -= 10;
    actions.push({
      priority: T.pStrat,
      priorityCode: 'strategic',
      title: lang === 'id' ? 'Diversifikasi Basis Klien' : 'Diversify Client Base',
      description: lang === 'id' 
        ? `Ketergantungan tinggi pada klien utama (${(inputs.topClientShare * 100).toFixed(0)}%). Risiko kolaps pendapatan.` 
        : `High dependency on top client (${(inputs.topClientShare * 100).toFixed(0)}%). Risk of revenue collapse.`,
      effort: T.effMedSales,
      steps: lang === 'id' ? [
        'Identifikasi 3 vertikal target baru yang mirip profil klien utama Anda.',
        'Insentif tim sales: Komisi ganda untuk "Logo Baru" vs "Upsell".',
        'Minta 3 referensi dari klien kecil yang puas.',
        'Buat "Kebijakan Risiko Klien": Targetkan tidak ada satu klien melebihi 15% revenue.'
      ] : [
        'Identify 3 new target verticals that mirror your top client\'s profile.',
        'Incentivize sales team: Double commission for "New Logos" vs "Upsells".',
        'Request 3 referrals from satisfied smaller clients.',
        'Draft a "Client Risk Policy": Goal for no single client to exceed 15% of revenue.'
      ]
    });
  }

  weightedScore = Math.max(0, Math.min(100, weightedScore));

  let grade = 'E';
  if (weightedScore >= 85) grade = 'A';
  else if (weightedScore >= 70) grade = 'B';
  else if (weightedScore >= 50) grade = 'C';
  else if (weightedScore >= 40) grade = 'D';

  return {
    totalScore: weightedScore,
    grade,
    subScores: subScores as CalculationResult['subScores'],
    metrics: {
      netCashflow,
      dsrRatio: dsr,
      efcMonths,
      monthlyBurn,
      runwayMonths,
      netMargin,
      payrollRatio,
      currentRatio
    },
    actionPlan: actions.sort((a, b) => {
        const pOrder = { 'immediate': 0, 'short': 1, 'strategic': 2 };
        const aCode = a.priorityCode || 'strategic';
        const bCode = b.priorityCode || 'strategic';
        return pOrder[aCode] - pOrder[bCode];
    })
  };
};

export const DEMO_DATA_ABELL: FinancialInputs = {
  monthlyIncome: 50000000,
  monthlyExpenses: 50000000,
  cashAvailable: 50000000,
  monthlyDebtPayments: 25000000,
  revenue: 80000000,
  payroll: 45000000,
  opCosts: 25000000,
  businessCashReserves: 50000000,
  cogs: 20000000,
  currentAssets: 50000000, 
  currentLiabilities: 30000000,
  receivablesOver90: 0,
  totalReceivables: 10000000,
  topClientShare: 0.25
};

export interface DemoScenario {
  id: string;
  name: string;
  nameEn: string;
  targetGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  badgeColor: string;
  description: string;
  descriptionEn: string;
  data: FinancialInputs;
}

export const DEMO_SCENARIO_GRADE_A: DemoScenario = {
  id: 'grade_a_prime',
  name: 'Korporasi Prima & Arus Kas Kuat',
  nameEn: 'Prime Corporation & Strong Cashflow',
  targetGrade: 'A',
  badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  description: 'Arus kas surplus tinggi, DSR 10%, dana darurat 12+ bulan, runway bisnis prima.',
  descriptionEn: 'High surplus cashflow, DSR 10%, 12+ months emergency fund, infinite runway.',
  data: {
    monthlyIncome: 100000000,
    monthlyExpenses: 40000000,
    cashAvailable: 500000000,
    monthlyDebtPayments: 10000000,
    revenue: 300000000,
    payroll: 60000000,
    opCosts: 45000000,
    businessCashReserves: 800000000,
    cogs: 75000000,
    currentAssets: 400000000,
    currentLiabilities: 150000000,
    receivablesOver90: 0,
    totalReceivables: 30000000,
    topClientShare: 0.15,
  },
};

export const DEMO_SCENARIO_GRADE_B: DemoScenario = {
  id: 'grade_b_growth',
  name: 'Bisnis Mapan & Berkembang Sehat',
  nameEn: 'Established Business & Healthy Growth',
  targetGrade: 'B',
  badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  description: 'Pertumbuhan stabil, DSR 25%, margin laba 15%, likuiditas terjaga.',
  descriptionEn: 'Stable growth, DSR 25%, net margin 15%, healthy liquidity.',
  data: {
    monthlyIncome: 50000000,
    monthlyExpenses: 32000000,
    cashAvailable: 220000000,
    monthlyDebtPayments: 12500000,
    revenue: 180000000,
    payroll: 52000000,
    opCosts: 40000000,
    businessCashReserves: 300000000,
    cogs: 60000000,
    currentAssets: 180000000,
    currentLiabilities: 110000000,
    receivablesOver90: 4000000,
    totalReceivables: 30000000,
    topClientShare: 0.28,
  },
};

export const DEMO_SCENARIO_GRADE_C: DemoScenario = {
  id: 'grade_c_moderate',
  name: 'Usaha Berkembang & Waspada Margin',
  nameEn: 'Growing SME & Moderate Margins',
  targetGrade: 'C',
  badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  description: 'Arus kas positif tipis, DSR 35%, cadangan kas moderat 4 bulan.',
  descriptionEn: 'Slim positive cashflow, DSR 35%, moderate 4-month cash reserve.',
  data: {
    monthlyIncome: 35000000,
    monthlyExpenses: 28000000,
    cashAvailable: 100000000,
    monthlyDebtPayments: 13000000,
    revenue: 110000000,
    payroll: 44000000,
    opCosts: 26000000,
    businessCashReserves: 70000000,
    cogs: 42000000,
    currentAssets: 85000000,
    currentLiabilities: 70000000,
    receivablesOver90: 8000000,
    totalReceivables: 25000000,
    topClientShare: 0.35,
  },
};

export const DEMO_SCENARIO_GRADE_D: DemoScenario = {
  id: 'grade_d_vulnerable',
  name: 'Bisnis Rentan Tekanan Kas & Beban Utang',
  nameEn: 'Vulnerable Business & High Debt Load',
  targetGrade: 'D',
  badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  description: 'DSR 45% mendekati batas kritis, nafas kas 4 bulan, butuh efisiensi biaya.',
  descriptionEn: 'DSR 45% approaching danger threshold, runway 4 months, needs cost cuts.',
  data: {
    monthlyIncome: 30000000,
    monthlyExpenses: 28000000,
    cashAvailable: 40000000,
    monthlyDebtPayments: 13500000,
    revenue: 90000000,
    payroll: 42000000,
    opCosts: 22000000,
    businessCashReserves: 35000000,
    cogs: 34000000,
    currentAssets: 55000000,
    currentLiabilities: 65000000,
    receivablesOver90: 12000000,
    totalReceivables: 30000000,
    topClientShare: 0.45,
  },
};

export const DEMO_SCENARIO_GRADE_E: DemoScenario = {
  id: 'grade_e_critical',
  name: 'Krisis Likuiditas & Restrukturisasi (Abell RJ)',
  nameEn: 'Critical Liquidity & Restructuring (Abell RJ)',
  targetGrade: 'E',
  badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  description: 'Arus kas nol, DSR 50%, margin negatif -43%, butuh intervensi darurat 7 hari.',
  descriptionEn: 'Zero net cashflow, DSR 50%, negative margin -43%, needs urgent 7-day turnaround.',
  data: DEMO_DATA_ABELL,
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  DEMO_SCENARIO_GRADE_A,
  DEMO_SCENARIO_GRADE_B,
  DEMO_SCENARIO_GRADE_C,
  DEMO_SCENARIO_GRADE_D,
  DEMO_SCENARIO_GRADE_E,
];

let lastScenarioIndex = -1;
export const getRandomDemoScenario = (): DemoScenario => {
  let nextIndex: number;
  if (DEMO_SCENARIOS.length === 1) return DEMO_SCENARIOS[0];
  do {
    nextIndex = Math.floor(Math.random() * DEMO_SCENARIOS.length);
  } while (nextIndex === lastScenarioIndex);
  lastScenarioIndex = nextIndex;
  return DEMO_SCENARIOS[nextIndex];
};
