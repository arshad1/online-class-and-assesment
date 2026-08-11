import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { ScheduledExam, QuestionPaperItem } from '../types';
import { PdfViewer } from '../components/common/PdfViewer';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  AlertCircle,
  X,
  Sparkles,
  ArrowLeft,
  BookOpen,
  LogOut,
  Upload,
  FileUp,
  Paperclip,
  Trash2,
  Eye,
  FileText,
} from 'lucide-react';

export const AttendExamView: React.FC = () => {
  const {
    activeStudentExam,
    questionPapers,
    selectedChild,
    studentAnswers,
    saveStudentAnswer,
    studentUploadedFiles,
    uploadStudentFile,
    removeStudentFile,
    submitStudentExam,
    studentExamSubmitted,
    setStudentExamSubmitted,
    setActiveTab,
    setPortalMode,
  } = useExam();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(7115); // 1 hr 58 min 35 sec
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState<boolean>(false);
  const [previewStudentFileUrl, setPreviewStudentFileUrl] = useState<string | null>(null);

  // Active exam paper details
  const exam = activeStudentExam || {
    id: 'exam-101',
    title: 'Grade 10 Mathematics Midterm 2026',
    subject: 'Mathematics',
    class: 'Class 10',
    durationMinutes: 120,
    questionPaperId: 'qp-101',
    maxMarks: 100,
    totalQuestions: 10,
    instructions: 'Do not switch browser tabs. Read all questions carefully before submitting.',
  };

  const paper = questionPapers.find((qp) => qp.id === exam.questionPaperId) || questionPapers.find((qp) => qp.id === 'qp-101') || questionPapers[0];
  const isUploadedPaperExam = (('paperType' in exam && (exam as any).paperType === 'uploaded') || paper?.paperType === 'uploaded' || ('uploadedFile' in exam && !!(exam as any).uploadedFile) || !!paper?.uploadedFile);
  const questionsList: QuestionPaperItem[] = paper?.questions || [];
  const currentQ = questionsList[currentQuestionIndex] || questionsList[0];
  const currentExamFiles = studentUploadedFiles['current-exam'] || [];

  const handleStudentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadStudentFile('current-exam', {
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        fileUrl: URL.createObjectURL(file),
        fileType: file.type || 'application/pdf',
      });
    }
  };

  // Countdown timer
  useEffect(() => {
    if (studentExamSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [studentExamSubmitted]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentAns = studentAnswers[currentQ?.id] || {};

  // Question Palette Counters
  let answeredCount = 0;
  let markedCount = 0;

  questionsList.forEach((q) => {
    const ans = studentAnswers[q.id];
    if (ans && (ans.selectedOptionIndex !== undefined || (ans.textAnswer && ans.textAnswer.trim().length > 0))) {
      answeredCount++;
    }
    if (ans?.isMarkedForReview) {
      markedCount++;
    }
  });

  const handleOptionSelect = (optionIdx: number) => {
    saveStudentAnswer(currentQ.id, {
      selectedOptionIndex: optionIdx,
    });
  };

  const handleTextAnswerChange = (text: string) => {
    saveStudentAnswer(currentQ.id, {
      textAnswer: text,
    });
  };

  const handleToggleMarkForReview = () => {
    saveStudentAnswer(currentQ.id, {
      isMarkedForReview: !currentAns.isMarkedForReview,
    });
  };

  const handleClearResponse = () => {
    saveStudentAnswer(currentQ.id, {
      selectedOptionIndex: undefined,
      textAnswer: '',
      isMarkedForReview: false,
    });
  };

  const handleConfirmFinalSubmit = () => {
    submitStudentExam(exam.id);
    setShowSubmitConfirmModal(false);
  };

  if (studentExamSubmitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-200 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              CONFIRMED SUBMISSION RECEIPT
            </span>
            <h2 className="text-2xl font-black text-slate-900">Exam Submitted Successfully!</h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Your answer sheet for <strong>{exam.title}</strong> has been uploaded securely to the teacher assessment portal.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Candidate:</span>
              <strong className="text-slate-900">{selectedChild.name} ({selectedChild.class})</strong>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Roll Number:</span>
              <strong className="text-slate-900">{selectedChild.rollNo}</strong>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Questions Answered:</span>
              <strong className="text-emerald-700">{answeredCount} of {questionsList.length} Questions</strong>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Attached Answer Files:</span>
              <strong className="text-blue-700">{currentExamFiles.length} File(s) Uploaded</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Submission Timestamp:</span>
              <strong>{new Date().toLocaleTimeString()}</strong>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setStudentExamSubmitted(false);
                setActiveTab('student-results');
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Go to Results & Report Cards
            </button>
            <button
              onClick={() => {
                setStudentExamSubmitted(false);
                setActiveTab('student-exams-list');
              }}
              className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              Back to Timetable
            </button>
          </div>
        </div>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans select-none">
      {/* Top Proctored Exam Header */}
      <header className="h-16 bg-slate-900 text-white px-6 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('student-exams-list')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
            title="Return to Exam Schedule"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Exam Portal</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">{exam.title}</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {exam.subject}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Candidate: <strong>{selectedChild.name}</strong> • Roll: {selectedChild.rollNo} ({selectedChild.class})
            </p>
          </div>
        </div>

        {/* Live Timer & Security Banner */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-700/60 text-emerald-400 text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold text-[11px]">Anti-Cheat System Active</span>
          </div>

          <div className="px-4 py-1.5 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-sm font-mono font-bold text-amber-400">
              {formatTimer(secondsRemaining)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Examination Layout Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* IF UPLOADED PAPER EXAM: Show Integrated PDF Viewer on Left & Response/Upload Console on Right */}
        {isUploadedPaperExam ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
            {/* Left Pane: Integrated PDF Viewer */}
            <div className="flex-1 p-4 overflow-hidden bg-slate-900">
              <PdfViewer
                title={exam.title}
                subject={exam.subject}
                code={('questionPaperCode' in exam ? (exam as any).questionPaperCode : undefined) || paper?.code}
                uploadedFile={('uploadedFile' in exam ? (exam as any).uploadedFile : undefined) || paper?.uploadedFile}
                className="h-full"
              />
            </div>

            {/* Right Pane: Student Response & File Upload Console */}
            <div className="w-full md:w-[420px] bg-white border-l border-slate-200 p-6 flex flex-col justify-between shrink-0 overflow-y-auto space-y-6">
              <div className="space-y-6">
                <div className="space-y-1 border-b border-slate-200 pb-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded uppercase tracking-wider">
                    UPLOADED QUESTION PAPER MODE
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Student Response & Answer Upload Console</h3>
                  <p className="text-xs text-slate-500">
                    Read the question paper in the integrated PDF viewer on the left. Type your answer notes or attach scanned solution scripts below.
                  </p>
                </div>

                {/* Subjective Text Answer Area */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Written Answer Notes / Summary
                  </label>
                  <textarea
                    rows={6}
                    value={currentAns.textAnswer || ''}
                    onChange={(e) => handleTextAnswerChange(e.target.value)}
                    placeholder="Type step-by-step answers or reference solution page numbers..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-sans leading-relaxed focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Student File Upload Console */}
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      Upload Answer Files
                    </h4>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {currentExamFiles.length} Attached
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 bg-white hover:bg-blue-50/50 transition-all text-center relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                      onChange={handleStudentFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FileUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-900">Upload Handwritten Answer Sheets</p>
                    <p className="text-[10px] text-slate-500">PDF, JPG, PNG scanned files (Max 25MB)</p>
                  </div>

                  {/* Uploaded Files Badge List */}
                  {currentExamFiles.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {currentExamFiles.map((file) => (
                        <div key={file.id} className="p-2.5 bg-white rounded-lg border border-blue-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="p-1.5 bg-blue-600 text-white font-extrabold text-[9px] rounded shrink-0">
                              {file.fileName.endsWith('.pdf') ? 'PDF' : 'IMG'}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate text-[11px]">{file.fileName}</p>
                              <p className="text-[10px] text-slate-500">{file.fileSize} • {file.uploadedAt}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeStudentFile('current-exam', file.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Final Examination ({currentExamFiles.length} Files)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MCQ / STANDARD QUESTION FLOW */
          <>
            {/* LEFT / CENTER: Question & Answer Panel */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-6">
              {/* Question Meta Bar */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-lg">
                    Question {currentQuestionIndex + 1} of {questionsList.length}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {currentQ?.sectionName}
                  </span>
                </div>

                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {currentQ?.maxMarks} Marks
                </span>
              </div>

              {/* Question Statement Box */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Question Statement
                </h3>
                <p className="text-sm md:text-base font-extrabold text-slate-900 leading-relaxed whitespace-pre-line">
                  {currentQ?.text}
                </p>
              </div>

              {/* Answer Input Controls */}
              <div className="p-6 bg-white rounded-2xl border border-blue-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Your Answer Response
                </h3>

                {/* MCQ Options Radio List */}
                {currentQ?.questionType === 'objective' && currentQ.options ? (
                  <div className="space-y-3">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = currentAns.selectedOptionIndex === optIdx;

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleOptionSelect(optIdx)}
                          className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 bg-slate-100 text-slate-600'
                            }`}
                          >
                            {optionLetters[optIdx] || optIdx + 1}
                          </div>
                          <span className="text-xs md:text-sm font-semibold">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Subjective Text Answer Area */
                  <div className="space-y-2">
                    <textarea
                      rows={8}
                      value={currentAns.textAnswer || ''}
                      onChange={(e) => handleTextAnswerChange(e.target.value)}
                      placeholder="Type your detailed step-by-step answer response here..."
                      className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-sans leading-relaxed focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Formatting: Plain Text & Formulae Supported</span>
                      <span>Words: {(currentAns.textAnswer || '').trim().split(/\s+/).filter(Boolean).length}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Answer File Upload Console (Student End) */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    Option to Upload Response Files / Solution Diagrams (Student End)
                  </h3>
                  <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {currentExamFiles.length} File(s) Attached
                  </span>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-slate-50/70 hover:bg-blue-50/40 transition-all text-center relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    onChange={handleStudentFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Upload Handwritten Answer Sheets or Scanned Solution PDFs</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Click to browse or drop PDF, JPG, PNG files (Max 25MB each)</p>
                </div>

                {/* Attached Student Files List */}
                {currentExamFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attached Solution Files:</h4>
                    {currentExamFiles.map((file) => (
                      <div key={file.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 bg-blue-600 text-white rounded-lg font-extrabold text-[10px] uppercase shrink-0">
                            {file.fileName.endsWith('.pdf') ? 'PDF' : 'IMG'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{file.fileName}</p>
                            <p className="text-[11px] text-slate-500">{file.fileSize} • Uploaded at {file.uploadedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => removeStudentFile('current-exam', file.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-200"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: Question Palette & Summary Grid */}
            <div className="w-80 bg-white border-l border-slate-200 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Question Palette
                </h3>

                {/* Questions Grid Matrix */}
                <div className="grid grid-cols-4 gap-2.5">
                  {questionsList.map((q, idx) => {
                    const ans = studentAnswers[q.id];
                    const isCurrent = idx === currentQuestionIndex;
                    const isAnswered =
                      ans && (ans.selectedOptionIndex !== undefined || (ans.textAnswer && ans.textAnswer.trim().length > 0));
                    const isMarked = ans?.isMarkedForReview;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-10 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center relative ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/40'
                            : isMarked
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : isAnswered
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{idx + 1}</span>
                        {isMarked && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 border border-slate-900" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend & Statistics */}
                <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                      Answered
                    </span>
                    <strong className="text-slate-900">{answeredCount}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                      Marked for Review
                    </span>
                    <strong className="text-slate-900">{markedCount}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                      Unanswered
                    </span>
                    <strong className="text-slate-900">{questionsList.length - answeredCount}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 font-semibold text-blue-700">
                      <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                      Attached Files
                    </span>
                    <strong className="text-blue-700 font-bold">{currentExamFiles.length} Files</strong>
                  </div>
                </div>
              </div>

              {/* Finish & Submit Action Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Final Examination</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <footer className="h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleClearResponse()}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Response</span>
          </button>

          <button
            onClick={() => handleToggleMarkForReview()}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1 ${
              currentAns.isMarkedForReview
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{currentAns.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 disabled:opacity-40 text-xs font-semibold rounded-xl hover:bg-slate-100 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentQuestionIndex(Math.min(questionsList.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questionsList.length - 1}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Confirmation Modal Before Final Submit */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              Confirm Final Exam Submission
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to submit your examination paper? You will not be able to modify your answers once submitted.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total Answered Questions:</span>
                <strong className="text-emerald-700">{answeredCount} / {questionsList.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <strong className="text-amber-700">{markedCount} Questions</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Continue Exam
              </button>
              <button
                onClick={handleConfirmFinalSubmit}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Confirm & Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
