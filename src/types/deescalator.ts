export type DeescalatorParams = {
  whatYouWant: string;
  tone: string;
};

export type DeescalatorRequest = {
  prompt: string;
  images: string[];
};

export type DeescalatorResult = {
  suggestions: string[];
  approach: string;
  nextSteps: string[];
};