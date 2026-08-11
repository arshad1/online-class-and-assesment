import React, { useState, useMemo } from 'react';
import { useExam } from '../context/ExamContext';
import { EvaluationDashboardItem } from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Search,
  Eye,
  Send,
  Download,
  Printer,
  FileSpreadsheet,
  BarChart2,
  PieChart,
  X,
  Lock,
  Unlock,
  ArrowRight,
  Play,
  Clock,
  Users,
  Sparkles,
  Shield,
  Bell,
  Mail,
  Smartphone,
  CheckSquare,
  RotateCcw,
  CalendarCheck,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from 'recharts';

// -----------------------------------------------------------------
// Types
// -----------------------------------------------------------------
type PublishPhase = 'draft' | 'blocked' | 'confirming' | 'published';

// -----------------------------------------------------------------
// State Stepper Component
// -----------------------------------------------------------------
const PublishStepper: React.FC<{ phase: PublishPhase }> = ({ phase }) => {
  const steps = [
    { key: 'draft', label: 'Draft Result', icon: Lock },
    { key: 'confirming', label: 'Confirmation', icon: Shield },
    { key: 'published', label: 'Published', icon: CheckCircle2 },
  ];

  const activeIndex = phase === 'blocked' ? 0 : phase === 'draft' ? 0 : phase === 'confirming' ? 1 : 2;

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isDone = idx < activeIndex;
        const isActive = idx === activeIndex;
        return (
          <React.Fragment key={step.key}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              isDone
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                : isActive
                ? 'text-blue-700 bg-blue-50 border border-blue-200 shadow-sm'
                : 'text-slate-400 bg-slate-50 border border-slate-200'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black ${
                isDone ? 'bg-emerald-500' : isActive ? 'bg-blue-600' : 'bg-slate-300'
              }`}>
                {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              </div>
              <span className="text-xs font-bold">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight className={`w-4 h-4 mx-1 flex-shrink-0 ${isDone ? 'text-emerald-400' : 'text-slate-300'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------------
// Publish Blocked Modal
// -----------------------------------------------------------------
const PublishBlockedModal: React.FC<{
  blockedItems: EvaluationDashboardItem[];
  onClose: () => void;
  onPublishEvaluated: () => void;
  onGoEvaluate: () => void;
}> = ({ blockedItems, onClose, onPublishEvaluated, onGoEvaluate }) => (
  <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl border border-red-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold">Publication Blocked</h2>
            <p className="text-xs text-red-200">Unevaluated submissions detected</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Alert Body */}
      <div className="p-5 space-y-4">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950">
            <p className="font-extrabold text-sm">
              {blockedItems.length} of the student answer sheet{blockedItems.length !== 1 ? 's are' : ' is'} still unevaluated.
            </p>
            <p className="mt-1 leading-relaxed text-amber-800">
              Publishing with unevaluated submissions will result in incomplete or zero marks for those students. Complete evaluations or choose to publish only evaluated candidates.
            </p>
          </div>
        </div>

        {/* Pending Candidates List */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Pending Answer Sheets ({blockedItems.length}):</p>
          {blockedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <img src={item.avatar} alt={item.studentName} className="w-7 h-7 rounded-full border border-slate-300 object-cover" />
                <div>
                  <p className="font-bold text-xs text-slate-900">{item.studentName}</p>
                  <span className="text-[10px] text-slate-500 font-mono">Roll: {item.rollNo}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                item.evaluationStatus === 'Not Started'
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {item.evaluationStatus}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onGoEvaluate}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Go Evaluate Now</span>
          </button>
          <button
            onClick={onPublishEvaluated}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Evaluated Only</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// -----------------------------------------------------------------
// Confirmation Modal
// -----------------------------------------------------------------
const PublishConfirmationModalInline: React.FC<{
  examTitle: string;
  totalCandidates: number;
  passCount: number;
  failCount: number;
  onCancel: () => void;
  onConfirm: (opts: { notifyApp: boolean; notifyEmail: boolean; notifyParent: boolean }) => void;
}> = ({ examTitle, totalCandidates, passCount, failCount, onCancel, onConfirm }) => {
  const [notifyApp, setNotifyApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyParent, setNotifyParent] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold">Confirm Publication</h2>
              <p className="text-xs text-slate-400">This action will release marks to students</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <p className="font-extrabold">Are you sure you want to publish results?</p>
              <p className="mt-1 leading-relaxed">
                Publishing will lock all scores and make official report cards <strong>immediately visible</strong> to all{' '}
                <strong>{totalCandidates} candidates</strong> of <strong>{examTitle}</strong> on their student portals.
              </p>
            </div>
          </div>

          {/* Candidate Summary */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="font-black text-xl text-slate-900">{totalCandidates}</p>
              <span className="font-bold text-slate-500 text-[10px] uppercase">Total</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="font-black text-xl text-emerald-900">{passCount}</p>
              <span className="font-bold text-emerald-700 text-[10px] uppercase">Passed</span>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
              <p className="font-black text-xl text-red-900">{failCount}</p>
              <span className="font-bold text-red-700 text-[10px] uppercase">Failed</span>
            </div>
          </div>

          {/* Notification Channels */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Notification Channels</label>
            {[
              { key: 'app', label: 'Student App Push Notification', icon: Bell, state: notifyApp, set: setNotifyApp, color: 'text-blue-600' },
              { key: 'email', label: 'Student Email Notification', icon: Mail, state: notifyEmail, set: setNotifyEmail, color: 'text-blue-600' },
              { key: 'parent', label: 'Parent SMS / Email (Optional)', icon: Smartphone, state: notifyParent, set: setNotifyParent, color: 'text-purple-600' },
            ].map((ch) => {
              const ChIcon = ch.icon;
              return (
                <label key={ch.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                    <ChIcon className={`w-4 h-4 ${ch.color}`} />
                    <span>{ch.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={ch.state}
                    onChange={(e) => ch.set(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onCancel} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ notifyApp, notifyEmail, notifyParent })}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Publish Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// Successful Publication Banner
// -----------------------------------------------------------------
const PublishedSuccessBanner: React.FC<{
  examTitle: string;
  publishedAt: string;
  totalCandidates: number;
  passCount: number;
  failCount: number;
  notifyChannels: string[];
  onRecall: () => void;
  onViewDashboard: () => void;
}> = ({ examTitle, publishedAt, totalCandidates, passCount, failCount, notifyChannels, onRecall, onViewDashboard }) => (
  <div className="space-y-4">
    {/* Celebration Banner */}
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-xl shadow-emerald-500/20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

      <div className="relative flex items-start gap-4">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/40 rounded-full border border-emerald-400/40">
              Publication Successful
            </span>
          </div>
          <h2 className="text-xl font-extrabold leading-tight">Results Published!</h2>
          <p className="text-emerald-100 text-sm mt-1">
            Official report cards for <strong>{examTitle}</strong> are now live on student portals.
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-200">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span className="font-semibold">Published on {publishedAt}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative mt-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Candidates Notified', value: totalCandidates, color: 'bg-white/20' },
          { label: 'Passed', value: passCount, color: 'bg-emerald-400/30' },
          { label: 'Failed', value: failCount, color: 'bg-red-400/30' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} backdrop-blur-sm rounded-xl px-3 py-2.5 text-center border border-white/10`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Notification delivery summary */}
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
      <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
        <Bell className="w-4 h-4 text-blue-600" />
        Notification Delivery Summary
      </p>
      <div className="flex flex-wrap gap-2">
        {notifyChannels.length === 0 ? (
          <span className="text-xs text-slate-400 italic">No notification channels selected.</span>
        ) : (
          notifyChannels.map((ch) => (
            <span key={ch} className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {ch}
            </span>
          ))
        )}
      </div>
    </div>

    {/* Actions row */}
    <div className="flex items-center gap-3">
      <button
        onClick={onViewDashboard}
        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        <ChevronRight className="w-4 h-4" />
        View Evaluation Dashboard
      </button>
      <button
        onClick={onRecall}
        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-2 transition-all"
      >
        <RotateCcw className="w-4 h-4 text-slate-500" />
        Recall / Unpublish
      </button>
    </div>
  </div>
);

// -----------------------------------------------------------------
// Main View
// -----------------------------------------------------------------
export const PublishResultsView: React.FC = () => {
  const {
    studentSubmissions,
    resultSettings,
    updateResultSettings,
    addToast,
    scheduledExams,
    selectedExamId,
    setSelectedExamId,
    evaluationDashboardItems,
    publishExamResults,
    unpublishExamResults,
    checkExamPublishBlocked,
    setActiveTab,
  } = useExam();

  const [searchTerm, setSearchTerm] = useState('');
  const [phase, setPhase] = useState<PublishPhase>('draft');
  const [blockedItems, setBlockedItems] = useState<EvaluationDashboardItem[]>([]);
  const [publishedAt, setPublishedAt] = useState('');
  const [notifyChannels, setNotifyChannels] = useState<string[]>([]);

  const currentExam = scheduledExams.find((e) => e.id === selectedExamId) || scheduledExams[0];
  const examTitle = currentExam?.title || 'Grade 10 Mathematics Midterm 2026';

  // Derive publish state from context (sync with dashboard)
  const publishedCount = evaluationDashboardItems.filter(
    (i) => i.evaluationStatus === 'Published' && (i.examId === selectedExamId || !selectedExamId)
  ).length;
  const totalEvalItems = evaluationDashboardItems.filter(
    (i) => i.examId === selectedExamId || !selectedExamId
  ).length;
  const isFullyPublished = totalEvalItems > 0 && publishedCount === totalEvalItems;

  // Derived stats from submissions
  const allSubmissions = studentSubmissions;
  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((sub) => {
      const matchesSearch =
        sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.rollNo.includes(searchTerm);
      return matchesSearch;
    });
  }, [allSubmissions, searchTerm]);

  const totalStudents = Math.max(allSubmissions.length, 45);
  const passedCount = allSubmissions.filter((s) => s.resultStatus === 'pass').length + 34;
  const failedCount = allSubmissions.filter((s) => s.resultStatus === 'fail').length + 3;
  const avgMarks = 76.8;

  // Charts data
  const gradeDistributionData = [
    { grade: 'A+', count: 8, color: '#10b981' },
    { grade: 'A', count: 14, color: '#06b6d4' },
    { grade: 'B+', count: 12, color: '#3b82f6' },
    { grade: 'B', count: 5, color: '#6366f1' },
    { grade: 'C', count: 2, color: '#f59e0b' },
    { grade: 'F', count: 3, color: '#ef4444' },
  ];

  const passFailData = [
    { name: 'Passed', value: passedCount, color: '#10b981' },
    { name: 'Failed', value: failedCount, color: '#ef4444' },
  ];

  // -----------------------------------------------------------------
  // Action handlers
  // -----------------------------------------------------------------
  const handleTriggerPublish = () => {
    const pending = checkExamPublishBlocked(selectedExamId);
    if (pending.length > 0) {
      setBlockedItems(pending);
      setPhase('blocked');
    } else {
      setPhase('confirming');
    }
  };

  const handleConfirmPublish = (opts: { notifyApp: boolean; notifyEmail: boolean; notifyParent: boolean }) => {
    publishExamResults(selectedExamId, opts);

    const channels = [];
    if (opts.notifyApp) channels.push('Student App Push Notification');
    if (opts.notifyEmail) channels.push('Student Email Notification');
    if (opts.notifyParent) channels.push('Parent SMS / Email');

    const now = new Date();
    const publishTimestamp = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setPublishedAt(publishTimestamp);
    setNotifyChannels(channels);
    setPhase('published');
  };

  const handlePublishEvaluatedOnly = () => {
    setBlockedItems([]);
    setPhase('confirming');
  };

  const handleRecall = () => {
    unpublishExamResults(selectedExamId);
    setPhase('draft');
    setPublishedAt('');
    setNotifyChannels([]);
  };

  const handleExportExcel = () => {
    const csvHeader = 'Roll No,Student Name,Class,Section,Objective Marks,Subjective Marks,Total Marks,Percentage,Grade,Result Status,Publish Status\n';
    const csvRows = allSubmissions
      .map(
        (s) =>
          `"${s.rollNo}","${s.studentName}","${s.class}","${s.section}",${s.objectiveMarks},${s.subjectiveMarks},${s.totalMarks},${s.percentage}%,"${s.grade}","${s.resultStatus}","${s.publishStatus}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Result_Sheet_${examTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Excel Sheet Downloaded', 'Result spreadsheet generated successfully.', 'success');
  };

  // Determine effective display phase (sync with published state if all published)
  const displayPhase = isFullyPublished && phase === 'draft' ? 'published' : phase;

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto font-sans">

      {/* ── TOP HEADER ROW ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/25">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Publish Results</h1>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                PRD Sec 30
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dedicated result publication console · marks hidden from students until published
            </p>
          </div>
        </div>

        {/* State Stepper */}
        <PublishStepper phase={displayPhase} />
      </div>

      {/* ── PUBLISHED SUCCESS VIEW ─────────────────────────────────── */}
      {displayPhase === 'published' && (
        <PublishedSuccessBanner
          examTitle={examTitle}
          publishedAt={publishedAt || 'Previously Published'}
          totalCandidates={totalStudents}
          passCount={passedCount}
          failCount={failedCount}
          notifyChannels={notifyChannels}
          onRecall={handleRecall}
          onViewDashboard={() => setActiveTab('evaluation-dashboard')}
        />
      )}

      {/* ── DRAFT / BLOCKED VIEW ──────────────────────────────────── */}
      {(displayPhase === 'draft' || displayPhase === 'blocked') && (
        <>
          {/* Student Mark Masking Notice */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 shadow-xs">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 flex-1">
              <p className="font-extrabold text-sm">Results are in Draft — Marks Hidden from Students</p>
              <p className="mt-1 leading-relaxed">
                Evaluated marks, percentages, grades, and official report cards are currently{' '}
                <strong>not visible</strong> to students or parents on their portals. Click{' '}
                <strong>"Publish Results"</strong> below to officially release them.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTriggerPublish}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Unlock className="w-4 h-4" />
                <span>Publish Results</span>
              </button>
            </div>
          </div>

          {/* ── Summary KPI Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Students', value: totalStudents, color: 'border-slate-200', text: 'text-slate-900', bg: '' },
              { label: 'Passed', value: passedCount, color: 'border-emerald-200', text: 'text-emerald-900', bg: 'bg-emerald-50/30' },
              { label: 'Failed', value: failedCount, color: 'border-red-200', text: 'text-red-900', bg: 'bg-red-50/30' },
              { label: 'Absent', value: 0, color: 'border-slate-200', text: 'text-slate-700', bg: '' },
              { label: 'Average Marks', value: `${avgMarks}%`, color: 'border-blue-200', text: 'text-blue-950', bg: 'bg-blue-50/20' },
              { label: 'Highest Score', value: '98 / 100', color: 'border-amber-200', text: 'text-amber-950', bg: 'bg-amber-50/20' },
            ].map((card) => (
              <div key={card.label} className={`p-3.5 bg-white rounded-xl border shadow-xs ${card.color} ${card.bg}`}>
                <span className={`text-[10px] font-bold uppercase block ${card.color.includes('emerald') ? 'text-emerald-800' : card.color.includes('red') ? 'text-red-800' : card.color.includes('blue') ? 'text-blue-900' : card.color.includes('amber') ? 'text-amber-900' : 'text-slate-500'}`}>
                  {card.label}
                </span>
                <p className={`text-xl font-black mt-1 ${card.text}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* ── Analytics Charts ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Grade Distribution */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  Score &amp; Grade Band Distribution
                </h3>
                <span className="text-[11px] text-slate-500">Pass Cutoff: {resultSettings.passingPercentage}%</span>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pass/Fail + Export */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  Pass / Fail Ratio
                </h3>
                <span className="text-[11px] font-bold text-emerald-700">
                  {Math.round((passedCount / totalStudents) * 100)}% Pass Rate
                </span>
              </div>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={passFailData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} paddingAngle={4} dataKey="value">
                      {passFailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Export &amp; Download</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportExcel}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Partial Evaluation Warning Bar ───────────────────── */}
          {(() => {
            const pending = evaluationDashboardItems.filter(
              (i) => (i.evaluationStatus === 'Not Started' || i.evaluationStatus === 'In Progress') &&
                (i.examId === selectedExamId || !selectedExamId)
            );
            if (pending.length === 0) return null;
            return (
              <div className="p-4 bg-red-50 border border-red-300 rounded-2xl flex items-center gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div className="flex-1 text-xs">
                  <p className="font-extrabold text-red-900">
                    Partial Evaluations Remaining — {pending.length} Answer Sheet{pending.length !== 1 ? 's' : ''} Unevaluated
                  </p>
                  <p className="text-red-700 mt-0.5">
                    Publishing now will block or result in zero marks for unevaluated students.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('evaluation-dashboard')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Complete Evaluations
                </button>
              </div>
            );
          })()}

          {/* ── Candidate Result Roster ───────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Candidate Result Roster</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-700 rounded-full">
                  {filteredSubmissions.length} Candidates
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Draft — Hidden from Students
                </span>
              </div>
              <div className="relative w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidate..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Marks</th>
                    <th className="p-3.5">Max</th>
                    <th className="p-3.5">%</th>
                    <th className="p-3.5">Grade</th>
                    <th className="p-3.5">Result</th>
                    <th className="p-3.5">Publish Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={sub.avatar} alt={sub.studentName} className="w-8 h-8 rounded-full border border-slate-300 object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{sub.studentName}</p>
                            <span className="text-[10px] text-slate-500 font-mono">Roll: {sub.rollNo} · {sub.section}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-extrabold text-blue-900">{sub.totalMarks}</td>
                      <td className="p-3.5 font-semibold text-slate-600">{sub.maxMarks}</td>
                      <td className="p-3.5 font-black text-slate-900">{sub.percentage}%</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 font-bold rounded bg-slate-100 text-slate-800">{sub.grade}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase inline-block ${
                          sub.resultStatus === 'pass'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {sub.resultStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase inline-block flex items-center gap-1 ${
                          sub.publishStatus === 'published'
                            ? 'bg-emerald-500 text-white'
                            : sub.publishStatus === 'ready'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {sub.publishStatus === 'draft' && <Lock className="w-2.5 h-2.5" />}
                          {sub.publishStatus === 'published' && <Unlock className="w-2.5 h-2.5" />}
                          {sub.publishStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => addToast('Report Card Preview', `Viewing report for ${sub.studentName}`, 'info')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Bottom Publish Action Bar ─────────────────────────── */}
          <div className="sticky bottom-4 flex items-center justify-center">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl px-6 py-3.5 flex items-center gap-6">
              <div className="text-xs text-slate-600">
                <span className="font-black text-slate-900 text-sm">{totalStudents}</span> candidates ready ·{' '}
                <span className="font-black text-emerald-700">{passedCount}</span> pass ·{' '}
                <span className="font-black text-red-700">{failedCount}</span> fail
              </div>
              <button
                onClick={handleTriggerPublish}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                Publish Results to All Students
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── MODALS ─────────────────────────────────────────────────── */}
      {phase === 'blocked' && (
        <PublishBlockedModal
          blockedItems={blockedItems}
          onClose={() => setPhase('draft')}
          onPublishEvaluated={handlePublishEvaluatedOnly}
          onGoEvaluate={() => { setPhase('draft'); setActiveTab('evaluation-dashboard'); }}
        />
      )}

      {phase === 'confirming' && (
        <PublishConfirmationModalInline
          examTitle={examTitle}
          totalCandidates={totalStudents}
          passCount={passedCount}
          failCount={failedCount}
          onCancel={() => setPhase('draft')}
          onConfirm={handleConfirmPublish}
        />
      )}
    </div>
  );
};
