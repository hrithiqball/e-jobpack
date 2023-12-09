import Navigation from '@/components/client/Navigation';
import SignOutItem from '@/components/client/SignOutItem';
import Dashboard from '@/components/client/Dashboard';
import { readUserInfo } from '@/app/api/server-actions';

export default async function DashboardPage() {
  const userInfo = await readUserInfo();

  return (
    <div className="flex flex-col h-screen">
      <Navigation user={userInfo}>
        <SignOutItem />
      </Navigation>
      <Dashboard />
    </div>
  );
}
