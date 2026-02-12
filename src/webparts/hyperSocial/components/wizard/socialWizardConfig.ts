import * as React from "react";
import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardStepProps,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperSocialWebPartProps, IHyperSocialWizardState, SocialLayoutMode, SocialSortMode, SocialVisibility } from "../../models";
import { getLayoutDisplayName, getSortDisplayName } from "../../models";

var DEFAULT_STATE: IHyperSocialWizardState = {
  title: "Social Feed",
  listName: "HyperSocial_Posts",
  layoutMode: "feed",
  sortMode: "latest",
  visibility: "everyone",
  postsPerLoad: 10,
  enableReactions: true,
  enableComments: true,
  enableBookmarks: true,
  enableHashtags: true,
  enableMentions: true,
  enableModeration: false,
  moderationThreshold: 3,
  autoHideFlagged: false,
  enableTrendingWidget: true,
};

// Step: Data Source
var DataSourceStep: React.FC<IWizardStepProps<IHyperSocialWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "16px" } },
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Feed Title"),
      React.createElement("input", {
        type: "text",
        value: state.title,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ title: e.target.value }); },
        style: { width: "100%", padding: "8px 12px", border: "1px solid #d0d0d0", borderRadius: 6, fontSize: 14 },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Posts List Name"),
      React.createElement("input", {
        type: "text",
        value: state.listName,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ listName: e.target.value }); },
        style: { width: "100%", padding: "8px 12px", border: "1px solid #d0d0d0", borderRadius: 6, fontSize: 14 },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Default Visibility"),
      React.createElement("select", {
        value: state.visibility,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { onChange({ visibility: e.target.value as SocialVisibility }); },
        style: { width: "100%", padding: "8px 12px", border: "1px solid #d0d0d0", borderRadius: 6, fontSize: 14 },
      },
        React.createElement("option", { value: "everyone" }, "Everyone"),
        React.createElement("option", { value: "department" }, "Department Only"),
        React.createElement("option", { value: "private" }, "Private")
      )
    )
  );
};

// Step: Layout
var LayoutStep: React.FC<IWizardStepProps<IHyperSocialWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var LAYOUTS: Array<{ key: SocialLayoutMode; label: string; desc: string }> = [
    { key: "feed", label: "Feed", desc: "Classic vertical scroll" },
    { key: "grid", label: "Grid", desc: "Multi-column card grid" },
    { key: "compact", label: "Compact", desc: "Dense list view" },
    { key: "wall", label: "Wall", desc: "Full-width large cards" },
  ];

  var SORTS: Array<{ key: SocialSortMode; label: string }> = [
    { key: "latest", label: "Latest" },
    { key: "popular", label: "Most Popular" },
    { key: "trending", label: "Trending" },
  ];

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "20px" } },
    React.createElement("div", undefined,
      React.createElement("div", { style: { fontWeight: 600, marginBottom: 8 } }, "Layout Mode"),
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
        LAYOUTS.map(function (l) {
          var isActive = state.layoutMode === l.key;
          return React.createElement("button", {
            key: l.key,
            type: "button",
            onClick: function () { onChange({ layoutMode: l.key }); },
            style: {
              padding: "12px",
              border: isActive ? "2px solid #0078d4" : "1px solid #d0d0d0",
              borderRadius: 8,
              background: isActive ? "#e3f2fd" : "#fff",
              cursor: "pointer",
              textAlign: "left",
            },
          },
            React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, l.label),
            React.createElement("div", { style: { fontSize: 12, color: "#666", marginTop: 4 } }, l.desc)
          );
        })
      )
    ),
    React.createElement("div", undefined,
      React.createElement("div", { style: { fontWeight: 600, marginBottom: 8 } }, "Default Sort"),
      React.createElement("div", { style: { display: "flex", gap: 8 } },
        SORTS.map(function (s) {
          var isActive = state.sortMode === s.key;
          return React.createElement("button", {
            key: s.key,
            type: "button",
            onClick: function () { onChange({ sortMode: s.key }); },
            style: {
              padding: "8px 16px",
              border: isActive ? "2px solid #0078d4" : "1px solid #d0d0d0",
              borderRadius: 20,
              background: isActive ? "#e3f2fd" : "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
            },
          }, s.label);
        })
      )
    ),
    React.createElement("div", undefined,
      React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Posts Per Load"),
      React.createElement("input", {
        type: "range",
        min: 5,
        max: 50,
        step: 5,
        value: state.postsPerLoad,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ postsPerLoad: parseInt(e.target.value, 10) }); },
        style: { width: "100%" },
      }),
      React.createElement("span", { style: { fontSize: 13, color: "#666" } }, state.postsPerLoad + " posts")
    )
  );
};

// Step: Features
var FeaturesStep: React.FC<IWizardStepProps<IHyperSocialWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var FEATURES: Array<{ key: keyof IHyperSocialWizardState; label: string; desc: string }> = [
    { key: "enableReactions", label: "Reactions", desc: "Like, Love, Celebrate, and 5 more" },
    { key: "enableComments", label: "Comments", desc: "Nested comment threads (2 levels)" },
    { key: "enableBookmarks", label: "Bookmarks", desc: "Save posts for later" },
    { key: "enableHashtags", label: "Hashtags", desc: "Clickable #hashtag links" },
    { key: "enableMentions", label: "@Mentions", desc: "Tag colleagues in posts" },
    { key: "enableTrendingWidget", label: "Trending Widget", desc: "Show trending hashtags sidebar" },
  ];

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px" } },
    FEATURES.map(function (feat) {
      var isOn = !!state[feat.key];
      return React.createElement("label", {
        key: feat.key,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          cursor: "pointer",
        },
      },
        React.createElement("input", {
          type: "checkbox",
          checked: isOn,
          onChange: function () {
            var update: Partial<IHyperSocialWizardState> = {};
            (update as Record<string, unknown>)[feat.key] = !isOn;
            onChange(update);
          },
          style: { width: 18, height: 18 },
        }),
        React.createElement("div", undefined,
          React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, feat.label),
          React.createElement("div", { style: { fontSize: 12, color: "#666" } }, feat.desc)
        )
      );
    })
  );
};

// Step: Moderation
var ModerationStep: React.FC<IWizardStepProps<IHyperSocialWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  return React.createElement("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: "16px" } },
    React.createElement("label", {
      style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: 8, cursor: "pointer" },
    },
      React.createElement("input", {
        type: "checkbox",
        checked: state.enableModeration,
        onChange: function () { onChange({ enableModeration: !state.enableModeration }); },
        style: { width: 18, height: 18 },
      }),
      React.createElement("div", undefined,
        React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, "Enable Content Moderation"),
        React.createElement("div", { style: { fontSize: 12, color: "#666" } }, "Allow users to flag inappropriate content")
      )
    ),
    state.enableModeration
      ? React.createElement("div", { style: { paddingLeft: 12, display: "flex", flexDirection: "column", gap: 12 } },
          React.createElement("div", undefined,
            React.createElement("label", { style: { display: "block", fontWeight: 600, marginBottom: 4 } }, "Flag Threshold"),
            React.createElement("input", {
              type: "range",
              min: 1,
              max: 10,
              step: 1,
              value: state.moderationThreshold,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange({ moderationThreshold: parseInt(e.target.value, 10) }); },
              style: { width: "100%" },
            }),
            React.createElement("span", { style: { fontSize: 13, color: "#666" } }, state.moderationThreshold + " flags to trigger review")
          ),
          React.createElement("label", {
            style: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },
          },
            React.createElement("input", {
              type: "checkbox",
              checked: state.autoHideFlagged,
              onChange: function () { onChange({ autoHideFlagged: !state.autoHideFlagged }); },
              style: { width: 18, height: 18 },
            }),
            React.createElement("span", { style: { fontSize: 14 } }, "Auto-hide posts exceeding threshold")
          )
        )
      : undefined
  );
};

var steps: Array<IWizardStepDef<IHyperSocialWizardState>> = [
  {
    id: "dataSource",
    label: "Data Source",
    shortLabel: "Source",
    helpText: "Configure where your social feed data lives.",
    component: DataSourceStep,
    validate: function (state: IHyperSocialWizardState): boolean {
      return state.listName.length > 0;
    },
  },
  {
    id: "layout",
    label: "Layout & Display",
    shortLabel: "Layout",
    helpText: "Choose how posts are displayed in the feed.",
    component: LayoutStep,
  },
  {
    id: "features",
    label: "Engagement Features",
    shortLabel: "Features",
    helpText: "Enable social engagement features like reactions, comments, and hashtags.",
    component: FeaturesStep,
  },
  {
    id: "moderation",
    label: "Moderation",
    shortLabel: "Moderation",
    helpText: "Configure content moderation and flagging.",
    component: ModerationStep,
  },
];

function buildResult(state: IHyperSocialWizardState): Partial<IHyperSocialWebPartProps> {
  return {
    title: state.title,
    listName: state.listName,
    layoutMode: state.layoutMode,
    sortMode: state.sortMode,
    visibility: state.visibility,
    postsPerLoad: state.postsPerLoad,
    enableReactions: state.enableReactions,
    enableComments: state.enableComments,
    enableBookmarks: state.enableBookmarks,
    enableHashtags: state.enableHashtags,
    enableMentions: state.enableMentions,
    enableModeration: state.enableModeration,
    moderationThreshold: state.moderationThreshold,
    autoHideFlagged: state.autoHideFlagged,
    enableTrendingWidget: state.enableTrendingWidget,
  };
}

function buildSummary(state: IHyperSocialWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];
  if (state.title.length > 0) {
    rows.push({ label: "Title", value: state.title, type: "text" });
  }
  rows.push({ label: "Layout", value: getLayoutDisplayName(state.layoutMode), type: "badge" });
  rows.push({ label: "Sort", value: getSortDisplayName(state.sortMode), type: "badge" });
  rows.push({ label: "Posts Per Load", value: String(state.postsPerLoad), type: "text" });
  rows.push({ label: "List Name", value: state.listName, type: "mono" });

  var features: string[] = [];
  if (state.enableReactions) features.push("Reactions");
  if (state.enableComments) features.push("Comments");
  if (state.enableBookmarks) features.push("Bookmarks");
  if (state.enableHashtags) features.push("Hashtags");
  if (state.enableMentions) features.push("Mentions");
  if (state.enableTrendingWidget) features.push("Trending");
  rows.push({
    label: "Features",
    value: features.length > 0 ? features.join(", ") : "None",
    type: features.length > 0 ? "badgeGreen" : "text",
  });

  rows.push({
    label: "Moderation",
    value: state.enableModeration ? "Enabled (threshold: " + state.moderationThreshold + ")" : "Disabled",
    type: state.enableModeration ? "badge" : "text",
  });

  return rows;
}

export function buildStateFromProps(props: IHyperSocialWebPartProps): IHyperSocialWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    title: props.title || "",
    listName: props.listName || "HyperSocial_Posts",
    layoutMode: props.layoutMode || "feed",
    sortMode: props.sortMode || "latest",
    visibility: props.visibility || "everyone",
    postsPerLoad: props.postsPerLoad || 10,
    enableReactions: props.enableReactions !== false,
    enableComments: props.enableComments !== false,
    enableBookmarks: props.enableBookmarks !== false,
    enableHashtags: props.enableHashtags !== false,
    enableMentions: props.enableMentions !== false,
    enableModeration: !!props.enableModeration,
    moderationThreshold: props.moderationThreshold || 3,
    autoHideFlagged: !!props.autoHideFlagged,
    enableTrendingWidget: props.enableTrendingWidget !== false,
  };
}

export var SOCIAL_WIZARD_CONFIG: IHyperWizardConfig<IHyperSocialWizardState, Partial<IHyperSocialWebPartProps>> = {
  title: "HyperSocial Setup Wizard",
  welcome: {
    productName: "Social",
    tagline: "A next-generation internal social feed for your organisation",
    features: [
      {
        icon: "\uD83D\uDCAC",
        title: "Rich Social Feed",
        description: "Posts with text, images, video, link previews, hashtags and @mentions",
      },
      {
        icon: "\u2764\uFE0F",
        title: "8 Reaction Types",
        description: "Like, Love, Celebrate, Insightful, Curious, Support, Funny, and Sad",
      },
      {
        icon: "\uD83D\uDDE8\uFE0F",
        title: "Threaded Comments",
        description: "Nested comment threads with replies and reactions",
      },
      {
        icon: "\uD83D\uDEE1\uFE0F",
        title: "Content Moderation",
        description: "Flag, pin, and auto-hide posts with community moderation",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "Posts will be stored in the SharePoint list you configured. Connect additional features in the property pane.",
};
