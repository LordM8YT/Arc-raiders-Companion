
import type { Quest, Build, Equipment, SkillTreeData } from '../types';
import { ShieldIcon, ZapIcon, TargetIcon, PlusIcon, BoltIcon, CpuIcon, EyeIcon } from '../components/icons';

// Data sourced and inspired by arcraiders.wiki and speranza.gg
export const equipmentDB: Record<string, Equipment> = {
  // Weapons
  starfall: { 
    id: 'starfall', 
    type: 'Weapon', 
    name: 'R-36 "Starfall"', 
    description: 'A versatile assault rifle, effective at most ranges. The backbone of any squad.', 
    rarity: 'Rare',
    stats: { damage: 32, rpm: 600, magazine: 30, range: 75 }
  },
  javelin: { 
    id: 'javelin', 
    type: 'Weapon', 
    name: 'T-04 "Javelin"', 
    description: 'Precision energy rifle that charges up to release a devastating beam.', 
    rarity: 'Epic',
    stats: { damage: 150, rpm: 'Charge', magazine: 5, range: 200 }
  },
  halberd: { 
    id: 'halberd', 
    type: 'Weapon', 
    name: 'L-86 "Halberd"', 
    description: 'Heavy machine gun capable of laying down withering suppressive fire.', 
    rarity: 'Rare',
    stats: { damage: 45, rpm: 450, magazine: 100, range: 90 }
  },
  katana: { 
    id: 'katana', 
    type: 'Weapon', 
    name: 'K-22 "Katana"', 
    description: 'A deadly close-range SMG that shreds armor.', 
    rarity: 'Uncommon',
    stats: { damage: 24, rpm: 900, magazine: 40, range: 40 }
  },
  
  // Gadgets
  shieldDome: { id: 'shieldDome', type: 'Gadget', name: 'Shield Dome', description: 'Deploys a large, stationary energy barrier that blocks incoming projectiles.', rarity: 'Epic' },
  stasisGrenade: { id: 'stasisGrenade', type: 'Gadget', name: 'Stasis Grenade', description: 'A thrown device that creates a field, slowing all enemies caught inside.', rarity: 'Rare' },
  grappleHook: { id: 'grappleHook', type: 'Gadget', name: 'Grapple Hook', description: 'Allows for rapid vertical and horizontal traversal of the environment.', rarity: 'Uncommon' },
  
  // Armor (generic placeholder)
  raiderArmor: { id: 'raiderArmor', type: 'Armor', name: 'Standard Issue Raider Plating', description: 'Customizable armor plating, balanced for mobility and protection.', rarity: 'Common' },
};

export const mockBuilds: Build[] = [
  { 
    id: 1, 
    name: 'Apex Predator', 
    raider: 'Celeste', 
    description: 'A highly mobile build for Celeste, focusing on flanking and high-value target elimination from any range.',
    equipment: [equipmentDB.starfall, equipmentDB.javelin, equipmentDB.grappleHook],
  },
  { 
    id: 2, 
    name: 'Ironclad Defender', 
    raider: 'Isabel', 
    description: 'An area-denial build for Isabel, designed to hold the line and protect the squad with heavy fire and defensive gadgets.',
    equipment: [equipmentDB.halberd, equipmentDB.raiderArmor, equipmentDB.shieldDome],
  },
  { 
    id: 3, 
    name: 'Shock Trooper', 
    raider: 'Lance', 
    description: 'An aggressive, close-quarters build for Lance that uses speed and crowd control to disrupt enemy formations.',
    equipment: [equipmentDB.katana, equipmentDB.raiderArmor, equipmentDB.stasisGrenade],
  }
];


export const mockQuests: Quest[] = [
  { 
    id: 1, 
    title: 'X-Isle Extraction', 
    description: 'Intel suggests a high-value data core is in a downed ARC vessel on X-Isle. Secure the asset for the Free Rangers.', 
    status: 'incomplete', 
    faction: 'Free Rangers',
    objectives: ["Reach the crash site", "Defend against ARC waves", "Extract the data core"],
    rewards: ["+250 Faction Rep (Free Rangers)", "Uncommon Weapon Mod"]
  },
  { 
    id: 2, 
    title: 'Forge Sabotage', 
    description: 'The Iron Assembly is using a geothermal forge to produce new war machines. Infiltrate the facility and overload the primary converter.', 
    status: 'incomplete', 
    faction: 'ARC',
    objectives: ["Infiltrate the forge undetected", "Plant explosive charges on the converter", "Escape before detonation"],
    rewards: ["+300 Faction Rep (ARC)", "Epic Gadget Blueprint"]
  },
  { 
    id: 3, 
    title: 'Barony Barricade', 
    description: 'A massive BAR-L unit is blocking a critical supply route through the Dust Devil Barony. Eliminate it.',
    status: 'incomplete', 
    faction: 'Free Rangers',
    objectives: ["Locate the BAR-L Behemoth", "Destroy its armor plating", "Eliminate the BAR-L"],
    rewards: ["+150 Faction Rep (Free Rangers)", "Rare Armor Plating"]
  },
  { 
    id: 4, 
    title: 'Supply Run', 
    description: 'Recovered a lost medical crate for the Free Rangers camp.', 
    status: 'complete', 
    faction: 'Free Rangers',
    objectives: ["Find the lost crate", "Return it to camp"],
    rewards: ["+50 Faction Rep (Free Rangers)"]
  },
];


// Skill tree with more thematic names inspired by the wiki
export const mockSkillTree: SkillTreeData = [
  // Tier 0 - Root
  { id: 'core_systems', name: 'Core Systems', description: 'Base operational systems unlocked.', icon: CpuIcon, x: 50, y: 10, tier: 0 },

  // Tier 1 - Branches from Core
  { id: 'def_up', name: 'Kinetic Plating', description: 'Increases base armor by 10%.', icon: ShieldIcon, prereq: 'core_systems', x: 20, y: 30, tier: 1 },
  { id: 'atk_up', name: 'Weapon Overclock', description: 'Increases base weapon damage by 5%.', icon: BoltIcon, prereq: 'core_systems', x: 50, y: 30, tier: 1 },
  { id: 'util_up', name: 'Tactical Visor', description: 'Highlights enemies and weak points.', icon: EyeIcon, prereq: 'core_systems', x: 80, y: 30, tier: 1 },

  // Tier 2 - Defense Branch
  { id: 'def_t2_regen', name: 'Shield Capacitor', description: 'Shield starts regenerating sooner after taking damage.', icon: ShieldIcon, prereq: 'def_up', x: 10, y: 50, tier: 2 },
  { id: 'def_t2_blast', name: 'Blast Shielding', description: 'Reduces damage from explosive sources.', icon: ShieldIcon, prereq: 'def_up', x: 30, y: 50, tier: 2 },
  
  // Tier 2 - Attack Branch
  { id: 'atk_t2_crit', name: 'Targeting Computer', description: 'Increases critical hit damage by 25%.', icon: TargetIcon, prereq: 'atk_up', x: 50, y: 50, tier: 2 },

  // Tier 2 - Utility Branch
  { id: 'util_t2_speed', name: 'Maneuvering Thrusters', description: 'Increases sprint speed by 15%.', icon: ZapIcon, prereq: 'util_up', x: 70, y: 50, tier: 2 },
  { id: 'util_t2_resource', name: 'Resource Scavenger', description: 'Find more resources from salvage.', icon: PlusIcon, prereq: 'util_up', x: 90, y: 50, tier: 2 },

  // Tier 3 - Cross-branch
  { id: 'def_atk_t3', name: 'Vengeance Protocol', description: 'Gain a temporary damage boost after your shield breaks.', icon: BoltIcon, prereq: 'def_t2_blast', x: 40, y: 70, tier: 3 },
  { id: 'atk_util_t3', name: 'Adrenaline Killers', description: 'Getting a critical hit grants a temporary movement speed boost.', icon: ZapIcon, prereq: 'atk_t2_crit', x: 60, y: 70, tier: 3 },
  
  // Tier 4 - Ultimate
  { id: 'ultimate_overload', name: 'Annihilation Protocol', description: 'Ultimate: Massively boosts damage and speed for a short duration, but disables shields.', icon: CpuIcon, prereq: 'def_atk_t3', x: 50, y: 90, tier: 4 },
  { id: 'ultimate_stealth', name: 'Ghostweave Cloak', description: 'Ultimate: Become nearly invisible for a short duration.', icon: EyeIcon, prereq: 'atk_util_t3', x: 50, y: 90, tier: 4 },
];