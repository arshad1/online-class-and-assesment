import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Clock,
  Volume2,
  Maximize2,
  Info,
  Send,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { MalpracticeAlert } from '../types';

export const EvidenceReviewView: React.FC = () => {
  const { alerts, selectedAlert, setSelectedAlert, updateAlertStatus, addToast } = useExam();

  const activeAlert: MalpracticeAlert = selectedAlert || alerts[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTabState] = useState<'webcam' | 'screen' | 'audio'>('webcam');
  const [reviewerComment, setReviewerComment] = useState('');

  const handleDecision = (decision: MalpracticeAlert['status'], customNote: string) => {
    if (decision === 'confirmed' && !reviewerComment.trim()) {
      addToast('Comment Required', 'Please enter a reviewer justification comment before confirming malpractice.', 'warning');
      return;
    }

    const note = reviewerComment.trim() ? `${customNote}: "${reviewerComment.trim()}"` : customNote;
    updateAlertStatus(activeAlert.id, decision, note);
    setReviewerComment('');
  };

  // Prev / Next Alert navigators
  const currentIndex = alerts.findIndex((a) => a.id === activeAlert.id);
  const handlePrev = () => {
    if (currentIndex > 0) setSelectedAlert(alerts[currentIndex - 1]);
  };
  const handleNext = () => {
    if (currentIndex < alerts.length - 1) setSelectedAlert(alerts[currentIndex + 1]);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Workspace Header Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileSearch className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Evidence Review Workspace</h2>
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 text-blue-400 rounded border border-slate-700">
                {activeAlert.alertCode}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multimodal video, screen capture & audio waveform forensic analysis
            </p>
          </div>
        </div>

        {/* Prev / Next Navigation */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Evidence</span>
          </button>
          <span className="text-slate-400 font-medium">
            {currentIndex + 1} of {alerts.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === alerts.length - 1}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg flex items-center gap-1 transition-colors"
          >
            <span>Next Evidence</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Evidence Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Student & Session Meta (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="text-center pb-4 border-b border-slate-100">
              <img
                src={activeAlert.studentPhoto}
                alt={activeAlert.studentName}
                className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-slate-100 shadow-sm mb-3"
              />
              <h3 className="text-base font-bold text-slate-900">{activeAlert.studentName}</h3>
              <p className="text-xs text-slate-500 font-mono">{activeAlert.admissionNo}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                Session Risk: {activeAlert.riskPoints + 35}/100
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Exam Information
              </h4>
              <div><strong className="text-slate-800">Exam:</strong> {activeAlert.examTitle}</div>
              <div><strong className="text-slate-800">Subject:</strong> Physics & Dynamics</div>
              <div><strong className="text-slate-800">Timestamp:</strong> {activeAlert.timestamp}</div>
              <div><strong className="text-slate-800">Workstation IP:</strong> 192.168.1.104</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Violations Flagged:</span>
                <span className="font-bold text-red-600">3 events</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI Confidence:</span>
                <span className="font-bold text-blue-600">{activeAlert.confidenceScore}% match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Multimodal Media Players (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Media View Selector Tabs */}
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTabState('webcam')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'webcam' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Webcam Feed
              </button>
              <button
                onClick={() => setActiveTabState('screen')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'screen' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Screen Capture
              </button>
              <button
                onClick={() => setActiveTabState('audio')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'audio' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Audio Waveform
              </button>
            </div>
            <span className="text-xs font-bold text-slate-500">Recorded Frame #412</span>
          </div>

          {/* Main Media Player Player Screen */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 aspect-video relative overflow-hidden shadow-lg flex items-center justify-center">
            {activeTab === 'webcam' && (
              <>
                <img
                  src={activeAlert.webcamSnapshotUrl || activeAlert.studentPhoto}
                  alt="Webcam frame"
                  className="w-full h-full object-cover opacity-90"
                />
                {/* Simulated Computer Vision Box */}
                <div className="absolute top-1/4 left-1/3 w-40 h-40 border-2 border-red-500 bg-red-500/15 rounded-lg p-2 animate-pulse">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    {activeAlert.violationType} ({activeAlert.confidenceScore}%)
                  </span>
                </div>
              </>
            )}

            {activeTab === 'screen' && (
              <>
                <img
                  src={
                    activeAlert.screenSnapshotUrl ||
                    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
                  }
                  alt="Screen capture frame"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs px-3 py-1 rounded-lg border border-slate-700">
                  Dual Monitor Window Blur Flag (Focus Loss: 14s)
                </div>
              </>
            )}

            {activeTab === 'audio' && (
              <div className="w-full h-full p-8 flex flex-col items-center justify-center text-white space-y-6">
                <Volume2 className="w-12 h-12 text-blue-400 animate-bounce" />
                <div className="text-center">
                  <h4 className="text-sm font-bold">Acoustic Spectrum & Voice Activity</h4>
                  <p className="text-xs text-slate-400">Isolated 3.2 kHz Speech Pattern Detected</p>
                </div>
                {/* Audio Waveform Animation Bars */}
                <div className="flex items-center gap-1.5 h-16 w-full max-w-md justify-center">
                  {[40, 70, 25, 90, 60, 85, 30, 95, 50, 80, 45, 100, 65, 35, 75, 55, 85].map(
                    (val, idx) => (
                      <span
                        key={idx}
                        className="w-2 bg-blue-500 rounded-full animate-wave"
                        style={{ height: `${val}%`, animationDelay: `${idx * 0.1}s` }}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Playback Controls Scrubber Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 p-4 space-y-2 text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative">
                  <div className="h-full bg-blue-500 w-2/5 rounded-full" />
                </div>
                <span className="text-xs font-mono text-slate-400">00:14 / 00:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: AI Details, Review Form & Audit Log (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Triggered Rule Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Triggered AI Rule Details
            </h3>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
              <div className="font-bold text-red-900">{activeAlert.violationType}</div>
              <p className="text-[11px] text-red-700">
                Rule ID: RL-MOBILE-05 &bull; Risk Weight: +{activeAlert.riskPoints} Points
              </p>
            </div>

            {/* Candidate Pre/Post Event Audit */}
            <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-semibold text-slate-700">Candidate Audit (-30s / +30s)</h4>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                Candidate paused on Question #18 for 42s prior to object detection.
              </div>
            </div>
          </div>

          {/* Reviewer Decision Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Proctor Decision & Justification
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reviewer Note / Justification:
              </label>
              <textarea
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="Enter formal proctor rationale before confirming malpractice..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Decision Buttons Stack */}
            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleDecision('confirmed', 'Confirmed Malpractice Violation')}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Malpractice</span>
              </button>

              <button
                onClick={() => handleDecision('dismissed', 'Dismissed Alert (False Positive)')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4 text-slate-400" />
                <span>Dismiss Alert</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleDecision('under_review', 'Escalated for Senior Proctor Review')}
                  className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors text-[11px]"
                >
                  Needs Review
                </button>
                <button
                  onClick={() => handleDecision('warning_sent', 'Issued Warning to Candidate')}
                  className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg transition-colors text-[11px]"
                >
                  Student Warning
                </button>
              </div>
            </div>
          </div>

          {/* Audit Trail Log */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Formal Audit History
            </h3>
            <div className="space-y-2 text-xs">
              {activeAlert.auditLog?.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center justify-between font-semibold text-slate-900 text-[11px]">
                    <span>{log.reviewer}</span>
                    <span className="text-slate-400 font-normal">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{log.action}</p>
                  {log.comment && <p className="text-[11px] text-blue-700 italic mt-1">{log.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
