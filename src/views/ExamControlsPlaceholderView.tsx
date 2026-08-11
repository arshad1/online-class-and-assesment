import React from 'react';
import { useExam } from '../context/ExamContext';
import { Sliders, ArrowLeft, CheckCircle2, FileText, Users, BookOpen, Layers, Database } from 'lucide-react';

export const ExamControlsPlaceholderView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamQuestionSourceState,
    createExamMarksDistributionState,
    createExamQuestionBankState,
    setActiveTab,
  } = useExam();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Back & Header */}
      <div>
        <button
          onClick={() => setActiveTab('create-exam-question-bank')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 6 — Question Bank Browser</span>
        </button>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-blue-600" />
          Step 7 — Exam Controls & Final Review (Prototype 08 Placeholder)
        </h2>
        <p className="text-xs text-slate-500">
          This feature will be implemented in Prototype 08. All parameters from Steps 1 through 6 have been preserved cleanly.
        </p>
      </div>

      {/* Success Card */}
      <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="text-sm font-extrabold">All Question Quotas Satisfied ({createExamQuestionBankState.selectedQuestionIds.length} Questions Picked)</h3>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          You have selected {createExamQuestionBankState.selectedQuestionIds.length} questions matching all required question type quotas for <strong>{createExamFormState.examName || 'Assessment'}</strong>. Ready for Prototype 08 Exam Controls configuration.
        </p>
      </div>

      {/* Grid of Preserved Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Step 1 & 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam & Recipients</span>
          <p className="font-bold text-slate-900">{createExamFormState.examName || 'Assessment'}</p>
          <p className="font-mono text-blue-600 font-bold">{createExamFormState.examCode}</p>
          <p className="text-slate-600">
            Target: {createExamRecipientsState.selectionMode === 'class_wise'
              ? `${createExamRecipientsState.selectedClass} (${createExamRecipientsState.selectedDivision})`
              : `${createExamRecipientsState.selectedStudentIds.length} Selected Students`}
          </p>
        </div>

        {/* Step 3 & 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic & Source</span>
          <p className="font-bold text-slate-900">Subject: {createExamAcademicMappingState.selectedSubject}</p>
          <p className="text-slate-600">{createExamAcademicMappingState.selectedChapterIds.length} Chapters Mapped</p>
          <p className="text-blue-900 font-semibold">Source: Existing Question Pool</p>
        </div>

        {/* Step 5 & 6 Question Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 md:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Picked Question Bank Selection</span>
          <p className="font-extrabold text-slate-900 text-sm">
            Total Selected Questions: {createExamQuestionBankState.selectedQuestionIds.length} / {createExamMarksDistributionState.totalQuestions} Required
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {createExamMarksDistributionState.rows.map((r) => (
              <span key={r.type} className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-semibold">
                <strong>{r.label}:</strong> {r.questionCount} Questions ✓
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('create-exam-question-bank')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Step 6 Question Picks</span>
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
