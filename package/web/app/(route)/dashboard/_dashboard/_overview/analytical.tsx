import { BarChart, DonutChart } from '@tremor/react';
import { valueFormatter } from '@/lib/function/valueFormatter';

const chartdata = [
  {
    name: 'Amphibians',
    'Number of threatened species': 2488,
  },
  {
    name: 'Birds',
    'Number of threatened species': 1445,
  },
  {
    name: 'Crustaceans',
    'Number of threatened species': 743,
  },
  {
    name: 'Ferns',
    'Number of threatened species': 281,
  },
  {
    name: 'Arachnids',
    'Number of threatened species': 251,
  },
  {
    name: 'Corals',
    'Number of threatened species': 232,
  },
  {
    name: 'Algae',
    'Number of threatened species': 98,
  },
];
const datahero = [
  {
    name: 'Noche Holding AG',
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
        <div className="h-80 w-1/2">
          <BarChart
            data={chartdata}
            index="name"
            categories={['Number of threatened species']}
            colors={['teal']}
            valueFormatter={valueFormatter}
            yAxisWidth={48}
            onValueChange={v => console.log(v)}
          />
        </div>
        <div className="h-80 w-1/2">
          <DonutChart
            data={datahero}
            variant="pie"
            valueFormatter={valueFormatter}
            onValueChange={v => console.log(v)}
          />
        </div>
      </div>
    </div>
  );
}
