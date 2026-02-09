import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { INewsWizardState } from "../../models/IHyperNewsWizardState";
import type {
  INewsSource,
  ISpNewsSource,
  ISpListSource,
  IRssFeedSource,
  IGraphRecommendedSource,
  IExternalLinkSource,
  IManualSource,
  SourceType,
  SpNewsMode,
} from "../../models/IHyperNewsSource";
import {
  generateSourceId,
  SOURCE_TYPE_LABELS,
  SOURCE_TYPE_ICONS,
  DEFAULT_RSS_SOURCE,
  DEFAULT_GRAPH_SOURCE,
  DEFAULT_COLUMN_MAPPING,
} from "../../models/IHyperNewsSource";
import type { IExternalArticle } from "../../models/IExternalArticle";
import {
  generateArticleId,
  parseArticles,
  stringifyArticles,
} from "../../models/IExternalArticle";
import { scrapeUrlMetadata } from "../../utils/urlScraper";
import styles from "./WizardSteps.module.scss";

// ============================================================
// SourcesStep — Content source manager (6 types)
// ============================================================

var SOURCE_TYPES: SourceType[] = [
  "spNews", "spList", "externalLink", "manual", "rssFeed", "graphRecommended",
];

var SourcesStep: React.FC<IWizardStepProps<INewsWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var sources = state.sources;

  var [showAddMenu, setShowAddMenu] = React.useState<boolean>(false);
  var [scrapeUrl, setScrapeUrl] = React.useState<string>("");
  var [scrapeLoading, setScrapeLoading] = React.useState<boolean>(false);
  var [scrapeTargetId, setScrapeTargetId] = React.useState<string>("");

  // ── Source CRUD ──

  var handleAddSource = React.useCallback(function (type: SourceType): void {
    var newSource: INewsSource;
    var newId = generateSourceId();

    if (type === "spNews") {
      newSource = {
        id: newId,
        type: "spNews",
        mode: "currentSite" as SpNewsMode,
        siteUrls: [],
        hubSiteId: "",
        libraryName: "Site Pages",
        enabled: true,
      };
    } else if (type === "spList") {
      newSource = {
        id: newId,
        type: "spList",
        siteUrl: "",
        listName: "",
        columnMapping: {
          titleField: DEFAULT_COLUMN_MAPPING.titleField,
          bodyField: DEFAULT_COLUMN_MAPPING.bodyField,
          imageField: DEFAULT_COLUMN_MAPPING.imageField,
          dateField: DEFAULT_COLUMN_MAPPING.dateField,
          authorField: DEFAULT_COLUMN_MAPPING.authorField,
          categoryField: DEFAULT_COLUMN_MAPPING.categoryField,
          linkField: DEFAULT_COLUMN_MAPPING.linkField,
        },
        enabled: true,
      };
    } else if (type === "externalLink") {
      newSource = {
        id: newId,
        type: "externalLink",
        articlesJson: "[]",
        enabled: true,
      };
    } else if (type === "manual") {
      newSource = {
        id: newId,
        type: "manual",
        articlesJson: "[]",
        enabled: true,
      };
    } else if (type === "rssFeed") {
      newSource = {
        id: newId,
        type: "rssFeed",
        feedUrl: "",
        maxItems: DEFAULT_RSS_SOURCE.maxItems,
        pollingIntervalMinutes: DEFAULT_RSS_SOURCE.pollingIntervalMinutes,
        enabled: true,
      };
    } else {
      // graphRecommended
      newSource = {
        id: newId,
        type: "graphRecommended",
        insightType: DEFAULT_GRAPH_SOURCE.insightType,
        maxItems: DEFAULT_GRAPH_SOURCE.maxItems,
        enabled: true,
      };
    }

    var updated = sources.slice();
    updated.push(newSource);
    onChange({ sources: updated });
    setShowAddMenu(false);
  }, [sources, onChange]);

  var handleRemoveSource = React.useCallback(function (sourceId: string): void {
    var updated: INewsSource[] = [];
    sources.forEach(function (s) {
      if (s.id !== sourceId) updated.push(s);
    });
    onChange({ sources: updated });
  }, [sources, onChange]);

  var handleMoveUp = React.useCallback(function (sourceId: string): void {
    var idx = -1;
    sources.forEach(function (s, i) {
      if (s.id === sourceId) idx = i;
    });
    if (idx <= 0) return;
    var updated = sources.slice();
    var temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    onChange({ sources: updated });
  }, [sources, onChange]);

  var handleMoveDown = React.useCallback(function (sourceId: string): void {
    var idx = -1;
    sources.forEach(function (s, i) {
      if (s.id === sourceId) idx = i;
    });
    if (idx === -1 || idx >= sources.length - 1) return;
    var updated = sources.slice();
    var temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    onChange({ sources: updated });
  }, [sources, onChange]);

  // ── Generic source field updater ──
  var updateSource = React.useCallback(function (sourceId: string, partial: Record<string, unknown>): void {
    var updated: INewsSource[] = [];
    sources.forEach(function (s) {
      if (s.id === sourceId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var clone: any = {};
        var keys = Object.keys(s);
        keys.forEach(function (k) {
          clone[k] = (s as unknown as Record<string, unknown>)[k];
        });
        var pKeys = Object.keys(partial);
        pKeys.forEach(function (k) {
          clone[k] = partial[k];
        });
        updated.push(clone as INewsSource);
      } else {
        updated.push(s);
      }
    });
    onChange({ sources: updated });
  }, [sources, onChange]);

  // ── Scrape handler ──
  var handleScrape = React.useCallback(function (sourceId: string, url: string): void {
    if (!url) return;
    setScrapeLoading(true);
    setScrapeTargetId(sourceId);

    scrapeUrlMetadata(url)
      .then(function (article) {
        // Find the source and add the article to its articlesJson
        sources.forEach(function (s) {
          if (s.id === sourceId && s.type === "externalLink") {
            var existing = parseArticles((s as IExternalLinkSource).articlesJson);
            existing.push(article);
            updateSource(sourceId, { articlesJson: stringifyArticles(existing) });
          }
        });
        setScrapeLoading(false);
        setScrapeTargetId("");
        setScrapeUrl("");
      })
      .catch(function () {
        setScrapeLoading(false);
        setScrapeTargetId("");
      });
  }, [sources, updateSource]);

  // ── Render per-source-type body ──
  function renderSourceBody(source: INewsSource): React.ReactElement {
    if (source.type === "spNews") {
      return renderSpNewsBody(source as ISpNewsSource);
    } else if (source.type === "spList") {
      return renderSpListBody(source as ISpListSource);
    } else if (source.type === "externalLink") {
      return renderExternalBody(source as IExternalLinkSource);
    } else if (source.type === "manual") {
      return renderManualBody(source as IManualSource);
    } else if (source.type === "rssFeed") {
      return renderRssBody(source as IRssFeedSource);
    } else {
      return renderGraphBody(source as IGraphRecommendedSource);
    }
  }

  // ── SP News body ──
  function renderSpNewsBody(source: ISpNewsSource): React.ReactElement {
    var modeOptions: Array<{ key: SpNewsMode; label: string }> = [
      { key: "currentSite", label: "This Site" },
      { key: "selectedSites", label: "Select Sites" },
      { key: "hubSites", label: "Hub Sites" },
    ];

    var radioElements: React.ReactElement[] = [];
    modeOptions.forEach(function (opt) {
      var isSelected = source.mode === opt.key;
      radioElements.push(
        React.createElement("label", {
          key: opt.key,
          className: isSelected ? styles.radioOptionSelected : styles.radioOption,
        },
          React.createElement("input", {
            type: "radio",
            name: "spNewsMode-" + source.id,
            className: styles.radioInput,
            checked: isSelected,
            onChange: function () { updateSource(source.id, { mode: opt.key }); },
          }),
          React.createElement("span", { className: styles.radioLabel }, opt.label)
        )
      );
    });

    var extraFields: React.ReactElement[] = [];

    if (source.mode === "selectedSites") {
      extraFields.push(
        React.createElement("div", { key: "sites", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Site URLs (one per line)"),
          React.createElement("textarea", {
            className: styles.textArea,
            value: source.siteUrls.join("\n"),
            onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) {
              var urls = e.target.value.split("\n");
              updateSource(source.id, { siteUrls: urls });
            },
            placeholder: "https://tenant.sharepoint.com/sites/SiteName",
            rows: 3,
          })
        )
      );
    }

    if (source.mode === "hubSites") {
      extraFields.push(
        React.createElement("div", { key: "hub", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Hub Site ID"),
          React.createElement("input", {
            type: "text",
            className: styles.sourceFieldInput,
            value: source.hubSiteId,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              updateSource(source.id, { hubSiteId: e.target.value });
            },
            placeholder: "Hub site GUID",
          })
        )
      );
    }

    extraFields.push(
      React.createElement("div", { key: "lib", className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Library Name"),
        React.createElement("input", {
          type: "text",
          className: styles.sourceFieldInput,
          value: source.libraryName,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            updateSource(source.id, { libraryName: e.target.value });
          },
          placeholder: "Site Pages",
        })
      )
    );

    return React.createElement("div", { className: styles.sourceCardBody },
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Source Scope"),
        React.createElement("div", { className: styles.radioGroup }, radioElements)
      ),
      extraFields
    );
  }

  // ── SP List body ──
  function renderSpListBody(source: ISpListSource): React.ReactElement {
    var mapping = source.columnMapping;
    var mappingFields: Array<{ key: string; label: string; value: string }> = [
      { key: "titleField", label: "Title Column", value: mapping.titleField },
      { key: "bodyField", label: "Body Column", value: mapping.bodyField },
      { key: "imageField", label: "Image Column", value: mapping.imageField },
      { key: "dateField", label: "Date Column", value: mapping.dateField },
      { key: "authorField", label: "Author Column", value: mapping.authorField },
      { key: "categoryField", label: "Category Column", value: mapping.categoryField },
      { key: "linkField", label: "Link Column", value: mapping.linkField },
    ];

    var mappingElements: React.ReactElement[] = [];
    mappingFields.forEach(function (field) {
      mappingElements.push(
        React.createElement("div", { key: field.key, className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, field.label),
          React.createElement("input", {
            type: "text",
            className: styles.sourceFieldInput,
            value: field.value,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              var updatedMapping: Record<string, unknown> = {};
              var mKeys = Object.keys(mapping);
              mKeys.forEach(function (k) {
                updatedMapping[k] = (mapping as unknown as Record<string, unknown>)[k];
              });
              updatedMapping[field.key] = e.target.value;
              updateSource(source.id, { columnMapping: updatedMapping });
            },
            placeholder: field.label,
          })
        )
      );
    });

    return React.createElement("div", { className: styles.sourceCardBody },
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Site URL (leave empty for current site)"),
        React.createElement("input", {
          type: "text",
          className: styles.sourceFieldInput,
          value: source.siteUrl,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            updateSource(source.id, { siteUrl: e.target.value });
          },
          placeholder: "https://tenant.sharepoint.com/sites/SiteName",
        })
      ),
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "List Name"),
        React.createElement("input", {
          type: "text",
          className: styles.sourceFieldInput,
          value: source.listName,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            updateSource(source.id, { listName: e.target.value });
          },
          placeholder: "News Articles",
        })
      ),
      React.createElement("div", { className: styles.stepSectionLabel }, "Column Mapping"),
      React.createElement("div", { className: styles.columnMappingGrid }, mappingElements)
    );
  }

  // ── External Link body ──
  function renderExternalBody(source: IExternalLinkSource): React.ReactElement {
    var articles = parseArticles(source.articlesJson);
    var isScraping = scrapeLoading && scrapeTargetId === source.id;

    var articleList: React.ReactElement[] = [];
    articles.forEach(function (art, idx) {
      articleList.push(
        React.createElement("div", { key: art.id || ("ext-" + String(idx)), className: styles.articleListItem },
          art.imageUrl
            ? React.createElement("img", { src: art.imageUrl, className: styles.scrapePreviewImage, alt: "" })
            : undefined,
          React.createElement("span", { className: styles.articleListTitle }, art.title || art.url),
          React.createElement("button", {
            type: "button",
            className: styles.articleListRemove,
            onClick: function () {
              var updated: IExternalArticle[] = [];
              articles.forEach(function (a, i) {
                if (i !== idx) updated.push(a);
              });
              updateSource(source.id, { articlesJson: stringifyArticles(updated) });
            },
          }, "Remove")
        )
      );
    });

    return React.createElement("div", { className: styles.sourceCardBody },
      React.createElement("div", { className: styles.stepSectionHint },
        "Paste a URL and click Scrape to automatically pull article metadata."
      ),
      React.createElement("div", { className: styles.scrapeRow },
        React.createElement("div", { className: styles.sourceFieldRow, style: { flex: 1 } },
          React.createElement("input", {
            type: "text",
            className: styles.sourceFieldInput,
            value: scrapeTargetId === source.id ? scrapeUrl : "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              setScrapeUrl(e.target.value);
              setScrapeTargetId(source.id);
            },
            placeholder: "https://example.com/article",
            "aria-label": "Article URL to scrape",
          })
        ),
        React.createElement("button", {
          type: "button",
          className: styles.scrapeBtn,
          onClick: function () { handleScrape(source.id, scrapeUrl); },
          disabled: isScraping || !scrapeUrl,
        }, isScraping ? "Scraping..." : "Scrape")
      ),
      articles.length > 0
        ? React.createElement("div", { className: styles.stepSectionLabel },
            articles.length + " article" + (articles.length === 1 ? "" : "s") + " added"
          )
        : undefined,
      articleList
    );
  }

  // ── Manual body ──
  function renderManualBody(source: IManualSource): React.ReactElement {
    var articles = parseArticles(source.articlesJson);

    // Simple inline article editor
    var handleAddManual = function (): void {
      var newArt: IExternalArticle = {
        id: generateArticleId(),
        url: "",
        title: "New Article",
        description: "",
        imageUrl: "",
        author: "",
        publishedDate: new Date().toISOString(),
        category: "",
        sourceLabel: "Manual",
        ctaUrl: "",
        ctaText: "Read More",
        scrapedAt: "",
        publishDate: "",
        unpublishDate: "",
      };
      var updated = articles.slice();
      updated.push(newArt);
      updateSource(source.id, { articlesJson: stringifyArticles(updated) });
    };

    var articleList: React.ReactElement[] = [];
    articles.forEach(function (art, idx) {
      articleList.push(
        React.createElement("div", { key: art.id || ("man-" + String(idx)), className: styles.sourceCard, style: { marginBottom: 8 } },
          React.createElement("div", { className: styles.sourceCardHeader },
            React.createElement("span", { className: styles.sourceCardType }, art.title || "Untitled"),
            React.createElement("button", {
              type: "button",
              className: styles.sourceRemoveBtn,
              onClick: function () {
                var updated: IExternalArticle[] = [];
                articles.forEach(function (a, i) {
                  if (i !== idx) updated.push(a);
                });
                updateSource(source.id, { articlesJson: stringifyArticles(updated) });
              },
            }, "Remove")
          ),
          React.createElement("div", { className: styles.sourceCardBody },
            React.createElement("div", { className: styles.sourceFieldRow },
              React.createElement("label", { className: styles.sourceFieldLabel }, "Title"),
              React.createElement("input", {
                type: "text",
                className: styles.sourceFieldInput,
                value: art.title,
                onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                  var updated = articles.slice();
                  updated[idx] = { id: art.id, url: art.url, title: e.target.value, description: art.description, imageUrl: art.imageUrl, author: art.author, publishedDate: art.publishedDate, category: art.category, sourceLabel: art.sourceLabel, ctaUrl: art.ctaUrl, ctaText: art.ctaText, scrapedAt: art.scrapedAt, publishDate: art.publishDate, unpublishDate: art.unpublishDate };
                  updateSource(source.id, { articlesJson: stringifyArticles(updated) });
                },
              })
            ),
            React.createElement("div", { className: styles.sourceFieldRow },
              React.createElement("label", { className: styles.sourceFieldLabel }, "Description"),
              React.createElement("textarea", {
                className: styles.textArea,
                value: art.description,
                onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) {
                  var updated = articles.slice();
                  updated[idx] = { id: art.id, url: art.url, title: art.title, description: e.target.value, imageUrl: art.imageUrl, author: art.author, publishedDate: art.publishedDate, category: art.category, sourceLabel: art.sourceLabel, ctaUrl: art.ctaUrl, ctaText: art.ctaText, scrapedAt: art.scrapedAt, publishDate: art.publishDate, unpublishDate: art.unpublishDate };
                  updateSource(source.id, { articlesJson: stringifyArticles(updated) });
                },
                rows: 3,
              })
            ),
            React.createElement("div", { className: styles.columnMappingGrid },
              React.createElement("div", { className: styles.sourceFieldRow },
                React.createElement("label", { className: styles.sourceFieldLabel }, "Image URL"),
                React.createElement("input", {
                  type: "text",
                  className: styles.sourceFieldInput,
                  value: art.imageUrl,
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                    var updated = articles.slice();
                    updated[idx] = { id: art.id, url: art.url, title: art.title, description: art.description, imageUrl: e.target.value, author: art.author, publishedDate: art.publishedDate, category: art.category, sourceLabel: art.sourceLabel, ctaUrl: art.ctaUrl, ctaText: art.ctaText, scrapedAt: art.scrapedAt, publishDate: art.publishDate, unpublishDate: art.unpublishDate };
                    updateSource(source.id, { articlesJson: stringifyArticles(updated) });
                  },
                  placeholder: "https://...",
                })
              ),
              React.createElement("div", { className: styles.sourceFieldRow },
                React.createElement("label", { className: styles.sourceFieldLabel }, "Author"),
                React.createElement("input", {
                  type: "text",
                  className: styles.sourceFieldInput,
                  value: art.author,
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                    var updated = articles.slice();
                    updated[idx] = { id: art.id, url: art.url, title: art.title, description: art.description, imageUrl: art.imageUrl, author: e.target.value, publishedDate: art.publishedDate, category: art.category, sourceLabel: art.sourceLabel, ctaUrl: art.ctaUrl, ctaText: art.ctaText, scrapedAt: art.scrapedAt, publishDate: art.publishDate, unpublishDate: art.unpublishDate };
                    updateSource(source.id, { articlesJson: stringifyArticles(updated) });
                  },
                })
              ),
              React.createElement("div", { className: styles.sourceFieldRow },
                React.createElement("label", { className: styles.sourceFieldLabel }, "Category"),
                React.createElement("input", {
                  type: "text",
                  className: styles.sourceFieldInput,
                  value: art.category,
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                    var updated = articles.slice();
                    updated[idx] = { id: art.id, url: art.url, title: art.title, description: art.description, imageUrl: art.imageUrl, author: art.author, publishedDate: art.publishedDate, category: e.target.value, sourceLabel: art.sourceLabel, ctaUrl: art.ctaUrl, ctaText: art.ctaText, scrapedAt: art.scrapedAt, publishDate: art.publishDate, unpublishDate: art.unpublishDate };
                    updateSource(source.id, { articlesJson: stringifyArticles(updated) });
                  },
                })
              ),
              React.createElement("div", { className: styles.sourceFieldRow },
                React.createElement("label", { className: styles.sourceFieldLabel }, "Link URL"),
                React.createElement("input", {
                  type: "text",
                  className: styles.sourceFieldInput,
                  value: art.ctaUrl,
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                    var updated = articles.slice();
                    updated[idx] = { id: art.id, url: art.url, title: art.title, description: art.description, imageUrl: art.imageUrl, author: art.author, publishedDate: art.publishedDate, category: art.category, sourceLabel: art.sourceLabel, ctaUrl: e.target.value, ctaText: art.ctaText, scrapedAt: art.scrapedAt, publishDate: art.publishDate, unpublishDate: art.unpublishDate };
                    updateSource(source.id, { articlesJson: stringifyArticles(updated) });
                  },
                  placeholder: "https://...",
                })
              )
            )
          )
        )
      );
    });

    return React.createElement("div", { className: styles.sourceCardBody },
      React.createElement("div", { className: styles.stepSectionHint },
        "Create custom articles with your own content."
      ),
      React.createElement("button", {
        type: "button",
        className: styles.addSourceBtn,
        onClick: handleAddManual,
      }, "+ Add Article"),
      articleList
    );
  }

  // ── RSS body ──
  function renderRssBody(source: IRssFeedSource): React.ReactElement {
    return React.createElement("div", { className: styles.sourceCardBody },
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Feed URL"),
        React.createElement("input", {
          type: "text",
          className: styles.sourceFieldInput,
          value: source.feedUrl,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            updateSource(source.id, { feedUrl: e.target.value });
          },
          placeholder: "https://example.com/feed.xml",
        })
      ),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("span", { className: styles.sliderLabel }, "Max Items"),
        React.createElement("input", {
          type: "range",
          className: styles.sliderInput,
          min: 5,
          max: 50,
          value: source.maxItems,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            updateSource(source.id, { maxItems: parseInt(e.target.value, 10) });
          },
        }),
        React.createElement("span", { className: styles.sliderValue }, String(source.maxItems))
      ),
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Polling Interval"),
        React.createElement("select", {
          className: styles.sourceFieldSelect,
          value: String(source.pollingIntervalMinutes),
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
            updateSource(source.id, { pollingIntervalMinutes: parseInt(e.target.value, 10) });
          },
        },
          React.createElement("option", { value: "15" }, "Every 15 minutes"),
          React.createElement("option", { value: "30" }, "Every 30 minutes"),
          React.createElement("option", { value: "60" }, "Every hour"),
          React.createElement("option", { value: "120" }, "Every 2 hours"),
          React.createElement("option", { value: "360" }, "Every 6 hours"),
          React.createElement("option", { value: "720" }, "Every 12 hours"),
          React.createElement("option", { value: "1440" }, "Daily")
        )
      )
    );
  }

  // ── Graph body ──
  function renderGraphBody(source: IGraphRecommendedSource): React.ReactElement {
    return React.createElement("div", { className: styles.sourceCardBody },
      React.createElement("div", { className: styles.sourceFieldRow },
        React.createElement("label", { className: styles.sourceFieldLabel }, "Insight Type"),
        React.createElement("select", {
          className: styles.sourceFieldSelect,
          value: source.insightType,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
            updateSource(source.id, { insightType: e.target.value });
          },
        },
          React.createElement("option", { value: "trending" }, "Trending"),
          React.createElement("option", { value: "used" }, "Recently Used"),
          React.createElement("option", { value: "shared" }, "Shared With Me")
        )
      ),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("span", { className: styles.sliderLabel }, "Max Items"),
        React.createElement("input", {
          type: "range",
          className: styles.sliderInput,
          min: 3,
          max: 30,
          value: source.maxItems,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            updateSource(source.id, { maxItems: parseInt(e.target.value, 10) });
          },
        }),
        React.createElement("span", { className: styles.sliderValue }, String(source.maxItems))
      )
    );
  }

  // ── Build source cards ──
  var sourceCards: React.ReactElement[] = [];
  sources.forEach(function (source, idx) {
    sourceCards.push(
      React.createElement("div", { key: source.id, className: styles.sourceCard },
        React.createElement("div", { className: styles.sourceCardHeader },
          React.createElement("span", { className: styles.sourceCardIcon, "aria-hidden": "true" },
            SOURCE_TYPE_ICONS[source.type]
          ),
          React.createElement("span", { className: styles.sourceCardType },
            SOURCE_TYPE_LABELS[source.type]
          ),
          React.createElement("div", { className: styles.sourceCardActions },
            idx > 0
              ? React.createElement("button", {
                  type: "button",
                  className: styles.sourceActionBtn,
                  onClick: function () { handleMoveUp(source.id); },
                  "aria-label": "Move up",
                }, "\u2191")
              : undefined,
            idx < sources.length - 1
              ? React.createElement("button", {
                  type: "button",
                  className: styles.sourceActionBtn,
                  onClick: function () { handleMoveDown(source.id); },
                  "aria-label": "Move down",
                }, "\u2193")
              : undefined,
            React.createElement("button", {
              type: "button",
              className: styles.sourceRemoveBtn,
              onClick: function () { handleRemoveSource(source.id); },
              "aria-label": "Remove source",
            }, "Remove")
          )
        ),
        renderSourceBody(source)
      )
    );
  });

  // ── Add source menu ──
  var addMenuItems: React.ReactElement[] = [];
  SOURCE_TYPES.forEach(function (type) {
    addMenuItems.push(
      React.createElement("button", {
        key: type,
        type: "button",
        className: styles.addSourceMenuItem,
        onClick: function () { handleAddSource(type); },
      },
        React.createElement("span", { className: styles.addSourceMenuIcon, "aria-hidden": "true" },
          SOURCE_TYPE_ICONS[type]
        ),
        SOURCE_TYPE_LABELS[type]
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel },
        "Content Sources (" + String(sources.length) + ")"
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "Add and configure where your news content comes from. Mix multiple source types for a rich, aggregated news feed."
      )
    ),

    // Source list
    sources.length === 0
      ? React.createElement("div", { className: styles.emptySources },
          React.createElement("div", { className: styles.emptySourcesIcon }, "\uD83D\uDCF0"),
          React.createElement("div", { className: styles.emptySourcesText },
            "No sources configured yet. Add a source to get started."
          )
        )
      : React.createElement("div", { className: styles.sourcesList }, sourceCards),

    // Add source button/menu
    React.createElement("div", { className: styles.addSourceArea },
      showAddMenu
        ? React.createElement("div", { className: styles.addSourceMenu }, addMenuItems)
        : React.createElement("button", {
            type: "button",
            className: styles.addSourceBtn,
            onClick: function () { setShowAddMenu(true); },
          }, "+ Add Content Source")
    )
  );
};

export default SourcesStep;
