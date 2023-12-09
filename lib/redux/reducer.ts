import { isEditSlice, themeSlice, userInfoSlice } from '@/lib/redux/slices';

export const reducer = {
  // Add your reducers here
  isEdit: isEditSlice.reducer,
  theme: themeSlice.reducer,
  userInfo: userInfoSlice.reducer,
};
