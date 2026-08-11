import React, { useState } from 'react';
import { Clock, Search, Filter, Eye, ShieldAlert, CheckCircle } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export const ExamSessionsView: React.FC = () => {
  const { students, setActiveTab } = useExam();
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate session ID, name, admission no..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
        <span className="text-xs font-bold text-slate-600">Showing {students.length} completed sessions</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Exam Title</th>
                <th className="py-3 px-4">Login / Submit Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Total Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">SES-2026-09{idx + 1}</td>
                  <td className="py-3 px-4 font-bold">{st.name}</td>
                  <td className="py-3 px-4 text-slate-600">{st.currentExam}</td>
                  <td className="py-3 px-4 text-slate-500">{st.loginTime} — 15:48:00</td>
                  <td className="py-3 px-4 font-mono text-slate-600">1h 48m</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold ${st.riskScore >= 50 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                      +{st.riskScore} pt
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold text-slate-700">{st.status.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveTab('exam-sessions')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-xs"
                    >
                      Audit Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
