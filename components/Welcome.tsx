
import React from 'react';
import { useI18n } from '../i18n/I18nContext';

interface WelcomeProps {
    onEnter: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onEnter }) => {
    const { t } = useI18n();

    return (
        <div 
            className="min-h-screen w-full flex flex-col items-center justify-center hex-background p-4"
        >
            <div className="text-center terminal-card p-8 md:p-12 rounded-xl border-[var(--color-primary)]/30 shadow-2xl shadow-[var(--color-primary)]/10">
                <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-primary)] font-orbitron tracking-widest uppercase">
                    {t('welcome.title')}
                </h1>
                <p className="mt-4 text-lg md:text-xl text-[var(--color-text-primary)]">
                    {t('welcome.subtitle')}
                </p>
                <button 
                    onClick={onEnter}
                    className="mt-10 px-8 py-4 bg-[var(--color-primary)] text-black font-bold rounded-lg text-lg font-orbitron uppercase tracking-wider
                               hover:bg-white hover:shadow-xl hover:shadow-[var(--color-primary)]/40 transform hover:scale-105
                               transition-all duration-300 ease-in-out animate-pulse"
                >
                    {t('welcome.enter')}
                </button>
            </div>
        </div>
    );
};

export default Welcome;