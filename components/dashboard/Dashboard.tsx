'use client';

import React, { Key, useEffect, useState } from 'react';

import { Tab, Tabs } from '@nextui-org/react';

import Overview from '@/components/dashboard/Overview';
import Calendar from '@/components/dashboard/Calendar';
import Report from '@/components/dashboard/Report';

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex grow flex-col space-y-4 h-full">
      <Tabs
        size="sm"
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
        <div className="flex flex-col grow h-full">
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
