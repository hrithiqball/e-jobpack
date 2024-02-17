import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { Button, ButtonGroup } from '@nextui-org/react';
import { Check, X } from 'lucide-react';

type MaintenanceRequestFormProps = {
  isPending: boolean;
  handleApproveMaintenance: () => void;
  handleRejectMaintenance: () => void;
};

export default function MaintenanceRequestForm({
  isPending,
  handleApproveMaintenance,
  handleRejectMaintenance,
}: MaintenanceRequestFormProps) {
  const { maintenance } = useMaintenanceStore();

  return (
    maintenance && (
      <div className="mt-4 flex items-center justify-between rounded bg-white px-4 py-2 dark:bg-zinc-700 ">
        <span className="text-medium font-medium">
          Approve this maintenance request by
          {maintenance.requestedBy?.name}
        </span>
        <ButtonGroup>
          <Button
            size="sm"
            variant="faded"
            color="success"
            startContent={<Check size={18} />}
            onClick={handleApproveMaintenance}
            isDisabled={isPending}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="faded"
            color="danger"
            startContent={<X size={18} />}
            onClick={handleRejectMaintenance}
            isDisabled={isPending}
          >
            Reject
          </Button>
        </ButtonGroup>
      </div>
    )
  );
}
