import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const taskListMode = createSlice({
  name: 'taskListMode',
  initialState: false,
  reducers: {
    setTaskListMode: (state, { payload }: PayloadAction<boolean>) => payload,
  },
});
