import React from 'react';
import { Logo, PerformanceIcon, SandboxIcon } from './ui/Icons';

const Navigation = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md p-2 xs:p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm border-b border-border">
      <div className="flex items-center space-x-2 xs:space-x-4">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center gap-2 xs:gap-3 text-lg xs:text-xl font-bold text-text-primary"
        >
          <Logo />
          <span className="font-serif hidden sm:inline">ScortIQ</span>
        </button>
      </div>
      <div className="flex items-center space-x-2 xs:space-x-6">
        <button 
          onClick={() => onNavigate('performance')} 
          className="font-semibold text-text-secondary hover:text-brand-primary transition-colors flex items-center gap-2"
        >
          <PerformanceIcon />
          <span className="hidden md:inline">Performance</span>
        </button>
        <button 
          onClick={() => onNavigate('sandbox')} 
          className="font-semibold text-text-secondary hover:text-brand-primary transition-colors flex items-center gap-2"
        >
          <SandboxIcon />
           <span className="hidden md:inline">AI Sandbox</span>
        </button>
        <div className="text-right">
          <div className="text-text-primary font-semibold text-sm xs:text-base">
            {user.name} <span className="text-xs text-text-tertiary hidden xs:inline">(Class {user.class})</span>
          </div>
          <button 
            onClick={onLogout} 
            className="text-xs xs:text-sm text-text-tertiary hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;