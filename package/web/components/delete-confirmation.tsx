import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type DeleteConfirmationProps = {
  open: boolean;
  onClose: (choice: boolean) => void;
};

export default function DeleteConfirmation({
  open,
  onClose,
}: DeleteConfirmationProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-red-200 dark:border-red-800">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <span>
          Are you sure you would like to delete? This action cannot be undone
        </span>
        <DialogFooter>
          <DialogClose onClick={() => onClose(false)}>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose onClick={() => onClose(true)} asChild>
            <Button variant="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
