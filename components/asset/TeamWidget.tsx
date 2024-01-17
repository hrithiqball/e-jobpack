import React from 'react';

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
  User,
} from '@nextui-org/react';
import { UsersRound } from 'lucide-react';

export default function TeamWidget() {
  return (
    <div className="flex flex-1 p-2">
      <Card className="flex flex-1 p-4">
        <div className="flex flex-row items-center">
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
                <User
                  name="Jane Doe"
                  description="Product Designer"
                  avatarProps={{
                    src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="semi-bold">Maintainer</TableCell>
              <TableCell>
                <AvatarGroup isBordered max={5}>
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                </AvatarGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
