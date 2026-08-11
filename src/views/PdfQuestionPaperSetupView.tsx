import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { PdfAnswerSubmissionType } from '../types';
import {
  FileUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Save,
  Sparkles,
  Layers,
  Users,
  BookOpen,
  Eye,
  RefreshCw,
  X,
  UploadCloud,
  Clock,
  Award,
  HelpCircle,
  File,
  Lock,
  Grid,
  PenTool,
  Image,
} from 'lucide-react';

export const PdfQuestionPaperSetupView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamPdfSetupState,
    updateCreateExamPdfSetupState,
    setActiveTab,
    addToast,
  } = useExam();

  // Uploaded PDF File State
  const [fileName, setFileName] = useState<string | null>(
    createExamPdfSetupState.fileName || 'Grade10_Mathematics_Midterm_Paper.pdf'
  );
  const [fileSize, setFileSize] = useState<number | null>(createExamPdfSetupState.fileSize || 4404019); // 4.2 MB
  const [pageCount, setPageCount] = useState<number>(createExamPdfSetupState.pageCount || 6);
  const [uploadDate, setUploadDate] = useState<string | null>(createExamPdfSetupState.uploadDate || '2026-08-11');

  // Exam Parameters State
  const [totalMarks, setTotalMarks] = useState<number>(
    createExamPdfSetupState.totalMarks || Number(createExamFormState.totalMarks) || 50
  );
  const [questionCount, setQuestionCount] = useState<number>(createExamPdfSetupState.questionCount || 20);
  const [durationMinutes, setDurationMinutes] = useState<number>(
    createExamPdfSetupState.durationMinutes || Number(createExamFormState.durationMinutes) || 90
  );
  const [submissionType, setSubmissionType] = useState<PdfAnswerSubmissionType>(
    createExamPdfSetupState.submissionType || 'omr'
  );

  // UI Modal & Drag States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Form Submission & Error States
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state to ExamContext
  useEffect(() => {
    updateCreateExamPdfSetupState({
      fileName,
      fileSize,
      pageCount,
      uploadDate,
      totalMarks,
      questionCount,
      durationMinutes,
      submissionType,
      isOfficialNonEditablePaper: true,
    });
  }, [fileName, fileSize, pageCount, uploadDate, totalMarks, questionCount, durationMinutes, submissionType]);

  // Format File Size Helper (Bytes to MB)
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Handle File Input Selection
  const handleFileDropOrSelect = (file: File) => {
    setUploadError(null);
    setValidationError(null);

    // Rule 1: Check File Format (.pdf only)
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      const err = `Invalid file format (${file.name}). Only PDF files (.pdf) are supported.`;
      setUploadError(err);
      addToast('Upload Failed', err, 'danger');
      return;
    }

    // Rule 2: Check File Size (Max 15 MB = 15.728,640 bytes)
    const MAX_SIZE_BYTES = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const mbSize = (file.size / (1024 * 1024)).toFixed(1);
      const err = `File size exceeds 15 MB limit (Uploaded file: ${mbSize} MB). Please compress your PDF document.`;
      setUploadError(err);
      addToast('Upload Failed', err, 'danger');
      return;
    }

    // Success PDF Upload
    setFileName(file.name);
    setFileSize(file.size);
    setPageCount(Math.floor(Math.random() * 5) + 4); // Simulated 4 to 8 pages
    setUploadDate(new Date().toISOString().split('T')[0]);
    addToast('PDF Uploaded Successfully', `Attached ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`, 'success');
  };

  // Replace / Remove PDF Handler
  const handleReplacePdf = () => {
    setFileName(null);
    setFileSize(null);
    setPageCount(0);
    setUploadDate(null);
    setUploadError(null);
    setValidationError(null);
    addToast('PDF Removed', 'Upload zone reset. Please select a replacement PDF paper.', 'info');
  };

  // Form Validation
  const validateForm = (): boolean => {
    if (!fileName) {
      setValidationError('Please upload an official Question Paper PDF before continuing.');
      return false;
    }
    if (uploadError) {
      setValidationError('Please resolve file upload errors before continuing.');
      return false;
    }
    if (totalMarks <= 0) {
      setValidationError('Total Marks must be greater than 0.');
      return false;
    }
    if (questionCount <= 0) {
      setValidationError('Question Count must be greater than 0.');
      return false;
    }
    if (durationMinutes <= 0) {
      setValidationError('Exam Duration must be greater than 0.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handler: Save as Draft
  const handleSaveAsDraft = () => {
    addToast('Draft Saved', `Saved PDF setup with paper ${fileName || 'pending'}.`, 'success');
  };

  // Handler: Continue to Step 6 PDF Branch
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      addToast(
        'PDF Setup Complete',
        `Validated PDF question paper ${fileName} (${questionCount} Qs, ${totalMarks} Marks). Advancing to Step 6: Section Breakdown & Answer Key`,
        'success'
      );
      setActiveTab('create-exam-pdf-section');
    } else {
      addToast('Validation Error', 'Please complete PDF setup requirements before continuing.', 'danger');
    }
  };

  // Demo Controls Presets
  const loadPreset = (preset: 'valid' | 'invalidFormat' | 'fileTooLarge' | 'reset') => {
    setIsSubmitted(false);
    setValidationError(null);
    setUploadError(null);

    if (preset === 'valid') {
      setFileName('Grade10_Physics_Final_Assessment.pdf');
      setFileSize(5452595); // ~5.2 MB
      setPageCount(8);
      setUploadDate('2026-08-11');
      setTotalMarks(50);
      setQuestionCount(25);
      setDurationMinutes(90);
      setSubmissionType('omr');
      addToast('Valid PDF Preset Loaded', 'Loaded Grade10_Physics_Final_Assessment.pdf (5.2 MB, 8 Pages)', 'success');
    } else if (preset === 'invalidFormat') {
      setFileName(null);
      setFileSize(null);
      setUploadError('Invalid file format (Mathematics_Curriculum.docx). Only PDF files (.pdf) are supported.');
      setIsSubmitted(true);
      addToast('Error Simulated', 'Triggered invalid file format error (.docx uploaded)', 'warning');
    } else if (preset === 'fileTooLarge') {
      setFileName(null);
      setFileSize(null);
      setUploadError('File size exceeds 15 MB limit (Uploaded file: 18.5 MB). Please compress your PDF document.');
      setIsSubmitted(true);
      addToast('Error Simulated', 'Triggered file size limit error (18.5 MB uploaded)', 'warning');
    } else if (preset === 'reset') {
      handleReplacePdf();
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: false, done: true },
    { num: 2, label: 'Recipient Selection', active: false, done: true },
    { num: 3, label: 'Academic Mapping', active: false, done: true },
    { num: 4, label: 'Question Source Choice', active: false, done: true },
    { num: 5, label: 'PDF Paper Setup', active: true, done: false },
    { num: 6, label: 'Section & Answer Key', active: false, done: false },
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
            <FileUp className="w-6 h-6 text-indigo-600" />
            Create Online Examination — Step 5: PDF Question Paper Setup
          </h2>
          <p className="text-xs text-slate-500">
            Upload the official question paper PDF and configure total marks, duration, and student answer submission mode
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
      <div className="p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 rounded-2xl border border-indigo-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
            Prototype Demo Controls:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadPreset('valid')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Valid Physics Exam PDF (100% Valid)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('invalidFormat')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate: Invalid Format Error (.docx)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('fileTooLarge')}
            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate: File Too Large Error (18.5 MB)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('reset')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            Reset Upload Zone
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
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30'
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
          <p className="font-mono text-indigo-600 font-bold">{createExamFormState.examCode}</p>
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

        {/* Step 4 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-0.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question Source</span>
          <p className="font-bold text-indigo-900">Upload Question Paper PDF</p>
          <p className="text-[11px] text-slate-500">Option 2 Branch</p>
        </div>
      </div>

      {/* Global Validation & Upload Error Banner */}
      {(uploadError || (isSubmitted && validationError)) && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">PDF Setup Validation Error:</h4>
            <p className="font-semibold text-red-800 mt-0.5">{uploadError || validationError}</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleContinue} className="space-y-6">
        {/* SECTION 1: PDF DOCUMENT UPLOADER ZONE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileUp className="w-4 h-4 text-indigo-600" />
                1. Upload Question Paper PDF Document
              </h3>
              <p className="text-xs text-slate-500">
                Supports PDF format only (.pdf). Maximum allowed file size is 15 MB.
              </p>
            </div>

            <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-black rounded-xl flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" /> Official Non-Editable Paper
            </span>
          </div>

          {/* Uploader Card or Preview */}
          {!fileName ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileDropOrSelect(e.dataTransfer.files[0]);
                }
              }}
              className={`p-10 border-2 border-dashed rounded-2xl text-center transition-all ${
                isDragOver
                  ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
                  : uploadError
                  ? 'border-red-300 bg-red-50/50'
                  : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'
              }`}
            >
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Drag and drop your Question Paper PDF here
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Or click below to browse your computer for PDF documents
                  </p>
                </div>

                <label className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all">
                  <span>Browse PDF File</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileDropOrSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                <p className="text-[11px] font-semibold text-slate-400 pt-2">
                  Allowed Format: .pdf | Maximum Size: 15 MB
                </p>
              </div>
            </div>
          ) : (
            /* UPLOADED DOCUMENT PREVIEW CARD */
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8 text-indigo-400" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md">{fileName}</h4>
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase rounded-md">
                      Uploaded ✓
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                    <span>Size: {formatFileSize(fileSize)}</span>
                    <span>•</span>
                    <span>Pages: {pageCount} Pages</span>
                    <span>•</span>
                    <span>Uploaded: {uploadDate}</span>
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview PDF Document</span>
                </button>

                <button
                  type="button"
                  onClick={handleReplacePdf}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Replace PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: EXAM PARAMETERS CONFIGURATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              2. Configure PDF Exam Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Set total marks, question count, duration, and student answer submission format
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total Marks Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Configured from Step 1 (Default: 50 Marks)</p>
            </div>

            {/* Total Question Count Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Question Count in PDF <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Total questions inside PDF paper</p>
            </div>

            {/* Exam Duration Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Duration (Minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Allotted time limit for students</p>
            </div>
          </div>

          {/* Answer Submission Type Cards */}
          <div className="pt-2">
            <label className="block text-xs font-extrabold text-slate-800 mb-2">
              Answer Submission Type <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Option 1: Digital OMR Grid */}
              <div
                onClick={() => setSubmissionType('omr')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  submissionType === 'omr'
                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Grid className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900">Digital OMR Grid</h4>
                <p className="text-[11px] text-slate-500 mt-1">Multiple Choice Bubble Grid for fast automated grading</p>
              </div>

              {/* Option 2: Online Text Answers */}
              <div
                onClick={() => setSubmissionType('text')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  submissionType === 'text'
                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <PenTool className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900">Online Text Answers</h4>
                <p className="text-[11px] text-slate-500 mt-1">Students type subjective answers directly in portal</p>
              </div>

              {/* Option 3: Upload Answer Sheet Image */}
              <div
                onClick={() => setSubmissionType('image_upload')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  submissionType === 'image_upload'
                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Image className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900">Upload Answer Sheet</h4>
                <p className="text-[11px] text-slate-500 mt-1">Students capture & upload photos of hand-written paper</p>
              </div>

              {/* Option 4: Hybrid */}
              <div
                onClick={() => setSubmissionType('hybrid')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  submissionType === 'hybrid'
                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <Layers className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="text-xs font-black text-slate-900">Hybrid Format</h4>
                <p className="text-[11px] text-slate-500 mt-1">OMR bubbles for Section A + Subjective uploads for Section B</p>
              </div>
            </div>
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
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Continue to Step 6: Section & Answer Key</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* PDF DOCUMENT PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="text-base font-black tracking-tight">{fileName}</h3>
                  <p className="text-xs text-slate-400">
                    Official Student Question Paper Document ({pageCount} Pages • {formatFileSize(fileSize)})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body — PDF Page Preview Viewer */}
            <div className="p-6 bg-slate-100 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="p-8 bg-white border border-slate-300 rounded-2xl shadow-md max-w-2xl mx-auto space-y-6 text-slate-900 font-serif">
                {/* PDF Header Page Mock */}
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <h2 className="text-xl font-bold uppercase tracking-wide">ST. JOSEPH HIGHER SECONDARY SCHOOL</h2>
                  <h3 className="text-sm font-bold">{createExamFormState.examName || 'MIDTERM EXAMINATION 2026'}</h3>
                  <div className="flex justify-between text-xs font-semibold pt-2 text-slate-700 font-sans">
                    <span>Subject: {createExamAcademicMappingState.selectedSubject}</span>
                    <span>Time: {durationMinutes} Mins</span>
                    <span>Max Marks: {totalMarks}</span>
                  </div>
                </div>

                {/* Question Section Preview */}
                <div className="space-y-4 text-sm leading-relaxed font-sans">
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider bg-slate-100 p-2 rounded">
                    SECTION A — MULTIPLE CHOICE QUESTIONS (10 Marks)
                  </h4>

                  <p className="font-semibold">
                    1. A particle moves in a circular path of radius r. What is the displacement after completing half a circle?
                  </p>
                  <div className="pl-4 space-y-1 text-xs text-slate-700 font-mono">
                    <p>(a) Zero</p>
                    <p>(b) π r</p>
                    <p>(c) 2 r</p>
                    <p>(d) 2 π r</p>
                  </div>

                  <p className="font-semibold pt-2">
                    2. Which of the following equations represents Ohm’s Law under constant physical conditions?
                  </p>
                  <div className="pl-4 space-y-1 text-xs text-slate-700 font-mono">
                    <p>(a) V = I / R</p>
                    <p>(b) V = I × R</p>
                    <p>(c) I = V² R</p>
                    <p>(d) R = V × I</p>
                  </div>

                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider bg-slate-100 p-2 rounded pt-2">
                    SECTION B — DESCRIPTIVE QUESTIONS (40 Marks)
                  </h4>
                  <p className="font-semibold">
                    3. Derive the expression for total resistance when three resistors R₁, R₂, and R₃ are connected in parallel.
                  </p>
                  <p className="font-semibold">
                    4. State and explain Fleming’s Left Hand Rule with a neat labeled schematic diagram.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                🔒 Non-Editable Official Question Paper Viewer
              </span>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
