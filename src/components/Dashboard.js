import React, { useMemo } from 'react';
import ProgressBar from './ui/ProgressBar';
import { PhysicsIcon, ChemistryIcon, BiologyIcon } from './ui/Icons';

const Dashboard = ({ user, onSelectSubject, userProgress, curriculumData }) => {
  const subjectIcons = {
    phy: PhysicsIcon,
    chem: ChemistryIcon,
    bio: BiologyIcon
  };

  const calculateSubjectProgress = (subject) => {
    const allTopicIds = subject.chapters.flatMap(ch => ch.topics.map(t => t.id));
    if (allTopicIds.length === 0) return 0;
    const completedTopics = allTopicIds.filter(id => userProgress[id]?.status === 'completed').length;
    return (completedTopics / allTopicIds.length) * 100;
  };

  const { totalChapters, completedChapters } = useMemo(() => {
    if (!curriculumData || !curriculumData.subjects) return { totalChapters: 0, completedChapters: 0 };

    let total = 0;
    let completed = 0;

    curriculumData.subjects.forEach(subject => {
      subject.chapters.forEach(chapter => {
        total++;
        const topicIds = chapter.topics.map(t => t.id);
        if (topicIds.length > 0) {
          const completedTopics = topicIds.filter(id => userProgress[id]?.status === 'completed').length;
          if (completedTopics === topicIds.length) {
            completed++;
          }
        }
      });
    });

    return { totalChapters: total, completedChapters: completed };
  }, [userProgress, curriculumData]);

  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-text-primary mb-2">Overall Progress Report</h1>
        <p className="text-sm sm:text-base text-text-secondary mb-4">{completedChapters} of {totalChapters} chapters completed</p>

        <div className="card mb-6">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-2">
            <span className="font-semibold text-text-primary mb-2 xs:mb-0">Total Progress</span>
            <span className="font-bold text-brand-primary text-lg">{overallProgress}% Complete</span>
          </div>
          <ProgressBar progress={overallProgress} />
          <p className="text-text-tertiary text-sm mt-2">Keep going! You're doing great!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {curriculumData.subjects.map(subject => {
          const progress = calculateSubjectProgress(subject);
          const IconComponent = subjectIcons[subject.id];

          return (
            <div key={subject.id} className="card">
              <div className="flex items-center mb-4">
                <IconComponent />
                <div>
                  <h2 className="text-xl font-bold text-text-primary font-serif">{subject.name}</h2>
                  <p className="text-text-secondary text-sm">Class {subject.class} NCERT</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary text-sm">{subject.chapters.length} chapters</span>
                  <span className="text-3xl font-bold text-text-primary">{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} />
              </div>

              <button
                onClick={() => onSelectSubject(subject)}
                className="btn-primary w-full justify-center"
              >
                Continue Learning
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;