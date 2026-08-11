import React, { useState } from 'react';
import {
  Camera,
  Mic,
  Monitor,
  Wifi,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';

export const StudentExamView: React.FC = () => {
  const { setActiveTab, addToast } = useExam();

  const [phase, setPhase] = useState<'check' | 'active'>('check');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({ 1: 'B', 2: 'A' });
  const [activeWarningModal, setActiveWarningModal] = useState<string | null>(null);

  // System Checks state
  const [checks, setChecks] = useState({
    camera: true,
    mic: true,
    browser: true,
    network: true,
    screenShare: true,
    fullscreen: true,
    consent: true,
  });

  const questions = [
    {
      id: 1,
      text: 'A wire carrying a 5.0 A current is placed perpendicular to a uniform magnetic field of 0.40 T. What is the magnetic force per unit meter acting on the wire?',
      options: [
        { id: 'A', text: '1.2 N/m' },
        { id: 'B', text: '2.0 N/m' },
        { id: 'C', text: '4.5 N/m' },
        { id: 'D', text: '0.8 N/m' },
      ],
    },
    {
      id: 2,
      text: 'In a series RLC circuit at resonance, what is the relationship between the inductive reactance (X_L) and capacitive reactance (X_C)?',
      options: [
        { id: 'A', text: 'X_L = X_C (Impedance is purely resistive)' },
        { id: 'B', text: 'X_L > X_C' },
        { id: 'C', text: 'X_C > X_L' },
        { id: 'D', text: 'X_L + X_C = 0' },
      ],
    },
    {
      id: 3,
      text: 'According to Faraday’s law of induction, the induced electromotive force (EMF) in a closed circuit is directly proportional to:',
      options: [
        { id: 'A', text: 'The magnetic flux density' },
        { id: 'B', text: 'The electric current magnitude' },
        { id: 'C', text: 'The time rate of change of magnetic flux' },
        { id: 'D', text: 'The total surface area' },
      ],
    },
  ];

  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: optionId }));
  };

  const handleStartExam = () => {
    if (!checks.consent) {
      addToast('Consent Required', 'Please accept the proctoring privacy consent to begin.', 'warning');
      return;
    }
    setPhase('active');
    addToast('Exam Session Started', 'Good luck! Full-screen proctoring lock is active.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Top Banner to Exit Back to Proctor Dashboard */}
      <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span className="font-bold text-blue-300">STUDENT EXAM PORTAL PREVIEW</span>
        </div>

        {/* Modal Simulation Trigger Buttons */}
        {phase === 'active' && (
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 mr-1">Simulate Warnings:</span>
            <button
              onClick={() => setActiveWarningModal('fullscreen')}
              className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-500/30"
            >
              Fullscreen Exit
            </button>
            <button
              onClick={() => setActiveWarningModal('noface')}
              className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded hover:bg-red-500/30"
            >
              No Face
            </button>
            <button
              onClick={() => setActiveWarningModal('phone')}
              className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded hover:bg-red-500/30"
            >
              Phone Detected
            </button>
          </div>
        )}

        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Proctor Dashboard</span>
        </button>
      </div>

      {/* PHASE 1: PRE-EXAM SYSTEM CHECKS */}
      {phase === 'check' && (
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6 flex flex-col justify-center">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
            <div className="text-center space-y-2 border-b border-slate-100 pb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">System Compatibility & Identity Pre-Check</h1>
              <p className="text-xs text-slate-500">
                Grade 12 Physics Assessment &bull; Duration: 120 Minutes &bull; 30 Questions
              </p>
            </div>

            {/* Live Camera & Positioning Guide Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative bg-slate-950 aspect-video rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                  alt="Candidate webcam check"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-6 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    FACE POSITIONED CORRECTLY
                  </span>
                </div>
              </div>

              {/* Hardware Checks Checklist */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider mb-2">
                  System Diagnostics
                </h3>

                {[
                  { label: 'Webcam Stream (1080p HD)', ok: checks.camera, icon: Camera },
                  { label: 'Microphone Audio Level', ok: checks.mic, icon: Mic },
                  { label: 'Browser Lock (Chrome 127)', ok: checks.browser, icon: Lock },
                  { label: 'Network Latency (14 ms - 48 Mbps)', ok: checks.network, icon: Wifi },
                  { label: 'Desktop Screen Sharing Stream', ok: checks.screenShare, icon: Monitor },
                  { label: 'OS Full-Screen Compliance', ok: checks.fullscreen, icon: Maximize2 },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      PASSED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Consent Agreement */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-800">Privacy & AI Proctoring Consent</h4>
              <p className="text-[11px] leading-relaxed">
                By starting this examination, you consent to real-time webcam face verification, microphone audio sampling, and full-screen browser tracking. AI flags are indicators evaluated by human proctors.
              </p>
              <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={checks.consent}
                  onChange={(e) => setChecks({ ...checks, consent: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>I understand and agree to the exam integrity policies.</span>
              </label>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Begin Active Exam Session</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: ACTIVE CANDIDATE EXAM INTERFACE */}
      {phase === 'active' && (
        <div className="flex-1 flex flex-col">
          {/* Active Exam Header Bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-20">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Grade 12 Physics Assessment</h2>
              <p className="text-xs text-slate-500">Candidate: Neha Suresh (2026-PHY-029)</p>
            </div>

            {/* Live Monitoring Status Pill */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Camera Active
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Mic Active
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Screen Shared
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Fullscreen Locked
              </span>
            </div>

            {/* Timer & Submit Button */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>01:45:12</span>
              </div>
              <button
                onClick={() => {
                  addToast('Exam Submitted', 'Your responses have been recorded securely.', 'success');
                  setPhase('check');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Main Question & Answer Body */}
          <div className="flex-1 p-6 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Question Card (8 Cols) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-blue-600">Question {currentQuestion} of 30</span>
                  <span className="text-xs text-slate-400">Single Choice &bull; 4 Points</span>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {questions[currentQuestion - 1]?.text}
                </p>

                {/* Option Choice List */}
                <div className="space-y-2.5 pt-2">
                  {questions[currentQuestion - 1]?.options.map((opt) => {
                    const isSelected = selectedAnswers[currentQuestion] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectAnswer(opt.id)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                            : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next Question Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentQuestion((q) => Math.max(1, q - 1))}
                  disabled={currentQuestion === 1}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentQuestion((q) => Math.min(3, q + 1))}
                  disabled={currentQuestion === 3}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Question Palette (4 Cols) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Question Palette Navigation
              </h3>
              <div className="grid grid-cols-5 gap-2 text-xs">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const qNum = idx + 1;
                  const isAnswered = selectedAnswers[qNum] !== undefined;
                  const isCurrent = qNum === currentQuestion;

                  return (
                    <button
                      key={qNum}
                      onClick={() => setCurrentQuestion(Math.min(3, qNum))}
                      className={`p-2.5 rounded-lg font-bold transition-all text-xs ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-xs'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {qNum}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MALPRACTICE WARNING MODAL POPUP SIMULATION */}
      {activeWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {activeWarningModal === 'fullscreen' && 'Full-Screen Mode Exited'}
                {activeWarningModal === 'noface' && 'Candidate Face Not Visible'}
                {activeWarningModal === 'phone' && 'Unauthorized Device Flagged'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeWarningModal === 'fullscreen' &&
                  'You have exited full-screen mode. Repeated window focus loss will flag your session for manual proctor review.'}
                {activeWarningModal === 'noface' &&
                  'Your face is no longer visible in the webcam stream. Please adjust your positioning and camera angle.'}
                {activeWarningModal === 'phone' &&
                  'Our AI computer vision system has detected a smartphone held near your workspace. Please remove all secondary devices immediately.'}
              </p>
            </div>

            <button
              onClick={() => setActiveWarningModal(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              I Understand & Resume Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
