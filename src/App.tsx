import React, { useState } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Teacher Views
import { DashboardView } from './views/DashboardView';
import { ExamSchedulingView } from './views/ExamSchedulingView';
import { ExamMonitoringView } from './views/ExamMonitoringView';
import { AssessmentView } from './views/AssessmentView';
import { PublishResultsView } from './views/PublishResultsView';
import { SettingsView } from './views/SettingsView';
import { ExamBasicDetailsView } from './views/ExamBasicDetailsView';
import { RecipientSelectionView } from './views/RecipientSelectionView';
import { AcademicMappingView } from './views/AcademicMappingView';
import { QuestionSourceChoiceView } from './views/QuestionSourceChoiceView';
import { QuestionMarksDistributionView } from './views/QuestionMarksDistributionView';
import { QuestionBankBrowserView } from './views/QuestionBankBrowserView';
import { ExamReviewPublishView } from './views/ExamReviewPublishView';
import { PdfQuestionPaperSetupView } from './views/PdfQuestionPaperSetupView';
import { AnswerSubmissionConfigView } from './views/AnswerSubmissionConfigView';
import { EvaluationDashboardView } from './views/EvaluationDashboardView';
import { AnswerEvaluationView } from './views/AnswerEvaluationView';

// Parent & Student Views
import { ParentDashboardView } from './views/ParentDashboardView';
import { StudentExamsListView } from './views/StudentExamsListView';
import { AttendExamView } from './views/AttendExamView';
import { StudentResultsView } from './views/StudentResultsView';

// Modals & Drawers
import { ScheduleExamModal } from './components/modals/ScheduleExamModal';
import { QuestionPaperPreviewModal } from './components/modals/QuestionPaperPreviewModal';
import { StudentDetailDrawer } from './components/modals/StudentDetailDrawer';
import { TeacherBroadcastModal } from './components/modals/TeacherBroadcastModal';
import { ManualAssessmentModal } from './components/modals/ManualAssessmentModal';
import { StudentReportCardModal } from './components/modals/StudentReportCardModal';
import { PublishConfirmationModal } from './components/modals/PublishConfirmationModal';

const MainContent: React.FC = () => {
  const { activeTab } = useExam();
  const [searchTerm, setSearchTerm] = useState('');

  // When student is attending an active exam, render dedicated full-screen examination environment
  if (activeTab === 'attend-exam') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-100 font-sans">
        <AttendExamView />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          {/* Teacher Views */}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'exam-scheduling' && <ExamSchedulingView />}
          {activeTab === 'create-exam-basic' && <ExamBasicDetailsView />}
          {activeTab === 'create-exam-recipients' && <RecipientSelectionView />}
          {activeTab === 'create-exam-academic' && <AcademicMappingView />}
          {activeTab === 'create-exam-question-source' && <QuestionSourceChoiceView />}
          {activeTab === 'create-exam-question-pool' && <QuestionMarksDistributionView />}
          {activeTab === 'create-exam-question-bank' && <QuestionBankBrowserView />}
          {activeTab === 'create-exam-controls' && <ExamReviewPublishView />}
          {activeTab === 'create-exam-pdf-upload' && <PdfQuestionPaperSetupView />}
          {activeTab === 'create-exam-pdf-section' && <AnswerSubmissionConfigView />}
          {activeTab === 'exam-monitoring' && <ExamMonitoringView />}
          {activeTab === 'assessment' && <AssessmentView />}
          {activeTab === 'evaluation-dashboard' && <EvaluationDashboardView />}
          {activeTab === 'answer-evaluation' && <AnswerEvaluationView />}
          {activeTab === 'publish-results' && <PublishResultsView />}
          {activeTab === 'settings' && <SettingsView />}

          {/* Parent & Student Views */}
          {activeTab === 'parent-dashboard' && <ParentDashboardView />}
          {activeTab === 'student-exams-list' && <StudentExamsListView />}
          {activeTab === 'student-results' && <StudentResultsView />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <ScheduleExamModal />
      <QuestionPaperPreviewModal />
      <StudentDetailDrawer />
      <TeacherBroadcastModal />
      <ManualAssessmentModal />
      <StudentReportCardModal />
      <PublishConfirmationModal />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ExamProvider>
      <MainContent />
    </ExamProvider>
  );
}

export default App;
