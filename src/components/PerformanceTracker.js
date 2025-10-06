import React, { useMemo } from 'react';
import { BackIcon } from './ui/Icons';
import CircularProgressBar from './ui/CircularProgressBar'; // Import the new component

const PerformanceTracker = ({ curriculumData, quizScores, onSelectTopic, onExit }) => {
  const performanceData = useMemo(() => {
    const subjectScores = {};
    curriculumData.subjects.forEach(subject => {
      subjectScores[subject.id] = { name: subject.name, scores: [] };
    });

    const allTopics = curriculumData.subjects.flatMap(s => s.chapters.flatMap(c => c.topics.map(t => ({...t, subjectId: s.id}))));

    allTopics.forEach(topic => {
      if (quizScores[topic.id] !== undefined) {
        subjectScores[topic.subjectId].scores.push(quizScores[topic.id]);
      }
    });

    const subjectAverages = Object.values(subjectScores).map(subject => {
      const avg = subject.scores.length > 0 ? (subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length) * 10 : 0;
      return { name: subject.name, average: Math.round(avg) };
    });

    const weakTopics = allTopics.filter(topic => quizScores[topic.id] < 5);

    return { subjectAverages, weakTopics };
  }, [curriculumData, quizScores]);

  return (
    <div>
      <div className="flex flex-col xs:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl xs:text-3xl font-bold font-serif text-text-primary mb-4 xs:mb-0">Performance Analysis</h1>
        <button onClick={onExit} className="btn-primary">
          <BackIcon />
          Back to Dashboard
        </button>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Average Subject Scores</h2>
        <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
          {performanceData.subjectAverages.map(subject => (
            <div key={subject.name} className="flex flex-col items-center">
              <CircularProgressBar progress={subject.average} />
              <p className="font-semibold mt-4">{subject.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Topics to Revisit</h2>
        {performanceData.weakTopics.length > 0 ? (
          <div className="space-y-2">
            {performanceData.weakTopics.map(topic => (
              <div 
                key={topic.id} 
                onClick={() => onSelectTopic(topic)} 
                className="p-3 xs:p-4 rounded-lg bg-red-50 border border-red-200 flex justify-between items-center cursor-pointer hover:bg-red-100"
              >
                <div>
                  <p className="font-semibold text-red-800 text-sm xs:text-base">{topic.title}</p>
                  <p className="text-xs xs:text-sm text-red-600">Score: {quizScores[topic.id]}/10</p>
                </div>
                <button className="text-xs xs:text-sm font-bold text-red-800">Review Topic →</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-text-tertiary py-4">No weak topics found. Keep up the great work! 🎉</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceTracker;