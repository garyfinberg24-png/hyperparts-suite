import * as React from "react";
import * as strings from "HyperBirthdaysWebPartStrings";
import type { IHyperBirthdaysWebPartProps, CelebrationType, BirthdaysViewMode, ICelebration, AnimationType } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton, HyperEditOverlay } from "../../../common/components";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { useCelebrationData } from "../hooks/useCelebrationData";
import { useCelebrationPhotos } from "../hooks/useCelebrationPhotos";
import { usePrivacyOptOut } from "../hooks/usePrivacyOptOut";
import { useHyperBirthdaysStore } from "../store/useHyperBirthdaysStore";
import { isToday } from "../utils/dateHelpers";
import { getUpcomingCelebrations } from "../utils/celebrationUtils";
import { BIRTHDAYS_WIZARD_CONFIG, buildStateFromProps } from "./wizard/birthdaysWizardConfig";
import HyperBirthdaysToolbar from "./HyperBirthdaysToolbar";
import HyperBirthdaysUpcomingList from "./HyperBirthdaysUpcomingList";
import HyperBirthdaysMonthCalendar from "./HyperBirthdaysMonthCalendar";
import HyperBirthdaysCardCarousel from "./HyperBirthdaysCardCarousel";
import HyperBirthdaysTimeline from "./HyperBirthdaysTimeline";
import HyperBirthdaysFeaturedSpotlight from "./HyperBirthdaysFeaturedSpotlight";
import HyperBirthdaysMasonryWall from "./HyperBirthdaysMasonryWall";
import HyperBirthdaysCompactStrip from "./HyperBirthdaysCompactStrip";
import HyperBirthdaysCardGrid from "./HyperBirthdaysCardGrid";
import HyperBirthdaysAnimation from "./HyperBirthdaysAnimation";
import HyperBirthdaysGreetingCard from "./HyperBirthdaysGreetingCard";
import HyperBirthdaysSelfService from "./HyperBirthdaysSelfService";
import { getShiftedDate } from "../utils/weekendShift";
import { getNextOccurrence } from "../utils/dateHelpers";
import { SAMPLE_CELEBRATIONS } from "../utils/sampleData";
import HyperBirthdaysDemoBar from "./HyperBirthdaysDemoBar";
import styles from "./HyperBirthdays.module.scss";

export interface IHyperBirthdaysComponentProps extends IHyperBirthdaysWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onWizardApply?: (result: Partial<IHyperBirthdaysWebPartProps>) => void;
  onConfigure?: () => void;
}

const HyperBirthdaysInner: React.FC<IHyperBirthdaysComponentProps> = function (props) {
  const enabledTypes = useHyperBirthdaysStore(function (s) { return s.enabledTypes; });
  const setEnabledTypes = useHyperBirthdaysStore(function (s) { return s.setEnabledTypes; });
  const viewMode = useHyperBirthdaysStore(function (s) { return s.viewMode; });
  const setViewMode = useHyperBirthdaysStore(function (s) { return s.setViewMode; });
  const currentMonth = useHyperBirthdaysStore(function (s) { return s.currentMonth; });
  const currentYear = useHyperBirthdaysStore(function (s) { return s.currentYear; });
  const navigateMonth = useHyperBirthdaysStore(function (s) { return s.navigateMonth; });
  const selectCelebration = useHyperBirthdaysStore(function (s) { return s.selectCelebration; });
  const isWizardOpen = useHyperBirthdaysStore(function (s) { return s.isWizardOpen; });
  const openWizard = useHyperBirthdaysStore(function (s) { return s.openWizard; });
  const closeWizard = useHyperBirthdaysStore(function (s) { return s.closeWizard; });
  const isGreetingCardOpen = useHyperBirthdaysStore(function (s) { return s.isGreetingCardOpen; });
  const greetingCardCelebrationId = useHyperBirthdaysStore(function (s) { return s.greetingCardCelebrationId; });
  const openGreetingCard = useHyperBirthdaysStore(function (s) { return s.openGreetingCard; });
  const closeGreetingCard = useHyperBirthdaysStore(function (s) { return s.closeGreetingCard; });
  const isSelfServiceOpen = useHyperBirthdaysStore(function (s) { return s.isSelfServiceOpen; });
  const openSelfService = useHyperBirthdaysStore(function (s) { return s.openSelfService; });
  const closeSelfService = useHyperBirthdaysStore(function (s) { return s.closeSelfService; });

  // ── Demo mode local overrides ──
  var demoViewState = React.useState<BirthdaysViewMode>(props.viewMode || "upcomingList");
  var demoView = demoViewState[0];
  var setDemoView = demoViewState[1];

  var demoAnimationState = React.useState<AnimationType>(props.animationType || "confetti");
  var demoAnimation = demoAnimationState[0];
  var setDemoAnimation = demoAnimationState[1];

  var demoEnabledTypesState = React.useState<CelebrationType[]>(function () {
    var types: CelebrationType[] = [];
    if (props.enableBirthdays) types.push("birthday");
    if (props.enableAnniversaries) types.push("workAnniversary");
    if (props.enableWeddings) types.push("wedding");
    if (props.enableChildBirth) types.push("childBirth");
    if (props.enableGraduation) types.push("graduation");
    if (props.enableRetirement) types.push("retirement");
    if (props.enablePromotion) types.push("promotion");
    if (props.enableCustom) types.push("custom");
    return types;
  });
  var demoEnabledTypes = demoEnabledTypesState[0];
  var setDemoEnabledTypes = demoEnabledTypesState[1];

  var demoAnimationsEnabledState = React.useState(props.enableAnimations !== false);
  var demoAnimationsEnabled = demoAnimationsEnabledState[0];
  var setDemoAnimationsEnabled = demoAnimationsEnabledState[1];

  var demoMilestoneBadgesState = React.useState(props.enableMilestoneBadges !== false);
  var demoMilestoneBadges = demoMilestoneBadgesState[0];
  var setDemoMilestoneBadges = demoMilestoneBadgesState[1];

  // Demo type toggle handler (multi-select)
  var handleDemoTypeToggle = React.useCallback(function (type: CelebrationType): void {
    setDemoEnabledTypes(function (prev: CelebrationType[]): CelebrationType[] {
      if (prev.indexOf(type) !== -1) {
        return prev.filter(function (t) { return t !== type; });
      }
      return prev.concat([type]);
    });
  }, []);

  // Active values: demo overrides when demo mode is on, otherwise prop/store values
  var activeViewMode = props.enableDemoMode ? demoView : viewMode;
  var activeAnimation = props.enableDemoMode ? demoAnimation : (props.animationType || "confetti");
  var activeAnimationsEnabled = props.enableDemoMode ? demoAnimationsEnabled : props.enableAnimations;
  var activeMilestoneBadges = props.enableDemoMode ? demoMilestoneBadges : props.enableMilestoneBadges;

  // Auto-open wizard on first load when not yet configured
  React.useEffect(function () {
    if (props.isEditMode && !props.wizardCompleted) {
      openWizard();
    }
  }, [props.isEditMode, props.wizardCompleted]);

  // Build wizard state override from current props (for re-editing)
  var wizardStateOverride = React.useMemo(function () {
    return buildStateFromProps(props);
  }, [
    props.enableBirthdays, props.enableAnniversaries, props.enableWeddings,
    props.enableChildBirth, props.enableGraduation, props.enableRetirement,
    props.enablePromotion, props.enableCustom, props.enableEntraId,
    props.enableSpList, props.spListName, props.viewMode, props.timeRange,
    props.maxItems, props.photoSize, props.enableTeamsDeepLink,
    props.enableAnimations, props.animationType, props.enableMilestoneBadges,
    props.enablePrivacyOptOut, props.optOutListName, props.wizardCompleted,
  ]);

  // Handle wizard apply
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperBirthdaysWebPartProps>): void {
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
    closeWizard();
  }, [props.onWizardApply, closeWizard]);

  // Handle configure button click
  var handleConfigureClick = React.useCallback(function (): void {
    openWizard();
  }, [openWizard]);

  // Build enabled types from props on first render
  const hasInitRef = React.useRef<boolean>(false);
  React.useEffect(function () {
    if (hasInitRef.current) return;
    hasInitRef.current = true;

    const types: CelebrationType[] = [];
    if (props.enableBirthdays) types.push("birthday");
    if (props.enableAnniversaries) types.push("workAnniversary");
    if (props.enableWeddings) types.push("wedding");
    if (props.enableChildBirth) types.push("childBirth");
    if (props.enableGraduation) types.push("graduation");
    if (props.enableRetirement) types.push("retirement");
    if (props.enablePromotion) types.push("promotion");
    if (props.enableCustom) types.push("custom");
    setEnabledTypes(types);

    // Set initial view mode from props
    if (props.viewMode) {
      setViewMode(props.viewMode);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Data source: sample data or live API
  var useSample = props.useSampleData === true;

  const celebrationData = useCelebrationData({
    enableEntraId: useSample ? false : props.enableEntraId,
    enableSpList: useSample ? false : props.enableSpList,
    spListName: useSample ? "" : (props.spListName || ""),
    enabledTypes: enabledTypes,
    maxItems: props.maxItems || 50,
    cacheDuration: props.cacheDuration || 300,
  });

  const privacyOptOut = usePrivacyOptOut(
    useSample ? false : props.enablePrivacyOptOut,
    props.optOutListName || ""
  );

  var liveCelebrations = props.enablePrivacyOptOut && !useSample
    ? privacyOptOut.filterOptedOut(celebrationData.celebrations)
    : celebrationData.celebrations;

  const visibleCelebrations = useSample ? SAMPLE_CELEBRATIONS : liveCelebrations;

  // Weekend shift: adjust dates for celebrations on weekends
  const displayCelebrations = React.useMemo(function () {
    if (!props.enableWeekendShift) return visibleCelebrations;
    return visibleCelebrations.map(function (c) {
      var nextDate = getNextOccurrence(c.celebrationDate);
      if (!nextDate) return c;
      var shifted = getShiftedDate(nextDate);
      if (shifted.getTime() === nextDate.getTime()) return c;
      // Create a copy with the shifted MM-DD
      var shiftedMm = String(shifted.getMonth() + 1);
      if (shiftedMm.length === 1) shiftedMm = "0" + shiftedMm;
      var shiftedDd = String(shifted.getDate());
      if (shiftedDd.length === 1) shiftedDd = "0" + shiftedDd;
      return Object.assign({}, c, {
        celebrationDate: shiftedMm + "-" + shiftedDd,
        weekendShifted: true,
      });
    });
  }, [visibleCelebrations, props.enableWeekendShift]);

  // Photos
  const photoMap = useCelebrationPhotos(displayCelebrations, props.photoSize || 48);

  // Check if any celebrations are today (for animation)
  const hasTodayCelebrations = React.useMemo(function () {
    let found = false;
    displayCelebrations.forEach(function (c) {
      if (isToday(c.celebrationDate)) {
        found = true;
      }
    });
    return found;
  }, [displayCelebrations]);

  // Filter by time range for list/carousel views, then limit to displayCount
  var displayLimit = props.maxItems || 50;
  const upcomingCelebrations = React.useMemo(function () {
    var upcoming = getUpcomingCelebrations(displayCelebrations, props.timeRange || "thisMonth");
    if (displayLimit > 0 && upcoming.length > displayLimit) {
      return upcoming.slice(0, displayLimit);
    }
    return upcoming;
  }, [displayCelebrations, props.timeRange, displayLimit]);

  const isLoading = !useSample && (celebrationData.loading || privacyOptOut.loading);

  // Wizard element — rendered in ALL code paths
  var wizardElement = React.createElement(HyperWizard, {
    config: BIRTHDAYS_WIZARD_CONFIG,
    isOpen: isWizardOpen,
    onClose: closeWizard,
    onApply: handleWizardApply,
    initialStateOverride: wizardStateOverride,
  });

  if (isLoading) {
    return React.createElement(
      "div",
      { className: styles.birthdaysContainer },
      React.createElement(HyperSkeleton, { count: 4, height: 64 }),
      wizardElement
    );
  }

  if (displayCelebrations.length === 0) {
    return React.createElement(
      "div",
      { className: styles.birthdaysContainer },
      React.createElement(HyperEmptyState, {
        iconName: "BirthdayCake",
        title: strings.NoCelebrationsTitle,
        description: strings.NoCelebrationsDescription,
      }),
      props.isEditMode
        ? React.createElement("div", { style: { textAlign: "center", marginTop: "12px" } },
            React.createElement("button", {
              onClick: handleConfigureClick,
              style: {
                padding: "8px 20px",
                border: "1px solid #0078d4",
                borderRadius: "4px",
                background: "#0078d4",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600" as "600",
                cursor: "pointer",
              },
            }, "\u2699\uFE0F Configure")
          )
        : undefined,
      wizardElement
    );
  }

  // View mode handler
  var handleViewModeChange = function (mode: BirthdaysViewMode): void {
    setViewMode(mode);
  };

  // Handler: select celebration — opens greeting card if enabled, otherwise just selects
  var handleSelectCelebration = React.useCallback(function (id: string): void {
    selectCelebration(id);
    if (props.enableGreetingCard) {
      openGreetingCard(id);
    }
  }, [selectCelebration, openGreetingCard, props.enableGreetingCard]);

  // Find the celebration for the greeting card modal
  var greetingCardCelebration = React.useMemo(function () {
    if (!greetingCardCelebrationId) return undefined;
    var found: ICelebration | undefined;
    displayCelebrations.forEach(function (c) {
      if (c.id === greetingCardCelebrationId) {
        found = c;
      }
    });
    return found;
  }, [greetingCardCelebrationId, displayCelebrations]);

  // Shared props for all layout components
  var sharedLayoutProps = {
    photoMap: photoMap,
    photoSize: props.photoSize || 48,
    enableTeamsDeepLink: props.enableTeamsDeepLink,
    enableMilestoneBadges: activeMilestoneBadges,
    sendWishesLabel: strings.SendWishesLabel,
    onSelectCelebration: handleSelectCelebration,
  };

  // Render the active view
  var viewContent: React.ReactNode;

  if (activeViewMode === "monthlyCalendar") {
    viewContent = React.createElement(HyperBirthdaysMonthCalendar, Object.assign({
      celebrations: displayCelebrations,
      year: currentYear,
      month: currentMonth,
    }, sharedLayoutProps));
  } else if (activeViewMode === "cardCarousel") {
    viewContent = React.createElement(HyperBirthdaysCardCarousel, Object.assign({
      celebrations: upcomingCelebrations,
    }, sharedLayoutProps));
  } else if (activeViewMode === "timeline") {
    viewContent = React.createElement(HyperBirthdaysTimeline, Object.assign({
      celebrations: upcomingCelebrations,
    }, sharedLayoutProps));
  } else if (activeViewMode === "featuredSpotlight") {
    viewContent = React.createElement(HyperBirthdaysFeaturedSpotlight, Object.assign({
      celebrations: upcomingCelebrations,
    }, sharedLayoutProps));
  } else if (activeViewMode === "masonryWall") {
    viewContent = React.createElement(HyperBirthdaysMasonryWall, Object.assign({
      celebrations: upcomingCelebrations,
    }, sharedLayoutProps));
  } else if (activeViewMode === "compactStrip") {
    viewContent = React.createElement(HyperBirthdaysCompactStrip, Object.assign({
      celebrations: upcomingCelebrations,
    }, sharedLayoutProps));
  } else if (activeViewMode === "cardGrid") {
    viewContent = React.createElement(HyperBirthdaysCardGrid, Object.assign({
      celebrations: upcomingCelebrations,
    }, sharedLayoutProps));
  } else {
    // upcomingList (default)
    viewContent = React.createElement(HyperBirthdaysUpcomingList, Object.assign({
      celebrations: upcomingCelebrations,
      todayLabel: strings.TodayLabel,
      thisWeekLabel: strings.ThisWeekLabel,
      thisMonthLabel: strings.ThisMonthLabel,
    }, sharedLayoutProps));
  }

  // Animation overlay (only for today's celebrations)
  var animationOverlay = activeAnimationsEnabled && hasTodayCelebrations
    ? React.createElement(HyperBirthdaysAnimation, {
        animationType: activeAnimation,
        enabled: true,
      })
    : undefined;

  // Greeting card modal
  var greetingCardModal = props.enableGreetingCard && greetingCardCelebration
    ? React.createElement(HyperBirthdaysGreetingCard, {
        celebration: greetingCardCelebration,
        photoUrl: photoMap[greetingCardCelebration.id] || "",
        isOpen: isGreetingCardOpen,
        onClose: closeGreetingCard,
        messageTemplates: props.messageTemplates || "{}",
      })
    : undefined;

  // Self-service modal
  var selfServiceModal = props.enableSelfService
    ? React.createElement(HyperBirthdaysSelfService, {
        isOpen: isSelfServiceOpen,
        onClose: closeSelfService,
        selfServiceListName: props.selfServiceListName || "",
        currentUserEmail: "",  // Populated at runtime from context
        currentUserName: "",   // Populated at runtime from context
      })
    : undefined;

  // Self-service button (shown in toolbar area)
  var selfServiceButton = props.enableSelfService
    ? React.createElement("button", {
        className: (styles as Record<string, string>).selfServiceButton,
        onClick: function () { openSelfService(); },
        type: "button",
        "aria-label": strings.MyDatesLabel,
      }, "\uD83D\uDCC5 " + strings.MyDatesLabel)
    : undefined;

  // Sample data banner
  var sampleBanner = useSample
    ? React.createElement("div", {
        style: {
          background: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "4px",
          padding: "6px 12px",
          marginBottom: "8px",
          fontSize: "12px",
          color: "#856404",
          textAlign: "center" as "center",
        },
      }, "Sample Data Mode \u2014 Showing 20 South African demo celebrations. Disable in web part settings.")
    : undefined;

  // Demo bar (rendered when enableDemoMode is true)
  var demoBarElement = props.enableDemoMode
    ? React.createElement(HyperBirthdaysDemoBar, {
        currentView: demoView,
        currentAnimation: demoAnimation,
        celebrationCount: displayCelebrations.length,
        enabledTypes: demoEnabledTypes,
        animationsEnabled: demoAnimationsEnabled,
        milestoneBadgesEnabled: demoMilestoneBadges,
        onViewChange: function (view: BirthdaysViewMode): void {
          setDemoView(view);
          setViewMode(view);
        },
        onAnimationChange: setDemoAnimation,
        onTypeToggle: handleDemoTypeToggle,
        onAnimationsToggle: function (): void {
          setDemoAnimationsEnabled(function (v: boolean): boolean { return !v; });
        },
        onMilestoneBadgesToggle: function (): void {
          setDemoMilestoneBadges(function (v: boolean): boolean { return !v; });
        },
        onExitDemo: function (): void {
          if (props.onWizardApply) {
            props.onWizardApply({ enableDemoMode: false } as Partial<IHyperBirthdaysWebPartProps>);
          }
        },
      })
    : undefined;

  var mainContent = React.createElement(
    "div",
    { className: styles.birthdaysContainer },
    demoBarElement,
    sampleBanner,
    animationOverlay,
    React.createElement(HyperBirthdaysToolbar, {
      title: props.title || "Celebrations",
      viewMode: activeViewMode,
      onViewModeChange: handleViewModeChange,
      currentMonth: currentMonth,
      currentYear: currentYear,
      onNavigateMonth: navigateMonth,
      showMonthNav: activeViewMode === "monthlyCalendar",
      isEditMode: props.isEditMode,
      onConfigure: handleConfigureClick,
    }),
    selfServiceButton,
    viewContent,
    greetingCardModal,
    selfServiceModal,
    wizardElement
  );

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperBirthdays",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { openWizard(); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

const HyperBirthdays: React.FC<IHyperBirthdaysComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperBirthdaysInner, props)
  );
};

export default HyperBirthdays;
