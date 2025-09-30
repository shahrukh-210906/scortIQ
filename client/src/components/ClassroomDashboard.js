// client/src/components/ClassroomDashboard.js
import React from 'react';
import TeacherClassroomView from './teacher/TeacherClassroomView';
import StudentClassroomView from './student/StudentClassroomView';

const ClassroomDashboard = ({ user, token, classroom, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="btn-secondary mb-4">
        &larr; Back to Dashboard
      </button>

      {user.role === 'teacher' ? (
        <TeacherClassroomView user={user} token={token} classroom={classroom} />
      ) : (
        <StudentClassroomView user={user} token={token} classroomId={classroom._id} />
      )}
    </div>
  );
};

export default ClassroomDashboard;