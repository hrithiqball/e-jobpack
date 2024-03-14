import { fetchAssetList } from '@/lib/actions/asset';
import { fetchAssetTypeList } from '@/lib/actions/asset-type';

export type AssetList = Awaited<ReturnType<typeof fetchAssetList>>;
export type AssetTypeList = Awaited<ReturnType<typeof fetchAssetTypeList>>;

export type AssetItem = typeof fetchAssetList extends () => Promise<infer T>
  ? T extends Array<infer U>
    ? U
    : never
  : never;

export type AssetType = AssetTypeList[0];
