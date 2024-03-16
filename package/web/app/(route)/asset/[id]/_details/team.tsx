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

import { useAssetStore } from '@/hooks/use-asset.store';

export default function TeamWidget() {
  const { asset } = useAssetStore();
  const maintainee = asset?.lastMaintainee ?? [];
  const personInCharge = asset?.personInCharge;

  return (
    maintainee && (
      <div className="flex flex-1 p-2">
        <Card shadow="none" className="flex flex-1 p-4 dark:bg-card">
          <div className="mb-2 flex flex-row items-center">
            <UsersRound />
            <span className="ml-4 font-bold">Team</span>
          </div>
          <Table aria-label="Team" color="primary" hideHeader removeWrapper>
            <TableHeader>
              <TableColumn key="key">Key</TableColumn>
              <TableColumn key="value">Value</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">
                  Person In Charge
                </TableCell>
                <TableCell className="justify-center">
                  {personInCharge ? (
                    <div className="flex space-x-2">
                      <Avatar
                        showFallback
                        name={personInCharge.name}
                        src={personInCharge.image ?? ''}
                      />
                      <div className="flex flex-col">
                        <span>{personInCharge.name}</span>
                        <span className="font-thin">
                          {personInCharge.email}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span>Not set</span>
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
    )
  );
}
