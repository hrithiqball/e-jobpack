import { User, Users } from '@/types/user';
import { create } from 'zustand';

type UserStore = {
  user: User | undefined;
  setUser: (user: User) => void;
  userList: Users | undefined;
  currentUser: User | undefined;
  setUserList: (userList: Users) => void;
  setCurrentUser: (user: User) => void;
};

export const useUserStore = create<UserStore>(set => ({
  user: undefined,
  setUser: user => {
    set({ user });
  },
  userList: [],
  currentUser: undefined,
  setUserList: userList => {
    set({ userList });
  },
  setCurrentUser: user => {
    set({ currentUser: user });
  },
}));
