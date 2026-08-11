import React from 'react';
import { useExam } from '../../context/ExamContext';
import {
  X,
  User,
  Clock,
  Laptop,
  Globe,
  AlertTriangle,
  Send,
  PlusCircle,
  Pause,
  Play,
  CheckCircle2,
  Activity,
  Wifi,
  ShieldAlert,
} from 'lucide-react';

export const StudentDetailDrawer: React.FC = () => {
  const {
    selectedStudentForDrawer,
    setSelectedStudentForDrawer,
    sendWarningToStudent,
    pauseStudentExam,
    resumeStudentExam,
    addExtraTime,
    forceSubmitStudent,
    terminateStudentExam,
  } = useExam();

  if (!selectedStudentForDrawer) return null;

  const st = selectedStudentForDrawer;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={st.avatar}
              alt={st.name}
              className="w-11 h-11 rounded-full border-2 border-blue-500 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{st.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-blue-400 border border-slate-700">
                  Roll: {st.rollNo}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {st.class} - {st.section} • Exam Monitoring Detail Sheet
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedStudentForDrawer(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Toolbar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
          <button
            onClick={() => sendWarningToStudent(st.id, 'Please remain focused on your exam screen.')}
            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Send Warning</span>
          </button>

          {st.examStatus === 'warning' ? (
            <button
              onClick={() => resumeStudentExam(st.id)}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume Exam</span>
            </button>
          ) : (
            <button
              onClick={() => pauseStudentExam(st.id)}
              className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Exam</span>
            </button>
          )}

          <button
            onClick={() => addExtraTime(st.id, 5)}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+5 Mins</span>
          </button>

          <button
            onClick={() => forceSubmitStudent(st.id)}
            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Force Submit</span>
          </button>

          <button
            onClick={() => terminateStudentExam(st.id)}
            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Terminate</span>
          </button>
        </div>

        {/* Drawer Scroll Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Key Live Status Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Exam Status</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                  st.examStatus === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : st.examStatus === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : st.examStatus === 'suspicious'
                    ? 'bg-red-100 text-red-800'
                    : st.examStatus === 'submitted'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {st.examStatus.toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Progress</span>
              <p className="text-xs font-bold text-slate-900 mt-1">
                {st.questionsAnswered} / {st.totalQuestions} Qs
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Time Left</span>
              <p className="text-xs font-bold text-blue-700 mt-1">{st.timeRemainingMinutes} mins</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Tab Switches</span>
              <p className="text-xs font-bold text-red-600 mt-1">{st.tabSwitchCount} Switches</p>
            </div>
          </div>

          {/* System & Device Specifications */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-blue-600" />
              Device & Environment Info
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">IP Address:</span>
                <strong className="font-mono">{st.ipAddress}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Login Time:</span>
                <strong>{st.loginTime}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Operating System / Device:</span>
                <strong>{st.device}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Browser:</span>
                <strong>{st.browser}</strong>
              </div>
            </div>
          </div>

          {/* Tab Switch & Violation Logs */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Tab Switch & Focus Events ({st.tabSwitchEvents.length})
            </h4>

            {st.tabSwitchEvents.length === 0 ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero tab switches recorded. Student is 100% compliant.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {st.tabSwitchEvents.map((evt, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs flex items-start gap-2.5">
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold rounded text-[10px]">
                      {evt.timestamp}
                    </span>
                    <p className="text-amber-950 font-medium">{evt.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning History */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Send className="w-4 h-4 text-blue-600" />
              Warning & Announcement History ({st.warningHistory.length})
            </h4>

            {st.warningHistory.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                No individual warnings issued yet.
              </div>
            ) : (
              <div className="space-y-2">
                {st.warningHistory.map((w, idx) => (
                  <div key={idx} className="p-3 bg-slate-100 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Issued by: <strong>{w.issuedBy}</strong></span>
                      <span>{w.timestamp}</span>
                    </div>
                    <p className="text-slate-800 font-medium">"{w.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Activity Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              Session Activity Timeline
            </h4>

            <div className="relative pl-4 border-l-2 border-slate-200 space-y-4">
              {st.activityTimeline.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedStudentForDrawer(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Detail Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
