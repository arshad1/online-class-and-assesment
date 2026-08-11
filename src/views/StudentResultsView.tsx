import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import {
  Award,
  Eye,
  Search,
  Lock,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  Send,
} from 'lucide-react';

export const StudentResultsView: React.FC = () => {
  const {
    selectedChild,
    studentSubmissions,
    evaluationDashboardItems,
    setSelectedStudentResultPreview,
  } = useExam();

  const [searchTerm, setSearchTerm] = useState('');

  // Get submissions for the current child
  const childSubmissions = studentSubmissions.filter(
    (s) => s.studentName === selectedChild.name || s.rollNo === selectedChild.rollNo
  );

  const filteredSubmissions = childSubmissions.filter((sub) =>
    sub.examTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if result is published for a given examId
  // A result is "published" if the evaluation dashboard item for that exam is marked Published
  const isExamPublished = (examId: string): boolean => {
    const evalItems = evaluationDashboardItems.filter((i) => i.examId === examId);
    if (evalItems.length === 0) {
      // Fall back to publishStatus on the submission
      const sub = childSubmissions.find((s) => s.examId === examId);
      return sub?.publishStatus === 'published';
    }
    // Published if ALL items for the exam are Published
    return evalItems.every((i) => i.evaluationStatus === 'Published');
  };

  const publishedSubs = filteredSubmissions.filter((s) => isExamPublished(s.examId));
  const pendingSubs = filteredSubmissions.filter((s) => !isExamPublished(s.examId));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Student Exam Results &amp; Official Report Cards
          </h2>
          <p className="text-xs text-slate-500">
            Published examination scores and academic reports for{' '}
            <strong>{selectedChild.name}</strong> ({selectedChild.class} - {selectedChild.section})
          </p>
        </div>
        {/* Selected Child Pill */}
        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 text-emerald-900 font-bold">
          <img src={selectedChild.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
          <span>{selectedChild.name}</span>
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Exams Attended</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{selectedChild.totalExamsAttended}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Overall Grade</span>
          <p className="text-2xl font-black text-emerald-900 mt-1">{selectedChild.overallGrade}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-blue-200 shadow-xs bg-blue-50/20">
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Class Rank</span>
          <p className="text-2xl font-black text-blue-950 mt-1">#{selectedChild.rankInClass}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Attendance Rate</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{selectedChild.attendancePct}%</p>
        </div>
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">
            {publishedSubs.length} Published · {pendingSubs.length} Awaiting Publication
          </span>
        </div>
        <div className="relative w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exam..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* ── Published Results Table ──────────────────────────────── */}
      {publishedSubs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900">Published Examination Report Cards</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-200 text-emerald-900 rounded-full">
              {publishedSubs.length} Published
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Examination</th>
                  <th className="p-3.5">Submission Time</th>
                  <th className="p-3.5">Marks Obtained</th>
                  <th className="p-3.5">Percentage</th>
                  <th className="p-3.5">Grade</th>
                  <th className="p-3.5">Result</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {publishedSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{sub.examTitle}</p>
                      <span className="text-[10px] text-slate-500 font-mono">Evaluator: {sub.evaluator}</span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{sub.submissionTime}</td>
                    <td className="p-3.5 font-extrabold text-blue-900">
                      {sub.totalMarks} / {sub.maxMarks}
                    </td>
                    <td className="p-3.5 font-black text-slate-900">{sub.percentage}%</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 font-bold rounded bg-slate-100 text-slate-800">{sub.grade}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          sub.resultStatus === 'pass'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sub.resultStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedStudentResultPreview(sub)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Official Report Card</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Awaiting Publication (Masked) ────────────────────────── */}
      {pendingSubs.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-900">Awaiting Teacher Publication</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-full">
              {pendingSubs.length} Pending
            </span>
          </div>

          <div className="divide-y divide-amber-100">
            {pendingSubs.map((sub) => (
              <div key={sub.id} className="p-4 flex items-center gap-4 group hover:bg-amber-50/40 transition-colors">
                {/* Exam info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{sub.examTitle}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Submitted: {sub.submissionTime}</p>
                </div>

                {/* Lock Mask */}
                <div className="flex items-center gap-3">
                  {/* Hidden marks placeholder */}
                  <div className="flex items-center gap-2">
                    {[
                      { label: 'Marks', w: 'w-16' },
                      { label: 'Grade', w: 'w-10' },
                      { label: 'Result', w: 'w-12' },
                    ].map((field) => (
                      <div key={field.label} className="flex flex-col items-center gap-1">
                        <div className={`${field.w} h-6 bg-amber-100 rounded-lg border border-amber-200 flex items-center justify-center`}>
                          <Lock className="w-3 h-3 text-amber-400" />
                        </div>
                        <span className="text-[9px] font-bold text-amber-500 uppercase">{field.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-3 py-1.5 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                      <Lock className="w-2.5 h-2.5" />
                      Evaluation Completed · Results Awaiting Teacher Publication
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Marks will unlock once the teacher officially publishes results.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────────────── */}
      {filteredSubmissions.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No exam results found for this search query.</p>
          <p className="text-xs text-slate-400 mt-1">Try a different exam name or clear the search.</p>
        </div>
      )}
    </div>
  );
};
