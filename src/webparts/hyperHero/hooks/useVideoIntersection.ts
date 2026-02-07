import { useEffect, useRef } from "react";

/**
 * Hook that uses IntersectionObserver to auto-play/pause a video element
 * when it enters or leaves the viewport. This saves bandwidth and CPU.
 */
export function useVideoIntersection(
  autoplay: boolean,
  muted: boolean
): React.RefObject<HTMLVideoElement> {
  // eslint-disable-next-line @rushstack/no-new-null
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoplay) return;

    // Must be muted for autoplay to work in most browsers
    if (muted) {
      video.muted = true;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay blocked — silently ignore
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [autoplay, muted]);

  return videoRef;
}
