import * as React from "react";
import styles from "./HyperOnboard.module.scss";
import type { IHyperOnboardWebPartProps, IOnboardTask, IOnboardMilestone, OnboardLayoutMode, OnboardPhase } from "../models";
import { ALL_PHASES, getPhaseDisplayName, getTaskTypeIcon } from "../models";
import { HyperErrorBoundary, HyperEditOverlay } from "../../../common/components";
import { useHyperOnboardStore } from "../store/useHyperOnboardStore";
import { SAMPLE_TASKS, SAMPLE_MILESTONES } from "../utils/sampleData";
import WelcomeStep from "./wizard/WelcomeStep";
import HyperOnboardDemoBar from "./HyperOnboardDemoBar";

export interface IHyperOnboardComponentProps extends IHyperOnboardWebPartProps {
  instanceId: string;
  isEditMode: boolean;
  onWizardApply: (result: Partial<IHyperOnboardWebPartProps>) => void;
  onConfigure: () => void;
}

var HyperOnboardInner: React.FC<IHyperOnboardComponentProps> = function (props) {
  var isWizardOpen = useHyperOnboardStore(function (s) { return s.isWizardOpen; });
  var openWizard = useHyperOnboardStore(function (s) { return s.openWizard; });
  var closeWizard = useHyperOnboardStore(function (s) { return s.closeWizard; });
  var checkInStreak = useHyperOnboardStore(function (s) { return s.checkInStreak; });

  // Demo mode local overrides
  var demoLayoutState = React.useState<OnboardLayoutMode>(props.layoutMode || "dashboard");
  var demoLayout = demoLayoutState[0];
  var setDemoLayout = demoLayoutState[1];

  var demoProgressRingState = React.useState(props.enableProgressRing !== false);
  var demoProgressRing = demoProgressRingState[0];
  var setDemoProgressRing = demoProgressRingState[1];

  var demoMilestonesState = React.useState(props.enableMilestones !== false);
  var demoMilestones = demoMilestonesState[0];
  var setDemoMilestones = demoMilestonesState[1];

  var demoMentorState = React.useState(props.enableMentor !== false);
  var demoMentor = demoMentorState[0];
  var setDemoMentor = demoMentorState[1];

  // Active values
  var activeLayout = props.enableDemoMode ? demoLayout : props.layoutMode;
  var activeProgressRing = props.enableDemoMode ? demoProgressRing : props.enableProgressRing;
  var activeMilestones = props.enableDemoMode ? demoMilestones : props.enableMilestones;
  var activeMentor = props.enableDemoMode ? demoMentor : props.enableMentor;

  // Auto-open wizard on first load
  React.useEffect(function () {
    if (!props.isEditMode && !props.wizardCompleted) {
      openWizard();
    }
  }, [props.isEditMode, props.wizardCompleted]);

  // Get tasks and milestones
  var tasks = React.useMemo(function (): IOnboardTask[] {
    if (props.useSampleData) {
      return SAMPLE_TASKS;
    }
    return [];
  }, [props.useSampleData]);

  var milestones = React.useMemo(function (): IOnboardMilestone[] {
    if (props.useSampleData) {
      return SAMPLE_MILESTONES;
    }
    return [];
  }, [props.useSampleData]);

  // Calculate progress
  var completedCount = React.useMemo(function (): number {
    var count = 0;
    tasks.forEach(function (t) {
      if (t.isCompleted) count = count + 1;
    });
    return count;
  }, [tasks]);

  var totalCount = tasks.length;
  var percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group tasks by phase
  function getTasksForPhase(phase: OnboardPhase): IOnboardTask[] {
    var result: IOnboardTask[] = [];
    tasks.forEach(function (t) {
      if (t.phase === phase) {
        result.push(t);
      }
    });
    result.sort(function (a, b) { return a.order - b.order; });
    return result;
  }

  function getPhaseCompletedCount(phase: OnboardPhase): number {
    var count = 0;
    tasks.forEach(function (t) {
      if (t.phase === phase && t.isCompleted) count = count + 1;
    });
    return count;
  }

  function getPhaseTaskCount(phase: OnboardPhase): number {
    var count = 0;
    tasks.forEach(function (t) {
      if (t.phase === phase) count = count + 1;
    });
    return count;
  }

  // Get priority class
  function getPriorityClass(priority: string): string {
    if (priority === "critical") return styles.priorityCritical;
    if (priority === "high") return styles.priorityHigh;
    if (priority === "low") return styles.priorityLow;
    return styles.priorityNormal;
  }

  // Render progress ring (SVG)
  function renderProgressHero(): React.ReactElement {
    var radius = 50;
    var circumference = 2 * Math.PI * radius;
    var offset = circumference - (percentComplete / 100) * circumference;

    return React.createElement("div", { className: styles.progressHero },
      React.createElement("div", { className: styles.progressRing },
        React.createElement("svg", { className: styles.progressRingSvg, viewBox: "0 0 120 120" },
          React.createElement("circle", { className: styles.progressRingBg, cx: "60", cy: "60", r: String(radius) }),
          React.createElement("circle", {
            className: styles.progressRingFill,
            cx: "60",
            cy: "60",
            r: String(radius),
            strokeDasharray: String(circumference),
            strokeDashoffset: String(offset),
          })
        ),
        React.createElement("div", { className: styles.progressPercent }, percentComplete + "%")
      ),
      React.createElement("div", { className: styles.progressInfo },
        React.createElement("div", { className: styles.progressTitle }, props.title || "Onboarding Journey"),
        React.createElement("div", { className: styles.progressStats },
          React.createElement("span", { className: styles.progressStat }, "\u2705 " + completedCount + " of " + totalCount + " tasks complete"),
          React.createElement("span", { className: styles.streakBadge }, "\uD83D\uDD25 " + checkInStreak + " day streak")
        )
      )
    );
  }

  // Render a single task card
  function renderTaskCard(task: IOnboardTask): React.ReactElement {
    var cardClass = styles.taskCard;
    if (task.isCompleted) cardClass = styles.taskCardCompleted;
    if (task.isLocked) cardClass = styles.taskCardLocked;

    var checkClass = task.isCompleted ? styles.taskCheckboxDone : styles.taskCheckbox;
    var titleClass = task.isCompleted ? styles.taskTitleDone : styles.taskTitle;

    return React.createElement("div", { key: task.id, className: cardClass },
      React.createElement("div", { className: checkClass },
        task.isCompleted ? "\u2713" : ""
      ),
      React.createElement("div", { className: styles.taskBody },
        React.createElement("div", { className: titleClass },
          task.isLocked ? "\uD83D\uDD12 " : "",
          task.title
        ),
        React.createElement("div", { className: styles.taskDesc }, task.description),
        React.createElement("div", { className: styles.taskMeta },
          React.createElement("span", { className: styles.taskTypeBadge },
            getTaskTypeIcon(task.taskType) + " " + task.taskType
          ),
          React.createElement("span", { className: getPriorityClass(task.priority) }, task.priority)
        )
      )
    );
  }

  // Render milestones row
  function renderMilestones(): React.ReactElement {
    var cards = milestones.map(function (m) {
      var cardClass = m.isUnlocked ? styles.milestoneCardUnlocked : styles.milestoneCardLocked;
      return React.createElement("div", { key: m.id, className: cardClass },
        React.createElement("div", { className: styles.milestoneEmoji }, m.badgeEmoji),
        React.createElement("div", { className: styles.milestoneTitle }, m.title),
        React.createElement("div", { className: styles.milestoneDesc }, m.description)
      );
    });
    return React.createElement("div", { className: styles.milestoneRow }, cards);
  }

  // Render mentor card
  function renderMentorCard(): React.ReactElement {
    return React.createElement("div", { className: styles.mentorCard },
      React.createElement("div", { className: styles.mentorAvatar }, "JV"),
      React.createElement("div", { className: styles.mentorInfo },
        React.createElement("div", { className: styles.mentorName }, "James van Rensburg"),
        React.createElement("div", { className: styles.mentorRole }, "VP of Engineering \u00B7 Your Onboarding Buddy")
      ),
      React.createElement("button", { className: styles.mentorBtn, type: "button" }, "\uD83D\uDCAC Chat")
    );
  }

  // Build children array
  var children: React.ReactElement[] = [];

  // Wizard
  if (isWizardOpen) {
    children.push(
      React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: function (result) {
          props.onWizardApply(result);
          closeWizard();
        },
        currentProps: props.wizardCompleted ? (props as any) : undefined, // eslint-disable-line @typescript-eslint/no-explicit-any
      })
    );
  }

  // Edit overlay
  if (props.isEditMode && props.wizardCompleted) {
    children.push(
      React.createElement(HyperEditOverlay, {
        key: "edit-overlay",
        wpName: "HyperOnboard",
        onWizardClick: openWizard,
        onEditClick: props.onConfigure,
        isVisible: true,
      })
    );
  }

  // Demo bar
  if (props.enableDemoMode) {
    children.push(
      React.createElement(HyperOnboardDemoBar, {
        key: "demo",
        currentLayout: demoLayout,
        taskCount: totalCount,
        completedCount: completedCount,
        progressRingEnabled: demoProgressRing,
        milestonesEnabled: demoMilestones,
        mentorEnabled: demoMentor,
        onLayoutChange: setDemoLayout,
        onProgressRingToggle: function () { setDemoProgressRing(function (prev: boolean) { return !prev; }); },
        onMilestonesToggle: function () { setDemoMilestones(function (prev: boolean) { return !prev; }); },
        onMentorToggle: function () { setDemoMentor(function (prev: boolean) { return !prev; }); },
        onExitDemo: props.onConfigure,
      })
    );
  }

  // Sample data banner
  if (props.useSampleData) {
    children.push(
      React.createElement("div", { key: "sample-banner", className: styles.sampleBanner },
        "\u26A0\uFE0F Sample data active \u2014 connect SharePoint lists in the property pane."
      )
    );
  }

  // Empty state
  if (tasks.length === 0) {
    children.push(
      React.createElement("div", { key: "empty", className: styles.emptyState },
        React.createElement("div", { className: styles.emptyIcon }, "\uD83C\uDFAF"),
        React.createElement("div", { className: styles.emptyTitle }, "No Tasks Found"),
        React.createElement("div", { className: styles.emptyDesc },
          "Select a track template or connect a tasks list in the property pane."
        )
      )
    );
    return React.createElement("div", { className: styles.hyperOnboard }, children);
  }

  // Progress hero
  if (activeProgressRing) {
    children.push(React.createElement(React.Fragment, { key: "hero" }, renderProgressHero()));
  }

  // Milestones
  if (activeMilestones && milestones.length > 0) {
    children.push(React.createElement(React.Fragment, { key: "milestones" }, renderMilestones()));
  }

  // Mentor card
  if (activeMentor) {
    children.push(React.createElement(React.Fragment, { key: "mentor" }, renderMentorCard()));
  }

  // Render tasks by layout
  if (activeLayout === "checklist") {
    // Simple checklist grouped by phase
    ALL_PHASES.forEach(function (phase) {
      var phaseTasks = getTasksForPhase(phase);
      if (phaseTasks.length === 0) return;
      var phaseCompleted = getPhaseCompletedCount(phase);
      var phaseTotal = getPhaseTaskCount(phase);
      children.push(
        React.createElement("div", { key: "phase-" + phase, className: styles.phaseSection },
          React.createElement("div", { className: styles.phaseHeader },
            React.createElement("span", { className: styles.phaseLabel }, getPhaseDisplayName(phase)),
            React.createElement("span", { className: styles.phaseProgress }, phaseCompleted + "/" + phaseTotal + " done")
          ),
          React.createElement("div", { className: styles.checklistContainer },
            phaseTasks.map(function (task) { return renderTaskCard(task); })
          )
        )
      );
    });
  } else if (activeLayout === "cards") {
    // Grid of task cards
    var allCards = tasks.map(function (task) { return renderTaskCard(task); });
    children.push(React.createElement("div", { key: "cards", className: styles.gridContainer }, allCards));
  } else if (activeLayout === "timeline") {
    // Horizontal timeline phases
    var phaseColumns: React.ReactElement[] = [];
    ALL_PHASES.forEach(function (phase) {
      var phaseTasks = getTasksForPhase(phase);
      if (phaseTasks.length === 0) return;
      phaseColumns.push(
        React.createElement("div", { key: "tl-" + phase, className: styles.timelinePhase },
          React.createElement("div", { className: styles.phaseHeader },
            React.createElement("span", { className: styles.phaseLabel }, getPhaseDisplayName(phase))
          ),
          React.createElement("div", { className: styles.taskList },
            phaseTasks.map(function (task) { return renderTaskCard(task); })
          )
        )
      );
    });
    children.push(React.createElement("div", { key: "timeline", className: styles.timelineContainer }, phaseColumns));
  } else {
    // Dashboard (default) — phases stacked vertically
    ALL_PHASES.forEach(function (phase) {
      var phaseTasks = getTasksForPhase(phase);
      if (phaseTasks.length === 0) return;
      var phaseCompleted = getPhaseCompletedCount(phase);
      var phaseTotal = getPhaseTaskCount(phase);
      children.push(
        React.createElement("div", { key: "phase-" + phase, className: styles.phaseSection },
          React.createElement("div", { className: styles.phaseHeader },
            React.createElement("span", { className: styles.phaseLabel }, getPhaseDisplayName(phase)),
            React.createElement("span", { className: styles.phaseProgress }, phaseCompleted + "/" + phaseTotal + " done")
          ),
          React.createElement("div", { className: styles.taskList },
            phaseTasks.map(function (task) { return renderTaskCard(task); })
          )
        )
      );
    });
  }

  return React.createElement("div", { className: styles.hyperOnboard }, children);
};

var HyperOnboard: React.FC<IHyperOnboardComponentProps> = function (props) {
  return React.createElement(HyperErrorBoundary, undefined,
    React.createElement(HyperOnboardInner, props)
  );
};

export default HyperOnboard;
