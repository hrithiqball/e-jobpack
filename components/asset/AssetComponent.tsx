'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { AssetStatus, AssetType, User } from '@prisma/client';

import { Button } from '@nextui-org/react';
import { PackagePlus } from 'lucide-react';

import Loading from '@/components/Loading';
import AssetTable from '@/components/asset/AssetTable';
import AddAssetModal from '@/components/asset/AddAssetModal';
import { useCurrentRole } from '@/hooks/use-current-role';
import { fetchAssetList2 } from '@/lib/actions/asset';

interface AssetComponentProps {
  assetList: Awaited<ReturnType<typeof fetchAssetList2>>;
  assetTypeList: AssetType[];
  assetStatusList: AssetStatus[];
  userList: User[];
}

export default function AssetComponent({
  assetList,
  assetTypeList,
  assetStatusList,
  userList,
}: AssetComponentProps) {
  const role = useCurrentRole();

  const [mounted, setMounted] = useState(false);
  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);

  function closeAddAssetModal() {
    setOpenAddAssetModal(false);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <div className="flex flex-col flex-1">
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
