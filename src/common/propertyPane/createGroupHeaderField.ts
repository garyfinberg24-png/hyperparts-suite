import * as React from "react";
import * as ReactDom from "react-dom";
import type { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { PropertyPaneFieldType } from "@microsoft/sp-property-pane";
import {
  HyperPropertyPaneGroupHeader,
} from "./HyperPropertyPaneGroupHeader";
import type {
  IHyperPropertyPaneGroupHeaderProps,
  GroupHeaderColor,
} from "./HyperPropertyPaneGroupHeader";

/**
 * Creates a PropertyPaneField that renders a styled group header.
 *
 * Usage in getPropertyPaneConfiguration():
 * ```
 * createGroupHeaderField("_layoutHeader", {
 *   icon: "\uD83C\uDFA8",
 *   title: "Layout",
 *   subtitle: "Display mode & grid",
 *   color: "blue",
 * })
 * ```
 */
export function createGroupHeaderField(
  key: string,
  headerProps: {
    icon: string;
    title: string;
    subtitle?: string;
    itemCount?: number;
    color: GroupHeaderColor;
  }
): IPropertyPaneField<{ key: string; onRender: (elem: HTMLElement) => void; onDispose: (elem: HTMLElement) => void }> {
  return {
    type: PropertyPaneFieldType.Custom,
    targetProperty: key,
    properties: {
      key: key,
      onRender: function (elem: HTMLElement): void {
        var element = React.createElement(HyperPropertyPaneGroupHeader, headerProps as IHyperPropertyPaneGroupHeaderProps);
        ReactDom.render(element, elem);
      },
      onDispose: function (elem: HTMLElement): void {
        ReactDom.unmountComponentAtNode(elem);
      },
    },
  };
}
