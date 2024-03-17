import { ChangeEvent, useState, useEffect, useTransition } from 'react';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { X } from 'lucide-react';
import { toast } from 'sonner';

import { TaskItem } from '@/types/task';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateTask } from '@/data/task.action';
import { cn } from '@/lib/utils';

type TaskIssueProps = {
  task: TaskItem;
};

export default function TaskIssue({ task }: TaskIssueProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const [observableValue, setObservableValue] = useState(task.issue || '');
  const [issueVal, setIssueVal] = useState(task.issue || '');
  const [debouncedIssue] = useDebounce(issueVal, 2000);

  useEffect(() => {
    if (observableValue === debouncedIssue) return;

    setObservableValue(debouncedIssue);

    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      toast.promise(updateTask(task.id, user.id, { issue: debouncedIssue }), {
        loading: 'Updating issue',
        success: () => {
          return 'Issue updated';
        },
        error: 'Failed to update issue',
      });
    });
  }, [debouncedIssue, observableValue, task.id, user]);

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
        size="icon"
        variant="ghost"
        disabled={issueVal === '' || !issueVal || transitioning}
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
