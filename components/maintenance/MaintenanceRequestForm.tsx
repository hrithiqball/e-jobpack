import React from 'react';

import { Button, ButtonGroup } from '@nextui-org/react';
import { Check, X } from 'lucide-react';

import { fetchMutatedMaintenanceItem } from '@/lib/actions/maintenance';

interface MaintenanceRequestFormProps {
  maintenance: Awaited<ReturnType<typeof fetchMutatedMaintenanceItem>>;
  isPending: boolean;
  handleApproveMaintenance: () => void;
  handleRejectMaintenance: () => void;
}

export default function MaintenanceRequestForm({
  maintenance,
  isPending,
  handleApproveMaintenance,
  handleRejectMaintenance,
}: MaintenanceRequestFormProps) {
  return (
    <div className="flex items-center mt-4 px-4 py-2 rounded bg-white dark:bg-zinc-700 justify-between ">
      <span className="text-medium font-medium">
        Approve this maintenance request by{' '}
        {maintenance.maintenance.requestedById}
      </span>
      <ButtonGroup>
        <Button
          size="sm"
          variant="faded"
          color="success"
          startContent={<Check size={18} />}
          onClick={handleApproveMaintenance}
          disabled={isPending}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="faded"
          color="danger"
          startContent={<X size={18} />}
          onClick={handleRejectMaintenance}
          disabled={isPending}
        >
          Reject
        </Button>
      </ButtonGroup>
    </div>
  );
}
