// src/components/teacher/CreateAssignment.js
import React, { useState } from 'react';

const CreateAssignment = ({ classroomId, token }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:5000/api/classrooms/assignments/${classroomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ title, dueDate }),
        });
        setTitle('');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold">Create Assignment</h3>
            <input type="text" placeholder="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border-2 border-border rounded-lg" />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border-2 border-border rounded-lg" />
            <button type="submit" className="btn-primary">Create Assignment</button>
        </form>
    );
};

export default CreateAssignment;