import { useState } from 'react';

import AssetDetailsForm from './update-form';
import AssetDetailsStatic from './details';

export default function AssetDetailsInfo() {
  const [isEditing, setIsEditing] = useState(false);

  function handleCloseEdit() {
    setIsEditing(false);
  }

  function handleStartEditing() {
    setIsEditing(true);
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {isEditing ? (
        <AssetDetailsForm onClose={handleCloseEdit} />
      ) : (
        <AssetDetailsStatic startEditing={handleStartEditing} />
      )}
    </div>
  );
}
