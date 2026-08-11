import React, { useState, useEffect, useMemo } from 'react';
import { useExam } from '../context/ExamContext';
import { mockEligibleStudents } from '../data/mockData';
import { RecipientStudent, RecipientSelectionMode } from '../types';
import {
  Users,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  Save,
  Sparkles,
  Layers,
  GraduationCap,
  Eye,
  X,
  CheckSquare,
  Square,
  FileText,
} from 'lucide-react';

export const RecipientSelectionView: React.FC = () => {
  const {
    createExamFormState,
    createExamRecipientsState,
    updateCreateExamRecipientsState,
    setActiveTab,
    scheduleNewExam,
    addToast,
  } = useExam();

  // Selection Mode State (Class-wise vs Student-wise)
  const [selectionMode, setSelectionMode] = useState<RecipientSelectionMode>(
    createExamRecipientsState.selectionMode || 'class_wise'
  );

  // Class-wise State
  const [academicYear, setAcademicYear] = useState<string>(
    createExamRecipientsState.academicYear || '2025-2026'
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    createExamRecipientsState.selectedClass || 'Grade 10'
  );
  const [selectedDivision, setSelectedDivision] = useState<string>(
    createExamRecipientsState.selectedDivision || 'Division A'
  );

  // Student-wise State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    createExamRecipientsState.selectedStudentIds || ['st-rec-101', 'st-rec-102', 'st-rec-103', 'st-rec-104']
  );

  // Roster Modal & Validation State
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state to ExamContext
  useEffect(() => {
    updateCreateExamRecipientsState({
      selectionMode,
      academicYear,
      selectedClass,
      selectedDivision,
      selectedStudentIds,
    });
  }, [selectionMode, academicYear, selectedClass, selectedDivision, selectedStudentIds]);

  // Compute matching students for Class-wise selection
  const classWiseStudents = useMemo(() => {
    return mockEligibleStudents.filter((st) => {
      const yearMatch = st.academicYear === academicYear;
      const classMatch = st.class === selectedClass;
      const divMatch = selectedDivision === 'all' || st.division === selectedDivision;
      return yearMatch && classMatch && divMatch;
    });
  }, [academicYear, selectedClass, selectedDivision]);

  // Compute filtered search results for Student-wise selection
  const studentWiseSearchResults = useMemo(() => {
    return mockEligibleStudents.filter((st) => {
      const matchesSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.division.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClassFilter = filterClass === 'all' || st.class === filterClass;
      const matchesDivFilter = filterDivision === 'all' || st.division === filterDivision;

      return matchesSearch && matchesClassFilter && matchesDivFilter;
    });
  }, [searchQuery, filterClass, filterDivision]);

  // Total active targeted students based on selection mode
  const activeRecipientCount = useMemo(() => {
    if (selectionMode === 'class_wise') {
      return classWiseStudents.length;
    } else {
      return selectedStudentIds.length;
    }
  }, [selectionMode, classWiseStudents, selectedStudentIds]);

  // Student-wise multi-select handlers
  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
    setValidationError(null);
  };

  const handleSelectAllMatching = () => {
    const matchingIds = studentWiseSearchResults.map((s) => s.id);
    const combined = Array.from(new Set([...selectedStudentIds, ...matchingIds]));
    setSelectedStudentIds(combined);
    setValidationError(null);
    addToast('Select All Applied', `Selected ${matchingIds.length} matching students.`, 'info');
  };

  const handleDeselectAll = () => {
    setSelectedStudentIds([]);
    addToast('Selection Cleared', 'Deselected all individual students.', 'info');
  };

  // Validation function
  const validateRecipients = (): boolean => {
    if (activeRecipientCount === 0) {
      const msg =
        selectionMode === 'class_wise'
          ? 'No eligible students found in the selected Academic Year, Class, and Division criteria.'
          : 'No recipients selected. Please search and select at least one student before continuing.';
      setValidationError(msg);
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Save as Draft Handler
  const handleSaveAsDraft = () => {
    addToast('Draft Saved', `Saved recipient selection with ${activeRecipientCount} targeted students.`, 'success');
  };

  // Continue to Step 3 Handler
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateRecipients()) {
      addToast(
        'Recipient Selection Saved',
        `Targeted ${activeRecipientCount} students. Advancing to Step 3: Academic Mapping`,
        'success'
      );
      setActiveTab('create-exam-academic');
    } else {
      addToast('Validation Error', 'Please select at least one recipient student before continuing.', 'danger');
    }
  };

  // Preset Controls for Demo Testing
  const loadPreset = (preset: 'class' | 'student' | 'error' | 'clear') => {
    setIsSubmitted(false);
    setValidationError(null);

    if (preset === 'class') {
      setSelectionMode('class_wise');
      setAcademicYear('2025-2026');
      setSelectedClass('Grade 10');
      setSelectedDivision('Division A');
      addToast('Preset Loaded', 'Class-wise selection: Grade 10 — Division A', 'info');
    } else if (preset === 'student') {
      setSelectionMode('student_wise');
      setSelectedStudentIds(['st-rec-101', 'st-rec-102', 'st-rec-105', 'st-rec-109', 'st-rec-112']);
      addToast('Preset Loaded', 'Student-wise selection: 5 specific candidates selected.', 'info');
    } else if (preset === 'error') {
      setSelectionMode('student_wise');
      setSelectedStudentIds([]);
      setIsSubmitted(true);
      setValidationError('No recipients selected. Please select a class/division or choose individual students before continuing.');
      addToast('Error Simulated', 'Triggered zero recipients validation error.', 'warning');
    } else if (preset === 'clear') {
      setSelectedStudentIds([]);
      setSelectedDivision('Division C'); // Division with 1 student for demo
      addToast('Selection Reset', 'Recipient selections cleared.', 'info');
    }
  };

  const creationSteps = [
    { num: 1, label: 'Exam Type & Basic Details', active: false, done: true },
    { num: 2, label: 'Recipient Selection', active: true, done: false },
    { num: 3, label: 'Academic Mapping', active: false, done: false },
    { num: 4, label: 'Question Source', active: false, done: false },
    { num: 5, label: 'Question & Marks', active: false, done: false },
    { num: 6, label: 'Review & Publish', active: false, done: false },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveTab('create-exam-basic')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 1 — Exam Basic Details</span>
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Create Online Examination — Step 2: Recipient Selection
          </h2>
          <p className="text-xs text-slate-500">
            Define target exam candidates using Class-wise academic hierarchy or individual Student-wise selection
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
            onClick={() => setActiveTab('create-exam-basic')}
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
            onClick={() => loadPreset('class')}
            className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Class-wise (Grade 10 Div A)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('student')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Preset: Student-wise (5 Selected)
          </button>

          <button
            type="button"
            onClick={() => loadPreset('error')}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs"
          >
            Simulate Zero Recipients Error
          </button>

          <button
            type="button"
            onClick={() => loadPreset('clear')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
          >
            Reset Selection
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

      {/* Preserved Step 1 Exam Summary Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Step 1 Preserved Exam</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black bg-blue-100 text-blue-900">
                {createExamFormState.examType} test
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900">{createExamFormState.examName || 'Grade 10 Mathematics Assessment'}</h3>
            <p className="text-xs text-slate-500 font-mono">
              Code: {createExamFormState.examCode || 'MAT-G10-2026-001'} • Duration: {createExamFormState.durationMinutes} mins • Total Marks: {createExamFormState.totalMarks} (Pass: {createExamFormState.passMarks})
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('create-exam-basic')}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          Edit Basic Details
        </button>
      </div>

      {/* Global Validation Error Banner */}
      {(isSubmitted || validationError) && validationError && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-xs flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Validation Error — No Recipients Selected:</h4>
            <p className="font-semibold text-red-800 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleContinue} className="space-y-6">
        {/* SECTION 1: SELECTION MODE SWITCH */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              1. Choose Recipient Selection Mode <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select candidates by full Academic Class & Division hierarchy or search and choose individual students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Mode Option A: Class-wise */}
            <div
              onClick={() => {
                setSelectionMode('class_wise');
                setValidationError(null);
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectionMode === 'class_wise'
                  ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      selectionMode === 'class_wise' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Class-wise Selection</h4>
                    <p className="text-xs text-slate-500">Academic Year → Class → Division</p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="selectionMode"
                  checked={selectionMode === 'class_wise'}
                  onChange={() => setSelectionMode('class_wise')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                />
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Automatically assigns the examination to all eligible students enrolled in the selected Academic Year, Class, and Division.
              </p>
            </div>

            {/* Mode Option B: Student-wise */}
            <div
              onClick={() => {
                setSelectionMode('student_wise');
                setValidationError(null);
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectionMode === 'student_wise'
                  ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      selectionMode === 'student_wise' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Student-wise Selection</h4>
                    <p className="text-xs text-slate-500">Search & Multi-Select Candidates</p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="selectionMode"
                  checked={selectionMode === 'student_wise'}
                  onChange={() => setSelectionMode('student_wise')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1"
                />
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Search individual students across classes and select multiple specific candidates with name, admission number, and class metadata.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CLASS-WISE SELECTION CONTROLS */}
        {selectionMode === 'class_wise' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  2. Class-wise Hierarchy Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Select Academic Year, Target Class, and Division to target all enrolled students
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Academic Year Dropdown */}
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

              {/* Target Class Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Target Class <span className="text-red-500">*</span>
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

              {/* Target Division Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Target Division <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Division A">Division A</option>
                  <option value="Division B">Division B</option>
                  <option value="Division C">Division C</option>
                  <option value="all">All Divisions (Entire Grade)</option>
                </select>
              </div>
            </div>

            {/* Calculated Eligible Students Summary Box */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                      Target Population Resolved:
                    </span>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-950 font-extrabold text-[11px] rounded-full">
                      {classWiseStudents.length} Students
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">
                    {academicYear} • {selectedClass} • {selectedDivision === 'all' ? 'All Divisions' : selectedDivision} — All eligible candidates will be registered.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRosterModal(true)}
                className="px-4 py-2 bg-white hover:bg-blue-50 border border-blue-300 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Student Roster ({classWiseStudents.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: STUDENT-WISE SEARCH & SELECTION TABLE */}
        {selectionMode === 'student_wise' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  2. Student Search & Multi-Select Table
                </h3>
                <p className="text-xs text-slate-500">
                  Search by student name or admission number, and check individual candidates to assign the exam
                </p>
              </div>

              {/* Batch Actions Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllMatching}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Select All Matching</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Search Input Bar & Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student by name, admission no, or division..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">Filter Class: All</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <select
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">Filter Division: All</option>
                  <option value="Division A">Division A</option>
                  <option value="Division B">Division B</option>
                  <option value="Division C">Division C</option>
                </select>
              </div>
            </div>

            {/* Student Search Results Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3 text-center w-12">Select</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Admission Number</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">Division</th>
                      <th className="p-3 text-center">Selection State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {studentWiseSearchResults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          <p className="font-bold">No matching students found.</p>
                          <p className="text-[11px]">Try adjusting your search term or filter dropdowns.</p>
                        </td>
                      </tr>
                    ) : (
                      studentWiseSearchResults.map((st) => {
                        const isSelected = selectedStudentIds.includes(st.id);
                        return (
                          <tr
                            key={st.id}
                            onClick={() => handleToggleStudent(st.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50/70 hover:bg-blue-100/70' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleStudent(st.id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={st.photoUrl}
                                  alt={st.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{st.name}</p>
                                  <p className="text-[11px] text-slate-400">{st.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-700">{st.admissionNo}</td>
                            <td className="p-3 font-bold text-slate-800">{st.class}</td>
                            <td className="p-3 font-semibold text-slate-700">{st.division}</td>
                            <td className="p-3 text-center">
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-600 text-white">
                                  <CheckCircle2 className="w-3 h-3" /> Selected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                  Unselected
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: SELECTED-RECIPIENT SUMMARY CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Selected Recipient Summary
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                activeRecipientCount > 0
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}
            >
              {activeRecipientCount} Students Targeted
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Target Assignment Mode:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 uppercase">
                  {selectionMode === 'class_wise' ? 'Class-wise Hierarchy' : 'Student-wise Search'}
                </span>
              </div>

              {selectionMode === 'class_wise' ? (
                <p className="text-xs font-bold text-slate-900">
                  Target Scope: Academic Year {academicYear} → {selectedClass} → {selectedDivision} ({classWiseStudents.length} eligible students)
                </p>
              ) : (
                <p className="text-xs font-bold text-slate-900">
                  Target Scope: {selectedStudentIds.length} Individual Students manually selected
                </p>
              )}
            </div>

            {selectionMode === 'student_wise' && selectedStudentIds.length > 0 && (
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* SECTION 5: FORM ACTION TOOLBAR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('create-exam-basic')}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 1 Basic Details</span>
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
              <span>Continue to Step 3: Academic Mapping</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* ROSTER PREVIEW MODAL */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold">Class Roster Preview — {selectedClass} ({selectedDivision})</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              <p className="text-xs text-slate-500">
                Below is the complete list of {classWiseStudents.length} eligible students enrolled in Academic Year {academicYear}, {selectedClass}, {selectedDivision}.
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Admission No</th>
                      <th className="p-2.5">Division</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classWiseStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">{st.rollNo || 'N/A'}</td>
                        <td className="p-2.5 font-bold text-slate-900 flex items-center gap-2">
                          <img src={st.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span>{st.name}</span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-600">{st.admissionNo}</td>
                        <td className="p-2.5">{st.division}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                            Eligible & Enrolled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
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
