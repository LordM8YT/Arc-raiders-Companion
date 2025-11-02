
import React from 'react';

type View = 'quests' | 'builds' | 'skilltree';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItems: { id: View; label: string }[] = [
    { id: 'skilltree', label: 'Skill Tree' },
    { id: 'builds', label: 'Builds' },
    { id: 'quests', label: 'Quests' },
  ];

  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-cyan-400 font-orbitron tracking-wider">
              ARC RAIDERS COMPANION
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out font-orbitron
                  ${
                    currentView === item.id
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/50'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
       {/* Mobile Navigation */}
      <nav className="md:hidden flex justify-around p-2 bg-gray-800">
         {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out font-orbitron
                  ${
                    currentView === item.id
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300'
                  }`}
              >
                {item.label}
              </button>
            ))}
      </nav>
    </header>
  );
};

export default Header;
