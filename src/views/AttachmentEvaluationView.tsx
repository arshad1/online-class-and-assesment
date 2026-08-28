import React, { useState, useRef } from 'react';
import { useExam } from '../context/ExamContext';
import { AnnotationToolType } from '../types';
import {
  Paperclip,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  MessageSquare,
  Highlighter,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Award,
  BookOpen,
  Building2,
  Clock,
  Save,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

export const AttachmentEvaluationView: React.FC = () => {
  const {
    attachmentRecords,
    activeAttachmentIndex,
    updateAttachmentMarksAndRemarks,
    addVisualAnnotationMark,
    clearVisualAnnotations,
    navigateAttachmentRecord,
    setActiveTab,
  } = useExam();

  const currentRecord = attachmentRecords[activeAttachmentIndex] || attachmentRecords[0];

  // Visual Annotation Tool State
  const [activeTool, setActiveTool] = useState<AnnotationToolType>('checkmark');
  const [commentInputText, setCommentInputText] = useState<string>('');

  // Canvas Viewport Controls State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Local Marks & Remarks State
  const [localMarks, setLocalMarks] = useState<number>(currentRecord?.awardedMarks || 0);
  const [localRemarks, setLocalRemarks] = useState<string>(currentRecord?.teacherRemarks || '');

  // Canvas Element Ref for position calculation
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync state when record changes
  React.useEffect(() => {
    if (currentRecord) {
      setLocalMarks(currentRecord.awardedMarks);
      setLocalRemarks(currentRecord.teacherRemarks);
      setCurrentPage(1);
      setZoomLevel(100);
      setRotation(0);
    }
  }, [activeAttachmentIndex, currentRecord]);

  if (!currentRecord) {
    return <div className="p-6 text-slate-500">No attachment evaluation records found.</div>;
  }

  // Handle Canvas Click to Place Annotation
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = Math.round((x / rect.width) * 100);
    const yPct = Math.round((y / rect.height) * 100);

    addVisualAnnotationMark(currentRecord.id, {
      type: activeTool,
      xPct,
      yPct,
      pageNumber: currentPage,
      commentText: activeTool === 'comment' ? commentInputText || 'Visual comment note' : undefined,
    });
  };

  const handleMarksChange = (val: number) => {
    const valid = Math.min(Math.max(0, val), currentRecord.maxMarks);
    setLocalMarks(valid);
    updateAttachmentMarksAndRemarks(currentRecord.id, valid, localRemarks);
  };

  const handleRemarksChange = (text: string) => {
    setLocalRemarks(text);
    updateAttachmentMarksAndRemarks(currentRecord.id, localMarks, text);
  };

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full font-sans">
      {/* Top Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('evaluation-dashboard')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Return to Evaluation Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Attachment Evaluation
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-purple-100 text-purple-800 border border-purple-200">
                  PRD Sec 28
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual Canvas Annotation, Download Enforcement & Attachment Review Workspace
              </p>
            </div>
          </div>

          {/* Download Permission & Save Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Download Security Policy Badge */}
            {currentRecord.downloadPermitted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Download Permitted
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300"
                title={currentRecord.downloadRestrictionReason}
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Download Restricted
              </span>
            )}

            {/* Download Button */}
            {currentRecord.downloadPermitted ? (
              <a
                href={currentRecord.fileInfo.fileUrl}
                download
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Attachment</span>
              </a>
            ) : (
              <button
                disabled
                className="px-3.5 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
                title={currentRecord.downloadRestrictionReason}
              >
                <Download className="w-4 h-4" />
                <span>Download Disabled</span>
              </button>
            )}
          </div>
        </div>

        {/* Candidate & Attempt Context Bar */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentRecord.avatar}
              alt={currentRecord.studentName}
              className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">{currentRecord.studentName}</h3>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Roll: {currentRecord.rollNo}
                </span>
                <span className="text-xs text-slate-600 font-semibold">
                  {currentRecord.classDivisionLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                File Submission: <strong className="text-slate-800">{currentRecord.fileInfo.fileName}</strong> ({currentRecord.fileInfo.fileSize})
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-bold text-slate-900">{currentRecord.examName}</p>
            <p className="text-[11px] text-purple-600 font-mono font-semibold">{currentRecord.examCode}</p>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Grid: Left Interactive Visual Canvas + Right Evaluation Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Visual Attachment Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Annotation Stamps & Viewport Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Stamp Tools Selection */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Stamps:</span>
              <button
                onClick={() => setActiveTool('checkmark')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  activeTool === 'checkmark'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Check (✓)</span>
              </button>

              <button
                onClick={() => setActiveTool('cross')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  activeTool === 'cross'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cross (✗)</span>
              </button>

              <button
                onClick={() => setActiveTool('comment')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  activeTool === 'comment'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comment (💬)</span>
              </button>

              <button
                onClick={() => clearVisualAnnotations(currentRecord.id)}
                className="px-2 py-1.5 text-slate-500 hover:text-red-600 rounded-lg text-xs font-semibold"
                title="Clear all visual stamps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Viewport Controls: Zoom, Rotate, Page Navigator */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              {/* Zoom Out */}
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span>{zoomLevel}%</span>

              {/* Zoom In */}
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {/* Rotate */}
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 ml-1"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Page Navigator */}
              <div className="flex items-center gap-1 ml-2 bg-slate-100 px-2 py-1 rounded-lg">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>
                  Page {currentPage} of {currentRecord.fileInfo.pageCount}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(currentRecord.fileInfo.pageCount, p + 1))
                  }
                  disabled={currentPage === currentRecord.fileInfo.pageCount}
                  className="disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Document Visual Canvas */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner flex items-center justify-center overflow-auto min-h-[520px]">
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="relative bg-white shadow-2xl rounded-xl border border-slate-300 w-[580px] min-h-[680px] p-8 cursor-crosshair select-none transition-transform duration-150"
            >
              {/* Document Visual Content Mock */}
              <div className="space-y-6 text-slate-800 font-serif">
                {/* Header of Student Answer Sheet */}
                <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-center font-sans">
                  <div>
                    <h3 className="font-black text-sm uppercase text-slate-900">
                      Answer Sheet Attachment — Page {currentPage}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Candidate: {currentRecord.studentName} ({currentRecord.rollNo})
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Q{currentRecord.questionNumber} Answer Attachment
                  </span>
                </div>

                {/* Simulated Geometrical Diagram & Handwritten Steps */}
                {currentPage === 1 ? (
                  <div className="space-y-4 text-xs leading-relaxed font-mono">
                    <p className="font-bold text-slate-900 font-sans text-sm">
                      Question {currentRecord.questionNumber}: Proof of Thales Theorem
                    </p>

                    <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg text-center space-y-2">
                      <p className="text-[11px] text-slate-500 font-sans">
                        [ Handwritten Diagram: ΔABC with DE ∥ BC ]
                      </p>
                      <svg className="w-48 h-32 mx-auto stroke-slate-800 fill-none stroke-2">
                        <polygon points="96,10 20,110 172,110" />
                        <line x1="48" y1="70" x2="144" y2="70" strokeDasharray="3 3" />
                        <text x="96" y="8" fontSize="10" textAnchor="middle">
                          A
                        </text>
                        <text x="14" y="118" fontSize="10">
                          B
                        </text>
                        <text x="176" y="118" fontSize="10">
                          C
                        </text>
                        <text x="38" y="70" fontSize="10">
                          D
                        </text>
                        <text x="150" y="70" fontSize="10">
                          E
                        </text>
                      </svg>
                    </div>

                    <div className="space-y-2 text-slate-800">
                      <p>
                        <strong>Given:</strong> ΔABC where DE ∥ BC intersecting AB at D and AC at E.
                      </p>
                      <p>
                        <strong>To Prove:</strong> AD / DB = AE / EC.
                      </p>
                      <p>
                        <strong>Construction:</strong> Join BE and CD. Draw DM ⊥ AC and EN ⊥ AB.
                      </p>
                      <p>
                        <strong>Proof Steps:</strong>
                        <br />
                        Area(ΔADE) = (1/2) * AD * EN
                        <br />
                        Area(ΔBDE) = (1/2) * DB * EN
                        <br />
                        =&gt; Area(ΔADE) / Area(ΔBDE) = AD / DB -- (Equation 1)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs font-mono text-slate-800">
                    <p className="font-bold font-sans text-sm text-slate-900">
                      Page {currentPage} Continuation — Equations & Ratio Equivalence
                    </p>
                    <p>
                      Similarly, Area(ΔADE) / Area(ΔDEC) = AE / EC -- (Equation 2)
                    </p>
                    <p>
                      Note that ΔBDE and ΔDEC lie on the same base DE and between same parallels DE and BC.
                    </p>
                    <p>
                      =&gt; Area(ΔBDE) = Area(ΔDEC) -- (Equation 3)
                    </p>
                    <p className="font-extrabold text-purple-900 bg-purple-50 p-2 rounded border border-purple-200">
                      From (1), (2), and (3): AD / DB = AE / EC. Hence Proved Q.E.D.
                    </p>
                  </div>
                )}
              </div>

              {/* Render Visual Annotation Stamps Overlay */}
              {currentRecord.annotations
                .filter((ann) => ann.pageNumber === currentPage)
                .map((ann) => (
                  <div
                    key={ann.id}
                    style={{ left: `${ann.xPct}%`, top: `${ann.yPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    {ann.type === 'checkmark' && (
                      <div className="bg-emerald-500 text-white font-black text-sm w-7 h-7 rounded-full shadow-lg flex items-center justify-center border-2 border-white animate-in zoom-in duration-100">
                        ✓
                      </div>
                    )}
                    {ann.type === 'cross' && (
                      <div className="bg-red-500 text-white font-black text-sm w-7 h-7 rounded-full shadow-lg flex items-center justify-center border-2 border-white animate-in zoom-in duration-100">
                        ✗
                      </div>
                    )}
                    {ann.type === 'comment' && (
                      <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xl border-2 border-white text-xs max-w-xs space-y-0.5 animate-in zoom-in duration-100">
                        <div className="flex items-center gap-1 font-bold text-[10px] text-blue-200 border-b border-blue-400/50 pb-0.5">
                          <MessageSquare className="w-3 h-3" /> Teacher Note
                        </div>
                        <p className="font-semibold text-white">{ann.commentText || 'Note'}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Question Context & Evaluation Console (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Question Context Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
                Question {currentRecord.questionNumber} Context
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-900 text-white">
                Max {currentRecord.maxMarks} Marks
              </span>
            </div>

            <p className="text-xs font-bold text-slate-900 leading-relaxed">
              {currentRecord.questionText}
            </p>

            <div className="text-[11px] text-slate-500 font-medium pt-1">
              Section: <strong className="text-slate-800">{currentRecord.sectionName}</strong>
            </div>
          </div>

          {/* Teacher Evaluation Console */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Award className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Attachment Evaluation Entry
              </h3>
            </div>

            {/* Marks Awarded */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Marks Awarded:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={currentRecord.maxMarks}
                  value={localMarks}
                  onChange={(e) => handleMarksChange(Number(e.target.value))}
                  className="w-24 px-3 py-2 bg-slate-50 border-2 border-purple-600 rounded-xl text-lg font-black text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-600">
                  / {currentRecord.maxMarks} Max Marks
                </span>
              </div>
            </div>

            {/* Teacher Remarks */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Teacher Remarks & Attachment Feedback:
              </label>
              <textarea
                rows={3}
                value={localRemarks}
                onChange={(e) => handleRemarksChange(e.target.value)}
                placeholder="Enter feedback for student's file submission..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            {/* Rubrics Breakdown */}
            {currentRecord.rubrics && currentRecord.rubrics.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Rubric Scoring Criteria:
                </span>
                <div className="space-y-1.5">
                  {currentRecord.rubrics.map((r) => (
                    <div
                      key={r.id}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {r.criterion}
                      </span>
                      <span className="font-bold text-purple-700 shrink-0">
                        {r.awardedScore} / {r.maxScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Annotation Stamps Log */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Placed Visual Stamps ({currentRecord.annotations.length}):
              </span>
              {currentRecord.annotations.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">
                  Click on the document canvas on the left to place visual stamps.
                </p>
              ) : (
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {currentRecord.annotations.map((a, idx) => (
                    <div
                      key={a.id}
                      className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">
                          {a.type === 'checkmark' ? '✓ Checkmark' : a.type === 'cross' ? '✗ Cross' : '💬 Note'}
                        </span>
                        <span className="text-slate-400 font-mono">
                          ({a.xPct}%, {a.yPct}%)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">Page {a.pageNumber}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => navigateAttachmentRecord('prev')}
          disabled={activeAttachmentIndex === 0}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
            activeAttachmentIndex === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Answer Attachment</span>
        </button>

        <span className="text-xs font-bold text-slate-600">
          Attachment {activeAttachmentIndex + 1} of {attachmentRecords.length}
        </span>

        <button
          onClick={() => navigateAttachmentRecord('next')}
          disabled={activeAttachmentIndex === attachmentRecords.length - 1}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
            activeAttachmentIndex === attachmentRecords.length - 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 cursor-pointer'
          }`}
        >
          <span>Next Answer Attachment</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AttachmentEvaluationView;
