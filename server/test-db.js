import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        id: 'test-user-13',
        email: 'test@test.com',
        name: 'Test User',
        image: ''
      }
    });
    console.log('User created:', user);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();