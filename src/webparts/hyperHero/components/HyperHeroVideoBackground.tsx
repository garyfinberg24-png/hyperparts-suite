import * as React from "react";
import type { IHyperHeroVideoConfig } from "../models";
import { useVideoIntersection } from "../hooks/useVideoIntersection";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroVideoBackgroundProps {
  config: IHyperHeroVideoConfig;
}

function buildEmbedUrl(config: IHyperHeroVideoConfig): string | undefined {
  const params: string[] = [];

  if (config.source === "youtube") {
    const videoId = extractYoutubeId(config.url);
    if (!videoId) return undefined;

    if (config.autoplay) params.push("autoplay=1");
    if (config.muted) params.push("mute=1");
    if (config.loop) params.push("loop=1&playlist=" + videoId);
    params.push("controls=0");
    params.push("modestbranding=1");
    params.push("rel=0");

    return "https://www.youtube.com/embed/" + videoId + "?" + params.join("&");
  }

  if (config.source === "vimeo") {
    const videoId = extractVimeoId(config.url);
    if (!videoId) return undefined;

    if (config.autoplay) params.push("autoplay=1");
    if (config.muted) params.push("muted=1");
    if (config.loop) params.push("loop=1");
    params.push("background=1");
    params.push("byline=0");
    params.push("title=0");

    return "https://player.vimeo.com/video/" + videoId + "?" + params.join("&");
  }

  return undefined;
}

function extractYoutubeId(url: string): string | undefined {
  const shortMatch = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(url);
  if (shortMatch) return shortMatch[1];

  const longMatch = /[?&]v=([a-zA-Z0-9_-]{11})/.exec(url);
  if (longMatch) return longMatch[1];

  const embedMatch = /\/embed\/([a-zA-Z0-9_-]{11})/.exec(url);
  if (embedMatch) return embedMatch[1];

  return undefined;
}

function extractVimeoId(url: string): string | undefined {
  const match = /vimeo\.com\/(\d+)/.exec(url);
  return match ? match[1] : undefined;
}

/** Native <video> for MP4 / Stream URLs */
const Mp4Video: React.FC<{ config: IHyperHeroVideoConfig }> = (props) => {
  const { config } = props;
  const videoRef = useVideoIntersection(config.autoplay, config.muted);

  return React.createElement(
    "div",
    { className: styles.backgroundVideo, "aria-hidden": "true" },
    React.createElement("video", {
      ref: videoRef,
      src: config.url,
      poster: config.posterUrl,
      loop: config.loop,
      muted: config.muted,
      playsInline: true,
      preload: "metadata",
    })
  );
};

/** Embedded <iframe> for YouTube / Vimeo */
const EmbedVideo: React.FC<{ config: IHyperHeroVideoConfig }> = (props) => {
  const { config } = props;
  const embedUrl = buildEmbedUrl(config);

  if (!embedUrl) return React.createElement(React.Fragment);

  return React.createElement(
    "div",
    { className: styles.backgroundVideo, "aria-hidden": "true" },
    React.createElement("iframe", {
      src: embedUrl,
      allow: "autoplay; encrypted-media",
      allowFullScreen: true,
      title: "Video background",
      loading: "lazy",
    })
  );
};

const HyperHeroVideoBackgroundInner: React.FC<IHyperHeroVideoBackgroundProps> = (props) => {
  const { config } = props;

  if (config.source === "mp4" || config.source === "stream") {
    return React.createElement(Mp4Video, { config: config });
  }

  if (config.source === "youtube" || config.source === "vimeo") {
    return React.createElement(EmbedVideo, { config: config });
  }

  return React.createElement(React.Fragment);
};

export const HyperHeroVideoBackground = React.memo(HyperHeroVideoBackgroundInner);
