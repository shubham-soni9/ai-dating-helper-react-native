import { Tool } from '@/types/tools';

export const TOOLS: Tool[] = [
  {
    id: 'dm-helper',
    title: 'DM Helper',
    description: 'Craft the perfect opening line or reply to get the conversation flowing.',
    icon: 'chatbubble-ellipses-outline',
    route: '/tools/dm-helper',
    isReady: true,
    color: '#3b82f6', // blue
  },
  {
    id: 'deescalate',
    title: 'De-escalator',
    description: 'Turn a tense conversation into a constructive one with calm responses.',
    icon: 'shield-checkmark-outline',
    route: '/tools/deescalate',
    isReady: true,
    color: '#10b981', // green
  },
  {
    id: 'profile-roast',
    title: 'Profile Roast',
    description: 'Get honest, constructive feedback to improve your dating profile.',
    icon: 'flame-outline',
    route: '/tools/profile-roast',
    isReady: false,
    color: '#f59e0b', // amber
  },
  {
    id: 'date-ideas',
    title: 'Date Ideas',
    description: 'Generate unique and personalized date ideas based on common interests.',
    icon: 'rose-outline',
    route: '/tools/date-ideas',
    isReady: false,
    color: '#ec4899', // pink
  },
];
