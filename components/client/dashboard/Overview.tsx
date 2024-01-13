import React from 'react';
import { CategoryScale, Chart as ChartJS } from 'chart.js/auto';
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
        <div className="flex-1 bg-blue-500 p-4">Left Box 1</div>
        <div className="flex-1 bg-green-500 p-4">Left Box 2</div>
      </div>
      <div className="w-1/5 bg-red-500 p-4">Right Box</div>
    </div>
  );
}
