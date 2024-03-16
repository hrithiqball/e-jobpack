import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { useGetChecklistLibraryList } from '@/data/checklist-library.query';

type MaintenanceRecreateChecklistCellProps = {
  asset: { assetId: string; library: string | null };
  isInPreviousMaintenance: boolean;
  onChecklistChange: (asset: {
    assetId: string | null;
    library: string | null;
  }) => void;
};

export default function MaintenanceRecreateChecklistCell({
  asset,
  isInPreviousMaintenance,
  onChecklistChange,
}: MaintenanceRecreateChecklistCellProps) {
  const [checklistValue, setChecklistValue] = useState(
    isInPreviousMaintenance ? 'prev' : 'default',
  );
  const [open, setOpen] = useState(false);

  function handleCloseMenu() {
    setOpen(false);
  }

  function handleOpenMenu() {
    setOpen(true);
  }

  function handleValueChange(value: string) {
    setChecklistValue(value);
    if (value === 'prev') {
      onChecklistChange({ assetId: asset.assetId, library: null });
      return;
    }

    onChecklistChange({ assetId: asset.assetId, library: value });
  }

  const {
    data: checklistLibraryList,
    error: fetchError,
    isLoading,
  } = useGetChecklistLibraryList(asset.assetId);

  const selectedChecklist = checklistLibraryList?.find(
    checklist => checklist.id === checklistValue,
  );

  if (fetchError) return <span>{fetchError.message}</span>;
  return (
    <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          size="sm"
          color="primary"
          onClick={handleOpenMenu}
        >
          {checklistValue === 'prev' && <span> Previous Checklist </span>}
          {checklistValue === 'default' && <span> Default </span>}
          {checklistValue !== 'prev' &&
            checklistValue !== 'default' &&
            selectedChecklist && <span>{selectedChecklist.title}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={checklistValue}
          onValueChange={handleValueChange}
        >
          {isInPreviousMaintenance && (
            <DropdownMenuRadioItem
              value="prev"
              className="hover:cursor-pointer"
            >
              Previous Checklist
            </DropdownMenuRadioItem>
          )}
          <DropdownMenuRadioItem
            value="default"
            className="hover:cursor-pointer"
          >
            Default
          </DropdownMenuRadioItem>
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            checklistLibraryList?.map(checklist => (
              <DropdownMenuRadioItem
                key={checklist.id}
                value={checklist.id}
                className="hover:cursor-pointer"
              >
                {checklist.title}
              </DropdownMenuRadioItem>
            ))
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
