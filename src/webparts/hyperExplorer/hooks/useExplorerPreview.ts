import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { isOfficeFile, isImageFile, isPdfFile, isVideoFile } from "../utils/previewUtils";

export interface IUseExplorerPreviewResult {
  buildPreviewUrl: (serverRelativeUrl: string, fileType: string) => string | undefined;
  buildThumbnailUrl: (serverRelativeUrl: string, size?: number) => string;
  getPreviewType: (fileType: string) => "office" | "image" | "pdf" | "video" | "none";
}

export function useExplorerPreview(): IUseExplorerPreviewResult {
  const siteUrl = React.useMemo(function (): string {
    try {
      const ctx = getContext();
      return ctx.pageContext.web.absoluteUrl;
    } catch {
      return "";
    }
  }, []);

  const buildPreviewUrl = React.useCallback(function (serverRelativeUrl: string, fileType: string): string | undefined {
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

    // Video → direct URL for <video> or embed URL
    if (isVideoFile(ft)) {
      return siteUrl + serverRelativeUrl;
    }

    return undefined;
  }, [siteUrl]);

  const buildThumbnailUrl = React.useCallback(function (serverRelativeUrl: string, size?: number): string {
    const thumbSize = size || 200;
    return siteUrl + "/_layouts/15/getpreview.ashx?path=" +
      encodeURIComponent(serverRelativeUrl) +
      "&resolution=" + thumbSize;
  }, [siteUrl]);

  const getPreviewType = React.useCallback(function (fileType: string): "office" | "image" | "pdf" | "video" | "none" {
    const ft = fileType.toLowerCase();
    if (isOfficeFile(ft)) return "office";
    if (isImageFile(ft)) return "image";
    if (isPdfFile(ft)) return "pdf";
    if (isVideoFile(ft)) return "video";
    return "none";
  }, []);

  return { buildPreviewUrl: buildPreviewUrl, buildThumbnailUrl: buildThumbnailUrl, getPreviewType: getPreviewType };
}
