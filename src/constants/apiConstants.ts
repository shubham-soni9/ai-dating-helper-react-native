//const BASE_API_URL = "http://127.0.0.1:54321";
const BASE_API_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
export const API_GET_DM_BY_IMAGE = BASE_API_URL + '/functions/v1/dm-this-girl';
export const API_GET_DEESCALATOR_HELP = BASE_API_URL + '/functions/v1/deescalator-help';
export const API_TONE_ANALYZER = BASE_API_URL + '/functions/v1/tone-analyzer';
export const API_GHOSTING_RECOVERY = BASE_API_URL + '/functions/v1/ghosting-recovery';
export const API_PROFILE_ROAST = BASE_API_URL + '/functions/v1/profile-roast';
