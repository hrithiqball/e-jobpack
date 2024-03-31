import {
  AreaChart,
  Building2,
  DollarSign,
  HardHat,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import CreateUser from './create-user';
import { useState } from 'react';

export default function General() {
  const [openCreateUser, setOpenCreateUser] = useState(false);

  function handleOpenCreateUser() {
    setOpenCreateUser(true);
  }

  function handleCloseCreateUser() {
    setOpenCreateUser(false);
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/admin?section=user">
          <div className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card">
            <div className="flex items-center justify-between">
              <h1 className="group-hover:text-teal-600">User Management</h1>
              <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
                <Users />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500">
              Manage user details info, search user
            </p>
          </div>
        </Link>
        <Link href="/admin?section=verify">
          <div className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card">
            <div className="flex items-center justify-between">
              <h1 className="group-hover:text-teal-600">Verify User</h1>
              <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
                <UserRoundCheck />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500">
              Verify newly registered users, verify role requested
            </p>
          </div>
        </Link>
        <Link href="/admin?section=block">
          <div className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card">
            <div className="flex items-center justify-between">
              <h1 className="group-hover:text-teal-600">Block User</h1>
              <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
                <UserRoundX />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500">
              Unblock blocked users, suspend user access
            </p>
          </div>
        </Link>
        <div
          onClick={handleOpenCreateUser}
          className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card"
        >
          <div className="flex items-center justify-between">
            <h1 className="group-hover:text-teal-600">Create User</h1>
            <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
              <UserRoundPlus />
            </span>
          </div>
          <p className="text-sm font-normal text-gray-500">
            Create new user and automatically approved
          </p>
        </div>
        <Link href="/admin?section=department">
          <div className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card">
            <div className="flex items-center justify-between">
              <h1 className="group-hover:text-teal-600">
                Department Management
              </h1>
              <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
                <Building2 />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500">
              Manage department by creating, updating and delete
            </p>
          </div>
        </Link>
        <Link href="/admin?section=contractor">
          <div className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card">
            <div className="flex items-center justify-between">
              <h1 className="group-hover:text-teal-600">Contractor</h1>
              <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
                <HardHat />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500">
              Manage contractor details, register new contractor
            </p>
          </div>
        </Link>
        <Link href="/admin?section=kpi">
          <div className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card">
            <div className="flex items-center justify-between">
              <h1 className="group-hover:text-teal-600">
                Key Performance Indicator (KPI)
              </h1>
              <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
                <AreaChart />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500">
              View technician performance in graphical charts
            </p>
          </div>
        </Link>
        <Link href="/admin?section=finance">
          <div className="group flex cursor-pointer flex-col space-y-12 rounded-md bg-white p-4 text-lg font-semibold dark:bg-card">
            <div className="flex items-center justify-between">
              <h1 className="group-hover:text-teal-600">Financial</h1>
              <span className="group-hover:animate-appearance-in group-hover:text-teal-600">
                <DollarSign />
              </span>
            </div>
            <p className="text-sm font-normal text-gray-500">
              View reports and financial details
            </p>
          </div>
        </Link>
      </div>
      <CreateUser open={openCreateUser} onClose={handleCloseCreateUser} />
    </div>
  );
}
