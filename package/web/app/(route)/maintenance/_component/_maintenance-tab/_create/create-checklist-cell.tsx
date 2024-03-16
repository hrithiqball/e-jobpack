import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@nextui-org/react';

import {
  ChecklistStore,
  useMaintenanceStore,
} from '@/hooks/use-maintenance.store';
import { useGetChecklistLibraryList } from '@/data/checklist-library.query';

type ChecklistChoiceCellProps = {
  checklist: ChecklistStore;
};

export default function ChecklistChoiceCell({
  checklist,
}: ChecklistChoiceCellProps) {
  const { updateChecklist } = useMaintenanceStore();

  const [checklistValue, setChecklistValue] = useState('default');
  const [open, setOpen] = useState(false);

  function handleSelectedLibraryChange(libraryId: string) {
    updateChecklist(checklist.id, libraryId, selectedChecklist?.title);
  }

  function handleCloseMenu() {
    setOpen(false);
  }

  function handleOpenMenu() {
    setOpen(true);
  }

  const {
    data: checklistList,
    error: fetchError,
    isLoading,
  } = useGetChecklistLibraryList(checklist.assetId!);

  const selectedChecklist = checklistList?.find(
    checklist => checklist.id === checklistValue,
  );

  if (fetchError) return <span>{fetchError.message}</span>;
  return (
    <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
      <DropdownMenuTrigger>
        <Tooltip content={selectedChecklist?.title || 'Default'}>
          <Button variant="outline" size="sm" onClick={handleOpenMenu}>
            {selectedChecklist ? (
              <span>
                {selectedChecklist.title.length > 10
                  ? `${selectedChecklist.title.slice(0, 10)}...`
                  : selectedChecklist.title}
              </span>
            ) : (
              'Default'
            )}
          </Button>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={checklistValue}
          onValueChange={val => {
            setChecklistValue(val);
            handleSelectedLibraryChange(val);
          }}
        >
          <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            checklistList?.map(checklist => (
              <DropdownMenuRadioItem key={checklist.id} value={checklist.id}>
                {checklist.title}
              </DropdownMenuRadioItem>
            ))
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
