import type { ReduxState } from '@/lib/redux';

export const isEditState = (state: ReduxState) => state.isEdit;
