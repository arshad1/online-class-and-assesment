import React, { useState } from 'react';
import {
  Eye,
  Clock,
  Users,
  ShieldAlert,
  WifiOff,
  Maximize,
  Filter,
  Grid,
  List,
  AlertTriangle,
  Camera,
  Mic,
  Monitor,
  Wifi,
  Smartphone,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { Student } from '../types';
import { StudentDetailDrawer } from '../components/proctoring/StudentDetailDrawer';

export const ProctoringMonitorView: React.FC = () => {
  const { students, setSelectedStudent, selectedStudent } = useExam();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'alert-only'>('grid');

  // Metrics
  const totalOnline = students.filter((s) => s.connectionStatus !== 'disconnected').length;
  const flaggedCount = students.filter((s) => s.riskScore >= 25).length;
  const highRiskCount = students.filter((s) => s.riskScore >= 50).length;
  const disconnectedCount = students.filter((s) => s.connectionStatus === 'disconnected').length;
  const fullScreenCompliantCount = students.filter((s) => s.fullScreenCompliant).length;
  const fullScreenPct = Math.round((fullScreenCompliantCount / (students.length || 1)) * 100);

  // Filter candidates
  const filteredStudents = students.filter((s) => {
    if (activeFilter === 'normal') return s.riskScore < 25;
    if (activeFilter === 'warning') return s.riskScore >= 25 && s.riskScore < 50;
    if (activeFilter === 'high_risk') return s.riskScore >= 50;
    if (activeFilter === 'camera_off') return s.cameraStatus !== 'active';
    if (activeFilter === 'no_face') return s.faceStatus === 'missing';
    if (activeFilter === 'multiple_faces') return s.faceStatus === 'multiple';
    if (activeFilter === 'tab_switching') return !s.fullScreenCompliant || s.lastViolation?.includes('Tab');
    if (activeFilter === 'phone') return s.lastViolation?.includes('phone') || s.lastViolation?.includes('Phone');
    if (activeFilter === 'conn_lost') return s.connectionStatus === 'disconnected';
    if (viewMode === 'alert-only') return s.riskScore >= 25;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Monitor Header Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-base font-bold tracking-tight">Grade 12 Physics Assessment — Live Proctoring</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multimodal telemetry stream &bull; AI Vision Model v4.2 Active
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-mono font-bold text-white text-sm">01:24:18</span>
            <span className="text-[10px] text-slate-400">Remaining</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">{totalOnline}</span>
            <span className="text-[10px] text-slate-400">Online</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/80 border border-amber-800/80 rounded-lg text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{flaggedCount}</span>
            <span className="text-[10px] text-amber-200">Flagged</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 border border-red-800/80 rounded-lg text-red-300">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="font-bold">{highRiskCount}</span>
            <span className="text-[10px] text-red-200">High Risk</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">
            <WifiOff className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-white">{disconnectedCount}</span>
            <span className="text-[10px] text-slate-400">Disconnected</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">
            <Maximize className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">{fullScreenPct}%</span>
            <span className="text-[10px] text-slate-400">Fullscreen</span>
          </div>
        </div>
      </div>

      {/* Filter and View Layout Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: `All (${students.length})` },
            { id: 'normal', label: 'Normal' },
            { id: 'warning', label: 'Warning' },
            { id: 'high_risk', label: 'High Risk' },
            { id: 'camera_off', label: 'Camera Off' },
            { id: 'no_face', label: 'No Face' },
            { id: 'multiple_faces', label: 'Multiple Faces' },
            { id: 'tab_switching', label: 'Tab Switching' },
            { id: 'phone', label: 'Phone Detected' },
            { id: 'conn_lost', label: 'Connection Lost' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeFilter === btn.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* View Layout Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded flex items-center gap-1 font-semibold transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          <button
            onClick={() => setViewMode('compact')}
            className={`p-1.5 rounded flex items-center gap-1 font-semibold transition-colors ${
              viewMode === 'compact' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compact</span>
          </button>

          <button
            onClick={() => setViewMode('alert-only')}
            className={`p-1.5 rounded flex items-center gap-1 font-semibold transition-colors ${
              viewMode === 'alert-only' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alert Only</span>
          </button>
        </div>
      </div>

      {/* Candidate Monitoring Cards Grid */}
      <div
        className={`grid gap-4 ${
          viewMode === 'compact'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {filteredStudents.map((student) => {
          // Border color calculation
          let borderColor = 'border-emerald-400 hover:border-emerald-500';
          let badgeBg = 'bg-emerald-500 text-white';

          if (student.riskScore >= 50) {
            borderColor = 'border-red-500 hover:border-red-600 ring-2 ring-red-500/20';
            badgeBg = 'bg-red-600 text-white animate-pulse';
          } else if (student.riskScore >= 25) {
            borderColor = 'border-amber-400 hover:border-amber-500';
            badgeBg = 'bg-amber-500 text-white';
          }

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`bg-white rounded-xl border-2 ${borderColor} shadow-xs hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col justify-between group`}
            >
              {/* Webcam Feed Placeholder */}
              <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                />

                {/* AI Detection Overlay Simulation */}
                {student.faceStatus === 'multiple' ? (
                  <div className="absolute inset-2 border-2 border-dashed border-red-500 rounded animate-pulse p-1">
                    <span className="bg-red-600 text-white text-[9px] font-bold px-1 rounded">
                      2 FACES DETECTED
                    </span>
                  </div>
                ) : student.lastViolation?.includes('Phone') ? (
                  <div className="absolute top-2 right-2 w-16 h-16 border-2 border-red-500 bg-red-500/30 rounded p-1 animate-pulse">
                    <span className="bg-red-600 text-white text-[8px] font-bold px-1 rounded">
                      PHONE
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-4 border border-emerald-500/60 rounded p-1">
                    <span className="bg-emerald-600/90 text-white text-[8px] font-semibold px-1 rounded">
                      FACE OK
                    </span>
                  </div>
                )}

                {/* Top Overlay Risk Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm ${badgeBg}`}>
                    Risk: {student.riskScore}
                  </span>
                </div>

                {/* Bottom Status Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs p-1.5 px-3 flex items-center justify-between text-white text-[11px]">
                  <span className="truncate font-semibold max-w-[120px]">{student.name}</span>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Camera
                      className={`w-3.5 h-3.5 ${
                        student.cameraStatus === 'active' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    />
                    <Mic
                      className={`w-3.5 h-3.5 ${
                        student.micStatus === 'active' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    />
                    <Monitor
                      className={`w-3.5 h-3.5 ${
                        student.screenShareStatus === 'active' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Card Metadata & Violation Details */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{student.admissionNo}</span>
                  <span>Q{student.activeQuestion}/{student.totalQuestions} ({student.progressPct}%)</span>
                </div>

                {/* Latest Violation Pill */}
                {student.lastViolation ? (
                  <div className="p-2 bg-red-50 border border-red-100 rounded-lg text-[11px] text-red-800 flex items-center justify-between">
                    <span className="font-semibold truncate">{student.lastViolation}</span>
                    <span className="text-[9px] text-red-500 shrink-0 ml-1">{student.lastEventTime}</span>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clean session — No violations</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Drawer Component */}
      <StudentDetailDrawer student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  );
};
