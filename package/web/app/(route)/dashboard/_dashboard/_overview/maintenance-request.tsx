import Link from 'next/link';

import {
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react';
import { Calendar, ClipboardCheck, ExternalLink } from 'lucide-react';

export default function MaintenanceRequestWidget() {
  return (
    <div className="flex grow flex-col">
      <Card shadow="none" className="flex flex-1 p-4 dark:bg-card">
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <ClipboardCheck />
            <span className="font-bold">Maintenance Request</span>
          </div>
          <div className="flex flex-1">
            <Table removeWrapper aria-label="Maintenance Request Table">
              <TableHeader>
                <TableColumn>ASSET</TableColumn>
                <TableColumn>REASON</TableColumn>
                <TableColumn>SEVERITY</TableColumn>
                <TableColumn>BY</TableColumn>
                <TableColumn>DATE</TableColumn>
              </TableHeader>
              <TableBody className="overflow-auto">
                <TableRow key="192">
                  <TableCell>
                    <Link href="/asset">
                      <div className="flex items-center space-x-2 hover:text-blue-500 hover:underline">
                        <span>Water Pump</span>
                        <ExternalLink size={18} />
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>Monthly Maintenance</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="dot" color="warning">
                      Moderate
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <User
                      name="Jane Doe"
                      description="Product Designer"
                      avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Calendar size={18} />
                      <span>12/1/2024</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>
                    <Link href="/asset">
                      <div className="flex items-center space-x-2 hover:text-blue-500 hover:underline">
                        <span>DELL Laptop</span>
                        <ExternalLink size={18} />
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>Corrupted files</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="dot" color="primary">
                      Low
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <User
                      name="Jane Doe"
                      description="Product Designer"
                      avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Calendar size={18} />
                      <span>7/1/2023</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>
                    <Link href="/asset">
                      <div className="flex items-center space-x-2 hover:text-blue-500 hover:underline">
                        <span>Generator-S1</span>
                        <ExternalLink size={18} />
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>Wire malfunction</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="dot" color="danger">
                      Critical
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <User
                      name="Jane Doe"
                      description="Product Designer"
                      avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Calendar size={18} />
                      <span>31/12/2023</span>
                    </div>
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
