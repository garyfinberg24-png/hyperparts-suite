import { create } from "zustand";
import type { TemplateType } from "../models/IHyperProfileTemplate";
import type { ProfileAnimation, ProfileHeaderStyle, PhotoShape, IHeaderConfig } from "../models/IHyperProfileAnimation";
import type { DemoPersonId } from "../models/IHyperProfileDemoConfig";

interface IHyperProfileStoreState {
  /* V1 state */
  currentUserId: string | undefined;
  isSearchOpen: boolean;
  searchQuery: string;

  /* V2: Demo mode */
  isDemoMode: boolean;
  demoPersonId: DemoPersonId;

  /* V2: Wizard */
  isWizardOpen: boolean;

  /* V2: Template & Display */
  selectedTemplateId: TemplateType;

  /* V2: Feature toggles */
  showSkills: boolean;
  showBadges: boolean;
  showOrgChart: boolean;
  showCalendar: boolean;
  showHobbies: boolean;
  showSlogan: boolean;
  showWebsites: boolean;
  showEducation: boolean;

  /* V2: Org chart */
  expandedOrgNodeId: string | undefined;

  /* V2: Flip card */
  isFlipped: boolean;

  /* V2: Animation & Appearance */
  currentAnimation: ProfileAnimation;
  headerConfig: IHeaderConfig;
  photoShape: PhotoShape;
  accentColor: string;

  /* V2: Active tab (for templates with tabs) */
  activeTab: string;
}

interface IHyperProfileStoreActions {
  /* V1 actions */
  setCurrentUserId: (userId: string | undefined) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  /* V2: Demo mode */
  setDemoMode: (enabled: boolean) => void;
  setDemoPersonId: (id: DemoPersonId) => void;

  /* V2: Wizard */
  openWizard: () => void;
  closeWizard: () => void;

  /* V2: Template */
  setSelectedTemplate: (id: TemplateType) => void;

  /* V2: Feature toggles */
  toggleFeature: (feature: string, value: boolean) => void;

  /* V2: Org chart */
  setExpandedOrgNode: (nodeId: string | undefined) => void;

  /* V2: Flip card */
  triggerFlip: () => void;

  /* V2: Animation */
  setAnimation: (animation: ProfileAnimation) => void;

  /* V2: Appearance */
  setHeaderConfig: (config: IHeaderConfig) => void;
  setPhotoShape: (shape: PhotoShape) => void;
  setAccentColor: (color: string) => void;

  /* V2: Active tab */
  setActiveTab: (tab: string) => void;

  /* V2: Bulk apply (for wizard/demo) */
  applyDemoConfig: (config: Partial<IHyperProfileStoreState>) => void;

  /* Reset */
  reset: () => void;
}

type IHyperProfileStore = IHyperProfileStoreState & IHyperProfileStoreActions;

const initialState: IHyperProfileStoreState = {
  currentUserId: undefined,
  isSearchOpen: false,
  searchQuery: "",
  isDemoMode: false,
  demoPersonId: "sarah",
  isWizardOpen: false,
  selectedTemplateId: "standard",
  showSkills: true,
  showBadges: true,
  showOrgChart: false,
  showCalendar: false,
  showHobbies: false,
  showSlogan: false,
  showWebsites: false,
  showEducation: false,
  expandedOrgNodeId: undefined,
  isFlipped: false,
  currentAnimation: "none",
  headerConfig: {
    style: "gradient" as ProfileHeaderStyle,
    primaryColor: "#0078d4",
    secondaryColor: "#106ebe",
  },
  photoShape: "circle",
  accentColor: "#0078d4",
  activeTab: "overview",
};

export const useHyperProfileStore = create<IHyperProfileStore>(function (set) {
  return {
    ...initialState,

    /* V1 actions */
    setCurrentUserId: function (userId) { set({ currentUserId: userId }); },
    setSearchOpen: function (open) { set({ isSearchOpen: open }); },
    setSearchQuery: function (query) { set({ searchQuery: query }); },

    /* V2: Demo mode */
    setDemoMode: function (enabled) { set({ isDemoMode: enabled }); },
    setDemoPersonId: function (id) { set({ demoPersonId: id }); },

    /* V2: Wizard */
    openWizard: function () { set({ isWizardOpen: true }); },
    closeWizard: function () { set({ isWizardOpen: false }); },

    /* V2: Template */
    setSelectedTemplate: function (id) { set({ selectedTemplateId: id }); },

    /* V2: Feature toggles */
    toggleFeature: function (feature, value) {
      const update: Record<string, boolean> = {};
      update[feature] = value;
      set(update as Partial<IHyperProfileStoreState>);
    },

    /* V2: Org chart */
    setExpandedOrgNode: function (nodeId) { set({ expandedOrgNodeId: nodeId }); },

    /* V2: Flip card */
    triggerFlip: function () {
      set(function (state) { return { isFlipped: !state.isFlipped }; });
    },

    /* V2: Animation */
    setAnimation: function (animation) { set({ currentAnimation: animation }); },

    /* V2: Appearance */
    setHeaderConfig: function (config) { set({ headerConfig: config }); },
    setPhotoShape: function (shape) { set({ photoShape: shape }); },
    setAccentColor: function (color) { set({ accentColor: color }); },

    /* V2: Active tab */
    setActiveTab: function (tab) { set({ activeTab: tab }); },

    /* V2: Bulk apply */
    applyDemoConfig: function (config) { set(config); },

    /* Reset */
    reset: function () { set(initialState); },
  };
});
