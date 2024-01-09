import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React from 'react';
import {
  FileBox,
  MoreVertical,
  PackageCheck,
  PackageMinus,
} from 'lucide-react';

export default function AssetActions() {
  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="flat">
            <MoreVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions">
          <DropdownItem key="import" startContent={<FileBox />}>
            Import checklist
          </DropdownItem>
          <DropdownItem key="close" startContent={<PackageCheck />}>
            Mark as Close
          </DropdownItem>
          <DropdownItem
            key="delete"
            startContent={<PackageMinus />}
            color="danger"
          >
            Remove Asset
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
