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
} from 'lucide-react';
import { useExam } from '../../context/ExamContext';
import { ActiveNavTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    portalMode,
    setPortalMode,
    activeTab,
    setActiveTab,
    monitoringStudents,
    studentSubmissions,
    evaluationDashboardItems,
    attachmentRecords,
    parentAccount,
    selectedChild,
    setSelectedChildId,
  } = useExam();

  const liveAlertCount = monitoringStudents.filter(
    (s) => s.examStatus === 'warning' || s.examStatus === 'suspicious'
  ).length;

  const pendingAssessmentCount = studentSubmissions.filter(
    (s) => s.evaluationStatus === 'pending' || s.evaluationStatus === 'in_review'
  ).length;

  const pendingEvaluationDashboardCount = evaluationDashboardItems.filter(
    (i) => i.evaluationStatus === 'Not Started' || i.evaluationStatus === 'In Progress'
  ).length;

  const teacherNavItems: { id: ActiveNavTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
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

  const parentNavItems: { id: ActiveNavTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'parent-dashboard', label: 'Children Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'student-exams-list', label: 'Exams & Schedule', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'attend-exam', label: 'Attend Active Exam', icon: <Play className="w-4 h-4" /> },
    { id: 'student-results', label: 'Report Cards & Results', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl text-white shadow-lg flex items-center justify-center ${portalMode === 'teacher' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-emerald-600 shadow-emerald-500/20'}`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-wide">
                {portalMode === 'teacher' ? 'EduExam Pro' : 'EduExam Parent'}
              </span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${portalMode === 'teacher' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                {portalMode === 'teacher' ? 'Teacher' : 'Parent'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {portalMode === 'teacher' ? 'Teacher Exam Portal' : 'Parent & Student Portal'}
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
          {portalMode === 'teacher' ? 'Core Teacher Modules' : 'Parent & Student Portal'}
        </div>

        {(portalMode === 'teacher' ? teacherNavItems : parentNavItems).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? portalMode === 'teacher'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
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
