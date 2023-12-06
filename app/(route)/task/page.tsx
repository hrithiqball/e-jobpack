import SignOutItem from '@/components/client/SignOutItem';
import { readUserInfo, fetchMaintenanceList } from '@/utils/actions/route';
import Task from '@/components/client/Task';
import Navigation from '@/components/client/Navigation';

export default async function TaskPage() {
  const maintenanceListResult = await fetchMaintenanceList();
  const maintenanceListData = maintenanceListResult.data ?? [];

  const userInfo = await readUserInfo();

  return (
    <div className="flex flex-col h-screen">
      <Navigation user={userInfo}>
        <SignOutItem />
      </Navigation>
      <Task maintenanceList={maintenanceListData} />
    </div>
  );
}
