import { Ionicons } from '@expo/vector-icons';

export type Tool = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  isReady: boolean;
  color?: string;
  badge?: string;
};
