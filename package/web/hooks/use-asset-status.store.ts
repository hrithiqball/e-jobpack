import { create } from 'zustand';
import { AssetStatus } from '@prisma/client';

type useAssetStatusStore = {
  assetStatusList: AssetStatus[];
  setAssetStatusList: (assetStatusList: AssetStatus[]) => void;
};

export const useAssetStatusStore = create<useAssetStatusStore>(set => ({
  assetStatusList: [],
  setAssetStatusList: assetStatusList => {
    set({ assetStatusList });
  },
}));
