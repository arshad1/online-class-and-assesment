import React from 'react';
import { useExam } from '../context/ExamContext';
import {
  CalendarClock,
  Activity,
  CheckSquare,
  Award,
  Sparkles,
  Plus,
  Play,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    setActiveTab,
    scheduledExams,
    monitoringStudents,
    studentSubmissions,
    recentActivities,
    setShowScheduleModal,
  } = useExam();

  const examsToday = scheduledExams.filter((e) => e.examDate === '2026-08-10' || e.status === 'live').length;
  const upcomingExams = scheduledExams.filter((e) => e.status === 'scheduled').length;
  const liveExams = scheduledExams.filter((e) => e.status === 'live').length;
  const pendingAssessment = studentSubmissions.filter(
    (s) => s.evaluationStatus === 'pending' || s.evaluationStatus === 'in_review'
  ).length;
  const resultsReadyToPublish = studentSubmissions.filter((s) => s.publishStatus === 'ready').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome Card */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Teacher Portal
            </span>
            <span className="text-xs text-blue-200">St. Xavier's International Academy</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Online Exam Management Dashboard
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Question papers are pre-linked from the Question Paper Generator. Manage scheduling, real-time candidate proctoring, evaluation, and result publication.
          </p>
        </div>

        {/* Quick Action Create Exam Button */}
        <button
          onClick={() => setActiveTab('create-exam-basic')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Online Exam</span>
        </button>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Exams Today */}
        <div
          onClick={() => setActiveTab('exam-scheduling')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Exams Today
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{examsToday}</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
            <span>View Schedule</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 2: Upcoming Exams */}
        <div
          onClick={() => setActiveTab('exam-scheduling')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Upcoming Exams
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{upcomingExams}</p>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Scheduled for next 7 days</p>
        </div>

        {/* Card 3: Live Exams */}
        <div
          onClick={() => setActiveTab('exam-monitoring')}
          className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-emerald-50/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Live Exams
            </span>
            <div className="p-2 bg-emerald-500 text-white rounded-xl group-hover:scale-110 transition-transform shadow-xs">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-900 mt-2">{liveExams}</p>
          <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Monitor Active Session</span>
          </p>
        </div>

        {/* Card 4: Pending Assessment */}
        <div
          onClick={() => setActiveTab('assessment')}
          className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-amber-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Pending Assessment
            </span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-950 mt-2">{pendingAssessment}</p>
          <p className="text-[11px] text-amber-800 font-semibold mt-1">Requires manual grading</p>
        </div>

        {/* Card 5: Results Ready to Publish */}
        <div
          onClick={() => setActiveTab('publish-results')}
          className="p-4 bg-white rounded-2xl border border-blue-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-blue-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              Ready to Publish
            </span>
            <div className="p-2 bg-blue-600 text-white rounded-xl group-hover:scale-110 transition-transform shadow-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-950 mt-2">{resultsReadyToPublish}</p>
          <p className="text-[11px] text-blue-700 font-bold mt-1">Finalized report cards</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Primary Teacher Workflow Actions
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('create-exam-basic')}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>1. Create Exam (Step 1)</span>
          </button>

          <button
            onClick={() => setActiveTab('exam-monitoring')}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Monitor Live Exam</span>
          </button>

          <button
            onClick={() => setActiveTab('assessment')}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>3. Continue Assessment</span>
          </button>

          <button
            onClick={() => setActiveTab('publish-results')}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>4. Publish Results</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Today's Exams Table & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Exams Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-blue-600" />
              Today's & Active Examinations
            </h3>
            <button
              onClick={() => setActiveTab('exam-scheduling')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All Scheduled
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Exam Name</th>
                  <th className="p-3.5">Subject & Class</th>
                  <th className="p-3.5">Start Time</th>
                  <th className="p-3.5">Students</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduledExams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{ex.title}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ex.questionPaperCode}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-medium text-slate-800">{ex.subject}</p>
                      <span className="text-[11px] text-slate-500">
                        {ex.class} ({ex.section})
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{ex.startTime}</td>
                    <td className="p-3.5 font-bold text-slate-900">{ex.studentCount}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase inline-block ${
                          ex.status === 'live'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : ex.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : ex.status === 'completed'
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ex.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {ex.status === 'live' ? (
                        <button
                          onClick={() => setActiveTab('exam-monitoring')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>Monitor Live</span>
                        </button>
                      ) : ex.status === 'completed' ? (
                        <button
                          onClick={() => setActiveTab('assessment')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <CheckSquare className="w-3 h-3" />
                          <span>Assess</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('exam-scheduling')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Recent Module Activity
            </h3>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      act.badgeType === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : act.badgeType === 'info'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {act.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{act.timestamp}</span>
                </div>
                <p className="text-slate-800 font-medium leading-snug">{act.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
