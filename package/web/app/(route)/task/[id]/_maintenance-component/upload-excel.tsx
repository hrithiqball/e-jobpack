import { useState } from 'react';
import { Workbook } from 'exceljs';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { SimplifiedTask } from '@/types/simplified-task';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Label } from '@/components/ui/label';

type MaintenanceUploadExcelProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceUploadExcel({
  open,
  onClose,
}: MaintenanceUploadExcelProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleUploadExcel() {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files;
      if (file !== null) {
        if (file[0]) {
          setSelectedFile(file[0]);
        }
      }
    };
  }

  async function handleSyncExcel() {
    if (selectedFile) {
      const workbook = new Workbook();
      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        if (!event.target) {
          return;
        }

        const buffer = event.target.result as ArrayBuffer;
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
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

        setTimeout(() => {}, 3000);

        reader.readAsArrayBuffer(selectedFile);
        setSelectedFile(null);
      };
    } else {
      console.log('other value');
    }
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Excel Upload</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-3">
            <Label htmlFor="excel-file" className="font-semibold">
              Upload Excel File
            </Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleUploadExcel}
            />
          </div>
          {selectedFile && (
            <Button onClick={handleSyncExcel}>Extract Data</Button>
          )}
        </div>
        <SheetFooter>
          <Button>Confirm & Synchronize</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Excel</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Confirm & Synchronize</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
