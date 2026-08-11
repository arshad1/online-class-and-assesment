import React from 'react';
import { useExam } from '../context/ExamContext';
import { mockSubjectChapters } from '../data/mockData';
import { HelpCircle, ArrowLeft, CheckCircle2, FileText, Users, BookOpen, Layers } from 'lucide-react';

export const QuestionSourcePlaceholderView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    setActiveTab,
  } = useExam();

  const selectedChapters = (mockSubjectChapters[createExamAcademicMappingState.selectedSubject] || []).filter(
    (c) => createExamAcademicMappingState.selectedChapterIds.includes(c.id)
  );

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Back & Header */}
      <div>
        <button
          onClick={() => setActiveTab('create-exam-academic')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 3 — Academic Mapping</span>
        </button>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          Step 4 — Question Source Selection (Prototype 05 Placeholder)
        </h2>
        <p className="text-xs text-slate-500">
          This feature will be implemented in Prototype 05. Full examination configuration from Steps 1, 2, and 3 has been preserved cleanly.
        </p>
      </div>

      {/* Success Banner */}
      <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="text-sm font-extrabold">Steps 1, 2 & 3 Data Preserved Successfully</h3>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          The basic exam parameters, recipient student targets, and subject-chapter mappings have been saved into the context state and are ready to be linked with the question paper source.
        </p>
      </div>

      {/* Grid of Preserved Wizard Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 Preserved Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4" />
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">1. Basic Details</h4>
          </div>
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900">{createExamFormState.examName || 'N/A'}</p>
            <p className="font-mono text-blue-600 font-bold">{createExamFormState.examCode || 'N/A'}</p>
            <p className="text-slate-600 capitalize">
              Type: {createExamFormState.examType} test ({createExamFormState.durationMinutes} mins)
            </p>
            <p className="text-slate-600">Total Marks: {createExamFormState.totalMarks} (Pass: {createExamFormState.passMarks})</p>
          </div>
        </div>

        {/* Step 2 Preserved Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-2">
            <Users className="w-4 h-4" />
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">2. Recipients</h4>
          </div>
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900">
              {createExamRecipientsState.selectionMode === 'class_wise'
                ? `Class-wise: ${createExamRecipientsState.selectedClass}`
                : `Student-wise: ${createExamRecipientsState.selectedStudentIds.length} Selected`}
            </p>
            <p className="text-slate-600">Year: {createExamRecipientsState.academicYear}</p>
            <p className="text-slate-600">Division: {createExamRecipientsState.selectedDivision}</p>
          </div>
        </div>

        {/* Step 3 Preserved Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4" />
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">3. Academic Mapping</h4>
          </div>
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900">Subject: {createExamAcademicMappingState.selectedSubject}</p>
            <p className="text-slate-600 font-semibold">{selectedChapters.length} Chapters Mapped:</p>
            <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
              {selectedChapters.map((c) => (
                <li key={c.id}>Ch {c.chapterNumber}: {c.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('create-exam-academic')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Step 3 Academic Mapping</span>
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
