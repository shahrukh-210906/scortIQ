import React, { useState } from 'react';
import { Logo } from './ui/Icons';
import FloatingElements from './ui/FloatingElements';

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && selectedClass) {
      onLogin({ name, class: selectedClass, language });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-page relative overflow-hidden">
      <FloatingElements />
      <div className="w-full max-w-md p-6 xs:p-8 space-y-6 xs:space-y-8 card z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-brand-primary/10">
              <Logo />
            </div>
          </div>
          <h1 className="text-2xl xs:text-3xl font-bold font-serif text-text-primary mt-4">Welcome to ScortIQ</h1>
          <p className="text-sm xs:text-base text-text-secondary mt-2">Your personal AI tutor for smarter learning.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm font-bold text-text-primary">Name</label>
            <input 
              id="name" 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition" 
            />
          </div>
          <div>
            <label htmlFor="class" className="text-sm font-bold text-text-primary">Class</label>
            <select 
              id="class" 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)} 
              required
              className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            >
              <option value="" disabled>Select a class</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="text-sm font-bold text-text-primary">Preferred Language</label>
            <select 
              id="language" 
              value={language} 
              onChange={e => setLanguage(e.target.value)} 
              className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Gujarati">Gujarati</option>
            </select>
            <p className="text-xs text-text-tertiary mt-2">
              Note: The text for all languages will be in English characters (e.g., Hinglish).
            </p>
          </div>
          <button type="submit" className="w-full btn-primary justify-center">
            Enter Classroom
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;