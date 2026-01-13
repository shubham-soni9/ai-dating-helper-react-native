export type DeescalatorParams = {
  whatYouWant: string;
  tone: string;
};

export type DeescalatorRequest = {
  prompt: string;
  images: string[];
};

export type DeescalatorResult = {
  situationAnalysis: string;
  partnerEmotions: string[];
  partnerNeeds: string[];
  suggestions: string[];
  approach: string;
  nextSteps: string[];
  error?: string;
};
