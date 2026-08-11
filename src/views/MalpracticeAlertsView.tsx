import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { MalpracticeAlert, ViolationType } from '../types';

export const MalpracticeAlertsView: React.FC = () => {
  const { alerts, updateAlertStatus, setSelectedAlert, setActiveTab } = useExam();

  const [searchQuery, setSearchQuery] = useState('');
  const [violationFilter, setViolationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [examFilter, setExamFilter] = useState<string>('all');

  // KPI Counter Calculations
  const newAlerts = alerts.filter((a) => a.status === 'new').length;
  const highPriority = alerts.filter((a) => a.riskPoints >= 35).length;
  const underReview = alerts.filter((a) => a.status === 'under_review').length;
  const confirmedCount = alerts.filter((a) => a.status === 'confirmed').length;
  const dismissedCount = alerts.filter((a) => a.status === 'dismissed').length;

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.alertCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesViolation = violationFilter === 'all' || alert.violationType === violationFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesExam = examFilter === 'all' || alert.examId === examFilter;

    return matchesSearch && matchesViolation && matchesStatus && matchesExam;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">New Alerts</p>
            <p className="text-2xl font-bold text-red-600">{newAlerts}</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">High Priority</p>
            <p className="text-2xl font-bold text-amber-600">{highPriority}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Under Review</p>
            <p className="text-2xl font-bold text-blue-600">{underReview}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Confirmed Violations</p>
            <p className="text-2xl font-bold text-slate-900">{confirmedCount}</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Dismissed Alerts</p>
            <p className="text-2xl font-bold text-slate-400">{dismissedCount}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Triage Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert ID, student name, admission no..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Showing:</span>
            <span className="font-bold text-slate-900">{filteredAlerts.length} total alerts</span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Triage Filters:</span>
          </div>

          {/* Violation Type */}
          <select
            value={violationFilter}
            onChange={(e) => setViolationFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Violation Types (14+)</option>
            <option value="Mobile phone detected">Mobile Phone Detected</option>
            <option value="Tab switch">Tab Switch</option>
            <option value="No face detected">No Face Detected</option>
            <option value="Multiple faces detected">Multiple Faces</option>
            <option value="Multiple voices detected">Multiple Voices</option>
            <option value="Identity mismatch">Identity Mismatch</option>
            <option value="Screen sharing stopped">Screen Sharing Stopped</option>
            <option value="Suspicious answer pattern">Suspicious Answer Pattern</option>
          </select>

          {/* Review Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Review Statuses</option>
            <option value="new">New / Unassigned</option>
            <option value="under_review">Under Review</option>
            <option value="confirmed">Confirmed Violation</option>
            <option value="dismissed">Dismissed Alert</option>
          </select>

          {/* Exam Filter */}
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Exams</option>
            <option value="exam-101">Grade 12 Physics Assessment</option>
            <option value="exam-102">Computer Science Entrance Test</option>
            <option value="exam-105">English Language Examination</option>
          </select>
        </div>
      </div>

      {/* Malpractice Alerts Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Exam Title</th>
                <th className="py-3 px-4">Violation Type</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Risk Points</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{alert.alertCode}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={alert.studentPhoto}
                        alt={alert.studentName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{alert.studentName}</p>
                        <p className="text-[10px] text-slate-400">{alert.admissionNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-[160px] truncate text-slate-600">{alert.examTitle}</td>
                  <td className="py-3 px-4 font-semibold text-red-600">{alert.violationType}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[11px]">
                      {alert.confidenceScore}% match
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-600">+{alert.riskPoints} pt</td>
                  <td className="py-3 px-4 text-slate-400">{alert.timestamp}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        alert.status === 'new'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : alert.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800'
                          : alert.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {alert.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAlert(alert);
                          setActiveTab('evidence-review');
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[11px] transition-colors shadow-xs"
                      >
                        Review Evidence
                      </button>

                      {alert.status === 'new' && (
                        <>
                          <button
                            onClick={() => updateAlertStatus(alert.id, 'confirmed', 'Quick confirmed by proctor')}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Quick Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => updateAlertStatus(alert.id, 'dismissed', 'Quick dismissed false positive')}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                            title="Quick Dismiss"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
