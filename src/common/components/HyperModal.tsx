import * as React from "react";

export interface IHyperModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeMap: Record<string, string> = {
  small: "400px",
  medium: "600px",
  large: "900px",
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

  return React.createElement("div", {
    style: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000000,
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
      style: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
        width: "90%",
        maxWidth: sizeMap[size],
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column" as const,
        overflow: "hidden",
      },
    },
      // Header
      React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #edebe9",
        },
      },
        React.createElement("h2", {
          style: {
            margin: 0,
            fontSize: "20px",
            fontWeight: 600,
            color: "#323130",
          },
        }, title),
        React.createElement("button", {
          onClick: onClose,
          "aria-label": "Close dialog",
          style: {
            border: "none",
            background: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px 8px",
            color: "#605e5c",
            borderRadius: "4px",
          },
        }, "\u00D7") // × character
      ),
      // Body
      React.createElement("div", {
        style: {
          padding: "24px",
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
