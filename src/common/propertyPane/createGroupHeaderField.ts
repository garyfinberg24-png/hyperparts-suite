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
 * SPFx property pane DOM structure (typical):
 *
 *   <div class="ms-PropertyPaneGroupField">     ← "fieldWrapper" level
 *     <div class="ms-CustomFieldHost">           ← wrapper
 *       <div>                                    ← elem (passed to onRender)
 *         <div class="header">...</div>          ← our React component
 *       </div>
 *     </div>
 *   </div>
 *   <div class="ms-PropertyPaneGroupField">     ← sibling field
 *     ...
 *   </div>
 *
 * We need to find the outermost "fieldWrapper" so we can show/hide
 * sibling fieldWrappers. We walk up from `elem` until we find a parent
 * that has multiple children (the group field list).
 */
function findFieldWrapper(elem: HTMLElement): HTMLElement {
  var current = elem;
  // Walk up until we find a node whose parent has multiple children
  // (that parent is the group field list)
  while (current.parentElement) {
    var parentEl = current.parentElement;
    if (parentEl.children.length > 1) {
      return current;
    }
    current = parentEl;
  }
  return elem; // fallback
}

function getSiblingFields(elem: HTMLElement): HTMLElement[] {
  var wrapper = findFieldWrapper(elem);
  var parent = wrapper.parentElement;
  if (!parent) return [];

  var siblings: HTMLElement[] = [];
  var foundSelf = false;
  for (var i = 0; i < parent.children.length; i++) {
    var child = parent.children[i] as HTMLElement;
    if (child === wrapper) {
      foundSelf = true;
      continue;
    }
    if (!foundSelf) continue;
    // Stop at next collapsible header
    if (child.querySelector("[data-hyper-collapsible-header]")) break;
    siblings.push(child);
  }
  return siblings;
}

function toggleSiblings(elem: HTMLElement, collapsed: boolean): void {
  var siblings = getSiblingFields(elem);
  siblings.forEach(function (el) {
    el.style.display = collapsed ? "none" : "";
  });
}

/**
 * Creates a PropertyPaneField that renders a styled group header.
 * When collapsible=true, clicking the header toggles visibility of
 * subsequent fields until the next header.
 *
 * All collapse/expand logic lives here (DOM level), NOT in the React component.
 */
export function createGroupHeaderField(
  key: string,
  headerProps: {
    icon: string;
    title: string;
    subtitle?: string;
    itemCount?: number;
    color: GroupHeaderColor;
    collapsible?: boolean;
    startCollapsed?: boolean;
  }
): IPropertyPaneField<{ key: string; onRender: (elem: HTMLElement) => void; onDispose: (elem: HTMLElement) => void }> {
  // Track collapsed state across SPFx re-renders (closure variable)
  var isCollapsed = !!headerProps.startCollapsed;

  return {
    type: PropertyPaneFieldType.Custom,
    targetProperty: key,
    properties: {
      key: key,
      onRender: function (elem: HTMLElement): void {
        // Render the React header component (purely visual)
        var element = React.createElement(HyperPropertyPaneGroupHeader, headerProps as IHyperPropertyPaneGroupHeaderProps);
        ReactDom.render(element, elem);

        if (!headerProps.collapsible) return;

        // Mark this element so sibling search can identify headers
        elem.setAttribute("data-hyper-collapsible-header", "true");

        // Accessibility
        elem.setAttribute("role", "button");
        elem.setAttribute("tabindex", "0");
        elem.setAttribute("aria-expanded", String(!isCollapsed));

        // Apply initial collapsed state after SPFx finishes rendering siblings
        setTimeout(function () {
          toggleSiblings(elem, isCollapsed);
          // Ensure chevron matches
          var chevron = elem.querySelector("[data-hyper-chevron]") as HTMLElement;
          if (chevron) {
            chevron.style.transform = isCollapsed ? "rotate(0deg)" : "rotate(90deg)";
          }
        }, 100);

        // Click handler
        elem.style.cursor = "pointer";
        elem.onclick = function () {
          isCollapsed = !isCollapsed;
          toggleSiblings(elem, isCollapsed);
          elem.setAttribute("aria-expanded", String(!isCollapsed));
          // Update chevron rotation
          var chevron = elem.querySelector("[data-hyper-chevron]") as HTMLElement;
          if (chevron) {
            chevron.style.transform = isCollapsed ? "rotate(0deg)" : "rotate(90deg)";
          }
        };

        // Keyboard handler (Enter/Space)
        elem.onkeydown = function (e: KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            elem.click();
          }
        };
      },
      onDispose: function (elem: HTMLElement): void {
        elem.onclick = undefined as unknown as ((this: GlobalEventHandlers, ev: MouseEvent) => unknown);
        elem.onkeydown = undefined as unknown as ((this: GlobalEventHandlers, ev: KeyboardEvent) => unknown);
        ReactDom.unmountComponentAtNode(elem);
      },
    },
  };
}
