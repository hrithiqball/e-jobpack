'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Checklist } from '@prisma/client';

import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { CheckCircle2, DoorClosed, DoorOpen } from 'lucide-react';
import { toast } from 'sonner';

import { updateChecklist } from '@/lib/actions/checklist';
import { useCurrentUser } from '@/hooks/use-current-user';

interface CloseChecklistProps {
  checklistList: Checklist[];
}

export default function ClosedChecklist({
  checklistList,
}: CloseChecklistProps) {
  let [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [isModalChecklistOpen, setIsModalChecklistOpen] = useState(false);
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState<
    Checklist | undefined
  >();

  function handleOpenChecklistModal(checklist: Checklist) {
    setCurrentChecklist(checklist);
    setIsModalChecklistOpen(true);
  }

  function handleCloseChecklistModal() {
    setCurrentChecklist(undefined);
    setIsModalChecklistOpen(false);
  }

  function handleOpenConfirmationModal(checklist: Checklist) {
    setCurrentChecklist(checklist);
    setIsModalConfirmationOpen(true);
  }

  function handleCloseConfirmationModal(choice: boolean) {
    if (choice) {
      handleReopenChecklist();
      setIsModalConfirmationOpen(false);
      if (!isPending) {
        setCurrentChecklist(undefined);
      }
    }

    setCurrentChecklist(undefined);
    setIsModalConfirmationOpen(false);
  }

  function handleReopenChecklist() {
    if (
      user?.id === null ||
      user?.id === undefined ||
      currentChecklist === null ||
      currentChecklist === undefined
    ) {
      toast.error('Session expired');
      return;
    }

    if (currentChecklist.id === null || currentChecklist.id === undefined) {
      toast.error('Checklist not found');
      return;
    }

    startTransition(() => {
      toast.promise(
        updateChecklist(currentChecklist?.id, {
          updatedBy: user.id,
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
      disabledKeys={checklistList.length ? [] : ['closed-checklist']}
      isCompact
      variant="shadow"
      className="drop-shadow-sm"
    >
      <AccordionItem
        key="closed-checklist"
        title={
          <span className="flex items-center">
            <CheckCircle2 size={18} color="#58b368" className="mr-2" /> Closed
            Asset
          </span>
        }
      >
        <div className="mb-2">
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
        </div>
        <Modal isOpen={isModalChecklistOpen} backdrop="blur" hideCloseButton>
          <ModalContent>
            <ModalHeader>{currentChecklist?.assetId}</ModalHeader>
            <ModalBody>Closed By {currentChecklist?.updatedBy}</ModalBody>
            <ModalFooter>
              <Button
                variant="faded"
                color="warning"
                onClick={handleCloseChecklistModal}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isModalConfirmationOpen} backdrop="blur" hideCloseButton>
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
      </AccordionItem>
    </Accordion>
  );
}
