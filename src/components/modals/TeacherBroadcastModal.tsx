import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { X, Send, Megaphone, Users, Sparkles } from 'lucide-react';

export const TeacherBroadcastModal: React.FC = () => {
  const { showBroadcastModal, setShowBroadcastModal, broadcastAnnouncement } = useExam();

  const [targetGroup, setTargetGroup] = useState<'all' | 'selected'>('all');
  const [customMessage, setCustomMessage] = useState('');

  if (!showBroadcastModal) return null;

  const quickPresets = [
    'You have 15 minutes remaining in the examination session.',
    'Please do not switch browser tabs or exit full-screen mode.',
    'Technical issue has been resolved. You may continue your paper.',
    'Please ensure all subjective answers are saved before time expires.',
  ];

  const handleSend = () => {
    if (!customMessage.trim()) return;
    broadcastAnnouncement(targetGroup, customMessage);
    setCustomMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Broadcast Teacher Announcement</h2>
              <p className="text-xs text-slate-400">
                Send real-time banner alert to candidate exam screens
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBroadcastModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Target Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Audience Target
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetGroup('all')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  targetGroup === 'all'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>All Active Students (45)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetGroup('selected')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  targetGroup === 'selected'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  <span>Flagged / Warning Students (3)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Quick Preset Announcements
            </label>
            <div className="space-y-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomMessage(preset)}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 rounded-lg text-xs text-slate-800 transition-colors"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>

          {/* Custom Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Message
            </label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type announcement message here..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setShowBroadcastModal(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!customMessage.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Announcement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
