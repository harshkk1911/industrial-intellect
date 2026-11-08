import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const email = arg('email')?.trim().toLowerCase();
const password = arg('password');

if (!email || !password) {
  console.error('Usage: npm run seed:admin -- --email you@example.com --password "Strong-password"');
  process.exit(1);
}
if (password.length < 12) {
  console.error('Use a password with at least 12 characters.');
  process.exit(1);
}

try {
  await connectDB();
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('An admin with this email already exists. No changes made.');
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({ email, passwordHash, role: 'super_admin', name: 'Super Admin' });
    console.log(`Super Admin created: ${email}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
