import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { ExamBasicDetailsFormData, ScheduledExam } from '../types';
import {
  FileText,
  Zap,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Save,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const ExamBasicDetailsView: React.FC = () => {
  const {
    createExamFormState,
    updateCreateExamFormState,
    resetCreateExamFormState,
    setActiveTab,
    scheduledExams,
    scheduleNewExam,
    addToast,
  } = useExam();

  // Form Field States initialized from context state (preserves state across steps)
  const [examName, setExamName] = useState(createExamFormState.examName || '');
  const [examCode, setExamCode] = useState(createExamFormState.examCode || '');
  const [examType, setExamType] = useState<'spot' | 'scheduled'>(createExamFormState.examType || 'scheduled');
  const [makeImmediatelyAvailable, setMakeImmediatelyAvailable] = useState<boolean>(
    createExamFormState.makeImmediatelyAvailable !== undefined ? createExamFormState.makeImmediatelyAvailable : true
  );

  const [startDate, setStartDate] = useState(createExamFormState.startDate || '2026-08-15');
  const [startTime, setStartTime] = useState(createExamFormState.startTime || '10:00 AM');
  const [endDate, setEndDate] = useState(createExamFormState.endDate || '2026-08-15');
  const [endTime, setEndTime] = useState(createExamFormState.endTime || '11:30 AM');

  const [durationMinutes, setDurationMinutes] = useState<number | string>(
    createExamFormState.durationMinutes !== undefined ? createExamFormState.durationMinutes : 60
  );
  const [totalMarks, setTotalMarks] = useState<number | string>(
    createExamFormState.totalMarks !== undefined ? createExamFormState.totalMarks : 50
  );
  const [passMarks, setPassMarks] = useState<number | string>(
    createExamFormState.passMarks !== undefined ? createExamFormState.passMarks : 20
  );

  const [instructions, setInstructions] = useState(
    createExamFormState.instructions || 'Answer all questions. Do not refresh the page during the examination.'
  );

  // Validation Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync to Context whenever fields change so draft state is preserved automatically
  useEffect(() => {
    updateCreateExamFormState({
      examName,
      examCode,
      examType,
      makeImmediatelyAvailable,
      startDate,
      startTime,
      endDate,
      endTime,
      durationMinutes: Number(durationMinutes) || 0,
      totalMarks: Number(totalMarks) || 0,
      passMarks: Number(passMarks) || 0,
      instructions,
    });
  }, [
    examName,
    examCode,
    examType,
    makeImmediatelyAvailable,
    startDate,
    startTime,
    endDate,
    endTime,
    durationMinutes,
    totalMarks,
    passMarks,
    instructions,
  ]);

  // Helper: Generate Unique Exam Code
  const generateExamCode = () => {
    const subjects = ['MAT', 'PHY', 'CHE', 'ENG', 'BIO', 'CS'];
    const randomSub = subjects[Math.floor(Math.random() * subjects.length)];
    const grade = Math.floor(Math.random() * 5) + 8; // G8-G12
    const num = Math.floor(Math.random() * 900) + 100;
    const generated = `${randomSub}-G${grade}-2026-${num}`;
    setExamCode(generated);
    setErrors((prev) => ({ ...prev, examCode: '' }));
    addToast('Exam Code Generated', `Generated unique code: ${generated}`, 'info');
  };

  // Auto-generate exam code on initial load if empty
  useEffect(() => {
    if (!examCode) {
      setExamCode('MAT-G8-2026-001');
    }
  }, []);

  // Validation Logic
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Exam Name
    if (!examName.trim()) {
      newErrors.examName = 'Exam Name is required.';
    }

    // 2. Exam Code
    if (!examCode.trim()) {
      newErrors.examCode = 'Exam Code is required.';
    } else {
      // Uniqueness check against existing scheduled exams
      const isDuplicate = scheduledExams.some(
        (ex) => ex.questionPaperCode.toLowerCase() === examCode.trim().toLowerCase()
      );
      if (isDuplicate) {
        newErrors.examCode = 'This exam code is already in use.';
      }
    }

    // 3. Exam Type & Scheduling
    if (!examType) {
      newErrors.examType = 'Exam Type selection is required.';
    }

    if (examType === 'scheduled') {
      if (!startDate) newErrors.startDate = 'Start Date is required.';
      if (!startTime) newErrors.startTime = 'Start Time is required.';
      if (!endDate) newErrors.endDate = 'End Date is required.';
      if (!endTime) newErrors.endTime = 'End Time is required.';

      if (startDate && endDate && startDate > endDate) {
        newErrors.endDate = 'End date cannot be earlier than start date.';
      }
    }

    // 4. Duration
    const durNum = Number(durationMinutes);
    if (isNaN(durNum) || durNum <= 0) {
      newErrors.durationMinutes = 'Exam duration must be greater than 0.';
    }

    // 5. Marks
    const totNum = Number(totalMarks);
    const passNum = Number(passMarks);

    if (isNaN(totNum) || totNum <= 0) {
      newErrors.totalMarks = 'Total marks must be greater than 0.';
    }

    if (isNaN(passNum) || passNum <= 0) {
      newErrors.passMarks = 'Minimum pass mark must be greater than 0.';
    } else if (!isNaN(totNum) && passNum > totNum) {
      newErrors.passMarks = 'Minimum pass mark cannot exceed total marks.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler: Save as Draft
  const handleSaveAsDraft = () => {
    const draftExam: ScheduledExam = {
      id: 'draft-' + Date.now(),
      title: examName || 'Untitled Draft Exam',
      examType: 'Midterm',
      subject: 'General Assessment',
      class: 'Grade 8',
      section: 'Sec A',
      academicYear: '2025-2026',
      semester: 'Term 1',
      questionPaperId: 'qp-draft-1',
      questionPaperCode: examCode || 'DRAFT-CODE-001',
      totalQuestions: 10,
      maxMarks: Number(totalMarks) || 50,
      assignmentType: 'entire_class',
      assignedStudentIds: [],
      studentCount: 30,
      examDate: startDate || new Date().toISOString().split('T')[0],
      startTime: startTime || '09:00 AM',
      endTime: endTime || '10:00 AM',
      durationMinutes: Number(durationMinutes) || 60,
      timeZone: 'IST (UTC+05:30)',
      lateEntryAllowed: true,
      lateEntryLimitMinutes: 15,
      instructions,
      controls: {
        randomizeQuestions: true,
        randomizeOptions: true,
        preventCopyPaste: true,
        fullScreenMode: true,
        detectTabSwitching: true,
        autoSubmitOnTimeEnd: true,
        allowResume: true,
        showTimer: true,
        allowCalculator: false,
        allowReviewBeforeSubmit: true,
      },
      status: 'draft',
    };

    scheduleNewExam(draftExam);
    addToast('Exam Saved as Draft', `Draft "${draftExam.title}" saved successfully.`, 'success');
  };

  // Handler: Continue to Step 2
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      addToast('Basic Details Saved', 'Advancing to Step 2: Recipient Selection', 'success');
      setActiveTab('create-exam-recipients');
    } else {
      addToast('Validation Failed', 'Please fix form errors before continuing.', 'danger');
    }
  };

  // Demo Presets Helper
  const loadPreset = (preset: 'spot' | 'scheduled' | 'error' | 'empty') => {
    setIsSubmitted(false);
    setErrors({});

    if (preset === 'spot') {
      setExamName('Mathematics Grade 8 Spot Algebra Quiz');
      setExamCode('MAT-SPOT-2026-088');
      setExamType('spot');
      setMakeImmediatelyAvailable(true);
      setDurationMinutes(30);
      setTotalMarks(25);
      setPassMarks(10);
      setInstructions('Answer all questions. Immediately available after publishing. Do not refresh during test.');
      addToast('Spot Test Preset Loaded', 'Form pre-filled with Spot Test data.', 'info');
    } else if (preset === 'scheduled') {
      setExamName('Physics Grade 10 Midterm Examination 2026');
      setExamCode('PHY-G10-2026-102');
      setExamType('scheduled');
      setStartDate('2026-08-20');
      setStartTime('09:00 AM');
      setEndDate('2026-08-20');
      setEndTime('11:00 AM');
      setDurationMinutes(120);
      setTotalMarks(100);
      setPassMarks(40);
      setInstructions('Final Midterm assessment. Ensure quiet environment and stable connectivity.');
      addToast('Scheduled Test Preset Loaded', 'Form pre-filled with Scheduled Test data.', 'info');
    } else if (preset === 'error') {
      setExamName('');
      setExamCode('QP-MATH-101'); // Duplicate code existing in scheduledExams mock data
      setExamType('scheduled');
      setStartDate('2026-08-25');
      setEndDate('2026-08-20'); // End before start
      setDurationMinutes(-10); // Invalid duration
      setTotalMarks(50);
      setPassMarks(60); // Pass > Total
      setIsSubmitted(true);
      setTimeout(() => validateForm(), 50);
      addToast('Validation Errors Triggered', 'Simulated multiple invalid fields for testing.', 'warning');
    } else if (preset === 'empty') {
      setExamName('');
      setExamCode('');
      setExamType('spot');
      setDurationMinutes('');
      setTotalMarks('');
      setPassMarks('');
      setInstructions('');
      addToast('Form Cleared', 'All input fields reset.', 'info');
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: true },
    { num: 2, label: 'Recipient Selection', active: false },
    { num: 3, label: 'Academic Mapping', active: false },
    { num: 4, label: 'Question Source', active: false },
    { num: 5, label: 'Question & Marks', active: false },
    { num: 6, label: 'Review & Publish', active: false },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveTab('exam-scheduling')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Teacher Exam List</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Create Online Examination — Step 1
          </h2>
          <p className="text-xs text-slate-500">
            Configure examination mode, schedule timeline, unique reference code, duration, and pass marks
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAsDraft}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Save as Draft</span>
          </button>

          <button
            onClick={() => setActiveTab('exam-scheduling')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Preset Testing Toolbar */}
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
            onClick={() => loadPreset('spot')}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Spot Test
          </button>

          <button
            type="button"
            onClick={() => loadPreset('scheduled')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Scheduled Test
          </button>

          <button
            type="button"
            onClick={() => loadPreset('error')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate Validation Errors
          </button>

          <button
            type="button"
            onClick={() => loadPreset('empty')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* 6-Step Multi-Step Flow Indicator Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {creationSteps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    step.active
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step.num}
                </div>
                <span
                  className={`text-xs font-bold tracking-tight ${
                    step.active ? 'text-white font-black' : 'text-slate-400'
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

      {/* Global Validation Error Banner (Shows when validation fails on submit) */}
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Please correct the following errors before continuing:</h4>
            <ul className="list-disc list-inside space-y-0.5 text-red-700 font-medium">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleContinue} className="space-y-6">
        {/* SECTION 1: EXAM TYPE SELECTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                1. Select Exam Type <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-slate-500">
                Choose whether this exam is an instant Spot Test or a pre-scheduled Assessment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Spot Test Card Option */}
            <div
              onClick={() => {
                setExamType('spot');
                setErrors((prev) => ({ ...prev, examType: '' }));
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                examType === 'spot'
                  ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      examType === 'spot' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Spot Test</h4>
                    <p className="text-xs text-slate-500">Instant / On-Demand Exam</p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="examType"
                  checked={examType === 'spot'}
                  onChange={() => setExamType('spot')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                />
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Intended for quick class tests or instant evaluations where students attend immediately or within a short window.
              </p>

              {/* Spot Test Option Sub-checkbox */}
              {examType === 'spot' && (
                <div className="mt-4 pt-3 border-t border-blue-200/80 animate-in fade-in duration-150">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-blue-950">
                    <input
                      type="checkbox"
                      checked={makeImmediatelyAvailable}
                      onChange={(e) => setMakeImmediatelyAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Make exam available immediately after publishing</span>
                  </label>
                </div>
              )}
            </div>

            {/* Scheduled Test Card Option */}
            <div
              onClick={() => {
                setExamType('scheduled');
                setErrors((prev) => ({ ...prev, examType: '' }));
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                examType === 'scheduled'
                  ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      examType === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Scheduled Test</h4>
                    <p className="text-xs text-slate-500">Timetabled Examination Window</p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="examType"
                  checked={examType === 'scheduled'}
                  onChange={() => setExamType('scheduled')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                />
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Conducted within a predefined timetable. Students can access the exam strictly between configured start and end times.
              </p>

              {examType === 'scheduled' && (
                <div className="mt-4 pt-3 border-t border-blue-200/80 text-xs text-blue-900 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Requires start & end date/time configuration below</span>
                </div>
              )}
            </div>
          </div>

          {/* SCHEDULE FIELDS (Only displayed when Scheduled Test is selected) */}
          {examType === 'scheduled' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 mt-3 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Schedule Date & Time Window
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setErrors((prev) => ({ ...prev, startDate: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-900 ${
                      errors.startDate ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                    }`}
                  />
                  {errors.startDate && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setErrors((prev) => ({ ...prev, startTime: '' }));
                    }}
                    placeholder="e.g. 10:00 AM"
                    className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-900 ${
                      errors.startTime ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                    }`}
                  />
                  {errors.startTime && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.startTime}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setErrors((prev) => ({ ...prev, endDate: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-900 ${
                      errors.endDate ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                    }`}
                  />
                  {errors.endDate && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.endDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setErrors((prev) => ({ ...prev, endTime: '' }));
                    }}
                    placeholder="e.g. 11:30 AM"
                    className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-900 ${
                      errors.endTime ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                    }`}
                  />
                  {errors.endTime && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.endTime}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: BASIC EXAM DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              2. Basic Examination Metadata
            </h3>
            <p className="text-xs text-slate-500">Provide official title, exam code, duration, and marks allocation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Exam Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Exam Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => {
                  setExamName(e.target.value);
                  setErrors((prev) => ({ ...prev, examName: '' }));
                }}
                placeholder="e.g. Mathematics Grade 8 Term Exam"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.examName ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                }`}
              />
              {errors.examName && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.examName}</p>}
            </div>

            {/* Exam Code (With Auto Generate Button) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Exam Code <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateExamCode}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Auto-Generate</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={examCode}
                  onChange={(e) => {
                    setExamCode(e.target.value);
                    setErrors((prev) => ({ ...prev, examCode: '' }));
                  }}
                  placeholder="e.g. MAT-G8-2026-001"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.examCode ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                  }`}
                />
              </div>

              {errors.examCode ? (
                <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.examCode}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">Unique reference code (e.g. MAT-G8-2026-001)</p>
              )}
            </div>

            {/* Exam Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Exam Duration (Minutes) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => {
                    setDurationMinutes(e.target.value);
                    setErrors((prev) => ({ ...prev, durationMinutes: '' }));
                  }}
                  placeholder="e.g. 60"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.durationMinutes ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  mins
                </span>
              </div>
              {errors.durationMinutes && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.durationMinutes}</p>
              )}
            </div>

            {/* Marks Grid: Total Marks & Minimum Pass Mark */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalMarks}
                  onChange={(e) => {
                    setTotalMarks(e.target.value);
                    setErrors((prev) => ({ ...prev, totalMarks: '' }));
                  }}
                  placeholder="e.g. 50"
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.totalMarks ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                  }`}
                />
                {errors.totalMarks && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.totalMarks}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Min Pass Mark <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={passMarks}
                  onChange={(e) => {
                    setPassMarks(e.target.value);
                    setErrors((prev) => ({ ...prev, passMarks: '' }));
                  }}
                  placeholder="e.g. 20"
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.passMarks ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300'
                  }`}
                />
                {errors.passMarks && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.passMarks}</p>
                )}
              </div>
            </div>
          </div>

          {/* Instructions Text Area */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Teacher Instructions for Students</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Answer all questions. Do not refresh the page during the examination."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* SECTION 3: FORM ACTION TOOLBAR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('exam-scheduling')}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>Save as Draft</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Continue to Recipient Selection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
