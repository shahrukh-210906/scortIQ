import React from 'react';
import { Logo, PerformanceIcon, UserIcon, LogoutIcon } from './ui/Icons';

const Navigation = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="bg-white/90 backdrop-blur-lg p-2 sm:p-3 flex justify-between items-center sticky top-0 z-40 border-b border-brand-primary/20 shadow-sm">
      <div className="flex items-center space-x-2 xs:space-x-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 xs:gap-3 text-lg xs:text-xl font-bold text-text-primary transition-transform duration-200 hover:scale-105"
        >
          <Logo />
          <span className="font-serif hidden sm:inline">ScortIQ</span>
        </button>
      </div>
      <div className="flex items-center space-x-2 xs:space-x-4">
        <button
          onClick={() => onNavigate('performance')}
          className="font-semibold text-text-secondary hover:text-brand-primary transition-colors flex items-center gap-2 p-2 rounded-lg hover:bg-brand-primary/5"
        >
          <PerformanceIcon />
          <span className="hidden md:inline">Performance</span>
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-2 sm:pl-4">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <UserIcon />
            </div>
            <div className="text-left">
              <div className="text-text-primary font-bold text-sm xs:text-base leading-tight">
                {user.name}
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-sans font-semibold"
              >
                <LogoutIcon/>
                Logout
              </button>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;