import React, { useState } from 'react';
import {
  Video,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  Play,
  Pause,
  StopCircle,
  Eye,
  FileBarChart,
  PlusCircle,
  Building,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { Exam } from '../types';

export const LiveExamsView: React.FC = () => {
  const { exams, setActiveTab, setSelectedExam, addToast } = useExam();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.classDept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesDept = deptFilter === 'all' || exam.classDept.includes(deptFilter);

    return matchesSearch && matchesStatus && matchesDept;
  });

  const handlePauseToggle = (exam: Exam) => {
    addToast(
      exam.status === 'paused' ? 'Exam Resumed' : 'Exam Paused',
      `${exam.title} is now ${exam.status === 'paused' ? 'active' : 'paused'} for candidates`,
      'warning'
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam title, subject, or class..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          <button
            onClick={() => setActiveTab('exam-wizard')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Exam</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Now</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="Science">Science Dept</option>
            <option value="Engineering">Engineering Division</option>
            <option value="High School">High School</option>
            <option value="Humanities">Humanities Dept</option>
          </select>

          {/* Date Picker Mock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today (Aug 4, 2026)</span>
          </div>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Card Header */}
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {exam.classDept}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize flex items-center gap-1 ${
                    exam.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : exam.status === 'completed'
                      ? 'bg-slate-100 text-slate-700'
                      : exam.status === 'paused'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      exam.status === 'active' ? 'bg-emerald-500 animate-ping' : 'bg-current'
                    }`}
                  />
                  {exam.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{exam.subject}</p>
              </div>

              {/* Time Details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.startTime} ({exam.durationMinutes}m)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Exam Progress</span>
                  <span className="font-bold text-slate-900">{exam.progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${exam.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Student Counts */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Registered</p>
                  <p className="text-sm font-bold text-slate-900">{exam.totalRegistered}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Online</p>
                  <p className="text-sm font-bold text-emerald-600">{exam.onlineCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Flagged</p>
                  <p className={`text-sm font-bold ${exam.flaggedCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                    {exam.flaggedCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedExam(exam);
                  setActiveTab('proctoring-monitor');
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Live Monitor</span>
              </button>

              <button
                onClick={() => handlePauseToggle(exam)}
                className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                title={exam.status === 'paused' ? 'Resume Exam' : 'Pause Exam'}
              >
                {exam.status === 'paused' ? (
                  <Play className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Pause className="w-4 h-4 text-amber-600" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                title="View Exam Report"
              >
                <FileBarChart className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
