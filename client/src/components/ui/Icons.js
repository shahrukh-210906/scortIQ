// src/components/ui/Icons.js
import React from 'react';

// The SvgDefs component is no longer needed with Font Awesome.

export const Logo = () => (
    <i className="fa-solid fa-brain fa-fw text-brand-primary" style={{ fontSize: '28px' }}></i>
);

export const PhysicsIcon = () => (
  <div className="p-3 rounded-xl mr-4 bg-blue-100">
    <i className="fa-solid fa-bolt fa-fw text-blue-600 text-2xl"></i>
  </div>
);

export const ChemistryIcon = () => (
  <div className="p-3 rounded-xl mr-4 bg-orange-100">
    <i className="fa-solid fa-flask-vial fa-fw text-orange-600 text-2xl"></i>
  </div>
);

export const BiologyIcon = () => (
  <div className="p-3 rounded-xl mr-4 bg-green-100">
    <i className="fa-solid fa-dna fa-fw text-green-600 text-2xl"></i>
  </div>
);

export const CheckCircleIcon = (props) => (
    <i className="fa-solid fa-circle-check text-brand-success" {...props}></i>
);

export const InProgressIcon = () => (
    <i className="fa-solid fa-clock text-yellow-500"></i>
);

export const WarningIcon = () => (
    <i className="fa-solid fa-triangle-exclamation text-brand-danger"></i>
);

export const SendIcon = () => (
    <i className="fa-solid fa-paper-plane fa-fw"></i>
);

export const BrainIcon = () => (
    <i className="fa-solid fa-brain fa-fw"></i>
);

export const ChevronDown = () => (
    <i className="fa-solid fa-chevron-down text-text-tertiary"></i>
);

export const BackIcon = () => (
    <i className="fa-solid fa-arrow-left fa-fw"></i>
);

export const SandboxIcon = () => (
    <i className="fa-solid fa-cubes text-xl"></i>
);

export const PerformanceIcon = () => (
    <i className="fa-solid fa-chart-line fa-fw"></i>
);

export const UserIcon = () => (
    <i className="fa-solid fa-user text-brand-primary"></i>
);

export const LogoutIcon = () => (
    <i className="fa-solid fa-right-from-bracket fa-fw"></i>
);



export const ClassroomIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 4H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);