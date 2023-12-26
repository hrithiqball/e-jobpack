import Navigation from '@/components/client/Navigation';
import Dashboard from '@/components/client/Dashboard';

export default async function DashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <Dashboard />
    </div>
  );
}
