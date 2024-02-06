import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button, Input, Link } from '@nextui-org/react';
import { LibraryBig, Search } from 'lucide-react';

import { ChecklistLibraryItem, ChecklistLibraryList } from '@/types/checklist';

import ChecklistLibraryTable from './ChecklistLibraryTable';
import ChecklistLibraryCreate from './ChecklistLibraryCreate';
import Wrapper from '@/components/ui/wrapper';

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

  const [searchInput, setSearchInput] = useState('');
  const [currentChecklistLibrary, setCurrentChecklistLibrary] =
    useState<ChecklistLibraryItem | null>(null);

  useEffect(() => {
    const library = checklistLibraryList.find(
      checklist => checklist.id === checklistLibId,
    );

    if (library) setCurrentChecklistLibrary(library);
  }, [checklistLibId, checklistLibraryList]);

  if (details && currentChecklistLibrary) {
    return (
      <Wrapper>
        <span>EditingComponent</span>
      </Wrapper>
    );
  }

  if (isCreate) {
    return (
      <Wrapper>
        <ChecklistLibraryCreate />
      </Wrapper>
    );
  }

  if (!isCreate && checklistLibraryList.length === 0) {
    return (
      <Wrapper>
        <span>display empty prompt</span>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex  items-center justify-between">
        <div className="flex-item-center">
          <Input
            size="sm"
            variant="faded"
            color="primary"
            placeholder="Search"
            value={searchInput}
            onValueChange={setSearchInput}
            startContent={<Search size={18} />}
          />
          <div></div>
        </div>
        <div className="flex-item-center">
          <Button
            as={Link}
            href="/maintenance?tab=checklist&isCreate=true"
            variant="faded"
            color="primary"
            startContent={<LibraryBig size={18} />}
          >
            Create
          </Button>
        </div>
      </div>
      <ChecklistLibraryTable checklistLibraryList={checklistLibraryList} />
    </Wrapper>
  );
}
