import { useState } from 'react';

import { Button } from '@nextui-org/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAssetStore } from '@/hooks/use-asset.store';
import {
  ChecklistStore,
  useMaintenanceStore,
} from '@/hooks/use-maintenance.store';

type AssetChoiceCellProps = {
  checklist: ChecklistStore;
};

export default function AssetChoiceCell({ checklist }: AssetChoiceCellProps) {
  const { assetList } = useAssetStore();
  const { updateAsset } = useMaintenanceStore();

  const [open, setOpen] = useState(false);
  const [assetValue, setAssetValue] = useState('default');
  const selectedAsset = assetList.find(asset => asset.id === assetValue);

  function handleCloseMenu() {
    setOpen(false);
  }

  function handleOpenMenu() {
    setOpen(true);
  }

  function handleValueChange(value: string) {
    setAssetValue(value);
    updateAsset(checklist.id, value, selectedAsset?.name);
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
      <DropdownMenuTrigger>
        <Button variant="faded" size="sm" onClick={handleOpenMenu}>
          {selectedAsset ? selectedAsset.name : 'Choose Asset'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={assetValue}
          onValueChange={handleValueChange}
        >
          <DropdownMenuRadioItem value="default">Choose</DropdownMenuRadioItem>
          {assetList.map(asset => (
            <DropdownMenuRadioItem key={asset.id} value={asset.id}>
              {asset.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
