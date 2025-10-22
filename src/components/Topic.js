import React from 'react';
import { CheckCircleIcon, InProgressIcon, WarningIcon, BrainIcon } from './ui/Icons';

const Topic = ({ topic, status, onSelect, onStartQuiz }) => {
  const getStatusInfo = () => {
    if (status === 'completed') return { text: 'Completed', icon: <CheckCircleIcon />, bg: 'status-complete' };
    if (status === 'in_progress') return { text: 'In Progress', icon: <InProgressIcon />, bg: 'status-pending' };
    if (status === 'weak') return { text: 'Weak Topic', icon: <WarningIcon />, bg: 'status-weak' };
    return {
      text: 'Ready to learn',
      icon: <div className="w-5 h-5 flex-shrink-0 border-2 border-text-tertiary rounded-full"></div>,
      bg: ''
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-background-alt transition-all duration-200 border-b border-border last:border-b-0">
      <div className="flex items-center flex-grow w-full mb-3 sm:mb-0">
        <div className={`status-icon ${statusInfo.bg}`}>
          {statusInfo.icon}
        </div>
        <div className="ml-4">
          <div className="text-text-primary font-semibold text-sm xs:text-base">{topic.title}</div>
          <div className="text-text-secondary text-xs xs:text-sm">{statusInfo.text}</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          onClick={() => onSelect(topic)}
          className="btn-primary text-sm py-2 px-4 w-full sm:w-auto"
        >
          <BrainIcon />
          Study
        </button>
        <button
          onClick={() => onStartQuiz(topic)}
          className="btn-primary btn-secondary text-sm py-2 px-4 w-full sm:w-auto"
        >
          Take Quiz
        </button>
      </div>
    </div>
  );
};

export default Topic;