import { useEffect, useState } from 'react';
import { useUserStore } from '@/hooks/use-user.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import DepartmentManagement from './_department';
import ContractorComponent from './_contractor';
import UserManagement from './user-management';
import Verify from './verify';
import Block from './block';
import KpiManagement from './kpi';
import General from './general';
import Finance from './_finance';

export default function UserTab() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { userList } = useUserStore();

  const [userData, setUserData] = useState(userList);

  useEffect(() => {
    setUserData(userList);
  }, [userList, setUserData]);

  const section = searchParams.get('section') ?? 'general';

  if (!userList || !userData) {
    router.push('/admin');

    return <Loader />;
  }

  switch (section) {
    case 'general':
      return <General />;

    case 'verify':
      return <Verify />;

    case 'user':
      return <UserManagement />;

    case 'block':
      return <Block />;

    case 'department':
      return <DepartmentManagement />;

    case 'contractor':
      return <ContractorComponent />;

    case 'kpi':
      return <KpiManagement />;

    case 'finance':
      return <Finance />;
  }
}
