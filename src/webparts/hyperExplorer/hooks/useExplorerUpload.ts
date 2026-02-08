import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import type { IExplorerUploadEntry } from "../store/useHyperExplorerStore";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";

export interface IUseExplorerUploadResult {
  uploadFiles: (fileList: FileList, targetFolder: string) => void;
  isUploading: boolean;
}

/** Generate simple unique ID */
function generateUploadId(): string {
  return "upload-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}

export function useExplorerUpload(): IUseExplorerUploadResult {
  const _uploading = React.useState<boolean>(false); const isUploading = _uploading[0]; const setIsUploading = _uploading[1];

  const addUpload = useHyperExplorerStore(function (s) { return s.addUpload; });
  const updateUploadProgress = useHyperExplorerStore(function (s) { return s.updateUploadProgress; });
  const setUploadStatus = useHyperExplorerStore(function (s) { return s.setUploadStatus; });

  const uploadFiles = React.useCallback(function (fileList: FileList, targetFolder: string): void {
    if (fileList.length === 0) return;

    setIsUploading(true);
    const ctx = getContext();
    const siteUrl = ctx.pageContext.web.absoluteUrl;
    let pending = fileList.length;

    const uploadSingle = function (file: File): void {
      const uploadId = generateUploadId();
      const entry: IExplorerUploadEntry = {
        id: uploadId,
        fileName: file.name,
        progress: 0,
        status: "uploading",
      };
      addUpload(entry);

      const folder = targetFolder || "";
      const endpoint = siteUrl + "/_api/web/GetFolderByServerRelativePath(decodedurl='" +
        encodeURIComponent(folder) + "')/Files/add(overwrite=true,url='" +
        encodeURIComponent(file.name) + "')";

      const xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint, true);
      xhr.setRequestHeader("Accept", "application/json;odata=nometadata");

      // Get request digest for POST
      const digestEl = document.getElementById("__REQUESTDIGEST") as HTMLInputElement | undefined;
      if (digestEl) {
        xhr.setRequestHeader("X-RequestDigest", digestEl.value);
      }

      xhr.upload.onprogress = function (e: ProgressEvent): void {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          updateUploadProgress(uploadId, pct);
        }
      };

      xhr.onload = function (): void {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadStatus(uploadId, "success");
        } else {
          setUploadStatus(uploadId, "error", "Upload failed: " + xhr.status);
        }
        pending = pending - 1;
        if (pending <= 0) {
          setIsUploading(false);
        }
      };

      xhr.onerror = function (): void {
        setUploadStatus(uploadId, "error", "Network error");
        pending = pending - 1;
        if (pending <= 0) {
          setIsUploading(false);
        }
      };

      xhr.send(file);
    };

    // Upload each file
    let i: number;
    for (i = 0; i < fileList.length; i++) {
      uploadSingle(fileList[i]);
    }
  }, [addUpload, updateUploadProgress, setUploadStatus]);

  return { uploadFiles: uploadFiles, isUploading: isUploading };
}
