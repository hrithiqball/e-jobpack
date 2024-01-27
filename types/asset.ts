import { fetchAssetList2, fetchMutatedAssetItem } from '@/lib/actions/asset';

export type AssetList = Awaited<ReturnType<typeof fetchAssetList2>>;
export type MutatedAsset = Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
