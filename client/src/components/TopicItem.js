import React from 'react';

const TopicItem = ({ topic, classroomId, chapterId, isTeacher, onEdit, onDelete }) => {
  return (
    <div className="border-l-2 border-border pl-4 py-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{topic.name}</h4>
        {isTeacher && (
          <div className="space-x-2">
            <button onClick={() => onEdit('topic', { itemId: topic._id, chapterId, name: topic.name, notes: topic.notes })} className="btn-secondary btn-sm">Edit</button>
            <button onClick={() => onDelete('topic', { classroomId, chapterId, itemId: topic._id })} className="btn-danger btn-sm">Delete</button>
          </div>
        )}
      </div>
      <p className="text-sm text-text-secondary whitespace-pre-wrap">{topic.notes}</p>
    </div>
  );
};

export default TopicItem;

