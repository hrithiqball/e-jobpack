import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useContractorStore } from '@/hooks/use-contractor.store';
import { HardHat, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import RegisterContractor from './register';
import { Loader } from '@/components/ui/loader';
import Image from 'next/image';
import { baseServerUrl } from '@/public/constant/url';
import { isNullOrEmpty } from '@/lib/function/string';

export default function ContractorComponent() {
  const { contractors } = useContractorStore();

  const [searchInput, setSearchInput] = useState('');
  const [contractorData, setContractorData] = useState(contractors);
  const [openRegisterConstructor, setOpenRegisterConstructor] = useState(false);

  useEffect(() => {
    setContractorData(contractors);
  }, [contractors, setContractorData]);

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(event.target.value);
  }

  function handleOpenRegisterContractor() {
    setOpenRegisterConstructor(true);
  }

  function handleCloseRegisterContractor() {
    setOpenRegisterConstructor(false);
  }

  if (!contractorData) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Search
            size={18}
            className="relative left-7 top-2 -translate-y-1/2"
          />
          <Input
            placeholder="Search..."
            type="search"
            aria-label="Search contractor list"
            value={searchInput}
            onChange={handleSearchInputChange}
            className="max-w-sm pl-8"
          />
        </div>
        {contractorData.length > 0 && (
          <Button
            variant="outline"
            size="withIcon"
            onClick={handleOpenRegisterContractor}
          >
            <HardHat size={18} />
            <p>Add Contractor</p>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {contractorData.map(contractor => (
          <div
            key={contractor.id}
            className="flex cursor-pointer flex-col space-y-4 rounded-md bg-white p-4 dark:bg-card"
          >
            <div className="flex items-center space-x-4">
              {contractor.icon ? (
                <Image
                  src={`${baseServerUrl}/contractor/${contractor.icon}`}
                  alt={contractor.name}
                  height={48}
                  width={48}
                  className="size-12 object-contain"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                  <p className="text-medium text-white">
                    {contractor.name.substring(0, 1).toUpperCase()}
                  </p>
                </div>
              )}
              <div className="flex flex-col">
                <div className="truncate">
                  <p>{contractor.name}</p>
                </div>
                <div className="truncate text-sm text-gray-400">
                  {isNullOrEmpty(contractor.company) || 'No info'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
              <div className="truncate px-3 py-2">
                <p className="text-xs text-gray-400">Company</p>
                <p className="text-medium">
                  {isNullOrEmpty(contractor.company) || 'No info'}
                </p>
              </div>
              <div className="truncate px-3 py-2">
                <p className="text-xs text-gray-400">Contact</p>
                <p className="text-medium">
                  {isNullOrEmpty(contractor.contact) || 'No info'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {contractorData.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <HardHat />
          <div className="flex flex-col items-center justify-center">
            <p>No contractor registered yet.</p>
            <p>Time to register one?</p>
          </div>
          <Button variant="outline" onClick={handleOpenRegisterContractor}>
            <p>Register Contractor</p>
          </Button>
        </div>
      )}
      <RegisterContractor
        open={openRegisterConstructor}
        onClose={handleCloseRegisterContractor}
      />
    </div>
  );
}
