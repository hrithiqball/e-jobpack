import { MetadataUser } from '@/utils/model/user';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: MetadataUser = {
  name: undefined,
  email: '',
  phone: '',
  role: 'maintainer',
  department: undefined,
  userId: undefined,
  id: '',
  app_metadata: {},
  user_metadata: {},
  aud: '',
  created_at: '',
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }: PayloadAction<MetadataUser>) => {
      return payload;
    },
  },
});

export const { setUserInfo } = userInfoSlice.actions;
