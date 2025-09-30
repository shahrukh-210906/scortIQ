// client/src/components/teacher/StudentManager.js
import React, { useState } from 'react';

const StudentManager = ({ initialStudents, classroomId, token }) => {
  const [students, setStudents] = useState(initialStudents || []);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to remove this student from the classroom?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/classrooms/students/${classroomId}/${studentId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token,
          },
        });

        if (res.ok) {
          setStudents(students.filter(s => s._id !== studentId));
          setMessage('Student removed successfully.');
          setError('');
        } else {
          const data = await res.json();
          setError(data.msg || 'Failed to remove student.');
          setMessage('');
        }
      } catch (err) {
        setError('Server error. Please try again.');
        setMessage('');
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-text-primary">Enrolled Students ({students.length})</h3>
      {message && <p className="text-green-600 bg-green-100 p-2 rounded-md mb-4">{message}</p>}
      {error && <p className="text-red-600 bg-red-100 p-2 rounded-md mb-4">{error}</p>}
      
      <div className="space-y-3">
        {students.length > 0 ? (
          students.map(student => (
            <div key={student._id} className="p-3 bg-background-alt rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-text-primary">{student.name}</p>
                <p className="text-sm text-text-secondary">{student.email}</p>
              </div>
              <button
                onClick={() => handleRemoveStudent(student._id)}
                className="btn-danger btn-sm"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-text-secondary">No students are currently enrolled in this class.</p>
        )}
      </div>
    </div>
  );
};

export default StudentManager;