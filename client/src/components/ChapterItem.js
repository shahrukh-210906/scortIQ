import React from 'react';
import TopicItem from './TopicItem';

const ChapterItem = ({ chapter, classroomId, isTeacher, onEdit, onDelete }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{chapter.name}</h3>
        {isTeacher && (
          <div className="space-x-2">
            <button onClick={() => onEdit('topic', { chapterId: chapter._id })} className="btn-secondary btn-sm">Add Topic</button>
            <button onClick={() => onEdit('chapter', { itemId: chapter._id, name: chapter.name })} className="btn-secondary btn-sm">Edit</button>
            <button onClick={() => onDelete('chapter', { classroomId, itemId: chapter._id })} className="btn-danger btn-sm">Delete</button>
          </div>
        )}
      </div>
      <div className="pl-4 mt-2 space-y-2">
        {chapter.topics?.length > 0 ? (
          chapter.topics.map(topic => (
            <TopicItem
              key={topic._id}
              topic={topic}
              classroomId={classroomId}
              chapterId={chapter._id}
              isTeacher={isTeacher}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : <p className="text-sm text-text-secondary pl-4 pt-2">No topics in this chapter yet.</p>}
      </div>
    </div>
  );
};

export default ChapterItem;

