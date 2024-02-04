'use client';

import { Key } from 'react';

import { Tab, Tabs } from '@nextui-org/react';

import Overview from '@/components/dashboard/Overview';
import Calendar from '@/components/dashboard/Calendar';
import Report from '@/components/dashboard/Report';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tab = searchParams.get('tab') ?? 'overview';

  function handleTabChange(key: Key) {
    router.push(`${pathname}?tab=${key}`);
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Tabs
        size="sm"
        radius="md"
        color="primary"
        aria-label="Tabs for Dashboard components"
        selectedKey={tab}
        onSelectionChange={handleTabChange}
      >
        <Tab key="overview" title="Overview" className="flex flex-col flex-1">
          <div className="flex flex-col flex-1">
            <Overview />
          </div>
        </Tab>
        <Tab key="report" title="Report" className="flex flex-col flex-1">
          <div className="flex flex-col flex-1">
            <Report />
          </div>
        </Tab>
        <Tab key="calendar" title="Calendar" className="flex flex-col flex-1">
          <div className="flex flex-col flex-1">
            <Calendar />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
