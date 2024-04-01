import { Button } from '@/components/ui/button';
import { ChevronLeft, UserMinus2 } from 'lucide-react';
import Link from 'next/link';

export default function Block() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center">
        <Link href="/admin">
          <Button variant="outline" size="withIcon">
            <ChevronLeft size={18} />
            <p>Back</p>
          </Button>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <UserMinus2 />
          <p>No blocked user</p>
        </div>
      </div>
    </div>
  );
}
