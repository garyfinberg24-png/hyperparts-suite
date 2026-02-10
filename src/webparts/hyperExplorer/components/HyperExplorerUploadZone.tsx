import * as React from "react";
import type { IExplorerUploadEntry } from "../store/useHyperExplorerStore";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import { useExplorerUpload } from "../hooks/useExplorerUpload";
import styles from "./HyperExplorerUploadZone.module.scss";

export interface IHyperExplorerUploadZoneProps {
  targetFolder: string;
  /** Allowed file extensions e.g. ".jpg,.png,.pdf" — empty = allow all */
  acceptedTypes?: string;
  /** Max file size in bytes (0 = unlimited) */
  maxFileSize?: number;
}

/** Validate files before upload */
function validateFiles(
  fileList: FileList,
  acceptedTypes: string,
  maxFileSize: number
): { valid: File[]; errors: string[] } {
  var valid: File[] = [];
  var errors: string[] = [];
  var accepted = acceptedTypes
    ? acceptedTypes.split(",").map(function (t) { return t.trim().toLowerCase(); })
    : [];

  var i: number;
  for (i = 0; i < fileList.length; i++) {
    var file = fileList[i];

    // Check type
    if (accepted.length > 0) {
      var ext = "." + file.name.split(".").pop();
      if (ext) {
        ext = ext.toLowerCase();
      }
      if (accepted.indexOf(ext) === -1) {
        errors.push(file.name + ": file type not allowed");
        continue;
      }
    }

    // Check size
    if (maxFileSize > 0 && file.size > maxFileSize) {
      var sizeMB = Math.round(maxFileSize / (1024 * 1024));
      errors.push(file.name + ": exceeds " + sizeMB + "MB limit");
      continue;
    }

    valid.push(file);
  }

  return { valid: valid, errors: errors };
}

var HyperExplorerUploadZone: React.FC<IHyperExplorerUploadZoneProps> = function (props) {
  var isDragOver = useHyperExplorerStore(function (s) { return s.isDragOver; });
  var setIsDragOver = useHyperExplorerStore(function (s) { return s.setIsDragOver; });
  var uploads = useHyperExplorerStore(function (s) { return s.uploads; });
  var removeUpload = useHyperExplorerStore(function (s) { return s.removeUpload; });
  var uploadHook = useExplorerUpload();

  // eslint-disable-next-line @rushstack/no-new-null
  var inputRef = React.useRef<HTMLInputElement>(null);

  var validationErrorsState = React.useState<string[]>([]);
  var validationErrors = validationErrorsState[0];
  var setValidationErrors = validationErrorsState[1];

  var acceptedTypes = props.acceptedTypes || "";
  var maxFileSize = props.maxFileSize || 0;

  var handleFiles = React.useCallback(function (fileList: FileList): void {
    var result = validateFiles(fileList, acceptedTypes, maxFileSize);
    setValidationErrors(result.errors);

    if (result.valid.length > 0) {
      // Convert valid array back to a mock FileList-like usage via DataTransfer
      var dt = new DataTransfer();
      result.valid.forEach(function (f) { dt.items.add(f); });
      uploadHook.uploadFiles(dt.files, props.targetFolder);
    }
  }, [acceptedTypes, maxFileSize, props.targetFolder, uploadHook.uploadFiles]);

  var handleDragOver = React.useCallback(function (e: React.DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, [setIsDragOver]);

  var handleDragLeave = React.useCallback(function (e: React.DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, [setIsDragOver]);

  var handleDrop = React.useCallback(function (e: React.DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [setIsDragOver, handleFiles]);

  var handleBrowseClick = React.useCallback(function (): void {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  var handleInputChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Build upload progress entries
  var progressEntries = uploads.map(function (entry: IExplorerUploadEntry) {
    var entryChildren: React.ReactNode[] = [];

    entryChildren.push(
      React.createElement("span", { key: "name", className: styles.uploadEntryName }, entry.fileName)
    );

    if (entry.status === "uploading") {
      entryChildren.push(
        React.createElement("div", { key: "bar", className: styles.uploadProgressBar },
          React.createElement("div", {
            className: styles.uploadProgressFill,
            style: { width: entry.progress + "%" },
          })
        )
      );
      entryChildren.push(
        React.createElement("span", { key: "pct" }, entry.progress + "%")
      );
    } else if (entry.status === "success") {
      entryChildren.push(
        React.createElement("span", { key: "status", className: styles.uploadStatusSuccess }, "\u2713 Done")
      );
    } else if (entry.status === "error") {
      entryChildren.push(
        React.createElement("span", { key: "status", className: styles.uploadStatusError },
          "\u2717 " + (entry.error || "Error")
        )
      );
    }

    entryChildren.push(
      React.createElement("button", {
        key: "remove",
        className: styles.uploadRemoveButton,
        onClick: function () { removeUpload(entry.id); },
        "aria-label": "Remove " + entry.fileName,
        type: "button",
      }, "\u2715")
    );

    return React.createElement("div", {
      key: entry.id,
      className: styles.uploadEntry,
    }, entryChildren);
  });

  // Zone class
  var zoneClass = styles.uploadZone;
  if (isDragOver) {
    zoneClass = zoneClass + " " + styles.uploadZoneActive;
  }

  var zoneChildren: React.ReactNode[] = [];

  // Drop zone content
  zoneChildren.push(
    React.createElement("span", { key: "icon", className: styles.uploadZoneIcon, "aria-hidden": "true" }, "\uD83D\uDCC1")
  );
  zoneChildren.push(
    React.createElement("p", { key: "text", className: styles.uploadZoneText },
      "Drag & drop files here"
    )
  );
  zoneChildren.push(
    React.createElement("p", { key: "hint", className: styles.uploadZoneHint },
      acceptedTypes ? "Accepted: " + acceptedTypes : "All file types accepted"
    )
  );
  zoneChildren.push(
    React.createElement("button", {
      key: "browse",
      className: styles.uploadBrowseButton,
      onClick: handleBrowseClick,
      type: "button",
    }, "Browse Files")
  );

  // Hidden file input
  zoneChildren.push(
    React.createElement("input", {
      key: "input",
      ref: inputRef,
      className: styles.uploadInput,
      type: "file",
      multiple: true,
      accept: acceptedTypes || undefined,
      onChange: handleInputChange,
    })
  );

  // Validation errors
  if (validationErrors.length > 0) {
    var errorItems = validationErrors.map(function (err, idx) {
      return React.createElement("div", { key: "err-" + idx, className: styles.uploadStatusError }, err);
    });
    zoneChildren.push(
      React.createElement("div", { key: "errors", style: { marginTop: "8px" } }, errorItems)
    );
  }

  // Upload progress list
  if (progressEntries.length > 0) {
    zoneChildren.push(
      React.createElement("div", { key: "progress", className: styles.uploadProgress }, progressEntries)
    );
  }

  return React.createElement("div", {
    className: zoneClass,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    role: "region",
    "aria-label": "File upload drop zone",
  }, zoneChildren);
};

export default HyperExplorerUploadZone;
