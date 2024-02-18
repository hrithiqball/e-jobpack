import { ChangeEvent, useState, useEffect, useTransition } from 'react';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateTask } from '@/lib/actions/task';

type TaskIssueProps = {
  taskId: string;
  issue: string | null;
};

export default function TaskIssue({ issue, taskId }: TaskIssueProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const [observableValue, setObservableValue] = useState(issue || '');
  const [issueVal, setIssueVal] = useState(issue || '');
  const [debouncedIssue] = useDebounce(issueVal, 2000);

  useEffect(() => {
    if (observableValue === debouncedIssue) return;

    setObservableValue(debouncedIssue);

    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(updateTask(taskId, user.id, { issue: debouncedIssue }), {
        loading: 'Updating issue',
        success: () => {
          return 'Issue updated';
        },
        error: 'Failed to update issue',
      });
    });
  }, [debouncedIssue, observableValue, taskId, user]);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setIssueVal(event.target.value);
  }

  function clearInput() {
    setIssueVal('');
  }

  return (
    <div className="flex items-center space-x-4">
      <Input value={issueVal} onChange={onChange} />
      <Button
        isIconOnly
        variant="light"
        isDisabled={issueVal === '' || !issueVal || transitioning}
        onClick={clearInput}
      >
        <div
          className={cn('cursor-pointer', {
            hidden: issueVal === '' || !issueVal,
          })}
        >
          <X size={18} />
        </div>
      </Button>
    </div>
  );
}
