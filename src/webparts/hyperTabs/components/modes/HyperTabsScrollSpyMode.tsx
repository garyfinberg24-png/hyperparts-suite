import * as React from "react";
import { useRef, useEffect, useCallback } from "react";
import type { IHyperTabPanel } from "../../models";
import HyperTabsIcon from "../HyperTabsIcon";
import HyperTabsPanelContent from "../HyperTabsPanelContent";
import styles from "./HyperTabsScrollSpyMode.module.scss";

export interface IHyperTabsScrollSpyModeProps {
  panels: IHyperTabPanel[];
  enableLazyLoading: boolean;
  animationEnabled: boolean;
  nestingDepth: number;
}

var HyperTabsScrollSpyMode: React.FC<IHyperTabsScrollSpyModeProps> = function (props) {
  var panels = props.panels;
  var enableLazyLoading = props.enableLazyLoading;
  var animationEnabled = props.animationEnabled;
  var nestingDepth = props.nestingDepth;

  var activeSectionState = React.useState(panels.length > 0 ? panels[0].id : "");
  var activeSection = activeSectionState[0];
  var setActiveSection = activeSectionState[1];

  // eslint-disable-next-line @rushstack/no-new-null
  var contentRef = useRef<HTMLDivElement>(null);

  // Scroll handler — find which section is in view
  var handleScroll = useCallback(function (): void {
    if (!contentRef.current) return;
    var container = contentRef.current;
    var scrollTop = container.scrollTop;
    var found = "";

    for (var i = 0; i < panels.length; i++) {
      var sectionEl = container.querySelector("[data-section-id=\"" + panels[i].id + "\"]") as HTMLElement | undefined;
      if (sectionEl) {
        var offsetTop = sectionEl.offsetTop - container.offsetTop;
        if (scrollTop >= offsetTop - 50) {
          found = panels[i].id;
        }
      }
    }

    if (found && found !== activeSection) {
      setActiveSection(found);
    }
  }, [panels, activeSection]);

  useEffect(function () {
    var el = contentRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return function () { if (el) { el.removeEventListener("scroll", handleScroll); } };
  }, [handleScroll]);

  var handleNavClick = useCallback(function (panelId: string): void {
    if (!contentRef.current) return;
    var sectionEl = contentRef.current.querySelector("[data-section-id=\"" + panelId + "\"]") as HTMLElement | undefined;
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(panelId);
  }, []);

  // Build sidebar nav items
  var navItems: React.ReactNode[] = [];
  navItems.push(
    React.createElement("div", {
      key: "nav-label",
      className: styles.navLabel,
    }, "On this page")
  );

  panels.forEach(function (panel) {
    var isActive = panel.id === activeSection;
    var navClass = styles.navItem + (isActive ? " " + styles.navItemActive : "");
    var navChildren: React.ReactNode[] = [];
    if (panel.icon) {
      navChildren.push(React.createElement(HyperTabsIcon, { key: "icon", icon: panel.icon, className: styles.navIcon }));
    }
    navChildren.push(React.createElement("span", { key: "label" }, panel.title));

    navItems.push(
      React.createElement("button", {
        key: panel.id,
        className: navClass,
        onClick: function () { handleNavClick(panel.id); },
        type: "button",
        "aria-current": isActive ? "true" : undefined,
      }, navChildren)
    );
  });

  // Build content sections
  var sections: React.ReactNode[] = [];
  panels.forEach(function (panel) {
    var isActive = panel.id === activeSection;
    sections.push(
      React.createElement("div", {
        key: panel.id,
        className: styles.section + (isActive ? " " + styles.sectionActive : ""),
        "data-section-id": panel.id,
      },
        React.createElement(HyperTabsPanelContent, {
          panel: panel,
          isActive: true,
          enableLazyLoading: enableLazyLoading,
          nestingDepth: nestingDepth,
          animationEnabled: animationEnabled,
        })
      )
    );
  });

  return React.createElement("div", { className: styles.scrollSpyContainer },
    React.createElement("nav", {
      className: styles.sidebar,
      "aria-label": "Page sections",
    }, navItems),
    React.createElement("div", {
      ref: contentRef,
      className: styles.content,
    }, sections)
  );
};

export default React.memo(HyperTabsScrollSpyMode);
