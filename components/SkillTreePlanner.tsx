
import React, { useState, useMemo } from 'react';
import type { Skill } from '../types';
import { mockSkillTree } from '../data/mockData';

const SkillNode: React.FC<{
  skill: Skill;
  isUnlocked: boolean;
  isAvailable: boolean;
  onClick: (skill: Skill) => void;
  onHover: (skill: Skill | null) => void;
}> = ({ skill, isUnlocked, isAvailable, onClick, onHover }) => {
  const Icon = skill.icon;

  let nodeClasses = 'w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 ';
  let iconClasses = 'w-8 h-8 transition-colors duration-300 ';

  if (isUnlocked) {
    nodeClasses += 'bg-cyan-500 border-2 border-cyan-300 shadow-lg shadow-cyan-500/50';
    iconClasses += 'text-white';
  } else if (isAvailable) {
    nodeClasses += 'bg-gray-600 border-2 border-cyan-400 animate-pulse';
    iconClasses += 'text-cyan-300';
  } else {
    nodeClasses += 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed';
    iconClasses += 'text-gray-500';
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
  const TOTAL_POINTS = 20;
  const [unlockedSkills, setUnlockedSkills] = useState<Set<string>>(new Set());
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const pointsSpent = unlockedSkills.size;

  const handleSkillClick = (skill: Skill) => {
    const isUnlocked = unlockedSkills.has(skill.id);
    const isAvailable = (pointsSpent < TOTAL_POINTS) && (!skill.prereq || unlockedSkills.has(skill.prereq));
    
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
            alert("Cannot unlearn skill: other skills depend on it.")
        }
    }
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
      <h2 className="text-3xl font-bold text-center mb-4 text-cyan-300 font-orbitron">Skill Tree Planner</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Panel: Info & Controls */}
        <div className="w-full md:w-1/4 lg:w-1/5 order-2 md:order-1">
          <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg border border-gray-700 sticky top-24">
            <div className="text-center mb-4">
              <p className="text-lg font-orbitron">Skill Points</p>
              <p className="text-4xl font-bold text-cyan-400">{TOTAL_POINTS - pointsSpent} <span className="text-lg text-gray-400">/ {TOTAL_POINTS}</span></p>
            </div>
            <button
              onClick={handleReset}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors font-orbitron"
            >
              Reset Tree
            </button>
            <div className="mt-6 h-48 p-3 bg-gray-900/50 rounded-md border border-gray-600 overflow-y-auto">
              {hoveredSkill ? (
                <div>
                  <h4 className="text-lg font-bold text-cyan-400">{hoveredSkill.name}</h4>
                  <p className="text-sm text-gray-300 mt-1">{hoveredSkill.description}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-center pt-16">Hover over a skill for details</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Skill Tree */}
        <div className="w-full md:w-3/4 lg:w-4/5 order-1 md:order-2">
            <div className="relative w-full aspect-video bg-gray-800 bg-opacity-50 rounded-lg border-2 border-gray-700 overflow-hidden">
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
                            stroke={isPathUnlocked ? '#22D3EE' : '#4A5568'}
                            strokeWidth="2"
                            className="transition-all duration-300"
                        />
                        );
                    })}
                </svg>
                <div className="relative w-full h-full z-10">
                    {mockSkillTree.map(skill => {
                        const isUnlocked = unlockedSkills.has(skill.id);
                        const isAvailable = (pointsSpent < TOTAL_POINTS) && (!skill.prereq || unlockedSkills.has(skill.prereq));
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
