import { create } from 'zustand';

import { UserEntity } from '@/shared/model';
import { removeTokenFromStorage } from '@/shared/services';

export interface UserStoreState {
  user: UserEntity | null;
  authPopup: boolean;
  loading: boolean;

  setUserData: (data: UserEntity) => void;
  setLoading: (loading: boolean) => void;
  setAuthPopup: (open: boolean) => void;
  toggleAuthPopup: () => void;
  logout: () => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  authPopup: false,
  loading: false,

  setUserData: (data: UserEntity) => {
    set({ user: data });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setAuthPopup: (open: boolean) => {
    set({ authPopup: open });
  },

  toggleAuthPopup: () => {
    set({ authPopup: !get().authPopup });
  },

  logout: () => {
    set({ user: null });
    removeTokenFromStorage();
  }
}));
