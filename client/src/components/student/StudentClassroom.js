// client/src/components/student/StudentClassroom.js
import React, { useState, useEffect } from 'react';
import Performance from './Performance';

const StudentClassroom = ({ user, token }) => {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [view, setView] = useState('announcements'); // announcements, assignments, quizzes, performance

    useEffect(() => {
        const fetchJoinedClassrooms = async () => {
            const res = await fetch('http://localhost:5000/api/classrooms/student', {
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                const data = await res.json();
                setClassrooms(data);
                if (data.length > 0) {
                    // Automatically select and fetch full details for the first classroom
                    handleSelectClassroom(data[0]._id);
                }
            }
        };
        fetchJoinedClassrooms();
    }, [token]);

    const handleSelectClassroom = async (id) => {
        // Always fetch the full details when a classroom is selected
        const res = await fetch(`http://localhost:5000/api/classrooms/${id}`, {
            headers: { 'x-auth-token': token },
        });
        if (res.ok) {
            setSelectedClassroom(await res.json());
            // Default to announcements view whenever a new class is selected
            setView('announcements');
        }
    };

    const renderClassroomContent = () => {
        if (!selectedClassroom) {
            return <p className="text-center text-text-secondary">Select a classroom to view its content.</p>;
        }

        switch (view) {
            case 'announcements':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Announcements</h3>
                        {selectedClassroom.announcements?.length > 0 ? selectedClassroom.announcements.map(ann => (
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
                        {selectedClassroom.assignments?.length > 0 ? selectedClassroom.assignments.map(ass => (
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
                        {selectedClassroom.quizzes?.length > 0 ? selectedClassroom.quizzes.map(quiz => (
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
                return <Performance userId={user._id} classroomId={selectedClassroom._id} token={token} />;
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">My Classrooms</h2>
                <div className="space-y-2">
                    {classrooms.map(c => (
                        <div key={c._id}
                            className={`card p-3 cursor-pointer ${selectedClassroom?._id === c._id ? 'bg-brand-primary text-white' : 'hover:bg-background-alt'}`}
                            onClick={() => handleSelectClassroom(c._id)}>
                            <h3 className="font-bold">{c.name}</h3>
                            <p className={`text-sm ${selectedClassroom?._id === c._id ? 'text-blue-100' : 'text-text-secondary'}`}>{c.subject}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="md:col-span-3 card">
                {selectedClassroom ? (
                    <>
                        <div className="border-b-2 border-border pb-4 mb-4">
                            <h2 className="text-2xl font-bold text-text-primary">{selectedClassroom.name}</h2>
                            <p className="text-text-secondary">{selectedClassroom.subject}</p>
                        </div>
                        <div className="mb-4">
                            <button onClick={() => setView('announcements')} className={`btn-sm ${view === 'announcements' ? 'btn-primary' : 'btn-secondary'} mr-2`}>Announcements</button>
                            <button onClick={() => setView('assignments')} className={`btn-sm ${view === 'assignments' ? 'btn-primary' : 'btn-secondary'} mr-2`}>Assignments</button>
                            <button onClick={() => setView('quizzes')} className={`btn-sm ${view === 'quizzes' ? 'btn-primary' : 'btn-secondary'} mr-2`}>Quizzes</button>
                            <button onClick={() => setView('performance')} className={`btn-sm ${view === 'performance' ? 'btn-primary' : 'btn-secondary'}`}>My Performance</button>
                        </div>
                        {renderClassroomContent()}
                    </>
                ) : (
                    <div className="text-center text-text-secondary p-8">
                        {classrooms.length > 0 ? 'Loading classroom...' : 'You have not joined any classrooms yet. Use a join code on your dashboard to enroll in a class.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentClassroom;