require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./modules/auth/user.model');
const connectDB = require('./config/db');

const seedUsers = [
  { name: 'Super Admin', email: 'superadmin@kohsha.com', password: 'Admin@123', phone: '9999999999', role: 'SUPER_ADMIN' },
  { name: 'Academy Admin', email: 'admin@kohsha.com', password: 'Admin@123', phone: '9888888888', role: 'ADMIN' },
  { name: 'Priya Sharma', email: 'teacher@kohsha.com', password: 'Teacher@123', phone: '9777777777', role: 'TEACHER', assignedClasses: [{ className: 'Nursery', section: 'A' }, { className: 'LKG', section: 'A' }] },
  { name: 'Rajesh Kumar', email: 'parent@kohsha.com', password: 'Parent@123', phone: '9666666666', role: 'PARENT' },
];

const seed = async () => {
  await connectDB();

  const created = [];

  for (const userData of seedUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      // Reset password for existing user
      existing.password = userData.password;
      existing.isActive = true;
      await existing.save();
      created.push({ ...userData, status: 'RESET' });
    } else {
      await User.create(userData);
      created.push({ ...userData, status: 'CREATED' });
    }
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║            KOHSHA ACADEMY - SEED CREDENTIALS            ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  for (const u of created) {
    console.log(`║  [${u.status.padEnd(7)}] ${u.role.padEnd(12)} ║`);
    console.log(`║    Email:    ${u.email.padEnd(40)} ║`);
    console.log(`║    Password: ${u.password.padEnd(40)} ║`);
    console.log('╠══════════════════════════════════════════════════════════╣');
  }
  console.log('║              Seed completed successfully!                ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
