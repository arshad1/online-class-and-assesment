import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { ScheduledExam } from '../types';
import {
  CalendarClock,
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Award,
  Search,
  Users,
} from 'lucide-react';

export const StudentExamsListView: React.FC = () => {
  const {
    selectedChild,
    scheduledExams,
    setActiveStudentExam,
    setActiveTab,
  } = useExam();

  const [tabFilter, setTabFilter] = useState<'all' | 'live' | 'scheduled' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const childExams = scheduledExams.filter((ex) => {
    const matchesSearch =
      ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = tabFilter === 'all' || ex.status === tabFilter;
    return matchesSearch && matchesTab;
  });

  const handleStartExam = (exam: ScheduledExam) => {
    setActiveStudentExam(exam);
    setActiveTab('attend-exam');
  };

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-600" />
            Student Exam Timetable & Schedule
          </h2>
          <p className="text-xs text-slate-500">
            Active examination timetable for <strong>{selectedChild.name}</strong> ({selectedChild.class} - {selectedChild.section})
          </p>
        </div>

        {/* Selected Child Pill */}
        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 text-emerald-900 font-bold">
          <img src={selectedChild.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
          <span>{selectedChild.name}</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'all', label: 'All Exams' },
            { id: 'live', label: 'Live Now' },
            { id: 'scheduled', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tabFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exam title or subject..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {childExams.map((ex) => (
          <div
            key={ex.id}
            className={`p-5 bg-white rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              ex.status === 'live'
                ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    ex.status === 'live'
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : ex.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {ex.status === 'live' ? '● LIVE EXAM' : ex.status}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{ex.examType}</span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{ex.title}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Subject</span>
                  <strong>{ex.subject}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Date</span>
                  <strong>{ex.examDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Time Slot</span>
                  <strong>{ex.startTime} - {ex.endTime}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                  <strong className="text-emerald-700">{ex.durationMinutes} Mins</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 leading-relaxed border border-slate-200">
                <strong className="text-slate-800 block mb-0.5">Instructions:</strong>
                {ex.instructions.slice(0, 90)}...
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                {ex.totalQuestions} Qs • {ex.maxMarks} Marks
              </span>

              {ex.status === 'live' ? (
                <button
                  onClick={() => handleStartExam(ex)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Attend Exam</span>
                </button>
              ) : ex.status === 'scheduled' ? (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  Scheduled
                </span>
              ) : (
                <button
                  onClick={() => setActiveTab('student-results')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors"
                >
                  View Result
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
