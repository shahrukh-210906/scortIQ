import React from 'react';

const FloatingBook = () => (
  <div className="floating-item" style={{ top: '15%', left: '5%', animationDelay: '0s' }}>
    <svg width="80" height="80" viewBox="0 0 24 24" fill="#EAEFE6">
      <path d="M19 2H9C7.89543 2 7 2.89543 7 4V20C7 21.1046 7.89543 22 9 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2Z" stroke="#4A694E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H7" stroke="#4A694E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const FloatingPencil = () => (
  <div className="floating-item" style={{ top: '20%', right: '8%', animationDelay: '2s', transform: 'rotate(45deg)' }}>
    <svg width="60" height="60" viewBox="0 0 24 24" fill="#F5F0E9">
      <path d="M4 20H20L18.889 12.4445C18.5843 10.4219 17.0131 8.85072 15 8.546L14 8.4C12.9443 8.29443 12.2944 7.64431 12.4 6.58858L12.546 5.5C12.8507 3.98689 11.5781 2.41575 9.55555 2.11107L2 4V20Z" stroke="#8B6F4E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const FloatingProtractor = () => (
  <div className="floating-item" style={{ bottom: '10%', left: '10%', animationDelay: '4s' }}>
    <svg width="90" height="90" viewBox="0 0 24 24" fill="#E6EFEE">
      <path d="M3 19H21M12 19V12M12 5C15.866 5 19 8.13401 19 12H5C5 8.13401 8.13401 5 12 5Z" stroke="#4A694E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const FloatingAtom = () => (
  <div className="floating-item" style={{ bottom: '15%', right: '5%', animationDelay: '6s' }}>
    <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#4A694E" strokeWidth="1"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#4A694E" strokeWidth="1"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#4A694E" strokeWidth="1"/>
      <circle cx="12" cy="12" r="1.5" fill="#4A694E"/>
    </svg>
  </div>
);

const FloatingElements = () => (
  <>
    <FloatingBook />
    <FloatingPencil />
    <FloatingProtractor />
    <FloatingAtom />
  </>
);

export default FloatingElements;