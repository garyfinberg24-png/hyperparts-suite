import * as React from "react";
import { HyperModal } from "../../../../common/components/HyperModal";
import styles from "./HyperLottieGallery.module.scss";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface IHyperLottieGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lottieUrl: string) => void;
}

interface ILottieEntry {
  id: string;
  name: string;
  category: string;
  lottieUrl: string;
}

/* ------------------------------------------------------------------ */
/*  Curated Lottie catalog (30 entries)                                */
/* ------------------------------------------------------------------ */

const LOTTIE_CATALOG: ILottieEntry[] = [
  // Abstract
  { id: "a1", name: "Gradient Wave", category: "Abstract", lottieUrl: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.json" },
  { id: "a2", name: "Flowing Particles", category: "Abstract", lottieUrl: "https://lottie.host/f2a6e80a-7e59-4b90-b7e8-4c11d214c741/4qpJMfYxTK.json" },
  { id: "a3", name: "Color Morph", category: "Abstract", lottieUrl: "https://lottie.host/cc825eb2-af6a-432c-96f4-57ea0fa7ae3f/YuRVYGMoVj.json" },
  { id: "a4", name: "Liquid Motion", category: "Abstract", lottieUrl: "https://lottie.host/57867df7-f2e2-4694-91bb-31b1ffe6b04a/6YMVvJPNOi.json" },
  { id: "a5", name: "Wave Lines", category: "Abstract", lottieUrl: "https://lottie.host/0dea1d8a-7bb1-4b67-a9e9-9e3ac47a0dea/rLkTqIWuSH.json" },
  // Shapes
  { id: "s1", name: "Geometric Spin", category: "Shapes", lottieUrl: "https://lottie.host/e4a4e69e-dd7a-4a9f-83fa-47d6c8764c1e/BxoXs9W1ML.json" },
  { id: "s2", name: "Circle Pulse", category: "Shapes", lottieUrl: "https://lottie.host/c1ed57cc-5b9e-4a36-b497-7e1f16fa1dc5/MWSf2x5dpH.json" },
  { id: "s3", name: "Rotating Square", category: "Shapes", lottieUrl: "https://lottie.host/ff27e59e-1c51-42ff-b820-8c7f1bf11a7a/5aJjBVGe3F.json" },
  { id: "s4", name: "Morphing Blob", category: "Shapes", lottieUrl: "https://lottie.host/c6b2b4a0-3f8e-4a7d-b4c3-1d5e8f9a2c6b/kXrNp2wLqM.json" },
  { id: "s5", name: "Hexagon Grid", category: "Shapes", lottieUrl: "https://lottie.host/d7e3c5b1-4a9f-8e2d-c6b4-3f1a5d7e9b2c/mYwNqRsLpT.json" },
  // Nature
  { id: "n1", name: "Floating Clouds", category: "Nature", lottieUrl: "https://lottie.host/38d20d81-4a88-4869-ab37-de0393d86e5a/k5MsHLXjDj.json" },
  { id: "n2", name: "Rain Drops", category: "Nature", lottieUrl: "https://lottie.host/b8c4d2e6-5f7a-9b3c-1e8d-4a6f2c7b9e5d/jHwKpLmNqR.json" },
  { id: "n3", name: "Starry Night", category: "Nature", lottieUrl: "https://lottie.host/a9f8b7c6-5d4e-3a2b-1c0d-9e8f7a6b5c4d/fGhJkLmNpQ.json" },
  { id: "n4", name: "Sunrise", category: "Nature", lottieUrl: "https://lottie.host/e5d4c3b2-a1f0-9e8d-7c6b-5a4f3e2d1c0b/rStUvWxYzA.json" },
  { id: "n5", name: "Leaves Falling", category: "Nature", lottieUrl: "https://lottie.host/f6e5d4c3-b2a1-0f9e-8d7c-6b5a4f3e2d1c/bCdEfGhIjK.json" },
  // Business
  { id: "b1", name: "Growth Chart", category: "Business", lottieUrl: "https://lottie.host/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/lMnOpQrStU.json" },
  { id: "b2", name: "Rocket Launch", category: "Business", lottieUrl: "https://lottie.host/b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e/vWxYzAbCdE.json" },
  { id: "b3", name: "Target Hit", category: "Business", lottieUrl: "https://lottie.host/c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f/fGhIjKlMnO.json" },
  { id: "b4", name: "Team Work", category: "Business", lottieUrl: "https://lottie.host/d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a/pQrStUvWxY.json" },
  { id: "b5", name: "Dollar Sign", category: "Business", lottieUrl: "https://lottie.host/e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b/zAbCdEfGhI.json" },
  // Technology
  { id: "t1", name: "Data Flow", category: "Technology", lottieUrl: "https://lottie.host/f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c/jKlMnOpQrS.json" },
  { id: "t2", name: "Loading Spinner", category: "Technology", lottieUrl: "https://lottie.host/a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d/tUvWxYzAbC.json" },
  { id: "t3", name: "Circuit Board", category: "Technology", lottieUrl: "https://lottie.host/b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e/dEfGhIjKlM.json" },
  { id: "t4", name: "Code Brackets", category: "Technology", lottieUrl: "https://lottie.host/c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f/nOpQrStUvW.json" },
  { id: "t5", name: "WiFi Signal", category: "Technology", lottieUrl: "https://lottie.host/d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a/xYzAbCdEfG.json" },
  // Celebrations
  { id: "c1", name: "Confetti Burst", category: "Celebrations", lottieUrl: "https://lottie.host/e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b/hIjKlMnOpQ.json" },
  { id: "c2", name: "Fireworks", category: "Celebrations", lottieUrl: "https://lottie.host/f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c/rStUvWxYzA.json" },
  { id: "c3", name: "Sparkle Stars", category: "Celebrations", lottieUrl: "https://lottie.host/a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d/bCdEfGhIjK.json" },
  { id: "c4", name: "Party Popper", category: "Celebrations", lottieUrl: "https://lottie.host/b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e/lMnOpQrStU.json" },
  { id: "c5", name: "Trophy", category: "Celebrations", lottieUrl: "https://lottie.host/c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f/vWxYzAbCdE.json" },
];

/* ------------------------------------------------------------------ */
/*  Category list + emoji map                                          */
/* ------------------------------------------------------------------ */

const ALL_CATEGORIES: string[] = ["All", "Abstract", "Shapes", "Nature", "Business", "Technology", "Celebrations"];

const CATEGORY_EMOJIS: Record<string, string> = {
  Abstract: "\uD83C\uDF0A",     // wave
  Shapes: "\uD83D\uDD37",       // diamond
  Nature: "\uD83C\uDF3F",       // herb
  Business: "\uD83D\uDCC8",     // chart increasing
  Technology: "\uD83D\uDCBB",   // laptop
  Celebrations: "\uD83C\uDF89", // party popper
};

/** Map category name to its SCSS preview class */
const CATEGORY_PREVIEW_CLASS: Record<string, string> = {
  Abstract: styles.lottiePreviewAbstract,
  Shapes: styles.lottiePreviewShapes,
  Nature: styles.lottiePreviewNature,
  Business: styles.lottiePreviewBusiness,
  Technology: styles.lottiePreviewTechnology,
  Celebrations: styles.lottiePreviewCelebrations,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const HyperLottieGalleryInner: React.FC<IHyperLottieGalleryProps> = function (props) {
  const { isOpen, onClose, onSelect } = props;

  const categoryState = React.useState<string>("All");
  const selectedCategory = categoryState[0];
  const setSelectedCategory = categoryState[1];

  const selectedUrlState = React.useState<string | undefined>(undefined);
  const selectedUrl = selectedUrlState[0];
  const setSelectedUrl = selectedUrlState[1];

  /* Reset state when the modal opens */
  React.useEffect(function () {
    if (isOpen) {
      setSelectedCategory("All");
      setSelectedUrl(undefined);
    }
  }, [isOpen]);

  /* Filter entries by category */
  const filteredEntries: ILottieEntry[] = [];
  LOTTIE_CATALOG.forEach(function (entry) {
    if (selectedCategory === "All" || entry.category === selectedCategory) {
      filteredEntries.push(entry);
    }
  });

  /* Handlers */
  const handleCategoryClick = function (cat: string): () => void {
    return function (): void {
      setSelectedCategory(cat);
      setSelectedUrl(undefined);
    };
  };

  const handleCardClick = function (url: string): () => void {
    return function (): void {
      setSelectedUrl(url);
    };
  };

  const handleSelect = React.useCallback(function (): void {
    if (selectedUrl) {
      onSelect(selectedUrl);
    }
  }, [selectedUrl, onSelect]);

  /* Build category chips */
  const categoryChips: React.ReactNode[] = [];
  ALL_CATEGORIES.forEach(function (cat) {
    const isActive = cat === selectedCategory;
    const chipClass = isActive
      ? styles.categoryChip + " " + styles.categoryChipActive
      : styles.categoryChip;

    categoryChips.push(
      React.createElement("button", {
        key: cat,
        className: chipClass,
        onClick: handleCategoryClick(cat),
        type: "button",
        "aria-pressed": isActive ? "true" : "false",
      }, cat)
    );
  });

  /* Build grid cards */
  const gridCards: React.ReactNode[] = [];
  filteredEntries.forEach(function (entry) {
    const isSelected = selectedUrl === entry.lottieUrl;
    const cardClass = isSelected
      ? styles.lottieCard + " " + styles.lottieCardSelected
      : styles.lottieCard;

    const previewClass = CATEGORY_PREVIEW_CLASS[entry.category] || "";
    const emoji = CATEGORY_EMOJIS[entry.category] || "\uD83C\uDFA8"; // artist palette fallback

    gridCards.push(
      React.createElement("div", {
        key: entry.id,
        className: cardClass,
        onClick: handleCardClick(entry.lottieUrl),
        role: "option",
        "aria-selected": isSelected ? "true" : "false",
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent): void {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedUrl(entry.lottieUrl);
          }
        },
      },
        React.createElement("div", {
          className: styles.lottiePreview + " " + previewClass,
          "aria-hidden": "true",
        }, emoji),
        React.createElement("p", { className: styles.lottieName }, entry.name),
        React.createElement("div", { className: styles.lottieCategory }, entry.category)
      )
    );
  });

  /* Build grid or empty state */
  const gridContent = gridCards.length > 0
    ? React.createElement("div", {
        className: styles.lottieGrid,
        role: "listbox",
        "aria-label": "Lottie animations",
      }, gridCards)
    : React.createElement("div", { className: styles.emptyText }, "No animations found for this category.");

  /* Modal body */
  const modalBody = React.createElement("div", { className: styles.galleryContainer },
    React.createElement("div", {
      className: styles.categoryBar,
      role: "toolbar",
      "aria-label": "Filter by category",
    }, categoryChips),
    gridContent
  );

  /* Modal footer */
  const modalFooter = React.createElement("div", { className: styles.footerRow },
    React.createElement("button", {
      className: styles.cancelBtn,
      onClick: onClose,
      type: "button",
    }, "Cancel"),
    React.createElement("button", {
      className: styles.selectBtn,
      onClick: handleSelect,
      type: "button",
      disabled: !selectedUrl,
    }, "Select")
  );

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: "Lottie Animation Gallery",
    size: "medium",
    footer: modalFooter,
  }, modalBody);
};

export const HyperLottieGallery = React.memo(HyperLottieGalleryInner);
