import { Button } from '@/components/ui/button';
import { ChevronLeft, Receipt } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AddRecord from './add';

export default function Finance() {
  const [openAddRecord, setOpenAddRecord] = useState(false);

  function handleOpenAddRecord() {
    setOpenAddRecord(true);
  }

  function handleCloseAddRecord() {
    setOpenAddRecord(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin">
            <Button variant="outline" size="withIcon">
              <ChevronLeft size={18} />
              <p>Back</p>
            </Button>
          </Link>
        </div>
        <Button variant="outline" size="withIcon" onClick={handleOpenAddRecord}>
          <Receipt size={18} />
          <p>Add Record</p>
        </Button>
      </div>
      <AddRecord open={openAddRecord} onClose={handleCloseAddRecord} />
    </div>
  );
}
