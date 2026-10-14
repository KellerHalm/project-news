import { connectDatabase } from '../config/database.js';
import { User } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

const name = process.env.ADMIN_NAME || 'Site Admin';
const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'Admin12345!';

await connectDatabase();
const existing = await User.findOne({ email });
if (existing) {
  console.log(`Admin already exists: ${email}`);
  process.exit(0);
}
await User.create({ name, email, passwordHash: await hashPassword(password), role: 'admin' });
console.log(`Admin created. Email: ${email}`);
console.log(`Admin password: ${password}`);
process.exit(0);
