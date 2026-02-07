import * as React from "react";
import { useEffect, useRef, useState } from "react";
import type { IHyperHeroLottieConfig } from "../models";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroLottieBackgroundProps {
  config: IHyperHeroLottieConfig;
}

const HyperHeroLottieBackgroundInner: React.FC<IHyperHeroLottieBackgroundProps> = (props) => {
  const { config } = props;
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const animationRef = useRef<unknown>(undefined);

  useEffect(() => {
    if (!config.url || !containerRef.current) return;

    let destroyed = false;

    // Dynamic import of lottie-web light player (~40KB chunk, loaded on demand)
    // eslint-disable-next-line @microsoft/spfx/import-requires-chunk-name
    import(/* webpackChunkName: "lottie-light" */ "lottie-web/build/player/lottie_light")
      .then((lottieModule) => {
        if (destroyed || !containerRef.current) return;

        const lottie = lottieModule.default || lottieModule;
        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: config.renderer === "canvas" ? "canvas" : "svg",
          loop: config.loop,
          autoplay: config.autoplay,
          path: config.url,
        });

        if (config.speed && config.speed !== 1) {
          anim.setSpeed(config.speed);
        }

        animationRef.current = anim;
        setLoaded(true);
      })
      .catch(() => {
        // Lottie failed to load — silently degrade
      });

    return () => {
      destroyed = true;
      if (animationRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (animationRef.current as any).destroy();
        animationRef.current = undefined;
      }
    };
  }, [config.url, config.renderer, config.loop, config.autoplay, config.speed]);

  return React.createElement("div", {
    ref: containerRef,
    className: styles.lottieContainer,
    style: { opacity: loaded ? 1 : 0, transition: "opacity 0.3s" },
    "aria-hidden": "true",
  });
};

export const HyperHeroLottieBackground = React.memo(HyperHeroLottieBackgroundInner);
