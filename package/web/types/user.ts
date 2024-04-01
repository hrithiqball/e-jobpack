import { fetchUserList, fetchUser } from '@/data/user.action';

export type Users = Awaited<ReturnType<typeof fetchUserList>>;
export type User = Awaited<ReturnType<typeof fetchUser>>;
