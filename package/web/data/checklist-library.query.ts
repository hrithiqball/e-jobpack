import { fetchChecklistLibraryList } from '@/data/checklist-library.action';
import { useQuery } from '@tanstack/react-query';

export function useGetChecklistLibraryList(assetId?: string) {
  return useQuery({
    queryFn: async () => fetchChecklistLibraryList(assetId),
    queryKey: ['checklist-library', assetId],
  });
}
