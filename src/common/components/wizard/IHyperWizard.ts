import type * as React from "react";

// ============================================================
// HYPER WIZARD — Shared Interfaces for Universal Setup Wizard
// ============================================================

/** A single feature card shown on the welcome/splash screen */
export interface IWizardFeatureCard {
  icon: string;
  title: string;
  description: string;
}

/** Welcome/splash screen configuration */
export interface IWizardWelcomeConfig {
  /** Product name displayed after "Hyper" (e.g. "Links", "Hero", "News") */
  productName: string;
  /** Tagline shown below the brand name */
  tagline: string;
  /** Bold words in tagline (rendered with font-weight 700) */
  taglineBold?: string[];
  /** 4 feature highlight cards */
  features: IWizardFeatureCard[];
}

/** Props passed to each wizard step component */
export interface IWizardStepProps<TState> {
  state: TState;
  onChange: (partial: Partial<TState>) => void;
}

/** A single step definition in the wizard */
export interface IWizardStepDef<TState> {
  /** Unique identifier for this step */
  id: string;
  /** Full label shown in the step header */
  label: string;
  /** Short label shown in the stepper circles */
  shortLabel: string;
  /** Contextual help text (string or function for dynamic help) */
  helpText: string | ((state: TState) => string);
  /** The React component that renders this step */
  component: React.FC<IWizardStepProps<TState>>;
  /** Return true if the step is complete enough to proceed */
  validate?: (state: TState) => boolean;
  /** Return true to hide this step (for branching flows) */
  hidden?: (state: TState) => boolean;
}

/** A row in the summary step */
export interface IWizardSummaryRow {
  label: string;
  value: string;
  type?: "text" | "badge" | "mono" | "badgeGreen";
}

/** Full wizard configuration — each web part creates one of these */
export interface IHyperWizardConfig<TState, TResult> {
  /** Modal title (e.g. "HyperLinks Setup Wizard") */
  title: string;
  /** Welcome/splash screen configuration */
  welcome: IWizardWelcomeConfig;
  /** Step definitions (excludes welcome + summary — those are auto-added) */
  steps: IWizardStepDef<TState>[];
  /** Initial wizard state */
  initialState: TState;
  /** Transform wizard state into the final result */
  buildResult: (state: TState) => TResult;
  /** Generate summary rows for the review step */
  buildSummary: (state: TState) => IWizardSummaryRow[];
  /** Optional footnote shown below the summary card */
  summaryFootnote?: string;
}

/** Props for the HyperWizard component */
export interface IHyperWizardProps<TState, TResult> {
  config: IHyperWizardConfig<TState, TResult>;
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: TResult) => void;
}
