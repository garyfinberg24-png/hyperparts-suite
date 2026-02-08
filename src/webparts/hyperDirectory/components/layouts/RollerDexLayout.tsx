import * as React from "react";
import type { IDirectoryLayoutProps } from "./GridLayout";
import HyperDirectoryUserCard from "../HyperDirectoryUserCard";
import { useHyperDirectoryStore } from "../../store/useHyperDirectoryStore";
import styles from "./RollerDexLayout.module.scss";

export interface IRollerDexLayoutProps extends IDirectoryLayoutProps {
  visibleCards?: number;
  speed?: number;
}

/**
 * RollerDex 3D Carousel Layout
 *
 * Uses CSS perspective + rotateX + translateZ to create a 3D cylinder effect.
 * Cards are positioned around a vertical cylinder. Mouse wheel and arrow keys
 * rotate the cylinder to bring different cards to the front.
 */
const RollerDexLayoutInner: React.FC<IRollerDexLayoutProps> = function (props) {
  const { users, photoMap, presenceMap, onUserClick, onVCardExport, visibleCards, speed } = props;

  const store = useHyperDirectoryStore();
  const activeIndex = store.rollerDexActiveIndex;
  const containerRef = React.useRef<HTMLDivElement>(
    // eslint-disable-next-line @rushstack/no-new-null
    null
  );
  const autoTimerRef = React.useRef<number | undefined>(undefined);
  const isHoveredRef = React.useRef(false);

  const numVisible = visibleCards || 5;
  const autoSpeed = (speed || 5) * 1000;
  const totalUsers = users.length;

  // Card geometry: angle per card on the cylinder
  const angleStep = 360 / Math.max(numVisible, 3);
  // Radius of the cylinder based on card height
  const radius = 180;

  // Navigate to a specific index
  const goToIndex = React.useCallback(function (index: number): void {
    let normalized = index % totalUsers;
    if (normalized < 0) normalized += totalUsers;
    store.setRollerDexActiveIndex(normalized);
    store.setRollerDexAngle(normalized * angleStep);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalUsers, angleStep]);

  const goNext = React.useCallback(function (): void {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const goPrev = React.useCallback(function (): void {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  // Mouse wheel handler
  React.useEffect(function () {
    const container = containerRef.current;
    if (!container) return undefined;

    function handleWheel(e: WheelEvent): void {
      e.preventDefault();
      if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    return function () { container.removeEventListener("wheel", handleWheel); };
  }, [goNext, goPrev]);

  // Keyboard handler
  const handleKeyDown = React.useCallback(function (e: React.KeyboardEvent): void {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Home") {
      e.preventDefault();
      goToIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goToIndex(totalUsers - 1);
    }
  }, [goNext, goPrev, goToIndex, totalUsers]);

  // Auto-rotation
  React.useEffect(function () {
    if (autoSpeed <= 0) return undefined;

    autoTimerRef.current = window.setInterval(function () {
      if (!isHoveredRef.current) {
        goNext();
      }
    }, autoSpeed);

    return function () {
      if (autoTimerRef.current !== undefined) {
        clearInterval(autoTimerRef.current);
      }
    };
  }, [autoSpeed, goNext]);

  // Hover pause
  const handleMouseEnter = React.useCallback(function (): void {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = React.useCallback(function (): void {
    isHoveredRef.current = false;
  }, []);

  if (totalUsers === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Build card elements positioned around the cylinder
  const cardElements: React.ReactNode[] = [];

  // Show cards around the active index
  const halfVisible = Math.floor(numVisible / 2);
  for (let offset = -halfVisible; offset <= halfVisible; offset++) {
    let userIndex = activeIndex + offset;
    if (userIndex < 0) userIndex += totalUsers;
    if (userIndex >= totalUsers) userIndex -= totalUsers;

    const user = users[userIndex];
    if (!user) continue;

    const angle = offset * angleStep;
    const isActive = offset === 0;

    // 3D transform: rotate on X axis, translate out on Z
    const transform = "rotateX(" + angle + "deg) translateZ(" + radius + "px) translateX(-50%) translateY(-50%)";
    const opacity = 1 - Math.abs(offset) * 0.15;
    const zIndex = numVisible - Math.abs(offset);

    const cardStyle: React.CSSProperties = {
      transform: transform,
      opacity: Math.max(0.3, opacity),
      zIndex: zIndex,
    };

    cardElements.push(
      React.createElement("div", {
        key: user.id + "_" + offset,
        className: styles.rollerDexCard + (isActive ? " " + styles.rollerDexCardActive : ""),
        style: cardStyle,
        onClick: isActive
          ? function () { if (onUserClick) onUserClick(user); }
          : function () { goToIndex(userIndex); },
      },
        React.createElement(HyperDirectoryUserCard, {
          user: user,
          photoUrl: photoMap[user.id],
          presence: presenceMap[user.id],
          cardStyle: isActive ? "detailed" : "standard",
          photoSize: isActive ? "large" : "medium",
          showPresence: props.showPresence,
          showQuickActions: isActive && props.showQuickActions,
          enabledActions: props.enabledActions,
          showPhotoPlaceholder: props.showPhotoPlaceholder,
          onVCardExport: onVCardExport,
        })
      )
    );
  }

  // Navigation dots
  const dots: React.ReactNode[] = [];
  const maxDots = Math.min(totalUsers, 20);
  const dotStep = totalUsers > maxDots ? Math.ceil(totalUsers / maxDots) : 1;
  for (let d = 0; d < totalUsers; d += dotStep) {
    const dotIndex = d;
    const isActiveDot = Math.abs(activeIndex - dotIndex) < dotStep;
    dots.push(React.createElement("button", {
      key: "dot_" + d,
      type: "button",
      className: styles.dot + (isActiveDot ? " " + styles.dotActive : ""),
      onClick: function () { goToIndex(dotIndex); },
      "aria-label": "Go to person " + (dotIndex + 1),
    }));
  }

  return React.createElement("div", {
    ref: containerRef,
    className: styles.rollerDexContainer,
    onKeyDown: handleKeyDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    tabIndex: 0,
    role: "listbox",
    "aria-label": "RollerDex employee directory",
    "aria-roledescription": "3D carousel",
  },
    // Up navigation
    React.createElement("button", {
      type: "button",
      className: styles.navButton + " " + styles.navUp,
      onClick: goPrev,
      "aria-label": "Previous person",
    }, "\u25B2"),

    // The 3D wheel
    React.createElement("div", { className: styles.rollerDexWheel }, cardElements),

    // Down navigation
    React.createElement("button", {
      type: "button",
      className: styles.navButton + " " + styles.navDown,
      onClick: goNext,
      "aria-label": "Next person",
    }, "\u25BC"),

    // Dot navigation
    dots.length > 1 ? React.createElement("div", { className: styles.dotNav }, dots) : undefined
  );
};

export const RollerDexLayout = React.memo(RollerDexLayoutInner);
export default RollerDexLayout;
