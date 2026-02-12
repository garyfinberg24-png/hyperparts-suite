import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import type { IExplorerUploadEntry } from "../store/useHyperExplorerStore";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface IUseExplorerUploadResult {
  uploadFiles: (fileList: FileList, targetFolder: string) => void;
  isUploading: boolean;
}

/** Generate simple unique ID */
function generateUploadId(): string {
  return "upload-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}

/** Fetch the request digest from SPFx context using /_api/contextinfo */
function fetchRequestDigest(siteUrl: string, client: SPHttpClient): Promise<string> {
  return client.post(
    siteUrl + "/_api/contextinfo",
    SPHttpClient.configurations.v1,
    { headers: { "Accept": "application/json;odata=nometadata" } }
  ).then(function (response: SPHttpClientResponse): Promise<Record<string, unknown>> {
    return response.json() as Promise<Record<string, unknown>>;
  }).then(function (json: Record<string, unknown>): string {
    // Response shape: { FormDigestValue: "0x...", FormDigestTimeoutSeconds: ... }
    return String(json.FormDigestValue || "");
  });
}

export function useExplorerUpload(): IUseExplorerUploadResult {
  var _uploading = React.useState<boolean>(false);
  var isUploading = _uploading[0];
  var setIsUploading = _uploading[1];

  var addUpload = useHyperExplorerStore(function (s) { return s.addUpload; });
  var updateUploadProgress = useHyperExplorerStore(function (s) { return s.updateUploadProgress; });
  var setUploadStatus = useHyperExplorerStore(function (s) { return s.setUploadStatus; });

  var uploadFiles = React.useCallback(function (fileList: FileList, targetFolder: string): void {
    if (fileList.length === 0) return;

    setIsUploading(true);
    var ctx = getContext();
    var siteUrl = ctx.pageContext.web.absoluteUrl;
    var pending = fileList.length;

    // Fetch request digest from SPFx context, then upload with XHR for progress tracking
    fetchRequestDigest(siteUrl, ctx.spHttpClient).then(function (digest: string): void {
      var uploadSingle = function (file: File): void {
        var uploadId = generateUploadId();
        var entry: IExplorerUploadEntry = {
          id: uploadId,
          fileName: file.name,
          progress: 0,
          status: "uploading",
        };
        addUpload(entry);

        var folder = targetFolder || "";
        var endpoint = siteUrl + "/_api/web/GetFolderByServerRelativePath(decodedurl='" +
          encodeURIComponent(folder) + "')/Files/add(overwrite=true,url='" +
          encodeURIComponent(file.name) + "')";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", endpoint, true);
        xhr.setRequestHeader("Accept", "application/json;odata=nometadata");
        xhr.setRequestHeader("X-RequestDigest", digest);

        xhr.upload.onprogress = function (e: ProgressEvent): void {
          if (e.lengthComputable) {
            var pct = Math.round((e.loaded / e.total) * 100);
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
      var i: number;
      for (i = 0; i < fileList.length; i++) {
        uploadSingle(fileList[i]);
      }
    }).catch(function (err: unknown): void {
      // Failed to get digest — mark all as error
      var i: number;
      for (i = 0; i < fileList.length; i++) {
        var uploadId = generateUploadId();
        var entry: IExplorerUploadEntry = {
          id: uploadId,
          fileName: fileList[i].name,
          progress: 0,
          status: "error",
          error: "Auth failed: " + String(err),
        };
        addUpload(entry);
      }
      setIsUploading(false);
    });
  }, [addUpload, updateUploadProgress, setUploadStatus]);

  return { uploadFiles: uploadFiles, isUploading: isUploading };
}
