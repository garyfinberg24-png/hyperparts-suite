import {
  type IPropertyPaneGroup,
  PropertyPaneButton,
  PropertyPaneButtonType,
} from "@microsoft/sp-property-pane";
import { createGroupHeaderField } from "./createGroupHeaderField";

/**
 * Creates a "Quick Actions" property pane group with 3 buttons:
 * - Reopen Wizard
 * - Edit in Editor
 * - Demo Mode (toggle)
 *
 * Place as the FIRST group on Page 1 of every web part's property pane.
 */
export function createQuickActionsGroup(handlers: {
  onReopenWizard: () => string;
  onEditInEditor: () => string;
  onToggleDemoMode: () => string;
}): IPropertyPaneGroup {
  return {
    groupName: "Quick Actions",
    groupFields: [
      createGroupHeaderField("_quickActionsHeader", {
        icon: "\u26A1",
        title: "Quick Actions",
        subtitle: "Setup & configuration tools",
        color: "blue",
      }),
      PropertyPaneButton("_reopenWizard", {
        text: "Reopen Wizard",
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Settings",
        onClick: handlers.onReopenWizard,
      }),
      PropertyPaneButton("_editInEditor", {
        text: "Edit in Editor",
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Edit",
        onClick: handlers.onEditInEditor,
      }),
      PropertyPaneButton("_toggleDemoMode", {
        text: "Demo Mode",
        buttonType: PropertyPaneButtonType.Normal,
        icon: "TestBeaker",
        onClick: handlers.onToggleDemoMode,
      }),
    ],
  };
}
