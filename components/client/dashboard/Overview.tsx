import React, { useState } from 'react';
import { CategoryScale, Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Data } from '@/public/utils/dummy-data';

ChartJS.register(CategoryScale);

export default function Overview() {
  const [chartData, setChartData] = useState({
    labels: Data.map(data => data.year),
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    datasets: [
      {
        label: 'Maintenance Completed',
        data: Data.map(data => data.userGain),
        backgroundColor: ['#2a71d0', '#50AF95', '#f3ba2f'],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  });

  return (
    <div className="flex flex-col rounded-md p-4 bg-black">
      <div className="flex-1 h-600px">
        <Bar className="h-400px" data={chartData} />
      </div>
      <div className="flex-1">
        <p>Overview</p>
      </div>
    </div>
  );
}
