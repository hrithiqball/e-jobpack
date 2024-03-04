import { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { X } from 'lucide-react';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';

import { updateTask } from '@/lib/actions/task';
import { cn } from '@/lib/utils';
import { TaskItem } from '@/types/task';
type TaskRemarkProps = {
  task: TaskItem;
};

export default function TaskRemark({ task }: TaskRemarkProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const [observableValue, setObservableValue] = useState(task.remarks || '');
  const [remarksVal, setRemarksVal] = useState(task.remarks || '');
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
        updateTask(task.id, user.id, { remarks: debouncedRemarks }),
        {
          loading: 'Updating remarks',
          success: () => {
            return 'Issue updated';
          },
          error: 'Failed to update remarks',
        },
      );
    });
  }, [debouncedRemarks, observableValue, task.id, user]);

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
        size="icon"
        variant="ghost"
        disabled={remarksVal === '' || !remarksVal || transitioning}
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
