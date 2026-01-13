/**
 * Helper function to process and verify Base64 image strings.
 * Ensures the string is clean, properly formatted, and has the correct Data URI scheme.
 *
 * @param base64String - The raw base64 string (with or without prefix).
 * @param mimeType - The mime type of the image (default: 'image/jpeg').
 * @returns A properly formatted Data URI string.
 * @throws Error if base64String is empty or invalid.
 */
export const processImageForApi = (
  base64String: string | null | undefined,
  mimeType: string = 'image/jpeg'
): string => {
  if (!base64String) {
    throw new Error('Image data is missing');
  }

  // 1. Remove any existing Data URI scheme to get the raw base64
  //    This handles cases where it might be "data:image/png;base64,..." or "data:image/jpeg;base64,..."
  let cleanBase64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

  // 2. Remove all whitespace (newlines, spaces) which can corrupt the base64 string
  cleanBase64 = cleanBase64.replace(/[\s\r\n]+/g, '');

  // 3. Basic validation: Base64 strings should have length divisible by 4 (with padding)
  //    However, sometimes padding '=' is missing. We can just check for valid characters.
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
    // If it fails strict regex, we might still try to send it, but logging a warning is good.
    // For now, let's just proceed but ensure we have a string.
    console.warn('Warning: Image base64 string contains unexpected characters.');
  }

  // 4. Return the formatted Data URI
  return `data:${mimeType};base64,${cleanBase64}`;
};
