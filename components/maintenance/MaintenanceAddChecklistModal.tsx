import React, { useState, useTransition } from 'react';

import { Asset, ChecklistLibrary } from '@prisma/client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { createChecklist } from '@/lib/actions/checklist';
import { fetchMutatedMaintenanceItem } from '@/lib/actions/maintenance';
import { descriptionsMap, labelsMap } from '@/public/utils/labels';

interface MaintenanceAddChecklistModalProps {
  open: boolean;
  onClose: () => void;
  maintenance: Awaited<ReturnType<typeof fetchMutatedMaintenanceItem>>;
  assetList: Asset[];
  checklistLibraryList: ChecklistLibrary[];
  selectedSaveOptionCurrent: string;
}

export default function MaintenanceAddChecklistModal({
  open,
  onClose,
  assetList,
  maintenance,
  checklistLibraryList,
  selectedSaveOptionCurrent,
}: MaintenanceAddChecklistModalProps) {
  let [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const [selectedAsset, setSelectedAsset] = useState<any>([]);
  const [description, setDescription] = useState('');
  const [selectedSaveOption, setSelectedSaveOption] = useState(
    new Set(['saveOnly']),
  );
  function handleAddAsset() {
    if (user === undefined || user.id === undefined || user.id === null) {
      console.error('not found');
      return;
    }

    startTransition(() => {
      toast.promise(
        createChecklist({
          assetId: selectedAsset.currentKey,
          createdById: user.id,
          maintenanceId: maintenance.maintenance.id,
          description,
        }),
        {
          loading: 'Adding checklist...',
          success: res => {
            console.log(res);
            setSelectedAsset([]);
            setSelectedSaveOption(new Set(['saveOnly']));
            setDescription('');
            onClose();
            return 'Checklist added successfully';
          },
          error: "Couldn't add checklist 🥲",
        },
      );
    });
  }

  return (
    <Modal isOpen={open} hideCloseButton backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add New Asset</ModalHeader>
        <ModalBody>
          <Select
            isRequired
            items={assetList}
            selectedKeys={selectedAsset}
            onSelectionChange={(s: any) => setSelectedAsset(s)}
            label="Asset"
            variant="faded"
          >
            {asset => <SelectItem key={asset.id}>{asset.name}</SelectItem>}
          </Select>
          <Select label="Asset Checklist Library" variant="faded">
            {!checklistLibraryList || !checklistLibraryList.length ? (
              <SelectItem key="err">No library found</SelectItem>
            ) : (
              checklistLibraryList.map(library => (
                <SelectItem key={library.id} value={library.id}>
                  <span>{library.title}</span>
                </SelectItem>
              ))
            )}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" disabled={isPending} onClick={onClose}>
            Cancel
          </Button>
          <ButtonGroup>
            <Button
              isDisabled={selectedAsset.length === 0 || isPending}
              onClick={handleAddAsset}
            >
              {labelsMap[selectedSaveOptionCurrent as keyof typeof labelsMap]}
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly disabled={isPending}>
                  <ChevronDown size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Merge options"
                selectedKeys={selectedSaveOption}
                selectionMode="single"
                onSelectionChange={(setString: any) =>
                  setSelectedSaveOption(setString)
                }
                className="max-w-[300px]"
              >
                <DropdownItem
                  key="saveOnly"
                  description={descriptionsMap['saveOnly']}
                >
                  {labelsMap['saveOnly']}
                </DropdownItem>
                <DropdownItem
                  key="saveAsLibrary"
                  description={descriptionsMap['saveAsLibrary']}
                >
                  {labelsMap['saveAsLibrary']}
                </DropdownItem>
                <DropdownItem
                  key="onlyLibrary"
                  description={descriptionsMap['onlyLibrary']}
                >
                  {labelsMap['onlyLibrary']}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
