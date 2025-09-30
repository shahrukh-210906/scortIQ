import React from 'react';

const AnnouncementItem = ({ announcement, classroomId, isTeacher, onEdit, onDelete }) => {
  return (
    <div className="p-3 bg-background-alt rounded-lg">
      <p className="text-sm">{announcement.content}</p>
      {isTeacher && (
        <div className="text-right mt-2 space-x-2">
          <button onClick={() => onEdit('announcement', { itemId: announcement._id, content: announcement.content })} className="btn-secondary btn-sm">Edit</button>
          <button onClick={() => onDelete('announcement', { classroomId, itemId: announcement._id })} className="btn-danger btn-sm">Delete</button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementItem;

