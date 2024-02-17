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

type AssetChoiceCellProps = {
  onAssetChange: (asset: { assetId: string | null; title: string }) => void;
};

export default function AssetChoiceCell({
  onAssetChange,
}: AssetChoiceCellProps) {
  const assetList = useAssetStore.getState().assetList;

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
    if (value === 'default') {
      onAssetChange({ assetId: null, title: '' });
      return;
    }
    const selectedAsset = assetList.find(asset => asset.id === value)!;
    const inferredAsset = {
      assetId: selectedAsset.id,
      title: selectedAsset.name,
    };

    onAssetChange(inferredAsset);
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
