import { Key, useState } from 'react';

import { toast } from 'sonner';

import { Asset } from '@/types/asset';

import AssetDetailsForm from './AssetDetailsForm';
import AssetDetailsStatic from './AssetDetailsStatic';

type AssetDetailsInfoProps = {
  asset: Asset;
};

export default function AssetDetailsInfo({ asset }: AssetDetailsInfoProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  function handleAssetDetailsAction(key: Key) {
    switch (key) {
      case 'edit-asset':
        setIsUpdating(true);
        break;
      case 'print-asset':
        toast('features coming soon');
        break;
    }
  }

  function handleCancel() {
    setIsUpdating(false);
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {isUpdating ? (
        <AssetDetailsForm asset={asset} onClose={handleCancel} />
      ) : (
        <AssetDetailsStatic
          asset={asset}
          handleAssetDetailsAction={handleAssetDetailsAction}
        />
      )}
    </div>
  );
}
