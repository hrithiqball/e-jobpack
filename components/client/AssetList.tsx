'use client';

import React, { useEffect, useState, useCallback, ReactNode, Key } from 'react';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { LuPackagePlus } from 'react-icons/lu';
import Loading from '@/components/client/Loading';
import Link from 'next/link';
import { asset } from '@prisma/client';

export default function AssetList({ assetList }: { assetList: asset[] }) {
  const renderCell = useCallback((asset: asset, columnKey: Key) => {
    const cellValue = asset[columnKey as keyof asset];

    switch (columnKey) {
      case 'name':
        return (
          <Link
            className="hover:underline hover:text-blue-400"
            href={{
              pathname: `/asset/${asset.uid}`,
              query: {
                name: asset.name,
                description: asset.description,
                type: asset.type,
                created_by: asset.created_by,
                created_on: asset.created_on.toString(),
                updated_by: asset.updated_by,
                updated_on: asset.updated_on.toString(),
                last_maintenance: asset.last_maintenance?.toString(),
                last_maintainee: asset.last_maintainee,
                location: asset.location,
                next_maintenance: asset.next_maintenance?.toString(),
                status_uid: asset.status_uid,
                person_in_charge: asset.person_in_charge,
              },
            }}
          >
            {asset.name}
          </Link>
        );
      case 'type':
        return (
          <span>
            {asset.type === null || asset.type === ''
              ? 'Not Specified'
              : asset.type}
          </span>
        );
      default:
        return cellValue;
    }
  }, []);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <Card
      className={`rounded-md p-4 m-4 flex-grow ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      }`}
    >
      <div className="flex justify-between">
        <span>Asset List</span>
        <Button variant="ghost" size="sm" endContent={<LuPackagePlus />}>
          Add Asset
        </Button>
      </div>
      <div className="flex flex-row justify-between h-full">
        <div className="flex-1">
          <Table
            color="primary"
            selectionMode="single"
            className="mt-4"
            aria-label="Asset List"
          >
            <TableHeader>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="description">Description</TableColumn>
              <TableColumn key="type">Type</TableColumn>
              <TableColumn key="location">Location</TableColumn>
              <TableColumn key="person_in_charge">Person In Charge</TableColumn>
            </TableHeader>
            <TableBody items={assetList}>
              {(item: asset) => (
                <TableRow key={item.uid}>
                  {columnKey => (
                    <TableCell>
                      {renderCell(item, columnKey) as ReactNode}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
