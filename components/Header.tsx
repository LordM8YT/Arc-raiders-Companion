
import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { View } from '../App';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex space-x-1">
      <button 
        onClick={() => setLang('en')}
        className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${lang === 'en' ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'}`}
      >
        EN
      </button>
      <button 
        onClick={() => setLang('no')}
        className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${lang === 'no' ? 'bg-[var(--color-primary)] text-black' : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'}`}
      >
        NO
      </button>
    </div>
  );
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { t } = useI18n();
  
  const navItems: { id: View; labelKey: string }[] = [
    { id: 'skilltree', labelKey: 'header.skilltree' },
    { id: 'builds', labelKey: 'header.builds' },
    { id: 'quests', labelKey: 'header.quests' },
  ];

  return (
    <header className="bg-[var(--color-surface)] backdrop-blur-md sticky top-0 z-50 border-b border-[var(--color-border)] shadow-lg shadow-[var(--color-primary)]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-primary)] font-orbitron tracking-wider">
              {t('header.title')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out font-orbitron relative
                    ${
                      currentView === item.id
                        ? 'text-black bg-[var(--color-primary)]'
                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'
                    }`}
                >
                  {t(item.labelKey)}
                   {currentView === item.id && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[var(--color-primary)] rounded-full glow-on-active"></span>}
                </button>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
       {/* Mobile Navigation */}
      <nav className="md:hidden flex justify-around p-2 bg-black/30">
         {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex-1 text-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out font-orbitron
                  ${
                    currentView === item.id
                      ? 'bg-[var(--color-primary)] text-black'
                      : 'text-[var(--color-text-primary)]'
                  }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
      </nav>
    </header>
  );
};

export default Header;