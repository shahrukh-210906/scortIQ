// src/components/TeacherDashboard.js
import React, { useState, useEffect } from 'react';

const TeacherDashboard = ({ user, token }) => {
  const [view, setView] = useState('overview'); // overview, createClass
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('');

  const fetchClassrooms = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/classrooms', {
        headers: { 'x-auth-token': token },
      });
      if (res.ok) {
        const data = await res.json();
        setClassrooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch classrooms", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchClassrooms();

      try {
        const res = await fetch('http://localhost:5000/api/teacher/students', {
          headers: { 'x-auth-token': token },
        });
        if (res.ok) {
          const studentData = await res.json();
          setStudents(studentData);
        }
      } catch (error) {
        console.error('Server error fetching students:', error);
      }
      setIsLoading(false);
    };

    fetchInitialData();
  }, [token]);

  const handleCreateClass = async (e) => {
      e.preventDefault();
      try {
          const res = await fetch('http://localhost:5000/api/classrooms', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token,
              },
              body: JSON.stringify({ name: newClassName, subject: newClassSubject }),
          });
          if (res.ok) {
              setNewClassName('');
              setNewClassSubject('');
              fetchClassrooms();
              setView('overview');
          } else {
              console.error("Failed to create class");
          }
      } catch (error) {
          console.error("Error creating class:", error);
      }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Teacher Dashboard
          </h1>
          <p className="text-md text-text-secondary mt-1">
            Welcome back, {user.name}!
          </p>
        </div>
        {view === 'overview' && (
            <button onClick={() => setView('createClass')} className="btn-primary w-full sm:w-auto">
                <i className="fa-solid fa-plus fa-fw"></i>
                Create New Class
            </button>
        )}
      </div>

      {view === 'createClass' && (
        <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Create a New Classroom</h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                    <label htmlFor="className" className="block text-sm font-semibold text-text-secondary mb-1">Classroom Name</label>
                    <input 
                        id="className"
                        type="text"
                        value={newClassName}
                        onChange={e => setNewClassName(e.target.value)}
                        placeholder="e.g., Grade 10 Physics"
                        required
                        className="w-full p-3 bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary outline-none"
                    />
                </div>
                 <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-text-secondary mb-1">Subject</label>
                    <input 
                        id="subject"
                        type="text"
                        value={newClassSubject}
                        onChange={e => setNewClassSubject(e.target.value)}
                        placeholder="e.g., Physics"
                        required
                        className="w-full p-3 bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary outline-none"
                    />
                </div>
                <div className="flex gap-4 pt-2">
                    <button type="submit" className="btn-primary w-full">Create Class</button>
                    <button type="button" onClick={() => setView('overview')} className="btn-secondary w-full">Cancel</button>
                </div>
            </form>
        </div>
      )}

      {view === 'overview' && (
        <>
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Your Classrooms</h2>
            {isLoading ? <p>Loading...</p> : classrooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classrooms.map(c => (
                        <div key={c._id} className="p-4 rounded-lg border-2 border-border bg-background-alt">
                            <h3 className="font-bold text-lg text-text-primary">{c.name}</h3>
                            <p className="text-sm text-text-secondary mb-4">{c.subject}</p>
                            <div className="bg-white p-2 rounded-md text-center">
                                <label className="text-xs text-text-secondary">Join Code</label>
                                <p className="font-mono text-brand-primary font-bold tracking-widest">{c.joinCode}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-center text-text-secondary py-4">You haven't created any classrooms yet. Click "Create New Class" to begin.</p>}
        </div>

        <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-users fa-fw"></i>
                Student Overview
            </h2>
            {isLoading ? <p>Loading...</p> : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-background-alt">
                    <tr className="border-b-2 border-border">
                        <th className="p-3 text-sm font-semibold text-text-secondary">Name</th>
                        <th className="p-3 text-sm font-semibold text-text-secondary">Class</th>
                        <th className="p-3 text-sm font-semibold text-text-secondary">Joined On</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                    <tr key={student._id} className="border-b border-border last:border-b-0">
                        <td className="p-3 font-medium text-text-primary">{student.name}</td>
                        <td className="p-3 text-text-secondary">{student.class}</td>
                        <td className="p-3 text-sm text-text-secondary">
                        {new Date(student.date).toLocaleDateString()}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
             {students.length === 0 && !isLoading && (
                <p className="text-center text-text-secondary py-4">No students have registered yet.</p>
            )}
        </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;