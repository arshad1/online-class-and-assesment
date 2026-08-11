import React from 'react';
import { useExam } from '../../context/ExamContext';
import { PdfViewer } from '../common/PdfViewer';
import { X, BookOpen, FileCheck, CheckCircle2, Layers } from 'lucide-react';

export const QuestionPaperPreviewModal: React.FC = () => {
  const { previewQuestionPaper, setPreviewQuestionPaper } = useExam();

  if (!previewQuestionPaper) return null;

  const isUploadedPaper = previewQuestionPaper.paperType === 'uploaded' || !!previewQuestionPaper.uploadedFile;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {previewQuestionPaper.code}
                </span>
                <h2 className="text-sm font-bold text-white">{previewQuestionPaper.title}</h2>
              </div>
              <p className="text-xs text-slate-400">
                {isUploadedPaper ? 'Uploaded PDF Question Paper Document View' : 'Generated Paper Preview from Question Paper Generator Module'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPreviewQuestionPaper(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Stats Header */}
        <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">Subject & Class</span>
            <strong className="text-slate-900">{previewQuestionPaper.subject} ({previewQuestionPaper.class})</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Total Questions</span>
            <strong className="text-slate-900">{previewQuestionPaper.totalQuestions} Questions</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Maximum Marks</span>
            <strong className="text-blue-700 font-bold">{previewQuestionPaper.maxMarks} Marks</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Paper Source</span>
            <strong className="text-slate-900">
              {isUploadedPaper ? 'Uploaded PDF Document' : `${previewQuestionPaper.objectiveCount} Obj / ${previewQuestionPaper.subjectiveCount} Subj`}
            </strong>
          </div>
        </div>

        {/* Paper Structure & Questions List OR Integrated PDF Viewer */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {isUploadedPaper ? (
            <div className="h-[650px] w-full">
              <PdfViewer
                title={previewQuestionPaper.title}
                subject={previewQuestionPaper.subject}
                code={previewQuestionPaper.code}
                uploadedFile={previewQuestionPaper.uploadedFile}
              />
            </div>
          ) : (
            <>
              {/* Section Summary Pills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Paper Sections
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {previewQuestionPaper.sections.map((sec) => (
                <div key={sec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-800">{sec.name}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{sec.count} Questions</span>
                    <span className="font-semibold text-blue-600">{sec.totalMarks} Marks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question List Preview */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Question Items Preview
            </h3>

            {previewQuestionPaper.questions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-50/60 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-700">
                    Q{idx + 1} • {q.questionType === 'objective' ? 'MCQ' : 'Subjective'}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {q.maxMarks} Marks
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-900 leading-relaxed">{q.text}</p>

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                          optIdx === q.correctOptionIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {optIdx === q.correctOptionIndex && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {q.modelAnswer && (
                  <div className="mt-2 p-2.5 bg-blue-50/80 rounded-lg border border-blue-200 text-xs">
                    <span className="font-bold text-blue-900 block mb-0.5">Model Answer / Key:</span>
                    <p className="text-blue-950 font-mono text-[11px] leading-relaxed">{q.modelAnswer}</p>
                  </div>
                )}

                {q.rubric && (
                  <div className="mt-2 p-2.5 bg-slate-100 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-slate-800 block">Grading Rubric Criteria:</span>
                    {q.rubric.map((r) => (
                      <div key={r.id} className="flex items-center justify-between text-[11px] text-slate-700">
                        <span>• {r.criterion} ({r.description})</span>
                        <strong className="text-slate-900">{r.maxScore} pts</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Linked to Question Paper Generator API v2.4
          </span>
          <button
            onClick={() => setPreviewQuestionPaper(null)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
