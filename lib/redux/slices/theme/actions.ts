import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: 'dark',
  reducers: {
    setTheme: (state, { payload }: PayloadAction<string>) => {
      return payload;
    },
  },
});
