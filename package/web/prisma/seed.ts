import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('password', 10);

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

  await prisma.assetType.deleteMany({});
  await prisma.assetType.create({
    data: {
      title: 'General',
      description: 'General asset used by all department',
      createdById: '-99',
      updatedById: '-99',
    },
  });

  await prisma.assetStatus.deleteMany({});
  await prisma.assetStatus.createMany({
    data: [
      { id: '-1', title: 'Operating', color: '#58b368' },
      { id: '-2', title: 'Under Maintenance', color: '#dad873' },
      { id: '-3', title: 'Non-operating', color: '#f87979' },
    ],
  });

  await prisma.departmentEnum.deleteMany({});
  await prisma.departmentEnum.create({
    data: {
      value: 'General',
    },
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
