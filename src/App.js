import React, { useState, useEffect, useMemo } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import SubjectView from './components/SubjectView';
import ChatTutor from './components/tutors/ChatTutor';
import EquationTutor from './components/tutors/EquationTutor';
import SandboxTutor from './components/tutors/SandboxTutor';
import TopicQuiz from './components/TopicQuiz';
import PerformanceTracker from './components/PerformanceTracker';
import Navigation from './components/Navigation';
import FloatingElements from './components/ui/FloatingElements';
import { ncertCurriculum } from './data/curriculum';
import { sendWelcomeEmail } from './utils/emailService';
// Removed: import { SvgDefs } from './components/ui/Icons';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('socratic_user')) || null);
  const [userProgress, setUserProgress] = useState(() => JSON.parse(localStorage.getItem('socratic_progress')) || {});
  const [quizScores, setQuizScores] = useState(() => JSON.parse(localStorage.getItem('socratic_quiz_scores')) || {});
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('socratic_user') ? 'dashboard' : 'login');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedEquation, setSelectedEquation] = useState(null);
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState(null);
  const [currentChapterTitle, setCurrentChapterTitle] = useState('');

  const curriculumData = useMemo(() => {
    return user?.class ? ncertCurriculum[user.class] : { subjects: [] };
  }, [user?.class]);

  useEffect(() => { if(user) localStorage.setItem('socratic_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('socratic_progress', JSON.stringify(userProgress)); }, [userProgress]);
  useEffect(() => { localStorage.setItem('socratic_quiz_scores', JSON.stringify(quizScores)); }, [quizScores]);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
    sendWelcomeEmail(userData.name, userData.class);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCurrentView('login');
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentView('subject');
  };

  const handleSelectTopic = (topic) => {
    if (!userProgress[topic.id]) {
      setUserProgress(prev => ({ ...prev, [topic.id]: { status: 'in_progress' } }));
    }
    setSelectedTopic(topic);
    setCurrentView('topic');
  };

  const handleSelectEquation = (equation, chapterTitle) => {
    setSelectedEquation(equation);
    setCurrentChapterTitle(chapterTitle);
    setCurrentView('equation');
  };

  const updateTopicStatus = (topicId, newStatus) => {
    setUserProgress(prev => ({ ...prev, [topicId]: { ...prev[topicId], status: newStatus } }));
  };

  const handleStartQuiz = (topic) => {
    setSelectedTopicForQuiz(topic);
  };

  const handleQuizComplete = (score, topicId) => {
    setQuizScores(prev => ({ ...prev, [topicId]: score }));
    if (score < 5) {
      updateTopicStatus(topicId, 'weak');
    }
    setSelectedTopicForQuiz(null);
  };

  const navigateTo = (view) => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedEquation(null);
    setSelectedTopicForQuiz(null);
    setCurrentView(view);
  };

  const renderContent = () => {
    if (selectedTopicForQuiz) {
      return <TopicQuiz topic={selectedTopicForQuiz} user={user} onQuizComplete={handleQuizComplete} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} onSelectSubject={handleSelectSubject} userProgress={userProgress} curriculumData={curriculumData} onNavigate={navigateTo} />;

      case 'subject':
        if (!selectedSubject) { navigateTo('dashboard'); return null; }
        return (
          <SubjectView
            subject={selectedSubject}
            userProgress={userProgress}
            onSelectTopic={handleSelectTopic}
            onSelectEquation={handleSelectEquation}
            onStartQuiz={handleStartQuiz}
            onBack={() => navigateTo('dashboard')}
          />
        );

      case 'topic':
        if (!selectedTopic) { navigateTo('subject'); return null; }
        return <ChatTutor topic={selectedTopic} user={user} onExit={() => setCurrentView('subject')} updateTopicStatus={updateTopicStatus} />;

      case 'equation':
        if (!selectedEquation) { navigateTo('subject'); return null; }
        return <EquationTutor equation={selectedEquation} chapterTitle={currentChapterTitle} user={user} onExit={() => setCurrentView('subject')} />;

      case 'sandbox':
        return <SandboxTutor user={user} onExit={() => navigateTo('dashboard')} />;

      case 'performance':
        return <PerformanceTracker curriculumData={curriculumData} quizScores={quizScores} onSelectTopic={handleSelectTopic} onExit={() => navigateTo('dashboard')} />;

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen text-text-primary bg-background-page relative overflow-hidden">
      {/* Removed: <SvgDefs /> */}
      <FloatingElements />
      <Navigation user={user} onLogout={handleLogout} onNavigate={navigateTo} />
      <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div key={currentView} className="fade-enter fade-enter-active">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;