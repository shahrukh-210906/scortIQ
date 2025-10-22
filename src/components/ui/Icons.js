import React from 'react';

// A single definition for the sketchy filter to be reused by all icons
export const SvgDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="sketchy" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </defs>
  </svg>
);

export const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 13V12C12 10.3431 13.3431 9 15 9C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15C13.3431 15 12 13.6569 12 12ZM12 13H11C9.34315 13 8 11.6569 8 10C8 8.34315 9.34315 7 11 7C12.6569 7 14 8.34315 14 10V10.5M12 13V15.5M12 18.5V18.51" stroke="#4A694E" fill="none" filter="url(#sketchy)"/>
    <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="#4A694E" fill="none" filter="url(#sketchy)"/>
  </svg>
);

export const PhysicsIcon = () => (
  <div className="p-3 rounded-xl mr-4 bg-subject-physics">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" filter="url(#sketchy)" />
    </svg>
  </div>
);

export const ChemistryIcon = () => (
  <div className="p-3 rounded-xl mr-4 bg-subject-chemistry">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" filter="url(#sketchy)" />
    </svg>
  </div>
);

export const BiologyIcon = () => (
  <div className="p-3 rounded-xl mr-4 bg-subject-biology">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" filter="url(#sketchy)" />
    </svg>
  </div>
);

export const CheckCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-success" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path filter="url(#sketchy)" fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const InProgressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
    <path filter="url(#sketchy)" fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

export const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-danger" viewBox="0 0 20 20" fill="currentColor">
    <path filter="url(#sketchy)" fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" filter="url(#sketchy)" />
  </svg>
);

export const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.443V21a1 1 0 11-2 0v-2.557a3.374 3.374 0 00-.79-.208l-.547-.547z" filter="url(#sketchy)" />
  </svg>
);

export const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" filter="url(#sketchy)" />
  </svg>
);

export const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" filter="url(#sketchy)" />
  </svg>
);

export const SandboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" filter="url(#sketchy)" />
  </svg>
);

export const PerformanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" filter="url(#sketchy)" />
  </svg>
);

export const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" filter="url(#sketchy)" />
  </svg>
);

export const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" filter="url(#sketchy)" />
  </svg>
);