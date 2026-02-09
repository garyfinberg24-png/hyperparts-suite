import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { IBannerSettings } from "../../models";
import { DEFAULT_BANNER_SETTINGS, getTimeSinceHire, getHobbyIcon } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import styles from "./BannerLayout.module.scss";

export interface IBannerLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  bannerSettings?: IBannerSettings;
}

/**
 * BannerLayout — Full-width gradient banner with photo left, details right.
 * Ported from JML renderBannerView. Auto-rotation with pause-on-hover.
 */
const BannerLayout: React.FC<IBannerLayoutProps> = function (props) {
  const settings = props.bannerSettings || DEFAULT_BANNER_SETTINGS;

  const currentIndexRef = React.useRef(0);
  const isHoveredRef = React.useRef(false);
  const timerRef = React.useRef<number | undefined>(undefined);
  const forceUpdate = React.useState(0)[1];

  const handleNext = React.useCallback(function (): void {
    const cur = currentIndexRef.current;
    const max = props.employees.length - 1;
    currentIndexRef.current = cur < max ? cur + 1 : 0;
    forceUpdate(function (n) { return n + 1; });
  }, [props.employees.length, forceUpdate]);

  const handlePrevious = React.useCallback(function (): void {
    const cur = currentIndexRef.current;
    const max = props.employees.length - 1;
    currentIndexRef.current = cur > 0 ? cur - 1 : max;
    forceUpdate(function (n) { return n + 1; });
  }, [props.employees.length, forceUpdate]);

  // Auto-advance
  React.useEffect(function () {
    if (!settings.autoAdvance || props.employees.length <= 1) return undefined;
    const interval = (settings.autoAdvanceInterval || 5) * 1000;
    timerRef.current = window.setInterval(function () {
      if (!isHoveredRef.current || !settings.pauseOnHover) {
        handleNext();
      }
    }, interval);
    return function () {
      if (timerRef.current !== undefined) {
        clearInterval(timerRef.current);
      }
    };
  }, [settings.autoAdvance, settings.autoAdvanceInterval, settings.pauseOnHover, handleNext, props.employees.length]);

  if (props.employees.length === 0) return React.createElement("div", undefined, "No employees");

  const currentIndex = currentIndexRef.current;
  const emp = props.employees[currentIndex];

  // Build children
  const children: React.ReactNode[] = [];

  // Banner header
  children.push(
    React.createElement("div", { key: "header", className: styles.bannerHeader },
      React.createElement("span", { className: styles.bannerHeaderIcon, "aria-hidden": "true" }, "\uD83C\uDF89"),
      " Welcome to the Team!"
    )
  );

  // Banner content (photo left + details right)
  const leftChildren: React.ReactNode[] = [];
  if (props.showProfilePicture) {
    const pic = emp.photoUrl
      ? React.createElement("img", {
          src: emp.photoUrl,
          alt: emp.displayName,
          className: styles.bannerPhoto,
          loading: props.lazyLoadImages ? "lazy" : "eager",
        })
      : React.createElement("div", { className: styles.bannerPhotoPlaceholder },
          emp.displayName.charAt(0)
        );
    leftChildren.push(React.createElement("div", { key: "photo", className: styles.bannerPhotoWrap }, pic));
  }

  const rightChildren: React.ReactNode[] = [];

  // Name + nickname
  if (props.showEmployeeName) {
    rightChildren.push(React.createElement("h2", { key: "name", className: styles.bannerName }, emp.displayName));
  }
  if (emp.nickname) {
    rightChildren.push(React.createElement("div", { key: "nick", className: styles.bannerNickname }, "aka \"" + emp.nickname + "\""));
  }

  // Job info line
  const jobParts: string[] = [];
  if (props.showJobTitle && emp.jobTitle) jobParts.push(emp.jobTitle);
  if (props.showDepartment && emp.department) jobParts.push(emp.department);
  if (jobParts.length > 0) {
    rightChildren.push(React.createElement("div", { key: "job", className: styles.bannerJob }, jobParts.join(" \u2022 ")));
  }

  // Hire date
  if (emp.hireDate) {
    const timeSince = getTimeSinceHire(emp.hireDate);
    if (timeSince) {
      rightChildren.push(
        React.createElement("div", { key: "hire", className: styles.bannerHireDate },
          React.createElement("span", { "aria-hidden": "true" }, "\uD83D\uDCC5"),
          " Joined " + timeSince
        )
      );
    }
  }

  // Personal quote
  if (emp.personalQuote) {
    rightChildren.push(
      React.createElement("div", { key: "quote", className: styles.bannerQuote },
        React.createElement("em", undefined, "\"" + emp.personalQuote + "\"")
      )
    );
  }

  // Hobbies inline
  if (emp.hobbies && emp.hobbies.length > 0) {
    const hobbyTags: React.ReactNode[] = [];
    emp.hobbies.forEach(function (hobby, idx) {
      hobbyTags.push(
        React.createElement("span", { key: idx, className: styles.bannerHobbyTag },
          React.createElement("span", { className: styles.bannerHobbyIcon, "aria-hidden": "true" }, getHobbyIcon(hobby)),
          " " + hobby
        )
      );
    });
    rightChildren.push(
      React.createElement("div", { key: "hobbies", className: styles.bannerHobbies },
        React.createElement("strong", undefined, "Hobbies: "),
        hobbyTags
      )
    );
  }

  // Websites inline
  if (emp.favoriteWebsites && emp.favoriteWebsites.length > 0) {
    const websiteLinks: React.ReactNode[] = [];
    emp.favoriteWebsites.forEach(function (site, idx) {
      websiteLinks.push(
        React.createElement("a", {
          key: idx,
          href: site.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.bannerWebsiteLink,
        }, site.title)
      );
    });
    rightChildren.push(
      React.createElement("div", { key: "websites", className: styles.bannerWebsites },
        React.createElement("strong", undefined, "Favorite Sites: "),
        websiteLinks
      )
    );
  }

  children.push(
    React.createElement("div", { key: "content", className: styles.bannerContent },
      React.createElement("div", { className: styles.bannerLeft }, leftChildren),
      React.createElement("div", { className: styles.bannerRight }, rightChildren)
    )
  );

  // Navigation counter
  if (settings.showNavigationCounter && props.employees.length > 1) {
    children.push(
      React.createElement("div", { key: "nav", className: styles.bannerControls },
        React.createElement("button", {
          className: styles.bannerNavBtn,
          onClick: handlePrevious,
          "aria-label": "Previous employee",
          type: "button",
        }, "\u2039"),
        React.createElement("span", { className: styles.bannerCounter },
          String(currentIndex + 1) + " of " + String(props.employees.length)
        ),
        React.createElement("button", {
          className: styles.bannerNavBtn,
          onClick: handleNext,
          "aria-label": "Next employee",
          type: "button",
        }, "\u203A")
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.bannerContainer,
      onMouseEnter: function () { isHoveredRef.current = true; },
      onMouseLeave: function () { isHoveredRef.current = false; },
      role: "region",
      "aria-label": "Employee spotlight banner",
    },
    children
  );
};

export default BannerLayout;
