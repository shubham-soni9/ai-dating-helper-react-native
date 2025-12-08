export type GhostingRecoveryParams = {
  analysisIntent: string;
  perspective: string;
};

export type GhostingRecoveryRequest = {
  prompt: string;
  images: string[];
  analysisIntent: string;
  perspective: string;
};

export type GhostingRecoveryResult = {
  isGhosted: boolean;
  ghostingStage: string;
  ghostingProbability: number;
  recommendedMessage: string[];
  recommendedTone: string;
  recoveryChance: number;
  moveOnAdvice: string | null;
  confidenceScore: number;
  toolType: string;
  error?: string;
};
