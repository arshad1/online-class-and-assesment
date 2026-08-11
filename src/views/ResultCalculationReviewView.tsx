import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Percent,
  Sliders,
  Eye,
  Send,
  BookOpen,
  Building2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Paperclip,
  CheckSquare,
  FileText,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const ResultCalculationReviewView: React.FC = () => {
  const {
    candidateResultSummary,
    updatePassMarkThresholdPct,
    publishCandidateResultSummary,
    resultSettings,
    setActiveTab,
  } = useExam();

  const {
    studentName,
    rollNo,
    avatar,
    classDivisionLabel,
    examName,
    examCode,
    submissionDate,
    totalMaxMarks,
    obtainedObjectiveMarks,
    obtainedSubjectiveMarks,
    obtainedAttachmentMarks,
    totalObtainedMarks,
    percentage,
    passMarkPercentage,
    isPassed,
    grade,
    gradeLabel,
    evaluatedQuestions,
  } = candidateResultSummary;

  // Accordion Expand/Collapse state for question inspection
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    evaluatedQuestions[0]?.id || null
  );

  const toggleQuestionExpand = (id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header & Publication Action Banner */}
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
                  Result Calculation & Review
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  PRD Sec 29 & 30
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatic Score Aggregation, Pass/Fail Threshold Calculation & Individual Answer Inspector
              </p>
            </div>
          </div>

          {/* Primary Result Publication Action */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={publishCandidateResultSummary}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Candidate Result</span>
            </button>
          </div>
        </div>

        {/* Candidate Student & Examination Profile Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt={studentName}
              className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover"
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
            <p className="text-[11px] text-emerald-700 font-mono font-semibold">{examCode}</p>
          </div>
        </div>
      </div>

      {/* 5 Core Summary Metric Cards (PRD Section 29 Requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Marks */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Max Marks
            </span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalMaxMarks}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
            100% Exam Weightage
          </span>
        </div>

        {/* 2. Total Obtained Marks (With Component Breakdown) */}
        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              Obtained Marks
            </span>
            <CheckSquare className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-950 mt-2">{totalObtainedMarks}</p>
          <span className="text-[11px] text-blue-700 font-medium mt-1.5 block">
            Obj: {obtainedObjectiveMarks} | Subj: {obtainedSubjectiveMarks} | Att: {obtainedAttachmentMarks}
          </span>
        </div>

        {/* 3. Percentage */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Calculated Percentage
            </span>
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{percentage}%</p>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        {/* 4. Pass / Fail Status (PRD Sec 29) */}
        <div
          className={`p-4 rounded-2xl border shadow-xs transition-all ${
            isPassed
              ? 'bg-emerald-50/40 border-emerald-300'
              : 'bg-red-50/40 border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Pass / Fail Status
            </span>
            {isPassed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
          <p
            className={`text-2xl font-black mt-2 ${
              isPassed ? 'text-emerald-950' : 'text-red-950'
            }`}
          >
            {isPassed ? 'PASSED' : 'FAILED'}
          </p>
          <span
            className={`text-[11px] font-semibold mt-1.5 block ${
              isPassed ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            Cutoff Threshold: {passMarkPercentage}% ({Math.round((passMarkPercentage / 100) * totalMaxMarks)} Marks)
          </span>
        </div>

        {/* 5. Assigned Grade (PRD Sec 29) */}
        <div className="p-4 bg-white rounded-2xl border border-purple-200 bg-purple-50/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider">
              Assigned Grade
            </span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-black text-purple-950">{grade}</p>
            <span className="text-xs font-bold text-purple-700">({gradeLabel})</span>
          </div>
          <span className="text-[11px] text-purple-700 font-medium mt-1.5 block">
            Grading Scale Match
          </span>
        </div>
      </div>

      {/* Minimum Pass Mark Threshold Configuration Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Configured Pass Mark Threshold Policy
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-600">
            Cutoff Mark: <strong className="text-slate-900">{Math.round((passMarkPercentage / 100) * totalMaxMarks)} / {totalMaxMarks} Marks</strong>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-xs font-bold text-slate-700 shrink-0">
            Minimum Pass Mark Percentage:
          </span>
          <input
            type="range"
            min={20}
            max={80}
            step={5}
            value={passMarkPercentage}
            onChange={(e) => updatePassMarkThresholdPct(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-lg shrink-0">
            {passMarkPercentage}%
          </span>
        </div>
      </div>

      {/* Inspect Individual Evaluated Answers Console (User Prompt Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Inspect Individual Candidate Evaluated Answers ({evaluatedQuestions.length} Items)
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Click any question row to inspect student response, score breakdown & teacher remarks
          </span>
        </div>

        {/* Evaluated Questions Accordion List */}
        <div className="divide-y divide-slate-100">
          {evaluatedQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div key={q.id} className="transition-colors">
                {/* Accordion Item Header */}
                <button
                  onClick={() => toggleQuestionExpand(q.id)}
                  className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
                    isExpanded ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                      Q{q.questionNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {q.sectionName}
                        </span>
                        {q.isAutoEvaluated ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded border border-emerald-200">
                            Auto-Scored MCQ
                          </span>
                        ) : q.evaluationType === 'attachment' ? (
                          <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.2 rounded border border-purple-200">
                            Attachment Sheet
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.2 rounded">
                            Manual Subjective
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">{q.questionText}</p>
                    </div>
                  </div>

                  {/* Awarded Score & Expand Toggle Icon */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      {q.awardedMarks} / {q.maxMarks} Marks
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body Details */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4 animate-in fade-in duration-100">
                    {/* Question Prompt */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Full Question Text:
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-1 whitespace-pre-line">
                        {q.questionText}
                      </p>
                    </div>

                    {/* Candidate Response */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Candidate Submitted Response:
                      </span>

                      {q.evaluationType === 'auto_mcq' && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs font-medium">
                          <p>
                            Candidate Selected Option:{' '}
                            <strong className="text-slate-900">
                              Option {String.fromCharCode(65 + (q.selectedOptionIndex || 0))} (
                              {q.mcqOptions?.[q.selectedOptionIndex || 0]})
                            </strong>
                          </p>
                          <p>
                            Correct Option Key:{' '}
                            <strong className="text-emerald-700">
                              Option {String.fromCharCode(65 + (q.correctOptionIndex || 0))} (
                              {q.mcqOptions?.[q.correctOptionIndex || 0]})
                            </strong>
                          </p>
                        </div>
                      )}

                      {(q.evaluationType === 'manual_text' || q.evaluationType === 'manual_essay') && (
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono whitespace-pre-line text-slate-800">
                          {q.studentTextAnswer}
                        </div>
                      )}

                      {q.evaluationType === 'attachment' && q.attachedFile && (
                        <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-purple-600" />
                            <span className="font-bold text-slate-900">
                              {q.attachedFile.fileName} ({q.attachedFile.fileSize})
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveTab('attachment-evaluation')}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Inspect Attachment
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Model Solution & Teacher Remarks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {q.modelAnswer && (
                        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                            Model Solution Reference:
                          </span>
                          <p className="font-medium text-amber-950 mt-1 whitespace-pre-line">
                            {q.modelAnswer}
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Teacher Feedback / Remarks:
                        </span>
                        <p className="font-semibold text-slate-800 mt-1">
                          {q.teacherRemarks || 'No remarks entered.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Configured Grading Scale Reference Table */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Active Institution Grading Scale Reference
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
          {resultSettings.gradeRules.map((r) => (
            <div
              key={r.grade}
              className={`p-2.5 rounded-xl border text-center ${
                grade === r.grade
                  ? 'bg-purple-600 text-white border-purple-600 font-extrabold shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span className="font-black text-sm block">{r.grade}</span>
              <span className="text-[10px] block opacity-80">{r.minPct}% - {r.maxPct}%</span>
              <span className="text-[10px] block font-semibold truncate mt-0.5">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('evaluation-dashboard')}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Evaluation Dashboard</span>
        </button>

        <button
          onClick={publishCandidateResultSummary}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Publish Candidate Result</span>
        </button>
      </div>
    </div>
  );
};

export default ResultCalculationReviewView;
