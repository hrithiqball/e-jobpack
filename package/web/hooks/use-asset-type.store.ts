import { AssetType } from '@/types/asset';
import { create } from 'zustand';

type useAssetTypeStore = {
  assetTypeList: AssetType[];
  setAssetTypeList: (assetTypeList: AssetType[]) => void;
};

export const useAssetTypeStore = create<useAssetTypeStore>(set => ({
  assetTypeList: [],
  setAssetTypeList: assetTypeList => {
    set({ assetTypeList });
  },
}));
