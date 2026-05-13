import { PrismaClient, UserRole, AccountType, AccountStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!@#', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ebank.com' },
    update: {},
    create: {
      email: 'admin@ebank.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      role: UserRole.ADMIN,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('Demo123!@#', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@ebank.com' },
    update: {},
    create: {
      email: 'demo@ebank.com',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      phoneNumber: '+9876543210',
      dateOfBirth: new Date('1990-01-15'),
      address: '123 Main Street',
      city: 'New York',
      country: 'United States',
      postalCode: '10001',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create checking account for demo user
  const checkingAccount = await prisma.account.create({
    data: {
      accountNumber: '1000000001',
      accountType: AccountType.CHECKING,
      currency: 'USD',
      balance: 5000.00,
      availableBalance: 5000.00,
      status: AccountStatus.ACTIVE,
      userId: demoUser.id,
    },
  });

  console.log('✅ Created checking account:', checkingAccount.accountNumber);

  // Create savings account for demo user
  const savingsAccount = await prisma.account.create({
    data: {
      accountNumber: '2000000001',
      accountType: AccountType.SAVINGS,
      currency: 'USD',
      balance: 10000.00,
      availableBalance: 10000.00,
      status: AccountStatus.ACTIVE,
      interestRate: 2.5,
      userId: demoUser.id,
    },
  });

  console.log('✅ Created savings account:', savingsAccount.accountNumber);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin - Email: admin@ebank.com | Password: Admin123!@#');
  console.log('Demo  - Email: demo@ebank.com  | Password: Demo123!@#');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
