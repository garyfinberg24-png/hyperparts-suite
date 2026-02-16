import * as React from "react";

export interface IHyperModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "small" | "medium" | "large" | "xlarge" | "fullscreen" | "panel";
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeMap: Record<string, string> = {
  small: "400px",
  medium: "600px",
  large: "900px",
  xlarge: "1200px",
  fullscreen: "960px",
};

export const HyperModal: React.FC<IHyperModalProps> = (props) => {
  const { isOpen, onClose, title, size = "medium", children, footer } = props;
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  React.useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const firstFocusable = modalRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  var isPanel = size === "panel";

  return React.createElement("div", {
    style: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      alignItems: isPanel ? "stretch" : "center",
      justifyContent: isPanel ? "flex-end" : "center",
      zIndex: 1000000,
      pointerEvents: "auto" as const,
    },
    onClick: (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    role: "presentation",
  },
    React.createElement("div", {
      ref: modalRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
      style: isPanel ? {
        backgroundColor: "#ffffff",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.18)",
        width: "380px",
        maxWidth: "90vw",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
        overflow: "hidden",
      } : {
        backgroundColor: "#ffffff",
        borderRadius: size === "fullscreen" ? "8px" : "8px",
        boxShadow: size === "fullscreen" ? "0 25px 60px rgba(0,0,0,0.25)" : "0 8px 24px rgba(0,0,0,0.14)",
        width: size === "fullscreen" ? "1020px" : "90%",
        maxWidth: size === "fullscreen" ? "94vw" : sizeMap[size],
        height: size === "fullscreen" ? undefined : undefined,
        maxHeight: size === "fullscreen" ? "92vh" : "90vh",
        display: "flex",
        flexDirection: "column" as const,
        overflow: "hidden",
      },
    },
      // Header — slim for fullscreen, standard for others
      React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: size === "fullscreen" ? "8px 20px" : "16px 24px",
          borderBottom: "1px solid #edebe9",
          background: size === "fullscreen" ? "#faf9f8" : undefined,
          flexShrink: 0,
        },
      },
        React.createElement(size === "fullscreen" ? "h3" : "h2", {
          style: {
            margin: 0,
            fontSize: size === "fullscreen" ? "14px" : "20px",
            fontWeight: 600,
            color: size === "fullscreen" ? "#605e5c" : "#323130",
          },
        }, title),
        React.createElement("button", {
          onClick: onClose,
          "aria-label": "Close dialog",
          style: {
            border: "none",
            background: "none",
            fontSize: size === "fullscreen" ? "18px" : "20px",
            cursor: "pointer",
            padding: "4px 8px",
            color: "#605e5c",
            borderRadius: "4px",
            lineHeight: "1",
          },
        }, "\u00D7") // × character
      ),
      // Body — no padding for fullscreen (wizard handles its own layout)
      React.createElement("div", {
        style: {
          padding: size === "fullscreen" ? "0" : "24px",
          overflowY: "auto" as const,
          flex: 1,
        },
      }, children),
      // Footer
      footer ? React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          padding: "16px 24px",
          borderTop: "1px solid #edebe9",
        },
      }, footer) : null
    )
  );
};
