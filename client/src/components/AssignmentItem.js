import React from 'react';

const AssignmentItem = ({ assignment, classroomId, isTeacher, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="font-bold">{assignment.title}</p>
        <p className="text-sm text-text-secondary">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
      </div>
      {isTeacher && (
        <div className="flex-shrink-0 space-x-2">
          <button onClick={() => onEdit('assignment', { itemId: assignment._id, title: assignment.title, dueDate: assignment.dueDate.split('T')[0] })} className="btn-secondary btn-sm">Edit</button>
          <button onClick={() => onDelete('assignment', { classroomId, itemId: assignment._id })} className="btn-danger btn-sm">Delete</button>
        </div>
      )}
    </div>
  );
};

export default AssignmentItem;

