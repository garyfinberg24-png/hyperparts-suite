import * as React from "react";
import * as ReactDom from "react-dom";
import type { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { PropertyPaneFieldType } from "@microsoft/sp-property-pane";
import {
  HyperPropertyPaneAccordion,
} from "./HyperPropertyPaneAccordion";
import type {
  IHyperPropertyPaneAccordionProps,
} from "./HyperPropertyPaneAccordion";

/**
 * Creates a PropertyPaneField that renders an accordion item editor.
 *
 * Usage in getPropertyPaneConfiguration():
 * ```
 * createAccordionField("_navLinks", {
 *   items: buildAccordionItems(self.properties.links),
 *   onReorder: self._handleReorder.bind(self),
 *   onDelete: self._handleDelete.bind(self),
 *   onAdd: self._handleAdd.bind(self),
 *   addLabel: "Add Link",
 * })
 * ```
 */
export function createAccordionField(
  key: string,
  accordionProps: IHyperPropertyPaneAccordionProps
): IPropertyPaneField<{ key: string; onRender: (elem: HTMLElement) => void; onDispose: (elem: HTMLElement) => void }> {
  return {
    type: PropertyPaneFieldType.Custom,
    targetProperty: key,
    properties: {
      key: key,
      onRender: function (elem: HTMLElement): void {
        var element = React.createElement(HyperPropertyPaneAccordion, accordionProps);
        ReactDom.render(element, elem);
      },
      onDispose: function (elem: HTMLElement): void {
        ReactDom.unmountComponentAtNode(elem);
      },
    },
  };
}
