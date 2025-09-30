// client/src/components/teacher/TeacherClassroomView.js
import React, { useState } from 'react';
import CreateAssignment from './CreateAssignment';
import CreateQuiz from './CreateQuiz';
import Performance from './Performance';
import StudentManager from './StudentManager'; // Import the new component

const TeacherClassroomView = ({ classroom, token }) => {
    const [view, setView] = useState('assignments'); // assignments, quizzes, performance, students

    if (!classroom) {
        return <div className="card text-center text-text-secondary">Classroom data not found.</div>;
    }

    return (
        <div className="card">
            <div className="pb-4 mb-4 border-b border-border">
                <h2 className="text-2xl font-bold text-text-primary">{classroom.name}</h2>
                <p className="text-text-secondary">{classroom.subject}</p>
                <p className="text-sm font-mono bg-background-alt px-2 py-1 rounded-md inline-block mt-2">Join Code: {classroom.joinCode}</p>
            </div>
            
            <div className="my-4">
                <button onClick={() => setView('assignments')} className={`btn-sm mr-2 ${view === 'assignments' ? 'btn-primary' : 'btn-secondary'}`}>Assignments</button>
                <button onClick={() => setView('quizzes')} className={`btn-sm mr-2 ${view === 'quizzes' ? 'btn-primary' : 'btn-secondary'}`}>Quizzes</button>
                <button onClick={() => setView('performance')} className={`btn-sm mr-2 ${view === 'performance' ? 'btn-primary' : 'btn-secondary'}`}>Performance</button>
                <button onClick={() => setView('students')} className={`btn-sm ${view === 'students' ? 'btn-primary' : 'btn-secondary'}`}>Students</button>
            </div>

            {view === 'assignments' && <CreateAssignment classroomId={classroom._id} token={token} />}
            {view === 'quizzes' && <CreateQuiz classroomId={classroom._id} token={token} />}
            {view === 'performance' && <Performance classroomId={classroom._id} token={token} />}
            {view === 'students' && (
              <StudentManager 
                initialStudents={classroom.students} 
                classroomId={classroom._id} 
                token={token} 
              />
            )}
        </div>
    );
};

export default TeacherClassroomView;