import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  let hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.upsert({
    where: { id: '-99' },
    update: {},
    create: {
      id: '-99',
      name: 'system',
      email: 'mishu@mail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.upsert({
    where: { id: '-98' },
    update: {},
    create: {
      id: '-98',
      name: 'Anis Zahidah',
      email: 'anis@mail.co',
      password: hashedPassword,
      role: 'SUPERVISOR',
    },
  });

  hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.upsert({
    where: { id: '-97' },
    update: {},
    create: {
      id: '-97',
      name: 'Harith Iqbal',
      email: 'harith@mail.co',
      password: hashedPassword,
      role: 'TECHNICIAN',
    },
  });

  await prisma.assetType.deleteMany({});
  await prisma.assetType.createMany({
    data: [
      {
        title: 'Instrument',
        description: 'Asset used by instrument department',
        createdBy: '-99',
        updatedBy: '-99',
      },
      {
        title: 'Machine',
        description: 'Machinery asset involving engine and motor',
        createdBy: '-99',
        updatedBy: '-99',
      },
      {
        title: 'General',
        description: 'General asset used by all department',
        createdBy: '-99',
        updatedBy: '-99',
      },
    ],
  });

  await prisma.assetStatus.deleteMany({});
  await prisma.assetStatus.createMany({
    data: [
      { id: '-1', title: 'Operating', color: '#58b368' },
      { id: '-2', title: 'Under Maintenance', color: '#dad873' },
      { id: '-3', title: 'Non-operating', color: '#f87979' },
    ],
  });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
