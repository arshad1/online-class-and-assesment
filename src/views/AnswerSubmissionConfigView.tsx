import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { AllowedAttachmentFormat, QuestionTypeSubmissionRule, QuestionTypeCategory } from '../types';
import {
  FileCheck,
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
  Paperclip,
  PenTool,
  Grid,
  FileCode,
  Image,
  Sliders,
  Check,
  X,
} from 'lucide-react';

export const AnswerSubmissionConfigView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamQuestionSourceState,
    createExamMarksDistributionState,
    createExamPdfSetupState,
    createExamAnswerSubmissionConfigState,
    updateCreateExamAnswerSubmissionConfigState,
    setActiveTab,
    addToast,
  } = useExam();

  // Answer Submission Mode Toggles
  const [enableTextAnswer, setEnableTextAnswer] = useState<boolean>(
    createExamAnswerSubmissionConfigState.enableTextAnswer ?? true
  );
  const [enableAttachmentAnswer, setEnableAttachmentAnswer] = useState<boolean>(
    createExamAnswerSubmissionConfigState.enableAttachmentAnswer ?? true
  );

  // Attachment Format Checkboxes
  const [allowedFormats, setAllowedFormats] = useState<AllowedAttachmentFormat[]>(
    createExamAnswerSubmissionConfigState.allowedFormats || ['pdf', 'jpg', 'png', 'doc']
  );
  const [maxAttachmentSizeMb, setMaxAttachmentSizeMb] = useState<number>(
    createExamAnswerSubmissionConfigState.maxAttachmentSizeMb || 10
  );
  const [maxAttachmentsPerQuestion, setMaxAttachmentsPerQuestion] = useState<number>(
    createExamAnswerSubmissionConfigState.maxAttachmentsPerQuestion || 3
  );

  // Question Type Response Matrix
  const [typeRules, setTypeRules] = useState<QuestionTypeSubmissionRule[]>(
    createExamAnswerSubmissionConfigState.typeRules || [
      { type: 'mcq', label: 'MCQ (Multiple Choice)', allowTextAnswer: false, allowAttachment: false, editorMode: 'plain' },
      { type: 'one_word', label: 'One Word', allowTextAnswer: true, allowAttachment: false, editorMode: 'plain', maxWordCount: 5 },
      { type: 'short_answer', label: 'Short Answer', allowTextAnswer: true, allowAttachment: true, editorMode: 'plain', maxWordCount: 100 },
      { type: 'long_answer', label: 'Long Answer', allowTextAnswer: true, allowAttachment: true, editorMode: 'rich', maxWordCount: 500 },
      { type: 'essay', label: 'Essay', allowTextAnswer: true, allowAttachment: true, editorMode: 'rich', maxWordCount: 1500 },
    ]
  );

  // Form Submission & Validation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state to ExamContext
  useEffect(() => {
    updateCreateExamAnswerSubmissionConfigState({
      enableTextAnswer,
      enableAttachmentAnswer,
      allowedFormats,
      maxAttachmentSizeMb,
      maxAttachmentsPerQuestion,
      typeRules,
    });
  }, [enableTextAnswer, enableAttachmentAnswer, allowedFormats, maxAttachmentSizeMb, maxAttachmentsPerQuestion, typeRules]);

  // Toggle Attachment Format Checkbox
  const handleToggleFormat = (fmt: AllowedAttachmentFormat) => {
    setValidationError(null);
    setAllowedFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  // Toggle Rule in Matrix Table
  const handleUpdateMatrixRule = (
    type: QuestionTypeCategory,
    field: 'allowTextAnswer' | 'allowAttachment' | 'editorMode' | 'maxWordCount',
    val: any
  ) => {
    setValidationError(null);
    setTypeRules((prev) =>
      prev.map((r) => (r.type === type ? { ...r, [field]: val } : r))
    );
  };

  // Form Validation
  const validateForm = (): boolean => {
    if (!enableTextAnswer && !enableAttachmentAnswer) {
      setValidationError('At least one submission mode (Text Answer or Attachment Answer) must be enabled.');
      return false;
    }
    if (enableAttachmentAnswer && allowedFormats.length === 0) {
      setValidationError('At least one allowed attachment format (PDF, JPG, PNG, or DOC) must be selected when Attachment Answer mode is enabled.');
      return false;
    }
    if (maxAttachmentSizeMb <= 0) {
      setValidationError('Maximum attachment size must be at least 1 MB.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handler: Save as Draft
  const handleSaveAsDraft = () => {
    addToast(
      'Draft Saved',
      `Saved answer submission config (${allowedFormats.length} formats, max ${maxAttachmentSizeMb} MB).`,
      'success'
    );
  };

  // Handler: Continue to Step 7
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      addToast(
        'Submission Configuration Validated',
        `Answer submission rules saved (${allowedFormats.join(', ').toUpperCase()} enabled, ${maxAttachmentSizeMb} MB max). Advancing to Step 7: Exam Controls & Review`,
        'success'
      );
      setActiveTab('create-exam-controls');
    } else {
      addToast('Validation Failed', 'Please resolve configuration errors before continuing.', 'danger');
    }
  };

  // Demo Controls Presets
  const loadPreset = (preset: 'recommended' | 'pdfOnly' | 'textOnly' | 'formatError' | 'reset') => {
    setIsSubmitted(false);
    setValidationError(null);

    if (preset === 'recommended') {
      setEnableTextAnswer(true);
      setEnableAttachmentAnswer(true);
      setAllowedFormats(['pdf', 'jpg', 'png', 'doc']);
      setMaxAttachmentSizeMb(10);
      setMaxAttachmentsPerQuestion(3);
      addToast('Preset Loaded', 'Standard Digital + Image Uploads (PDF, JPG, PNG, DOC, 10 MB)', 'success');
    } else if (preset === 'pdfOnly') {
      setEnableTextAnswer(true);
      setEnableAttachmentAnswer(true);
      setAllowedFormats(['pdf']);
      setMaxAttachmentSizeMb(10);
      setMaxAttachmentsPerQuestion(2);
      addToast('Preset Loaded', 'Strict PDF Only Uploads (Max 10 MB)', 'info');
    } else if (preset === 'textOnly') {
      setEnableTextAnswer(true);
      setEnableAttachmentAnswer(false);
      setAllowedFormats([]);
      addToast('Preset Loaded', 'Text Only (No File Attachments)', 'info');
    } else if (preset === 'formatError') {
      setEnableAttachmentAnswer(true);
      setAllowedFormats([]); // 0 formats selected
      setIsSubmitted(true);
      setValidationError('At least one allowed attachment format (PDF, JPG, PNG, or DOC) must be selected when Attachment Answer mode is enabled.');
      addToast('Error Simulated', 'Triggered no formats selected validation error', 'warning');
    } else if (preset === 'reset') {
      setEnableTextAnswer(true);
      setEnableAttachmentAnswer(true);
      setAllowedFormats(['pdf', 'jpg', 'png', 'doc']);
      setMaxAttachmentSizeMb(10);
      setMaxAttachmentsPerQuestion(3);
      addToast('Configuration Reset', 'Reset to default parameters', 'info');
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: false, done: true },
    { num: 2, label: 'Recipient Selection', active: false, done: true },
    { num: 3, label: 'Academic Mapping', active: false, done: true },
    { num: 4, label: 'Question Source Choice', active: false, done: true },
    { num: 5, label: 'Exam Content Setup', active: false, done: true },
    { num: 6, label: 'Answer Submission Rules', active: true, done: false },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => {
              if (createExamQuestionSourceState.sourceType === 'upload_pdf') {
                setActiveTab('create-exam-pdf-upload');
              } else {
                setActiveTab('create-exam-question-pool');
              }
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Previous Step</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-600" />
            Create Online Examination — Step 6: Answer Submission Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Decide how students respond (Text Answers, File Attachments) and configure allowed file formats and maximum attachment sizes
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
            onClick={() => setActiveTab('create-exam-question-pool')}
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
            onClick={() => loadPreset('recommended')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Standard Digital + Image Uploads (Recommended)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('pdfOnly')}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Strict PDF Only (10 MB)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('formatError')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate: 0 Formats Selected Error
          </button>

          <button
            type="button"
            onClick={() => loadPreset('reset')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 6-Step Creation Wizard Flow Indicator Bar */}
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

      {/* Preserved Parameters Header Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Step 1 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-0.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Basic Details</span>
          <p className="font-bold text-slate-900 truncate">{createExamFormState.examName || 'Assessment'}</p>
          <p className="font-mono text-blue-600 font-bold">{createExamFormState.examCode}</p>
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
          <p className="text-[11px] text-slate-500">{createExamAcademicMappingState.selectedChapterIds.length} Chapters Mapped</p>
        </div>

        {/* Step 4 & 5 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-0.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question Source</span>
          <p className="font-bold text-blue-900">
            {createExamQuestionSourceState.sourceType === 'upload_pdf' ? 'PDF Paper Upload' : 'Existing Question Pool'}
          </p>
          <p className="text-[11px] text-slate-500">
            Total Marks: {createExamFormState.totalMarks || 50} Marks
          </p>
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {(isSubmitted || validationError) && validationError && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Submission Configuration Validation Error:</h4>
            <p className="font-semibold text-red-800 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleContinue} className="space-y-6">
        {/* SECTION 1: GLOBAL RESPONSE MODES (TEXT vs ATTACHMENT) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PenTool className="w-4 h-4 text-blue-600" />
              1. Enable Student Response Modes
            </h3>
            <p className="text-xs text-slate-500">
              Select how students are permitted to compose and submit their answers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode 1: Text Answer Card */}
            <div
              onClick={() => setEnableTextAnswer(!enableTextAnswer)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                enableTextAnswer
                  ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Text Answer Mode</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct text input for One Word, Short Answer, Long Answer, and Essay
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={enableTextAnswer}
                  onChange={() => setEnableTextAnswer(!enableTextAnswer)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer mt-1"
                />
              </div>
            </div>

            {/* Mode 2: Attachment Answer Card */}
            <div
              onClick={() => setEnableAttachmentAnswer(!enableAttachmentAnswer)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                enableAttachmentAnswer
                  ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Paperclip className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Attachment Answer Mode</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      File uploads for handwritten answer sheets, diagrams, calculations & code
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={enableAttachmentAnswer}
                  onChange={() => setEnableAttachmentAnswer(!enableAttachmentAnswer)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ATTACHMENT RULES & ALLOWED FORMATS (PRD MANDATORY REQUIREMENT) */}
        {enableAttachmentAnswer && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-indigo-600" />
                  2. File Attachment Settings & Allowed Formats
                </h3>
                <p className="text-xs text-slate-500">
                  PRD Requirement: Configure allowed file formats, maximum attachment size, and file counts
                </p>
              </div>

              <span className="px-3 py-1 bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-black rounded-xl">
                {allowedFormats.length} Formats Enabled
              </span>
            </div>

            {/* Allowed Formats Checkboxes Grid */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2">
                Allowed File Formats <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Format 1: PDF */}
                <div
                  onClick={() => handleToggleFormat('pdf')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    allowedFormats.includes('pdf')
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <div>
                      <h5 className="text-xs font-black text-slate-900">PDF (.pdf)</h5>
                      <p className="text-[10px] text-slate-500">Scanned documents</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowedFormats.includes('pdf')}
                    onChange={() => handleToggleFormat('pdf')}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                {/* Format 2: JPG/JPEG */}
                <div
                  onClick={() => handleToggleFormat('jpg')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    allowedFormats.includes('jpg')
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-blue-600" />
                    <div>
                      <h5 className="text-xs font-black text-slate-900">JPG / JPEG</h5>
                      <p className="text-[10px] text-slate-500">Photos of answer sheets</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowedFormats.includes('jpg')}
                    onChange={() => handleToggleFormat('jpg')}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                {/* Format 3: PNG */}
                <div
                  onClick={() => handleToggleFormat('png')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    allowedFormats.includes('png')
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h5 className="text-xs font-black text-slate-900">PNG (.png)</h5>
                      <p className="text-[10px] text-slate-500">Diagrams & screenshots</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowedFormats.includes('png')}
                    onChange={() => handleToggleFormat('png')}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                {/* Format 4: DOC / DOCX / TXT */}
                <div
                  onClick={() => handleToggleFormat('doc')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    allowedFormats.includes('doc')
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-600" />
                    <div>
                      <h5 className="text-xs font-black text-slate-900">Documents (.doc, .docx)</h5>
                      <p className="text-[10px] text-slate-500">Word & text files</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowedFormats.includes('doc')}
                    onChange={() => handleToggleFormat('doc')}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Size & Count Limits Sliders/Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Max Size in MB */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800">Maximum Attachment Size Per File:</span>
                  <span className="font-black text-indigo-600 text-sm">{maxAttachmentSizeMb} MB</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={maxAttachmentSizeMb}
                  onChange={(e) => setMaxAttachmentSizeMb(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1 MB</span>
                  <span>5 MB</span>
                  <span>10 MB</span>
                  <span>15 MB</span>
                  <span>25 MB</span>
                </div>
              </div>

              {/* Max Attachments Count */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800">Max Files Allowed Per Question:</span>
                  <span className="font-black text-indigo-600 text-sm">{maxAttachmentsPerQuestion} Files</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxAttachmentsPerQuestion}
                  onChange={(e) => setMaxAttachmentsPerQuestion(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1 File</span>
                  <span>2 Files</span>
                  <span>3 Files</span>
                  <span>4 Files</span>
                  <span>5 Files</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: PER-QUESTION-TYPE RESPONSE MATRIX TABLE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              3. Question Type Response Rule Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Customize response permissions and editor modes for each required question type
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Question Type</th>
                    <th className="p-3.5 text-center">Allow Text Answer</th>
                    <th className="p-3.5 text-center">Allow Attachment</th>
                    <th className="p-3.5 text-center">Editor Format</th>
                    <th className="p-3.5 text-right">Max Word Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {typeRules.map((rule) => (
                    <tr key={rule.type} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <span className="font-extrabold text-slate-900 text-xs uppercase">
                          {rule.label}
                        </span>
                      </td>

                      {/* Text Answer Checkbox */}
                      <td className="p-3.5 text-center">
                        {rule.type === 'mcq' ? (
                          <span className="text-[10px] text-slate-400 font-semibold">OMR Bubbles</span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={rule.allowTextAnswer}
                            onChange={(e) => handleUpdateMatrixRule(rule.type, 'allowTextAnswer', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        )}
                      </td>

                      {/* Attachment Checkbox */}
                      <td className="p-3.5 text-center">
                        {rule.type === 'mcq' || rule.type === 'one_word' ? (
                          <span className="text-[10px] text-slate-400 font-semibold">Disabled</span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={rule.allowAttachment}
                            onChange={(e) => handleUpdateMatrixRule(rule.type, 'allowAttachment', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                        )}
                      </td>

                      {/* Editor Format Dropdown */}
                      <td className="p-3.5 text-center">
                        {rule.type === 'mcq' ? (
                          <span className="text-[10px] text-slate-400 font-semibold">N/A</span>
                        ) : (
                          <select
                            value={rule.editorMode}
                            onChange={(e) => handleUpdateMatrixRule(rule.type, 'editorMode', e.target.value)}
                            className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                          >
                            <option value="plain">Plain Text</option>
                            <option value="rich">Rich Text (WYSIWYG)</option>
                          </select>
                        )}
                      </td>

                      {/* Max Word Count Input */}
                      <td className="p-3.5 text-right">
                        {rule.type === 'mcq' ? (
                          <span className="text-[10px] text-slate-400 font-semibold">N/A</span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            value={rule.maxWordCount || 0}
                            onChange={(e) => handleUpdateMatrixRule(rule.type, 'maxWordCount', parseInt(e.target.value) || 0)}
                            className="w-20 text-right px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-xs"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 4: FORM ACTION TOOLBAR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('create-exam-question-pool')}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 5 Content Setup</span>
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
              <span>Continue to Step 7: Exam Controls & Review</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
