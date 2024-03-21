import { fetchAssetItem } from './asset.action';
import { useQuery } from '@tanstack/react-query';

export function useGetAsset(id: string) {
  return useQuery({
    queryFn: async () => fetchAssetItem(id),
    queryKey: ['asset', id],
  });
}
