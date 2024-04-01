import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PackageX } from 'lucide-react';

import { useAssetStore } from '@/hooks/use-asset.store';

type MaintenanceRecreateAssetCellProps = {
  asset: { assetId: string | null; library: string | null };
  onAssetChange: (asset: {
    assetId: string | null;
    library: string | null;
  }) => void;
};

export default function MaintenanceRecreateAssetCell({
  asset,
  onAssetChange,
}: MaintenanceRecreateAssetCellProps) {
  const { assetList } = useAssetStore();

  const [open, setOpen] = useState(false);
  const [assetValue, setAssetValue] = useState(asset.assetId || 'empty');
  const selectedAsset = assetList.find(asset => asset.id === assetValue);

  function handleCloseMenu() {
    setOpen(false);
  }

  function handleOpenMenu() {
    setOpen(true);
  }

  function handleValueChange(value: string) {
    setAssetValue(value);
    if (value === 'prev') {
      onAssetChange({ assetId: null, library: null });
      return;
    }
    const selectedAsset = assetList.find(asset => asset.id === value)!;
    const inferredAsset = {
      assetId: selectedAsset.id,
      library: null,
    };

    onAssetChange(inferredAsset);
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
      <DropdownMenuTrigger>
        <Button
          type="button"
          variant="outline"
          size="sm"
          color="primary"
          onClick={handleOpenMenu}
        >
          {selectedAsset ? selectedAsset.name : 'Choose Asset'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={assetValue}
          onValueChange={handleValueChange}
        >
          {assetList
            .filter(a => a.id !== asset.assetId)
            .map(asset => (
              <DropdownMenuRadioItem key={asset.id} value={asset.id}>
                {asset.name}
              </DropdownMenuRadioItem>
            ))}
          {assetList.filter(a => a.id !== asset.assetId).length === 0 && (
            <div className="m-1 flex items-center space-x-2">
              <PackageX size={18} />
              <span className="text-red-600 dark:text-red-300">
                No other asset can be added
              </span>
            </div>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
