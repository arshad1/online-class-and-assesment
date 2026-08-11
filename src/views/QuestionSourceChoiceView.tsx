import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { QuestionSourceType } from '../types';
import { mockSubjectChapters } from '../data/mockData';
import {
  HelpCircle,
  Database,
  FileUp,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Save,
  Sparkles,
  Layers,
  Users,
  FileText,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const QuestionSourceChoiceView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamQuestionSourceState,
    updateCreateExamQuestionSourceState,
    setActiveTab,
    addToast,
  } = useExam();

  // Selected Question Source Type
  const [sourceType, setSourceType] = useState<QuestionSourceType | null>(
    createExamQuestionSourceState.sourceType || 'existing_pool'
  );

  // Form Validation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state to ExamContext when updated
  useEffect(() => {
    if (sourceType) {
      updateCreateExamQuestionSourceState({ sourceType });
    }
  }, [sourceType]);

  // Selected chapters count from Step 3
  const selectedChaptersCount = (mockSubjectChapters[createExamAcademicMappingState.selectedSubject] || []).filter(
    (c) => createExamAcademicMappingState.selectedChapterIds.includes(c.id)
  ).length;

  // Validation function
  const validateForm = (): boolean => {
    if (!sourceType) {
      setValidationError('Please select a question source method before continuing.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Save as Draft Handler
  const handleSaveAsDraft = () => {
    addToast(
      'Draft Saved',
      `Saved question source choice: ${sourceType === 'existing_pool' ? 'Existing Question Pool' : 'Upload Question Paper PDF'}`,
      'success'
    );
  };

  // Continue to Next Step (Branching Execution)
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      if (sourceType === 'existing_pool') {
        addToast(
          'Question Source Selected',
          'Selected Existing Question Pool. Branching to Step 5: Question Bank Selection (Prototype 06)',
          'success'
        );
        setActiveTab('create-exam-question-pool');
      } else if (sourceType === 'upload_pdf') {
        addToast(
          'Question Source Selected',
          'Selected Upload Question Paper PDF. Branching to Step 5: PDF Upload & Configuration (Prototype 09)',
          'success'
        );
        setActiveTab('create-exam-pdf-upload');
      }
    } else {
      addToast('Validation Failed', 'Please select a question source option before continuing.', 'danger');
    }
  };

  // Demo Controls for Testing
  const loadPreset = (preset: 'pool' | 'pdf' | 'error') => {
    setIsSubmitted(false);
    setValidationError(null);

    if (preset === 'pool') {
      setSourceType('existing_pool');
      addToast('Preset Selected', 'Existing Question Pool chosen (Branches to Prototype 06)', 'info');
    } else if (preset === 'pdf') {
      setSourceType('upload_pdf');
      addToast('Preset Selected', 'Upload Question Paper PDF chosen (Branches to Prototype 09)', 'info');
    } else if (preset === 'error') {
      setSourceType(null);
      setIsSubmitted(true);
      setValidationError('Please select a question source method before continuing.');
      addToast('Error Simulated', 'Triggered mandatory source choice validation error.', 'warning');
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: false, done: true },
    { num: 2, label: 'Recipient Selection', active: false, done: true },
    { num: 3, label: 'Academic Mapping', active: false, done: true },
    { num: 4, label: 'Question Source Choice', active: true, done: false },
    { num: 5, label: 'Question & Marks', active: false, done: false },
    { num: 6, label: 'Review & Publish', active: false, done: false },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            Create Online Examination — Step 4: Question Source Choice
          </h2>
          <p className="text-xs text-slate-500">
            PRD Branch Point: Choose whether to populate questions from the Item Bank or upload a Question Paper PDF
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAsDraft}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Save as Draft</span>
          </button>

          <button
            onClick={() => setActiveTab('create-exam-academic')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* Preset Demo Toolbar */}
      <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 rounded-2xl border border-blue-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider">
            Prototype Demo Controls:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadPreset('pool')}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Branch: Existing Question Pool (Proto 06)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('pdf')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Branch: Upload PDF Paper (Proto 09)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('error')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate Validation Error
          </button>
        </div>
      </div>

      {/* 6-Step Flow Indicator Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {creationSteps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (step.num === 1) setActiveTab('create-exam-basic');
                    if (step.num === 2) setActiveTab('create-exam-recipients');
                    if (step.num === 3) setActiveTab('create-exam-academic');
                    if (step.num === 4) setActiveTab('create-exam-question-source');
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    step.active
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                      : step.done
                      ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </button>
                <span
                  className={`text-xs font-bold tracking-tight ${
                    step.active ? 'text-white font-black' : step.done ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < creationSteps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-700 shrink-0 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Preserved Parameters Summary Bar (Steps 1, 2 & 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 Preserved */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Basic Details</span>
              <h4 className="text-xs font-black text-slate-900">{createExamFormState.examName || 'Grade 10 Assessment'}</h4>
              <p className="text-[11px] text-slate-500 font-mono">Code: {createExamFormState.examCode || 'MAT-G10-2026-001'}</p>
            </div>
          </div>
        </div>

        {/* Step 2 Preserved */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipients</span>
              <h4 className="text-xs font-black text-slate-900">
                {createExamRecipientsState.selectionMode === 'class_wise'
                  ? `${createExamRecipientsState.selectedClass} (${createExamRecipientsState.selectedDivision})`
                  : `${createExamRecipientsState.selectedStudentIds.length} Individual Students`}
              </h4>
              <p className="text-[11px] text-slate-500">Year: {createExamRecipientsState.academicYear}</p>
            </div>
          </div>
        </div>

        {/* Step 3 Preserved */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Mapping</span>
              <h4 className="text-xs font-black text-slate-900">{createExamAcademicMappingState.selectedSubject}</h4>
              <p className="text-[11px] text-slate-500 font-semibold">{selectedChaptersCount} Chapters Selected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {(isSubmitted || validationError) && validationError && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Validation Error — Selection Required:</h4>
            <p className="font-semibold text-red-800 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* Main Decision Screen Form */}
      <form onSubmit={handleContinue} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-black uppercase tracking-wider">
              PRD Section 8 Branch Point
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              How do you want to create this exam?
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Choose the question paper generation method below. Both pathways support full question configuration, marks allocation, and automated/manual assessment.
            </p>
          </div>

          {/* TWO BRANCH DECISION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* OPTION 1: Existing Question Pool */}
            <div
              onClick={() => {
                setSourceType('existing_pool');
                setValidationError(null);
              }}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                sourceType === 'existing_pool'
                  ? 'bg-blue-50/80 border-blue-600 ring-4 ring-blue-500/20 shadow-md scale-[1.01]'
                  : 'bg-slate-50/50 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xs">
                    <Database className="w-8 h-8" />
                  </div>

                  <input
                    type="radio"
                    name="questionSource"
                    checked={sourceType === 'existing_pool'}
                    onChange={() => setSourceType('existing_pool')}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-900">Existing Question Pool</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-extrabold rounded-full">
                      Option 1
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 font-bold mt-0.5">Select from System Item Bank & Question Pool</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse and pick questions directly from the pre-populated item bank filtered by your selected Subject (<strong>{createExamAcademicMappingState.selectedSubject}</strong>) and mapped chapters.
                </p>

                <ul className="text-xs text-slate-700 space-y-2 font-medium bg-white/80 p-3.5 rounded-xl border border-blue-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Supports MCQs, Short Answer & Long Answer questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Auto-calculates marks distribution and pass criteria</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Randomizes questions & option order per candidate</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-200/80 flex items-center justify-between text-xs font-extrabold text-blue-900">
                <span>Next Step: Question Bank Selection</span>
                <div className="flex items-center gap-1 text-blue-600">
                  <span>Item Bank</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* OPTION 2: Upload Question Paper PDF */}
            <div
              onClick={() => {
                setSourceType('upload_pdf');
                setValidationError(null);
              }}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                sourceType === 'upload_pdf'
                  ? 'bg-indigo-50/80 border-indigo-600 ring-4 ring-indigo-500/20 shadow-md scale-[1.01]'
                  : 'bg-slate-50/50 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xs">
                    <FileUp className="w-8 h-8" />
                  </div>

                  <input
                    type="radio"
                    name="questionSource"
                    checked={sourceType === 'upload_pdf'}
                    onChange={() => setSourceType('upload_pdf')}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-900">Upload Question Paper PDF</h4>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] font-extrabold rounded-full">
                      Option 2
                    </span>
                  </div>
                  <p className="text-xs text-indigo-700 font-bold mt-0.5">Attach Printed / Scanned Question Paper PDF</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload an existing PDF document containing the question paper. Students view the PDF directly inside the exam portal while entering answers.
                </p>

                <ul className="text-xs text-slate-700 space-y-2 font-medium bg-white/80 p-3.5 rounded-xl border border-indigo-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Integrated split-screen PDF reader for candidates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Define paper sections, marks, and rubric criteria</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Supports text answers & scanned attachment uploads</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-200/80 flex items-center justify-between text-xs font-extrabold text-indigo-900">
                <span>Next Step: PDF Upload & Config</span>
                <div className="flex items-center gap-1 text-indigo-600">
                  <span>PDF Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: FORM ACTION TOOLBAR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('create-exam-academic')}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 3 Academic Mapping</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <span>
                {sourceType === 'upload_pdf'
                  ? 'Continue to Step 5: Upload PDF Paper (Proto 09)'
                  : 'Continue to Step 5: Question Pool (Proto 06)'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
