import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, AlertTriangle, Eye, Sliders, Laptop } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export const StudentsRosterView: React.FC = () => {
  const { students, setSelectedStudent } = useExam();
  const [search, setSearch] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, admission ID, department..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
        <span className="text-xs font-bold text-slate-600">{filtered.length} candidates registered</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Class / Dept</th>
                <th className="py-3 px-4">Active Exam</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Workstation Specs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img src={st.photoUrl} alt={st.name} className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <p className="font-bold text-slate-900">{st.name}</p>
                        <p className="text-[10px] text-slate-400">{st.admissionNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{st.class} ({st.department})</td>
                  <td className="py-3 px-4 max-w-[160px] truncate text-slate-700">{st.currentExam}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        st.riskScore >= 50
                          ? 'bg-red-100 text-red-700'
                          : st.riskScore >= 25
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {st.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-[180px] truncate">{st.device}</td>
                  <td className="py-3 px-4 capitalize font-medium text-slate-700">{st.status.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(st)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded"
                    >
                      View Profile
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
