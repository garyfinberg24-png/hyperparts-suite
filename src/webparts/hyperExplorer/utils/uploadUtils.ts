/**
 * Validate file type against allowed extensions
 * @param fileName File name
 * @param allowedTypes Array of allowed extensions (lowercase, no dot)
 * @returns true if allowed or no restrictions
 */
export function validateFileType(fileName: string, allowedTypes: string[]): boolean {
  if (allowedTypes.length === 0) return true;
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return false;
  const ext = fileName.substring(lastDot + 1).toLowerCase();
  return allowedTypes.indexOf(ext) !== -1;
}

/**
 * Validate file size against maximum
 * @param fileSize File size in bytes
 * @param maxSizeMB Maximum size in megabytes
 * @returns true if within limit
 */
export function validateFileSize(fileSize: number, maxSizeMB: number): boolean {
  return fileSize <= maxSizeMB * 1024 * 1024;
}

/**
 * Generate a unique upload ID
 */
export function generateUploadId(): string {
  return "upload-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}
