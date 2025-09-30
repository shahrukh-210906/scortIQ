// src/components/student/Performance.js
import React, { useState, useEffect } from 'react';

const Performance = ({ userId, classroomId, token }) => {
    const [performanceData, setPerformanceData] = useState(null);

     useEffect(() => {
        // Placeholder for fetching student-specific performance data
        const fetchPerformance = async () => {
             // const res = await fetch(`http://localhost:5000/api/classrooms/performance/${classroomId}/student/${userId}`, {
            //     headers: { 'x-auth-token': token },
            // });
            // if (res.ok) {
            //     setPerformanceData(await res.json());
            // }
            setPerformanceData({
                overall: 90,
                assignments: [{title: 'Assignment 1', score: 95}, {title: 'Assignment 2', score: 85}],
                quizzes: [{title: 'Quiz 1', score: 88}, {title: 'Quiz 2', score: 92}]
            });
        };

        fetchPerformance();
    }, [userId, classroomId, token]);

    if (!performanceData) return <p>Loading your performance data...</p>;

    return (
        <div>
            <h3 className="text-xl font-bold">My Performance</h3>
            <p className="font-semibold">Overall Score: {performanceData.overall}%</p>

            <div className="mt-4">
                <h4 className="font-semibold">Assignments</h4>
                <ul>
                    {performanceData.assignments.map(a => (
                        <li key={a.title}>{a.title}: {a.score}%</li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <h4 className="font-semibold">Quizzes</h4>
                 <ul>
                    {performanceData.quizzes.map(q => (
                        <li key={q.title}>{q.title}: {q.score}%</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Performance;