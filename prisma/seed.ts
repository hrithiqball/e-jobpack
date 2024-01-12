import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.createMany({
    data: [
      {
        id: '-99',
        name: 'system',
        email: 'mishu@mail.com',
        password: 'password',
        role: 'ADMIN',
      },
      {
        name: 'Anis Zahidah',
        email: 'anis@mail.co',
        password: hashedPassword,
        role: 'SUPERVISOR',
      },
      {
        name: 'Harith Iqbal',
        email: 'harith@mail.co',
        password: hashedPassword,
        role: 'TECHNICIAN',
      },
    ],
  });

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

  await prisma.assetStatus.createMany({
    data: [],
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
