import React from 'react';
import { useExam } from '../../context/ExamContext';
import { X, Award, CheckCircle2, Building2, Printer, Download } from 'lucide-react';

export const StudentReportCardModal: React.FC = () => {
  const { selectedStudentResultPreview, setSelectedStudentResultPreview } = useExam();

  if (!selectedStudentResultPreview) return null;

  const sub = selectedStudentResultPreview;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Official Student Result Sheet Preview</h2>
              <p className="text-xs text-slate-400">
                Preview exact report sheet displayed on candidate portal after publishing
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedStudentResultPreview(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Report Card Content */}
        <div className="p-8 space-y-6 bg-white printable-area">
          {/* School Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="flex items-center justify-center gap-2 text-blue-900 font-extrabold text-lg tracking-wide uppercase">
              <Building2 className="w-6 h-6 text-blue-700" />
              St. Xavier's International Academy
            </div>
            <p className="text-xs text-slate-600 font-semibold">
              Department of Examinations & Academic Assessment • AY 2025-2026
            </p>
            <p className="text-[11px] text-slate-400">Official Report of Examination Performance</p>
          </div>

          {/* Student Profile Info Grid */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Student Name</span>
              <strong className="text-slate-900 font-bold">{sub.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Roll Number</span>
              <strong className="text-slate-900 font-bold">{sub.rollNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Class & Section</span>
              <strong className="text-slate-900">{sub.class} ({sub.section})</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Examination</span>
              <strong className="text-slate-900">{sub.examTitle}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Evaluator</span>
              <strong className="text-slate-900">{sub.evaluator}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Publish Status</span>
              <strong
                className={`font-bold ${
                  sub.publishStatus === 'published' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {sub.publishStatus.toUpperCase()}
              </strong>
            </div>
          </div>

          {/* Marks Breakdown Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Section Category</th>
                  <th className="p-3 text-right">Max Marks</th>
                  <th className="p-3 text-right">Marks Obtained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="p-3 font-semibold">Section A: Objective Questions (MCQs)</td>
                  <td className="p-3 text-right font-medium">25</td>
                  <td className="p-3 text-right font-bold text-blue-700">{sub.objectiveMarks}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Section B & C: Subjective Analytical Questions</td>
                  <td className="p-3 text-right font-medium">75</td>
                  <td className="p-3 text-right font-bold text-blue-700">{sub.subjectiveMarks}</td>
                </tr>
                <tr className="bg-blue-50/80 font-bold text-slate-900">
                  <td className="p-3">Grand Total</td>
                  <td className="p-3 text-right">{sub.maxMarks}</td>
                  <td className="p-3 text-right text-sm text-blue-900">{sub.totalMarks}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Final Result Metrics Stamp */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Percentage Score</span>
              <span className="text-2xl font-black text-blue-400">{sub.percentage}%</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Grade Awarded</span>
              <span className="text-2xl font-black text-amber-400">{sub.grade}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Final Status</span>
              <span
                className={`text-sm font-black px-3 py-1 rounded-lg uppercase inline-block mt-1 ${
                  sub.resultStatus === 'pass' ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                }`}
              >
                {sub.resultStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Teacher Feedback Note */}
          {sub.teacherFeedback && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-900 block">Teacher Remarks & Guidance:</span>
              <p className="text-amber-950 leading-relaxed font-sans">{sub.teacherFeedback}</p>
            </div>
          )}

          {/* Verification Barcode / Signature */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Digital Certificate ID: EXAM-VER-99812</p>
              <p>Verified by EduExam Pro SaaS Engine</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">Prof. Sarah Jenkins</p>
              <p className="text-slate-500">Head of Examination Board</p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report Sheet</span>
            </button>
            <button
              onClick={() => setSelectedStudentResultPreview(null)}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedStudentResultPreview(null)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
          >
            Close Report Preview
          </button>
        </div>
      </div>
    </div>
  );
};
