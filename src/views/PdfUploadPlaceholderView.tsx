import React from 'react';
import { useExam } from '../context/ExamContext';
import { FileUp, ArrowLeft, CheckCircle2, FileText, Users, BookOpen, Layers } from 'lucide-react';

export const PdfUploadPlaceholderView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamQuestionSourceState,
    setActiveTab,
  } = useExam();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Back & Header */}
      <div>
        <button
          onClick={() => setActiveTab('create-exam-question-source')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 4 — Question Source Choice</span>
        </button>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileUp className="w-6 h-6 text-indigo-600" />
          Step 5 — Upload Question Paper PDF Branch (Prototype 09 Placeholder)
        </h2>
        <p className="text-xs text-slate-500">
          This feature will be implemented in Prototype 09. All parameters from Steps 1, 2, 3, and 4 have been preserved.
        </p>
      </div>

      {/* Success Card */}
      <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-900">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <h3 className="text-sm font-extrabold">Branched to Upload Question Paper PDF (Option 2)</h3>
        </div>
        <p className="text-xs text-indigo-800 leading-relaxed">
          You selected <strong>Upload Question Paper PDF</strong> on Step 4. When Prototype 09 is implemented, this view will provide the PDF document dropzone, section structure builder, and student answer format settings.
        </p>
      </div>

      {/* Preserved Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 & 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Basic & Recipients</span>
          <p className="font-bold text-slate-900">{createExamFormState.examName || 'Assessment'}</p>
          <p className="font-mono text-indigo-600 font-bold">{createExamFormState.examCode}</p>
          <p className="text-slate-600">
            Target: {createExamRecipientsState.selectionMode === 'class_wise'
              ? `${createExamRecipientsState.selectedClass} (${createExamRecipientsState.selectedDivision})`
              : `${createExamRecipientsState.selectedStudentIds.length} Selected Students`}
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Mapping</span>
          <p className="font-bold text-slate-900">Subject: {createExamAcademicMappingState.selectedSubject}</p>
          <p className="text-slate-600">{createExamAcademicMappingState.selectedChapterIds.length} Chapters Mapped</p>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question Source</span>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-black bg-indigo-100 text-indigo-900">
            Upload Question Paper PDF
          </span>
          <p className="text-slate-600 font-medium">Ready for PDF Configuration</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('create-exam-question-source')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 4 Question Source Choice</span>
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
