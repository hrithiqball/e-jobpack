import { MaintenanceStatus } from '@prisma/client';

type MaintenanceStatusHelperProps = {
  maintenanceStatus: MaintenanceStatus;
};

export default function MaintenanceStatusHelper({
  maintenanceStatus,
}: MaintenanceStatusHelperProps) {
  switch (maintenanceStatus) {
    case 'OPENED':
      return (
        <div className="flex items-center space-x-4">
          <div className="rounded-md bg-orange-600 px-2 text-white">Opened</div>
        </div>
      );
    case 'APPROVED':
      return (
        <div className="flex items-center space-x-4">
          <div className="rounded-md bg-green-600 px-2 text-white">
            Approved
          </div>
        </div>
      );
    case 'REQUESTED':
      return (
        <div className="flex items-center space-x-4">
          <div className="rounded-md bg-blue-600 px-2 text-white">
            Requested
          </div>
        </div>
      );
    case 'REJECTED':
      return (
        <div className="flex items-center space-x-4">
          <div className="rounded-md bg-red-600 px-2 text-white">Rejected</div>
        </div>
      );
  }
}
