
export type Language = 'en' | 'id';

export interface FinancialInputs {
  // Personal
  monthlyIncome: number;
  monthlyExpenses: number;
  cashAvailable: number; // Personal Emergency Fund
  monthlyDebtPayments: number;
  
  // Business
  revenue: number;
  payroll: number;
  opCosts: number;
  businessCashReserves: number;
  
  // Extended / Advanced
  cogs: number;
  currentAssets: number;
  currentLiabilities: number;
  receivablesOver90: number; // For AR Aging
  totalReceivables: number;
  topClientShare: number; // 0.0 to 1.0
}

export interface SubScore {
  score: number; // 0 - 100
  label: string;
  valueDisplay: string;
  status: 'critical' | 'warning' | 'healthy' | 'excellent';
  description: string;
}

export interface ActionItem {
  priority: string; // Changed to string to support localized values
  title: string;
  description: string;
  effort?: string;
  steps?: string[];
  priorityCode?: 'immediate' | 'short' | 'strategic'; // Added for consistent styling regardless of language
}

export interface CalculationResult {
  totalScore: number;
  grade: string;
  subScores: {
    cfh: SubScore; // Cashflow Health
    dsr: SubScore; // Debt Service Ratio
    efc: SubScore; // Emergency Fund Coverage
    runway: SubScore; // Business Runway
    profitability: SubScore; // Net Margin
    payroll: SubScore; // Payroll Efficiency
    liquidity: SubScore; // Current Ratio
  };
  metrics: {
    netCashflow: number;
    dsrRatio: number;
    efcMonths: number;
    monthlyBurn: number;
    runwayMonths: number;
    netMargin: number;
    payrollRatio: number;
    currentRatio: number;
  };
  actionPlan: ActionItem[];
}

export interface HistoryEntry {
  timestamp: string;
  totalScore: number;
  netCashflow: number;
  runwayMonths: number;
}
