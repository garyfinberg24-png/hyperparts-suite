import type { IExplorerFile } from "../models";

/**
 * Build download URL for a SharePoint file
 * @param serverRelativeUrl Server-relative URL
 * @param siteUrl Absolute site URL
 * @returns Download URL
 */
export function buildDownloadUrl(serverRelativeUrl: string, siteUrl: string): string {
  return siteUrl + "/_layouts/15/download.aspx?SourceUrl=" +
    encodeURIComponent(serverRelativeUrl);
}

/**
 * Trigger browser download for a single file
 * @param file Explorer file
 * @param siteUrl Absolute site URL
 */
export function downloadFile(file: IExplorerFile, siteUrl: string): void {
  const url = buildDownloadUrl(file.serverRelativeUrl, siteUrl);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download multiple files sequentially (one link per file)
 * @param files Array of explorer files
 * @param siteUrl Absolute site URL
 */
export function downloadMultiple(files: IExplorerFile[], siteUrl: string): void {
  let delay = 0;
  files.forEach(function (file: IExplorerFile): void {
    setTimeout(function (): void {
      downloadFile(file, siteUrl);
    }, delay);
    delay = delay + 500;
  });
}

/**
 * Copy text to clipboard
 * @param text Text to copy
 * @returns Promise resolving when copied
 */
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  return Promise.resolve();
}
