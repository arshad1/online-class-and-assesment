import React, { useState } from 'react';
import { Clock, ShieldAlert, Camera, Monitor, Wifi, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export const StudentSessionDetailView: React.FC = () => {
  const { students, setActiveTab } = useExam();
  const student = students[0]; // Example student Aisha Rahman

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'timeline' | 'webcam' | 'browser' | 'network' | 'answers' | 'notes'>('overview');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('exam-sessions')}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exam Sessions</span>
        </button>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
          High-Risk Session Flagged (Risk Score: {student.riskScore}/100)
        </span>
      </div>

      {/* Candidate Profile Summary Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={student.photoUrl} alt={student.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
            <p className="text-xs text-slate-500">
              Admission ID: {student.admissionNo} &bull; Class: {student.class} &bull; Dept: {student.department}
            </p>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
              <span><strong>Device:</strong> {student.device}</span>
              <span><strong>IP:</strong> {student.ip}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border">
            <p className="text-slate-500">Final Score</p>
            <p className="text-base font-bold text-slate-900">84/100</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border">
            <p className="text-slate-500">Duration</p>
            <p className="text-base font-bold text-slate-900">1h 48m</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-700 font-semibold">Total Risk</p>
            <p className="text-base font-bold text-red-600">+{student.riskScore} pt</p>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Markers Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Session Timeline Event Markers
        </h3>
        <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center px-4 border border-slate-200">
          <div className="w-full h-1.5 bg-slate-300 rounded-full relative">
            <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow" title="Exam Started (14:00)" />
            <div className="absolute left-[35%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow animate-pulse" title="Tab Switched (14:22)" />
            <div className="absolute left-[65%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow animate-pulse" title="Mobile Phone Detected (14:38)" />
            <div className="absolute left-[92%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" title="Exam Submitted (15:48)" />
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>14:00 (Start)</span>
          <span className="text-amber-600 font-bold">14:22 (Tab Switch)</span>
          <span className="text-red-600 font-bold">14:38 (Phone Detected)</span>
          <span>15:48 (Submit)</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: 'Violation Timeline' },
          { id: 'webcam', label: 'Webcam Events' },
          { id: 'browser', label: 'Browser Telemetry' },
          { id: 'network', label: 'Network Logs' },
          { id: 'answers', label: 'Answer Activity' },
          { id: 'notes', label: 'Reviewer Notes' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === t.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-xs space-y-4">
        {activeSubTab === 'overview' && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Session Comprehensive Summary</h4>
            <p className="text-slate-600 leading-relaxed">
              Candidate Aisha Rahman completed the Grade 12 Physics Assessment with a final grade score of 84/100.
              During the 108-minute session, the computer vision engine recorded 3 distinct violations including a high-risk mobile phone detection at minute 38.
            </p>
          </div>
        )}

        {activeSubTab === 'timeline' && (
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="font-bold text-red-900">14:38:12 — Mobile Phone Detected (+45 Pts)</span>
              <p className="text-[11px] text-red-700">YOLOv8 Object Detection flagged handheld smartphone device.</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="font-bold text-amber-900">14:22:04 — Tab Switch Event (+15 Pts)</span>
              <p className="text-[11px] text-amber-700">Window focus lost for 4.2 seconds.</p>
            </div>
          </div>
        )}

        {activeSubTab !== 'overview' && activeSubTab !== 'timeline' && (
          <div className="p-4 bg-slate-50 text-slate-600 rounded-lg">
            Showing recorded telemetry logs for category <strong>{activeSubTab.toUpperCase()}</strong>.
          </div>
        )}
      </div>
    </div>
  );
};
