import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import {
  ShieldCheck,
  Camera,
  Mic,
  Wifi,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  X,
  UserCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { SystemReadinessReport } from '../../types';

interface SystemReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (report: SystemReadinessReport) => void;
  studentName?: string;
  studentPhoto?: string;
  admissionNo?: string;
}

export const SystemReadinessModal: React.FC<SystemReadinessModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  studentName = 'Aarav Sharma',
  studentPhoto = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  admissionNo = 'ADM-2024-001',
}) => {
  const { addToast } = useExam();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [idVerified, setIdVerified] = useState<boolean>(false);
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);

  // Diagnostic states
  const [diagnostics, setDiagnostics] = useState<{
    camera: 'pending' | 'testing' | 'pass' | 'fail';
    mic: 'pending' | 'testing' | 'pass' | 'fail';
    network: 'pending' | 'testing' | 'pass' | 'fail';
    browser: 'pending' | 'testing' | 'pass' | 'fail';
    identity: 'pending' | 'testing' | 'pass' | 'fail';
  }>({
    camera: 'pending',
    mic: 'pending',
    network: 'pending',
    browser: 'pending',
    identity: 'pending',
  });

  const [latencyMs, setLatencyMs] = useState<number>(24);

  useEffect(() => {
    if (isOpen) {
      runAutomatedDiagnostics();
    }
  }, [isOpen]);

  const runAutomatedDiagnostics = () => {
    setIsScanning(true);
    setDiagnostics({
      camera: 'testing',
      mic: 'testing',
      network: 'testing',
      browser: 'testing',
      identity: 'pending',
    });

    // Simulate diagnostic check sequence
    setTimeout(() => {
      setDiagnostics((prev) => ({
        ...prev,
        camera: 'pass',
        mic: 'pass',
        browser: 'pass',
        network: 'pass',
      }));
      setIsScanning(false);
      setLatencyMs(Math.floor(18 + Math.random() * 15));
    }, 1500);
  };

  const handleVerifyIdentity = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIdVerified(true);
      setDiagnostics((prev) => ({ ...prev, identity: 'pass' }));
      setIsScanning(false);
      addToast('Identity Verified', 'Face snapshot matched with registered student ID', 'success');
    }, 1200);
  };

  const handleStartExamLaunch = () => {
    if (!consentAgreed) {
      addToast('Consent Required', 'Please accept the examination rules & proctoring terms', 'warning');
      return;
    }

    const report: SystemReadinessReport = {
      cameraDetected: true,
      cameraPermissionGranted: true,
      faceDetected: true,
      micDetected: true,
      micPermissionGranted: true,
      audioInputActive: true,
      networkConnectivity: 'stable',
      latencyMs: latencyMs,
      browserSupported: true,
      browserNameVersion: 'Chrome 128.0 (Supported)',
      screenSizeValid: true,
      fullScreenSupported: true,
      idPhotoVerified: idVerified,
      readinessTimestamp: new Date().toISOString(),
      isReady: true,
    };

    onComplete(report);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 rounded-2xl border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">System Readiness & Identity Verification</h3>
              <p className="text-xs text-blue-200">
                PRD Sec 22 & 23 • Pre-Exam Diagnostic & Biometric Match for {studentName} ({admissionNo})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
            {[
              { num: 1, label: 'Camera' },
              { num: 2, label: 'Microphone' },
              { num: 3, label: 'Network' },
              { num: 4, label: 'Browser' },
              { num: 5, label: 'Identity & Launch' },
            ].map((st) => (
              <div
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`p-2 rounded-xl cursor-pointer transition-all border ${
                  activeStep === st.num
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span>Step {st.num}: {st.label}</span>
              </div>
            ))}
          </div>

          {/* Diagnostic Check Summary Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> 5-Point Hardware Diagnostics (PRD Sec 22)
              </h4>
              <button
                onClick={runAutomatedDiagnostics}
                disabled={isScanning}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Re-test Hardware</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* 1. Camera */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Webcam & Camera Feed</span>
                    <span className="text-[10px] text-slate-500">Permission & Face Detection</span>
                  </div>
                </div>
                {diagnostics.camera === 'pass' ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded animate-pulse">
                    TESTING...
                  </span>
                )}
              </div>

              {/* 2. Microphone */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Microphone & Audio</span>
                    <span className="text-[10px] text-slate-500">Voice Activity & Level</span>
                  </div>
                </div>
                {diagnostics.mic === 'pass' ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded animate-pulse">
                    TESTING...
                  </span>
                )}
              </div>

              {/* 3. Network */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Network Latency</span>
                    <span className="text-[10px] text-slate-500">{latencyMs}ms Latency • Stable Connection</span>
                  </div>
                </div>
                {diagnostics.network === 'pass' ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> STABLE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded animate-pulse">
                    TESTING...
                  </span>
                )}
              </div>

              {/* 4. Browser */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Monitor className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Browser & Screen Mode</span>
                    <span className="text-[10px] text-slate-500">Chrome 128 • Fullscreen Capable</span>
                  </div>
                </div>
                {diagnostics.browser === 'pass' ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded animate-pulse">
                    TESTING...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Identity Verification Step (PRD Sec 23) */}
          <div className="p-5 bg-gradient-to-br from-blue-50/60 to-purple-50/60 rounded-2xl border border-blue-200 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" /> Identity Verification & Photo Match (PRD Sec 23)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Official Photo */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Registered Student Photo</span>
                <img
                  src={studentPhoto}
                  alt={studentName}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-blue-500 shadow-sm"
                />
                <span className="font-bold text-slate-800 block">{studentName} ({admissionNo})</span>
              </div>

              {/* Live Webcam Snapshot Match */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Live Webcam Match</span>
                  <div className="w-24 h-24 bg-slate-900 rounded-full mx-auto flex items-center justify-center border-2 border-dashed border-slate-400 my-1 overflow-hidden relative">
                    <Camera className="w-8 h-8 text-slate-400" />
                    {idVerified && (
                      <div className="absolute inset-0 bg-emerald-900/80 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleVerifyIdentity}
                  disabled={idVerified || isScanning}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                    idVerified
                      ? 'bg-emerald-100 text-emerald-800 cursor-default font-black'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {idVerified ? '✓ Identity Match Verified' : 'Scan & Verify Student Photo'}
                </button>
              </div>
            </div>

            {/* Honor Code & Consent Checkbox */}
            <div className="pt-2 border-t border-blue-200/60">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I confirm that I am <strong>{studentName}</strong> ({admissionNo}). I agree to adhere to the institution's examination integrity policies and accept continuous AI proctoring, webcam, and browser monitoring during this exam session.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all"
          >
            Cancel & Exit
          </button>

          <button
            onClick={handleStartExamLaunch}
            disabled={!consentAgreed || !idVerified}
            className={`px-6 py-2.5 text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-md ${
              consentAgreed && idVerified
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Unlock Question Paper & Launch Exam</span>
          </button>
        </div>
      </div>
    </div>
  );
};
