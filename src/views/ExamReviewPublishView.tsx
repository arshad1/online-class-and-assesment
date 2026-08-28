import React, { useState, useMemo } from 'react';
import { useExam } from '../context/ExamContext';
import { mockQuestionBank } from '../data/mockData';
import {
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
  Calendar,
  Clock,
  Award,
  Edit,
  Send,
  Database,
  FileUp,
  Paperclip,
  PenTool,
  Lock,
  Grid,
  Check,
  X,
  Sliders,
  Eye,
} from 'lucide-react';

export const ExamReviewPublishView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamQuestionSourceState,
    createExamMarksDistributionState,
    createExamQuestionBankState,
    createExamPdfSetupState,
    createExamAnswerSubmissionConfigState,
    examSections,
    setShowExamPreviewModal,
    setActiveTab,
    publishCurrentExam,
    addToast,
    setShowPublishConfirmationModal,
  } = useExam();

  const [isConfirmingPublish, setIsConfirmingPublish] = useState<boolean>(false);

  // Question Source Type
  const isPdfBranch = createExamQuestionSourceState.sourceType === 'upload_pdf';

  // Selected questions list for Question Pool Branch
  const selectedQuestions = useMemo(() => {
    return mockQuestionBank.filter((q) =>
      (createExamQuestionBankState.selectedQuestionIds || []).includes(q.id)
    );
  }, [createExamQuestionBankState.selectedQuestionIds]);

  // Pre-Publication Comprehensive Validation Engine
  const validationSummary = useMemo(() => {
    const errors: string[] = [];

    // 1. Exam Details & Schedule
    if (!createExamFormState.examName) errors.push('Exam Name is required (Step 1)');
    if (!createExamFormState.examCode) errors.push('Exam Code is required (Step 1)');
    if (Number(createExamFormState.durationMinutes) <= 0) errors.push('Exam Duration must be > 0 (Step 1)');
    if (Number(createExamFormState.totalMarks) <= 0) errors.push('Total Marks must be > 0 (Step 1)');

    // 2. Recipients
    if (
      createExamRecipientsState.selectionMode === 'student_wise' &&
      createExamRecipientsState.selectedStudentIds.length === 0
    ) {
      errors.push('No students selected for recipient targeting (Step 2)');
    }

    // 3. Academic Mapping
    if (!createExamAcademicMappingState.selectedSubject) errors.push('Subject must be selected (Step 3)');
    if (createExamAcademicMappingState.selectedChapterIds.length === 0) errors.push('At least one chapter must be mapped (Step 3)');

    // 4. Question Source & Content
    if (isPdfBranch) {
      if (!createExamPdfSetupState.fileName) errors.push('Official Question Paper PDF must be uploaded (Step 5 PDF)');
    } else {
      if (createExamMarksDistributionState.calculatedTotalMarks !== Number(createExamFormState.totalMarks)) {
        errors.push(`Marks distribution total (${createExamMarksDistributionState.calculatedTotalMarks}) does not match Exam Total Marks (${createExamFormState.totalMarks})`);
      }
      if (selectedQuestions.length === 0) errors.push('No questions picked from Question Bank (Step 6)');
    }

    // 5. Answer Submission Rules
    if (
      !createExamAnswerSubmissionConfigState.enableTextAnswer &&
      !createExamAnswerSubmissionConfigState.enableAttachmentAnswer
    ) {
      errors.push('At least one answer submission mode (Text or Attachment) must be enabled (Step 6/7)');
    }
    if (
      createExamAnswerSubmissionConfigState.enableAttachmentAnswer &&
      (createExamAnswerSubmissionConfigState.allowedFormats || []).length === 0
    ) {
      errors.push('At least one allowed attachment format (PDF, JPG, PNG, DOC) must be selected (Step 6/7)');
    }

    // 6. Multi-Section Structure Validation (PRD Sec 87)
    if ((examSections || []).length === 0) {
      errors.push('At least one examination section must be defined (PRD Sec 18)');
    } else {
      const sectionMarksSum = examSections.reduce((acc, s) => acc + (s.maxMarks || 0), 0);
      if (sectionMarksSum !== Number(createExamFormState.totalMarks || 100)) {
        errors.push(`Sum of section marks (${sectionMarksSum}) must equal Exam Total Marks (${createExamFormState.totalMarks || 100})`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamQuestionSourceState,
    createExamMarksDistributionState,
    createExamQuestionBankState,
    createExamPdfSetupState,
    createExamAnswerSubmissionConfigState,
    isPdfBranch,
    selectedQuestions,
    examSections,
  ]);

  // Handle Publish Action
  const handlePublishClick = () => {
    if (!validationSummary.isValid) {
      addToast(
        'Publication Blocked',
        'Please resolve missing exam parameters before publishing.',
        'danger'
      );
      return;
    }

    setIsConfirmingPublish(true);
  };

  const handleConfirmPublish = () => {
    setIsConfirmingPublish(false);
    publishCurrentExam();
  };

  // Handle Save as Draft
  const handleSaveAsDraft = () => {
    addToast(
      'Draft Saved',
      `Saved ${createExamFormState.examName || 'Exam'} as draft. Returning to scheduling list.`,
      'success'
    );
    setActiveTab('exam-scheduling');
  };

  const creationSteps = [
    { num: 1, label: 'Exam Basic Details', done: true },
    { num: 2, label: 'Recipients', done: true },
    { num: 3, label: 'Academic Mapping', done: true },
    { num: 4, label: 'Question Source', done: true },
    { num: 5, label: 'Question / PDF Content', done: true },
    { num: 6, label: 'Answer Method', done: true },
    { num: 7, label: 'Review & Publish', active: true, done: false },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveTab('create-exam-pdf-section')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 6 — Answer Submission Configuration</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Send className="w-6 h-6 text-blue-600" />
            Create Online Examination — Step 7: Exam Final Review & Publish
          </h2>
          <p className="text-xs text-slate-500">
            Final teacher checkpoint. Review all 10 configured sections, edit parameters if needed, and publish the exam
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExamPreviewModal(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            title="Simulate and preview the exact student exam experience"
          >
            <Eye className="w-4 h-4 text-amber-700" />
            <span>Preview Exam as Student</span>
          </button>

          <button
            onClick={handleSaveAsDraft}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Save as Draft</span>
          </button>

          <button
            onClick={handlePublishClick}
            disabled={!validationSummary.isValid}
            className={`px-5 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-md ${
              validationSummary.isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Publish Exam</span>
          </button>
        </div>
      </div>

      {/* 7-Step Wizard Progress Flow Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {creationSteps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    step.active
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {step.active ? step.num : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span
                  className={`text-xs font-bold tracking-tight ${
                    step.active ? 'text-white font-black' : 'text-emerald-400'
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

      {/* PRE-PUBLICATION VALIDATION STATUS BANNER */}
      <div
        className={`p-5 rounded-2xl border-2 shadow-xs transition-all ${
          validationSummary.isValid
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-red-50 border-red-300 text-red-950'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl text-white shrink-0 ${
              validationSummary.isValid ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {validationSummary.isValid ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-extrabold">
              {validationSummary.isValid
                ? 'All 10 Examination Checkpoints Verified! Ready for Immediate Publication.'
                : 'Publication Blocked — Outstanding Exam Parameters Found:'}
            </h3>
            {validationSummary.isValid ? (
              <p className="text-xs text-emerald-800 font-medium">
                Your exam configuration satisfies all PRD guidelines, recipient rules, and marks equivalence checks.
              </p>
            ) : (
              <ul className="list-disc list-inside text-xs text-red-800 font-semibold space-y-0.5 pt-1">
                {validationSummary.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          {validationSummary.isValid && (
            <button
              onClick={handlePublishClick}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Publish Now</span>
            </button>
          )}
        </div>
      </div>

      {/* 10 COMPREHENSIVE REVIEW SECTIONS GRID */}
      <div className="space-y-5">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Configured Exam Parameters (10 Sections Review)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* SECTION 1: EXAM DETAILS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> 1. Exam Basic Details
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-basic')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p>
                <strong className="text-slate-900">Exam Title:</strong> {createExamFormState.examName || 'Assessment'}
              </p>
              <p>
                <strong className="text-slate-900">Exam Code:</strong>{' '}
                <span className="font-mono text-blue-600 font-bold">{createExamFormState.examCode}</span>
              </p>
              <p>
                <strong className="text-slate-900">Exam Type:</strong>{' '}
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold uppercase text-[10px]">
                  {createExamFormState.examType === 'spot' ? 'Spot Assessment' : 'Scheduled Exam'}
                </span>
              </p>
              <p>
                <strong className="text-slate-900">Immediate Availability:</strong>{' '}
                {createExamFormState.makeImmediatelyAvailable ? 'Yes (Starts Immediately)' : 'No (Follows Schedule)'}
              </p>
            </div>
          </div>

          {/* SECTION-BASED EXAM STRUCTURE CARD (PRD SEC 18) */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-5 rounded-2xl border border-indigo-200 shadow-xs space-y-3 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2">
              <h4 className="font-black text-indigo-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" /> Multi-Section Examination Structure (PRD Sec 18)
              </h4>
              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-900 font-extrabold text-[10px] rounded-full">
                {examSections.length} Active Sections Configured
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {examSections.map((sec) => (
                <div key={sec.id} className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-[11px] truncate">{sec.title}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-black text-[10px] rounded shrink-0">
                      {sec.maxMarks} Marks
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{sec.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 border-t border-slate-100 pt-1.5">
                    <span>Duration: {sec.durationMinutes || 30} mins</span>
                    <span>{sec.questionIds.length} Questions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: SCHEDULE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> 2. Exam Schedule & Duration
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-basic')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p>
                <strong className="text-slate-900">Start Date & Time:</strong> {createExamFormState.startDate} at{' '}
                {createExamFormState.startTime}
              </p>
              <p>
                <strong className="text-slate-900">End Date & Time:</strong> {createExamFormState.endDate} at{' '}
                {createExamFormState.endTime}
              </p>
              <p>
                <strong className="text-slate-900">Duration:</strong>{' '}
                <span className="font-bold text-slate-900">{createExamFormState.durationMinutes} Minutes</span>
              </p>
            </div>
          </div>

          {/* SECTION 3: RECIPIENTS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" /> 3. Target Recipients
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-recipients')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p>
                <strong className="text-slate-900">Selection Mode:</strong>{' '}
                <span className="capitalize font-bold text-blue-900">
                  {createExamRecipientsState.selectionMode.replace('_', '-')}
                </span>
              </p>
              <p>
                <strong className="text-slate-900">Academic Year & Class:</strong>{' '}
                {createExamRecipientsState.academicYear} | {createExamRecipientsState.selectedClass} (
                {createExamRecipientsState.selectedDivision})
              </p>
              <p>
                <strong className="text-slate-900">Target Student Roster:</strong>{' '}
                {createExamRecipientsState.selectionMode === 'class_wise'
                  ? 'Entire Class (38 Students Eligible)'
                  : `${createExamRecipientsState.selectedStudentIds.length} Selected Students`}
              </p>
            </div>
          </div>

          {/* SECTION 4: SUBJECT & CHAPTERS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> 4. Subject & Chapter Mapping
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-academic')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p>
                <strong className="text-slate-900">Mapped Subject:</strong>{' '}
                <span className="font-bold text-blue-900">{createExamAcademicMappingState.selectedSubject}</span>
              </p>
              <p>
                <strong className="text-slate-900">Mapped Chapters:</strong>{' '}
                {createExamAcademicMappingState.selectedChapterIds.length} Chapters Selected
              </p>
            </div>
          </div>

          {/* SECTION 5: MARKS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" /> 5. Marks & Passing Criteria
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-basic')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p>
                <strong className="text-slate-900">Total Exam Marks:</strong>{' '}
                <span className="font-black text-blue-600 text-sm">{createExamFormState.totalMarks} Marks</span>
              </p>
              <p>
                <strong className="text-slate-900">Pass Marks Threshold:</strong>{' '}
                <span className="font-bold text-slate-900">{createExamFormState.passMarks} Marks</span>
              </p>
            </div>
          </div>

          {/* SECTION 6: QUESTION SOURCE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" /> 6. Question Source Choice
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-question-source')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p>
                <strong className="text-slate-900">Selected Source:</strong>{' '}
                <span className="font-bold text-indigo-900">
                  {isPdfBranch ? 'Upload Question Paper PDF' : 'Existing Question Pool'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                {isPdfBranch ? 'Option 2 PDF Pathway' : 'Option 1 Item Bank Pathway'}
              </p>
            </div>
          </div>

          {/* SECTION 7: QUESTION DISTRIBUTION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" /> 7. Question Breakdown & Distribution
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-question-pool')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            {isPdfBranch ? (
              <div className="text-slate-700 font-medium">
                <p>
                  <strong>Total PDF Question Count:</strong> {createExamPdfSetupState.questionCount} Questions |{' '}
                  <strong>Total Marks:</strong> {createExamPdfSetupState.totalMarks} Marks
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {createExamMarksDistributionState.rows.map((r) => (
                  <span
                    key={r.type}
                    className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                  >
                    <strong>{r.label}:</strong> {r.questionCount} Qs × {r.marksPerQuestion}m = {r.totalMarks} Marks
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 8: QUESTIONS / PDF CONTENT */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                {isPdfBranch ? <FileUp className="w-3.5 h-3.5 text-indigo-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                8. Official Question Content & Items
              </h4>
              <button
                type="button"
                onClick={() => {
                  if (isPdfBranch) setActiveTab('create-exam-pdf-upload');
                  else setActiveTab('create-exam-question-bank');
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            {isPdfBranch ? (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-extrabold text-indigo-950">{createExamPdfSetupState.fileName}</p>
                    <p className="text-[11px] text-indigo-700 font-medium">
                      Official Non-Editable Student Question Paper ({createExamPdfSetupState.pageCount} Pages)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-bold text-slate-900">
                  {selectedQuestions.length} Questions Picked from Question Bank
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuestions.slice(0, 5).map((q) => (
                    <span key={q.id} className="px-2.5 py-0.5 bg-slate-100 rounded border text-[11px] text-slate-700">
                      {q.text.substring(0, 40)}...
                    </span>
                  ))}
                  {selectedQuestions.length > 5 && (
                    <span className="text-[11px] text-slate-400 font-bold pt-0.5">
                      + {selectedQuestions.length - 5} more questions
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 9: ANSWER METHOD */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-blue-600" /> 9. Answer Submission Rules
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-pdf-section')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p>
                <strong className="text-slate-900">Allowed Response Modes:</strong>{' '}
                {createExamAnswerSubmissionConfigState.enableTextAnswer && 'Text Answer '}
                {createExamAnswerSubmissionConfigState.enableAttachmentAnswer && '• File Attachment'}
              </p>
              <p>
                <strong className="text-slate-900">Allowed Attachment Formats:</strong>{' '}
                {(createExamAnswerSubmissionConfigState.allowedFormats || []).join(', ').toUpperCase()}
              </p>
              <p>
                <strong className="text-slate-900">Max Attachment Limit:</strong>{' '}
                {createExamAnswerSubmissionConfigState.maxAttachmentSizeMb} MB per file
              </p>
            </div>
          </div>

          {/* SECTION 10: INSTRUCTIONS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> 10. Candidate Guidelines
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('create-exam-basic')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg font-extrabold transition-colors flex items-center gap-1 text-[11px]"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1 font-medium text-slate-700">
              <p className="italic">
                "{createExamFormState.instructions || 'All questions are mandatory. Ensure webcam remains enabled throughout examination.'}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM ACTION FOOTER TOOLBAR */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('create-exam-pdf-section')}
          className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 6 Answer Method</span>
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
            type="button"
            onClick={handlePublishClick}
            disabled={!validationSummary.isValid}
            className={`px-6 py-2.5 text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-md ${
              validationSummary.isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Publish Examination</span>
          </button>
        </div>
      </div>

      {/* PUBLISH CONFIRMATION MODAL */}
      {isConfirmingPublish && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 text-center font-sans">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Send className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Confirm Exam Publication</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are about to publish <strong>{createExamFormState.examName || 'Assessment'}</strong> ({createExamFormState.examCode}). Once published, notifications will be issued to recipient students and the exam will appear in the scheduled exams catalog.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
              <p><strong>Subject:</strong> {createExamAcademicMappingState.selectedSubject}</p>
              <p><strong>Class:</strong> {createExamRecipientsState.selectedClass} ({createExamRecipientsState.selectedDivision})</p>
              <p><strong>Total Marks:</strong> {createExamFormState.totalMarks} Marks</p>
              <p><strong>Duration:</strong> {createExamFormState.durationMinutes} Minutes</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingPublish(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Publish Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
