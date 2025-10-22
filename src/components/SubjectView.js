import React from 'react';
import Chapter from './Chapter';
import { BackIcon, PhysicsIcon, ChemistryIcon, BiologyIcon } from './ui/Icons';

const SubjectView = ({ subject, userProgress, onSelectTopic, onSelectEquation, onStartQuiz, onBack }) => {
  const subjectIcons = {
    phy: PhysicsIcon,
    chem: ChemistryIcon,
    bio: BiologyIcon
  };

  const IconComponent = subjectIcons[subject.id];

  return (
    <>
      <div className="flex flex-col xs:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-4 mb-4 xs:mb-0">
          <IconComponent />
          <div>
            <h1 className="text-2xl xs:text-3xl font-bold font-serif text-text-primary">{subject.name}</h1>
            <p className="text-sm xs:text-base text-text-secondary">Class {subject.class} NCERT Curriculum</p>
          </div>
        </div>
        <button onClick={onBack} className="btn-primary">
          <BackIcon />
          Back to Dashboard
        </button>
      </div>
      {subject.chapters.map(ch => (
        <Chapter 
          key={ch.id} 
          chapter={ch} 
          userProgress={userProgress} 
          onSelectTopic={onSelectTopic} 
          onSelectEquation={onSelectEquation}
          onStartQuiz={onStartQuiz}
        />
      ))}
    </>
  );
};

export default SubjectView;