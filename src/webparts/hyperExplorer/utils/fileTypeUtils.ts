import type { FileCategory } from "../models";

/** File extension → Fluent UI icon name mapping */
const ICON_MAP: Record<string, string> = {
  // Documents
  docx: "WordDocument",
  doc: "WordDocument",
  xlsx: "ExcelDocument",
  xls: "ExcelDocument",
  pptx: "PowerPointDocument",
  ppt: "PowerPointDocument",
  pdf: "PDF",
  txt: "TextDocument",
  csv: "ExcelDocument",
  one: "OneNoteLogo",
  vsdx: "VisioDocument",
  vsd: "VisioDocument",
  // Images
  jpg: "FileImage",
  jpeg: "FileImage",
  png: "FileImage",
  gif: "FileImage",
  bmp: "FileImage",
  svg: "FileImage",
  webp: "FileImage",
  ico: "FileImage",
  tiff: "FileImage",
  tif: "FileImage",
  // Video
  mp4: "MSNVideos",
  avi: "MSNVideos",
  mov: "MSNVideos",
  wmv: "MSNVideos",
  mkv: "MSNVideos",
  webm: "MSNVideos",
  // Audio
  mp3: "MusicInCollection",
  wav: "MusicInCollection",
  ogg: "MusicInCollection",
  flac: "MusicInCollection",
  aac: "MusicInCollection",
  // Archives
  zip: "ZipFolder",
  rar: "ZipFolder",
  "7z": "ZipFolder",
  tar: "ZipFolder",
  gz: "ZipFolder",
  // Code
  html: "FileHTML",
  css: "FileCSS",
  js: "JavaScriptLanguage",
  ts: "TypeScriptLanguage",
  json: "FileCode",
  xml: "FileCode",
};

/** Image file extensions */
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico", "tiff", "tif"];

/** Video file extensions */
const VIDEO_EXTENSIONS = ["mp4", "avi", "mov", "wmv", "mkv", "webm"];

/** Audio file extensions */
const AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "flac", "aac"];

/** Archive file extensions */
const ARCHIVE_EXTENSIONS = ["zip", "rar", "7z", "tar", "gz"];

/** Office doc file extensions (previewable via WopiFrame) */
const OFFICE_EXTENSIONS = ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "vsdx", "vsd", "one"];

/** All previewable extensions */
const PREVIEWABLE_EXTENSIONS = OFFICE_EXTENSIONS.concat(IMAGE_EXTENSIONS).concat(["pdf"]).concat(VIDEO_EXTENSIONS);

/**
 * Get Fluent UI icon name for a file type
 */
export function getFileIcon(fileType: string): string {
  const ft = fileType.toLowerCase();
  return ICON_MAP[ft] || "Page";
}

/**
 * Get file category classification
 */
export function getFileCategory(fileType: string): FileCategory {
  const ft = fileType.toLowerCase();
  if (OFFICE_EXTENSIONS.indexOf(ft) !== -1 || ft === "pdf" || ft === "txt" || ft === "csv") return "document";
  if (IMAGE_EXTENSIONS.indexOf(ft) !== -1) return "image";
  if (VIDEO_EXTENSIONS.indexOf(ft) !== -1) return "video";
  if (AUDIO_EXTENSIONS.indexOf(ft) !== -1) return "audio";
  if (ARCHIVE_EXTENSIONS.indexOf(ft) !== -1) return "archive";
  return "other";
}

/**
 * Check if file is an image
 */
export function isImageFile(fileType: string): boolean {
  return IMAGE_EXTENSIONS.indexOf(fileType.toLowerCase()) !== -1;
}

/**
 * Check if file is a video
 */
export function isVideoFile(fileType: string): boolean {
  return VIDEO_EXTENSIONS.indexOf(fileType.toLowerCase()) !== -1;
}

/**
 * Check if file can be previewed
 */
export function isPreviewableFile(fileType: string): boolean {
  return PREVIEWABLE_EXTENSIONS.indexOf(fileType.toLowerCase()) !== -1;
}

/**
 * Extract file extension from filename (lowercase, no dot)
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === filename.length - 1) return "";
  return filename.substring(lastDot + 1).toLowerCase();
}

/**
 * Format file size in human-readable form
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size = size / 1024;
    i++;
  }
  return (Math.round(size * 10) / 10) + " " + units[i];
}
