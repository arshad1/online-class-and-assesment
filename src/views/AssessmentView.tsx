import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { StudentSubmission } from '../types';
import {
  CheckSquare,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  UserX,
  FileCheck,
} from 'lucide-react';

export const AssessmentView: React.FC = () => {
  const {
    studentSubmissions,
    setSelectedSubmissionForEvaluation,
    bulkFinalizeAssessments,
    selectedExamId,
  } = useExam();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'pending' | 'evaluated' | 'absent'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const totalSubmissions = studentSubmissions.length;
  const evaluatedCount = studentSubmissions.filter((s) => s.evaluationStatus === 'evaluated' || s.evaluationStatus === 'finalized').length;
  const pendingCount = studentSubmissions.filter((s) => s.evaluationStatus === 'pending' || s.evaluationStatus === 'in_review').length;
  const absentCount = studentSubmissions.filter((s) => s.isAbsent).length;
  
  const avgScorePct = Math.round(
    studentSubmissions.reduce((acc, curr) => acc + curr.percentage, 0) / (totalSubmissions || 1)
  );

  const filteredSubmissions = studentSubmissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.rollNo.includes(searchTerm);

    if (activeTabFilter === 'pending') {
      return matchesSearch && (sub.evaluationStatus === 'pending' || sub.evaluationStatus === 'in_review');
    }
    if (activeTabFilter === 'evaluated') {
      return matchesSearch && (sub.evaluationStatus === 'evaluated' || sub.evaluationStatus === 'finalized');
    }
    if (activeTabFilter === 'absent') {
      return matchesSearch && sub.isAbsent;
    }

    return matchesSearch;
  });

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full">
      {/* Header & Bulk Finalize Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            3. Evaluation & Assessment Module
          </h2>
          <p className="text-xs text-slate-500">
            Auto-scored objective questions + split-screen manual grading for subjective paper sections
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => bulkFinalizeAssessments(selectedExamId)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Bulk Finalize All Assessments</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Submissions
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalSubmissions}</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Grade 10 Mathematics</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Evaluated
          </span>
          <p className="text-2xl font-black text-emerald-900 mt-2">{evaluatedCount}</p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Marks locked</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs bg-amber-50/30">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
            Pending Evaluation
          </span>
          <p className="text-2xl font-black text-amber-950 mt-2">{pendingCount}</p>
          <span className="text-[11px] text-amber-800 font-semibold mt-1 block">Requires teacher grading</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Absent Students
          </span>
          <p className="text-2xl font-black text-slate-700 mt-2">{absentCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Zero marks recorded</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 shadow-xs bg-blue-50/20">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
            Average Score
          </span>
          <p className="text-2xl font-black text-blue-950 mt-2">{avgScorePct}%</p>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">Class average</span>
        </div>
      </div>

      {/* Main Assessment Table & Tabs Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: 'All Submissions', count: totalSubmissions },
              { id: 'pending', label: 'Pending Grading', count: pendingCount },
              { id: 'evaluated', label: 'Evaluated', count: evaluatedCount },
              { id: 'absent', label: 'Absent', count: absentCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTabFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Assessment Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Candidate</th>
                <th className="p-3.5">Submission Time</th>
                <th className="p-3.5">Objective Marks (Auto)</th>
                <th className="p-3.5">Subjective Marks</th>
                <th className="p-3.5">Total Marks</th>
                <th className="p-3.5">Percentage</th>
                <th className="p-3.5">Evaluation Status</th>
                <th className="p-3.5">Evaluator</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  {/* Candidate */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={sub.avatar}
                        alt={sub.studentName}
                        className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{sub.studentName}</p>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Roll: {sub.rollNo} • {sub.section}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Submission Time */}
                  <td className="p-3.5 font-medium text-slate-700">
                    {sub.isAbsent ? (
                      <span className="text-red-500 font-semibold">N/A (Absent)</span>
                    ) : (
                      sub.submissionTime
                    )}
                  </td>

                  {/* Objective Marks */}
                  <td className="p-3.5 font-bold text-blue-700">
                    {sub.objectiveMarks} / 25
                  </td>

                  {/* Subjective Marks */}
                  <td className="p-3.5 font-bold text-slate-900">
                    {sub.subjectiveMarks} / 75
                  </td>

                  {/* Total Marks */}
                  <td className="p-3.5 font-black text-slate-900">
                    {sub.totalMarks} / {sub.maxMarks}
                  </td>

                  {/* Percentage */}
                  <td className="p-3.5">
                    <span className="font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {sub.percentage}%
                    </span>
                  </td>

                  {/* Evaluation Status Badge */}
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase inline-block ${
                        sub.evaluationStatus === 'finalized'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : sub.evaluationStatus === 'evaluated'
                          ? 'bg-blue-100 text-blue-800'
                          : sub.evaluationStatus === 'in_review'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {sub.evaluationStatus}
                    </span>
                  </td>

                  {/* Evaluator */}
                  <td className="p-3.5 text-slate-700 font-medium">
                    {sub.evaluator}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedSubmissionForEvaluation(sub)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors inline-flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{sub.evaluationStatus === 'pending' ? 'Grade & Review' : 'Re-evaluate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
