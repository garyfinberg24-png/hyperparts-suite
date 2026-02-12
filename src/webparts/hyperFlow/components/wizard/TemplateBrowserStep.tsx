import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperFlowWizardState } from "../../models";
import type { FlowFunctionalLayout } from "../../models";

// ============================================================
// Step 3: Template Browser — Gallery of functional templates
// ============================================================

/** Local template stub (until flowTemplates.ts exists in utils) */
interface IFlowTemplateStub {
  id: string;
  name: string;
  description: string;
  category: string;
  stepCount: number;
  layout: FlowFunctionalLayout;
}

var FUNCTIONAL_TEMPLATES: IFlowTemplateStub[] = [
  {
    id: "sales-pipeline",
    name: "Sales Pipeline",
    description: "Track leads from prospecting through close with stage-based progression",
    category: "Sales",
    stepCount: 6,
    layout: "kanban",
  },
  {
    id: "it-ticket",
    name: "IT Ticket Resolution",
    description: "Manage support tickets from submission through resolution and feedback",
    category: "IT",
    stepCount: 5,
    layout: "horizontal",
  },
  {
    id: "employee-onboarding",
    name: "Employee Onboarding",
    description: "Guide new hires through orientation, training, and team integration",
    category: "HR",
    stepCount: 7,
    layout: "checklist",
  },
  {
    id: "project-lifecycle",
    name: "Project Lifecycle",
    description: "Plan, execute, and deliver projects with milestone tracking",
    category: "Project",
    stepCount: 5,
    layout: "timeline",
  },
  {
    id: "content-publishing",
    name: "Content Publishing",
    description: "Draft, review, approve, and publish content with editorial workflow",
    category: "Content",
    stepCount: 5,
    layout: "horizontal",
  },
  {
    id: "budget-approval",
    name: "Budget Approval",
    description: "Submit, review, and approve budget requests with multi-level sign-off",
    category: "Sales",
    stepCount: 4,
    layout: "horizontal",
  },
];

var ALL_CATEGORIES = ["All", "Sales", "IT", "HR", "Project", "Content"];

// Styles
var containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "4px 0",
};

var filterRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

var chipBaseStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 500,
  padding: "5px 14px",
  borderRadius: "16px",
  border: "1px solid #d0d0d0",
  backgroundColor: "#ffffff",
  color: "#444444",
  cursor: "pointer",
  transition: "all 0.15s",
};

var chipActiveStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 500,
  padding: "5px 14px",
  borderRadius: "16px",
  border: "1px solid #0078d4",
  backgroundColor: "#0078d4",
  color: "#ffffff",
  cursor: "pointer",
  transition: "all 0.15s",
};

var gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

var templateCardBaseStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var templateCardActiveStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "8px",
  border: "2px solid #0078d4",
  backgroundColor: "#f0f6ff",
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
};

var templateNameStyle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: "6px",
};

var templateDescStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666666",
  lineHeight: "1.4",
  marginBottom: "10px",
};

var badgeRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

var stepBadgeStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#0078d4",
  backgroundColor: "#e8f2fc",
  padding: "2px 8px",
  borderRadius: "10px",
};

var categoryBadgeStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  color: "#555555",
  backgroundColor: "#f0f0f0",
  padding: "2px 8px",
  borderRadius: "10px",
};

var hintStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#0078d4",
  fontWeight: 500,
  padding: "8px 12px",
  backgroundColor: "#f0f6ff",
  borderRadius: "6px",
};

var TemplateBrowserStep: React.FC<IWizardStepProps<IHyperFlowWizardState>> = function (props) {
  var state = props.state;
  var filterState = React.useState("All");
  var activeFilter = filterState[0];
  var setActiveFilter = filterState[1];

  var handleSelectTemplate = React.useCallback(function (tmpl: IFlowTemplateStub) {
    props.onChange({
      templateId: tmpl.id,
      flowMode: "functional",
      functionalLayout: tmpl.layout,
    });
  }, [props]);

  // Filter templates
  var filteredTemplates = React.useMemo(function () {
    if (activeFilter === "All") {
      return FUNCTIONAL_TEMPLATES;
    }
    return FUNCTIONAL_TEMPLATES.filter(function (t) {
      return t.category === activeFilter;
    });
  }, [activeFilter]);

  // Category filter chips
  var filterChips = ALL_CATEGORIES.map(function (cat) {
    var isActive = activeFilter === cat;
    return React.createElement("button", {
      key: cat,
      type: "button",
      style: isActive ? chipActiveStyle : chipBaseStyle,
      onClick: function () { setActiveFilter(cat); },
      "aria-pressed": isActive,
    }, cat);
  });

  // Template cards
  var templateCards = filteredTemplates.map(function (tmpl) {
    var isSelected = state.templateId === tmpl.id;

    return React.createElement("div", {
      key: tmpl.id,
      style: isSelected ? templateCardActiveStyle : templateCardBaseStyle,
      onClick: function () { handleSelectTemplate(tmpl); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectTemplate(tmpl);
        }
      },
    },
      React.createElement("div", { style: templateNameStyle }, tmpl.name),
      React.createElement("div", { style: templateDescStyle }, tmpl.description),
      React.createElement("div", { style: badgeRowStyle },
        React.createElement("span", { style: stepBadgeStyle },
          String(tmpl.stepCount) + " steps"
        ),
        React.createElement("span", { style: categoryBadgeStyle }, tmpl.category)
      )
    );
  });

  return React.createElement("div", { style: containerStyle },
    // Category filter
    React.createElement("div", {
      style: filterRowStyle,
      role: "toolbar",
      "aria-label": "Category filter",
    }, filterChips),

    // Template grid
    React.createElement("div", {
      style: gridStyle,
      role: "radiogroup",
      "aria-label": "Process templates",
    }, templateCards),

    // Selected template hint
    state.templateId
      ? React.createElement("div", { style: hintStyle },
          "\u2713 Template selected. Settings will be pre-configured based on this template."
        )
      : undefined
  );
};

export default TemplateBrowserStep;
