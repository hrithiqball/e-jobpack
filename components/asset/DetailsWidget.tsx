import React from 'react';
import Image from 'next/image';

import { Asset } from '@prisma/client';
import dayjs from 'dayjs';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

interface DetailsWidgetProps {
  asset: Asset;
}

export default function DetailsWidget({ asset }: DetailsWidgetProps) {
  return (
    <div className="flex w-3/4 p-2">
      <Card className="flex flex-1 p-4">
        <div className="h-30 min-w-min">
          <div className="flex flex-row">
            <Image
              alt={asset.name}
              src={
                'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
              }
              width={500}
              height={800}
              className="object-cover rounded-md"
            />
            <Table
              className="mb-4 mx-4"
              aria-label="Asset Details"
              color="primary"
              hideHeader
              removeWrapper
            >
              <TableHeader>
                <TableColumn key="key">Key</TableColumn>
                <TableColumn key="value">Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold">Description</span>
                  </TableCell>
                  <TableCell>{asset.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold">Type</span>
                  </TableCell>
                  <TableCell>
                    {asset.type === null || asset.type === ''
                      ? 'Not Specified'
                      : asset.type}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold">Created On</span>
                  </TableCell>
                  <TableCell>
                    {asset.createdBy} on{' '}
                    {dayjs(asset.createdOn).format('DD/MM/YYYY hh:mmA')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="font-semibold">Location</span>
                  </TableCell>
                  <TableCell>
                    {asset.location === null || asset.location === ''
                      ? 'Not Specified'
                      : asset.location}
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
