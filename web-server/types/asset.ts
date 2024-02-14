import { fetchAssetList } from '@/lib/actions/asset';

export type AssetList = Awaited<ReturnType<typeof fetchAssetList>>;
export type AssetItem = typeof fetchAssetList extends () => Promise<infer T>
  ? T extends Array<infer U>
    ? U
    : never
  : never;
