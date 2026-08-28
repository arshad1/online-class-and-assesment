import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import {
  LiveInClassAssessment,
  LiveAssessmentQuestion,
  LiveAssessmentQuestionType,
  MatchingPairItem,
  BlankSlotItem,
} from '../types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Save,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Sparkles,
  ChevronUp,
  ChevronDown,
  FileCheck,
  Zap,
  HelpCircle,
  X,
  Shuffle,
  AlertCircle,
  BookOpen,
  ListOrdered,
} from 'lucide-react';

export const CreateClassAssessmentView: React.FC = () => {
  const {
    editingLiveAssessment,
    setEditingLiveAssessment,
    saveLiveAssessment,
    launchSavedAssessmentInClass,
    setActiveTab,
    onlineClasses,
    activeLiveClass,
    addToast,
  } = useExam();

  // Basic Form State
  const [assessmentId, setAssessmentId] = useState<string>(
    editingLiveAssessment?.id || 'live-ass-' + Date.now().toString(36)
  );
  const [title, setTitle] = useState<string>(
    editingLiveAssessment?.title || 'Spot Check: New In-Class Assessment'
  );
  const [subject, setSubject] = useState<string>(
    editingLiveAssessment?.subject || 'Physics'
  );
  const [topic, setTopic] = useState<string>(
    editingLiveAssessment?.topic || 'Core Concepts & Analytical Application'
  );
  const [targetClass, setTargetClass] = useState<string>(
    editingLiveAssessment?.targetClass || 'Grade 12 - Section A'
  );
  const [durationSeconds, setDurationSeconds] = useState<number>(
    editingLiveAssessment?.durationSeconds ?? 180
  );
  const [passMarks, setPassMarks] = useState<number>(
    editingLiveAssessment?.passMarks ?? 6
  );
  const [instructions, setInstructions] = useState<string>(
    editingLiveAssessment?.instructions ||
      'Complete all questions within the allocated time. Multi-select questions require picking all valid answers.'
  );

  // Questions List State
  const [questions, setQuestions] = useState<LiveAssessmentQuestion[]>(
    editingLiveAssessment?.questions || [
      {
        id: 'q-demo-1',
        type: 'mcq',
        prompt: 'Which of the following physical quantities is a vector quantity?',
        marks: 2,
        options: ['Electric Field', 'Electric Potential', 'Electric Flux', 'Electric Charge'],
        correctOptionIndex: 0,
        explanation: 'Electric field has both magnitude and direction, whereas potential, flux, and charge are scalars.',
      },
      {
        id: 'q-demo-2',
        type: 'mmcq',
        prompt: 'Select ALL statements that are true regarding electromagnetic waves (Multiple Correct):',
        marks: 3,
        options: [
          'They travel at the speed of light in vacuum',
          'They require a material medium for propagation',
          'Electric and Magnetic field vectors are perpendicular to each other',
          'They carry both energy and momentum',
        ],
        correctOptionIndices: [0, 2, 3],
        minSelections: 2,
        explanation: 'EM waves do not require a material medium; they propagate through vacuum as oscillating perpendicular E and B fields.',
      },
      {
        id: 'q-demo-3',
        type: 'fill_in_blanks',
        prompt: 'Complete the electromagnetic wave properties by filling in the blanks:',
        marks: 3,
        blankSlots: [
          {
            id: 'b-slot-1',
            label: 'Blank 1',
            sentencePrefix: 'The ratio of electric field amplitude to magnetic field amplitude E₀/B₀ equals',
            sentenceSuffix: '',
            correctAnswer: 'speed of light (c)',
          },
          {
            id: 'b-slot-2',
            label: 'Blank 2',
            sentencePrefix: 'Electromagnetic waves are transverse in nature because oscillations are',
            sentenceSuffix: 'to the direction of wave propagation.',
            correctAnswer: 'perpendicular',
          },
        ],
        blankOptions: ['speed of light (c)', 'perpendicular', 'parallel', 'wavelength', 'refractive index'],
        explanation: 'E₀/B₀ = c. Transverse oscillations are perpendicular to the propagation vector k.',
      },
      {
        id: 'q-demo-4',
        type: 'match_following',
        prompt: 'Match each region of the electromagnetic spectrum with its primary practical application:',
        marks: 4,
        matchingPairs: [
          { id: 'mp-1', leftText: 'Microwaves', rightText: 'Radar & Satellite Communication' },
          { id: 'mp-2', leftText: 'Infrared Rays', rightText: 'Thermal Imaging & Night Vision' },
          { id: 'mp-3', leftText: 'Ultraviolet Rays', rightText: 'Sterilization & Water Purification' },
          { id: 'mp-4', leftText: 'X-Rays', rightText: 'Medical Bone Diagnostics' },
        ],
        explanation: 'Microwaves (Radar), IR (Thermal), UV (Germicidal/Purification), X-Rays (Radiography).',
      },
    ]
  );

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Calculate total marks automatically
  const totalCalculatedMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  // Add Question Handlers for the 4 Question Types
  const handleAddMCQ = () => {
    const newQ: LiveAssessmentQuestion = {
      id: 'q-mcq-' + Date.now().toString(36),
      type: 'mcq',
      prompt: 'New Multiple Choice Question Prompt...',
      marks: 2,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOptionIndex: 0,
      explanation: 'Detailed explanation for the correct choice...',
    };
    setQuestions((prev) => [...prev, newQ]);
    addToast('MCQ Question Added', 'Configure choices and radio button for correct answer.', 'info');
  };

  const handleAddMMCQ = () => {
    const newQ: LiveAssessmentQuestion = {
      id: 'q-mmcq-' + Date.now().toString(36),
      type: 'mmcq',
      prompt: 'Select ALL correct statements that apply (Multiple Choices):',
      marks: 3,
      options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'],
      correctOptionIndices: [0, 1],
      minSelections: 2,
      explanation: 'Explanation specifying which choices are correct...',
    };
    setQuestions((prev) => [...prev, newQ]);
    addToast('MMCQ Question Added', 'Check the boxes for all correct answers.', 'info');
  };

  const handleAddFillInBlanks = () => {
    const newQ: LiveAssessmentQuestion = {
      id: 'q-fib-' + Date.now().toString(36),
      type: 'fill_in_blanks',
      prompt: 'Fill in the blanks to complete the statement:',
      marks: 3,
      blankSlots: [
        {
          id: 'b-1',
          label: 'Blank 1',
          sentencePrefix: 'The formula for kinetic energy is 1/2 · m ·',
          sentenceSuffix: '',
          correctAnswer: 'v²',
        },
        {
          id: 'b-2',
          label: 'Blank 2',
          sentencePrefix: 'Work done by a conservative force along a closed path is',
          sentenceSuffix: '',
          correctAnswer: 'zero',
        },
      ],
      blankOptions: ['v²', 'zero', 'v', 'infinity', 'mgh'],
      explanation: 'KE = 1/2 m v². Conservative forces do zero work in a closed loop.',
    };
    setQuestions((prev) => [...prev, newQ]);
    addToast('Fill in Blanks Added', 'Define prefix, suffix, correct answers, and word pool.', 'info');
  };

  const handleAddMatchFollowing = () => {
    const newQ: LiveAssessmentQuestion = {
      id: 'q-match-' + Date.now().toString(36),
      type: 'match_following',
      prompt: 'Match each item in Column A with its corresponding item in Column B:',
      marks: 4,
      matchingPairs: [
        { id: 'p-1', leftText: 'Column A - Item 1', rightText: 'Column B - Match 1' },
        { id: 'p-2', leftText: 'Column A - Item 2', rightText: 'Column B - Match 2' },
        { id: 'p-3', leftText: 'Column A - Item 3', rightText: 'Column B - Match 3' },
      ],
      explanation: 'Explanation for correct column pairings...',
    };
    setQuestions((prev) => [...prev, newQ]);
    addToast('Match the Following Added', 'Add Column A and Column B pair rows.', 'info');
  };

  const handleAddStepOrdering = () => {
    const newQ: LiveAssessmentQuestion = {
      id: 'q-step-' + Date.now().toString(36),
      type: 'step_ordering',
      prompt:
        'Arrange the following solution steps in their exact logical sequence (Distractor/incorrect steps are mixed in):',
      marks: 4,
      orderedSteps: [
        'Step 1: Write equation in standard form: 2x² + 5x - 3 = 0',
        'Step 2: Split middle term using product-sum rule: 2x² + 6x - x - 3 = 0',
        'Step 3: Group terms to factor out GCF: 2x(x + 3) - 1(x + 3) = 0',
        'Step 4: Factor the common binomial: (2x - 1)(x + 3) = 0',
        'Step 5: Apply zero product property: x = 1/2 or x = -3',
      ],
      distractorSteps: [
        'Distractor: Incorrect middle split: 2x² + 3x + 2x - 3 = 0',
        'Distractor: Incorrect binomial signs: (2x + 1)(x - 3) = 0',
      ],
      explanation:
        'The factors of (2)(-3) = -6 that add up to +5 are +6 and -1. Grouping yields (2x - 1)(x + 3) = 0, giving roots x = 1/2, -3.',
    };
    setQuestions((prev) => [...prev, newQ]);
    addToast(
      'Step Ordering Added',
      'Add sequential solution steps and optional distractor/wrong steps.',
      'info'
    );
  };

  // Question Management Handlers
  const handleUpdateQuestion = (id: string, updates: Partial<LiveAssessmentQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      addToast('Cannot Delete', 'Assessment must contain at least 1 question.', 'warning');
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleDuplicateQuestion = (id: string) => {
    const target = questions.find((q) => q.id === id);
    if (!target) return;
    const clone: LiveAssessmentQuestion = {
      ...target,
      id: 'q-' + Date.now().toString(36),
      prompt: `${target.prompt} (Copy)`,
    };
    setQuestions((prev) => [...prev, clone]);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...questions];
    const item = copy.splice(index, 1)[0];
    copy.splice(newIndex, 0, item);
    setQuestions(copy);
  };

  // Option handlers for MCQ / MMCQ
  const handleAddOption = (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const currentOptions = q.options || [];
    const nextLetter = String.fromCharCode(65 + currentOptions.length);
    handleUpdateQuestion(qId, {
      options: [...currentOptions, `Option ${nextLetter}`],
    });
  };

  const handleRemoveOption = (qId: string, optIndex: number) => {
    const q = questions.find((item) => item.id === qId);
    if (!q || !q.options || q.options.length <= 2) {
      addToast('Minimum Options', 'Question must have at least 2 options.', 'warning');
      return;
    }
    const updatedOptions = q.options.filter((_, idx) => idx !== optIndex);
    const updates: Partial<LiveAssessmentQuestion> = { options: updatedOptions };
    if (q.correctOptionIndex !== undefined && q.correctOptionIndex >= updatedOptions.length) {
      updates.correctOptionIndex = 0;
    }
    if (q.correctOptionIndices) {
      updates.correctOptionIndices = q.correctOptionIndices
        .filter((idx) => idx !== optIndex)
        .map((idx) => (idx > optIndex ? idx - 1 : idx));
    }
    handleUpdateQuestion(qId, updates);
  };

  const handleToggleMMCQCorrect = (qId: string, optIndex: number) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const current = q.correctOptionIndices || [];
    const exists = current.includes(optIndex);
    const next = exists ? current.filter((i) => i !== optIndex) : [...current, optIndex];
    if (next.length === 0) {
      addToast('Required', 'Select at least 1 correct answer option.', 'warning');
      return;
    }
    handleUpdateQuestion(qId, { correctOptionIndices: next });
  };

  // Blank slots handlers
  const handleAddBlankSlot = (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const currentSlots = q.blankSlots || [];
    const newSlot: BlankSlotItem = {
      id: 'b-' + Date.now().toString(36),
      label: `Blank ${currentSlots.length + 1}`,
      sentencePrefix: 'Sentence context for new blank:',
      sentenceSuffix: '',
      correctAnswer: 'Correct Term',
    };
    handleUpdateQuestion(qId, {
      blankSlots: [...currentSlots, newSlot],
    });
  };

  const handleRemoveBlankSlot = (qId: string, slotId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q || !q.blankSlots || q.blankSlots.length <= 1) {
      addToast('Minimum Blanks', 'Question must have at least 1 blank slot.', 'warning');
      return;
    }
    handleUpdateQuestion(qId, {
      blankSlots: q.blankSlots.filter((s) => s.id !== slotId),
    });
  };

  // Match pair handlers
  const handleAddMatchingPair = (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const currentPairs = q.matchingPairs || [];
    const newPair: MatchingPairItem = {
      id: 'p-' + Date.now().toString(36),
      leftText: `Item ${currentPairs.length + 1}`,
      rightText: `Matching Value ${currentPairs.length + 1}`,
    };
    handleUpdateQuestion(qId, {
      matchingPairs: [...currentPairs, newPair],
    });
  };

  const handleRemoveMatchingPair = (qId: string, pairId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q || !q.matchingPairs || q.matchingPairs.length <= 2) {
      addToast('Minimum Pairs', 'Match question must have at least 2 pairs.', 'warning');
      return;
    }
    handleUpdateQuestion(qId, {
      matchingPairs: q.matchingPairs.filter((p) => p.id !== pairId),
    });
  };

  // Step Ordering and Sequence Proof Handlers
  const handleAddStepOrderingStep = (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const currentSteps = q.orderedSteps || [];
    handleUpdateQuestion(qId, {
      orderedSteps: [
        ...currentSteps,
        `Step ${currentSteps.length + 1}: State next logical step or formula transformation...`,
      ],
    });
  };

  const handleUpdateStepOrderingStep = (qId: string, stepIdx: number, text: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const currentSteps = [...(q.orderedSteps || [])];
    currentSteps[stepIdx] = text;
    handleUpdateQuestion(qId, { orderedSteps: currentSteps });
  };

  const handleRemoveStepOrderingStep = (qId: string, stepIdx: number) => {
    const q = questions.find((item) => item.id === qId);
    if (!q || !q.orderedSteps || q.orderedSteps.length <= 2) {
      addToast('Minimum Steps', 'Step ordering question must have at least 2 sequential steps.', 'warning');
      return;
    }
    const currentSteps = q.orderedSteps.filter((_, idx) => idx !== stepIdx);
    handleUpdateQuestion(qId, { orderedSteps: currentSteps });
  };

  const handleMoveStepOrderingStep = (
    qId: string,
    stepIdx: number,
    direction: 'up' | 'down'
  ) => {
    const q = questions.find((item) => item.id === qId);
    if (!q || !q.orderedSteps) return;
    if (
      (direction === 'up' && stepIdx === 0) ||
      (direction === 'down' && stepIdx === q.orderedSteps.length - 1)
    ) {
      return;
    }
    const newIdx = direction === 'up' ? stepIdx - 1 : stepIdx + 1;
    const copy = [...q.orderedSteps];
    const item = copy.splice(stepIdx, 1)[0];
    copy.splice(newIdx, 0, item);
    handleUpdateQuestion(qId, { orderedSteps: copy });
  };

  const handleAddDistractorStep = (qId: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const currentDistractors = q.distractorSteps || [];
    handleUpdateQuestion(qId, {
      distractorSteps: [
        ...currentDistractors,
        `Distractor: Incorrect formula split, inverted sign, or false deduction...`,
      ],
    });
  };

  const handleUpdateDistractorStep = (qId: string, distIdx: number, text: string) => {
    const q = questions.find((item) => item.id === qId);
    if (!q) return;
    const currentDistractors = [...(q.distractorSteps || [])];
    currentDistractors[distIdx] = text;
    handleUpdateQuestion(qId, { distractorSteps: currentDistractors });
  };

  const handleRemoveDistractorStep = (qId: string, distIdx: number) => {
    const q = questions.find((item) => item.id === qId);
    if (!q || !q.distractorSteps) return;
    const currentDistractors = q.distractorSteps.filter((_, idx) => idx !== distIdx);
    handleUpdateQuestion(qId, { distractorSteps: currentDistractors });
  };

  // Save Handlers
  const buildAssessmentObject = (status: 'active' | 'draft' | 'published'): LiveInClassAssessment => {
    return {
      id: assessmentId,
      title: title.trim() || 'Untitled Online Class Assessment',
      subject,
      topic: topic.trim() || 'General Unit',
      targetClass,
      durationSeconds,
      totalMarks: totalCalculatedMarks,
      passMarks,
      status,
      isDraft: status === 'draft',
      createdAt: editingLiveAssessment?.createdAt || new Date().toISOString().split('T')[0],
      instructions,
      questions,
      submissions: editingLiveAssessment?.submissions || [],
    };
  };

  const handleSaveToBank = (isDraft: boolean = false) => {
    if (!title.trim()) {
      addToast('Title Required', 'Please enter an assessment title.', 'warning');
      return;
    }
    const assessment = buildAssessmentObject(isDraft ? 'draft' : 'published');
    saveLiveAssessment(assessment);
    setEditingLiveAssessment(null);
    setActiveTab('online-class-assessments');
  };

  const handleSaveAndLaunchLive = () => {
    if (!title.trim()) {
      addToast('Title Required', 'Please enter an assessment title.', 'warning');
      return;
    }
    const assessment = buildAssessmentObject('active');
    saveLiveAssessment(assessment);
    setEditingLiveAssessment(null);
    if (activeLiveClass) {
      launchSavedAssessmentInClass(assessment.id, activeLiveClass.id);
    } else if (onlineClasses.length > 0) {
      launchSavedAssessmentInClass(assessment.id, onlineClasses[0].id);
    }
    setActiveTab('live-classroom');
  };

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full">
      {/* Top Navigation Bar & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('online-class-assessments')}
            className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition-all"
            title="Back to Assessments"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                Online Class In-Class Spot Quiz Builder
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                {editingLiveAssessment ? 'Editing Assessment' : 'New Assessment'}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {editingLiveAssessment ? 'Edit Class Assessment' : 'Create In-Class Assessment'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Student Preview</span>
          </button>

          <button
            onClick={() => handleSaveToBank(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-2 transition-all"
          >
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSaveToBank(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            <span>Save to Library</span>
          </button>

          <button
            onClick={handleSaveAndLaunchLive}
            className="px-5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Save & Launch in Class</span>
          </button>
        </div>
      </div>

      {/* Assessment Header Configuration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Assessment Details & Target Audience
          </span>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-slate-600">
              Total Marks: <strong className="text-blue-600 font-black">{totalCalculatedMarks}</strong>
            </span>
            <span>•</span>
            <span className="text-slate-600">
              Questions: <strong className="text-purple-600 font-black">{questions.length}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Assessment Title */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Assessment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spot Check: Differentiation Rules & Applications"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Target Class / Grade */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Target Class</label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Grade 12 - Section A">Grade 12 - Section A</option>
              <option value="Grade 12 - Section B">Grade 12 - Section B</option>
              <option value="Grade 11 - Section A">Grade 11 - Section A</option>
              <option value="Grade 11 - Section B">Grade 11 - Section B</option>
              <option value="Grade 10 - Section A">Grade 10 - Section A</option>
              <option value="All Classes">All Classes (General Pool)</option>
            </select>
          </div>

          {/* Topic */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Topic / Chapter Unit</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Calculus: Chain Rule & Implicit Differentiation"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Timer Duration Limit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Timer Limit</label>
            <select
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={60}>1 Minute (Lightning Poll)</option>
              <option value={120}>2 Minutes (Quick Check)</option>
              <option value={180}>3 Minutes (Standard Spot Quiz)</option>
              <option value={300}>5 Minutes (Extended Review)</option>
              <option value={600}>10 Minutes (In-Depth Assessment)</option>
              <option value={0}>Untimed (Teacher controls closure)</option>
            </select>
          </div>

          {/* Passing Marks */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Pass Mark Cutoff</label>
            <input
              type="number"
              min={1}
              max={totalCalculatedMarks}
              value={passMarks}
              onChange={(e) => setPassMarks(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Add Question Button Banner - 5 Question Types */}
      <div className="p-4 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-extrabold text-white">Add Questions to Assessment</h3>
              <p className="text-xs text-slate-300">Choose from 5 interactive question formats</p>
            </div>
          </div>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-200 font-bold">
            {questions.length} Questions Created
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {/* Add MCQ */}
          <button
            type="button"
            onClick={handleAddMCQ}
            className="p-3 rounded-2xl bg-blue-600/90 hover:bg-blue-600 border border-blue-400/30 text-white flex flex-col items-start gap-1 transition-all transform hover:-translate-y-0.5 shadow-md shadow-blue-500/20"
          >
            <div className="flex items-center gap-1.5 font-black text-xs">
              <Plus className="w-4 h-4" />
              <span>MCQ (Single)</span>
            </div>
            <span className="text-[10px] text-blue-200 font-medium">Single correct radio choice</span>
          </button>

          {/* Add MMCQ */}
          <button
            type="button"
            onClick={handleAddMMCQ}
            className="p-3 rounded-2xl bg-purple-600/90 hover:bg-purple-600 border border-purple-400/30 text-white flex flex-col items-start gap-1 transition-all transform hover:-translate-y-0.5 shadow-md shadow-purple-500/20"
          >
            <div className="flex items-center gap-1.5 font-black text-xs">
              <Plus className="w-4 h-4" />
              <span>MMCQ (Multi)</span>
            </div>
            <span className="text-[10px] text-purple-200 font-medium">Multi-select checkboxes</span>
          </button>

          {/* Add Fill in Blanks */}
          <button
            type="button"
            onClick={handleAddFillInBlanks}
            className="p-3 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/30 text-white flex flex-col items-start gap-1 transition-all transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/20"
          >
            <div className="flex items-center gap-1.5 font-black text-xs">
              <Plus className="w-4 h-4" />
              <span>Fill in Blanks</span>
            </div>
            <span className="text-[10px] text-emerald-200 font-medium">Sentence slots & word bank</span>
          </button>

          {/* Add Match the Following */}
          <button
            type="button"
            onClick={handleAddMatchFollowing}
            className="p-3 rounded-2xl bg-amber-600/90 hover:bg-amber-600 border border-amber-400/30 text-white flex flex-col items-start gap-1 transition-all transform hover:-translate-y-0.5 shadow-md shadow-amber-500/20"
          >
            <div className="flex items-center gap-1.5 font-black text-xs">
              <Plus className="w-4 h-4" />
              <span>Match Following</span>
            </div>
            <span className="text-[10px] text-amber-200 font-medium">Column A to Column B pairs</span>
          </button>

          {/* Add Step Ordering / Jumbled Steps */}
          <button
            type="button"
            onClick={handleAddStepOrdering}
            className="p-3 rounded-2xl bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-400/30 text-white flex flex-col items-start gap-1 transition-all transform hover:-translate-y-0.5 shadow-md shadow-indigo-500/20 col-span-2 sm:col-span-1"
          >
            <div className="flex items-center gap-1.5 font-black text-xs">
              <Plus className="w-4 h-4" />
              <span>Sequence Ordering</span>
            </div>
            <span className="text-[10px] text-indigo-200 font-medium">Paragraphs, steps & events</span>
          </button>
        </div>
      </div>

      {/* Questions List Builder */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 text-slate-900 transition-all hover:border-slate-300"
          >
            {/* Question Card Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>

                {/* Question Type Tag */}
                {q.type === 'mcq' && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 text-xs font-extrabold">
                    MCQ (Single Choice)
                  </span>
                )}
                {q.type === 'mmcq' && (
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 text-xs font-extrabold">
                    MMCQ (Multiple Correct)
                  </span>
                )}
                {q.type === 'fill_in_blanks' && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                    Fill in the Blanks
                  </span>
                )}
                {q.type === 'match_following' && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold">
                    Match the Following
                  </span>
                )}
                {q.type === 'step_ordering' && (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-extrabold flex items-center gap-1">
                    <ListOrdered className="w-3.5 h-3.5" />
                    Sequence & Step Ordering
                  </span>
                )}
              </div>

              {/* Marks and Re-order / Delete actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600">Marks:</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={q.marks}
                    onChange={(e) =>
                      handleUpdateQuestion(q.id, { marks: Number(e.target.value) || 1 })
                    }
                    className="w-12 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-black text-slate-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveQuestion(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4 text-slate-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveQuestion(idx, 'down')}
                  disabled={idx === questions.length - 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicateQuestion(q.id)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                  title="Duplicate Question"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Question Statement / Instructions Prompt
              </label>
              <textarea
                rows={2}
                value={q.prompt}
                onChange={(e) => handleUpdateQuestion(q.id, { prompt: e.target.value })}
                placeholder="Enter question statement, instructions, or scenario description..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 1. MCQ BUILDER */}
            {q.type === 'mcq' && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Multiple Choice Options (Select radio for correct answer)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddOption(q.id)}
                    className="text-xs text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {q.options?.map((opt, optIdx) => {
                    const isCorrect = q.correctOptionIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                          isCorrect
                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={isCorrect}
                          onChange={() => handleUpdateQuestion(q.id, { correctOptionIndex: optIdx })}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="w-5 text-xs font-bold text-slate-500">
                          {String.fromCharCode(65 + optIdx)})
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const copy = [...(q.options || [])];
                            copy[optIdx] = e.target.value;
                            handleUpdateQuestion(q.id, { options: copy });
                          }}
                          className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(q.id, optIdx)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. MMCQ BUILDER */}
            {q.type === 'mmcq' && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700">
                      Multi-Select Options (Check boxes for ALL correct answers)
                    </span>
                    <span className="text-[10px] text-purple-700 font-semibold block">
                      {q.correctOptionIndices?.length || 0} Correct options selected
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddOption(q.id)}
                    className="text-xs text-purple-600 font-bold hover:text-purple-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Choice</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {q.options?.map((opt, optIdx) => {
                    const isCorrect = q.correctOptionIndices?.includes(optIdx) || false;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                          isCorrect
                            ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-400'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isCorrect}
                          onChange={() => handleToggleMMCQCorrect(q.id, optIdx)}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="w-5 text-xs font-bold text-slate-500">
                          {String.fromCharCode(65 + optIdx)})
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const copy = [...(q.options || [])];
                            copy[optIdx] = e.target.value;
                            handleUpdateQuestion(q.id, { options: copy });
                          }}
                          className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(q.id, optIdx)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. FILL IN THE BLANKS BUILDER */}
            {q.type === 'fill_in_blanks' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Blank Slots Manager (Prefix + Correct Drop Answer + Suffix)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddBlankSlot(q.id)}
                    className="text-xs text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Blank Slot</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {q.blankSlots?.map((slot, sIdx) => (
                    <div
                      key={slot.id}
                      className="p-3 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-800">
                          {slot.label || `Blank #${sIdx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBlankSlot(q.id, slot.id)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Prefix (Text before blank)
                          </label>
                          <input
                            type="text"
                            value={slot.sentencePrefix}
                            onChange={(e) => {
                              const updatedSlots = q.blankSlots?.map((s) =>
                                s.id === slot.id ? { ...s, sentencePrefix: e.target.value } : s
                              );
                              handleUpdateQuestion(q.id, { blankSlots: updatedSlots });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-emerald-800 mb-0.5">
                            ★ Correct Answer (Target)
                          </label>
                          <input
                            type="text"
                            value={slot.correctAnswer}
                            onChange={(e) => {
                              const updatedSlots = q.blankSlots?.map((s) =>
                                s.id === slot.id ? { ...s, correctAnswer: e.target.value } : s
                              );
                              handleUpdateQuestion(q.id, { blankSlots: updatedSlots });
                            }}
                            className="w-full px-2.5 py-1.5 bg-emerald-100 border border-emerald-400 rounded-lg text-xs font-bold text-emerald-950"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Suffix (Text after blank)
                          </label>
                          <input
                            type="text"
                            value={slot.sentenceSuffix || ''}
                            onChange={(e) => {
                              const updatedSlots = q.blankSlots?.map((s) =>
                                s.id === slot.id ? { ...s, sentenceSuffix: e.target.value } : s
                              );
                              handleUpdateQuestion(q.id, { blankSlots: updatedSlots });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Word Bank Pool Chips */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Word Bank Options (Comma-separated distractor pool for students)
                  </label>
                  <input
                    type="text"
                    value={q.blankOptions?.join(', ') || ''}
                    onChange={(e) => {
                      const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      handleUpdateQuestion(q.id, { blankOptions: list });
                    }}
                    placeholder="e.g. speed of light (c), perpendicular, parallel, wavelength, mgh"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* 4. MATCH THE FOLLOWING BUILDER */}
            {q.type === 'match_following' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Column A ➔ Column B Matching Pairs
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddMatchingPair(q.id)}
                    className="text-xs text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pair</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {q.matchingPairs?.map((pair, pIdx) => (
                    <div
                      key={pair.id}
                      className="p-3 bg-amber-50/40 rounded-2xl border border-amber-200 flex items-center gap-3 text-xs"
                    >
                      <span className="font-extrabold text-amber-900 w-6">#{pIdx + 1}</span>

                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Column A (Left Item)
                        </label>
                        <input
                          type="text"
                          value={pair.leftText}
                          onChange={(e) => {
                            const updatedPairs = q.matchingPairs?.map((p) =>
                              p.id === pair.id ? { ...p, leftText: e.target.value } : p
                            );
                            handleUpdateQuestion(q.id, { matchingPairs: updatedPairs });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <span className="text-slate-400 font-black text-sm pt-4">➔</span>

                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-amber-900 mb-0.5">
                          Column B (Exact Matching Pair)
                        </label>
                        <input
                          type="text"
                          value={pair.rightText}
                          onChange={(e) => {
                            const updatedPairs = q.matchingPairs?.map((p) =>
                              p.id === pair.id ? { ...p, rightText: e.target.value } : p
                            );
                            handleUpdateQuestion(q.id, { matchingPairs: updatedPairs });
                          }}
                          className="w-full px-2.5 py-1.5 bg-amber-100 border border-amber-400 rounded-lg text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMatchingPair(q.id, pair.id)}
                        className="p-1 text-slate-400 hover:text-red-500 pt-4"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SEQUENCE & STEP ORDERING BUILDER (Universal for all subjects) */}
            {q.type === 'step_ordering' && (
              <div className="space-y-4 pt-2">
                {/* Correct Sequential Steps */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ListOrdered className="w-4 h-4 text-indigo-600" />
                        Correct Sequence / Paragraph Order (#1 to #{q.orderedSteps?.length || 0})
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Enter the correct chronological/logical sequence (paragraphs, solution steps, scientific processes, historical timeline, algorithm steps, etc.)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddStepOrderingStep(q.id)}
                      className="text-xs text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Step / Paragraph</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {q.orderedSteps?.map((stepText, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-200 flex items-center gap-2.5 text-xs"
                      >
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          #{sIdx + 1}
                        </div>

                        <div className="flex-1">
                          <input
                            type="text"
                            value={stepText}
                            onChange={(e) =>
                              handleUpdateStepOrderingStep(q.id, sIdx, e.target.value)
                            }
                            placeholder={`Item / Step ${sIdx + 1}: Enter paragraph, sentence, step, or equation...`}
                            className="w-full px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        {/* Step Move Up/Down and Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveStepOrderingStep(q.id, sIdx, 'up')}
                            disabled={sIdx === 0}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 text-slate-600"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMoveStepOrderingStep(q.id, sIdx, 'down')}
                            disabled={sIdx === (q.orderedSteps?.length || 0) - 1}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 text-slate-600"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveStepOrderingStep(q.id, sIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-500"
                            title="Delete Item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distractor (Incorrect / Confusing Steps) */}
                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Distractor / False Choices (Optional — to test & challenge students)
                      </span>
                      <p className="text-[10px] text-amber-800/80">
                        Students must identify and avoid selecting these wrong steps, false paragraphs, or irrelevant events.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddDistractorStep(q.id)}
                      className="text-xs text-amber-800 font-bold hover:text-amber-900 flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Distractor</span>
                    </button>
                  </div>

                  {(!q.distractorSteps || q.distractorSteps.length === 0) ? (
                    <p className="text-xs text-amber-700 italic bg-white/70 p-2.5 rounded-xl border border-amber-200">
                      No distractors added yet. Click "+ Add Distractor" to add wrong choices or false paragraphs.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {q.distractorSteps.map((distText, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center gap-2 text-xs"
                        >
                          <span className="font-extrabold text-amber-700 px-2 py-0.5 bg-amber-100 rounded text-[10px] shrink-0">
                            Distractor #{dIdx + 1}
                          </span>

                          <input
                            type="text"
                            value={distText}
                            onChange={(e) =>
                              handleUpdateDistractorStep(q.id, dIdx, e.target.value)
                            }
                            placeholder="Enter distractor step, irrelevant paragraph, or false conclusion..."
                            className="flex-1 px-2.5 py-1 bg-amber-50/40 border border-amber-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveDistractorStep(q.id, dIdx)}
                            className="p-1 text-slate-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Explanation / Model Note */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Solution Explanation / Concept Note (Shown to student after quiz is published)
              </label>
              <input
                type="text"
                value={q.explanation || ''}
                onChange={(e) => handleUpdateQuestion(q.id, { explanation: e.target.value })}
                placeholder="Explain the step-by-step reasoning or mathematical theorem..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Save & Launch Floating Bar */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="font-bold text-slate-900">{questions.length} Questions</span>
          <span>•</span>
          <span className="font-bold text-blue-600">{totalCalculatedMarks} Total Marks</span>
          <span>•</span>
          <span className="font-semibold text-slate-600">
            {durationSeconds > 0 ? `${Math.floor(durationSeconds / 60)} Mins` : 'Untimed'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('online-class-assessments')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSaveToBank(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Assessment</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndLaunchLive}
            className="px-5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Save & Share in Live Class</span>
          </button>
        </div>
      </div>

      {/* Student Interactive Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
            <div className="p-4 bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl shadow-md">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">{title || 'Assessment Preview'}</h3>
                  <p className="text-xs text-slate-300">
                    {subject} • {totalCalculatedMarks} Marks • {questions.length} Questions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">Question {idx + 1}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {q.type}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                      {q.marks} Marks
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900">{q.prompt}</p>

                  {/* MCQ Preview */}
                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 cursor-pointer hover:border-blue-400 text-xs font-medium text-slate-800"
                        >
                          <input type="radio" name={`prev-q-${q.id}`} className="w-4 h-4 text-blue-600" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* MMCQ Preview */}
                  {q.type === 'mmcq' && q.options && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-purple-700 uppercase">
                        ☑️ Multi-select checkboxes:
                      </span>
                      {q.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 cursor-pointer hover:border-purple-400 text-xs font-medium text-slate-800"
                        >
                          <input type="checkbox" className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Blanks Preview */}
                  {q.type === 'fill_in_blanks' && q.blankSlots && (
                    <div className="space-y-2">
                      {q.blankSlots.map((slot) => (
                        <div key={slot.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-800">{slot.sentencePrefix}</span>
                          <input
                            type="text"
                            placeholder={`[${slot.label}]`}
                            className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900 w-36 text-center"
                          />
                          {slot.sentenceSuffix && (
                            <span className="font-medium text-slate-800">{slot.sentenceSuffix}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Match Preview */}
                  {q.type === 'match_following' && q.matchingPairs && (
                    <div className="space-y-2">
                      {q.matchingPairs.map((pair, pIdx) => (
                        <div
                          key={pIdx}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-white rounded-xl border border-slate-200 items-center text-xs"
                        >
                          <span className="font-bold text-slate-800 px-2">{pair.leftText}</span>
                          <select className="px-2.5 py-1.5 bg-blue-50 border border-blue-300 rounded-lg font-semibold text-blue-900 focus:outline-none">
                            <option value="">Select Matching Option...</option>
                            {q.matchingPairs?.map((m) => (
                              <option key={m.id} value={m.rightText}>
                                {m.rightText}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Step Ordering Preview */}
                  {q.type === 'step_ordering' && q.orderedSteps && (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                        <span className="text-[11px] font-bold text-indigo-900 block">
                          📝 Arrange Solution Steps in Logical Order:
                        </span>
                        <div className="space-y-1.5">
                          {q.orderedSteps.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center gap-2 text-xs text-slate-800"
                            >
                              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                                {sIdx + 1}
                              </span>
                              <span className="font-medium">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {q.distractorSteps && q.distractorSteps.length > 0 && (
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                          <span className="font-bold text-amber-900 block mb-1">
                            ⚠️ Distractor Steps (Mixed into pool to challenge students):
                          </span>
                          <ul className="list-disc list-inside text-amber-800 text-[11px] space-y-0.5">
                            {q.distractorSteps.map((d, dIdx) => (
                              <li key={dIdx}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
