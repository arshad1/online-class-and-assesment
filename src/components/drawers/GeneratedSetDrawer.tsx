import React from 'react';
import { mockQuestionBank } from '../../data/mockData';
import { QuestionTypeCategory } from '../../types';
import { X, CheckCircle2, Lock, Unlock, Sparkles, BookOpen, Layers, Award } from 'lucide-react';

interface GeneratedSetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestionIds: string[];
  isLocked: boolean;
  onToggleLock: () => void;
  randomSeed?: number;
}

export const GeneratedSetDrawer: React.FC<GeneratedSetDrawerProps> = ({
  isOpen,
  onClose,
  selectedQuestionIds,
  isLocked,
  onToggleLock,
  randomSeed = 101,
}) => {
  if (!isOpen) return null;

  // Filter bank questions matching selected IDs
  const selectedQuestions = mockQuestionBank.filter((q) => selectedQuestionIds.includes(q.id));

  // Group by question type
  const groupedQuestions: Record<QuestionTypeCategory, typeof selectedQuestions> = {
    mcq: selectedQuestions.filter((q) => q.type === 'mcq'),
    one_word: selectedQuestions.filter((q) => q.type === 'one_word'),
    short_answer: selectedQuestions.filter((q) => q.type === 'short_answer'),
    long_answer: selectedQuestions.filter((q) => q.type === 'long_answer'),
    essay: selectedQuestions.filter((q) => q.type === 'essay'),
  };

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end font-sans">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-base font-black tracking-tight">Randomly Generated Question Set</h3>
              <p className="text-xs text-slate-400">
                Random Seed: <span className="font-mono text-blue-400 font-bold">#SEED-{randomSeed}</span> | Total Questions: {selectedQuestions.length} ({totalMarks} Marks)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Status Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLocked ? (
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black rounded-xl flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Selection Locked (Frozen)
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black rounded-xl flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-amber-600" />
                Selection Unlocked
              </span>
            )}
            <p className="text-xs text-slate-500">
              {isLocked
                ? 'This generated set is frozen and will not change when regenerating or navigating.'
                : 'Unlock to allow fresh random re-sampling.'}
            </p>
          </div>

          <button
            onClick={onToggleLock}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              isLocked
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
            }`}
          >
            {isLocked ? 'Unlock Set' : 'Lock Selection'}
          </button>
        </div>

        {/* Drawer Body — Question List Grouped by Type */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {(Object.keys(groupedQuestions) as QuestionTypeCategory[]).map((type) => {
            const list = groupedQuestions[type];
            if (list.length === 0) return null;

            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    {type.replace('_', ' ')} ({list.length} Questions)
                  </h4>
                  <span className="text-xs text-slate-500 font-semibold">
                    Subtotal: {list.reduce((sum, q) => sum + q.marks, 0)} Marks
                  </span>
                </div>

                <div className="space-y-2.5">
                  {list.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-blue-900">
                          Q{idx + 1}. [{q.chapterName}]
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-200 text-slate-700">
                            {q.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-900">
                            {q.marks}M
                          </span>
                        </div>
                      </div>

                      <p className="font-bold text-slate-900 leading-snug">{q.text}</p>

                      {/* Options Preview for MCQ */}
                      {q.type === 'mcq' && q.options && (
                        <div className="grid grid-cols-2 gap-1 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-1.5 rounded text-[11px] font-semibold border ${
                                oIdx === q.correctOptionIndex
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="font-bold mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-semibold">
            {selectedQuestions.length} Questions Verified
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
