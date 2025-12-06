export type DMParams = {
  category: string;
  tone: string;
  intention: string;
};

export type DMRequest = {
  imageUrls: string[];
  category: string;
  tone: string;
  intention: string;
  prompt: string;
  userId: string;
};

export type DMSuggestion = {
  text: string;
};

export type DMResult = {
  suggestions: DMSuggestion[];
  hints: string[];
};
