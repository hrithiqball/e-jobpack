import { ChangeEvent, useEffect, useState, useTransition } from 'react';

import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';
import { updateTask } from '@/lib/actions/task';
import { Button } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
type TaskRemarkProps = {
  remarks: string | null;
  taskId: string;
};

export default function TaskRemark({ remarks, taskId }: TaskRemarkProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const [observableValue, setObservableValue] = useState(remarks || '');
  const [remarksVal, setRemarksVal] = useState(remarks || '');
  const [debouncedRemarks] = useDebounce(remarksVal, 2000);

  useEffect(() => {
    if (observableValue === debouncedRemarks) return;

    setObservableValue(debouncedRemarks);

    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(
        updateTask(taskId, user.id, { remarks: debouncedRemarks }),
        {
          loading: 'Updating remarks',
          success: () => {
            return 'Issue updated';
          },
          error: 'Failed to update remarks',
        },
      );
    });
  }, [debouncedRemarks, observableValue, taskId, user]);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setRemarksVal(event.target.value);
  }

  function clearInput() {
    setRemarksVal('');
  }

  return (
    <div className="flex items-center space-x-4">
      <Input value={remarksVal} onChange={onChange} />
      <Button
        isIconOnly
        variant="light"
        isDisabled={remarksVal === '' || !remarksVal || transitioning}
        onClick={clearInput}
      >
        <div
          className={cn('cursor-pointer', {
            hidden: remarksVal === '' || !remarksVal,
          })}
        >
          <X size={18} />
        </div>
      </Button>
    </div>
  );
}