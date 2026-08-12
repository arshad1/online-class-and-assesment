import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';
import {
  Eye,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Camera,
  Shield,
  Layers,
  ChevronRight,
  ChevronLeft,
  Send,
  Sparkles,
} from 'lucide-react';
import { mockQuestionBank } from '../../data/mockData';

export const ExamPreviewModal: React.FC = () => {
  const {
    showExamPreviewModal,
    setShowExamPreviewModal,
    createExamFormState,
    examSections,
    createExamQuestionBankState,
  } = useExam();

  const [activeSectionId, setActiveSectionId] = useState<string>(
    examSections[0]?.id || 'sec-a'
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [simulatedAnswers, setSimulatedAnswers] = useState<Record<string, number>>({});

  if (!showExamPreviewModal) return null;

  const currentSection =
    examSections.find((s) => s.id === activeSectionId) || examSections[0];

  const sectionQuestions = mockQuestionBank.filter((q) =>
    (currentSection?.questionIds || []).includes(q.id)
  );

  const currentQuestion = sectionQuestions[activeQuestionIndex] || sectionQuestions[0];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col border border-slate-700 overflow-hidden">
        {/* Header Preview Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 px-6 py-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-400 text-amber-950 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-sm">
              <Eye className="w-3.5 h-3.5" /> TEACHER PREVIEW SIMULATOR (PRD SEC 86)
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {createExamFormState.examName || 'Final Semester Operating Systems Assessment'}
              </h3>
              <p className="text-[11px] text-blue-200">
                {createExamFormState.examCode || 'CS-402'} • Total Duration: {createExamFormState.durationMinutes || 120} mins • Max Marks: {createExamFormState.totalMarks || 100}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExamPreviewModal(false)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-800/90 px-6 py-2 border-b border-slate-700 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Exam Sections:
          </span>
          {examSections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSectionId(sec.id);
                setActiveQuestionIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                sec.id === activeSectionId
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <span>{sec.title}</span>
              <span className="text-[10px] bg-slate-900/60 px-2 py-0.5 rounded text-blue-200">
                {sec.maxMarks} Marks
              </span>
            </button>
          ))}
        </div>

        {/* Simulated Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left / Center Question View */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Section Instructions Banner */}
            {currentSection && (
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/50 text-xs text-blue-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-blue-100">{currentSection.title} Instructions:</span>
                  <span>{currentSection.instructions || currentSection.description}</span>
                </div>
              </div>
            )}

            {currentQuestion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 bg-slate-800 text-blue-400 rounded-lg border border-slate-700">
                    Question {activeQuestionIndex + 1} of {sectionQuestions.length}
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    [{currentQuestion.marks} Marks]
                  </span>
                </div>

                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 text-sm font-semibold text-slate-100">
                  {currentQuestion.text}
                </div>

                {/* Question Options simulation */}
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() =>
                          setSimulatedAnswers({
                            ...simulatedAnswers,
                            [currentQuestion.id]: oIdx,
                          })
                        }
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          simulatedAnswers[currentQuestion.id] === oIdx
                            ? 'bg-blue-900/60 border-blue-500 text-white'
                            : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </span>
                        {simulatedAnswers[currentQuestion.id] === oIdx && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-xs text-slate-400 italic">
                    [Subjective / Essay text response box simulation for student answer entry]
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No questions assigned to this section yet.
              </div>
            )}
          </div>

          {/* Right Proctoring & Question Navigation Sidebar */}
          <div className="w-80 bg-slate-800/50 border-l border-slate-700 p-4 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Simulated Camera Feed */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-center space-y-2">
                <div className="relative aspect-video bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 overflow-hidden">
                  <Camera className="w-8 h-8 text-slate-600 animate-pulse" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500/80 text-white text-[9px] font-bold rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    AI MONITORED
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block">
                  Simulated Student Webcam Overlay
                </span>
              </div>

              {/* Question Navigation Palette */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Question Palette ({currentSection?.title})
                </h4>
                <div className="grid grid-cols-5 gap-1.5">
                  {sectionQuestions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        activeQuestionIndex === idx
                          ? 'bg-blue-600 text-white border-blue-400'
                          : simulatedAnswers[q.id] !== undefined
                          ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 border-t border-slate-700 pt-3">
              <button
                onClick={() => setShowExamPreviewModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Close Preview & Return to Setup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
