import { Tool } from "@/types/tools";

export const TOOLS: Tool[] = [
  {
    id: "deescalate",
    title: "De-escalator",
    description:
      "Transform awkward conversations into positive exchanges with smart techniques.",
    icon: "shield-checkmark-outline",
    route: "/tools/deescalate",
    isReady: true,
    color: "#10b981",
  },
  {
    id: "red-flag-detector",
    title: "Red Flag Detector",
    description:
      "Spot scammers and catfishers before wasting time on fake profiles.",
    icon: "warning-outline",
    route: "/tools/red-flag-detector",
    isReady: false,
    color: "#ef4444",
    badge: "Critical",
  },
  {
    id: "conversation-reviver",
    title: "Conversation Reviver",
    description:
      "Revive stalled conversations with engaging follow-up messages that work.",
    icon: "refresh-outline",
    route: "/tools/conversation-reviver",
    isReady: false,
    color: "#8b5cf6",
    badge: "Critical",
  },
  {
    id: "identity-verifier",
    title: "Identity Verifier",
    description:
      "Verify dating profiles are real and detect fake accounts instantly.",
    icon: "checkmark-circle-outline",
    route: "/tools/identity-verifier",
    isReady: false,
    color: "#06b6d4",
    badge: "Critical",
  },
  {
    id: "dm-helper",
    title: "DM Helper",
    description:
      "Craft compelling opening messages that get responses from matches.",
    icon: "chatbubble-ellipses-outline",
    route: "/tools/dm-helper",
    isReady: true,
    color: "#3b82f6",
  },
  {
    id: "photo-optimizer",
    title: "Photo Optimizer",
    description:
      "Analyze photos to boost matches by twelve to fifteen percent.",
    icon: "camera-outline",
    route: "/tools/photo-optimizer",
    isReady: false,
    color: "#f59e0b",
  },
  {
    id: "message-templates",
    title: "Message Templates",
    description:
      "Proven conversation starters boost response rates by forty percent.",
    icon: "document-text-outline",
    route: "/tools/message-templates",
    isReady: false,
    color: "#10b981",
  },
  {
    id: "ghosting-recovery",
    title: "Ghosting Recovery",
    description:
      "Re-engage matches who ghosted you with smart follow-up messages.",
    icon: "hourglass-outline",
    route: "/tools/ghosting-recovery",
    isReady: false,
    color: "#6366f1",
  },
  {
    id: "tone-analyzer",
    title: "Tone Analyzer",
    description:
      "Analyze message tone and emoji usage for better communication.",
    icon: "happy-outline",
    route: "/tools/tone-analyzer",
    isReady: false,
    color: "#ec4899",
  },
  {
    id: "first-date-coach",
    title: "First Date Coach",
    description:
      "Get personalized first date tips to make lasting impressions.",
    icon: "restaurant-outline",
    route: "/tools/first-date-coach",
    isReady: false,
    color: "#f97316",
  },
  {
    id: "profile-roast",
    title: "Profile Roast",
    description:
      "Receive honest feedback to optimize your dating profile effectively.",
    icon: "flame-outline",
    route: "/tools/profile-roast",
    isReady: false,
    color: "#dc2626",
  },
  {
    id: "date-ideas",
    title: "Date Ideas",
    description:
      "Discover creative date ideas based on shared interests and preferences.",
    icon: "bulb-outline",
    route: "/tools/date-ideas",
    isReady: false,
    color: "#a855f7",
  },
];
