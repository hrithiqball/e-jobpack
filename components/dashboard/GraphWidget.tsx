import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { defaults } from 'chart.js/auto';

import { useTheme } from 'next-themes';
import { Card } from '@nextui-org/react';

import { AssetStatus, MaintenanceCompleted } from '@/public/utils/dummy-data';
import { useMounted } from '@/hooks/use-mounted';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = 'start';

export default function GraphWidget() {
  const { theme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="flex grow flex-col">
      <Card shadow="none" className="flex flex-1 p-4">
        <div className="flex flex-1">
          <div className="h-80 w-1/2">
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
                    font: { size: 16, weight: 'normal' },
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
          <div className="h-80 w-1/2">
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
                    text: 'Asset Status',
                    font: { size: 16, weight: 'normal' },
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
        </div>
      </Card>
    </div>
  );
}
