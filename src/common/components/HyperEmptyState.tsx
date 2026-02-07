import * as React from "react";
import type { IEmptyStateConfig } from "../models";

export interface IHyperEmptyStateProps extends IEmptyStateConfig {
  className?: string;
}

export const HyperEmptyState: React.FC<IHyperEmptyStateProps> = (props) => {
  const { title, description, actionLabel, onAction, className } = props;

  return React.createElement("div", {
    className,
    style: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      textAlign: "center" as const,
      color: "#605e5c",
    },
    role: "status",
  },
    React.createElement("div", {
      style: {
        fontSize: "48px",
        marginBottom: "16px",
        opacity: 0.5,
      }
    }, "\uD83D\uDCC2"), // 📂 folder emoji as default icon
    React.createElement("h3", {
      style: {
        margin: "0 0 8px 0",
        fontSize: "18px",
        fontWeight: 600,
        color: "#323130",
      }
    }, title),
    description ? React.createElement("p", {
      style: {
        margin: "0 0 16px 0",
        fontSize: "14px",
        maxWidth: "400px",
        lineHeight: "1.5",
      }
    }, description) : null,
    actionLabel && onAction ? React.createElement("button", {
      onClick: onAction,
      style: {
        padding: "8px 20px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#0078d4",
        color: "#ffffff",
        fontSize: "14px",
        cursor: "pointer",
        fontWeight: 600,
      }
    }, actionLabel) : null
  );
};
