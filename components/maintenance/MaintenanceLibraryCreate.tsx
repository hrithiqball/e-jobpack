import { useRouter } from 'next/navigation';

export default function MaintenanceLibraryCreate() {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => router.push('/maintenance?tab=library&create=false')}
      >
        back
      </button>
      MaintenanceLibraryCreate
    </div>
  );
}
