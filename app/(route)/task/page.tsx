import SignOutItem from '@/components/client/SignOutItem';
import { readUserInfo, fetchMaintenanceList } from '@/app/api/server-actions';
import Task from '@/components/client/Task';
import Navigation from '@/components/client/Navigation';

export default async function TaskPage() {
  const maintenanceList = await fetchMaintenanceList();
  console.log(maintenanceList);
  const userInfo = await readUserInfo();

  return (
    <div className="flex flex-col h-screen">
      <Navigation user={userInfo}>
        <SignOutItem />
      </Navigation>
      <Task maintenanceList={maintenanceList} />
    </div>
  );
}
