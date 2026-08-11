import React, { useState } from 'react';
import {
  Search,
  Bell,
  Building2,
  Calendar,
  User,
  ChevronDown,
  X,
  ExternalLink,
  Users,
  Play,
  Pause,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  GraduationCap,
} from 'lucide-react';
import { useExam } from '../../context/ExamContext';
import { ActiveNavTab } from '../../types';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const {
    portalMode,
    setPortalMode,
    activeTab,
    setActiveTab,
    setShowScheduleModal,
    liveSimulationActive,
    setLiveSimulationActive,
    liveAlerts,
    parentAccount,
    selectedChild,
    setSelectedChildId,
  } = useExam();

  const [showNotifications, setShowNotifications] = useState(false);

  const getPageMeta = (tab: ActiveNavTab): { title: string; subtitle: string } => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Online Exam Dashboard',
          subtitle: 'Overview of scheduled, live, and completed examination sessions',
        };
      case 'exam-scheduling':
        return {
          title: 'Exam Scheduling',
          subtitle: 'Configure timing, assign question papers, select students & security controls',
        };
      case 'exam-monitoring':
        return {
          title: 'Live Exam Monitoring',
          subtitle: 'Real-time candidate tracking, tab switch alerts, student actions & teacher broadcast',
        };
      case 'assessment':
        return {
          title: 'Evaluation & Assessment',
          subtitle: 'Automatic objective grading, split-screen manual evaluation & mark finalization',
        };
      case 'publish-results':
        return {
          title: 'Result Publishing & Analytics',
          subtitle: 'Configure pass rules, preview student report sheets, export data & publish results',
        };
      case 'settings':
        return {
          title: 'Exam & System Settings',
          subtitle: 'Configure grading bands, security defaults & notification preferences',
        };
      case 'parent-dashboard':
        return {
          title: 'Parent & Student Dashboard',
          subtitle: `Overview for ${parentAccount.parentName} • Active Student: ${selectedChild.name} (${selectedChild.class})`,
        };
      case 'student-exams-list':
        return {
          title: 'Student Exam Timetable & Schedule',
          subtitle: `View upcoming, active live, and completed exams for ${selectedChild.name}`,
        };
      case 'attend-exam':
        return {
          title: 'Student Active Exam Portal',
          subtitle: 'Interactive examination taking environment for candidates',
        };
      case 'student-results':
        return {
          title: 'Student Report Cards & Exam Results',
          subtitle: `Official published exam report sheets and score breakdowns for ${selectedChild.name}`,
        };
      default:
        return { title: 'Online Exam Module', subtitle: 'Educational Portal' };
    }
  };

  const { title, subtitle } = getPageMeta(activeTab);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">{title}</h1>
          <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            <Building2 className="w-3 h-3 text-slate-500" />
            St. Xavier's International Academy
          </span>

          {/* Role Pill */}
          <span
            className={`hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              portalMode === 'teacher'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            {portalMode === 'teacher' ? 'Teacher Portal' : 'Parent/Student Portal'}
          </span>
        </div>
        <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
      </div>

      {/* Action Controls & Top Bar Items */}
      <div className="flex items-center gap-3">
        {/* Child Selector Dropdown (When in Parent Mode) */}
        {portalMode === 'parent_student' && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-left">
              <span className="text-[9px] font-bold text-emerald-800 uppercase block leading-none">
                Active Student
              </span>
              <select
                value={selectedChild.id}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="bg-transparent font-bold text-xs text-emerald-950 focus:outline-none cursor-pointer"
              >
                {parentAccount.children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name} ({child.class})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exam, student..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Mode Switcher Button */}
        <button
          onClick={() => setPortalMode(portalMode === 'teacher' ? 'parent_student' : 'teacher')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs border ${
            portalMode === 'teacher'
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
          }`}
          title="Switch role between Teacher and Parent/Student views"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            Switch to {portalMode === 'teacher' ? 'Parent Portal' : 'Teacher View'}
          </span>
        </button>

        {/* Schedule Exam Button (Only in Teacher Mode) */}
        {portalMode === 'teacher' && (
          <button
            onClick={() => {
              setActiveTab('exam-scheduling');
              setShowScheduleModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schedule Exam</span>
          </button>
        )}

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Live Notifications"
          >
            <Bell className="w-4 h-4" />
            {liveAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {liveAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold">Exam Activity Feed</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {liveAlerts.slice(0, 6).map((alert) => (
                  <div key={alert.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      {alert.severity === 'danger' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      ) : alert.severity === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {alert.studentName} ({alert.rollNo})
                        </p>
                        <p className="text-[11px] text-slate-600 leading-snug">{alert.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
