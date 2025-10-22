import React, { useState, useMemo } from 'react';
import Topic from './Topic';
import ProgressBar from './ui/ProgressBar';
import { BrainIcon } from './ui/Icons';

const Chapter = ({ chapter, userProgress, onSelectTopic, onSelectEquation, onStartQuiz }) => {
  const [activeTab, setActiveTab] = useState('topics');

  const chapterProgress = useMemo(() => {
    const topicIds = chapter.topics.map(t => t.id);
    if (topicIds.length === 0) return 0;
    const completedTopics = topicIds.filter(id => userProgress[id]?.status === 'completed').length;
    return (completedTopics / topicIds.length) * 100;
  }, [chapter, userProgress]);

  return (
    <div className="card mb-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-text-primary">{chapter.title}</h3>
          <span className="tag tag-complete text-sm">{Math.round(chapterProgress)}% Complete</span>
        </div>
        <ProgressBar progress={chapterProgress} />
      </div>

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

      <div className="tab-content-container">
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
              <div key={eq.id} className="p-3 xs:p-4 rounded-lg bg-background-alt flex flex-col xs:flex-row justify-between items-start xs:items-center">
                <div className="mb-2 xs:mb-0">
                  <p className="font-semibold text-text-primary">{eq.title}</p>
                  <p className="text-text-secondary font-mono mt-1 text-sm xs:text-base">{eq.formula}</p>
                </div>
                <button
                  onClick={() => onSelectEquation(eq, chapter.title)}
                  className="btn-primary w-full xs:w-auto text-sm"
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
  );
};

export default Chapter;