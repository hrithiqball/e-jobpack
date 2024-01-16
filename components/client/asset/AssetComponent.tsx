'use client';

import React, { useEffect, useState } from 'react';
import { AssetStatus, AssetType, User } from '@prisma/client';

import { Button } from '@nextui-org/react';
import { PackagePlus } from 'lucide-react';

import { fetchMutatedAssetList } from '@/lib/actions/asset';
import Loading from '@/components/client/Loading';
import AssetTable from '@/components/client/asset/AssetTable';
import AddAssetModal from '@/components/client/asset/AddAssetModal';

interface AssetComponentProps {
  mutatedAssetList: Awaited<ReturnType<typeof fetchMutatedAssetList>>;
  assetTypeList: AssetType[];
  assetStatusList: AssetStatus[];
  userList: User[];
}

export default function AssetComponent({
  mutatedAssetList,
  assetTypeList,
  assetStatusList,
  userList,
}: AssetComponentProps) {
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
      <AssetTable mutatedAssetList={mutatedAssetList}>
        <Button
          isIconOnly
          size="md"
          onClick={() => setOpenAddAssetModal(!openAddAssetModal)}
        >
          <PackagePlus size={18} />
        </Button>
        <AddAssetModal
          isOpen={openAddAssetModal}
          onClose={closeAddAssetModal}
          assetStatusList={assetStatusList}
          assetTypeList={assetTypeList}
          userList={userList}
        />
      </AssetTable>
    </div>
  );
}
