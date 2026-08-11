import React from 'react';
import { useExam } from '../context/ExamContext';
import {
  Users,
  Award,
  CalendarClock,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

export const ParentDashboardView: React.FC = () => {
  const {
    parentAccount,
    selectedChild,
    setSelectedChildId,
    setActiveTab,
    scheduledExams,
    studentSubmissions,
    setActiveStudentExam,
  } = useExam();

  const activeChildExams = scheduledExams.filter(
    (ex) => ex.class.toLowerCase().includes(selectedChild.class.toLowerCase()) || ex.status === 'live'
  );

  const liveExamForChild = activeChildExams.find((ex) => ex.status === 'live');
  const childSubmissions = studentSubmissions.filter((s) => s.studentName === selectedChild.name || s.rollNo === selectedChild.rollNo);

  const handleStartExam = (exam: typeof scheduledExams[0]) => {
    setActiveStudentExam(exam);
    setActiveTab('attend-exam');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Card */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Parent & Student Portal
            </span>
            <span className="text-xs text-emerald-200">St. Xavier's International Academy</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Welcome, {parentAccount.parentName}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Monitor examination performance, view live timetables, attend scheduled online tests, and access official report sheets for all your enrolled children.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/80 rounded-xl border border-emerald-700/60 text-xs">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Parent ID: <strong>PAR-8890</strong></span>
        </div>
      </div>

      {/* Multi-Student Selection Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Your Enrolled Children ({parentAccount.children.length} Students)
          </h3>
          <span className="text-xs text-slate-500 font-semibold">Click a student to view their exam portal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parentAccount.children.map((child) => {
            const isSelected = child.id === selectedChild.id;

            return (
              <div
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-bl-xl shadow-xs">
                    ACTIVE SELECTED
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className={`w-12 h-12 rounded-full border-2 object-cover ${
                      isSelected ? 'border-emerald-600' : 'border-slate-300'
                    }`}
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{child.name}</h4>
                    <p className="text-xs font-semibold text-slate-600">
                      {child.class} ({child.section}) • Roll: {child.rollNo}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Adm: {child.admissionNo}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-center text-xs">
                  <div className="p-1.5 bg-white/60 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">Attendance</span>
                    <strong className="text-slate-900 font-bold">{child.attendancePct}%</strong>
                  </div>

                  <div className="p-1.5 bg-white/60 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">Grade</span>
                    <strong className="text-emerald-700 font-bold">{child.overallGrade}</strong>
                  </div>

                  <div className="p-1.5 bg-white/60 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">Class Rank</span>
                    <strong className="text-blue-700 font-bold">#{child.rankInClass}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Exam Prompt Banner (If live exam exists for selected child) */}
      {liveExamForChild && (
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-white text-emerald-900 animate-pulse">
                LIVE EXAM NOW OPEN
              </span>
              <span className="text-xs font-bold text-emerald-100">
                Student: {selectedChild.name} ({selectedChild.class})
              </span>
            </div>
            <h3 className="text-lg font-black">{liveExamForChild.title}</h3>
            <p className="text-xs text-emerald-100">
              Duration: {liveExamForChild.durationMinutes} Mins • Total Questions: {liveExamForChild.totalQuestions} • Max Marks: {liveExamForChild.maxMarks}
            </p>
          </div>

          <button
            onClick={() => handleStartExam(liveExamForChild)}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl shadow-xl flex items-center gap-2 shrink-0 transition-all transform hover:scale-105"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Attend Exam Now</span>
          </button>
        </div>
      )}

      {/* Main Grid: Exam Schedule & Results Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Exam Schedule List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-emerald-600" />
              Examination Timetable for {selectedChild.name}
            </h3>
            <button
              onClick={() => setActiveTab('student-exams-list')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {activeChildExams.map((ex) => (
              <div
                key={ex.id}
                className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        ex.status === 'live'
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : ex.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {ex.status}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{ex.title}</h4>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <span>Subject: <strong>{ex.subject}</strong></span>
                    <span>Date: <strong>{ex.examDate}</strong></span>
                    <span>Time: <strong>{ex.startTime} - {ex.endTime}</strong></span>
                    <span>Duration: <strong>{ex.durationMinutes} mins</strong></span>
                  </div>
                </div>

                <div>
                  {ex.status === 'live' ? (
                    <button
                      onClick={() => handleStartExam(ex)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Attend Exam</span>
                    </button>
                  ) : ex.status === 'scheduled' ? (
                    <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      Upcoming Test
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

        {/* Right Col: Recent Results & Performance Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Published Exam Results
            </h3>
            <button
              onClick={() => setActiveTab('student-results')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              View All
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {childSubmissions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No published exam results for {selectedChild.name} yet.
              </div>
            ) : (
              childSubmissions.map((sub) => (
                <div key={sub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{sub.examTitle}</p>
                      <span className="text-[10px] text-slate-500">Submitted: {sub.submissionTime}</span>
                    </div>
                    <span className="text-sm font-black text-emerald-700">{sub.percentage}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/80">
                    <span className="font-semibold text-slate-700">
                      Marks: {sub.totalMarks} / {sub.maxMarks}
                    </span>
                    <span className="font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      Grade: {sub.grade} ({sub.resultStatus.toUpperCase()})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
