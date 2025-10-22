import React, { useState } from 'react';
import { SendIcon } from '../../ui/Icons';

const OpenEndedInput = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border flex items-center gap-4">
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Type your answer..." 
        className="w-full p-3 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition" 
        disabled={isLoading} 
        autoFocus 
      />
      <button 
        type="submit" 
        disabled={isLoading || !text.trim()} 
        className="p-3 bg-brand-green text-white rounded-lg disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-brand-green/90 transition"
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default OpenEndedInput;