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
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
          <div>Opened</div>
        </div>
      );
    case 'APPROVED':
      return (
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
          <div>Approved</div>
        </div>
      );
    case 'REQUESTED':
      return (
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
          <div>Requested</div>
        </div>
      );
    case 'REJECTED':
      return (
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
          <div>Rejected</div>
        </div>
      );
  }
}
