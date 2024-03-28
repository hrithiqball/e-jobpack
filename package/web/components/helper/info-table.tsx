import MaintenanceStatusHelper from '@/components/helper/MaintenanceStatusHelper';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { baseServerUrl } from '@/public/constant/url';
import { User, Users } from '@/types/user';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Loader } from '../ui/loader';

export default function InfoTable() {
  const { maintenance } = useMaintenanceStore();

  if (!maintenance) return null;

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">Status</TableCell>
          <TableCell>
            <MaintenanceStatusHelper
              maintenanceStatus={maintenance.maintenanceStatus}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Start Date</TableCell>
          <TableCell>
            {dayjs(maintenance.startDate).format('DD/MM/YYYY')}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Deadline</TableCell>
          <TableCell>
            {maintenance.deadline
              ? dayjs(maintenance.deadline).format('DD/MM/YYYY')
              : 'Not Specified'}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Person In Charge</TableCell>
          <TableCell>
            {maintenance.approvedBy ? (
              <PersonInCharge personInCharge={maintenance.approvedBy} />
            ) : (
              'Not Specified'
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Maintenance Members</TableCell>
          <TableCell>
            {maintenance.maintenanceMember.length > 0 ? (
              <MaintenanceMember
                members={maintenance.maintenanceMember.map(u => u.user)}
              />
            ) : (
              <div className="">No team member chosen</div>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function PersonInCharge({ personInCharge }: { personInCharge: User }) {
  if (!personInCharge) return <Loader />;

  return (
    <div className="flex items-center space-x-2">
      {personInCharge.image ? (
        <Image
          src={`${baseServerUrl}/user/${personInCharge.image}`}
          alt={personInCharge.name}
          width={20}
          height={20}
          className="size-5 rounded-full bg-teal-950 object-contain"
        />
      ) : (
        <div className="size-5 rounded-full">
          <span>{personInCharge.name.substring(0, 3)}</span>
        </div>
      )}
      <p>{personInCharge.name}</p>
    </div>
  );
}

function MaintenanceMember({ members }: { members: Users }) {
  return (
    <div className="flex items-center -space-x-3 overflow-hidden">
      {members.map(member => (
        <div key={member.id} className="size-5">
          {member.image ? (
            <Image
              src={`${baseServerUrl}/user/${member.image}`}
              alt={member.name}
              width={20}
              height={20}
            />
          ) : (
            <div className="flex size-5 items-center justify-center rounded-full bg-gray-400">
              <p className="text-xs">{member.name.substring(0, 1)}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
