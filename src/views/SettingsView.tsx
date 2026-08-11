import React from 'react';
import { useExam } from '../context/ExamContext';
import { Settings, ShieldCheck, Bell, Award, BookOpen, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { resultSettings, updateResultSettings, addToast } = useExam();

  const handleSave = () => {
    addToast('Settings Saved', 'System configurations updated successfully', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Exam Module Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500">
          Configure default grading policies, security rules, and notification preferences
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Grading Scale Settings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Grading Scale & Cutoffs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Standard Passing Percentage (%)
              </label>
              <input
                type="number"
                value={resultSettings.passingPercentage}
                onChange={(e) => updateResultSettings({ passingPercentage: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Result Publishing Window
              </label>
              <input
                type="text"
                defaultValue="24 Hours Post Exam Completion"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Security & Proctoring Defaults */}
        <div className="space-y-3 border-t border-slate-200 pt-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security & Security Controls Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Enforce Tab Switch Detection by Default', enabled: true },
              { label: 'Prevent Copy/Paste Clipboard Actions', enabled: true },
              { label: 'Mandatory Fullscreen Browser Mode', enabled: true },
              { label: 'Auto-Submit Exam on Countdown Expiry', enabled: true },
            ].map((rule, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">{rule.label}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                  ENABLED
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save System Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
