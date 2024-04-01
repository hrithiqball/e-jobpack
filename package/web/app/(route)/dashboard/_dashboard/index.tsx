'use client';

import { Key, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tab, Tabs } from '@nextui-org/react';

import Overview from './_overview';
import Calendar from './_calendar';
import Report from './_report';
import { Histories } from '@/types/history';
import { useHistoryStore } from '@/hooks/use-history.store';

type DashboardProps = {
  histories: Histories;
};

export default function Dashboard({ histories }: DashboardProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { setHistories } = useHistoryStore();

  const tab = searchParams.get('tab') ?? 'overview';

  useEffect(() => {
    setHistories(histories);
  }, [histories, setHistories]);

  function handleTabChange(key: Key) {
    router.push(`${pathname}?tab=${key}`);
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Tabs
        color="primary"
        aria-label="Tabs for Dashboard components"
        variant="underlined"
        selectedKey={tab}
        onSelectionChange={handleTabChange}
      >
        <Tab key="overview" title="Overview" className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <Overview />
          </div>
        </Tab>
        <Tab key="report" title="Report" className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <Report />
          </div>
        </Tab>
        <Tab key="calendar" title="Calendar" className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <Calendar />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
