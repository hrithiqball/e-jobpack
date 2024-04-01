import Image from 'next/image';
import dayjs from 'dayjs';

import { Tooltip } from '@nextui-org/react';
import {
  Construction,
  CopyCheck,
  MessageCircle,
  UserCheck,
} from 'lucide-react';

import { Maintenance } from '@/types/maintenance';
import { monthShort } from '@/lib/datetime';
import { useCurrentRole } from '@/hooks/use-current-role';
import { baseServerUrl } from '@/public/constant/url';

type MyTaskBoardHelperProps = {
  maintenance: Maintenance;
};

export default function MyTaskBoardHelper({
  maintenance,
}: MyTaskBoardHelperProps) {
  const role = useCurrentRole();

  let bgColor = 'bg-sky-500';
  let pulseColor = 'bg-sky-400';

  if (maintenance.deadline && dayjs().toDate() > maintenance.deadline) {
    bgColor = 'bg-red-500';
    pulseColor = 'bg-red-400';
  }

  if (maintenance.startDate && maintenance.startDate > dayjs().toDate()) {
    bgColor = 'bg-gray-500';
    pulseColor = 'bg-gray-400';
  }

  if (!role) return null;

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
                {monthShort[maintenance.deadline?.getMonth() ?? -1]}
              </span>
            </div>
            {maintenance.deadline && (
              <span className="absolute right-0 top-0 z-0 flex h-2 w-2 -translate-y-1 translate-x-1">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pulseColor} opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${bgColor}`}
                ></span>
              </span>
            )}
          </div>
        </div>
      );

    case 'REQUESTED':
      if (role === 'TECHNICIAN') return null;

      return (
        <div className="flex flex-1 justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <MessageCircle />
            </div>
            <span>{maintenance.id}</span>
          </div>
          <div>
            <Tooltip content={maintenance.requestedBy?.name}>
              {maintenance.requestedBy?.image ? (
                <Image
                  src={`${baseServerUrl}/user/${maintenance.requestedBy?.image}`}
                  alt={`${maintenance.requestedBy?.name}`}
                  width={32}
                  height={32}
                  className="size-8 rounded-full bg-teal-800 object-contain"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-teal-800">
                  <span className="text-xs text-white">
                    {maintenance.requestedBy?.name.slice(0, 3)}
                  </span>
                </div>
              )}
            </Tooltip>
          </div>
        </div>
      );

    case 'CLOSED':
      return (
        <div className="flex flex-1 justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-600 text-white">
              <CopyCheck />
            </div>
            <span className="text-ellipsis">{maintenance.id}</span>
          </div>
          <div className="relative">
            <div className="relative z-20 flex flex-col text-center">
              <span className="text-sm">{maintenance.deadline?.getDate()}</span>
              <span className="text-xs">
                {monthShort[maintenance.deadline?.getMonth() ?? -1]}
              </span>
            </div>
            {maintenance.deadline && (
              <span className="absolute right-0 top-0 z-0 flex h-2 w-2 -translate-y-1 translate-x-1">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pulseColor} opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${bgColor}`}
                ></span>
              </span>
            )}
          </div>
        </div>
      );

    case 'APPROVED':
      return (
        <div className="flex flex-1 justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <UserCheck />
            </div>
            <span className="text-ellipsis">{maintenance.id}</span>
          </div>
          <div className="relative">
            <div className="relative z-20 flex flex-col text-center">
              <span className="text-sm">
                {maintenance.approvedOn?.getDate()}
              </span>
              <span className="text-xs">
                {monthShort[maintenance.approvedOn?.getMonth() ?? -1]}
              </span>
            </div>
          </div>
        </div>
      );

    default:
      return <div className="">yes</div>;
  }
}
