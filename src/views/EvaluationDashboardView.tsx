import React, { useState, useMemo } from 'react';
import { useExam } from '../context/ExamContext';
import { EvaluationDashboardItem, PRDEvaluationStatus } from '../types';
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  FileSpreadsheet,
  Layers,
  Sparkles,
  UserCheck,
  Award,
  AlertCircle,
  Play,
  ArrowRight,
  BookOpen,
  Building2,
  CheckSquare,
  X,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export const EvaluationDashboardView: React.FC = () => {
  const {
    evaluationDashboardItems,
    updateEvaluationDashboardItemStatus,
    bulkPublishEvaluationDashboardItems,
    setActiveTab,
  } = useExam();

  // Filter States (Required by Prototype Specifications)
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>('');

  // Row Selection State for Bulk Actions
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Drawer / Detail Modal State
  const [detailModalItem, setDetailModalItem] = useState<EvaluationDashboardItem | null>(null);

  // Extract Unique Exams for Filter Dropdown
  const uniqueExams = useMemo(() => {
    const map = new Map<string, string>();
    evaluationDashboardItems.forEach((item) => {
      map.set(item.examId, item.examName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [evaluationDashboardItems]);

  // Extract Unique Classes / Divisions for Filter Dropdown
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    evaluationDashboardItems.forEach((item) => set.add(item.classDivisionLabel));
    return Array.from(set).sort();
  }, [evaluationDashboardItems]);

  // Calculate Metrics
  const totalCount = evaluationDashboardItems.length;
  const notStartedCount = evaluationDashboardItems.filter((i) => i.evaluationStatus === 'Not Started').length;
  const inProgressCount = evaluationDashboardItems.filter((i) => i.evaluationStatus === 'In Progress').length;
  const completedCount = evaluationDashboardItems.filter((i) => i.evaluationStatus === 'Completed').length;
  const publishedCount = evaluationDashboardItems.filter((i) => i.evaluationStatus === 'Published').length;

  const progressPercentage = totalCount > 0 ? Math.round(((completedCount + publishedCount) / totalCount) * 100) : 0;

  // Filter Logic
  const filteredItems = useMemo(() => {
    return evaluationDashboardItems.filter((item) => {
      // 1. Exam Filter
      if (selectedExamFilter !== 'all' && item.examId !== selectedExamFilter) {
        return false;
      }
      // 2. Class/Division Filter
      if (selectedClassFilter !== 'all' && item.classDivisionLabel !== selectedClassFilter) {
        return false;
      }
      // 3. Status Filter
      if (selectedStatusFilter !== 'all' && item.evaluationStatus !== selectedStatusFilter) {
        return false;
      }
      // 4. Student Search
      if (searchStudentQuery.trim() !== '') {
        const query = searchStudentQuery.toLowerCase();
        const matchesName = item.studentName.toLowerCase().includes(query);
        const matchesRoll = item.rollNo.toLowerCase().includes(query);
        const matchesCode = item.examCode.toLowerCase().includes(query);
        if (!matchesName && !matchesRoll && !matchesCode) {
          return false;
        }
      }
      return true;
    });
  }, [evaluationDashboardItems, selectedExamFilter, selectedClassFilter, selectedStatusFilter, searchStudentQuery]);

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItemIds(filteredItems.map((item) => item.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkPublish = () => {
    bulkPublishEvaluationDashboardItems(selectedItemIds.length > 0 ? selectedItemIds : undefined);
    setSelectedItemIds([]);
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: PRDEvaluationStatus) => {
    switch (status) {
      case 'Not Started':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Not Started
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300">
            <Send className="w-3.5 h-3.5 text-purple-600" />
            Published
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header & Core Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Teacher Evaluation Dashboard
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-blue-100 text-blue-800 border border-blue-200">
                  PRD Sec 26
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized evaluation status tracker, candidate marks repository & result publishing console
              </p>
            </div>
          </div>
        </div>

        {/* Global Header Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleBulkPublish}
            disabled={completedCount === 0 && selectedItemIds.length === 0}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all ${
              completedCount > 0 || selectedItemIds.length > 0
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {selectedItemIds.length > 0
                ? `Publish Selected (${selectedItemIds.length})`
                : `Publish Completed (${completedCount})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assessment')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4 text-slate-600" />
            <span>Manual Assessment View</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Metric Cards (5 Overview Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Submissions */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Submissions
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-slate-700 h-full w-full"></div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
            Across all active exams
          </span>
        </div>

        {/* Not Started */}
        <div
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Not Started' ? 'all' : 'Not Started')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            selectedStatusFilter === 'Not Started'
              ? 'border-slate-800 ring-2 ring-slate-400 bg-slate-50/50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Not Started
            </span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{notStartedCount}</p>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-400 h-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (notStartedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
            Awaiting initial evaluation
          </span>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'In Progress' ? 'all' : 'In Progress')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            selectedStatusFilter === 'In Progress'
              ? 'border-blue-600 ring-2 ring-blue-400 bg-blue-50/30'
              : 'border-blue-200 bg-blue-50/10 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              In Progress
            </span>
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-900 mt-2">{inProgressCount}</p>
          <div className="mt-2 w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-blue-700 font-medium mt-1.5 block">
            Draft evaluation saved
          </span>
        </div>

        {/* Completed */}
        <div
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Completed' ? 'all' : 'Completed')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            selectedStatusFilter === 'Completed'
              ? 'border-emerald-600 ring-2 ring-emerald-400 bg-emerald-50/30'
              : 'border-emerald-200 bg-emerald-50/10 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900 mt-2">{completedCount}</p>
          <div className="mt-2 w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1.5 block">
            Graded, ready to publish
          </span>
        </div>

        {/* Published */}
        <div
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Published' ? 'all' : 'Published')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            selectedStatusFilter === 'Published'
              ? 'border-purple-600 ring-2 ring-purple-400 bg-purple-50/30'
              : 'border-purple-200 bg-purple-50/10 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
              Published
            </span>
            <Send className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 mt-2">{publishedCount}</p>
          <div className="mt-2 w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (publishedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-purple-700 font-medium mt-1.5 block">
            Visible in student portal ({progressPercentage}% overall)
          </span>
        </div>
      </div>

      {/* Prototype Filters Console (Mandatory Section) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Prototype Evaluation Filters</span>
          </div>
          {(selectedExamFilter !== 'all' ||
            selectedClassFilter !== 'all' ||
            selectedStatusFilter !== 'all' ||
            searchStudentQuery !== '') && (
            <button
              onClick={() => {
                setSelectedExamFilter('all');
                setSelectedClassFilter('all');
                setSelectedStatusFilter('all');
                setSearchStudentQuery('');
              }}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold normal-case flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* 1. Exam Filter Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Filter by Exam
            </label>
            <select
              value={selectedExamFilter}
              onChange={(e) => setSelectedExamFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Examinations ({uniqueExams.length})</option>
              {uniqueExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Class/Division Filter Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Filter by Class / Division
            </label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes / Divisions ({uniqueClasses.length})</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Status Filter Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Filter by Evaluation Status
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="Not Started">Not Started ({notStartedCount})</option>
              <option value="In Progress">In Progress ({inProgressCount})</option>
              <option value="Completed">Completed ({completedCount})</option>
              <option value="Published">Published ({publishedCount})</option>
            </select>
          </div>

          {/* 4. Student Search Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Filter by Student
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                placeholder="Search candidate name or roll no..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              />
              {searchStudentQuery && (
                <button
                  onClick={() => setSearchStudentQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Pill Selection Tabs for Quick Access */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Status Pills:
          </span>
          {[
            { id: 'all', label: 'All', count: totalCount, color: 'bg-slate-200 text-slate-800' },
            { id: 'Not Started', label: 'Not Started', count: notStartedCount, color: 'bg-slate-100 text-slate-700 border border-slate-300' },
            { id: 'In Progress', label: 'In Progress', count: inProgressCount, color: 'bg-blue-100 text-blue-800 border border-blue-200' },
            { id: 'Completed', label: 'Completed', count: completedCount, color: 'bg-emerald-100 text-emerald-800 border border-emerald-300' },
            { id: 'Published', label: 'Published', count: publishedCount, color: 'bg-purple-100 text-purple-800 border border-purple-300' },
          ].map((pill) => {
            const isActive = selectedStatusFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedStatusFilter(pill.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'ring-2 ring-blue-600 ring-offset-1 shadow-xs font-black'
                    : 'opacity-70 hover:opacity-100'
                } ${pill.color}`}
              >
                <span>{pill.label}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/70 font-extrabold">
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evaluation Data Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Evaluation Submissions Roster
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-200 text-slate-700">
              Showing {filteredItems.length} of {totalCount} Records
            </span>
          </div>

          {/* Table Actions */}
          {selectedItemIds.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              <span className="text-xs font-bold text-blue-900">
                {selectedItemIds.length} Selected
              </span>
              <button
                onClick={handleBulkPublish}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-md transition-colors"
              >
                Publish Selected
              </button>
            </div>
          )}
        </div>

        {/* Evaluation Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/90 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredItems.length > 0 &&
                      selectedItemIds.length === filteredItems.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-3.5">Exam Name & Code</th>
                <th className="p-3.5">Candidate Student</th>
                <th className="p-3.5">Class / Division</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5">Evaluation Status</th>
                <th className="p-3.5 text-center">Obtained Marks</th>
                <th className="p-3.5 text-center">Max Marks</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">
                      No evaluation records match your filter criteria.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try resetting your exam, class, status, or search query filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(item.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* 1. Exam Name & Code */}
                      <td className="p-3.5">
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{item.examName}</p>
                          <span className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 inline-block mt-0.5">
                            {item.examCode}
                          </span>
                        </div>
                      </td>

                      {/* 2. Candidate Student */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.avatar}
                            alt={item.studentName}
                            className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.studentName}</p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Roll: {item.rollNo}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Class / Division */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.classDivisionLabel}</span>
                        </div>
                      </td>

                      {/* 4. Submission Date */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.submissionDate}</span>
                        </div>
                      </td>

                      {/* 5. Evaluation Status (PRD Badges) */}
                      <td className="p-3.5">{getStatusBadge(item.evaluationStatus)}</td>

                      {/* 6. Obtained Marks */}
                      <td className="p-3.5 text-center">
                        {item.obtainedMarks !== null ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-black text-sm text-slate-900">
                              {item.obtainedMarks}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
                              {item.percentage}%
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            — (Pending)
                          </span>
                        )}
                      </td>

                      {/* 7. Maximum Marks */}
                      <td className="p-3.5 text-center font-bold text-slate-700 text-sm">
                        {item.maxMarks}
                      </td>

                      {/* Actions Column */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Contextual Action Button based on PRD Status */}
                          {item.evaluationStatus === 'Not Started' && (
                            <button
                              onClick={() => {
                                updateEvaluationDashboardItemStatus(
                                  item.id,
                                  'In Progress',
                                  35,
                                  'Started grading attempt'
                                );
                                setActiveTab('answer-evaluation');
                              }}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Start Evaluation</span>
                            </button>
                          )}

                          {item.evaluationStatus === 'In Progress' && (
                            <button
                              onClick={() => setActiveTab('answer-evaluation')}
                              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Continue Evaluation</span>
                            </button>
                          )}

                          {item.evaluationStatus === 'Completed' && (
                            <button
                              onClick={() =>
                                updateEvaluationDashboardItemStatus(item.id, 'Published')
                              }
                              className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Publish Result</span>
                            </button>
                          )}

                          {item.evaluationStatus === 'Published' && (
                            <button
                              onClick={() => setDetailModalItem(item)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3 text-slate-500" />
                              <span>View Published</span>
                            </button>
                          )}

                          {/* Quick Inspect Details Drawer Button */}
                          <button
                            onClick={() => setDetailModalItem(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Inspect evaluation details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Inspection & Status Change Modal */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold">Evaluation Candidate Detail</h3>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Student Header */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={detailModalItem.avatar}
                  alt={detailModalItem.studentName}
                  className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {detailModalItem.studentName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Roll No: {detailModalItem.rollNo} • {detailModalItem.classDivisionLabel}
                  </p>
                </div>
              </div>

              {/* Exam & Marks Card */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Examination
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{detailModalItem.examName}</p>
                  <p className="text-[10px] text-blue-600 font-mono mt-0.5">
                    {detailModalItem.examCode}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Evaluation Status
                  </span>
                  <div className="mt-1">{getStatusBadge(detailModalItem.evaluationStatus)}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Obtained Marks
                  </span>
                  <p className="font-black text-slate-900 text-base mt-0.5">
                    {detailModalItem.obtainedMarks !== null
                      ? `${detailModalItem.obtainedMarks} / ${detailModalItem.maxMarks}`
                      : 'Not Graded Yet'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Submission Time
                  </span>
                  <p className="font-bold text-slate-900 mt-1">
                    {detailModalItem.submissionDate}
                  </p>
                </div>
              </div>

              {/* Status Transition Action Buttons */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Change PRD Evaluation Status:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Not Started', 'In Progress', 'Completed', 'Published'] as PRDEvaluationStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          const marks = st === 'Not Started' ? null : detailModalItem.obtainedMarks || 75;
                          updateEvaluationDashboardItemStatus(detailModalItem.id, st, marks);
                          setDetailModalItem(null);
                        }}
                        className={`p-2 text-xs font-bold rounded-xl border transition-all text-left flex items-center justify-between ${
                          detailModalItem.evaluationStatus === st
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span>{st}</span>
                        {detailModalItem.evaluationStatus === st && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Evaluator: <strong className="text-slate-800">{detailModalItem.evaluator}</strong>
              </span>
              <button
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationDashboardView;
