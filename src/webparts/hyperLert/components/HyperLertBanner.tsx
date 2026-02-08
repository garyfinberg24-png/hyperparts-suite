import * as React from "react";
import type { AlertSeverity } from "../models";
import { useHyperLertStore } from "../store/useHyperLertStore";
import type { IActiveBanner } from "../store/useHyperLertStore";
import styles from "./HyperLertBanner.module.scss";

export interface IHyperLertBannerProps {
  maxBanners: number;
}

function getBannerClassName(severity: AlertSeverity): string {
  switch (severity) {
    case "info": return styles.bannerInfo;
    case "warning": return styles.bannerWarning;
    case "critical": return styles.bannerCritical;
    case "success": return styles.bannerSuccess;
    default: return styles.banner;
  }
}

/** Single banner item — defined before parent component */
interface IBannerItemProps {
  banner: IActiveBanner;
  onDismiss: (bannerId: string) => void;
}

const BannerItem: React.FC<IBannerItemProps> = function (bannerProps) {
  const banner = bannerProps.banner;

  // Auto-dismiss timer
  React.useEffect(function () {
    if (banner.autoDismissMs <= 0) return;
    const timer = window.setTimeout(function () {
      bannerProps.onDismiss(banner.id);
    }, banner.autoDismissMs);
    return function () { window.clearTimeout(timer); };
  }, [banner.id, banner.autoDismissMs, bannerProps.onDismiss]);

  return React.createElement(
    "div",
    {
      className: getBannerClassName(banner.severity),
      role: "alert",
      "aria-live": "assertive",
    },
    React.createElement("span", { className: styles.bannerMessage }, banner.message),
    React.createElement(
      "button",
      {
        className: styles.dismissBtn,
        onClick: function () { bannerProps.onDismiss(banner.id); },
        "aria-label": "Dismiss alert",
        type: "button",
      },
      "\u00D7"
    )
  );
};

const HyperLertBanner: React.FC<IHyperLertBannerProps> = function (props) {
  const activeBanners = useHyperLertStore(function (s) { return s.activeBanners; });
  const removeBanner = useHyperLertStore(function (s) { return s.removeBanner; });

  if (activeBanners.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Show newest first, limited to maxBanners
  const visibleBanners: IActiveBanner[] = [];
  const startIdx = activeBanners.length > props.maxBanners ? activeBanners.length - props.maxBanners : 0;
  for (let i = activeBanners.length - 1; i >= startIdx; i--) {
    visibleBanners.push(activeBanners[i]);
  }

  const bannerElements: React.ReactElement[] = [];
  visibleBanners.forEach(function (banner) {
    bannerElements.push(
      React.createElement(BannerItem, {
        key: banner.id,
        banner: banner,
        onDismiss: removeBanner,
      })
    );
  });

  return React.createElement(
    "div",
    { className: styles.bannerStack },
    bannerElements
  );
};

export default HyperLertBanner;
