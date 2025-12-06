export type LiveUsageScenario = {
  id: string;
  girlAvatar: string;
  girlMessage: string;
  wizardReplies: string[];
  rating: {
    score: string; // e.g. "2/10"
    title: string; // e.g. "Poor social skills 😭"
    description: string; // e.g. "You scored lower than most people..."
  };
};

export const SCENARIOS: LiveUsageScenario[] = [
  {
    id: '1',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    girlMessage: "I'm not mad at you, I just don't like how our conversations have been lately.",
    wizardReplies: [
      "I feel the same way. I think it's best we give this a fresh start. What are you doing tomorrow at 5?",
      "I hear you, and I want to fix this. Let's grab coffee and talk things through properly.",
      "You're right. I haven't been present enough. Can we restart with a nice dinner tomorrow?",
    ],
    rating: {
      score: '2/10',
      title: 'Poor social skills 😭',
      description: 'You scored lower than most people...',
    },
  },
  {
    id: '2',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    girlMessage: "I feel like I'm the only one trying here...",
    wizardReplies: [
      "I didn't realize I was making you feel that way. I appreciate you telling me. How can I show up better for you?",
      "I'm sorry I've made you feel that way. I want to match your effort. Let's plan something special together.",
      "That's not fair to you, and I apologize. I'm all in. What's one thing I can do today to make it up to you?",
    ],
    rating: {
      score: '3/10',
      title: 'Low Effort 😴',
      description: 'Your response lacked engagement...',
    },
  },
  {
    id: '3',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    girlMessage: 'Are we even on the same page anymore?',
    wizardReplies: [
      "That's a fair question. I really value what we have, but maybe we do need to realign. Can we talk about it tonight?",
      "I think we are, but maybe we've drifted a bit. I'd love to reconnect and sync up tonight.",
      "I want us to be. Let's sit down and figure out where we're heading, because I want you in my future.",
    ],
    rating: {
      score: '2/10',
      title: 'Vague Vibes 🌫️',
      description: "You're avoiding the core issue...",
    },
  },
  {
    id: '4',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    girlMessage: 'You literally never ask me how my day was.',
    wizardReplies: [
      "You're right, and I'm sorry I've been self-absorbed lately. I want to change that. How was your day today?",
      "I'm sorry, I've been distracted. I really do care. Please tell me, how did your day go?",
      "That's on me. I want to hear everything. What was the best part of your day?",
    ],
    rating: {
      score: '1/10',
      title: 'Self-Centered 🛑',
      description: 'Conversation is a two-way street...',
    },
  },
  {
    id: '5',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    girlMessage: "I don't think you get my sense of humor.",
    wizardReplies: [
      'I might have missed the mark recently! I love your humor, maybe I just need a little calibration. Tell me your best joke?',
      "Maybe I'm just a bit slow lately! I love how funny you are. Send me your favorite meme?",
      "I definitely do! Maybe I've just been too serious. Roast me, I probably deserve it.",
    ],
    rating: {
      score: '3/10',
      title: 'Dry Response 🌵',
      description: 'You missed the playfulness...',
    },
  },
  {
    id: '6',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    girlMessage: 'Why did you leave me on read for 6 hours?',
    wizardReplies: [
      "I completely lost track of time at work, but that's no excuse for leaving you hanging. I'm sorry. How's your evening going?",
      "I'm so sorry, work got crazy and I couldn't check my phone. I didn't mean to ignore you.",
      'That was rude of me, I apologize. I got caught up and forgot to hit send. Can I call you?',
    ],
    rating: {
      score: '2/10',
      title: 'Ghosting Alert 👻',
      description: 'Timing matters in communication...',
    },
  },
  {
    id: '7',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
    girlMessage: "This isn't fun anymore.",
    wizardReplies: [
      "I hate hearing that, but I'm glad you're honest. Let's shake things up. Do you want to go on a spontaneous adventure this weekend?",
      "I want it to be fun for you. Let's break the routine. What's something you've always wanted to try?",
      "Let's fix that immediately. Pack a bag, we're going somewhere fun this Saturday.",
    ],
    rating: {
      score: '1/10',
      title: 'Buzzkill 📉',
      description: "You're draining the energy...",
    },
  },
  {
    id: '8',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    girlMessage: "You're always so serious.",
    wizardReplies: [
      "I have been a bit intense lately, haven't I? Let me make it up to you. What's the silliest thing you've seen all week?",
      "You're right, I need to loosen up! Let's do something crazy. Karaoke tonight?",
      'Fair point! I promise to be 10% less serious if you promise to be 10% more silly with me.',
    ],
    rating: {
      score: '3/10',
      title: 'Too Intense 😐',
      description: 'Lighten up the mood a bit...',
    },
  },
  {
    id: '9',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    girlMessage: "I'm just tired of explaining myself.",
    wizardReplies: [
      "I understand, and you shouldn't have to. I want to listen and just be there for you right now. Tell me what you need.",
      "I get it. I'll stop asking and start listening. I'm here for you.",
      "I'm sorry it feels like a chore. I'll do better at understanding you without you having to spell it out.",
    ],
    rating: {
      score: '2/10',
      title: 'Dismissive 🙉',
      description: 'Validate feelings before solving...',
    },
  },
  {
    id: '10',
    girlAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
    girlMessage: 'Do you even care about this?',
    wizardReplies: [
      "I care more than I've been showing, and I'm sorry if you felt otherwise. You are a priority to me. Can I prove it with dinner tonight?",
      "I care deeply. I'm sorry my actions haven't shown it. Let me prove it to you.",
      "Yes, absolutely. You mean a lot to me. I'm sorry if I made you doubt that.",
    ],
    rating: {
      score: '1/10',
      title: 'Red Flag 🚩',
      description: 'Reassurance was missing...',
    },
  },
];
