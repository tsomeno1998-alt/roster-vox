import { FACTION_GROUP_COLORS } from '@/lib/factions';
import type { FactionGroup } from '@/lib/types';

interface FactionBadgeProps {
  name: string;
  group: FactionGroup;
}

export default function FactionBadge({ name, group }: FactionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${FACTION_GROUP_COLORS[group]}`}
    >
      {name}
    </span>
  );
}
