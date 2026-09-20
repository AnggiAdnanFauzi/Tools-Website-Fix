
import React from 'react';
import { CalculationResult, FinancialInputs, SubScore, Language } from '../types';
import { TEXT } from '../services/translations';
import { Clock, CheckSquare } from 'lucide-react';

interface Props {
  inputs: FinancialInputs;
  results: CalculationResult;
  lang: Language;
  checkedSteps: Record<string, boolean>;
}

const ReportView: React.FC<Props> = ({ inputs, results, lang, checkedSteps }) => {
  const t = TEXT[lang];
  const date = new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  // Annualized calculations
  const annualRevenue = inputs.revenue * 12;
  const annualCOGS = inputs.cogs * 12;
  const annualPayroll = inputs.payroll * 12;
  const annualNetProfit = (inputs.revenue - inputs.cogs - inputs.payroll - inputs.opCosts - inputs.monthlyDebtPayments) * 12;

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[10mm] text-slate-900 print:p-0 print:max-w-none">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">{t.reportTitle}</h1>
          <p className="text-slate-500 mt-1">{t.reportSubtitle}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{date}</p>
          <p className="text-sm text-slate-500">{t.generatedBy}</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-8 break-inside-avoid">
        <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-2 mb-4 text-slate-700">{t.execSummary}</h2>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center bg-slate-50 p-6 rounded-lg border border-slate-200">
           <div className="text-center shrink-0 w-full sm:w-auto pb-4 sm:pb-0 border-b sm:border-b-0 border-slate-200">
              <div className="text-5xl font-bold mb-2">{Math.round(results.totalScore)}</div>
              <div className="px-4 py-1 bg-slate-800 text-white rounded-full text-sm font-bold inline-block">Grade {results.grade}</div>
           </div>
           <div className="sm:border-l border-slate-200 sm:pl-8 flex-1 w-full">
              <h3 className="font-bold mb-2">{t.keyDiagnosis}</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                 {results.subScores.cfh.status === 'critical' && <li>{results.subScores.cfh.description}</li>}
                 {results.subScores.dsr.status !== 'healthy' && results.subScores.dsr.status !== 'excellent' && <li>{results.subScores.dsr.description}</li>}
                 {results.subScores.runway.score < 50 && <li>{results.subScores.runway.description}</li>}
                 {results.actionPlan.length > 0 ? (
                    <li>Top Priority: {results.actionPlan[0].title}</li>
                 ) : (
                    <li>Financials appear stable. Focus on growth.</li>
                 )}
              </ul>
           </div>
        </div>
      </div>

      {/* Metric Analysis */}
      <div className="mb-8 break-inside-avoid">
        <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-2 mb-4 text-slate-700">{t.metricAnalysis}</h2>
        <div className="overflow-x-auto w-full border border-slate-200 rounded-lg">
          <table className="w-full text-sm text-left min-w-[500px]">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs">
              <tr>
                <th className="p-3">{t.thMetric}</th>
                <th className="p-3">{t.thScore}</th>
                <th className="p-3">{t.thValue}</th>
                <th className="p-3">{t.thAssessment}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(Object.values(results.subScores) as SubScore[]).map((sub, i) => (
                <tr key={i}>
                  <td className="p-3 font-medium">{sub.label}</td>
                  <td className="p-3 font-mono">{sub.score}/100</td>
                  <td className="p-3">{sub.valueDisplay}</td>
                  <td className={`p-3 font-medium ${sub.status === 'critical' ? 'text-red-600' : sub.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {sub.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yearly Financial Summary */}
      <div className="mb-8 break-inside-avoid">
        <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-2 mb-4 text-slate-700">{t.yearlySummary}</h2>
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">{t.annualRevenue}</div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(annualRevenue)}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">{t.annualCOGS}</div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(annualCOGS)}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">{t.annualPayroll}</div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(annualPayroll)}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">{t.annualNetProfit}</div>
                    <div className={`text-lg font-bold ${annualNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(annualNetProfit)}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="mb-8 break-inside-avoid">
        <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-2 mb-4 text-slate-700">{t.recActions}</h2>
        <div className="space-y-6">
           {results.actionPlan.map((action, idx) => (
             <div key={idx} className="border border-slate-200 p-4 rounded-lg bg-white shadow-sm break-inside-avoid">
                <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm text-slate-500 uppercase tracking-wider">{action.priority}</div>
                    {action.effort && (
                        <div className="flex items-center gap-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">
                            <Clock size={12} />
                            {action.effort}
                        </div>
                    )}
                </div>
                <div className="font-bold text-lg mb-2 text-slate-900">{action.title}</div>
                <div className="text-sm text-slate-700 mb-4">{action.description}</div>
                
                {action.steps && action.steps.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded border border-slate-100">
                        <div className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-1">
                            <CheckSquare size={12} /> {t.executionChecklist}
                        </div>
                        <ul className="space-y-2">
                            {action.steps.map((step, sIdx) => {
                                const stepKey = `action-${idx}-step-${sIdx}`;
                                const isChecked = !!checkedSteps[stepKey];
                                return (
                                    <li key={sIdx} className="text-sm text-slate-800 flex items-start gap-2">
                                        <div className={`mt-0.5 w-3.5 h-3.5 border rounded flex items-center justify-center shrink-0 ${
                                            isChecked 
                                                ? 'bg-blue-600 border-blue-600' 
                                                : 'border-slate-400 bg-white'
                                        }`}>
                                            {isChecked && (
                                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={isChecked ? 'line-through text-slate-400 font-normal' : ''}>{step}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
             </div>
           ))}
           {results.actionPlan.length === 0 && <p className="text-slate-500 italic">{t.noActions}</p>}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="mt-12 pt-8 border-t-2 border-slate-100 break-inside-avoid">
        <h2 className="text-xs font-bold uppercase text-slate-400 mb-4">{t.auditTrail}</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono text-slate-500">
            {Object.entries(inputs).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-slate-50 pb-1">
                    <span>{key}</span>
                    <span>{typeof val === 'number' && key !== 'topClientShare' ? formatCurrency(val) : val}</span>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default ReportView;
