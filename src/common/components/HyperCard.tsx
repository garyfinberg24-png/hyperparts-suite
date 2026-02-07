import * as React from "react";

export interface IHyperCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const HyperCard: React.FC<IHyperCardProps> = (props) => {
  const {
    title,
    description,
    imageUrl,
    imageAlt,
    actions,
    onClick,
    className,
    style,
    children,
  } = props;

  const isClickable = !!onClick;

  return React.createElement("div", {
    className,
    role: isClickable ? "button" : undefined,
    tabIndex: isClickable ? 0 : undefined,
    onClick,
    onKeyDown: isClickable ? (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick!();
      }
    } : undefined,
    style: {
      border: "1px solid #edebe9",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
      cursor: isClickable ? "pointer" : undefined,
      ...style,
    },
  },
    imageUrl ? React.createElement("div", {
      style: {
        width: "100%",
        height: "180px",
        overflow: "hidden",
      }
    },
      React.createElement("img", {
        src: imageUrl,
        alt: imageAlt ?? title,
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover" as const,
        }
      })
    ) : null,
    React.createElement("div", {
      style: { padding: "16px" },
    },
      React.createElement("h3", {
        style: {
          margin: "0 0 8px 0",
          fontSize: "16px",
          fontWeight: 600,
          color: "#323130",
        }
      }, title),
      description ? React.createElement("p", {
        style: {
          margin: "0 0 12px 0",
          fontSize: "14px",
          color: "#605e5c",
          lineHeight: "1.4",
        }
      }, description) : null,
      children,
      actions ? React.createElement("div", {
        style: {
          display: "flex",
          gap: "8px",
          marginTop: "12px",
        }
      }, actions) : null
    )
  );
};
