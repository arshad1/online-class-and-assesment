import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { QuestionPaperItem, RubricCriterion } from '../../types';
import {
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Award,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Bookmark,
  Plus,
  Minus,
  MessageSquare,
  History,
  FileText,
} from 'lucide-react';

export const ManualAssessmentModal: React.FC = () => {
  const {
    selectedSubmissionForEvaluation,
    setSelectedSubmissionForEvaluation,
    questionPapers,
    saveAnswerGrading,
    reEvaluateSubmission,
    finalizeSubmissionAssessment,
  } = useExam();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(5); // default to Q6 (subjective)
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [reEvalReason, setReEvalReason] = useState<string>('');
  const [showReEvalModal, setShowReEvalModal] = useState<boolean>(false);

  if (!selectedSubmissionForEvaluation) return null;

  const sub = selectedSubmissionForEvaluation;
  const paper = questionPapers.find((qp) => qp.id === 'qp-101') || questionPapers[0];
  const questionsList = paper?.questions || [];
  const currentQ: QuestionPaperItem = questionsList[currentQuestionIndex] || questionsList[0];

  const currentGradeDetail = sub.answers[currentQ?.id] || {
    questionId: currentQ?.id,
    studentAnswerText: 'No answer submitted.',
    isObjective: currentQ?.questionType === 'objective',
    awardedScore: 0,
    maxMarks: currentQ?.maxMarks || 15,
  };

  const handleScoreChange = (score: number) => {
    const validScore = Math.max(0, Math.min(currentQ.maxMarks, score));
    saveAnswerGrading(sub.id, currentQ.id, {
      awardedScore: validScore,
    });
  };

  const handleRubricScoreChange = (rubricId: string, pts: number) => {
    const currentRubrics = currentGradeDetail.rubricScores || {};
    const newRubrics = { ...currentRubrics, [rubricId]: pts };

    // Calculate total score from rubrics
    let sum = 0;
    Object.values(newRubrics).forEach((v) => (sum += v));

    saveAnswerGrading(sub.id, currentQ.id, {
      rubricScores: newRubrics,
      awardedScore: Math.min(currentQ.maxMarks, sum),
    });
  };

  const handleBonusMarks = (bonus: number) => {
    const currentScore = currentGradeDetail.awardedScore;
    const newScore = Math.min(currentQ.maxMarks, currentScore + bonus);
    saveAnswerGrading(sub.id, currentQ.id, {
      awardedScore: newScore,
      bonusMarks: (currentGradeDetail.bonusMarks || 0) + bonus,
    });
  };

  const handleDeductMarks = (deduct: number, reason: string) => {
    const currentScore = currentGradeDetail.awardedScore;
    const newScore = Math.max(0, currentScore - deduct);
    saveAnswerGrading(sub.id, currentQ.id, {
      awardedScore: newScore,
      deductedMarks: (currentGradeDetail.deductedMarks || 0) + deduct,
      deductionReason: reason,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Split Assessment Header */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={sub.avatar}
              alt={sub.studentName}
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{sub.studentName}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-blue-400 border border-slate-700">
                  Roll: {sub.rollNo}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {sub.class} - {sub.section}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evaluating: {sub.examTitle} • Submitted at {sub.submissionTime}
              </p>
            </div>
          </div>

          {/* Running Scorecard Summary */}
          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Total Marks</span>
              <span className="text-sm font-bold text-white">
                {sub.totalMarks} / {sub.maxMarks}
              </span>
            </div>

            <div className="text-right border-l border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase">Percentage</span>
              <span className="text-sm font-bold text-blue-400">{sub.percentage}%</span>
            </div>

            <div className="text-right border-l border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase">Pass / Fail Preview</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  sub.percentage >= 40 ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                }`}
              >
                {sub.grade} ({sub.resultStatus.toUpperCase()})
              </span>
            </div>

            <button
              onClick={() => finalizeSubmissionAssessment(sub.id)}
              className="ml-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Finalize Marks
            </button>
          </div>

          <button
            onClick={() => setSelectedSubmissionForEvaluation(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Selector Pill Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-600 mr-2 shrink-0">Questions Navigator:</span>
          {questionsList.map((q, idx) => {
            const ans = sub.answers[q.id];
            const isCurrent = idx === currentQuestionIndex;
            const isGraded = ans && ans.awardedScore !== undefined;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30'
                    : isGraded
                    ? 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <span>Q{idx + 1}</span>
                <span className="text-[10px] opacity-80">
                  ({q.questionType === 'objective' ? 'MCQ' : 'Subj'})
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-700'
                  }`}
                >
                  {ans ? `${ans.awardedScore}/${q.maxMarks}` : `0/${q.maxMarks}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Split Screen Evaluation Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDE: Student Answer Panel */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-200 bg-slate-50/50 space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-800 text-white">
                Question {currentQuestionIndex + 1} of {questionsList.length} • {currentQ?.sectionName}
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Max Marks: {currentQ?.maxMarks}
              </span>
            </div>

            {/* Question Text */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Question Context</h4>
              <p className="text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                {currentQ?.text}
              </p>
            </div>

            {/* Student's Answer Box */}
            <div className="p-5 bg-white rounded-xl border border-blue-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Candidate Submitted Answer
                </h4>
                {currentQ?.questionType === 'objective' && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Auto-Graded MCQ
                  </span>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs text-slate-900 leading-relaxed whitespace-pre-line">
                {currentGradeDetail.studentAnswerText || 'No text submitted.'}
              </div>

              {/* Student Uploaded Files Display */}
              {sub.uploadedAnswerFiles && sub.uploadedAnswerFiles.length > 0 && (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 text-xs">
                  <span className="font-bold text-blue-900 block flex items-center gap-1 text-[11px] uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Student Uploaded Answer Script Files ({sub.uploadedAnswerFiles.length})
                  </span>
                  <div className="space-y-1.5">
                    {sub.uploadedAnswerFiles.map((file) => (
                      <div key={file.id} className="p-2 bg-white rounded-lg border border-blue-200 flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-[11px]">{file.fileName} ({file.fileSize})</span>
                        <button
                          onClick={() => alert(`Opening ${file.fileName}...`)}
                          className="px-2 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded hover:bg-blue-700"
                        >
                          View File
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Model Answer / Solution Key */}
            {currentQ?.modelAnswer && (
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Official Model Answer & Solution Key
                </span>
                <p className="text-emerald-950 font-mono text-[11px] leading-relaxed pt-1">
                  {currentQ.modelAnswer}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Grading Controls & Rubric Panel */}
          <div className="w-1/2 p-6 overflow-y-auto bg-white space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
              <Award className="w-4 h-4 text-blue-600" />
              Evaluation & Grading Controls
            </h3>

            {/* Direct Score Input */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Marks Awarded (Out of {currentQ?.maxMarks})
                </label>
                <span className="text-xs text-slate-500 font-semibold">
                  Max: {currentQ?.maxMarks} pts
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={currentQ?.maxMarks}
                  value={currentGradeDetail.awardedScore}
                  onChange={(e) => handleScoreChange(Number(e.target.value))}
                  className="w-28 text-center text-lg font-bold py-2 bg-white border-2 border-blue-500 rounded-xl text-blue-900 focus:ring-2 focus:ring-blue-500"
                />

                {/* Quick Score Adjustment Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleScoreChange(currentGradeDetail.awardedScore - 1)}
                    className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScoreChange(currentGradeDetail.awardedScore + 1)}
                    className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScoreChange(currentQ?.maxMarks || 15)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Full Marks
                  </button>
                </div>
              </div>
            </div>

            {/* Rubric Criteria Breakdown Checklist */}
            {currentQ?.rubric && currentQ.rubric.length > 0 && (
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Rubric & Marking Criteria Checklist
                </h4>

                <div className="space-y-2">
                  {currentQ.rubric.map((r: RubricCriterion) => {
                    const currentPts = currentGradeDetail.rubricScores?.[r.id] || 0;

                    return (
                      <div
                        key={r.id}
                        className="p-3 bg-white rounded-lg border border-blue-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{r.criterion}</p>
                          <p className="text-[11px] text-slate-500">{r.description}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <input
                            type="number"
                            min={0}
                            max={r.maxScore}
                            value={currentPts}
                            onChange={(e) => handleRubricScoreChange(r.id, Number(e.target.value))}
                            className="w-14 text-center font-bold py-1 bg-slate-50 border border-slate-300 rounded text-slate-900"
                          />
                          <span className="text-slate-500 font-semibold text-[11px]">/ {r.maxScore}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Teacher Feedback / Comments */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Teacher Comments & Student Feedback
              </label>
              <textarea
                rows={3}
                value={currentGradeDetail.teacherComment || ''}
                onChange={(e) =>
                  saveAnswerGrading(sub.id, currentQ.id, {
                    teacherComment: e.target.value,
                  })
                }
                placeholder="Add specific comments visible to student..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bonus & Deduction Actions */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bonus & Penalty Adjustments
              </h4>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleBonusMarks(1)}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-lg border border-emerald-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 Bonus Mark</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeductMarks(1, 'Minor step mistake')}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs rounded-lg border border-red-300 flex items-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>-1 Penalty Mark</span>
                </button>
              </div>

              {currentGradeDetail.bonusMarks ? (
                <span className="text-xs text-emerald-700 font-bold block">
                  ✓ +{currentGradeDetail.bonusMarks} Bonus marks granted
                </span>
              ) : null}

              {currentGradeDetail.deductedMarks ? (
                <span className="text-xs text-red-600 font-bold block">
                  ⚠ -{currentGradeDetail.deductedMarks} Penalty deducted ({currentGradeDetail.deductionReason})
                </span>
              ) : null}
            </div>

            {/* Re-evaluation & Audit Button */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowReEvalModal(true)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Re-evaluate Submission</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    saveAnswerGrading(sub.id, currentQ.id, {
                      markedForReview: !currentGradeDetail.markedForReview,
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 ${
                    currentGradeDetail.markedForReview
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-600'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{currentGradeDetail.markedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 disabled:opacity-50 text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questionsList.length - 1}
              className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 disabled:opacity-50 text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-slate-100"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSubmissionForEvaluation(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg"
            >
              Save & Close
            </button>

            <button
              onClick={() => {
                if (currentQuestionIndex < questionsList.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                  setSelectedSubmissionForEvaluation(null);
                }
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Next Question</span>
            </button>
          </div>
        </div>
      </div>

      {/* Re-evaluation Modal Prompt */}
      {showReEvalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Re-evaluate Student Marks
            </h3>
            <p className="text-xs text-slate-600">
              Provide a mandatory reason for changing student marks. This will be logged in the audit trail.
            </p>
            <textarea
              rows={3}
              value={reEvalReason}
              onChange={(e) => setReEvalReason(e.target.value)}
              placeholder="e.g. Discrepancy in Q7 proof step recalculation..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReEvalModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (reEvalReason) {
                    reEvaluateSubmission(sub.id, reEvalReason);
                    setShowReEvalModal(false);
                  }
                }}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg"
              >
                Confirm Re-evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
