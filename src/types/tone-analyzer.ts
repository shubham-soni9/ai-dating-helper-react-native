export type ToneAnalysisParams = {
  analysisIntent: string;
  perspective: string;
};

export type ToneAnalysisRequest = {
  prompt: string;
  images: string[];
  analysisIntent: string;
  perspective: string;
};

export type ToneAnalysisResult = {
  overallTone: string;
  userTone: string;
  otherPersonTone: string;
  toxicityLevel: string;
  emotionalSignals: string[];
  conversationHealth: string;
  confidenceScore: number;
  toolType: string;
  error?: string;
};
