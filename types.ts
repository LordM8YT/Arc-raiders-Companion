
import type { ComponentType } from 'react';

export interface Quest {
  id: number;
  title: string;
  description: string;
  status: 'incomplete' | 'complete';
  faction: 'Iron Assembly' | 'Free Rangers' | 'ARC';
  objectives: string[];
  rewards: string[];
}

export interface Equipment {
  id: string;
  type: 'Weapon' | 'Armor' | 'Gadget';
  name: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic';
  stats?: Record<string, string | number>;
}

export interface Build {
  id: number;
  name: string;
  raider: 'Celeste' | 'Isabel' | 'Lance';
  description: string;
  equipment: Equipment[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  prereq?: string;
  x: number;
  y: number;
  tier: number;
}

export type SkillTreeData = Skill[];