import React, { useEffect, useState } from 'react';

import { Card } from '@nextui-org/react';
import { defaults } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';

import { useTheme } from 'next-themes';
import { AssetStatus, MaintenanceCompleted } from '@/public/utils/dummy-data';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = 'start';

export default function OverviewGraph() {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex grow flex-col">
      <Card className="flex flex-1 p-4">
        <div className="flex flex-1">
          <div className="w-1/2 h-80">
            <Bar
              data={{
                labels: MaintenanceCompleted.map(data => data.label),
                datasets: [
                  {
                    label: 'Count',
                    data: MaintenanceCompleted.map(data => data.value),
                    backgroundColor: [
                      'rgba(43, 63, 229, 0.8)',
                      'rgba(250, 192, 19, 0.8)',
                      'rgba(253, 135, 135, 0.8)',
                    ],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: 'Maintenance Completed',
                    color: theme === 'dark' ? 'rgb(255,255,255)' : 'rgb(0,0,0)',
                  },
                  legend: {
                    labels: {
                      color:
                        theme === 'dark' ? 'rgb(255,255,255)' : 'rgb(0,0,0)',
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-1/2 h-80">
            <Doughnut
              data={{
                labels: AssetStatus.map(data => data.label),
                datasets: [
                  {
                    label: 'Count',
                    data: AssetStatus.map(data => data.value),
                    backgroundColor: [
                      'rgba(43, 63, 229, 0.8)',
                      'rgba(250, 192, 19, 0.8)',
                      'rgba(253, 135, 135, 0.8)',
                    ],
                    borderColor: [
                      'rgba(43, 63, 229, 0.8)',
                      'rgba(250, 192, 19, 0.8)',
                      'rgba(253, 135, 135, 0.8)',
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: 'Maintenance Status',
                    color: theme === 'dark' ? 'rgb(255,255,255)' : 'rgb(0,0,0)',
                  },
                  legend: {
                    labels: {
                      color:
                        theme === 'dark' ? 'rgb(255,255,255)' : 'rgb(0,0,0)',
                    },
                  },
                },
              }}
            />
          </div>
          {/* <Bar className="" data={chartData} /> */}
        </div>
      </Card>
    </div>
  );
}
