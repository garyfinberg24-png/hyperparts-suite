// ============================================================
// HyperFlow — Default sample data
// Loaded when useSampleData === true (first-run experience)
// ============================================================

import type { IFlowDiagram, IFlowProcess } from "../models";

/**
 * SAMPLE_VISUAL_DIAGRAM — 7-node horizontal pill flow
 * "Getting Started with HyperFlow" — a friendly onboarding diagram
 * that renders immediately when the web part is first added.
 */
export var SAMPLE_VISUAL_DIAGRAM: IFlowDiagram = {
  title: "Getting Started with HyperFlow",
  direction: "horizontal",
  nodes: [
    {
      id: "s-v1",
      label: "Add Web Part",
      description: "Drop HyperFlow onto your SharePoint page",
      icon: "plus",
      shape: "pill",
      color: "#0078d4",
      x: 0,
      y: 100,
      width: 150,
      height: 48,
    },
    {
      id: "s-v2",
      label: "Choose Mode",
      description: "Select Visual Diagram or Process Stepper",
      icon: "flow",
      shape: "pill",
      color: "#106ebe",
      x: 190,
      y: 100,
      width: 150,
      height: 48,
    },
    {
      id: "s-v3",
      label: "Pick a Template",
      description: "Start from a pre-built template or design your own",
      icon: "template",
      shape: "pill",
      color: "#2b88d8",
      x: 380,
      y: 100,
      width: 150,
      height: 48,
    },
    {
      id: "s-v4",
      label: "Customize",
      description: "Edit nodes, colors, labels, and connectors",
      icon: "palette",
      shape: "pill",
      color: "#005a9e",
      x: 570,
      y: 100,
      width: 150,
      height: 48,
    },
    {
      id: "s-v5",
      label: "Add Details",
      description: "Attach descriptions, icons, and assignments",
      icon: "edit",
      shape: "pill",
      color: "#004578",
      x: 760,
      y: 100,
      width: 150,
      height: 48,
    },
    {
      id: "s-v6",
      label: "Preview",
      description: "Use Demo Mode to try different themes and styles",
      icon: "eye",
      shape: "pill",
      color: "#3a96dd",
      x: 950,
      y: 100,
      width: 150,
      height: 48,
    },
    {
      id: "s-v7",
      label: "Publish",
      description: "Save and share your flow with your team",
      icon: "check-circle",
      shape: "pill",
      color: "#0078d4",
      x: 1140,
      y: 100,
      width: 150,
      height: 48,
    },
  ],
  connectors: [
    { id: "s-vc1", fromNodeId: "s-v1", toNodeId: "s-v2", style: "arrow", color: "#a0aec0" },
    { id: "s-vc2", fromNodeId: "s-v2", toNodeId: "s-v3", style: "arrow", color: "#a0aec0" },
    { id: "s-vc3", fromNodeId: "s-v3", toNodeId: "s-v4", style: "arrow", color: "#a0aec0" },
    { id: "s-vc4", fromNodeId: "s-v4", toNodeId: "s-v5", style: "arrow", color: "#a0aec0" },
    { id: "s-vc5", fromNodeId: "s-v5", toNodeId: "s-v6", style: "arrow", color: "#a0aec0" },
    { id: "s-vc6", fromNodeId: "s-v6", toNodeId: "s-v7", style: "arrow", color: "#a0aec0" },
  ],
};

/**
 * SAMPLE_FUNCTIONAL_PROCESS — 5-step "Content Publishing" flow
 * A universally relatable process that demonstrates all step states.
 */
export var SAMPLE_FUNCTIONAL_PROCESS: IFlowProcess = {
  title: "Content Publishing Workflow",
  currentStepId: "s-p3",
  steps: [
    {
      id: "s-p1",
      title: "Ideation",
      description: "Content idea proposed and evaluated against editorial calendar. Topic approved by content lead.",
      icon: "star",
      status: "completed",
      assignee: "Content Lead",
      order: 1,
      color: "#0ea5e9",
      subtasks: [
        { id: "s-p1a", title: "Research trending topics", completed: true },
        { id: "s-p1b", title: "Check editorial calendar", completed: true },
        { id: "s-p1c", title: "Get topic approved", completed: true },
      ],
    },
    {
      id: "s-p2",
      title: "Writing",
      description: "First draft created with target keywords integrated. Word count and tone guidelines followed.",
      icon: "edit",
      status: "completed",
      assignee: "Emma Taylor",
      order: 2,
      color: "#06b6d4",
      subtasks: [
        { id: "s-p2a", title: "Write first draft", completed: true },
        { id: "s-p2b", title: "Include target keywords", completed: true },
        { id: "s-p2c", title: "Add internal links", completed: true },
      ],
    },
    {
      id: "s-p3",
      title: "Editing",
      description: "Copy editing for grammar, style consistency, and brand voice. Fact-checking in progress.",
      icon: "eye",
      status: "in-progress",
      assignee: "Editorial Team",
      dueDate: "2025-03-10",
      order: 3,
      color: "#22d3ee",
      subtasks: [
        { id: "s-p3a", title: "Grammar and spelling review", completed: true },
        { id: "s-p3b", title: "Brand voice consistency", completed: true },
        { id: "s-p3c", title: "Fact-check all statistics", completed: false },
        { id: "s-p3d", title: "Verify source attributions", completed: false },
      ],
    },
    {
      id: "s-p4",
      title: "Approval",
      description: "Final review by marketing director. Legal sign-off if referencing trademarks or partners.",
      icon: "check-circle",
      status: "not-started",
      assignee: "Marketing Director",
      order: 4,
      color: "#0284c7",
    },
    {
      id: "s-p5",
      title: "Published",
      description: "Content published to site. Social media posts scheduled. Analytics tracking activated.",
      icon: "flag",
      status: "not-started",
      order: 5,
      color: "#0891b2",
    },
  ],
};
