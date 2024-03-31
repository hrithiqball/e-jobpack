import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function KpiManagement() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Link href="/admin">
          <Button variant="outline" size="withIcon">
            <ChevronLeft size={18} />
            <p>Back</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
