import React from 'react';
import { useExam } from '../context/ExamContext';
import { FileUp, ArrowLeft, CheckCircle2, FileText, Users, BookOpen, Layers, Lock, Award } from 'lucide-react';

export const PdfSectionBreakdownPlaceholderView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamQuestionSourceState,
    createExamPdfSetupState,
    setActiveTab,
  } = useExam();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Back & Header */}
      <div>
        <button
          onClick={() => setActiveTab('create-exam-pdf-upload')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 5 — PDF Question Paper Setup</span>
        </button>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileUp className="w-6 h-6 text-indigo-600" />
          Step 6 — PDF Section Breakdown & Answer Key (Prototype 10 Placeholder)
        </h2>
        <p className="text-xs text-slate-500">
          This feature will be implemented in Prototype 10. All parameters from Steps 1, 2, 3, 4, and 5 have been preserved cleanly.
        </p>
      </div>

      {/* Success Card */}
      <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-900">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <h3 className="text-sm font-extrabold">PDF Question Paper Successfully Verified</h3>
        </div>
        <p className="text-xs text-indigo-800 leading-relaxed">
          Official question paper <strong>{createExamPdfSetupState.fileName}</strong> ({createExamPdfSetupState.pageCount} Pages) has been attached for <strong>{createExamFormState.examName || 'Assessment'}</strong>. Ready for Prototype 10 Section Breakdown & OMR Answer Key mapping.
        </p>
      </div>

      {/* Grid of Preserved Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Step 1 & 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam & Recipients</span>
          <p className="font-bold text-slate-900">{createExamFormState.examName || 'Assessment'}</p>
          <p className="font-mono text-indigo-600 font-bold">{createExamFormState.examCode}</p>
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
          <p className="text-indigo-900 font-semibold">Source: Upload Question Paper PDF</p>
        </div>

        {/* Step 5 PDF Setup Parameters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 md:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configured PDF Parameters</span>
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800">
              Total Marks: {createExamPdfSetupState.totalMarks} Marks
            </span>
            <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800">
              Question Count: {createExamPdfSetupState.questionCount} Questions
            </span>
            <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800">
              Duration: {createExamPdfSetupState.durationMinutes} Minutes
            </span>
            <span className="px-3 py-1 bg-indigo-100 border border-indigo-200 rounded-xl font-bold text-indigo-900 uppercase">
              Submission Mode: {createExamPdfSetupState.submissionType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('create-exam-pdf-upload')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Step 5 PDF Setup</span>
        </button>

        <button
          onClick={() => setActiveTab('exam-scheduling')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
        >
          Return to Teacher Exam List
        </button>
      </div>
    </div>
  );
};
