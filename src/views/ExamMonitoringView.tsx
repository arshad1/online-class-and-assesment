import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { MonitoringStudent, LiveAlert } from '../types';
import {
  Activity,
  Megaphone,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  Search,
  Filter,
  Eye,
  Send,
  Pause,
  Play,
  PlusCircle,
  ShieldAlert,
  Bell,
  RefreshCw,
} from 'lucide-react';

export const ExamMonitoringView: React.FC = () => {
  const {
    monitoringStudents,
    liveAlerts,
    setSelectedStudentForDrawer,
    setShowBroadcastModal,
    sendWarningToStudent,
    pauseStudentExam,
    resumeStudentExam,
    addExtraTime,
    forceSubmitStudent,
    terminateStudentExam,
  } = useExam();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [alertCategory, setAlertCategory] = useState<string>('all');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(2535); // 42 min 15 sec

  // Countdown timer for live exam clock
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Metrics
  const totalStudents = 45;
  const notStarted = monitoringStudents.filter((s) => s.examStatus === 'not_started').length + 33;
  const inProgress = monitoringStudents.filter((s) => s.examStatus === 'active' || s.examStatus === 'warning').length;
  const submitted = monitoringStudents.filter((s) => s.examStatus === 'submitted').length + 2;
  const disconnected = monitoringStudents.filter((s) => s.connectionStatus === 'disconnected').length;
  const flaggedStudents = monitoringStudents.filter(
    (s) => s.examStatus === 'warning' || s.examStatus === 'suspicious'
  ).length;

  const filteredStudents = monitoringStudents.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.rollNo.includes(searchTerm) ||
      st.ipAddress.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || st.examStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAlerts = liveAlerts.filter((alt) => {
    if (alertCategory === 'warnings') return alt.alertType === 'tab_switch' || alt.alertType === 'warning_sent';
    if (alertCategory === 'disconnections') return alt.alertType === 'disconnection' || alt.alertType === 'reconnection';
    if (alertCategory === 'submissions') return alt.alertType === 'submitted';
    if (alertCategory === 'suspicious') return alt.severity === 'danger';
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card: Exam Live Bar */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              LIVE EXAM SESSION
            </span>
            <span className="text-xs text-slate-400">Class 10 • Section A & B</span>
          </div>
          <h2 className="text-lg font-bold text-white">Grade 10 Mathematics Midterm 2026</h2>
          <div className="flex items-center gap-4 text-xs text-slate-300 pt-0.5">
            <span>Subject: <strong>Mathematics</strong></span>
            <span>Started: <strong>09:00 AM</strong></span>
            <span>Total Enrolled: <strong>{totalStudents} Candidates</strong></span>
          </div>
        </div>

        {/* Live Countdown & Broadcast Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-center min-w-36">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Time Remaining</span>
            <span className="text-lg font-mono font-bold text-amber-400">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Megaphone className="w-4 h-4" />
            <span>Send Announcement</span>
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Students</span>
          <p className="text-xl font-black text-slate-900 mt-1">{totalStudents}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Not Started</span>
          <p className="text-xl font-black text-slate-600 mt-1">{notStarted}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block">In Progress</span>
          <p className="text-xl font-black text-emerald-900 mt-1">{inProgress}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-blue-200 shadow-xs bg-blue-50/20">
          <span className="text-[10px] font-bold text-blue-900 uppercase block">Submitted</span>
          <p className="text-xl font-black text-blue-950 mt-1">{submitted}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-red-200 shadow-xs bg-red-50/20">
          <span className="text-[10px] font-bold text-red-800 uppercase block">Disconnected</span>
          <p className="text-xl font-black text-red-900 mt-1">{disconnected}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs bg-amber-50/30">
          <span className="text-[10px] font-bold text-amber-900 uppercase block">Flagged Students</span>
          <p className="text-xl font-black text-amber-900 mt-1">{flaggedStudents}</p>
        </div>
      </div>

      {/* Main Grid: Student Monitoring Table (2 cols) & Live Alerts Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Monitoring Table Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Student Monitoring Grid</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                {filteredStudents.length} Active Candidates
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-44">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student / roll no..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="active">Green (Active)</option>
                <option value="warning">Orange (Warning)</option>
                <option value="suspicious">Red (Suspicious)</option>
                <option value="submitted">Blue (Submitted)</option>
                <option value="disconnected">Grey (Disconnected)</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Candidate</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Answered</th>
                  <th className="p-3.5">Time Left</th>
                  <th className="p-3.5">Tab Switches</th>
                  <th className="p-3.5">Connection</th>
                  <th className="p-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    {/* Student Info */}
                    <td className="p-3.5">
                      <div
                        onClick={() => setSelectedStudentForDrawer(st)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {st.name}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Roll: {st.rollNo} • Login: {st.loginTime}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase inline-block ${
                          st.examStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : st.examStatus === 'warning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : st.examStatus === 'suspicious'
                            ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                            : st.examStatus === 'submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {st.examStatus}
                      </span>
                    </td>

                    {/* Questions Progress */}
                    <td className="p-3.5 font-semibold text-slate-800">
                      {st.questionsAnswered} / {st.totalQuestions} Qs
                    </td>

                    {/* Time Remaining */}
                    <td className="p-3.5 font-bold text-blue-700">
                      {st.timeRemainingMinutes} mins
                    </td>

                    {/* Tab Switch Count */}
                    <td className="p-3.5">
                      <span
                        className={`font-bold ${
                          st.tabSwitchCount > 2
                            ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded'
                            : st.tabSwitchCount > 0
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {st.tabSwitchCount} switches
                      </span>
                    </td>

                    {/* Connection */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Wifi
                          className={`w-3.5 h-3.5 ${
                            st.connectionStatus === 'connected'
                              ? 'text-emerald-500'
                              : st.connectionStatus === 'unstable'
                              ? 'text-amber-500'
                              : 'text-red-500'
                          }`}
                        />
                        <span className="capitalize">{st.connectionStatus}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => setSelectedStudentForDrawer(st)}
                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md font-semibold text-xs transition-colors"
                        title="View Detailed Student Log"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => sendWarningToStudent(st.id, 'Please maintain focus on exam window.')}
                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                        title="Send Warning"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Alerts Panel Column */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-500" />
                Live Alerts Feed
              </h3>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>

            {/* Alert Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold">
              {[
                { id: 'all', label: 'All' },
                { id: 'warnings', label: 'Warnings' },
                { id: 'disconnections', label: 'Disconnects' },
                { id: 'submissions', label: 'Submissions' },
                { id: 'suspicious', label: 'Suspicious' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setAlertCategory(pill.id)}
                  className={`px-2.5 py-1 rounded-md transition-all shrink-0 ${
                    alertCategory === pill.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Alerts Feed List */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No alerts recorded for this filter category.
              </div>
            ) : (
              filteredAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                    alt.severity === 'danger'
                      ? 'bg-red-50 border-red-200 text-red-950'
                      : alt.severity === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : alt.severity === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-blue-50 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {alt.studentName} ({alt.rollNo})
                    </span>
                    <span className="text-[10px] font-normal opacity-75">{alt.timestamp}</span>
                  </div>
                  <p className="text-[11px] font-medium leading-snug">{alt.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
