import * as React from "react";
import * as strings from "HyperBirthdaysWebPartStrings";
import type { IHyperBirthdaysWebPartProps, CelebrationType, BirthdaysViewMode } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
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
import HyperBirthdaysAnimation from "./HyperBirthdaysAnimation";
import styles from "./HyperBirthdays.module.scss";

export interface IHyperBirthdaysComponentProps extends IHyperBirthdaysWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onWizardApply?: (result: Partial<IHyperBirthdaysWebPartProps>) => void;
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

  // Auto-open wizard on first load when not yet configured
  React.useEffect(function () {
    if (props.showWizardOnInit) {
      openWizard();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    props.enablePrivacyOptOut, props.optOutListName, props.showWizardOnInit,
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

  const celebrationData = useCelebrationData({
    enableEntraId: props.enableEntraId,
    enableSpList: props.enableSpList,
    spListName: props.spListName || "",
    enabledTypes: enabledTypes,
    maxItems: props.maxItems || 50,
    cacheDuration: props.cacheDuration || 300,
  });

  const privacyOptOut = usePrivacyOptOut(
    props.enablePrivacyOptOut,
    props.optOutListName || ""
  );

  const visibleCelebrations = props.enablePrivacyOptOut
    ? privacyOptOut.filterOptedOut(celebrationData.celebrations)
    : celebrationData.celebrations;

  // Photos
  const photoMap = useCelebrationPhotos(visibleCelebrations, props.photoSize || 48);

  // Check if any celebrations are today (for animation)
  const hasTodayCelebrations = React.useMemo(function () {
    let found = false;
    visibleCelebrations.forEach(function (c) {
      if (isToday(c.celebrationDate)) {
        found = true;
      }
    });
    return found;
  }, [visibleCelebrations]);

  // Filter by time range for list/carousel views
  const upcomingCelebrations = React.useMemo(function () {
    return getUpcomingCelebrations(visibleCelebrations, props.timeRange || "thisMonth");
  }, [visibleCelebrations, props.timeRange]);

  const isLoading = celebrationData.loading || privacyOptOut.loading;

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

  if (visibleCelebrations.length === 0) {
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
  const handleViewModeChange = function (mode: BirthdaysViewMode): void {
    setViewMode(mode);
  };

  // Render the active view
  let viewContent: React.ReactNode;

  if (viewMode === "monthlyCalendar") {
    viewContent = React.createElement(HyperBirthdaysMonthCalendar, {
      celebrations: visibleCelebrations,
      photoMap: photoMap,
      photoSize: props.photoSize || 48,
      year: currentYear,
      month: currentMonth,
      enableTeamsDeepLink: props.enableTeamsDeepLink,
      enableMilestoneBadges: props.enableMilestoneBadges,
      sendWishesLabel: strings.SendWishesLabel,
      onSelectCelebration: selectCelebration,
    });
  } else if (viewMode === "cardCarousel") {
    viewContent = React.createElement(HyperBirthdaysCardCarousel, {
      celebrations: upcomingCelebrations,
      photoMap: photoMap,
      photoSize: props.photoSize || 48,
      enableTeamsDeepLink: props.enableTeamsDeepLink,
      enableMilestoneBadges: props.enableMilestoneBadges,
      sendWishesLabel: strings.SendWishesLabel,
      onSelectCelebration: selectCelebration,
    });
  } else {
    // upcomingList (default)
    viewContent = React.createElement(HyperBirthdaysUpcomingList, {
      celebrations: upcomingCelebrations,
      photoMap: photoMap,
      photoSize: props.photoSize || 48,
      enableTeamsDeepLink: props.enableTeamsDeepLink,
      enableMilestoneBadges: props.enableMilestoneBadges,
      sendWishesLabel: strings.SendWishesLabel,
      todayLabel: strings.TodayLabel,
      thisWeekLabel: strings.ThisWeekLabel,
      thisMonthLabel: strings.ThisMonthLabel,
      onSelectCelebration: selectCelebration,
    });
  }

  // Animation overlay (only for today's celebrations)
  const animationOverlay = props.enableAnimations && hasTodayCelebrations
    ? React.createElement(HyperBirthdaysAnimation, {
        animationType: props.animationType || "confetti",
        enabled: true,
      })
    : undefined;

  return React.createElement(
    "div",
    { className: styles.birthdaysContainer },
    animationOverlay,
    React.createElement(HyperBirthdaysToolbar, {
      title: props.title || "Celebrations",
      viewMode: viewMode,
      onViewModeChange: handleViewModeChange,
      currentMonth: currentMonth,
      currentYear: currentYear,
      onNavigateMonth: navigateMonth,
      showMonthNav: viewMode === "monthlyCalendar",
      isEditMode: props.isEditMode,
      onConfigure: handleConfigureClick,
    }),
    viewContent,
    wizardElement
  );
};

const HyperBirthdays: React.FC<IHyperBirthdaysComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperBirthdaysInner, props)
  );
};

export default HyperBirthdays;
