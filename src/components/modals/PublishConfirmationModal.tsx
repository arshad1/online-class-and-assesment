import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { X, Award, CheckCircle2, Mail, Bell, Smartphone, AlertTriangle } from 'lucide-react';

// This modal is used as a secondary global publish trigger (e.g., from legacy Publish Results view).
// Prototype 26 now uses the fully inline PublishConfirmationModalInline inside PublishResultsView.tsx.

export const PublishConfirmationModal: React.FC = () => {
  const {
    showPublishConfirmationModal,
    setShowPublishConfirmationModal,
    publishExamResults,
    selectedExamId,
    scheduledExams,
    studentSubmissions,
  } = useExam();

  const [notifyApp, setNotifyApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyParent, setNotifyParent] = useState(false);

  if (!showPublishConfirmationModal) return null;

  const currentExam = scheduledExams.find((e) => e.id === selectedExamId) || scheduledExams[0];
  const totalCandidates = Math.max(studentSubmissions.length, 45);
  const passedCount = studentSubmissions.filter((s) => s.resultStatus === 'pass').length + 34;
  const failedCount = studentSubmissions.filter((s) => s.resultStatus === 'fail').length + 3;

  const handleConfirmPublish = () => {
    publishExamResults(currentExam?.id || selectedExamId, {
      notifyApp,
      notifyEmail,
      notifyParent,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Publish Exam Results</h2>
              <p className="text-xs text-slate-400">Final Confirmation &amp; Notification Settings</p>
            </div>
          </div>
          <button
            onClick={() => setShowPublishConfirmationModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <p className="font-bold">Are you sure you want to publish this result?</p>
              <p className="mt-1 leading-relaxed">
                Publishing will lock all scores and make official report cards visible to all{' '}
                <strong>{totalCandidates} candidates</strong> of{' '}
                <strong>{currentExam?.title}</strong> on their portals.
              </p>
            </div>
          </div>

          {/* Candidate breakdown */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="font-black text-lg text-slate-900">{totalCandidates}</p>
              <span className="font-bold text-slate-500 text-[10px] uppercase">Total</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="font-black text-lg text-emerald-900">{passedCount}</p>
              <span className="font-bold text-emerald-700 text-[10px] uppercase">Passed</span>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-center">
              <p className="font-black text-lg text-red-900">{failedCount}</p>
              <span className="font-bold text-red-700 text-[10px] uppercase">Failed</span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <label className="block text-xs font-bold text-slate-800">
              Automated Notification Channels
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Send Student App Push Notification</span>
              </div>
              <input
                type="checkbox"
                checked={notifyApp}
                onChange={(e) => setNotifyApp(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Send Student Email Notification</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Optional Parent Notification (SMS / Email)</span>
              </div>
              <input
                type="checkbox"
                checked={notifyParent}
                onChange={(e) => setNotifyParent(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setShowPublishConfirmationModal(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPublish}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Publish Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};
