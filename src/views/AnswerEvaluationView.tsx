import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import {
  CheckSquare,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileText,
  Paperclip,
  Download,
  Eye,
  Award,
  BookOpen,
  Save,
  Send,
  HelpCircle,
  Layers,
  X,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const AnswerEvaluationView: React.FC = () => {
  const {
    activeEvaluationAttempt,
    updateQuestionAwardedMarks,
    navigateAttemptQuestion,
    completeAttemptEvaluation,
    setActiveTab,
  } = useExam();

  const {
    questions,
    currentQuestionIndex,
    studentName,
    rollNo,
    avatar,
    classDivisionLabel,
    examName,
    examCode,
    submissionDate,
    maxMarks: examMaxMarks,
  } = activeEvaluationAttempt;

  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  // Local state for interactive editing of current question
  const [localMarks, setLocalMarks] = useState<number>(currentQuestion.awardedMarks);
  const [localRemarks, setLocalRemarks] = useState<string>(currentQuestion.teacherRemarks);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(true);
  const [previewAttachmentModal, setPreviewAttachmentModal] = useState<boolean>(false);

  // Sync local input state when currentQuestionIndex changes
  React.useEffect(() => {
    if (currentQuestion) {
      setLocalMarks(currentQuestion.awardedMarks);
      setLocalRemarks(currentQuestion.teacherRemarks);
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Handle Marks Change with Validation
  const handleMarksChange = (val: number) => {
    const valid = Math.min(Math.max(0, val), currentQuestion.maxMarks);
    setLocalMarks(valid);
    updateQuestionAwardedMarks(currentQuestion.id, valid, localRemarks);
  };

  const handleRemarksChange = (text: string) => {
    setLocalRemarks(text);
    updateQuestionAwardedMarks(currentQuestion.id, localMarks, text);
  };

  // Calculate current attempt total awarded marks
  const currentTotalMarks = questions.reduce((acc, q) => acc + q.awardedMarks, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header & Navigation Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('evaluation-dashboard')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Return to Evaluation Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Prototype 23 — Answer Evaluation
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-blue-100 text-blue-800 border border-blue-200">
                  PRD Sec 27 & 28
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Single Candidate Attempt Evaluation Console & Attachment Verification
              </p>
            </div>
          </div>

          {/* Action & Total Score Banner */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {/* Running Total Score Badge */}
            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl flex items-center gap-3 shadow-md shadow-slate-900/10">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                  Total Awarded Score
                </span>
                <span className="text-base font-black tracking-wide">
                  {currentTotalMarks} / {examMaxMarks} Marks
                </span>
              </div>
            </div>

            {/* Complete Evaluation Button */}
            <button
              onClick={completeAttemptEvaluation}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete & Lock Evaluation</span>
            </button>
          </div>
        </div>

        {/* Candidate & Exam Metadata Row */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={studentName}
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">{studentName}</h3>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Roll: {rollNo}
                </span>
                <span className="text-xs text-slate-600 font-semibold">{classDivisionLabel}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted on: <strong className="text-slate-800">{submissionDate}</strong>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-bold text-slate-900">{examName}</p>
            <p className="text-[11px] text-blue-600 font-mono font-semibold">{examCode}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Question Navigator + Right Question Evaluation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Navigator Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Questions Navigator ({questions.length})
            </h3>
          </div>

          {/* Question Navigator Grid */}
          <div className="grid grid-cols-1 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isAuto = q.isAutoEvaluated;

              return (
                <button
                  key={q.id}
                  onClick={() => navigateAttemptQuestion(idx)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 font-bold text-blue-900'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Q{q.questionNumber}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{q.sectionName}</p>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {q.evaluationType === 'auto_mcq'
                          ? 'Auto-Evaluated MCQ'
                          : q.evaluationType === 'attachment'
                          ? 'Attachment Sheet'
                          : 'Manual Subjective'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge per Question */}
                  <div className="shrink-0 text-right">
                    <span className="text-xs font-black text-slate-900 block">
                      {q.awardedMarks}/{q.maxMarks}
                    </span>
                    {isAuto ? (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                        Auto
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                        Graded
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Main Question Evaluation Workspace (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Question & Answer Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Question Card Header */}
            <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 font-extrabold text-xs">
                  Question {currentQuestion.questionNumber} of {questions.length}
                </span>
                <span className="text-xs font-medium text-slate-300">
                  {currentQuestion.sectionName}
                </span>
              </div>

              {/* Evaluation Mode Indicator Badge */}
              <div>
                {currentQuestion.isAutoEvaluated ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Auto-Evaluated MCQ (System Scored)
                  </span>
                ) : currentQuestion.evaluationType === 'attachment' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Paperclip className="w-3.5 h-3.5 text-purple-400" />
                    Attachment Evaluation (PRD Sec 28)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                    Requires Manual Evaluation
                  </span>
                )}
              </div>
            </div>

            {/* Question Prompt Text */}
            <div className="p-5 bg-slate-50/70 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Question Prompt:
              </span>
              <h2 className="text-base font-bold text-slate-900 whitespace-pre-line leading-relaxed">
                {currentQuestion.questionText}
              </h2>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 text-xs font-extrabold">
                  Maximum Marks: {currentQuestion.maxMarks}
                </span>
              </div>
            </div>

            {/* Candidate Answer Display Workspace */}
            <div className="p-5 space-y-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Candidate Submitted Answer:
              </span>

              {/* BRANCH 1: AUTO-EVALUATED MCQ */}
              {currentQuestion.evaluationType === 'auto_mcq' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>System Auto-Graded Result</span>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-emerald-600 text-white">
                      Auto-Score: {currentQuestion.awardedMarks} / {currentQuestion.maxMarks} Marks
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    {currentQuestion.mcqOptions?.map((opt, idx) => {
                      const isSelected = idx === currentQuestion.selectedOptionIndex;
                      const isCorrect = idx === currentQuestion.correctOptionIndex;

                      let cardStyle = 'bg-slate-50 border-slate-200 text-slate-800';
                      if (isSelected && isCorrect) {
                        cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400/30';
                      } else if (isSelected && !isCorrect) {
                        cardStyle = 'bg-red-50 border-red-400 text-red-950 font-bold';
                      } else if (isCorrect) {
                        cardStyle = 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-semibold';
                      }

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${cardStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center text-xs">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-xs font-medium">{opt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected && isCorrect && (
                              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Candidate Selected (Correct)
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Candidate Selected (Incorrect)
                              </span>
                            )}
                            {!isSelected && isCorrect && (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Correct Answer Key
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BRANCH 2: MANUAL TEXT & ESSAY ANSWERS */}
              {(currentQuestion.evaluationType === 'manual_text' ||
                currentQuestion.evaluationType === 'manual_essay') && (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 pb-2 border-b border-slate-800">
                    <span>Submitted Text Answer</span>
                    <span>{currentQuestion.wordCount || 75} Words</span>
                  </div>
                  <p className="whitespace-pre-line text-slate-100 leading-relaxed font-sans">
                    {currentQuestion.studentTextAnswer}
                  </p>
                </div>
              )}

              {/* BRANCH 3: ATTACHMENT-BASED ANSWERS (PRD Section 28) */}
              {currentQuestion.evaluationType === 'attachment' && currentQuestion.attachedFile && (
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-500/20">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {currentQuestion.attachedFile.fileName}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          File Size: {currentQuestion.attachedFile.fileSize} • Uploaded at{' '}
                          {currentQuestion.attachedFile.uploadedAt}
                        </p>
                      </div>
                    </div>

                    {/* Attachment Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewAttachmentModal(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Attachment</span>
                      </button>

                      <a
                        href={currentQuestion.attachedFile.fileUrl}
                        download
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Model Answer & Rubric Reference Panel */}
              <div className="pt-2">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {showModelAnswer ? 'Hide Reference Answer & Rubrics' : 'Show Reference Model Answer & Rubrics'}
                  </span>
                </button>

                {showModelAnswer && (
                  <div className="mt-3 p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                    {currentQuestion.modelAnswer && (
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                          Ideal Model Solution Key:
                        </span>
                        <p className="text-xs font-medium text-amber-950 mt-1 whitespace-pre-line">
                          {currentQuestion.modelAnswer}
                        </p>
                      </div>
                    )}

                    {/* Rubrics Checklist */}
                    {currentQuestion.rubrics && currentQuestion.rubrics.length > 0 && (
                      <div className="pt-2 border-t border-amber-200/80">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1.5">
                          Grading Rubric Criteria Breakdown:
                        </span>
                        <div className="space-y-1.5">
                          {currentQuestion.rubrics.map((r) => (
                            <div
                              key={r.id}
                              className="p-2 bg-white/80 rounded-lg border border-amber-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-slate-900">{r.criterion}</span>
                                {r.description && (
                                  <p className="text-[11px] text-slate-500">{r.description}</p>
                                )}
                              </div>
                              <span className="font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                                Max {r.maxScore} Marks
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Evaluation Input Console (PRD Section 27 Requirements) */}
            <div className="p-5 bg-slate-100 border-t border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Teacher Evaluation Entry Console
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Marks Awarded Input (4 cols) */}
                <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-300 shadow-xs space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Marks Awarded:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={currentQuestion.maxMarks}
                      value={localMarks}
                      onChange={(e) => handleMarksChange(Number(e.target.value))}
                      className="w-24 px-3 py-2 bg-slate-50 border-2 border-blue-600 rounded-xl text-lg font-black text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-slate-500">
                      / {currentQuestion.maxMarks} Maximum Marks
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Enter awarded marks between 0 and {currentQuestion.maxMarks}
                  </p>
                </div>

                {/* Teacher Remarks Textarea (8 cols) */}
                <div className="md:col-span-8 bg-white p-4 rounded-xl border border-slate-300 shadow-xs space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Teacher Remarks & Feedback:
                  </label>
                  <textarea
                    rows={3}
                    value={localRemarks}
                    onChange={(e) => handleRemarksChange(e.target.value)}
                    placeholder="Enter teacher feedback or notes for candidate..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <button
              onClick={() => navigateAttemptQuestion('prev')}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                currentQuestionIndex === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            <button
              onClick={() => navigateAttemptQuestion('next')}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                currentQuestionIndex === questions.length - 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 cursor-pointer'
              }`}
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Attachment Preview Modal (PRD Section 28) */}
      {previewAttachmentModal && currentQuestion.attachedFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold truncate">
                  {currentQuestion.attachedFile.fileName}
                </h3>
              </div>
              <button
                onClick={() => setPreviewAttachmentModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mock PDF Document Preview Canvas */}
            <div className="p-6 overflow-y-auto bg-slate-100 flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-300 max-w-xl w-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Candidate Uploaded Answer Sheet
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentQuestion.attachedFile.fileName} ({currentQuestion.attachedFile.fileSize})
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs font-mono space-y-1 text-slate-700">
                  <p>• Geometrical Proof: Thales Theorem (Basic Proportionality Theorem)</p>
                  <p>• Diagram: Triangle ABC with DE parallel to BC</p>
                  <p>• Ratio Equation: Area(ΔADE)/Area(ΔBDE) = AD/DB = AE/EC</p>
                  <p>• Status: Handwritten document verified clean & legible</p>
                </div>
                <a
                  href={currentQuestion.attachedFile.fileUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  <Download className="w-4 h-4" /> Download Original PDF File
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right shrink-0">
              <button
                onClick={() => setPreviewAttachmentModal(false)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
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

export default AnswerEvaluationView;
