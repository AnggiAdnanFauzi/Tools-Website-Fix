import { calculateFinancialHealth } from './calculator';
import { FinancialInputs } from '../types';

// Fix for missing test runner type definitions
declare const describe: any;
declare const test: any;
declare const expect: any;

// Helper to create valid baseline data
const createInputs = (overrides: Partial<FinancialInputs> = {}): FinancialInputs => ({
  monthlyIncome: 20000000,
  monthlyExpenses: 10000000, // Net +10m
  cashAvailable: 60000000, // 6 months EFC
  monthlyDebtPayments: 2000000, // 10% DSR
  revenue: 100000000,
  payroll: 20000000, // 20%
  opCosts: 10000000,
  businessCashReserves: 200000000,
  cogs: 20000000,
  currentAssets: 50000000,
  currentLiabilities: 20000000, // 2.5 Ratio
  receivablesOver90: 0,
  totalReceivables: 10000000,
  topClientShare: 0.1, // 10%
  ...overrides
});

describe('calculateFinancialHealth', () => {
  
  describe('Cashflow Health (CFH)', () => {
    test('gives max score (100) for healthy surplus', () => {
      // 10m income, 5m expense -> 5m surplus. 5m/10m = 50%. 40 + 0.5*300 = 190 -> capped at 100.
      const inputs = createInputs({ monthlyIncome: 10000000, monthlyExpenses: 5000000 });
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.cfh.score).toBe(100);
      expect(result.metrics.netCashflow).toBe(5000000);
    });

    test('gives minimum score (40) for negative cashflow', () => {
      const inputs = createInputs({ monthlyIncome: 10000000, monthlyExpenses: 12000000 });
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.cfh.score).toBe(40);
      expect(result.subScores.cfh.status).toBe('warning');
    });

    test('handles zero income edge case gracefully', () => {
      const inputs = createInputs({ monthlyIncome: 0, monthlyExpenses: 5000000 });
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.cfh.score).toBe(40);
    });
  });

  describe('Debt Service Ratio (DSR)', () => {
    test('score 100 for DSR <= 20%', () => {
      const inputs = createInputs({ monthlyIncome: 10000000, monthlyDebtPayments: 1000000 }); // 10%
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.dsr.score).toBe(100);
    });

    test('calculates linear degradation for 20% < DSR <= 35%', () => {
      // DSR 27.5% (midpoint of 20-35). Score should be midpoint of 80-60 -> 70.
      const inputs = createInputs({ monthlyIncome: 10000000, monthlyDebtPayments: 2750000 }); 
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.dsr.score).toBeCloseTo(70, 0);
    });

    test('calculates linear degradation for 35% < DSR <= 50%', () => {
      // DSR 42.5% (midpoint of 35-50). Score should be midpoint of 60-30 -> 45.
      const inputs = createInputs({ monthlyIncome: 10000000, monthlyDebtPayments: 4250000 });
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.dsr.score).toBeCloseTo(45, 0);
    });

    test('returns 20 for DSR > 50% (Critical)', () => {
      const inputs = createInputs({ monthlyIncome: 10000000, monthlyDebtPayments: 6000000 }); // 60%
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.dsr.score).toBeLessThanOrEqual(20); // The logic sets a default of 20 that isn't overwritten
    });
  });

  describe('Emergency Fund Coverage (EFC)', () => {
    test('score 100 for >= 12 months', () => {
      const inputs = createInputs({ monthlyExpenses: 5000000, cashAvailable: 60000000 });
      expect(calculateFinancialHealth(inputs).subScores.efc.score).toBe(100);
    });
    
    test('score 30 for 1-3 months', () => {
      const inputs = createInputs({ monthlyExpenses: 5000000, cashAvailable: 10000000 }); // 2 months
      expect(calculateFinancialHealth(inputs).subScores.efc.score).toBe(30);
    });

    test('score 10 for < 1 month', () => {
      const inputs = createInputs({ monthlyExpenses: 5000000, cashAvailable: 2500000 }); // 0.5 months
      expect(calculateFinancialHealth(inputs).subScores.efc.score).toBe(10);
      expect(calculateFinancialHealth(inputs).subScores.efc.status).toBe('critical');
    });
  });

  describe('Business Runway', () => {
    test('infinite runway (100) when burn is zero or negative', () => {
      // Revenue 100m, Costs 50m. Profitable. Burn is 0.
      const inputs = createInputs({ revenue: 100000000, cogs: 20000000, payroll: 20000000, opCosts: 10000000 });
      const result = calculateFinancialHealth(inputs);
      expect(result.subScores.runway.score).toBe(100);
      expect(result.metrics.monthlyBurn).toBe(0);
    });

    test('calculates finite runway correctly', () => {
      // Revenue 0, Costs 10m. Burn 10m. Cash 50m. Runway 5 months.
      const inputs = createInputs({ 
        revenue: 0, 
        cogs: 0, 
        payroll: 5000000, 
        opCosts: 5000000, 
        businessCashReserves: 50000000 
      });
      const result = calculateFinancialHealth(inputs);
      expect(result.metrics.monthlyBurn).toBe(10000000);
      expect(result.metrics.runwayMonths).toBe(5);
      // 3 <= 5 < 6 should be score 50
      expect(result.subScores.runway.score).toBe(50);
    });
  });

  describe('Profitability & Efficiency', () => {
    test('Net Margin scoring', () => {
      // 20% margin -> 100
      let inputs = createInputs({ revenue: 100, cogs: 50, payroll: 10, opCosts: 10, monthlyDebtPayments: 10 }); 
      expect(calculateFinancialHealth(inputs).subScores.profitability.score).toBe(100);

      // Loss -> Score 10
      inputs = createInputs({ revenue: 100, cogs: 120 });
      expect(calculateFinancialHealth(inputs).subScores.profitability.score).toBe(10);
    });

    test('Payroll Efficiency scoring', () => {
      // Payroll 15% of revenue -> 100
      let inputs = createInputs({ revenue: 1000, payroll: 150 });
      expect(calculateFinancialHealth(inputs).subScores.payroll.score).toBe(100);

      // Payroll 60% of revenue -> 20
      inputs = createInputs({ revenue: 1000, payroll: 600 });
      expect(calculateFinancialHealth(inputs).subScores.payroll.score).toBe(20);
    });
  });

  describe('Advanced Logic & Penalties', () => {
    test('Liquidity scoring (Current Ratio)', () => {
      // Ratio 2.0 -> 100
      expect(calculateFinancialHealth(createInputs({ currentAssets: 200, currentLiabilities: 100 })).subScores.liquidity.score).toBe(100);
      // Ratio 0.5 -> 30
      expect(calculateFinancialHealth(createInputs({ currentAssets: 50, currentLiabilities: 100 })).subScores.liquidity.score).toBe(30);
    });

    test('Top Client Concentration Penalty', () => {
      // Setup a good score first
      const goodInputs = createInputs();
      const baseScore = calculateFinancialHealth(goodInputs).totalScore;

      // Increase client share to > 0.30
      const riskyInputs = createInputs({ topClientShare: 0.5 });
      const riskyResult = calculateFinancialHealth(riskyInputs);

      // Check for penalty (approx -10 from weighted average)
      // Since we can't know exact float math, we check if it generated the warning action
      const hasWarning = riskyResult.actionPlan.some(a => a.title.includes('Diversify') || a.title.includes('Klien'));
      expect(hasWarning).toBe(true);
      
      // And strictly speaking score should be lower than base
      expect(riskyResult.totalScore).toBeLessThan(baseScore);
    });
  });

  describe('Localization & formatting', () => {
    test('returns English labels by default', () => {
      const result = calculateFinancialHealth(createInputs());
      expect(result.subScores.cfh.label).toBe('Cashflow Health');
    });

    test('returns Indonesian labels when requested', () => {
      const result = calculateFinancialHealth(createInputs(), 'id');
      expect(result.subScores.cfh.label).toBe('Kesehatan Arus Kas');
      expect(result.actionPlan[0]?.steps).toBeDefined(); // Should have steps
    });
  });

});
