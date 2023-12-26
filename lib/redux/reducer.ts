import { isEditSlice, themeSlice } from '@/lib/redux/slices';

export const reducer = {
  // Add your reducers here
  isEdit: isEditSlice.reducer,
  theme: themeSlice.reducer,
};
