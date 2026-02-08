import * as React from "react";
import type { IHyperRollupItem, ViewMode } from "../models";
import { renderTemplate, clearTemplateCache } from "../utils/templateEngine";
import type { ITemplateContext } from "../utils/templateEngine";
import styles from "./HyperRollupTemplateView.module.scss";

export interface IHyperRollupTemplateViewProps {
  items: IHyperRollupItem[];
  templateSource: string;
  viewMode: ViewMode;
}

const HyperRollupTemplateViewInner: React.FC<IHyperRollupTemplateViewProps> = (props) => {
  const { items, templateSource, viewMode } = props;
  const [renderedHtml, setRenderedHtml] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  // Clear compiled cache when template source changes
  const prevTemplateRef = React.useRef<string>(templateSource);
  React.useEffect(function () {
    if (prevTemplateRef.current !== templateSource) {
      clearTemplateCache();
      prevTemplateRef.current = templateSource;
    }
  }, [templateSource]);

  React.useEffect(function () {
    let cancelled = false;

    async function render(): Promise<void> {
      try {
        const total = items.length;
        const fragments: string[] = [];

        for (let i = 0; i < items.length; i++) {
          if (cancelled) return;
          const ctx: ITemplateContext = {
            item: items[i],
            index: i,
            total: total,
            viewMode: viewMode,
          };
          const html = await renderTemplate(templateSource, ctx);
          fragments.push(html);
        }

        if (!cancelled) {
          setRenderedHtml(fragments.join("\n"));
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Template rendering failed");
          setRenderedHtml("");
        }
      }
    }

    render().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  }, [items, templateSource, viewMode]);

  if (error) {
    return React.createElement(
      "div",
      { className: styles.templateError, role: "alert" },
      React.createElement("i", { className: "ms-Icon ms-Icon--Error", "aria-hidden": "true" }),
      React.createElement("span", undefined, "Template error: " + error)
    );
  }

  return React.createElement("div", {
    className: styles.templateContainer,
    dangerouslySetInnerHTML: { __html: renderedHtml },
  });
};

export const HyperRollupTemplateView = React.memo(HyperRollupTemplateViewInner);
