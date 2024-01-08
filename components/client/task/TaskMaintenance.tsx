'use client';

import React, { useEffect, useState, useTransition } from 'react';
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
import { FaRegFileExcel, FaRegFilePdf } from 'react-icons/fa6';
import {
  asset,
  checklist,
  checklist_library,
  maintenance,
  subtask,
  task,
} from '@prisma/client';
import {
  LuFilePlus2,
  LuChevronDown,
  LuChevronLeft,
  LuPencilLine,
} from 'react-icons/lu';
import moment from 'moment';
import { createChecklist } from '@/app/api/server-actions';
import { Border, Cell, Column, Workbook } from 'exceljs';
// import { SimplifiedTask } from '@/utils/model/nested-maintenance';
import { base64Image } from '@/public/client-icon-base64';
import { saveAs } from 'file-saver';
import { Result } from '@/utils/function/result';
import { convertToRoman } from '@/utils/function/convertToRoman';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TaskMaintenance({
  maintenance,
  checklistLibraryList,
  assetList,
  children,
}: {
  maintenance: maintenance;
  checklistLibraryList: checklist_library[];
  assetList: asset[];
  children: React.ReactNode;
}) {
  const user = useSession();
  const router = useRouter();
  let [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistDescription, setNewChecklistDescription] = useState('');
  const [selectedSaveOption, setSelectedSaveOption] = useState(
    new Set(['saveOnly']),
  );
  // const [selectedFile, setSelectedFile] = useState(null);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  function handleClose() {
    createChecklistClient();

    setOpenAddChecklist(false);
    setNewChecklistTitle('');
    setNewChecklistDescription('');
    setSelectedSaveOption(new Set(['saveOnly']));
    setOpenAddChecklist(!openAddChecklist);
  }

  async function createChecklistClient() {
    if (user.data?.user.id === undefined || user.data?.user.id === null) {
      console.error('not found');
      return;
    }

    const newChecklist = {
      uid: `CL-${moment().format('YYMMDDHHmmssSSS')}`,
      created_by: user.data.user.id,
      created_on: new Date(),
      updated_by: user.data.user.id,
      updated_on: new Date(),
      maintenance_uid: maintenance.uid,
      color: null,
      icon: null,
      title: newChecklistTitle,
      description: newChecklistDescription,
    } satisfies checklist;

    startTransition(() => {
      createChecklist(newChecklist);
      if (!isPending) {
        toast.success('Checklist created');
        router.refresh();
      }
    });
  }

  // function handleButtonClick() {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // }

  // function handleFileChange(event: any) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // }

  // async function importExcel() {
  //   if (selectedFile) {
  //     const workbook = new Workbook();
  //     const reader = new FileReader();

  //     reader.onload = async (event: any) => {
  //       const buffer = event.target.result;
  //       await workbook.xlsx.load(buffer);
  //       //const worksheet = workbook.getWorksheet(1);
  //       const worksheet = workbook.worksheets[0];

  //       let simplifiedTask: SimplifiedTask[] = [];

  //       for (let index = 9; index <= worksheet.rowCount; index++) {
  //         const row = worksheet.getRow(index);

  //         const task: SimplifiedTask = {
  //           no: row.getCell(1).value as number,
  //           uid: row.getCell(2).value as string,
  //           taskActivity: 'Monkey',
  //           remarks: 'remarks',
  //           isComplete: '/',
  //         };

  //         simplifiedTask.push(task);
  //       }

  //       console.log(simplifiedTask);

  //       setTimeout(() => {
  //         //loading false
  //       }, 3000);

  //       reader.readAsArrayBuffer(selectedFile);
  //       setSelectedFile(null);
  //     };
  //   } else {
  //     console.log('other value');
  //   }
  // }

  async function exportToExcel() {
    const workbook = new Workbook();
    const worksheetName = `${maintenance.uid}`;
    const filename = `Maintenance-${maintenance.uid}`;
    const title = `Maintenance ${maintenance.uid}`;
    const columns: Partial<Column>[] = [
      { key: 'no', width: 5 },
      { key: 'uid', width: 20 },
      { key: 'taskActivity', width: 40 },
      { key: 'remarks', width: 20 },
      { key: 'isComplete', width: 13, alignment: { horizontal: 'center' } },
      { key: 'F' },
      { key: 'G' },
      { key: 'H' },
      { key: 'I' },
      { key: 'J' },
      { key: 'K' },
      { key: 'L' },
      { key: 'M' },
      { key: 'N' },
      { key: 'O' },
    ];
    const borderWidth: Partial<Border> = { style: 'thin' };

    const checklistResult: Result<checklist[]> = await fetch(
      `/api/checklist?maintenance_uid=${maintenance.uid}`,
    ).then(res => res.json());

    if (
      checklistResult.statusCode !== 200 ||
      checklistResult.data === undefined
    )
      throw new Error(checklistResult.statusMessage);

    const saveExcel = async () => {
      try {
        let rowTracker = 7;
        const worksheet = workbook.addWorksheet(worksheetName);
        worksheet.columns = columns;
        const taskId = worksheet.getColumn('O');
        taskId.hidden = true;
        worksheet.mergeCells('A1:D1');

        const titleCell: Cell = worksheet.getCell('A1');
        titleCell.value = title;
        titleCell.font = { name: 'Calibri', size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

        const imageId = workbook.addImage({
          base64: base64Image,
          extension: 'png',
        });

        worksheet.addImage(imageId, {
          tl: { col: 4.99, row: 0.1 },
          ext: { width: 53, height: 55 },
        });
        worksheet.getRow(1).height = 45;

        // Row 3
        worksheet.mergeCells('A3:B3');
        worksheet.mergeCells('C3:E3');
        worksheet.getCell('A3').value = 'Date';
        worksheet.getCell('C3').value = moment(maintenance.date).format(
          'DD/MM/YYYY',
        );

        // Row 4
        worksheet.mergeCells('A4:B4');
        worksheet.mergeCells('C4:E4');
        worksheet.getCell('A4').value = 'Location';
        worksheet.getCell('C4').value = maintenance.approved_by;

        // Row 5
        worksheet.mergeCells('A5:B5');
        worksheet.mergeCells('C5:E5');
        worksheet.getCell('A5').value = 'Tag No.';
        worksheet.getCell('C5').value = maintenance.attachment_path;

        // Row 6
        worksheet.mergeCells('A6:B6');
        worksheet.mergeCells('C6:E6');
        worksheet.getCell('A6').value = 'Maintenance No.';
        worksheet.getCell('C6').value = maintenance.uid;

        // Row 7
        worksheet.addRow([]);

        if (!checklistResult.data) {
          return;
        }

        for (const checklist of checklistResult.data) {
          const taskListResult: Result<task[]> = await fetch(
            `/api/task?checklist_uid=${checklist.uid}`,
          ).then(res => res.json());

          if (!taskListResult.data) return;

          worksheet.addRow([checklist.title]);
          rowTracker++;
          worksheet.getRow(rowTracker).font = {
            name: 'Calibri',
            size: 11,
            bold: true,
          };
          worksheet.mergeCells(`A${rowTracker}:E${rowTracker}`);
          worksheet.getRow(rowTracker).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };

          worksheet.addRow(['No.', 'Task', 'Description', 'Remarks', 'Value']);
          rowTracker++;
          worksheet.getRow(rowTracker).font = {
            name: 'Calibri',
            size: 11,
            bold: true,
          };
          worksheet.getRow(rowTracker).eachCell((cell: Cell) => {
            cell.border = {
              top: borderWidth,
              left: borderWidth,
              bottom: borderWidth,
              right: borderWidth,
            };
          });

          for (const task of taskListResult.data) {
            worksheet.addRow([
              task.task_order,
              task.task_activity ?? '',
              task.description ?? '',
              task.remarks ?? ' ',
            ]);
            rowTracker++;
            worksheet.getCell(`O${rowTracker}`).value = task.uid;

            switch (task.task_type) {
              case 'selectMultiple':
              case 'selectOne':
                worksheet.getCell(`E${rowTracker}`).value = 'Select One';
                worksheet.getCell(`E${rowTracker}`).dataValidation = {
                  type: 'list',
                  allowBlank: true,
                  formulae: [`"${task.list_choice}"`],
                  showInputMessage: true,
                  promptTitle: 'Select',
                  prompt: 'Please select value(s)',
                };
                break;

              case 'number':
                worksheet.getCell(`E${rowTracker}`).value = 0;
                worksheet.getCell(`E${rowTracker}`).dataValidation = {
                  type: 'decimal',
                  allowBlank: true,
                  formulae: [],
                  showInputMessage: true,
                  promptTitle: 'Number',
                  prompt: 'The value must be in number',
                };
                break;

              case 'check':
                worksheet.getCell(`E${rowTracker}`).value = 'Incomplete';
                worksheet.getCell(`E${rowTracker}`).dataValidation = {
                  type: 'list',
                  allowBlank: false,
                  formulae: [`"Completed, Incomplete"`],
                  showInputMessage: true,
                  promptTitle: 'Check',
                  prompt: 'Check if completed',
                };
                break;

              case 'choice':
                worksheet.getCell(`E${rowTracker}`).value = 'False';
                worksheet.getCell(`E${rowTracker}`).dataValidation = {
                  type: 'list',
                  allowBlank: false,
                  formulae: [`"True, False"`],
                  showInputMessage: true,
                  promptTitle: 'Choice',
                  prompt: 'Select true or false',
                };
                break;

              default:
                worksheet.getCell(`E${rowTracker}`).value = 'Invalid';
                break;
            }

            worksheet.getRow(rowTracker).font = {
              name: 'Calibri',
              size: 11,
            };

            worksheet.getRow(rowTracker).eachCell((cell: Cell) => {
              cell.border = {
                top: borderWidth,
                left: borderWidth,
                bottom: borderWidth,
                right: borderWidth,
              };
            });

            if (task.have_subtask) {
              const subtaskListResult: Result<subtask[]> = await fetch(
                `/api/subtask?task_uid=${task.uid}`,
              ).then(res => res.json());

              if (!subtaskListResult.data) return;

              console.log(subtaskListResult.data);

              for (const subtask of subtaskListResult.data) {
                const roman = convertToRoman(subtask.task_order);
                worksheet.addRow([
                  roman,
                  subtask.task_activity ?? '',
                  subtask.description ?? '',
                  subtask.remarks ?? '',
                ]);
                rowTracker++;
                worksheet.getCell(`O${rowTracker}`).value = subtask.uid;

                switch (subtask.task_type) {
                  case 'selectMultiple':
                  case 'selectOne':
                    worksheet.getCell(`E${rowTracker}`).value = 'Select One';
                    worksheet.getCell(`E${rowTracker}`).dataValidation = {
                      type: 'list',
                      allowBlank: true,
                      formulae: [`"${subtask.list_choice}"`],
                      showInputMessage: true,
                      promptTitle: 'Select',
                      prompt: 'Please select value(s)',
                    };
                    break;

                  case 'number':
                    worksheet.getCell(`E${rowTracker}`).value = 0;
                    worksheet.getCell(`E${rowTracker}`).dataValidation = {
                      type: 'decimal',
                      allowBlank: true,
                      formulae: [],
                      showInputMessage: true,
                      promptTitle: 'Number',
                      prompt: 'The value must be in number',
                    };
                    break;

                  case 'choice':
                    worksheet.getCell(`E${rowTracker}`).value = 'False';
                    worksheet.getCell(`E${rowTracker}`).dataValidation = {
                      type: 'list',
                      allowBlank: false,
                      formulae: [`"True, False"`],
                      showInputMessage: true,
                      promptTitle: 'Choice',
                      prompt: 'Select true or false',
                    };
                    break;

                  case 'check':
                    worksheet.getCell(`E${rowTracker}`).value = 'Incomplete';
                    worksheet.getCell(`E${rowTracker}`).dataValidation = {
                      type: 'list',
                      allowBlank: false,
                      formulae: [`"Completed, Incomplete"`],
                      showInputMessage: true,
                      promptTitle: 'Check',
                      prompt: 'Check if completed',
                    };
                    break;

                  default:
                    worksheet.getCell(`E${rowTracker}`).value = 'Invalid';
                    break;
                }

                worksheet.getRow(rowTracker).eachCell((cell: Cell) => {
                  cell.border = {
                    top: borderWidth,
                    left: borderWidth,
                    bottom: borderWidth,
                    right: borderWidth,
                  };
                });
              }
            }
          }

          worksheet.addRow([]);
          rowTracker++;
        }

        // Border for title
        for (let i = 1; i <= 5; i++) {
          const cell = worksheet.getRow(1).getCell(i);
          cell.border = {
            top: borderWidth,
            bottom: borderWidth,
          };

          if (i === 1) {
            cell.border.left = borderWidth;
          } else if (i === 5) {
            cell.border.right = borderWidth;
          }
        }

        // Border for header
        for (let i = 3; i <= 6; i++) {
          worksheet.getRow(i).eachCell((cell: Cell) => {
            cell.border = {
              top: borderWidth,
              left: borderWidth,
              bottom: borderWidth,
              right: borderWidth,
            };
          });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${filename}.xlsx`);
      } catch (error) {
        console.error(error);
      } finally {
        workbook.removeWorksheet(worksheetName);
      }
    };

    await saveExcel();
    toast.success('Excel file downloaded🎉');
  }

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
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
          startContent={<LuChevronLeft />}
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
                    onClick={handleClose}
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
            <LuPencilLine />
          </Button>
          <Button isIconOnly variant="faded">
            <FaRegFilePdf />
          </Button>
          <Button isIconOnly variant="faded" onClick={exportToExcel}>
            <FaRegFileExcel />
          </Button>
        </div>
      </div>
      <Divider />
      <Card className="rounded-md mt-4">
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          <div className="flex-shrink-0 w-full">{children}</div>
        </div>
      </Card>
    </Card>
  );
}
