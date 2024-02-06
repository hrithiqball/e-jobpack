'use client';

import { Fragment, useState } from 'react';
import { AssetStatus, AssetType, User } from '@prisma/client';

import { Button } from '@nextui-org/react';
import { PackagePlus } from 'lucide-react';

import { useCurrentRole } from '@/hooks/use-current-role';
import { AssetList } from '@/types/asset';

import AssetTable from '@/app/(route)/asset/_asset-table/AssetTable';
import AddAssetModal from '@/app/(route)/asset/_asset-table/AddAssetModal';

type AssetComponentProps = {
  assetList: AssetList;
  assetTypeList: AssetType[];
  assetStatusList: AssetStatus[];
  userList: User[];
};

export default function AssetComponent({
  assetList,
  assetTypeList,
  assetStatusList,
  userList,
}: AssetComponentProps) {
  const role = useCurrentRole();

  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);

  function closeAddAssetModal() {
    setOpenAddAssetModal(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <AssetTable
        assetList={assetList}
        userList={userList}
        assetStatusList={assetStatusList}
      >
        {role === 'ADMIN' ||
          (role === 'SUPERVISOR' && (
            <Fragment>
              <Button
                size="md"
                onClick={() => setOpenAddAssetModal(!openAddAssetModal)}
                endContent={<PackagePlus size={18} />}
              >
                Add Asset
              </Button>
              <AddAssetModal
                isOpen={openAddAssetModal}
                onClose={closeAddAssetModal}
                assetStatusList={assetStatusList}
                assetTypeList={assetTypeList}
                userList={userList}
              />
            </Fragment>
          ))}
      </AssetTable>
    </div>
  );
}
