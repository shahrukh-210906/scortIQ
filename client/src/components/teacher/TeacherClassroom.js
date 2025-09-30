// client/src/components/TeacherDashboard.js
import React, { useState, useEffect } from 'react';
import { ClassroomIcon } from './ui/Icons';

const TeacherDashboard = ({ user, token, onSelectClassroom }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('');

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/classrooms', {
          headers: { 'x-auth-token': token },
        });
        if (res.ok) {
          const data = await res.json();
          setClassrooms(data);
        }
      } catch (err) {
        console.error("Could not fetch classrooms", err);
      }
    };
    fetchClassrooms();
  }, [token]);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/classrooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
        },
        body: JSON.stringify({ name: newClassName, subject: newClassSubject }),
    });

    if (res.ok) {
        const newClassroom = await res.json();
        setClassrooms(prev => [newClassroom, ...prev]);
        setNewClassName('');
        setNewClassSubject('');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-1">Welcome, {user.name}!</h1>
        <p className="text-md text-text-secondary">Manage your classrooms and students from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-text-primary mb-4">My Classrooms</h2>
          <div className="space-y-4">
            {classrooms.length > 0 ? classrooms.map(c => (
              <div key={c._id} className="card flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{c.name}</h3>
                  <p className="text-text-secondary">{c.subject}</p>
                  <p className="text-sm font-mono bg-background-alt px-2 py-1 rounded-md inline-block mt-2">Join Code: {c.joinCode}</p>
                </div>
                <button onClick={() => onSelectClassroom(c)} className="btn-primary">
                  Manage
                </button>
              </div>
            )) : (
              <p className="text-text-secondary">You haven't created any classrooms yet.</p>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
            <div className="card">
                <h2 className="text-xl font-bold mb-3 text-text-primary">Create a New Classroom</h2>
                <form onSubmit={handleCreateClassroom} className="space-y-3">
                    <input type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="Classroom Name" className="w-full p-2 border-2 border-border rounded-lg" required />
                    <input type="text" value={newClassSubject} onChange={e => setNewClassSubject(e.target.value)} placeholder="Subject" className="w-full p-2 border-2 border-border rounded-lg" required />
                    <button type="submit" className="btn-primary w-full">Create Classroom</button>
                </form>
            </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;