import { fetchAssetList } from '@/data/asset.action';
import { fetchAssetTypeList } from '@/data/asset-type.action';

export type AssetList = Awaited<ReturnType<typeof fetchAssetList>>;
export type AssetTypeList = Awaited<ReturnType<typeof fetchAssetTypeList>>;

export type AssetItem = typeof fetchAssetList extends () => Promise<infer T>
  ? T extends Array<infer U>
    ? U
    : never
  : never;

export type AssetType = AssetTypeList[0];
