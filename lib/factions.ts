import type { FactionGroup } from './types';

export interface FactionDef {
  name: string;
  group: FactionGroup;
}

export const FACTIONS: FactionDef[] = [
  // Imperium
  { name: 'Space Marines', group: 'Imperium' },
  { name: 'Ultramarines', group: 'Imperium' },
  { name: 'Iron Hands', group: 'Imperium' },
  { name: 'Salamanders', group: 'Imperium' },
  { name: 'Raven Guard', group: 'Imperium' },
  { name: 'White Scars', group: 'Imperium' },
  { name: 'Imperial Fists', group: 'Imperium' },
  { name: 'Black Templars', group: 'Imperium' },
  { name: 'Blood Angels', group: 'Imperium' },
  { name: 'Dark Angels', group: 'Imperium' },
  { name: 'Grey Knights', group: 'Imperium' },
  { name: 'Space Wolves', group: 'Imperium' },
  { name: 'Deathwatch', group: 'Imperium' },
  { name: 'Adeptus Custodes', group: 'Imperium' },
  { name: 'Adepta Sororitas', group: 'Imperium' },
  { name: 'Adeptus Mechanicus', group: 'Imperium' },
  { name: 'Astra Militarum', group: 'Imperium' },
  { name: 'Imperial Knights', group: 'Imperium' },
  { name: 'Agents of the Imperium', group: 'Imperium' },

  // Chaos
  { name: 'Chaos Space Marines', group: 'Chaos' },
  { name: 'Chaos Daemons', group: 'Chaos' },
  { name: 'Death Guard', group: 'Chaos' },
  { name: 'Thousand Sons', group: 'Chaos' },
  { name: 'World Eaters', group: 'Chaos' },
  { name: "Emperor's Children", group: 'Chaos' },
  { name: 'Chaos Knights', group: 'Chaos' },

  // Xenos
  { name: 'Aeldari', group: 'Xenos' },
  { name: 'Drukhari', group: 'Xenos' },
  { name: 'Genestealer Cults', group: 'Xenos' },
  { name: 'Leagues of Votann', group: 'Xenos' },
  { name: 'Necrons', group: 'Xenos' },
  { name: 'Orks', group: 'Xenos' },
  { name: 'Tyranids', group: 'Xenos' },
  { name: "T'au Empire", group: 'Xenos' },
];

export const FACTION_GROUP_LABELS: Record<FactionGroup, string> = {
  Imperium: 'インペリウム',
  Chaos: 'ケイオス',
  Xenos: 'ゼノス',
};

export const FACTION_GROUP_COLORS: Record<FactionGroup, string> = {
  Imperium: 'bg-amber-100 text-amber-800',
  Chaos: 'bg-red-100 text-red-800',
  Xenos: 'bg-emerald-100 text-emerald-800',
};
