
import React, { useState, useMemo, useRef } from 'react';
import type { Skill } from '../types';
import { mockSkillTree } from '../data/mockData';
import { useI18n } from '../i18n/I18nContext';
import { UploadIcon } from './icons';

const SkillNode: React.FC<{
  skill: Skill;
  isUnlocked: boolean;
  isAvailable: boolean;
  onClick: (skill: Skill) => void;
  onHover: (skill: Skill | null) => void;
}> = ({ skill, isUnlocked, isAvailable, onClick, onHover }) => {
  const Icon = skill.icon;

  let nodeClasses = 'w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 border-2 ';
  let iconClasses = 'w-8 h-8 transition-colors duration-300 ';

  if (isUnlocked) {
    nodeClasses += 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/50';
    iconClasses += 'text-black';
  } else if (isAvailable) {
    nodeClasses += 'bg-[var(--color-surface)] border-[var(--color-primary)] animate-pulse';
    iconClasses += 'text-[var(--color-primary)]';
  } else {
    nodeClasses += 'bg-black/30 border-[var(--color-border)] cursor-not-allowed';
    iconClasses += 'text-[var(--color-text-secondary)]';
  }

  return (
    <div
      className="absolute"
      style={{ left: `${skill.x}%`, top: `${skill.y}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        onClick={() => onClick(skill)}
        disabled={!isAvailable && !isUnlocked}
        className={nodeClasses}
      >
        <Icon className={iconClasses} />
      </button>
    </div>
  );
};

const SkillTreePlanner: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState(20);
  const [unlockedSkills, setUnlockedSkills] = useState<Set<string>>(new Set());
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [contributionMessage, setContributionMessage] = useState('');
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pointsSpent = unlockedSkills.size;

  const handleSkillClick = (skill: Skill) => {
    const isUnlocked = unlockedSkills.has(skill.id);
    const isAvailable = (pointsSpent < totalPoints) && (!skill.prereq || unlockedSkills.has(skill.prereq));
    
    if (!isUnlocked && isAvailable) {
      const newUnlocked = new Set(unlockedSkills);
      newUnlocked.add(skill.id);
      setUnlockedSkills(newUnlocked);
    } else if (isUnlocked) {
        // Simple logic: allow deselecting only if no other skills depend on it
        const dependents = mockSkillTree.filter(s => s.prereq === skill.id && unlockedSkills.has(s.id));
        if(dependents.length === 0) {
            const newUnlocked = new Set(unlockedSkills);
            newUnlocked.delete(skill.id);
            setUnlockedSkills(newUnlocked);
        } else {
            alert(t('skillTree.unlearnError'));
        }
    }
  };
  
  const handleSync = () => {
    setIsSyncing(true);
    setSyncMessage('');
    const pointsGained = Math.floor(Math.random() * 2) + 1; // Gain 1 or 2 points
    setTimeout(() => {
        setTotalPoints(prev => prev + pointsGained);
        setSyncMessage(t('skillTree.syncSuccess', { points: pointsGained }));
        setIsSyncing(false);
        setTimeout(() => setSyncMessage(''), 3000);
    }, 2000);
  };
  
  const handleContributeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        console.log(`--- Community Contribution: Skill Tree ---`);
        console.log(`Filename: ${file.name}`);
        console.log('Content:', content);
        console.log(`----------------------------------------`);
        setContributionMessage(t('skillTree.contributeSuccess', { filename: file.name }));
        setTimeout(() => setContributionMessage(''), 4000);
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };


  const handleReset = () => {
    setUnlockedSkills(new Set());
  };

  const skillCoords = useMemo(() => {
    const coords = new Map<string, {x: number, y: number}>();
    mockSkillTree.forEach(skill => coords.set(skill.id, { x: skill.x, y: skill.y }));
    return coords;
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4 text-[var(--color-primary)] font-orbitron">{t('skillTree.title')}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Panel: Info & Controls */}
        <div className="w-full md:w-1/4 lg:w-1/5 order-2 md:order-1">
          <div className="terminal-card p-4 rounded-lg sticky top-24">
            <div className="text-center mb-4">
              <p className="text-lg font-orbitron">{t('skillTree.skillPoints')}</p>
              <p className="text-4xl font-bold text-[var(--color-primary)]">{totalPoints - pointsSpent} <span className="text-lg text-[var(--color-text-secondary)]">/ {totalPoints}</span></p>
            </div>
            <div className="space-y-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json,.txt" className="hidden" />
                <button
                    onClick={handleContributeClick}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-orbitron"
                >
                    <UploadIcon className="h-5 w-5" />
                    <span>{t('skillTree.contributeButton')}</span>
                </button>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 font-orbitron"
                >
                    {isSyncing && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    <span>{isSyncing ? t('skillTree.syncingButton') : t('skillTree.syncButton')}</span>
                </button>
                 <button
                    onClick={handleReset}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors font-orbitron"
                >
                    {t('skillTree.resetButton')}
                </button>
            </div>
             {syncMessage && <div className="text-center mt-2 text-sm text-purple-300">{syncMessage}</div>}
             {contributionMessage && <div className="text-center mt-2 text-sm text-green-300">{contributionMessage}</div>}

            <div className="mt-6 h-48 p-3 bg-black/30 rounded-md border border-[var(--color-border)] overflow-y-auto">
              {hoveredSkill ? (
                <div>
                  <h4 className="text-lg font-bold text-[var(--color-primary)]">{hoveredSkill.name}</h4>
                  <p className="text-sm text-[var(--color-text-primary)] mt-1">{hoveredSkill.description}</p>
                </div>
              ) : (
                <p className="text-[var(--color-text-secondary)] text-center pt-16">{t('skillTree.hoverPrompt')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Skill Tree */}
        <div className="w-full md:w-3/4 lg:w-4/5 order-1 md:order-2">
            <div className="relative w-full aspect-video terminal-card rounded-lg overflow-hidden hex-background">
                <svg className="absolute w-full h-full" style={{ zIndex: 0 }}>
                    <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4A5568" />
                        </marker>
                    </defs>
                    {mockSkillTree.map(skill => {
                        if (!skill.prereq) return null;
                        const prereqCoords = skillCoords.get(skill.prereq);
                        const selfCoords = skillCoords.get(skill.id);
                        if (!prereqCoords || !selfCoords) return null;

                        const isPathUnlocked = unlockedSkills.has(skill.id) && unlockedSkills.has(skill.prereq);

                        return (
                        <line
                            key={`${skill.prereq}-${skill.id}`}
                            x1={`${prereqCoords.x}%`}
                            y1={`${prereqCoords.y}%`}
                            x2={`${selfCoords.x}%`}
                            y2={`${selfCoords.y}%`}
                            stroke={isPathUnlocked ? 'var(--color-primary)' : 'var(--color-border)'}
                            strokeWidth="2"
                            className="transition-all duration-300"
                        />
                        );
                    })}
                </svg>
                <div className="relative w-full h-full z-10">
                    {mockSkillTree.map(skill => {
                        const isUnlocked = unlockedSkills.has(skill.id);
                        const isAvailable = (pointsSpent < totalPoints) && (!skill.prereq || unlockedSkills.has(skill.prereq));
                        return (
                        <SkillNode
                            key={skill.id}
                            skill={skill}
                            isUnlocked={isUnlocked}
                            isAvailable={!isUnlocked && isAvailable}
                            onClick={handleSkillClick}
                            onHover={setHoveredSkill}
                        />
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreePlanner;
