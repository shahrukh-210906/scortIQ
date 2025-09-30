// client/src/components/student/StudentClassroomView.js
import React, { useState, useEffect } from 'react';
import Performance from './Performance';

const StudentClassroomView = ({ user, token, classroomId }) => {
    const [classroom, setClassroom] = useState(null);
    const [view, setView] = useState('announcements');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClassroomDetails = async () => {
            setIsLoading(true);
            const res = await fetch(`http://localhost:5000/api/classrooms/${classroomId}`, {
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                setClassroom(await res.json());
            }
            setIsLoading(false);
        };
        
        if (classroomId) {
            fetchClassroomDetails();
        }
    }, [classroomId, token]);

    const renderContent = () => {
        if (isLoading) return <p className="text-text-secondary">Loading classroom content...</p>;
        if (!classroom) return <p className="text-red-500">Could not load classroom.</p>;

        switch (view) {
            case 'announcements':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Announcements</h3>
                        {classroom.announcements?.length > 0 ? classroom.announcements.map(ann => (
                            <div key={ann._id} className="p-4 bg-background-alt rounded-lg mb-2">
                                <p>{ann.text}</p>
                                <p className="text-xs text-text-secondary mt-1">{new Date(ann.date).toLocaleString()}</p>
                            </div>
                        )) : <p className="text-text-secondary">No announcements yet.</p>}
                    </div>
                );
            case 'assignments':
                return (
                     <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Assignments</h3>
                        {classroom.assignments?.length > 0 ? classroom.assignments.map(ass => (
                            <div key={ass._id} className="p-4 bg-background-alt rounded-lg mb-2 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{ass.title}</p>
                                    <p className="text-sm text-text-secondary">{ass.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">Due: {new Date(ass.dueDate).toLocaleDateString()}</p>
                                    <button className="btn-sm btn-primary mt-2">Submit</button>
                                </div>
                            </div>
                        )) : <p className="text-text-secondary">No assignments yet.</p>}
                    </div>
                );
            case 'quizzes':
                return (
                     <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Quizzes</h3>
                        {classroom.quizzes?.length > 0 ? classroom.quizzes.map(quiz => (
                            <div key={quiz._id} className="p-4 bg-background-alt rounded-lg mb-2 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{quiz.title}</p>
                                    <p className="text-sm text-text-secondary">{quiz.description}</p>
                                </div>
                                <button className="btn-sm btn-primary">Start Quiz</button>
                            </div>
                        )) : <p className="text-text-secondary">No quizzes available.</p>}
                    </div>
                );
            case 'performance':
                return <Performance userId={user._id} classroomId={classroom._id} token={token} />;
            default:
                return null;
        }
    };
    
    return (
        <div className="card">
            {classroom && (
                 <>
                    <div className="border-b-2 border-border pb-4 mb-4">
                        <h2 className="text-2xl font-bold text-text-primary">{classroom.name}</h2>
                        <p className="text-text-secondary">{classroom.subject}</p>
                    </div>
                    <div className="mb-4">
                        <button onClick={() => setView('announcements')} className={`btn-sm ${view === 'announcements' ? 'btn-primary' : 'btn-secondary'} mr-2`}>Announcements</button>
                        <button onClick={() => setView('assignments')} className={`btn-sm ${view === 'assignments' ? 'btn-primary' : 'btn-secondary'} mr-2`}>Assignments</button>
                        <button onClick={() => setView('quizzes')} className={`btn-sm ${view === 'quizzes' ? 'btn-primary' : 'btn-secondary'} mr-2`}>Quizzes</button>
                        <button onClick={() => setView('performance')} className={`btn-sm ${view === 'performance' ? 'btn-primary' : 'btn-secondary'}`}>My Performance</button>
                    </div>
                </>
            )}
            {renderContent()}
        </div>
    );
};

export default StudentClassroomView;