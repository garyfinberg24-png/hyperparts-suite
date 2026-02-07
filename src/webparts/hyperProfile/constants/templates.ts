import type { IHyperTemplate } from "../models";

/** Predefined template configurations */
export const TEMPLATES: IHyperTemplate[] = [
  {
    id: "executive",
    name: "Executive Card",
    description: "Large photo, prominent name, essential contact only",
    configuration: {
      cardStyle: "expanded",
      photoSize: "large",
      showPresence: true,
      showStatusMessage: true,
      presencePosition: "onPhoto",
      showQuickActions: true,
      enabledActions: ["email", "teams_chat", "schedule"],
      actionsLayout: "horizontal",
      buttonSize: "large",
      showActionLabels: true,
      showCompletenessScore: false,
      visibleFields: ["displayName", "jobTitle", "department", "mail", "mobilePhone"],
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      shadow: "strong",
      useThemeColors: false,
    },
  },
  {
    id: "standard",
    name: "Team Member Standard",
    description: "Balanced layout with all fields, medium density",
    configuration: {
      cardStyle: "standard",
      photoSize: "medium",
      showPresence: true,
      showStatusMessage: true,
      presencePosition: "onPhoto",
      showQuickActions: true,
      enabledActions: ["email", "teams_chat", "teams_call", "schedule"],
      actionsLayout: "horizontal",
      buttonSize: "medium",
      showActionLabels: true,
      showCompletenessScore: true,
      scorePosition: "bottom",
      scoreStyle: "progressBar",
      visibleFields: [
        "displayName", "jobTitle", "department", "mail",
        "mobilePhone", "businessPhones", "officeLocation", "city",
      ],
      backgroundColor: "#F3F2F1",
      borderRadius: 8,
      shadow: "medium",
      useThemeColors: true,
    },
  },
  {
    id: "compact",
    name: "Compact Contact",
    description: "Minimal horizontal layout, essential info only",
    configuration: {
      cardStyle: "compact",
      photoSize: "small",
      showPresence: true,
      showStatusMessage: false,
      presencePosition: "onPhoto",
      showQuickActions: true,
      enabledActions: ["email", "teams_chat", "teams_call"],
      actionsLayout: "dropdown",
      buttonSize: "small",
      showActionLabels: false,
      showCompletenessScore: true,
      scorePosition: "top",
      scoreStyle: "percentage",
      visibleFields: ["displayName", "jobTitle", "mail", "mobilePhone"],
      backgroundColor: "#FFFFFF",
      borderRadius: 4,
      shadow: "light",
      useThemeColors: false,
    },
  },
  {
    id: "detailed",
    name: "Detailed Profile",
    description: "Expanded vertical layout with all available fields",
    configuration: {
      cardStyle: "expanded",
      photoSize: "large",
      showPresence: true,
      showStatusMessage: true,
      presencePosition: "nextToName",
      showQuickActions: true,
      enabledActions: [
        "email", "teams_chat", "teams_call", "schedule",
        "delve", "vcard", "copy_email", "share_profile",
      ],
      actionsLayout: "horizontal",
      buttonSize: "medium",
      showActionLabels: true,
      showCompletenessScore: true,
      scorePosition: "top",
      scoreStyle: "progressBar",
      visibleFields: [
        "displayName", "jobTitle", "department", "mail",
        "mobilePhone", "businessPhones", "officeLocation", "city",
        "preferredLanguage", "employeeId", "aboutMe",
      ],
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      shadow: "medium",
      useThemeColors: false,
    },
  },
  {
    id: "minimalist",
    name: "Modern Minimalist",
    description: "Clean design, selective fields, lots of whitespace",
    configuration: {
      cardStyle: "standard",
      photoSize: "medium",
      showPresence: true,
      showStatusMessage: false,
      presencePosition: "onPhoto",
      showQuickActions: true,
      enabledActions: ["email", "teams_chat"],
      actionsLayout: "horizontal",
      buttonSize: "medium",
      showActionLabels: false,
      showCompletenessScore: false,
      visibleFields: ["displayName", "jobTitle", "mail"],
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      shadow: "none",
      useThemeColors: false,
    },
  },
  {
    id: "corporate",
    name: "Corporate Professional",
    description: "Traditional business card style",
    configuration: {
      cardStyle: "standard",
      photoSize: "small",
      showPresence: false,
      showStatusMessage: false,
      presencePosition: "onPhoto",
      showQuickActions: true,
      enabledActions: ["email", "teams_call", "schedule"],
      actionsLayout: "vertical",
      buttonSize: "medium",
      showActionLabels: true,
      showCompletenessScore: false,
      visibleFields: [
        "displayName", "jobTitle", "department", "companyName",
        "mail", "businessPhones", "officeLocation",
      ],
      backgroundColor: "#EDEBE9",
      borderRadius: 0,
      shadow: "none",
      useThemeColors: true,
    },
  },
  {
    id: "custom",
    name: "Custom Configuration",
    description: "User-defined configuration",
    configuration: {},
  },
];

/** Get template by ID */
export function getTemplateById(id: string): IHyperTemplate | undefined {
  let result: IHyperTemplate | undefined;
  TEMPLATES.forEach(function (t) {
    if (t.id === id && !result) {
      result = t;
    }
  });
  return result;
}

/** Get default template */
export function getDefaultTemplate(): IHyperTemplate {
  let result: IHyperTemplate | undefined;
  TEMPLATES.forEach(function (t) {
    if (t.id === "standard" && !result) {
      result = t;
    }
  });
  return result || TEMPLATES[0];
}
