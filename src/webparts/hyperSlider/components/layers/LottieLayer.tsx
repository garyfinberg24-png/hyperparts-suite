import * as React from "react";
import type { ISliderLottieConfig } from "../../models";
import styles from "./LottieLayer.module.scss";

export interface ILottieLayerProps {
  config: ISliderLottieConfig;
}

/** Singleton promise for lottie-web dynamic import */
let lottiePromise: Promise<typeof import("lottie-web")> | undefined;

function getLottie(): Promise<typeof import("lottie-web")> {
  if (!lottiePromise) {
    lottiePromise = import(
      /* webpackChunkName: 'hyperslider-lottie' */ "lottie-web"
    );
  }
  return lottiePromise;
}

const LottieLayer: React.FC<ILottieLayerProps> = function (props) {
  const { config } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(function () {
    let cancelled = false;
    let animInstance: { destroy: () => void; setSpeed?: (speed: number) => void } | undefined;

    if (!config.url || !containerRef.current) {
      setLoading(false);
      return;
    }

    getLottie()
      .then(function (lottieModule) {
        if (cancelled || !containerRef.current) {
          return;
        }

        const lottie = lottieModule.default || lottieModule;

        animInstance = (lottie as {
          loadAnimation: (params: {
            container: HTMLDivElement;
            renderer: string;
            loop: boolean;
            autoplay: boolean;
            path: string;
          }) => { destroy: () => void; setSpeed: (speed: number) => void };
        }).loadAnimation({
          container: containerRef.current,
          renderer: config.renderer || "svg",
          loop: config.loop,
          autoplay: config.autoplay,
          path: config.url,
        });

        if (config.speed && config.speed !== 1 && animInstance && animInstance.setSpeed) {
          animInstance.setSpeed(config.speed);
        }

        if (!cancelled) {
          setLoading(false);
        }
      })
      .catch(function () {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return function (): void {
      cancelled = true;
      if (animInstance) {
        animInstance.destroy();
      }
    };
  }, [config.url, config.loop, config.autoplay, config.speed, config.renderer]);

  const children: React.ReactNode[] = [];

  children.push(
    React.createElement("div", {
      key: "container",
      ref: containerRef,
      style: { width: "100%", height: "100%" },
    })
  );

  if (loading) {
    children.push(
      React.createElement("div", {
        key: "loading",
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "14px",
        },
      }, "Loading animation...")
    );
  }

  return React.createElement(
    "div",
    { className: styles.lottieLayer },
    children
  );
};

export default LottieLayer;
