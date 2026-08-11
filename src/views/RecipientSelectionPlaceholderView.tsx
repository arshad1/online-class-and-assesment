import React from 'react';
import { useExam } from '../context/ExamContext';
import { Users, ArrowLeft, CheckCircle2, Clock, Calendar, FileText, Sparkles, BookOpen } from 'lucide-react';

export const RecipientSelectionPlaceholderView: React.FC = () => {
  const { createExamFormState, setActiveTab } = useExam();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => setActiveTab('create-exam-basic')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 1 — Exam Basic Details</span>
        </button>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Step 2 — Recipient Selection (Prototype 03 Placeholder)
        </h2>
        <p className="text-xs text-slate-500">
          This feature will be implemented in Prototype 03. Basic exam details from Step 1 have been preserved cleanly.
        </p>
      </div>

      {/* Preservation Success Card */}
      <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="text-sm font-extrabold">Step 1 Data Preserved Successfully</h3>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          The information entered on Step 1 (Exam Type + Basic Details) is safely stored in the application state and will be linked to the recipient target selection in the next development phase.
        </p>
      </div>

      {/* Summary of Preserved Step 1 Data */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Summary of Step 1 Configured Exam
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exam Name</span>
            <p className="font-bold text-slate-900 text-sm">{createExamFormState.examName || 'N/A'}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exam Code</span>
            <p className="font-mono font-bold text-blue-600 text-sm">{createExamFormState.examCode || 'N/A'}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exam Type</span>
            <p className="font-bold text-slate-900 capitalize flex items-center gap-1.5 mt-0.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${
                createExamFormState.examType === 'spot' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
              }`}>
                {createExamFormState.examType || 'scheduled'} test
              </span>
              {createExamFormState.examType === 'spot' && createExamFormState.makeImmediatelyAvailable && (
                <span className="text-[11px] text-emerald-700 font-semibold">(Immediate Availability)</span>
              )}
            </p>
          </div>

          {createExamFormState.examType === 'scheduled' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Window</span>
              <p className="font-semibold text-slate-900">
                {createExamFormState.startDate} ({createExamFormState.startTime}) — {createExamFormState.endDate} ({createExamFormState.endTime})
              </p>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration & Marks</span>
            <p className="font-bold text-slate-900">
              {createExamFormState.durationMinutes} Minutes • Total Marks: {createExamFormState.totalMarks} • Pass Mark: {createExamFormState.passMarks}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 md:col-span-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Instructions</span>
            <p className="font-medium text-slate-700 leading-snug">{createExamFormState.instructions || 'None provided'}</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('create-exam-basic')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Step 1 Basic Details</span>
        </button>

        <button
          onClick={() => setActiveTab('exam-scheduling')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
        >
          Return to Teacher Exam List
        </button>
      </div>
    </div>
  );
};
