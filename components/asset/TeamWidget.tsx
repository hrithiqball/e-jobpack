import React from 'react';

import { User } from '@prisma/client';

import {
  Avatar,
  AvatarGroup,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { UsersRound } from 'lucide-react';

interface TeamWidgetProps {
  personInCharge: User | null;
  maintainee: string[];
}

export default function TeamWidget({
  personInCharge,
  maintainee,
}: TeamWidgetProps) {
  return (
    <div className="flex flex-1 p-2">
      <Card shadow="none" className="flex flex-1 p-4">
        <div className="flex flex-row items-center mb-2">
          <UsersRound />
          <span className="font-bold ml-4">Team</span>
        </div>
        <Table aria-label="Team" color="primary" hideHeader removeWrapper>
          <TableHeader>
            <TableColumn key="key">Key</TableColumn>
            <TableColumn key="value">Value</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Person In Charge</TableCell>
              <TableCell className="justify-center">
                {personInCharge === null ? (
                  <span>Not set</span>
                ) : (
                  <div className="flex space-x-2">
                    <Avatar
                      showFallback
                      name={personInCharge.name}
                      src={personInCharge.image ?? ''}
                    />
                    <div className="flex flex-col">
                      <span>{personInCharge.name}</span>
                      <span className="font-thin">{personInCharge.email}</span>
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Maintainer</TableCell>
              <TableCell>
                {maintainee.length > 0 && (
                  <AvatarGroup isBordered max={5}>
                    {maintainee.map(maintainer => (
                      <Avatar
                        key={maintainer}
                        src={`https://i.pravatar.cc/150?u=${maintainer}`}
                      />
                    ))}
                  </AvatarGroup>
                )}
                <span>No one assigned to maintain this asset</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
