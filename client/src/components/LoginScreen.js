// src/components/LoginScreen.js
import React, { useState } from 'react';
import { Logo } from './ui/Icons';
// import FloatingElements from './ui/FloatingElements';

const LoginScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = { email, password };

    try {
      const res = await fetch(`http://localhost:5000${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data);
      } else {
        const errorMsg = data.errors ? data.errors[0].msg : 'An error occurred.';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Could not connect to the server.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-page relative overflow-hidden">
      {/* <FloatingElements /> */}
      <div className="w-full max-w-md p-6 xs:p-8 space-y-6 xs:space-y-8 card z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-brand-primary/10">
              <Logo />
            </div>
          </div>
          <h1 className="text-2xl xs:text-3xl font-bold font-serif text-text-primary mt-4">
            Welcome to ScortIQ
          </h1>
          <p className="text-sm xs:text-base text-text-secondary mt-2">
            Your personal AI tutor for smarter learning.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-bold text-text-primary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-text-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 text-text-primary bg-background-alt rounded-lg border-2 border-border focus:border-brand-primary focus:outline-none transition"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full btn-primary justify-center"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="text-center">
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
            }}
            className="text-sm text-text-secondary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;