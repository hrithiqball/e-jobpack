import { Card } from '@nextui-org/react';
import { FilePenLine } from 'lucide-react';

export default function ChecklistWidget() {
  return (
    <div className="flex flex-1 p-2">
      <Card shadow="none" className="flex flex-1 p-4">
        <div className="flex flex-row items-center">
          <FilePenLine />
          <span className="font-bold ml-4">Checklist</span>
        </div>
      </Card>
    </div>
  );
}
