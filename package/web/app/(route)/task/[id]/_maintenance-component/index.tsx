/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  useState,
  useTransition,
  useEffect,
  Key,
  useRef,
  ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { Asset, ChecklistLibrary } from '@prisma/client';
import { Workbook } from 'exceljs';
import dayjs from 'dayjs';

import { Button, ButtonGroup, Divider } from '@nextui-org/react';

import { FileUp, FolderSync } from 'lucide-react';
import { toast } from 'sonner';

import { SimplifiedTask } from '@/types/simplified-task';
import { MaintenanceItem } from '@/types/maintenance';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

import { updateMaintenance } from '@/lib/actions/maintenance';

import MaintenanceRejectConfirmation from './reject-confirmation';
import MaintenanceAddChecklistModal from './add-checklist';
import MaintenanceTableInfo from './info-table';
import MaintenanceRequestForm from './request-form';
import MaintenanceExport from './export';
import MaintenanceAddAttachment from './add-attachment';
import ChecklistComponent from './_checklist-component';
import MaintenanceDropdown from './dropdown';

type MaintenanceComponentProps = {
  maintenance: MaintenanceItem;
  checklistLibraryList: ChecklistLibrary[];
  assetList: Asset[];
};

export default function MaintenanceComponent({
  maintenance,
  checklistLibraryList,
  assetList,
}: MaintenanceComponentProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { setMaintenance } = useMaintenanceStore();

  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState(false);
  const [openExportMaintenance, setOpenExportMaintenance] = useState(false);
  const [openAddAttachment, setOpenAddAttachment] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setMaintenance(maintenance);
  }, [setMaintenance, maintenance]);

  const selectedSaveOptionCurrent = Array.from(new Set(['saveOnly']))[0];

  function handleAction(key: Key) {
    switch (key) {
      case 'add-checklist':
        setOpenAddChecklist(!openAddChecklist);
        break;

      case 'download-excel':
        // handleDownloadExcel();
        break;

      case 'upload-excel':
        break;

      case 'download-pdf':
        break;

      case 'reopen-maintenance':
        break;

      case 'mark-complete':
        handleMarkMaintenanceComplete();
        break;

      case 'export-maintenance':
        setOpenExportMaintenance(!openExportMaintenance);
        break;

      case 'add-attachment':
        setOpenAddAttachment(!openAddAttachment);
        break;

      case 'approve-completion':
        handleApproveCompletionMaintenance();
        break;
    }
  }

  function handleApproveCompletionMaintenance() {
    if (!user || !user.id) {
      console.error('session expired');
      return;
    }

    startTransition(() => {
      toast.promise(
        updateMaintenance(maintenance.id, {
          approvedById: user.id,
          maintenanceStatus: 'APPROVED',
          approvedOn: dayjs().toDate(),
        }),
        {
          loading: 'Approving maintenance...',
          success: () => {
            router.refresh();
            return 'Maintenance approved!';
          },
          error: 'Failed to approve maintenance 😥',
        },
      );
    });
  }

  function handleCloseExportMaintenance() {
    setOpenExportMaintenance(false);
    router.refresh();
  }

  function handleMarkMaintenanceComplete() {
    if (user === undefined || user.id === null) {
      console.error('session expired');
      return;
    }

    startTransition(() => {
      toast.promise(
        updateMaintenance(maintenance.id, {
          closedOn: new Date(),
          isClose: true,
          closedById: user.id,
          maintenanceStatus: 'CLOSED',
        }),
        {
          loading: 'Closing maintenance...',
          success: () => {
            router.refresh();
            return 'Maintenance closed!';
          },
          error: 'Failed to close maintenance 😥',
        },
      );
    });
  }

  function handleApproveMaintenance() {
    if (user === undefined || user.id === undefined) {
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
    router.refresh();
  }

  function handleCloseAddAttachment() {
    setOpenAddAttachment(false);
  }

  function handleRejectMaintenance() {
    setOpenRejectConfirmation(true);
  }

  function handleCloseRejectConfirmation() {
    setOpenRejectConfirmation(false);
    router.refresh();
  }

  function handleUploadExcel() {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files;
      if (file !== null) {
        if (file[0] !== undefined) {
          setSelectedFile(file[0]);
        }
      }
    };
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
        if (worksheet === undefined) {
          toast.error('Invalid excel file!');
          return;
        }

        const simplifiedTask: SimplifiedTask[] = [];

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

  return (
    <div className="flex-grow rounded-md">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-medium font-semibold sm:text-xl">
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
                onChange={handleUploadExcel}
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
          <MaintenanceDropdown handleAction={handleAction} />
        </div>
      </div>
      {maintenance.isRequested && (
        <MaintenanceRequestForm
          handleApproveMaintenance={handleApproveMaintenance}
          handleRejectMaintenance={handleRejectMaintenance}
          transitioning={transitioning}
        />
      )}
      <div className="my-4 flex flex-col ">
        <MaintenanceTableInfo />
        <div className="flex flex-row space-x-1">
          <MaintenanceAddChecklistModal
            open={openAddChecklist}
            onClose={handleCloseAddChecklist}
            assetList={assetList.filter(
              asset =>
                !asset.isArchive &&
                !maintenance.checklist.some(c => c.assetId === asset.id),
            )}
            checklistLibraryList={checklistLibraryList}
            selectedSaveOptionCurrent={selectedSaveOptionCurrent ?? ''}
          />
        </div>
      </div>
      <Divider />
      <div className="mt-4 rounded-md">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="w-full flex-shrink-0 rounded-2xl p-1">
            <ChecklistComponent checklistList={maintenance.checklist} />
          </div>
        </div>
      </div>
      <MaintenanceRejectConfirmation
        open={openRejectConfirmation}
        onClose={handleCloseRejectConfirmation}
      />
      <MaintenanceExport
        open={openExportMaintenance}
        onClose={handleCloseExportMaintenance}
      />
      <MaintenanceAddAttachment
        open={openAddAttachment}
        onClose={handleCloseAddAttachment}
      />
    </div>
  );
}
