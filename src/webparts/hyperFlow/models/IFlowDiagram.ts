// ============================================================
// HyperFlow — Visual diagram data models
// ============================================================

import type { FlowNodeShape, FlowConnectorStyle } from "./IHyperFlowEnums";

export interface IFlowNode {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shape: FlowNodeShape;
  color?: string;
  borderColor?: string;
  textColor?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface IFlowConnector {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  style: FlowConnectorStyle;
  label?: string;
  color?: string;
}

export interface IFlowDiagram {
  nodes: IFlowNode[];
  connectors: IFlowConnector[];
  direction: "horizontal" | "vertical";
  title?: string;
}
