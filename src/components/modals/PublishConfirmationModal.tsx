import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { X, Award, CheckCircle2, Mail, Bell, Smartphone, AlertTriangle } from 'lucide-react';

export const PublishConfirmationModal: React.FC = () => {
  const {
    showPublishConfirmationModal,
    setShowPublishConfirmationModal,
    publishExamResults,
    selectedExamId,
    scheduledExams,
  } = useExam();

  const [notifyApp, setNotifyApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyParent, setNotifyParent] = useState(false);

  if (!showPublishConfirmationModal) return null;

  const currentExam = scheduledExams.find((e) => e.id === selectedExamId) || scheduledExams[0];

  const handleConfirmPublish = () => {
    publishExamResults(currentExam?.id || 'exam-101', {
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
              <p className="text-xs text-slate-400">Final Confirmation & Notification Settings</p>
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
                Publishing will lock all scores and make the official report cards visible to all 45 candidates of{' '}
                <strong>{currentExam?.title}</strong> on their portals.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-800">
              Automated Notification Channels
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
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

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
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

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
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
            <span>Confirm & Publish Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};
