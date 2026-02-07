import * as React from "react";

export interface IHyperErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface IHyperErrorBoundaryState {
  hasError: boolean;
  error: Error | undefined;
}

export class HyperErrorBoundary extends React.Component<IHyperErrorBoundaryProps, IHyperErrorBoundaryState> {
  constructor(props: IHyperErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): IHyperErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("[HyperErrorBoundary]", error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return React.createElement("div", {
        style: {
          padding: "16px",
          border: "1px solid #d13438",
          borderRadius: "4px",
          backgroundColor: "#fde7e9",
          color: "#323130",
        }
      },
        React.createElement("h3", {
          style: { margin: "0 0 8px 0", color: "#d13438" }
        }, "Something went wrong"),
        React.createElement("p", {
          style: { margin: "0 0 12px 0", fontSize: "14px" }
        }, this.state.error?.message ?? "An unexpected error occurred."),
        React.createElement("button", {
          onClick: this.handleRetry,
          style: {
            padding: "6px 16px",
            border: "1px solid #d13438",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            color: "#d13438",
            cursor: "pointer",
            fontSize: "14px",
          }
        }, "Retry")
      );
    }

    return this.props.children;
  }
}
