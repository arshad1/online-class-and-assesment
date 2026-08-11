import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Camera,
  Mic,
  Monitor,
  Video,
  Wifi,
  AlertTriangle,
  Send,
  Pause,
  Play,
  XCircle,
  CheckCircle,
  UserCheck,
  Smartphone,
  Maximize2,
  Cpu,
  Globe,
  FileText,
  Clock,
} from 'lucide-react';
import { Student } from '../../types';
import { useExam } from '../../context/ExamContext';

interface DrawerProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentDetailDrawer: React.FC<DrawerProps> = ({ student, onClose }) => {
  const { sendWarningToStudent, pauseStudentExam, resumeStudentExam, terminateStudentSession, addToast } = useExam();
  const [warningText, setWarningText] = useState('');
  const [reviewerNote, setReviewerNote] = useState('');

  if (!student) return null;

  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningText.trim()) return;
    sendWarningToStudent(student.id, warningText);
    setWarningText('');
  };

  const handleAddNote = () => {
    if (!reviewerNote.trim()) return;
    addToast('Note Saved', `Added proctor note for ${student.name}`, 'success');
    setReviewerNote('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <img
              src={student.photoUrl}
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{student.name}</h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    student.riskScore >= 50
                      ? 'bg-red-500 text-white'
                      : student.riskScore >= 25
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  Risk: {student.riskScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {student.admissionNo} &bull; {student.class} &bull; {student.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Live Video & AI Bounding Box Preview */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video shadow-md flex items-center justify-center">
            <img
              src={student.photoUrl}
              alt="Live Stream"
              className="w-full h-full object-cover opacity-85"
            />

            {/* AI Bounding Overlay Simulation */}
            {student.faceStatus === 'multiple' ? (
              <div className="absolute inset-4 border-2 border-dashed border-red-500 rounded-lg animate-pulse p-2 flex flex-col justify-between">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded w-max">
                  AI ALERT: MULTIPLE FACES (Count: 2)
                </span>
              </div>
            ) : student.lastViolation?.includes('Phone') ? (
              <div className="absolute top-1/3 right-1/4 w-28 h-28 border-2 border-red-500 bg-red-500/20 rounded p-1 flex flex-col justify-between animate-pulse">
                <span className="bg-red-600 text-white text-[9px] font-bold px-1 rounded">
                  97% PHONE DETECTED
                </span>
              </div>
            ) : (
              <div className="absolute inset-8 border border-emerald-500/80 rounded-lg p-2 flex flex-col justify-between">
                <span className="bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded w-max">
                  FACE VERIFIED (Confidence: 99.4%)
                </span>
              </div>
            )}

            {/* Live Indicators Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live 1080p WebRTC
              </span>
              <span>Question {student.activeQuestion}/{student.totalQuestions} ({student.progressPct}%)</span>
            </div>
          </div>

          {/* Real-time Indicator Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Live Sensor & Telemetry Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium">Face Count</span>
                <span className={`font-bold ${student.faceCount !== 1 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {student.faceCount} Visible
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium">Gaze Tracking</span>
                <span className={`font-bold capitalize ${student.gazeStatus === 'looking_away' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {student.gazeStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium">Camera Feed</span>
                <span className="font-bold text-emerald-600 capitalize">{student.cameraStatus}</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium">Microphone</span>
                <span className="font-bold text-emerald-600 capitalize">{student.micStatus}</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium">Screen Share</span>
                <span className={`font-bold capitalize ${student.screenShareStatus === 'stopped' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {student.screenShareStatus}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-600 font-medium">Full-Screen</span>
                <span className={`font-bold ${!student.fullScreenCompliant ? 'text-red-600' : 'text-emerald-600'}`}>
                  {student.fullScreenCompliant ? 'Active' : 'VIOLATED'}
                </span>
              </div>
            </div>
          </div>

          {/* Device & Session Specs */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-600" />
              Candidate Workstation Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div><strong className="text-slate-800">Device:</strong> {student.device}</div>
              <div><strong className="text-slate-800">Browser:</strong> {student.browser}</div>
              <div><strong className="text-slate-800">IP Address:</strong> {student.ip}</div>
              <div><strong className="text-slate-800">Login Time:</strong> {student.loginTime}</div>
            </div>
          </div>

          {/* Chronological Event Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recorded Violation Timeline
            </h3>
            <div className="space-y-2 border-l-2 border-slate-200 pl-4">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100" />
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
                  <div className="flex items-center justify-between font-bold text-red-900">
                    <span>{student.lastViolation || 'Mobile phone detected'}</span>
                    <span className="text-[10px] text-red-600 font-medium">{student.lastEventTime || '2 mins ago'}</span>
                  </div>
                  <p className="text-[11px] text-red-700 mt-1">YOLOv8 Computer Vision flagged handheld smartphone device. Confidence: 97%</p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span>Tab switch / Window blur event</span>
                    <span className="text-[10px] text-amber-600 font-medium">14 mins ago</span>
                  </div>
                  <p className="text-[11px] text-amber-700 mt-1">Browser focus lost for 4.2 seconds. +15 Risk Points.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Proctor Action Panel */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Proctor Intervention Controls
            </h3>

            {/* Send Warning Form */}
            <form onSubmit={handleSendWarning} className="flex gap-2">
              <input
                type="text"
                value={warningText}
                onChange={(e) => setWarningText(e.target.value)}
                placeholder="Type warning message to candidate..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Warn</span>
              </button>
            </form>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => window.open('https://meet.google.com/new', '_blank')}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors col-span-2"
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span>Launch 1-on-1 Google Meet Proctor Session</span>
              </button>

              <button
                onClick={() => pauseStudentExam(student.id)}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pause Student Exam</span>
              </button>

              <button
                onClick={() => resumeStudentExam(student.id)}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Allow to Continue</span>
              </button>

              <button
                onClick={() => terminateStudentSession(student.id)}
                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors col-span-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Terminate Student Session (Confirmed Malpractice)</span>
              </button>
            </div>

            {/* Add Reviewer Note */}
            <div className="space-y-2 pt-2">
              <textarea
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                placeholder="Add proctor observation note..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddNote}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
              >
                Save Reviewer Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
