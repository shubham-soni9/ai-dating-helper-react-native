export type DMParams = {
  category: string;
  tone: string;
  intention: string;
};

export type DMRequest = {
  prompt: string;
  image: string;
};

export type DMSuggestion = {
  text: string;
};

export type DMResult = {
  suggestions: DMSuggestion[];
  hints: string[];
};
