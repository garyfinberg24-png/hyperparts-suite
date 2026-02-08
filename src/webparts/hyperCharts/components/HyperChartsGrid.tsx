import * as React from "react";
import styles from "./HyperChartsGrid.module.scss";

export interface IHyperChartsGridProps {
  /** Number of grid columns (1-4) */
  gridColumns: number;
  /** Gap between cells in pixels */
  gridGap: number;
}

const HyperChartsGrid: React.FC<IHyperChartsGridProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [responsiveCols, setResponsiveCols] = React.useState(props.gridColumns);

  // Responsive breakpoints: collapse columns at narrow widths
  React.useEffect(function () {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        const width = entry.contentRect.width;
        if (width < 480) {
          setResponsiveCols(1);
        } else if (width < 768) {
          setResponsiveCols(Math.min(2, props.gridColumns));
        } else {
          setResponsiveCols(props.gridColumns);
        }
      });
    });

    observer.observe(el);
    return function () { observer.disconnect(); };
  }, [props.gridColumns]);

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + responsiveCols + ", 1fr)",
    gap: props.gridGap + "px",
  };

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: styles.grid,
      style: gridStyle,
    },
    props.children
  );
};

export default HyperChartsGrid;
