import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Sliders,
  AlertTriangle,
  FileCode,
  Globe,
  Clock,
  Eye,
  X,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
} from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { SimilarityPair } from '../types';

export const AnswerSimilarityView: React.FC = () => {
  const { similarityPairs } = useExam();

  const [threshold, setThreshold] = useState<number>(75);
  const [selectedPair, setSelectedPair] = useState<SimilarityPair | null>(null);

  // Heatmap matrix candidate labels
  const candidatesMatrix = ['Farhan M.', 'Kabir P.', 'Aisha R.', 'Neha S.', 'Arjun N.', 'Sneha K.'];
  // Similarity matrix data grid
  const matrixValues = [
    [100, 95, 12, 14, 8, 5],
    [95, 100, 10, 18, 9, 6],
    [12, 10, 100, 82, 15, 11],
    [14, 18, 82, 100, 19, 8],
    [8, 9, 15, 19, 100, 22],
    [5, 6, 11, 8, 22, 100],
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              NLP Collusion & Answer Similarity Engine
            </h2>
            <p className="text-xs text-slate-500">
              Graph similarity algorithms flagging synchronized answer sequences & identical errors
            </p>
          </div>

          {/* Similarity Threshold Slider */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-4 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Similarity Threshold:</span>
            <input
              type="range"
              min="50"
              max="95"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-32 accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              &ge; {threshold}%
            </span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
            <option>Exam: Computer Science Entrance Test</option>
            <option>Grade 12 Physics Assessment</option>
          </select>

          <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
            <option>Class: All Sections</option>
            <option>BS Computer Science</option>
            <option>Grade 12-A</option>
          </select>

          <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
            <option>Section: Full Multiple Choice</option>
            <option>Section B (Short Answer)</option>
          </select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Student Pairs Analyzed</p>
          <p className="text-2xl font-bold text-slate-900">420 pairs</p>
          <p className="text-[11px] text-slate-400 mt-1">Cross-candidate combination</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Highly Similar Pairs (&gt;85%)</p>
          <p className="text-2xl font-bold text-red-600">2 pairs</p>
          <p className="text-[11px] text-red-500 font-medium mt-1">Flagged for collusion</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Identical Wrong Patterns</p>
          <p className="text-2xl font-bold text-amber-600">4 questions</p>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Matched error choices</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Suspicious Submission Timing</p>
          <p className="text-2xl font-bold text-purple-600">&lt; 5 seconds</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Synchronized clicks</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Average Similarity Score</p>
          <p className="text-2xl font-bold text-slate-900">14.2%</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Normal expected baseline</p>
        </div>
      </div>

      {/* Grid: Similarity Matrix Heatmap + High Similarity Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Matrix (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Similarity Matrix Heatmap</h3>
            <p className="text-xs text-slate-500">Pairwise response similarity correlation</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr>
                  <th className="p-1"></th>
                  {candidatesMatrix.map((name) => (
                    <th key={name} className="p-1 font-semibold text-slate-600 text-[10px]">
                      {name.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidatesMatrix.map((rowName, rowIndex) => (
                  <tr key={rowName}>
                    <td className="p-1 font-semibold text-slate-600 text-[10px] text-right pr-2">
                      {rowName.split(' ')[0]}
                    </td>
                    {matrixValues[rowIndex].map((val, colIndex) => {
                      let bgColor = 'bg-slate-100 text-slate-600';
                      if (val === 100) bgColor = 'bg-slate-200 text-slate-400 font-bold';
                      else if (val >= 90) bgColor = 'bg-red-600 text-white font-bold animate-pulse';
                      else if (val >= 75) bgColor = 'bg-amber-500 text-white font-bold';
                      else if (val >= 20) bgColor = 'bg-blue-100 text-blue-800';

                      return (
                        <td key={colIndex} className="p-1">
                          <div className={`py-2 px-1 rounded text-[11px] ${bgColor}`}>
                            {val}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-100 rounded" /> Low</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded" /> Warning (&gt;75%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-600 rounded" /> High Risk (&gt;90%)</span>
          </div>
        </div>

        {/* Flagged Similarity Pairs Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Flagged High-Similarity Pairs</h3>
            <span className="text-xs text-slate-500">Showing pairs exceeding threshold</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Candidate Pair</th>
                  <th className="py-2.5 px-3">Overall</th>
                  <th className="py-2.5 px-3">Wrong Answer Match</th>
                  <th className="py-2.5 px-3">Time Delta</th>
                  <th className="py-2.5 px-3">Shared IP</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {similarityPairs.map((pair) => (
                  <tr key={pair.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <img
                            src={pair.studentA.photoUrl}
                            alt={pair.studentA.name}
                            className="w-7 h-7 rounded-full border-2 border-white object-cover"
                          />
                          <img
                            src={pair.studentB.photoUrl}
                            alt={pair.studentB.name}
                            className="w-7 h-7 rounded-full border-2 border-white object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {pair.studentA.name} & {pair.studentB.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{pair.examTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-bold text-xs bg-red-100 text-red-700">
                        {pair.overallSimilarityPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-600">
                      {pair.wrongAnswerSimilarityPct}%
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {pair.submissionTimeDeltaSec}s
                    </td>
                    <td className="py-3 px-3">
                      {pair.sharedIpOrDevice ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 flex items-center gap-1 w-max">
                          <Globe className="w-3 h-3" />
                          {pair.sharedIpAddress || 'Shared IP'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedPair(pair)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition-colors shadow-xs"
                      >
                        Compare Answers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side-by-Side Answer Comparison Drawer */}
      {selectedPair && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                  Side-by-Side Candidate Response Audit
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedPair.studentA.name} vs {selectedPair.studentB.name} &bull; {selectedPair.examTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedPair(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Top Pair Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPair.studentA.photoUrl}
                    alt={selectedPair.studentA.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-300"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedPair.studentA.name}</h4>
                    <p className="text-slate-500">{selectedPair.studentA.admissionNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <img
                    src={selectedPair.studentB.photoUrl}
                    alt={selectedPair.studentB.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-300"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedPair.studentB.name}</h4>
                    <p className="text-slate-500">{selectedPair.studentB.admissionNo}</p>
                  </div>
                </div>
              </div>

              {/* Question Comparisons Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Question Response Comparison Log
                </h3>

                {selectedPair.comparisons.map((comp) => {
                  let borderStyle = 'border-slate-200 bg-white';
                  if (comp.isBothWrong) borderStyle = 'border-red-300 bg-red-50/50';
                  else if (comp.isBothCorrect) borderStyle = 'border-emerald-300 bg-emerald-50/30';

                  return (
                    <div key={comp.questionNo} className={`p-4 rounded-xl border ${borderStyle} space-y-2 text-xs`}>
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">Question #{comp.questionNo}</span>
                        {comp.isBothWrong && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                            IDENTICAL WRONG ANSWER MATCH!
                          </span>
                        )}
                        {comp.isBothCorrect && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded">
                            Both Correct
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 font-medium">{comp.questionText}</p>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 font-mono text-[11px]">
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-sans">
                            {selectedPair.studentA.name}'s Choice:
                          </span>
                          <span className={comp.isBothWrong ? 'text-red-700 font-bold' : 'text-slate-800'}>
                            {comp.optionA}
                          </span>
                        </div>

                        <div className="p-2 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-sans">
                            {selectedPair.studentB.name}'s Choice:
                          </span>
                          <span className={comp.isBothWrong ? 'text-red-700 font-bold' : 'text-slate-800'}>
                            {comp.optionB}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 text-right">
                        Time difference between clicks: {comp.timeDeltaSec} seconds
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
