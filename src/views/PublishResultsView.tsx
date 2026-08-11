import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { StudentSubmission } from '../types';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Send,
  Download,
  Printer,
  FileSpreadsheet,
  Settings,
  BarChart2,
  PieChart,
  Calendar,
  Check,
  Building2,
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

export const PublishResultsView: React.FC = () => {
  const {
    studentSubmissions,
    setSelectedStudentResultPreview,
    setShowPublishConfirmationModal,
    resultSettings,
    updateResultSettings,
    addToast,
    scheduledExams,
    selectedExamId,
  } = useExam();

  const [searchTerm, setSearchTerm] = useState('');
  const [publishFilter, setPublishFilter] = useState('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const totalStudents = 45;
  const passedCount = studentSubmissions.filter((s) => s.resultStatus === 'pass').length + 34;
  const failedCount = studentSubmissions.filter((s) => s.resultStatus === 'fail').length + 3;
  const absentCount = studentSubmissions.filter((s) => s.resultStatus === 'absent').length;
  const avgMarks = 76.8;
  const highestMarks = 98;
  const lowestMarks = 32;

  const currentExam = scheduledExams.find((e) => e.id === selectedExamId) || scheduledExams[0];

  // Recharts Chart Data
  const gradeDistributionData = [
    { grade: 'A+', count: 8, color: '#10b981' },
    { grade: 'A', count: 14, color: '#06b6d4' },
    { grade: 'B+', count: 12, color: '#3b82f6' },
    { grade: 'B', count: 5, color: '#6366f1' },
    { grade: 'C', count: 2, color: '#f59e0b' },
    { grade: 'D', count: 1, color: '#orange-500' },
    { grade: 'F', count: 3, color: '#ef4444' },
  ];

  const passFailData = [
    { name: 'Passed', value: passedCount, color: '#10b981' },
    { name: 'Failed', value: failedCount, color: '#ef4444' },
    { name: 'Absent', value: absentCount, color: '#64748b' },
  ];

  const filteredSubmissions = studentSubmissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.rollNo.includes(searchTerm);
    const matchesFilter = publishFilter === 'all' || sub.publishStatus === publishFilter;
    return matchesSearch && matchesFilter;
  });

  const handleExportExcel = () => {
    const csvHeader = 'Roll No,Student Name,Class,Section,Objective Marks,Subjective Marks,Total Marks,Percentage,Grade,Result Status,Publish Status\n';
    const csvRows = studentSubmissions
      .map(
        (s) =>
          `"${s.rollNo}","${s.studentName}","${s.class}","${s.section}",${s.objectiveMarks},${s.subjectiveMarks},${s.totalMarks},${s.percentage}%,"${s.grade}","${s.resultStatus}","${s.publishStatus}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Result_Sheet_${currentExam?.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Excel Sheet Downloaded', 'Result spreadsheet generated successfully.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            4. Result Publishing & Analytics Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Configure passing rules, preview report cards, analyze performance & publish results
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Result Settings</span>
          </button>

          <button
            onClick={() => setShowPublishConfirmationModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            <span>Publish Results to All</span>
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Students</span>
          <p className="text-xl font-black text-slate-900 mt-1">{totalStudents}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Passed</span>
          <p className="text-xl font-black text-emerald-900 mt-1">{passedCount}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-red-200 shadow-xs bg-red-50/20">
          <span className="text-[10px] font-bold text-red-800 uppercase block">Failed</span>
          <p className="text-xl font-black text-red-900 mt-1">{failedCount}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Absent</span>
          <p className="text-xl font-black text-slate-700 mt-1">{absentCount}</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-blue-200 shadow-xs bg-blue-50/20">
          <span className="text-[10px] font-bold text-blue-900 uppercase block">Average Marks</span>
          <p className="text-xl font-black text-blue-950 mt-1">{avgMarks}%</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs bg-amber-50/20">
          <span className="text-[10px] font-bold text-amber-900 uppercase block">Highest Marks</span>
          <p className="text-xl font-black text-amber-950 mt-1">{highestMarks} / 100</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              Score & Grade Band Distribution Analytics
            </h3>
            <span className="text-[11px] text-slate-500">Passing Cutoff: {resultSettings.passingPercentage}%</span>
          </div>

          <div className="h-56 w-full">
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

        {/* Pass / Fail Donut Chart & Export Quick Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              Pass / Fail Ratio
            </h3>
            <span className="text-[11px] font-bold text-emerald-700">
              {Math.round((passedCount / totalStudents) * 100)}% Pass Rate
            </span>
          </div>

          {/* Donut Chart */}
          <div className="h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Export Action Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Export & Download Result Reports
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Print Result</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Result Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900">Student Exam Result Roster</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
              {filteredSubmissions.length} Candidates
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <select
              value={publishFilter}
              onChange={(e) => setPublishFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="all">All Publish Statuses</option>
              <option value="ready">Ready to Publish</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Result Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Marks Obtained</th>
                <th className="p-3.5">Max Marks</th>
                <th className="p-3.5">Percentage</th>
                <th className="p-3.5">Grade</th>
                <th className="p-3.5">Result Status</th>
                <th className="p-3.5">Publish Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={sub.avatar}
                        alt={sub.studentName}
                        className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{sub.studentName}</p>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Roll: {sub.rollNo} • {sub.section}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-extrabold text-blue-900">
                    {sub.totalMarks}
                  </td>

                  <td className="p-3.5 font-semibold text-slate-600">
                    {sub.maxMarks}
                  </td>

                  <td className="p-3.5 font-black text-slate-900">
                    {sub.percentage}%
                  </td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 font-bold rounded bg-slate-100 text-slate-800">
                      {sub.grade}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase inline-block ${
                        sub.resultStatus === 'pass'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : sub.resultStatus === 'fail'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sub.resultStatus}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase inline-block ${
                        sub.publishStatus === 'published'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : sub.publishStatus === 'ready'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sub.publishStatus}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => setSelectedStudentResultPreview(sub)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Report Sheet</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Settings Configurator Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Result Publishing Preferences</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Passing Percentage (%)</label>
                <input
                  type="number"
                  value={resultSettings.passingPercentage}
                  onChange={(e) => updateResultSettings({ passingPercentage: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-800">Student Portal Visibility Toggles</label>
                {[
                  { key: 'showMarksToStudents', label: 'Show Marks Obtained to Students' },
                  { key: 'showPercentage', label: 'Show Percentage Score' },
                  { key: 'showGrade', label: 'Show Letter Grade (A+, A, B...)' },
                  { key: 'showAnswerSheet', label: 'Show Submitted Answer Sheet' },
                  { key: 'showCorrectAnswers', label: 'Show Correct Answer Keys' },
                  { key: 'showTeacherFeedback', label: 'Show Teacher Remarks & Feedback' },
                  { key: 'showRank', label: 'Show Class Rank Position' },
                ].map((t) => (
                  <label key={t.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <span className="font-semibold text-slate-800">{t.label}</span>
                    <input
                      type="checkbox"
                      checked={resultSettings[t.key as keyof typeof resultSettings] as boolean}
                      onChange={(e) => updateResultSettings({ [t.key]: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
