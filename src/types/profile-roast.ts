export interface ProfileRoastParams {
  roastIntent: string;
  focusArea: string;
}

export interface ProfileRoastRequest {
  prompt: string;
  images: string[];
  roastIntent: string;
  focusArea: string;
}

export interface ProfileRoastResult {
  profileScore: number;
  roastHeadline: string;
  strengths: string[];
  weaknesses: string[];
  quickFixes: string[];
  photoScores?: number[];
  bioScore?: number;
  confidenceScore: number;
  toolType: 'profile-roast';
  error?: string;
}
