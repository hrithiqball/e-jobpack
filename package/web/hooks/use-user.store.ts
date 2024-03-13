import { create } from 'zustand';
import { User } from '@prisma/client';

type UserStore = {
  userList: User[];
  currentUser: User | undefined;
  setUserList: (userList: User[]) => void;
  setCurrentUser: (user: User) => void;
};

export const useUserStore = create<UserStore>(set => ({
  userList: [],
  currentUser: undefined,
  setUserList: userList => {
    set({ userList });
  },
  setCurrentUser: user => {
    set({ currentUser: user });
  },
}));
