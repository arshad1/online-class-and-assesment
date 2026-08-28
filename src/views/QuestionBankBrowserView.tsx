import React, { useState, useEffect, useMemo } from 'react';
import { useExam } from '../context/ExamContext';
import { mockQuestionBank, mockSubjectChapters } from '../data/mockData';
import { BankQuestionItem, QuestionTypeCategory, QuestionDifficulty, QuestionSelectionMode } from '../types';
import { GeneratedSetDrawer } from '../components/drawers/GeneratedSetDrawer';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Save,
  Sparkles,
  Layers,
  Users,
  FileText,
  BookOpen,
  Search,
  Filter,
  CheckSquare,
  Square,
  Check,
  X,
  Tag,
  Award,
  Shuffle,
  Lock,
  Unlock,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const QuestionBankBrowserView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    createExamMarksDistributionState,
    createExamQuestionBankState,
    updateCreateExamQuestionBankState,
    setActiveTab,
    addToast,
  } = useExam();

  // Mode State: Manual Selection vs Random Selection (Prototype 08)
  const [selectionMode, setSelectionMode] = useState<QuestionSelectionMode>(
    createExamQuestionBankState.selectionMode || 'manual'
  );
  const [isLocked, setIsLocked] = useState<boolean>(createExamQuestionBankState.isLocked || false);
  const [randomSeed, setRandomSeed] = useState<number>(createExamQuestionBankState.randomSeed || 101);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Active Filter States
  const [selectedSubject, setSelectedSubject] = useState<string>(
    createExamAcademicMappingState.selectedSubject || 'Mathematics'
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Question IDs State
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
    createExamQuestionBankState.selectedQuestionIds || [
      'qb-m1', 'qb-m2', 'qb-m3', 'qb-m4', 'qb-m5', 'qb-m6', 'qb-m7', 'qb-m8', 'qb-m9', 'qb-m10',
      'qb-m13', 'qb-m14', 'qb-m15', 'qb-m16', 'qb-m17',
      'qb-m18', 'qb-m19', 'qb-m20', 'qb-m21', 'qb-m22',
      'qb-m23', 'qb-m24',
      'qb-m26',
    ]
  );

  // Form Submission & Validation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state to ExamContext
  useEffect(() => {
    updateCreateExamQuestionBankState({
      selectionMode,
      selectedQuestionIds,
      isLocked,
      randomSeed,
    });
  }, [selectionMode, selectedQuestionIds, isLocked, randomSeed]);

  // Target quotas configured in Prototype 06
  const targetQuotas = useMemo(() => {
    const quotaMap: Record<QuestionTypeCategory, { label: string; target: number }> = {
      mcq: { label: 'MCQ', target: 0 },
      one_word: { label: 'One Word', target: 0 },
      short_answer: { label: 'Short Answer', target: 0 },
      long_answer: { label: 'Long Answer', target: 0 },
      essay: { label: 'Essay', target: 0 },
    };

    (createExamMarksDistributionState.rows || []).forEach((row) => {
      if (quotaMap[row.type]) {
        quotaMap[row.type].target = Number(row.questionCount) || 0;
      }
    });

    return quotaMap;
  }, [createExamMarksDistributionState.rows]);

  // Count of total available questions in item bank for the selected subject per type
  const availableCountsByType = useMemo(() => {
    const counts: Record<QuestionTypeCategory, number> = {
      mcq: 0,
      one_word: 0,
      short_answer: 0,
      long_answer: 0,
      essay: 0,
    };

    mockQuestionBank.forEach((q) => {
      if (q.subject === selectedSubject && counts[q.type] !== undefined) {
        counts[q.type] += 1;
      }
    });

    // If mock bank count is smaller than required, simulate expanded pool for prototype demo (e.g. 50 MCQs available)
    if (counts.mcq < 50) counts.mcq = 50;
    if (counts.one_word < 25) counts.one_word = 25;
    if (counts.short_answer < 20) counts.short_answer = 20;
    if (counts.long_answer < 15) counts.long_answer = 15;
    if (counts.essay < 10) counts.essay = 10;

    return counts;
  }, [selectedSubject]);

  // Available chapters for the selected subject
  const availableChapters = useMemo(() => {
    return mockSubjectChapters[selectedSubject] || [];
  }, [selectedSubject]);

  // Filtered bank question items (for Manual mode list)
  const filteredQuestions = useMemo(() => {
    return mockQuestionBank.filter((q) => {
      const matchesSubject = q.subject === selectedSubject;
      const matchesChapter = selectedChapterId === 'all' || q.chapterId === selectedChapterId;
      const matchesType = selectedTypeFilter === 'all' || q.type === selectedTypeFilter;
      const matchesDifficulty = selectedDifficultyFilter === 'all' || q.difficulty === selectedDifficultyFilter;
      const matchesSearch =
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.chapterName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSubject && matchesChapter && matchesType && matchesDifficulty && matchesSearch;
    });
  }, [selectedSubject, selectedChapterId, selectedTypeFilter, selectedDifficultyFilter, searchQuery]);

  // Count of picked questions grouped by type
  const pickedCountsByType = useMemo(() => {
    const counts: Record<QuestionTypeCategory, number> = {
      mcq: 0,
      one_word: 0,
      short_answer: 0,
      long_answer: 0,
      essay: 0,
    };

    selectedQuestionIds.forEach((id) => {
      const item = mockQuestionBank.find((q) => q.id === id);
      if (item && counts[item.type] !== undefined) {
        counts[item.type] += 1;
      }
    });

    return counts;
  }, [selectedQuestionIds]);

  // Check overall quota satisfaction status
  const quotaValidationSummary = useMemo(() => {
    const errors: string[] = [];
    let isFullySatisfied = true;

    (Object.keys(targetQuotas) as QuestionTypeCategory[]).forEach((type) => {
      const target = targetQuotas[type].target;
      const picked = pickedCountsByType[type] || 0;
      if (target > 0 && picked < target) {
        isFullySatisfied = false;
        errors.push(`${targetQuotas[type].label} requires ${target} questions (${picked}/${target} selected)`);
      }
    });

    return { isFullySatisfied, errors };
  }, [targetQuotas, pickedCountsByType]);

  // Prototype 08: Random Selection Generator Handler
  const handleRegenerateRandomSelection = () => {
    if (isLocked) {
      addToast('Selection Locked', 'Unlock the random question set before regenerating.', 'warning');
      return;
    }

    const newSeed = Math.floor(Math.random() * 9000) + 1000;
    setRandomSeed(newSeed);

    const newPickedIds: string[] = [];

    (Object.keys(targetQuotas) as QuestionTypeCategory[]).forEach((type) => {
      const target = targetQuotas[type].target;
      if (target > 0) {
        const pool = mockQuestionBank.filter((q) => q.subject === selectedSubject && q.type === type);
        // Shuffle pool deterministically / pseudo-randomly
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, target);
        selected.forEach((q) => newPickedIds.push(q.id));
      }
    });

    setSelectedQuestionIds(newPickedIds);
    setValidationError(null);
    addToast(
      'Random Selection Generated',
      `Sampled ${newPickedIds.length} questions randomly (Seed #SEED-${newSeed}). All quotas satisfied!`,
      'success'
    );
  };

  // Toggle Lock State
  const handleToggleLock = () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);
    addToast(
      nextLocked ? 'Selection Locked' : 'Selection Unlocked',
      nextLocked
        ? 'Random question set is now frozen and protected from changes.'
        : 'Random set unlocked. Re-sampling is now allowed.',
      nextLocked ? 'success' : 'info'
    );
  };

  // Toggle single question selection (Manual Mode)
  const handleToggleQuestion = (questionId: string) => {
    setValidationError(null);
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  // Auto-Select All Required Questions (Manual Mode helper)
  const handleAutoSelectRequired = () => {
    const newSelectedIds: string[] = [];

    (Object.keys(targetQuotas) as QuestionTypeCategory[]).forEach((type) => {
      const target = targetQuotas[type].target;
      if (target > 0) {
        const typeQuestions = mockQuestionBank
          .filter((q) => q.subject === selectedSubject && q.type === type)
          .slice(0, target);
        typeQuestions.forEach((q) => newSelectedIds.push(q.id));
      }
    });

    setSelectedQuestionIds(newSelectedIds);
    setValidationError(null);
    addToast('Auto-Selection Applied', `Selected required questions matching all quotas 100%.`, 'success');
  };

  const handleDeselectAll = () => {
    setSelectedQuestionIds([]);
    addToast('Selection Cleared', 'Deselected all questions in the exam pool.', 'info');
  };

  // Validation function
  const validateForm = (): boolean => {
    if (!quotaValidationSummary.isFullySatisfied) {
      const msg = `Incomplete question selection: ${quotaValidationSummary.errors.join('; ')}. Please select the required questions before continuing.`;
      setValidationError(msg);
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handler: Save as Draft
  const handleSaveAsDraft = () => {
    addToast('Draft Saved', `Saved ${selectedQuestionIds.length} picked questions in exam pool.`, 'success');
  };

  // Handler: Continue to Step 7
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      addToast(
        'Question Selection Complete',
        `All question quotas 100% satisfied (${selectedQuestionIds.length} questions in ${selectionMode} mode). Advancing to Step 7: Exam Controls & Review`,
        'success'
      );
      setActiveTab('create-exam-controls');
    } else {
      addToast('Validation Error', 'Please complete question selection quotas before continuing.', 'danger');
    }
  };

  // Demo Controls
  const loadPreset = (preset: 'complete' | 'incomplete' | 'clear') => {
    setIsSubmitted(false);
    setValidationError(null);

    if (preset === 'complete') {
      handleAutoSelectRequired();
    } else if (preset === 'incomplete') {
      const partial = [
        'qb-m1', 'qb-m2', 'qb-m3', 'qb-m4', 'qb-m5', 'qb-m6', 'qb-m7', // 7 MCQs
        'qb-m13', 'qb-m14', 'qb-m15', 'qb-m16', 'qb-m17', // 5 One Word
        'qb-m18', 'qb-m19', 'qb-m20', 'qb-m21', 'qb-m22', // 5 Short
        'qb-m23', 'qb-m24', // 2 Long
        'qb-m26', // 1 Essay
      ];
      setSelectedQuestionIds(partial);
      setIsSubmitted(true);
      setValidationError('Incomplete question selection: MCQ requires 10 questions (7/10 selected). Please select 3 more MCQ questions before continuing.');
      addToast('Incomplete Preset Loaded', 'MCQ selected count set to 7/10 to simulate quota validation error.', 'warning');
    } else if (preset === 'clear') {
      handleDeselectAll();
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: false, done: true },
    { num: 2, label: 'Recipient Selection', active: false, done: true },
    { num: 3, label: 'Academic Mapping', active: false, done: true },
    { num: 4, label: 'Question Source Choice', active: false, done: true },
    { num: 5, label: 'Question Type & Marks', active: false, done: true },
    { num: 6, label: 'Question Selection', active: true, done: false },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveTab('create-exam-question-pool')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 5 — Question Type & Marks Distribution</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Create Online Examination — Step 6: Question Selection Mode
          </h2>
          <p className="text-xs text-slate-500">
            Select questions using Manual Picking or optional Random Selection mode to fulfill configured section quotas
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAsDraft}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Save as Draft</span>
          </button>

          <button
            onClick={() => setActiveTab('create-exam-question-pool')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Back
          </button>
        </div>
      </div>

      {/* PROTOTYPE 08 MODE SWITCHER TAB */}
      <div className="p-1.5 bg-slate-200 rounded-2xl flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setSelectionMode('manual');
            addToast('Switched to Manual Selection', 'Browse and manually pick individual questions.', 'info');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            selectionMode === 'manual'
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-300/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-blue-600" />
          <span>Manual Selection Mode</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectionMode('random');
            addToast('Switched to Random Selection Mode', 'Configure random sampling rules per question type.', 'info');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            selectionMode === 'random'
              ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <Shuffle className="w-4 h-4 text-blue-300" />
          <span>Random Selection Mode</span>
        </button>
      </div>

      {/* Preset Demo Toolbar */}
      <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 rounded-2xl border border-blue-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider">
            Prototype Demo Controls:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadPreset('complete')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Auto-Select All Required (100% Complete)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('incomplete')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Partial Selection (MCQ 7/10 Incomplete)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('clear')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            Deselect All Questions
          </button>
        </div>
      </div>

      {/* 6-Step Creation Wizard Flow Indicator Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {creationSteps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (step.num === 1) setActiveTab('create-exam-basic');
                    if (step.num === 2) setActiveTab('create-exam-recipients');
                    if (step.num === 3) setActiveTab('create-exam-academic');
                    if (step.num === 4) setActiveTab('create-exam-question-source');
                    if (step.num === 5) setActiveTab('create-exam-question-pool');
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    step.active
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                      : step.done
                      ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </button>
                <span
                  className={`text-xs font-bold tracking-tight ${
                    step.active ? 'text-white font-black' : step.done ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < creationSteps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-700 shrink-0 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {(isSubmitted || validationError) && validationError && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Validation Error — Incomplete Question Quotas:</h4>
            <p className="font-semibold text-red-800 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* PROTOTYPE 08: RANDOM SELECTION MODE PANEL */}
      {selectionMode === 'random' ? (
        <div className="space-y-6">
          {/* Random Controls Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-blue-600" />
                  Random Question Selection Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Automatically sample random questions matching configured section quotas (e.g. Select 10 randomly from 50 available MCQs)
                </p>
              </div>

              {/* Action Toolbar for Random Selection */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>View Generated Set ({selectedQuestionIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegenerateRandomSelection}
                  disabled={isLocked}
                  className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                    isLocked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate Selection</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleLock}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all ${
                    isLocked
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-amber-600" />
                      <span>Lock Selection</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Random Sampling Table & Rules */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Question Type</th>
                      <th className="p-3.5 text-center">Number Required</th>
                      <th className="p-3.5 text-center">Available Question Count</th>
                      <th className="p-3.5 text-center">Randomly Sampled</th>
                      <th className="p-3.5 text-right">Pool Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(Object.keys(targetQuotas) as QuestionTypeCategory[]).map((type) => {
                      const info = targetQuotas[type];
                      const required = info.target;
                      const available = availableCountsByType[type] || 0;
                      const sampled = pickedCountsByType[type] || 0;
                      const isSufficient = available >= required;

                      return (
                        <tr key={type} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5">
                            <span className="font-extrabold text-slate-900 uppercase text-xs">
                              {info.label}
                            </span>
                            <p className="text-[11px] text-slate-400">Subject: {selectedSubject}</p>
                          </td>

                          <td className="p-3.5 text-center font-black text-blue-900 text-sm">
                            {required} Questions
                          </td>

                          <td className="p-3.5 text-center font-bold text-slate-700 text-xs">
                            <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                              {available} Available in Item Bank
                            </span>
                          </td>

                          <td className="p-3.5 text-center font-black text-emerald-700 text-sm">
                            {sampled} / {required}
                          </td>

                          <td className="p-3.5 text-right">
                            {required === 0 ? (
                              <span className="text-slate-400 text-[11px] font-semibold">Not Required</span>
                            ) : isSufficient ? (
                              <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-black rounded-lg inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sufficient Pool
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-red-100 border border-red-300 text-red-900 text-[11px] font-black rounded-lg inline-flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Pool Shortage
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lock State Notice */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                isLocked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-semibold'
                  : 'bg-amber-50 border-amber-200 text-amber-950 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isLocked ? (
                  <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Unlock className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold">
                    {isLocked
                      ? 'Random Selection Locked & Frozen (#SEED-' + randomSeed + ')'
                      : 'Random Selection Unlocked'}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {isLocked
                      ? 'The current sampled question set is locked. Navigating back/forward will preserve these exact questions.'
                      : 'You can click "Regenerate Selection" to re-sample questions with a new random seed.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-extrabold rounded-xl hover:bg-slate-50 transition-colors shrink-0"
              >
                Inspect Generated Cards
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* PROTOTYPE 07: MANUAL SELECTION MODE PANEL */
        <div className="space-y-6">
          {/* SECTION 1: LIVE QUESTION SELECTION QUOTA TRACKER PANEL */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  1. Live Question Selection Quotas (Manual Mode)
                </h3>
                <p className="text-xs text-slate-500">
                  Browse and pick individual questions from item bank up to target count
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoSelectRequired}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Auto-Select All Required</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Clear Picks
                </button>
              </div>
            </div>

            {/* Dynamic Quota Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(Object.keys(targetQuotas) as QuestionTypeCategory[]).map((type) => {
                const info = targetQuotas[type];
                const target = info.target;
                const picked = pickedCountsByType[type] || 0;
                const isDone = target === 0 || picked >= target;

                return (
                  <div
                    key={type}
                    className={`p-3.5 rounded-xl border transition-all ${
                      target === 0
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : isDone
                        ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-black uppercase text-slate-800">{info.label}</span>
                      {target > 0 && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                          }`}
                        >
                          {isDone ? 'Done ✓' : `${target - picked} left`}
                        </span>
                      )}
                    </div>

                    <div className="text-lg font-black text-slate-900">
                      {picked} / <span className="text-slate-500 text-sm font-bold">{target}</span>
                    </div>

                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                      {target === 0 ? 'Not required' : `${info.label} — Select ${target} questions`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: FILTER & SEARCH TOOLBAR */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                2. Filter Question Database
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search question text or topic keywords..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Chapter Filter */}
              <div>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="all">All Mapped Chapters ({availableChapters.length})</option>
                  {availableChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <select
                  value={selectedDifficultyFilter}
                  onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="all">Difficulty: All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: QUESTION CARDS LIST (Manual Mode) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                3. Available Questions ({filteredQuestions.length} Items Found)
              </h3>
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleQuestion(q.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer mt-0.5 shrink-0"
                        />

                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-blue-100 text-blue-900 border border-blue-300">
                              {q.type.replace('_', ' ')}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {q.chapterName}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                              {q.difficulty}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900">
                              {q.marks} Marks
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 leading-snug">{q.text}</h4>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-blue-600 text-white flex items-center gap-1.5 shadow-2xs">
                            <Check className="w-4 h-4" /> Selected
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            Unselected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FORM ACTION TOOLBAR */}
      <form onSubmit={handleContinue} className="space-y-6">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('create-exam-question-pool')}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 5 Marks Distribution</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Continue to Step 7: Exam Controls & Review</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* RANDOMLY GENERATED SET PREVIEW DRAWER */}
      <GeneratedSetDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedQuestionIds={selectedQuestionIds}
        isLocked={isLocked}
        onToggleLock={handleToggleLock}
        randomSeed={randomSeed}
      />
    </div>
  );
};
