'use client';

import React, { Key, useEffect, useState } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import Overview from '@/components/client/dashboard/Overview';
import Calendar from '@/components/client/dashboard/Calendar';
import Report from '@/components/client/dashboard/Report';

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4 h-full">
      <Tabs
        radius="md"
        color="primary"
        aria-label="Tabs radius"
        onSelectionChange={(key: Key) => {
          setActiveComponent(key as string);
        }}
      >
        <Tab key="overview" title="Overview" />
        <Tab key="report" title="Report" />
        <Tab key="calendar" title="Calendar" />
      </Tabs>
      {activeComponent === 'overview' && (
        <div className="flex grow h-full">
          <Overview />
        </div>
      )}
      {activeComponent === 'report' && (
        <div className="flex-grow h-full">
          <Report />
        </div>
      )}
      {activeComponent === 'calendar' && (
        <div className="flex-grow h-full">
          <Calendar />
        </div>
      )}
    </div>
  );
}
