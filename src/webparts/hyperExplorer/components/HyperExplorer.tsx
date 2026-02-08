import * as React from "react";
import type { IHyperExplorerWebPartProps } from "../models";

export interface IHyperExplorerComponentProps extends IHyperExplorerWebPartProps {
  instanceId: string;
  isEditMode: boolean;
}

/** Placeholder — replaced in EX2 */
const HyperExplorer: React.FC<IHyperExplorerComponentProps> = function (props) {
  return React.createElement(
    "div",
    { "data-instance": props.instanceId },
    React.createElement("h2", undefined, props.title || "HyperExplorer"),
    React.createElement("p", undefined, "HyperExplorer component loading...")
  );
};

export default HyperExplorer;
