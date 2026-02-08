import * as React from "react";
import type { ISliderVideoConfig } from "../../models";
import styles from "./VideoLayer.module.scss";

export interface IVideoLayerProps {
  config: ISliderVideoConfig;
}

/**
 * Extract YouTube video ID from various URL formats.
 * Handles youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID.
 */
function extractYouTubeId(url: string): string {
  // Check for youtu.be short URL
  const shortIdx = url.indexOf("youtu.be/");
  if (shortIdx !== -1) {
    const afterSlash = url.substring(shortIdx + 9);
    const qIdx = afterSlash.indexOf("?");
    return qIdx !== -1 ? afterSlash.substring(0, qIdx) : afterSlash;
  }

  // Check for embed URL
  const embedIdx = url.indexOf("/embed/");
  if (embedIdx !== -1) {
    const afterEmbed = url.substring(embedIdx + 7);
    const qIdx = afterEmbed.indexOf("?");
    return qIdx !== -1 ? afterEmbed.substring(0, qIdx) : afterEmbed;
  }

  // Check for watch?v= parameter
  const vIdx = url.indexOf("v=");
  if (vIdx !== -1) {
    const afterV = url.substring(vIdx + 2);
    const ampIdx = afterV.indexOf("&");
    return ampIdx !== -1 ? afterV.substring(0, ampIdx) : afterV;
  }

  return url;
}

/**
 * Extract Vimeo video ID from URL.
 * Handles vimeo.com/ID and player.vimeo.com/video/ID.
 */
function extractVimeoId(url: string): string {
  // Check for player embed URL
  const playerIdx = url.indexOf("/video/");
  if (playerIdx !== -1) {
    const afterVideo = url.substring(playerIdx + 7);
    const qIdx = afterVideo.indexOf("?");
    return qIdx !== -1 ? afterVideo.substring(0, qIdx) : afterVideo;
  }

  // Standard vimeo.com/ID format — get last path segment
  const parts = url.replace(/\/$/, "").split("/");
  const lastPart = parts[parts.length - 1];
  const qIdx = lastPart.indexOf("?");
  return qIdx !== -1 ? lastPart.substring(0, qIdx) : lastPart;
}

const VideoLayer: React.FC<IVideoLayerProps> = function (props) {
  const { config } = props;

  if (config.source === "mp4") {
    const videoProps: Record<string, unknown> = {
      src: config.url,
      style: { width: "100%", height: "100%", objectFit: "cover" } as React.CSSProperties,
    };
    if (config.autoplay) {
      videoProps.autoPlay = true;
    }
    if (config.loop) {
      videoProps.loop = true;
    }
    if (config.muted) {
      videoProps.muted = true;
    }
    if (config.controls) {
      videoProps.controls = true;
    }
    if (config.posterUrl) {
      videoProps.poster = config.posterUrl;
    }

    return React.createElement(
      "div",
      { className: styles.videoLayer },
      React.createElement("video", videoProps)
    );
  }

  if (config.source === "youtube") {
    const videoId = extractYouTubeId(config.url);
    const params: string[] = [];
    if (config.autoplay) {
      params.push("autoplay=1");
    }
    if (config.muted) {
      params.push("mute=1");
    }
    if (config.loop) {
      params.push("loop=1");
      params.push("playlist=" + videoId);
    }
    if (!config.controls) {
      params.push("controls=0");
    }
    const embedUrl = "https://www.youtube.com/embed/" + videoId + (params.length > 0 ? "?" + params.join("&") : "");

    return React.createElement(
      "div",
      { className: styles.videoLayer },
      React.createElement("iframe", {
        src: embedUrl,
        allow: "autoplay; encrypted-media",
        allowFullScreen: true,
        title: "YouTube video",
      })
    );
  }

  if (config.source === "vimeo") {
    const videoId = extractVimeoId(config.url);
    const params: string[] = [];
    if (config.autoplay) {
      params.push("autoplay=1");
    }
    if (config.muted) {
      params.push("muted=1");
    }
    if (config.loop) {
      params.push("loop=1");
    }
    const embedUrl = "https://player.vimeo.com/video/" + videoId + (params.length > 0 ? "?" + params.join("&") : "");

    return React.createElement(
      "div",
      { className: styles.videoLayer },
      React.createElement("iframe", {
        src: embedUrl,
        allow: "autoplay; encrypted-media; fullscreen",
        allowFullScreen: true,
        title: "Vimeo video",
      })
    );
  }

  // Fallback for unsupported source types (e.g., "stream")
  return React.createElement(
    "div",
    { className: styles.videoLayer },
    React.createElement("iframe", {
      src: config.url,
      allow: "autoplay; encrypted-media",
      allowFullScreen: true,
      title: "Video",
    })
  );
};

export default VideoLayer;
