import { create } from 'zustand';
import { AssetItem, AssetList } from '@/types/asset';

type useAssetStore = {
  asset: AssetItem | null;
  setAsset: (asset: AssetItem) => void;
  assetList: AssetList;
  setAssetList: (assetList: AssetList) => void;
};

export const useAssetStore = create<useAssetStore>(set => ({
  asset: null,
  setAsset: asset => {
    set({ asset });
  },
  assetList: [],
  setAssetList: assetList => {
    set({ assetList });
  },
}));
