import React from 'react';
import {
  Sliders,
  ShieldAlert,
  Save,
  CheckCircle,
  AlertTriangle,
  Info,
  Smartphone,
  Eye,
  Volume2,
  Monitor,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { RuleSetting } from '../types';

export const RulesSettingsView: React.FC = () => {
  const { rules, toggleRule, updateRuleConfig, addToast } = useExam();

  const handleSliderChange = (ruleId: string, key: keyof RuleSetting, value: number) => {
    updateRuleConfig(ruleId, { [key]: value });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Prominent Responsible AI Policy Disclaimer Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl border border-blue-700/50 shadow-md flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-sm text-blue-200">
            Responsible AI & Human-in-the-Loop Governance Notice
          </div>
          <p className="text-slate-300 leading-relaxed">
            “AI detections are indicators only. Final disciplinary decisions require authorized human review.
            ExamGuard AI assists proctors by flagging probable anomalies; facial behavior, background noise, or network blips must be evaluated in context.”
          </p>
        </div>
      </div>

      {/* Global Risk Level Threshold Configuration */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Overall Risk Score Tier Thresholds
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="font-bold text-emerald-900 block text-sm">Normal Tier</span>
            <span className="text-emerald-700 font-semibold">0 — 9 Risk Points</span>
            <p className="text-[11px] text-emerald-600 mt-1">Standard candidate session. No interventions.</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-bold text-blue-900 block text-sm">Low Risk</span>
            <span className="text-blue-700 font-semibold">10 — 24 Risk Points</span>
            <p className="text-[11px] text-blue-600 mt-1">Minor events recorded. Automated logs created.</p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="font-bold text-amber-900 block text-sm">Review Recommended</span>
            <span className="text-amber-700 font-semibold">25 — 49 Risk Points</span>
            <p className="text-[11px] text-amber-600 mt-1">Proctor flag raised. Review recommended.</p>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="font-bold text-red-900 block text-sm">High Risk</span>
            <span className="text-red-700 font-semibold">50+ Risk Points</span>
            <p className="text-[11px] text-red-600 mt-1">Immediate intervention & session audit required.</p>
          </div>
        </div>
      </div>

      {/* Malpractice Detection Rules List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Configurable Computer Vision & AI Detection Rules</h3>

        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 bg-white rounded-xl border transition-all shadow-xs ${
                rule.enabled ? 'border-slate-200 hover:border-blue-300' : 'border-slate-200 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{rule.name}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {rule.code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {rule.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{rule.description}</p>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600">
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${
                        rule.enabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Rule Parameters Sliders & Toggles */}
              {rule.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
                  {/* Risk Points */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Risk Weight:</span>
                      <span className="text-blue-600 font-bold">+{rule.riskPoints} pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={rule.riskPoints}
                      onChange={(e) => handleSliderChange(rule.id, 'riskPoints', Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* AI Confidence Threshold */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Confidence Threshold:</span>
                      <span className="text-blue-600 font-bold">{rule.confidenceThresholdPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="75"
                      max="99"
                      value={rule.confidenceThresholdPct}
                      onChange={(e) => handleSliderChange(rule.id, 'confidenceThresholdPct', Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Min Event Duration */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Min Duration:</span>
                      <span className="text-blue-600 font-bold">{rule.minDurationSec}s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={rule.minDurationSec}
                      onChange={(e) => handleSliderChange(rule.id, 'minDurationSec', Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Feature Checkbox Toggles */}
                  <div className="flex flex-col justify-center gap-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={rule.autoWarning}
                        onChange={(e) => updateRuleConfig(rule.id, { autoWarning: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Auto Warning Modal</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={rule.autoPause}
                        onChange={(e) => updateRuleConfig(rule.id, { autoPause: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Auto Pause Exam</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
