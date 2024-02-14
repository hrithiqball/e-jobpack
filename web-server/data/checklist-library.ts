import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';
import { useQuery } from '@tanstack/react-query';

export function useGetChecklistLibraryList(assetId?: string) {
  return useQuery({
    queryFn: async () => fetchChecklistLibraryList(),
    queryKey: ['checklist-library'],
  });
}
