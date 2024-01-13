import React from 'react';
import { CategoryScale, Chart as ChartJS } from 'chart.js/auto';
import RecentActivity from './RecentActivity';
import OverviewGraph from './OverviewGraph';
import MaintenanceRequestWidget from './MaintenanceRequestWidget';
// import { Bar } from 'react-chartjs-2';
// import { Data } from '@/public/utils/dummy-data';

ChartJS.register(CategoryScale);

export default function Overview() {
  // const [chartData, setChartData] = useState({
  //   labels: Data.map(data => data.year),
  //   backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //   datasets: [
  //     {
  //       label: 'Maintenance Completed',
  //       data: Data.map(data => data.userGain),
  //       backgroundColor: ['#2a71d0', '#50AF95', '#f3ba2f'],
  //       borderColor: 'black',
  //       borderWidth: 2,
  //     },
  //   ],
  // });

  return (
    <div className="flex grow h-full w-full">
      <div className="flex flex-col w-4/5">
        <div className="flex flex-1 p-2">
          <OverviewGraph />
        </div>
        <div className="flex flex-1 p-2">
          <MaintenanceRequestWidget />
        </div>
      </div>
      <div className="flex w-1/5 p-2">
        <RecentActivity />
      </div>
    </div>
  );
}
