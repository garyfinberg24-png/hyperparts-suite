import * as React from "react";
import styles from "./HyperSocial.module.scss";
import type { IHyperSocialWebPartProps, ISocialPost, SocialLayoutMode, SocialSortMode } from "../models";
import { REACTION_DEFINITIONS } from "../models";
import { HyperErrorBoundary, HyperEditOverlay } from "../../../common/components";
import { useHyperSocialStore } from "../store/useHyperSocialStore";
import { SAMPLE_POSTS } from "../utils/sampleData";
import WelcomeStep from "./wizard/WelcomeStep";
import HyperSocialDemoBar from "./HyperSocialDemoBar";

export interface IHyperSocialComponentProps extends IHyperSocialWebPartProps {
  instanceId: string;
  isEditMode: boolean;
  onWizardApply: (result: Partial<IHyperSocialWebPartProps>) => void;
  onConfigure: () => void;
}

var HyperSocialInner: React.FC<IHyperSocialComponentProps> = function (props) {
  var isWizardOpen = useHyperSocialStore(function (s) { return s.isWizardOpen; });
  var openWizard = useHyperSocialStore(function (s) { return s.openWizard; });
  var closeWizard = useHyperSocialStore(function (s) { return s.closeWizard; });

  // Demo mode local overrides
  var demoLayoutState = React.useState<SocialLayoutMode>(props.layoutMode || "feed");
  var demoLayout = demoLayoutState[0];
  var setDemoLayout = demoLayoutState[1];

  var demoSortState = React.useState<SocialSortMode>(props.sortMode || "latest");
  var demoSort = demoSortState[0];
  var setDemoSort = demoSortState[1];

  var demoReactionsState = React.useState(props.enableReactions !== false);
  var demoReactions = demoReactionsState[0];
  var setDemoReactions = demoReactionsState[1];

  var demoCommentsState = React.useState(props.enableComments !== false);
  var demoComments = demoCommentsState[0];
  var setDemoComments = demoCommentsState[1];

  var demoHashtagsState = React.useState(props.enableHashtags !== false);
  var demoHashtags = demoHashtagsState[0];
  var setDemoHashtags = demoHashtagsState[1];

  // Active values: demo overrides when demo mode on, else prop values
  var activeLayout = props.enableDemoMode ? demoLayout : props.layoutMode;
  var activeSort = props.enableDemoMode ? demoSort : props.sortMode;
  var activeReactions = props.enableDemoMode ? demoReactions : props.enableReactions;
  var activeComments = props.enableDemoMode ? demoComments : props.enableComments;
  var activeHashtags = props.enableDemoMode ? demoHashtags : props.enableHashtags;

  // Auto-open wizard on first load
  React.useEffect(function () {
    if (!props.isEditMode && !props.wizardCompleted) {
      openWizard();
    }
  }, [props.isEditMode, props.wizardCompleted]);

  // Get posts
  var posts = React.useMemo(function (): ISocialPost[] {
    if (props.useSampleData) {
      return SAMPLE_POSTS;
    }
    return [];
  }, [props.useSampleData]);

  // Sort posts
  var sortedPosts = React.useMemo(function (): ISocialPost[] {
    var sorted = posts.slice(0);
    // Pinned posts always first
    sorted.sort(function (a, b) {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (activeSort === "popular") {
        var aTotal = 0;
        var bTotal = 0;
        REACTION_DEFINITIONS.forEach(function (def) {
          aTotal = aTotal + (a.reactions[def.type] || 0);
          bTotal = bTotal + (b.reactions[def.type] || 0);
        });
        return bTotal - aTotal;
      }
      if (activeSort === "trending") {
        return b.commentCount - a.commentCount;
      }
      // Default: latest
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
    return sorted;
  }, [posts, activeSort]);

  // Time-ago helper
  function timeAgo(dateStr: string): string {
    var now = new Date().getTime();
    var then = new Date(dateStr).getTime();
    var diff = Math.floor((now - then) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
    return Math.floor(diff / 604800) + "w ago";
  }

  // Get initials for avatar
  function getInitials(name: string): string {
    var parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return name.charAt(0);
  }

  // Total reactions for a post
  function getTotalReactions(post: ISocialPost): number {
    var total = 0;
    REACTION_DEFINITIONS.forEach(function (def) {
      total = total + (post.reactions[def.type] || 0);
    });
    return total;
  }

  // Render a single post card
  function renderPostCard(post: ISocialPost): React.ReactElement {
    var cardClass = styles.postCard + (post.isPinned ? " " + styles.postCardPinned : "");
    if (activeLayout === "wall") {
      cardClass = styles.wallCard + (post.isPinned ? " " + styles.postCardPinned : "");
    }

    var badges: React.ReactElement[] = [];
    if (post.isPinned) {
      badges.push(React.createElement("span", { key: "pinned", className: styles.pinnedBadge }, "\uD83D\uDCCC Pinned"));
    }
    if (post.isEdited) {
      badges.push(React.createElement("span", { key: "edited", className: styles.editedBadge }, "Edited"));
    }

    // Process content with hashtags
    var contentParts: React.ReactNode[] = [];
    var contentStr = post.content;
    var hashRegex = /#(\w+)/g;
    var lastIndex = 0;
    var match: RegExpExecArray | undefined; // eslint-disable-line @rushstack/no-new-null
    // eslint-disable-next-line no-cond-assign, @rushstack/no-new-null
    while ((match = hashRegex.exec(contentStr) as RegExpExecArray | undefined) !== undefined) {
      if (match.index > lastIndex) {
        contentParts.push(contentStr.substring(lastIndex, match.index));
      }
      if (activeHashtags) {
        contentParts.push(
          React.createElement("span", { key: "hash-" + match.index, className: styles.hashtag }, "#" + match[1])
        );
      } else {
        contentParts.push("#" + match[1]);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < contentStr.length) {
      contentParts.push(contentStr.substring(lastIndex));
    }

    // Media gallery
    var mediaEl: React.ReactElement | undefined;
    if (post.media.length > 0) {
      var gridClass = styles.mediaGridSingle;
      if (post.media.length === 2) gridClass = styles.mediaGridDouble;
      if (post.media.length >= 3) gridClass = styles.mediaGridTriple;
      var mediaItems = post.media.map(function (m, mi) {
        return React.createElement("div", { key: "media-" + mi, className: styles.mediaItem },
          m.alt || "Image"
        );
      });
      mediaEl = React.createElement("div", { className: gridClass }, mediaItems);
    }

    // Link preview
    var linkEl: React.ReactElement | undefined;
    if (post.linkPreview) {
      var lp = post.linkPreview;
      linkEl = React.createElement("div", { className: styles.linkPreview },
        React.createElement("div", { className: styles.linkPreviewImage }, "Preview"),
        React.createElement("div", { className: styles.linkPreviewContent },
          React.createElement("div", { className: styles.linkPreviewTitle }, lp.title),
          React.createElement("div", { className: styles.linkPreviewDesc }, lp.description),
          React.createElement("div", { className: styles.linkPreviewSite }, lp.siteName)
        )
      );
    }

    // Reactions bar
    var reactionsEl: React.ReactElement | undefined;
    if (activeReactions) {
      var totalReactions = getTotalReactions(post);
      var topReactions: React.ReactElement[] = [];
      REACTION_DEFINITIONS.forEach(function (def) {
        var count = post.reactions[def.type] || 0;
        if (count > 0) {
          var btnClass = post.myReaction === def.type ? styles.reactionBtnActive : styles.reactionBtn;
          topReactions.push(
            React.createElement("button", {
              key: def.type,
              className: btnClass,
              type: "button",
              "aria-label": def.label + " (" + count + ")",
            },
              React.createElement("span", { className: styles.reactionEmoji }, def.emoji),
              React.createElement("span", { className: styles.reactionCount }, String(count))
            )
          );
        }
      });
      if (topReactions.length > 0 || totalReactions > 0) {
        reactionsEl = React.createElement("div", { className: styles.reactionBar }, topReactions);
      }
    }

    // Actions
    var actions = React.createElement("div", { className: styles.postActions },
      activeComments
        ? React.createElement("button", { className: styles.actionBtn, type: "button" },
            "\uD83D\uDCAC " + post.commentCount + " Comments"
          )
        : undefined,
      React.createElement("button", {
        className: post.isBookmarked ? styles.actionBtnActive : styles.actionBtn,
        type: "button",
      }, "\uD83D\uDD16 Bookmark"),
      React.createElement("button", { className: styles.actionBtn, type: "button" }, "\u21A9 Share")
    );

    return React.createElement("div", { key: post.id, className: cardClass },
      // Header
      React.createElement("div", { className: styles.postHeader },
        React.createElement("div", { className: styles.authorAvatar }, getInitials(post.author.displayName)),
        React.createElement("div", { className: styles.authorInfo },
          React.createElement("div", { className: styles.authorName }, post.author.displayName),
          React.createElement("div", { className: styles.authorMeta },
            post.author.jobTitle + " \u00B7 " + timeAgo(post.created)
          )
        ),
        badges.length > 0
          ? React.createElement("div", undefined, badges)
          : undefined
      ),
      // Content
      React.createElement("div", { className: styles.postContent }, contentParts),
      // Media
      mediaEl,
      // Link preview
      linkEl,
      // Reactions
      reactionsEl,
      // Actions
      actions
    );
  }

  // Render compact row
  function renderCompactRow(post: ISocialPost): React.ReactElement {
    return React.createElement("div", { key: post.id, className: styles.compactPostRow },
      React.createElement("div", { className: styles.authorAvatar, style: { width: 28, height: 28, fontSize: 10 } },
        getInitials(post.author.displayName)
      ),
      React.createElement("span", { className: styles.compactAuthor }, post.author.displayName),
      React.createElement("span", { className: styles.compactContent }, post.content),
      React.createElement("span", { className: styles.compactStats },
        React.createElement("span", undefined, getTotalReactions(post) + " reactions"),
        React.createElement("span", undefined, post.commentCount + " comments")
      )
    );
  }

  // Build children array
  var children: React.ReactElement[] = [];

  // Wizard
  if (isWizardOpen) {
    children.push(
      React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: function (result) {
          props.onWizardApply(result);
          closeWizard();
        },
        currentProps: props.wizardCompleted ? (props as any) : undefined, // eslint-disable-line @typescript-eslint/no-explicit-any
      })
    );
  }

  // Edit overlay
  if (props.isEditMode && props.wizardCompleted) {
    children.push(
      React.createElement(HyperEditOverlay, {
        key: "edit-overlay",
        wpName: "HyperSocial",
        onWizardClick: openWizard,
        onEditClick: props.onConfigure,
        isVisible: true,
      })
    );
  }

  // Demo bar
  if (props.enableDemoMode) {
    children.push(
      React.createElement(HyperSocialDemoBar, {
        key: "demo",
        currentLayout: demoLayout,
        currentSort: demoSort,
        postCount: sortedPosts.length,
        reactionsEnabled: demoReactions,
        commentsEnabled: demoComments,
        hashtagsEnabled: demoHashtags,
        onLayoutChange: setDemoLayout,
        onSortChange: setDemoSort,
        onReactionsToggle: function () { setDemoReactions(function (prev: boolean) { return !prev; }); },
        onCommentsToggle: function () { setDemoComments(function (prev: boolean) { return !prev; }); },
        onHashtagsToggle: function () { setDemoHashtags(function (prev: boolean) { return !prev; }); },
        onExitDemo: props.onConfigure,
      })
    );
  }

  // Sample data banner
  if (props.useSampleData) {
    children.push(
      React.createElement("div", { key: "sample-banner", className: styles.sampleBanner },
        "\u26A0\uFE0F Sample data active \u2014 connect a SharePoint list in the property pane."
      )
    );
  }

  // Empty state
  if (sortedPosts.length === 0) {
    children.push(
      React.createElement("div", { key: "empty", className: styles.emptyState },
        React.createElement("div", { className: styles.emptyIcon }, "\uD83D\uDCAC"),
        React.createElement("div", { className: styles.emptyTitle }, "No Posts Yet"),
        React.createElement("div", { className: styles.emptyDesc },
          "Be the first to share something with your team."
        )
      )
    );
    return React.createElement("div", { className: styles.hyperSocial }, children);
  }

  // Render posts by layout
  var postElements: React.ReactElement[];
  if (activeLayout === "compact") {
    postElements = sortedPosts.map(function (post) { return renderCompactRow(post); });
    children.push(React.createElement("div", { key: "posts", className: styles.compactContainer }, postElements));
  } else if (activeLayout === "grid") {
    postElements = sortedPosts.map(function (post) { return renderPostCard(post); });
    children.push(React.createElement("div", { key: "posts", className: styles.gridContainer }, postElements));
  } else if (activeLayout === "wall") {
    postElements = sortedPosts.map(function (post) { return renderPostCard(post); });
    children.push(React.createElement("div", { key: "posts", className: styles.wallContainer }, postElements));
  } else {
    // Feed (default)
    postElements = sortedPosts.map(function (post) { return renderPostCard(post); });
    children.push(React.createElement("div", { key: "posts", className: styles.feedContainer }, postElements));
  }

  return React.createElement("div", { className: styles.hyperSocial }, children);
};

var HyperSocial: React.FC<IHyperSocialComponentProps> = function (props) {
  return React.createElement(HyperErrorBoundary, undefined,
    React.createElement(HyperSocialInner, props)
  );
};

export default HyperSocial;
