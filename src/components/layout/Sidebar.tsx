import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarClock,
  Activity,
  CheckSquare,
  ClipboardCheck,
  Award,
  Settings,
  BookOpen,
  ShieldCheck,
  Building2,
  Users,
  ChevronDown,
  Sparkles,
  Play,
  FileText,
  Paperclip,
  Calculator,
  UserCheck,
  Video,
} from 'lucide-react';
import { useExam } from '../../context/ExamContext';
import { ActiveNavTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    userRole,
    portalMode,
    setPortalMode,
    activeTab,
    setActiveTab,
    onlineClasses,
    monitoringStudents,
    studentSubmissions,
    evaluationDashboardItems,
    attachmentRecords,
    parentAccount,
    selectedChild,
    setSelectedChildId,
  } = useExam();

  const liveClassesCount = onlineClasses.filter((c) => c.status === 'live').length;

  const liveAlertCount = monitoringStudents.filter(
    (s) => s.examStatus === 'warning' || s.examStatus === 'suspicious'
  ).length;

  const pendingAssessmentCount = studentSubmissions.filter(
    (s) => s.evaluationStatus === 'pending' || s.evaluationStatus === 'in_review'
  ).length;

  const pendingEvaluationDashboardCount = evaluationDashboardItems.filter(
    (i) => i.evaluationStatus === 'Not Started' || i.evaluationStatus === 'In Progress'
  ).length;

  const teacherNavItems: { id: ActiveNavTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'online-classes',
      label: 'Online Classes',
      icon: <Video className="w-4 h-4" />,
      badge: liveClassesCount > 0 ? 'LIVE' : undefined,
      badgeColor: 'bg-red-600 text-white font-extrabold animate-pulse',
    },
    { id: 'exam-scheduling', label: 'Exam Scheduling', icon: <CalendarClock className="w-4 h-4" /> },
    {
      id: 'exam-monitoring',
      label: 'Exam Monitoring',
      icon: <Activity className="w-4 h-4" />,
      badge: liveAlertCount > 0 ? liveAlertCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-900',
    },
    {
      id: 'evaluation-dashboard',
      label: 'Evaluation Dashboard',
      icon: <ClipboardCheck className="w-4 h-4" />,
      badge: pendingEvaluationDashboardCount > 0 ? pendingEvaluationDashboardCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'answer-evaluation',
      label: 'Answer Evaluation',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'attachment-evaluation',
      label: 'Attachment Evaluation',
      icon: <Paperclip className="w-4 h-4" />,
      badge: attachmentRecords.length,
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      id: 'result-calculation-review',
      label: 'Result Calculation',
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: 'assessment',
      label: 'Assessment',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingAssessmentCount > 0 ? pendingAssessmentCount : undefined,
      badgeColor: 'bg-slate-600 text-white',
    },
    { id: 'publish-results', label: 'Results', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const parentNavItems: { id: ActiveNavTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    { id: 'parent-dashboard', label: 'Children Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'student-online-classes',
      label: 'Live Classes',
      icon: <Video className="w-4 h-4" />,
      badge: liveClassesCount > 0 ? 'LIVE' : undefined,
      badgeColor: 'bg-red-600 text-white font-extrabold animate-pulse',
    },
    { id: 'student-exams-list', label: 'Exams & Schedule', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'attend-exam', label: 'Attend Active Exam', icon: <Play className="w-4 h-4" /> },
    { id: 'student-results', label: 'Report Cards & Results', icon: <Award className="w-4 h-4" /> },
  ];

  const [onlineClassesOpen, setOnlineClassesOpen] = useState(true);
  const { liveAssessments } = useExam();

  const isOnlineClassSubActive =
    activeTab === 'online-classes' ||
    activeTab === 'online-class-assessments' ||
    activeTab === 'create-class-assessment' ||
    activeTab === 'create-online-class' ||
    activeTab === 'live-classroom';

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl text-white shadow-lg flex items-center justify-center ${
            portalMode === 'parent_student'
              ? 'bg-emerald-600 shadow-emerald-500/20'
              : userRole === 'proctor'
              ? 'bg-amber-600 shadow-amber-500/20'
              : 'bg-blue-600 shadow-blue-500/20'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-wide">
                {portalMode === 'parent_student'
                  ? 'EduExam Parent'
                  : userRole === 'proctor'
                  ? 'EduExam Proctor'
                  : 'EduExam Pro'}
              </span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                portalMode === 'parent_student'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : userRole === 'proctor'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {portalMode === 'parent_student'
                  ? 'Parent'
                  : userRole === 'proctor'
                  ? 'Proctor'
                  : 'Teacher'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {portalMode === 'parent_student'
                ? 'Parent & Student Portal'
                : userRole === 'proctor'
                ? 'Invigilator & Proctor Portal'
                : 'Teacher Exam Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher Banner */}
      <div className="p-3 mx-3 my-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Portal Access Role</span>
        </div>
        <div className="grid grid-cols-2 gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setPortalMode('teacher')}
            className={`py-1.5 rounded-md font-bold transition-all ${
              portalMode === 'teacher'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setPortalMode('parent_student')}
            className={`py-1.5 rounded-md font-bold transition-all ${
              portalMode === 'parent_student'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Parent/Student
          </button>
        </div>
      </div>

      {/* Multi-Student Selector Card (Only visible in Parent/Student mode) */}
      {portalMode === 'parent_student' && (
        <div className="px-3 py-2 mx-3 mb-2 bg-emerald-950/40 rounded-xl border border-emerald-800/50 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" />
              Select Child (Student)
            </span>
            <span className="text-[9px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-200">
              {parentAccount.children.length} Children
            </span>
          </div>

          <select
            value={selectedChild.id}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-900 border border-emerald-600/50 rounded-lg text-xs font-bold text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {parentAccount.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.class})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Modules */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {portalMode === 'parent_student'
            ? 'Parent & Student Portal'
            : userRole === 'proctor'
            ? 'Proctor & Invigilator Modules'
            : 'Core Teacher Modules'}
        </div>

        {portalMode === 'teacher' ? (
          <>
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'}>
                  <LayoutDashboard className="w-4 h-4" />
                </span>
                <span>Dashboard</span>
              </div>
            </button>

            {/* Online Classes - With Expandable Submenu */}
            <div className="space-y-1">
              <div
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isOnlineClassSubActive
                    ? 'bg-slate-800/90 text-white font-semibold border-l-3 border-blue-500'
                    : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                }`}
                onClick={() => {
                  setOnlineClassesOpen(!onlineClassesOpen);
                  if (!isOnlineClassSubActive) {
                    setActiveTab('online-classes');
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={isOnlineClassSubActive ? 'text-blue-400' : 'text-slate-400'}>
                    <Video className="w-4 h-4" />
                  </span>
                  <span>Online Classes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {liveClassesCount > 0 && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-red-600 text-white animate-pulse">
                      LIVE
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      onlineClassesOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Submenu Items */}
              {onlineClassesOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-800 ml-4 my-1">
                  {/* Submenu Item 1: All Online Classes */}
                  <button
                    onClick={() => setActiveTab('online-classes')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                      activeTab === 'online-classes'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'online-classes' ? 'bg-white' : 'bg-blue-400'}`} />
                      <span>All Classes & Studio</span>
                    </div>
                  </button>

                  {/* Submenu Item 2: Class Assessments */}
                  <button
                    onClick={() => setActiveTab('online-class-assessments')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                      activeTab === 'online-class-assessments'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'online-class-assessments' ? 'bg-white' : 'bg-purple-400'}`} />
                      <span>Class Assessments</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-purple-900/80 text-purple-200 border border-purple-700/50">
                      {liveAssessments.length}
                    </span>
                  </button>

                  {/* Submenu Item 3: Create Assessment */}
                  <button
                    onClick={() => setActiveTab('create-class-assessment')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                      activeTab === 'create-class-assessment'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'create-class-assessment' ? 'bg-white' : 'bg-emerald-400'}`} />
                      <span>+ Create Assessment</span>
                    </div>
                  </button>

                  {/* Submenu Item 4: Schedule Class */}
                  <button
                    onClick={() => setActiveTab('create-online-class')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                      activeTab === 'create-online-class'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'create-online-class' ? 'bg-white' : 'bg-amber-400'}`} />
                      <span>Schedule New Class</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Other Teacher Navigation Items */}
            {teacherNavItems.slice(2).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.badgeColor || 'bg-blue-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </>
        ) : (
          parentNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || 'bg-blue-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
        {portalMode === 'teacher' ? (
          <>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Teacher Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-500/40 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Prof. Sarah Jenkins</p>
              <p className="text-[11px] text-slate-400 truncate">Senior Physics & Math</p>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-blue-400">
                <Building2 className="w-3 h-3" />
                <span className="truncate">St. Xavier's Academy</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Parent Profile"
              className="w-10 h-10 rounded-full border-2 border-emerald-500/40 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{parentAccount.parentName}</p>
              <p className="text-[11px] text-emerald-400 truncate font-semibold">
                Parent Account ({parentAccount.children.length} Children)
              </p>
              <p className="text-[10px] text-slate-400 truncate">ID: PAR-8890</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
