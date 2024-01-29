import { fetchAssetList2, fetchMutatedAssetItem } from '@/lib/actions/asset';

export type AssetList = Awaited<ReturnType<typeof fetchAssetList2>>;
export type AssetItem = typeof fetchAssetList2 extends () => Promise<infer T>
  ? T extends Array<infer U>
    ? U
    : never
  : never;
export type MutatedAsset = Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
