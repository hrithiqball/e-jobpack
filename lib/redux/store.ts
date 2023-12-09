import { configureStore } from '@reduxjs/toolkit';
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from 'react-redux';

import { reducer } from '@/lib/redux/reducer';
import { middleware } from '@/lib/redux/middleware';

export const reduxStore = configureStore({
  reducer,
  // middleware: getDefaultMiddleware => {
  //   return getDefaultMiddleware().concat(middleware);
  // },
});
export const useDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;

export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
