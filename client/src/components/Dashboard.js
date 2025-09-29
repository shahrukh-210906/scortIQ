// src/components/Dashboard.js
import React, { useState, useMemo, useEffect } from 'react';
import ProgressBar from './ui/ProgressBar';
import { PhysicsIcon, ChemistryIcon, BiologyIcon, SandboxIcon } from './ui/Icons';

const Dashboard = ({ user, onSelectSubject, userProgress, curriculumData, onNavigate }) => {
  const [joinCode, setJoinCode] = useState('');
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [joinError, setJoinError] = useState('');

  const subjectIcons = {
    phy: PhysicsIcon,
    chem: ChemistryIcon,
    bio: BiologyIcon
  };

  useEffect(() => {
    const fetchJoinedClasses = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:5000/api/classrooms/student', {
                headers: { 'x-auth-token': token },
            });
            if (res.ok) {
                const data = await res.json();
                setJoinedClasses(data);
            }
        } catch (error) {
            console.error("Could not fetch joined classes", error);
        }
    };
    fetchJoinedClasses();
  }, [user]);

  const handleJoinClass = async (e) => {
      e.preventDefault();
      setJoinError('');
      const token = localStorage.getItem('token');
      try {
          const res = await fetch('http://localhost:5000/api/classrooms/join', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token,
              },
              body: JSON.stringify({ joinCode })
          });
          const data = await res.json();
          if (res.ok) {
              setJoinedClasses(prev => [...prev, data]);
              setJoinCode('');
          } else {
              setJoinError(data.msg || 'Failed to join class.');
          }
      } catch (error) {
        console.error("Error joining class", error);
        setJoinError('Server error. Please try again.');
      }
  }

  const calculateSubjectProgress = (subject) => {
    const allTopicIds = subject.chapters.flatMap(ch => ch.topics.map(t => t.id));
    if (allTopicIds.length === 0) return 0;
    const completedTopics = allTopicIds.filter(id => userProgress[id]?.status === 'completed').length;
    return (completedTopics / allTopicIds.length) * 100;
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-1">Welcome back, {user.name}!</h1>
        <p className="text-md text-text-secondary">Let's continue your educational journey today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-text-primary">NCERT Curriculum</h2>
             {curriculumData.subjects.map(subject => {
                const progress = calculateSubjectProgress(subject);
                const IconComponent = subjectIcons[subject.id];
                return (
                    <div key={subject.id} className="card flex items-center gap-4">
                        <IconComponent />
                        <div className="flex-grow">
                             <h3 className="text-lg font-bold text-text-primary">{subject.name}</h3>
                             <p className="text-text-secondary text-sm mb-2">{subject.chapters.length} chapters</p>
                             <ProgressBar progress={progress} />
                        </div>
                        <button onClick={() => onSelectSubject(subject)} className="btn-primary">
                            Study
                        </button>
                    </div>
                );
             })}
        </div>
        
        {/* Sidebar Area */}
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-3">My Classrooms</h3>
                 {joinedClasses.length > 0 ? (
                    <div className="space-y-2 mb-4">
                        {joinedClasses.map(cls => (
                            <div key={cls._id} className="p-3 bg-background-alt rounded-lg">
                                <p className="font-semibold text-sm">{cls.name}</p>
                                <p className="text-xs text-text-secondary">{cls.subject}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-secondary text-sm mb-4">You haven't joined any classrooms yet.</p>
                )}
                 <form onSubmit={handleJoinClass} className="space-y-2">
                    <input 
                        type="text"
                        value={joinCode}
                        onChange={e => setJoinCode(e.target.value)}
                        placeholder="Enter Class Code"
                        className="w-full p-2 bg-white rounded-lg border-2 border-border focus:border-brand-primary"
                    />
                    <button type="submit" className="btn-primary w-full text-sm" disabled={!joinCode}>Join</button>
                </form>
                {joinError && <p className="text-red-600 text-xs mt-2 text-center">{joinError}</p>}
            </div>

             <div className="card">
                <div className="flex items-center gap-4 mb-3">
                    <SandboxIcon />
                    <h3 className="text-lg font-bold text-text-primary">AI Sandbox</h3>
                </div>
                <p className="text-text-secondary text-sm mb-4">Have a question about anything? Ask our AI tutor!</p>
                <button onClick={() => onNavigate('sandbox')} className="btn-primary w-full justify-center">
                    Start Chatting
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;