// src/components/teacher/CreateQuiz.js
import React, { useState } from 'react';

const CreateQuiz = ({ classroomId, token }) => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);

    const handleQuestionChange = (index, event) => {
        const values = [...questions];
        values[index][event.target.name] = event.target.value;
        setQuestions(values);
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const values = [...questions];
        values[qIndex].options[oIndex] = event.target.value;
        setQuestions(values);
    }
    
    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:5000/api/classrooms/quizzes/${classroomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ title, questions }),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold">Create Quiz</h3>
            <input type="text" placeholder="Quiz Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border-2 border-border rounded-lg" />
            
            {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border-2 border-border rounded-lg space-y-2">
                    <input type="text" name="question" placeholder={`Question ${qIndex + 1}`} value={q.question} onChange={e => handleQuestionChange(qIndex, e)} className="w-full p-2 border-2 border-border rounded-lg" />
                    {q.options.map((opt, oIndex) => (
                        <input key={oIndex} type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e)} className="w-full p-2 border-2 border-border rounded-lg" />
                    ))}
                    <input type="text" name="correctAnswer" placeholder="Correct Answer" value={q.correctAnswer} onChange={e => handleQuestionChange(qIndex, e)} className="w-full p-2 border-2 border-border rounded-lg" />
                </div>
            ))}

            <button type="button" onClick={addQuestion} className="btn-secondary">Add Question</button>
            <button type="submit" className="btn-primary">Create Quiz</button>
        </form>
    );
};

export default CreateQuiz;