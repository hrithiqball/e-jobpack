'use client';

import { useState, useTransition, useEffect, Key } from 'react';
import { useRouter } from 'next/navigation';
import { ChecklistLibrary } from '@prisma/client';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import { Table2 } from 'lucide-react';
import { toast } from 'sonner';

import { MaintenanceItem } from '@/types/maintenance';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { updateMaintenance } from '@/data/maintenance.action';

import MaintenanceRejectConfirmation from './reject-confirmation';
import MaintenanceRequestForm from './request-form';
import MaintenanceExport from './export';
import MaintenanceAddAttachment from './add-attachment';
import MaintenanceDropdown from './dropdown';
import ChecklistComponent from './_checklist-component';
import MaintenanceUploadExcel from './upload-excel';
import EditMaintenance from './edit-maintenance';
import { useUserStore } from '@/hooks/use-user.store';
import InfoTable from '@/components/helper/info-table';
import { useAssetStore } from '@/hooks/use-asset.store';
import { AssetList } from '@/types/asset';
import AddChecklist from '@/components/helper/add-checklist';
import { Users } from '@/types/user';

type MaintenanceComponentProps = {
  maintenance: MaintenanceItem;
  checklistLibraryList: ChecklistLibrary[];
  assetList: AssetList;
  userList: Users;
};

export default function MaintenanceComponent({
  maintenance,
  assetList,
  userList,
}: MaintenanceComponentProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();
  const router = useRouter();

  const { setMaintenance } = useMaintenanceStore();
  const { setUserList } = useUserStore();
  const { setAssetList } = useAssetStore();

  const [openAddChecklist, setOpenAddChecklist] = useState(false);
  const [openRejectConfirmation, setOpenRejectConfirmation] = useState(false);
  const [openExportMaintenance, setOpenExportMaintenance] = useState(false);
  const [openAddAttachment, setOpenAddAttachment] = useState(false);
  const [openEditMaintenance, setOpenEditMaintenance] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  useEffect(() => {
    setMaintenance(maintenance);
    setUserList(userList);
    setAssetList(assetList);
  }, [
    setMaintenance,
    maintenance,
    setUserList,
    userList,
    setAssetList,
    assetList,
  ]);

  function handleAction(key: Key) {
    switch (key) {
      case 'add-checklist':
        setOpenAddChecklist(!openAddChecklist);
        break;

      case 'download-excel':
        // handleDownloadExcel();
        break;

      case 'edit-maintenance':
        setOpenEditMaintenance(true);
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
        setOpenExportMaintenance(true);
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

  function handleOpenExcel() {
    setOpenExcel(true);
  }

  function handleCloseAddAttachment() {
    setOpenAddAttachment(false);
  }

  function handleRejectMaintenance() {
    setOpenRejectConfirmation(true);
  }

  function handleCloseExcel() {
    setOpenExcel(false);
  }

  function handleCloseEditMaintenance() {
    setOpenEditMaintenance(false);
  }

  function handleCloseAddChecklist() {
    setOpenAddChecklist(false);
  }

  function handleCloseRejectConfirmation() {
    setOpenRejectConfirmation(false);
    router.refresh();
  }

  return (
    <div className="flex-grow space-y-4 rounded-md">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-medium font-semibold sm:text-xl">
            {maintenance.id}
          </h2>
        </div>
        <div className="space-x-2 sm:space-x-4">
          <Button variant="outline" size="withIcon" onClick={handleOpenExcel}>
            <Table2 size={18} />
            <p>Excel</p>
          </Button>
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
      <InfoTable />
      <hr />
      <div className="mt-4 rounded-md">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="w-full flex-shrink-0 rounded-2xl p-1">
            <ChecklistComponent checklistList={maintenance.checklist} />
          </div>
        </div>
      </div>
      <EditMaintenance
        open={openEditMaintenance}
        onClose={handleCloseEditMaintenance}
      />
      <AddChecklist
        open={openAddChecklist}
        onClose={handleCloseAddChecklist}
        assets={maintenance.checklist.map(c => c.assetId)}
      />
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
      <MaintenanceUploadExcel open={openExcel} onClose={handleCloseExcel} />
    </div>
  );
}
