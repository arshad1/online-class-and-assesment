import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { Settings, ShieldCheck, Bell, Award, BookOpen, Save, UserCheck, Plus, Clock, Eye, AlertCircle } from 'lucide-react';
import { StudentAccommodation } from '../types';

export const SettingsView: React.FC = () => {
  const { resultSettings, updateResultSettings, accommodations, saveAccommodation, addToast } = useExam();

  const [showAccModal, setShowAccModal] = useState(false);
  const [editingAcc, setEditingAcc] = useState<Partial<StudentAccommodation>>({
    studentId: '',
    studentName: '',
    admissionNo: '',
    class: 'Grade 12',
    extraTimeMultiplier: 1.5,
    relaxedProctoringSensitivity: true,
    allowedBreakMinutes: 15,
    allowScreenReader: true,
    highContrastTheme: false,
    notes: '',
    approvedBy: 'Academic Committee',
  });

  const handleSave = () => {
    addToast('Settings Saved', 'System configurations updated successfully', 'success');
  };

  const handleSaveAcc = () => {
    if (!editingAcc.studentName || !editingAcc.admissionNo) {
      addToast('Validation Error', 'Please specify student name and admission number', 'warning');
      return;
    }
    const acc: StudentAccommodation = {
      id: editingAcc.id || `acc-${Date.now()}`,
      studentId: editingAcc.studentId || `st-${Date.now()}`,
      studentName: editingAcc.studentName,
      admissionNo: editingAcc.admissionNo,
      class: editingAcc.class || 'Grade 10',
      extraTimeMultiplier: editingAcc.extraTimeMultiplier || 1.25,
      relaxedProctoringSensitivity: editingAcc.relaxedProctoringSensitivity ?? true,
      allowedBreakMinutes: editingAcc.allowedBreakMinutes || 10,
      allowScreenReader: editingAcc.allowScreenReader ?? false,
      highContrastTheme: editingAcc.highContrastTheme ?? false,
      notes: editingAcc.notes || 'Approved institutional accommodation',
      approvedBy: editingAcc.approvedBy || 'Academic Coordinator',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    saveAccommodation(acc);
    setShowAccModal(false);
    addToast('Accommodation Saved', `Approved accommodation saved for ${acc.studentName}`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Exam Module Settings & Accessibility Accommodations
        </h2>
        <p className="text-xs text-slate-500">
          Configure default grading policies, security rules, and student accessibility accommodations
        </p>
      </div>

      {/* Accommodations & Accessibility Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-600" />
            Approved Student Accommodations (PRD Sec 106)
          </h3>
          <button
            onClick={() => {
              setEditingAcc({
                studentId: '',
                studentName: '',
                admissionNo: '',
                class: 'Grade 10',
                extraTimeMultiplier: 1.5,
                relaxedProctoringSensitivity: true,
                allowedBreakMinutes: 15,
                allowScreenReader: true,
                highContrastTheme: false,
                notes: '',
                approvedBy: 'Academic Committee',
              });
              setShowAccModal(true);
            }}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg border border-purple-200 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Accommodation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accommodations.map((acc) => (
            <div key={acc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{acc.studentName}</h4>
                  <span className="text-[10px] font-semibold text-slate-500">{acc.admissionNo} • {acc.class}</span>
                </div>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold text-[11px] rounded-full border border-purple-200">
                  {acc.extraTimeMultiplier}x Time
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {acc.relaxedProctoringSensitivity && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                    Relaxed Proctoring
                  </span>
                )}
                {acc.allowedBreakMinutes > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {acc.allowedBreakMinutes}m Break
                  </span>
                )}
                {acc.allowScreenReader && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">
                    Screen Reader
                  </span>
                )}
                {acc.highContrastTheme && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-semibold">
                    High Contrast
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 italic">"{acc.notes}"</p>
              <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-200 pt-1.5">
                <span>Approved by: {acc.approvedBy}</span>
                <span>Updated: {acc.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
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

      {/* Accommodation Modal */}
      {showAccModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-600" />
                Configure Student Accommodation
              </h3>
              <button onClick={() => setShowAccModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    value={editingAcc.studentName || ''}
                    onChange={(e) => setEditingAcc({ ...editingAcc, studentName: e.target.value })}
                    placeholder="e.g. Rohan Verma"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission No. *</label>
                  <input
                    type="text"
                    value={editingAcc.admissionNo || ''}
                    onChange={(e) => setEditingAcc({ ...editingAcc, admissionNo: e.target.value })}
                    placeholder="e.g. ADM-2024-102"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Multiplier</label>
                  <select
                    value={editingAcc.extraTimeMultiplier || 1.5}
                    onChange={(e) => setEditingAcc({ ...editingAcc, extraTimeMultiplier: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value={1.0}>1.0x (Standard Time)</option>
                    <option value={1.25}>1.25x (+25% Extra Time)</option>
                    <option value={1.5}>1.5x (+50% Extra Time)</option>
                    <option value={2.0}>2.0x (Double Time)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Break Time (Minutes)</label>
                  <input
                    type="number"
                    value={editingAcc.allowedBreakMinutes || 0}
                    onChange={(e) => setEditingAcc({ ...editingAcc, allowedBreakMinutes: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAcc.relaxedProctoringSensitivity || false}
                    onChange={(e) => setEditingAcc({ ...editingAcc, relaxedProctoringSensitivity: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Relaxed AI Proctoring Sensitivity (Reduce false positive alerts)</span>
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAcc.allowScreenReader || false}
                    onChange={(e) => setEditingAcc({ ...editingAcc, allowScreenReader: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Allow Screen Reader & Speech Assistance</span>
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAcc.highContrastTheme || false}
                    onChange={(e) => setEditingAcc({ ...editingAcc, highContrastTheme: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Force High Contrast / Enlarged Text Mode</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <textarea
                  value={editingAcc.notes || ''}
                  onChange={(e) => setEditingAcc({ ...editingAcc, notes: e.target.value })}
                  placeholder="Details of medical/dyslexia/visual accommodation approval..."
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                onClick={() => setShowAccModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAcc}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Save Accommodation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
