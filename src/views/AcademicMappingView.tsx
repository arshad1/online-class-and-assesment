import React, { useState, useEffect, useMemo } from 'react';
import { useExam } from '../context/ExamContext';
import { mockSubjectChapters } from '../data/mockData';
import { SubjectChapterItem } from '../types';
import {
  BookOpen,
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
  CheckSquare,
  Square,
  Check,
  RotateCcw,
} from 'lucide-react';

export const AcademicMappingView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    createExamAcademicMappingState,
    updateCreateExamAcademicMappingState,
    setActiveTab,
    addToast,
  } = useExam();

  // Academic Mapping Fields
  const [academicYear, setAcademicYear] = useState<string>(
    createExamAcademicMappingState.academicYear || createExamRecipientsState.academicYear || '2025-2026'
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    createExamAcademicMappingState.selectedClass || createExamRecipientsState.selectedClass || 'Grade 10'
  );
  const [selectedDivision, setSelectedDivision] = useState<string>(
    createExamAcademicMappingState.selectedDivision || createExamRecipientsState.selectedDivision || 'Division A'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(
    createExamAcademicMappingState.selectedSubject || 'Mathematics'
  );
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(
    createExamAcademicMappingState.selectedChapterIds || ['ch-math-1', 'ch-math-2', 'ch-math-3']
  );

  // Form Validation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state to ExamContext
  useEffect(() => {
    updateCreateExamAcademicMappingState({
      academicYear,
      selectedClass,
      selectedDivision,
      selectedSubject,
      selectedChapterIds,
    });
  }, [academicYear, selectedClass, selectedDivision, selectedSubject, selectedChapterIds]);

  // Available chapters for currently selected subject
  const availableChapters: SubjectChapterItem[] = useMemo(() => {
    return mockSubjectChapters[selectedSubject] || [];
  }, [selectedSubject]);

  // When subject changes, validate existing chapter selections against new subject catalog
  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    setValidationError(null);
    const newAvailable = mockSubjectChapters[newSubject] || [];
    // Auto-select first chapter of new subject by default
    if (newAvailable.length > 0) {
      setSelectedChapterIds([newAvailable[0].id]);
      addToast('Subject Selected', `Loaded chapters for ${newSubject}`, 'info');
    } else {
      setSelectedChapterIds([]);
    }
  };

  // Chapter Selection Mode Handlers (Single, Multiple, Select All)
  const handleToggleChapter = (chapterId: string) => {
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
    setValidationError(null);
  };

  const handleSelectSingleChapter = (chapterId: string) => {
    setSelectedChapterIds([chapterId]);
    setValidationError(null);
    const ch = availableChapters.find((c) => c.id === chapterId);
    addToast('Single Chapter Selected', `Selected Ch ${ch?.chapterNumber}: ${ch?.title}`, 'info');
  };

  const handleSelectAllChapters = () => {
    const allIds = availableChapters.map((c) => c.id);
    setSelectedChapterIds(allIds);
    setValidationError(null);
    addToast('Select All Applied', `All ${allIds.length} chapters selected for ${selectedSubject}`, 'success');
  };

  const handleClearChapters = () => {
    setSelectedChapterIds([]);
    addToast('Selection Cleared', 'Deselected all chapters', 'info');
  };

  // Validation function
  const validateForm = (): boolean => {
    if (!selectedSubject) {
      setValidationError('Please select an Academic Subject.');
      return false;
    }
    if (selectedChapterIds.length === 0) {
      setValidationError(`At least one chapter must be selected for ${selectedSubject}.`);
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handler: Save as Draft
  const handleSaveAsDraft = () => {
    addToast(
      'Draft Saved',
      `Saved academic mapping: ${selectedSubject} (${selectedChapterIds.length} chapters)`,
      'success'
    );
  };

  // Handler: Continue to Step 4
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      addToast(
        'Academic Mapping Saved',
        `Mapped ${selectedSubject} with ${selectedChapterIds.length} chapters. Advancing to Step 4: Question Source`,
        'success'
      );
      setActiveTab('create-exam-question-source');
    } else {
      addToast('Validation Failed', 'Please select a subject and at least one chapter before continuing.', 'danger');
    }
  };

  // Demo Presets for Testing
  const loadPreset = (preset: 'single' | 'multi' | 'all' | 'error' | 'clear') => {
    setIsSubmitted(false);
    setValidationError(null);

    if (preset === 'single') {
      setSelectedSubject('Mathematics');
      setSelectedChapterIds(['ch-math-1']);
      addToast('Preset Loaded', 'Single Chapter: Ch 1 Quadratic Equations', 'info');
    } else if (preset === 'multi') {
      setSelectedSubject('Physics');
      setSelectedChapterIds(['ch-phy-1', 'ch-phy-3']);
      addToast('Preset Loaded', 'Multiple Chapters: Ch 1 Electricity & Ch 3 Quantum Physics', 'info');
    } else if (preset === 'all') {
      setSelectedSubject('Chemistry');
      const chemIds = (mockSubjectChapters['Chemistry'] || []).map((c) => c.id);
      setSelectedChapterIds(chemIds);
      addToast('Preset Loaded', 'Select All Chapters: All 4 Chemistry Chapters', 'success');
    } else if (preset === 'error') {
      setSelectedChapterIds([]);
      setIsSubmitted(true);
      setValidationError('At least one chapter must be selected for Mathematics.');
      addToast('Error Simulated', 'Triggered 0 chapters validation error.', 'warning');
    } else if (preset === 'clear') {
      setSelectedChapterIds([]);
      addToast('Form Cleared', 'Chapter selection reset.', 'info');
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: false, done: true },
    { num: 2, label: 'Recipient Selection', active: false, done: true },
    { num: 3, label: 'Academic Mapping', active: true, done: false },
    { num: 4, label: 'Question Source', active: false, done: false },
    { num: 5, label: 'Question & Marks', active: false, done: false },
    { num: 6, label: 'Review & Publish', active: false, done: false },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 w-full font-sans">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveTab('create-exam-recipients')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 2 — Recipient Selection</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Create Online Examination — Step 3: Subject & Chapter Mapping
          </h2>
          <p className="text-xs text-slate-500">
            Map the examination to academic subject curriculum and select single, multiple, or all relevant chapters
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
            onClick={() => setActiveTab('create-exam-recipients')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Back
          </button>
        </div>
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
            onClick={() => loadPreset('single')}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Single Chapter (Math)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('multi')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Multiple Chapters (Physics)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('all')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Select All (Chemistry)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('error')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate 0 Chapters Error
          </button>

          <button
            type="button"
            onClick={() => loadPreset('clear')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            Clear Mapping
          </button>
        </div>
      </div>

      {/* 6-Step Flow Wizard Bar */}
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

      {/* Summary of Preserved Step 1 & Step 2 Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 Preserved Box */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1 Basic Details</span>
              <h4 className="text-xs font-black text-slate-900">{createExamFormState.examName || 'Grade 10 Assessment'}</h4>
              <p className="text-[11px] text-slate-500 font-mono">
                Code: {createExamFormState.examCode || 'MAT-G10-2026'} • Marks: {createExamFormState.totalMarks}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('create-exam-basic')}
            className="text-[11px] font-bold text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>

        {/* Step 2 Preserved Box */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2 Recipients</span>
              <h4 className="text-xs font-black text-slate-900">
                {createExamRecipientsState.selectionMode === 'class_wise'
                  ? `${createExamRecipientsState.selectedClass} (${createExamRecipientsState.selectedDivision})`
                  : `${createExamRecipientsState.selectedStudentIds.length} Individual Students`}
              </h4>
              <p className="text-[11px] text-slate-500">
                Year: {createExamRecipientsState.academicYear} • Target Mode: {createExamRecipientsState.selectionMode}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('create-exam-recipients')}
            className="text-[11px] font-bold text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {(isSubmitted || validationError) && validationError && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Validation Error — Academic Mapping:</h4>
            <p className="font-semibold text-red-800 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleContinue} className="space-y-6">
        {/* SECTION 1: ACADEMIC CONTEXT FIELDS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              1. Academic Structure & Subject Selection
            </h3>
            <p className="text-xs text-slate-500">
              Link the examination to Academic Year, Class, Division, and Subject
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="2025-2026">2025 - 2026 (Current)</option>
                <option value="2026-2027">2026 - 2027 (Upcoming)</option>
                <option value="2024-2025">2024 - 2025 (Previous)</option>
              </select>
            </div>

            {/* Target Class */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Division <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Division A">Division A</option>
                <option value="Division B">Division B</option>
                <option value="Division C">Division C</option>
                <option value="all">All Divisions</option>
              </select>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-blue-50 border-2 border-blue-500 rounded-xl text-xs font-black text-blue-950 focus:bg-white focus:ring-2 focus:ring-blue-600 shadow-2xs"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: SUBJECT-DRIVEN CHAPTER SELECTOR */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  2. Subject Chapter Selector ({selectedSubject})
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900">
                  {selectedChapterIds.length} of {availableChapters.length} Selected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                PRD Requirement: Supports Single Chapter selection, Multiple Chapters, or Select All Chapters
              </p>
            </div>

            {/* Selection Mode Batch Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllChapters}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Select All Chapters</span>
              </button>

              <button
                type="button"
                onClick={handleClearChapters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Chapter Items List / Grid */}
          <div className="grid grid-cols-1 gap-3">
            {availableChapters.map((ch) => {
              const isSelected = selectedChapterIds.includes(ch.id);
              return (
                <div
                  key={ch.id}
                  onClick={() => handleToggleChapter(ch.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {/* Interactive Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleChapter(ch.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer mt-0.5"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-black bg-slate-200 text-slate-800">
                            Chapter {ch.chapterNumber}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{ch.title}</h4>
                        </div>
                        {ch.description && (
                          <p className="text-xs text-slate-600 mt-1 leading-snug">{ch.description}</p>
                        )}
                        {ch.topicCount && (
                          <p className="text-[11px] text-slate-400 font-medium mt-1">
                            {ch.topicCount} curriculum topics included
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons: Select Only / Status Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSingleChapter(ch.id);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-700 rounded-lg shadow-2xs transition-colors"
                        title="Select only this single chapter"
                      >
                        Select Only This
                      </button>

                      {isSelected && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-600 text-white flex items-center gap-1">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: SELECTED ACADEMIC MAPPING SUMMARY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Selected Curriculum Scope Summary
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                selectedChapterIds.length > 0
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}
            >
              {selectedChapterIds.length} Chapters Mapped
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Mapped Subject:</span>
              <span className="px-3 py-1 rounded-lg text-xs font-black bg-blue-600 text-white uppercase">
                {selectedSubject}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Selected Chapters ({selectedChapterIds.length}):</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedChapterIds.length === 0 ? (
                  <span className="text-xs text-red-600 font-semibold italic">None selected</span>
                ) : (
                  availableChapters
                    .filter((c) => selectedChapterIds.includes(c.id))
                    .map((c) => (
                      <span
                        key={c.id}
                        className="px-2.5 py-1 bg-white border border-blue-300 text-blue-900 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        Ch {c.chapterNumber}: {c.title}
                      </span>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: FORM ACTION TOOLBAR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('create-exam-recipients')}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 2 Recipients</span>
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
              <span>Continue to Step 4: Question Source</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
