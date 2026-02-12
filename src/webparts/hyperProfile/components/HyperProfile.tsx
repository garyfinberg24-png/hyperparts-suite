import * as React from "react";
import type { IHyperProfileWebPartProps } from "../models";
import type { IProfileTemplateProps } from "./templates/IProfileTemplateProps";
import type { TemplateType } from "../models/IHyperProfileTemplate";
import type { IProfileSkill } from "../models/IHyperProfileSkill";
import type { IProfileBadge } from "../models/IHyperProfileBadge";
import type { IProfilePersonal } from "../models/IHyperProfilePersonal";
import type { IProfileOrgNode } from "../models/IHyperProfileOrgNode";
import type { ICalendarDay } from "../models/IHyperProfileCalendar";
import type { DemoPersonId } from "../models/IHyperProfileDemoConfig";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperSkeleton } from "../../../common/components";
import { HyperEmptyState } from "../../../common/components";
import { HyperEditOverlay } from "../../../common/components";
import { useProfileData } from "../hooks/useProfileData";
import { usePresence } from "../hooks/usePresence";
import { useHyperProfileStore } from "../store/useHyperProfileStore";
import { getSamplePerson } from "../utils/sampleData";
import { getTemplateComponent } from "./templates";
import HyperProfileDemoBar from "./HyperProfileDemoBar";
import WelcomeStep from "./wizard/WelcomeStep";
import styles from "./HyperProfile.module.scss";

export interface IHyperProfileComponentProps extends IHyperProfileWebPartProps {
  instanceId: string;
  /** Whether the web part is in edit mode (displayMode === 2) */
  isEditMode?: boolean;
  /** Callback when the wizard "Get Started" is clicked */
  onWizardComplete?: () => void;
  /** Callback to toggle demo mode from within the component */
  onDemoModeChange?: (enabled: boolean) => void;
  /** Callback to open the property pane */
  onConfigure?: () => void;
}

const HyperProfileInner: React.FC<IHyperProfileComponentProps> = function (props) {
  const store = useHyperProfileStore();

  // ── Wizard state ──
  var wizardOpenState = React.useState(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  React.useEffect(function () {
    if (props.isEditMode && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, [props.isEditMode, props.wizardCompleted]);

  var handleWizardApply = function (_result: Partial<IHyperProfileWebPartProps>): void {
    if (props.onWizardComplete) {
      props.onWizardComplete();
    }
    setWizardOpen(false);
    // Auto-enable demo mode so the user sees sample data immediately
    store.setDemoMode(true);
    if (props.onDemoModeChange) {
      props.onDemoModeChange(true);
    }
  };

  var handleWizardClose = function (): void {
    setWizardOpen(false);
  };

  // Wizard element — rendered as modal alongside content
  var wizardElement = React.createElement(WelcomeStep, {
    isOpen: wizardOpen,
    onClose: handleWizardClose,
    onApply: handleWizardApply,
    currentProps: props.wizardCompleted ? props as IHyperProfileWebPartProps : undefined,
  });

  // Determine template
  const templateId: TemplateType = props.selectedTemplate || store.selectedTemplateId || "standard";

  // Demo mode data — useSampleData activates demo mode
  const isDemoMode = store.isDemoMode || props.enableDemoMode || props.useSampleData;
  const demoPersonId: DemoPersonId = store.demoPersonId || props.demoPersonId || "sarah";
  const demoPerson = isDemoMode ? getSamplePerson(demoPersonId) : undefined;

  // Real data (skip fetch in demo mode)
  const profileData = useProfileData(
    isDemoMode ? undefined : props.defaultUserId
  );

  const presenceResult = usePresence(
    isDemoMode ? undefined : (profileData.profile ? profileData.profile.id : undefined),
    props.showPresence,
    props.presenceRefreshInterval || 30
  );

  // Choose data source: demo or real
  const profile = isDemoMode && demoPerson ? demoPerson.profile : profileData.profile;
  const manager = isDemoMode && demoPerson ? demoPerson.manager : profileData.manager;
  const photoUrl = isDemoMode && demoPerson ? demoPerson.photoUrl : profileData.photoUrl;
  const loading = isDemoMode ? false : profileData.loading;
  const error = isDemoMode ? undefined : profileData.error;

  // V2 extended data from demo or empty defaults
  const skills: IProfileSkill[] = isDemoMode && demoPerson ? demoPerson.skills : [];
  const badges: IProfileBadge[] = isDemoMode && demoPerson ? demoPerson.badges : [];
  const personal: IProfilePersonal | undefined = isDemoMode && demoPerson ? demoPerson.personal : undefined;
  const orgTree: IProfileOrgNode | undefined = isDemoMode && demoPerson ? demoPerson.orgTree : undefined;
  const calendar: ICalendarDay[] = isDemoMode && demoPerson ? demoPerson.calendar : [];

  // Presence: demo uses mock, real uses hook
  const presence = isDemoMode ? { availability: "Available" as const, activity: "Available" as const } : presenceResult.presence;

  // Loading state
  if (loading) {
    return React.createElement(
      "div",
      { className: styles.hyperProfile + " " + styles.standard, role: "region", "aria-label": "User Profile" },
      React.createElement("div", { className: styles.loadingContainer },
        React.createElement(HyperSkeleton, { count: 3 })
      ),
      wizardElement
    );
  }

  // Error state -- in edit mode, offer to switch to demo mode
  if (error) {
    let errorDescription = error.message || "An error occurred loading profile data.";
    if (props.isEditMode) {
      errorDescription = errorDescription + " Try enabling Demo Mode in the property pane to preview the web part.";
    }
    return React.createElement(
      "div",
      { className: styles.hyperProfile + " " + styles.standard, role: "region", "aria-label": "User Profile" },
      React.createElement(HyperEmptyState, {
        iconName: "Error",
        title: "Unable to load profile",
        description: errorDescription,
        actionLabel: props.isEditMode ? "Enable Demo Mode" : undefined,
        onAction: props.isEditMode ? function (): void {
          store.setDemoMode(true);
          if (props.onDemoModeChange) {
            props.onDemoModeChange(true);
          }
        } : undefined,
      }),
      wizardElement
    );
  }

  // No profile
  if (!profile) {
    let emptyDescription = "Could not find user profile data.";
    if (props.isEditMode) {
      emptyDescription = "No profile data available. Enable Demo Mode to preview with sample data.";
    }
    return React.createElement(
      "div",
      { className: styles.hyperProfile + " " + styles.standard, role: "region", "aria-label": "User Profile" },
      React.createElement(HyperEmptyState, {
        iconName: "Contact",
        title: "No profile found",
        description: emptyDescription,
        actionLabel: props.isEditMode ? "Enable Demo Mode" : undefined,
        onAction: props.isEditMode ? function (): void {
          store.setDemoMode(true);
          if (props.onDemoModeChange) {
            props.onDemoModeChange(true);
          }
        } : undefined,
      }),
      wizardElement
    );
  }

  // Build template props -- in demo mode, enable all features so sample data is visible
  const templateProps: IProfileTemplateProps = {
    profile: profile,
    manager: manager || undefined,
    photoUrl: photoUrl || undefined,
    presence: presence,
    skills: skills,
    badges: badges,
    personal: personal,
    orgTree: orgTree,
    calendar: calendar,
    showPresence: isDemoMode || (props.showPresence !== false),
    showStatusMessage: isDemoMode || (props.showStatusMessage !== false),
    showSkills: isDemoMode || (props.showSkills !== false && store.showSkills),
    showBadges: isDemoMode || (props.showBadges !== false && store.showBadges),
    showHobbies: isDemoMode || (props.showHobbies !== false && store.showHobbies),
    showSlogan: isDemoMode || (props.showSlogan !== false && store.showSlogan),
    showWebsites: isDemoMode || (props.showWebsites !== false && store.showWebsites),
    showInterests: isDemoMode || (props.showInterests !== false),
    showFunFacts: isDemoMode || (props.showFunFacts !== false),
    showEducation: isDemoMode || (props.showEducation !== false && store.showEducation),
    showOrgChart: isDemoMode || (props.showOrgChart !== false && store.showOrgChart),
    showManager: isDemoMode || (props.showManager !== false),
    showDirectReports: isDemoMode || (props.showDirectReports !== false),
    showCalendar: isDemoMode || (props.showCalendar !== false && store.showCalendar),
    showQuickActions: isDemoMode || (props.showQuickActions !== false),
    showCompletenessScore: isDemoMode || (props.showCompletenessScore === true),
    showEndorsements: isDemoMode || (props.showEndorsements !== false),
    showBadgeDescriptions: isDemoMode || (props.showBadgeDescriptions !== false),
    skillDisplayStyle: props.skillDisplayStyle || "tags",
    enabledActions: isDemoMode
      ? ["email", "teams_chat", "teams_call", "schedule"]
      : (props.enabledActions || []),
    accentColor: store.accentColor || props.accentColor || "#0078d4",
    photoShape: store.photoShape || props.photoShape || "circle",
    headerConfig: store.headerConfig || {
      style: props.headerStyle || "gradient",
      primaryColor: props.headerPrimaryColor || "#0078d4",
      secondaryColor: props.headerSecondaryColor || "#106ebe",
      imageUrl: props.headerImageUrl,
      patternId: props.headerPatternId,
      height: props.headerHeight,
    },
    animation: store.currentAnimation || props.animation || "none",
    onActionClick: function (actionId: string): void {
      // Action click handler -- placeholder
      const _used = actionId.length > 0;
      if (_used) { /* consumed */ }
    },
    onSkillClick: function (skillName: string): void {
      // Skill click handler -- placeholder
      const _used = skillName.length > 0;
      if (_used) { /* consumed */ }
    },
    onOrgNodeClick: function (nodeId: string): void {
      store.setExpandedOrgNode(nodeId);
    },
    onFlip: function (): void {
      store.triggerFlip();
    },
    instanceId: props.instanceId,
  };

  // Get the template component
  const TemplateComponent = getTemplateComponent(templateId);
  const templateEl = React.createElement(TemplateComponent, templateProps);

  // Yellow sample data banner when useSampleData prop is active
  var sampleBanner: React.ReactElement | undefined;
  if (props.useSampleData && isDemoMode) {
    sampleBanner = React.createElement("div", {
      style: {
        background: "#fff4ce",
        border: "1px solid #ffb900",
        borderRadius: "4px",
        padding: "8px 12px",
        marginBottom: "8px",
        fontSize: "13px",
        color: "#323130",
      },
      role: "status",
    }, "Sample data active \u2014 connect a real data source in the property pane.");
  }

  // In demo mode, wrap with demo bar above the template
  if (isDemoMode) {
    var demoContent = React.createElement("div", { className: styles.demoWrapper },
      sampleBanner,
      React.createElement(HyperProfileDemoBar, {
        selectedPersonId: demoPersonId,
        selectedTemplateId: templateId,
        onPersonChange: function (id: DemoPersonId): void { store.setDemoPersonId(id); },
        onTemplateChange: function (id: TemplateType): void { store.setSelectedTemplate(id); },
        onExitDemo: function (): void {
          store.setDemoMode(false);
          if (props.onDemoModeChange) {
            props.onDemoModeChange(false);
          }
        },
      }),
      templateEl,
      wizardElement
    );

    return React.createElement(HyperEditOverlay, {
      wpName: "HyperProfile",
      isVisible: !!props.isEditMode,
      onWizardClick: function () { setWizardOpen(true); },
      onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
    }, demoContent);
  }

  var mainContent = React.createElement(React.Fragment, undefined, templateEl, wizardElement);

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperProfile",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

const HyperProfile: React.FC<IHyperProfileComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperProfileInner, props)
  );
};

export default HyperProfile;
