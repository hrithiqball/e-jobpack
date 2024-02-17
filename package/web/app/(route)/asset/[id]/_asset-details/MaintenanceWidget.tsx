import { useState } from 'react';

import { User } from '@prisma/client';
import dayjs from 'dayjs';

import {
  Button,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Clock, Wrench, History } from 'lucide-react';

import { useCurrentUser } from '@/hooks/use-current-user';

import AddMaintenanceModal from '@/components/asset/AddMaintenance';
import { useAssetStore } from '@/hooks/use-asset.store';

type MaintenanceWidgetProps = {
  userList: User[];
};

export default function MaintenanceWidget({
  userList,
}: MaintenanceWidgetProps) {
  const user = useCurrentUser();
  const asset = useAssetStore.getState().asset;

  const [openAddMaintenanceModal, setOpenAddMaintenanceModal] = useState(false);

  return (
    asset && (
      <div className="flex flex-1 p-2">
        <Card shadow="none" className="flex flex-1 p-4 dark:bg-card">
          <div className="flex flex-row items-center">
            <Wrench />
            <span className="ml-4 font-bold">Maintenance</span>
          </div>
          <Table
            aria-label="Maintenance"
            color="primary"
            hideHeader
            removeWrapper
            className="mt-4"
          >
            <TableHeader>
              <TableColumn key="key">Key</TableColumn>
              <TableColumn key="value">Value</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Upcoming</TableCell>
                <TableCell className="justify-center">
                  <Chip
                    variant="faded"
                    size="sm"
                    startContent={<Clock size={18} />}
                  >
                    <span className="ml-1">
                      {asset.nextMaintenance !== null
                        ? dayjs(asset.nextMaintenance).format('DD/MM/YYYY')
                        : 'No Scheduled Maintenance'}
                    </span>
                  </Chip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Last</TableCell>
                <TableCell className="justify-center">
                  <Chip
                    variant="faded"
                    size="sm"
                    startContent={<History size={18} />}
                  >
                    <span className="ml-1">
                      {asset.lastMaintenance !== null
                        ? dayjs(asset.lastMaintenance).format('DD/MM/YYYY')
                        : 'No Maintenance Completed'}
                    </span>
                  </Chip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button
            onClick={() => setOpenAddMaintenanceModal(true)}
            color="success"
            variant="faded"
            className="my-4"
          >
            {user?.role === 'ADMIN' || user?.role === 'SUPERVISOR'
              ? 'Create New Maintenance'
              : 'Create Maintenance Request'}
          </Button>
          <AddMaintenanceModal
            assetIds={[asset.id]}
            isOpen={openAddMaintenanceModal}
            onClose={() => setOpenAddMaintenanceModal(false)}
            userList={userList}
          />
        </Card>
      </div>
    )
  );
}
