import { Key, useState } from 'react';

import { toast } from 'sonner';

import AssetDetailsForm from './AssetDetailsForm';
import AssetDetailsStatic from './AssetDetailsStatic';

export default function AssetDetailsInfo() {
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
        <AssetDetailsForm onClose={handleCancel} />
      ) : (
        <AssetDetailsStatic
          handleAssetDetailsAction={handleAssetDetailsAction}
        />
      )}
    </div>
  );
}
