import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { ScheduledExam } from '../types';
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  Eye,
  Copy,
  Trash2,
  Play,
  RotateCcw,
  BookOpen,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const ExamSchedulingView: React.FC = () => {
  const {
    scheduledExams,
    setShowScheduleModal,
    duplicateExam,
    deleteExam,
    updateExamStatus,
    setActiveTab,
    setSelectedExamId,
    setPreviewQuestionPaper,
    questionPapers,
  } = useExam();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const scheduledCount = scheduledExams.filter((e) => e.status === 'scheduled').length;
  const examsTodayCount = scheduledExams.filter((e) => e.examDate === '2026-08-10' || e.status === 'live').length;
  const upcomingCount = scheduledExams.filter((e) => e.status === 'scheduled' || e.status === 'draft').length;
  const completedCount = scheduledExams.filter((e) => e.status === 'completed').length;

  const filteredExams = scheduledExams.filter((ex) => {
    const matchesStatus = statusFilter === 'all' || ex.status === statusFilter;
    const matchesSearch =
      ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.questionPaperCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Schedule Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            1. Exam Scheduling Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Create, schedule, and assign pre-generated question papers to classes or student groups
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-exam-basic')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Online Exam</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Scheduled Exams
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">{scheduledCount}</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Active timetable</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Exams Today
          </span>
          <p className="text-2xl font-black text-blue-600 mt-2">{examsTodayCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Including live exams</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Upcoming Exams
          </span>
          <p className="text-2xl font-black text-indigo-600 mt-2">{upcomingCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Drafts & Scheduled</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Completed Exams
          </span>
          <p className="text-2xl font-black text-slate-700 mt-2">{completedCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Ready for assessment</span>
        </div>
      </div>

      {/* Scheduled Exam List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters & Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Scheduled Exams Table</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
              {filteredExams.length} Total
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter exam..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Scheduled Exam Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Exam Name & Code</th>
                <th className="p-3.5">Subject & Class</th>
                <th className="p-3.5">Exam Date & Time</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Students</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.map((ex) => {
                const qp = questionPapers.find((p) => p.id === ex.questionPaperId);

                return (
                  <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{ex.title}</p>
                      <button
                        onClick={() => qp && setPreviewQuestionPaper(qp)}
                        className="text-[10px] text-blue-600 hover:underline font-mono font-semibold flex items-center gap-1 mt-0.5"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{ex.questionPaperCode} (Preview Paper)</span>
                      </button>
                    </td>

                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800">{ex.subject}</p>
                      <span className="text-[11px] text-slate-500">
                        {ex.class} ({ex.section})
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="font-medium text-slate-900">{ex.examDate}</p>
                      <span className="text-[11px] text-slate-500">
                        {ex.startTime} - {ex.endTime}
                      </span>
                    </td>

                    <td className="p-3.5 font-medium text-slate-800">
                      {ex.durationMinutes} Mins
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-bold text-xs">
                        {ex.studentCount} Students
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase inline-block ${
                          ex.status === 'live'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                            : ex.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : ex.status === 'draft'
                            ? 'bg-slate-200 text-slate-800'
                            : ex.status === 'completed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ex.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      {ex.status === 'live' || ex.status === 'scheduled' ? (
                        <button
                          onClick={() => {
                            setSelectedExamId(ex.id);
                            setActiveTab('exam-monitoring');
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Start Monitoring Live Session"
                        >
                          <Play className="w-3 h-3" />
                          <span>Monitor</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => duplicateExam(ex.id)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Duplicate Exam Setup"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteExam(ex.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Cancel Exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
