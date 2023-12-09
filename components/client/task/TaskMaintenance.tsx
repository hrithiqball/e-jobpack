'use client';

import React, { Fragment, useEffect, useState, useTransition } from 'react';
import { useTheme } from 'next-themes';
import Loading from '@/components/client/Loading';
import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import Link from 'next/link';
// import { ToastContainer, toast } from 'react-toastify';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegFileExcel, FaRegFilePdf } from 'react-icons/fa';
import { checklist, checklist_library, maintenance } from '@prisma/client';
import { LuFilePlus2, LuChevronDown } from 'react-icons/lu';
import moment from 'moment';
import { createChecklist } from '@/app/api/server-actions';

export default function TaskMaintenance({
  maintenance,
  checklistLibraryList,
  children,
}: {
  maintenance: maintenance;
  checklistLibraryList: checklist_library[];
  children: React.ReactNode;
}) {
  let [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistDescription, setNewChecklistDescription] = useState('');
  const [selectedSaveOption, setSelectedSaveOption] = useState(
    new Set(['saveOnly']),
  );

  const descriptionsMap = {
    saveOnly: 'Save only for this maintenance.',
    saveAsLibrary:
      'Save for current maintenance and create a new library for future use.',
    onlyLibrary: 'Only save as library and not use for current maintenance.',
  };

  const labelsMap: { [key: string]: string } = {
    saveOnly: 'Save only',
    saveAsLibrary: 'Save and create library',
    onlyLibrary: 'Only save as library',
  };

  const selectedSaveOptionCurrent = Array.from(selectedSaveOption)[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleClose(isCancel: boolean) {
    // if (isCancel) {
    //   setOpenAddChecklist(!openAddChecklist);
    //   return;
    // }

    setOpenAddChecklist(false);
    setNewChecklistTitle('');
    setNewChecklistDescription('');
    setSelectedSaveOption(new Set(['saveOnly']));
    setOpenAddChecklist(!openAddChecklist);

    // const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));

    // toast.promise(resolveAfter3Sec, {
    //   pending: 'Saving...',
    //   success: 'New checklist created!',
    //   error: 'Checklist cannot be saved.',
    // });
    // toast.success('New checklist created!');
  }

  function createChecklistClient() {
    const newChecklist: checklist = {
      uid: `CL-${moment().format('YYMMDDHHmmssSSS')}`,
      created_by: '',
      created_on: new Date(),
      updated_by: '',
      updated_on: new Date(),
      maintenance_uid: maintenance.uid,
      color: null,
      icon: null,
      title: newChecklistTitle,
      description: newChecklistDescription,
    };

    startTransition(() => {
      createChecklist(newChecklist);
    });
  }

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <Fragment>
      <Card
        className={`rounded-md p-4 m-4 flex-grow ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      >
        <div className="flex flex-row">
          <Button
            className="max-w-min"
            as={Link}
            href="/task"
            startContent={<IoIosArrowBack />}
            variant="faded"
            size="md"
          >
            Back
          </Button>
        </div>
        <div className="flex flex-row justify-between items-center my-4 ">
          <h2 className="text-xl font-semibold">{maintenance.uid}</h2>
          <div className="flex flex-row space-x-1">
            <Button
              isIconOnly
              variant="faded"
              onPress={() => setOpenAddChecklist(!openAddChecklist)}
            >
              <LuFilePlus2 />
            </Button>
            <Modal isOpen={openAddChecklist} hideCloseButton backdrop="blur">
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  Add New Checklist
                </ModalHeader>
                <ModalBody>
                  {/* <Select label="Checklist Library" variant="faded">
                    {!checklistLibraryList.length && (
                      <SelectItem key="err">No library found</SelectItem>
                    )}
                    {checklistLibraryList.map(library => (
                      <SelectItem key={library.uid} value={library.uid}>
                        <span>{library.title}</span>
                      </SelectItem>
                    ))}
                  </Select> */}
                  <Select label="Checklist Library" variant="faded">
                    {!checklistLibraryList || !checklistLibraryList.length ? (
                      <SelectItem key="err">No library found</SelectItem>
                    ) : (
                      checklistLibraryList.map(library => (
                        <SelectItem key={library.uid} value={library.uid}>
                          <span>{library.title}</span>
                        </SelectItem>
                      ))
                    )}
                  </Select>

                  <Divider />
                  <Input
                    value={newChecklistTitle}
                    onValueChange={setNewChecklistTitle}
                    isRequired
                    label="Title"
                    variant="faded"
                  />
                  <Input
                    value={newChecklistDescription}
                    onValueChange={setNewChecklistDescription}
                    label="Description"
                    variant="faded"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onClick={() => setOpenAddChecklist(!openAddChecklist)}
                  >
                    Cancel
                  </Button>
                  <ButtonGroup>
                    <Button
                      isDisabled={newChecklistTitle === ''}
                      onClick={() => handleClose(false)}
                    >
                      {
                        labelsMap[
                          selectedSaveOptionCurrent as keyof typeof labelsMap
                        ]
                      }
                    </Button>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly>
                          <LuChevronDown />
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
            <Button isIconOnly variant="faded">
              <AiOutlineEdit />
            </Button>
            <Button isIconOnly variant="faded">
              <FaRegFilePdf />
            </Button>
            <Button isIconOnly variant="faded">
              <FaRegFileExcel />
            </Button>
          </div>
        </div>
        <Divider />
        <Card className="rounded-md overflow-hidden mt-4">
          <div className="flex flex-col h-screen p-4">
            <div className="flex-shrink-0 w-full">{children}</div>
          </div>
        </Card>
      </Card>
    </Fragment>
  );
}
