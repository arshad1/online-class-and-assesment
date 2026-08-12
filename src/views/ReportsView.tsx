import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useExam } from '../context/ExamContext';

export const ReportsView: React.FC = () => {
  const { addToast } = useExam();
  const [selectedReport, setSelectedReport] = useState<string>('summary');

  const reportTypes = [
    { id: 'summary', title: 'Exam Malpractice Summary', desc: 'High-level executive integrity overview' },
    { id: 'student-risk', title: 'Student Risk Report', desc: 'Individual candidate risk score rankings' },
    { id: 'violation-type', title: 'Violation Type Analysis', desc: 'Computer vision & audio model breakdown' },
    { id: 'proctor-review', title: 'Proctor Review Report', desc: 'Auditor decision outcomes & false positives' },
    { id: 'similarity', title: 'Answer Similarity Report', desc: 'NLP collusion & identical error statistics' },
    { id: 'technical', title: 'Technical Issues Report', desc: 'Bandwidth, disconnects & camera failures' },
    { id: 'full-audit', title: 'Full Audit Trail Report', desc: 'Immutable chronological event log' },
  ];

  const handleExport = (format: string) => {
    addToast(
      `Exporting ${format.toUpperCase()}`,
      `Generating ${selectedReport.replace('-', ' ')} report in ${format.toUpperCase()} format...`,
      'success'
    );
    if (format === 'pdf') {
      window.print();
    }
  };

  const reviewOutcomesData = [
    { name: 'Confirmed Violations', value: 12, color: '#ef4444' },
    { name: 'Dismissed False Positives', value: 8, color: '#10b981' },
    { name: 'Warnings Issued', value: 5, color: '#f59e0b' },
    { name: 'Under Review', value: 3, color: '#2563eb' },
  ];

  const falsePositiveTrend = [
    { week: 'Week 1', rate: 14.5 },
    { week: 'Week 2', rate: 11.2 },
    { week: 'Week 3', rate: 8.4 },
    { week: 'Week 4', rate: 4.8 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Controls & Export Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-blue-600" />
            Audit & Compliance Reports Suite
          </h2>
          <p className="text-xs text-slate-500">
            Generate formal malpractice documentation for academic disciplinary boards
          </p>
        </div>

        {/* Export Buttons Stack */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Report Template Switcher & Active Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Template Selection List (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 px-2">
            Select Report Template
          </h3>
          {reportTypes.map((rpt) => (
            <button
              key={rpt.id}
              onClick={() => setSelectedReport(rpt.id)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                selectedReport === rpt.id
                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">{rpt.title}</div>
              <div className="text-[11px] text-slate-500 font-normal mt-0.5">{rpt.desc}</div>
            </button>
          ))}
        </div>

        {/* Right Active Report Analytics Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {reportTypes.find((r) => r.id === selectedReport)?.title}
                </h3>
                <p className="text-xs text-slate-500">Academic Year 2025-2026 &bull; Apex National University</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">
                ISO 27001 Compliant Audit
              </span>
            </div>

            {/* Analytics Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Review Outcomes Pie Chart */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Proctor Review Decisions</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reviewOutcomesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {reviewOutcomesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* False Positive Rate Reduction Trend */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">False-Positive Rate Trend (%)</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={falsePositiveTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* High-Risk Candidate Ranking Table */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">High-Risk Candidate Audit Table (PRD Sec 115)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Student Name</th>
                      <th className="py-2 px-3">Admission No</th>
                      <th className="py-2 px-3">Exam</th>
                      <th className="py-2 px-3">Risk Points</th>
                      <th className="py-2 px-3">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-bold">Aisha Rahman</td>
                      <td className="py-2 px-3 font-mono">2026-PHY-014</td>
                      <td className="py-2 px-3">Physics Assessment</td>
                      <td className="py-2 px-3 text-red-600 font-bold">82 pt</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded text-[10px]">Confirmed Malpractice</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold">Mohammed Farhan</td>
                      <td className="py-2 px-3 font-mono">2026-CS-088</td>
                      <td className="py-2 px-3">CS Entrance Test</td>
                      <td className="py-2 px-3 text-red-600 font-bold">74 pt</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">Under Review</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold">Kabir Patel</td>
                      <td className="py-2 px-3 font-mono">2026-CS-130</td>
                      <td className="py-2 px-3">CS Entrance Test</td>
                      <td className="py-2 px-3 text-red-600 font-bold">62 pt</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">Under Review</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* PRD SEC 122 & 125: Immutable System Governance Audit Log Table */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Institutional Governance Audit Log (PRD Sec 122)
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">System Hash: sha256:8f92a1...</span>
              </div>
              <div className="bg-slate-950 text-slate-200 rounded-xl p-3 font-mono text-[11px] space-y-2 overflow-x-auto">
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-emerald-400">[2026-08-12 11:45:18] ROLE_SWITCH</span>
                  <span className="text-slate-300">User: Admin • Role changed to Coordinator</span>
                  <span className="text-slate-500">IP: 192.168.1.104</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-blue-400">[2026-08-12 11:38:05] EXAM_VALIDATED</span>
                  <span className="text-slate-300">Exam 'Grade 10 Midterm' verified section equivalence</span>
                  <span className="text-slate-500">IP: 192.168.1.104</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-amber-400">[2026-08-12 11:14:22] WARNING_DISPATCHED</span>
                  <span className="text-slate-300">Proctor issued warning to candidate Aisha Rahman</span>
                  <span className="text-slate-500">IP: 192.168.1.104</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
