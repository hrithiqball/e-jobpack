import { monthShort } from '@/lib/datetime';
import { Maintenance } from '@/types/maintenance';
import { Construction, MessageCircle } from 'lucide-react';
import Image from 'next/image';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type MyTaskBoardHelperProps = {
  maintenance: Maintenance;
};

export default function MyTaskBoardHelper({
  maintenance,
}: MyTaskBoardHelperProps) {
  let bgColor = 'bg-sky-500';
  let pulseColor = 'bg-sky-400';

  if (maintenance.deadline && maintenance.deadline > new Date()) {
    bgColor = 'bg-red-500';
    pulseColor = 'bg-red-400';
  }

  switch (maintenance.maintenanceStatus) {
    case 'OPENED':
      return (
        <div className="flex flex-1 justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-orange-600 text-white">
              <Construction />
            </div>
            <span>{maintenance.id}</span>
          </div>
          <div className="relative">
            <div className="relative z-20 flex flex-col text-center">
              <span className="text-sm">{maintenance.deadline?.getDate()}</span>
              <span className="text-xs">
                {monthShort[maintenance.deadline?.getMonth() ?? 0]}
              </span>
            </div>
            <span className="absolute right-0 top-0 z-0 flex h-2 w-2 -translate-y-1 translate-x-1">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pulseColor} opacity-75`}
              ></span>
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${bgColor}`}
              ></span>
            </span>
          </div>
        </div>
      );

    case 'REQUESTED':
      return (
        <div className="flex flex-1 justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <MessageCircle />
            </div>
            <span>{maintenance.id}</span>
          </div>
          {maintenance.requestedBy?.image ? (
            <Image
              src={`${baseServerUrl}/user/${maintenance.requestedBy?.image}`}
              alt={`${maintenance.requestedBy?.name}`}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">
              <span className="text-xs text-black">
                {maintenance.requestedBy?.name.slice(0, 3)}
              </span>
            </div>
          )}
        </div>
      );

    default:
      return <div className="">yes</div>;
  }
}
