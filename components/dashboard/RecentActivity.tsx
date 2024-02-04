import React from 'react';
import Link from 'next/link';

import {
  Avatar,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Activity, ExternalLink } from 'lucide-react';

export default function RecentActivity() {
  return (
    <div className="flex grow flex-col">
      <Card shadow="none" className="flex flex-1 space-y-4 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Activity />
            <span className="font-bold">Recent Activity</span>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="flex flex-col space-y-2">
            <Table removeWrapper hideHeader>
              <TableHeader>
                <TableColumn>USER</TableColumn>
                <TableColumn>ACTIVITY</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  </TableCell>
                  <TableCell>Created a new maintenance request</TableCell>
                </TableRow>
                <TableRow key="1">
                  <TableCell>
                    <Avatar name="Harith" />
                  </TableCell>
                  <TableCell>
                    <span>Closed maintenance</span>
                    <Link
                      className="hover: flex items-center space-x-2 underline hover:text-blue-500"
                      href="/task"
                    >
                      <span>WO-34857647893754</span>
                      <ExternalLink size={18} />
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow key="1">
                  <TableCell>
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  </TableCell>
                  <TableCell>
                    <span>Approved maintenance request</span>
                    <Link
                      className="hover: flex items-center space-x-2 underline hover:text-blue-500"
                      href="/task"
                    >
                      <span>WO-2385426354267</span>
                      <ExternalLink size={18} />
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
