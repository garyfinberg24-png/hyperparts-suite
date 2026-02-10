import * as React from "react";
import type { IVideoPlaylistItem, VideoSourceType } from "../models";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import styles from "./HyperExplorerVideoPlayer.module.scss";

export interface IHyperExplorerVideoPlayerProps {
  siteUrl: string;
  showPlaylist: boolean;
  autoAdvance: boolean;
}

/** Build embed URL for YouTube */
function buildYouTubeUrl(url: string): string {
  var videoId = "";
  // Try v= parameter
  var vIdx = url.indexOf("v=");
  if (vIdx !== -1) {
    videoId = url.substring(vIdx + 2).split("&")[0];
  }
  // Try youtu.be short URL
  if (!videoId) {
    var parts = url.split("/");
    videoId = parts[parts.length - 1].split("?")[0];
  }
  return "https://www.youtube-nocookie.com/embed/" + videoId + "?enablejsapi=1&rel=0";
}

/** Build embed URL for Vimeo */
function buildVimeoUrl(url: string): string {
  var parts = url.split("/");
  var videoId = parts[parts.length - 1].split("?")[0];
  return "https://player.vimeo.com/video/" + videoId + "?dnt=1";
}

/** Build embed URL for Microsoft Stream */
function buildStreamUrl(url: string): string {
  // Stream URLs are used directly in iframe
  if (url.indexOf("/embed/") !== -1) return url;
  return url.replace("/video/", "/embed/video/");
}

/** Get player content based on source type */
function getPlayerElement(item: IVideoPlaylistItem, siteUrl: string): React.ReactNode {
  var videoType: VideoSourceType = item.type;

  switch (videoType) {
    case "youtube":
      return React.createElement("iframe", {
        className: styles.videoIframe,
        src: buildYouTubeUrl(item.url),
        title: item.title,
        allow: "autoplay; encrypted-media; picture-in-picture",
        allowFullScreen: true,
        sandbox: "allow-scripts allow-same-origin allow-popups",
      });

    case "vimeo":
      return React.createElement("iframe", {
        className: styles.videoIframe,
        src: buildVimeoUrl(item.url),
        title: item.title,
        allow: "autoplay; fullscreen; picture-in-picture",
        allowFullScreen: true,
      });

    case "stream":
      return React.createElement("iframe", {
        className: styles.videoIframe,
        src: buildStreamUrl(item.url),
        title: item.title,
        allow: "autoplay; fullscreen",
        allowFullScreen: true,
      });

    case "mp4":
    default: {
      var videoUrl = item.url;
      if (videoUrl.indexOf("http") !== 0 && siteUrl) {
        try {
          var parsed = new URL(siteUrl);
          videoUrl = parsed.origin + videoUrl;
        } catch (_e) {
          videoUrl = siteUrl + videoUrl;
        }
      }
      return React.createElement("video", {
        className: styles.videoElement,
        src: videoUrl,
        controls: true,
        autoPlay: false,
        "aria-label": item.title,
      });
    }
  }
}

var HyperExplorerVideoPlayer: React.FC<IHyperExplorerVideoPlayerProps> = function (props) {
  var playlist = useHyperExplorerStore(function (s) { return s.playlist; });
  var currentVideoIndex = useHyperExplorerStore(function (s) { return s.currentVideoIndex; });
  var playVideoAtIndex = useHyperExplorerStore(function (s) { return s.playVideoAtIndex; });

  var autoAdvanceState = React.useState<boolean>(props.autoAdvance);
  var isAutoAdvance = autoAdvanceState[0];
  var setIsAutoAdvance = autoAdvanceState[1];

  // Auto-advance: listen for video ended event on mp4
  // eslint-disable-next-line @rushstack/no-new-null
  var videoContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(function () {
    if (!isAutoAdvance) return undefined;
    var container = videoContainerRef.current;
    if (!container) return undefined;

    var videoEl = container.querySelector("video");
    if (!videoEl) return undefined;

    var handleEnded = function (): void {
      if (currentVideoIndex < playlist.length - 1) {
        playVideoAtIndex(currentVideoIndex + 1);
      }
    };

    videoEl.addEventListener("ended", handleEnded);
    return function () {
      if (videoEl) {
        videoEl.removeEventListener("ended", handleEnded);
      }
    };
  }, [currentVideoIndex, isAutoAdvance, playlist.length, playVideoAtIndex]);

  if (playlist.length === 0) {
    return React.createElement(React.Fragment);
  }

  var currentItem = playlist[currentVideoIndex] || playlist[0];
  var playerElement = getPlayerElement(currentItem, props.siteUrl);

  // Main children
  var mainChildren: React.ReactNode[] = [];

  // Video container
  mainChildren.push(
    React.createElement("div", {
      key: "container",
      ref: videoContainerRef,
      className: styles.videoContainer,
    }, playerElement)
  );

  // Info bar
  mainChildren.push(
    React.createElement("div", { key: "info", className: styles.videoInfoBar },
      React.createElement("span", { className: styles.videoTitle }, currentItem.title),
      React.createElement("label", { className: styles.videoAutoAdvance },
        React.createElement("input", {
          type: "checkbox",
          className: styles.videoAutoAdvanceCheckbox,
          checked: isAutoAdvance,
          onChange: function () { setIsAutoAdvance(!isAutoAdvance); },
        }),
        "Auto-play next"
      )
    )
  );

  // Top-level children
  var topChildren: React.ReactNode[] = [];

  topChildren.push(
    React.createElement("div", { key: "main", className: styles.videoMain }, mainChildren)
  );

  // Playlist sidebar
  if (props.showPlaylist && playlist.length > 1) {
    var playlistItems = playlist.map(function (item: IVideoPlaylistItem, idx: number) {
      var itemClass = styles.playlistItem;
      if (idx === currentVideoIndex) {
        itemClass = itemClass + " " + styles.playlistItemActive;
      }

      var thumbEl: React.ReactNode;
      if (item.thumbnailUrl) {
        thumbEl = React.createElement("img", {
          className: styles.playlistThumbnail,
          src: item.thumbnailUrl,
          alt: "",
        });
      } else {
        thumbEl = React.createElement("div", {
          className: styles.playlistThumbnailPlaceholder,
        }, "\uD83C\uDFA5");
      }

      var metaChildren: React.ReactNode[] = [];
      metaChildren.push(
        React.createElement("span", { key: "title", className: styles.playlistItemTitle }, item.title)
      );
      if (item.duration) {
        metaChildren.push(
          React.createElement("span", { key: "dur", className: styles.playlistItemDuration }, item.duration)
        );
      }
      if (idx === currentVideoIndex) {
        metaChildren.push(
          React.createElement("span", { key: "now", className: styles.playlistNowPlaying }, "Now Playing")
        );
      }

      return React.createElement("button", {
        key: item.id,
        className: itemClass,
        onClick: function () { playVideoAtIndex(idx); },
        role: "option",
        "aria-selected": idx === currentVideoIndex,
        type: "button",
      },
        thumbEl,
        React.createElement("div", { className: styles.playlistMeta }, metaChildren)
      );
    });

    topChildren.push(
      React.createElement("div", { key: "sidebar", className: styles.playlistSidebar },
        React.createElement("div", { className: styles.playlistHeader },
          "Playlist (" + playlist.length + ")"
        ),
        React.createElement("div", { role: "listbox", "aria-label": "Video playlist" }, playlistItems)
      )
    );
  }

  return React.createElement("div", {
    className: styles.videoPlayer,
    role: "region",
    "aria-label": "Video player - " + currentItem.title,
  }, topChildren);
};

export default HyperExplorerVideoPlayer;
