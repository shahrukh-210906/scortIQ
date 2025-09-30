// src/components/teacher/Performance.js
import React, { useState, useEffect } from 'react';

const Performance = ({ classroomId, token }) => {
    const [performanceData, setPerformanceData] = useState(null);

    useEffect(() => {
        // This is a placeholder. You would fetch actual performance data here.
        const fetchPerformance = async () => {
            // const res = await fetch(`http://localhost:5000/api/classrooms/performance/${classroomId}`, {
            //     headers: { 'x-auth-token': token },
            // });
            // if (res.ok) {
            //     setPerformanceData(await res.json());
            // }
            setPerformanceData({
                overall: 85,
                students: [
                    { id: '1', name: 'Student A', score: 90 },
                    { id: '2', name: 'Student B', score: 80 },
                ]
            });
        };
        fetchPerformance();
    }, [classroomId, token]);

    if (!performanceData) return <p>Loading performance data...</p>;

    return (
        <div>
            <h3 className="text-xl font-bold">Class Performance</h3>
            <p>Overall Average: {performanceData.overall}%</p>
            <div className="mt-4">
                <h4 className="font-semibold">Leaderboard</h4>
                <ul className="list-disc pl-5">
                    {performanceData.students.map(s => (
                        <li key={s.id}>{s.name}: {s.score}%</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Performance;