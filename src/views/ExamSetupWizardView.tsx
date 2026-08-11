import React, { useState } from 'react';
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Video,
  Lock,
  Camera,
  Mic,
  Monitor,
  UserCheck,
  Sliders,
  Database,
  Send,
  Sparkles,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { Exam } from '../types';

export const ExamSetupWizardView: React.FC = () => {
  const { addNewExam, setActiveTab } = useExam();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: 'Final Semester Operating Systems Assessment',
    subject: 'Computer Science & Distributed Systems',
    classDept: 'BS Computer Science - Section C',
    date: '2026-08-10',
    startTime: '10:00 AM',
    durationMinutes: 120,
    totalRegistered: 75,
    requireFullscreen: true,
    blockCopyPaste: true,
    detectTabSwitch: true,
    requireWebcam: true,
    requireMic: true,
    requireScreenShare: true,
    enableFaceMatch: true,
    enableLiveness: true,
    enablePhoneDetect: true,
    enableSimilarity: true,
    retentionDays: '90',
  });

  const wizardSteps = [
    'Exam Details',
    'Student Selection',
    'Browser Restrictions',
    'Camera & Mic Rules',
    'Screen Sharing',
    'Identity Verification',
    'Risk Rules',
    'Data Retention',
    'Review & Publish',
  ];

  const handleNext = () => {
    if (currentStep < 9) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handlePublish = () => {
    const newExam: Exam = {
      id: 'exam-' + Date.now(),
      title: formData.title,
      subject: formData.subject,
      classDept: formData.classDept,
      date: formData.date,
      startTime: formData.startTime,
      endTime: '12:00 PM',
      durationMinutes: formData.durationMinutes,
      totalRegistered: formData.totalRegistered,
      onlineCount: 0,
      flaggedCount: 0,
      highRiskCount: 0,
      status: 'upcoming',
      fullScreenCompliancePct: 100,
      progressPct: 0,
    };

    addNewExam(newExam);
    setActiveTab('live-exams');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Wizard Header Progress Indicator */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Step {currentStep} of 9
            </span>
            <h2 className="text-lg font-bold text-slate-900">{wizardSteps[currentStep - 1]}</h2>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded text-xs">
            Proctoring Wizard
          </span>
        </div>

        {/* Step Indicator Bullets */}
        <div className="grid grid-cols-9 gap-1.5 pt-2">
          {wizardSteps.map((name, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={name}
                onClick={() => setCurrentStep(stepNum)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-blue-600'
                    : isCurrent
                    ? 'bg-blue-600 ring-4 ring-blue-100'
                    : 'bg-slate-200'
                }`}
                title={`Step ${stepNum}: ${name}`}
              />
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        {/* Step 1: Exam Details */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Basic Examination Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject & Module</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Student Selection */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Candidate & Roster Allocation</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Class / Department</label>
                <select
                  value={formData.classDept}
                  onChange={(e) => setFormData({ ...formData, classDept: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option>BS Computer Science - Section C</option>
                  <option>Grade 12 Science - Section A</option>
                  <option>School of Engineering</option>
                </select>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-bold text-blue-900">Registered Candidates Target:</p>
                <p className="text-blue-700 font-bold text-lg mt-1">{formData.totalRegistered} Students</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Browser Restrictions */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Client Environment Lock & Restrictions</h3>
            <div className="space-y-2">
              {[
                { key: 'requireFullscreen', label: 'Require OS Full-Screen Lockdown Mode' },
                { key: 'blockCopyPaste', label: 'Disable Copy, Paste & Clipboard Context Menu' },
                { key: 'detectTabSwitch', label: 'Detect & Log Window Focus Loss / Tab Switching' },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-3 p-3 bg-slate-50 border rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData as any)[opt.key]}
                    onChange={(e) => setFormData({ ...formData, [opt.key]: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4-8: Additional Configuration Steps */}
        {currentStep >= 4 && currentStep <= 8 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">{wizardSteps[currentStep - 1]} Settings</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                <span className="font-semibold text-slate-800">Enable mandatory WebRTC telemetry checks</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                <span className="font-semibold text-slate-800">Automated warning modals on threshold breach</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 9: Review and Publish */}
        {currentStep === 9 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Review Proctored Exam Configuration</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div><strong>Title:</strong> {formData.title}</div>
              <div><strong>Class:</strong> {formData.classDept}</div>
              <div><strong>Duration:</strong> {formData.durationMinutes} Minutes</div>
              <div><strong>Full-screen Mode:</strong> {formData.requireFullscreen ? 'Required' : 'Optional'}</div>
              <div><strong>AI Phone Detection:</strong> Enabled (YOLOv8 Model)</div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 9 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-md"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Publish Proctored Exam</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
