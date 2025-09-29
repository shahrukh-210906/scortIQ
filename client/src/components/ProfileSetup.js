// src/components/ProfileSetup.js
import React, { useState } from 'react';
import { Logo } from './ui/Icons';

const ProfileSetup = ({ token, onProfileComplete }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [selectedClass, setSelectedClass] = useState('');
  const [language, setLanguage] = useState('Hindi');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = { name, role };
    if (role === 'student') {
      profileData.class = selectedClass;
      profileData.language = language;
    }

    try {
      const res = await fetch('http://localhost:5000/api/profile/setup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(profileData),
      });

      const updatedUser = await res.json();

      if (res.ok) {
        onProfileComplete(updatedUser);
      } else {
        console.error('Failed to update profile:', updatedUser.errors || updatedUser.msg);
      }
    } catch (error) {
      console.error('Error setting up profile:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-page">
      <div className="w-full max-w-md p-8 space-y-8 card z-10">
        <div className="text-center">
          <Logo />
          <h1 className="text-3xl font-bold font-serif text-text-primary mt-4">
            One Last Step!
          </h1>
          <p className="text-text-secondary mt-2">
            Let's set up your profile.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm font-bold text-text-primary">
              What should we call you?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="role" className="text-sm font-bold text-text-primary">
              I am a...
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {role === 'student' && (
            <>
              <div>
                <label htmlFor="class" className="text-sm font-bold text-text-primary">
                  Class
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                  className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
                >
                  <option value="" disabled>Select your class</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
              <div>
                <label htmlFor="language" className="text-sm font-bold text-text-primary">
                  Preferred Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
                >
                  <option value="Hindi">Hinglish (Hindi)</option>
                  <option value="English">English</option>
                  <option value="Telugu">Tenglish (Telugu)</option>
                  <option value="Punjabi">Punglish (Punjabi)</option>
                  <option value="Gujarati">Gujlish (Gujarati)</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="w-full btn-primary justify-center">
            Let's Go!
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;