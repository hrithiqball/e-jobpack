import React from 'react';

import { Maintenance } from '@prisma/client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/Table';
import { Button, Link } from '@nextui-org/react';
import { ExternalLink } from 'lucide-react';

interface AssetSideSheetProps {
  maintenance: Maintenance;
}

type MaintenanceState =
  | 'progress'
  | 'schedule'
  | 'complete'
  | 'approved'
  | 'pending'
  | 'rejected';

export default function AssetSideSheet({ maintenance }: AssetSideSheetProps) {
  const maintenanceState: MaintenanceState = getMaintenanceState();

  function getMaintenanceState() {
    if (
      maintenance.isOpen &&
      !maintenance.isClose &&
      maintenance.approvedOn === null &&
      maintenance.startDate <= new Date()
    ) {
      return 'progress';
    } else if (
      maintenance.isOpen &&
      !maintenance.isClose &&
      maintenance.approvedOn === null &&
      maintenance.startDate > new Date()
    ) {
      return 'schedule';
    } else if (maintenance.isClose && maintenance.approvedOn === null) {
      return 'complete';
    } else if (maintenance.approvedOn !== null && maintenance.isClose) {
      return 'approved';
    } else if (!maintenance.isOpen) {
      return 'pending';
    } else {
      return 'rejected';
    }
  }

  switch (maintenanceState) {
    case 'progress': {
      return (
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Button
              as={Link}
              href={`/task/${maintenance.id}`}
              size="sm"
              variant="light"
              endContent={<ExternalLink size={18} />}
            >
              Open Maintenance Progress
            </Button>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Person in Charge</TableCell>
                <TableCell>{maintenance.approvedById}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    }
    case 'schedule': {
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Maintenance Status</span>
          <span className="text-sm text-gray-500">Scheduled</span>
        </div>
      );
    }
    case 'complete': {
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Maintenance Status</span>
          <span className="text-sm text-gray-500">Pending Approval</span>
        </div>
      );
    }
    case 'approved': {
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Maintenance Status</span>
          <span className="text-sm text-gray-500">Closed and Approved</span>
        </div>
      );
    }
    case 'pending': {
      return (
        <div className="flex flex-col">
          <Button as={Link} href={`/task/${maintenance.id}`}>
            Open Todo
          </Button>
          <span className="text-sm text-gray-500">Maintenance Status</span>
          <span className="text-sm text-gray-500">Pending</span>
        </div>
      );
    }
    case 'rejected': {
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Maintenance Status</span>
          <span className="text-sm text-gray-500">Rejected</span>
        </div>
      );
    }
  }
}
