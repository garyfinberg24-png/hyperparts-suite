import { useState, useEffect } from "react";
import type { Breakpoint } from "../models";

export const useResponsive = (containerRef?: React.RefObject<HTMLElement>): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const check = (): void => {
      const width = containerRef?.current?.offsetWidth ?? window.innerWidth;
      if (width < 480) setBreakpoint("mobile");
      else if (width < 768) setBreakpoint("tablet");
      else if (width < 1280) setBreakpoint("desktop");
      else setBreakpoint("widescreen");
    };
    check();
    const observer = new ResizeObserver(check);
    const el = containerRef?.current ?? document.body;
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  return breakpoint;
};
