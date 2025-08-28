import React, { useState, useMemo } from 'react';
import Topic from './Topic';
import ProgressBar from './ui/ProgressBar';
import { ChevronDown, BrainIcon } from './ui/Icons';

const Chapter = ({ chapter, userProgress, onSelectTopic, onSelectEquation, onStartQuiz }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('topics');

  const chapterProgress = useMemo(() => {
    const topicIds = chapter.topics.map(t => t.id);
    if (topicIds.length === 0) return 0;
    const completedTopics = topicIds.filter(id => userProgress[id]?.status === 'completed').length;
    return (completedTopics / topicIds.length) * 100;
  }, [chapter, userProgress]);

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-lg font-bold text-text-primary">{chapter.title}</h3>
            <span className="tag tag-complete">{Math.round(chapterProgress)}% Complete</span>
          </div>
          <ProgressBar progress={chapterProgress} />
        </div>
        <div 
          className="ml-4 transform transition-transform duration-300" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDown />
        </div>
      </div>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-content-inner">
          <div className="tab-container">
            <button
              onClick={() => setActiveTab('topics')}
              className={`tab-item ${activeTab === 'topics' ? 'active' : ''}`}
            >
              Topics
            </button>
            <button
              onClick={() => setActiveTab('equations')}
              className={`tab-item ${activeTab === 'equations' ? 'active' : ''}`}
            >
              Equations
            </button>
          </div>

          {activeTab === 'topics' && (
            <div className="space-y-1">
              {chapter.topics.length > 0 ? chapter.topics.map(topic => (
                <Topic
                  key={topic.id}
                  topic={topic}
                  status={userProgress[topic.id]?.status}
                  onSelect={onSelectTopic}
                  onStartQuiz={onStartQuiz}
                />
              )) : (
                <p className="text-center text-text-tertiary py-4">No topics in this chapter yet.</p>
              )}
            </div>
          )}

          {activeTab === 'equations' && (
            <div className="space-y-2">
              {chapter.equations && chapter.equations.length > 0 ? chapter.equations.map((eq) => (
                <div key={eq.id} className="p-4 rounded-lg bg-background-alt flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-text-primary">{eq.title}</p>
                    <p className="text-text-secondary font-mono mt-1">{eq.formula}</p>
                  </div>
                  <button 
                    onClick={() => onSelectEquation(eq, chapter.title)}
                    className="btn-primary"
                  >
                    <BrainIcon />
                    AI Tutor
                  </button>
                </div>
              )) : (
                <p className="text-center text-text-tertiary py-4">No equations available for this chapter.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chapter;