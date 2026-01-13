export type DMParams = {
  category: string;
  tone: string;
  intention: string;
};

export type DMRequest = {
  prompt: string;
  image: string;
};

export type DMResult = {
  dmSuggestions: string[];
  hints: string[];
};
