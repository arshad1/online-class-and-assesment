import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { ScheduledExam, ExamControlsConfig, QuestionPaper, UploadedPaperFile } from '../../types';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  FileText,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  Upload,
  FileUp,
  Paperclip,
  Trash2,
} from 'lucide-react';

export const ScheduleExamModal: React.FC = () => {
  const {
    showScheduleModal,
    setShowScheduleModal,
    questionPapers,
    addQuestionPaper,
    scheduleNewExam,
    setPreviewQuestionPaper,
    addToast,
  } = useExam();

  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [examName, setExamName] = useState('Grade 10 Mathematics Term Test');
  const [examType, setExamType] = useState<ScheduledExam['examType']>('Midterm');
  const [subject, setSubject] = useState('Mathematics');
  const [className, setClassName] = useState('Class 10');
  const [section, setSection] = useState('Sec A & B');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [semester, setSemester] = useState('Term 2');

  // Question Paper Source Mode: 'existing' | 'upload'
  const [paperSourceMode, setPaperSourceMode] = useState<'existing' | 'upload'>('existing');

  // Selected Question Paper (Mode 1)
  const [selectedPaperId, setSelectedPaperId] = useState(questionPapers[0]?.id || '');
  const selectedPaper = questionPapers.find((qp) => qp.id === selectedPaperId) || questionPapers[0];

  // Uploaded Question Paper File (Mode 2)
  const [uploadedPaperFile, setUploadedPaperFile] = useState<UploadedPaperFile | null>({
    url: '/assets/sample_math_paper.pdf',
    fileName: 'Grade10_Mathematics_Term_Exam_Paper_2026.pdf',
    fileSize: '2.8 MB',
    fileType: 'application/pdf',
    uploadedAt: '2026-08-10 10:30 AM',
  });
  const [customTotalQuestions, setCustomTotalQuestions] = useState<number>(10);
  const [customMaxMarks, setCustomMaxMarks] = useState<number>(100);

  // Student Assignment
  const [assignmentType, setAssignmentType] = useState<ScheduledExam['assignmentType']>('entire_class');
  const [selectedStudentCount, setSelectedStudentCount] = useState<number>(45);

  // Exam Timing
  const [examDate, setExamDate] = useState('2026-08-15');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [timeZone, setTimeZone] = useState('IST (UTC+05:30)');
  const [lateEntryAllowed, setLateEntryAllowed] = useState(true);
  const [lateEntryLimitMinutes, setLateEntryLimitMinutes] = useState(15);

  // Exam Instructions
  const [instructions, setInstructions] = useState(
    '1. Read all questions carefully before answering.\n2. Ensure stable internet connection throughout the exam.\n3. Do not switch browser tabs or exit full-screen mode.\n4. Scientific calculators are permitted for section C calculations.'
  );

  // Exam Controls Toggles
  const [controls, setControls] = useState<ExamControlsConfig>({
    randomizeQuestions: true,
    randomizeOptions: true,
    preventCopyPaste: true,
    fullScreenMode: true,
    detectTabSwitching: true,
    autoSubmitOnTimeEnd: true,
    allowResume: true,
    showTimer: true,
    allowCalculator: true,
    allowReviewBeforeSubmit: true,
  });

  if (!showScheduleModal) return null;

  const handleToggle = (key: keyof ExamControlsConfig) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePaperChange = (paperId: string) => {
    setSelectedPaperId(paperId);
    const paper = questionPapers.find((qp) => qp.id === paperId);
    if (paper) {
      setSubject(paper.subject);
      setClassName(paper.class);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newUploadedFile: UploadedPaperFile = {
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        fileType: file.type || 'application/pdf',
        uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setUploadedPaperFile(newUploadedFile);
      addToast('Question Paper Uploaded', `Successfully attached ${file.name}`, 'success');
    }
  };

  const handleScheduleSubmit = (asDraft: boolean = false) => {
    let finalPaperId = selectedPaper?.id || 'qp-101';
    let finalPaperCode = selectedPaper?.code || 'QP-MATH-101';
    let finalTotalQuestions = selectedPaper?.totalQuestions || 10;
    let finalMaxMarks = selectedPaper?.maxMarks || 100;

    if (paperSourceMode === 'upload' && uploadedPaperFile) {
      const uploadedQPId = 'qp-uploaded-' + Date.now();
      const uploadedQPCode = 'QP-' + subject.substring(0, 3).toUpperCase() + '-UPLOADED-' + Math.floor(Math.random() * 900 + 100);

      const newUploadedQP: QuestionPaper = {
        id: uploadedQPId,
        code: uploadedQPCode,
        title: `${examName} (Uploaded PDF Paper)`,
        subject,
        class: className,
        totalQuestions: customTotalQuestions,
        maxMarks: customMaxMarks,
        objectiveCount: 5,
        subjectiveCount: 5,
        paperType: 'uploaded',
        uploadedFile: uploadedPaperFile,
        sections: [
          { id: 'sec-up', name: 'Section A: Uploaded PDF Questions', questionType: 'subjective', count: customTotalQuestions, totalMarks: customMaxMarks },
        ],
        questions: [],
      };
      addQuestionPaper(newUploadedQP);

      finalPaperId = uploadedQPId;
      finalPaperCode = uploadedQPCode;
      finalTotalQuestions = customTotalQuestions;
      finalMaxMarks = customMaxMarks;
    }

    const newExam: ScheduledExam = {
      id: 'exam-' + Date.now(),
      title: examName,
      examType,
      subject,
      class: className,
      section,
      academicYear,
      semester,
      questionPaperId: finalPaperId,
      questionPaperCode: finalPaperCode,
      totalQuestions: finalTotalQuestions,
      maxMarks: finalMaxMarks,
      paperType: paperSourceMode === 'upload' ? 'uploaded' : 'existing',
      uploadedFile: paperSourceMode === 'upload' ? uploadedPaperFile || undefined : undefined,
      assignmentType,
      assignedStudentIds: ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6'],
      studentCount: selectedStudentCount,
      examDate,
      startTime,
      endTime,
      durationMinutes,
      timeZone,
      lateEntryAllowed,
      lateEntryLimitMinutes,
      instructions,
      controls,
      status: asDraft ? 'draft' : 'scheduled',
    };

    scheduleNewExam(newExam);
    setShowScheduleModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Schedule New Online Examination</h2>
              <p className="text-xs text-slate-400">
                Configure timing, link question paper (existing or uploaded) & set security parameters
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowScheduleModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          {[
            { num: 1, label: 'Basic Details & Paper', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { num: 2, label: 'Students & Timing', icon: <Clock className="w-3.5 h-3.5" /> },
            { num: 3, label: 'Instructions & Controls', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((step) => (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activeStep === step.num
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: BASIC DETAILS & QUESTION PAPER */}
          {activeStep === 1 && (
            <div className="space-y-6">
              {/* Basic Details Section */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  1. Basic Exam Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Exam Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                      placeholder="e.g. Grade 10 Mathematics Midterm 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Exam Type
                    </label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                    >
                      <option value="Unit Test">Unit Test</option>
                      <option value="Midterm">Midterm Examination</option>
                      <option value="Final">Final Examination</option>
                      <option value="Quiz">Quick Quiz</option>
                      <option value="Term Exam">Term Exam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Class & Section
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="Class"
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="Section"
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Semester / Term
                    </label>
                    <input
                      type="text"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Question Paper Selection Section */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    2. Question Paper Source
                  </h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    Mode: {paperSourceMode === 'existing' ? 'Pre-Generated Repository' : 'Uploaded Custom File'}
                  </span>
                </div>

                {/* Segmented Mode Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-blue-100/70 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaperSourceMode('existing')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                      paperSourceMode === 'existing'
                        ? 'bg-white text-blue-900 shadow-sm'
                        : 'text-blue-700 hover:text-blue-950'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Select Existing Question Paper</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaperSourceMode('upload')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                      paperSourceMode === 'upload'
                        ? 'bg-white text-blue-900 shadow-sm'
                        : 'text-blue-700 hover:text-blue-950'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Custom Paper (PDF / DOC)</span>
                  </button>
                </div>

                {/* MODE 1: SELECT EXISTING QUESTION PAPER */}
                {paperSourceMode === 'existing' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Question Paper <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedPaperId}
                        onChange={(e) => handlePaperChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                      >
                        {questionPapers.map((qp) => (
                          <option key={qp.id} value={qp.id}>
                            {qp.code}: {qp.title} ({qp.totalQuestions} Qs | {qp.maxMarks} Marks)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selected Question Paper Summary Card */}
                    {selectedPaper && (
                      <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-600 text-white">
                              {selectedPaper.code}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900">{selectedPaper.title}</h4>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-600">
                            <span>Subject: <strong>{selectedPaper.subject}</strong></span>
                            <span>Total Qs: <strong>{selectedPaper.totalQuestions}</strong></span>
                            <span>Max Marks: <strong>{selectedPaper.maxMarks}</strong></span>
                            <span>Objective: <strong>{selectedPaper.objectiveCount}</strong></span>
                            <span>Subjective: <strong>{selectedPaper.subjectiveCount}</strong></span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPreviewQuestionPaper(selectedPaper)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview Question Paper</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 2: UPLOAD CUSTOM QUESTION PAPER FILE */}
                {paperSourceMode === 'upload' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-white hover:bg-blue-50/50 transition-all text-center space-y-3 relative">
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc,.png,.jpg"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Click or drag & drop to upload question paper file
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports PDF, DOCX, DOC, or Image files (Max size: 25 MB)
                        </p>
                      </div>
                    </div>

                    {/* Attached File Preview Card */}
                    {uploadedPaperFile && (
                      <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-black text-xs">
                            PDF
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{uploadedPaperFile.fileName}</h4>
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                                Attached
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Size: <strong>{uploadedPaperFile.fileSize}</strong> • Uploaded at: {uploadedPaperFile.uploadedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const tempPaper: QuestionPaper = {
                                id: 'qp-temp-' + Date.now(),
                                code: 'QP-UPLOADED-PDF',
                                title: uploadedPaperFile.fileName,
                                subject,
                                class: className,
                                totalQuestions: customTotalQuestions,
                                maxMarks: customMaxMarks,
                                objectiveCount: 5,
                                subjectiveCount: 5,
                                paperType: 'uploaded',
                                uploadedFile: uploadedPaperFile,
                                sections: [],
                                questions: [],
                              };
                              setPreviewQuestionPaper(tempPaper);
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Integrated PDF Viewer</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUploadedPaperFile(null)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Custom Paper Metadata (Total Questions & Marks) */}
                    <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-xl border border-blue-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Total Questions in Uploaded Paper
                        </label>
                        <input
                          type="number"
                          value={customTotalQuestions}
                          onChange={(e) => setCustomTotalQuestions(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Maximum Paper Marks
                        </label>
                        <input
                          type="number"
                          value={customMaxMarks}
                          onChange={(e) => setCustomMaxMarks(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: STUDENTS & TIMING */}
          {activeStep === 2 && (
            <div className="space-y-6">
              {/* Student Assignment */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    3. Student Assignment
                  </h3>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-600 text-white shadow-xs">
                    {selectedStudentCount} Students Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'entire_class', label: 'Entire Class', desc: 'All 45 enrolled students' },
                    { id: 'specific_section', label: 'Specific Section', desc: 'Section A (24) or B (21)' },
                    { id: 'student_group', label: 'Student Group', desc: 'Custom honors / lab group' },
                    { id: 'individual', label: 'Individual Candidates', desc: 'Select candidates manually' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setAssignmentType(opt.id as any);
                        if (opt.id === 'entire_class') setSelectedStudentCount(45);
                        else if (opt.id === 'specific_section') setSelectedStudentCount(24);
                        else setSelectedStudentCount(12);
                      }}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        assignmentType === opt.id
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{opt.label}</span>
                        {assignmentType === opt.id && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Timing */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  4. Exam Schedule & Timing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Exam Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="e.g. 09:00 AM"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="e.g. 11:00 AM"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Time Zone
                    </label>
                    <input
                      type="text"
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Late Entry Allowance
                    </label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={lateEntryAllowed}
                          onChange={(e) => setLateEntryAllowed(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Allow Late Entry</span>
                      </label>

                      {lateEntryAllowed && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-slate-500">Max</span>
                          <input
                            type="number"
                            value={lateEntryLimitMinutes}
                            onChange={(e) => setLateEntryLimitMinutes(Number(e.target.value))}
                            className="w-14 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-center text-slate-900"
                          />
                          <span className="text-slate-500">mins</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INSTRUCTIONS & EXAM CONTROLS */}
          {activeStep === 3 && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  5. Exam Instructions for Students
                </h3>

                <textarea
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed font-sans focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter guidelines, instructions, and special rules..."
                />
              </div>

              {/* Exam Controls Grid Toggles */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  6. Exam Security & Experience Controls
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'randomizeQuestions', label: 'Randomize Questions', desc: 'Shuffle order of questions for each student' },
                    { key: 'randomizeOptions', label: 'Randomize Options', desc: 'Shuffle MCQ option choices for each student' },
                    { key: 'preventCopyPaste', label: 'Prevent Copy / Paste', desc: 'Disable clipboard copy, paste & right click' },
                    { key: 'fullScreenMode', label: 'Mandatory Fullscreen Mode', desc: 'Lock candidate browser in full screen' },
                    { key: 'detectTabSwitching', label: 'Detect Tab Switching', desc: 'Log and warn student when window focus is lost' },
                    { key: 'autoSubmitOnTimeEnd', label: 'Auto-Submit on Time Expiry', desc: 'Automatically submit test when clock reaches zero' },
                    { key: 'allowResume', label: 'Allow Student Resume', desc: 'Permit reconnection if network disconnects' },
                    { key: 'showTimer', label: 'Show Live Timer', desc: 'Display countdown clock on student toolbar' },
                    { key: 'allowCalculator', label: 'Allow On-screen Calculator', desc: 'Provide built-in scientific calculator widget' },
                    { key: 'allowReviewBeforeSubmit', label: 'Allow Review Before Submission', desc: 'Show question status grid before final submit' },
                  ].map((ctrl) => {
                    const isEnabled = controls[ctrl.key as keyof ExamControlsConfig];
                    return (
                      <div
                        key={ctrl.key}
                        onClick={() => handleToggle(ctrl.key as keyof ExamControlsConfig)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-start justify-between gap-3 transition-all ${
                          isEnabled
                            ? 'bg-blue-50/80 border-blue-200 text-blue-950 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{ctrl.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{ctrl.desc}</p>
                        </div>

                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 ${
                            isEnabled ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                              isEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowScheduleModal(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Previous Step
              </button>
            )}

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition-all"
              >
                Next Step
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleScheduleSubmit(true)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleScheduleSubmit(false)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Schedule Exam Now</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
