import React, { useState } from "react";
import { CategoryScale, Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const Data = [
	{
		id: 1,
		year: 2016,
		userGain: 80000,
		userLost: 823,
	},
	{
		id: 2,
		year: 2017,
		userGain: 45677,
		userLost: 345,
	},
	{
		id: 3,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 4,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 5,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
	{
		id: 6,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 7,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 8,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
	{
		id: 9,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 10,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 11,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
	{
		id: 12,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 13,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 14,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
	{
		id: 15,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 16,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 17,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
	{
		id: 18,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 19,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 20,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
	{
		id: 21,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 22,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 23,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
	{
		id: 24,
		year: 2018,
		userGain: 78888,
		userLost: 555,
	},
	{
		id: 25,
		year: 2019,
		userGain: 90000,
		userLost: 4555,
	},
	{
		id: 26,
		year: 2020,
		userGain: 4300,
		userLost: 234,
	},
];

ChartJS.register(CategoryScale);

const Overview = () => {
	const [chartData, setChartData] = useState({
		labels: Data.map((data) => data.year),
		backgroundColor: "rgba(255, 99, 132, 0.2)",
		datasets: [
			{
				label: "Maintenance Completed",
				data: Data.map((data) => data.userGain),
				backgroundColor: ["#2a71d0", "#50AF95", "#f3ba2f"],
				borderColor: "black",
				borderWidth: 2,
			},
		],
	});

	return (
		<div className="flex flex-col rounded-md p-4 bg-black">
			<div className="flex-1">
				<Bar className="h-full" data={chartData} />
			</div>
			<div className="flex-1">
				<p>Overview</p>
			</div>
		</div>
	);
};

export default Overview;
