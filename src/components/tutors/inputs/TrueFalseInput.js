import React, { useState } from 'react';

const TrueFalseInput = ({ question, onSubmit, isLoading }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    setTimeout(() => {
      onSubmit(option);
      setSelected(null);
    }, 1200);
  };

  const getButtonClass = (option) => {
    if (selected === null) return 'bg-white hover:bg-blue-50 border-border';
     const isCorrect = option === question.correct_answer;
    if (option === selected) {
      return isCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800';
    }
    return 'bg-gray-100 border-gray-200 text-gray-500';
  };

  return (
    <div className="p-4 border-t border-border grid grid-cols-2 gap-4">
      <button 
        onClick={() => handleSelect("True")} 
        disabled={selected !== null || isLoading} 
        className={`w-full p-3 text-center font-bold rounded-lg border-2 transition-all ${getButtonClass("True")}`}
      >
        True
      </button>
      <button 
        onClick={() => handleSelect("False")} 
        disabled={selected !== null || isLoading} 
        className={`w-full p-3 text-center font-bold rounded-lg border-2 transition-all ${getButtonClass("False")}`}
      >
        False
      </button>
    </div>
  );
};

export default TrueFalseInput;