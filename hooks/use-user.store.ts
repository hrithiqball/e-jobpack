import { create } from 'zustand';
import { User } from '@prisma/client';

type UserStore = {
  userList: User[];
  setUserList: (userList: User[]) => void;
};

export const useUserStore = create<UserStore>(set => ({
  userList: [],
  setUserList: userList => {
    set({ userList });
  },
}));
