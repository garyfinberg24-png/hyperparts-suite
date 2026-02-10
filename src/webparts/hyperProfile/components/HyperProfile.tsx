import * as React from "react";
import type { IHyperProfileWebPartProps } from "../models";
import type { IProfileTemplateProps } from "./templates/IProfileTemplateProps";
import type { TemplateType } from "../models/IHyperProfileTemplate";
import type { IProfileSkill } from "../models/IHyperProfileSkill";
import type { IProfileBadge } from "../models/IHyperProfileBadge";
import type { IProfilePersonal } from "../models/IHyperProfilePersonal";
import type { IProfileOrgNode } from "../models/IHyperProfileOrgNode";
import type { ICalendarDay } from "../models/IHyperProfileCalendar";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperSkeleton } from "../../../common/components";
import { HyperEmptyState } from "../../../common/components";
import { useProfileData } from "../hooks/useProfileData";
import { usePresence } from "../hooks/usePresence";
import { useHyperProfileStore } from "../store/useHyperProfileStore";
import { getSamplePerson } from "../utils/sampleData";
import { getTemplateComponent } from "./templates";
import HyperProfileDemoBar from "./HyperProfileDemoBar";
import styles from "./HyperProfile.module.scss";

export interface IHyperProfileComponentProps extends IHyperProfileWebPartProps {
  instanceId: string;
}

const HyperProfileInner: React.FC<IHyperProfileComponentProps> = function (props) {
  const store = useHyperProfileStore();

  // Determine template
  const templateId: TemplateType = props.selectedTemplate || store.selectedTemplateId || "standard";

  // Demo mode data
  const isDemoMode = store.isDemoMode || props.enableDemoMode;
  const demoPersonId = store.demoPersonId || props.demoPersonId || "sarah";
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
      )
    );
  }

  // Error state
  if (error) {
    return React.createElement(
      "div",
      { className: styles.hyperProfile + " " + styles.standard, role: "region", "aria-label": "User Profile" },
      React.createElement(HyperEmptyState, {
        iconName: "Error",
        title: "Unable to load profile",
        description: error.message,
      })
    );
  }

  // No profile
  if (!profile) {
    return React.createElement(
      "div",
      { className: styles.hyperProfile + " " + styles.standard, role: "region", "aria-label": "User Profile" },
      React.createElement(HyperEmptyState, {
        iconName: "Contact",
        title: "No profile found",
        description: "Could not find user profile data.",
      })
    );
  }

  // Build template props — in demo mode, enable all features so sample data is visible
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
    onActionClick: function (actionId: string) {
      // eslint-disable-next-line no-void
      void actionId;
    },
    onSkillClick: function (skillName: string) {
      // eslint-disable-next-line no-void
      void skillName;
    },
    onOrgNodeClick: function (nodeId: string) {
      store.setExpandedOrgNode(nodeId);
    },
    onFlip: function () {
      store.triggerFlip();
    },
    instanceId: props.instanceId,
  };

  // Get the template component
  const TemplateComponent = getTemplateComponent(templateId);
  const templateEl = React.createElement(TemplateComponent, templateProps);

  // In demo mode, wrap with demo bar above the template
  if (isDemoMode) {
    return React.createElement("div", { className: styles.demoWrapper },
      React.createElement(HyperProfileDemoBar, {
        selectedPersonId: demoPersonId,
        selectedTemplateId: templateId,
        onPersonChange: function (id) { store.setDemoPersonId(id); },
        onTemplateChange: function (id) { store.setSelectedTemplate(id); },
        onExitDemo: function () { store.setDemoMode(false); },
      }),
      templateEl
    );
  }

  return templateEl;
};

const HyperProfile: React.FC<IHyperProfileComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperProfileInner, props)
  );
};

export default HyperProfile;
