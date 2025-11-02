
import type { Quest, Build, Equipment, SkillTreeData } from '../types';
import { ShieldIcon, ZapIcon, TargetIcon, PlusIcon, BoltIcon, CpuIcon, EyeIcon } from '../components/icons';

export const mockQuests: Quest[] = [
  { id: 1, title: 'Scrap Metal', description: 'Collect 50 pieces of ARC machinery scrap from the Dust Devil sector.', status: 'incomplete', faction: 'ARC' },
  { id: 2, title: 'Ranger Recon', description: 'Scout the old comms tower without being detected by machine patrols.', status: 'incomplete', faction: 'Free Rangers' },
  { id: 3, title: 'Assembly Line Disruption', description: 'Sabotage the main converter at the Iron Assembly forge.', status: 'incomplete', faction: 'Iron Assembly' },
  { id: 4, title: 'Supply Run', description: 'Recover a lost medical crate for the Free Rangers camp.', status: 'complete', faction: 'Free Rangers' },
];

const equipmentDB: Record<string, Equipment> = {
  // Assault
  ar1: { id: 'ar1', type: 'Weapon', name: 'Voltaic Repeater', description: 'Standard issue assault rifle. Reliable with a high rate of fire.', rarity: 'Common' },
  sg1: { id: 'sg1', type: 'Weapon', name: 'Breaker Shotgun', description: 'Devastating at close range, but slow to reload.', rarity: 'Uncommon' },
  armor1: { id: 'armor1', type: 'Armor', name: 'Plasteel Chestplate', description: 'Standard kinetic plating. Provides decent protection.', rarity: 'Common' },
  armor2: { id: 'armor2', type: 'Armor', name: 'Ablative Armor', description: 'Reduces incoming energy damage.', rarity: 'Rare' },
  gadget1: { id: 'gadget1', type: 'Gadget', name: 'Frag Grenade', description: 'A classic that gets the job done.', rarity: 'Common' },
  // Recon
  sr1: { id: 'sr1', type: 'Weapon', name: 'Deadeye Rifle', description: 'High-powered sniper rifle. Requires a steady hand.', rarity: 'Rare' },
  pistol1: { id: 'pistol1', type: 'Weapon', name: 'Sidearm Mk. II', description: 'A reliable backup weapon for tight situations.', rarity: 'Common' },
  armor3: { id: 'armor3', type: 'Armor', name: 'Lightweave Cloak', description: 'Reduces visibility and dampens sound.', rarity: 'Epic' },
  gadget2: { id: 'gadget2', type: 'Gadget', name: 'Recon Drone', description: 'Deployable drone to spot and mark enemies.', rarity: 'Rare' },
  // Support
  lmg1: { id: 'lmg1', type: 'Weapon', name: 'Suppressor LMG', description: 'Lays down a high volume of suppressive fire.', rarity: 'Uncommon' },
  armor4: { id: 'armor4', type: 'Armor', name: 'Reinforced Exo-frame', description: 'Increases carrying capacity and melee resistance.', rarity: 'Rare' },
  gadget3: { id: 'gadget3', type: 'Gadget', name: 'Medi-gel Projector', description: 'Deploys a field that heals allies over time.', rarity: 'Epic' },
};

export const mockBuilds: Build[] = [
  { 
    id: 1, 
    name: 'Frontline Breacher', 
    class: 'Assault', 
    description: 'A close-quarters build focused on overwhelming enemies with aggressive pushes.',
    equipment: [equipmentDB.sg1, equipmentDB.armor2, equipmentDB.gadget1],
  },
  { 
    id: 2, 
    name: 'Ghost Operative', 
    class: 'Recon', 
    description: 'A stealth build designed for flanking and eliminating high-value targets from a distance.',
    equipment: [equipmentDB.sr1, equipmentDB.armor3, equipmentDB.gadget2],
  },
  { 
    id: 3, 
    name: 'Combat Medic', 
    class: 'Support', 
    description: 'A support build that keeps the team alive while providing suppressive fire.',
    equipment: [equipmentDB.lmg1, equipmentDB.armor4, equipmentDB.gadget3],
  }
];

export const mockSkillTree: SkillTreeData = [
  // Tier 0 - Root
  { id: 'core_systems', name: 'Core Systems', description: 'Base operational systems unlocked.', icon: CpuIcon, x: 50, y: 10, tier: 0 },

  // Tier 1 - Branches from Core
  { id: 'def_up', name: 'Improved Plating', description: 'Increases base armor by 10%.', icon: ShieldIcon, prereq: 'core_systems', x: 20, y: 30, tier: 1 },
  { id: 'atk_up', name: 'Overcharged Capacitors', description: 'Increases base weapon damage by 5%.', icon: BoltIcon, prereq: 'core_systems', x: 50, y: 30, tier: 1 },
  { id: 'util_up', name: 'Enhanced Scanners', description: 'Increases enemy detection range.', icon: EyeIcon, prereq: 'core_systems', x: 80, y: 30, tier: 1 },

  // Tier 2 - Defense Branch
  { id: 'def_t2_regen', name: 'Shield Regen', description: 'Shield starts regenerating sooner after taking damage.', icon: ShieldIcon, prereq: 'def_up', x: 10, y: 50, tier: 2 },
  { id: 'def_t2_blast', name: 'Blast Shielding', description: 'Reduces damage from explosive sources.', icon: ShieldIcon, prereq: 'def_up', x: 30, y: 50, tier: 2 },
  
  // Tier 2 - Attack Branch
  { id: 'atk_t2_crit', name: 'Precision Targeting', description: 'Increases critical hit damage by 25%.', icon: TargetIcon, prereq: 'atk_up', x: 50, y: 50, tier: 2 },

  // Tier 2 - Utility Branch
  { id: 'util_t2_speed', name: 'Lightweight Actuators', description: 'Increases sprint speed by 15%.', icon: ZapIcon, prereq: 'util_up', x: 70, y: 50, tier: 2 },
  { id: 'util_t2_resource', name: 'Resource Scavenger', description: 'Find more resources from salvage.', icon: PlusIcon, prereq: 'util_up', x: 90, y: 50, tier: 2 },

  // Tier 3 - Cross-branch
  { id: 'def_atk_t3', name: 'Vengeance', description: 'Gain a temporary damage boost after your shield breaks.', icon: BoltIcon, prereq: 'def_t2_blast', x: 40, y: 70, tier: 3 },
  { id: 'atk_util_t3', name: 'Adrenaline Rush', description: 'Getting a critical hit grants a temporary movement speed boost.', icon: ZapIcon, prereq: 'atk_t2_crit', x: 60, y: 70, tier: 3 },
  
  // Tier 4 - Ultimate
  { id: 'ultimate_overload', name: 'System Overload', description: 'Ultimate: Massively boosts damage and speed for a short duration, but disables shields.', icon: CpuIcon, prereq: 'def_atk_t3', x: 50, y: 90, tier: 4 },
  { id: 'ultimate_stealth', name: 'Phantom Protocol', description: 'Ultimate: Become nearly invisible for a short duration.', icon: EyeIcon, prereq: 'atk_util_t3', x: 50, y: 90, tier: 4 },
];
