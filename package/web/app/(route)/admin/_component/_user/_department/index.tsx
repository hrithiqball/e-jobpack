import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CreateDepartment from './create-department';
import { useDepartmentTypeStore } from '@/hooks/use-department-type.store';
import { Loader } from '@/components/ui/loader';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DepartmentType } from '@/types/department-enum';
import EditDepartment from './edit-department';

export default function DepartmentManagement() {
  const router = useRouter();

  const { departmentTypes, setDepartmentType } = useDepartmentTypeStore();

  const [openCreateDepartment, setOpenCreateDepartment] = useState(false);
  const [openEditDepartment, setOpenEditDepartment] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [departmentData, setDepartmentData] = useState(departmentTypes);

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(inputValue);
    const filteredDepartmentList = departmentTypes?.filter(department =>
      department.value.toLowerCase().includes(inputValue),
    );

    setDepartmentData(filteredDepartmentList);
  }

  function handleEditDepartment(department: DepartmentType) {
    setDepartmentType(department);
    setOpenEditDepartment(true);
  }

  function handleCloseEditDepartment() {
    setOpenEditDepartment(false);
  }

  function handleOpenDepartment() {
    setOpenCreateDepartment(true);
  }

  function handleCloseDepartment() {
    setOpenCreateDepartment(false);
  }

  if (!departmentData || !departmentTypes) {
    router.push('/admin');
    return <Loader />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin">
            <Button variant="outline" size="withIcon">
              <ChevronLeft size={18} />
              <p>Back</p>
            </Button>
          </Link>
          {departmentTypes.length > 0 && (
            <div className="flex items-center">
              <Search
                size={18}
                className="relative left-7 top-2 -translate-y-1/2"
              />
              <Input
                placeholder="Search"
                type="search"
                aria-label="Search user list"
                value={searchInput}
                onChange={handleSearchInputChange}
                className="max-w-sm pl-8"
              />
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="withIcon"
          onClick={handleOpenDepartment}
        >
          <Plus size={18} />
          <p>Create Department</p>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>User Count</TableHead>
            <TableHead>Asset Count</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departmentData.map(department => (
            <TableRow key={department.id}>
              <TableCell>{department.value}</TableCell>
              <TableCell>{department.user.length}</TableCell>
              <TableCell>423</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={18} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 rounded-lg p-2">
                    <PopoverItem
                      onClick={() => handleEditDepartment(department)}
                      startContent={<Edit size={18} />}
                    >
                      Edit
                    </PopoverItem>
                    <PopoverItemDestructive startContent={<Trash2 size={18} />}>
                      Delete
                    </PopoverItemDestructive>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreateDepartment
        open={openCreateDepartment}
        onClose={handleCloseDepartment}
      />
      <EditDepartment
        open={openEditDepartment}
        onClose={handleCloseEditDepartment}
      />
    </div>
  );
}
