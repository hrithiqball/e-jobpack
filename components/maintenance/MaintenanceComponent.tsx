'use client';

import React, {
  useState,
  useTransition,
  ReactNode,
  Key,
  useRef,
  ChangeEvent,
} from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Asset,
  Checklist,
  ChecklistLibrary,
  Maintenance,
  Subtask,
  Task,
} from '@prisma/client';

import {
  Button,
  ButtonGroup,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import {
  AlarmClock,
  Check,
  CheckCircle2,
  ChevronLeft,
  Contact2,
  FileBox,
  FileDown,
  FileUp,
  FolderSync,
  MoreVertical,
  PackagePlus,
  Table2,
  X,
} from 'lucide-react';
import { Border, Cell, Column, Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import { base64Image } from '@/public/client-icon-base64';
import { Result } from '@/lib/function/result';
import { convertToRoman } from '@/lib/function/convertToRoman';
import {
  fetchMutatedMaintenanceItem,
  updateMaintenance,
} from '@/lib/actions/maintenance';
import { useCurrentRole } from '@/hooks/use-current-role';
import { SimplifiedTask } from '@/types/simplified-task';
import { useMediaQuery } from '@/hooks/use-media-query';
import MaintenanceRejectConfirmation from '@/components/maintenance/MaintenanceRejectConfirmation';
import MaintenanceAddChecklistModal from './MaintenanceAddChecklistModal';

interface MaintenanceComponentProps {
  mutatedMaintenance: Awaited<ReturnType<typeof fetchMutatedMaintenanceItem>>;
  maintenance: Maintenance;
  checklistLibraryList: ChecklistLibrary[];
  assetList: Asset[];
  children: ReactNode;
}

export default function MaintenanceComponent({
  mutatedMaintenance,
  maintenance,
  checklistLibraryList,
  assetList,
  children,
}: MaintenanceComponentProps) {
  let [isPending, startTransition] = useTransition();
  const user = useSession();
  const router = useRouter();
  const role = useCurrentRole();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectedSaveOptionCurrent = Array.from(new Set(['saveOnly']))[0];

  function handleAction(key: Key) {
    switch (key) {
      case 'add-asset':
        setOpenAddChecklist(!openAddChecklist);
        break;

      case 'edit-asset':
        //TODO enable edit asset
        break;

      case 'download-excel':
        // handleDownloadExcel();
        console.log(mutatedMaintenance);
        break;

      case 'upload-excel':
        //TODO: for mobile display modal and add excel file and upload
        break;

      // TODO enable download pdf
      // case 'download-pdf':
      //   return <MaintenanceForm maintenance={maintenance} />;
      case 'mark-complete':
        handleMarkMaintenanceComplete();
        break;

      default:
        break;
    }
  }

  function handleMarkMaintenanceComplete() {
    if (
      user.data === null ||
      user.data?.user.id === undefined ||
      user.data?.user.id === null
    ) {
      console.error('session expired');
      return;
    }

    startTransition(() => {
      updateMaintenance(maintenance.id, {
        closedOn: new Date(),
        isClose: true,
        closedById: user.data.user.id,
      }).then(res => console.log(res));
    });
  }

  function handleApproveMaintenance() {
    if (
      user.data === null ||
      user.data?.user.id === undefined ||
      user.data?.user.id === null
    ) {
      console.error('session expired');
      return;
    }

    startTransition(() => {
      toast.promise(
        updateMaintenance(maintenance.id, {
          isRequested: false,
          isOpen: true,
        }),
        {
          loading: 'Approving maintenance...',
          success: res => {
            router.refresh();
            console.log(res);
            return 'Maintenance approved! Technician can now start working on it.';
          },
          error: 'Failed to approve maintenance 😥',
        },
      );
    });
  }

  function handleCloseAddChecklist() {
    setOpenAddChecklist(false);
  }

  function handleRejectMaintenance() {
    setOpenRejectConfirmation(true);
  }

  function handleCloseRejectConfirmation() {
    setOpenRejectConfirmation(false);
    router.refresh();
  }

  function handleUploadExcel(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files;

    if (file !== null) {
      setSelectedFile(file[0]);
    }
  }

  async function handleSyncExcel() {
    if (selectedFile) {
      const workbook = new Workbook();
      const reader = new FileReader();

      reader.onload = async (event: any) => {
        const buffer = event.target.result;
        await workbook.xlsx.load(buffer);
        //const worksheet = workbook.getWorksheet(1);
        const worksheet = workbook.worksheets[0];

        let simplifiedTask: SimplifiedTask[] = [];

        for (let index = 9; index <= worksheet.rowCount; index++) {
          const row = worksheet.getRow(index);

          const task: SimplifiedTask = {
            no: row.getCell(1).value as number,
            uid: row.getCell(2).value as string,
            taskActivity: 'Monkey',
            remarks: 'remarks',
            isComplete: '/',
          };

          simplifiedTask.push(task);
        }

        console.log(simplifiedTask);

        setTimeout(() => {
          //loading false
        }, 3000);

        reader.readAsArrayBuffer(selectedFile);
        setSelectedFile(null);
      };
    } else {
      console.log('other value');
    }
  }

  // eslint-disable-next-line no-unused-vars
  async function handleDownloadExcel() {
    const workbook = new Workbook();
    const worksheetName = `${maintenance.id}`;
    const filename = `Maintenance-${maintenance.id}`;
    const title = `Maintenance ${maintenance.id}`;
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

    const checklistResult: Result<Checklist[]> = await fetch(
      `/api/checklist?maintenanceId=${maintenance.id}`,
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
        worksheet.getCell('C3').value = dayjs(maintenance.date).format(
          'DD/MM/YYYY',
        );

        // Row 4
        worksheet.mergeCells('A4:B4');
        worksheet.mergeCells('C4:E4');
        worksheet.getCell('A4').value = 'Location';
        worksheet.getCell('C4').value = maintenance.approvedById;

        // Row 5
        worksheet.mergeCells('A5:B5');
        worksheet.mergeCells('C5:E5');
        worksheet.getCell('A5').value = 'Tag No.';
        worksheet.getCell('C5').value = maintenance.attachmentPath;

        // Row 6
        worksheet.mergeCells('A6:B6');
        worksheet.mergeCells('C6:E6');
        worksheet.getCell('A6').value = 'Maintenance No.';
        worksheet.getCell('C6').value = maintenance.id;

        // Row 7
        worksheet.addRow([]);

        if (!checklistResult.data) {
          return;
        }

        for (const checklist of checklistResult.data) {
          const taskListResult: Result<Task[]> = await fetch(
            `/api/task?checklistId=${checklist.id}`,
          ).then(res => res.json());

          if (!taskListResult.data) return;

          worksheet.addRow([checklist.assetId]);
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
              task.taskOrder,
              task.taskActivity ?? '',
              task.description ?? '',
              task.remarks ?? ' ',
            ]);
            rowTracker++;
            worksheet.getCell(`O${rowTracker}`).value = task.id;

            switch (task.taskType) {
              case 'selectMultiple':
              case 'selectOne':
                worksheet.getCell(`E${rowTracker}`).value = 'Select One';
                worksheet.getCell(`E${rowTracker}`).dataValidation = {
                  type: 'list',
                  allowBlank: true,
                  formulae: [`"${task.listChoice}"`],
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

            if (task.haveSubtask) {
              const subtaskListResult: Result<Subtask[]> = await fetch(
                `/api/subtask?taskId=${task.id}`,
              ).then(res => res.json());

              if (!subtaskListResult.data) return;

              console.log(subtaskListResult.data);

              for (const subtask of subtaskListResult.data) {
                const roman = convertToRoman(subtask.taskOrder);
                worksheet.addRow([
                  roman,
                  subtask.taskActivity ?? '',
                  subtask.description ?? '',
                  subtask.remarks ?? '',
                ]);
                rowTracker++;
                worksheet.getCell(`O${rowTracker}`).value = subtask.id;

                switch (subtask.taskType) {
                  case 'selectMultiple':
                  case 'selectOne':
                    worksheet.getCell(`E${rowTracker}`).value = 'Select One';
                    worksheet.getCell(`E${rowTracker}`).dataValidation = {
                      type: 'list',
                      allowBlank: true,
                      formulae: [`"${subtask.listChoice}"`],
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

  return (
    <div className="rounded-md flex-grow">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            className="max-w-min"
            as={Link}
            href="/task"
            startContent={<ChevronLeft size={18} />}
            variant="faded"
            size="sm"
          >
            Back
          </Button>
          <h2 className="text-medium sm:text-xl font-semibold">
            {maintenance.id}
          </h2>
        </div>
        <div className="space-x-2 sm:space-x-4">
          {isDesktop && !maintenance.isRequested && (
            <ButtonGroup>
              <Button
                size="sm"
                variant="faded"
                startContent={<FileUp size={18} />}
              >
                Upload Excel
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleUploadExcel(e)
                }
              />
              <Button
                size="sm"
                variant="faded"
                isIconOnly
                onClick={handleSyncExcel}
              >
                <FolderSync size={18} />
              </Button>
            </ButtonGroup>
          )}
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <MoreVertical size={18} />
              </Button>
            </DropdownTrigger>
            {isDesktop ? (
              <DropdownMenu
                disabledKeys={
                  role === 'ADMIN' || role === 'SUPERVISOR'
                    ? []
                    : ['add-asset', 'edit-maintenance']
                }
                onAction={handleAction}
              >
                <DropdownItem
                  key="add-asset"
                  startContent={<PackagePlus size={18} />}
                >
                  Add Asset
                </DropdownItem>
                <DropdownItem
                  key="edit-maintenance"
                  startContent={<FileBox size={18} />}
                >
                  Edit Asset
                </DropdownItem>
                <DropdownItem
                  key="download-excel"
                  startContent={<FileDown size={18} />}
                >
                  {/* TODO: Should not be here if its a request */}
                  Download Excel
                </DropdownItem>
                <DropdownItem
                  key="download-pdf"
                  startContent={<Table2 size={18} />}
                >
                  Download PDF
                </DropdownItem>
                <DropdownItem
                  key="mark-complete"
                  className="text-success"
                  color="success"
                  startContent={<CheckCircle2 size={18} />}
                >
                  Mark as Complete
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu
                disabledKeys={
                  role === 'ADMIN' || role === 'SUPERVISOR'
                    ? []
                    : ['add-asset', 'edit-maintenance']
                }
                onAction={handleAction}
              >
                <DropdownItem
                  key="add-asset"
                  startContent={<PackagePlus size={18} />}
                >
                  Add Asset
                </DropdownItem>
                <DropdownItem
                  key="edit-maintenance"
                  startContent={<FileBox size={18} />}
                >
                  Edit Asset
                </DropdownItem>
                <DropdownItem
                  key="download-excel"
                  startContent={<FileDown size={18} />}
                >
                  Download Excel
                </DropdownItem>
                <DropdownItem
                  key="upload-excel"
                  startContent={<FileUp size={18} />}
                >
                  Upload Excel
                </DropdownItem>
                <DropdownItem
                  key="download-pdf"
                  startContent={<Table2 size={18} />}
                >
                  {/* TODO: figure out how to optimize this behavior */}
                  {/* <MaintenanceForm maintenance={maintenance} /> */}
                  Download PDF
                </DropdownItem>
                <DropdownItem
                  key="mark-complete"
                  className="text-success"
                  color="success"
                  startContent={<CheckCircle2 size={18} />}
                >
                  Mark as Complete
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </div>
      </div>
      {maintenance.isRequested && (
        <div className="flex items-center mt-4 px-4 py-2 rounded bg-white dark:bg-zinc-700 justify-between ">
          <span className="text-medium font-medium">
            Approve this maintenance request by {maintenance.requestedById}
          </span>
          <ButtonGroup>
            <Button
              size="sm"
              variant="faded"
              color="success"
              startContent={<Check size={18} />}
              onClick={handleApproveMaintenance}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="faded"
              color="danger"
              startContent={<X size={18} />}
              onClick={handleRejectMaintenance}
            >
              Reject
            </Button>
          </ButtonGroup>
        </div>
      )}
      <div className="flex flex-col my-4 ">
        <Table isStriped removeWrapper hideHeader aria-label="Asset info table">
          <TableHeader>
            <TableColumn>Key</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="deadline">
              <TableCell className="flex items-center space-x-2">
                <AlarmClock size={18} />
                <span className="font-bold">Deadline</span>
              </TableCell>
              <TableCell>
                <span>
                  {maintenance.deadline
                    ? dayjs(maintenance.deadline).format('DD/MM/YYYY hh:mmA')
                    : 'Not Specified'}
                </span>
              </TableCell>
            </TableRow>
            <TableRow key="person-in-charge">
              <TableCell className="flex items-center space-x-2">
                <Contact2 size={18} />
                <span className="font-bold">Person in charge</span>
              </TableCell>
              <TableCell>
                <span>Harith Iqbal</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex flex-row space-x-1">
          <MaintenanceAddChecklistModal
            maintenance={mutatedMaintenance}
            open={openAddChecklist}
            onClose={handleCloseAddChecklist}
            assetList={assetList}
            checklistLibraryList={checklistLibraryList}
            selectedSaveOptionCurrent={selectedSaveOptionCurrent}
          />
        </div>
      </div>
      <Divider />
      <div className="rounded-md mt-4">
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-shrink-0 w-full p-1 rounded-2xl">{children}</div>
        </div>
      </div>
      <MaintenanceRejectConfirmation
        open={openRejectConfirmation}
        onClose={handleCloseRejectConfirmation}
        maintenance={maintenance}
      />
    </div>
  );
}
