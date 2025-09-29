import React, { useState } from 'react';

const FillBlankInput = ({ question, onSubmit, isLoading }) => {
  const [values, setValues] = useState(Array(question.blanks.length).fill(''));
  const [status, setStatus] = useState('pending');

  const handleChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const handleSubmit = () => {
    if (values.some(v => !v.trim())) return;
    let allCorrect = true;
    question.blanks.forEach((blank, index) => {
      if (values[index].trim().toLowerCase() !== blank.correct_answer.toLowerCase()) {
        allCorrect = false;
      }
    });
    setStatus(allCorrect ? 'correct' : 'incorrect');
    setTimeout(() => {
      const userAnswer = question.template.map((part, i) => {
        if (part === '____') {
          const blankIndex = question.template.slice(0, i + 1).filter(p => p === '____').length - 1;
          return `__${values[blankIndex] || ''}__`;
        }
        return part;
      }).join('');
      onSubmit(userAnswer);
      setStatus('pending');
      setValues(Array(question.blanks.length).fill(''));
    }, 1200);
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="p-4 bg-background-alt rounded-lg flex items-center flex-wrap gap-2 text-lg font-mono justify-center">
        {question.template.map((part, index) => {
          if (part === '____') {
            const blankIndex = question.template.slice(0, index + 1).filter(p => p === '____').length - 1;
            return (
              <input 
                key={`blank-${blankIndex}`} 
                type="text" 
                value={values[blankIndex] || ''} 
                onChange={(e) => handleChange(blankIndex, e.target.value)} 
                className="w-24 p-1 text-center bg-white border-2 rounded-md focus:outline-none" 
                style={{ 
                  borderColor: status === 'pending' ? '#CBD5E0' : status === 'correct' ? '#38A169' : '#E53E3E' 
                }} 
                disabled={isLoading || status !== 'pending'} 
                autoFocus={blankIndex === 0} 
              />
            );
          }
          return <span key={`part-${index}`}>{part}</span>;
        })}
      </div>
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleSubmit} 
          disabled={isLoading || status !== 'pending'} 
          className="py-2 px-4 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green/90 transition disabled:bg-green-300"
        >
          Check Answer
        </button>
      </div>
    </div>
  );
};

export default FillBlankInput;