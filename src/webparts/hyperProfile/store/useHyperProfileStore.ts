import { create } from "zustand";

interface IHyperProfileStoreState {
  currentUserId: string | undefined;
  isSearchOpen: boolean;
  searchQuery: string;
}

interface IHyperProfileStoreActions {
  setCurrentUserId: (userId: string | undefined) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

type IHyperProfileStore = IHyperProfileStoreState & IHyperProfileStoreActions;

const initialState: IHyperProfileStoreState = {
  currentUserId: undefined,
  isSearchOpen: false,
  searchQuery: "",
};

export const useHyperProfileStore = create<IHyperProfileStore>(function (set) {
  return {
    ...initialState,
    setCurrentUserId: function (userId) { set({ currentUserId: userId }); },
    setSearchOpen: function (open) { set({ isSearchOpen: open }); },
    setSearchQuery: function (query) { set({ searchQuery: query }); },
    reset: function () { set(initialState); },
  };
});
