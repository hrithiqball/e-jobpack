import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const isEditSlice = createSlice({
  name: 'isEdit',
  initialState: false,
  reducers: {
    setIsEdit: (state, { payload }: PayloadAction<boolean>) => {
      return payload;
    },
  },
});

export const { setIsEdit } = isEditSlice.actions;
