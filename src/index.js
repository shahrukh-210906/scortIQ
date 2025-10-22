import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// Initialize EmailJS with your public key
// IMPORTANT: Replace with your actual EmailJS Public Key
if (window.emailjs) {
  window.emailjs.init("KnIGVvTmQf-DNiNgS");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);