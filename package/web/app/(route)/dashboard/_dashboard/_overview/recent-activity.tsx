import { Activity, Package, User, Wrench } from 'lucide-react';
import { useHistoryStore } from '@/hooks/use-history.store';
import { Loader } from '@/components/ui/loader';
import { Histories } from '@/types/history';

export default function RecentActivity() {
  const { histories } = useHistoryStore();

  if (!histories) return <Loader />;

  return (
    <div className="flex grow flex-col space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Activity />
          <span className="font-bold">Recent Activity</span>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col divide-y-2">
          {histories.map(history => (
            <div key={history.id} className="flex items-center space-x-4 py-2">
              <div className="">
                <HistoryMetaIcon history={history} />
              </div>
              <p className="text-sm">
                {history.user.name} {history.activity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryMetaIcon({ history }: { history: Histories[0] }) {
  switch (history.historyMeta) {
    case 'ASSET':
      return <Package size={18} />;
    case 'USER':
      return <User size={18} />;
    case 'MAINTENANCE':
      return <Wrench size={18} />;
  }
}
