import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { Wrapper } from '@/components/ui/wrapper';

import { ChecklistLibraryList } from '@/types/checklist';
import { useChecklistLibStore } from '@/hooks/use-checklist-lib.store';

import ChecklistLibraryEdit from './edit';
import ChecklistLibraryTable from './table';
import ChecklistLibraryEmpty from './empty';
import ChecklistLibraryCreate from './create';

type MaintenanceChecklistTabProps = {
  checklistLibraryList: ChecklistLibraryList;
};

export default function MaintenanceChecklistTab({
  checklistLibraryList,
}: MaintenanceChecklistTabProps) {
  const searchParams = useSearchParams();

  const checklistLibId = searchParams.get('checklistLibId');
  const isCreate = searchParams.get('isCreate') === 'true' || false;
  const details = searchParams.get('details') === 'true' || false;

  const { setCurrentChecklistLibrary } = useChecklistLibStore();

  useEffect(() => {
    const library = checklistLibraryList.find(
      checklist => checklist.id === checklistLibId,
    );

    library && setCurrentChecklistLibrary(library);
  }, [setCurrentChecklistLibrary, checklistLibId, checklistLibraryList]);

  if (details)
    return (
      <Wrapper>
        <ChecklistLibraryEdit />
      </Wrapper>
    );
  if (isCreate)
    return (
      <Wrapper>
        <ChecklistLibraryCreate />
      </Wrapper>
    );
  if (!isCreate && checklistLibraryList.length === 0)
    return (
      <Wrapper>
        <ChecklistLibraryEmpty />
      </Wrapper>
    );

  return (
    <Wrapper>
      <ChecklistLibraryTable checklistLibraryList={checklistLibraryList} />
    </Wrapper>
  );
}
