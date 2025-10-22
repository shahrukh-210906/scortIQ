import React from 'react';
import {
  FloatingBookIcon,
  FloatingPencilIcon,
  FloatingProtractorIcon,
  FloatingAtomIcon
} from './Icons'; // Assuming Icons.js is in the same folder

const FloatingBook = () => (
  <div className="floating-item text-[#EAEFE6] text-opacity-50" style={{ top: '15%', left: '5%', animationDelay: '0s', width: '80px', height: '80px' }}>
     {/* Apply text color/opacity to the div for FA icon */}
    <FloatingBookIcon className="w-full h-full" style={{ stroke: '#4A694E', strokeWidth: '10px' }}/> {/* Adjust stroke styling if needed */}
  </div>
);

const FloatingPencil = () => (
  <div className="floating-item text-[#F5F0E9] text-opacity-50" style={{ top: '20%', right: '8%', animationDelay: '2s', transform: 'rotate(45deg)', width: '60px', height: '60px' }}>
    <FloatingPencilIcon className="w-full h-full" style={{ stroke: '#8B6F4E', strokeWidth: '10px' }}/> {/* Adjust stroke styling if needed */}
  </div>
);

const FloatingProtractor = () => (
  <div className="floating-item text-[#E6EFEE] text-opacity-50" style={{ bottom: '10%', left: '10%', animationDelay: '4s', width: '90px', height: '90px' }}>
    <FloatingProtractorIcon className="w-full h-full" style={{ stroke: '#4A694E', strokeWidth: '10px' }}/> {/* Adjust stroke styling if needed */}
  </div>
);

const FloatingAtom = () => (
  <div className="floating-item text-[#4A694E] text-opacity-50" style={{ bottom: '15%', right: '5%', animationDelay: '6s', width: '70px', height: '70px' }}>
    <FloatingAtomIcon className="w-full h-full" /> {/* Color set via text color */}
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