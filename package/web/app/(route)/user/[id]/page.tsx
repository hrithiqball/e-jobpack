import { fetchUser } from '@/app/(route)/user/_actions/user';
import { uploadUserImage } from '@/lib/actions/upload';

import UserAvatar from './UserAvatar';

type UserItemPage = {
  params: { id: string };
};

export default async function UserItemPage({ params }: UserItemPage) {
  const { id } = params;

  const uploadUserImageWithId = uploadUserImage.bind(null, id);
  const user = await fetchUser(id);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center">
        <form id="user-image-form" action={uploadUserImageWithId}>
          <label htmlFor="upload-photo">
            <UserAvatar user={user} />
          </label>
          <input
            type="file"
            name="file"
            id="upload-photo"
            accept=".png"
            className="hidden"
          />
        </form>
        <button form="user-image-form" type="submit">
          Upload
        </button>
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
