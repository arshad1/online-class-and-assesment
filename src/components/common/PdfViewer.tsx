import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  Printer,
  Sparkles,
  RotateCw,
  Search,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { UploadedPaperFile } from '../../types';

interface PdfViewerProps {
  title?: string;
  subject?: string;
  code?: string;
  uploadedFile?: UploadedPaperFile;
  className?: string;
  onDownload?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  title = 'Grade 10 Mathematics Term Examination Paper 2026',
  subject = 'Mathematics',
  code = 'QP-MATH-UPLOADED-101',
  uploadedFile,
  className = '',
  onDownload,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 3;
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const fileName = uploadedFile?.fileName || 'Mathematics_Term_Exam_Paper_2026.pdf';
  const fileSize = uploadedFile?.fileSize || '2.4 MB';

  return (
    <div
      className={`flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-full min-h-[500px]'
      } ${className}`}
    >
      {/* Top Toolbar Bar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
        {/* File Metadata Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 bg-red-600/90 text-white rounded-lg font-bold text-[10px] tracking-wider uppercase shrink-0">
            PDF
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-100 truncate">{fileName}</h4>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-2">
              <span>{code}</span>
              <span>•</span>
              <span>{fileSize}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Verified PDF Document</span>
            </p>
          </div>
        </div>

        {/* Page Navigation & Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-200 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Zoom Level Controls */}
          <button
            onClick={handleZoomOut}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-300 hover:text-white rounded hover:bg-slate-800"
            title="Reset Zoom"
          >
            {zoomLevel}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onDownload || (() => alert(`Downloading ${fileName}...`))}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download PDF File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* PDF Viewport Scroll Canvas */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4 md:p-8 flex justify-center items-start scrollbar-thin">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 ease-out my-2 shadow-2xl"
        >
          {/* Printable Sheet Canvas Page Container */}
          <div className="w-[794px] min-h-[1123px] bg-white text-slate-900 p-12 shadow-2xl rounded-sm font-serif relative flex flex-col justify-between select-text border border-slate-300">
            {/* Top Academic Header */}
            <div>
              <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center space-y-1">
                <div className="flex items-center justify-between text-xs font-sans text-slate-500 mb-2">
                  <span>CODE: <strong>{code}</strong></span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">CONFIDENTIAL</span>
                  <span>TIME ALLOWED: <strong>2 HOURS</strong></span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                  NATIONAL ACADEMY OF EXAMINATION & ASSESSMENT
                </h1>
                <h2 className="text-base font-semibold text-slate-800">
                  {title}
                </h2>
                <div className="flex justify-center gap-6 text-xs font-sans font-semibold text-slate-700 pt-1">
                  <span>Subject: {subject}</span>
                  <span>•</span>
                  <span>Grade: Class 10</span>
                  <span>•</span>
                  <span>Maximum Marks: 100</span>
                </div>
              </div>

              {/* General Instructions Box */}
              <div className="p-3 bg-slate-50 border border-slate-300 text-xs font-sans mb-6 space-y-1 rounded-sm">
                <strong className="text-slate-900 block font-bold uppercase tracking-wider text-[11px]">
                  General Instructions:
                </strong>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-700 leading-relaxed text-[11px]">
                  <li>All questions are compulsory unless specified otherwise.</li>
                  <li>Section A contains 5 Objective Questions carrying 5 marks each.</li>
                  <li>Section B contains 3 Short Answer Questions carrying 15 marks each.</li>
                  <li>Section C contains 2 Analytical / Long Problem Solving questions carrying 15 marks each.</li>
                  <li>Students may upload scanned handwritten answer sheets or type answers directly in the response console.</li>
                </ol>
              </div>

              {/* PAGE 1 CONTENT */}
              {currentPage === 1 && (
                <div className="space-y-6 font-sans">
                  <div className="border-b pb-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      SECTION A: OBJECTIVE QUESTIONS (25 MARKS)
                    </h3>
                  </div>

                  {/* Q1 */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q1. Find the discriminant of the quadratic equation 2x² - 4x + 3 = 0.</span>
                      <span>[5 Marks]</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-4 text-slate-700">
                      <div>(A) D = -8</div>
                      <div>(B) D = 10</div>
                      <div>(C) D = 8</div>
                      <div>(D) D = -4</div>
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q2. The sum of the first 20 terms of the AP: 2, 7, 12, 17... is:</span>
                      <span>[5 Marks]</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-4 text-slate-700">
                      <div>(A) 970</div>
                      <div>(B) 990</div>
                      <div>(C) 1020</div>
                      <div>(D) 950</div>
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q3. If tan(θ) + cot(θ) = 2, then the value of tan²(θ) + cot²(θ) is equal to:</span>
                      <span>[5 Marks]</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-4 text-slate-700">
                      <div>(A) 1</div>
                      <div>(B) 2</div>
                      <div>(C) 4</div>
                      <div>(D) 0</div>
                    </div>
                  </div>

                  {/* Q4 */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q4. Coordinates of the midpoint of line segment joining A(-2, 8) and B(-6, -4):</span>
                      <span>[5 Marks]</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-4 text-slate-700">
                      <div>(A) (-4, 2)</div>
                      <div>(B) (-4, 6)</div>
                      <div>(C) (-8, 4)</div>
                      <div>(D) (2, -4)</div>
                    </div>
                  </div>

                  {/* Q5 */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q5. A die is thrown once. What is the probability of getting a prime number?</span>
                      <span>[5 Marks]</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-4 text-slate-700">
                      <div>(A) 1/6</div>
                      <div>(B) 1/3</div>
                      <div>(C) 1/2</div>
                      <div>(D) 2/3</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2 CONTENT */}
              {currentPage === 2 && (
                <div className="space-y-6 font-sans">
                  <div className="border-b pb-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      SECTION B: SHORT ANSWER QUESTIONS (45 MARKS)
                    </h3>
                  </div>

                  {/* Q6 */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q6. Prove by contradiction that √3 is an irrational number.</span>
                      <span>[15 Marks]</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic pl-4">
                      Include all algebraic steps showing that common prime factor 3 divides both coprime integers a and b.
                    </p>
                  </div>

                  {/* Q7 */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q7. State and prove the Basic Proportionality Theorem (Thales Theorem).</span>
                      <span>[15 Marks]</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-[11px] text-slate-600">
                      [Diagram Prompt: Draw triangle ABC with line DE parallel to BC intersecting AB at D and AC at E. Show AD/DB = AE/EC].
                    </div>
                  </div>

                  {/* Q8 */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q8. Calculate the mean and mode of the following grouped frequency distribution:</span>
                      <span>[15 Marks]</span>
                    </div>
                    <table className="w-full border-collapse border border-slate-300 text-center text-[11px]">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 py-1 font-bold">Class Interval</th>
                          <th className="border border-slate-300 py-1">0 - 10</th>
                          <th className="border border-slate-300 py-1">10 - 20</th>
                          <th className="border border-slate-300 py-1">20 - 30</th>
                          <th className="border border-slate-300 py-1">30 - 40</th>
                          <th className="border border-slate-300 py-1">40 - 50</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 py-1 font-bold">Frequency (f)</td>
                          <td className="border border-slate-300 py-1">7</td>
                          <td className="border border-slate-300 py-1">14</td>
                          <td className="border border-slate-300 py-1">22</td>
                          <td className="border border-slate-300 py-1">11</td>
                          <td className="border border-slate-300 py-1">6</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PAGE 3 CONTENT */}
              {currentPage === 3 && (
                <div className="space-y-6 font-sans">
                  <div className="border-b pb-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      SECTION C: ANALYTICAL PROBLEM SOLVING (30 MARKS)
                    </h3>
                  </div>

                  {/* Q9 */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q9. Height & Distance Trigonometric Heights Problem:</span>
                      <span>[15 Marks]</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed pl-4">
                      From the top of a 7m high building, the angle of elevation of the top of a cable tower is 60° and the angle of depression of its foot is 45°. Determine the exact height of the cable tower in meters.
                    </p>
                  </div>

                  {/* Q10 */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q10. Combination of Solids Volume Calculation:</span>
                      <span>[15 Marks]</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed pl-4">
                      A solid wooden toy is in the form of a hemisphere surmounted by a right circular cone of height 2 cm and base diameter 4 cm. Determine the total combined volume of the toy. (Take π = 3.14).
                    </p>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-300 text-center text-xs font-bold text-slate-700 uppercase tracking-widest">
                    *** END OF QUESTION PAPER ***
                  </div>
                </div>
              )}
            </div>

            {/* Document Page Footer */}
            <div className="pt-8 border-t border-slate-200 flex justify-between text-[11px] font-sans text-slate-500">
              <span>National Examination Portal • Official Question Document</span>
              <span>Page {currentPage} of {totalPages}</span>
              <span>{code}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
