import { useUserStore } from '@/hooks/use-user.store';
import { Table, TableCell, TableRow } from '@/components/ui/table';
import { Loader } from '@/components/ui/loader';
import { convertToTitleCase } from '@/lib/function/string';

export default function UserDetails() {
  const { user } = useUserStore();

  if (!user) return <Loader />;

  return (
    <Table>
      <TableRow>
        <TableCell className="font-semibold">Name</TableCell>
        <TableCell>{user.name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-semibold">Email</TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-semibold">Phone</TableCell>
        <TableCell>{user.phone}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-semibold">Department</TableCell>
        <TableCell>{convertToTitleCase(user.department)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-semibold">Role</TableCell>
        <TableCell>{convertToTitleCase(user.role)}</TableCell>
      </TableRow>
    </Table>
  );
}
