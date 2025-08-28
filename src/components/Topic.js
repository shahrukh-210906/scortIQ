import React from 'react';
import { CheckCircleIcon, InProgressIcon, WarningIcon } from './ui/Icons';

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
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-background-alt transition-all duration-200 border-b border-border last:border-b-0">
      <div onClick={() => onSelect(topic)} className="flex items-center cursor-pointer flex-grow">
        <div className={`status-icon ${statusInfo.bg}`}>
          {statusInfo.icon}
        </div>
        <div className="ml-4">
          <div className="text-text-primary font-semibold">{topic.title}</div>
          <div className="text-text-secondary text-sm">{statusInfo.text}</div>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onStartQuiz(topic); }} 
        className="btn-primary btn-secondary text-sm py-2 px-4"
      >
        Take Quiz
      </button>
    </div>
  );
};

export default Topic;