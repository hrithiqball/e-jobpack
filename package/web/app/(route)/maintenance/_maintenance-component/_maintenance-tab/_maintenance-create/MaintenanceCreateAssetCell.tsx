import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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
  const { checklistSelected, updateAsset } = useMaintenanceStore();

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
        <Button size="sm" onClick={handleOpenMenu}>
          {selectedAsset ? (
            selectedAsset.name
          ) : (
            <p>
              Choose Asset <sup className="text-red-500">*</sup>
            </p>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={assetValue}
          onValueChange={handleValueChange}
        >
          <DropdownMenuRadioItem value="default">
            <p>
              Choose Asset <sup className="text-red-500">*</sup>
            </p>
          </DropdownMenuRadioItem>
          {assetList
            .filter(
              asset => !checklistSelected.some(cl => cl.assetId === asset.id),
            )
            .map(asset => (
              <DropdownMenuRadioItem key={asset.id} value={asset.id}>
                {asset.name}
              </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
