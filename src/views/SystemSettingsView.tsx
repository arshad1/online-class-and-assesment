import React, { useState } from 'react';
import { Settings, Video, Globe, CheckCircle, Shield } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export const SystemSettingsView: React.FC = () => {
  const { addToast } = useExam();

  const [meetSyncEnabled, setMeetSyncEnabled] = useState(true);
  const [autoGenMeet, setAutoGenMeet] = useState(true);

  const handleSave = () => {
    addToast('Settings Saved', 'System configurations and Google Meet integration preferences saved.', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-xs">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Organization & Platform Configuration
            </h2>
            <p className="text-xs text-slate-500">Apex National University &bull; Enterprise Proctoring License</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
          >
            Save Changes
          </button>
        </div>

        {/* Google Workspace & Google Meet Integration Panel */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  Google Meet & Workspace for Education Integration
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    CONNECTED
                  </span>
                </h3>
                <p className="text-slate-600 text-xs">
                  Automate Google Meet room generation and sync candidates with Google Classroom & Workspace
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-blue-200/60">
            <label className="flex items-start gap-3 p-3 bg-white border border-blue-100 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={meetSyncEnabled}
                onChange={(e) => setMeetSyncEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded mt-0.5"
              />
              <div>
                <span className="font-bold text-slate-900 block">Enable Google Meet Proctoring Rooms</span>
                <span className="text-slate-500 text-[11px]">
                  Allows proctors to launch 1-on-1 Google Meet verification calls directly from candidate detail drawers.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white border border-blue-100 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenMeet}
                onChange={(e) => setAutoGenMeet(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded mt-0.5"
              />
              <div>
                <span className="font-bold text-slate-900 block">Auto-Generate Meet Links per Exam</span>
                <span className="text-slate-500 text-[11px]">
                  Automatically creates dedicated Google Calendar + Meet links when scheduling new proctored exams.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">System & AI Integration Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">AI Computer Vision Model</span>
              <p className="text-slate-500">Select active object detection and facial embedding neural model.</p>
              <select className="w-full p-2 bg-white border rounded text-xs">
                <option>YOLOv8 + FaceNet v4.2 (High Accuracy - Recommended)</option>
                <option>MobileNet Light (Low Bandwidth Mode)</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">Evidence Video Retention</span>
              <p className="text-slate-500">Automatic deletion schedule for webcam and screen recordings.</p>
              <select className="w-full p-2 bg-white border rounded text-xs">
                <option>90 Days (Standard Compliance)</option>
                <option>30 Days</option>
                <option>180 Days</option>
                <option>1 Year (Legal Hold)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
