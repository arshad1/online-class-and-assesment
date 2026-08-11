import React, { useState, useEffect, useMemo } from 'react';
import { useExam } from '../context/ExamContext';
import { QuestionTypeDistributionRow, QuestionTypeCategory } from '../types';
import {
  Calculator,
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
  Database,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react';

export const QuestionMarksDistributionView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamMarksDistributionState,
    updateCreateExamMarksDistributionState,
    setActiveTab,
    addToast,
  } = useExam();

  // Target Exam Total Marks configured in Step 1 (Default 50)
  const targetExamTotalMarks = Number(createExamFormState.totalMarks) || 50;

  // Question Type Distribution Table State (Supports 5 required types)
  const [rows, setRows] = useState<QuestionTypeDistributionRow[]>(
    createExamMarksDistributionState.rows || [
      { type: 'mcq', label: 'MCQ (Multiple Choice)', questionCount: 10, marksPerQuestion: 1, totalMarks: 10 },
      { type: 'one_word', label: 'One Word', questionCount: 5, marksPerQuestion: 1, totalMarks: 5 },
      { type: 'short_answer', label: 'Short Answer', questionCount: 5, marksPerQuestion: 2, totalMarks: 10 },
      { type: 'long_answer', label: 'Long Answer', questionCount: 2, marksPerQuestion: 5, totalMarks: 10 },
      { type: 'essay', label: 'Essay', questionCount: 1, marksPerQuestion: 15, totalMarks: 15 },
    ]
  );

  // Form Validation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Real-time automatic calculations
  const totalQuestions = useMemo(() => {
    return rows.reduce((sum, r) => sum + (Number(r.questionCount) || 0), 0);
  }, [rows]);

  const calculatedTotalMarks = useMemo(() => {
    return rows.reduce((sum, r) => sum + (Number(r.questionCount) || 0) * (Number(r.marksPerQuestion) || 0), 0);
  }, [rows]);

  // Is marks total equal to Step 1 target marks?
  const isMarksMatch = calculatedTotalMarks === targetExamTotalMarks;

  // Sync state to ExamContext when updated
  useEffect(() => {
    updateCreateExamMarksDistributionState({
      rows,
      totalQuestions,
      calculatedTotalMarks,
    });
  }, [rows, totalQuestions, calculatedTotalMarks]);

  // Row update handlers
  const handleUpdateRow = (type: QuestionTypeCategory, field: 'questionCount' | 'marksPerQuestion', val: number) => {
    setValidationError(null);
    setRows((prev) =>
      prev.map((row) => {
        if (row.type !== type) return row;
        const newCount = field === 'questionCount' ? Math.max(0, val) : row.questionCount;
        const newMarks = field === 'marksPerQuestion' ? Math.max(0, val) : row.marksPerQuestion;
        return {
          ...row,
          questionCount: newCount,
          marksPerQuestion: newMarks,
          totalMarks: newCount * newMarks,
        };
      })
    );
  };

  // Validation function for PRD rule: Question Marks Total = Exam Total Marks
  const validateForm = (): boolean => {
    if (!isMarksMatch) {
      const diff = Math.abs(calculatedTotalMarks - targetExamTotalMarks);
      const direction = calculatedTotalMarks < targetExamTotalMarks ? 'short' : 'over';
      const msg = `Question marks total (${calculatedTotalMarks}) does not equal target Exam Total Marks (${targetExamTotalMarks}). You are ${diff} marks ${direction}. Please adjust question counts or marks per question.`;
      setValidationError(msg);
      return false;
    }
    if (totalQuestions <= 0) {
      setValidationError('At least one question must be configured in the exam structure.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Save as Draft Handler
  const handleSaveAsDraft = () => {
    addToast(
      'Draft Saved',
      `Saved marks distribution: ${totalQuestions} questions totaling ${calculatedTotalMarks} marks.`,
      'success'
    );
  };

  // Continue to Step 6 Handler
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      addToast(
        'Marks Distribution Validated',
        `Question marks total perfectly matches target Exam Total Marks (${calculatedTotalMarks}/${targetExamTotalMarks}). Advancing to Step 6: Question Bank Selection`,
        'success'
      );
      setActiveTab('create-exam-question-bank');
    } else {
      addToast('Validation Failed', 'Question marks total must equal target Exam Total Marks before continuing.', 'danger');
    }
  };

  // Demo Presets
  const loadPreset = (preset: 'balanced50' | 'dist100' | 'error' | 'reset') => {
    setIsSubmitted(false);
    setValidationError(null);

    if (preset === 'balanced50') {
      setRows([
        { type: 'mcq', label: 'MCQ (Multiple Choice)', questionCount: 10, marksPerQuestion: 1, totalMarks: 10 },
        { type: 'one_word', label: 'One Word', questionCount: 5, marksPerQuestion: 1, totalMarks: 5 },
        { type: 'short_answer', label: 'Short Answer', questionCount: 5, marksPerQuestion: 2, totalMarks: 10 },
        { type: 'long_answer', label: 'Long Answer', questionCount: 2, marksPerQuestion: 5, totalMarks: 10 },
        { type: 'essay', label: 'Essay', questionCount: 1, marksPerQuestion: 15, totalMarks: 15 },
      ]);
      addToast('Preset Loaded', 'Balanced 50 Marks Distribution (Perfect Match: 50/50)', 'success');
    } else if (preset === 'dist100') {
      setRows([
        { type: 'mcq', label: 'MCQ (Multiple Choice)', questionCount: 20, marksPerQuestion: 1, totalMarks: 20 },
        { type: 'one_word', label: 'One Word', questionCount: 10, marksPerQuestion: 1, totalMarks: 10 },
        { type: 'short_answer', label: 'Short Answer', questionCount: 10, marksPerQuestion: 3, totalMarks: 30 },
        { type: 'long_answer', label: 'Long Answer', questionCount: 4, marksPerQuestion: 5, totalMarks: 20 },
        { type: 'essay', label: 'Essay', questionCount: 1, marksPerQuestion: 20, totalMarks: 20 },
      ]);
      addToast('Preset Loaded', '100 Marks Distribution', 'info');
    } else if (preset === 'error') {
      setRows([
        { type: 'mcq', label: 'MCQ (Multiple Choice)', questionCount: 10, marksPerQuestion: 1, totalMarks: 10 },
        { type: 'one_word', label: 'One Word', questionCount: 5, marksPerQuestion: 1, totalMarks: 5 },
        { type: 'short_answer', label: 'Short Answer', questionCount: 5, marksPerQuestion: 2, totalMarks: 10 },
        { type: 'long_answer', label: 'Long Answer', questionCount: 2, marksPerQuestion: 5, totalMarks: 10 },
        { type: 'essay', label: 'Essay', questionCount: 0, marksPerQuestion: 15, totalMarks: 0 },
      ]);
      setIsSubmitted(true);
      setValidationError('Question marks total (35) does not equal target Exam Total Marks (50). You are 15 marks short. Please adjust question counts or marks per question.');
      addToast('Error Simulated', 'Triggered marks mismatch error (35/50 marks)', 'warning');
    } else if (preset === 'reset') {
      setRows([
        { type: 'mcq', label: 'MCQ (Multiple Choice)', questionCount: 0, marksPerQuestion: 1, totalMarks: 0 },
        { type: 'one_word', label: 'One Word', questionCount: 0, marksPerQuestion: 1, totalMarks: 0 },
        { type: 'short_answer', label: 'Short Answer', questionCount: 0, marksPerQuestion: 2, totalMarks: 0 },
        { type: 'long_answer', label: 'Long Answer', questionCount: 0, marksPerQuestion: 5, totalMarks: 0 },
        { type: 'essay', label: 'Essay', questionCount: 0, marksPerQuestion: 15, totalMarks: 0 },
      ]);
      addToast('Table Reset', 'All question counts set to 0', 'info');
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: false, done: true },
    { num: 2, label: 'Recipient Selection', active: false, done: true },
    { num: 3, label: 'Academic Mapping', active: false, done: true },
    { num: 4, label: 'Question Source Choice', active: false, done: true },
    { num: 5, label: 'Question Type & Marks', active: true, done: false },
    { num: 6, label: 'Review & Publish', active: false, done: false },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveTab('create-exam-question-source')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 4 — Question Source Choice</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Create Online Examination — Step 5: Question Type & Marks Distribution
          </h2>
          <p className="text-xs text-slate-500">
            Configure question counts and points allocation per question type. Marks total must equal configured Exam Total Marks.
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
            onClick={() => setActiveTab('create-exam-question-source')}
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
            onClick={() => loadPreset('balanced50')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Balanced 50 Marks (Perfect Match)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('dist100')}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: 100 Marks Distribution
          </button>

          <button
            type="button"
            onClick={() => loadPreset('error')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate Marks Mismatch Error (35/50)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('reset')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            Reset Table
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
                    if (step.num === 5) setActiveTab('create-exam-question-pool');
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

      {/* Preserved Parameters Header Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Step 1 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-0.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Exam Marks</span>
          <p className="font-black text-blue-600 text-sm">{targetExamTotalMarks} Marks Total</p>
          <p className="text-[11px] text-slate-500 truncate">{createExamFormState.examName || 'Assessment'}</p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-0.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipients Target</span>
          <p className="font-bold text-slate-900 truncate">
            {createExamRecipientsState.selectionMode === 'class_wise'
              ? `${createExamRecipientsState.selectedClass} (${createExamRecipientsState.selectedDivision})`
              : `${createExamRecipientsState.selectedStudentIds.length} Selected Students`}
          </p>
          <p className="text-[11px] text-slate-500">Year: {createExamRecipientsState.academicYear}</p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-0.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Mapping</span>
          <p className="font-bold text-slate-900">{createExamAcademicMappingState.selectedSubject}</p>
          <p className="text-[11px] text-slate-500">{createExamAcademicMappingState.selectedChapterIds.length} Chapters Selected</p>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-0.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question Source</span>
          <p className="font-bold text-blue-900">Existing Question Pool</p>
          <p className="text-[11px] text-slate-500">Option 1 Selected</p>
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {(isSubmitted || validationError) && validationError && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">PRD Validation Error — Marks Mismatch:</h4>
            <p className="font-semibold text-red-800 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleContinue} className="space-y-6">
        {/* SECTION 1: QUESTION TYPE & MARKS DISTRIBUTION TABLE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                1. Configure Question Types & Marks Allocation
              </h3>
              <p className="text-xs text-slate-500">
                Specify question count and marks per question for all 5 required question types
              </p>
            </div>

            {/* Target Match Badge */}
            <div className="flex items-center gap-2">
              {isMarksMatch ? (
                <span className="px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Perfect Match: {calculatedTotalMarks} / {targetExamTotalMarks} Marks
                </span>
              ) : (
                <span className="px-3.5 py-1.5 bg-red-100 border border-red-300 text-red-900 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Mismatch: {calculatedTotalMarks} / {targetExamTotalMarks} Marks
                </span>
              )}
            </div>
          </div>

          {/* Interactive 5-Question-Type Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Question Type</th>
                    <th className="p-3.5 text-center w-36">Questions Count</th>
                    <th className="p-3.5 text-center w-36">Marks Each</th>
                    <th className="p-3.5 text-right w-44">Total Marks (Calculated)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {rows.map((row) => (
                    <tr key={row.type} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                              row.type === 'mcq'
                                ? 'bg-blue-100 text-blue-900'
                                : row.type === 'one_word'
                                ? 'bg-indigo-100 text-indigo-900'
                                : row.type === 'short_answer'
                                ? 'bg-emerald-100 text-emerald-900'
                                : row.type === 'long_answer'
                                ? 'bg-purple-100 text-purple-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {row.type.replace('_', ' ')}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{row.label}</p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {row.type === 'mcq'
                                ? 'Multiple choice with single correct answer'
                                : row.type === 'one_word'
                                ? 'Short one-word / fill-in answer'
                                : row.type === 'short_answer'
                                ? 'Brief descriptive concept response'
                                : row.type === 'long_answer'
                                ? 'Detailed analytical problem solving'
                                : 'Extended essay / comprehensive evaluation'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Question Count Input */}
                      <td className="p-3.5 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.questionCount}
                          onChange={(e) => handleUpdateRow(row.type, 'questionCount', parseInt(e.target.value) || 0)}
                          className="w-24 text-center px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* Marks Each Input */}
                      <td className="p-3.5 text-center">
                        <div className="relative inline-block w-24">
                          <input
                            type="number"
                            min="0"
                            value={row.marksPerQuestion}
                            onChange={(e) => handleUpdateRow(row.type, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                            className="w-full text-center px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </td>

                      {/* Calculated Row Total Marks */}
                      <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                        <span className={`px-3 py-1 rounded-lg ${row.totalMarks > 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}>
                          {row.totalMarks} Marks
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Table Footer: SUM TOTALS */}
                <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-200">
                  <tr>
                    <td className="p-4 text-xs uppercase tracking-wider">Sum Totals</td>
                    <td className="p-4 text-center text-sm font-extrabold text-blue-900">{totalQuestions} Questions</td>
                    <td className="p-4 text-center text-xs text-slate-500">—</td>
                    <td className="p-4 text-right text-base font-black">
                      <span
                        className={`px-3 py-1 rounded-xl ${
                          isMarksMatch
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {calculatedTotalMarks} / {targetExamTotalMarks} Marks
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 2: CALCULATION COMPARISON CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              2. Marks Equivalence & Validation Summary
            </h3>
          </div>

          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
              isMarksMatch
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-red-50/80 border-red-200 text-red-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl text-white shadow-xs ${
                  isMarksMatch ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              >
                {isMarksMatch ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-sm font-black">
                  {isMarksMatch
                    ? 'PRD Rule Satisfied: Marks Distribution Equals Exam Total Marks'
                    : 'PRD Rule Failed: Marks Distribution Mismatch'}
                </h4>
                <p className="text-xs mt-0.5 font-medium">
                  Configured Exam Total Marks from Step 1 = <strong>{targetExamTotalMarks} Marks</strong> | Calculated Question Marks Total = <strong>{calculatedTotalMarks} Marks</strong>
                </p>
              </div>
            </div>

            {!isMarksMatch && (
              <button
                type="button"
                onClick={() => loadPreset('balanced50')}
                className="px-3.5 py-2 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl transition-all shrink-0"
              >
                Auto-Fix to {targetExamTotalMarks} Marks
              </button>
            )}
          </div>
        </div>

        {/* SECTION 3: FORM ACTION TOOLBAR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('create-exam-question-source')}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 4 Question Source</span>
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
              <span>Continue to Step 6: Question Bank Selection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
