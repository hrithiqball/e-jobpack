import { useState } from 'react';

import { Button } from '@nextui-org/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { useGetChecklistLibraryList } from '@/data/checklist-library';

type ChecklistChoiceCellProps = {
  assetId: string;
};

export default function ChecklistChoiceCell({
  assetId,
}: ChecklistChoiceCellProps) {
  const { updateChecklistId } = useMaintenanceStore();

  const [checklistValue, setChecklistValue] = useState('default');
  const [open, setOpen] = useState(false);

  function handleSelectedLibraryChange(libraryId: string) {
    updateChecklistId(assetId, libraryId);
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
  } = useGetChecklistLibraryList(assetId);

  const selectedChecklist = checklistList?.find(
    checklist => checklist.id === checklistValue,
  );

  if (fetchError) return <span>{fetchError.message}</span>;
  return (
    <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
      <DropdownMenuTrigger>
        <Button variant="faded" size="sm" onClick={handleOpenMenu}>
          {selectedChecklist ? selectedChecklist.title : 'Default'}
        </Button>
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
