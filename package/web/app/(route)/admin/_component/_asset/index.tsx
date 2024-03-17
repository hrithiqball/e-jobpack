import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutGrid, Card } from '@/components/ui/layout-grid';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { useAssetTypeStore } from '@/hooks/use-asset-type.store';
import { Activity, Building2, MoreHorizontal, Package } from 'lucide-react';
import empty from '@/public/image/empty.gif';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createAssetType } from '@/data/asset-type.action';
import { useCurrentUser } from '@/hooks/use-current-user';
import { DonutChart, Legend } from '@tremor/react';
import { colors } from '@/public/utils/colors';
import { valueFormatter } from '@/lib/function/value-formatter';

const cards: Card[] = [
  {
    id: 1,
    content: <AssetStatus />,
    className: 'col-span-1',
    title: 'Asset Status',
    description: 'Manage asset status to determine the condition of asset',
    icon: <Activity />,
  },
  {
    id: 2,
    content: <AssetType />,
    className: 'col-span-1',
    title: 'Asset Type',
    description: 'Manage asset type to easily filter the type of status',
    icon: <Package />,
    meta: <AssetTypeGraph />,
  },
  {
    id: 3,
    content: <AssetDepartment />,
    className: 'col-span-1',
    title: 'Asset Department',
    description:
      'Manage asset department to classified the asset to each department',
    icon: <Building2 />,
  },
];

export default function AssetTab() {
  return <LayoutGrid cards={cards} />;
}

function AssetStatus() {
  return (
    <div>
      <p className="text-4xl font-bold">House in the woods</p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
        A serene and tranquil retreat, this house in the woods offers a peaceful
        escape from the hustle and bustle of city life.
      </p>
    </div>
  );
}

function AssetType() {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const { assetTypeList, setAssetTypeList } = useAssetTypeStore();

  const [title, setTitle] = useState('');

  function handleAddAssetType() {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(createAssetType(user.id, title), {
        loading: 'Adding asset type...',
        success: res => {
          setAssetTypeList([...assetTypeList, { ...res, asset: [] }]);
          return 'Asset type added';
        },
        error: 'Failed to add asset type',
      });
    });
    setTitle('');
  }

  return (
    <div className="flex h-full flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Asset Type</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Add</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <div className="flex flex-col space-y-4">
              <Label className="mt-2">Title</Label>
              <Input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <Button
                variant="outline"
                disabled={!title || transitioning}
                onClick={handleAddAssetType}
              >
                Add
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {assetTypeList.length > 0 ? (
        <Table>
          {assetTypeList.map(assetType => (
            <TableRow key={assetType.id} noHover>
              <TableCell>{assetType.title}</TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="ghost">
                  <MoreHorizontal size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : (
        <div className="flex h-full flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center">
            <Image src={empty} width={70} height={70} alt="empty" />
            <p>No asset type found!</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AssetTypeGraph() {
  const { assetTypeList } = useAssetTypeStore();

  const assetCount = assetTypeList.map(assetType => ({
    title: assetType.title,
    count: assetType.asset.length,
  }));

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <DonutChart
        data={assetCount}
        variant="pie"
        category="count"
        index="title"
        valueFormatter={n => valueFormatter(n, '', 'asset used')}
        colors={colors}
        className="w-40"
      />
      <Legend
        categories={assetCount.map(a => a.title)}
        colors={colors}
        className="max-w-xs"
      />
    </div>
  );
}

function AssetDepartment() {
  return (
    <div>
      <p className="text-4xl font-bold">Greens all over</p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
        A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
}
