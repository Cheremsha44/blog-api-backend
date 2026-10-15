import { prisma } from '../src/lib/prisma.js';

await prisma.user.upsert({
  where: { email: 'admin@example.com' },
  update: {},
  create: { email: 'admin@example.com' },
});

await prisma.$disconnect();
