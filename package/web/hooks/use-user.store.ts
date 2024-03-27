import { create } from 'zustand';
import { User } from '@prisma/client';

type UserStore = {
  user: User | undefined;
  setUser: (user: User) => void;
  userList: User[] | undefined;
  currentUser: User | undefined;
  setUserList: (userList: User[]) => void;
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
