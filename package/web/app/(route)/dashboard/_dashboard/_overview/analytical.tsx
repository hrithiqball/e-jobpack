import { BarChart, DonutChart } from '@tremor/react';
import { valueFormatter } from '@/lib/function/value-formatter';

const chartData = [
  {
    name: 'Jan',
    'Maintenance Count': 2488,
  },
  {
    name: 'Feb',
    'Maintenance Count': 1445,
  },
  {
    name: 'Mar',
    'Maintenance Count': 743,
  },
  {
    name: 'Apr',
    'Maintenance Count': 281,
  },
  {
    name: 'May',
    'Maintenance Count': 251,
  },
  {
    name: 'Jun',
    'Maintenance Count': 232,
  },
  {
    name: 'Jul',
    'Maintenance Count': 938,
  },
  {
    name: 'Aug',
    'Maintenance Count': 443,
  },
  {
    name: 'Sep',
    'Maintenance Count': 2443,
  },
  {
    name: 'Oct',
    'Maintenance Count': 1432,
  },
  {
    name: 'Nov',
    'Maintenance Count': 252,
  },
  {
    name: 'Dec',
    'Maintenance Count': 3232,
  },
];
const dataHero = [
  {
    name: 'Holding AG',
    value: 9800,
  },
  {
    name: 'Rain Drop AG',
    value: 4567,
  },
  {
    name: 'Push Rail AG',
    value: 3908,
  },
  {
    name: 'Flow Steal AG',
    value: 2400,
  },
  {
    name: 'Tiny Loop Inc.',
    value: 2174,
  },
  {
    name: 'Anton Resorts Holding',
    value: 1398,
  },
];

export default function GraphWidget() {
  return (
    <div className="flex grow flex-col">
      <div className="flex flex-1">
        <div className="h-80 w-2/3">
          <BarChart
            data={chartData}
            index="name"
            categories={['Maintenance Count']}
            colors={['teal']}
            valueFormatter={valueFormatter}
            yAxisWidth={72}
            onValueChange={v => console.log(v)}
          />
        </div>
        <div className="flex h-80 w-1/3">
          <div className="flex flex-1 items-center justify-center">
            <DonutChart
              data={dataHero}
              variant="pie"
              valueFormatter={valueFormatter}
              onValueChange={v => console.log(v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
