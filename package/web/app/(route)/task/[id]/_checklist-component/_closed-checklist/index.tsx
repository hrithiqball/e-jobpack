'use client';

import { Fragment, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Checklist } from '@prisma/client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { CheckCircle2, DoorClosed, DoorOpen } from 'lucide-react';
import { toast } from 'sonner';

import { updateChecklist } from '@/lib/actions/checklist';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { complete } from '@/lib/color';
import { MaintenanceAndAssetOptions } from '@/types/maintenance';

type CloseChecklistProps = {
  checklistList: MaintenanceAndAssetOptions['checklist'];
};

export default function ClosedChecklist({
  checklistList,
}: CloseChecklistProps) {
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();

  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState<
    Checklist | undefined
  >();

  function handleOpenChecklistModal(checklist: Checklist) {
    setCurrentChecklist(checklist);
    setIsChecklistOpen(true);
  }

  function handleCloseChecklistModal() {
    setCurrentChecklist(undefined);
    setIsChecklistOpen(false);
  }

  function handleOpenConfirmationModal(checklist: Checklist) {
    setCurrentChecklist(checklist);
    setIsConfirmationOpen(true);
  }

  function handleCloseConfirmationModal(choice: boolean) {
    if (choice) {
      handleReopenChecklist();
      setIsConfirmationOpen(false);
      if (!isPending) {
        setCurrentChecklist(undefined);
      }
    }

    setCurrentChecklist(undefined);
    setIsConfirmationOpen(false);
  }

  function handleReopenChecklist() {
    if (currentChecklist === undefined || currentChecklist.id === undefined) {
      toast.error('Checklist not found');
      return;
    }

    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      toast.promise(
        updateChecklist(currentChecklist.id, {
          updatedById: user.id,
          isClose: false,
        }),
        {
          loading: 'Reopening checklist...',
          success: res => {
            router.refresh();
            return `${res.assetId} is reopened!`;
          },
          error: err => {
            return err.message;
          },
        },
      );
    });
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-md bg-blue-400 px-4"
    >
      <AccordionItem value="closed-checklist">
        <AccordionTrigger>
          <div className="flex items-center space-x-4">
            <CheckCircle2 size={18} color={complete} />
            <span>Closed Checklist</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {checklistList.map(checklist => (
            <div
              key={checklist.id}
              className="flex items-center justify-between"
            >
              <Button
                size="sm"
                variant="faded"
                onClick={() => handleOpenChecklistModal(checklist)}
              >
                {checklist.id}
              </Button>
              <Button
                size="sm"
                variant="faded"
                onClick={() => handleOpenConfirmationModal(checklist)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                }}
                startContent={
                  isHovered ? <DoorOpen size={18} /> : <DoorClosed size={18} />
                }
              >
                Reopen
              </Button>
            </div>
          ))}
          {isDesktop ? (
            <Fragment>
              <Modal isOpen={isChecklistOpen} backdrop="blur" hideCloseButton>
                <ModalContent>
                  <ModalHeader>{currentChecklist?.assetId}</ModalHeader>
                  <ModalBody>
                    Closed By {currentChecklist?.updatedById}
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="faded" onClick={handleCloseChecklistModal}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal
                isOpen={isConfirmationOpen}
                backdrop="blur"
                hideCloseButton
              >
                <ModalContent>
                  <ModalHeader>Reopen checklist</ModalHeader>
                  <ModalBody>
                    Are you sure you want to reopen this checklist?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="faded"
                      onClick={() => handleCloseConfirmationModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="faded"
                      color="danger"
                      onClick={() => handleCloseConfirmationModal(true)}
                    >
                      Confirm
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Fragment>
          ) : (
            <Fragment>
              <Drawer open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    {currentChecklist?.assetId}
                  </DrawerHeader>
                  Closed By {currentChecklist?.updatedById}
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button onClick={handleCloseChecklistModal}>
                        Cancel
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <Drawer
                open={isConfirmationOpen}
                onOpenChange={setIsConfirmationOpen}
              >
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    Reopen checklist
                  </DrawerHeader>
                  <div className="px-8 py-4">
                    Are you sure you want to reopen this checklist?
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button
                        variant="faded"
                        onClick={() => handleCloseConfirmationModal(false)}
                      >
                        Cancel
                      </Button>
                    </DrawerClose>
                    <Button
                      variant="faded"
                      color="danger"
                      onClick={() => handleCloseConfirmationModal(true)}
                    >
                      Confirm
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Fragment>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
