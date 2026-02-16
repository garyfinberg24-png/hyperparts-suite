import type { GroupHeaderColor } from "../propertyPane/HyperPropertyPaneGroupHeader";

/** A single field in the property editor modal */
export interface IEditorFieldDef {
  /** Property key on the web part props (e.g. "layoutMode", "title") */
  key: string;
  /** Human-readable label */
  label: string;
  /** Field type */
  type: "text" | "textarea" | "dropdown" | "slider" | "toggle" | "color" | "url";
  /** Dropdown options (required when type="dropdown") */
  options?: Array<{ key: string; text: string }>;
  /** Slider min (required when type="slider") */
  min?: number;
  /** Slider max (required when type="slider") */
  max?: number;
  /** Slider step (optional, defaults to 1) */
  step?: number;
  /** Placeholder text for text/textarea/url fields */
  placeholder?: string;
  /** Textarea rows (optional, for type="textarea") */
  rows?: number;
  /** Help text shown below the field */
  description?: string;
  /** Return true to disable this field based on current editor values */
  disabled?: (values: Record<string, unknown>) => boolean;
  /** Return true to hide this field based on current editor values */
  hidden?: (values: Record<string, unknown>) => boolean;
}

/** A section of fields (rendered as a group with a colored header) */
export interface IEditorSectionDef {
  /** Section ID (used for sidebar navigation) */
  id: string;
  /** Section title (e.g. "Layout", "Styling", "Features") */
  title: string;
  /** Subtitle (shown in the section header) */
  subtitle?: string;
  /** Emoji or icon character for the section header */
  icon: string;
  /** Color theme for the section header icon background */
  color: GroupHeaderColor;
  /** Fields in this section */
  fields: IEditorFieldDef[];
}

/** Full editor configuration for a web part */
export interface IEditorConfig {
  /** Modal title (e.g. "HyperNav Properties") */
  title: string;
  /** Sections of fields */
  sections: IEditorSectionDef[];
}

/** Props passed from WebPart.ts to main component for the editor modal */
export interface IEditorComponentProps {
  showPropertyEditor?: boolean;
  editorConfig?: IEditorConfig;
  onEditorApply?: (changes: Record<string, unknown>) => void;
  onEditorClose?: () => void;
}
