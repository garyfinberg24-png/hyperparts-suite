/** Office document extensions that support WopiFrame preview */
const OFFICE_TYPES = ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "vsdx", "vsd", "one"];

/** Image extensions */
const IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico", "tiff", "tif"];

/** Video extensions */
const VIDEO_TYPES = ["mp4", "avi", "mov", "wmv", "mkv", "webm"];

/**
 * Check if file type is an Office document
 */
export function isOfficeFile(fileType: string): boolean {
  return OFFICE_TYPES.indexOf(fileType.toLowerCase()) !== -1;
}

/**
 * Check if file type is an image
 */
export function isImageFile(fileType: string): boolean {
  return IMAGE_TYPES.indexOf(fileType.toLowerCase()) !== -1;
}

/**
 * Check if file type is a PDF
 */
export function isPdfFile(fileType: string): boolean {
  return fileType.toLowerCase() === "pdf";
}

/**
 * Check if file type is a video
 */
export function isVideoFile(fileType: string): boolean {
  return VIDEO_TYPES.indexOf(fileType.toLowerCase()) !== -1;
}

/**
 * Build preview URL for a file
 * @param serverRelativeUrl Server-relative URL of the file
 * @param fileType File extension (lowercase, no dot)
 * @param siteUrl Absolute site URL
 * @returns Preview URL or undefined if not previewable
 */
export function buildPreviewUrl(
  serverRelativeUrl: string,
  fileType: string,
  siteUrl: string
): string | undefined {
  const ft = fileType.toLowerCase();

  // Office files → WopiFrame
  if (isOfficeFile(ft)) {
    return siteUrl + "/_layouts/15/WopiFrame.aspx?sourcedoc=" +
      encodeURIComponent(serverRelativeUrl) + "&action=interactivepreview";
  }

  // Images → direct URL
  if (isImageFile(ft)) {
    return siteUrl + serverRelativeUrl;
  }

  // PDF → direct iframe
  if (isPdfFile(ft)) {
    return siteUrl + serverRelativeUrl;
  }

  // Video → direct URL
  if (isVideoFile(ft)) {
    return siteUrl + serverRelativeUrl;
  }

  return undefined;
}

/**
 * Build thumbnail URL using SharePoint's getpreview.ashx
 * @param serverRelativeUrl Server-relative URL of the file
 * @param siteUrl Absolute site URL
 * @param size Thumbnail size in pixels
 * @returns Thumbnail URL
 */
export function buildThumbnailUrl(
  serverRelativeUrl: string,
  siteUrl: string,
  size?: number
): string {
  const thumbSize = size || 200;
  return siteUrl + "/_layouts/15/getpreview.ashx?path=" +
    encodeURIComponent(serverRelativeUrl) +
    "&resolution=" + thumbSize;
}
